# Clôture EP20-US06 — Confirmation accessible et preuve responsive de retenue

| Champ | Valeur |
|---|---|
| Date | 2026-08-15 |
| Story | `EP20-US06` — Must |
| Autorité de clôture | PO/CDO — Jordan Tshilombo Kabamba (`Approuvé`) |
| PR finale intégrée | #500 — merge `416cd8ed2cf2ebee1fb61d5c2cb38900211a7eff` |
| État | **CLOSE — intégrée sur `main`** |

## Résultat livré

- Une retenue de garantie n’est jamais déclenchée avant confirmation explicite : l’ouverture du dialogue n’émet aucun appel métier.
- Le dialogue présente la projection financière `RECU` ou `PARTIEL` avant exécution ; pour `PARTIEL`, ADR-15 est explicite : aucune quittance certifiée n’est suggérée ni produite.
- `Escape` ferme sans appel API, le focus initial est placé sur **Annuler**, le focus est restitué au déclencheur et `Tab` / `Shift+Tab` restent confinés entre les actions.
- Le dialogue réel est un `alertdialog` nommé, modal, compatible Axe et doté de cibles tactiles d’au moins `44 × 44 px`.
- Le dashboard Gestionnaire charge sans crash Angular : `ConfirmationService` et `MessageService` sont fournis globalement, sans modification OIDC, guard ou intercepteur HTTP.
- La lecture Audit Gestionnaire reste fail-closed et limitée aux événements paiement dérivables sur les biens actuellement affectés ; les événements non dérivables, non affectés et cross-tenant sont exclus.
- Les panneaux Garanties et Honoraires se contractent sans overflow horizontal dans leur CSS Grid.

## Chaîne documentaire et livraison

| PR | Objet | Merge |
|---:|---|---|
| #491 | Cadrage de la confirmation UI | `6d18cde13db4996be22849c36067cf05b41fe580` |
| #492 | GO Frontend borné | `58f9e9a72eb3111b7a67a7954d47089626765e43` |
| #493 | Confirmation avant retenue | `a8082d814ac9aca7765b25ee0ba6a8a604dae2a5` |
| #494 | Annulation clavier | `211d4b5f034adcba6d9874b736ab9322a96fd883` |
| #495 | Focus initial et restitution | `43666dfb0a54005872ed3d83ed08049dca2e89d9` |
| #496 | Addendum lecture Gestionnaire/ReBAC | `875057620529d8259233ff2579d1e4ce4a70ebdc` |
| #497 | Addendum Audit Gestionnaire/ReBAC | `77b9a0b11102d6c049d0c6bf382cd5bfb1eb290f` |
| #498 | Audit Gestionnaire/ReBAC borné | `5894c74637a51e8037ffca0b7d5e91eaddfdfd6b` |
| #499 | Dashboard Gestionnaire accessible | `62a8e2deb35d728faee5b248df9dc8482f688104` |
| #500 | Preuve responsive authentifiée finale | `416cd8ed2cf2ebee1fb61d5c2cb38900211a7eff` |

Toutes ces PR sont fusionnées sur `main` par décision humaine.

## Preuves fonctionnelles et sécurité

- Backend Audit/ReBAC : `S04AlertesAuditIntegrationTest` couvre affecté, non affecté, cross-tenant et événement non dérivable ; `mvn -q verify` a validé **266 tests** sur **35 migrations** du dépôt.
- La Production réelle reste distincte à Flyway **32** : aucune migration ni donnée n’y a été déployée dans cette story.
- Seed responsive local via API métier : **15 PASS / 0 FAIL**, garantie créée sans SQL direct et `directAccessGrantsEnabled` restauré à `false`.
- Suite Angular finale : **241/241 SUCCESS**.
- Lint et build production Frontend : **SUCCESS**.
- Scénario ciblé du dialogue : **4/4 PASS** aux viewports `360/390/640/1024`.
- Matrice responsive authentifiée complète : **24/24 PASS**.
- Contrôles : zéro POST avant confirmation/Escape, focus initial/restitution, confinement clavier, cibles `44 px`, absence d’overflow et aucune violation Axe `serious`/`critical`.
- PR #500 : Frontend/Sonar, Backend/couverture, sécurité Gitleaks/SCA/Trivy, CodeQL Java/TypeScript, accessibilité E2E, structural audit et Build/scan/SBOM Docker **SUCCESS** ; publication/signatures/attestations `SKIPPED` attendu.
- Sonar new code final : couverture `83,7 %`, duplication `0,65 %` et zéro nouvelle violation bloquante.

Référence durable : `docs/cgpa/evidence/ep20-us06/local-responsive-dialog-retention-proof-2026-08-15.md`.

## Contrats préservés

- OIDC et Keycloak inchangés hors activation locale temporaire et réversible du seed ;
- aucun contournement `401/403`, ReBAC, RLS, Audit, guard ou intercepteur ;
- ADR-15 strict : quittance certifiée uniquement pour `RECU`, jamais pour `PARTIEL` ;
- aucune opération financière exécutée par la preuve E2E, qui annule systématiquement ;
- aucun secret versionné, provider externe, message réel, Staging ou Production.

## Décision de clôture

Le PO/CDO approuve la clôture documentaire d’`EP20-US06`. La story est **CLOSE** et intégrée sur `main`.

Cette décision clôt EP-20 jusqu’à nouvelle instruction explicite. Elle ne constitue ni un Gate Staging/Production, ni une autorisation de promotion, de déploiement, d’activation fournisseur, d’usage de secret ou d’envoi réel. Toute suite exige une décision PO/CDO distincte et les Gates CGPA applicables.
