package com.loyertracker.biens;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Bien locatif rattaché à un bailleur, isolé par RLS sur {@code bailleur_id}. */
@Entity
@Table(name = "bien")
public class Bien {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "bailleur_id", nullable = false, updatable = false)
    private UUID bailleurId;

    @Column(nullable = false)
    private String adresse;

    @Column(nullable = false)
    private String type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutBien statut;

    @Column(name = "patrimoine_id", nullable = false)
    private UUID patrimoineId;

    protected Bien() {
        // requis par JPA
    }

    public Bien(UUID id, UUID bailleurId, String adresse, String type, StatutBien statut,
            UUID patrimoineId) {
        this.id = id;
        this.bailleurId = bailleurId;
        this.adresse = adresse;
        this.type = type;
        this.statut = statut;
        this.patrimoineId = patrimoineId;
    }

    public void modifier(String adresse, String type, StatutBien statut, UUID patrimoineId) {
        this.adresse = adresse;
        this.type = type;
        this.statut = statut;
        this.patrimoineId = patrimoineId;
    }

    public void archiver() {
        this.statut = StatutBien.ARCHIVE;
    }

    /**
     * Le bien passe {@code LOUE} à la création ou à la réouverture d'un bail. Un bien déjà
     * {@code LOUE} reste inchangé (donnée historique laissée {@code LOUE} par une clôture
     * antérieure au lot 1) ; {@code EN_TRAVAUX} et {@code ARCHIVE} sont des états manuels qu'un
     * bail n'écrase jamais.
     */
    public void louer() {
        if (this.statut == StatutBien.EN_TRAVAUX || this.statut == StatutBien.ARCHIVE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Un bien en travaux ou archivé ne peut pas être loué.");
        }
        this.statut = StatutBien.LOUE;
    }

    /**
     * Le bien redevient {@code LIBRE} quand son dernier bail actif prend fin. Sans effet sur les
     * états manuels ({@code EN_TRAVAUX}, {@code ARCHIVE}), qui ne dépendent pas des baux.
     */
    public void liberer() {
        if (this.statut == StatutBien.LOUE) {
            this.statut = StatutBien.LIBRE;
        }
    }

    public UUID getId() {
        return id;
    }

    public UUID getBailleurId() {
        return bailleurId;
    }

    public String getAdresse() {
        return adresse;
    }

    public String getType() {
        return type;
    }

    public StatutBien getStatut() {
        return statut;
    }

    public UUID getPatrimoineId() {
        return patrimoineId;
    }
}
