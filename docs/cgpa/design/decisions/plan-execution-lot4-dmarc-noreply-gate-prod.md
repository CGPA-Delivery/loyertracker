# Plan d'Exécution — Lot 4 : DMARC progressif + Gate Production noreply

| Champ | Valeur |
|---|---|
| Date | 2026-08-12 |
| Auteur | CDO / Enterprise Architect |
| Réserves | RSV-DMARC-02 (durcissement DMARC), RSV-EMAIL-NOREPLY-01-UNIDIR (unidirectionnalité permanente) |
| Criticité | P1 |
| Statut | **Plan proposé — en attente de validation PO/CDO** |

---

## 1. Contexte

### RSV-DMARC-02 — Politique DMARC en observation

Politique actuelle : `v=DMARC1; p=none; rua=mailto:dmarc@loyertracker.org;`. La réception `rua=` fonctionne via SES inbound → S3 `loyertracker-inbound-mail/dmarc/`. Le domaine a été créé le 2026-08-10 — aucun rapport DMARC réel reçu à ce jour (normal).

### RSV-EMAIL-NOREPLY-01-UNIDIR — Unidirectionnalité permanente

`noreply@loyertracker.org` est une adresse d'envoi uniquement, sans boîte de réception. Contrainte acceptée comme permanente. Le déploiement Staging est OK, le Gate Production reste à exécuter.

---

## 2. Solution proposée

### 2.1 RSV-DMARC-02 — Progression graduelle

| Phase | Action | Déclencheur | Durée |
|---|---|---|---|
| **Phase 0** (actuelle) | `p=none`, surveillance hebdo via cron `013a04684e76` | — | En cours |
| **Phase 1** | Premier rapport DMARC réel reçu → analyse SPF/DKIM/alignement | Premier rapport XML dans S3 | J0 |
| **Phase 2** | 30 jours propres → Gate DNS `p=quarantine; pct=25` | J0+30j sans échec | J+30 |
| **Phase 3** | 14 jours propres → `pct=50` | J+44 | J+44 |
| **Phase 4** | 14 jours propres → `pct=100` | J+58 | J+58 |
| **Phase 5** | 30 jours propres → `p=reject` | J+88 | J+88 |

**Surveillance** : cron hebdo existant (`013a04684e76`, lundi 9h) — vérifier le bucket S3, analyser les rapports XML, produire un résumé.

### 2.2 RSV-EMAIL-NOREPLY-01-UNIDIR — Gate Production

| Étape | Action |
|---|---|
| 1 | Vérifier que `RESEND_FROM_EMAIL=noreply@loyertracker.org` est en Production |
| 2 | Vérifier que `RESEND_EMAIL_ENABLED=true` est en Production |
| 3 | Test d'envoi réel depuis Production (email de test) |
| 4 | Vérifier DKIM/SPF/DMARC sur l'email reçu |
| 5 | Gate Production documenté → clôture de la réserve |

---

## 3. Tâches

| # | Tâche | Effort |
|---|---|---|
| 1 | Vérifier le cron DMARC hebdo (actif, fonctionnel) | 0,1 j |
| 2 | Script d'analyse DMARC (décompression XML, extraction SPF/DKIM) | 0,5 j |
| 3 | Gate Production noreply (vérification + test envoi) | 0,3 j |
| 4 | Documenter la procédure de progression DMARC | 0,2 j |
| 5 | Mise à jour project-state.md (RSV-DMARC-02 → En surveillance, RSV-EMAIL-NOREPLY-01-UNIDIR → Close après Gate) | 0,1 j |

**Total estimé** : 1-2 jours (hors phases de progression DMARC qui s'étalent sur 60-90 jours).

---

## 4. Calendrier

- **J0** : Premier rapport DMARC réel (estimé 2026-08-17)
- **J+30** : `p=quarantine; pct=25` (estimé 2026-09-16)
- **J+88** : `p=reject` (estimé 2026-11-13)

---

## 5. Décision

**GO proposé** — sous réserve de validation PO/CDO. La progression DMARC est conditionnée à la réception de rapports réels et à l'absence d'échec SPF/DKIM sur le trafic légitime.
