# Plan de release opérationnel — `v1.17.0-rc.1` / US-125

- **Projet :** LoyerTracker
- **RC :** `v1.17.0-rc.1`
- **Source immutable :** `d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a`
- **API digest :** `sha256:8e94c002a65bff590c9694b1dd79ca2eb9ab04639f9f59ddb5b735afe001a30d`
- **Web digest :** `sha256:18ade4b483955691fedd7d46a2c893ff27facd9d6dcf5249350005080d679d67`
- **Déploiement actuel :** aucun déploiement Production exécuté
- **Auteur :** sous-agent Release Manager, non humain
- **Statut :** PASS documentaire.

## Préconditions

- Gate Production : `GO / PRODUCTION_READY`.
- CHECK-REL-01 : PASS sous réserve non bloquante.
- CHECK-OPS-01 pré-Production : PASS sous réserve documentaire.
- Backup Production vérifié : dump + globals, `pg_restore --list = 858`.
- Même artefact que Staging ; aucun rebuild et aucun retag mutable.
- Aucun changement secret/provider/flag.

## Fenêtre proposée

- **Fenêtre cible proposée :** `2026-08-09T01:00:00Z` → `2026-08-09T02:00:00Z`.
- **Statut :** **confirmée par le CDO**.
- **Canal officiel :** GitHub PR de release + Telegram CDO.
- **Périmètre temporel :** déploiement ciblé `api` + `nginx`, puis stabilisation T0 de 15 minutes minimum.

## Responsabilités par agent

| Activité | Responsable assigné | Validation CDO |
|---|---|---|
| Coordination de release | sous-agent Release Manager | acceptée |
| Vérification architecture | sous-agent Delivery Architect | acceptée |
| Surveillance et alertes | sous-agent SRE / Operations | acceptée |
| Vérification fonctionnelle | sous-agent QA + PO | acceptée |
| Décision de rollback | CDO + sous-agent Release Manager, sur recommandation SRE | acceptée |
| Restauration de données | CDO + sous-agent Release Manager uniquement | acceptée |
| Communication incident | CDO + sous-agent Release Manager | acceptée |

## Séquence d’exécution

1. Rejouer `check-release-state.sh --host` sur Production.
2. Vérifier backup, hashes et accès aux anciens digests `1.16.0`.
3. Vérifier les digests candidats API/Web.
4. Vérifier qu’aucun service mutualisé ne sera recréé.
5. Promouvoir uniquement les digests API/Web de la RC.
6. Recréer uniquement `api` et `nginx`.
7. Exécuter le smoke Production canonique.
8. Exécuter CHECK-OPS-01 post-Production.
9. Maintenir l’hypercare T0/T+12/T+24.
10. Clôturer uniquement après T+24 PASS et décision CDO distincte.

## Hypercare

| Checkpoint | Fenêtre | Critères PASS |
|---|---|---|
| T0 | fin déploiement + 15 min | health API/Web 200, Actuator interne 200, public 404, conteneurs healthy, 5xx non qualifiés = 0, smoke PASS |
| T+12 | T0 + 12 h ± 30 min | health stable, aucune alerte critique non qualifiée, métriques disponibles |
| T+24 | T0 + 24 h ± 30 min | mêmes critères + absence d’incident bloquant |
| Clôture | après T+24 PASS | décision CDO distincte |

## Communication incident

- **SEV-1 :** escalade immédiate CDO + Release Manager ; décision rollback sous 15 minutes.
- **SEV-2 :** SRE → Release Manager → CDO sous 30 minutes.
- **SEV-3 :** suivi hypercare/backlog sans rollback automatique.
- **Référence PR documentaire :** [PR #410](https://github.com/CGPA-Delivery/loyertracker/pull/410).

## Verdict Release Manager Agent

**PASS documentaire sous réserve** : version, RC, artefacts, release notes, Changelog, backup et rollback sont conformes ; la fenêtre UTC et le canal officiel de communication doivent être confirmés avant l’exécution opérationnelle.

Aucun déploiement Production n’est déclenché par ce plan.
