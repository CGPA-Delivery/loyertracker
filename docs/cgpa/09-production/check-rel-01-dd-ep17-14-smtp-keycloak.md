# CHECK-REL-01 — Configuration SMTP Keycloak Production (DD-EP17-14)

| Champ | Valeur |
|---|---|
| Date | 2026-08-12 |
| Périmètre | Configuration SMTP du realm Keycloak Production, flux « mot de passe oublié » |
| Type | Configuration Release Candidate — sans rebuild applicatif ni migration |
| Candidat immutable | `8d7f651090476cb1932dfc9299f599cf315d6287` (merge PR #460) |
| Composants | `docker-compose.prod.yml`, `configure-smtp-production.sh`, `rollback-smtp-production.sh` |
| Artefacts API/Web | Inchangés : digests Production actuels (verrou release PASS) |
| Gate Staging | GO — PR #456/#457/#458, parcours et anti-énumération PASS |
| Décision Gate 07A | En attente de la décision CDO après clôture du Gate Production |

## Matrice de readiness

| Critère CHECK-REL-01 | Résultat | Preuve |
|---|---:|---|
| Périmètre et version identifiés | PASS | DD-EP17-14 ; candidat source `8d7f651` |
| Candidat immutable | PASS | PR #460 CI verte, merge commit référencé ci-dessus |
| Artefact identique à Staging | PASS sous réserve de nature | Pas d'artefact API/Web : même image Keycloak digest et même configuration SES testée sur Staging ; le compose/script Production est une adaptation contrôlée dédiée |
| Changelog / release notes | PASS | Gate Staging et préflight Production référencés ; configuration release documentée dans ce dossier |
| Tests fonctionnels et sécurité Staging | PASS | Mot de passe oublié + anti-énumération `HTTP 200`/message identique |
| Défauts bloquants connus | PASS sous réserve | Aucun défaut Staging ; Production non encore configurée/testée |
| Validation métier PO/CDO Staging | PASS | Parcours réel validé le 2026-08-12 |
| Validation technique/sécurité | PASS sous réserve | CI #460 verte ; preuve runtime Production post-déploiement à produire |
| Avis Delivery Architect / Release Manager | NO GO historique levé techniquement | Préflight #459 ; mécanisme Production et rollback mergés par #460 |
| Rollback configuration | PASS | `rollback-smtp-production.sh` efface `smtpServer` sans toucher services, images ou données |
| Rollback données | PASS sous réserve | Backup pré-Gate validé dans CHECK-OPS-01 ; restauration seulement sur décision CDO/RM |
| CHECK-OPS-01 pré-Production | PASS sous réserve | Document dédié ci-dessous ; décision CDO et fenêtre restent nécessaires |

## Décision CHECK-REL-01

**PASS sous réserve opérationnelle.** Le candidat de configuration est versionné, immuable et CI-validé. Les réserves ne sont pas des défauts de code : elles concernent la validation live Production, la fenêtre d'exécution et la décision humaine CDO. Cette checklist ne déclenche aucun déploiement.
