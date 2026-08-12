# Gate Staging — EP-17 Lot 2 : parcours utilisateur critique

| Champ | Valeur |
|---|---|
| Date d'exécution | 2026-08-12T14:45:46Z |
| Projet | LoyerTracker |
| Périmètre | DD-EP17-12 (acceptation d'invitation) et DD-EP17-02 (états 403/404) |
| Référentiel | CGPA v6.1.1 |
| Environnement | `ai-test-server` — Staging mutualisé |
| Autorité CDO / PO | Jordan Tshilombo Kabamba — GO explicite de déploiement, puis approbation du résultat Staging |
| Décision | **GO — STAGING_DEPLOYED** |

## 1. Identité immuable du candidat

- Merge `main` : `2b2b82cda49b31a2caebaef589f6d8e683118a1e` (PR #462).
- Workflow CI : [main CI #31604452067](https://github.com/CGPA-Delivery/loyertracker/actions/runs/31604452067) — **SUCCESS**.
- API : `ghcr.io/cgpa-delivery/loyertracker-api@sha256:4b7be8ec8d91b76c7ea9d66ac4090b90dd88b65ea7853bf6d636a2e7f3f8bc4e`.
- Web : `ghcr.io/cgpa-delivery/loyertracker-web@sha256:fd28b49f6c6201dae89be2a661944da4b7e9ccc13a5f4a88c0d44a6c39b69580`.
- Le manifeste de release CI confirme les scans image, signatures Cosign, provenance GitHub et attestations SBOM.

## 2. STG-ISOL-01 — PASS

- Namespace, réseau et volume PostgreSQL dédiés : `loyertracker-staging-*` / `loyertracker-staging_loyertracker-net` / `loyertracker-staging_postgres-data`.
- Seuls `api` et `nginx` ont été recréés ; Keycloak et PostgreSQL sont restés inchangés.
- Ports Staging conservés : `18080` et `18443`; API, Keycloak et PostgreSQL ne publient aucun port hôte.
- Le reverse proxy mutualisé `nginx-proxy-manager` est resté actif ; aucun autre projet n'a été arrêté ou modifié.
- Aucun `docker compose down`, prune, suppression de réseau/volume, ni commande Docker globale n'a été exécuté.

## 3. Préflight, sauvegarde et promotion

- Sauvegarde PostgreSQL pré-déploiement : `loyertracker-staging-pre-lot2-20260812T141229Z.dump`.
  - SHA-256 : `2453568e3d2d1a3834daf603c14495f77946e184e5eafc50cd42a373f81c2c74`.
  - `pg_restore --list` : 873 entrées.
- Globals : `loyertracker-staging-pre-lot2-20260812T141229Z-globals.sql`.
  - SHA-256 : `144fd9eafddfa1b35417660c1fc844b17ece46c3b54ec1a256087a3501a2e287`.
- Les deux digests ont été tirés et vérifiés avant recréation ciblée.
- Correctif opérationnel sans impact applicatif : `KC_SMTP_PASSWORD` a été rendu shell-safe dans `.env` Staging afin que le smoke canonique puisse charger le fichier. La valeur n'est ni versionnée ni exposée.

## 4. Vérifications post-déploiement — PASS

| Contrôle | Résultat |
|---|---|
| API et Web candidats | `healthy`, `RestartCount=0` |
| Keycloak / PostgreSQL | inchangés, `healthy` |
| HTTPS racine | `200` |
| API Actuator via Nginx TLS | `200`, statut `UP` |
| Flyway | `32/32`, aucune migration appliquée |
| Pool API | `loyertracker_api`, `NOSUPERUSER`, `NOBYPASSRLS` |
| Smoke canonique | **63 PASS / 0 FAIL** |
| Invitation → acceptation publique → JWT Gestionnaire | PASS |
| Autorisations, ReBAC et isolation cross-tenant | PASS |
| RGPD, audit, ports internes et vérification quittance publique | PASS |
| Échafaudage direct grant Keycloak | révoqué : `directAccessGrantsEnabled=false` |

## 5. Portée et réserve

Le déploiement couvre la route publique d'acceptation d'invitation, le formulaire de mot de passe et les pages Frontend `/403`, `/404` ainsi que le fallback 404. Le smoke prouve le contrat public d'acceptation et le succès fonctionnel API/Keycloak.

La navigation de recette externe vers le FQDN Staging est empêchée depuis l'environnement d'automatisation par une authentification d'accès en amont (`ERR_INVALID_AUTH_CREDENTIALS`). Ce contrôle ne remet pas en cause les preuves TLS locales, la CI accessibilité Playwright du SHA candidat ni le smoke canonique réel ; une recette humaine externe reste néanmoins à enregistrer avant toute instruction Production.

Le plafond de notifications Staging est à `5/5`. Cette réserve ne bloque ni ce déploiement ni le flux d'invitation ; elle bloque seulement toute recette nécessitant un nouvel envoi sortant sans décision de gestion de budget distincte.

## 6. Recette humaine externe — PASS

- **Validateur :** Jordan Tshilombo Kabamba, Product Owner / CDO.
- **Décision communiquée :** `PASS` dans le canal de livraison, après exécution de la recette Staging demandée.
- **Périmètre accepté :** acceptation publique d’invitation, comportements erreur du formulaire et pages Frontend 403/404.
- **Conclusion :** la recette humaine externe est **PASS** ; la réserve de §5 relative à l’enregistrement de cette recette est levée.

## 7. Décision et suite

**GO — STAGING_DEPLOYED et recette humaine PASS.** L'approbation CDO/PO reçue couvre le résultat de ce déploiement Staging, sur l'artefact immuable identifié ci-dessus.

Cette décision n'autorise pas la Production. La suite obligatoire demeure :

```text
recette humaine Staging enregistrée
→ Release Candidate immuable (mêmes digests)
→ CHECK-REL-01
→ CHECK-OPS-01 pré-Production
→ Gate Production distinct et décision CDO explicite
→ instruction opérationnelle distincte de déploiement
```
