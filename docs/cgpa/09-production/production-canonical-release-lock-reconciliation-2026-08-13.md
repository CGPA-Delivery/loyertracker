# Réconciliation du verrou de release — Production canonique

| Champ | Valeur |
|---|---|
| Date | 2026-08-13 |
| Autorité | CDO : la Production canonique reste sur les artefacts `sha-d19c4fea` |
| Hôte canonique | `18.158.70.88` |
| Nature | Réconciliation versionnée de la source de vérité ; aucun déploiement |
| Statut | **Candidat documentaire à CI / revue humaine** |

## Décision et constat

Le contrôle SSH de l'hôte Production canonique a constaté que les conteneurs API et Web exécutent les digests immuables associés à `sha-d19c4fea`. Le verrou versionné avait été déplacé vers les digests EP-17 Lot 5, qui concernent l'hôte legacy non public ; cette déclaration ne représentait donc pas le runtime servi par `loyertracker.loyerpro.org`.

La décision CDO est de conserver le runtime canonique actuel. Cette modification remet le fichier `infra/release/production-state.env` en cohérence avec l'état réellement observé, sans modifier image, Compose, realm Keycloak, base de données ni service.

## Contrôles avant PR

| Contrôle | Résultat |
|---|---:|
| Hôte Production canonique accessible | PASS |
| API / Nginx / Keycloak / PostgreSQL / SMTP relay | PASS — healthy |
| HTTPS public | PASS — 200 |
| API Actuator | PASS — UP |
| Issuer OIDC public | PASS — domaine canonique |
| Flyway Production | PASS — 32 |
| Scope de changement | verrou et traçabilité seulement |

## Effet attendu après fusion

`check-release-state.sh --host` doit être de nouveau cohérent sur `18.158.70.88`, sans recréation de conteneur.

## Limites

- Cette PR ne promeut aucun artefact et ne réécrit aucune décision historique.
- La configuration SMTP Keycloak ne change pas.
- Toute activation SMTP future reste soumise à un Gate distinct : backup frais, fenêtre UTC, preuve de réception/action-token, anti-énumération et hypercare.
