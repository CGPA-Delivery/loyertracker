# Plan d'Exécution — Clôture des dettes et réserves ouvertes

| Champ | Valeur |
|---|---|
| Date | 2026-08-12 |
| Auteur | CDO / Enterprise Architect (instruction Jo_Skynet, consolidée de 3 analyses spécialisées indépendantes) |
| Statut | **Proposé — en attente de validation PO/CDO** |
| Points analysés | 17 (13 dettes Design + 2 réserves EP-18 + 2 réserves historiques) |
| Points déjà clos | 1 (OBS-S10-01 — arbitrage 2026-07-05) |
| Points à clôturer | 16 |

---

## 1. État des lieux consolidé

### 1.1 Corrections par rapport à l'analyse initiale

| Point | Analyse initiale | État réel (vérifié par sous-agents) |
|---|---|---|
| OBS-S10-01 | « Reste ouverte » | **CLOSE** — arbitrage PO du 2026-07-05 (`arbitrage-obs-s10-01.md`), acceptée en l'état |
| RSV-S9-03 | « Réserve ouverte » | **Contrainte permanente acceptée** — pas une réserve à corriger, mais un risque documenté |
| DD-EP17-11 | « Touch targets < 44px » | Code source actuel contient déjà `min-height: 44px` dans `_button.scss` — preuve navigateur + mise à jour registre suffisent |

### 1.2 Tableau complet des 16 points à traiter

| ID | Constat | Criticité | Statut actuel | Action recommandée | Effort |
|---|---|---|---|---|---|
| **DD-EP17-14** | Mot de passe oublié HTTP 500 + énumération comptes | **P0** | Ouvert, priorité propre | Config SMTP Keycloak, anti-énumération, Gate Production | M/L |
| **DD-EP17-12** | Pas d'interface Angular acceptation invitation | **P1** | Ouvert | Écran Angular + route `/invitations/:token` | M |
| **DD-611-03** | Traçabilité Story-écran-composant-test incomplète | **P1** | En traitement | Lot C documentaire : matrice complète | M |
| **DD-EP17-02** | Pas d'état 403/404 uniforme | **P1** | Ouvert | `lt-error-state` + routes + intercepteur | M |
| **DD-611-01** | UXR-001 non renseigné | **P1** | Préparé | Revue UX humaine + rattachement lot | S |
| **DD-EP17-05** | Focus-trap modal sans usage Production | **P1** | Partiellement traité | Premier appelant métier + test a11y complet | S/M |
| **RSV-EMAIL-NOREPLY-01-UNIDIR** | Unidirectionnalité + Gate Production requis | **P1** | Partiellement levée | Gate Production + pied de page + contrainte acceptée | S/M |
| **RSV-DMARC-02** | DMARC p=none, durcissement après rapports | **P1** | Ouvert | Surveillance cron → 30j propres → Gate DNS | M (étalé) |
| **DD-611-04** | Régression visuelle non industrialisée | **P2** | En traitement | Accepter baseline T0 ou industrialiser pixel-diff | M |
| **DD-EP17-04** | Hétérogénéité composants .panel/.list | **P2** | Partiellement traité | Migration écran par écran (Alertes, Audit, Gestionnaire) | M |
| **DD-EP17-06** | Spacing non normalisé | **P2** | Partiellement traité | Adoption tokens par écran + règle lint | M |
| **DD-EP17-09** | VerifyReceiptComponent hors breakpoint/radius | **P2** | Ouvert | Harmoniser ou documenter exception « document certifié » | S |
| **DD-EP17-10** | État d'erreur chargement listes | **P2** | Partiellement traité | Revue Design Architect → accepter équivalence ARIA → close | XS |
| **DD-EP17-11** | Touch targets button < 44px | **P2** | Ouvert (probablement corrigé) | Mesure navigateur → preuve → close | XS |
| **DD-EP17-07** | Aucun data-testid | **P2** | Ouvert | Convention + application aux parcours E2E critiques | S |
| **RSV-S9-03** | Rollback V20 impossible sans restore DB | **P2** | Contrainte permanente | Reclasser comme risque accepté (pas réserve active) | XS |

---

## 2. Lots d'exécution proposés

### Lot 0 — Clôtures documentaires immédiates (0,5 j)

Actions purement documentaires, sans code, sans déploiement :

| ID | Action | Preuve |
|---|---|---|
| RSV-S9-03 | Reclasser de « réserve active » → « risque permanent accepté » dans le registre | Décision PO 2026-07-03, backup vérifié |
| OBS-S10-01 | Synchroniser : déjà CLOSE, supprimer des listes « ouvertes » | `arbitrage-obs-s10-01.md` |
| DD-EP17-10 | Revue Design Architect : accepter `role="alert"` comme équivalent → close | Preuves navigateur existantes |
| DD-EP17-11 | Mesure navigateur réelle → si ≥44px, close avec preuve | `_button.scss` contient déjà `min-height: 44px` |

**Livrable** : 1 PR documentaire, 4 entrées mises à jour dans le Design Debt Register.

---

### Lot 1 — Correctif sécurité Production (P0, 2-4 j)

**DD-EP17-14** : défaut Production actif + canal d'énumération de comptes.

| Étape | Action |
|---|---|
| 1.1 | Décision PO : fournisseur SMTP pour Keycloak (Resend, SES, autre) |
| 1.2 | Config SMTP Keycloak via secrets (pas dans le dépôt) |
| 1.3 | Test Staging : Mailpit → envoi réel → compte existant/inexistant → HTTP 200 uniforme |
| 1.4 | Gate Staging distinct |
| 1.5 | Gate Production distinct |
| 1.6 | Vérification Production : reset mot de passe fonctionnel, anti-énumération restauré |

**Livrable** : 1 PR infrastructure, runbook SMTP Keycloak, preuve anti-énumération.

---

### Lot 2 — Parcours utilisateur critique (P1, 3-5 j)

**DD-EP17-12** + **DD-EP17-02** : deux parcours Frontend manquants.

| Étape | Action |
|---|---|
| 2.1 | Plan Frontend approuvé (Gate 02A/04A) |
| 2.2 | `DD-EP17-12` : route `invitations/:token`, composant formulaire, états succès/409/404/400 |
| 2.3 | `DD-EP17-02` : `ForbiddenComponent` + `NotFoundComponent`, routes 403/404, intercepteur HTTP |
| 2.4 | Tests : routes, composants, intégration, smoke utilisateur |
| 2.5 | Gate Staging → recette → Gate Production |

**Livrable** : 1 PR Frontend, 2 dettes closes.

---

### Lot 3 — Gouvernance et traçabilité (P1, 2-3 j)

**DD-611-03** + **DD-611-01** + **DD-EP17-05** : documentation et validation.

| Étape | Action |
|---|---|
| 3.1 | Lot C documentaire : matrice Story→écran→composant→test→preuve |
| 3.2 | Revue UX humaine UXR-001 + rattachement au prochain lot UI |
| 3.3 | Premier appelant métier pour `lt-confirm-dialog` + test a11y complet (6/6) |
| 3.4 | Validation Frontend Architect + PO/CDO |

**Livrable** : 1 PR documentaire, 3 dettes closes ou progressées.

---

### Lot 4 — Email et DNS (P1, étalé sur 60-90 j)

**RSV-DMARC-02** + **RSV-EMAIL-NOREPLY-01-UNIDIR**.

| Étape | Action |
|---|---|
| 4.1 | Surveillance cron hebdomadaire (déjà actif : `013a04684e76`) |
| 4.2 | Gate Production `noreply@loyertracker.org` (depuis Staging validé) |
| 4.3 | Pied de page « ne pas répondre » + contact alternatif dans les templates |
| 4.4 | Accepter formellement l'unidirectionnalité comme contrainte permanente → close RSV-EMAIL-NOREPLY-01-UNIDIR |
| 4.5 | Au premier rapport DMARC réel : analyse SPF/DKIM → compteur 30 jours |
| 4.6 | Après 30 jours propres : Gate DNS `p=quarantine; pct=25` |
| 4.7 | Progression : `pct=100` → `p=reject` |

**Livrable** : 1 PR Production, 1 PR DNS, 2 réserves closes.

---

### Lot 5 — Dette Design résiduelle (P2, 3-5 j)

**DD-611-04** + **DD-EP17-04** + **DD-EP17-06** + **DD-EP17-07** + **DD-EP17-09**.

| Étape | Action |
|---|---|
| 5.1 | Accepter baseline T0 post-pilote ou industrialiser pixel-diff (DD-611-04) |
| 5.2 | Migration `lt-data-table`/`lt-section-card` sur Alertes, Audit, Gestionnaire (DD-EP17-04) |
| 5.3 | Adoption tokens spacing par écran + règle lint (DD-EP17-06) |
| 5.4 | Convention `data-testid` pour parcours E2E critiques (DD-EP17-07) |
| 5.5 | Harmoniser VerifyReceiptComponent ou documenter exception (DD-EP17-09) |

**Livrable** : 1 PR Frontend + 1 PR documentaire, 5 dettes closes ou acceptées.

---

## 3. Séquencement recommandé

```
Lot 0 (0,5 j) ──► Lot 1 (2-4 j) ──► Lot 2 (3-5 j) ──► Lot 3 (2-3 j)
                      │
                      └──► Lot 4 (étalé 60-90 j, démarre maintenant)
                      │
                      └──► Lot 5 (3-5 j, après Lot 2)
```

- **Lot 0** : immédiat, sans risque, réduit le backlog visible
- **Lot 1** : priorité absolue (P0 sécurité), indépendant des autres lots
- **Lot 2** : P1 fonctionnel, dépend du Plan Frontend approuvé
- **Lot 3** : P1 gouvernance, peut démarrer en parallèle de Lot 2
- **Lot 4** : P1 email, partiellement déjà en cours (cron actif, Staging OK)
- **Lot 5** : P2, après les lots P0/P1

---

## 4. Décision

**GO proposé** — sous réserve de validation PO/CDO sur :

1. Priorité P0 du Lot 1 (DD-EP17-14) — correctif sécurité Production
2. Périmètre exact du Lot 2 (DD-EP17-12 + DD-EP17-02) — Plan Frontend requis
3. Acceptation de la clôture documentaire du Lot 0 sans code
4. Calendrier du Lot 4 (DMARC étalé sur 60-90 jours)

**Note** : ce plan est purement documentaire. Aucun code, aucune migration, aucun déploiement n'est autorisé par ce document seul. Chaque lot fera l'objet d'un Plan d'Exécution et d'un Gate distinct.
