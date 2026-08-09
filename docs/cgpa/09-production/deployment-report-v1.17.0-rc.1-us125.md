# Rapport de déploiement Production — v1.17.0-rc.1 / US-125

**Gouvernance :** CGPA v6.1.1  
**Statut de clôture :** écart de fenêtre accepté par le CDO le `2026-08-09T05:45:17Z` ; release maintenue en Production sous hypercare. La clôture finale reste conditionnée aux checkpoints T+12/T+24.
**Exécution :** 2026-08-09T00:24:03Z

## 1. Autorisation et identité

- Décideur humain : Jordan Tshilombo, CDO / Enterprise Architect.
- Instruction : GO explicite de déploiement reçue dans le canal CDO.
- RC : `v1.17.0-rc.1`.
- Commit source : `d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a`.
- Tag logique : `sha-d19c4fea`.
- PR de correction du verrou de release : [PR #411](https://github.com/CGPA-Delivery/loyertracker/pull/411), fusionnée avec CI verte.

## 2. Artefacts immuables déployés

- API : `ghcr.io/cgpa-delivery/loyertracker-api@sha256:8e94c002a65bff590c9694b1dd79ca2eb9ab04639f9f59ddb5b735afe001a30d`.
- Web : `ghcr.io/cgpa-delivery/loyertracker-web@sha256:18ade4b483955691fedd7d46a2c893ff27facd9d6dcf5249350005080d679d67`.
- Aucun rebuild, retag mutable ou modification de code applicatif pendant la bascule.
- Services recréés : `api`, `nginx` uniquement.
- Services non touchés : PostgreSQL, Keycloak, Prometheus, Alertmanager, Blackbox et Pushgateway.

## 3. Préconditions et backup

- Checkout Production synchronisé sur `main` `e75193d32c1d`.
- Backup : `/home/ubuntu/backups/loyertracker/gate-us125-deploy-20260809T001015Z/`.
- Dump PostgreSQL : SHA-256 `8b96cdfa6d578eaa6523b1d7d6199cb13ab06cc1e9c03f02b925951b072a1fc2`.
- Globals PostgreSQL : SHA-256 `41db4b55f8821890fdc0b36c2d410fe098d0b139ecb74a3f6b92358e885712f9`.
- Entrées `pg_restore --list` : `858`.
- Références de rollback applicatif conservées dans `rollback-image-refs.env`.

## 4. Vérifications post-déploiement

- API : `healthy`.
- Web : `healthy`.
- RestartCount API : `0`.
- RestartCount Web : `0`.
- Flyway : `32/32`.
- `/healthz` via TLS : `200`.
- Racine Web via TLS : `200`.
- Actuator : `UP` via le chemin Nginx authentifié.
- Release lock live : `COHÉRENT`.
- Digests actifs : conformes aux deux références RC exactes.
- Fixture Keycloak `bailleur-test` : restaurée à `enabled=false`.
- `directAccessGrants` du client SPA : restauré à `false`.

## 5. Smoke Production

Smoke officiel exécuté avec Keycloak et API réels :

```text
63 PASS / 0 FAIL
```

Couverture confirmée :

- JWT Keycloak réel ;
- inscription bailleur ;
- patrimoine, bien, locataire et bail ;
- invitation et création gestionnaire ;
- échéances, pointage et honoraires ;
- alertes PREAVIS ;
- audit ;
- scoping gestionnaire ;
- isolation cross-tenant ;
- RGPD export/effacement ;
- garde-fous AuthN et ports ;
- quittances publiques sans oracle.

Le premier passage a été interrompu avant le parcours métier car la fixture `bailleur-test` était désactivée. La fixture a été activée uniquement pour le contrôle, puis automatiquement restaurée. Le second passage est `63/0`.

## 6. Écart de fenêtre UTC

- Fenêtre documentée : `2026-08-09T01:00:00Z` → `2026-08-09T02:00:00Z`.
- Exécution réelle : `2026-08-09T00:24:03Z`.
- Écart : exécution environ 36 minutes avant le début de la fenêtre UTC documentée.
- Cause : l’instruction CDO explicite a été exécutée immédiatement ; la fenêtre précédemment documentée n’a pas été requalifiée avant la bascule.
- Impact technique observé : aucun ; tous les contrôles critiques et le smoke sont PASS.
- **Action de gouvernance :** écart accepté explicitement par le CDO le `2026-08-09T05:45:17Z` ; hypercare T+12/T+24 reste obligatoire avant clôture finale.

## 7. Décision technique

`PRODUCTION_DEPLOYED / TECHNICAL PASS / HYPERCARE`

Aucun rollback automatique n’est déclenché : la santé, l’observabilité de base, les digests, la migration et le smoke sont conformes. Le rollback reste armé selon `CHECK-OPS-01` : API/Web vers les références Production `1.16.0`, restauration données depuis le backup vérifié si nécessaire.
