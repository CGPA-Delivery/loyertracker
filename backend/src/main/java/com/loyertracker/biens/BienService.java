package com.loyertracker.biens;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.loyertracker.baux.BailRepository;
import com.loyertracker.baux.StatutBail;
import com.loyertracker.patrimoine.PatrimoineRepository;
import com.loyertracker.patrimoine.TypeBien;
import com.loyertracker.patrimoine.TypeBienRepository;
import com.loyertracker.securite.TenantContext;

import jakarta.persistence.EntityManager;

@Service
public class BienService {

    private static final String MESSAGE_BIEN_SOUS_BAIL =
            "Un bien sous bail actif ne peut être ni mis en travaux ni archivé : clôturez d'abord le bail.";

    private final BienRepository biens;
    private final PatrimoineRepository patrimoines;
    private final TypeBienRepository typesBiens;
    private final TenantContext tenant;
    private final EntityManager em;
    private final BailRepository baux;
    /** Lot 1 : statut {@code LOUE} / {@code LIBRE} déduit des baux (retour arrière : {@code false}). */
    private final boolean statutDerive;

    public BienService(BienRepository biens, PatrimoineRepository patrimoines,
            TypeBienRepository typesBiens, TenantContext tenant, EntityManager em,
            BailRepository baux,
            @Value("${app.biens.statut-derive.enabled:true}") boolean statutDerive) {
        this.baux = baux;
        this.statutDerive = statutDerive;
        this.biens = biens;
        this.patrimoines = patrimoines;
        this.typesBiens = typesBiens;
        this.tenant = tenant;
        this.em = em;
    }

    @Transactional(readOnly = true)
    public List<BienDto> lister(Authentication authentication) {
        Jwt jwt = principalJwt(authentication);
        if (aRole(authentication, "ROLE_BAILLEUR")) {
            UUID bailleurId = tenant.activerDepuisKeycloak(jwt.getSubject());
            return biens.findByBailleurIdOrderByAdresseAsc(bailleurId).stream()
                    .map(BienDto::from)
                    .toList();
        }
        if (aRole(authentication, "ROLE_GESTIONNAIRE")) {
            return listerBiensGestionnaire(jwt.getSubject());
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }

    @Transactional
    public BienDto creer(Jwt jwt, BienRequest requete) {
        UUID bailleurId = tenant.activerDepuisKeycloak(jwt.getSubject());
        validerPatrimoine(requete.patrimoineId());
        validerType(requete.type());
        Bien bien = new Bien(UUID.randomUUID(), bailleurId, requete.adresse(), requete.type(),
                statutInitial(requete.statut()), requete.patrimoineId());
        return BienDto.from(biens.saveAndFlush(bien));
    }

    @Transactional
    public BienDto modifier(UUID id, Jwt jwt, BienRequest requete) {
        tenant.activerDepuisKeycloak(jwt.getSubject());
        validerPatrimoine(requete.patrimoineId());
        validerType(requete.type());
        Bien bien = biens.findWithLockById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Bien introuvable."));
        bien.modifier(requete.adresse(), requete.type(), statutAutorise(id, requete.statut()),
                requete.patrimoineId());
        return BienDto.from(bien);
    }

    private void validerPatrimoine(UUID patrimoineId) {
        if (!patrimoines.existsById(patrimoineId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patrimoine introuvable.");
        }
    }

    private void validerType(String type) {
        TypeBien typeBien = typesBiens.findById(type)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Type de bien invalide."));
        if (!typeBien.isActif()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Type de bien invalide.");
        }
    }

    @Transactional
    public BienDto archiver(UUID id, Jwt jwt) {
        tenant.activerDepuisKeycloak(jwt.getSubject());
        Bien bien = biens.findWithLockById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Bien introuvable."));
        if (statutDerive && baux.existsByBienIdAndStatut(id, StatutBail.ACTIF)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, MESSAGE_BIEN_SOUS_BAIL);
        }
        bien.archiver();
        return BienDto.from(bien);
    }

    /**
     * Statut d'un bien à sa création. {@code LOUE} et {@code LIBRE} sont déduits des baux : un
     * bien neuf n'a pas de bail, il est donc {@code LIBRE} quelle que soit la valeur reçue.
     */
    private StatutBien statutInitial(StatutBien demande) {
        if (!statutDerive || demande == StatutBien.EN_TRAVAUX || demande == StatutBien.ARCHIVE) {
            return demande;
        }
        return StatutBien.LIBRE;
    }

    /**
     * Statut retenu lors d'une modification. {@code LOUE} / {@code LIBRE} reçus sont ignorés et
     * remplacés par la valeur déduite des baux ; {@code EN_TRAVAUX} et {@code ARCHIVE} restent des
     * états manuels, refusés (409) tant qu'un bail est actif.
     */
    private StatutBien statutAutorise(UUID bienId, StatutBien demande) {
        if (!statutDerive) {
            return demande;
        }
        boolean sousBail = baux.existsByBienIdAndStatut(bienId, StatutBail.ACTIF);
        if (demande == StatutBien.EN_TRAVAUX || demande == StatutBien.ARCHIVE) {
            if (sousBail) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, MESSAGE_BIEN_SOUS_BAIL);
            }
            return demande;
        }
        return sousBail ? StatutBien.LOUE : StatutBien.LIBRE;
    }

    @SuppressWarnings("unchecked")
    private List<BienDto> listerBiensGestionnaire(String keycloakId) {
        List<Object[]> lignes = em.createNativeQuery(
                        "SELECT id, adresse, type, statut, patrimoine_id FROM biens_affectes_gestionnaire(:keycloakId)")
                .setParameter("keycloakId", keycloakId)
                .getResultList();
        return lignes.stream()
                .map(l -> new BienDto((UUID) l[0], (String) l[1], (String) l[2], (String) l[3], (UUID) l[4]))
                .toList();
    }

    private static Jwt principalJwt(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return jwt;
    }

    private static boolean aRole(Authentication authentication, String role) {
        return authentication.getAuthorities().stream()
                .anyMatch(autorite -> role.equals(autorite.getAuthority()));
    }
}
