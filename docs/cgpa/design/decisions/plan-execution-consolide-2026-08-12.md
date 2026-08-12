# Plan d'Exécution Consolidé — Clôture des dettes et réserves ouvertes

| Champ | Valeur |
|---|---|
| Date | 2026-08-12 |
| Auteur | CDO / Enterprise Architect (instruction Jo_Skynet, consolidée de 3 analyses indépendantes) |
| Points totaux | 17 → 13 après Lot 0 (4 clôtures documentaires) |
| Statut | **En exécution — Lot 0 terminé, Lot 1 en attente de merge** |

---

## Résumé des 6 lots

| Lot | Priorité | Points | Effort | Statut |
|---|---|---|---|---|
| **Lot 0** | Immédiat | 4 (RSV-S9-03, OBS-S10-01, DD-EP17-10, DD-EP17-11) | 0,5 j | ✅ **Terminé** — PR #454 |
| **Lot 1** | **P0** | DD-EP17-14 (SMTP Keycloak + anti-énumération) | 2-4 j | 🔄 PR #455 en attente de merge |
| **Lot 2** | P1 | DD-EP17-12 (écran invitation) + DD-EP17-02 (états 403/404) | 3-5 j | 📋 Planifié |
| **Lot 3** | P1 | DD-611-03 (traçabilité) + DD-611-01 (UXR) + DD-EP17-05 (modal) | 2-3 j | 📋 Planifié |
| **Lot 4** | P1 | RSV-DMARC-02 (DMARC progressif) + RSV-EMAIL-NOREPLY-01-UNIDIR (Gate Prod) | 1-2 j + 60-90 j | 📋 Planifié |
| **Lot 5** | P2 | 5 dettes Design (uniformisation visuelle) | 3-5 j | 📋 Planifié |

---

## Séquence d'exécution

```
Lot 0 ✅ → Lot 1 🔄 → Lot 2 → Lot 3
                 ↘ Lot 4 (démarre maintenant, s'étale sur 60-90 j)
                 ↘ Lot 5 (après Lot 2)
```

---

## Détail par lot

### Lot 0 — Clôtures documentaires ✅

| Point | Action | Résultat |
|---|---|---|
| OBS-S10-01 | Vérification état réel | **Déjà CLOSE** — arbitrage PO du 2026-07-05 |
| RSV-S9-03 | Vérification état réel | **Contrainte permanente acceptée** — pas une réserve à corriger |
| DD-EP17-10 | Vérification équivalence ARIA | `role="alert"` natif à `lt-data-table` — équivalent accepté |
| DD-EP17-11 | Vérification code source | `min-height: 44px` déjà présent dans `_button.scss` |

**PR** : #454 (`docs/cloture-dettes-lot0`)

### Lot 1 — Correctif sécurité P0 🔄

**DD-EP17-14** : Flux mot de passe oublié HTTP 500 + canal d'énumération de comptes.

**Solution** : Script `configure-smtp-staging.sh` (SMTP Resend, STARTTLS port 587), service `keycloak-smtp-init` dans `docker-compose.staging.yml`.

**PR** : #455 (`fix/smtp-keycloak-dd-ep17-14`)

**Prochaine étape** : Merge PR #455 → renseigner `KC_SMTP_PASSWORD` sur Staging → déploiement → test anti-énumération → Gate Production.

### Lot 2 — Parcours utilisateur critique 📋

- **DD-EP17-12** : `InvitationAcceptationComponent` (route publique `/invitations/:token`)
- **DD-EP17-02** : `ForbiddenComponent` + `NotFoundComponent` + `HttpErrorInterceptor`

**Plan** : `plan-execution-lot2-parcours-utilisateur-critique.md`

### Lot 3 — Traçabilité, UXR et Modal 📋

- **DD-611-03** : Script de génération de rapport de traçabilité
- **DD-611-01** : Revue UX/UI de UXR-001
- **DD-EP17-05** : Câblage `lt-toast` au premier appelant modal

**Plan** : `plan-execution-lot3-tracabilite-uxr-modal.md`

### Lot 4 — DMARC progressif + Gate Production noreply 📋

- **RSV-DMARC-02** : Progression `p=none` → `quarantine` → `reject` sur 60-90 jours
- **RSV-EMAIL-NOREPLY-01-UNIDIR** : Gate Production (vérification + test envoi)

**Plan** : `plan-execution-lot4-dmarc-noreply-gate-prod.md`

### Lot 5 — Uniformisation visuelle 📋

- **DD-EP17-04** : Finaliser adoption `lt-data-table` (2 composants restants)
- **DD-EP17-06** : Adopter tokens de spacing
- **DD-EP17-07** : Ajouter `data-testid`
- **DD-EP17-09** : Harmoniser `VerifyReceiptComponent`
- **DD-EP17-11** : Vérifier touch targets (déjà `min-height: 44px`)

**Plan** : `plan-execution-lot5-uniformisation-visuelle.md`

---

## Points de décision en attente

| Décision | Responsable | Urgence |
|---|---|---|
| Merge PR #455 (Lot 1) | PO/CDO | P0 — défaut de Production actif |
| Validation plan Lot 2 | PO/CDO | P1 |
| Validation plan Lot 3 | PO/CDO | P1 |
| Validation plan Lot 4 | PO/CDO | P1 |
| Validation plan Lot 5 | PO/CDO | P2 |
| `KC_SMTP_PASSWORD` sur hôte Staging | DevSecOps Lead | P0 — bloque le déploiement Lot 1 |
