# Addendum au préflight Production DD-EP17-14 — mécanisme livré

| Champ | Valeur |
|---|---|
| Date | 2026-08-12 |
| Référence préflight historique | `gate-production-dd-ep17-14-preflight.md` |
| Candidat | `8d7f651090476cb1932dfc9299f599cf315d6287` — merge PR #460 |
| Statut | **Préconditions techniques clôturées ; décision CDO et déploiement restent interdits** |

## Préserver le constat initial

Le préflight initial constatait correctement l'absence de mécanisme SMTP Production et de rollback ciblé. Ce constat est historique : il n'est ni supprimé ni réécrit.

## Remédiation livrée et validée

| Écart historique | Remédiation | Preuve |
|---|---|---|
| Aucun mécanisme SMTP Production | One-shot `keycloak-smtp-production-init`, profil explicite `production-smtp`, jamais démarré automatiquement | `docker-compose.prod.yml`, PR #460 |
| Aucun script Production dédié | `infra/keycloak/configure-smtp-production.sh` : variables requises, changement identifié, lecture runtime filtrée | PR #460, test de contrat PASS |
| Aucun rollback realm ciblé | `infra/keycloak/rollback-smtp-production.sh` : retour `smtpServer={}` sans toucher services/images/données | PR #460, test de contrat PASS |
| Identité de configuration incomplète | Commit immutable `8d7f651…`, CI complète verte ; API/Web et Flyway inchangés | PR #460, verrou release CI PASS |
| Backup/OPS/REL non instruits | CHECK-REL-01 et CHECK-OPS-01 dédiés ajoutés | `check-rel-01-dd-ep17-14-smtp-keycloak.md`, `check-ops-01-dd-ep17-14-smtp-keycloak.md` |

## Réserves actives avant Gate Production

1. Fenêtre UTC, responsable d'exécution et instruction opérationnelle explicite par le CDO.
2. Synchronisation non destructive du checkout Production vers le candidat ; `.env` et archives locales préservés.
3. Nouveau backup hashé si celui référencé par CHECK-OPS-01 a dépassé 24 heures.
4. Injection locale contrôlée des secrets `KC_SMTP_*`, permissions `600`, sans exposition dans Git ou logs.
5. Tests live Production et hypercare T0/T+12/T+24.

## Conclusion

**GO technique pour soumettre le dossier à la décision CDO `GO / PRODUCTION_READY`.** Ce statut n'est pas un déploiement et n'autorise aucune modification du realm Production avant l'instruction opérationnelle explicite.
