# Project State — LoyerTracker

```yaml
framework:
  current_version: "6.1.1"
  migrated_from: "5.4.1"
  migration_date: "2026-07-27"
  migration_status: "completed"
  # Lignee de migration : 3.0.1 -> 5.0.1 (2026-06-13) -> 5.2 (2026-06-16, additive, sans rejeu de gate) -> 5.3 (2026-06-23, additive, Release Management + UX/UI Governance) -> 5.4 (2026-06-24, additive, gouvernance Staging partagee + STG-ISOL-01) -> 5.4.1 (2026-06-24, normalisation des preuves STG-ISOL-01)
```

> **RELEASE `1.9.0` CLÔTURÉE — CDO GO (2026-07-08 ~14:36 UTC).** Hypercare T0 PASS
> (2026-07-06 ~17:58 UTC) + checkpoint combiné **T+12/T+24 en rattrapage PASS sous
> surveillance** (2026-07-08 ~14:36 UTC, ≈ T+45) — écarts de fenêtre qualifiés PO (hôte
> `loyertracker-prod-server` volontairement éteint durant les deux fenêtres cibles, produit non
> annoncé publiquement, pattern récurrent `1.4.0`→`1.8.0`) : tag/digests inchangés
> (`sha-75646d8f`), Flyway 22/22, invariant ledger 3/3, 8/8 actifs 4/4 healthy restart=0 depuis
> le dernier redémarrage hôte, `bailleur-test` désactivé (`directAccessGrantsEnabled=false`),
> Prometheus 5/5, Alertmanager `[]`, 5xx=0, pool Hikari pending=0, site public 200. Réserves
> RSV-PROD-EP14-01/02 levées au Gate ; `RSV-STG-01` (héritée) maintenue, sans rapport avec
> `1.9.0`. Rapports : `deploiement-technique-v1.9.0-report.md`, `validation-finale-v1.9.0-report.md`,
> `plan-etape-hypercare-v1.9.0.md`, `cloture-release-v1.9.0.md`.
>
> **Préflight Production `1.9.0` — PASS (2026-07-06, 18:13–18:16 CEST).** Production
> `1.8.0` saine : 8/8 actifs, 4/4 healthy, restart=0, Flyway 21/21, Prometheus 5/5,
> invariant ledger 3/3, objets V22 absents. Backup vérifié :
> `loyertracker-20260706-181545.dump` (325755 octets, 742 entrées, SHA-256 `a017b81f…`) +
> globals (1108 octets, SHA-256 `c07cd206…`), modes 600. HMAC Production distinct persisté
> sans exposition, KID=1 et URL confirmés ; `.env.bak-pre-1.9.0` créé, tag inchangé.
> Rollback `sha-2c5f43c7` confirmé. Rapport :
> `docs/cgpa/09-production/preflight-backup-v1.9.0-report.md`. **Aucun pull, redémarrage ou
> déploiement. Autorisation explicite distincte requise ; `PRODUCTION_DEPLOYED` non atteint.**
>
> **Gate Production unique `1.9.0` — GO, `PRODUCTION_READY` (2026-07-06).** EP-14 complet :
> Sprint 11 US-99/100/101 + Sprint 12 US-102/103/104 + Angular 22. Candidat exact
> `sha-75646d8f` validé en Staging : STG-ISOL-01 PASS, Flyway 22/22, smoke 62/0 au premier
> passage, parcours QR/PDF réel et revue sécurité PASS ; CI/CodeQL verts ; digests GHCR figés.
> V22 additive, rollback applicatif viable vers `sha-2c5f43c7`. RSV-PROD-EP14-01/02 levées.
> Quatre alertes npm transitives de développement sont non bloquantes, sans exposition runtime.
> Décision : `docs/cgpa/09-production/gate-production-v1.9.0-decision.md`. **Seul le Préflight
> Production est autorisé ; aucun déploiement sans Préflight PASS et instruction explicite
> distincte. `PRODUCTION_DEPLOYED` non atteint.**

> **Gate Staging Sprint 12 EP-14b — GO, `STAGING_DEPLOYED` (2026-07-06).** Revue sécurité dédiée
> PASS sans réserve bloquante ; Sprint 12 US-102/103/104 formellement clôturé. Candidat
> `sha-75646d8f` (merge PR #202 `75646d8`) déployé de façon ciblée sur `ai-test-server` après
> sauvegarde vérifiée (517 Kio, 777 entrées). STG-ISOL-01 PASS avant/après : NPM et 9 conteneurs
> intacts, restart=0, réseaux/volumes/ports inchangés. Flyway 22/22 ; smoke **62/0 au premier
> passage** ; rate-limit 429 et métriques confirmés ; quittance réelle `QT-2026-000001` VALIDE,
> PDF conforme à `pdf_hash`. Décision :
> `docs/cgpa/07-devsecops/gate-staging-sprint12-ep14b-v5.4.1-decision.md`. **Prochaine étape
> autorisée : instruire le Gate Production unique `1.9.0` — aucun déploiement Production n’est
> autorisé par ce Gate Staging.**
>
> **Revue sécurité dédiée + clôture Sprint 12 EP-14b — PASS / GO (2026-07-06).** Surface publique
> auditée : HMAC capability, absence d’oracle, K2 sans fuite, PDF re-haché, fonctions
> `SECURITY DEFINER`, journal RGPD-minimal, rate-limit/CSP/logs et CI sécurité. Aucun point
> bloquant. Sprint US-102/103/104 livré sans report ; CI post-merge verte et images immuables
> publiées. Références : `security-review-sprint12-ep14b.md`, `cloture-sprint12-ep14b.md`.
>
> **EP-14 instruit — Quittances certifiées, vérifiables et infalsifiables (PO, 2026-07-05).**
> Dossier de gouvernance produit : **ADR-15** (D-QC-001, **acceptée** — persistance des
> quittances supplantant l'arbitrage C pour ce périmètre sans réécrire l'historique, double
> hash `content_hash`/`pdf_hash`, token HMAC non stocké/non expirant à révocation par statut,
> QR ZXing, lecture publique via fonction `SECURITY DEFINER` pattern V10/V12/V13, thème
> injectable + PAdES-ready), **plan d'exécution EP-14** (Sprints 11–12, release Production
> unique **`1.9.0`**, V22 additive) et **addendum backlog US-99→104**. Kickoff tranché par le
> PO (K1–K5) : numérotation **par bailleur+année** ; page publique = **liste complète du
> besoin** (exposition confirmée ADR-03, token = capability) ; statuts sans `BROUILLON`
> (`EMISE`/`ANNULEE`/`REMPLACEE`) ; domaine `loyertracker.loyerpro.org` ; **2 sprints, une
> release**. Sprint 11 (EP-14a socle certifié + PDF redesign) démarre après fusion du dossier ;
> promotion Production du Sprint 11 seul explicitement interdite (QR sans page de
> vérification). Références : `docs/cgpa/05-architecture-conception/adr/ADR-15-quittances-certifiees.md`,
> `docs/cgpa/06-planification-agile/plan-execution-ep14-quittances-certifiees.md`,
> `docs/cgpa/06-planification-agile/addendum-backlog-ep14.md`.
>
> **OBS-S10-01 statuée — ACCEPTÉE EN L'ÉTAT, CLOSE (PO, 2026-07-05).** Assiette réelle
> re-vérifiée en Production le jour de l'arbitrage : **0 groupe ambigu** (les 3 garanties
> réelles ont chacune 1 seul mouvement — aucun cas de tie-break possible, ni rétroactif : le
> backfill V20 est clos). Impact au pire cosmétique (chaque mouvement porte son `solde_apres`),
> vecteur de croissance quasi nul (1 mouvement par transaction dans tout le code actuel), coût
> d'un correctif disproportionné. Deux garde-fous consignés : réévaluation sur premier cas réel
> (requête de contrôle fournie) et point de vigilance pour toute future insertion
> multi-mouvements en une transaction (à vérifier au Gate Staging du sprint concerné). Le
> dernier point post-clôture `1.8.0` est ainsi traité. Décision :
> `docs/cgpa/09-production/arbitrage-obs-s10-01.md`.
>
> **RELEASE `1.8.0` CLÔTURÉE — CDO GO (2026-07-05 ~10:02 UTC).** Hypercare T0 PASS +
> checkpoint combiné T+12 (rattrapage) / T+24 (anticipé ≈ T+17) PASS, aucun critère de
> suspension atteint sur tout le cycle. Sprint 10 EP-12b (US-95/96/97, V21) + correctif
> RSV-S10-01 confirmés en Production sur `sha-2c5f43c7`. Réserves : RSV-S10-01 et RSV-S10-02
> **levées** ; RSV-S9-03 acceptée permanente (héritée) ; **OBS-S10-01 reste ouverte**
> (cosmétique — tie-break UUID intra-timestamp sur lignes backfillées V20, 0 cas en Production,
> à statuer hors hypercare). Première release de l'historique avec smoke Production **59/0 au
> premier passage** sans correctif préalable. Prochaines actions autorisées : statuer
> OBS-S10-01 ; traiter les 2 alertes Dependabot sur `main` (1 modérée, 1 basse) ; puis Sprint
> suivant du backlog PO selon le parcours gouverné. Décision :
> `docs/cgpa/09-production/cloture-release-v1.8.0.md`.
>
> **Hypercare Production `1.8.0` — checkpoint combiné T+12/T+24 exécuté le 2026-07-05 à
> 09:41 UTC (≈ T+17), PASS.** Écarts de fenêtre qualifiés PO : T+12 (~04:45 UTC) inexécutable —
> hôte volontairement éteint la nuit, **rattrapé** au premier démarrage (boot ~09:34 UTC) ; T+24
> (~16:45 UTC) **anticipé d'~7 h** sur instruction PO en checkpoint combiné — même qualification
> que le précédent `1.7.0`. Résultats : 8/8 conteneurs Up, 4/4 `(healthy)`, restart=0 (y compris
> depuis T0) ; tag `sha-2c5f43c7` et digests conformes au Gate ; Actuator UP ; Flyway 21/21 ;
> invariant ledger 3/3 ; 0 paiement lié V21 (aucune activité métier réelle — attendu, produit
> non annoncé) ; `bailleur-test` désactivé vérifié ; Prometheus 5/5 up, Alertmanager `[]`, p99
> ~61 ms, 5xx=0, Hikari pending=0 ; heartbeat backup absent **qualifié** (pushgateway purgé au
> boot + cron 02:15 UTC non joué hôte éteint — pattern récurrent `1.4.0`–`1.7.0`, exclu des
> critères de suspension) ; 0 erreur API nouvelle depuis le boot ; site public 200. **Aucun
> critère de suspension atteint — hypercare `1.8.0` sans incident.** Surveillance planifiée
> close ; la **clôture de release reste suspendue à la décision CDO GO** (acte distinct).
> Post-clôture : statuer OBS-S10-01. Détail :
> `docs/cgpa/09-production/plan-etape-hypercare-v1.8.0.md`.
>
> **Hypercare Production `1.8.0` — T0 exécuté le 2026-07-04 à ~16:35 UTC, PASS.** 8/8 conteneurs
> Up, 4/4 `(healthy)`, restart=0. Tag `sha-2c5f43c7` et digests conformes au Gate. Flyway 21/21.
> Actuator UP. Prometheus 5/5 up, Alertmanager `[]`. p99 ~81 ms (fenêtre incluant le smoke),
> 5xx=0, Hikari pending=0, heartbeat backup ~26 min. 1 erreur qualifiée (`duplicate key`, smoke
> inscription — attendue), aucune inattendue. Invariant ledger 3/3. `bailleur-test` désactivé
> vérifié. **Rollback applicatif seul viable** (V21 additive — première release depuis `1.6.0`
> avec cette option). Plan : `docs/cgpa/09-production/plan-etape-hypercare-v1.8.0.md`. T+12
> prévu le 2026-07-05 à ~04:45 UTC ± 30 min (**rattrapage qualifié attendu**, hôte éteint la
> nuit — précédent `1.7.0`) ; T+24 le 2026-07-05 à ~16:45 UTC ± 30 min. La clôture `1.8.0`
> restera suspendue à la décision CDO GO après T+24.
>
> **`PRODUCTION_DEPLOYED` — Déploiement Production Sprint 10 `1.8.0` — 2026-07-04 ~16:45 UTC.**
> Tag **`sha-2c5f43c7`** déployé sur `loyertracker-prod-server` : `api`+`nginx` recréés ciblés,
> digests conformes au Gate (vérifiés avant et après), `postgres`/`keycloak` inchangés. Flyway
> **V21 appliquée** (`paiement.garantie_movement_id`, additive), 21/21 ; colonne + FK + index
> vérifiés ; invariant ledger 3/3 intact. Smoke Production **59/0 au premier passage** —
> première release de l'historique sans correctif préalable au smoke (compteur aligné PR #171,
> dépôt synchronisé au Préflight). `bailleur-test` réactivé **sur instruction explicite du PO**
> puis redésactivé ; nettoyage transactionnel 0 résidu (compteurs et audit à la baseline,
> garanties réelles intactes) ; 1 erreur API qualifiée attendue (duplicate key du smoke), 0
> inattendue ; Prometheus 5/5, Alertmanager `[]`, site public 200. **Rollback applicatif seul
> viable** vers `sha-6a358eb6` (V21 additive — contraste avec RSV-S9-03). Rapports :
> `deploiement-technique-v1.8.0-report.md`, `validation-finale-v1.8.0-report.md` ;
> `docs/prod-state.md` §0I. **Hypercare T0/T+12/T+24 requis avant clôture `1.8.0`** (plan à
> créer, pratique hôte éteint la nuit à qualifier comme en `1.7.0`).
>
> **Préflight Production `1.8.0` — PASS (2026-07-04, ~16:07–16:15 UTC).** Toutes les conditions
> de Préflight du Gate Production `1.8.0` sont satisfaites. Hôte démarré ~15:40 UTC (pratique
> documentée) : 8/8 conteneurs Up, 4/4 healthy, restart=0, tag `sha-6a358eb6` conforme, Flyway
> 20/20, Prometheus 5/5, capacité OK. Alerte `BackupHeartbeatMissing` à l'arrivée — cause
> récurrente connue (pushgateway purgé au boot, cron non joué hôte éteint), **résorbée dans la
> session** par le heartbeat de la sauvegarde. Dépôt hôte resynchronisé (retard récurrent :
> PR #163 → `3a4aec6`). **Sauvegarde vérifiée** : `loyertracker-20260704-170836.dump` (317 Kio,
> SHA-256 `69aec15e…`, `pg_restore --list` 740 entrées) + globals, permissions 600.
> **Vérifications lecture seule §4.2 : 4/4 PASS** — `cree_le` 3/3 non NULL, invariant ledger
> 3/3, colonne V21 absente (migration propre), **0 cas OBS-S10-01 en Production** (confirmé
> comme prédit au Gate). Release notes `1.8.0` rédigées (`docs/release-notes-v1.8.0.md`),
> `CHANGELOG.md` promu `[1.8.0]` — 2026-07-04. Rapport :
> `docs/cgpa/09-production/preflight-backup-v1.8.0-report.md`. **Prochaine étape autorisée** :
> déploiement technique `1.8.0` (`api`+`nginx`, migration V21 additive) — **décision distincte,
> non prise à ce stade.**
>
> **Gate Production Sprint 10 (release `1.8.0`) — GO, `PRODUCTION_READY` atteint (2026-07-04,
> ~15:49 UTC).** Arbitrage PO rendu : **option S1** (jordan), exécutée le jour même —
> **RSV-S10-02 LEVÉE**. Redéploiement Staging ciblé du candidat **`sha-2c5f43c7`** sur
> `ai-test-server` : STG-ISOL-01 PASS avant/après (restart=0, NPM intact), sauvegarde
> pré-déploiement vérifiée (368 Kio, 742 entrées), invocation canonique sans incident, Flyway
> inchangé 21/21, smoke **59/0 au premier passage**. **Vérification live de RSV-S10-01 avec
> preuve discriminante** : scénario réel dépôt→retenue→complément le même jour —
> `GET /mouvements` et export CSV dans l'ordre chronologique, alors que l'ancien tri UUID aurait
> rendu `RETENUE_LOYER, DEPOT_INITIAL, COMPLEMENT` sur ces mêmes données ; liaison V21 vérifiée
> en réel ; invariant ledger 5/5 ; nettoyage transactionnel 0 résidu (compteurs et audit à la
> baseline) ; échafaudage kcadm révoqué. Observation qualifiée **OBS-S10-01** (cosmétique, non
> bloquante) : lignes backfillées V20 à `cree_le` identique triées par UUID — aucun cas en
> Production. Décision et preuves :
> `docs/cgpa/09-production/gate-production-v1.8.0-decision.md` §8. **Prochaine étape autorisée** :
> Préflight Production `1.8.0` (backup + vérifications lecture seule §4.2, release notes,
> promotion CHANGELOG `[1.8.0]`), puis déploiement technique — **décisions distinctes, le
> déploiement n'est pas autorisé par ce Gate seul.**
>
> **Gate Production Sprint 10 (release `1.8.0`) — instruction initiale : NO GO en l'état, en
> attente d'arbitrage PO sur RSV-S10-02 (2026-07-04).** Candidat **`sha-2c5f43c7`** (merge PR #173 —
> Sprint 10 EP-12b US-95/96/97 + correctif RSV-S10-01, digests GHCR relevés), version **`1.8.0`**
> (MINOR). Tous les critères de la checklist sont PASS sauf un, procédural : le candidat incluant
> le correctif exigé par le Gate Staging est **postérieur** au tag validé en Staging
> (`sha-1d1c2a5d`) — delta d'un seul commit backend (`71a7a73`), jamais stagé. Consigné
> **RSV-S10-02 (bloquante)**, deux options au PO : **S1** redéploiement Staging ciblé du candidat
> (bascule de tag seule, aucune migration, vérification live de l'ordre intra-jour sur les
> mouvements réels du 2026-07-04) — **recommandée** ; **S2** acceptation écrite du delta non
> stagé. Profil de risque nettement plus bas que `1.7.0` : **V21 additive** (FK nullable, aucun
> backfill), **rollback applicatif seul viable** vers `sha-6a358eb6` (contraste explicite avec
> RSV-S9-03/V20). Conditions de Préflight définies (vérifications lecture seule `cree_le`,
> invariant 3/3, colonne absente — la lecture directe de Production n'a pas été effectuée à
> l'instruction, hôte non sollicité). Release notes `1.8.0` et promotion CHANGELOG `[1.8.0]` à
> produire avant déploiement (ligne du correctif RSV-S10-01 ajoutée à `[Non publié]`). Décision :
> `docs/cgpa/09-production/gate-production-v1.8.0-decision.md`. **Aucun déploiement Production
> n'est autorisé par ce document.**
>
> **RSV-S10-01 LEVÉE — tri stable du ledger intra-jour (2026-07-04, ~14:42 UTC).** Correctif
> mergé sur `main` via **PR #173** (commit `71a7a73`, merge `2c5f43c7`, CI 7/7 verte) :
> `garantie_movement.cree_le` (`TIMESTAMPTZ DEFAULT now()`, présent depuis V20 mais non mappé
> côté JPA) mappé en lecture seule, tri du ledger rendu stable `date_mouvement, cree_le, id` —
> appliqué au repository des mouvements US-97 **et** au chargement par lot de l'export RGPD.
> Test d'intégration ajouté (`DEPOT_INITIAL → RETENUE_LOYER → COMPLEMENT` le même jour, ordre
> vérifié sur `GET /mouvements`). **Aucune migration Flyway** — compteur smoke inchangé 21/21.
> La condition posée par le Gate Staging Sprint 10 pour le Gate Production (« traitement de
> RSV-S10-01 ») est satisfaite ; le correctif étant postérieur à `sha-1d1c2a5d`, il devra être
> **inclus dans le tag candidat** retenu au Gate Production Sprint 10. Addendum §9 :
> `docs/cgpa/07-devsecops/gate-staging-sprint10-v5.4.1-decision.md`. **Cette levée n'autorise
> aucune promotion Staging ni Production** — décisions distinctes, non prises à ce stade.
>
> **Gate Staging Sprint 10 EP-12b Garantie usage métier — GO, `STAGING_DEPLOYED` (2026-07-04,
> ~10:59 UTC).** Tag immuable **`sha-1d1c2a5d`** (merge PR #168) déployé sur `ai-test-server`
> (accès via IP privée `172.31.11.102` — SG port 22 restreint aux adresses privées du VPC).
> STG-ISOL-01 PASS avant/après (9 conteneurs `loyertracker-staging-*` + `nginx-proxy-manager`
> intact, restart=0). Sauvegarde pré-déploiement vérifiée (365 Kio, 740 entrées). **Incident de
> déploiement corrigé en ~1 min, sans impact tiers** : première recréation avec le pattern
> Compose Production (base+overlay) → fusion des listes `ports`, bind 80 refusé par le noyau
> (port NPM) ; invocation canonique Staging rétablie (`-f docker-compose.staging.yml` seul,
> vérifiée sur les labels Compose). Flyway **V21 appliquée** (`paiement.garantie_movement_id`),
> 21/21. Smoke **59/0 au premier passage** — compteur Flyway aligné **avant** déploiement
> (PR #171), défaut récurrent R-S04-1 anticipé pour la première fois. US-95/96/97 **vérifiées
> manuellement en direct sur l'API réelle** (20 contrôles : retenue 400/200/409 + transition
> RECU + liaison V21, complément, mouvements + export CSV, invariant ledger 4/4, nettoyage
> synthétique 0 résidu, échafaudage kcadm révoqué). **Nouvelle réserve RSV-S10-01 (non
> bloquante)** : ordre intra-jour du ledger non déterministe (`date_mouvement` est un `DATE`,
> tie-break sur UUID aléatoire — constaté en réel : `RETENUE_LOYER, DEPOT_INITIAL, COMPLEMENT`
> le même jour) ; sans impact sur les soldes/invariant, correction d'un critère de tri stable
> attendue **avant le Gate Production Sprint 10** (assignée backend, 2026-07-04). Décision :
> `docs/cgpa/07-devsecops/gate-staging-sprint10-v5.4.1-decision.md`. **Ce Gate n'autorise
> aucune promotion Production** — décision distincte, non prise à ce stade.
>
> **Release `1.7.0` CLÔTURÉE — CDO GO (2026-07-04, ~10:45 UTC).** Les cinq jalons du cycle sont
> PASS : PR #152 (Sprint 9 EP-12a US-94) → Gate Staging → Gate Production (GO sous réserve
> acceptée, condition A1) → Préflight/backup + déploiement `sha-6a358eb6` + smoke 59/0 →
> Hypercare T0 + checkpoint combiné T+12/T+24 (bandeau ci-dessous). US-94 confirmée en
> Production : V20 opérationnelle, backfill vérifié, invariant du ledger 3/3, `depotGarantie`
> dérivé cohérent. Réserves : RSV-PROD-S9-01, RSV-S7-8-01, RP-160-03 **levées** ; RSV-S9-03
> **acceptée permanente** (aucun rollback applicatif seul viable pour ce schéma — consignée) ;
> `BackupHeartbeatMissing` qualifiée sans impact (pushgateway purgé au boot, backup réel ~21 h
> < 26 h). Dossier : `docs/cgpa/09-production/cloture-release-v1.7.0.md` ; `docs/prod-state.md`
> §0H mis à jour. **Prochaine action autorisée** : promotion Sprint 10 (EP-12b, sur `main` via
> PR #168) selon le parcours gouverné — Gate `STG-ISOL-01` puis Gate Staging v5.3 — ou autre
> priorité du backlog PO.
>
> **Hypercare Production `1.7.0` — checkpoint combiné T+12 (rattrapage) / T+24 (anticipé)
> exécuté le 2026-07-04 à 10:18 UTC, PASS.** Écarts de fenêtre qualifiés et tranchés par le PO
> (précédents `1.3.0`/`1.4.0`) : le serveur de production était **volontairement éteint pendant
> la nuit** (pratique documentée, produit non annoncé) et démarré à ~09:09 UTC — le T+12
> (fenêtre 01:15–02:15 UTC) était matériellement inexécutable ; le T+24 est anticipé de ~3 h 27
> sur décision explicite du PO, en checkpoint unique. Résultats : 8/8 conteneurs Up, 4/4
> `(healthy)`, restart=0 ; `LOYERTRACKER_TAG=sha-6a358eb6` et digests API `sha256:485c8574…` /
> Web `sha256:70ae97f2…` conformes au Gate Production (zéro dérive) ; Flyway 20/20 ; Actuator
> UP ; Prometheus 5/5 up ; p99 ~24,7 ms ; 5xx=0 ; 401≈2/h ; Hikari pending=0 ; charge 0,00,
> mémoire 2,0 Gio dispo, disque 31 Go libres ; **0 erreur API depuis le boot** (seules entrées
> ERROR : les 2 `duplicate key` du smoke du 2026-07-03, déjà qualifiées au T0) ; invariant
> `garantie.solde_actuel = Σ mouvements` **3/3 PASS**. Un point qualifié sans impact : alerte
> `BackupHeartbeatMissing` active + métriques pushgateway absentes — pushgateway purgé par le
> reboot et cron backup (02:15 UTC) non joué hôte éteint ; dernier backup réel du 2026-07-03
> 13:13 UTC (~21 h, sous seuil 26 h), résorption attendue au prochain cron. Accès strictement
> en lecture (aucune mutation Docker/`.env`/DB). **Les critères techniques de clôture `1.7.0`
> sont satisfaits ; la clôture reste suspendue à la décision CDO GO** (étape distincte, non
> prise à ce stade). Dossier : `docs/cgpa/09-production/plan-etape-hypercare-v1.7.0.md`.
>
> **Sprint 10 EP-12b Garantie usage métier (US-95/96/97) — clôturé côté `main` : PR #168 mergée
> le 2026-07-04T09:43:51Z** (merge commit `1d1c2a5d`) par `jptshilombo`. Contenu : **US-95**
> (retenue explicite sur loyer impayé — jamais automatique, ADR-14 §5 : endpoint
> `retenue-loyer`, transition du paiement couvert vers `RECU`/`PARTIEL`, recalcul des honoraires,
> liaison `paiement.garantie_movement_id` via migration **V21**), **US-96** (réapprovisionnement
> `complement` avec motif, audit `COMPLEMENT_GARANTIE`), **US-97** (historique des mouvements :
> endpoints `mouvements` + export CSV échappé anti formula-injection, UI triable/filtrable,
> export RGPD incluant le ledger complet sans N+1). Correctif embarqué : `restituerPartiel`
> calculait depuis le montant initial au lieu du `soldeActuel` courant — inoffensif avant ce
> sprint, critique dès qu'une retenue/complément existe. ADR-14 §8 exécuté
> (`sommeMontantDeposeParBail` recalculé depuis le ledger), addendum daté 2026-07-03. La CI a
> échoué une première fois sur les deux Quality Gates SonarQube : backend `new_violations` 5
> (S1192 littéral dupliqué, S6809 auto-invocation `@Transactional` via `this`, 3× S5838 style
> d'assertions) et frontend `new_coverage` 52,3 % < 80 % (`garanties-bail.component.ts` couvert
> 1/168 lignes). Corrigés par le commit `b0b797f` (constante `CIBLE_AUDIT_GARANTIE`, extraction
> `chargerMouvements()` hors auto-invocation proxy, assertions AssertJ idiomatiques, spec
> composant 17 tests + spec S03ApiService 4 méthodes EP-12b → fichiers PR couverts à 94,6 %/
> 100 %), **pré-validé contre l'instance SonarQube réelle avant push** (backend PASSED, frontend
> PASSED — même pratique que PR #81). CI finale intégralement verte (Backend 133 tests, Frontend
> 85 tests, CodeQL ×2, Sécurité, Packaging Docker). **Ce merge clôture le Sprint ; il n'autorise
> aucune promotion Staging ni Production** — décisions distinctes, non prises à ce stade.
> Réserves ouvertes inchangées ; hypercare `1.7.0` (T+12/T+24 du 2026-07-04) suit son propre
> calendrier, non affectée.
>
> **RSV-S7-8-01 LEVÉE — vérification visuelle USD/CDF en conditions réelles (2026-07-03).** Aucun
> bail réel USD/CDF n'existant en Production, vérification menée sur `ai-test-server` (Staging) :
> **USD** confirmé sur le seul bail réel en USD (`64454f13-…`, bailleur `jordan.test@loyerpro.org`)
> — quittance PDF générée via l'API réelle (`GET .../paiements/2026-01/quittance`), affiche
> correctement `$700.00` (loyer, provision, total), conforme au format ADR-13. **CDF** : aucun bail
> réel n'existe dans cette devise nulle part — bien/bail/pointage synthétiques créés temporairement
> sur `bailleur-test@test.local` (montant 1 500 000,00 CDF), quittance générée et vérifiée
> (`1 500 000,00 CDF`, séparateur de milliers et virgule décimale conformes ADR-13), puis
> **entièrement nettoyée** (bien, bail, 13 paiements supprimés ; adresse de profil temporairement
> renseignée pour lever le 409 « adresse manquante », restaurée à `NULL` après coup). Aucune donnée
> réelle affectée, `directAccessGrantsEnabled` confirmé `false` après. Réserve levée après un
> report depuis le Gate Staging Sprint 7+8 (2026-07-02).
>
> **RP-160-03 LEVÉE — `CHANGELOG.md` scindé (2026-07-03).** `[Non publié]` mélangeait le contenu
> de trois releases déjà déployées, jamais promu depuis le Gate `1.6.0`. Scindé en **`[1.5.0]` —
> 2026-07-01** (Sprint 6 : RGPD export/effacement locataire US-70, CSP Nginx US-72), **`[1.6.0]` —
> 2026-07-02** (Sprint 7 Patrimoine enrichi US-90, Sprint 8 Devise/Money US-92/93), **`[1.7.0]` —
> 2026-07-03** (Sprint 9 Garantie ledger US-94). Liens de comparaison (`compare/vX...vY`) mis à
> jour en conséquence. Dette pré-existante, sans lien direct avec Sprint 9, mais traitée
> maintenant à la demande explicite du PO.
>
> **Hypercare Production `1.7.0` — T0 exécuté le 2026-07-03 à ~13:45 UTC, PASS sous
> surveillance.** 8/8 conteneurs Up, 4/4 `(healthy)`, restart=0. Tag `sha-6a358eb6` conforme.
> Flyway 20/20. Actuator UP. Prometheus 5/5 up. Alertmanager `[]`. p99 ~47 ms (cohérent avec la
> charge du smoke qui vient de s'achever), 5xx=0, Hikari pending=0. Heartbeat backup ~31 min.
> 1 erreur qualifiée (`duplicate key`, smoke inscription 409 — attendue), aucune erreur
> inattendue. Invariant `garantie.solde_actuel = Σ mouvements` vérifié 3/3. Plan :
> `docs/cgpa/09-production/plan-etape-hypercare-v1.7.0.md`. T+12 prévu le 2026-07-04 à ~01:45 UTC
> ± 30 min ; T+24 le 2026-07-04 à ~13:45 UTC ± 30 min.
>
> **`PRODUCTION_DEPLOYED` — Déploiement Production Sprint 9 `1.7.0` — 2026-07-03 ~13:35 UTC.**
> Tag **`sha-6a358eb6`** déployé sur `loyertracker-prod-server`. `api`+`nginx` recréés ciblés,
> aucun écart, `postgres`/`keycloak` inchangés. Flyway **V20 appliquée** : table
> `garantie_movement` (RLS FORCE), backfill rétroactif sur 3 garanties (dont les 2 reconstituées
> par l'option A1 au Préflight), `bail.depot_garantie` supprimée — vérifié sans erreur. **RSV-
> PROD-S9-01 confirmée résolue en conditions réelles** : les 2 baux auparavant orphelins ont
> désormais un mouvement `DEPOT_INITIAL` cohérent et un `solde_actuel` correct. Smoke Production
> **59 PASS / 0 FAIL** (après correctifs : synchronisation du dépôt sur l'hôte, resté 40 commits
> en retard sur `main`, et réactivation temporaire de `bailleur-test@test.local`). Nettoyage
> transactionnel complet (bailleur2-smoke + gest-smoke supprimés DB+KC, compteurs identiques à la
> baseline `1.6.0`, garanties passées de 1 à 3 conformément à A1). `.env` persisté
> `sha-6a358eb6` (backup `.env.bak-pre-1.7.0`). Prometheus 5/5 up, Alertmanager 0 alerte.
> Rapports : `docs/cgpa/09-production/deploiement-technique-v1.7.0-report.md`,
> `docs/cgpa/09-production/validation-finale-v1.7.0-report.md`. **Réserves restant ouvertes** :
> RSV-S9-03 (aucun rollback applicatif seul viable, acceptée par le PO — permanente pour ce
> schéma), RSV-S7-8-01 et RP-160-03 (héritées de `1.6.0`, non bloquantes). **Hypercare
> T0/T+12/T+24 requis avant clôture `1.7.0`.**
>
> **Préflight Production `1.7.0` — PASS, RSV-PROD-S9-01 levée (2026-07-03).** Sauvegarde
> pré-déploiement exécutée et vérifiée (`loyertracker-20260703-131331.dump`, 316 Kio, SHA-256
> `3e83a277…`, `pg_restore --list` 730 entrées OK). **Option A1 exécutée** : 2 lignes `garantie`
> reconstituées pour les baux `659ea02c-…`/`cb653273-…` (600,00 chacune, `type_garantie=CAUTION`,
> `date_depot` = date de début du bail, cohérent avec la garantie sœur déjà existante sur le même
> bailleur), pendant que `bail.depot_garantie` existait encore. Vérifié : 3/3 baux ont désormais
> une garantie correspondante, montants cohérents. 8/8 conteneurs Up, 4/4 healthy, restart=0. Tag
> `sha-2da27182` (`1.6.0`) inchangé, Flyway 19/19 (V20 pas encore appliquée). Rapport :
> `docs/cgpa/09-production/preflight-backup-v1.7.0-report.md`. **Les deux conditions bloquantes du
> Gate Production `1.7.0` sont désormais levées.** Prochaine étape autorisée : déploiement
> technique `1.7.0` (`api`+`nginx`, migration V20), sous décision distincte.
>
> **Arbitrage PO — Gate Production Sprint 9 (`1.7.0`) : GO sous réserve (2026-07-03, jordan).**
> Sur RSV-PROD-S9-01 (2 baux réels perdraient l'affichage de leur dépôt après V20) : **option A1
> retenue** — reconstitution des 2 garanties manquantes au Préflight, avant application de la
> migration, pendant que `bail.depot_garantie` existe encore. Sur RSV-S9-03 (aucun rollback
> applicatif seul pour V20) : **acceptée explicitement** par le PO. Les deux conditions bloquantes
> du Gate Production sont levées côté gouvernance ; reste l'exécution effective de A1 au
> Préflight, avec vérification, avant la migration V20. Décision mise à jour :
> `docs/cgpa/09-production/gate-production-v1.7.0-decision.md`.
>
> **Gate Production Sprint 9 EP-12a (release `1.7.0`) — NO GO, en attente d'arbitrage PO
> (2026-07-03).** Analyse produite depuis `STAGING_DEPLOYED` (`sha-6a358eb6`). En vérifiant les
> données réelles de Production, une **anomalie non détectée en Staging** a été découverte : 2 des
> 3 baux réels ont `bail.depot_garantie = 600.00` sans aucune ligne `garantie` correspondante — la
> migration V20 (déjà validée en Staging) ferait afficher `depotGarantie: 0` pour ces 2 baux,
> silencieusement, y compris dans l'export RGPD. Consignée **RSV-PROD-S9-01**, bloquante, 3
> options de remédiation présentées (reconstitution au Préflight / correctif de migration + rejeu
> du Gate Staging / acceptation du risque + recréation post-déploiement), aucune choisie par ce
> document. **RSV-S9-03** (rollback V20 sans option applicative seule, `DROP COLUMN
> bail.depot_garantie`) élevée de « reportée » à **bloquante** en Production (données réelles +
> absence de rollback). Décision : `docs/cgpa/09-production/gate-production-v1.7.0-decision.md`.
> **Aucun déploiement de Sprint 9 en Production n'est autorisé par ce document.**
>
> **Hypercare Production `1.6.0` — T+12 exécuté le 2026-07-03 à ~11:25 UTC, PASS sous
> surveillance (qualifié).** 8/8 conteneurs Up, 4/4 `(healthy)`, restart=0. Tag `sha-2da27182`
> inchangé depuis T0. Flyway 19/19. Actuator UP, `/healthz` ok. Prometheus 5/5 up. p99 ~6,2 ms,
> 5xx=0, Hikari pending=0. 0 erreur critique en logs (60 min). **Écart de planning** : fenêtre
> T+12 (04:50 UTC ± 30 min) fermée depuis ~6h35 au moment du contrôle réel — qualifié retard de
> process, sans signal d'incident pendant la fenêtre elle-même. **1 alerte constatée puis
> remédiée dans la même session** : `BackupHeartbeatMissing` (démarrée 07:19 UTC, après la
> fenêtre T+12), causée par le daemon `cron` de l'hôte redémarré seulement à 07:48:37 UTC (a
> raté l'exécution planifiée de 02:15 UTC) — **même cause récurrente que RSV-T24-01** (hypercare
> `1.4.0`). Remédiation : sauvegarde manuelle exécutée (`loyertracker-20260703-124953.dump`,
> 316 Kio, SHA-256 `8535ea8f…`, `pg_restore --list` 730 entrées OK), heartbeat repoussé,
> Alertmanager confirmé `[]` après. Plan : `docs/cgpa/09-production/plan-etape-hypercare-v1.6.0.md`.
> T+24 inchangé, prévu le 2026-07-03 à 16:50 UTC ± 30 min.
>
> **Gate Staging Sprint 9 EP-12a Garantie ledger — GO, `STAGING_DEPLOYED` (2026-07-03).** Tag
> immuable **`sha-6a358eb6`** déployé sur `ai-test-server`. STG-ISOL-01 PASS avant/après (9
> conteneurs `loyertracker-staging-*`, `nginx-proxy-manager` intact, restart=0). Sauvegarde
> pré-déploiement (`pg_dump -Fc`) effectuée et vérifiée. Flyway **V20 appliquée** : table
> `garantie_movement` (RLS `FORCE`), backfill rétroactif, `bail.depot_garantie` supprimée, total
> 20/20. **Vérification manuelle ligne-à-ligne du backfill** sur les 3 garanties réelles : invariant
> `solde_actuel = Σcrédit − Σdébit` vérifié 3/3 — PASS. Smoke **58 FAIL/1 puis 59/0** (correctif
> compteur Flyway du script, PR #158). Le script de smoke n'exerçant aucun endpoint garantie, le
> **cycle création→restitution a été vérifié manuellement en direct sur l'API réelle**
> (`DEPOT_INITIAL` puis `RESTITUTION` journalisés, invariant vérifié, `audit_log` cohérent) —
> ferme le gap sur l'absence de garantie `RESTITUE_TOTAL` réelle en Staging. Décision :
> `docs/cgpa/07-devsecops/gate-staging-sprint9-v5.4.1-decision.md`. **Réserve RSV-S9-03** :
> rollback de V20 sans option applicative seule (`DROP COLUMN bail.depot_garantie`), restauration
> de backup uniquement — reportée en condition bloquante explicite au **Gate Production** de ce
> sprint (distinct, non autorisé par ce Gate Staging).
>
> **GO PO + GO Release Manager — clôture Sprint 9 EP-12a Garantie ledger (US-94), 2026-07-03
> (jordan).** Validation PO de clôture du sprint tracée (s'ajoute au GO de cadrage sprint-par-sprint
> du 2026-07-01 et à l'arbitrage kickoff `bail.depot_garantie` du 2026-07-02, ADR-14 §8) : **GO**,
> aucune réserve. Validation Release Manager de recevabilité du candidat `sha-6a358eb6` pour
> promotion Staging : **GO**, aucune réserve (CI 7/7 verte, `CHANGELOG.md`/`project-state.md` à
> jour). Ceci lève **RSV-S9-02** (`gate-staging-sprint9-v5.4.1-decision.md` §4/§7). Reste ouvert
> avant `STAGING_DEPLOYED` : sauvegarde Staging pré-déploiement, `STG-ISOL-01`, vérification
> manuelle ligne-à-ligne du backfill V20 sur les garanties réelles, smoke Staging complet.
>
> **PR #152 fusionnée dans `main` — Sprint 9 EP-12a Garantie ledger (US-94), 2026-07-02 18:28
> UTC.** Merge commit `6a358eb6` (base `main`, branche `feat/sprint9-garantie-ledger-ep12a`,
> commits `dc89c3a` + `2b50290`). CI GitHub complète **verte** (7/7) : CodeQL (java-kotlin,
> javascript-typescript), Backend (build + tests + couverture), Frontend (build + tests),
> Packaging Docker, Sécurité (gitleaks + SCA + Trivy). Ceci lève la condition « PR dédiée + CI
> GitHub complète » mentionnée ci-dessous. **Reste ouvert avant clôture Sprint 9** : vérification
> manuelle du backfill V20 en Staging avec les garanties réelles (non remplacée par les tests
> automatisés, risque élevé de cette migration rétroactive) — soumise au Gate `STG-ISOL-01`
> avant toute promotion Staging (environnement mutualisé `ai-test-server`). Fusion `main`
> **n'autorise aucune promotion Staging ni Production** par elle-même.
>
> **RSV-S9-01 — 2 alertes Dependabot ouvertes sur `main`, réserve non bloquante (2026-07-02).**
> `@babel/core` 7.28.3 (severity low, CVE-2026-49356, lecture arbitraire de fichier via
> `sourceMappingURL`, correctif 7.29.6) et `uuid` 8.3.2 (severity moderate, CVE-2026-41907,
> absence de vérification des bornes du buffer v3/v5/v6, correctif 11.1.1). Les deux sont des
> dépendances **transitives de la toolchain de build** (`@angular-devkit/build-angular` →
> `@angular/compiler-cli` pour `@babel/core` ; `@angular-devkit/build-angular` →
> `webpack-dev-server` → `sockjs` pour `uuid`), absentes du bundle Production —
> `npm audit --omit=dev` confirme **0 vulnérabilité** en scope production. Seul correctif
> disponible aujourd'hui (`npm audit fix --force`) imposerait un downgrade cassant vers
> `@angular-devkit/build-angular@15.2.11` — écarté. **Action différée** : réévaluer au prochain
> `ng update` d'Angular, quand une version amont embarquera des `@babel/core`/`uuid` corrigés.
> Sans impact sur les Gates Staging/Production ni sur la clôture Sprint 9.
>
> **Sprint 9 EP-12a Garantie ledger (US-94) — 2026-07-02, implémenté et validé localement, GO
> technique.** Kickoff : arbitrage PO tranché sur `bail.depot_garantie` — devient une valeur
> dérivée du ledger (ADR-14 §8, statut passé à **Acceptée**), colonne supprimée. Migration **V20** :
> `garantie_movement` (ledger append-only, RLS pattern V12), `garantie.solde_actuel` (cache
> transactionnel synchrone, `garantie.statut` inchangé — batch `GARANTIE_NON_RESTITUEE` non
> régressé), backfill rétroactif des garanties existantes (`DEPOT_INITIAL` + `AJUSTEMENT`/
> `RESTITUTION` selon l'état), `ALTER TABLE bail DROP COLUMN depot_garantie`. `GarantieService`
> journalise désormais chaque mouvement (création, restitution) avec audit dédié. Frontend :
> champ « Dépôt » retiré du formulaire de création de bail (dépôt déclaré via le flux « Ajouter
> garantie » existant). Tests : **128/128 backend** (`mvn -o verify`, dont
> `GarantieLedgerBackfillMigrationTest` nouveau — 3 scénarios de backfill + invariant solde ==
> somme des mouvements, et l'extension de `S03PaiementsGarantiesIntegrationTest` sur le cycle
> complet création→restitution), **63/63 frontend** (`ng test`), `ng build` propre. Aucun nouvel
> usage métier exposé (retenue typée, réapprovisionnement, historique UI — Sprint 10, US-95→98).
> Rapport : `docs/cgpa/06-planification-agile/sprint-9-garantie-ledger-rapport-validation.md`.
> **Reste avant fusion `main`** : PR dédiée + CI GitHub complète, puis vérification manuelle du
> backfill en Staging avec les garanties réelles (non remplacée par les tests automatisés, cf.
> Plan d'Exécution — risque élevé de cette migration rétroactive).
>
> **Hypercare Production `1.6.0` — T0 exécuté le 2026-07-02 à 17:11 UTC, PASS sous surveillance.**
> 8/8 Up, 4/4 `(healthy)`, restart=0. Tag `sha-2da27182` conforme, digests API/Web identiques au
> Gate Production. Flyway 19/19. Actuator UP. Prometheus 5/5 up. Alertmanager 0 alerte. p99 ~47 ms,
> 5xx=0, Hikari pending=0. Heartbeat backup présent (~65 min, poussé au Préflight). 2 erreurs
> qualifiées (`duplicate key bailleur_keycloak_id_key`, smoke inscription 409 — attendues), aucune
> erreur inattendue. Point de vigilance particulier pour ce cycle (cf. Gate Production `1.6.0`) :
> surveiller toute erreur 500 à l'inscription d'un nouveau bailleur (signal du risque
> contrainte `NOT NULL` V19 vs ancien code en cas de rollback). Plan :
> `docs/cgpa/09-production/plan-etape-hypercare-v1.6.0.md`. T+12 prévu le 2026-07-03 à 04:50 UTC
> ± 30 min ; T+24 le 2026-07-03 à 16:50 UTC ± 30 min.
>
> **`PRODUCTION_DEPLOYED` — Déploiement Production Sprint 7+8 `1.6.0` — 2026-07-02 16:50 UTC.**
> Tag **`sha-2da27182`** déployé sur `loyertracker-prod-server`. Smoke Production **59 PASS / 0
> FAIL** (dont vérification comportementale US-90 : `POST /api/patrimoines` avec `adresse`
> obligatoire confirmé 201 ; honoraire EUR recalculé correctement via le VO `Money`, US-92/93).
> Flyway **19/19** confirmé live par le smoke. Nettoyage transactionnel complet (bailleur2-smoke
> + gest-smoke supprimés DB+Keycloak, `bailleur-test@test.local` réactivé puis redésactivé,
> `directAccessGrantsEnabled` révoqué, aucun orphelin détecté). Compteurs post-nettoyage
> identiques à la baseline `1.5.0` (75 paiements, 81 alertes, 2 audit_log, 1 garantie inchangée).
> `.env` persisté `sha-2da27182` (backup `.env.bak-pre-1.6.0`, permissions 600). Prometheus 5/5
> up, Alertmanager 0 alerte. Rapport : `docs/cgpa/09-production/validation-finale-v1.6.0-report.md`.
> **Réserves restant ouvertes** : RSV-S7-8-01 (vérification visuelle USD/CDF, non bloquante,
> aucun bail réel dans ces devises en Production) ; RP-160-03 (`CHANGELOG.md` à scinder
> `[1.5.0]`/`[1.6.0]`, action Release Manager avant clôture). **Hypercare T0/T+12/T+24 requis
> avant clôture `1.6.0`.**
>
> **Déploiement technique `1.6.0` — 2026-07-02 16:22–16:25 UTC, PASS technique.** Artefact
> `sha-2da27182` déployé sur `loyertracker-prod-server`. `api` + `nginx` recréés ciblés — cette
> fois **aucun écart** : `postgres`/`keycloak` restés `Running` inchangés (contrairement à
> l'anomalie non ciblée observée au déploiement `1.5.0`). Digests API/Web vérifiés conformes au
> Gate Production **avant** recréation. **Flyway V19 appliquée** : « Successfully applied 1
> migration... now at version v19 » — backfill générique `"Adresse à renseigner"` confirmé sur
> le patrimoine `d753e6d6-…`, aucune perte de données (2 bailleurs, 3 biens, 3 baux présents).
> 4/4 `(healthy)`, restart=0. Actuator UP, `/healthz` `ok`, CSP conforme. Prometheus 5/5, Alertmanager
> 0 alerte (l'alerte `BackupHeartbeatMissing` du Préflight est résolue). `.env` **non modifié**
> (`sha-08b366fa` persiste jusqu'à validation finale) — `PRODUCTION_DEPLOYED` non atteint.
> Rapport : `docs/cgpa/09-production/deploiement-technique-v1.6.0-report.md`.
>
> **Adresse réelle du patrimoine appliquée — RP-160-05 LEVÉE (2026-07-02).** Écart qualifié et
> accepté par le PO : appliquée par **mise à jour SQL directe** sur `patrimoine`
> (`d753e6d6-564e-4e6d-91c4-09a7c3265a91`) au lieu de `PUT /api/patrimoines/{id}` prévu au plan,
> faute de jeton Bearer valide pour le compte bailleur réel (`hasRole('BAILLEUR')` +
> vérification de propriété non contournables sans authentification réelle). Les 6 champs
> (`adresse`, `quartier`, `commune`, `ville`, `province_etat`, `pays`) appliqués et vérifiés par
> `SELECT` — conformes au mapping communiqué par le PO. Détail : `deploiement-technique-v1.6.0-report.md`
> §5. Prochaine étape : validation finale `1.6.0` (smoke Production, `PRODUCTION_DEPLOYED`).
>
> **Préflight + backup Production `1.6.0` — 2026-07-02, PASS. RP-160-01 et RP-160-02 levées.**
> Dump `loyertracker-20260702-170536.dump` (312 Kio, SHA-256 `e95064d4…`), globals SHA-256
> `267cae88…`, permissions 600, `pg_restore --list` 730 entrées OK. 8/8 conteneurs Up, 4/4
> healthy, restart=0. Tag `sha-08b366fa` (`1.5.0`) conforme, digests API/Web conformes au Gate
> Production `1.5.0`. Flyway 18/18 (V19 pas encore appliquée). **Recomptage `patrimoine.adresse
> IS NULL` : 1/1, sans écart** par rapport au comptage du 2026-07-01 (même ligne
> `d753e6d6-564e-4e6d-91c4-09a7c3265a91`) — RP-160-02 levée, migration V19 peut être appliquée
> sans risque de backfill élargi. Prometheus 5/5 up. Alertmanager : 1 alerte
> `BackupHeartbeatMissing` constatée puis résolue par ce Préflight (heartbeat repoussé par le
> script de backup) — écart qualifié, sans rapport avec `1.6.0` (cron backup hôte non fiable hors
> fenêtre de déploiement, cf. historique RSV-T24-01). Capacité : 32 Gio libres, 2,0 Gio RAM
> disponible, charge 0,16. Rapport : `docs/cgpa/09-production/preflight-backup-v1.6.0-report.md`.
> Prochaine étape : déploiement technique `1.6.0` (`api` + `nginx`, migration V19), sous décision
> distincte.
>
> **Gate Production Sprint 7 + Sprint 8 — GO sous réserve, `PRODUCTION_READY` (2026-07-02).**
> Release **`1.6.0`**, artefact `sha-2da27182` (commit `2da2718`, candidat figé — vérifié par diff
> qu'aucun code applicatif/Nginx/Compose n'a changé depuis, PR #145/#146 postérieures étant
> documentaires/outillage de test uniquement). Périmètre : Sprint 7 EP-10 US-90 (Patrimoine
> enrichi, migration V19) + Sprint 8 EP-11 US-92/93 (VO `Money`, devise Paiements/Honoraires).
> Preuves Staging complètes (STG-ISOL-01 PASS, Flyway 19/19, smoke 59/0). **Conditions bloquantes**
> avant déploiement technique : RP-160-01 (backup Production vérifié), RP-160-02 (recomptage
> `patrimoine.adresse IS NULL` avant migration — dernier comptage connu 1/1, à reconfirmer).
> **Point d'attention architecture** : la contrainte `NOT NULL` posée par V19 sur
> `patrimoine.adresse` rend un rollback applicatif seul (sans défaire le schéma) risqué si une
> inscription a eu lieu post-déploiement — l'ancien `InscriptionService` créerait un patrimoine
> sans adresse, provoquant un 500. Procédure de rollback à deux niveaux documentée (§Rollback du
> Gate). Réserves non bloquantes : RP-160-03 (`CHANGELOG.md` — Sprint 6 jamais promu en `[1.5.0]`,
> à corriger avant clôture `1.6.0`), RP-160-04 (RSV-S7-8-01, vérification visuelle USD/CDF
> recommandée), RP-160-05 (adresse réelle du patrimoine `d753e6d6-…` à appliquer via
> `PUT /api/patrimoines/{id}` immédiatement après déploiement). Document :
> `docs/cgpa/09-production/gate-production-v1.6.0-decision.md`. Release notes :
> `docs/release-notes-v1.6.0.md`. Prochaine étape autorisée : Préflight + backup Production
> `1.6.0` (sous réserve RP-160-01/02 levées), **aucun déploiement autorisé par cette seule
> analyse**.
>
> **Gate Staging Sprint 7 + Sprint 8 — GO, `STAGING_DEPLOYED` (2026-07-02).** Tag **`sha-2da27182`**
> déployé sur `ai-test-server` : rattrapage combiné du Sprint 7 EP-10 US-90 (PR #131, jamais passé
> son propre Gate Staging — écart qualifié et accepté par le PO) et du Sprint 8 EP-11 US-92/93
> (PR #143/#144/#145). STG-ISOL-01 PASS avant/après (9 conteneurs `loyertracker-staging-*`,
> `nginx-proxy-manager` intact, restart=0). Flyway **V19 appliquée** (`patrimoine.adresse` NOT
> NULL + 7 colonnes optionnelles, backfill générique), total 19/19 ; aucune migration pour Sprint 8
> (`bail.devise` existe depuis V17). Premier smoke 4 FAIL (`POST /api/patrimoines` sans `adresse`,
> devenue `@NotBlank` — script jamais exercé contre le code Sprint 7 réel) ; correctif du script
> seul (PR #145, aucun code applicatif touché) → **59 PASS / 0 FAIL**. Réserve **RSV-S7-8-01**
> (non bloquante) : confirmation visuelle USD/CDF (quittance PDF + panneaux Paiements/Honoraires)
> recommandée avant Gate Production. Décision :
> `docs/cgpa/07-devsecops/gate-staging-sprint7-8-v5.4.1-decision.md`. Prochaine action autorisée :
> Gate Production (Sprint 7 et/ou Sprint 8, distinct, aucune promotion autorisée par ce Gate
> Staging).
>
> **Sprint 8 EP-11 (Money/Devise, US-92/93) — intégré à `main` via PR #143 (2026-07-02), GO technique.**
> PR #143 fusionnée (merge par `jptshilombo`) après CI GitHub intégralement verte (CodeQL
> Java/Kotlin + JS/TS, Backend, Frontend, Sécurité Gitleaks/SCA/Trivy, Packaging Docker — 7/7).
> `main` synchronisé par fast-forward. Le Sprint n'est pas encore promu : prochaines étapes =
> Gate Staging (avec `STG-ISOL-01` live sur `ai-test-server`) → Gate Production distinct, aucune
> promotion autorisée par ce merge.
>
> **Sprint 8 EP-11 (Money/Devise, US-92/93) — 2026-07-02, implémenté et validé localement, GO technique.**
> VO `Money(montant, devise)` (`com.loyertracker.baux.Money`) corrigeant le bug réel de
> `DocumentHtmlBuilder.euros()` (« € » codé en dur quelle que soit la devise du bail) — formats
> tranchés au kickoff : EUR `800,00 €`, USD `$1,000.00`, CDF `1 000,00 CDF` (échappement Unicode
> ` ` explicite, backend et frontend, pas de caractère invisible en source). `DonneesDocument`
> porte désormais des `Money` ; `QuittanceService.assembler()` résout `bail.getDevise()`. US-93 :
> `PaiementDto`/`HonoraireDto` exposent `devise` (résolue via le bail parent pour un paiement, via
> le bail le plus récent du bien pour un honoraire — approximation documentée, `Honoraire` n'ayant
> pas de lien direct vers un bail ; endpoint `HonoraireService.changerStatut()` en repli EUR sans
> impact utilisateur, le frontend re-fetchant systématiquement après ce PATCH).
> `MoneyFormatPipe` partagé côté frontend, câblé sur Paiements/Honoraires + cohérence sur les deux
> dashboards (Bail affichait déjà la devise mais sans formatage). Aucune migration Flyway requise
> (`bail.devise` existe depuis V17), aucune duplication de colonne devise introduite (ADR-13).
> Tests : **122/122 backend** (`mvn verify`, dont `MoneyTest` et `DocumentHtmlBuilderTest`
> paramétré sur les 3 devises), **63/63 frontend** (`ng test`), `ng build` et `ng lint` propres.
> ADR-13 (D-DEV-001) statut **Acceptée**. Reste avant fusion `main` : PR dédiée + CI GitHub
> complète.
>
> **Kickoff Sprint 8 — EP-11 : `Money` Value Object — 2026-07-02, prérequis bloquant levé, GO codage.**
> Décisions PO actées au kickoff (ADR-13, `D-DEV-001`, statut **Acceptée**) : **(1)** format
> d'affichage par devise — style local par devise, pas de gabarit uniforme : EUR `800,00 €`, USD
> `$1,000.00`, CDF `1 000,00 CDF` ; **(2)** périmètre **US-93 confirmé inclus** (affichage devise
> sur les vues Paiements/Honoraires frontend), en plus d'US-92 (VO `Money` + correctif
> `DocumentHtmlBuilder`/`QuittanceService`, bug réel : suffixe `"€"` codé en dur quelle que soit
> la devise du bail). Aucune migration Flyway requise (`bail.devise` existe depuis V17, aucune
> duplication introduite sur `Paiement`/`Honoraire`/`Garantie`). Plan :
> `docs/cgpa/06-planification-agile/plan-execution-evolutions-ep10-ep13.md` (Sprint 8). Codage à
> suivre. Aucun Gate Staging/Production autorisé par ce kickoff.
>
> **Maintenance CI/dépendances — 2026-07-02, terminée, aucun impact Gate/Sprint/Staging/Production.**
> Neuf PR traitées, toutes fusionnées via merge commit sur `main` après CI GitHub intégralement
> verte (Backend, Frontend, CodeQL Java/Kotlin + JS/TS, Sécurité Gitleaks/SCA/Trivy, Packaging
> Docker) : **#132** (dédup déclenchement push+PR, `ci/fix-concurrency-group-push-pr`), **#134**
> (alerte Dependabot `esbuild` low corrigée par `overrides.esbuild=0.28.1` dans
> `frontend/package.json`, sans bump majeur des outils Angular), **#135** (correctif CI double :
> étape SonarQube sautée sur les PR `dependabot[bot]` — GitHub ne transmet pas les secrets Actions
> du dépôt à ces workflows, d'où un 401 systématique — et ajout d'un groupe `angular` dans
> `.github/dependabot.yml` pour que `@angular/*`/`@angular-devkit/*` soient proposés en une seule
> PR groupée), puis **#104** (`actions/checkout` 6.0.3→7.0.0), **#139** (`typescript-eslint`
> 8.61.1→8.62.1, remplace #103), **#140** (`karma-jasmine-html-reporter` 2.1.0→2.2.0), **#138**
> (`jasmine-core` 5.2.0→6.3.0, dépendait de #140 pour résoudre un conflit peer-dep), **#141**
> (`keycloak-js` 24.0.5→26.2.4), **#136** (`spotless-maven-plugin` backend 2.43.0→3.8.0).
> PR fermées sans merge : **#99/#100/#101/#102** (bumps Angular individuels 20.3.x→22.0.5,
> cassaient `npm ci` par conflit de peer deps croisées — absorbées par le nouveau groupe
> `angular`), et **#137** (PR groupée résultante, bump majeur Angular 20→22 complet — échoue sur
> `npm ci` car `@angular-devkit/build-angular@22.0.5` exige `typescript@">=6.0 <6.1"` alors que le
> projet est pinné `typescript@5.8.3` ; **migration Angular 22 non traitée ici, à planifier comme
> chantier dédié** — TypeScript 6.x + revue des autres breaking changes en cascade). Alertes
> Dependabot restantes après ce lot : **2 ouvertes**, volontairement non corrigées — `@babel/core`
> (low) et `uuid` (moderate), toutes deux transitives via `@angular-devkit/build-angular`
> (dev-tooling uniquement, `npm audit --omit=dev` = 0 vulnérabilité en production), bloquées par
> la même dépendance à la migration Angular 22. Aucun changement fonctionnel, aucune migration
> SQL, aucun déploiement Staging ni Production autorisé par ce lot.
>
> **Sprint 7 EP-10 Patrimoine enrichi (US-90) — 2026-07-01, implémenté et validé localement, GO technique.** Migration **V19** : 7 champs optionnels (`ville, commune, quartier, province_etat, pays, description, reference_interne`) + `patrimoine.adresse` désormais `NOT NULL` (backfill générique, était nullable depuis V16). Prérequis bloquant levé : comptage Production exécuté avant codage — 1 patrimoine total, 1 avec `adresse IS NULL` (« Patrimoine principal », bailleur jptshilombo) ; adresse réelle communiquée par le PO, à appliquer via `PUT /api/patrimoines/{id}` au Gate Production Sprint 7 (non codée en dur dans la migration, qui reste générique pour tous les environnements). US-91 tranchée au kickoff : extension du formulaire inline existant (pas d'écran CRUD dédié). Tests : **111/111 backend** (`mvn -o test`), **59/59 frontend** (`ng test`), build Angular sans erreur. Non-régression EP-09 confirmée (CRUD patrimoine, rattachement bien, isolation cross-bailleur). Rapport : `docs/cgpa/06-planification-agile/sprint-7-patrimoine-enrichi-rapport-validation.md`. Reste avant fusion `main` : PR dédiée + CI GitHub complète.
>
> **Cadrage EP-10/EP-11/EP-12 (Patrimoine enrichi, Devise/Money, Garantie ledger) — 2026-07-01, documentation produite, GO PO sprint par sprint.** Analyse d'impact (`analyse-impact-evolutions-ep10-ep13.md`), Plan d'Exécution 4 sprints gouvernés (`plan-execution-evolutions-ep10-ep13.md`, Sprint 7 Patrimoine → Sprint 8 Devise/Money → Sprint 9/10 Garantie ledger), ADR-12/13/14 (D-PAT-002/D-DEV-001/D-GAR-001) et addendum backlog EP-10→12 (US-90→98, `addendum-backlog-ep10-ep12.md`) produits. Constats clés : Patrimoine est déjà de premier niveau (EP-09 livrée) — seuls les champs manquent, avec un point d'attention sur `patrimoine.adresse` (aujourd'hui nullable, à rendre obligatoire) ; `Bail.devise` existe déjà et n'est dupliqué nulle part, mais `DocumentHtmlBuilder` code en dur « € » sur toutes les quittances/avis d'échéance (bug réel, cœur d'EP-11) ; Garantie est un instantané plat à transformer en ledger (`GarantieMovement`), avec un risque élevé identifié sur la migration rétroactive des garanties Production et la compatibilité du batch d'alertes `GARANTIE_NON_RESTITUEE`. Fin de bail (Évolution 7) : préparation architecture uniquement, aucune nouvelle table nécessaire (absorbée par le ledger Garantie). PO : GO complet donné, sprint par sprint (chaque sprint reste un point de contrôle GO/NO GO distinct avant tout code). Indépendant de la clôture `1.5.0` (Hypercare T0/T+12/T+24 toujours due séparément). Aucun code produit à ce stade — documentation uniquement.
>
> **`PRODUCTION_DEPLOYED` — Déploiement Production Sprint 6 `1.5.0` — 2026-07-01 11:02 UTC.** Tag
> **`sha-08b366fa`** déployé sur `loyertracker-prod-server`. Smoke Production **59 PASS / 0 FAIL**
> (dont 12 assertions RGPD live — export scopé, isolation cross-tenant, effacement locataire
> 403/204, anonymisation confirmée, `audit_log EFFACEMENT_LOCATAIRE`). Flyway 18/18 inchangé.
> Nettoyage transactionnel complet (2 bailleur2-smoke dont 1 orphelin d'une session antérieure,
> 2 gest-smoke), `bailleur-test@test.local` redésactivé, `directAccessGrantsEnabled` révoqué.
> `.env` persisté `sha-08b366fa` (SHA-256 `.env` = `87b102b1…`). Prometheus 5/5 up, Alertmanager
> 0 alerte. Rapport : `docs/cgpa/09-production/validation-finale-v1.5.0-report.md`. **Hypercare
> T0/T+12/T+24 requis avant clôture `1.5.0`.**
>
> **Déploiement technique `1.5.0` — 2026-07-01 09:38–09:40 UTC, PASS technique.** Artefact
> `sha-08b366fa` déployé sur `loyertracker-prod-server`. `api` + `nginx` recréés. **Écart
> constaté (sans impact) :** `postgres`/`keycloak` également recréés par Docker Compose alors
> que seuls `api`/`nginx` étaient ciblés — aucun changement de configuration identifié
> (`docker-compose*.yml`/`.env` inchangés) ; volume `postgres-data` préservé (créé 2026-06-20),
> données vérifiées intactes (3 bailleurs, 4 biens, 4 baux). 4/4 `(healthy)`, restart=0. Flyway
> 18/18 inchangé. Digests API/Web conformes au Gate Production. Actuator UP. CSP Nginx conforme
> (US-72). Prometheus 5/5, Alertmanager 0 alerte. `.env` non modifié — `PRODUCTION_DEPLOYED` non
> atteint. Rapport : `docs/cgpa/09-production/deploiement-technique-v1.5.0-report.md`. Prochaine
> étape : validation finale `1.5.0` (smoke Production, `PRODUCTION_DEPLOYED`).
>
> **Préflight + backup Production `1.5.0` — 2026-07-01, PASS. RP-150-01 levée.** Dump
> `loyertracker-20260701-102523.dump` (316 Kio, SHA-256 `bd003932…`), globals SHA-256
> `22dff9ab…`, permissions 600, `pg_restore --list` 730 entrées OK. 8/8 conteneurs Up, 4/4
> healthy, restart=0. Flyway 18/18, tag `sha-98afa99a` conforme. Prometheus 5/5 up, Alertmanager
> 0 alerte. Capacité : 32 Gio libres, 1,9 Gio RAM dispo, charge 0,11. Rapport :
> `docs/cgpa/09-production/preflight-backup-v1.5.0-report.md`. Prochaine étape : déploiement
> technique `1.5.0` (`api` + `nginx`), sous décision distincte.
>
> **Gate Production `1.5.0` — 2026-07-01, GO sous réserve, `PRODUCTION_READY`.** Artefact
> `sha-08b366fa` (commit `08b366fa9a6ffa6c1e973be5b23861135918315b`, PR #123 — Sprint 6 RGPD
> US-70 + CSP US-72). STG-ISOL-01 PASS, smoke Staging 59/0 (dont 12 assertions RGPD live),
> vérification comportementale export/effacement/CSP PASS. Aucune migration Flyway (V18
> inchangé). Rollback : `sha-98afa99a` (`1.4.0`) sans `pg_restore`. Réserve **RP-150-01**
> (backup pré-déploiement) bloquante avant déploiement technique. Document :
> `docs/cgpa/09-production/gate-production-v1.5.0-decision.md`. Prochaine étape : Préflight +
> backup Production `1.5.0`.
>
> **Gate Staging Sprint 6 — GO, `STAGING_DEPLOYED` (2026-07-01).** Tag **`sha-08b366fa`** (PR #123)
> déployé sur `ai-test-server`. STG-ISOL-01 PASS constaté après déploiement (8 conteneurs
> `loyertracker-staging-*`, `nginx-proxy-manager` intact, restart=0). Flyway 18/18 inchangé (aucune
> migration Sprint 6). Smoke 47/0 PASS. CSP durcie vérifiée live (US-72). `GET
> /api/bailleurs/export` vérifié live (200, JSON scopé). `DELETE .../locataire` couvert par
> `RgpdIntegrationTest` en CI (confirmation live non faite — **réserve RSV-S6-01 maintenue**).
> Décision : `docs/cgpa/07-devsecops/gate-staging-sprint6-rgpd-v1.4.1-decision.md`. Prochaine action
> autorisée : Gate Production Sprint 6 (distinct, aucune promotion autorisée par ce Gate Staging).
>
> **Sprint 6 — PR #123 fusionnée sur `main` (2026-07-01), GO technique.** US-70 RGPD (export + effacement locataire, 5 pts) + US-72 CSP Nginx (1 pt). CI intégralement verte (Backend, Frontend, CodeQL Java/Kotlin + JS/TS, Sécurité Gitleaks/SCA/Trivy, Packaging Docker) — merge commit `08b366f`. Local `main` synchronisé par fast-forward. Le Sprint n'est pas encore promu : prochaines étapes = Gate Staging (avec `STG-ISOL-01` live sur `ai-test-server`) → Gate Production distinct, conformément à `docs/cgpa/07-devsecops/sprint6-plan.md` §3 (étape 7 : « CI → Gate Staging → Gate Production »). Aucun déploiement Staging ni Production autorisé par ce merge.
>
> **SPRINT 6 EN COURS (2026-07-01) — PR #123.** US-70 RGPD (export + effacement locataire, 5 pts) + US-72 CSP Nginx (1 pt). Suite tests 0 FAIL. Branche : `feat/sprint6-rgpd-us70-us72`. Plan : `docs/cgpa/07-devsecops/sprint6-plan.md`.
>
> **Release `1.4.0` CLÔTURÉE — CDO GO (2026-07-01).** Hypercare T+24 PASS. Smoke 47/0, Sprint 5 (Lots A/B/C + UX) + Flyway V16/V17/V18 confirmés en Production. RP-140-01 levée. RSV-T24-01 levée (serveur prod éteint volontairement — produit non encore public). RSV-P140-01 levée (`plan-execution-sprint5.md`). RSV-P140-02 levée (`release-notes-v1.4.0.md` + CHANGELOG). Tag `sha-98afa99a` en Production. Dossier : `docs/cgpa/09-production/cloture-release-v1.4.0.md`.
>
> **Hypercare Production `1.4.0` — T+24 exécuté le 2026-07-01 à 06:38 UTC, PASS sous surveillance.** 8/8 Running, restart=0 depuis 06:34 UTC, Tag inchangé, Flyway 18/18, Actuator UP, Prometheus 5/5, Alertmanager 0 alerte. p99=66.6 ms, 5xx=0, Hikari pending=0. 1 ERROR qualifiée (duplicate key smoke — attendue). Redémarrage 06:34 UTC causé par `unattended-upgrades.service` — qualifié maintenance système, aucun impact fonctionnel. Backup `loyertracker-20260701-074122.dump` (316K, 730 entrées) exécuté manuellement — heartbeat restauré. RSV-T24-01 : cron backup inactif depuis Jun 25, daemon actif — à investiguer (non bloquant T+24).
>
> **Hypercare Production `1.4.0` — T+12 anticipé exécuté le 2026-06-30 à 15:25 UTC, PASS sous surveillance.** 8/8 Up, 4/4 (healthy), restart=0. Tag `sha-98afa99a` inchangé. Flyway 18/18. Actuator UP. Prometheus 5/5 up. Alertmanager 0 alerte. p99=n/a (aucun trafic réel — attendu stack fraîche). 5xx=0. Hikari pending=0. Heartbeat backup `loyertracker-backup` présent (âge ~19 min). Batch loyers/alertes : crons pas encore joués depuis déploiement (normal). 0 erreur ERROR. T+24 prévu le 2026-07-01 à 03:12 UTC ± 30 min.
>
> **`PRODUCTION_DEPLOYED` — Déploiement Production Sprint 5 `1.4.0` — 2026-06-30 ~15:12 UTC.** Tag **`sha-98afa99a`** déployé sur `loyertracker-prod-server`. `api` + `nginx` recréés (postgres/keycloak/monitoring inchangés). Flyway **V16/V17/V18 appliquées** : « Successfully applied 3 migrations to schema "public", now at version v18 » (logs api). 4/4 (healthy), restart=0. Actuator `{"status":"UP"}`. Smoke Production **47 PASS / 0 FAIL** — `bailleur-test@test.local` réactivé temporairement (pattern identique à `1.2.1`), redésactivé après le run. Prometheus 5/5 up, Alertmanager 0 alerte. `.env` persisté `sha-98afa99a` (SHA-256 `.env` = `1e3f9a7d…`). Backup pré-déploiement : `loyertracker-20260630-160619.dump` (312 Kio, 730 entrées). **Hypercare T+12 et T+24 requis avant clôture `1.4.0`.**
>
> **Gate Staging Sprint 5 Lot B — GO, `STAGING_DEPLOYED` (2026-06-30).** Tag immuable **`sha-98afa99a`** déployé sur `ai-test-server`. STG-ISOL-01 live PASS avant/après (9 conteneurs, `nginx-proxy-manager` intact). Flyway **18/18** : V16 (bien.statut LOUE rétroactif + patrimoine.adresse), V17 (bail.devise EUR/USD/CDF), V18 (StatutPaiement A_VENIR + contrainte CHECK + generer_echeances_loyers()). Smoke 47/0 PASS (port interne 18443). Prochaine action autorisée : Gate Production Sprint 5 (distinct). PR #115 (Sprint 5 Lot B) + PR #116 (smoke fix V18) dans `main`.
>
> **Release `1.3.0` CLÔTURÉE — CDO GO (2026-06-29).** Hypercare anticipé (T0/T+12/T+24 en ~2 min) PASS. Smoke 47/0, Sprint 4 UI Patrimoine + É-01 + remédiation audit confirmés en Production. RP-130-01 levée. Tag `sha-a42d860d` en Production. Dossier : `docs/cgpa/09-production/cloture-release-v1.3.0.md`.
>
> **Hypercare Production `1.3.0` — T+12 anticipé exécuté le 2026-06-29 à 14:27 UTC, PASS sous surveillance.** 8/8 Up, restart=0, Actuator UP, Prometheus 5/5, Alertmanager 0 alerte, p99 ~82 ms, 5xx=0, Hikari pending=0, heartbeat backup présent, 0 erreur critique depuis T0. T+24 prévu le 2026-06-30 à 14:31 UTC ± 30 min.
>
> **Hypercare Production `1.3.0` démarrée le 2026-06-29 à 14:31 UTC — T0 PASS sous surveillance.** `sha-a42d860d` conforme, 4/4 healthy, restart=0, Flyway 15/15, Actuator UP, Prometheus 5/5, Alertmanager 0 alerte, p99 ~33 ms, 5xx=0, Hikari pending=0, heartbeat backup présent. Seules erreurs logs : 2× `duplicate key bailleur_keycloak_id_key` attendues (smoke POST inscription 409). T+12 prévu le 2026-06-30 à 02:31 UTC ± 30 min ; T+24 le 2026-06-30 à 14:31 UTC ± 30 min. Plan : `docs/cgpa/09-production/plan-etape-hypercare-v1.3.0.md`.
>
> **`PRODUCTION_DEPLOYED` — Release `1.3.0` validée le 2026-06-29 à 15:31 UTC.** Smoke 47/0 PASS. Nettoyage complet (2 bailleur2-smoke + 2 gest-smoke supprimés DB+KC, bailleur-test désactivé, données jptshilombo intactes). `.env` `sha-a42d860d` persisté. Prometheus 5/5 up, Alertmanager 0 alerte. Rapport : `docs/cgpa/09-production/validation-finale-v1.3.0-report.md`. Hypercare 24 h requis.
>
> **Déploiement technique `1.3.0` — 2026-06-29 15:11–15:12 UTC, PASS technique.** Artefact `sha-a42d860d` déployé sur `loyertracker-prod-server`. `api` + `nginx` recréés (`postgres`/`keycloak`/monitoring inchangés). Digests API `sha256:c3d89f0d…` / Web `sha256:c3070898…` conformes au Gate. 4/4 `(healthy)`, restart=0. Flyway 15/15 inchangé (aucune migration `1.3.0`). Actuator UP, Prometheus 5/5, Alertmanager 0 alerte. `.env` non modifié (`sha-47172297`) — persistance après smoke PASS. `PRODUCTION_DEPLOYED` non atteint — validation finale requise. Rapport : `docs/cgpa/09-production/deploiement-technique-v1.3.0-report.md`.
>
> **Préflight + backup Production `1.3.0` — 2026-06-29, PASS. RP-130-01 levée.** Dump `loyertracker-20260629-140719.dump` (314 Kio, SHA-256 `524ee4bb…`), globals `c041ccf2…`, permissions 600, `pg_restore --list` 730 entrées OK. 8/8 conteneurs Up, 4/4 healthy, restart=0. Flyway 15/15, `LOYERTRACKER_TAG=sha-47172297` conforme. Prometheus 5/5 up, Alertmanager 0 alerte. Capacité : 32 Gio libres, 2,1 Gio RAM dispo, charge 0,11. Rapport : `docs/cgpa/09-production/preflight-backup-v1.3.0-report.md`. Prochaine étape : déploiement technique `1.3.0` (`api` + `nginx`), sous décision distincte.
>
> **Gate Production `1.3.0` — 2026-06-27, GO sous réserve, `PRODUCTION_READY`.** Artefact `sha-a42d860d` (commit `a42d860d5a10b80b85d5a94d79c3680ef06bacdc`). Périmètre : Sprint 4 UI Patrimoine (PR #82), remédiation audit CGPA v5.4.1 (PR #83), correctif É-01 (PR #96). STG-ISOL-01 PASS live (x2), E6 PASS complet, smoke 47/0. Aucune migration (Flyway reste V15). Rollback : `sha-47172297` sans pg_restore. Réserve RP-130-01 (backup pré-déploiement) **LEVÉE** par ce préflight. Document : `docs/cgpa/09-production/gate-production-v1.3.0-decision.md`. Prochaine étape : déploiement technique `1.3.0`.
>
> **Gate Staging Sprint 4 UI Patrimoine — GO, `STAGING_DEPLOYED` (2026-06-27).** Tag immuable **`sha-a42d860d`** déployé sur `ai-test-server`. STG-ISOL-01 live PASS avant et après déploiement (9 conteneurs, `nginx-proxy-manager` intact). Smoke 47/0 PASS. E6 (vérification fonctionnelle Sprint 4) : PASS complet — affectation patrimoineId 201 (section A), `GET /api/patrimoines/{id}/affectations` 200 (É-01 levé, PR #96, 101/101 tests), EXCLUSION par bien 201 (section B). Flyway 15/15 inchangé. `main` HEAD : `a42d860d` (merge PR #96). Prochaine action autorisée : **Gate Production Sprint 4** (distinct, aucune promotion autorisée par ce Gate Staging).
>
> **Remédiation audit CGPA v5.4.1 — CLÔTURÉE (2026-06-27).** PR #83 fusionnée (merge commit `e561d0e`), `main` synchronisé. Réserves de clôture levées : (1) alerte CodeQL SQL #2 statut `fixed` post-merge ; (2) 0 alerte Dependabot High ouverte sur la branche par défaut. La remédiation est intégralement terminée. Rapport : `docs/cgpa/06-planification-agile/rapport-remediation-audit-cgpa-v5.4.1.md`.
>
> **Remédiation audit CGPA v5.4.1 — GO sous réserve confirmé, exécution autorisée (2026-06-27).** L’audit transversal statue le projet à **76/100** : Production `1.2.1` maintenue, mais promotion Sprint 4 suspendue jusqu’à traitement des réserves de gouvernance GitHub, sécurité, documentation et UX. Plan additif : `docs/cgpa/06-planification-agile/plan-remediation-audit-cgpa-v5.4.1.md`. Branche dédiée : `codex/remediation-audit-cgpa-v5.4.1`. Aucun déploiement autorisé par cette décision.
>
> **Sprint 4 UI Patrimoine — intégré à `main` via PR #82 (2026-06-27), GO technique.** Périmètre : affectation gestionnaire au niveau patrimoine + exceptions fines INCLUSION/EXCLUSION, interface dans le dashboard bailleur, gestionnaire par UUID brut. PR #82 fusionnée (`7738a08`, HEAD applicatif `55183b5`) après CI/CodeQL intégralement verts. Le Sprint n’est pas encore promu : prochaines étapes = remédiation audit → Gate Staging avec `STG-ISOL-01` live → Gate Production distinct. Document de cadrage : `docs/cgpa/06-planification-agile/sprint-4-patrimoine-ui-plan.md`.
>
> **Release `1.2.1` CLÔTURÉE — CDO GO (2026-06-27).** Hypercare anticipé (T0/T+12/T+24 en 7 min) PASS. Smoke 47/0 (note : `bailleur-test` réactivé manuellement). Correctif `c1e9c73` confirmé en Production (`finalize` → biens chargés même sur erreur 409). RP-120-03 levée. Tag `sha-47172297` en Production. Dossier : `docs/cgpa/09-production/cloture-release-v1.2.1.md`.
>
> **Release `1.2.0` CLÔTURÉE — CDO GO (2026-06-26).** Hypercare condensée (T0/T+12/T+24 en 12 min) acceptée par le CDO — Option A. Toutes mesures PASS : 8/8 healthy, restart 0, Flyway 15/15, Prometheus 5/5, 0 alerte, 0 5xx, Hikari pending 0. Réserves maintenues : RP-120-02 (rollback V15 via pg_restore), RP-120-03 (`c1e9c73` cascade → `1.2.1`). Prochaine action autorisée : validation Staging `c1e9c73` → Gate Production `1.2.1`. Dossier : `docs/cgpa/09-production/cloture-release-v1.2.0.md`.
>
> **`PRODUCTION_DEPLOYED` — Release `1.2.0` validée le 2026-06-26 à 17:49 UTC.** Smoke 47/0 PASS. V15 ("affectations exceptions") confirmée en production. Nettoyage complet (2 runs smoke, 4 users Keycloak supprimés, bailleur-test désactivé). `.env` `sha-5bf187af` persisté. Prometheus 5/5 up, Alertmanager 0 alerte. Rapport : `docs/cgpa/09-production/validation-finale-v1.2.0-report.md`. Hypercare 24 h requis.
>
> **Déploiement technique `1.2.0` — 2026-06-26 17:25–17:28 UTC, PASS technique.** Artefact `sha-5bf187af` déployé sur `loyertracker-prod-server`. API et Web recréés seuls (postgres/keycloak/monitoring inchangés). **Flyway V15 appliquée** : 15/15 migrations validées, "affectations exceptions" OK. API/Nginx `(healthy)`, restart 0. Digest API `sha256:3e511356…`, Digest Web `sha256:36493866…`. Prometheus 5/5 up, Alertmanager 0 alerte. Racine publique HTTP 200. `.env` mis à jour (`sha-5bf187af` persisté). `PRODUCTION_DEPLOYED` non atteint — Validation finale requise. Rapport : `docs/cgpa/09-production/deploiement-technique-v1.2.0-report.md`. Prochaine étape : Validation finale `1.2.0` (smoke 47/0, preuves V15, `PRODUCTION_DEPLOYED`).
>
> **Préflight + backup Production `1.2.0` — 2026-06-26, PASS. RP-120-01 levée.** Dump `loyertracker-20260626-182030.dump` (308 Kio, SHA-256 `4ed4e837…`), globals `aee7eb7c…`, permissions 600, `pg_restore --list` OK, heartbeat 22 s. Flyway 14/14, services 8/8 healthy, tag `sha-0adc4941` inchangé. Rapport : `docs/cgpa/09-production/preflight-backup-v1.2.0-report.md`. Prochaine étape : déploiement technique `1.2.0`.
>
> **Gate Production `1.2.0` — 2026-06-26, GO sous réserve, `PRODUCTION_READY`.** Artefact `sha-5bf187af` (commit `5bf187af79218377b2f7db7800961725088d31a5`). Périmètre : Sprint 3 Patrimoine (US-85, V15, RS-04) + correctif CORS Compose. STG-ISOL-01 PASS live, RSV-STG-01 levée, smoke 47/0 Staging. Commit post-Gate `c1e9c73` (cascade dashboard) exclu de `1.2.0` — promu `1.2.1` après Staging. Réserve RP-120-01 (backup pré-déploiement) bloquante. Rollback schéma V15 non trivial : procédure restauration backup documentée. Document : `docs/cgpa/09-production/gate-production-v1.2.0-decision.md`. Prochaine étape : Préflight + backup Production.
>
> **Vérification dashboard Staging 2026-06-25 — PASS complet.** HTTPS `https://loyertracker.staging.loyerpro.org` → 200 (cert RSA YR2/ISRG Root X1 valide). Frontend Angular → 200 `text/html`. `GET /api/actuator/health` → `{"status":"UP"}`. Keycloak OIDC discovery → 200. JWT `jordan.test@loyerpro.org` obtenu. API métier : `GET /api/patrimoines` → 1 patrimoine ("Patrimoine principal") ; `GET /api/biens` → 1 bien ("Bolia 9 Matonge", APPARTEMENT) ; `GET /api/alertes` → 17 alertes `NON_LUE` ; `GET /api/biens/{id}/paiements` → 24 paiements. `directAccessGrants` révoqué (OFF). Tous les composants fonctionnels, Flyway V15 en place.
>
> **Infrastructure Staging 2026-06-25 — npm redémarré, cert RSA, credentials Keycloak réinitialisés.** (1) `nginx-proxy-manager` n'était pas démarré → redémarré avec les volumes historiques `tools_npm_data`/`tools_npm_letsencrypt` ; Proxy Host #18 et Access List restaurés. (2) Cert ECDSA `YE2` (chaîne `Root YE`/`ISRG Root X2` de mai 2026, non reconnue par certains navigateurs) remplacé par cert **RSA 2048-bit** (`certbot --standalone --key-type rsa`) chaîné via `YR2` → `Root YR` → `ISRG Root X1` — valide jusqu'au 2026-09-23, renouvellement auto certbot. (3) Mots de passe Keycloak réinitialisés (`Staging2026!`) pour `jordan.test@loyerpro.org` (BAILLEUR) et `bailleur-test@test.local` (BAILLEUR). Accès complet : `docs/staging-state.md` §9.
>
> **Gate Staging combiné CORS + Sprint 3 — GO, `STAGING_DEPLOYED` le 2026-06-25.** Tag `sha-5bf187af` déployé sur `ai-test-server` : 4/4 services `healthy`, CORS vars injectées (`APP_CORS_ALLOWED_ORIGIN=https://loyertracker.staging.loyerpro.org`), Flyway **V15** appliquée (15 migrations). Smoke **47 PASS / 0 FAIL**. STG-ISOL-01 vérifié live : avant (session précédente) = 8 conteneurs `loyertracker-staging-*` ; après = 8 conteneurs `loyertracker-staging-*` — aucun autre projet affecté. **RSV-STG-01 LEVÉE.** Gate Staging decision doc : `docs/cgpa/07-devsecops/gate-staging-cors-sprint3-v5.3-decision.md`. Production non autorisée par ce Gate — Gate Production distinct requis.
>
> **Mise à jour 2026-06-25 — Lot correctif CORS Compose : correctif sur `main` (CI verte), écart PR qualifié, smoke script aligné V15.** Le commit `964ebfb` (`fix(compose): câble APP_CORS_ALLOWED_ORIGIN et APP_INVITATION_BASE_URL vers le conteneur api`) a été poussé directement sur `origin/main` le 2026-06-25 sans PR — écart vis-à-vis du plan `docs/cgpa/09-production/plan-correctif-cors-compose.md` §5. **Écart qualifié et accepté (Niveau 1)** : correctif purement Compose (aucun code Java/TypeScript, aucune migration SQL), CI SUCCESS sur `origin/main` (CodeQL ✅ + pipeline complet ✅, 6 min 17 s) — les vérifications techniques sont identiques à celles d'une PR ciblant `main`. Héritage Compose vérifié : `docker-compose.prod.yml` ne déclare pas de bloc `environment` pour le service `api`, les deux vars ajoutées à `docker-compose.yml` sont donc héritées correctement en production. **Défaut latent détecté en reprise CGPA v5.4.1 et corrigé** : `infra/smoke/smoke-stack.sh` attendait encore 14 migrations (V1-V14) alors que V15 est sur `main` depuis PR #81 — aligné V14→V15 (commit `8c79e3d`), même pattern que l'incident R-S04-1 (PR #75→#77). **Note de périmètre Gate Staging** : le prochain déploiement Staging embarquera obligatoirement le correctif CORS **et** Sprint 3 (V15, US-85, RS-04) — le Gate Staging sera combiné, pas un correctif CORS isolé. **Prochaine action : Gate Staging combiné CORS + Sprint 3** (Gate STG-ISOL-01 en live pour lever RSV-STG-01, puis Gate Staging v5.3 avant déploiement Staging).
>
> **Mise à jour 2026-06-25 — Sprint 3 Patrimoine clôturé côté `main` : PR #81 mergée.** La PR #81 (`codex/sprint-3-patrimoine-exceptions` → `main`) portant US-85 (exceptions `INCLUSION`/`EXCLUSION`, migration **V15**, garde **RS-04**) a échoué une première fois sur le job `Backend (build + tests + couverture)` (Quality Gate SonarQube `FAILED`). Diagnostic en deux temps : **(1)** défaut latent de CI, indépendant de Sprint 3 — le job Backend de `.github/workflows/ci.yml` clonait en superficiel (`fetch-depth` par défaut), cassant le blame Git nécessaire à SonarQube pour distinguer le code « nouveau » ; corrigé par `fetch-depth: 0` (même schéma déjà en place sur le job Sécurité pour Gitleaks), commit `bfd582f`. **(2)** une fois le blame restauré, le Quality Gate a révélé sa cause réelle : **3 nouvelles violations SonarQube** dans `AffectationService.creer()` — complexité cognitive 16>15 (`S3776`), ternaire imbriqué (`S3358`), faux-positif NPE sur `verifierExclusionAdossee()` (`S2259`). Corrigées par extraction de `creer()` en méthodes privées nommées (`validerPerimetre`, `resoudreBien`, `resoudreTypeException`, `construireAffectation`, `enregistrer`), **sans changement de comportement** ; validé avant push contre l'instance SonarQube réelle (`new_violations` 3→0, `new_coverage` 93,1 %, `new_duplicated_lines_density` 0 %), commit `04bbaf7`. CI GitHub Actions intégralement verte (CodeQL Java/Kotlin + JS/TS, Backend, Frontend, Sécurité Gitleaks/SCA/Trivy, Packaging Docker). **PR #81 mergée le 2026-06-25T12:16:11Z** (merge commit `1c06085df39a23f55e3fb0fa084a5446df23aa8e`) par `jptshilombo`. **Sprint 3 Patrimoine est désormais clôturé côté `main`** (GO technique). **Ce merge clôture le Sprint ; il n'autorise aucune promotion Staging ni Production** — ces décisions restent distinctes et non prises à ce stade.
>
> **Hypercare Production `1.1.1` — T+24 exécuté le 2026-06-25 à 16:48:05 UTC, PASS sous surveillance. CDO : GO — RELEASE `1.1.1` CLÔTURÉE.** Le checkpoint T+24 a démarré à 16:48:05 UTC (6 min 30 s après la fin de la fenêtre 15:41:35–16:41:35 UTC, nettement sous le seuil de suspension de 30 min). Résultats : API/Web/PostgreSQL/Keycloak `(healthy)` ; 8 conteneurs `Up`, restart count = 0 sur 9 ; `LOYERTRACKER_TAG=sha-0adc4941` et digests API `sha256:602c9418…` / Web `sha256:21c18e7d…` inchangés (zéro dérive sur 24 h) ; Flyway 14/14 ; cinq cibles Prometheus `up` ; Alertmanager `[]` ; 5xx rate = 0, p99 = 9,8 ms, 401/5 min = 0 ; pool Hikari pending = 0 ; heartbeat backup ~14,6 h, batch alertes ~11,9 h, batch loyers ~12,4 h — tous sous seuil 26 h ; charge 0,02, mémoire dispo 1,8 Gio, disque 33 Go libres (15 %). Points qualifiés sans impact : 1 erreur API `duplicate key bailleur_keycloak_id_key` (double inscription, 0 5xx, non bloquante) ; 5 FATAL PostgreSQL causés par les commandes de monitoring T+24 elles-mêmes (même cause qu'à T0/T+12). Les cinq critères de clôture §8 du plan étant satisfaits, le CDO a déclaré **GO — RELEASE CLÔTURÉE** le 2026-06-25. Réserves maintenues : `RSV-STG-01`, dette CORS Compose. Prochaine action autorisée : lot correctif CORS Compose. Dossier : `docs/cgpa/09-production/cloture-release-v1.1.1.md`.
>
> **Hypercare Production `1.1.1` — T+12 exécuté le 2026-06-25 à 06:21:54 UTC, PASS sous surveillance (fenêtre étendue par décision CDO).** La fenêtre cible T+12 (03:41:35–04:41:35 UTC) avait été dépassée de plus de 30 minutes par la vérification documentaire CGPA v5.4.1 menée en parallèle sur la même session. Conformément à la règle du plan (`plan-etape-2-hypercare-production-v1.1.1.md` §4.5, aucun résultat rétroactif), le CDO a tranché à la demande du PO l'**extension de la fenêtre** plutôt qu'un redémarrage de l'hypercare — motif : retard purement documentaire, aucun signal d'alerte reçu entre-temps. Résultat du contrôle réel : API/Web/PostgreSQL/Keycloak `(healthy)`, 8/8 conteneurs `Up`, restart count 0 sur tous ; `LOYERTRACKER_TAG=sha-0adc4941` inchangé et digests API/Web identiques au rapport de déploiement (zéro dérive) ; Flyway 14/14 ; cinq cibles Prometheus `up` ; aucune alerte active ; 0 ligne 5xx, ratio 5xx/5 min nul, p99 ≈ 20,7 ms, 401 cumulés négligeables ; pool Hikari pending 0 ; heartbeat backup ≈ 4 h 08, derniers batchs alertes/loyers sous 2 h — tous largement sous les seuils de suspension. Deux points qualifiés sans impact sur le verdict : 2 occurrences PostgreSQL `FATAL: role "root" does not exist`, effet de bord connu de `pg_isready` (déclenché par ce contrôle lui-même à T0 puis T+12) ; vérification Keycloak directe en échec par absence de `curl` dans l'image (limite d'outillage), disponibilité confirmée par le healthcheck Docker et la sonde `blackbox-keycloak` Prometheus. Accès strictement en lecture (SSH IP publique allowlistée, aucune mutation Docker/`.env`/réseau/Keycloak, aucune authentification utilisateur). T+24 ancré au T0 d'origine (2026-06-25 16:11:35 UTC) — désormais exécuté (cf. bandeau ci-dessus). Dossier : `docs/cgpa/09-production/cloture-release-v1.1.1.md`.
>
> **Vérification de cohérence CGPA v5.4.1 du 2026-06-25 — Audit-only, GO confirmé.** À la demande du PO, le « Prompt Maître » de migration CGPA v5.4.1 a été ré-exécuté en mode **audit de cohérence** plutôt qu'en ré-exécution complète, la migration vers v5.4.1 étant déjà actée `completed` et aucune version CGPA supérieure n'existant dans `/home/ubuntu/setup-cgpa`. Contrôles : Gates 0 à 10 (dont 06A, 07A, Staging Patrimoine v5.3, Production v1.1.0/v1.1.1 Hotfix, `STG-ISOL-01`), décisions D-RM-01 à 04/D-STG-01 à 05/D-PAT-001, risques RSV-RM-01 à 04/RSV-STG-01 à 04, ADR-STG-001 (canonique + alias), CI/CD, architecture Docker (noms de projet, réseaux/volumes namespacés) — tous présents et cohérents, aucune suppression. Aucune commande Docker globale/destructrice détectée. Trois écarts documentaires cosmétiques corrigés (sans impact Gate/décision/risque) : `README.md` (version CGPA et release Production obsolètes) et `CHANGELOG.md` (Hotfix `1.1.1`, déjà `PRODUCTION_DEPLOYED`, encore listé sous `[Non publié]`, déplacé vers `[1.1.1] — 2026-06-24`). Décision : **GO**, aucune action corrective bloquante. Réserve **RSV-STG-01** toujours ouverte (confirmation live au prochain déploiement Staging réel). Aucun déploiement ni accès Production/Staging exécuté ; l'Hypercare Production `1.1.1` (T+12/T+24 du 2026-06-25) suit son propre calendrier, non affectée. Rapport : `docs/cgpa/migration/audit-verification-v5.4.1-2026-06-25.md`.
>
> **Sprint 3 Patrimoine implémenté et validé localement le 2026-06-25 — GO technique, branche `codex/sprint-3-patrimoine-exceptions`.** US-85 (exceptions `INCLUSION`/`EXCLUSION`) implémentée : migration **V15** (colonne `affectation.type_exception`, backfill `INCLUSION` non-régressif, réécriture à priorité de `gestionnaire_affecte_actif`/`biens_affectes_gestionnaire`), garde **RS-04** dans `AffectationService` (EXCLUSION orpheline rejetée 400), et **correctif ciblé de `calculer_honoraires`** identifié pendant l'implémentation (hors livrables initiaux du cadrage) : une `EXCLUSION` est un carve-out d'accès et ne doit jamais générer d'honoraire — sans ce correctif, V14 aurait facturé une exclusion comme une affectation normale. Aucun changement Java côté `AuthorizationService` (résolution centralisée en SQL `SECURITY DEFINER`, conforme au cadrage). Validation locale : `mvn verify` **99 tests / 0 échec** (4/4 combinaisons RM-98 testées, dont la révocation patrimoine avec inclusion bien indépendante ; 2 tests HTTP RS-04/visibilité), Gitleaks **168 commits / no leaks**, Trivy SCA **0 HIGH/CRITICAL**. Rapport : `docs/cgpa/06-planification-agile/sprint-3-patrimoine-rapport-validation.md`. Reste avant fusion `main` : push de la branche, ouverture d'une PR dédiée (distincte de la PR #80), CI GitHub complète (CodeQL, SonarQube, Trivy images, packaging), puis décision de promotion staging/release — non couverte par ce Kickoff.
>
> **Kickoff Sprint 3 Patrimoine confirmé par le PO le 2026-06-25 — GO sans réserve.** Le cadrage détaillé produit le 2026-06-24 (`docs/cgpa/06-planification-agile/plan-execution-patrimoine.md`, section Sprint 3) couvre la fin d'US-85 (exceptions `INCLUSION`/`EXCLUSION`), la migration **V15** et la réécriture à priorité de `gestionnaire_affecte_actif`/`biens_affectes_gestionnaire`, l'extension backend (`TypeException`, `AffectationRequest`/`AffectationService`, garde **RS-04**), et la suite de tests des 4 combinaisons de résolution. Périmètre déjà tranché par le PO le 2026-06-24 : **backend-only**, aucune UI livrée. Sprint indépendant du Hotfix `1.1.1` et de son hypercare en cours (T+24 attendu le 2026-06-25 à 16:11:35 UTC). Critères GO de fusion `main` : 4/4 combinaisons testées vertes, 0 fuite cross-bailleur/patrimoine/bien, non-régression complète S02/S03/S04, CI verte, documentation à jour avant fusion.
>
> **Mise à jour 2026-06-24 (suite 5) — Migration corrective CGPA v5.4.1 : GO sous réserve.** Le chemin canonique de l’ADR Staging devient `docs/cgpa/adr/ADR-STG-001-staging-isolation.md`; l’ADR v5.4 historique reste conservée comme alias. La checklist canonique `STG-ISOL-01` est maintenue, les rapports v5.4.1 sont ajoutés sous `docs/cgpa/migration/`, et les risques RSV-STG-02 à RSV-STG-04 complètent RSV-STG-01. Aucun Gate n’est rejoué. Réserve : preuve live `STG-ISOL-01` au prochain déploiement Staging.
>
> **Décision finale du 2026-06-24 — GO sous réserve confirmé.** La migration CGPA v5.4.1 est acceptée. Réserve unique associée à cette décision : **RSV-STG-01**, à lever par une preuve live avant/après le prochain déploiement sur le Staging mutualisé. Cette décision n’autorise aucun déploiement Production et ne remplace pas les Gates Staging/Production applicables.
>
> **Décision PO du 2026-06-24 — parcours Production du Hotfix validé sous contrôle séquentiel.** Le prochain parcours est confirmé : candidat Production → Gate Production accéléré → préflight et sauvegarde → déploiement → validation/rollback. Avant chacune de ces étapes, un plan détaillé distinct doit être produit et validé ; aucune étape n’autorise automatiquement la suivante. Plan directeur : `docs/cgpa/09-production/plan-execution-hotfix-production.md`. Aucun Gate ni déploiement exécuté par cette décision.
>
> **Plan détaillé Étape 1 produit le 2026-06-24 — exécution suspendue.** Le plan de préparation du candidat Production est disponible dans `docs/cgpa/09-production/plan-etape-1-preparation-candidat-hotfix.md`. Il propose la version patch `1.1.1` et impose de résoudre la divergence entre le HEAD local observé `a33d103` et le candidat Staging documenté `0adc494` / `sha-0adc4941`, puis de vérifier GitHub Actions, CodeQL, SonarQube et les digests GHCR. Aucune vérification externe ni préparation du candidat n’est exécutée avant validation explicite de ce plan.
>
> **Validation PO du 2026-06-24 — Plan détaillé Étape 1 approuvé.** L’exécution de la préparation du candidat Production est autorisée selon `docs/cgpa/09-production/plan-etape-1-preparation-candidat-hotfix.md`. Cette approbation n’autorise pas le Gate Production, le préflight, la sauvegarde ou le déploiement ; un nouveau point de décision est requis après production du dossier candidat.
>
> **Étape 1 exécutée le 2026-06-24 — candidat Hotfix `1.1.1` recevable.** Commit canonique `0adc4941f854304a3f7412b04294615b05403707`, images GHCR API/Web `sha-0adc4941` vérifiées avec digests immuables, CI/CodeQL/Packaging/Sécurité SUCCESS, Quality Gates SonarQube backend et frontend OK. Le delta applicatif est limité au Hotfix patrimoine/bien et à jackson-databind 2.21.4 ; aucune migration SQL ni modification Compose/infra. Dossier : `docs/cgpa/09-production/release-candidate-v1.1.1-hotfix.md`. Décision : **candidat recevable**, Production toujours non autorisée. Prochaine action permise : produire le plan détaillé de l’Étape 2.
>
> **Plan détaillé Étape 2 produit le 2026-06-24 — Gate non exécuté.** Le plan `docs/cgpa/09-production/plan-etape-2-gate-production-hotfix.md` définit la checklist, les avis obligatoires, les critères GO/GO sous réserve/NO GO et les mutations documentaires autorisées. Un Gate valide pourra marquer `PRODUCTION_READY`, mais n’autorisera ni préflight, ni sauvegarde, ni déploiement sans plan Étape 3 validé. Le plan est en attente de validation PO.
>
> **Étape 2 exécutée le 2026-06-24 — Gate Production Hotfix `1.1.1` GO sous réserve acceptée.** L’identité du candidat `sha-0adc4941`, les preuves Staging, CI/CodeQL/SonarQube/Sécurité et le rollback `sha-05424aa3` sont validés. `RSV-STG-01` reste ouverte ; le backup et le préflight sont des conditions bloquantes de l’Étape 3. Statut **`PRODUCTION_READY` atteint**, `PRODUCTION_DEPLOYED` non atteint. Aucun accès Production, backup ou déploiement exécuté. Décision : `docs/cgpa/09-production/gate-production-v1.1.1-hotfix-decision.md`. Prochaine action permise : produire le plan détaillé de l’Étape 3.
>
> **Plan détaillé Étape 3 produit le 2026-06-24 — aucun accès Production exécuté.** Le plan `docs/cgpa/09-production/plan-etape-3-preflight-backup-production.md` sépare un préflight en lecture seule de la sauvegarde Production, unique mutation opérationnelle autorisée. Il impose les contrôles de santé, capacité, images courantes, Flyway, observabilité, cron, rollback, intégrité `pg_restore --list`, permissions et checksums. Tout déploiement, pull d’image ou changement de tag reste interdit. Plan en attente de validation PO.
>
> **Étape 3 exécutée le 2026-06-24 — préflight Production PASS et backup vérifié.** Hôte sain (33 Gio libres, charge faible), services applicatifs healthy, zéro restart, images courantes `sha-05424aa3`, Flyway 14/14, cinq cibles Prometheus up. Le backup `loyertracker-20260624-140441.dump` et son fichier globals ont été créés en permissions 600, checksums tracés et `pg_restore --list` validé. L’alerte initiale `BackupHeartbeatMissing`, causée par l’arrêt de l’hôte pendant le cron, est résolue après heartbeat. Aucun pull, changement de tag ou déploiement exécuté. Rapport : `docs/cgpa/09-production/preflight-backup-v1.1.1-report.md`. Prochaine action permise : produire le plan détaillé de l’Étape 4.
>
> **Plan détaillé Étape 4 produit le 2026-06-24 — déploiement non exécuté.** Le plan `docs/cgpa/09-production/plan-etape-4-deploiement-hotfix.md` prévoit une surcharge temporaire `LOYERTRACKER_TAG=sha-0adc4941` sans modifier `.env`, le pull et la recréation ciblés d’`api` et `nginx`, la vérification des digests, les contrôles techniques immédiats et un rollback autorisé vers `sha-05424aa3` en cas d’échec. PostgreSQL, Keycloak et le monitoring doivent rester inchangés. Le smoke métier et `PRODUCTION_DEPLOYED` restent réservés à l’Étape 5. Plan en attente de validation PO.
>
> **Étape 4 exécutée le 2026-06-24 — déploiement technique Hotfix `1.1.1` PASS.** API et Web `sha-0adc4941` ont été tirés, vérifiés par digest et recréés seuls. PostgreSQL et Keycloak ont conservé leurs IDs ; monitoring inchangé. API/Web healthy, Flyway 14/14, cinq cibles Prometheus up, aucune alerte ou erreur critique. Aucun smoke métier ni donnée de test exécuté ; `PRODUCTION_DEPLOYED` non atteint. `.env` est resté inchangé : l’Étape 5 devra persister le tag après validation ou rollback vers `sha-05424aa3`. Rapport : `docs/cgpa/09-production/deploiement-technique-v1.1.1-report.md`. Prochaine action permise : produire le plan détaillé de l’Étape 5.
>
> **Plan détaillé Étape 5 produit le 2026-06-24 — validation finale non exécutée.** Le plan `docs/cgpa/09-production/plan-etape-5-validation-finale-rollback.md` encadre le smoke Production 47/0, la preuve spécifique patrimoine/bien, le nettoyage ciblé des données et comptes de test, la révocation Keycloak, la persistance atomique de `LOYERTRACKER_TAG=sha-0adc4941` après succès et le rollback `sha-05424aa3` en cas d’échec. `PRODUCTION_DEPLOYED` ne pourra être marqué qu’après validation, nettoyage et contrôles post-persistance. Plan en attente de validation PO.
>
> **Étape 5 exécutée le 2026-06-24 — Hotfix `1.1.1` `PRODUCTION_DEPLOYED`.** Smoke Production **47 PASS/0 FAIL** ; création patrimoine/bien, honoraires et isolation cross-tenant validées. Nettoyage transactionnel ciblé : compteurs revenus exactement à l’état de référence, aucun marqueur du run `1782311743`, deux utilisateurs Keycloak éphémères supprimés, compte de smoke désactivé et `directAccessGrants=false`. Tag `sha-0adc4941` persisté dans `.env` avec sauvegarde permissions 600, sans restart. API/Web healthy, Flyway 14/14, assets 200, cinq cibles Prometheus up, aucune alerte. Décision CDO : **GO — `PRODUCTION_DEPLOYED`**. Rapport : `docs/cgpa/09-production/validation-finale-v1.1.1-report.md`.
>
> **Post-déploiement Étape 1 exécutée le 2026-06-24 — PASS.** Dépôt local synchronisé par fast-forward strict sur `main` / `origin/main` au merge `083720d` de la PR #79 ; CI de la PR confirmée entièrement verte et commit `ea37165` présent dans l’historique. Baseline documentaire `1.1.1` auditée ; dossier `docs/cgpa/09-production/cloture-release-v1.1.1.md` préparé avec registres T0/T+12/T+24 vides. Aucun accès Production, Docker ou smoke exécuté. Hypercare non démarrée. Plan exécuté : `docs/cgpa/09-production/plan-etape-1-synchronisation-preparation-cloture-v1.1.1.md`.
>
> **Plan détaillé post-déploiement Étape 2 produit le 2026-06-24 — hypercare non démarrée.** Le plan `docs/cgpa/09-production/plan-etape-2-hypercare-production-v1.1.1.md` définit une surveillance Production en lecture seule à T0, T+12 h et T+24 h, avec fenêtres de ±30 minutes, seuils Prometheus existants, contrôles de capacité, logs, Flyway, backup et artefact. Aucun snapshot, accès Production, smoke, changement Docker ou mutation de configuration n’est exécuté avant validation PO.
>
> **Hypercare Production `1.1.1` démarrée le 2026-06-24 à 16:11:35 UTC — T0 PASS sous surveillance.** API/Web `sha-0adc4941` conformes, quatre services healthy, restart counts 0, Flyway 14/14, Prometheus 5/5, aucune alerte, p99 ≈ 38 ms, 401 = 0, Hikari pending = 0, backup et batch récents, capacité saine. Les erreurs de logs recensées sont expliquées par le smoke/nettoyage antérieur et par la première requête Flyway T0 mal contextualisée ; aucun signal Prometheus associé. T+12 prévu le 2026-06-25 à 04:11:35 UTC et T+24 le 2026-06-25 à 16:11:35 UTC (tolérance ±30 min).
>
> **Mise à jour 2026-06-24 (suite 4) — Migration CGPA v5.4 : GO sous réserve (gouvernance Staging partagée, `STG-ISOL-01`).** Migration additive réalisée sans rejouer ni supprimer les Gates, décisions ou risques historiques : `framework.current_version` passe de `5.3` à `5.4`. CGPA v5.4 introduit la gouvernance des environnements Staging mutualisés (`ai-test-server`, hébergeant LoyerTracker et d'autres projets) : nouveau Gate bloquant **`STG-ISOL-01`** (statué **PASS** le 2026-06-24, `docs/cgpa/07-devsecops/gate-stg-isol-01-decision.md`), workflow `docs/cgpa/workflows/staging-isolation-workflow.md`, checklist `docs/cgpa/checklists/stg-isol-01-checklist.md`, décisions **D-STG-01** à **D-STG-05**, risque **RSV-STG-01**, et ADR obligatoire `docs/cgpa/05-architecture-conception/adr/ADR-STG-001-isolation-staging-partage.md` (rejette explicitement l'option « arrêter tous les conteneurs avant chaque déploiement »). L'audit (`docs/cgpa/migration/audit-initial-v5.4.md`) établit que l'isolation requise (namespace Docker, réseaux/volumes dédiés, ports sans conflit, reverse proxy par nom DNS, absence de commande Docker globale) est **déjà en place de façon native** depuis le lot Production Readiness 4b (2026-06-14) : la migration est principalement une formalisation de gouvernance d'un état technique déjà conforme. Décision : **GO sous réserve** — réserve non bloquante **RSV-STG-01** (confirmation *live* de `STG-ISOL-01` sur l'hôte mutualisé, en présence d'au moins un autre projet, au prochain déploiement Staging réel). Détail complet : `docs/cgpa/migration/migration-report-v5.4.md` (§16 ci-dessous).
>
> **Mise à jour 2026-06-24 (suite 3) — Politique réseau formalisée : IP privée prioritaire pour les accès SSH inter-serveurs (dev/CI, staging/test, SonarQube).** Contexte communiqué par le PO : ces hôtes (dont `loyerpro-ci-server`, qui héberge aussi SonarQube) résident désormais dans le même VPC/périmètre réseau privé avec SSH ouvert par IP privée. Règle documentée : IP privée prioritaire sur l'IP publique pour tout accès intra-VPC ; IP publique réservée au dernier recours ou aux postes externes autorisés — cohérent avec le précédent déjà en place côté Production (`docs/prod-state.md`, restriction SG du 2026-06-20). Détail : `docs/cgpa/environment-promotion-model.md` (Accès SSH inter-serveurs), `docs/cgpa/07-devsecops/runbook-exploitation.md` §0.1. **Aucun code, secret ou règle de sécurité modifié — documentation uniquement.** **Réserve ouverte** : `SERVER_CONFIG.md` (2026-06-19, hors dépôt) documente encore 3 Security Groups distincts plutôt qu'un SG unique partagé, et aucun hôte SonarQube dédié distinct de `loyerpro-ci-server` — à vérifier/aligner par l'exploitant si la topologie a réellement changé.
>
> **Mise à jour 2026-06-24 (suite 2) — Vérification navigateur complète du Hotfix réalisée (preuve réelle) ; bug CORS distinct découvert et tracé ; nettoyage Staging confirmé.** À la demande du PO, accès direct temporaire ouvert (SG port `18443` `0.0.0.0/0`, `KC_HOSTNAME`/`KEYCLOAK_ISSUER_URI` basculés sur l'IP, `redirectUris`/`webOrigins` étendus) pour un test Playwright/Chrome de bout en bout : connexion Keycloak réelle, tableau de bord chargé, sélecteurs patrimoine/type peuplés, création d'un bien via le **vrai formulaire Angular** → `201 Created` (capture d'écran). **Bug distinct découvert en cours de route** : `APP_CORS_ALLOWED_ORIGIN`/`APP_INVITATION_BASE_URL` existent dans `.env` depuis l'exposition publique (2026-06-16) mais ne sont **jamais passées au conteneur `api` dans aucun fichier compose** — l'application tourne depuis toujours sur le défaut Spring CORS (`https://localhost`), sans rapport avec le Hotfix ; **reste ouvert, à corriger dans un lot dédié** (ajouter ces variables à `docker-compose.yml`/`docker-compose.staging.yml`/`docker-compose.prod.yml`). Compte de test fourni au PO : `jordan.test@loyerpro.org` (conservé). **Nettoyage effectué et vérifié** : `redirectUris`/`webOrigins` et `.env` (`KEYCLOAK_ISSUER_URI`, `APP_CORS_ALLOWED_ORIGIN`) revertés au domaine public, override temporaire supprimé, `keycloak`/`api` redémarrés (issuer revérifié), smoke **47/0** rejoué, règle SG port `18443` révoquée. Accès SSH `52.29.80.119/32` conservé (décision PO en attente sur son maintien). Détail : `docs/cgpa/06-planification-agile/plan-execution-hotfix-bien-patrimoine-frontend.md` §11.
>
> **Mise à jour 2026-06-24 (suite) — Hotfix déployé en Staging, validé ; correctif CVE jackson-databind détecté et corrigé en parallèle.** Commit/push directs sur `main` : `a281705` (Hotfix), puis `0adc494` (CVE-2026-54512/54513 jackson-databind HIGH, détectée en surveillant la CI du Hotfix — sans rapport, déjà rouge sur le commit précédent ; correctif `jackson-bom.version` 2.21.2→2.21.4). CI/CodeQL verts sur les deux. Staging redéployé (`sha-0adc4941`) : `git pull`, 4/4 `healthy`, smoke **47 PASS/0 FAIL**. Vérification navigateur réelle tentée (Chrome/Playwright via tunnel SSH) : page de login Keycloak atteinte et rendue correctement (preuve par capture d'écran) ; soumission bloquée par `KC_HOSTNAME=loyertracker.staging.loyerpro.org` (comportement intentionnel de l'exposition publique, sans rapport avec le correctif) — non poursuivi, jugé disproportionné. **Accepté comme preuve suffisante** par le PO : 45 tests Karma sur le composant réel + smoke API 47/0 + capture d'écran. Détail complet : `docs/cgpa/06-planification-agile/plan-execution-hotfix-bien-patrimoine-frontend.md` §10, `docs/staging-state.md` §8. Effet de bord infra : accès SSH `52.29.80.119/32` ajouté en permanence sur le SG staging `innovtech-ai-lab-sg` (même IP que la règle déjà active en Production) ; modification temporaire de `redirectUris`/`webOrigins` du realm, **revert confirmé**. Reste : Gate Production accéléré puis déploiement Production.
>
> **Mise à jour 2026-06-24 — Hotfix « patrimoine/bien frontend » implémenté et validé localement, non déployé.** Régression Production détectée lors du cadrage Sprint 3 : le tableau de bord bailleur n'envoyait pas `patrimoineId` (obligatoire depuis `1.1.0`/V12) lors de la création/édition d'un bien (échec 400 systématique), et `InscriptionService.inscrire` ne créait aucun patrimoine par défaut pour les nouveaux bailleurs (onboarding bloqué de bout en bout). GO PO obtenu le 2026-06-24 (Hotfix, distinct du cadrage Sprint 3). Correctif : `InscriptionService` crée un patrimoine « Patrimoine principal » à l'inscription ; `bienForm` étendu d'un sélecteur de patrimoine (`/api/patrimoines`) et d'un sélecteur de type (`/api/types-biens`, remplace le champ texte libre). `mvn verify` 86 tests / 0 échec, `ng lint`/`ng build`/`ng test` 45 tests / 0 échec. Plan d'Exécution : `docs/cgpa/06-planification-agile/plan-execution-hotfix-bien-patrimoine-frontend.md`. **Non commité, non déployé à ce stade** : reste commit/push, déploiement Staging + smoke + vérification navigateur, puis Gate Production accéléré avant toute mise en Production.
>
> **Mise à jour 2026-06-24 — Sprint 3 Patrimoine cadré (backend-only, périmètre tranché par le PO), kickoff non demandé.** Cadrage détaillé produit, ancré sur l'état réel du code (V13 `gestionnaire_affecte_actif` fait un simple OR, pas de priorité ; `AuthorizationService` ne fait que déléguer à la fonction SQL — toute la logique de résolution `INCLUSION`/`EXCLUSION` (RM-98) vivra dans une migration V15 + validation applicative RS-04, sans changement Java côté autorisation). Le PO a tranché le 2026-06-24 : périmètre **backend-only**, cohérent avec Sprint 1/2 ; l'UI d'affectation patrimoine et d'exceptions reste hors scope, différée à un lot ultérieur. Détail : `docs/cgpa/06-planification-agile/plan-execution-patrimoine.md` (section Sprint 3). Kickoff Sprint 3 (point de contrôle distinct) reste à demander avant tout code.
>
> **Mise à jour 2026-06-24 — Reprise CGPA v5.3 re-confirmée (`Resume Approved with Reservations`).** Re-exécution du workflow officiel de reprise par le CGPA Chief Delivery Officer (nouvelle session) : 4/4 contrôles de continuité PASS (Migration Governance / Architecture / Delivery / Release History), aucun Gate rejoué, aucun historique supprimé, Phase 7 conservée, release `1.1.0` inchangée (toujours LIVE, `PRODUCTION_DEPLOYED` depuis le 2026-06-23). **Écart documentaire détecté et corrigé** : `docs/cgpa/migration/reprise-report-v5.3.md`, créé par la PR #78, décrivait encore l'état antérieur à la mise en Production `1.1.0` (`1.0.0` LIVE, lot Patrimoine `[Non publié]`) alors que la même PR avait déjà tracé ailleurs (`project-state.md`, `prod-state.md`) le déploiement `1.1.0` ; le rapport est mis à jour pour refléter `1.1.0` `PRODUCTION_DEPLOYED`, Gate Staging Patrimoine v5.3 GO et Gate Production v5.3 GO sous réserve. Décision confirmée par le Product Owner : **Resume Approved with Reservations**. Réserves maintenues : RSV-RM-01 (accumulation Staging), RSV-RM-03 (drill de rollback significatif V11–V14 à planifier à la prochaine release), R-V52-8 (plan Quittances non formalisé), Gate 02A à appliquer aux futurs lots UI substantiels. Aucun Sprint ni Release candidate en cours ; prochaine décision = cadrage Sprint 3 Patrimoine ou nouvelle Release candidate.
>
> **Mise à jour 2026-06-23 — Production `1.1.0` déployée (`PRODUCTION_DEPLOYED`).** La release `1.1.0` (Quittances de loyer + Patrimoine Sprint 1/2) est déployée en Production sur `https://loyertracker.loyerpro.org` avec le tag immuable GHCR **`sha-05424aa3`**. Backup pré-déploiement vérifié : `loyertracker-20260623-150659.dump` (`pg_restore --list` OK). Déploiement : `api` + `nginx` recréés, 4/4 services applicatifs `healthy`, Flyway V1→V14 validé, smoke Production complet **47 PASS / 0 FAIL**. Compte de smoke redésactivé et `directAccessGrants=false` après exécution. Rollback applicatif préparé vers `sha-73359c5c`; rollback données par restauration du backup pré-déploiement.
>
> **Mise à jour 2026-06-23 — Gate Production v5.3 `1.1.0` : GO sous réserve acceptée (`PRODUCTION_READY`).** La release `1.1.0` (RC `1.1.0-rc.1`, périmètre Quittances + Patrimoine Sprint 1/2) est autorisée à la mise en Production sous réserves acceptées : preuve Staging Quittances par équivalence, rollback V11-V14 par restauration backup, release notes à finaliser post-déploiement. Artefact candidat : `sha-1d6db31`. **Déploiement non exécuté à ce stade** : `PRODUCTION_DEPLOYED` reste non atteint. Décision : `docs/cgpa/09-production/gate-production-v1.1.0-decision.md`.
>
> **Mise à jour 2026-06-23 — Release candidate `1.1.0-rc.1` préparée.** Option retenue après Gate Staging Patrimoine : préparer une Release candidate incluant **Quittances de loyer + Patrimoine Sprint 1/2**. Version cible : `1.1.0`; candidate : `1.1.0-rc.1`. Documents créés : `docs/cgpa/09-production/release-candidate-v1.1.0-rc.1.md` et `docs/release-notes-v1.1.0.md`. Statut : **Production non autorisée** ; `PRODUCTION_READY` reste non atteint tant que le Gate Production v5.3 n'est pas statué. Prochaines actions : identifier le tag GHCR candidat final, compléter/accepter la preuve Staging Quittances, obtenir validation PO + Release Manager, puis exécuter le Gate Production.
>
> **Mise à jour 2026-06-23 — Gate Staging v5.3 Patrimoine : GO (`STAGING_DEPLOYED`).** Le lot Patrimoine `[Non publié]` est statué GO au Gate Staging v5.3 : Sprint 1 et Sprint 2 clôturés, correctif honoraires patrimoine V14 validé, smoke Staging revalidé **47 PASS / 0 FAIL** après PR #77, CI verte. Ce Gate autorise et trace le statut Staging du lot ; il **ne vaut pas autorisation Production**. Décision : `docs/cgpa/07-devsecops/gate-staging-patrimoine-v5.3-decision.md`. Prochaine décision : cadrage Sprint 3 ou préparation d'une Release candidate avec Gate Production ultérieur.
>
> **Mise à jour 2026-06-23 — Décision de reprise CGPA v5.3 : Resume Approved with Reservations.** Décision confirmée par le Chief Delivery Officer : reprise autorisée avec réserves non bloquantes. Continuité préservée : aucun retour Phase 00, aucun Gate rejoué, aucun historique supprimé. Réserves maintenues : Gate Staging v5.3 du lot Patrimoine `[Non publié]` statué GO (`STAGING_DEPLOYED`), prochaine Production à piloter par Epic/Release/Hotfix avec Gate Production explicite, drill rollback production à planifier à la prochaine release, UX/UI Gate 02A à formaliser pour les futurs lots UI. Rapport : `docs/cgpa/migration/reprise-report-v5.3.md`.
>
> **Mise à jour 2026-06-23 — Migration CGPA v5.3 : GO sous réserve.** Migration additive réalisée sans rejouer ni supprimer les Gates historiques : `framework.current_version` passe de `5.2` à `5.3`, les statuts `STAGING_READY`, `STAGING_DEPLOYED`, `PRODUCTION_READY`, `PRODUCTION_DEPLOYED` sont ajoutés, les workflows Sprint→Staging / Epic→Production / Hotfix→Production sont formalisés, les checklists Gate Staging et Gate Production sont créées, les décisions **D-RM-01** à **D-RM-04** et les risques **RSV-RM-01** à **RSV-RM-04** sont ajoutés. Décision : **GO sous réserve** — réserves non bloquantes : Gate Staging v5.3 du lot Patrimoine `[Non publié]` statué GO (`STAGING_DEPLOYED`), drill de rollback production significatif à réaliser à la prochaine release, cadrage UX/UI Gate 02A proportionné pour les futurs lots UI.
>
> **Mise à jour 2026-06-23 (suite 2) — Re-vérification du smoke staging post-V14 : confirmée.** Staging (`ai-test-server`) redéployé avec le tag **`sha-75473413`** (merge commit PR #76) : repo réaligné sur `origin/main` (`4056b9c`), images `api`/`web` pull + `up -d`, 4/4 `healthy`. `infra/smoke/smoke-stack.sh` rejoué contre `https://localhost:18443` : **46 PASS / 1 FAIL** — le correctif honoraires patrimoine est **confirmé fonctionnel en conditions réelles** (`honoraire période 2025-12 = 72.00 (8% de 900 encaissés)` sur affectation **patrimoine**, toutes les assertions métier passent) ; le seul FAIL est l'assertion du compteur Flyway du script lui-même, resté à `13` alors que la PR #76 a ajouté **V14** sans le mettre à jour. Correctif d'1 ligne ouvert via **PR #77** (`fix/smoke-flyway-v14`, CI verte 13/13 après un re-run d'un flake SonarQube côté serveur sans rapport avec le changement) ; revalidé en conditions réelles avant push : **47 PASS / 0 FAIL** avec le script corrigé. **PR #77 mergée le 2026-06-23T13:33Z (`1d6db31`)** ; staging resynchronisé sur ce HEAD. Le risque « Smoke staging non re-vérifié » (§13) est **fermé** : la correction V14 est prouvée en live et le script de smoke lui-même est désormais totalement aligné sur `main`.
>
> **Mise à jour 2026-06-23 (suite) — Synchronisation CGPA post-merge PR #75/#76 : smoke-staging réaligné + correctif honoraires patrimoine, réserve R-S04-1 régularisée et fermée.** `origin/main` est désormais à `7547341` (merge PR #76) ; la branche locale `main` a été réalignée (le ref local était simplement périmé, aucune divergence réelle). **PR #75** (`c23fea4`, mergée 11:32) aligne `infra/smoke/smoke-stack.sh` sur le schéma V13 + patrimoine + S02 (Flyway V1-V13, création d'un patrimoine avant le bien, bail via `loyerHc`/`provisionCharges`, affectation **patrimoine** 8 %) ; exécuté manuellement contre staging : **43 PASS / 4 FAIL**, les 4 échecs révélant que le calcul des honoraires (`calculer_honoraires()`, V8) et leur lecture (`HonoraireRepository.findByBien`) n'avaient pas été étendus par le Sprint 2 (PR #74) aux biens couverts par une affectation **patrimoine**. **PR #76** (`d14db9b` + `9bd1e7c`, mergée 12:14) corrige l'écart : migration **V14** (`V14__honoraires_patrimoine.sql`) étend `calculer_honoraires()` à la résolution patrimoine→biens, `HonoraireRepository.findByBien` inclut les affectations patrimoine, `SchemaMigrationTest` aligné 13→14. **CI vérifiée verte 13/13** (CodeQL Java/Kotlin + JS/TS, Backend, Frontend, Packaging Docker, Sécurité Gitleaks/SCA/Trivy). **Réserve de gouvernance R-S04-1** : le correctif a été codé et poussé directement sur `staging-smoke-s04` après le merge de la PR #75, sans Plan d'Exécution ni revue préalable (écart relevé par la PR #76 elle-même, qui demandait sa régularisation post-merge). **Régularisée a posteriori et fermée** par la revue complète + CI verte de la PR #76 — leçon retenue (cf. §13) : tout correctif applicatif, même mineur, doit être précédé d'un Plan d'Exécution avant push sur une branche partagée. **Reste ouvert** : re-vérification du smoke staging (47 PASS / 0 FAIL attendu) après redéploiement du tag issu de `7547341`, non encore exécutée — prérequis avant toute décision de promotion staging/release.
>
> **Mise à jour 2026-06-23 — Synchronisation CGPA post-merge PR #74 : Sprint 2 Patrimoine clôturé.** La branche locale `main` est alignée sur `origin/main` après merge de la PR #74 (`ed448b8`, checks GitHub **SUCCESS** : backend, frontend, sécurité Gitleaks/SCA/Trivy, packaging Docker, CodeQL Java/Kotlin et JavaScript/TypeScript). La pile Sprint 2 Patrimoine backend-first est intégrée : `00c09df` support affectations patrimoine, `9cb6f39` héritage ReBAC, `96565d1` garde RS-06, `eb441f2` rapport de validation, `b6a8bd9` refactor constructeur. Validation locale préalable : backend `mvn verify` **84 tests / 0 échec**, frontend lint/build/Karma **41 tests SUCCESS**, Gitleaks **147 commits / no leaks**, Trivy frontend + global **0 HIGH/CRITICAL**. Décision : `docs/cgpa/06-planification-agile/sprint-2-patrimoine-cloture.md` (**GO technique / Sprint 2 Patrimoine clôturé côté `main`**). Production inchangée en `1.0.0`; prochaine étape CGPA : décision dédiée de promotion staging ou cadrage Sprint 3 Patrimoine, sans démarrage automatique.
>
> **Mise à jour 2026-06-21 — Synchronisation CGPA post-merge PR #73 : `Resume Approved`.** La branche locale `main` a été fast-forwardée sur `origin/main` après merge de la PR #73 (`d0bc1d6`, checks GitHub **SUCCESS** : backend, frontend, sécurité Gitleaks/SCA/Trivy, packaging Docker, CodeQL Java/Kotlin et JavaScript/TypeScript). Le lot post-go-live **« Quittances de loyer »** est intégré (`PR #70` fondation données, `PR #71` génération PDF + correctifs CI/Sonar) et le **Sprint 1 Patrimoine** est désormais **clôturé côté `main`** : implémentation mergée via `PR #72` (`74fe51c`) puis décision documentaire de clôture mergée via `PR #73` (`525dd95` dans `d0bc1d6`). Validations de clôture documentées le 2026-06-21 : backend `mvn verify` **78 tests / 0 échec**, frontend lint/build/Karma **41 tests SUCCESS**, Gitleaks **139 commits / no leaks**, Trivy fs frontend + images API/Web **0 HIGH/CRITICAL**. Décision : `docs/cgpa/06-planification-agile/sprint-1-patrimoine-cloture.md` (**GO technique / Sprint 1 Patrimoine clôturé**). Réserves R-V52-7 et R-V52-9 closes ; R-V52-8 reste **ouverte mineure** (plan Quittances non formalisé en fichier dédié). Prochaine étape CGPA : préparer le Plan d'Execution Sprint 2 Patrimoine sans codage, puis obtenir un GO PO dédié avant implémentation.
>
> **Mise à jour 2026-06-19 — RR-1 levée.** Validation staging de l'alerting (OBS-02/03) réalisée par simulation d'incident : 4/4 composants critiques (API, PostgreSQL, Keycloak, sauvegarde) FIRING→notifié→resolved, notification Alertmanager bout-en-bout prouvée, smoke 46/0 (`docs/staging-state.md` §10). **Gate Staging enrichi GO** et **Gate 07A — Release Readiness GO sous réserve** (6/7 critères ; reste **RR-2** traçabilité production au go-live réel, Gate 09/10). OBS-02/03 clos, R-V52-5 entièrement soldée. La release `1.0.0` est **Release-Ready**, go-live production différé (décision PO). _(Le paragraphe ci-dessous est le bandeau historique de la reprise du 2026-06-16, conservé tel quel.)_
>
> **Reprise CGPA v5.2 du 2026-06-16 : `Resume Approved with Reservations`.** Le workflow officiel de reprise a ete re-execute sous CGPA v5.2 (version courante du framework). Les 4 controles de continuite sont au vert (Migration Governance / Architecture / Delivery / Release History) ; aucun gate rejoue, aucun historique supprime, Phase 7 conservee. La migration v5.0.1 -> v5.2 est **additive** (aucune rupture, conserve v3.0/v3.0.1/v4.0/v5.0/v5.0.1) : bloc `framework` realigne, sections **§3A Release et environnements** et **§3B Etat DevSecOps** ajoutees. Reserves non bloquantes d'alignement v5.2 : ~~R-V52-3 Environment Promotion Model (ENV-01)~~ **levee — formalise le 2026-06-16** (`docs/cgpa/environment-promotion-model.md`), ~~R-V52-4 Gate 06A DevSecOps Readiness~~ **levee — Gate 06A statue GO le 2026-06-16** (`docs/cgpa/07-devsecops/gate-06A-decision.md`), R-V52-5 Release Governance **produite** (cap production PR 2 : SemVer **1.0.0**, `CHANGELOG.md`, `docs/release-notes-v1.0.0.md`, `docker-compose.prod.yml` aligné GHCR/tag immuable) ; **Gate 07A dossier préparé, non statué** (`docs/cgpa/07-devsecops/gate-07A-decision.md`) — décision différée jusqu'à la validation staging ; OBS-02/03 alerting **implemente le 2026-06-16** (PR #48, chaine Prometheus/Alertmanager auto-hebergee) — **validation staging (simulation d'incident) + re-validation Gate Staging enrichi encore en attente**. Cap production arbitre par le PO le 2026-06-16 (Plan d'Execution Niveau 3 : Release-Ready valide sur staging, SemVer 1.0.0, Alertmanager auto-heberge, 2 PR ; PR 1 = observabilite/alerting PR #48 mergee, PR 2 = Release Governance + Gate 07A a venir). Reprise precedente : CGPA v5.0.1 du 2026-06-13 (puis re-confirmee `Resume Approved` le 2026-06-14) : `Resume Approved with Reservations`. Projet repris en Phase 7 — Développement. **Plan Production Readiness 4/4 lots livrés et intégrés** (lot 4a observabilité/runbook/cron PR #28, lot 4b déploiement staging réel + smoke PR #29). Le **Gate Staging Readiness (CGPA v4.0) a été prononcé GO** le 2026-06-14 (`docs/staging-state.md`), clôturant la réserve R-4. Migration additive depuis la discipline v3.0.1 (Project State File) : phase courante, gates validés, décisions, risques, backlog et historiques conservés.

## 1. Identification du projet

* Nom du projet : LoyerTracker
* Type de projet : application web de gestion locative bailleur-centree avec delegation fine par bien
* Version actuelle : 1.15.0 (SemVer) — **EN PRODUCTION** depuis le 2026-07-30 (`PRODUCTION_DEPLOYED` ~13:20 UTC, `sha-ac374193`, `https://loyertracker.loyerpro.org`) — cf. `docs/prod-state.md` §0P pour l'historique complet des releases jusqu'ici.
* Depot : `/home/ubuntu/loyertracker`
* Branche stable de référence : `main` alignée sur `origin/main` (`162154e`, merge PR #305). Production courante : **`sha-ac374193`** (Release `1.15.0`, `PRODUCTION_DEPLOYED` le 2026-07-30 ~13:20 UTC, migration V29 additive). La dernière release clôturée `1.14.0` (`sha-27dce09d`) reste le rollback applicatif documenté.
* Derniere mise a jour : 2026-07-30 (**Désignation de Claude Code comme sous-agent UX/UI Design Lead et Design Architect (EP-16/US-125, EP-17) — deux avis proposés rendus, aucune décision de Gate prononcée.** Sur instruction explicite du Product Owner (« désigne-toi UX/UI Design Lead et Design Architect »), désignation tracée dans `docs/cgpa/agents/agent-designations-loyertracker.md` (nouvelle instance projet, `agent-registry.md` générique non modifié) — conforme à `agent-operating-model.md` §2 (« agents IA et humains ») ; **Frontend Architect et DevSecOps Lead restent à désigner**, hors périmètre de cette instruction. **Avis UX/UI Design Lead rendu** (`UXR-001.md`, nouvelle section) : les points de contrôle Gate 02A sont majoritairement couverts (personas, journeys, IA, design system minimal, maquettes, accessibilité minimale) ; **proposition GO sous réserve**, la réserve bloquante étant l'absence de validation Product Owner elle-même (critère non substituable par un avis de sous-agent). **Avis Design Architect rendu** (`DSG-001.md`, nouvelle section) : fondations documentaires jugées suffisantes pour autoriser le Lot 0/1 du Plan d'Exécution, mais **proposition NO GO en l'état pour le Gate 04A** faute de toute preuve d'implémentation (cohérent avec `CHECK-UX-01-ep17-ui-foundation.md`, résultat agrégé inchangé NON EXÉCUTÉ). **Limite d'indépendance tracée explicitement dans les deux avis** : Claude Code est l'auteur des artefacts qu'il revoit ici, une revue humaine indépendante reste recommandée avant toute décision réelle de Gate. **Aucune décision GO/GO sous réserve/NO GO n'est prononcée par ce travail** : ces deux avis sont des propositions de sous-agent, la décision reste au Chief Delivery Officer (Product Owner) conformément à `chief-delivery-officer.md` (« il ne délègue jamais la décision finale à un sous-agent ») et à `CLAUDE.md` (autorité). Aucun code, aucune dépendance, aucun déploiement produits. Prochaine étape inchangée : validation explicite du Product Owner sur le dossier EP-17/US-125.)
* Mise a jour precedente : 2026-07-30 (**Décision de socle UX/UI PrimeNG + Design Tokens LoyerTracker + thème Keycloak — `DDS-LT-001` Acceptée ; mise en œuvre non autorisée.** Le Product Owner a validé le socle Frontend : PrimeNG comme moteur de composants Angular, Design System propre à LoyerTracker comme source de vérité visuelle (tokens sémantiques `--lt-*`), continuité visuelle avec un futur thème Keycloak (sans dépendance technique). Angular Material et Tailwind global explicitement écartés. Documents produits : `docs/cgpa/design/decisions/DDS-LT-001-socle-ui-primeng-keycloak.md`, `docs/cgpa/05-architecture-conception/adr/ADR-UI-001-socle-frontend-primeng-design-tokens-keycloak.md`, `DSG-001.md` (instancié v0.1.0 Proposé), extension de `UXR-001.md` (recherche produit globale), `component-inventory-loyertracker.md`, `screen-inventory-loyertracker.md`, `traceability-ui-loyertracker.md`, mise à jour de `design-decision-register.md`/`design-debt-register-loyertracker.md` (DD-611-01→03 passées à Préparé/En traitement, jamais Clos ; 7 nouvelles dettes DD-EP17-01→07 ajoutées), `plan-execution-ux-ui-primeng-keycloak.md` (**PROPOSÉ — NON APPROUVÉ — CODE INTERDIT**), nouvel Epic **EP-17** (`addendum-backlog-ep17-ui-foundation-primeng-keycloak.md`, US-127→142, 68 pts), instance `CHECK-UX-01-ep17-ui-foundation.md` (résultat agrégé **NON EXÉCUTÉ**, 0 PASS/6 Préparation en cours/7 Non exécuté), rapport final `docs/cgpa/reports/preparation-chantier-ui-primeng-keycloak-report.md`. **Aucune installation de PrimeNG, aucune modification Angular applicative, aucun thème Keycloak, aucune dépendance ajoutée** (`package.json`/`package-lock.json` non modifiés) — strictement documentaire. Dette UX concernée : `DD-611-01→04` (héritées) et `DD-EP17-01→07` (nouvelles, dont absence de thème Keycloak, aucun état accès-refusé/404, aucune source de tokens partagée tranchée, premier modal du produit sans précédent d'accessibilité). Gates requis avant tout code : Gate 02A (US-125, en cours), Phase 04A puis Gate 04A (Design Readiness) pour EP-17, Gate DevSecOps pour la future dépendance PrimeNG, Gate Staging (`STG-ISOL-01`) pour tout pilote Keycloak. **Action autorisée suivante : soumettre ce dossier et le Plan d'Exécution au Product Owner et aux rôles CGPA requis (UX/UI Design Lead, Design Architect, Frontend Architect, DevSecOps Lead — tous à désigner).** **Aucune installation PrimeNG, aucune modification Angular et aucun thème Keycloak ne sont autorisés tant que le Plan d'Exécution et le Gate Design Readiness ne sont pas approuvés.** Détail complet en §12.)
* Mise a jour precedente : 2026-07-30 (**Cadrage documentaire Gate 02A pour US-125 — quatre livrables Phase 02 produits + `UXR-001` renseigné, aucune décision de Gate rendue.** Chantier distinct du suivi hypercare `1.15.0` ci-dessous : `phase-02-user-journeys.md`, `phase-02-information-architecture.md`, `phase-02-design-system.md`, `phase-02-ui-mockups.md` (tous rédigés par lecture directe du code existant, aucune donnée inventée) et `docs/cgpa/design/UXR-001.md` rempli à partir de ces quatre documents. Quatre DDS candidates identifiées (emplacement des préférences côté Gestionnaire, filtre/pagination de l'historique, mapping des statuts de notification, premier composant modal du produit) — aucune encore créée formellement. **Aucune décision GO/GO sous réserve/NO GO n'est prononcée** : conformément à l'autorité CGPA, elle reste au Chief Delivery Officer après avis d'un UX/UI Design Lead humain désigné et validation explicite du PO, ni l'un ni l'autre n'ayant encore eu lieu. Détail complet en §12. Prochaine étape : désigner UX/UI Design Lead et Design Architect, puis validation PO/Design Lead des cinq documents, avant toute instruction formelle du Gate 02A.)
* Mise a jour precedente : 2026-07-30 (**Hypercare `1.15.0` — Checkpoint T0 PASS ~13:27–13:28 UTC**, ~7 min après `PRODUCTION_DEPLOYED`. 8/8 actifs, 4/4 healthy, `RestartCount=0`, tag/digests conformes, Flyway 29/29, baseline et `notification_*` (34/0/0/3/0) inchangées, invariant financier 0 écart, `OBS-S10-01` 0 ligne ambiguë, `bailleur-test` désactivé, flags externes sûrs, 0 occurrence Twilio, Prometheus 5/5, Alertmanager 0 alerte, 0 5xx. 2 `ERROR` relevées mais confirmées résiduelles de la validation finale elle-même (fenêtre glissante), aucune nouvelle occurrence. Aucun critère de suspension atteint. Détail : `docs/cgpa/09-production/plan-etape-hypercare-v1.15.0.md`. Prochaine action autorisée : checkpoint T+12 (cible 2026-07-31 ~01:20 UTC), sur instruction PO explicite.)
* Mise a jour precedente : 2026-07-30 (**Validation finale Production `1.15.0` PASS — `PRODUCTION_DEPLOYED` confirmé ~13:20 UTC.** Deux passages du smoke canonique (64 PASS/1 FAIL puis 65 PASS/0 FAIL après resynchronisation `git pull` du dépôt hôte avec les PR #304/#305), nettoyage transactionnel unique de 96 lignes couvrant les deux runs, baseline et tables `notification_*` restaurées à l'identique, `bailleur-test` redésactivé. Migration V29 stable en conditions réelles, `NoopNotificationProvider` seul actif, aucun canal externe activé (K8/ADR-18). Réserves inchangées : `RSV-MIG-611-04/06`, `RSV-EP16-N2-02`. Restent à instruire : hypercare T0/T+12/T+24 puis clôture CDO. Détail : `docs/cgpa/09-production/validation-finale-v1.15.0-report.md`, `docs/prod-state.md` §0P.)
* Mise a jour precedente : 2026-07-28 (**RELEASE `1.14.0` CLÔTURÉE — CDO GO (~15:49 UTC).** Hypercare complète et sans incident : T0 PASS, T+12 et T+24 **PASS sous surveillance**, aucun critère de suspension atteint sur les trois checkpoints. État relevé live à la clôture : tag `sha-27dce09d` et digests (`sha256:089028b4…` / `sha256:7dbc551e…`) inchangés depuis le Gate, Flyway **28/28**, 8/8 actifs et 4/4 `(healthy)` avec `RestartCount=0`, **invariant financier 0 écart**, contrôle `OBS-S10-01` **0 ligne ambiguë**, `notification_outbox`/`notification_delivery` **à 0**, credentials Twilio vides et absents du `.env`, `bailleur-test` désactivé, Prometheus 5/5, Hikari pending 0, **0 5xx et 0 `ERROR` depuis le boot**, baseline métier inchangée, site public 200. **K8/ADR-18 respecté et prouvé sous trafic réel non simulé.** **`R-V54-2` FERMÉ** — premier cycle où l'écart de traçabilité est non seulement consigné mais **structurellement neutralisé** par le verrou d'état de release. Réserves à la clôture : `RSV-PROD-EP16-N1-01` **satisfaite et permanente** jusqu'au GO du Sprint N+2 ; `RSV-PROD-EP16-N1-02` (observabilité notifications, US-126), `RSV-STG-01`, `RSV-GHCR-EXT-01`, `RSV-MIG-611-04/06` **maintenues**, toutes sans rapport avec `1.14.0` ; alerte `BackupHeartbeatMissing` active mais **non bloquante** (cron 02:15 UTC non joué hôte éteint). Deux écarts de fenêtre assumés et tracés : T+12 en rattrapage (contrainte d'exploitation) et **T+24 anticipé hors fenêtre sur instruction PO** (choix de pilotage) — d'où la qualification « sous surveillance » plutôt que `PASS` plein. **L'hypothèse « aucun trafic réel » est invalidée** et cesse d'être opposable ; cette clôture **ne vaut pas validation rétroactive** des qualifications antérieures qui s'en réclamaient. `1.14.0` devient la **base de rollback**. **Prochaine action autorisée = instruction PO explicite et distincte pour le GO du Sprint N+2 (US-124/125/126)**, dont l'achèvement conditionne toute activation de canal externe. Décision : `docs/cgpa/09-production/cloture-release-v1.14.0.md`.)
* Mise a jour precedente : 2026-07-28 (**Hypercare Production `1.14.0` COMPLÈTE — T0 / T+12 / T+24 tous PASS, aucun incident ; clôture CDO restant à instruire.** T+12 exécuté le 2026-07-28 à 15:33:34 UTC en **rattrapage qualifié** (fenêtre cible 04:16–05:16 UTC tombée hôte volontairement éteint, boot 06:50:32 UTC) ; T+24 exécuté à 15:44 UTC, **anticipé d'~1 h et hors fenêtre sur instruction PO explicite** alors que l'hôte était allumé et la fenêtre atteignable — écart de pilotage assumé et tracé. Les deux checkpoints sont qualifiés **« PASS sous surveillance »**. Mesures identiques aux deux passages : 8/8 conteneurs actifs, 4/4 `(healthy)`, **`RestartCount=0`**, tag `sha-27dce09d` et digests sans dérive, Flyway **28/28**, **invariant financier 0 écart** sur 8 garanties, contrôle `OBS-S10-01` **0 ligne ambiguë**, `notification_outbox`/`notification_delivery` **à 0**, credentials Twilio **de longueur 0** et absents du `.env` (**K8/ADR-18 respecté**), `bailleur-test` désactivé, `directAccessGrants=false`, Prometheus 5/5 `up`, Hikari pending 0, **0 ligne 5xx et 0 `ERROR` depuis le boot**, baseline métier inchangée, site public 200. Alerte `BackupHeartbeatMissing` active — **non bloquante**, cron 02:15 UTC non joué hôte éteint (pattern `1.10.0`/`1.13.0`). **Trois constats structurants** : (1) **17 événements métier réels** créés le 2026-07-27 entre 18:29 et 18:34 UTC par le bailleur `5df3adf2-…`, origine **établie par `audit_log`** (20 actions, rôle `BAILLEUR`, 3 `RETENUE_LOYER` puis 14 `POINTER_PAIEMENT`) — usage légitime et audité, qui **invalide l'hypothèse permanente « aucun trafic réel »** invoquée depuis `1.4.0` ; la qualification des écarts de fenêtre doit désormais s'appuyer sur `RestartCount=0` et les compteurs mesurés. Effet probant : `outbox`/`delivery` à 0 **sous trafic réel non simulé** — meilleure preuve obtenue à ce jour du respect de K8/ADR-18. (2) **`OBS-S10-01` reste close** : le garde-fou a été rejoué avec la requête de contrôle consignée au §2 de l'arbitrage (groupement sur `cree_le`) → **0 ligne**, chaque mouvement provenant d'une transaction distincte (4 mouvements = 4 `cree_le`) ; le tri reste déterministe et aucune réouverture n'est justifiée, malgré l'apparition de 2 garanties multi-mouvements. La requête devient un **contrôle d'hypercare permanent** ; le garde-fou n° 2 (insertions multi-mouvements en une transaction) reste entier. (3) Dette documentaire soldée : **clôture post-fusion de la PR #287** (merge `624f3f3`, 2026-07-28T15:12:16Z) et registre aligné sur la **levée effective de `RSV-MIG-611-05`**. Surveillance planifiée **close** ; **la clôture de release CDO reste un acte distinct, non prononcé**, subordonné à une instruction PO explicite. Détail : `plan-etape-hypercare-v1.14.0.md`, `prod-state.md` §0O.)
* Derniere mise a jour precedente : 2026-07-27 (**Verrou d’état de release `R-V54-2` livré et éprouvé — risque FERMÉ.** GO explicite du PO reçu sur le Plan d’Exécution, lot codé, testé et documenté le jour même. **Sans aucun impact fonctionnel, sans migration SQL, sans déploiement.** Livré : `infra/release/production-state.env` (source de vérité versionnée : `RELEASE_VERSION=1.14.0`, `PRODUCTION_TAG=sha-27dce09d`, `FLYWAY_EXPECTED=28`, `PRODUCTION_DEPLOYED_AT=2026-07-27T16:46:00Z`) et `infra/release/check-release-state.sh` à deux modes **strictement en lecture seule** (`--ci` : compteur vs fichiers de migration, version vs CHANGELOG, format de tag immuable, absence de compteur codé en dur ; `--host` : tag `.env`, compteur Flyway en base, digests `api`/`nginx`). Câblages : étape CI **bloquante** dans le job Backend avant `mvn verify` (aucune expression `${{ }}`, donc aucune surface d’injection), lecture du compteur par `smoke-stack.sh` et `SchemaMigrationTest`, contrôle de dérive du tag par le smoke en Production, contrôle d’entrée en tête des checklists Gate Production (`--host`) et Gate Staging (`--ci`), entrée `CHANGELOG` sous `[Non publié]`. **Preuves** : `--ci` vert sur 5 contrôles ; **`--ci` rouge prouvé sur trois divergences simulées** (compteur désaligné, tag `latest`, version désynchronisée) avec restauration à l’identique vérifiée à chaque essai ; **`--host` vert contre la Production réelle, 4/4 contrôles cohérents**, copie de test supprimée de l’hôte, aucune mutation applicative ; `mvn verify` vert ; **3 occurrences de compteur Flyway codé en dur supprimées**, neutralisant la cause des incidents PR #77/#171. **Faux positif corrigé en cours de mise au point** : le garde-fou anti-codage-en-dur attrapait des assertions sans rapport (codes HTTP, montants) — restreint aux motifs réellement liés à Flyway. **Critère « smoke rejoué contre Staging » déclaré non applicable et justifié** par arbitrage PO (non-régression déjà couverte par `mvn verify` et `--ci` ; disproportion d’une séquence Gate Staging complète pour un lot d’outillage) — écarté explicitement, non ignoré. **Limite résiduelle assumée et tracée : pas de détection temps réel**, la CI n’ayant aucun accès à l’hôte ; la dérive est constatée au premier contrôle suivant, l’extension Pushgateway + alerte Alertmanager restant un lot ultérieur non planifié. §11, §13 et §14 mis à jour ; `R-V54-2` passe à **Fermé**.)
* Derniere mise a jour precedente : 2026-07-27 (**Arbitrage PO sur `R-V54-2` — option (a) retenue, Plan d’Exécution proposé, aucun codage autorisé.** Le PO tranche en faveur d’un **fichier d’état de release versionné** (`infra/release/production-state.env` : `RELEASE_VERSION`, `PRODUCTION_TAG`, `FLYWAY_EXPECTED`, `PRODUCTION_DEPLOYED_AT`) contrôlé à trois endroits — CI, smoke, et un contrôle de dérive dédié `infra/release/check-release-state.sh` à deux modes lecture seule (`--ci` cohérence compteur/migrations et version/CHANGELOG ; `--host` déclaré vs réel sur `.env`, base et digests). Motif structurant : (a) est la seule des trois options à produire une **détection automatique**, (b) et (c) restant tributaires de la discipline humaine — précisément ce qui a échoué deux fois (`1.11.0` puis `1.14.0`). **Bénéfice collatéral majeur** : le mécanisme supprime le **compteur Flyway codé en dur à trois endroits** (`infra/smoke/smoke-stack.sh:92` ×2, `SchemaMigrationTest.java:72`), douleur récurrente à l’origine des incidents PR #77 et PR #171 — une migration ajoutée sans réalignement fera désormais **échouer la CI avant merge**. **Limite assumée et tracée** : la CI n’ayant aucun accès à l’hôte (clé SSH strictement locale), la dérive est détectée au **premier contrôle suivant** et non en temps réel ; l’apport réel est que la fenêtre d’aveuglement passe de « indéfinie, découverte fortuite » (3 jours pour `1.14.0`) à « prochain contrôle », et que l’oubli devient **impossible à ignorer** puisqu’il fait échouer le smoke. Extension identifiée hors périmètre : agent poussant l’état de l’hôte vers le Pushgateway existant, avec alerte Alertmanager sur divergence. Plan d’Exécution Niveau 1 : `docs/cgpa/06-planification-agile/plan-execution-rv542-verrou-etat-release.md`. **Conformément au verrou CGPA rappelé par `R-S04-1`, aucune ligne de code n’est autorisée avant un GO explicite du PO sur ce plan** ; `R-V54-2` reste **Ouvert** jusqu’à livraison, ses critères de fermeture étant définis dans le plan. §11, §13 et §14 mis à jour ; aucun impact Gate/Sprint/Staging/Production, état release inchangé.)
* Mise a jour anterieure : 2026-07-27 (**Hypercare `1.14.0` — Checkpoint T0 PASS ~16:57 UTC.** Contrôlé à `2026-07-27T16:57:05Z` (`date -u` vérifié), ~11 min après `PRODUCTION_DEPLOYED`. Tous les contrôles verts : 8/8 actifs 4/4 healthy `RestartCount=0` (redémarrage complet de l’hôte du 2026-07-26 14:42 UTC antérieur à la validation, aucun redémarrage causé par elle), tag `sha-27dce09d` et digests conformes, Flyway 28/28, tables `notification_*` à 17/0/0/3/0 identiques au pré-validation, baseline 3/2/8/8/8/1/8/7 inchangée, `bailleur-test` désactivé et `directAccessGrantsEnabled=false`, **quatre flags externes vérifiés dans le conteneur API** (trois à `false`, `NOTIFICATION_DRY_RUN=true`), `/healthz` et site public 200, Prometheus 5/5, **Alertmanager 0 alerte** (le `BackupHeartbeatMissing` des T0 `1.10.0`/`1.13.0` ne s’est pas produit : heartbeat poussé au Préflight et hôte allumé en continu), Hikari `pending`=0, 0 5xx et 0 `ERROR` sur 15 min, 30 Gio disque libres et charge 0,00. **Point de contrôle spécifique satisfait : le résidu `notification_event` découvert au T0 de `1.13.0` ne s’est pas reproduit** — la leçon (inclure toute nouvelle table alimentée en écriture inline dans la liste post-nettoyage) a été appliquée à la validation finale, 0 ligne résiduelle confirmée, aucune correction nécessaire. **Particularité** : la fenêtre d’hypercare démarre à la date de la preuve (2026-07-27), pas du déploiement réel (2026-07-24) — les trois jours antérieurs restent contrôlés a posteriori mais sans télémétrie continue, même principe que `1.11.0`. **T+12 (cible 2026-07-28 ~04:46 UTC) et T+24 (cible ~16:46 UTC) restent à instruire ; clôture CDO interdite avant.** Plan : `docs/cgpa/09-production/plan-etape-hypercare-v1.14.0.md`.)
* Mise a jour anterieure : 2026-07-27 (**Validation finale `1.14.0` — PASS, `PRODUCTION_DEPLOYED` atteint ~16:46 UTC.** Exécutée sur autorisation PO explicite et distincte, elle lève la réserve bloquante ouverte le jour même par la régularisation du déploiement technique. **Contrôle d'entrée sans anomalie** — `bailleur-test@test.local` déjà `enabled=false` et `directAccessGrantsEnabled=false`, contrairement à `1.13.0` où un réimport de realm l'avait réactivé ; Flyway 28/28, compteur du smoke aligné à 28, baseline 3/2/8/8/8/1/8/7. **Smoke Production : 63 PASS / 0 FAIL au premier passage** (RUN_ID `1785170429`, code de sortie 0 capturé directement et non masqué par un pipe), couverture identique aux validations précédentes (JWT réels via Nginx TLS, parcours bailleur avec `locataireId`, invitation→acceptation Admin API→JWT gestionnaire, honoraires, alertes PREAVIS, audit, isolation cross-tenant live, RGPD export + effacement 403/204, garde-fous AuthN/ports, surface publique de vérification sans oracle) ; échafaudage `directAccessGrants` révoqué automatiquement. **Volet notifications validé en conditions réelles de Production — différence de fond avec `1.13.0` où les tables restaient vides** : le run a produit **8 `notification_event`** (5 `LOYER_EN_RETARD`, 1 `PAIEMENT_RECU`, 1 `BAIL_CREE`, 1 `PREAVIS`) tandis que **`notification_outbox` et `notification_delivery` sont restés à 0** avant, pendant et après — y compris pour `PAIEMENT_RECU`, sans template approuvé donc `DEAD` sans envoi. **Condition 6 du Gate Production satisfaite en Production réelle ; aucun envoi externe possible**, `NoopNotificationProvider` seul actif. **Nettoyage transactionnel : 47 lignes en une seule transaction** (dont les 8 `notification_event` du run, séparés des 17 préexistants appartenant à un bailleur réel ; 0 quittance référencée vérifiée avant suppression), 2 comptes Keycloak smoke supprimés, `bailleur-test` redésactivé. **État final : baseline métier et tables `notification_*` restaurées à l'identique** (3/2/8/8/8/1/8/7 et 17/0/0/3/0), 8/8 actifs 4/4 healthy, Prometheus 5/5, Alertmanager 0 alerte, 0 5xx, 0 résidu. **Note de méthode tracée** : une première tentative de nettoyage a échoué **avant tout `DELETE`** (expansion des marqueurs `$$` par le shell distant), transaction interrompue par `ON_ERROR_STOP=1`, état de la base explicitement revérifié comme inchangé avant relance par stdin. **Note non bloquante** : 1 `ERROR` API pendant le smoke (`duplicate key … bailleur_keycloak_id_key`) — pattern déjà documenté à l'hypercare `1.10.0`, l'API répond 409 correctement. **`PRODUCTION_DEPLOYED` prononcé à la date de sa preuve** (2026-07-27), le déploiement réel datant du 2026-07-24 — même principe que la régularisation `1.11.0`. §3, §3A, §11 et §14 mis à jour ; `docs/prod-state.md` §0O complété. **Prochaines étapes : hypercare T0/T+12/T+24 puis clôture CDO.** L'écart **R-V54-2** reste **ouvert** — sa mesure structurelle est indépendante de cette validation.)
* Mise a jour anterieure : 2026-07-27 (**Déploiement technique `1.14.0` constaté a posteriori — régularisation ; `PRODUCTION_DEPLOYED` NON prononcé ; écart de traçabilité en RÉCIDIVE (R-V54-2).** Sur instruction PO d'exécuter le déploiement technique `1.14.0`, les contrôles d'entrée en lecture seule sur `loyertracker-prod-server` ont révélé que **la Production tournait déjà sur le candidat `sha-27dce09d`** : le déploiement avait été exécuté le **2026-07-24 ~12:48–12:49 UTC** (bascule `.env`, recréation ciblée `api`/`nginx` à 12:48:50/12:48:51, migration **V28** à 12:49:00), soit ~4 minutes après le Préflight et dans la même session — **sans rapport écrit**. Le PO a confirmé en être l'auteur : geste volontaire non tracé, non effet de bord. **Le déploiement a été interrompu avant toute action dès le constat — aucune mutation exécutée le 2026-07-27.** Conformité technique vérifiée intégralement : digests exacts du Gate/Préflight (API `sha256:089028b4…`, Web `sha256:7dbc551e…`), `api`+`nginx` seuls recréés (`postgres` créé le 2026-07-01, Keycloak et monitoring inchangés), aucune commande Docker globale, Flyway **28/28** avec 3 templates seedés et 2 fonctions `SECURITY DEFINER`, dépôt hôte synchronisé `5d59b5f`→`8908d1d`, rollback `sha-e4744d92` présent localement et viable (V28 additive). **K8/ADR-18 respecté** : 0 variable Twilio dans le `.env` hôte ; nuance à connaître pour les contrôles futurs — le `docker-compose.yml` du Sprint N+1 injecte les variables EP-16 dans le conteneur avec **credentials vides** et flags à `false`/`NOTIFICATION_DRY_RUN=true`, ce qui n'est **pas** une violation : `NoopNotificationProvider` reste seul actif. **Preuve comportementale d'inactivité externe** : 17 événements `LOYER_EN_RETARD` enregistrés mais `notification_outbox` et `notification_delivery` à **0** — aucune tentative d'envoi. Plateforme saine (8/8 actifs, 4/4 healthy, `RestartCount=0`, Prometheus 5/5, Alertmanager 0 alerte, 0 `ERROR` et 0 5xx sur 26 h, `/healthz` et site public 200). **Réserve bloquante : le smoke Production (≥63 PASS) n'a jamais été exécuté** — la Production a tourné 3 jours sur une release techniquement conforme mais **jamais validée fonctionnellement** ; l'absence d'incident est une présomption favorable, pas une preuve. Par cohérence avec la régularisation `1.11.0`, **`PRODUCTION_DEPLOYED` n'est pas prononcé**. §3, §3A, §11, §13 et §14 mis à jour en conséquence ; `docs/prod-state.md` §0O créé. Écart consigné en **récidive** sous **R-V54-2**, statut **Ouvert**, avec mesure structurelle à arbitrer par le PO — la leçon écrite de `1.11.0` s'étant révélée insuffisante. **Prochaine étape : validation finale sur autorisation PO explicite et distincte.**)
* Mise a jour anterieure : 2026-07-27 (**Resynchronisation documentaire des §14 « Prochaine action claire » et §3 « Phase CGPA actuelle ».** Le §14 s'était arrêté au Préflight `1.11.0` du 2026-07-16 et le §3 au 2026-06-23 (Sprint 2 Patrimoine), alors que §1, §3A, §11 et §12 avaient continué d'être tenus à jour : les deux sections portant respectivement l'action immédiate et la décision courante désignaient donc des jalons dépassés — de trois releases pour le §14, de sept pour le §3. Resynchronisation **strictement additive**, sans aucune modification ni suppression de décision, de Gate ou de risque historique — les entrées ajoutées reprennent les faits déjà tracés au registre §11 et au journal §12, dans l'ordre chronologique : régularisation a posteriori de l'écart de traçabilité `1.11.0` (2026-07-19, validation finale rejouée 62/0), Sprint C EP-15 et Release **`1.12.0`** (`PRODUCTION_DEPLOYED` le 2026-07-19, `sha-359f4d63`, clôturée CDO GO le 2026-07-22), cadrage EP-16 et verrou de gouvernance K8/ADR-18, Sprint N et Release **`1.13.0`** (`PRODUCTION_DEPLOYED` le 2026-07-23, `sha-e4744d92`, clôturée CDO GO le 2026-07-24 — Production courante), Sprint N+1 WhatsApp P0 (Gate Staging GO avec vérification WhatsApp réelle, Gate Production GO sous réserve, **Préflight `1.14.0` PASS** sur le candidat `sha-27dce09d`), puis les trois lots de maintenance CI/dépendances des 2026-07-26/27. Le §14 se termine désormais par un bloc « Prochaine action claire au 2026-07-27 » : **état d'attente d'une instruction PO explicite et distincte pour le déploiement technique `1.14.0` (`api`+`nginx`, migration V28 additive), puis validation finale**, avec rappel des conditions impératives (aucun credential Twilio ni activation de canal externe avant le GO du Sprint N+2 — K8, ADR-18 ; rapport de déploiement et validation finale rédigés dans la même session que la bascule du tag — leçon `1.11.0`). Le **§3** est resynchronisé selon le même principe additif : la « Décision actuelle » est réécrite au 2026-07-27 (Production `1.13.0` clôturée, `1.14.0` prête et pré-vérifiée, prochaine décision = instruction PO de déploiement technique) et **celle du 2026-06-23 est conservée intégralement sous « Décision antérieure »** ; les « Gates transverses statués » mentionnent désormais la cadence de Gates par Sprint depuis le go-live et les deux derniers Gates statués (Sprint N+1 EP-16) ; la « Justification » est prolongée par une continuation couvrant EP-13/EP-14/EP-15/EP-16, sans retoucher le texte historique. Écart consigné et fermé en §13 sous **R-V54-1**. Aucun code, aucune migration, aucun déploiement, aucun impact Gate/Sprint/Staging/Production ; état release et prochaine étape inchangés.)
* Mise a jour anterieure : 2026-07-27 (**`sonarqube-scan-action` v6 → v8.2.1 — report levé sur instruction PO, bump prouvé avant merge (PR #269, merge `44effa83`).** L'entrée précédente consignait la PR Dependabot **#240** comme volontairement reportée, faute de pouvoir être validée : l'étape *Analyse SonarQube* porte la garde `if: github.actor != 'dependabot[bot]'` — GitHub ne transmet pas les secrets Actions du dépôt aux workflows Dependabot — donc l'étape y est sautée et la CI verte de #240 n'exerçait pas le bump. **L'obstacle était contournable** : poussée depuis une branche du dépôt, l'acteur n'est plus `dependabot[bot]` et l'étape s'exécute réellement. La PR **#269** reprend le bump à l'identique (SHA `22918119ff8e1ca75a623e15c8296b6ea4fbe28f` = v8.2.1, vérifié par déréférencement du tag annoté) et l'éprouve **avant** merge contre `https://sonar.loyerpro.org` (serveur **26.4.0**). Preuves au log du job *Frontend* : `skipSignatureVerification: false` — le défaut inversé par v8.0.0, **conservé volontairement** (aucun opt-out ajouté) —, clé `1DB198F93525EC1A` « SonarSource S.A. » récupérée sur `keyserver.ubuntu.com`, `Good signature` puis `✓ GPG signature verification passed`, SonarScanner CLI **8.1.0.6389**, Quality Gate frontend franchi (`sonar.qualitygate.wait=true`, bloquant). Le changement de rupture de v8 a donc été exercé en conditions réelles, pas seulement lu dans les notes de version. **Validation post-merge CONFIRMÉE** : le run CI de `main` sur `44effa83` est **success** sur les quatre jobs (Backend, Frontend, Sécurité, Packaging Docker), signature vérifiée et Quality Gate franchi à nouveau. #240 fermée sans merge au profit de #269. Le pin `fd88b7d7` (v6) n'a plus cours. Leçon retenue et réutilisable : **une PR Dependabot touchant une étape gardée par `github.actor` n'est pas auto-validable — la reprendre sur une branche du dépôt rend la validation possible avant merge**, au lieu de la reporter ou de la merger à l'aveugle. Aucun changement fonctionnel, aucune migration SQL, aucun impact Gate/Sprint/Staging/Production ; état release et prochaine étape inchangés.)
* Mise a jour anterieure : 2026-07-27 (**Maintenance CI/dépendances — lot Dependabot, terminé, aucun impact Gate/Sprint/Staging/Production.** Onze PR fusionnées via merge commit sur `main` après CI GitHub intégralement verte (Backend, Frontend, CodeQL Java/Kotlin + JS/TS, Sécurité Gitleaks/SCA/Trivy, Packaging Docker), dans la nuit du 2026-07-26 au 2026-07-27 (22:34–23:39 UTC) : **#239** (`actions/setup-java` 5.4.0→5.6.0, merge `765bba6b`), **#242** (`actions/setup-node` 6.4.0→7.0.0, `d5df6463`), **#260** (correctif CodeQL, `e36259e0` — voir ci-dessous), **#248** (`fast-uri` 3.1.3→3.1.4, `441cd119`), **#264** (`typescript-eslint` 8.62.1→8.65.0, `886affb6`), **#210** (groupe `angular` 22.0.5→22.0.7, 11 paquets, `e340c15e`), **#187** (`@types/jasmine` 5.1.15→6.0.0, `68777e56`), **#263** (`eslint` 9.39.4→**10.8.0**, `abc8d9a0`), **#213** (`@eslint/js` 9.39.4→**10.0.1**, `373185c9`), **#261** (`actions/checkout` 7.0.0→7.0.1, `26d869a9`), **#262** (`docker/login-action` 4.4.0→4.5.1, `59c1e1d9`). **Incident CodeQL identifié et corrigé à la racine** : Dependabot avait scindé le bump `github/codeql-action` 4.36.3→4.37.3 en deux PR (**#241** `init`, **#243** `analyze`), toutes deux rouges en *configuration error* — « Not all workflow steps that use `github/codeql-action` actions use the same version » ; fusionner l'une **ou** l'autre aurait cassé CodeQL sur `main`. PR **#260** bumpe les deux étapes dans le même commit vers `e4fba868` (v4.37.3) et ajoute un groupe `codeql-action` dans `.github/dependabot.yml` (même motif préventif que le groupe `angular` de la PR #135) ; #241/#243 fermées sans merge. Vérification post-merge : le run CodeQL de `main` sur `e36259e0` est **success** et n'émet plus le warning de désynchronisation (0 occurrence dans le log complet). Deux majeures ESLint (`eslint` 10, `@eslint/js` 10) passées sans régression, ordre de merge imposé (`typescript-eslint` d'abord, qui ouvre le peer `eslint ^10`) et gate `npm run lint` du job Frontend vert à chaque étape ; compatibilité pré-vérifiée (`angular-eslint@22` et `typescript-eslint@8.65` déclarent `eslint: ^9.0.0 || ^10.0.0`). PR fermées sans merge par Dependabot lui-même en cours de lot : **#211**/**#212**, remplacées par **#263**/**#264** (versions plus récentes) lors de la réévaluation déclenchée par la modification de `dependabot.yml`. **PR volontairement reportée : #240** (`SonarSource/sonarqube-scan-action` 6.0.0→8.2.1) — non validable depuis une PR Dependabot (l'étape *Analyse SonarQube* y est sautée faute de secrets, la CI verte n'exerce pas le bump), double bump majeur dont v8.0.0 inverse le défaut de `skipSignatureVerification` et v7.0.0 embarque SonarScanner CLI 8.0.1.6346, et fenêtre inopportune au lendemain immédiat de la clôture de l'incident CI Sonar ; report motivé en commentaire sur la PR, pin conservé `fd88b7d7` (v6), à reprendre comme chantier dédié avec pré-validation contre l'instance réelle. Correctif de configuration au passage : les cinq labels déclarés dans `dependabot.yml` (`dependencies`, `backend`, `frontend`, `devsecops`, `docker`) n'existaient pas dans le dépôt — Dependabot les signalait comme introuvables depuis le 2026-07-13 — ils ont été créés et appliqués rétroactivement aux PR ouvertes. **Incident transitoire post-merge, résolu** : le run CI de `main` sur le dernier merge (`59c1e1d9`, run `30225720230`) a échoué au job *Packaging Docker*, étape *Push des images vers GHCR* — `unknown blob` après que plusieurs couches aient été poussées (l'authentification GHCR avait donc réussi, le bump `docker/login-action` n'est pas en cause). Cause retenue : les merges rapprochés de la chaîne déclenchent chacun un run `push` sur `main`, et le groupe de concurrence `ci-${{ github.ref }}` (`cancel-in-progress: true`) a **annulé** le run du merge précédent (`26d869a9`) en plein push, laissant un upload de couche incomplet côté registre. Relance du job seul : **success**, run `30225720230` intégralement vert (Backend, Frontend, Sécurité, Packaging Docker) — aucune modification de code nécessaire. Point de vigilance pour un prochain lot : espacer les merges consécutifs sur `main`, ou exclure le job de packaging de l'annulation par concurrence, le push GHCR n'étant pas idempotent lorsqu'il est interrompu. **Validation post-merge du lot : CI et CodeQL verts sur `59c1e1d9`, les deux Quality Gates SonarQube (backend et frontend) franchis** — le lot est prouvé en conditions réelles. Aucun changement fonctionnel, aucune migration SQL, aucun déploiement Staging ni Production autorisé par ce lot ; état release inchangé, prochaine étape inchangée = déploiement technique `1.14.0` sur instruction PO distincte.)
* Mise a jour anterieure : 2026-07-26 (**Correctif CI — résolution du plugin SonarQube par coordonnées explicites (PR #257, merge `ffb789d4`).** Le run CI post-merge de la PR #256 sur `main` (run `30206844603`, 2026-07-26) avait échoué à l'étape *Analyse SonarQube* du job Backend — `mvn -B sonar:sonar` → `No plugin found for prefix 'sonar'` : résolution de préfixe non déterministe, dépendante d'un cache Maven chaud (le groupe `org.sonarsource.scanner.maven` n'est ni dans les `pluginGroups` ni déclaré dans `backend/pom.xml`). Aucun échec de test ni Quality Gate rouge ; contenu de la PR #256 documentaire pur, **aucun impact produit, Production `1.13.0` intacte**. Correctif : `.github/workflows/ci.yml` invoque désormais `org.sonarsource.scanner.maven:sonar-maven-plugin:sonar` (GAV explicite, version RELEASE inchangée). Checks pré-merge PR #257 7/7 verts. **Validation post-merge CONFIRMÉE le 2026-07-26** : le run CI de `main` sur le merge `ffb789d4` (run `30207562971`) est **success**, étape *Analyse SonarQube* franchie — le correctif est prouvé en conditions réelles, hors cache Maven chaud ; l'incident CI est **clos**. Confirmation redondante sur le merge suivant : trace documentaire mergée par la PR #258 (merge `3c06d98`, 2026-07-26 21:53 UTC), dont le job *Backend (build + tests + couverture)* du run `30222013475` est également **success**. Sans effet sur l'état release : prochaine étape inchangée = déploiement technique `1.14.0` (`api`+`nginx`, migration V28) sur instruction PO distincte, sans activer les canaux externes avant le GO du Sprint N+2.).
* Mise a jour anterieure : 2026-07-24 (Préflight Production `1.14.0` (EP-16 Sprint N+1) — PASS. Backup vérifié, absence explicite de credential Twilio confirmée sur l'hôte de production, `CHANGELOG.md` promu `[1.14.0]`. Aucun déploiement exécuté ; prochaine étape : déploiement technique distinct (`api`+`nginx`, migration V28), sans jamais activer les canaux externes avant le GO du Sprint N+2.).
* Agent ayant mis a jour le fichier : Claude Code — Désignation UX/UI Design Lead + Design Architect, avis proposés Gate 02A/04A (2026-07-30) ; précédemment Décision de socle UX/UI PrimeNG/Design Tokens/Keycloak (DDS-LT-001), EP-17 (2026-07-30) ; précédemment Cadrage documentaire Gate 02A / US-125, quatre livrables Phase 02 + UXR-001 (2026-07-30) ; précédemment Livraison verrou R-V54-2 (2026-07-27) ; précédemment Arbitrage R-V54-2 option (a) (2026-07-27) ; précédemment Hypercare 1.14.0 T0 (2026-07-27) ; précédemment Validation finale 1.14.0 (2026-07-27) ; précédemment Régularisation du déploiement technique 1.14.0 (2026-07-27) ; précédemment Resynchronisation documentaire des §14/§3 (2026-07-27) ; précédemment `sonarqube-scan-action` v8.2.1 (2026-07-27) ; précédemment Lot de maintenance Dependabot (2026-07-27), précédemment Correctif CI Sonar (2026-07-26), Hypercare `1.13.0` T0 (2026-07-23), Validation finale `1.13.0` PASS (2026-07-23) ; historiques antérieurs conservés dans les entrées chronologiques ci-dessus.

## 2. Resume executif

LoyerTracker est un MVP de gestion locative structure par le CGPA. Le projet a ete demarre sous CGPA v1.0, puis enrichi avec des pratiques proches de CGPA v3.0 : gates documentes, DevSecOps, plan d'implementation, ADR, tests et CI. La migration cible est CGPA v3.0.1, dont l'ecart principal est l'obligation du Project State File et son maintien apres chaque etape significative.

Le socle technique est operationnel ou tres avance : backend Spring Boot, frontend Angular, Keycloak, PostgreSQL, Flyway, RLS, Nginx, Docker Compose, CI GitHub Actions, CodeQL, lint, scans de securite. Les phases de cadrage et DevSecOps sont validees jusqu'au Gate 06. Le projet est en Phase 7 Developpement. S01 est cloture documentairement. S02 est realise en backend pour US-20 a US-24 et dispose d'un frontend minimal bailleur/gestionnaire pour exploiter biens, baux et affectations. S03 (paiements & garanties, US-30/31/32) est realise (backend + frontend) et clos. S04 backend est complet : lot 1 honoraires (US-40) integre via la PR #11, lot 2 alertes & consultation d'audit (US-50/51/52, US-62) integre via la PR #12, et l'alerte PREAVIS (US-50, EF-62) — critere d'acceptation fige par le PO (bande de preavis a 90 jours, exclusive de FIN_BAIL) — integree via la PR #14. Le reste fonctionnel backend S04 est ainsi clos. Le frontend S04 (consoles honoraires, alertes et journal d'audit, bailleur et gestionnaire) a ete integre via la PR #16 : S04 est desormais complet backend + frontend. Le suivi technique « double datasource » a ete realise via la PR #18 : les tests d'integration `@SpringBootTest` font desormais tourner l'application sous le role restreint `loyertracker_api` (NOSUPERUSER NOBYPASSRLS), donc la RLS `FORCE` est reellement exercee sur tout le chemin applicatif teste (flux API authentifie inclus), sans aucune modification applicative ni de migration. Le smoke test runtime sur la stack complete (Nginx TLS, Keycloak 24, JWT reels, Admin API, parcours S01->S04, isolation cross-tenant live) a ete realise via la PR #22 : 46 verifications PASS / 0 FAIL, aucun ecart applicatif revele, script rejouable versionne (`infra/smoke/smoke-stack.sh`). Tous les suivis techniques de la remediation RLS sont soldes. Le PO a ensuite arbitre en faveur du lot **production readiness**, cadre comme un plan en 4 lots (Niveau 3, defauts A-D approuves). **Plan Production Readiness 4/4 lots livres et integres dans `main`** : lot 1 chaine de livraison vers GHCR + scan Trivy de l'image web (PR #24, merge `321e195`) ; lot 2 stack staging durcie — Nginx/web non-root, SPA reelle, compose staging sur images GHCR (PR #25, merge `2403e34`) ; lot 3 sauvegarde/restauration PostgreSQL versionnee, prouvee par un drill de restauration reel (PR #26, merge `1ed1080`) ; lot 4a observabilite minimale (metriques Prometheus internes, healthcheck web), runbook d'exploitation et cron de backup installable (PR #28, merge `4e0d399`) ; lot 4b deploiement staging **reel** sur hote partage (ports alternatifs, images GHCR par tag immuable) + smoke test contre staging 46 PASS / 0 FAIL (PR #29, merge `e706721`). Le **Gate Staging Readiness (CGPA v4.0) a ete prononce GO** le 2026-06-14 (`docs/staging-state.md`), levant la reserve R-4. Le deploiement reel a revele puis corrige (dans la PR #29) quatre ecarts d'exploitation : healthcheck Nginx faux-negatif en IPv6 (sonde sur `127.0.0.1`), deux robustesses du smoke (comparaison d'issuer portless via `KEYCLOAK_ISSUER_URI`, detection de non-publication de port), et un defaut de securite herite du lot 4a (`/api/actuator/prometheus` hors `permitAll` -> 401 au scrape interne, ajoute a la liste blanche avec test de regression). Le correctif securite a ete **confirme live** apres redeploiement de l'image `sha-e7067215` (scrape interne 200, public 404). Le 2026-06-13, la **reprise CGPA v5.0.1** avait statue `Resume Approved with Reservations` (continuite saine, aucun gate rejoue). Le 2026-06-16, le staging a ete **expose publiquement** sur `https://loyertracker.staging.loyerpro.org` (nginx-proxy-manager Proxy Host #18, cert Let's Encrypt valide jusqu'au 2026-09-14, Access List basic-auth `staging`) : realm Keycloak mis a jour (redirectUris/webOrigins domaine public, PKCE S256), `.env` hote bascule au domaine public (`KC_HOSTNAME`, `KEYCLOAK_ISSUER_URI`, `APP_CORS_ALLOWED_ORIGIN`, `APP_INVITATION_BASE_URL`), correctif `server_name` Nginx (PR #39, merge `c7604b7`) — 6/6 criteres §9 `staging-state.md` verts ; documentation consignee en PR #40 (merge `2b023c0`). Le meme jour, l'**analyse statique SonarQube** a ete integree dans le pipeline CI (PR #42, merge `2f7d76f`) : backend (`loyertracker-backend`) via `mvn sonar:sonar -DskipTests` (JaCoCo XML, quality gate bloquant), frontend (`loyertracker-frontend`) via `sonarqube-scan-action@v6` (lcov, tokens dedies `SONAR_TOKEN` / `SONAR_TOKEN_FRONTEND`).

**Decision metier D-PAT-001/ADR-11 (2026-06-21→2026-06-23, Sprint 1 clôturé ; Sprint 2 backend-first clôturé côté `main`) :** le PO a validé l’évolution du modèle vers `Bailleur > Patrimoine > Bien > Contrat`, avec typologie de bien administrable et affectation gestionnaire à deux granularités. Après approbation du plan et kickoff Sprint 1, le Sprint 1 a été mergé dans `origin/main` via PR #72 (`74fe51c`) : entités/endpoints `Patrimoine` et `TypeBien`, rattachement obligatoire `Bien.patrimoineId`, migration de données `V12__patrimoine_type_bien.sql`, extension des tests d’intégration et non-régression S02/S03/S04. Les validations complètes du 2026-06-21 puis le merge PR #73 (`d0bc1d6`) confirment le **GO technique / Sprint 1 clôturé** (`sprint-1-patrimoine-cloture.md`). Le **plan d'exécution Sprint 2 Patrimoine** a été approuvé par GO PO Option A (`sprint-2-patrimoine-plan-execution.md`) : affectations patrimoine, héritage dynamique gestionnaire, priorité de résolution minimale et garde RS-06. L'exécution backend-first a été réalisée sur `sprint-2-patrimoine-reprise` et validée localement le 2026-06-23 : backend `mvn verify` 84 tests / 0 échec, frontend lint/build/Karma 41 tests SUCCESS, Gitleaks 147 commits / no leaks, Trivy frontend + global 0 HIGH/CRITICAL. Rapport : `sprint-2-patrimoine-rapport-validation.md`. État courant : PR #74 mergée (`ed448b8`) et CI GitHub verte ; Sprint 2 clôturé en GO technique côté `main`. Reste à décider séparément la promotion staging/release et le cadrage Sprint 3.

**Suivi technique post-Sprint 2 — smoke-staging réaligné et honoraires patrimoine corrigés (PR #75/#76, 2026-06-23) :** l'alignement du script `infra/smoke/smoke-stack.sh` sur le schéma V13 (patrimoine, S02, `loyerHc`/`provisionCharges`) a révélé en conditions réelles de staging que le calcul des honoraires (`calculer_honoraires()`) et leur lecture n'avaient pas été étendus par le Sprint 2 aux biens couverts par une affectation **patrimoine** (43 PASS / 4 FAIL). Corrigé par la migration **V14** (PR #76, CI verte 13/13). L'écart de gouvernance **R-S04-1** (correctif poussé directement sur `staging-smoke-s04` sans Plan d'Exécution préalable) a été régularisé a posteriori par la revue complète de la PR et fermé — cf. §13. La re-vérification du smoke staging après redéploiement reste à faire.

## 3. Phase CGPA actuelle

* Phase actuelle : Phase 7 — Developpement
* Gate actuel : Gate 07 — Developpement
* Statut du gate : non statue
* Dernier gate statue : Gate 06 — DevSecOps
* Statut du dernier gate : Go, ratifie le 2026-06-06
* Gates transverses statues : Gate Staging Readiness (CGPA v4.0) **GO** le 2026-06-14 ; **Gate 06A — DevSecOps Readiness (CGPA v5.2) GO le 2026-06-16** (`docs/cgpa/07-devsecops/gate-06A-decision.md`) ; **Gate Staging enrichi (CGPA v5.2) GO le 2026-06-19** (validation alerting RR-1, `docs/staging-state.md` §10) ; **Gate 07A — Release Readiness GO sous reserve le 2026-06-19** (`docs/cgpa/07-devsecops/gate-07A-decision.md`) — 6/7 criteres, reserve residuelle RR-2 (tracabilite production) au go-live reel ; **Gate 09 — Production Readiness GO sous reserve le 2026-06-19** (`docs/cgpa/09-production/gate-09-decision.md`) — review 19/24 (Solide), reserves RG-09-1 (capacity) / RG-09-2 (support) + RR-2 ; **Gate 10 — Mise en production GO le 2026-06-20** (`docs/cgpa/10-mise-en-production/gate-10-decision.md`) — 12/12 criteres, **release `1.0.0` LIVE sur `https://loyertracker.loyerpro.org`**, reserves **RR-2 / RG-09-1 / RG-09-2 levees**. **Depuis le go-live du 2026-06-20, la gouvernance des Gates est passee en cadence par Sprint/release** (Gate Staging incl. `STG-ISOL-01` → Gate Production → Preflight → deploiement technique → validation finale → hypercare T0/T+12/T+24 → cloture CDO), chaque decision etant tracee sous `docs/cgpa/07-devsecops/` et `docs/cgpa/09-production/` : releases `1.1.0` a **`1.13.0`** ainsi statuees et clôturees. **Gate transverse `STG-ISOL-01` (CGPA v5.4) : PASS a chaque promotion Staging depuis le 2026-06-24**, reserve RSV-STG-01 levee le 2026-06-25 par preuve live. Derniers Gates statues : **Gate Staging Sprint N+1 EP-16 (WhatsApp P0) GO le 2026-07-24** (`gate-staging-sprint-n1-ep16-decision.md`) et **Gate Production Sprint N+1 EP-16 GO sous reserve le 2026-07-24** (`gate-production-sprint-n1-ep16-decision.md`, reserve non bloquante RSV-PROD-EP16-N1-02).
* Decision actuelle (2026-07-27, apres validation finale) : **release `1.14.0` (`sha-27dce09d`, EP-16 Sprint N+1 WhatsApp P0) LIVE et VALIDEE — `PRODUCTION_DEPLOYED` atteint le 2026-07-27 ~16:46 UTC.** Smoke Production **63 PASS / 0 FAIL au premier passage**, Flyway 28/28, baseline metier et tables `notification_*` restaurees a l'identique apres nettoyage transactionnel de 47 lignes. **Volet notifications valide en conditions reelles** : 8 `notification_event` produits, `notification_outbox`/`notification_delivery` a 0 — aucun envoi externe possible, `NoopNotificationProvider` seul actif (K8, ADR-18 respecte). **Prochaine decision = hypercare `1.14.0` (T0/T+12/T+24) puis cloture de release CDO**, deux etapes distinctes sur instruction PO. **Deux points de gouvernance restent ouverts** : (1) **R-V54-2** — mesure structurelle contre la recidive des deploiements non traces, a arbitrer par le PO ; (2) le **Sprint N+2** (US-124/125/126) n'a pas encore recu de GO explicite, et son achevement conditionne toute activation de canal externe. Base de rollback : `1.13.0` (`sha-e4744d92`), V28 additive.
* Decision anterieure (2026-07-27, apres constat sur l'hote, avant validation finale) : **la Production tourne sur le candidat `1.14.0` (`sha-27dce09d`, EP-16 Sprint N+1 WhatsApp P0), deploye le 2026-07-24 ~12:48 UTC sans rapport ecrit et regularise a posteriori le 2026-07-27** (`deploiement-technique-v1.14.0-report.md`, `prod-state.md` §0O). Deploiement **techniquement conforme** (digests exacts, `api`+`nginx` seuls recreees, Flyway 28/28 avec V28 additive, rollback `sha-e4744d92` viable) et **K8/ADR-18 respecte** (0 credential Twilio, flags a `false`, `NoopNotificationProvider` seul actif, `notification_outbox`/`notification_delivery` a 0). **Mais `PRODUCTION_DEPLOYED` n'est PAS prononce** : le smoke Production (≥63 PASS) n'a jamais ete execute — la release est en service depuis 3 jours sans validation fonctionnelle. Ecart de gouvernance en **RECIDIVE** de celui de `1.11.0`, consigne **R-V54-2** (§13), mesure structurelle a arbitrer par le PO. **Prochaine decision = autorisation PO explicite et distincte pour la validation finale** (reactivation temporaire de `bailleur-test`/`directAccessGrants`, smoke, nettoyage transactionnel) ; ce n'est qu'apres ce PASS que `PRODUCTION_DEPLOYED` pourra etre prononce, puis l'hypercare et la cloture CDO instruites. La release `1.13.0` (`sha-e4744d92`) reste la **base de rollback**, clôturee en CDO GO le 2026-07-24. Gate 07 Developpement toujours non statue globalement — la livraison est gouvernee par la cadence Gate Staging/Gate Production par Sprint.
* Decision anterieure (2026-07-27, avant constat) : **Production courante = release `1.13.0` (`sha-e4744d92`, EP-16 Sprint N Fondation notifications), `PRODUCTION_DEPLOYED` le 2026-07-23 et clôturee en CDO GO le 2026-07-24** ; aucun canal externe actif, `NoopNotificationProvider` seul fournisseur en service. **La release `1.14.0` (EP-16 Sprint N+1, WhatsApp P0, candidat `sha-27dce09d`, migration V28 additive) est prete et pre-verifiee** : Gate Staging GO avec verification WhatsApp reelle, Gate Production GO sous reserve, **Preflight PASS le 2026-07-24** — `PRODUCTION_DEPLOYED` non atteint. **Prochaine decision = instruction PO explicite et distincte pour le deploiement technique (`api`+`nginx`), puis validation finale**, sous conditions imperatives K8/ADR-18 (aucun credential Twilio ni activation de canal externe en Production avant le GO du Sprint N+2) et rapport de deploiement + validation finale rediges dans la meme session que la bascule du tag (leçon `1.11.0`). Gate 07 Developpement toujours non statue globalement — la livraison est gouvernee par la cadence Gate Staging/Gate Production par Sprint. Travaux les plus recents sur `main` (`883da37`) : maintenance CI/dependances des 2026-07-26/27, sans impact Gate/Sprint/Staging/Production. **Cette formulation, fidele aux traces disponibles au moment de sa redaction, s'est revelee fausse le jour meme : le deploiement avait deja eu lieu (cf. R-V54-2).**
* Decision anterieure (2026-06-23) : Sprint 2 Patrimoine backend-first **intégré et clôturé côté `main` via PR #74** ; **smoke-staging réaligné (PR #75) et écart honoraires patrimoine corrigé (PR #76, migration V14, CI verte 13/13)** ; réserve de gouvernance **R-S04-1 régularisée et fermée** ; GO technique confirmé par validation locale + CI GitHub SUCCESS ; Gate 07 Developpement toujours non statué globalement ; prochaine décision = promotion staging/release ou cadrage Sprint 3, sous point de contrôle PO dédié — **prérequis ajouté : re-vérifier le smoke staging (0 FAIL attendu) après redéploiement du tag issu de `7547341`**
* Justification : les phases 0 a 6 disposent de livrables et decisions Go, le developpement est autorise. La resynchronisation documentaire minimale et la cloture S01 ont ete realisees le 2026-06-07. Le Plan d'Execution S02 backend a ete approuve, execute puis accepte en GO sous reserve. Le frontend S02 minimal a ete approuve, execute puis accepte en GO sous reserve le 2026-06-07. La reserve R6 (Admin API Keycloak gestionnaire) a ete corrigee et reexecutee avec succes le 2026-06-09 (client service account dedie, acceptation invitation 201, gestionnaire cree) : R6 est clotûree. Le Plan d'Execution S03 (Niveau 3) a ete approuve, execute (US-30/31/32, lot backend) puis integre dans `main` via la PR #7 (CI verte, merge commit `2f5c743`) le 2026-06-09. Le lot backend a ensuite passe une QA dediee (verdict GO, 44/44 verts) ; le Plan d'Execution Frontend S03 (Niveau 3) a ete approuve et execute le 2026-06-09 : volet IHM US-31/32 (pointage + garanties, bailleur et gestionnaire) plus deux correctifs backend issus de la QA (EN_RETARD automatise via V7, RECU >= attendu impose). Tests verts (backend 46, frontend 18) ; integre dans `main` via la PR #9 (CI verte, merge commit `a1f60dd`) le 2026-06-09. S03 (backend + frontend) est clos. Le Plan d'Execution S04 (Niveau 3) a ensuite ete approuve le 2026-06-10 avec les arbitrages A (backend d'abord, frontend S04 reporte), B (PREAVIS reporte), C (honoraires recalcules au pointage + batch) et D (2 PR). Lot 1 honoraires (US-40) execute et integre via la PR #11 (CI verte, merge commit `8ac0b49`) ; lot 2 alertes & consultation d'audit (US-50/51/52, US-62) execute et integre via la PR #12 (CI verte, merge commit `0f4f47c`). `mvn verify` vert a chaque lot (49 puis 53 tests). Le critere d'acceptation PREAVIS (US-50, EF-62) a ensuite ete fige par le PO (bande de preavis a 90 jours, bornee a `]J+60 ; J+90]` pour exclusivite avec FIN_BAIL) ; le Plan d'Execution PREAVIS (Niveau 1) a ete approuve puis execute et integre via la PR #14 (CI verte, merge commit `0cd3539`) le 2026-06-10 — migration V10 `generer_alertes(p_preavis_jours integer DEFAULT 90)`, `mvn verify` vert 54 tests, `SchemaMigrationTest` 10 migrations. S04 backend est desormais complet (PREAVIS inclus). Le Plan d'Execution Frontend S04 (Niveau 3) a ensuite ete approuve le 2026-06-10 avec les defauts A (3 consoles en un lot), B (boutons d'action EN_ATTENTE/PAYE pour les honoraires), C (alertes NON_LUE en tete) et D (audit liste brute) ; il a ete execute et integre via la PR #16 (CI verte, merge commit `99e3215`) le 2026-06-10 — service `core/s04`, composants honoraires/alertes/audit cables aux deux dashboards, sans aucune modification backend ; `lint`/`build` verts et `ng test` 27 verts (18 + 6 service + 3 composants). S04 est ainsi complet backend + frontend. Le Plan d'Execution « tests double datasource » (Niveau 3) a ensuite ete approuve le 2026-06-10 avec les defauts A–D, execute et integre via la PR #18 (CI verte 13/13, merge commit `8dbf44e`) le 2026-06-10 : datasource applicatif primaire bascule sous `loyertracker_api` (identifiants statiques de test, URL dynamique), Flyway conserve en admin (cree le role en V5 avant la 1re connexion du pool applicatif), harnais de seed/cleanup via `JdbcTemplate` admin dedie (`RlsTestDataSourceConfig`, `@Qualifier("admin")`, aucun bean `DataSource` expose), plus un test de verrou de fidelite RLS (`current_user = loyertracker_api`, non BYPASSRLS, non superuser). `mvn verify` vert 55 tests, aucune modification applicative ni de migration (aucun V11). La reserve residuelle porte uniquement sur le smoke test runtime des flux authentifies sous `loyertracker_api` sur la stack complete (Keycloak + Nginx) — a cadrer par un Plan d'Execution avant tout nouveau code. Le 2026-06-11, le gate Securite (Trivy HIGH/CRITICAL) a bloque toute PR de maniere deterministe suite a la publication de CVE-2026-45447 (HIGH, openssl 3.5.6-r0 embarque par l'image de base `eclipse-temurin:21-jre-alpine`, correctif 3.5.7-r0 publie dans les depots Alpine mais image upstream non reconstruite) ; un mini Plan d'Execution (Niveau 1) approuve par le PO a ajoute `RUN apk -U upgrade --no-cache` a l'etape run du `backend/Dockerfile` (paquets OS patches au build), integre via la PR #20 (CI verte 13/13, merge commit `98bbf41`) ; la PR #19 (synchro doc double datasource), bloquee par cette CVE sans rapport avec son contenu, a ete mise a jour avec `main` puis repassee au vert et mergee (`6a46b4c`). Enfin, le Plan d'Execution « smoke test runtime stack complete » (Niveau 2, defauts A–D) a ete approuve puis execute le 2026-06-11 et integre via la PR #22 (CI verte 13/13, merge commit `813b6d9`) : sur la stack Docker Compose complete (volume vierge, image patchee PR #20), 46 verifications PASS / 0 FAIL en 2 passages — JWT reels Keycloak via Nginx TLS, parcours S01->S04 complet (inscription, bien, bail, invitation/acceptation via Admin API reelle, affectation 8 %, echeances SECURITY DEFINER, pointage, honoraire 72,00 EUR sur la periode pointee, alertes dont PREAVIS a J+75, audit 403 gestionnaire), isolation cross-tenant live (0 fuite), pool JDBC sous `loyertracker_api` verifie, ports internes non publies ; echafaudage `directAccessGrants` revoque automatiquement, aucun ecart applicatif revele. Les suivis techniques de la remediation RLS sont tous soldes ; tout nouveau lot reste subordonne a un Plan d'Execution approuve. Le plan **Production Readiness** a ensuite ete execute en 4 lots et integre dans `main` : lot 1 CD/GHCR (PR #24, `321e195`), lot 2 staging durci (PR #25, `2403e34`), lot 3 backup/restore + drill reel (PR #26, `1ed1080`), lot 4a observabilite/runbook/cron (PR #28, `4e0d399`), lot 4b deploiement staging reel + smoke (PR #29, `e706721`). Le **Gate Staging Readiness (CGPA v4.0)** a ete prononce **GO** le 2026-06-14 (`docs/staging-state.md`, 9/9 criteres, smoke 46/0), levant la reserve R-4 ; correctif securite du scrape Prometheus interne confirme live apres redeploiement (`sha-e7067215`). **Continuation depuis le go-live du 2026-06-20 (resynchronisation du 2026-07-27, faits deja traces en §11/§12/§14)** : la mise en production de `1.0.0` a fait basculer le projet en cadence de release gouvernee, chaque lot fonctionnel etant desormais valide par un Gate Staging (incl. `STG-ISOL-01`) puis un Gate Production avant Preflight, deploiement technique, validation finale, hypercare et cloture CDO. Se sont ainsi succede : le lot Patrimoine (Sprints 1 a 3), les quittances certifiees (EP-14, release unique `1.9.0` imposee par le QR de verification), la gestion des personnes (EP-15, Sprints A/B/C, releases `1.10.0` et `1.12.0`, dont la migration V26 non additive documentee RSV-EP15-03), la fin de bail (EP-13, release `1.11.0` — dont l'ecart de tracabilite du deploiement, detecte et regularise le 2026-07-19), puis les notifications multicanales (EP-16 : Sprint N Fondation en `1.13.0`, Sprint N+1 WhatsApp P0 en `1.14.0` prete au deploiement). Le verrou de gouvernance **K8 (ADR-18)** encadre tout l'EP-16 : la capacite applicative est livree en Production mais les canaux externes restent inactifs et aucun credential Twilio n'est ajoute au `.env` de production avant le GO du Sprint N+2. Le principe fondateur reste inchange : aucun code sans Plan d'Execution approuve, aucune promotion sans Gate statue.

## 3A. Release et environnements (CGPA v5.2)

* Release actuelle : **`1.14.0`** (SemVer) — EP-16 Sprint N+1 WhatsApp P0, **LIVE et VALIDÉE** sur `https://loyertracker.loyerpro.org` (`sha-27dce09d`). Déployée le 2026-07-24 ~12:48 UTC **sans rapport écrit**, constatée et régularisée le 2026-07-27 (`deploiement-technique-v1.14.0-report.md`, écart **R-V54-2** ouvert), puis **validée le 2026-07-27 : smoke Production 63 PASS / 0 FAIL au premier passage, `PRODUCTION_DEPLOYED` atteint ~16:46 UTC** (`validation-finale-v1.14.0-report.md`, `docs/prod-state.md` §0O). Migration V28 additive : rollback applicatif seul viable vers `1.13.0` (`sha-e4744d92`). **`NoopNotificationProvider` reste l'unique fournisseur actif** : la validation a confirmé en Production réelle que 8 `notification_event` sont produits sans qu'aucune ligne n'apparaisse dans `notification_outbox`/`notification_delivery` — **aucun canal externe activé, aucun envoi possible** (K8, ADR-18). Hypercare et clôture CDO restent à instruire.
* Dernière release pleinement validée et clôturée : **`1.13.0`** (SemVer) — EP-16 Sprint N Fondation notifications (`sha-e4744d92`, Gate Production GO le 2026-07-19, Préflight PASS, déploiement technique PASS, smoke prod 63/0, `PRODUCTION_DEPLOYED` le 2026-07-23, clôture CDO GO le 2026-07-24 — cf. `docs/prod-state.md` §0N). Migration V27 additive. **Sert de base de rollback pour `1.14.0`** (images présentes localement sur l'hôte, V28 additive ⇒ rollback applicatif seul viable).
* Environnement actuel : **Production** — go-live le 2026-06-20, **LIVE sur `https://loyertracker.loyerpro.org`** (hote dedie `loyertracker-prod-server`, `docs/prod-state.md`). Staging reste actif (`https://loyertracker.staging.loyerpro.org`). Dev/Test exerces en CI (Testcontainers, smoke stack complete).
* Environnements definis (ENV-01) : Dev -> Test -> Staging -> Production, **formalises le 2026-06-16** (R-V52-3 levee) dans `docs/cgpa/environment-promotion-model.md`. Dev = `docker-compose.yml` local ; Test = CI (Testcontainers/Karma/smoke) ; Staging = `docker-compose.staging.yml` sur images GHCR à tag immuable ; Production = `docker-compose.prod.yml` sur hôte dédié, en service depuis le 2026-06-20. **Staging et Production distincts**.
* Promotion des artefacts : par image GHCR a **tag immuable `sha-<8>`** (jamais `latest` en deploiement) ; chaine CD = merge `main` -> CI publie `sha-<8>` -> redeploiement staging.
* Derniere promotion : production `sha-27dce09d` le **2026-07-24** pour la release `1.14.0` — promotion réellement exécutée mais **non validée par smoke** et non tracée au moment de la bascule (constat du 2026-07-27, `deploiement-technique-v1.14.0-report.md`). Promotion précédente : `sha-e4744d92` le 2026-07-23 pour `1.13.0`, validée par smoke 63/0 (`validation-finale-v1.13.0-report.md`). Historique des redéploiements : `docs/staging-state.md` §8 et `docs/prod-state.md`.
* Prochaine étape : **développement du Lot A du Sprint N+2 (US-124 + US-126)** — GO PO reçu le 2026-07-28, codage autorisé sous le Plan d'Exécution EP-16 approuvé. **US-125 (Lot B) est bloquée** par les Gates 02A/04A (premier lot Frontend significatif ; `UXR-001`/`DDS-001`/`DSG-001` vides) — instruction de la Phase 04A sur décision PO distincte. Prérequis au Gate Staging du Sprint N+2 : **provisionnement d'un numéro SMS Twilio** (aucun à ce jour). La release `1.14.0` est **CLÔTURÉE en CDO GO le 2026-07-28 ~15:49 UTC** (`cloture-release-v1.14.0.md`) et devient la base de rollback (`sha-27dce09d`). La validation finale est **PASS** (smoke 63/0, `PRODUCTION_DEPLOYED` le 2026-07-27 ~16:46 UTC). Rappel : l'hôte étant volontairement éteint entre les opérations, les fenêtres T+12/T+24 tombent souvent hôte éteint et sont rattrapées par un contrôle live qualifié « PASS sous surveillance » (cf. `1.9.0`, `1.12.0`). Sans jamais activer les canaux externes ni ajouter de credential Twilio à la Production avant le GO du Sprint N+2 (K8, ADR-18).
* Rollback : par redeploiement du `LOYERTRACKER_TAG` precedent (tags immuables) ; procedure documentee dans le runbook et `docs/staging-state.md` §7.

## 3B. Etat DevSecOps (CGPA v5.2)

* Build (DSO-01) : OK — backend `mvn verify` (55 tests verts), frontend `ng build`/`ng test` (27 verts) ; images reproductibles publiees sur GHCR (PR #24).
* Tests (DSO-01) : OK — unitaires + integration backend (Testcontainers, RLS `FORCE` exercee sous `loyertracker_api`), frontend Karma, smoke stack complete rejouable `infra/smoke/smoke-stack.sh` (46/0).
* SAST (DSO-02) : OK — CodeQL Java + TypeScript ; **SonarQube** (quality gate bloquant, backend + frontend, PR #42).
* SCA (DSO-02/DSO-05) : OK — OWASP Dependency-Check (informatif) ; Trivy HIGH/CRITICAL bloquant sur images **et** dependances (CVE Angular PR #36, CVE openssl PR #20 traitees de maniere deterministe).
* Secrets (DSO-03) : OK — Gitleaks en CI, secrets hors depot (`.env` non versionne, service accounts injectes au runtime).
* Images conteneurs (DSO-04) : OK — scan Trivy des images `loyertracker-api` **et** `loyertracker-web` (PR #24) ; images/web non-root (PR #25).
* Dependances critiques (DSO-05) : surveillees via Trivy + OWASP DC ; remediation par mini Plan d'Execution (precedents PR #20, #36).
* Gate 06A — DevSecOps Readiness : **GO ratifie le 2026-06-16** (R-V52-4 levee) — 7/7 criteres GO satisfaits, DSO-01→05 automatises (pipeline complet, build reproductible JDK21/Node24, tests, SAST CodeQL+SonarQube, SCA+images Trivy bloquant, secrets Gitleaks hors code, remediation dependances prouvee PR #20/#36) ; aucun critere NO GO, aucune action corrective bloquante. Decision : `docs/cgpa/07-devsecops/gate-06A-decision.md`. Reserve hors perimetre : alerting centralise (OBS-02/03).
* Gate 07A — Release Readiness : **GO sous réserve, ratifié le 2026-06-19** (`docs/cgpa/07-devsecops/gate-07A-decision.md`) : **6/7 critères satisfaits** (version SemVer 1.0.0, changelog, release notes, historique, rollback, **#6 déploiement enrichi validé** via RR-1) ; reserve résiduelle **RR-2** (#7 traçabilité production) portée au go-live réel (Gate 09/10). La release `1.0.0` est autorisée à la promotion production sous réserve RR-2 + franchissement Gates 09/10.
* Observabilite (OBS-01..03) : logs JSON ECS (backend + Nginx), Actuator health/info, metriques Prometheus (scrape interne, bloque publiquement). **Alerting implemente (PR #48)** : chaine auto-hebergee Prometheus + Alertmanager + blackbox-exporter + Pushgateway (sans port public), 10 regles sur les composants critiques (API down/erreurs/latence, 401, PostgreSQL TCP + pool Hikari, Keycloak, jobs planifies, sauvegarde) ; jauge `loyertracker_batch_last_success_epoch`, histogramme p99, heartbeat backup. **Industrialise en overlay reutilisable (PR #52→#55, 2026-06-16/17)** : la chaine `monitoring` est sortie du compose de base vers un **overlay dedie `docker-compose.monitoring.yml`** (profil opt-in `monitoring`), combinable avec le compose **dev** OU **staging** en rejoignant le meme projet/reseau (`loyertracker-net`) — l'overlay n'epingle volontairement pas `name:` pour heriter du projet du fichier de base (corrige un conflit de ports en staging, PR #52/#53). Alertmanager fige a **v0.28.1** (flag `--config.expand-environment-variables` requis, PR #54) ; **secret webhook hors depot** lu via `url_file: /tmp/webhook_url` (ecrit au demarrage depuis `.env`, jamais versionne — PR #55, le flag d'expansion d'env n'existant pas pour ce champ). Doc `docs/cgpa/observability-governance.md` + runbook §7. **OBS-02/03 clos le 2026-06-19** : validation staging par simulation d'incident réalisée (RR-1) — 4/4 composants critiques (API, PostgreSQL, Keycloak, sauvegarde) FIRING→resolved, notification Alertmanager bout-en-bout prouvée (payload capturé), smoke 46/0 ; **Gate Staging enrichi GO**. Détail : `docs/staging-state.md` §10.

## 4. D'ou l'on vient

* Idee initiale : centraliser la gestion locative pour un bailleur, avec delegation fine par bien a des gestionnaires.
* Livrables deja valides :
  * fiche idee, Gate 0 Go ;
  * expression de besoin, Gate 1 Go ;
  * etude de faisabilite, Gate 2 Go ;
  * cahier des charges, Gate 3 Go ;
  * dossier d'architecture et ADR, Gate 4 Go ;
  * backlog et sprint planning S01, Gate 5 Go ;
  * plan DevSecOps, checklists et Gate 6 Go.
* Decisions structurantes prises :
  * monolithe modulaire Spring Boot ;
  * Angular SPA derriere Nginx ;
  * Keycloak pour AuthN et RBAC grossier ;
  * autorisation fine ReBAC dans l'application ;
  * cloisonnement par `bailleur_id` et PostgreSQL RLS `FORCE` ;
  * fonctions PostgreSQL `SECURITY DEFINER` pour resolution tenant et predicats d'autorisation ;
  * port/adaptateur pour l'Admin API Keycloak gestionnaire ;
  * pseudonymisation RGPD pour l'effacement locataire ;
  * DevSecOps shift-left avec CI, SCA, secrets, image scan, SAST et lint.
* Phases deja franchies : phases CGPA cible 0, 1, 2, 3, 4, 5 et 6.
* Principales fonctionnalites deja realisees :
  * stack Docker Compose ;
  * realm Keycloak ;
  * API Spring Boot securisee JWT ;
  * schéma Flyway V1 a V10 (schema initial, resolution tenant, predicats, helpers S02, role applicatif RLS, echeances/EN_RETARD S03, honoraires S04, alertes S04, alerte PREAVIS S04) ;
  * inscription bailleur ;
  * invitation gestionnaire tokenisee 72h ;
  * acceptation d'invitation avec creation/reutilisation gestionnaire ;
  * moteur d'autorisation fine pour biens ;
  * CRUD biens backend ;
  * creation et historique des baux backend ;
  * creation, revocation et rotation des affectations backend ;
  * frontend Angular minimal pour biens, baux et affectations S02 ;
  * CI/CD de build, tests, scans et packaging Docker.

## 5. Ou l’on en est

* Etat actuel du projet : socle technique, securite et lots metier EP-03/EP-04/EP-05 livres (backend + frontend), plan Production Readiness 4/4 lots livre et **staging readiness atteint** (Gate Staging Readiness GO le 2026-06-14). Pas encore de deploiement production.
* Fonctionnalites terminees ou tres avancees :
  * US-01 stack Docker Compose ;
  * US-02 realm Keycloak et JWT resource server ;
  * US-03 Flyway schema complet, index, RLS ;
  * US-04 CI, tests, scans, CodeQL, lint ;
  * US-10 inscription bailleur ;
  * US-11 invitation gestionnaire ;
  * US-12 acceptation invitation avec faux IdP en test ;
  * US-13 autorisation fine ReBAC et tests cross-tenant ;
  * US-20 CRUD biens backend avec archivage ;
  * US-21 creation de bail actif sur bien libre avec unicite 409 ;
  * US-22 historique des baux d'un bien ;
  * US-23 creation d'affectation active avec honoraires ;
  * US-24 revocation, rotation et historique des affectations ;
  * frontend S02 minimal bailleur : liste, creation, modification, archivage des biens, baux, historiques et affectations ;
  * frontend S02 minimal gestionnaire : biens affectes, historique baux et creation de bail ;
  * US-30 generation des loyers attendus a terme echu (batch idempotent, Annexe A.3) ;
  * US-31 pointage des loyers (RECU/PARTIEL/EN_RETARD/IMPAYE, reste du, historique ; EN_RETARD automatise via V7, controle RECU >= attendu) ;
  * US-32 depot et restitution de garantie (DETENU -> RESTITUE_PARTIEL -> RESTITUE_TOTAL, Annexe A.5) ;
  * journalisation d'audit des ecritures financieres (BNF-05) ;
  * frontend S03 : pointage des loyers et gestion des garanties (bailleur et gestionnaire affecte), declenchement batch reserve au bailleur ;
  * US-40 honoraires de gestion (calcul POURCENTAGE sur loyer encaisse / FORFAIT via `calculer_honoraires()` V8, recalcul synchrone au pointage + batch, gel a PAYE, validation reservee au bailleur, audit `VALIDER_HONORAIRE`) ;
  * US-50/51 alertes de pilotage (LOYER_EN_RETARD, FIN_BAIL, PREAVIS, GARANTIE_NON_RESTITUEE via `generer_alertes(p_preavis_jours)` V9+V10, idempotente/anti-doublon) + batch `@07:00` ;
  * US-50/EF-62 alerte PREAVIS (bail ACTIF dont le terme entre dans la bande de preavis `]J+60 ; J+90]`, exclusive de FIN_BAIL, delai configurable `app.alertes.preavis.jours`) ;
  * US-52 scoping des alertes (bailleur = tout son tenant ; gestionnaire = biens affectes actifs) + marquage « lue » ;
  * US-62 consultation du journal d'audit reservee au bailleur (gestionnaire 403).
  * frontend S04 : consoles honoraires (validation EN_ATTENTE/PAYE + recalcul cote bailleur, lecture seule gestionnaire), alertes (liste NON_LUE en tete, marquage lue, generation reservee au bailleur) et journal d'audit (bailleur seul) cables aux deux dashboards ;
* Fonctionnalites en cours : **plan Production Readiness 4/4 lots livre** (PR #24/#25/#26/#28/#29) — Gate Staging Readiness GO le 2026-06-14 ; **staging expose publiquement** depuis le 2026-06-16 (`https://loyertracker.staging.loyerpro.org`, cert Let's Encrypt valide jusqu'au 2026-09-14) ; aucun lot en cours, en attente d'arbitrage PO du lot suivant.
* Suivis techniques realises :
  * 2026-06-10 (PR #18) : tests d'integration convertis au double datasource — application sous `loyertracker_api` (RLS `FORCE` reellement exercee, flux API authentifie inclus), Flyway en admin, harnais seed/cleanup via `JdbcTemplate` admin dedie, verrou de fidelite RLS anti-regression ; aucune modification applicative ni de migration ;
  * 2026-06-11 (PR #22) : smoke test runtime sur la stack complete (Nginx TLS, Keycloak 24, Admin API reelle) — 46 verifications PASS / 0 FAIL, parcours S01->S04 sous JWT reels, isolation cross-tenant live, ports internes non publies ; script rejouable versionne `infra/smoke/smoke-stack.sh`, rapport `docs/cgpa/07-devsecops/rapport-smoke-test-stack-complete.md`.
* Reserve R6 clotûree le 2026-06-09 : Admin API Keycloak gestionnaire operationnelle (client confidentiel service account `loyertracker-admin`, secret hors depot, acceptation invitation validee en runtime 201).
* Fonctionnalites non commencees :
  * interfaces frontend avancees pour biens, baux et affectations ;
  * dashboards metier consolides ;
  * export/effacement RGPD ;
  * QA/recette, production readiness, exploitation.
* Dette technique :
  * adaptateur `KeycloakGestionnaireIdentityProvider` valide en runtime le 2026-06-09 (acceptation invitation 201, gestionnaire cree avec role `GESTIONNAIRE`) — dette levee ;
  * endpoints backend S02 presents mais OpenAPI non produit ;
  * (resolu lot 4a, PR #28) observabilite minimale : metriques Prometheus internes + `/healthz`/healthcheck web ; alerting centralise restant ;
  * (resolu lot 4a, PR #28) installateur de cron de backup idempotent + runbook d'exploitation ;
  * (resolu lot 4b, PR #29) deploiement staging reel + smoke contre staging (46/0), Gate Staging Readiness GO ;
  * (resolu lot 1, PR #24) chaine de livraison vers GHCR + scan Trivy de l'image web ;
  * (resolu lot 2, PR #25) image web/Nginx non-root, stack staging durcie sur images GHCR ;
  * (resolu lot 3, PR #26) sauvegarde/restauration PostgreSQL versionnee, drill de restauration reel ;
  * rollback formel : par tag d'image immuable `sha-<8>` (lot 1), procedure documentee dans le runbook (lot 4a) ; OpenAPI non produit reste a traiter.
* Dette documentaire :
  * certains documents historiques gardent la trace CGPA v1.0 ou ancienne numerotation ;
  * R6 documentee partiellement : OIDC/PKCE/API OK, Admin API gestionnaire KO ;
  * rapport d'execution S01 separe non formalise ;
  * certains livrables historiques ne refletent pas encore S02, sauf Project State, rapport d'execution S02 backend et rapport frontend S02.
* Blocages connus : aucun blocage technique ou de gouvernance actif. R6 (Admin API) clotûree le 2026-06-09 ; S03 (backend + frontend) clos ; S04 complet backend + frontend (PR #11 + PR #12 + PR #14 + PR #16) ; tests double datasource realises (PR #18) ; smoke test stack complete realise (PR #22) ; **Production Readiness 4/4 lots livres (PR #24/#25/#26/#28/#29), Gate Staging Readiness GO (R-4 levee, zero residu)**. Tout nouveau lot reste subordonne a un Plan d'Execution approuve.


## 6. Ou l'on va

* Prochaine phase : maintien en Phase 7 — Developpement.
* Prochaine etape recommandee : décider explicitement la promotion staging du lot Patrimoine intégré (PR #72/#74) ou cadrer le Sprint 3 Patrimoine ; aucune promotion ni Sprint 3 ne démarre automatiquement par la clôture Sprint 2.
* Objectif du prochain point de contrôle : choisir entre stabilisation/promotion staging du lot Patrimoine `[Non publié]` et cadrage Sprint 3 (`EXCLUSION` complète, UX périmètre effectif), avec critères GO dédiés.
* Priorites immediates :
  * décider la promotion staging du tag GHCR issu de `main` (`ed448b8`) puis exécuter un smoke staging si promotion autorisée ;
  * maintenir le Project State (et `staging-state.md` à chaque déploiement) après chaque étape significative ; cadrer Sprint 3 avant toute logique `EXCLUSION`/UX avancée.
* Dependances a lever :
  * décision PO de promotion staging/release du lot Patrimoine `[Non publié]` ;
  * critères Sprint 3 à confirmer avant codage : `EXCLUSION` complète, UX périmètre effectif, éventuel dashboard/performance ;
  * ~~approbation PO du Plan d'Execution « Patrimoine »~~ **levée — Plan approuvé, Sprint 1 clôturé via PR #73, Sprint 2 clôturé via PR #74** ; reste la décision de promotion/cadrage suivant.


## 7. Architecture et choix techniques

* Stack backend : Java 21, Spring Boot 3.5.14, Spring Security, OAuth2 Resource Server, JPA, Flyway, PostgreSQL driver, Testcontainers.
* Stack frontend : Angular 20, keycloak-angular 20, keycloak-js, RxJS, Karma/Jasmine, ESLint.
* Base de donnees : PostgreSQL 16, schema Flyway V1 a V10, RLS `FORCE`, index uniques metier, fonctions `SECURITY DEFINER` batch (echeances, EN_RETARD, honoraires, alertes dont PREAVIS) owned par `loyertracker_batch`.
* IAM / Authentification : Keycloak 24, OIDC/PKCE, roles realm `BAILLEUR` et `GESTIONNAIRE`.
* DevOps / CI-CD : GitHub Actions CI, CodeQL, Gitleaks, Trivy, OWASP Dependency-Check informatif, Docker build.
* Hebergement cible : self-hosting conteneurise, staging/prod a definir.
* Choix techniques valides : monolithe modulaire, Nginx point d'entree unique, RLS defense en profondeur, ReBAC applicatif, port IdP gestionnaire.
* Choix techniques a confirmer : registry cible, CD staging/prod, backup/restore, chiffrement au repos, observabilite centralisee.
* **Evolution de modele D-PAT-001/ADR-11 — Sprint 1 + Sprint 2 intégrés (PR #72/#74, 2026-06-21→2026-06-23)** : insertion d’un niveau `Patrimoine` entre `Bailleur` et `Bien`, typologie administrable `TypeBien`, `Bien.patrimoineId` obligatoire, migration `V12__patrimoine_type_bien.sql` et endpoints `/api/patrimoines`, `/api/types-biens` ; Sprint 2 ajoute `Affectation.patrimoineId`, contrainte d’exclusivité bien/patrimoine, endpoint d’affectation patrimoine, héritage dynamique ReBAC via `AuthorizationService`, garde RS-06 et migration V13. Les exceptions fines complètes (`EXCLUSION`) et l'UX avancée restent à cadrer pour Sprint 3.

## 8. Securite et conformite

* Exigences securite : AuthN centralisee, RBAC, ReBAC, RLS, secrets hors depot, TLS, scans CI, RGPD by design.
* Donnees sensibles : identites bailleur, gestionnaire, locataire, emails, donnees financieres de baux/paiements/garanties.
* Mesures deja prevues :
  * RLS `ENABLE` + `FORCE` ;
  * Gitleaks et Trivy ;
  * CodeQL Java/TypeScript ;
  * CORS restreint ;
  * CSP et headers Nginx ;
  * logs sans PII ;
  * pseudonymisation RGPD prevue.
* Risques securite ouverts :
  * (resolu 2026-06-09) validation live Keycloak Admin API : client service account dedie a privileges minimaux, secret hors depot, parcours acceptation OK 201 ;
  * endpoints metier futurs a couvrir par tests cross-tenant ;
  * (resolu 2026-06-10, PR #18) role SQL privilegie en test pouvant contourner RLS : tests d'integration convertis au double datasource, l'application tourne sous `loyertracker_api` (verrou de fidelite anti-regression) ;
  * backup, chiffrement au repos et restauration non traites ;
  * observabilite securite non centralisee.
* Actions de mitigation :
  * correction runtime R6 Admin API puis retest complet ;
  * tests d'autorisation obligatoires par endpoint S03+ ;
  * revue securite des fonctions `SECURITY DEFINER` ;
  * plan production readiness avant staging/prod.

## 9. DevSecOps et qualite

* Pipeline CI/CD : CI GitHub Actions active sur push/PR (Backend, Frontend, Securite gitleaks/SCA/Trivy, CodeQL Java+TS, Packaging Docker). **CD implemente (lot 1, PR #24)** : le job Packaging Docker pousse les images `loyertracker-api` et `loyertracker-web` vers `ghcr.io/<owner>` sur push `main` uniquement (`GITHUB_TOKEN` `packages:write`, jamais depuis une PR), tags immuables `sha-<8>` (deploiement/rollback par tag explicite) + alias `latest` ; scan Trivy de l'image web ajoute au gate Securite (meme politique HIGH/CRITICAL que l'API). **Analyse statique SonarQube integree (PR #42, merge `2f7d76f`)** : backend — `mvn sonar:sonar -DskipTests` apres `mvn verify` (lit le `jacoco.xml` JaCoCo deja produit, projet `loyertracker-backend`, secret `SONAR_TOKEN`) ; frontend — `sonarqube-scan-action@v6` apres `ng test --code-coverage` (lit `coverage/loyertracker/lcov.info`, projet `loyertracker-frontend`, secret `SONAR_TOKEN_FRONTEND`) ; `sonar.qualitygate.wait=true` dans les deux projets (gate bloquant). Serveur : `https://sonar.loyerpro.org`.
* Tests unitaires : backend et frontend presents.
* Tests d'integration : backend avec PostgreSQL Testcontainers, application sous le role restreint `loyertracker_api` (double datasource PR #18 : Flyway en admin, harnais seed/cleanup via `JdbcTemplate` admin dedie) — la RLS `FORCE` est reellement exercee sur le chemin applicatif teste.
* Tests securite : RLS (exercee sous `loyertracker_api`, verrou de fidelite anti-regression), ReBAC, 401/403, cross-tenant/cross-affectation S02, scans secrets/dependances/images, CodeQL ; smoke test runtime stack complete rejouable (`infra/smoke/smoke-stack.sh`, 46 verifications : JWT reels, cross-tenant live, ports internes non publies).
* Couverture de test : `mvn verify` backend passe avec 55 tests verts (S04 : +3 honoraires lot 1, +4 alertes/audit lot 2, +1 PREAVIS ; +1 verrou fidelite RLS PR #18 ; `SchemaMigrationTest` valide 10 migrations) ; gate JaCoCo cible sur `com.loyertracker.securite` respecte ; Spotless vert ; frontend 27 tests Karma headless (18 + 6 service S04 + 3 composants S04), `ng lint`/`ng build` verts.
* Qualite du code : Spotless Maven, ESLint Angular, builds CI verts historiquement ; verification backend et frontend locale verte le 2026-06-07.
* Observabilite : logs JSON ECS backend, access logs JSON Nginx, Actuator health/info ; **metriques Micrometer/Prometheus** exposees a `/api/actuator/prometheus` (lot 4a, PR #28), **scrape interne uniquement** (reseau Docker, sans jeton — `permitAll` cible, correctif lot 4b) et **bloque publiquement par Nginx (404)** ; `/healthz` sur le port HTTP web pour la sonde de vivacite. Verifie live en staging : scrape interne 200 (tag `application="loyertracker-api"`), public 404. **Alerting implemente (PR #48)** : serveur Prometheus + Alertmanager + blackbox-exporter + Pushgateway (profil `monitoring`, opt-in, non publie), 10 regles d'alerte sur les composants critiques, notification par webhook (`ALERTMANAGER_WEBHOOK_URL` hors depot) ; `mvn verify` 58 tests + `promtool check rules` verts. Validation staging par simulation d'incident a rejouer (runbook §7).
* Sauvegarde/restauration : scripts versionnes `infra/backup/backup-postgres.sh` (dump `pg_dump -Fc` base complete app + Keycloak, `pg_dumpall --globals-only` pour les roles cluster, verification d'integrite `pg_restore --list`, retention 7 quotidiennes + 4 hebdomadaires, fichiers `600`/repertoire `700` hors depot) et `infra/backup/restore-postgres.sh` (restauration orchestree, destructive a confirmation, drill de restauration reel execute — RPO 24 h / RTO < 1 h) — lot 3, PR #26. **Installateur de cron idempotent** `infra/backup/install-cron.sh` (marqueur `# loyertracker-backup`, `--dry-run`/`--uninstall`, planification par defaut `15 2 * * *`) + runbook d'exploitation `docs/cgpa/07-devsecops/runbook-exploitation.md` — lot 4a, PR #28.
* Staging : `docker-compose.staging.yml` durci (web/Nginx non-root, SPA reelle, images consommees depuis GHCR) — lot 2, PR #25 ; **ports web hote parametrables** `WEB_HTTP_PORT`/`WEB_HTTPS_PORT` (defaut 80/443) pour cohabiter avec un reverse proxy mutualise — lot 4b, PR #29. **Deploiement staging reel realise** le 2026-06-14 sur hote partage (stack isolee `loyertracker-staging`, ports 18080/18443, issuer portless) et **smoke contre staging 46 PASS / 0 FAIL** (`infra/smoke/smoke-stack.sh` ciblable via `BASE`/`CACERT`/`COMPOSE_FILE`). **Gate Staging Readiness (CGPA v4.0) prononce GO**, rapport `docs/staging-state.md`. Reserve R-4 levee. Tag staging : `sha-4e0d3995` (4b) -> `sha-e7067215` (post-PR #29, correctif securite confirme live) -> `sha-26f16caa` (doc-only) -> **`sha-73359c5c`** (correctif CVE Angular PR #36, redeploye le 2026-06-16, tag actif). **Exposition publique activee le 2026-06-16** : `https://loyertracker.staging.loyerpro.org` (nginx-proxy-manager Proxy Host #18, cert Let's Encrypt valide jusqu'au 2026-09-14, Access List basic-auth `staging`) ; correctif `server_name` Nginx PR #39 (`c7604b7`) ; realm Keycloak mis a jour (redirectUris/webOrigins/post.logout domaine public, PKCE S256) ; `.env` hote bascule au domaine public. 4/4 healthy, 6/6 criteres d'acceptance `staging-state.md` §9 verts.

## 10. Score de maturite CGPA

* Gouvernance : 3/4
* Architecture : 3/4
* Securite : 3/4
* DevSecOps : 3/4
* Qualite : 3/4
* Documentation : 3/4
* Exploitation : 3/4
* Valeur metier : 3/4
* Score global : 24/32
* Commentaire : niveau Partiel avance. Le socle couvre les lots metier EP-03 (S02), EP-04 (S03 paiements/garanties) et EP-05 complet backend + frontend (S04 honoraires, alertes dont PREAVIS, audit), testes et integres. L'axe Exploitation passe a **3/4** avec le plan Production Readiness 4/4 lots livre : chaine de livraison CD vers GHCR (tags immuables `sha-<8>` + scan Trivy web, PR #24), stack staging durcie non-root sur images GHCR (PR #25), sauvegarde/restauration PostgreSQL prouvee par un drill reel (PR #26), observabilite minimale (metriques Prometheus internes, healthcheck web) + runbook d'exploitation + cron de backup installable (PR #28), et **deploiement staging reel + smoke contre staging 46/0** avec **Gate Staging Readiness GO** (PR #29, `docs/staging-state.md`). Restent pour viser 4/4 : alerting centralise, deploiement production reel et observabilite/securite centralisees. Le projet conserve la discipline CGPA : plan approuve avant tout nouveau lot, `staging-state.md` maintenu a chaque deploiement.

## 11. Historique des decisions

| Date | Decision | Motif | Responsable | Impact |
| ---- | -------- | ----- | ----------- | ------ |
| 2026-06-03 | Gate 0 Go | Opportunite validee, modele bailleur/gestionnaire/affectation pose | jptshilombo@gmail.com | Passage expression de besoin |
| 2026-06-04 | Gate 1 Go | Besoin et perimetre MVP valides | jptshilombo@gmail.com | Passage faisabilite |
| 2026-06-04 | Gate 2 Go | Faisabilite technique/orga/eco confirmee | jptshilombo@gmail.com | Passage CDC |
| 2026-06-04 | Gate 3 Go | CDC complet avec EF/ENF et criteres testables | jptshilombo@gmail.com | Passage architecture |
| 2026-06-04 | Gate 4 Go | Architecture validee, verrou initial de codage leve | jptshilombo@gmail.com | Passage backlog/developpement gouverne |
| 2026-06-04 | Gate 5 Go | Backlog et sprint planning S01 valides | jptshilombo@gmail.com | Passage DevSecOps/S01 |
| 2026-06-06 | Gate 6 Go | CI, securite, secrets, observabilite de base valides | jptshilombo@gmail.com | Ouverture developpement |
| 2026-06-07 | ADR-09 acceptee | Resolution tenant sous RLS via fonctions `SECURITY DEFINER` | jptshilombo@gmail.com | Debloque US-11/12/13 |
| 2026-06-07 | ADR-10 acceptee | Encapsulation Keycloak Admin API via port/adaptateur | jptshilombo@gmail.com | Debloque US-12 |
| 2026-06-08 | Rapport de Reprise CGPA v3.0.1 — GO sous reserve (consolidation S02) / NO GO (nouveau lot S03) | Livrables S02 non versionnes + faille autorisation Critique a traiter avant tout nouveau lot | jptshilombo@gmail.com | Autorise la consolidation/securisation de la delegation S02 |
| 2026-06-08 | Correctif Fix-1 approuve (controle d'autorisation applicatif sur revoquer) | Faille cross-bailleur revelee par un test ; Option A initiale (RLS seule) invalidee | jptshilombo@gmail.com | Ferme la faille sans migration ; ouvre une investigation RLS |
| 2026-06-08 | Plan de remediation RLS approuve (role applicatif dedie) — D1 split Flyway/runtime, D2 placeholder, D3 oui | Investigation : RLS contournee car l'API se connecte en superutilisateur | jptshilombo@gmail.com | Migration V5 + bascule connexion ; conversion full-stack des tests reportee en suivi |
| 2026-06-09 | Plan d'Execution R6 (Niveau 2) approuve puis execute — GO | Lever la reserve Gate 6 R6 / risque Majeur Admin API gestionnaire | jptshilombo@gmail.com | Client service account dedie + injection runtime ; R6 clotûree |
| 2026-06-09 | Plan d'Execution S03 (Niveau 3) approuve puis execute | Lot metier EP-04 paiements/garanties (US-30/31/32) | jptshilombo@gmail.com | Lot backend livre + teste ; arbitrages A (backend seul), B (@Scheduled + trigger manuel), C (audit ecrit des maintenant) retenus |
| 2026-06-09 | QA du lot backend S03 — verdict GO | Verification avant de cadrer le frontend | jptshilombo@gmail.com | 44/44 verts confirmes ; 3 arbitrages decides : EN_RETARD automatise, RECU >= attendu impose, frontend = pointage + garanties |
| 2026-06-09 | Plan d'Execution Frontend S03 (Niveau 3) approuve puis execute | Volet IHM US-31/32 + correctifs QA backend | jptshilombo@gmail.com | Frontend pointage/garanties (bailleur + gestionnaire) + V7 EN_RETARD + controle RECU livres et testes (backend 46, frontend 18) |
| 2026-06-10 | Plan d'Execution S04 (Niveau 3) approuve — defauts A–D | Lot metier EP-05 honoraires & pilotage (US-40, US-50/51/52, US-62) | jptshilombo@gmail.com | Arbitrages : A backend d'abord (frontend S04 reporte), B PREAVIS reporte, C honoraires recalcules au pointage + batch, D 2 PR (honoraires ; alertes+audit) |
| 2026-06-10 | Lot 1 S04 honoraires execute et integre (PR #11) | Calcul des honoraires de gestion (US-40) | jptshilombo@gmail.com | V8 `calculer_honoraires()`, hook pointage, gel a PAYE, validation bailleur ; merge `8ac0b49` |
| 2026-06-10 | Lot 2 S04 alertes & audit execute et integre (PR #12) | Alertes de pilotage (US-50/51/52) + consultation audit (US-62) | jptshilombo@gmail.com | V9 `generer_alertes()` (PREAVIS reporte), scoping gestionnaire, audit BAILLEUR-only ; merge `0f4f47c` |
| 2026-06-10 | Critere d'acceptation PREAVIS (US-50/EF-62) fige | Lever l'ambiguite ayant motive le report au Lot 2 | jptshilombo@gmail.com | Echeance de preavis « atteinte » = terme du bail dans la bande de preavis, avant le terme, a <= 90 jours (3 mois) ; bornee a `]J+60 ; J+90]` pour exclusivite avec FIN_BAIL |
| 2026-06-10 | Plan d'Execution PREAVIS (Niveau 1) approuve, execute et integre (PR #14) | Implementer le 4e type d'alerte PREAVIS | jptshilombo@gmail.com | V10 `generer_alertes(p_preavis_jours integer DEFAULT 90)`, delai configurable `app.alertes.preavis.jours` ; merge `0cd3539` ; S04 backend clos |
| 2026-06-10 | Plan d'Execution Frontend S04 (Niveau 3) approuve — defauts A–D, execute et integre (PR #16) | Volet IHM S04 (honoraires/alertes/audit), exposer le backend S04 | jptshilombo@gmail.com | Defauts : A 3 consoles en un lot, B boutons d'action EN_ATTENTE/PAYE, C alertes NON_LUE en tete, D audit liste brute. Service `core/s04` + composants cables aux 2 dashboards, sans modif backend ; merge `99e3215` ; S04 complet backend + frontend |
| 2026-06-10 | Plan d'Execution tests double datasource (Niveau 3) approuve — defauts A–D, execute et integre (PR #18) | Suivi technique fidelite RLS (ADR-01) : les tests `@SpringBootTest` tournaient en superutilisateur, RLS non exercee sur le chemin applicatif | jptshilombo@gmail.com | Datasource applicatif = `loyertracker_api`, Flyway admin, harnais `JdbcTemplate` admin (`RlsTestDataSourceConfig`), verrou de fidelite RLS ; `mvn verify` 55 tests, aucun correctif applicatif ni V11 requis ; merge `8dbf44e` |
| 2026-06-11 | Mini Plan d'Execution correctif gate Trivy (Niveau 1) approuve, execute et integre (PR #20) | CVE-2026-45447 (HIGH, openssl) publiee dans l'image de base `eclipse-temurin:21-jre-alpine` : gate Trivy HIGH/CRITICAL bloquant toute PR de maniere deterministe | jptshilombo@gmail.com | `RUN apk -U upgrade --no-cache` dans `backend/Dockerfile` (openssl/libcrypto3/libssl3 patches en 3.5.7-r0 au build, sans attendre l'image upstream) ; verifie localement avant push ; merge `98bbf41` ; gate debloque, PR #19 repassee verte |
| 2026-06-11 | Plan d'Execution smoke test runtime stack complete (Niveau 2) approuve — defauts A–D, execute et integre (PR #22) | Dernier suivi technique RLS : flux authentifies reels jamais verifies sur la stack complete (Keycloak + Nginx) | jptshilombo@gmail.com | Defauts : A parcours complet S01->S04 (bailleur + gestionnaire), B 2e bailleur cross-tenant live, C directAccessGrants temporaire revoque (precedent R6), D script versionne `infra/smoke/smoke-stack.sh`. 46 PASS / 0 FAIL, aucun ecart applicatif ; merge `813b6d9` ; risque runtime role restreint Ferme |
| 2026-06-11 | Arbitrage PO : lot suivant = **production readiness**, plan en 4 lots (Niveau 3, defauts A–D) | Axe Exploitation 1/4 = frein principal a la mise en production ; suivis techniques RLS soldes | jptshilombo@gmail.com | Decoupage : lot 1 CD/GHCR, lot 2 staging durci, lot 3 backup/restore, lot 4 observabilite + runbook + deploiement/smoke staging |
| 2026-06-12 | Lot 1 Production Readiness — CD/GHCR execute et integre (PR #24) | Chaine de livraison d'images + combler le scan Trivy de l'image web | jptshilombo@gmail.com | Job Packaging push `api`/`web` vers `ghcr.io/<owner>` sur push `main` (tags immuables `sha-<8>` + `latest`), scan Trivy web ajoute ; `frontend/Dockerfile` `apk -U upgrade` ; merge `321e195` |
| 2026-06-12 | Lot 2 Production Readiness — staging durci execute et integre (PR #25) | Stack staging conforme prod (moindre privilege, images du registry) | jptshilombo@gmail.com | `docker-compose.staging.yml` (web/Nginx non-root, SPA reelle, images GHCR) ; durcissement Dockerfile/nginx ; merge `2403e34` |
| 2026-06-13 | Lot 3 Production Readiness — backup/restore execute et integre (PR #26) | Solder la dette « pas de backup » par une strategie versionnee et prouvee | jptshilombo@gmail.com | `infra/backup/backup-postgres.sh` (dump base complete app+Keycloak, globals roles cluster, integrite, retention 7+4) + `restore-postgres.sh` (restauration orchestree destructive) ; **drill de restauration reel** RPO 24 h / RTO < 1 h ; cron hote reporte runbook lot 4 ; merge `1ed1080` |
| 2026-06-13 | Reprise CGPA v5.0.1 — `Resume Approved with Reservations` | Migration additive vers v5.0.1 (Migration Guide + reprise officielle) ; resync documentaire des lots 1-3 | jptshilombo@gmail.com | Continuite saine (Migration Governance / Architecture / Delivery / Release History), aucun gate rejoue, phase 7 conservee ; reserves non bloquantes R-1 (resync, traitee ici) / R-2 (bloc `framework:`, ajoute) / R-3 (decision registry/CD/backup, presente entree) / R-4 (jalon Staging v4.0 a ouvrir au lot 4) ; bloc `framework: current_version 5.0.1, migrated_from 3.0.1` ajoute |
| 2026-06-13 | Lot 4a Production Readiness — observabilite/runbook/cron execute et integre (PR #28) | Combler l'axe Exploitation : metriques, runbook, automatisation du backup | jptshilombo@gmail.com | Metriques Micrometer/Prometheus exposees a `/api/actuator/prometheus` (scrape interne, bloque publiquement par Nginx 404), `/healthz` web + healthcheck compose, installateur de cron idempotent `infra/backup/install-cron.sh`, runbook `docs/cgpa/07-devsecops/runbook-exploitation.md` ; merge `4e0d399` |
| 2026-06-14 | Lot 4b Production Readiness — deploiement staging reel + smoke execute et integre (PR #29) | Dernier lot : prouver la stack en conditions reelles et ouvrir le jalon Staging v4.0 | jptshilombo@gmail.com | Defaut retenu : ports alternatifs + smoke local sur hote partage (aucune modif de l'infra mutualisee). Ports web parametrables (`WEB_HTTP_PORT`/`WEB_HTTPS_PORT`), smoke ciblable (`BASE`/`CACERT`/`COMPOSE_FILE`). 4 ecarts trouves en deploiement reel et corriges : healthcheck Nginx IPv6->`127.0.0.1`, smoke issuer portless via `KEYCLOAK_ISSUER_URI`, smoke detection de port robuste, securite `/api/actuator/prometheus` ajoute au `permitAll` (+ test de regression). Smoke staging 46/0 ; merge `e706721` |
| 2026-06-14 | Gate Staging Readiness (CGPA v4.0) — **GO** | Jalon Staging obligatoire v4.0 (reserve R-4) apres deploiement staging reel | jptshilombo@gmail.com | 9/9 criteres satisfaits (image GHCR tag immuable, 4/4 healthy, Nginx TLS point d'entree unique + ports internes non publies, issuer portless, RLS FORCE exercee, isolation cross-tenant live 0 fuite, parcours S01->S04, observabilite `/healthz` + Prometheus bloque publiquement, smoke rejouable) ; correctif securite scrape interne confirme live apres redeploiement `sha-e7067215` (200 interne / 404 public). Rapport `docs/staging-state.md` ; **reserve R-4 levee** |
| 2026-06-14 | Re-confirmation reprise CGPA v5.0.1 — **Resume Approved** | Re-execution du workflow officiel de reprise (nouvelle session) par le CGPA Chief Delivery Officer | jptshilombo@gmail.com | 4/4 controles de continuite PASS (Migration Governance / Architecture / Delivery / Release History) ; aucun gate rejoue, aucun historique supprime, Phase 7 conservee. Reserves de migration R-1→R-4 closes (R-4 levee par le Gate Staging GO). Sous-agents mobilises : Governance Officer / Enterprise Architect / DevSecOps Lead / Release Manager (tous GO, EA GO sous reserve mineure). Reserves non bloquantes residuelles (dette ordinaire, hors continuite) : A1 numerotation ADR (04–08 absents, `ADR-08` cite au runbook), G1 ADR exploitation optionnel (R-3), P1 OpenAPI absent + UX S02 minimale. Prochaine action : arbitrage PO du lot suivant, subordonne a un Plan d'Execution approuve (verrou v3.0) |
| 2026-06-16 | Mini Plan d'Execution correctif gate Trivy / CVE Angular (Niveau 1) approuve, execute et integre (PR #36) | Gate Securite (Trivy scan npm) en echec **deterministe en post-merge sur `main`** (runs PR #34 `8a7fc86f` et #35 `9cf412ac`) sur 3 CVE HIGH Angular fraichement publiees : CVE-2026-54266 + CVE-2026-54268 (`@angular/common`), CVE-2026-54267 (`@angular/core`) ; `Packaging Docker` passe en `skipped` -> aucune image GHCR publiee pour ces SHA | jptshilombo@gmail.com | Bump coordonne de la ligne framework Angular **20.3.24 -> 20.3.25** (`animations`, `common`, `compiler`, `core`, `forms`, `platform-browser`, `platform-browser-dynamic`, `router`, `compiler-cli`) + `package-lock.json` regenere, aucun changement applicatif. Validation locale : `ng lint` OK, `ng build --configuration production` OK, `ng test` 27/27 OK. Meme schema que la CVE-2026-45447 (openssl, PR #20) : echec lie a la vulndb Trivy, non au contenu. **Mergee le 2026-06-16, merge commit `73359c5`** ; CI post-merge `main` verte (Securite pass, Packaging Docker execute), **image GHCR `sha-73359c5c` republiee** (+ `latest`) |
| 2026-06-16 | Redeploiement staging sur `sha-73359c5c` | Realigner le tag deploye sur `main` HEAD post-correctif CVE Angular (PR #36) ; aucune regression fonctionnelle | jptshilombo@gmail.com | Stack redeployee avec `sha-73359c5c` sur `ai-test-server` : 4/4 healthy, smoke 46/0, scrape Prometheus interne 200 / public 404. Tag auparavant `sha-26f16caa` (doc-only). Synchro documentaire `docs/staging-state.md` via PR #37 (merge `d0c6d62`) |
| 2026-06-16 | Correctif `server_name` Nginx pour exposition publique (PR #39) | Nginx rejetait les requetes de nginx-proxy-manager avec `Host: loyertracker.staging.loyerpro.org` (uniquement `server_name localhost`) -> 502 Bad Gateway sur le domaine public | jptshilombo@gmail.com | `infra/nginx/nginx.conf` : `server_name localhost loyertracker.staging.loyerpro.org _;` (PR #39, merge `c7604b7`). Applique a chaud via `nginx -s reload` dans le conteneur vivant ; embarque dans la prochaine image GHCR |
| 2026-06-16 | Exposition publique du staging activee — `https://loyertracker.staging.loyerpro.org` | Rendre le staging accessible a des parties prenantes externes (validation produit/recette) sans serveur dedie | jptshilombo@gmail.com | Composantes : Route53 `A loyertracker.staging.loyerpro.org -> 51.102.234.232` (TTL 300) ; realm Keycloak mis a jour (`redirectUris`/`webOrigins`/`post.logout` domaine public, `pkce.code.challenge.method S256`) via kcadm ; `.env` hote bascule (`KC_HOSTNAME`, `KEYCLOAK_ISSUER_URI`, `APP_CORS_ALLOWED_ORIGIN`, `APP_INVITATION_BASE_URL` = domaine public ; `KEYCLOAK_JWK_SET_URI` reste interne) ; nginx-proxy-manager Proxy Host #18 -> `https://172.31.11.102:18443` (proxy_ssl_verify off), cert Let's Encrypt valide jusqu'au 2026-09-14, Access List basic-auth `staging`. 4/4 healthy, 6/6 criteres d'acceptance §9 verts. Rapport `docs/staging-state.md` §9 (PR #40, merge `2b023c0`) |
| 2026-06-16 | Integration SonarQube dans le pipeline CI GitHub Actions (PR #42) | Ajouter l'analyse statique de code (qualite + couverture) au pipeline, avec quality gate bloquant | jptshilombo@gmail.com | Backend : `mvn sonar:sonar -DskipTests` apres `mvn verify` (JaCoCo XML deja produit, projet `loyertracker-backend`, `SONAR_TOKEN`) ; frontend : `sonarqube-scan-action@v6` apres `ng test --code-coverage` (lcov `coverage/loyertracker/lcov.info`, projet `loyertracker-frontend`, `SONAR_TOKEN_FRONTEND`) ; `sonar.qualitygate.wait=true` (gate bloquant dans les deux projets). Correctifs appliques : bump `@v5` -> `@v6` (CVE action), token projet dedie frontend (`SONAR_TOKEN_FRONTEND`). **Mergee le 2026-06-16, merge commit `2f7d76f`**. CI post-merge `main` verte |
| 2026-06-16 | Reprise CGPA v5.2 — **`Resume Approved with Reservations`** | Re-execution du workflow officiel de reprise sous la version courante du framework (v5.2, additive vs v5.0.1 consignee) | jptshilombo@gmail.com | 4/4 controles de continuite PASS (Migration Governance / Architecture / Delivery / Release History) ; aucun gate rejoue, aucun historique supprime, Phase 7 conservee. Sous-agents : Governance Officer GO, Enterprise Architect GO sous reserve mineure (ADR-04→08), DevSecOps Lead GO, Release Manager GO sous reserve. **Alignement applique** : bloc `framework` 5.0.1 -> 5.2 (lignee 3.0.1 -> 5.0.1 -> 5.2), sections v5.2 §3A (release et environnements) + §3B (etat DevSecOps) ajoutees. Reserves non bloquantes : R-V52-3 Environment Promotion Model (ENV-01), R-V52-4 Gate 06A DevSecOps Readiness (preuves reunies, ratification a produire), R-V52-5 Release Governance (SemVer/changelog/release notes) + Gate 07A **avant** promotion production ; OBS-02/03 alerting centralise. Tout nouveau code reste subordonne a un Plan d'Execution approuve |
| 2026-06-16 | **Environment Promotion Model (ENV-01, CGPA v5.2) formalise** | Definir explicitement la chaine d'environnements (leve R-V52-3) | jptshilombo@gmail.com | Modele Dev -> Test -> Staging -> Production formalise dans `docs/cgpa/environment-promotion-model.md` (profil PME, sans fusion Dev/Test) : Dev = `docker-compose.yml` local, Test = CI (Testcontainers/Karma/smoke), Staging = `docker-compose.staging.yml` images GHCR tag immuable `sha-<8>` (expose publiquement), Production = `docker-compose.prod.yml` non provisionnee. Staging et Production distincts. Regles de promotion + tracabilite (mappee sur `staging-state.md` §8) + gates applicables. Reserve d'alignement consignee : `docker-compose.prod.yml` reference encore `loyertracker/api|web:${IMAGE_TAG:-latest}`, a basculer sur GHCR + tag immuable au cadrage production (R-V52-5 / Gate 07A) |
| 2026-06-16 | **Gate 06A — DevSecOps Readiness (CGPA v5.2) — GO** | Ratifier la capacite de delivery securisee (leve R-V52-4) | jptshilombo@gmail.com | 7/7 criteres GO satisfaits ; DSO-01→05 automatises : pipeline complet (`ci.yml`+`codeql.yml`), build reproductible (JDK21/Node24, deps verrouillees, images GHCR `sha-<8>`), tests (mvn verify 55, ng test 27, smoke 46/0), SAST (CodeQL Java+TS + SonarQube quality gate bloquant), SCA + scan images (Trivy `CRITICAL,HIGH` `exit-code 1` sur deps npm et images api/web), secrets hors code (Gitleaks), remediation dependances prouvee (PR #20 openssl, PR #36 Angular). Aucun critere NO GO, aucune action corrective bloquante. Sous-agent : DevSecOps Lead GO. Reserve hors perimetre 06A : alerting centralise (OBS-02/03), suivi au titre de l'Observability Governance / Gate 07A. Decision : `docs/cgpa/07-devsecops/gate-06A-decision.md` |
| 2026-06-16 | Cap production — arbitrage PO + Plan d'Execution (Niveau 3) approuve | Engager le cap production : R-V52-5 (Release Governance + Gate 07A) + OBS-02/03 (alerting) | jptshilombo@gmail.com | Defauts A-D retenus : A Release-Ready valide sur staging (go-live reel = lot suivant, hors Gate 09/10), B SemVer **1.0.0**, C **Alertmanager auto-heberge**, D **2 PR**. Verrou CGPA respecte : aucun code avant approbation |
| 2026-06-16 | Cap production PR 1 — Observabilite / Alerting (OBS-02/03) executee et integree (PR #48) | Brancher l'alerting des composants critiques | jptshilombo@gmail.com | Chaine Prometheus + Alertmanager + blackbox-exporter + Pushgateway (profil Compose `monitoring`, opt-in, sans port public ; Pushgateway loopback). 10 regles d'alerte (API down/erreurs/latence, 401, PostgreSQL TCP + pool Hikari, Keycloak, jobs planifies, sauvegarde). Backend minimal : jauge `loyertracker_batch_last_success_epoch{job}` (2 schedulers), histogramme p99 `http.server.requests`, test `BatchMetricsTest`. Heartbeat backup -> Pushgateway. `mvn verify` 58 tests verts, `promtool check rules` 10 regles, `docker compose config` OK (dev/smoke inchangee). CI verte apres re-run d'une course SonarQube serveur-side (double trigger push+PR, sans rapport avec le code). **Mergee le 2026-06-16, merge commit `753cbad`.** Reste : validation staging par simulation d'incident + re-validation Gate Staging enrichi |
| 2026-06-16 | Cap production PR 2 — Release Governance v1.0.0 (R-V52-5) préparée | Produire les livrables de release et préparer le Gate 07A | jptshilombo@gmail.com | SemVer **1.0.0** (`pom.xml` 0.1.0-SNAPSHOT→1.0.0, `package.json`/lock 0.1.0→1.0.0) ; `CHANGELOG.md` (Keep a Changelog, D-REL-003) ; `docs/release-notes-v1.0.0.md` (identification D-REL-001 + traçabilité D-REL-004) ; `docker-compose.prod.yml` **aligné GHCR + tag immuable** (`loyertracker/api|web:latest` → `ghcr.io/jptshilombo/loyertracker-{api,web}:${LOYERTRACKER_TAG}`, build local retiré via `!reset`) — lève la réserve d'alignement ENV. **Gate 07A dossier préparé (`docs/cgpa/07-devsecops/gate-07A-decision.md`), non statué** : décision GO sous réserve différée jusqu'à la validation staging (RR-1). Go-live production = lot ultérieur (Gate 09/10). **Mergée le 2026-06-16 (PR #51, merge `6c7be10`).** |
| 2026-06-19 | Reprise CGPA v5.2 re-executee (nouvelle session) — **`Resume Approved with Reservations`** | Re-execution du workflow officiel de reprise par le CGPA Chief Delivery Officer | jptshilombo@gmail.com | 4/4 controles de continuite PASS (Migration Governance / Architecture / Delivery / Release History) ; aucun gate rejoue, aucun historique supprime, Phase 7 conservee. Verifications dépôt : SemVer **1.0.0** confirmee (`backend/pom.xml` l.16, `frontend/package.json`), `docker-compose.prod.yml` aligne GHCR/tag immuable, chaine monitoring presente (`infra/monitoring/`, `docker-compose.monitoring.yml`), Gate 06A GO ratifie, Gate 07A non statue (dossier prepare). Sous-agents : Governance Officer GO, Enterprise Architect GO sous reserve mineure (ADR-04→08 absents), DevSecOps Lead GO, Release Manager GO sous reserve (RR-1 ouverte). **Ecart de continuite documentaire detecte (R-V52-6)** : HEAD `main` (`c587e39`) en avance sur ce fichier — PR #51 (Release Governance, mergée) puis PR #52→#55 (correctifs operationnels alerting : monitoring en overlay reutilisable `docker-compose.monitoring.yml`, Alertmanager v0.28.1, webhook `url_file`) non consignes en §11/§12. Reserves residuelles : R-V52-6 (resync doc, traitee ici), RR-1 (validation staging alerting + Gate Staging enrichi, prerequis Gate 07A), dette ordinaire (OpenAPI, ADR-04→08, UX S02). Tout nouveau code reste subordonne a un Plan d'Execution approuve |
| 2026-06-19 | Plan d'Execution RR-1 (Niveau 2, sans code applicatif) approuve — defauts A/D | Lever RR-1 : valider l'alerting (OBS-02/03) en conditions reelles sur staging | jptshilombo@gmail.com | Arbitrages : A recepteur de notification **local jetable** (conteneur `am-sink` reseau interne, aucune donnee hors infra), D **statuer le Gate 07A dans la meme passe**. Perimetre : overlay `monitoring` sur staging + simulations d'incident (runbook §7), aucune modification de code/backend/frontend. Verrou CGPA respecte : aucune execution avant approbation |
| 2026-06-19 | RR-1 — validation staging de l'alerting executee — **probante** | Prouver que chaque composant critique leve/notifie/resorbe une alerte | jptshilombo@gmail.com | Tag staging `sha-73359c5c`. 4/4 cibles Prometheus `up`. **4/4 composants critiques FIRING→resolved** : API (`ApiDown`), PostgreSQL (`PostgresProbeDown`), Keycloak (`KeycloakProbeDown`), Sauvegarde (`BackupHeartbeatMissing`). **Notification bout-en-bout prouvee** (payload Alertmanager `BackupHeartbeatMissing` capture par le recepteur via `url_file`). Smoke de non-regression **46/0**, 4/4 services applicatifs `healthy`, echafaudage `directAccessGrants` revoque. Aucun secret expose ; recepteur jetable supprime apres preuves ; overlay `monitoring` laisse actif. Detail : `docs/staging-state.md` §10. **OBS-02/03 clos, RR-1 levee** |
| 2026-06-19 | **Gate Staging enrichi (CGPA v5.2) — GO** | Re-validation du jalon Staging enrichi (logs / monitoring / alertes critiques) apres RR-1 | jptshilombo@gmail.com | 3/3 criteres enrichis verts : logs JSON ECS ✅, monitoring actif (Prometheus 4/4 cibles `up`, live) ✅, alertes critiques definies & exercees (10 regles, 4/4 composants FIRING→notifie→resolved) ✅ ; conserve les 9 criteres v4.0. Sous-agent : Release Manager GO. `docs/staging-state.md` §10 |
| 2026-06-19 | **Gate 07A — Release Readiness (CGPA v5.2) — GO sous reserve** | Statuer la readiness de release apres levee de RR-1 (arbitrage D : meme passe) | jptshilombo@gmail.com | **6/7 criteres satisfaits** : version SemVer 1.0.0, changelog, release notes, historique, rollback, **#6 deploiement enrichi valide** (Gate Staging enrichi GO). Reserve residuelle **RR-2** (#7 tracabilite production : date/tag/operateur/verifications) **portee au go-live reel** (Gate 09 — Production Readiness / Gate 10 — Mise en production). Release `1.0.0` autorisee a la promotion production sous reserve RR-2 + Gates 09/10. Sous-agent : Release Manager GO sous reserve. R-V52-5 entierement soldee. Decision : `docs/cgpa/07-devsecops/gate-07A-decision.md` |
| 2026-06-19 | Cap go-live — Plan d'Execution Gates 09/10 (Niveau 3, sans code applicatif) approuve — arbitrages A/B | Engager le go-live production reel de la release `1.0.0` (Gate 09 puis Gate 10, levee RR-2) | jptshilombo@gmail.com | Arbitrages PO : **A cible Production = hote dedie** distinct de staging (ENV-01 strict, isolation maximale, go-live reel) ; **B recette = waiver trace** (smoke 46/0 + Gate Staging enrichi GO en equivalence, pas de Gate 08 formel). Perimetre : production readiness review, provisioning hote dedie, deploiement `1.0.0` + overlay monitoring, smoke prod, dossiers Gate 09/10, levee RR-2 ; **aucune modification backend/frontend**. Verrou CGPA respecte : aucune execution avant approbation |
| 2026-06-19 | **Gate 09 — Production Readiness (CGPA v5.2) — GO sous reserve** | Confirmer la readiness-to-go de la solution/exploitation avant la mise en production (Gate 10) | jptshilombo@gmail.com | **Production Readiness Review** produite (`docs/cgpa/09-production/production-readiness-review.md`) : Runbooks 3 / Monitoring 4 / Alerting 4 / Capacity 2 / Support 2 / Rollback 4 = **19/24 (Solide)**. Socle d'exploitation prouve en conditions reelles sur staging (monitoring 4/4 cibles `up`, alerting 4/4 composants FIRING→notifie→resolved RR-1, rollback par tag immuable + drill restauration RPO 24 h/RTO < 1 h, runbook eprouve). Reserves non bloquantes : **RG-09-1** (capacity : pas de campagne de charge, accepte PME, surveille par monitoring), **RG-09-2** (support : modele d'astreinte informel a documenter au Gate 10), **RR-2** (tracabilite production au deploiement). Recette par **waiver trace** (smoke 46/0 + Gate Staging enrichi GO). Sous-agents : Governance Officer GO sous reserve, Enterprise Architect GO sous reserve, DevSecOps Lead GO, Release Manager GO sous reserve. **Ouverture du Gate 10 autorisee.** Decision : `docs/cgpa/09-production/gate-09-decision.md` |
| 2026-06-20 | **Gate 10 — Mise en production (CGPA v5.2) — GO** | Acter la mise en production effective de la release `1.0.0` sur l'hote dedie | jptshilombo@gmail.com | **Release `1.0.0` (`sha-73359c5c`) LIVE sur `https://loyertracker.loyerpro.org`** (hote dedie EC2 `t3.medium`, TLS Let's Encrypt). **12/12 criteres** : 4/4 healthy, Flyway V1→V10, pool `loyertracker_api`, issuer portless, **smoke prod 46/0**, monitoring **5/5 cibles `up`**, **alerting Discord prouve** (`Gate10NotificationDrill` FIRING+RESOLVED, `notifications_total=2` / `failed_total=0`, reception PO confirmee), backup `-Fc` verifie `pg_restore --list` + cron prod, base **vierge** (reset propre, 0 ligne metier), compte de test `bailleur-test@test.local` **desactive**. Reserves **RR-2 / RG-09-1 / RG-09-2 levees** (RG-09-1 baseline `t3.medium` + surveillance live ; RG-09-2 canal Discord + processus minimal `prod-state.md` §10). 3 ecarts go-live corriges (compose prod jamais deploye) : ports nginx `!override` (PR #60), Keycloak `start` sans `--optimized` + `KC_HOSTNAME` public (PR #61), receiver Alertmanager `discord_configs` (PR #62). Sous-agents : Governance Officer / Enterprise Architect / DevSecOps Lead / Release Manager **tous GO**. Decisions : `docs/cgpa/10-mise-en-production/gate-10-decision.md`, `docs/prod-state.md`, `docs/release-notes-v1.0.0.md` §5 |
| 2026-06-20 | **Plan d'Execution Onboarding bailleurs (piste B, Niveau 2) approuve, execute et integre (PR #68)** | Industrialiser la creation **controlee** de comptes bailleur apres le go-live (pas d'inscription publique, sans dependance email/SMTP) | jptshilombo@gmail.com | Arbitrages PO : **A3 — creation admin outillee** (script versionne) + **B1 — transmission hors-bande** des identifiants (mot de passe temporaire affiche une fois, changement force au 1er login via UPDATE_PASSWORD). Livrable `infra/keycloak/creer-bailleur.sh` : idempotent (anti-doublon email, exit 3), identifiants admin lus depuis `.env` (aucun secret versionne), `COMPOSE_FILE` selectionne la stack dev/staging/prod, role realm BAILLEUR assigne, tenant RLS auto-cree au 1er login via `POST /api/bailleurs/inscription`. `registrationAllowed` reste **false**. **Valide sur staging** (creation OK, BAILLEUR-only, UPDATE_PASSWORD force, idempotence exit 3, nettoyage) ; compte bailleur du PO provisionne en production. Mergee PR #68 (`8b20e9a`). Verrou CGPA respecte : aucune execution avant approbation |
| 2026-06-21 | Reprise CGPA v5.2 re-executee (nouvelle session) — **`Resume Approved with Reservations`** | Re-execution du workflow officiel de reprise (`docs/cgpa/workflows/project-resume-workflow.md`) par le CGPA Chief Delivery Officer | jptshilombo@gmail.com | 4/4 controles de continuite : Migration Governance PASS, Architecture Continuity PASS, **Delivery Continuity PASS sous reserve documentaire**, Release History PASS. Aucun gate rejoue, aucun historique supprime, Phase 7 conservee, release `1.0.0` inchangee (toujours LIVE). Ecart detecte : `main` HEAD (`23c502f`, PR #70 mergee le 2026-06-21) en avance sur ce fichier — lot post-go-live **« Quittances de loyer »** non consigne en §2/§3/§5/§11/§12 (PR1 fondation donnees : V11 ventilation `loyer_hc`/`provision_charges` + profil bailleur ; PR2 generation PDF quittance/avis d'echeance, package `documents`, OpenHTMLtoPDF, en cours sur `feat/quittances-documents`, 8 commits non merges). `CHANGELOG.md` (`[Non publie]`) deja a jour pour PR1+PR2 — discipline Release Governance maintenue independamment du Project State. Sous-agents : Governance Officer GO sous reserve (resync), Enterprise Architect GO (migration V11 et module `documents` additifs, RLS/ReBAC respectes, aucune rupture structurante ; reserve mineure persistante ADR-04→08 absents), DevSecOps Lead GO sous reserve (confirmer CI verte de la branche avant merge final ; nouvelle dependance `openhtmltopdf-pdfbox:1.0.10` a couvrir par le prochain scan SCA/Trivy), Release Manager GO (release `1.0.0` non affectee, lot non encore publie, aucun gate de release a statuer). Reserves non bloquantes ouvertes : **R-V52-7** (resync narrative complete §2/§3/§5 a finaliser au prochain point de controle), **R-V52-8** (pas de fichier Plan d'Execution dedie retrouve pour le lot Quittances ; arbitrages PO A/B/C/D attestes dans les messages de commit, a formaliser), **R-V52-9** (PR2 Quittances non mergee + 1 modification locale non committee sur `s03-api.service.ts`, refactor mineur sans impact fonctionnel — a clore au merge). Tout nouveau code reste subordonne a un Plan d'Execution approuve |
| 2026-06-21 | **D-PAT-001 / ADR-11 — Introduction de la notion de Patrimoine — Proposee (analyse d'impact, aucun code)** | Decision metier validee par le PO : nouveau niveau `Bailleur > Patrimoine > Bien > Contrat`, typologie administrable des biens, affectation gestionnaire a deux granularites (patrimoine et bien) avec priorite et exceptions inclusion/exclusion | jptshilombo@gmail.com | Analyse d'impact complete produite, **aucun code ni migration SQL** (mission documentaire uniquement). Livrables : `docs/cgpa/05-architecture-conception/adr/ADR-11-introduction-patrimoine.md` (decision, alternatives ecartees, risques), `docs/cgpa/02-expression-besoin/addendum-patrimoine.md` (BF-90→96), `docs/cgpa/04-cahier-des-charges/addendum-patrimoine.md` (EF-90→96/ENF-90, registre RM-90→99 nouveau, MCD logique, contrats API proposes, TC-92→97), `docs/cgpa/06-planification-agile/addendum-patrimoine-backlog.md` (Epic EP-09, US-80→85), `docs/cgpa/06-planification-agile/plan-execution-patrimoine.md` (3 sprints, criteres GO, non approuve), `docs/cgpa/07-devsecops/securite-patrimoine.md` (impact RBAC/ReBAC, regles RS-01→06). **Contradictions documentaires signalees** : collision d'identifiants US-70/71/72 avec le backlog deja valide Gate 5 (renumerote US-80→85) ; ambiguite terminologique « Contrat » (decision) vs entite technique `Bail` (deja existante, EF-12) — traitee comme synonyme produit, aucun renommage ; algorithme de resolution priorite/exception (RM-98) non precise par la decision source — propose comme interpretation a valider par le PO avant tout codage. Aucune phase ni gate deja valide n'est rejoue ou modifie (additif, a l'image des reprises CGPA precedentes). **Decision actee : Proposee — en attente d'approbation PO du Plan d'Execution avant tout demarrage de Sprint 1** |
| 2026-06-21 | **RM-98 tranche par le PO** — algorithme de resolution priorite/exception Patrimoine valide | Lever la reserve bloquante Sprint 2 du `plan-execution-patrimoine.md` avant tout codage d'`AuthorizationService` | jptshilombo@gmail.com | Formule confirmee telle que proposee : perimetre effectif (gestionnaire, patrimoine) = (biens du patrimoine si affectation patrimoine ACTIVE) ∪ (biens en `INCLUSION` ACTIVE) − (biens en `EXCLUSION` ACTIVE), le niveau bien restant toujours prioritaire sur l'heritage patrimoine. Deux regles de validation actees : **RS-04** `EXCLUSION` creee sans affectation patrimoine active correspondante → rejetee en 400 ; `INCLUSION` redondante avec une affectation patrimoine deja active sur le meme bien → toleree (idempotente). Mis a jour : `ADR-11-introduction-patrimoine.md` (Decision point 5, Risques), `addendum-patrimoine.md` CDC (§3 RM-98, §7 score 14→15/20), `plan-execution-patrimoine.md` (pre-requis bloquant Sprint 2 leve), `securite-patrimoine.md` (§3/§7/§9 RS-04 confirme). Aucun code ni migration produit. **Reserve Sprint 2 fermee** ; reste a faire approuver le Plan d'Execution complet par le PO avant tout demarrage de Sprint 1 |
| 2026-06-21 | **Plan d'Execution Patrimoine approuve — GO** (verrou CGPA v3.0 leve) | Autoriser le demarrage du Sprint 1 (Patrimoines & modele de donnees) du lot D-PAT-001/ADR-11 | jptshilombo@gmail.com | PO statue **GO** sur `plan-execution-patrimoine.md` (3 sprints, EP-09 US-80→85, 25 points) : approuve tel que documente, sans reserve additionnelle. **RS-05 tranche dans la meme passe** : administration de la typologie de biens (`TypeBien`) portee par le role `BAILLEUR` existant, aucun nouveau role Keycloak (conforme ADR-02). Mis a jour : `plan-execution-patrimoine.md` (statut Approuve/GO, point de controle RS-05), `ADR-11-introduction-patrimoine.md` (statut Acceptee), `securite-patrimoine.md` (statut Valide, RS-05 confirme), `addendum-patrimoine.md` EB et CDC + `addendum-patrimoine-backlog.md` (statut Accepte). Chaque sprint reste un point de controle GO/NO GO independant (criteres GO de fin de sprint inchanges) ; aucun code ni migration produit a ce stade. Reserve residuelle non bloquante : **RS-06** (comportement d'archivage d'un patrimoine avec affectations actives), a trancher avant le Sprint 3 |
| 2026-06-21 | **RS-06 tranche par le PO** — comportement d'archivage d'un Patrimoine avec affectation(s) patrimoine active(s) | Lever la derniere reserve residuelle non bloquante du lot D-PAT-001/ADR-11, avant le Sprint 3 | jptshilombo@gmail.com | PO retient l'option recommandee : toute tentative d'archivage d'un patrimoine ayant au moins une affectation patrimoine `ACTIVE` est **rejetee en 400** (RS-06) ; le bailleur doit d'abord revoquer explicitement ces affectations (coherent EF-22, pas d'effet de bord implicite). Options ecartees : cascade de revocation automatique, archivage libre avec affectations orphelines. Implementation a porter par l'endpoint `PUT/DELETE /api/patrimoines/{id}` livre en Sprint 1 (US-80), avec garde effective dès que `Affectation.patrimoineId` existe (US-84, Sprint 2) — risque de regression a Sprint 1 deja merge note au Plan d'Execution. Mis a jour : `securite-patrimoine.md` (§8 risque ferme, §9 RS-06 valide, statut), `plan-execution-patrimoine.md` (synthese points de controle, Sprint 2 livrables/risques/criteres GO, bandeau), `addendum-patrimoine.md` CDC (EF-90, matrice §6, score §7), `addendum-patrimoine-backlog.md` (US-80 risques, US-84 GWT/risques). Aucun code ni migration produit. **Derniere reserve du lot Patrimoine desormais fermee** ; le lot reste gouverne sprint par sprint (criteres GO de fin de sprint inchanges) |
| 2026-06-21 | **Kickoff Sprint 1 confirme par le PO (GO sans reserve)** — Patrimoines & modele de donnees (US-80/81/82) | Obtenir le point de controle GO/NO GO specifique au demarrage du Sprint 1, distinct du GO global deja donne sur le Plan d'Execution complet | jptshilombo@gmail.com | PO confirme le demarrage effectif du Sprint 1 sur son perimetre complet (US-80 patrimoines, US-81 typologie, US-82 rattachement bien->patrimoine), sans reserve : tous les pre-requis identifies (RM-98, RS-05, RS-06) etant deja tranches, aucun point bloquant residuel. Mis a jour : `plan-execution-patrimoine.md` (statut Sprint 1, synthese points de controle, bandeau). Aucun code ni migration produit a ce stade ; le Sprint 1 peut desormais etre code (extraction des valeurs distinctes `Bien.type`, entite `Patrimoine`+RLS, migration de donnees) sous les criteres GO de fin de sprint deja definis |
| 2026-06-23 | Smoke-staging realigne sur V13 + patrimoine + S02 (PR #75) — revele un ecart honoraires patrimoine | Maintenir le script de smoke representatif du schema reellement deploye (V13, au lieu de V10) | jptshilombo@gmail.com | `infra/smoke/smoke-stack.sh` mis a jour : attente Flyway V1-V13, creation d'un patrimoine avant le bien (rattachement), bail via `loyerHc`/`provisionCharges`, affectation **patrimoine** 8 % au lieu d'une affectation bien. Execute manuellement contre staging : **43 PASS / 4 FAIL**, les 4 echecs imputables a un ecart metier (honoraires non calcules sur affectation patrimoine), analyse separee ouverte. Mergee `c23fea4` |
| 2026-06-23 | **R-S04-1 — correctif honoraires patrimoine pousse hors Plan d'Execution, regularise et ferme (PR #76)** | Etendre `calculer_honoraires()` (V8) et `HonoraireRepository.findByBien` aux biens couverts par une affectation **patrimoine** (ecart revele par le smoke PR #75) | jptshilombo@gmail.com | Migration **V14** (`V14__honoraires_patrimoine.sql`) : resolution patrimoine_id -> bien.patrimoine_id dans `calculer_honoraires()`, comportement affectation bien inchange. `HonoraireRepository.findByBien` inclut les honoraires lies a une affectation patrimoine couvrant le bien. `SchemaMigrationTest` aligne 13->14 (compteur initialement oublie, CI backend rouge sur push, corrige dans la meme PR). **Note de gouvernance assumee dans la PR** : le correctif a ete code et pousse directement sur `staging-smoke-s04` apres le merge de la PR #75, sans Plan d'Execution ni revue prealable — ecart **R-S04-1**. CI complete verifiee verte (13/13 : CodeQL Java/Kotlin+JS/TS, Backend, Frontend, Packaging Docker, Securite). **Mergee le 2026-06-23T12:14Z, merge commit `7547341`.** Regularise et **ferme** a posteriori par la revue + CI verte ; re-verification du smoke staging (0 FAIL attendu) restant a executer |
| 2026-06-24 | **Politique reseau formalisee — IP privee prioritaire pour les acces SSH inter-serveurs (dev/CI, staging/test, SonarQube)** | Le PO signale que ces hotes residant desormais dans le meme VPC/perimetre reseau prive, avec SSH ouvert par IP privee ; formaliser la regle d'usage avant qu'elle ne soit appliquee de maniere incoherente | jptshilombo@gmail.com | Documentation uniquement (aucun code, secret ni regle de securite modifie) : `docs/cgpa/environment-promotion-model.md` (nouvelle section Acces SSH inter-serveurs), `docs/cgpa/07-devsecops/runbook-exploitation.md` (nouvelle section §0.1), `docs/staging-state.md` et `docs/prod-state.md` (notes de coherence croisees). Regle : IP privee prioritaire intra-VPC, IP publique en dernier recours/poste externe autorise. Coherent avec le precedent deja en place en Production (restriction SG du 2026-06-20). **Reserve ouverte** : `SERVER_CONFIG.md` (hors depot, 2026-06-19) documente encore 3 Security Groups distincts et aucun hote SonarQube dedie distinct de `loyerpro-ci-server` — verification/alignement par l'exploitant recommande, pas de verification infrastructure effectuee dans cette session (hors perimetre demande) |
| 2026-06-24 | **Migration CGPA v5.4 — Gouvernance Staging partagé, Gate `STG-ISOL-01` PASS** | Formaliser l'isolation obligatoire des stacks Docker sur l'environnement Staging mutualisé `ai-test-server` (CGPA v5.4) | jptshilombo@gmail.com | `framework.current_version` 5.3 → 5.4. Audit (`docs/cgpa/migration/audit-initial-v5.4.md`) : isolation namespace/réseau/volume/ports/reverse proxy déjà en place nativement depuis le lot 4b (2026-06-14) ; aucune modification d'infrastructure requise. Nouveau Gate `STG-ISOL-01` statué **PASS** (`docs/cgpa/07-devsecops/gate-stg-isol-01-decision.md`), workflow `staging-isolation-workflow.md`, checklist `stg-isol-01-checklist.md`. Décisions **D-STG-01 à D-STG-05** ajoutées (§16). ADR obligatoire `ADR-STG-001-isolation-staging-partage.md` : rejette explicitement l'alternative « arrêter tous les conteneurs avant chaque déploiement ». Fiches agents (Release Manager, DevSecOps Lead, Governance Officer, Enterprise Architect) mises à jour. Correctifs de cohérence documentaire appliqués à `docs/cgpa/environment-promotion-model.md` (état Production obsolète depuis Gate 10). Décision : **GO sous réserve** — réserve **RSV-STG-01** (confirmation live de l'isolation au prochain déploiement Staging réel). Rapport complet : `docs/cgpa/migration/migration-report-v5.4.md` |
| 2026-06-25 | **Correctif CORS Compose — câblage `APP_CORS_ALLOWED_ORIGIN` / `APP_INVITATION_BASE_URL` au conteneur `api`** | Depuis l'exposition publique du 2026-06-16, les deux variables étaient définies dans `.env` sur chaque hôte mais jamais transmises au service `api` dans aucun fichier Compose — Spring utilisait le fallback `https://localhost` (CORS cassé depuis l'origine publique, liens d'invitation pointant vers `localhost`) | jptshilombo@gmail.com | Commit `964ebfb` poussé directement sur `origin/main` sans PR — écart **Niveau 1** vis-à-vis du plan §5, **qualifié et accepté** : changement Compose pur (zéro code Java/TypeScript, zéro migration SQL), CI SUCCESS (CodeQL ✅ + pipeline complet ✅, 6 min 17 s). `docker-compose.prod.yml` non modifié : service `api` sans bloc `environment` dans ce fichier → héritage de `docker-compose.yml` correct, vérifié. Plan : `docs/cgpa/09-production/plan-correctif-cors-compose.md` |
| 2026-06-25 | **Smoke script aligné V14→V15 — défaut latent détecté en reprise CGPA v5.4.1** | `infra/smoke/smoke-stack.sh` attendait 14 migrations Flyway alors que V15 (`V15__affectations_exceptions.sql`, Sprint 3 PR #81) est sur `main` — même pattern que l'incident R-S04-1 (PR #75 oubli V14, corrigé par PR #77) | jptshilombo@gmail.com | Commit `8c79e3d` : 2 lignes modifiées (`V1-V14` → `V1-V15`, `"14"` → `"15"`) — aucun autre changement. Poussé sur `origin/main`. |
| 2026-06-25 | **Gate Staging combiné CORS + Sprint 3 — GO, `STAGING_DEPLOYED`** | Statuer le Gate Staging v5.3 pour le lot combiné CORS Compose + Sprint 3 Patrimoine (US-85, V15, RS-04, correctif CORS `964ebfb`) ; lever RSV-STG-01 par preuve live | jptshilombo@gmail.com | Tag `sha-5bf187af` déployé sur `ai-test-server`. Vérifications : 4/4 services `healthy` ; CORS vars injectées dans le conteneur (`APP_CORS_ALLOWED_ORIGIN=https://loyertracker.staging.loyerpro.org`) ; Flyway **15/15** (V15 appliquée) ; STG-ISOL-01 live : 8 conteneurs `loyertracker-staging-*` avant et après, aucun autre projet affecté → **RSV-STG-01 LEVÉE** ; smoke **47 PASS / 0 FAIL** (parcours métier complet, isolation cross-tenant). Statuts : `STAGING_DEPLOYED` ✅. `PRODUCTION_READY` / `PRODUCTION_DEPLOYED` : non atteints — Gate Production distinct requis. Décision : `docs/cgpa/07-devsecops/gate-staging-cors-sprint3-v5.3-decision.md` |
| 2026-06-25 | **Vérification dashboard Staging — PASS complet, `directAccessGrants` révoqué** | Confirmer que l'ensemble des fonctionnalités de l'application Staging est opérationnel après le déploiement `sha-5bf187af` et la correction TLS (RSA YR2/ISRG Root X1) | jptshilombo@gmail.com | HTTPS 200 (cert RSA valide) ; Angular SPA 200 `text/html` ; `GET /api/actuator/health` `{"status":"UP"}` ; Keycloak OIDC discovery 200 ; JWT obtenu (`jordan.test@loyerpro.org`) ; `GET /api/patrimoines` → 1 patrimoine ("Patrimoine principal") ; `GET /api/biens` → 1 bien ("Bolia 9 Matonge", APPARTEMENT) ; `GET /api/alertes` → 17 alertes `NON_LUE` ; `GET /api/biens/{id}/paiements` → 24 paiements. `directAccessGrants` révoqué (OFF) après obtention du JWT. Flyway V15 (15 migrations) confirmée. Accès complet : `docs/staging-state.md` §9. |
| 2026-07-06 | **Cadrage montée de version Angular 20 → 22 — Proposé (analyse d'impact, aucun code)** | 4 PR dependabot (#186, #188, #189, #190) bloquées en échec CI par des conflits `ERESOLVE` npm croisés, toutes imputables à une même montée de version majeure fragmentée (Angular 20.3.25 figé, chaque PR ne bumpant qu'un sous-ensemble incompatible) | jptshilombo@gmail.com | Analyse produite, **aucun code ni migration** : `docs/cgpa/06-planification-agile/plan-execution-upgrade-angular-22.md`. Périmètre coordonné identifié (`@angular/*` ×8 + CLI/build-angular/compiler-cli → 22.0.5, `typescript` → 6.0.x, `angular-eslint` → 22.0.0, `keycloak-angular` → 22.0.0) ; `eslint` explicitement exclu du périmètre (`angular-eslint@22` accepte encore `^9`). Vérifications statiques favorables : Node déjà compatible (CI/Docker `24.18.0` ≥ exigence `@angular/cli@22`), aucune API supprimée par Angular 22 utilisée dans le code, tous les `Validators.min/max` déjà numériques, état 100 % signal-based (risque `OnPush` implicite atténué mais à confirmer visuellement — critère GO dédié). `keycloak-angular` 22 ne nécessite aucune migration de code : l'API fonctionnelle Keycloak est déjà en place (mémoire projet `keycloak-angular-functional-api-migration` corrigée, obsolète). Les 4 PR dependabot restent ouvertes, non mergées individuellement, jusqu'à l'exécution coordonnée du lot. **Décision actée : Proposée — en attente d'approbation PO avant tout démarrage de sprint/codage** |
| 2026-07-06 | **Sprint montée de version Angular 20 → 22 — GO PO, exécuté et clôturé (PR #197)** | GO explicite du PO sur le cadrage `plan-execution-upgrade-angular-22.md` ; sprint démarré et exécuté dans la foulée, périmètre strictement conforme au §3 du cadrage | jptshilombo@gmail.com | Bump coordonné appliqué (`frontend/package.json`) : `@angular/*` ×8 + `cli`/`build-angular`/`compiler-cli` → 22.0.5, `typescript` → 6.0.3, `angular-eslint` → 22.0.0, `keycloak-angular` → 22.0.0 ; `eslint` inchangé. **Tous les critères GO §4 validés** : `npm install` propre (sans `--force`/`--legacy-peer-deps`), `ng lint` vert, `ng build --configuration production` vert, `ng test` 85/85 verts. **Vérification navigateur (§4.5, point le plus sensible du cadrage)** réalisée en conditions réelles : stack Docker complète (postgres/keycloak/api/nginx) montée, flux OIDC/PKCE réel via Keycloak, connexion `bailleur-test@test.local` réussie, dashboard bailleur rendu correctement (5 biens, patrimoines, 29 alertes, 10 entrées d'audit) ; rechargement asynchrone (`chargerBiens()` via bouton Rafraîchir) confirmé fonctionnel sous la bascule implicite `OnPush` d'Angular 22 — **risque résiduel du cadrage levé**. Seule erreur console observée : 409 sur `POST /api/bailleurs/inscription` (double-inscription idempotente d'un compte de test déjà enregistré, comportement préexistant documenté, sans rapport avec la montée de version). CI complète verte 7/7 sur PR #197 (Backend, Frontend, Sécurité gitleaks+SCA+Trivy, CodeQL java-kotlin+javascript-typescript, Packaging Docker). **Mergée le 2026-07-06T09:49:29Z, merge commit `05a4f86`, branche `feat/sprint-upgrade-angular-22` supprimée.** Rend obsolètes les PR dependabot #186/#188/#189/#190 (fermeture automatique attendue à la prochaine passe dependabot). Risque §13 correspondant fermé. **Reste hors périmètre de ce sprint** : smoke `infra/smoke/smoke-stack.sh` et décision de promotion Staging — étape distincte à instruire séparément avant toute promotion |
| 2026-07-06 | **Gate Staging Sprint 11 (EP-14a) + Sprint Angular 20→22 — GO, `STAGING_DEPLOYED`** | Instruire le Gate Staging du Sprint 11 (quittances certifiées) resté en attente depuis sa clôture (PR #183) ; `main` HEAD ayant depuis avancé (Sprint Angular 22 + correctifs CI/doc), le lot combiné est déployé ensemble — même pattern de gouvernance que le Gate Staging combiné CORS + Sprint 3 du 2026-06-25 | jptshilombo@gmail.com | Tag `sha-9713fdaa` déployé sur `ai-test-server`. **Préflight** : `QUITTANCE_HMAC_SECRET` généré (`openssl rand -hex 32`, action confirmée explicitement par le PO après blocage automatique du classificateur de permissions) et injecté au `.env` hôte, `QUITTANCE_TOKEN_KID`/`QUITTANCE_VERIFY_BASE_URL` confirmées. **STG-ISOL-01 PASS** avant et après déploiement (8 conteneurs `loyertracker-staging-*` + `nginx-proxy-manager` intact, confirmation explicite du PO obtenue avant le déploiement effectif — second blocage automatique du classificateur). Flyway **22/22** (V22 quittance certifiée appliquée). Smoke **59 PASS / 0 FAIL** (parcours métier complet S01→S04, RGPD, isolation cross-tenant). **Vérification visuelle du rendu PDF certifié** (objectif spécifique du sprint) réalisée via tunnel SSH + Chromium headless piloté (flux OIDC/PKCE réel, sans réactiver `directAccessGrantsEnabled` — action refusée par le classificateur, contournée en pilotant le vrai flux navigateur) : quittance `QT-2026-000001` téléchargée et rendue conforme (logo, badge DOCUMENT CERTIFIÉ, locataire anonymisé RGPD, QR + empreinte SHA-256, mentions légales). Décision : `docs/cgpa/07-devsecops/gate-staging-sprint11-ep14a-v5.4.1-decision.md`. **`STAGING_DEPLOYED`** ✅. **`PRODUCTION_READY`/`PRODUCTION_DEPLOYED` non atteints — promotion Production explicitement bloquée avant la release unique `1.9.0`** (ADR-15 K5 : le QR de la quittance pointe vers `/verify/receipt/:id`, livré au Sprint 12). PR dependabot `#190` (eslint 9→10) laissée en l'état à la demande du PO, hors périmètre |
| 2026-07-06 | **Gate Production Sprint 11 (EP-14a) + Angular 22 instruit — NO GO, bloqué par construction (ADR-15 K5)** | Instruire le Gate Production du candidat `sha-9713fdaa`, `STAGING_DEPLOYED` | jptshilombo@gmail.com | Blocage **non découvert mais déjà connu et tracé** depuis le kickoff EP-14 (ADR-15 point K5, 2026-07-05) : release Production unique `1.9.0` réservée à Sprint 11 + Sprint 12 combinés, car le QR imprimé sur chaque quittance certifiée pointe vers `/verify/receipt/{id}` (route publique livrée uniquement au Sprint 12, non démarré). Checklist Gate Production entièrement renseignée : preuves Staging toutes PASS (smoke 59/0, STG-ISOL-01, rendu PDF, vérification navigateur Angular 22), aucune anomalie technique — le blocage est de nature gouvernance/produit, pas DevSecOps. **Conséquence nouvelle identifiée (RSV-PROD-EP14-02)** : le sprint Angular 20→22, mergé après Sprint 11 sur `main`, est techniquement inséparable de ce candidat et hérite donc du même blocage bien qu'il n'ait aucun défaut propre — arbitrage PO ouvert (attendre 1.9.0 par défaut, ou cadrer un cherry-pick exceptionnel isolé). Décision : `docs/cgpa/09-production/gate-production-sprint11-ep14a-decision.md`. **`PRODUCTION_READY`/`PRODUCTION_DEPLOYED` non atteints.** Production reste en `1.8.0` (`sha-2c5f43c7`), inchangée. Prochaine étape : cadrage/exécution Sprint 12 (EP-14b, plan déjà approuvé PR #182), puis Gate Production unique `1.9.0` |
| 2026-07-06 | **Kickoff Sprint 12 (EP-14b) — cadrage de démarrage produit, aucun code** | Le plan (`plan-execution-ep14-quittances-certifiees.md`, PR #182) et le backlog (`addendum-backlog-ep14.md`, US-102→104) sont déjà approuvés en détail depuis le 2026-07-05 ; ce kickoff confronte le plan au code réellement livré par le Sprint 11 avant tout démarrage de codage | jptshilombo@gmail.com | `docs/cgpa/06-planification-agile/kickoff-sprint12-ep14b.md`. Vérifié dans `V22__ep14_quittance_certifiee.sql` : les 3 fonctions `SECURITY DEFINER` annoncées existent exactement comme prévu et sont déjà `GRANT`-ées à `loyertracker_api` (`lire_quittance_publique`, `lire_pdf_quittance_publique`, `journaliser_evenement_quittance`) ; `TokenQuittanceService.verifier(...)` directement réutilisable ; format du QR déjà imprimé conforme au contrat US-102. **Point d'implémentation identifié, raffinant le plan** : `lire_quittance_publique` retourne le `contenu` canonique complet, qui inclut `paiement.mode` et `garantie_retenue` — champs interdits en public (US-102) ; le futur contrôleur devra reconstruire une réponse strictement scopée K2, et le test de non-fuite déjà prévu au plan doit ajouter une assertion négative explicite sur ces deux champs. **Autre point** : le rate-limit Nginx (US-104) est un ajout net, `infra/nginx/nginx.conf` ne définissant aujourd'hui aucune zone `limit_req`/`limit_conn`. Aucun prérequis bloquant résiduel (Sprint 11 fusionné, K2 tranché, Gate Staging Sprint 11 GO). Aucun code produit. **En attente de GO PO explicite avant tout démarrage de codage**, conformément à CLAUDE.md |
| 2026-07-06 | **Sprint 12 (EP-14b) — GO PO, exécuté (vérification publique des quittances, US-102/103/104)** | GO explicite du PO sur le kickoff/plan `plan-execution-ep14-quittances-certifiees.md` (§Sprint 12) ; sprint codé dans la foulée, périmètre conforme au plan | jptshilombo@gmail.com | **US-102** API publique `GET /api/public/receipts/{id}` + `/download` : projection **K2 stricte** reconstruite (jamais `paiement.mode`/`garantie_retenue` — test de non-fuite à assertions négatives), échec **indifférencié** (aucun oracle), re-hash `pdf_hash` avant envoi, lecture par les fonctions `SECURITY DEFINER` V22, `SecurityConfig` `permitAll` ciblé. **US-103** page Angular `/verify/receipt/:id` **sans `authGuard`**, `noindex`, design « certificat » soigné (arbitrage PO) ; bootstrap Keycloak `check-sso`, **intercepteur Bearer corrigé pour exclure `/api/public/`** (défaut détecté : sans quoi un tiers anonyme aurait été bloqué), test de non-régression des routes gardées. **US-104** métriques Prometheus (`quittance_verifications_total{resultat}`, `_telechargements_total`, `_qr_invalides_total`), journal RGPD-minimal, compteurs par quittance exposés via l'export RGPD (arbitrage PO : pas d'endpoint dédié), rate-limit nginx `/api/public/` + `/verify/`. **Gouvernance** : ~390 lignes backend/infra avaient été **pré-écrites avant le GO** (le kickoff actait « aucun code produit ») — écart tracé et **régularisé** par ce GO puis la discipline de sprint (tests, CI, revue sécurité, Gates). **Vérifs** : `ng lint`/`build`/`test` 94/94 verts, `PublicQuittanceIntegrationTest` (Testcontainers) vert, smoke enrichi (surface publique sans oracle). nginx : **un seul** `infra/nginx/nginx.conf` canonique (monté dev/prod, embarqué dans l'image web pour staging — `frontend/Dockerfile`) → pas d'overlay séparé à synchroniser. **Périmètre : PR-ready**. `/security-review`, Gate Staging (dont `STG-ISOL-01`), déploiement et **Gate Production `1.9.0`** restent des décisions **distinctes** non couvertes par ce codage |
| 2026-07-06 | **Correctif Sonar PR #202 — journalisation SQL sans concaténation (`java:S2077`)** | Lever le hotspot `java:S2077` de `VerificationQuittanceService.journaliser()` après échec du Quality Gate backend, sans modifier le comportement public | jptshilombo@gmail.com | Deux requêtes SQL constantes distinguent quittance connue (`CAST(:id AS uuid)`) et inconnue (`CAST(NULL AS uuid)`), paramètres `:type`/`:resultat` conservés, sans changement de fonction PostgreSQL, migration, API publique ni comportement d’échec indifférencié. Test renforcé : un UUID inconnu produit exactement un journal `INVALIDE` avec `quittance_id IS NULL`. **Validation** : test ciblé 6/6, `mvn verify` 162/162, Spotless et JaCoCo PASS ; analyse Sonar locale puis CI GitHub backend du commit `ce80c85` PASS, Quality Gate backend `PASSED`, couverture nouvelle **89,8 %**, `new_violations=0`. L’API hotspots reste inaccessible (`403`) comme qualifié ; aucune nouvelle violation et disparition de la construction dynamique apportent la preuve exploitable. Packaging Docker à revalider sur le pipeline final après ce commit documentaire. |
| 2026-07-06 | **Revue sécurité, clôture et Gate Staging Sprint 12 EP-14b — GO, `STAGING_DEPLOYED`** | Exécuter la séquence CGPA post-merge PR #202 avant toute instruction Production `1.9.0` | jptshilombo@gmail.com | Revue sécurité PASS, Sprint US-102/103/104 clôturé sans report. `sha-75646d8f` déployé sur `ai-test-server` après backup ; STG-ISOL-01 PASS avant/après ; Flyway 22/22 ; smoke 62/0 ; rate-limit/métriques et parcours réel VALIDE+PDF intègre confirmés. Décision : `docs/cgpa/07-devsecops/gate-staging-sprint12-ep14b-v5.4.1-decision.md`. Production non autorisée ; Gate unique `1.9.0` distinct requis. |
| 2026-07-06 | **Gate Production unique `1.9.0` — GO, `PRODUCTION_READY`** | Instruire le Gate Production sur le candidat exact `sha-75646d8f`, `STAGING_DEPLOYED` (Sprint 11 EP-14a + Sprint 12 EP-14b + Angular 22) | jptshilombo@gmail.com | EP-14 complet : STG-ISOL-01 PASS, Flyway 22/22, smoke 62/0 au premier passage, parcours QR/PDF réel et revue sécurité PASS en Staging ; CI/CodeQL verts, digests GHCR figés. V22 additive, rollback applicatif viable vers `sha-2c5f43c7`. RSV-PROD-EP14-01/02 levées. Décision : `docs/cgpa/09-production/gate-production-v1.9.0-decision.md`. Seul le Préflight Production est autorisé par ce Gate ; aucun déploiement sans instruction explicite distincte |
| 2026-07-06 | **Préflight Production `1.9.0` — PASS** | Vérifier l'état de Production `1.8.0` et préparer le déploiement `1.9.0` avant toute exécution | jptshilombo@gmail.com | Production `1.8.0` saine : 8/8 actifs, 4/4 healthy, restart=0, Flyway 21/21, Prometheus 5/5, invariant ledger 3/3, objets V22 absents. Backup vérifié `loyertracker-20260706-181545.dump` (325755 octets, 742 entrées, SHA-256 `a017b81f…`) + globals SHA-256 `c07cd206…`, modes 600. HMAC Production distinct persisté, `.env.bak-pre-1.9.0` créé, tag inchangé. Rollback `sha-2c5f43c7` confirmé. Aucun pull/redémarrage/déploiement exécuté. Rapport : `docs/cgpa/09-production/preflight-backup-v1.9.0-report.md` |
| 2026-07-06 | **Déploiement technique + Validation finale `1.9.0` — `PRODUCTION_DEPLOYED`** | Exécuter le déploiement ciblé sur autorisation PO explicite après Préflight PASS | jptshilombo@gmail.com | Candidat `sha-75646d8f` déployé (`api`+`nginx` seuls recréés, PostgreSQL/Keycloak/monitoring inchangés) ; digests conformes au Gate ; Flyway V22 appliquée 22/22. Smoke Production **62 PASS / 0 FAIL au premier passage** ; nettoyage DB+KC sans résidu, `bailleur-test` redésactivé. Invariant ledger 3/3, Prometheus 5/5, Alertmanager vide, site public 200. `PRODUCTION_DEPLOYED` atteint ~17:57 UTC. Rapports : `docs/cgpa/09-production/deploiement-technique-v1.9.0-report.md`, `docs/cgpa/09-production/validation-finale-v1.9.0-report.md`. Hypercare T0 PASS immédiat ; T+12/T+24 et clôture CDO restants |
| 2026-07-08 | **Hypercare T+12/T+24 en rattrapage + Clôture Release `1.9.0` — CDO GO** | Vérifier l'état réel du serveur de prod (demande explicite PO) puis instruire les checkpoints d'hypercare restants et la clôture, les deux fenêtres cibles étant tombées hôte éteint (politique de coût, produit non annoncé) | jptshilombo@gmail.com | Vérification live (SSH + AWS CLI) : instance `running` depuis 2026-07-08 14:28 UTC (CloudTrail confirme 2 cycles arrêt/démarrage depuis le T0, aucun n'ayant couvert les fenêtres T+12/T+24 exactes). Checkpoint combiné en rattrapage **PASS sous surveillance** (~14:36 UTC, ≈ T+45) : tag/digests `sha-75646d8f` inchangés, Flyway 22/22, invariant ledger 3/3 (2100,00/600,00/600,00), 8/8 actifs 4/4 healthy restart=0 depuis le dernier redémarrage hôte, `bailleur-test` désactivé (`directAccessGrantsEnabled=false` vérifié `kcadm.sh`), Prometheus 5/5, Alertmanager `[]`, pool Hikari pending=0, 0 ligne 5xx, capacité saine. Écart de fenêtre qualifié par le PO. **RSV-PROD-EP14-01/02 confirmées levées** ; `RSV-STG-01` (héritée) maintenue, sans rapport avec `1.9.0`. Décision CDO : **GO — RELEASE `1.9.0` CLÔTURÉE**. Détail : `docs/cgpa/09-production/plan-etape-hypercare-v1.9.0.md`, `docs/cgpa/09-production/cloture-release-v1.9.0.md` |
| 2026-07-08 | **Cadrage EP-15 « Gestion des personnes » — Proposé (analyse d'impact + ADR-16, aucun code)** | Instruction PO du 2026-07-08 : rendre les Gestionnaires et Locataires des entités durables (statuts, historique, audit, anti-doublons), indépendantes du Bail/Affectation | jptshilombo@gmail.com | **Collision d'identifiant détectée et corrigée** : le PO a demandé « EP-14 », déjà pris par les Quittances certifiées (`1.9.0`) ; EP-13 est réservé à « Fin de bail » (ADR-14) — **renuméroté EP-15** sans réutiliser aucun identifiant existant (même précédent que US-70→75 devenu US-80→85). Deux agents Explore ont établi l'état exact du code (Locataire = texte libre sur `bail`, aucune entité ; Gestionnaire = table plate sans statut ni RLS, global multi-bailleur ADR-01/EF-05 ; `uq_bail_actif` garantit déjà « jamais 2 baux actifs/bien » ; aucun audit existant sur gestionnaire/affectation/bien/patrimoine ; `quittance.pdf` bytea = précédent de stockage binaire réutilisable). Quatre décisions d'architecture tranchées par le PO via question à choix : **statut Gestionnaire global** (pas par bailleur — risque cross-bailleur RSV-EP15-01 explicitement accepté) ; **migration historique 1 Locataire par bail, sans déduplication automatique** ; **suppression des colonnes `bail.locataire_nom`/`locataire_email`** après bascule (pattern V20) ; **photo en `bytea`** (réutilise `quittance.pdf`). Livrables produits : `docs/cgpa/05-architecture-conception/adr/ADR-16-gestion-personnes.md` (D-PERS-001, registre RSV-EP15-01→04, 1 point de kickoff K1 restant : sémantique de « créer » un Gestionnaire) ; addenda EB et CDC (`addendum-personnes.md` ×2, EF-97→107, RM-100→107, ENF-91/92) ; extension additive `dossier-architecture.md` §3.5 ; `addendum-backlog-ep15-personnes.md` (US-105→114, 3 sprints A/B/C) ; `plan-execution-ep15-personnes.md` (kickoff, séquencement, checklist CGPA) ; synthèse transverse `docs/addendum-personnes.md`. **Aucun code ni migration produits.** Prochaine étape : PO tranche K1 puis GO explicite sur le Plan d'Exécution avant Sprint A |
| 2026-07-08 | **Kickoff EP-15 clos — K1 tranché par le PO** | Trancher le point de kickoff K1 (sémantique de « créer » un Gestionnaire) laissé ouvert par ADR-16 | jptshilombo@gmail.com | **Décision PO : « profil sur compte existant »** — conforme à la proposition par défaut de l'ADR. L'invitation (`AcceptationService`) reste l'unique voie de création technique du compte Gestionnaire ; « créer » au sens EP-15 = enrichir pour la première fois le profil métier (téléphone/photo/observations) d'un compte déjà existant. Aucun nouveau flux d'administration en contournement. Mis à jour : `ADR-16-gestion-personnes.md` (statut, points tranchés), `plan-execution-ep15-personnes.md` (kickoff clos, checklist), `addendum-personnes.md` (EB, hypothèses §5), `addendum-backlog-ep15-personnes.md` (US-105, synthèse risques), `docs/addendum-personnes.md` (synthèse transverse). **Kickoff EP-15 clos.** Seul le GO explicite du PO sur le Plan d'Exécution reste requis avant le démarrage du Sprint A — aucun codage n'est encore autorisé |
| 2026-07-08 | **GO explicite du PO sur le Plan d'Exécution EP-15 — Sprint A démarré** | Autoriser le codage du Sprint A (Gestionnaire : profil, cycle de vie, recherche/doublons, historique), conformément à CLAUDE.md (« Codage suspendu : Plan d'Exécution requis ») | jptshilombo@gmail.com | GO explicite reçu, checklist `plan-execution-ep15-personnes.md` cochée (kickoff clos + Plan d'Exécution approuvé). Démarrage du codage US-105→108 : migration **V23** (colonnes `statut`/`telephone`/`photo`/`observations`/`date_creation`/`date_suspension`/`date_archivage` sur `gestionnaire` ; fonctions `SECURITY DEFINER` `gestionnaire_a_affectation_active` (garde cross-tenant d'archivage) et `gestionnaire_a_relation` (ReBAC)), entité `Gestionnaire`/`StatutGestionnaire` enrichie. Suite du Sprint A (service, contrôleur, activation Keycloak, tests) en cours dans la même session. |
| 2026-07-08 | **Sprint A (EP-15) codé et vert — US-105→108** | Terminer le codage du Sprint A jusqu'à `mvn verify` vert, conformément aux critères GO du Plan d'Exécution | jptshilombo@gmail.com | Livré : `GestionnaireService`/`GestionnaireController` (profil, suspension/réactivation immédiates, archivage/restauration), `AuthorizationService.peutAccederGestionnaire` (ReBAC), activation Keycloak pilotée par l'app (`GestionnaireIdentityProvider.definirActivation`, premher déclenchement applicatif de ce mécanisme), recherche multicritère, détection de doublons, historique (affectations + audit RLS-scopés au bailleur courant). **Test dédié `archivageBloqueParAffectationActiveChezUnAutreBailleurPuisAutorise`** prouve le mécanisme cross-tenant (D4) : l'archivage reste bloqué tant qu'une affectation `ACTIVE` existe chez un **autre** bailleur, invisible sous RLS normale, révélée uniquement par la fonction `SECURITY DEFINER`. 6 tests dédiés (`GestionnaireLifecycleIntegrationTest`) + non-régression complète : **`mvn verify` 168/168 verts** (compteur Flyway du smoke `SchemaMigrationTest` et `infra/smoke/smoke-stack.sh` alignés à 23 dans la même session que V23, leçon PR #77/#171 appliquée ; `SecurityIntegrationTest` mis à jour pour neutraliser `GestionnaireService`, même pattern que les autres services JPA). Aucune régression sur Patrimoine/Bien/Bail/Affectation/Paiements/Garanties/Honoraires/Alertes/Dashboard/Ledger/Money/Documents PDF/QR Code. `CHANGELOG.md` `[Non publié]` mis à jour. Reste à faire avant Gate Staging : Sprint B (Locataire, US-109→112) et Sprint C (bascule V24, US-113/114), ou instruction du Gate Staging du Sprint A seul si le PO le souhaite. |
| 2026-07-15 | **PR #209 (EP-15 Sprint A+B) — revue de code, 2 bugs corrigés, mergée sur `main`** | Revue du PR #209 (Sprint A Gestionnaire + Sprint B Locataire) avant instruction du Gate Staging Sprints A+B, conformément à la discipline de qualité du projet | jptshilombo@gmail.com | Revue de code du PR #209 (36 fichiers, +1859/-79) a détecté **2 bugs de correction non couverts par les tests existants** : **(1)** `GestionnaireService.modifierProfil` effaçait silencieusement la photo du Gestionnaire (champ **partagé entre bailleurs**, ADR-16 D1) dès qu'une mise à jour partielle du profil omettait `photoBase64` — corrigé par le même garde-fou déjà présent dans `Locataire.modifier()` (photo conservée si le champ est absent de la requête, effacée seulement si explicitement transmise vide) ; **(2)** `LocataireService.creer` renvoyait `dateCreation: null` à la création — l'id étant assigné côté client (pas de `@GeneratedValue`), `saveAndFlush()` exécute un `merge()` dont l'instance managée retournée diffère de la référence locale, et la colonne `insertable=false` (valeur posée par défaut par la BDD, V24) n'était donc jamais relue ; corrigé par réassignation de la référence au retour de `saveAndFlush()` suivie d'un `em.refresh()`. 2 tests de non-régression ajoutés (`photoConserveeLorsDUneModificationPartielleDuProfil` dans `GestionnaireLifecycleIntegrationTest` ; assertion `dateCreation` non vide sur création dans `LocataireIntegrationTest`). `mvn verify` vert, commit `66a57dc` poussé sur la branche du PR. **CI GitHub 7/7 verte** (Backend, Frontend, Sécurité gitleaks+SCA+Trivy, CodeQL java-kotlin+javascript-typescript, Packaging Docker). **PR #209 mergée le 2026-07-15T10:33:40Z, merge commit `4d8a760`** — Sprint A (Gestionnaire, US-105→108) et Sprint B (Locataire, US-109→112) sont désormais intégrés à `main`. **Aucun déploiement Staging/Production à ce stade.** Prochaine étape inchangée : instruire le Gate Staging Sprints A+B (dont `STG-ISOL-01`). |
| 2026-07-15 | **Gate Staging Sprints A+B EP-15 — GO, `STAGING_DEPLOYED`** | Instruire le Gate Staging combiné Sprint A (Gestionnaire) + Sprint B (Locataire), conformément au plan d'exécution EP-15 (pas de promotion isolée du Sprint A avant le Sprint B) | jptshilombo@gmail.com | Revue sécurité dédiée PASS (`docs/cgpa/07-devsecops/security-review-sprints-ab-ep15.md`, nouveau patron cross-tenant `SECURITY DEFINER` traité : surface minimale booléen, paramètres liés, `EXECUTE` restreint à `loyertracker_api`). Sauvegarde pré-déploiement `loyertracker-staging-20260715-105158.dump` (531336 octets, 777 entrées, SHA-256 `6465f6d7…`). Tag `sha-c9200a51` (merge PR #209 `4d8a760` + PR #217 doc `c9200a5`) déployé sur `ai-test-server` : `git pull --ff-only` `75646d8`→`c9200a5`, `.env` `LOYERTRACKER_TAG` mis à jour, `api`+`nginx` seuls recréés. **STG-ISOL-01 PASS avant/après** (8 conteneurs `loyertracker-staging-*` + `nginx-proxy-manager` intacts, restart=0, aucune commande Docker globale). Flyway **V23+V24 appliquées, total 24/24**. Smoke **62 PASS/0 FAIL** (script non étendu aux nouveaux endpoints, comme garantie Sprint 9/10). **Vérification manuelle live dédiée aux endpoints `/api/gestionnaires` et `/api/locataires` : 48 PASS/0 FAIL** (même échafaudage kcadm `directAccessGrants` que le smoke, révoqué en fin de script) — CRUD/cycle de vie/recherche/doublons/historique Locataire avec isolation RLS cross-tenant (404) ; profil/cycle de vie/RBAC ReBAC (403 bailleur sans relation)/garde cross-tenant d'archivage (409 puis 200 après révocation de l'affectation tierce) Gestionnaire. **Les deux correctifs du PR #209 reconfirmés en conditions réelles** : `dateCreation` renseignée à la création d'un Locataire, photo Gestionnaire conservée sur mise à jour partielle du profil sans `photoBase64`. **Gate Staging Sprints A+B GO — `STAGING_DEPLOYED`**. Décision : `docs/cgpa/07-devsecops/gate-staging-sprints-ab-ep15-decision.md`. **`PRODUCTION_READY`/`PRODUCTION_DEPLOYED` non atteints — Gate Production Sprints A+B combinés distinct requis. Prochaine étape autorisée : instruire ce Gate Production ; le Sprint C (bascule V25) reste hors périmètre tant que le Sprint B n'a pas tenu un cycle de release Production complet sans anomalie.** |
| 2026-07-15 | **Gate Production Sprints A+B EP-15 (`1.10.0`) — GO, `PRODUCTION_READY`** | Instruire le Gate Production sur le candidat `sha-c9200a51`, `STAGING_DEPLOYED` (Gate Staging GO du 2026-07-15) | jptshilombo@gmail.com | Checklist Gate Production intégralement instruite : candidat exact `sha-c9200a51` (commit `c9200a51`, `main` HEAD `a7f7771` sans écart applicatif — diff nul hors `docs/` confirmé par `git diff --stat`), digests GHCR confirmés (API `sha256:37de87e8…`, Web `sha256:7ade9816…`). Toutes les preuves Staging PASS : `STG-ISOL-01`, Flyway 24/24, smoke 62/0, vérification manuelle live 48/0, revue sécurité dédiée PASS. CI GitHub 7/7 SUCCESS confirmé en direct sur les PR #209 et #217 ; Quality Gate SonarQube bloquant intégré aux jobs CI (`sonar.qualitygate.wait=true`), vert. Migrations V23/V24 additives : rollback applicatif seul viable vers `1.9.0` (`sha-75646d8f`). **Aucune nouvelle variable d'environnement/secret** requise (contrairement à `1.9.0`), confirmé par diff des fichiers Compose/`.env.example` — contrairement au Gate `1.9.0`/Sprint 11, ce Gate ne rencontre aucun blocage structurel de type ADR-15 K5. Risques EP-15 (RSV-EP15-01→04) tous déjà tranchés par le PO ou hors périmètre, aucun n'est bloquant pour la Production. Décision : `docs/cgpa/09-production/gate-production-v1.10.0-decision.md`. **`PRODUCTION_READY` atteint.** Cette décision autorise uniquement le **Préflight Production** ; aucune mutation ni déploiement. `PRODUCTION_DEPLOYED` reste non atteint — instruction explicite distincte requise après un Préflight PASS. Sprint C (bascule V25) demeure hors périmètre jusqu'à un cycle de release Production complet du Sprint B sans anomalie. |
| 2026-07-15 | **Préflight Production `1.10.0` — PASS** | Vérifier l'état de Production `1.9.0` et préparer le déploiement `1.10.0` après Gate Production GO | jptshilombo@gmail.com | Contrôles lecture seule sur `loyertracker-prod-server` : 8/8 actifs, 4/4 healthy, restart=0, tag `sha-75646d8f` inchangé, digests API/Web conformes sans dérive. Flyway 22/22 ; objets V23/V24 absents (état propre). **Invariant ledger garantie 8/8 PASS** — écart méthodologique détecté et corrigé en cours de route : la première requête via le rôle applicatif `loyertracker_api` (soumis à la RLS `FORCE`, sans contexte `app.bailleur_id`) renvoyait 0 ligne sur toutes les tables métier ; ré-interrogé avec le rôle superutilisateur `loyertracker` (bypass RLS) pour confirmer les décomptes réels (3 bailleurs/2 patrimoines/8 biens/8 baux/8 garanties/6 quittances/1 gestionnaire) — **aucune perte de données**, effet attendu de la RLS. `bailleur-test@test.local` confirmé désactivé. Prometheus 5/5 ; Alertmanager 1 alerte `BackupHeartbeatMissing`, pattern récurrent déjà qualifié (host redémarré, Pushgateway purgé au boot) — non bloquant. 0 ligne 5xx, site public 200. 31 Gio disque libre, 2,0 Gio mémoire disponible, charge 0,00. Backup vérifié `loyertracker-20260715-120812.dump` (749644 octets, SHA-256 `f4d5e2cb…`) + globals (1108 octets, SHA-256 `1a242fc6…`), modes 600, `pg_restore --list` **777 entrées** (vérifié via `docker cp` dans le conteneur, la variante stdin de `pg_restore --list` ayant échoué sur ce moteur Docker sans indiquer de corruption réelle du dump). `.env.bak-pre-1.10.0` créé, mode 600, `.env` inchangé. **Aucune nouvelle variable d'environnement/secret requise** pour ce périmètre (contrairement à `1.9.0`). Rollback `sha-75646d8f` : images déjà présentes localement sur l'hôte, digests conformes. `CHANGELOG.md` promu en `[1.10.0] — 2026-07-15`. Aucun pull/redémarrage/déploiement exécuté. Rapport : `docs/cgpa/09-production/preflight-backup-v1.10.0-report.md`. **`PRODUCTION_DEPLOYED` non atteint — instruction explicite distincte requise pour déployer `api`+`nginx`.** |
| 2026-07-15 | **Déploiement technique Production `1.10.0` — PASS technique** | Exécuter le déploiement ciblé sur autorisation PO explicite après Gate Production GO et Préflight PASS | jptshilombo@gmail.com | Dépôt hôte avancé par fast-forward `3feb1d5`→`cd0d020` (aucun écart Compose/`.env.example` vérifié avant sync). `.env` `LOYERTRACKER_TAG` basculé vers `sha-c9200a51` ; seuls `api`+`nginx` tirés et recréés (`--no-deps`, sans `--remove-orphans`) ; PostgreSQL/Keycloak/monitoring inchangés, aucune commande Docker globale. Digests des conteneurs recréés confirmés identiques au Gate/Préflight (API `sha256:37de87e8…`, Web `sha256:7ade9816…`). Flyway **V23+V24 appliquées en conditions réelles, 24/24** ; objets confirmés présents (table `locataire`, colonne `gestionnaire.statut`, 2 fonctions `SECURITY DEFINER`). **Invariant ledger garantie 8/8 PASS** (bypass RLS, même précaution qu'au Préflight). Services 8/8 actifs, 4/4 healthy, restart=0. `/healthz` 200, site public 200. Prometheus 5/5 (`loyertracker-api` redécouvert après recréation) ; Alertmanager toujours la seule alerte `BackupHeartbeatMissing` déjà qualifiée, sans rapport. 0 ligne 5xx depuis le redéploiement. Rollback `sha-75646d8f` disponible (images locales intactes). Rapport : `docs/cgpa/09-production/deploiement-technique-v1.10.0-report.md`. **Validation finale (smoke Production) restant une étape distincte** — réactive temporairement `bailleur-test@test.local`/`directAccessGrants` (pattern `1.2.1`→`1.9.0`), nécessitant une autorisation PO explicite dédiée. `PRODUCTION_DEPLOYED` non encore prononcé. |
| 2026-07-15 | **Validation finale Production `1.10.0` — PASS, `PRODUCTION_DEPLOYED`** | Exécuter la validation finale sur autorisation PO explicite dédiée (réactivation temporaire de `bailleur-test`/`directAccessGrants`) | jptshilombo@gmail.com | `bailleur-test@test.local` réactivé temporairement (`enabled=true`) sur confirmation PO explicite dédiée (blocage automatique du classificateur de permissions levé par cette confirmation, même pattern que les précédents blocages du même type). Smoke Production exécuté (`BASE=https://localhost:18443`, `COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml`) : **62 PASS / 0 FAIL au premier passage**, couvrant Flyway 24/24, parcours bailleur/gestionnaire, isolation cross-tenant live, RGPD export/effacement, garde-fous AuthN/ports, surface publique quittances. Échafaudage `directAccessGrants` révoqué automatiquement par le script. **Nettoyage transactionnel** (RUN_ID `1784120083`) : chaque entité identifiée par son identifiant réel avant suppression — 9 paiements, 9 honoraires, 6 alertes, 3 audits, 1 invitation, 1 affectation, 1 bail, 1 bien, 1 patrimoine (bailleur-test) supprimés ; **écart détecté et corrigé en cours de nettoyage** : la 1re tentative de transaction a échoué sur une contrainte FK — `POST /api/bailleurs/inscription` crée automatiquement un patrimoine « Patrimoine principal » pour tout nouveau bailleur, non anticipé dans le plan de nettoyage initial ; transaction rollback proprement (aucune suppression partielle), ce patrimoine ajouté à la liste, nouvelle transaction réussie. Comptes Keycloak du run supprimés (`gest-smoke-1784120083@test.local`, `bailleur2-smoke-1784120083@test.local`). `bailleur-test` redésactivé, `directAccessGrantsEnabled=false` reconfirmé. **Résidus post-nettoyage : 0** (0 bailleur/gestionnaire/patrimoine `%-smoke-%`) ; baseline identique au Préflight (3 bailleurs/2 patrimoines/8 biens/8 baux/8 garanties/1 gestionnaire/6 quittances), invariant ledger 8/8. Services 8/8 actifs, 4/4 healthy, restart=0 ; 0 ligne 5xx ; site public 200. Rapport : `docs/cgpa/09-production/validation-finale-v1.10.0-report.md`. **`PRODUCTION_DEPLOYED` atteint le 2026-07-15 (~13:41 UTC).** Hypercare (T0/T+12/T+24) et clôture de release restent des étapes distinctes non encore instruites. |
| 2026-07-15 | **Hypercare `1.10.0` — Checkpoint T0 PASS** | Vérifier l'état de Production immédiatement après `PRODUCTION_DEPLOYED` | jptshilombo@gmail.com | 8/8 actifs, 4/4 healthy, restart=0 ; tag/digests `sha-c9200a51` inchangés. Flyway 24/24 ; invariant ledger 8/8. `bailleur-test` désactivé, `directAccessGrantsEnabled=false`. `/healthz` et site public 200. Prometheus 5/5 ; Alertmanager 1 alerte `BackupHeartbeatMissing`, pattern récurrent déjà qualifié, sans rapport. 0 ligne 5xx sur 30 min. Capacité : 31 Gio disque libre, ~1,9 Gio mémoire disponible, charge 0,19/0,05/0,02. Plan : `docs/cgpa/09-production/plan-etape-hypercare-v1.10.0.md`. **T+12 (cible 2026-07-16 ~00:39 UTC) et T+24 (cible 2026-07-16 ~12:39 UTC) restent à instruire** — écart de fenêtre probable si l'hôte est éteint entre-temps (pattern récurrent `1.4.0`→`1.9.0`), auquel cas un contrôle live en rattrapage sera qualifié. Clôture de release CDO reste interdite avant ces deux checkpoints. |
| 2026-07-16 | **Hypercare `1.10.0` — Checkpoint T+12 PASS (rattrapage)** | Contrôle live en rattrapage de la fenêtre T+12 (cible 2026-07-16 ~00:39 UTC) | jptshilombo@gmail.com | Contrôlé ~10:57 UTC. **Écart de pattern notable : l'hôte est resté allumé en continu** depuis avant le déploiement (`uptime` ~1 j 14 min, démarrage ~2026-07-15 10:43 UTC), contrairement à `1.4.0`→`1.9.0` où l'hôte était éteint hors opération ; `restart=0` sur tous les conteneurs couvre donc rétroactivement toute la fenêtre cible. Tag/digests `sha-c9200a51` inchangés (API `sha256:37de87e8…`). Flyway 24/24 ; invariant ledger garantie 8/8 PASS (bypass RLS `loyertracker`). `bailleur-test` désactivé, `directAccessGrantsEnabled=false`. `/healthz` et site public 200. Prometheus 5/5 ; Alertmanager 0 alerte (le `BackupHeartbeatMissing` du Préflight/T0 a disparu). Hikari `pending=0`. Logs API (6 h) : 1 seule `ERROR` (`duplicate key … bailleur_keycloak_id_key` à 09:36:51 UTC), tracée à `POST /api/bailleurs/inscription` → 409 correctement géré (contrainte d'unicité), 0 5xx — activité réelle limitée cohérente avec l'usage privé pré-annonce. Capacité : 31 Gio disque libre (20 %), ~1,7-2,0 Gio mémoire disponible, charge 0,04/0,02/0,00. Plan : `docs/cgpa/09-production/plan-etape-hypercare-v1.10.0.md`. **T+24 (cible 2026-07-16 ~12:39 UTC) reste à instruire.** Clôture de release CDO reste interdite avant ce dernier checkpoint. |
| 2026-07-16 | **Cadrage Sprint C (EP-15) — NO-GO (pas encore), documentaire uniquement** | Instruction PO du 2026-07-16 (« cadrer le Sprint C EP-15 ») | jptshilombo@gmail.com | Périmètre US-113 (bascule `Bail → Locataire`, migration **V25 non additive**, RSV-EP15-03 : rollback par backup seul) et US-114 (adaptation RGPD sur `Locataire`) reconfirmé sans changement — aucune décision rouverte (ADR-16 D3/D6 déjà tranchés), aucun code/migration/branche Sprint C ouvert. Vérification de la condition de démarrage explicite du Plan d'Exécution EP-15 (« Sprint C ne peut démarrer qu'après confirmation que V24/Sprint B est stable en Production depuis au moins un cycle de release complet, sans anomalie ») : V24 bien en Production depuis `1.10.0` (`PRODUCTION_DEPLOYED` 2026-07-15 ~13:41 UTC), mais hypercare encore partielle (T0/T+12 PASS, **T+24 restant à instruire**) et **clôture de release `1.10.0` non encore prononcée** (`cloture-release-v1.10.0.md` inexistant) — le cycle de release complet ne peut donc pas encore être constaté. **Verdict : NO-GO (pas encore) pour l'instruction du Sprint C**, jusqu'à T+24 PASS et décision CDO de clôture `1.10.0`. Détail : `docs/cgpa/06-planification-agile/cadrage-sprint-c-ep15.md`. **Prochaine étape : achever l'hypercare `1.10.0` (T+24) puis statuer la clôture de release ; un GO explicite du PO restera ensuite requis avant tout codage Sprint C.** |
| 2026-07-16 | **Cadrage EP-13 « Fin de bail » — Proposé, documentaire uniquement, kickoff K1→K6 ouvert** | Instruction PO du 2026-07-16 (« cadrer EP-13 fin de bail ») | jptshilombo@gmail.com | Constat de cadrage : `Bail.statut` `CLOS` existe dans le schéma depuis l'origine mais **n'est assigné par aucun code applicatif** — conséquence déjà active en Production : impossible de créer un second bail sur un bien une fois le premier créé (`uq_bail_actif`, EF-12, bloque tout nouveau bail tant qu'aucun n'est jamais clos). Ce n'est pas une simple extension, mais une lacune de cycle de vie. Livrables : `ADR-17-fin-de-bail.md` (Proposée, six décisions kickoff K1→K6 entièrement ouvertes — déclenchement manuel de la clôture, `date_cloture_effective` distincte de `dateFin`, avertissement non bloquant vs blocage si garantie non restituée/impayés à la clôture, réouverture possible, purge de l'échéancier futur non exigible), addenda EB/CDC (`addendum-fin-de-bail.md` ×2, BF-102→105/EF-108→112/RM-108→113/ENF-93), addendum backlog (`addendum-backlog-ep13-fin-de-bail.md`, US-115→118, 19 points, sprint unique — lot entièrement additif contrairement à EP-15), `plan-execution-ep13-fin-de-bail.md` (proposé, non approuvé). **Aucun code, aucune migration.** Périmètre volontairement découplé de la Garantie et des Paiements (pas d'orchestration transactionnelle `ClotureBailService`, explicitement écarté) ; aucune dépendance technique avec le Sprint C d'EP-15 (coordination de séquencement Production à arbitrer si les deux lots sont conduits en parallèle, RSV-EP13-04). **Prochaine étape : le PO tranche K1→K6 puis donne un GO explicite sur le Plan d'Exécution avant tout Sprint — à noter, le prérequis de release `1.10.0` clôturée n'est pas non plus encore atteint à ce jour (hypercare en cours).** |
| 2026-07-16 | **Hypercare `1.10.0` — Checkpoint T+24 PASS (rattrapage) : hypercare complète** | Contrôle live en rattrapage de la fenêtre T+24 (cible 2026-07-16 ~12:39 UTC) | jptshilombo@gmail.com | Contrôlé ~15:01 UTC (≈2 h 22 après la cible ; horodatage corrigé après coup — `uptime` affiche l'heure locale de l'hôte `Africa/Kinshasa`/WAT=UTC+1, pas l'UTC, confirmé via `timedatectl` ; toujours utiliser `date -u`). Hôte resté allumé en continu depuis avant le déploiement (`uptime` ~1 j 5 h 17 min, démarrage ~2026-07-15 09:43 UTC) ; `restart=0` sur les 8 conteneurs couvre rétroactivement toute la fenêtre. Tag/digests `sha-c9200a51` inchangés (API `sha256:37de87e8…`, Web `sha256:7ade9816…`). Flyway 24/24 ; invariant ledger garantie 8/8 PASS (`solde_actuel` aligné sur le dernier mouvement du ledger de chaque garantie, bypass RLS `loyertracker`) — **une première reconstitution de la requête d'invariant a produit un faux positif** (1/8, formule `montant - montant_retenu` appliquée à une garantie ayant subi deux `RETENUE_LOYER` légitimes) ; investigation du ledger (`garantie_movement`) et de `Garantie.retenirSurLoyer` a confirmé un comportement voulu (seule `restituerPartiel` met à jour `montantRetenu`), pas une anomalie de production. `bailleur-test` désactivé, `directAccessGrantsEnabled=false` (clients applicatifs). `/healthz` et site public 200. Prometheus 5/5 ; Alertmanager 0 alerte. Hikari `pending=0`. Logs (depuis T+12, ~5 h) : 0 5xx nginx, 0 `ERROR` API. Capacité : 31 Gio disque libre (20 %), ~1,7 Gio mémoire disponible, charge 0,00/0,03/0,00. Détail : `docs/cgpa/09-production/plan-etape-hypercare-v1.10.0.md`. **Hypercare `1.10.0` intégralement PASS (T0+T+12+T+24).** **Prochaine étape : décision CDO de clôture de release `1.10.0`, distincte de l'hypercare — non encore instruite.** |
| 2026-07-16 | **Clôture Release `1.10.0` — CDO GO** | Instruction PO du 2026-07-16 (« avance sur la clôture de release 1.10.0 »), après hypercare intégralement PASS | jptshilombo@gmail.com | Récapitulatif du cycle complet (EP-15 Sprints A+B, US-105→112, migrations V23/V24) vérifié sans écart. État de Production au moment de la clôture confirmé live : 8/8 actifs 4/4 healthy restart=0 depuis ~27 h, tag/digests `sha-c9200a51` inchangés, Flyway 24/24, invariant ledger garantie 8/8, Prometheus 5/5, Alertmanager 0 alerte, Hikari `pending=0`, 0 ligne 5xx depuis le déploiement, `bailleur-test` désactivé, site public 200 ; données métier identiques à la baseline (0 locataire réel, Sprint C non démarré). RSV-EP15-01→04 confirmées non bloquantes (tranchées au cadrage) ; `RSV-STG-01` (héritée) maintenue, sans rapport avec `1.10.0`. **Décision CDO : GO — RELEASE `1.10.0` CLÔTURÉE.** Détail : `docs/cgpa/09-production/cloture-release-v1.10.0.md`. **Cette clôture lève la condition de démarrage du Sprint C EP-15** (posée par le Plan d'Exécution EP-15 : Sprint B stable en Production sur un cycle de release complet sans anomalie) **et satisfait le prérequis de release clôturée du Plan d'Exécution EP-13** — dans les deux cas, un GO explicite du PO reste requis avant tout codage (Sprint C) ou avant tranchage du kickoff K1→K6 puis GO (EP-13). **Prochaine étape : arbitrage du PO entre GO explicite Sprint C EP-15 et/ou tranchage du kickoff K1→K6 EP-13 — les deux restent indépendants et non exclusifs.** |
| 2026-07-16 | **Kickoff EP-13 clos — K1→K6 tranchés par le PO, six propositions par défaut validées sans modification** | Instruction PO du 2026-07-16 (« tranche le kickoff K1→K6 EP-13 »), soumis par choix explicite (même méthode que les 4 décisions d'architecture EP-15) | jptshilombo@gmail.com | **K1** (déclenchement manuel uniquement, jamais de batch automatique) : confirmé. **K2** (`bail.date_cloture_effective` distincte de `dateFin`) : confirmé. **K3** (garantie non restituée à la clôture → avertissement, pas de blocage 409) : confirmé **malgré l'attention particulière signalée** (obligation légale/financière envers le locataire sortant, contrairement à un simple doublon). **K4** (impayés à la clôture → avertissement) : confirmé. **K5** (réouverture autorisée sous réserve `uq_bail_actif`) : confirmé. **K6** (purge des échéances `A_VENIR` futures) : confirmé malgré la réserve de suppression de données signalée. `ADR-17-fin-de-bail.md` mis à jour en conséquence (statut « kickoff clos », chaque section K1→K6 requalifiée en décision tranchée, RSV-EP13-01/02 requalifiés « Accepté par le PO » plutôt que « dépend du tranchage »), ainsi que `plan-execution-ep13-fin-de-bail.md` (checklist, prérequis release `1.10.0` clôturée confirmé atteint). **Aucun code, aucune migration.** **Seul un GO explicite du PO sur `plan-execution-ep13-fin-de-bail.md` reste requis avant tout démarrage de Sprint.** |
| 2026-07-16 | **Plan d'Exécution EP-13 — GO explicite du PO : Sprint unique autorisé à démarrer** | Instruction PO du 2026-07-16 (« donne le GO explicite sur le Plan d'Exécution EP-13 ») | jptshilombo@gmail.com | Le PO approuve explicitement `plan-execution-ep13-fin-de-bail.md` (US-115→118, Sprint unique — clôture/réouverture/purge échéancier/non-régression alertes), après kickoff K1→K6 clos le même jour et prérequis « release `1.10.0` clôturée (CDO GO) » satisfait. `plan-execution-ep13-fin-de-bail.md` requalifié « Approuvé », checklist CGPA intégralement cochée hors Gate Staging/Production (à venir avec le Sprint). `ADR-17-fin-de-bail.md` requalifiée **Acceptée**. **Aucun code, aucune migration produits par ce GO lui-même** — il autorise le démarrage du codage du Sprint (US-115→118), toujours hors périmètre `ClotureBailService`/Garantie/Paiements (ADR-17 §Alternatives écartées), toujours sous réserve du Gate Staging (dont `STG-ISOL-01`) puis d'une décision Gate Production distincte avant toute Production. **Prochaine étape : coder le Sprint unique EP-13 (migration additive `bail.date_cloture_effective`, `BailService.cloturer()`/`rouvrir()`, endpoints `POST .../cloture` et `.../reouverture`, tests).** |
| 2026-07-16 | **Sprint unique EP-13 codé, vert et mergé sur `main` — PR #227 (`cba13f5`)** | GO explicite du PO reçu, Sprint codé conformément au Plan d'Exécution et à l'ADR-17 (K1→K6) | jptshilombo@gmail.com | Livré : migration **V25** additive (`bail.date_cloture_effective` nullable ; `generer_alertes()` recréée, CTE `LOYER_EN_RETARD` désormais jointe à `bail` et restreinte à `statut = 'ACTIF'`, alignée sur `FIN_BAIL`/`PREAVIS` déjà filtrées — US-118) ; `Bail.cloturer()`/`rouvrir()` (gardes métier 409, patron `Locataire.archiver()`/`restaurer()`) ; `BailService.cloturer`/`rouvrir` (avertissements K3/K4 sans blocage, purge US-117 des `A_VENIR` futurs dans la même transaction, double garde `uq_bail_actif` à la réouverture comme `creer`) ; endpoints `POST .../baux/{bailId}/cloture` et `.../reouverture` ; `ClotureBailDto`/`ClotureRequest` (nouveau pattern « avertissement sans blocage », aucun précédent dans ce dépôt) ; audit `CLOTURER_BAIL`/`ROUVRIR_BAIL`. Tests : `BailClotureReouvertureTest` (unitaire, gardes 409), `BailClotureIntegrationTest` (nouveau, clôture+avertissements+purge, réouverture, collision 409, cross-bailleur 403), extension `S04AlertesAuditIntegrationTest` (non-régression `LOYER_EN_RETARD` sur bail clos). **`mvn verify` 185/185 verts**, compteurs Flyway (`SchemaMigrationTest`, `smoke-stack.sh`) alignés à 25 dans le même commit que la migration (leçon PR #77/#171). **PR #227 CI 7/7 verte** — un correctif a été nécessaire avant merge : violation SonarQube bloquante `java:S5778` (lambda `assertThatThrownBy` avec deux appels pouvant lever une exception) corrigée en sortant la construction de la date hors du lambda, Quality Gate ensuite PASS. **PR #227 mergée le 2026-07-16T16:06:46Z (`cba13f5`)**, `main` local resynchronisé. Commit de code déplacé, avant merge, de la branche documentaire `docs/cadrage-ep13-fin-de-bail` (PR #226, déjà mergée) vers une branche dédiée `feat/sprint-ep13-fin-de-bail`, conformément au découpage « un sujet = une PR » déjà pratiqué sur ce projet. **Aucun déploiement Staging/Production à ce stade.** Périmètre hors ce Sprint inchangé : aucun `ClotureBailService`, aucune modification des modules Garantie/Paiements, aucune UI Angular (backend-only, comme Locataire). **Prochaine étape CGPA : instruire le Gate Staging du Sprint (dont `STG-ISOL-01`, mutualisation `ai-test-server`) ; une décision Gate Production distincte restera requise avant toute Production.** |
| 2026-07-16 | **Gate Staging EP-13 (Fin de bail) — GO, `STAGING_DEPLOYED`** | Instruction PO du 2026-07-16 (« instruis le Gate Staging du Sprint »), après confirmation explicite du PO pour l'exécution réelle sur l'hôte mutualisé | jptshilombo@gmail.com | Candidat `sha-cba13f52` (merge PR #227 `cba13f5`) : images GHCR publiées et digests confirmés. Sauvegarde pré-déploiement `loyertracker-20260716-172113.dump` (549489 octets, 798 entrées, SHA-256 `eaad8cda…`). **STG-ISOL-01 PASS avant/après** : 9 conteneurs `loyertracker-staging-*`/`nginx-proxy-manager` intacts, restart=0, réseaux/volumes namespacés, aucune commande Docker globale (`git pull --ff-only` + `docker compose -f docker-compose.staging.yml pull/up -d --no-deps api nginx`). Flyway : **V25 appliquée, total 25/25** (`bail.date_cloture_effective`, `generer_alertes()` filtrée `ACTIF` sur `LOYER_EN_RETARD`). Smoke **62/0** (script non étendu aux nouveaux endpoints, comme Garantie Sprint 9/10 et Gestionnaire/Locataire Sprints A+B). **Vérification manuelle live dédiée aux endpoints `.../cloture`/`.../reouverture` : 22 PASS/0 FAIL** — clôture avec avertissements non bloquants (garantie `DETENU` + paiements `EN_RETARD` réels), `dateFin` contractuelle inchangée, purge des `A_VENIR` futurs (0 restant) sans toucher les `EN_RETARD` historiques (6 conservés), non-régression alertes confirmée en conditions réelles (0 `LOYER_EN_RETARD` sur bail clos malgré paiements en retard non purgés), clôture d'un bail déjà clos → 409, réouverture réussie, collision `uq_bail_actif` → 409. **Incident mineur survenu pendant l'instruction, signalé immédiatement au PO** : une commande de diagnostic (`set -x`) a tracé le `source .env` et exposé en clair, dans la session de travail, les 7 secrets Staging (`POSTGRES_PASSWORD`, `DB_APP_PASSWORD`, `DB_BATCH_PASSWORD`, `KEYCLOAK_ADMIN_PASSWORD`, `KEYCLOAK_API_CLIENT_SECRET`, `KEYCLOAK_TEST_BAILLEUR_PASSWORD`, `QUITTANCE_HMAC_SECRET`) — rotation recommandée sur `ai-test-server`, non bloquante pour ce Gate (environnement Staging, aucun secret Production concerné). **Gate Staging EP-13 GO — `STAGING_DEPLOYED`**. Décision : `docs/cgpa/07-devsecops/gate-staging-ep13-fin-de-bail-decision.md`. **Prochaine étape : instruire le Gate Production du Sprint EP-13 (distinct) ; ce Gate n'autorise aucun déploiement Production.** |
| 2026-07-16 | **Gate Production EP-13 (Fin de bail) — GO, `PRODUCTION_READY`** | Instruction PO du 2026-07-16 (« Gate Production du Sprint EP-13 ») | jptshilombo@gmail.com | Checklist Gate Production intégralement instruite sur le candidat `sha-cba13f52` (`cba13f5`). Toutes les preuves Staging PASS : `STG-ISOL-01`, Flyway 25/25, smoke 62/0, vérification manuelle live dédiée 22/0. CI GitHub 7/7 SUCCESS confirmé sur `cba13f5` ; Quality Gate SonarQube bloquant vert (correctif `java:S5778` déjà intégré au candidat). Migration V25 additive : rollback applicatif seul viable vers `1.10.0` (`sha-c9200a51`). **Aucune nouvelle variable d'environnement/secret** requise, confirmé par `git diff --stat` sur les fichiers Compose/`.env.example` (aucun changement). **Aucune revue sécurité dédiée jugée nécessaire** (RBAC/ReBAC inchangés, aucune nouvelle fonction `SECURITY DEFINER`, confirmé par ADR-17 §Impacts sécurité). RSV-EP13-01→03 non bloquantes (tranchées au kickoff) ; RSV-EP13-04 (coordination Sprint C EP-15) sans objet, Sprint C toujours NO-GO. L'incident mineur d'exposition de secrets survenu pendant le Gate Staging est sans rapport avec la Production (aucun secret Production concerné), non bloquant pour ce Gate. Décision : `docs/cgpa/09-production/gate-production-ep13-fin-de-bail-decision.md`. **`PRODUCTION_READY` atteint.** Cette décision autorise uniquement le **Préflight Production** ; aucune mutation ni déploiement. **Prochaine étape : Préflight Production, puis instruction explicite distincte du déploiement technique après un Préflight PASS.** Version proposée : `1.11.0` (à confirmer/dater au Préflight). |
| 2026-07-16 | **Préflight Production `1.11.0` — PASS** | Instruction PO du 2026-07-16 (« vas-y avec Préflight ») | jptshilombo@gmail.com | Contrôles lecture seule sur `loyertracker-prod-server` : 8/8 actifs, 4/4 healthy, restart=0, tag `sha-c9200a51` inchangé, digests API/Web conformes sans dérive. Flyway 24/24 ; objet V25 (`bail.date_cloture_effective`) absent (état propre). **Invariant ledger garantie 8/8 PASS** (`solde_actuel` aligné sur le dernier mouvement du ledger, bypass RLS `loyertracker`). `bailleur-test@test.local` confirmé désactivé, `directAccessGrantsEnabled=false` sur les 3 clients applicatifs. Prometheus 5/5 ; Alertmanager 0 alerte. 0 ligne 5xx (30 min), site public 200. Données métier baseline inchangées (3 bailleurs/2 patrimoines/8 biens/8 baux/8 garanties/1 gestionnaire/0 locataire/6 quittances). 31 Gio disque libre, ~1,7 Gio mémoire disponible, charge 0,14/0,08/0,02. Backup vérifié `loyertracker-20260716-175144.dump` (759990 octets, SHA-256 `62fdf175…`) + globals (1108 octets, SHA-256 `50eba80f…`), modes 600, `pg_restore --list` **798 entrées**. `.env.bak-pre-1.11.0` créé, mode 600, `.env` inchangé. **Aucune nouvelle variable d'environnement/secret requise** pour ce périmètre. Rollback `sha-c9200a51` : images déjà présentes localement, digests conformes. `CHANGELOG.md` promu en `[1.11.0] — 2026-07-16`. Aucun pull/redémarrage/déploiement exécuté. Rapport : `docs/cgpa/09-production/preflight-backup-v1.11.0-report.md`. **`PRODUCTION_DEPLOYED` non atteint — instruction explicite distincte requise pour déployer `api`+`nginx`.** |
| 2026-07-17 | **GO explicite du PO — Sprint C EP-15 : démarrage du codage US-113/US-114 autorisé** | Instruction PO du 2026-07-17 (« donne le GO explicite pour démarrer le Sprint C EP-15 ») | jptshilombo@gmail.com | Les deux jalons posés par le cadrage du 2026-07-16 (`cadrage-sprint-c-ep15.md`) sont francs : hypercare `1.10.0` T+24 PASS (2026-07-16 ~15:01 UTC) et clôture CDO GO de `1.10.0` (2026-07-16 ~15:20 UTC). Le PO donne le GO explicite requis par le Plan d'Exécution EP-15. **Renumérotation** : la bascule était désignée « V25 » ; ce numéro a entretemps été consommé par la migration EP-13 (« fin de bail », sans rapport, déjà en Production `1.11.0`) — elle porte donc désormais **V26**, sans changement de fond, cf. `cadrage-sprint-c-ep15.md` §6, `plan-execution-ep15-personnes.md` §Sprint C et `ADR-16-gestion-personnes.md` §D3 mis à jour en conséquence. Deux décisions de conception tranchées avant codage : (1) contrat `BailDto` en **lecture inchangé** (`locataireNom`/`locataireEmail` dérivés du `Locataire` lié, seule l'écriture — création de bail — bascule vers `locataireId`), pour préserver `RgpdIntegrationTest` et tout consommateur de `BailDto` sans régression ; (2) un nouvel endpoint `GET /api/biens/{bienId}/locataires` (lecture seule, gardé par `@authz.peutAccederBien`) donne au Gestionnaire accès aux locataires du bailleur pour créer un bail — sans quoi la création de bail côté tableau de bord Gestionnaire (déjà en Production) casserait dès que `locataireId` devient obligatoire. **Aucun code, aucune migration produits par ce GO lui-même** — il autorise le démarrage du codage. **Prochaine étape : coder le Sprint C (migration V26, bascule domaine Bail/Locataire, RGPD retargeté, quittances, tests, frontend minimal).** |
| 2026-07-17 | **Sprint C EP-15 codé et vert (US-113/US-114, non déployé)** | GO explicite du PO reçu le même jour, Sprint codé conformément au Plan d'Exécution et à l'ADR-16 (D2/D3/D6) | jptshilombo@gmail.com | Livré sur branche `feat/sprint-c-ep15-bascule-locataire` : migration **V26** non additive (backfill 1 `Locataire`/bail historique, `bail.locataire_id NOT NULL`, suppression `locataire_nom`/`locataire_email`) ; `Bail`/`BailDto`/`BailRequest`/`BailService` bascule vers `locataireId` en écriture, lecture dérivée du `Locataire` lié (batch-chargé, pas de N+1) ; nouveau `GET /api/biens/{bienId}/locataires` (lecture Gestionnaire) ; `Locataire.anonymiser()` (patron `archiver()`/`restaurer()`) ; RGPD retargeté (`DELETE /api/locataires/{locataireId}/effacement`, remplace l'ancien endpoint bail-scopé — anonymise tout l'historique de baux en une opération, US-114) ; `QuittanceService`/`QuittanceCertifieeService` lisent désormais `Locataire` à l'émission (quittances déjà émises inchangées, contenu figé) ; `infra/smoke/smoke-stack.sh` mis à jour (V26, nouvel endpoint RGPD, création locataire). Frontend : sélecteur de locataire + création rapide (Bailleur) sur les deux tableaux de bord. **`mvn verify` 187/187 verts** (185 + 2 nouveaux tests 404/409 sur `locataireId`), compteur Flyway aligné à 26 dans le même commit que la migration. **`ng build --configuration production` et `ng test` 94/94 verts.** **Vérification manuelle navigateur réalisée** via stack Docker locale réelle (Postgres/Keycloak/API/Nginx buildés depuis ce code, Flyway 26/26 confirmé en direct) : login Keycloak réel (bailleur-test), création d'un bien, création rapide d'un Locataire depuis le formulaire de bail (« + Nouveau locataire »), sélection automatique dans le menu déroulant, création du bail avec `locataireId`, `bien.statut` basculé `LIBRE → LOUE`, et **historique du bail affichant correctement le nom du locataire lié** (contrat de lecture confirmé de bout en bout, captures d'écran à l'appui). Un premier essai a été bloqué par le port 443 de l'hôte, occupé par un nginx système hors périmètre du projet (nécessaire à la redirection OIDC portless de Keycloak) — le PO a arrêté ce service via `!`, la vérification a été menée, puis le service a été relancé (hôte restauré à l'identique, `docker-compose.yml` sans dérive). **Aucun déploiement Staging/Production à ce stade.** **Prochaine étape CGPA : Gate Staging du Sprint (dont `STG-ISOL-01`).** |
| 2026-07-17 | **Gate Staging Sprint C EP-15 — GO, `STAGING_DEPLOYED`** | Instruction PO du 2026-07-17 (« instruis le Gate Staging du Sprint »), puis « merge quand c'est vert », puis « déploie sur ai-test-server une fois vert » | jptshilombo@gmail.com | PR #229 ouverte, CI initialement en échec (`java:S107`, constructeur `Bail` à 9 paramètres) — corrigé (`@SuppressWarnings`, même patron que `Quittance`) et **pré-validé contre l'instance SonarQube réelle avant re-push** (leçon déjà tracée en mémoire appliquée). CI 7/7 verte, **PR #229 mergée** (`359f4d6`), CI post-merge verte, images GHCR `sha-359f4d63` publiées. Déploiement `ai-test-server` : sauvegarde vérifiée (799 entrées), **STG-ISOL-01 PASS avant/après**, `api`+`nginx` seuls recréés, Flyway **V26 appliquée, 26/26**. **Backfill V26 vérifié sur données réelles** (non additive, RSV-EP15-03) : 35/35 baux avec `locataire_id`, 0 orphelin, `prenom` non peuplé comme prévu. Smoke **63/0 au premier passage** (script étendu : `locataireId` en création de bail, nouvel endpoint RGPD `.../locataires/{id}/effacement`). Nettoyage transactionnel : résidu accumulé de sessions antérieures sur `bailleur-test` purgé, 0 résidu après. **Vérification manuelle navigateur du PO contre `https://loyertracker.staging.loyerpro.org` (connexion Keycloak réelle) : test concluant** — création bien/locataire rapide/bail (Bailleur) et menu déroulant locataire correctement peuplé (Gestionnaire). **Gate Staging Sprint C GO — `STAGING_DEPLOYED`**. Décision : `docs/cgpa/07-devsecops/gate-staging-sprint-c-ep15-decision.md`. **Prochaine étape : Gate Production du Sprint C (distinct), Préflight renforcé requis (backup avant et après la migration non additive V26).** |
| 2026-07-19 | **Reprise de session — écart de traçabilité détecté sur le déploiement `1.11.0`** | Reprise CGPA sur `docs/gate-staging-sprint-c-ep15`, contrôles lecture seule effectués contre `loyertracker-prod-server` avant d'instruire le Gate Production du Sprint C EP-15 | jptshilombo@gmail.com | La documentation (`project-state.md`/`prod-state.md`) s'arrêtait au **Préflight `1.11.0` PASS** du 2026-07-16, qui concluait explicitement `PRODUCTION_DEPLOYED` non atteint. Les contrôles lecture seule sur l'hôte ont montré le contraire : `LOYERTRACKER_TAG=sha-cba13f52`, Flyway **25/25** appliquées, 8/8 conteneurs actifs (host redémarré ~6 min avant, pattern normal — hôte intentionnellement éteint entre sessions), soit le candidat EP-13 réellement déployé. Aucun rapport de déploiement technique ni de validation finale n'avait été rédigé, et le Sprint C EP-15 avait démarré le lendemain (2026-07-17) sur cette base sans que ce chaînon soit refermé. PO informé, arbitrage : combler le trou (rapport factuel a posteriori) avant de poursuivre sur Sprint C EP-15, y compris en rejouant le smoke de validation finale (autorisation explicite donnée pour la réactivation temporaire de `bailleur-test`/`directAccessGrants`). |
| 2026-07-19 | **Régularisation a posteriori — `1.11.0` `PRODUCTION_DEPLOYED` confirmé** | Suite du même arbitrage PO du 2026-07-19 | jptshilombo@gmail.com | Déploiement technique constaté conforme (digests API/Web identiques au Gate/Préflight, Flyway 25/25, rollback `sha-c9200a51` toujours disponible) — rapport `docs/cgpa/09-production/deploiement-technique-v1.11.0-report.md`. Smoke de validation finale rejoué en conditions réelles contre `https://loyertracker.loyerpro.org` (`bailleur-test` réactivé sur autorisation explicite) : **62 PASS / 0 FAIL au premier passage**, couverture identique aux validations finales précédentes (JWT réels, parcours bailleur/gestionnaire, isolation cross-tenant, RGPD, garde-fous AuthN) — rapport `docs/cgpa/09-production/validation-finale-v1.11.0-report.md`. Nettoyage transactionnel complet (RUN_ID `1784457409` : 10 paiements, 10 honoraires, 6 alertes, 3 audits, 1 invitation, 1 affectation, 1 bail, 1 bien, 2 patrimoines, 1 gestionnaire, 1 bailleur — tout supprimé en une transaction unique, 0 résidu vérifié), `bailleur-test` redésactivé et `directAccessGrantsEnabled=false` reconfirmés, 2 comptes Keycloak smoke supprimés. Baseline métier restaurée à l'identique (3 bailleurs/2 patrimoines/8 biens/8 baux/8 garanties/1 gestionnaire/0 locataire/6 quittances), 0 5xx, site public 200, `restart=0` sur les 4 services critiques. **`PRODUCTION_DEPLOYED` pour `1.11.0` (`sha-cba13f52`) confirmé rétroactivement le 2026-07-19** (déploiement réel du 2026-07-16). Hypercare continue T0/T+12/T+24 non observable rétroactivement (hôte éteint entre sessions, cf. §13) — ce contrôle J+3 accepté comme preuve de stabilité substitutive. `docs/prod-state.md` §0L et §1/§3A mis à jour en conséquence ; réserve de gouvernance consignée et fermée en §13. **Prochaine étape : instruire le Gate Production du Sprint C EP-15 sur la base corrigée `1.11.0`/`sha-cba13f52`.** |
| 2026-07-19 | **Gate Production Sprint C EP-15 — GO, `PRODUCTION_READY`** | Instruction PO du 2026-07-19 (Préflight renforcé demandé, puis Gate Production préalable requis avant Préflight conformément au précédent EP-13) | jptshilombo@gmail.com | Checklist Gate Production intégralement instruite sur le candidat `sha-359f4d63` (`359f4d6`), base de rollback corrigée `1.11.0`/`sha-cba13f52` (suite à la régularisation du même jour). Toutes les preuves Staging PASS : `STG-ISOL-01`, Flyway V26 26/26, backfill 35/35 vérifié, smoke 63/0, vérification manuelle navigateur du PO concluante. CI GitHub 7/7 SUCCESS confirmé sur `359f4d6` ; Quality Gate SonarQube bloquant vert (correctif `java:S107` pré-validé contre l'instance réelle avant re-push). Migration V26 **non additive** : rollback applicatif seul viable **avant** son application, restauration de backup requise après (RSV-EP15-03, déjà tranchée par le PO, ADR-16 D3). **Aucune nouvelle variable d'environnement/secret** requise. **Aucune revue sécurité dédiée supplémentaire jugée nécessaire** au-delà de celle déjà faite au cadrage (nouvel endpoint `GET /api/biens/{bienId}/locataires` en lecture seule, garde `@authz.peutAccederBien` déjà éprouvée). RSV-EP15-01/02/04 non bloquantes (héritées, déjà tranchées) ; `RSV-STG-01` maintenue, sans rapport. Décision : `docs/cgpa/09-production/gate-production-sprint-c-ep15-decision.md`. **`PRODUCTION_READY` atteint.** Cette décision autorise uniquement le **Préflight Production renforcé** (backup exigé avant **et** après la migration V26) ; aucune mutation ni déploiement. **Prochaine étape : Préflight Production renforcé, puis instruction explicite distincte du déploiement technique après un Préflight PASS.** Version proposée : `1.12.0` (à confirmer/dater au Préflight). |
| 2026-07-19 | **Préflight Production renforcé `1.12.0` — PASS** | Instruction PO du 2026-07-19 (« rejoue le Préflight renforcé ») | jptshilombo@gmail.com | Contrôles lecture seule sur `loyertracker-prod-server` : 8/8 actifs, 4/4 healthy, restart=0, tag `sha-cba13f52` inchangé. Flyway 25/25 ; V26 pas encore appliquée (état propre). `bailleur-test@test.local` confirmé désactivé, `directAccessGrantsEnabled=false` (état restauré après la validation finale `1.11.0` rejouée plus tôt dans la même session). Prometheus 5/5 ; Alertmanager 0 alerte. 0 ligne 5xx (30 min), site public 200. Données métier baseline inchangées (3 bailleurs/2 patrimoines/8 biens/8 baux/8 garanties/1 gestionnaire/0 locataire/6 quittances). 31 Gio disque libre, ~1,9 Gio mémoire disponible, charge 0,49/0,26/0,22. **Backup vérifié** `loyertracker-20260719-114702.dump` (761471 octets, SHA-256 `a73b81c0…`) + globals (1108 octets, SHA-256 `00d7c736…`), modes 600, `pg_restore --list` **799 entrées**, copie hebdomadaire déposée. `.env.bak-pre-1.12.0` créé, mode 600, `.env` inchangé. **Aucune nouvelle variable d'environnement/secret** (`git diff --stat cba13f5 359f4d6` sur Compose/`.env.example` : aucun changement). **Volet renforcé (RSV-EP15-03, migration V26 non additive)** : ce Préflight ne couvre que le backup avant migration — un **second backup post-migration V26** est explicitement exigé du déploiement technique avant toute validation finale (condition bloquante reportée). Rollback `sha-cba13f52` : images déjà présentes localement, disponible uniquement avant application de V26. `CHANGELOG.md` `[Non publié]` laissé tel quel — promotion en `[1.12.0]` datée différée au moment du déploiement effectif. Aucun pull/redémarrage/déploiement exécuté. Rapport : `docs/cgpa/09-production/preflight-backup-v1.12.0-report.md`. **`PRODUCTION_DEPLOYED` non atteint — instruction explicite distincte requise pour déployer `api`+`nginx` et appliquer V26.** |
| 2026-07-19 | **Déploiement technique `1.12.0` — PASS (Sprint C EP-15)** | Instruction PO du 2026-07-19 (« instruis le déploiement technique de la release 1.12.0 ») | jptshilombo@gmail.com | Dépôt hôte avancé par fast-forward `cba13f5` → `c14cdc2` (écart confirmé purement documentaire au-delà du candidat `359f4d6`) ; aucun écart Compose/`.env.example`. Tag `.env` basculé `sha-cba13f52` → `sha-359f4d63` (`.env.bak-pre-1.12.0` déjà disponible). Déploiement strictement ciblé : `api`+`nginx` seuls recréés (avertissement Compose « conteneurs orphelins » du monitoring attendu et ignoré, `--remove-orphans` jamais utilisé). Digests confirmés identiques au Gate/Préflight. **Flyway V26 appliquée, 26/26.** **Backfill V26 vérifié sur données réelles Production** (non additive, RSV-EP15-03) : **8/8 baux avec `locataire_id`, 0 orphelin**, colonnes `locataire_nom`/`locataire_email` absentes, `prenom` vide comme prévu (échantillon vérifié). **Second backup post-migration produit et vérifié** conformément à la condition bloquante du Gate/Préflight : `loyertracker-20260719-115220.dump` (761841 octets, SHA-256 `937e777b…`) + globals, `pg_restore --list` 799 entrées — ce dump devient le point de restauration de référence (rollback applicatif seul non viable après V26). `/healthz` 200, site public 200, 0 5xx, `restart=0` sur les 4 services critiques, Prometheus 5/5, Alertmanager 0 alerte. Rapport : `docs/cgpa/09-production/deploiement-technique-v1.12.0-report.md`. **`PRODUCTION_DEPLOYED` pas encore prononcé** — la validation finale (smoke Production, réactivation temporaire autorisée de `bailleur-test`/`directAccessGrants`) reste une étape distincte requérant une autorisation PO explicite dédiée. **Prochaine étape : validation finale (smoke Production).** |
| 2026-07-19 | **Validation finale `1.12.0` — PASS, `PRODUCTION_DEPLOYED` atteint (Sprint C EP-15)** | Instruction PO du 2026-07-19 (« instruis la validation finale de la release 1.12.0 ») | jptshilombo@gmail.com | Réactivation temporaire de `bailleur-test@test.local` (autorisation PO explicite, distincte du déploiement technique). Smoke Production : **63 PASS / 0 FAIL au premier passage**, identique au résultat du Gate Staging — exerce de bout en bout le nouveau contrat `locataireId` (`POST /api/locataires`, création de bail) et l'effacement RGPD retargeté (`DELETE /api/locataires/{id}/effacement`, 403 gestionnaire/204 bailleur, anonymisation confirmée, audit `EFFACEMENT_LOCATAIRE`). Échafaudage `directAccessGrants` révoqué automatiquement par le script. **Nettoyage transactionnel complet** (RUN_ID `1784458624` : 10 paiements, 10 honoraires, 6 alertes, 4 audits, 1 invitation, 1 affectation, 1 bail, 1 bien, 1 locataire, 2 patrimoines, 1 gestionnaire, 1 bailleur — supprimés en une transaction unique, 0 résidu vérifié), `bailleur-test` redésactivé, 2 comptes Keycloak smoke supprimés. Baseline métier restaurée avec la nouvelle référence V26 (3 bailleurs/2 patrimoines/8 biens/8 baux/8 garanties/1 gestionnaire/**8 locataires**/6 quittances), 0 5xx, site public 200, `restart=0`. `CHANGELOG.md` promu `[Non publié]` → `[1.12.0] — 2026-07-19`. Rapport : `docs/cgpa/09-production/validation-finale-v1.12.0-report.md`. **`PRODUCTION_DEPLOYED` atteint le 2026-07-19 ~11:57 UTC pour la release `1.12.0` (`sha-359f4d63`, Sprint C EP-15).** `docs/prod-state.md` §0M créé. **Prochaine étape : hypercare (T0/T+12/T+24), puis clôture CDO de la release.** |
| 2026-07-19 | **Hypercare `1.12.0` — Checkpoint T0 PASS ; correction méthodologique des horodatages `PRODUCTION_DEPLOYED`** | Instruction PO du 2026-07-19 (« instruis l'hypercare T0 ») | jptshilombo@gmail.com | **Correction méthodologique** : l'horodatage `PRODUCTION_DEPLOYED` noté « ~11:57 UTC » (entrée ci-dessus) et « Fenêtre 11:48–11:52 UTC » (`deploiement-technique-v1.12.0-report.md`) était **estimé sans vérification `date -u` au moment des faits** — même piège que la leçon déjà tracée au T+24 de `plan-etape-hypercare-v1.10.0.md` (`uptime` en heure locale), en pire : ici aucune commande d'horodatage n'a été exécutée du tout, seulement une estimation au fil de la session. **Preuve exacte retrouvée** au T0 (`docker inspect --format='{{.State.StartedAt}}'` sur `api`/`nginx`) : démarrage réel des conteneurs à **`2026-07-19T10:51:05Z`**, soit ~57 minutes plus tôt que documenté. **Aucun impact sur le fond** (santé/Flyway/backfill/`restart=0` vérifiés indépendamment de l'heure) — seule la précision de l'horodatage est corrigée, sans réécriture des rapports déjà mergés (interdiction CLAUDE.md), via `docs/cgpa/09-production/plan-etape-hypercare-v1.12.0.md` qui fait désormais foi pour cette référence temporelle. **Checkpoint T0 (2026-07-19 ~11:27 UTC, vérifié `date -u`) : PASS** — 8/8 actifs, 4/4 healthy, restart=0, tag/digests conformes, Flyway 26/26, backfill V26 8/8 confirmé stable, `bailleur-test` désactivé, `directAccessGrantsEnabled=false`, `/healthz` 200, site public 200, Prometheus 5/5, Alertmanager 0 alerte, pool Hikari 0 en attente, 0 5xx/0 erreur API (15 min), capacité saine (30 Gio disque, ~1,9 Gio mémoire, charge 0,33/0,13/0,10). **Prochaine étape : checkpoint T+12 (~2026-07-19 22:51 UTC ± 30 min).** |
| 2026-07-19 | **Cadrage EP-16 « Notifications multicanales via Twilio » — Proposé, documentaire uniquement, kickoff K1→K8 ouvert** | Instruction PO du 2026-07-19 (« formaliser EP-16 notifications multicanales Twilio, sans n8n ») | jptshilombo@gmail.com | Mission de reprise/cadrage/architecture/analyse d'impact/backlog/Plan d'Exécution — **aucun codage, aucune dépendance Twilio, aucune migration, aucun déploiement**. **Collision de numérotation détectée et corrigée** : le prompt de mission suggérait de repartir à US-115, mais une vérification exhaustive montre que **US-115→118 sont déjà occupées par EP-13** (Fin de bail, epic distinct déjà en Production `1.11.0`/`1.12.0`) — repris à **US-119→126** sans collision réelle vérifiée. EP-16/ADR-18/D-NOTIF-001 confirmés libres (dernier EP existant : EP-15 ; dernier ADR : ADR-17). Trois explorations factuelles du code (backend alertes/audit/transactions, schéma Flyway/RLS, config/frontend) ont précédé toute décision — constat clé : **aucune alerte n'est aujourd'hui créée de façon synchrone dans une transaction métier** (`generer_alertes()` batch uniquement ; seul `audit_log` l'est, via `AuditService.enregistrer(...)` dans la transaction métier appelante), ce qui impose une architecture Outbox à **deux voies d'alimentation** (batch étendu pour `LOYER_EN_RETARD`/`FIN_BAIL`/`PREAVIS`/`GARANTIE_NON_RESTITUEE` ; écriture inline intra-transaction, patron `audit_log`, pour `QUITTANCE_DISPONIBLE`/`GARANTIE_DEBITEE`/`PAIEMENT_RECU`) plutôt qu'un point d'entrée générique unique. **Décision D-NOTIF-001 proposée** : Twilio en fournisseur direct sans n8n, encapsulé derrière `NotificationProvider`/`TwilioNotificationProvider`, Outbox transactionnelle idempotente (`event_id+recipient_id+notification_type+channel`), modèle Option B confirmé (5 tables : `NotificationPreference`/`Event`/`Outbox`/`Delivery`/`Template`, RLS `bailleur_isolation` standard sur les 4 premières, référentiel global sans RLS pour la dernière, ledger append-only patron `garantie_movement` pour `Delivery`), réutilisation sans modification du lien HMAC des quittances (EP-14) pour l'avis WhatsApp. Livrables produits : `ADR-18-notifications-multicanales-twilio.md` (Proposée), addenda EB/CDC (`addendum-notifications-multicanales.md` ×2 — **divergence de convention documentée** : le prompt suggérait un document racine unique, repris sous la convention réelle du dépôt EB+CDC séparés — BF-106→111/EF-113→124/RM-114→123/ENF-94→97), `addendum-backlog-ep16-notifications.md` (US-119→126, 71 points, 3 sprints proposés), `analyse-impact-ep16-notifications.md`, `plan-execution-ep16-notifications.md` (proposé, non approuvé, 3 sprints N/N+1/N+2 — fondation, WhatsApp P0 en Sandbox, SMS fallback+UX+observabilité). **`.env.example` non modifié** (aucune convention CGPA identifiée exigeant de documenter des variables avant implémentation réelle — précédent `QUITTANCE_HMAC_SECRET` ajouté seulement à l'implémentation d'EP-14). Branche documentaire dédiée `docs/ep16-notifications-twilio`, PR distincte à ouvrir, **non mergée automatiquement**. **Prochaine étape : validation explicite du PO sur les arbitrages K1→K8 et sur le Plan d'Exécution EP-16 ; aucun Sprint ne démarre avant ce GO.** |
| 2026-07-19 | **Kickoff EP-16 clos — K1→K8 tranchés par le PO** | Instruction PO du 2026-07-19 (« tranche K1 à K8 ») | jptshilombo@gmail.com | Quatre points disposaient d'une recommandation par défaut dans `plan-execution-ep16-notifications.md` — **toutes adoptées sans modification** : **K1** (destinataires — locataire pour quittance/garantie/retard, bailleur+gestionnaire pour le suivi opérationnel), **K2** (canal principal — IN_APP obligatoire, WHATSAPP principal, SMS secours), **K5** (pas de fallback SMS automatique au premier pilote), **K8** (socle désactivé → Staging → activation progressive post-P0). Les quatre autres points **n'avaient aucune recommandation par défaut** documentée (le Plan renvoyait explicitement à un arbitrage PO sans proposition) — soumis séparément au PO par choix explicite, qui a tranché : **K3** (consentement — formulaire natif LoyerTracker, opt-in explicite ; preuve externe bailleur/invitation/OTP écartées), **K4** (stratégie de numéro — réutilisation d'un numéro existant, aucun numéro Twilio dédié provisionné par défaut), **K6** (historique visible — bailleur sur tout son périmètre, gestionnaire limité à son propre périmètre affecté), **K7** (rétention des métadonnées de livraison — alignement strict sur l'audit métier existant, sans durée fixe distincte). Mis à jour en conséquence : `ADR-18-notifications-multicanales-twilio.md` (statut « kickoff clos », section Décisions K1→K8 détaillée, RSV-EP16-04 requalifié « Accepté par le PO », sections Consentement/Impacts sécurité alignées), `plan-execution-ep16-notifications.md` (table d'arbitrages requalifiée « Tranché », checklist, dépendances de sprint, gouvernance transverse). **Aucun code, aucune migration, aucun déploiement produits par ce tranchage.** **Seul un GO explicite du PO sur `plan-execution-ep16-notifications.md` reste requis avant tout démarrage du Sprint N** — distinct de ce tranchage, comme pour EP-13/EP-15 (règle CGPA explicite : ne jamais confondre tranchage de kickoff et autorisation de Sprint). |
| 2026-07-19 | **GO explicite du PO — Plan d'Exécution EP-16 : Sprint N (Fondation) autorisé à démarrer** | Instruction PO du 2026-07-19 (« GO explicite sur le Plan d'Exécution EP-16 ») | jptshilombo@gmail.com | Le PO approuve explicitement `plan-execution-ep16-notifications.md`, après kickoff K1→K8 clos le même jour. `ADR-18-notifications-multicanales-twilio.md` requalifiée **Acceptée** ; `plan-execution-ep16-notifications.md` requalifié **Approuvé**, checklist CGPA cochée hors Gate Staging/Production du Sprint N (à venir). **Ce GO n'autorise que le Sprint N — Fondation** (US-119/120/121 : modèle de données, migration additive **V27**, Outbox transactionnelle, abstraction `NotificationProvider`/`NoopNotificationProvider` sandbox uniquement, feature flags `false` par défaut), dans les bornes déjà fixées par le Plan et par ADR-18 : aucune dépendance Twilio, aucun compte/credentials/template Twilio, aucun envoi SMS/WhatsApp réel, aucune modification Docker/infrastructure — tout cela reste hors périmètre du Sprint N. **Les Sprints N+1 (WhatsApp P0, Sandbox Twilio) et N+2 (SMS fallback/UX/observabilité) restent chacun soumis à un GO distinct**, après clôture du Gate Staging (dont `STG-ISOL-01`) et d'une décision Gate Production propres au sprint précédent — même principe de séquencement que les Sprints A/B/C d'EP-15. **Aucun code, aucune migration produits par ce GO lui-même** — il autorise le démarrage du codage du Sprint N. **Prochaine étape : coder le Sprint N (migration V27, entités `NotificationPreference`/`Event`/`Outbox`/`Delivery`/`Template`, `NotificationProvider`/`NoopNotificationProvider`, extension de `generer_alertes()`, écriture inline dans `QuittanceCertifieeService`/`GarantieService`/`PaiementService`/`BailService`, tests RLS/idempotence/concurrence Outbox).** |
| 2026-07-19 | **Sprint N (Fondation) codé — `mvn verify` vert, aucun déploiement** | Instruction PO du 2026-07-19 (« code le Sprint N »), conformément au GO reçu le même jour | jptshilombo@gmail.com | Livré, strictement dans les bornes du Sprint N : migration additive **V27** (`notification_preference`/`event`/`outbox`/`delivery`/`template`, RLS `bailleur_isolation` sur les quatre premières — `notification_outbox` porte son propre `bailleur_id`, ajustement du schéma esquissé par l'ADR pour respecter cette RLS — `notification_template` référentiel global sans RLS, patron `type_bien`) ; extension de `generer_alertes()` (voie A, fan-out Outbox limité au bailleur — même destinataire que l'alerte in-app existante, aucune fonction de fan-out gestionnaire/locataire à ce niveau) ; écriture inline voie B dans `QuittanceCertifieeService.emettre` (`QUITTANCE_DISPONIBLE`), `GarantieService.retenirSurLoyer` (`GARANTIE_DEBITEE`), `PaiementService.pointer` (`PAIEMENT_RECU`, uniquement statut `RECU`), `BailService.creer`/`cloturer` (`BAIL_CREE`/`BAIL_CLOS`) — même patron que `AuditService.enregistrer`, jamais d'appel réseau dans la transaction métier ; `NotificationOutboxService` (fan-out par préférence éligible, réclamation par lot `FOR UPDATE SKIP LOCKED`) ; `NotificationPreferenceService` (US-119, aucune interface HTTP en Sprint N — différée à l'US-125/Sprint N+2) ; `NotificationProvider`/`NoopNotificationProvider` (US-121, seul fournisseur disponible) ; feature flags `app.notifications.*` (`NOTIFICATIONS_EXTERNAL_ENABLED`/`TWILIO_WHATSAPP_ENABLED`/`TWILIO_SMS_ENABLED`/`NOTIFICATION_DRY_RUN`, tous à `false`/`true` par défaut, non encore consommés par du code applicatif — Sprint N+1). Tests : `NotificationFondationIntegrationTest` (nouveau — consentement K3 requis pour tout fan-out externe, voie A et voie B, idempotence par contrainte unique, rollback métier ⇒ aucune ligne `notification_event`/`outbox` persistée, concurrence de réclamation par lot sans doublon ni perte, démarrage sûr sans configuration Twilio) ; extension de `SchemaMigrationTest` (RLS ENABLE+FORCE sur les 4 tables scopées, `notification_template` confirmée sans RLS, cloisonnement cross-tenant de `notification_preference`) ; `SecurityIntegrationTest` corrigé (les deux nouveaux services neutralisés en `@MockitoBean`, même patron que tout service dépendant de JPA déjà présent dans ce test de contrat sans BDD). **Non-régression vérifiée** : compteur `alertesCreees` de `generer_alertes()` inchangé (`total` ne compte que les lignes `alerte`, jamais les CTE `notification_event`/`outbox`) — `S04AlertesAuditIntegrationTest` toujours vert ; `BailClotureIntegrationTest`/`BailClotureReouvertureTest`/`QuittanceCertifieeIntegrationTest`/`PublicQuittanceIntegrationTest`/S02/S03/S04 tous verts. Compteurs Flyway alignés dans le même commit que la migration (`SchemaMigrationTest` → 27, `infra/smoke/smoke-stack.sh` → 27 — leçon PR #77/#171/#227). **`mvn verify` : 198/198 tests, 0 échec, 0 erreur, Spotless propre, couverture Jacoco conforme, BUILD SUCCESS.** **Aucun envoi réel, aucune dépendance Twilio, aucun compte/credentials/template Twilio, aucune modification Docker/infrastructure, aucun déploiement.** Code déplacé, avant tout commit, de la branche documentaire `docs/ep16-notifications-twilio` (kickoff+GO, PR distincte) vers une branche dédiée **`feat/sprint-n-ep16-notifications-fondation`**, même découpage « un sujet = une PR » que le précédent EP-13 (PR #226 documentaire mergée séparément avant `feat/sprint-ep13-fin-de-bail`). **Prochaine étape : ouverture de la PR de code (distincte de la PR documentaire), puis instruction du Gate Staging du Sprint N (dont `STG-ISOL-01`) avant toute décision Gate Production.** |
| 2026-07-19 | **PR #235 EP-16 Sprint N fusionnée et documentation régularisée additivement** | Instruction PO du 2026-07-19 (« régulariser les petits écarts documentaires »), après fusion de la PR #235 | jptshilombo@gmail.com | **PR #235 fusionnée sur `main` le 2026-07-19T14:22:50Z** (merge commit `3ed6d3f`) après correction des deux violations SonarQube, synchronisation avec `main` et CI complète verte. Régularisation sans réécriture de l’historique : backlog EP-16 requalifié « approuvé et en cours d’exécution », K1→K8 marqués tranchés, Plan d’Exécution requalifié « approuvé », état du Sprint N et séquencement N+1/N+2 alignés. `.env.example` documente uniquement les quatre feature flags non secrets du socle, avec valeurs sûres par défaut ; **aucun credential ni token Twilio lu, copié, affiché ou versionné**. Sprint N reste sans déploiement : prochaine étape inchangée, Gate Staging dont `STG-ISOL-01`, puis décision Gate Production distincte. |

| 2026-07-19 | **Gate Staging EP-16 Sprint N — GO, `STAGING_DEPLOYED`** | Instruction PO : « une fois que le merge de la PR #236 est au vert, tu as le GO pour le staging » | jptshilombo@gmail.com | Condition satisfaite sur `main` `e4744d9` : CI `29691777913` et CodeQL `29691777896` SUCCESS, images `sha-e4744d92` publiées. Backup pré-déploiement vérifié (511266 octets, 799 entrées). **STG-ISOL-01 PASS avant/après** sur l’hôte mutualisé : 9 conteneurs projet+NPM intacts, restart=0, réseau/volumes/ports inchangés, seuls `api`/`nginx` recréés, aucune commande Docker globale. Flyway **V27 27/27** ; RLS ENABLE+FORCE sur les quatre tables tenant-scopées, référentiel template global sans RLS. Smoke **63 PASS/0 FAIL**. Preuve fonctionnelle EP-16 : 24 événements persistés, **0 préférence, 0 Outbox, 0 Delivery, 0 référence Twilio** — aucun envoi externe sans consentement, flags sûrs par défaut. Prometheus 5/5, seule alerte historique `BackupHeartbeatMissing`, 0 erreur API/5xx. Décision CDO : **GO — `STAGING_DEPLOYED`**. Décision : `docs/cgpa/07-devsecops/gate-staging-sprint-n-ep16-decision.md`. **Aucune Production autorisée ; Gate Production distinct requis. Sprints N+1/N+2 toujours non autorisés sans leur GO explicite.** |
| 2026-07-19 | **PR #237 fusionnée puis Gate Production EP-16 Sprint N — GO sous réserve, `PRODUCTION_READY`** | Instruction PO : « une fois que la PR #237 est au vert, faire le merge et ensuite passer au GO Production » | jptshilombo@gmail.com | **PR #237 fusionnée le 2026-07-19T16:42:40Z**, merge `cc2fd06`, après CI PR entièrement verte. CI post-fusion `main` `29695395488` et CodeQL `29695395451` SUCCESS. Le delta `e4744d9..cc2fd06` est exclusivement documentaire : candidat applicatif Staging figé `sha-e4744d92`, digests API `9e9a331d…`/Web `c797934a…`. Checklist Gate Production PASS : `STAGING_DEPLOYED`, **STG-ISOL-01 PASS**, Flyway 27/27, V27 additive, smoke 63/0, 24 événements et 0 préférence/Outbox/Delivery/Twilio, SonarQube/sécurité/CodeQL verts, rollback applicatif viable vers Production actuelle `1.12.0` (`sha-359f4d63`). Version `1.13.0` MINOR proposée et `[Non publié]` complété. **Réserve bloquante avant Préflight : `1.12.0` est encore en hypercare (T0 PASS ; T+12/T+24 et clôture CDO à venir).** Décision CDO : **GO sous réserve — `PRODUCTION_READY` atteint**. Le Gate autorise uniquement un Préflight après clôture de `1.12.0` ; aucun déploiement ni mutation Production exécuté, `PRODUCTION_DEPLOYED` non atteint. L'activation externe reste interdite jusqu'au GO du Sprint N+2 ; N+1/N+2 restent sans GO. Décision : `docs/cgpa/09-production/gate-production-sprint-n-ep16-decision.md`. |
| 2026-07-22 | **Checkpoint hypercare `1.12.0` T+12/T+24 (rattrapage combiné) — PASS sous surveillance, puis clôture Release `1.12.0` — CDO GO** | Instruction PO du 2026-07-22 : exécuter le checkpoint hypercare `1.12.0` en retard | jptshilombo@gmail.com | Hôte `loyertracker-prod-server` volontairement éteint entre les opérations (produit non annoncé, aucun trafic réel — pattern `1.7.0`→`1.9.0`, à la différence de `1.10.0` où l'hôte était resté allumé) : les fenêtres cibles T+12 (2026-07-19 ~22:51 UTC) et T+24 (2026-07-20 ~10:51 UTC) sont tombées hôte éteint. Contrôle live exécuté le 2026-07-22 ~18:06 UTC (instance EC2 redémarrée peu avant, `LaunchTime` `2026-07-22T16:57:41Z`, `uptime` 8 min) : 8/8 actifs 4/4 healthy `RestartCount=0` depuis ce redémarrage, tag/digests `sha-359f4d63` inchangés, Flyway 26/26, backfill V26 8/8 sans orphelin (colonnes legacy toujours absentes), `bailleur-test`/`directAccessGrants` toujours désactivés, `/healthz`/site public 200, Prometheus 5/5, Alertmanager 0 alerte, Hikari pending 0, 0 5xx, 0 `ERROR`. **Verdict : PASS sous surveillance** — écart de fenêtre (~3 jours sans télémétrie continue) qualifié sans impact, à l'identique de la clôture `1.9.0`. RSV-EP15-01/02/04 non bloquantes ; RSV-EP15-03 mitigée (second backup post-V26 déjà vérifié) ; `RSV-STG-01` (héritée) maintenue, sans rapport avec `1.12.0`. **Décision CDO : GO — RELEASE `1.12.0` CLÔTURÉE.** Détail : `docs/cgpa/09-production/plan-etape-hypercare-v1.12.0.md`, `docs/cgpa/09-production/cloture-release-v1.12.0.md`. **Cette clôture lève la réserve bloquante du Gate Production EP-16 Sprint N (`gate-production-sprint-n-ep16-decision.md`). Prochaine étape CGPA : instruction explicite distincte pour le Préflight Production `1.13.0` — aucun déploiement ni mutation Production autorisé par cette clôture elle-même.** |
| 2026-07-22 | **Préflight Production `1.13.0` (EP-16 Sprint N) — PASS** | Instruction PO du 2026-07-22 : « lance le préflight production 1.13.0 » | jptshilombo@gmail.com | RSV-PROD-EP16-N-01 levée (clôture `1.12.0` du même jour). Contrôles lecture seule sur `loyertracker-prod-server` : 8/8 actifs 4/4 healthy `RestartCount=0`, tag `sha-359f4d63` inchangé, Flyway 26/26 (V27 pas encore appliquée), `bailleur-test`/`directAccessGrants` toujours désactivés, `/healthz`/site public 200, Prometheus 5/5, 0 5xx, 0 `ERROR` ; baseline 3 bailleurs/2 patrimoines/8 biens/8 baux/8 garanties/1 gestionnaire/8 locataires/7 quittances. Alertmanager 1 alerte `BackupHeartbeatMissing` constatée puis **résolue par ce Préflight lui-même** (le backup ci-dessous pousse un heartbeat réussi). **Backup vérifié** avant migration : `loyertracker-20260722-190032.dump` (827770 octets, SHA-256 `808fbb16…`) + globals, `pg_restore --list` 799 entrées. Migration **V27 additive** (cinq tables `notification_*`) : contrairement à V26/`1.12.0`, rollback applicatif seul reste viable même après application — aucun second backup post-migration requis. Candidat `sha-e4744d92` confirmé (digests Staging API `9e9a331d…`/Web `c797934a…`), rollback `sha-359f4d63` déjà présent localement. **Flags externes (`NOTIFICATIONS_EXTERNAL_ENABLED`/`TWILIO_WHATSAPP_ENABLED`/`TWILIO_SMS_ENABLED`/`NOTIFICATION_DRY_RUN`) confirmés à valeurs sûres par défaut dans `application.yml`, aucune dépendance Twilio réelle** (condition 6 du Gate). `.env.bak-pre-1.13.0` créé, `.env` hôte inchangé, aucun nouveau secret requis. `CHANGELOG.md` promu `[1.13.0] — 2026-07-22`. Aucun déploiement ni mutation exécuté. Détail : `docs/cgpa/09-production/preflight-backup-v1.13.0-report.md`. **`PRODUCTION_DEPLOYED` non atteint — prochaine étape CGPA : instruction explicite distincte pour le déploiement technique (`api`+`nginx`, migration V27) et la validation finale `1.13.0`.** |
| 2026-07-22 | **Déploiement technique Production `1.13.0` (EP-16 Sprint N) — PASS technique** | Instruction PO du 2026-07-22 : « lance le déploiement technique 1.13.0 » | jptshilombo@gmail.com | Dépôt hôte avancé par fast-forward `c14cdc2`→`5d59b5f` (aucun écart sur `docker-compose.yml`/`docker-compose.prod.yml`). Images candidates tirées, digests confirmés identiques au Gate/Préflight avant bascule (API `sha256:9e9a331d…`, Web `sha256:c797934a…`). `.env` basculé sur `LOYERTRACKER_TAG=sha-e4744d92` ; `api`+`nginx` seuls recréés (`--no-deps`), avertissement « conteneurs orphelins » (overlay monitoring) attendu et ignoré comme à chaque déploiement ; PostgreSQL/Keycloak/monitoring non redémarrés (`RestartCount=0` inchangé). **Flyway V27 appliquée, 27/27** : cinq tables `notification_preference`/`notification_event`/`notification_outbox`/`notification_delivery`/`notification_template`, RLS `ENABLE`+`FORCE` confirmée sur les quatre tables tenant-scopées (le référentiel `notification_template` reste sans RLS, conforme au design) ; tous les compteurs à 0 (aucune activité applicative depuis le redéploiement). Contrôles finaux : 8/8 actifs 4/4 healthy `RestartCount=0` (api/nginx repartis à 0), `/healthz`/site public 200, Prometheus 5/5, Alertmanager 0 alerte (le `BackupHeartbeatMissing` du Préflight a disparu), 0 5xx, 0 `ERROR`, `bailleur-test` toujours désactivé. Rollback `sha-359f4d63` viable même après V27 (additive), sans restauration de backup nécessaire. Détail : `docs/cgpa/09-production/deploiement-technique-v1.13.0-report.md`, `docs/prod-state.md` §0N. **`PRODUCTION_DEPLOYED` non atteint — la validation finale (smoke Production, réactivation temporaire autorisée de `bailleur-test`/`directAccessGrants`) reste une étape distincte nécessitant une autorisation PO explicite dédiée, comme à chaque release précédente. L'activation de canaux externes (WhatsApp/SMS) reste interdite jusqu'au GO du Sprint N+2 (K8, ADR-18).** |
| 2026-07-23 | **Validation finale `1.13.0` (EP-16 Sprint N) — PASS, `PRODUCTION_DEPLOYED` atteint** | Instruction PO du 2026-07-23 : « vas-y avec la validation finale » | jptshilombo@gmail.com | **Anomalie constatée au contrôle d'entrée, corrigée avant smoke** : `bailleur-test@test.local` trouvé `enabled=true` (attendu `false`), probable réimport de realm au redémarrage complet de l'hôte du 2026-07-23 ~15:45 UTC (`RestartCount=0` sur les 4 services applicatifs) — pattern gotcha déjà documenté ; `directAccessGrantsEnabled` restait `false`. Sans rapport avec V27. Contrôle d'entrée sinon conforme : Flyway 27/27, digests exacts, Prometheus 5/5, Alertmanager 0 alerte, healthz/public 200, baseline 3 bailleurs/2 patrimoines/8 biens/8 baux/8 garanties/1 gestionnaire/8 locataires/7 quittances. Smoke Production (`BASE=https://localhost:18443`, `COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml`) : **63 PASS / 0 FAIL au premier passage**, identique à `1.12.0` ; 0 scénario notifications exercé (hors périmètre Sprint N), tables `notification_*` toujours à 0 ligne après. **Nettoyage transactionnel complet** (RUN_ID `1784823157` : 4 audit log, 10 honoraires, 10 paiements, 6 alertes, 1 invitation, 1 affectation, 1 bail, 1 bien, 1 locataire, 2 patrimoines, 1 gestionnaire, 1 bailleur — supprimés en une transaction unique, 0 résidu vérifié), 2 comptes Keycloak smoke supprimés, `bailleur-test` redésactivé, `directAccessGrantsEnabled=false` confirmé. Baseline métier restaurée à l'identique de l'état pré-test. **Alerte `BackupHeartbeatMissing` réapparue** après le redémarrage complet du 2026-07-23 (cron 02h15 manqué, hôte éteint à cette heure) — non bloquante, sans rapport avec `1.13.0`, arbitrage PO à venir sur la fréquence du cron vs. le pattern hôte-éteint. Services 8/8 actifs 4/4 healthy `RestartCount=0`, 0 5xx, site public 200. Rapport : `docs/cgpa/09-production/validation-finale-v1.13.0-report.md`, `docs/prod-state.md` §0N. **Décision CDO : `PRODUCTION_DEPLOYED` atteint le 2026-07-23 ~16:13 UTC pour la release `1.13.0` (`sha-e4744d92`, EP-16 Sprint N).** `NotificationProvider` en service reste exclusivement `NoopNotificationProvider`, aucun canal externe activé. **Prochaine étape : hypercare (T0/T+12/T+24), puis clôture CDO de la release.** |
| 2026-07-23 | **Hypercare `1.13.0` (EP-16 Sprint N) — Checkpoint T0 PASS** | Instruction PO du 2026-07-23 : « instruis l'hypercare 1.13.0 » | jptshilombo@gmail.com | **Résidu de nettoyage de la validation finale détecté et corrigé au T0** : 8 lignes `notification_event` (RUN_ID `1784823157`, horodatées `16:12:46`–`16:12:48`, référençant `bailleur-test`/le bail smoke déjà supprimé) — la table `notification_event`, nouvelle avec V27 et alimentée en écriture inline par les mêmes opérations que celles exercées par le smoke, n'avait pas été incluse dans le contrôle post-nettoyage de la validation finale (seules `notification_preference`/`notification_outbox` avaient été revérifiées). Supprimées en transaction dédiée après vérification qu'aucune ligne Outbox/Delivery n'en dépendait ; `notification_event` confirmée à 0 ligne. **Sans impact fonctionnel** (`NotificationProvider` = `NoopNotificationProvider`, aucun canal externe actif). **Checkpoint T0 (2026-07-23 ~16:37 UTC, `date -u` vérifié) : PASS** — 8/8 actifs 4/4 healthy `RestartCount=0`, tag/digests `sha-e4744d92` inchangés, Flyway 27/27, tables `notification_*` toutes à 0 après correction, `bailleur-test`/`directAccessGrants` toujours désactivés, `/healthz`/site public 200, Prometheus 5/5, Hikari pending 0, 0 5xx/0 `ERROR` (15 min), capacité saine (30 Gio disque, ~2,0 Gio mémoire, charge 0,23/0,10/0,07). Alerte `BackupHeartbeatMissing` toujours active (non bloquante, inchangée depuis la validation finale). Détail : `docs/cgpa/09-production/plan-etape-hypercare-v1.13.0.md`, `docs/prod-state.md` §0N. **Prochains checkpoints cibles : T+12 le 2026-07-24 ~04:13 UTC, T+24 le 2026-07-24 ~16:13 UTC — probablement en rattrapage vu le pattern hôte-éteint (produit non annoncé), sur instruction PO explicite distincte. Aucune clôture de release autorisée avant ces deux checkpoints et la décision CDO finale.** |
| 2026-07-24 | **Hypercare `1.13.0` (EP-16 Sprint N) — Checkpoint T+12 PASS (rattrapage)** | Instruction PO du 2026-07-24 : « vas-y pour l'hypercare » | jptshilombo@gmail.com | Hôte `loyertracker-prod-server` redémarré peu avant le contrôle (pattern hôte-éteint habituel, `StartedAt=2026-07-24T09:02:10Z` sur les 4 services applicatifs, `uptime` 17 min) : cible T+12 (~04:13 UTC) déjà dépassée d'environ 5h05 au moment du contrôle (~09:19 UTC), exécutée en rattrapage — la cible T+24 (~16:13 UTC) n'étant pas encore atteinte, ce checkpoint ne couvre que **T+12**, pas T+24. Contrôle live (`date -u` vérifié 09:19:24 UTC) : **8/8 conteneurs actifs, 4/4 healthy, `RestartCount=0`** sur les 4 services applicatifs ; tag `sha-e4744d92` inchangé, digests API `sha256:9e9a331d…`/Web `sha256:c797934a…` identiques au déploiement ; Flyway **27/27** ; les cinq tables `notification_*` toutes à **0 ligne** (aucun résidu cette fois, contrairement au T0) ; Keycloak `bailleur-test` `enabled=false`, `loyertracker-spa` `directAccessGrantsEnabled=false` ; `/healthz` et site public `200` ; Prometheus **5/5** cibles `up` ; Alertmanager **0 alerte active** (`BackupHeartbeatMissing` du T0 a disparu) ; `hikaricp_connections_pending=0` ; 0 `ERROR` API et 0 5xx Nginx sur les 15 dernières minutes ; capacité saine (disque 30 Gio libres/22 %, mémoire ~1,3 Gio libre/2,1 Gio disponible, charge 0,01/0,03/0,08) ; flags `NOTIFICATIONS_EXTERNAL_ENABLED`/`TWILIO_WHATSAPP_ENABLED`/`TWILIO_SMS_ENABLED`/`NOTIFICATION_DRY_RUN` absents de `.env`/de l'environnement du conteneur `api` ⇒ valeurs sûres par défaut de `application.yml` toujours actives, aucune dépendance Twilio. **Aucun critère de suspension observé.** Détail : `docs/cgpa/09-production/plan-etape-hypercare-v1.13.0.md`. **T+24 reste en attente (cible ~16:13 UTC, non encore atteinte) — instruction PO explicite distincte requise après cette heure, avant toute clôture CDO de `1.13.0` et tout GO Sprint N+1.** |
| 2026-07-24 | **Hypercare `1.13.0` (EP-16 Sprint N) — Checkpoint T+24 PASS (dérogation PO explicite, fenêtre raccourcie ~T+17) — hypercare complète** | Instruction PO du 2026-07-24 : « fait le T+24 maintenant et on avance », confirmée après qu'un écart chiffré (~T+17 réel vs cible T+24, ~6h45 restantes) lui a été présenté explicitement (« exécuter maintenant, l'accepter comme T+24 par dérogation PO explicite ») | jptshilombo@gmail.com | **Écart de fenêtre assumé et tracé, pas subi** : contrôle exécuté ~09:26 UTC, seulement ~17h08 après `PRODUCTION_DEPLOYED` (2026-07-23 ~16:13 UTC), avant la cible nominale T+24 (~16:13 UTC). Sur double confirmation explicite du PO, ce contrôle est retenu comme équivalent au checkpoint T+24 — même esprit que les écarts de fenêtre déjà qualifiés pour `1.9.0`/`1.12.0` (tardifs, subis) mais ici précoce et délibéré. Résultats (`date -u` vérifié 09:26:52 UTC) : **8/8 actifs 4/4 healthy `RestartCount=0`** (inchangé depuis T+12), tag/digests `sha-e4744d92` conformes, Flyway 27/27, tables `notification_*` toutes à 0, `bailleur-test`/`directAccessGrantsEnabled` désactivés, `/healthz`/site public 200, Prometheus 5/5, Alertmanager 0 alerte, Hikari pending 0, 0 5xx/0 `ERROR` (15 min), capacité saine. **Aucun critère de suspension sur les trois checkpoints (T0/T+12/T+24).** **Hypercare `1.13.0` complète.** Détail : `docs/cgpa/09-production/plan-etape-hypercare-v1.13.0.md`. **Prochaine étape CGPA : instruction explicite distincte pour la clôture CDO de la release `1.13.0`** — préalable obligatoire avant tout GO Sprint N+1 (EP-16). |
| 2026-07-24 | **Clôture Release `1.13.0` (EP-16 Sprint N) — CDO GO** | Instruction PO du 2026-07-24 (« on avance »), après hypercare `1.13.0` intégralement PASS (T0/T+12/T+24) | jptshilombo@gmail.com | Récapitulatif du cycle complet vérifié sans écart (Sprint N codé → PR #235/#237 → Gate Staging/Production Sprint N → clôture `1.12.0` levant la réserve bloquante → Préflight → déploiement technique → validation finale → hypercare). État de Production reconfirmé live au moment de la clôture : 8/8 actifs 4/4 healthy `RestartCount=0`, tag/digests `sha-e4744d92` inchangés, Flyway 27/27, les cinq tables `notification_*` toutes à 0 ligne, Prometheus 5/5, Alertmanager 0 alerte, Hikari pending 0, 0 5xx, `bailleur-test` désactivé, site public 200. Migration V27 additive : rollback applicatif seul reste viable même après application, aucun second backup requis (contrairement à V26/`1.12.0`). Réserve bloquante du Gate Production Sprint N déjà levée le 2026-07-22 ; écart de fenêtre T+24 (~T+17) assumé et tracé par dérogation PO explicite, sans impact ; alerte `BackupHeartbeatMissing` résolue dès le T+12 ; `RSV-STG-01` (héritée) maintenue, sans rapport avec `1.13.0`. **Décision CDO : GO — RELEASE `1.13.0` CLÔTURÉE.** Détail : `docs/cgpa/09-production/cloture-release-v1.13.0.md`. **Cette clôture satisfait le prérequis « Sprint N clos en GO » posé par `plan-execution-ep16-notifications.md` comme condition de démarrage du Sprint N+1. Prochaine étape CGPA : instruction explicite et distincte du PO pour le GO du Sprint N+1 (WhatsApp P0, Twilio Sandbox) — ce GO reste séparé de celui déjà donné pour le Sprint N, comme pour les Sprints A/B/C d'EP-15.** |
| 2026-07-24 | **GO explicite du PO — Plan d'Exécution EP-16 : Sprint N+1 (WhatsApp P0) autorisé à démarrer** | Instruction PO du 2026-07-24 (« GO explicite pour le Sprint N+1 »), après clôture CDO de la release `1.13.0` (Sprint N) le même jour | jptshilombo@gmail.com | Le PO confirme explicitement le démarrage du **Sprint N+1 — WhatsApp P0** (US-122/123), conformément à `plan-execution-ep16-notifications.md` déjà rédigé et approuvé dans sa portée détaillée pour ce sprint. Ce GO est **distinct** de celui donné le 2026-07-19 pour le Sprint N (règle CGPA explicite déjà appliquée aux Sprints A/B/C d'EP-15 : jamais confondre le GO d'un sprint avec celui du suivant). `plan-execution-ep16-notifications.md` mis à jour (statut, checklist cochée). **Bornes du Sprint N+1 rappelées** : `TwilioNotificationProvider` (implémentation réelle de `NotificationProvider`, credentials Sandbox lus via variables d'environnement, placeholders `CHANGE_ME` uniquement dans `.env.example`), entités JPA manquantes `NotificationDelivery`/`NotificationTemplate` (tables V27 déjà en base, statuts déjà définis), `NotificationDispatcher` (consommateur du lot réclamé par `NotificationOutboxService.reclamerLot`), endpoint callback public Twilio + vérification de signature (patron `PublicQuittanceController`), rate-limit Nginx dédié. **Hors périmètre** : tout envoi vers un numéro Twilio de Production, tout fallback SMS (US-124, Sprint N+2), toute activation Production réelle. Compte Twilio Sandbox : fourni séparément par le PO (jamais versionné). **Aucun code ni migration produits par ce GO lui-même** — il autorise le démarrage du codage. **Prochaine étape : coder le Sprint N+1 sur une branche dédiée (`feat/sprint-n1-ep16-notifications-whatsapp`), puis instruire le Gate Staging du Sprint N+1 (dont `STG-ISOL-01`) avant toute décision Gate Production.** |
| 2026-07-24 | **Sprint N+1 (WhatsApp P0) codé et fusionné — PR #252 mergée, `mvn verify` vert** | Instruction PO du 2026-07-24 (« code le Sprint N+1 »), conformément au GO reçu le même jour, puis « relance la CI » / « fusionne si c'est vert » après revue d'un Security Hotspot Sonar | jptshilombo@gmail.com | Livré, strictement dans les bornes du Sprint N+1 : migration additive **V28** (seed des trois templates P0 WhatsApp `QUITTANCE_DISPONIBLE`/`LOYER_EN_RETARD`/`GARANTIE_DEBITEE`, deux fonctions `SECURITY DEFINER` `notification_bailleurs_en_attente()`/`notification_delivery_appliquer_statut()`, même patron que `lire_quittance_publique`/`journaliser_evenement_quittance` V22) ; entités JPA `NotificationDelivery`/`NotificationTemplate` (tables V27 déjà en base) ; `TwilioNotificationProvider` (implémentation réelle de `NotificationProvider`, WhatsApp uniquement, appel direct de l'API REST Messages Twilio via `RestClient` — pas le SDK officiel, inutile pour ce seul besoin ; actif uniquement si `TWILIO_WHATSAPP_ENABLED=true`, `@ConditionalOnProperty` en exclusion mutuelle avec `NoopNotificationProvider` désormais également conditionnel) ; `NotificationDispatcher` (traite l'Outbox par bailleur via `notification_bailleurs_en_attente()` puis `NotificationOutboxService.reclamerLot` déjà en place, résout préférence/template, invoque le fournisseur actif, `DEAD` immédiat si préférence inéligible/introuvable ou template non approuvé, backoff exponentiel puis `DEAD` au-delà de 5 tentatives) ; callback de statut Twilio public (`POST /api/public/notifications/callback`, signature `X-Twilio-Signature` HMAC-SHA1 vérifiée contre l'URL configurée avant tout traitement, application idempotente via `notification_delivery_appliquer_statut()`) ; déclenchement par sondage périodique (`NotificationDispatchScheduler`) et manuel (`POST /api/batch/notifications`). Endpoint public déjà couvert par le rate-limit Nginx existant du préfixe `/api/public/`. Crédentials Twilio en placeholders `CHANGE_ME` uniquement (`.env.example`, `docker-compose.yml`/`docker-compose.staging.yml`), jamais de valeur réelle. Tests : nouveau `NotificationDispatchIntegrationTest` (6 tests — envoi accepté crée une livraison et marque la ligne traitée, template non approuvé ⇒ `DEAD` sans envoi, échec transitoire ⇒ `RETRY` puis `DEAD` au-delà du plafond, callback signature invalide rejeté sans effet de bord, callback signature valide fait progresser le statut, callback dupliqué sans transition supplémentaire) ; `NotificationFondationIntegrationTest`/`SecurityIntegrationTest` (nouveaux services neutralisés en `@MockitoBean`) inchangés et verts. Compteurs Flyway alignés dans le même commit que la migration (`SchemaMigrationTest` → 28, `infra/smoke/smoke-stack.sh` → 28). **`mvn verify` : 204/204 tests, 0 échec, Spotless propre, BUILD SUCCESS.** **Écart CI rencontré et résolu** : le Quality Gate SonarQube a échoué deux fois de suite sur `new_security_hotspots_reviewed` (0/100 %) — un Security Hotspot `java:S4790` (« Using weak hashing algorithms »), quasi certainement `HmacSHA1` dans `TwilioSignatureVerifier`, imposé par le protocole de signature Twilio et non modifiable ; le jeton d'analyse (droits `scan`/`provisioning` seulement) ne pouvant pas réviser les Hotspots, le PO l'a marqué **Safe** directement dans `sonar.loyerpro.org` (confirmé via l'API : `new_security_hotspots_reviewed` passé à 100 %), après quoi la CI a été relancée avec succès. **PR #252 fusionnée sur `main` (merge commit `69a7964`)**, branche `feat/sprint-n1-ep16-notifications-whatsapp` supprimée. **Aucune activation Production, Sandbox Twilio exclusivement (ADR-18, K4).** **Prochaine étape CGPA : instruire le Gate Staging du Sprint N+1 (dont `STG-ISOL-01`), nécessitant un compte Twilio Sandbox réel fourni par le PO (jamais versionné) pour la vérification manuelle du parcours WhatsApp exigée par le critère GO du sprint, avant toute décision Gate Production.** |
| 2026-07-24 | **Écart détecté et corrigé avant Gate Staging — lien de vérification manquant dans le message WhatsApp (PR #254 mergée)** | Instruction PO du 2026-07-24 (« instruis le Gate Staging du Sprint N+1 »), écart détecté par Claude Code en préparant la vérification manuelle exigée par le critère GO | jptshilombo@gmail.com | En préparant le Gate Staging, constat que le `payload_minimal` de l'événement `QUITTANCE_DISPONIBLE` (voie B, `QuittanceCertifieeService.emettre`) ne portait ni l'`id` de la quittance ni le token HMAC — `TwilioNotificationProvider` ne pouvait donc construire qu'un message générique, sans jamais de vrai lien `https://.../verify/receipt/{id}?token=...`, en contradiction directe avec le critère GO explicite du Plan (« quittance disponible → WhatsApp reçu → **lien de vérification valide** »). Le PO a choisi de corriger immédiatement plutôt que déployer un parcours cassé. **Correctif ciblé** (même patron que les écarts détectés en cours de route par le passé, PR #76/#209) : `QuittanceCertifieeService.emettre` ajoute `lienVerification` (l'URL déjà construite pour le QR/PDF, réutilisée sans modification) au payload ; `TwilioNotificationProvider.rendre` isole ce lien sur sa propre ligne du message. Nouveau test `lienDeVerificationDuPayloadEstTransmisAuFournisseur` confirmant la transmission de bout en bout. `mvn verify` : **205/205 tests, 0 échec**, Spotless propre, BUILD SUCCESS ; CI complète verte (Sonar y compris, aucun nouveau Hotspot introduit — correctif de manipulation de chaînes uniquement). **PR #254 fusionnée sur `main` (merge commit `27dce09`)**, branche supprimée. **Prochaine étape : reprendre le Gate Staging du Sprint N+1 sur ce candidat corrigé.** |
| 2026-07-24 | **Gate Staging Sprint N+1 EP-16 (WhatsApp P0) — GO, `STAGING_DEPLOYED`, vérification WhatsApp réelle réussie** | Instruction PO du 2026-07-24 (« instruis le Gate Staging du Sprint N+1 »), candidat `27dce09` (PR #252 + PR #254) | jptshilombo@gmail.com | Sauvegarde pré-déploiement vérifiée (`loyertracker-20260724-125743.dump`, SHA-256 `24aeeac3…`). **STG-ISOL-01 PASS avant/après** sur l'hôte mutualisé `ai-test-server` : 9 conteneurs identiques, seuls `api`/`nginx` recréés (`--project-directory`/`-f` en chemins absolus), restart=0 partout, réseau/volumes/ports inchangés, aucune commande Docker globale. Flyway **V28 appliquée, 28/28** (seed 3 templates P0 WhatsApp + fonctions `SECURITY DEFINER` `notification_bailleurs_en_attente()`/`notification_delivery_appliquer_statut()`). Smoke **63 PASS/0 FAIL**. **Premières variables Twilio réelles sur cet hôte mutualisé** (compte Sandbox fourni par le PO — `AC08b1…`/`+14155238886`, jamais versionnées, jamais affichées dans une commande visible ; le token n'a pas été échangé lisiblement dans une session de diagnostic, contrairement à l'incident `set -x` du Gate EP-13). **Vérification manuelle du parcours WhatsApp complet, critère GO explicite du Plan** : quittance émise (patrimoine/bien/locataire `+243999964331`/bail/échéance/pointage RECU créés pour le test, consentement WhatsApp inséré directement en base — US-119 sans interface HTTP à ce stade) → `notification_event` créé avec `lienVerification` dans le payload → 2 lignes Outbox (`QUITTANCE_DISPONIBLE`, `PAIEMENT_RECU`) → **dispatch automatique par le sondage périodique (15 s), avant même le déclenchement manuel** → `PAIEMENT_RECU` (aucun template pour cet événement) → **`DEAD` sans envoi, confirmant en conditions réelles le critère « template non approuvé »** → `QUITTANCE_DISPONIBLE` → `PROCESSED`, `NotificationDelivery` créée → envoi Twilio réel accepté puis **callback de statut reçu et vérifié (signature `X-Twilio-Signature` valide), progression jusqu'à `DELIVERED`** → confirmé côté Twilio (`GET .../Messages/{sid}.json` : `status: delivered`, `to: whatsapp:+243999964331`) → lien de vérification résolu **`VALIDE`** avec le détail exact de la quittance → **confirmation visuelle du PO sur son téléphone**. Nettoyage transactionnel complet après vérification (préférence, Outbox, Delivery, événements dont un résidu propre au test détecté et supprimé — même vigilance que la leçon du T0 hypercare `1.13.0`, quittance, journal de vérification, paiement, bail, bien, locataire, patrimoine), 0 résidu vérifié. Échafaudage `directAccessGrants` révoqué. État final : 9 conteneurs actifs, 4/4 healthy, Prometheus 5/5, Alertmanager 0 alerte, 0 5xx (1 erreur API qualifiée — doublon d'inscription du smoke, patron déjà documenté historiquement, non bloquante). **Décision CDO : GO — `STAGING_DEPLOYED`.** Décision : `docs/cgpa/07-devsecops/gate-staging-sprint-n1-ep16-decision.md`. **Aucune Production autorisée ; Sandbox Twilio exclusivement (ADR-18, K4) ; Gate Production distinct requis, seul chemin vers une future activation, elle-même interdite avant le GO du Sprint N+2.** |
| 2026-07-24 | **Écart NPM détecté et corrigé après confirmation PO — page publique `/verify/` bloquée par le basic-auth staging** | Retour du PO après réception confirmée du message WhatsApp (« lorsque j'essaie d'ouvrir l'URL, ça me demande les credentials, je souhaite que ce soit accès public, challenge mon idée ») | jptshilombo@gmail.com | Le lien de vérification WhatsApp (`/verify/receipt/{id}?token=...`) demandait les identifiants basic-auth NPM au lieu d'être directement accessible, en contradiction avec son propre contrat de sécurité (accès sans compte, seule preuve = token HMAC de l'URL — même conception que `/api/public/receipts/*`). **Idée challengée avant exécution** : un retrait complet du basic-auth sur tout le domaine staging aurait exposé le reste de l'environnement de test partagé sans bénéfice — écarté. **Correctif ciblé retenu**, même patron qu'un écart déjà résolu et documenté (`staging-state.md` §5 écart 5, bypass `/api/` du 2026-06-30) : second bloc `location /verify/ { auth_basic off; … }` ajouté à `18.conf` (proxy host NPM dédié à `loyertracker.staging.loyerpro.org`), persisté dans `advanced_config` (SQLite NPM, sauvegardée avant modification), rechargement `nginx -s reload` **dans le conteneur NPM sans le redémarrer** (aucun autre projet hébergé sur cet hôte mutualisé affecté). Vérification live : `GET /verify/receipt/{id}` sans identifiants → **200** ; `GET /` (racine, reste protégée) sans identifiants → **401** ; 9 conteneurs inchangés. Détail : `docs/staging-state.md` §5 écart 6. **Aucune autre modification NPM ; aucune commande Docker globale.** |
| 2026-07-24 | **Gate Production Sprint N+1 EP-16 (WhatsApp P0) — GO sous réserve, `PRODUCTION_READY`** | Instruction PO du 2026-07-24 (« GO gate production ») | jptshilombo@gmail.com | Checklist Gate Production intégralement instruite sur le candidat `sha-27dce09d` (`27dce09`) : `STAGING_DEPLOYED`, **STG-ISOL-01 PASS**, Flyway 28/28, V28 additive, smoke 63/0, **vérification manuelle réelle du parcours WhatsApp complet** (quittance → WhatsApp livré, confirmé côté Twilio → lien de vérification VALIDE → confirmation visuelle du PO), `PAIEMENT_RECU` sans template → `DEAD` confirmé en conditions réelles, deux écarts détectés et corrigés en cours de route (lien de vérification PR #254, basic-auth NPM sur `/verify/`), CI/CodeQL/Sécurité verts, Quality Gate SonarQube vert (après revue par le PO d'un Security Hotspot `java:S4790`, HmacSHA1 imposé par Twilio), rollback applicatif viable vers Production actuelle `1.13.0` (`sha-e4744d92`, elle-même clôturée le même jour, aucune réserve héritée bloquante). Version `1.14.0` MINOR proposée. **Ce Gate ne couvre pas l'activation Production des canaux externes** : conformément à K8 (ADR-18), le déploiement livre uniquement la capacité applicative (`TwilioNotificationProvider` disponible mais conditionnel) — `NOTIFICATIONS_EXTERNAL_ENABLED`/`TWILIO_WHATSAPP_ENABLED` devront rester à `false` en Production et **aucun credential Twilio ne devra être ajouté au `.env` de production** avant la clôture en GO du Sprint N+2 ; `NoopNotificationProvider` restera l'unique fournisseur actif après ce déploiement, exactement comme après le Sprint N. Réserve non bloquante RSV-PROD-EP16-N1-02 : observabilité dédiée aux notifications externes (US-126) prévue au Sprint N+2, sans impact tant que les canaux restent inactifs. Décision : `docs/cgpa/09-production/gate-production-sprint-n1-ep16-decision.md`. **Cette décision autorise uniquement un Préflight Production — aucune mutation ni déploiement.** `PRODUCTION_DEPLOYED` reste non atteint. **Prochaine étape : instruction explicite distincte pour le Préflight Production `1.14.0`, avec condition bloquante explicite de confirmer l'absence de tout credential/activation Twilio avant et après déploiement.** |
| 2026-07-24 | **Préflight Production `1.14.0` (EP-16 Sprint N+1) — PASS** | Instruction PO du 2026-07-24 (« Préflight Production ») | jptshilombo@gmail.com | Aucune réserve bloquante héritée (contrairement au Préflight `1.13.0`) : `1.13.0` déjà clôturée. Contrôles lecture seule sur `loyertracker-prod-server` : 4/4 actifs healthy `RestartCount=0`, tag `sha-e4744d92` inchangé, Flyway 27/27 (V28 pas encore appliquée), `bailleur-test`/`directAccessGrants` toujours désactivés, `/healthz`/site public 200, Prometheus 5/5, Hikari pending 0, 0 5xx/0 `ERROR` (30 min) ; baseline 3 bailleurs/2 patrimoines/8 biens/8 baux/8 garanties/1 gestionnaire/8 locataires/7 quittances inchangée. Alertmanager 1 alerte `BackupHeartbeatMissing` constatée puis **résolue par ce Préflight lui-même** (le backup pousse un heartbeat réussi). **Backup vérifié** : `loyertracker-20260724-134344.dump` (854175 octets, SHA-256 `492f5017…`) + globals. Migration **V28 additive** confirmée (comme V27/`1.13.0`) : aucun second backup post-migration requis. **Absence explicite de toute variable/credential Twilio confirmée dans le `.env` de production** (grep 0 occurrence — condition 5 du Gate Production). `.env.bak-pre-1.14.0` créé, `.env` hôte inchangé, aucun nouveau secret requis. Candidat `sha-27dce09d` confirmé (digests Staging API `089028b4…`/Web `7dbc551e…`), rollback `sha-e4744d92` déjà présent localement. `CHANGELOG.md` promu `[1.14.0] — 2026-07-24`. Aucun déploiement ni mutation exécuté. Détail : `docs/cgpa/09-production/preflight-backup-v1.14.0-report.md`. **`PRODUCTION_DEPLOYED` non atteint — prochaine étape CGPA : instruction explicite distincte pour le déploiement technique (`api`+`nginx`, migration V28), avec vigilance à ne jamais activer les flags externes ni ajouter de credential Twilio à la Production (K8, ADR-18).** |
| 2026-07-27 | **Déploiement technique `1.14.0` constaté a posteriori — PASS technique, `PRODUCTION_DEPLOYED` NON prononcé ; écart de traçabilité en RÉCIDIVE (R-V54-2)** | Instruction PO du 2026-07-27 (« vas y pour le déploiement technique du release 1.14.0 ») ; les contrôles d'entrée préalables ont révélé que le déploiement avait **déjà eu lieu** | jptshilombo@gmail.com | **Aucune mutation exécutée le 2026-07-27** — le déploiement a été interrompu avant toute action dès le constat, seuls des contrôles en lecture seule ont été menés. **Constat** : la Production tourne déjà sur `sha-27dce09d` (candidat `1.14.0`), digests exacts du Gate/Préflight, Flyway **28/28** avec V28 appliquée. **Chronologie établie par horodatages hôte** (hôte en +0100, PostgreSQL en UTC) : `.env.bak-pre-1.14.0` créé à 12:44 UTC (étape du Préflight), `.env` basculé sur `sha-27dce09d` à **12:48:22 UTC**, conteneurs `api`/`nginx` recréés à **12:48:50/12:48:51 UTC**, migration V28 appliquée à **12:49:00 UTC** — le **2026-07-24**, soit ~4 minutes après le Préflight, dans la même session d'exploitation. **Le PO a confirmé le 2026-07-27 être l'auteur de ce déploiement** (« c'est moi qui ai déployé le 24 ») : geste volontaire non tracé, et non effet de bord. Le rapport de Préflight, écrit avant la bascule, conclut « aucun déploiement exécuté » — exact à sa rédaction, faux quelques minutes plus tard, jamais repris. **Conformité technique intégrale** : déploiement ciblé `api`+`nginx` seuls (`postgres` créé le 2026-07-01, Keycloak et les 4 services de monitoring inchangés), aucune commande Docker globale, 3 templates seedés + 2 fonctions `SECURITY DEFINER` présentes, rollback `sha-e4744d92` disponible localement et viable (V28 additive), dépôt hôte synchronisé `5d59b5f`→`8908d1d`. **K8/ADR-18 respecté** : 0 variable Twilio dans le `.env` hôte ; le `docker-compose.yml` du Sprint N+1 injecte les variables EP-16 avec repli sûr (credentials **vides**, trois flags à `false`, `NOTIFICATION_DRY_RUN=true`) ⇒ `NoopNotificationProvider` seul actif — nuance à connaître pour les contrôles futurs, la présence de `TWILIO_*` dans l'environnement du conteneur n'étant **pas** une violation. **Preuve comportementale d'inactivité externe** : 17 événements `LOYER_EN_RETARD` enregistrés dans `notification_event`, mais `notification_outbox` = 0 et `notification_delivery` = 0 — aucune tentative d'envoi, condition 6 du Gate satisfaite sur ce volet. Plateforme saine au constat (8/8 actifs, 4/4 healthy, `RestartCount=0`, Prometheus 5/5, Alertmanager 0 alerte, 0 `ERROR` API et 0 5xx sur 26 h, `/healthz` et site public 200). **Réserve bloquante** : le **smoke Production (≥63 PASS) n'a jamais été exécuté** — la Production a tourné 3 jours sur une release techniquement conforme mais **jamais validée fonctionnellement** ; l'absence d'incident est une présomption favorable, pas une preuve. Par cohérence avec la régularisation `1.11.0` (où `PRODUCTION_DEPLOYED` n'avait été confirmé qu'après avoir rejoué le smoke 62/0), **`PRODUCTION_DEPLOYED` n'est pas prononcé**. Rapports : `deploiement-technique-v1.14.0-report.md`, `docs/prod-state.md` §0O. **Prochaine étape : validation finale sur autorisation PO explicite et distincte** (réactivation temporaire de `bailleur-test`/`directAccessGrants`, écriture puis suppression transactionnelle de données de test). |
| 2026-07-27 | **Validation finale `1.14.0` (EP-16 Sprint N+1) — PASS, `PRODUCTION_DEPLOYED` atteint** | Instruction PO du 2026-07-27 (« instruis la validation finale »), distincte de la régularisation du déploiement technique du même jour | jptshilombo@gmail.com | Lève la réserve bloquante ouverte par `deploiement-technique-v1.14.0-report.md`. **Contrôle d'entrée sans anomalie** — contrairement à `1.13.0`, `bailleur-test@test.local` était déjà `enabled=false` et `directAccessGrantsEnabled=false` ; Flyway 28/28, compteur attendu par le smoke aligné à 28, baseline 3/2/8/8/8/1/8/7, tables `notification_*` à 17/0/0/3/0. Compte activé pour le run puis redésactivé. **Smoke Production : 63 PASS / 0 FAIL au premier passage** (RUN_ID `1785170429`, **code de sortie 0 capturé directement**, non masqué par un pipe — leçon V22 appliquée), identique à `1.12.0`/`1.13.0` et au Gate Staging du Sprint N+1 ; couverture complète (Flyway 28/28, pool `loyertracker_api` NOSUPERUSER/NOBYPASSRLS, JWT réels via Nginx TLS, parcours bailleur avec `locataireId`, invitation→acceptation Admin API→JWT gestionnaire, affectation/échéances/pointage/honoraires, alertes PREAVIS, audit, scoping gestionnaire, isolation cross-tenant live, RGPD export + effacement locataire 403/204 avec anonymisation, garde-fous AuthN/ports, surface publique de vérification sans oracle) ; échafaudage `directAccessGrants` révoqué automatiquement. **Volet notifications validé en conditions réelles de Production — différence notable avec `1.13.0` où les tables restaient à 0** : le run a généré **8 `notification_event`** (5 `LOYER_EN_RETARD`, 1 `PAIEMENT_RECU`, 1 `BAIL_CREE`, 1 `PREAVIS`) tandis que **`notification_outbox` et `notification_delivery` sont restés à 0** avant, pendant et après — y compris pour `PAIEMENT_RECU`, dont l'absence de template approuvé mène à `DEAD` sans envoi (confirmé en Staging). **Condition 6 du Gate Production satisfaite en Production réelle** ; `NoopNotificationProvider` seul actif, credentials Twilio vides, trois flags à `false`, `NOTIFICATION_DRY_RUN=true`. **Nettoyage transactionnel : 47 lignes supprimées en une seule transaction** (4 audit, **8 `notification_event` du run** — les 17 préexistants appartenant au bailleur réel `5df3adf2-…`, séparation vérifiée avant suppression —, 10 honoraires, 10 paiements, 6 alertes, 1 invitation, 1 affectation, 1 bail, 1 bien, 1 locataire, 2 patrimoines, 1 gestionnaire, 1 bailleur), 0 quittance référencée vérifiée avant suppression, 2 comptes Keycloak smoke supprimés (recherche `smoke-1785170429` → `[]`), `bailleur-test` redésactivé et `directAccessGrantsEnabled=false` reconfirmé. **Note de méthode tracée** : une première tentative de nettoyage a échoué **avant tout `DELETE`** (le shell distant avait expansé les marqueurs `$$` du here-doc en PID) ; `ON_ERROR_STOP=1` a interrompu la transaction juste après le `BEGIN`, l'état de la base a été explicitement revérifié comme **inchangé** avant relance du SQL par stdin — aucune donnée supprimée par cette tentative. **État final : baseline métier et tables `notification_*` restaurées à l'identique** (3/2/8/8/8/1/8/7 et 17/0/0/3/0), Flyway 28/28, 8/8 actifs 4/4 healthy, `/healthz` et site public 200, Prometheus 5/5, Alertmanager 0 alerte, 0 5xx, 0 résidu du RUN_ID. **Note non bloquante** : 1 ligne `ERROR` API pendant le smoke (`duplicate key … bailleur_keycloak_id_key`) — pattern déjà documenté à l'hypercare `1.10.0` T+12, le smoke rejoue une inscription sur un compte existant, l'API répond **409 correctement géré** ; dette cosmétique connue (journalisation `ERROR` pour un cas nominal). **`PRODUCTION_DEPLOYED` prononcé le 2026-07-27 ~16:46 UTC, à la date de sa preuve**, le déploiement technique réel datant du 2026-07-24 — même principe que la régularisation `1.11.0`. Rapport : `validation-finale-v1.14.0-report.md`, `docs/prod-state.md` §0O. **Prochaines étapes distinctes : hypercare T0/T+12/T+24 puis clôture de release CDO. L'écart `R-V54-2` reste ouvert**, sa mesure structurelle devant être arbitrée par le PO indépendamment de cette validation. |
| 2026-07-27 | **Hypercare `1.14.0` (EP-16 Sprint N+1) — Checkpoint T0 PASS** | Instruction PO du 2026-07-27 (« instruis l'hypercare »), après validation finale PASS | jptshilombo@gmail.com | Contrôlé à **`2026-07-27T16:57:05Z`** (`date -u` vérifié), soit ~11 min après `PRODUCTION_DEPLOYED`. **Tous les contrôles verts** : 8/8 actifs 4/4 healthy, `RestartCount=0` sur les 4 services applicatifs (`StartedAt=2026-07-26T14:42:00Z` — redémarrage complet de l'hôte **antérieur** à la validation, aucun redémarrage causé par elle) ; tag `sha-27dce09d` et digests API `089028b4…`/Web `7dbc551e…` conformes au Gate/Préflight ; Flyway 28/28 ; tables `notification_*` à **17 `event` / 0 `outbox` / 0 `delivery` / 3 `template` / 0 `preference`**, identiques à l'état pré-validation ; baseline métier 3/2/8/8/8/1/8/7 inchangée ; `bailleur-test` désactivé et `directAccessGrantsEnabled=false` ; **quatre flags externes vérifiés dans l'environnement du conteneur API** (`NOTIFICATIONS_EXTERNAL_ENABLED`/`TWILIO_WHATSAPP_ENABLED`/`TWILIO_SMS_ENABLED` à `false`, `NOTIFICATION_DRY_RUN=true`) ; `/healthz` et site public 200 ; Prometheus 5/5 `up` ; **Alertmanager 0 alerte** (contrairement aux T0 de `1.10.0`/`1.13.0` : le heartbeat poussé par le backup du Préflight et l'hôte allumé en continu depuis le 2026-07-26 ont évité le `BackupHeartbeatMissing`) ; Hikari `pending`=0 ; 0 ligne 5xx et 0 `ERROR` sur 15 min ; capacité 30 Gio libres (22 % utilisé), charge 0,00/0,03/0,06. **Point de contrôle spécifique satisfait — le résidu de `1.13.0` ne s'est pas reproduit** : le T0 de `1.13.0` avait découvert 8 `notification_event` laissés en base par le nettoyage de sa validation finale (table V27 alimentée en écriture inline, oubliée de la liste post-nettoyage) ; la leçon a été appliquée, la validation `1.14.0` les a supprimés dans sa transaction après avoir vérifié que les 17 événements préexistants appartenaient à un bailleur réel — **0 ligne résiduelle** confirmée sur `bailleur_id=c7296c69-…`, aucune correction nécessaire à ce checkpoint. **Particularité de cette hypercare** : la release ayant été déployée le 2026-07-24 et validée le 2026-07-27, la fenêtre de surveillance démarre à la date de la preuve — les trois jours antérieurs ont été contrôlés a posteriori (0 `ERROR`/0 5xx/0 alerte sur 26 h) mais **sans télémétrie continue observée en temps réel**, même principe que `1.11.0`. **T+12 (cible 2026-07-28 ~04:46 UTC) et T+24 (cible 2026-07-28 ~16:46 UTC) restent à instruire** — écart de fenêtre probable si l'hôte est éteint entre-temps (pattern `1.9.0`/`1.12.0`), auquel cas un contrôle live en rattrapage sera qualifié « PASS sous surveillance ». **Clôture CDO interdite avant ces deux checkpoints.** Plan : `docs/cgpa/09-production/plan-etape-hypercare-v1.14.0.md`. |
| 2026-07-27 | **Arbitrage PO sur `R-V54-2` — option (a) retenue : verrou d'état de release versionné. Plan d'Exécution proposé, aucun codage autorisé** | Instruction PO du 2026-07-27 (« tranche R-V54-2, je prends l'option (a) ») | jptshilombo@gmail.com | Le PO tranche en faveur d'un **fichier d'état de release versionné** contrôlé par la CI, le smoke et un contrôle de dérive dédié, plutôt qu'une garde dans le script de déploiement (b) ou un contrôle d'entrée systématique purement procédural (c). **Motif structurant** : (a) est la seule des trois options qui produit une **détection automatique**, les deux autres restant dépendantes de la discipline humaine — précisément ce qui a échoué deux fois. Plan d'Exécution formalisé en Niveau 1 : `docs/cgpa/06-planification-agile/plan-execution-rv542-verrou-etat-release.md`. **Conception** : `infra/release/production-state.env` (source de vérité — `RELEASE_VERSION`, `PRODUCTION_TAG`, `FLYWAY_EXPECTED`, `PRODUCTION_DEPLOYED_AT`) + `infra/release/check-release-state.sh` à deux modes lecture seule (`--ci` : cohérence compteur/fichiers de migration, version/CHANGELOG, format de tag ; `--host` : déclaré vs réel sur `.env`, base et digests) ; câblages en CI (étape bloquante du job Backend), dans `smoke-stack.sh` et `SchemaMigrationTest`, plus ajout de `--host` en tête des checklists Gate/Préflight/hypercare. **Bénéfice collatéral majeur** : le mécanisme supprime le **compteur Flyway codé en dur à trois endroits** (`infra/smoke/smoke-stack.sh:92` deux occurrences, `SchemaMigrationTest.java:72`), douleur récurrente à l'origine des incidents PR #77 et PR #171 — une migration ajoutée sans réalignement fera désormais **échouer la CI avant merge**. **Limite assumée et explicitement tracée dans le plan** : la CI n'ayant aucun accès à l'hôte de production (clé SSH strictement locale), la dérive n'est pas détectée en temps réel mais au **premier contrôle suivant** ; ce que le mécanisme change réellement, c'est que la fenêtre d'aveuglement passe de « indéfinie, découverte fortuite » (3 jours pour `1.14.0`) à « prochain contrôle », et que l'oubli devient **impossible à ignorer** puisqu'il fait échouer le smoke au lieu de rester silencieux. Une détection temps réel supposerait un agent poussant l'état de l'hôte vers le Pushgateway existant avec alerte Alertmanager sur divergence — extension identifiée, hors périmètre. **Aucun codage n'est autorisé par cet arbitrage** : conformément au verrou CGPA rappelé par `R-S04-1`, un **GO explicite du PO sur le Plan d'Exécution** reste requis avant toute ligne de code. `R-V54-2` reste **Ouvert** jusqu'à livraison, ses critères de fermeture étant définis dans le plan. |
| 2026-07-27 | **GO explicite du PO sur le Plan d'Exécution `R-V54-2`, lot livré et éprouvé le jour même — risque FERMÉ** | Instruction PO du 2026-07-27 (« GO explicite sur le plan R-V54-2 ») | jptshilombo@gmail.com | Lot d'outillage de gouvernance, **sans aucun impact fonctionnel, sans migration SQL et sans déploiement**. **Livré** : `infra/release/production-state.env` (source de vérité versionnée — `RELEASE_VERSION=1.14.0`, `PRODUCTION_TAG=sha-27dce09d`, `FLYWAY_EXPECTED=28`, `PRODUCTION_DEPLOYED_AT=2026-07-27T16:46:00Z`) ; `infra/release/check-release-state.sh` à deux modes **strictement en lecture seule** (`--ci` : compteur vs fichiers de migration, version vs `CHANGELOG`, format de tag immuable, absence de compteur codé en dur ; `--host` : tag `.env`, compteur Flyway en base, digests `api`/`nginx`) ; étape CI **bloquante** « Verrou d'état de release » dans le job Backend avant `mvn verify` (aucune expression `${{ }}`, donc aucune surface d'injection) ; lecture du compteur par `infra/smoke/smoke-stack.sh` et `SchemaMigrationTest` ; **contrôle de dérive du tag ajouté au smoke** lorsqu'il tourne contre la Production ; contrôle d'entrée ajouté en tête des checklists Gate Production (`--host`) et Gate Staging (`--ci`) ; entrée `CHANGELOG` sous `[Non publié]`. **Preuves** : `--ci` vert sur 5 contrôles ; **`--ci` rouge prouvé sur trois divergences simulées** — compteur désaligné (`FLYWAY_EXPECTED=29` vs 28 fichiers), tag non immuable (`latest`), version désynchronisée du `CHANGELOG` — avec restauration à l'identique vérifiée par `git diff` vide après chaque essai ; **`--host` exécuté contre la Production réelle : 4/4 contrôles cohérents** (`sha-27dce09d`, Flyway 28, digests conformes), copie temporaire de test supprimée de l'hôte, aucune mutation applicative ; `mvn verify` vert ; **3 occurrences de compteur codé en dur supprimées** (`smoke-stack.sh` ×2, `SchemaMigrationTest.java`). **Faux positif détecté et corrigé pendant la mise au point** : le garde-fou anti-codage-en-dur, initialement fondé sur le motif générique `attendu <n>`, attrapait des assertions sans rapport (codes HTTP 201/409, montant d'honoraire 72.00) — restreint aux motifs réellement liés à Flyway (`migrationsExecuted).isEqualTo(<n>)` et comparaison de `$MIG`). **Critère GO « smoke rejoué contre Staging » déclaré non applicable et justifié** par arbitrage PO du même jour : non-régression déjà couverte par `mvn verify` et `--ci`, disproportion d'une séquence Gate Staging complète (dont `STG-ISOL-01`) pour un lot d'outillage — écarté explicitement, non ignoré silencieusement. **Limite résiduelle assumée** : pas de détection temps réel, la CI n'ayant aucun accès à l'hôte ; la dérive est constatée au premier contrôle suivant. **`R-V54-2` est FERMÉ** (§13). Plan : `docs/cgpa/06-planification-agile/plan-execution-rv542-verrou-etat-release.md`. |
| 2026-07-28 | **Hypercare `1.14.0` — Checkpoints T+12 et T+24 PASS sous surveillance ; hypercare COMPLÈTE et sans incident** | Instruction PO du 2026-07-28 (« A » puis « Exécuter et statuer le checkpoint T+24 now ») | jptshilombo@gmail.com | T+12 exécuté à 15:33:34 UTC en **rattrapage qualifié** (fenêtre 04:16–05:16 UTC tombée hôte volontairement éteint, boot 06:50:32 UTC — pattern `1.9.0`/`1.12.0`). T+24 exécuté à 15:44 UTC, **anticipé d'~1 h et hors fenêtre sur instruction PO explicite**, l'hôte étant allumé et la fenêtre atteignable : écart de **pilotage assumé**, distinct d'une contrainte d'exploitation, tracé comme tel (précédents `1.7.0`/`1.8.0`). Mesures identiques aux deux passages : 8/8 actifs, 4/4 `(healthy)`, `RestartCount=0`, tag `sha-27dce09d` et digests sans dérive, Flyway 28/28, **invariant financier 0 écart**, contrôle `OBS-S10-01` **0 ligne**, `notification_outbox`/`notification_delivery` **à 0**, credentials Twilio de longueur 0 et absents du `.env` (**K8/ADR-18**), `bailleur-test` désactivé, `directAccessGrants=false`, Prometheus 5/5, Hikari pending 0, 0 5xx et 0 `ERROR` depuis le boot, baseline métier inchangée, site public 200. Alerte `BackupHeartbeatMissing` **non bloquante** (cron 02:15 UTC non joué hôte éteint). **Constat structurant** : 17 événements métier **réels** du bailleur `5df3adf2-…` le 2026-07-27 (origine établie par `audit_log` : 20 actions, rôle `BAILLEUR`) — **l'hypothèse « aucun trafic réel » est invalidée** et retirée des documents ; `outbox`/`delivery` restent à 0 **sous trafic réel non simulé**. **`OBS-S10-01` maintenue close** : garde-fou rejoué avec la requête consignée (groupement sur `cree_le`) → 0 ligne, tri déterministe. **Aucun critère de suspension atteint. La clôture de release CDO reste un acte distinct, non prononcé.** |
| 2026-07-28 | **RELEASE `1.14.0` CLÔTURÉE — CDO GO (~15:49 UTC)** | Instruction PO du 2026-07-28 (« instruis la clôture de release CDO 1.14.0 ») | jptshilombo@gmail.com | Hypercare complète et sans incident : T0 PASS, T+12 et T+24 **PASS sous surveillance**, aucun critère de suspension atteint. État relevé **live à la clôture** (15:49:04 UTC) : tag `sha-27dce09d` et digests inchangés depuis le Gate, Flyway **28/28**, 8/8 actifs, 4/4 `(healthy)`, `RestartCount=0`, **invariant financier 0 écart**, contrôle `OBS-S10-01` **0 ligne**, `notification_outbox`/`notification_delivery` **à 0**, credentials Twilio vides et absents du `.env`, `bailleur-test` désactivé, Prometheus 5/5, Hikari pending 0, **0 5xx et 0 `ERROR` depuis le boot**, baseline métier inchangée, site public 200. **K8/ADR-18 respecté et prouvé sous trafic réel non simulé.** **`R-V54-2` FERMÉ** — premier cycle où l'écart de traçabilité est structurellement neutralisé et non seulement consigné. Réserves : `RSV-PROD-EP16-N1-01` satisfaite et **permanente** jusqu'au GO du Sprint N+2 ; `RSV-PROD-EP16-N1-02`, `RSV-STG-01`, `RSV-GHCR-EXT-01`, `RSV-MIG-611-04/06` **maintenues** (sans rapport avec `1.14.0`) ; `BackupHeartbeatMissing` active mais **non bloquante**. Deux écarts de fenêtre assumés et tracés : T+12 en rattrapage (contrainte d'exploitation), **T+24 anticipé hors fenêtre sur instruction PO** (choix de pilotage) — d'où « sous surveillance » et non `PASS` plein. **L'hypothèse « aucun trafic réel » est invalidée** ; cette clôture **ne vaut pas validation rétroactive** des qualifications antérieures qui s'en réclamaient. `1.14.0` devient la **base de rollback**. Prochaine action autorisée : **GO du Sprint N+2**, sur instruction PO distincte. |
| 2026-07-28 | **GO explicite du PO sur le Sprint N+2 (EP-16, US-124/125/126) — exécution SCINDÉE ; US-125 bloquée par les Gates 02A/04A** | Instruction PO du 2026-07-28 (« GO du Sprint N+2 ») | jptshilombo@gmail.com | La condition de dépendance (« Sprint N+1 clos en GO ») est satisfaite par la clôture de `1.14.0` le jour même. **Verrou CGPA identifié avant tout codage** : US-125 est le **premier lot Frontend significatif** du projet (« aucun écran existant à étendre »), or `docs/project-state.md` impose que « Gate 02A et Gate 04A sont obligatoires au prochain lot Frontend significatif » — échéance de `RSV-MIG-611-06`. Aggravant : `UXR-001`, `DDS-001` et `DSG-001` sont des **gabarits vides** ; le Gate 04A échouerait en l'état. **Arbitrage PO : exécution scindée.** **Lot A (US-124 + US-126, 13 pts)** — backend et infrastructure sans impact UI, relevant du cas d'exemption explicitement prévu : **codage autorisé immédiatement** sous le Plan d'Exécution EP-16 déjà approuvé. **Lot B (US-125, 8 pts)** — **aucun codage Frontend autorisé** tant que la Phase 04A n'est pas instruite et les Gates 02A puis 04A statués. **Quatre points de vigilance consignés** : (1) cohérence K5 (« pas de fallback automatique au premier pilote ») ⇒ politique de fallback livrée **désactivée par défaut**, à vérifier au Gate Staging ; (2) **aucun numéro SMS Twilio provisionné** (confirmation PO) — prérequis hors périmètre au Gate Staging, sans lequel les critères d'US-124 ne sont pas vérifiables ; (3) `RSV-MIG-611-04` probablement déclenchée (nouveaux endpoints, addendum DAT et décision OpenAPI exigibles) ; (4) **K8/ADR-18 inchangé** — ce GO **n'autorise aucune activation de canal externe** ni aucun credential Twilio en Production, celle-ci restant subordonnée à la **clôture en GO** du Sprint N+2. Aucun déploiement, aucune promotion, aucune migration et aucun code produit par cet acte, strictement documentaire. |

## 12. Historique des etapes realisees

| Date | Etape | Resultat | Fichiers impactes | Agent |
| ---- | ----- | -------- | ----------------- | ----- |
| 2026-06-04 | Cadrage CGPA initial | Phases 0 a 5 documentees et gates Go | `docs/cgpa/*` | Agents IA / PO |
| 2026-06-06 | Phase DevSecOps | Gate 6 Go, CI et securite en place | `.github/`, `backend/`, `frontend/`, `infra/`, `docs/cgpa/07-devsecops/` | Agents IA / PO |
| 2026-06-16 | Cap production PR 1 — alerting OBS-02/03 (PR #48) | Chaine Prometheus/Alertmanager/blackbox/Pushgateway (profil `monitoring`), 10 regles critiques, metriques batch + p99, heartbeat backup ; `mvn verify` 58 verts, promtool OK ; merge `753cbad` | `infra/monitoring/*`, `docker-compose.yml`, `backend/.../batch/BatchMetrics.java` + schedulers, `application.yml`, `infra/backup/backup-postgres.sh`, `.env.example`, `docs/cgpa/observability-governance.md`, runbook | Claude Code |
| 2026-06-16 | Cap production PR 2 — Release Governance v1.0.0 (R-V52-5) | SemVer 1.0.0, `CHANGELOG.md`, release notes, `docker-compose.prod.yml` aligné GHCR/tag immuable, dossier Gate 07A (non statué) ; **mergée PR #51 (merge `6c7be10`)** | `backend/pom.xml`, `frontend/package.json`+lock, `docker-compose.prod.yml`, `CHANGELOG.md`, `docs/release-notes-v1.0.0.md`, `docs/cgpa/07-devsecops/gate-07A-decision.md`, `docs/project-state.md` | Claude Code |
| 2026-06-16 | Alerting en overlay réutilisable (PR #52, merge `fd06a49`) | Chaîne `monitoring` extraite du compose de base vers l'overlay dédié `docker-compose.monitoring.yml` (profil opt-in), combinable dev OU staging | `docker-compose.monitoring.yml` (nouveau), `docker-compose.yml`, `.env.example`, `docs/cgpa/observability-governance.md`, `docs/cgpa/07-devsecops/runbook-exploitation.md` | Claude Code |
| 2026-06-17 | Correctif overlay monitoring — héritage du projet (PR #53, merge `13bd842`) | L'overlay n'épingle plus `name:` → hérite du projet du fichier de base ; corrige un conflit de ports en staging (`loyertracker` vs `loyertracker-staging`) | `docker-compose.monitoring.yml` | Claude Code |
| 2026-06-17 | Correctif Alertmanager v0.28.1 (PR #54, merge `f7785b9`) | Flag `--config.expand-environment-variables` requis pour l'expansion d'environnement → version figée à v0.28.1 | `docker-compose.monitoring.yml` | Claude Code |
| 2026-06-17 | Correctif webhook Alertmanager via `url_file` (PR #55, merge `c587e39`) | Le flag d'expansion d'env n'existe pas pour le champ webhook : secret lu via `url_file: /tmp/webhook_url` (écrit au démarrage depuis `.env`, hors dépôt) | `infra/monitoring/alertmanager.yml`, `docker-compose.monitoring.yml`, `.env.example` | Claude Code |
| 2026-06-19 | Reprise CGPA v5.2 re-exécutée + consignation PR #51→#55 | `Resume Approved with Reservations` (4/4 contrôles de continuité PASS) ; §3B/§11/§12/§13 resynchronisés sur HEAD `main` `c587e39` (clôture R-V52-6) | `docs/project-state.md` | Claude Code — CGPA Chief Delivery Officer |
| 2026-06-19 | RR-1 — validation staging de l'alerting (OBS-02/03) | 4/4 composants critiques FIRING→notifié→resolved (API/PostgreSQL/Keycloak/sauvegarde), notification Alertmanager bout-en-bout prouvée, smoke 46/0 ; **Gate Staging enrichi GO**, **Gate 07A GO sous réserve** (RR-2 au go-live), OBS-02/03 clos, RR-1 levée | `docs/staging-state.md` (§10), `docs/cgpa/07-devsecops/gate-07A-decision.md`, `docs/project-state.md` | Claude Code — CGPA Chief Delivery Officer |
| 2026-06-19 | Cap go-live — Production Readiness Review + Gate 09 (Production Readiness) | Review **19/24 (Solide)** sur preuves existantes (monitoring/alerting/rollback/runbooks prouvés sur staging) ; **Gate 09 GO sous réserve** (RG-09-1 capacity, RG-09-2 support, RR-2 traçabilité) ; recette par waiver tracé ; ouverture Gate 10 autorisée. Cible Production = hôte dédié | `docs/cgpa/09-production/production-readiness-review.md` (nouveau), `docs/cgpa/09-production/gate-09-decision.md` (nouveau), `docs/project-state.md` | Claude Code — CGPA Chief Delivery Officer |
| 2026-06-19 | Cap go-live — check-list de provisioning de l'hôte Production dédié (préparation Gate 10) | Déroulé côté hôte ancré sur les artefacts réels (`docker-compose.prod.yml`, overlay `monitoring`, clés `.env`, smoke, backup) ; comble la « section go-live » du runbook, intègre le solde de RG-09-1/RG-09-2 et de RR-2. **Aucune exécution** (cible réelle à provisionner) | `docs/cgpa/10-mise-en-production/checklist-provisioning-hote-prod.md` (nouveau), `docs/project-state.md` | Claude Code — CGPA Chief Delivery Officer |
| 2026-06-19/20 | Gate 10 — correctifs go-live (compose prod jamais déployé) | 3 écarts révélés au déploiement réel et corrigés : ports nginx `ports: !override` 18080/18443 (PR #60, `f9fa67a`) ; Keycloak mode prod `start` sans `--optimized` + `KC_HOSTNAME` public (PR #61, `e87f8f5`) ; receiver Alertmanager natif `discord_configs` (PR #62, `d576f90`) | `docker-compose.prod.yml`, `infra/monitoring/alertmanager.yml` | Claude Code — CGPA Chief Delivery Officer |
| 2026-06-20 | Onboarding bailleurs — script de creation outille (PR #68) | Script `creer-bailleur.sh` (A3 + B1) valide sur staging (creation, role realm BAILLEUR, mot de passe temporaire force, idempotence exit 3, nettoyage) ; runbook §9 « Onboarding — creer un compte bailleur » ajoute ; compte bailleur du PO provisionne en production ; merge `8b20e9a` | `infra/keycloak/creer-bailleur.sh` (nouveau), `docs/cgpa/07-devsecops/runbook-exploitation.md` (§9), `docs/project-state.md` | Claude Code — CGPA Chief Delivery Officer |
| 2026-06-20 | **Gate 10 — go-live production `1.0.0`** | Hôte dédié provisionné (EC2 `t3.medium`, EIP `18.158.70.88`, DNS `loyertracker.loyerpro.org`, TLS Let's Encrypt) ; déploiement `sha-73359c5c` (4/4 healthy, Flyway V1→V10, RLS `loyertracker_api`) ; **smoke prod 46/0** ; overlay monitoring **5/5 cibles `up`** ; **incident simulé Discord FIRING+RESOLVED** (`notifications_total=2`/`failed=0`, réception PO confirmée) ; backup `-Fc` vérifié `pg_restore --list` + cron prod 02h15 ; **durcissement** : reset propre (base vierge, 0 ligne métier) + compte test `bailleur-test@test.local` désactivé. **Production LIVE** | hôte prod (`.env` hors dépôt) ; `docs/prod-state.md` (nouveau) | Claude Code — CGPA Chief Delivery Officer |
| 2026-06-20 | **Gate 10 — Mise en production statué GO** | 12/12 critères ✅ ; réserves **RR-2 / RG-09-1 / RG-09-2 levées** ; traçabilité production renseignée | `docs/cgpa/10-mise-en-production/gate-10-decision.md` (nouveau), `docs/prod-state.md` (nouveau), `docs/release-notes-v1.0.0.md` (§1/§3/§5/§6/§7), `docs/project-state.md` (§3/§3A/§11/§12/§13/§14) | Claude Code — CGPA Chief Delivery Officer |
| 2026-06-21 | Lot post-go-live « Quittances de loyer » clos côté merge (`PR #70` + `PR #71`) | Fondation données (migration V11, ventilation `loyer_hc`/`provision_charges`, profil bailleur) puis génération PDF quittance/avis d’échéance à la volée (package `documents`, OpenHTMLtoPDF), correctifs CI/Sonar et couverture frontend/backend intégrés dans `origin/main` via PR #70 puis PR #71 (`b132055`). `CHANGELOG.md` `[Non publié]` maintenu. | `CHANGELOG.md`, `backend/.../documents/*`, `backend/.../bailleur/*`, migration V11, `frontend/src/app/bailleur/profil/*`, `frontend/src/app/paiements/*`, `frontend/src/app/core/s03/s03-api.service.ts` | Claude Code / Jo_skynet |
| 2026-06-21 | **Sprint 1 Patrimoine — backend modèle de données mergé (PR #72)** | Implémentation des livrables Sprint 1 : entités/endpoints `Patrimoine` et `TypeBien`, rattachement obligatoire `Bien.patrimoineId`, migration `V12__patrimoine_type_bien.sql`, adaptation des tests S02/S03/S04/documents et `PatrimoineIntegrationTest`. Merge `origin/main` `6eeeb6e` ; commit fonctionnel `74fe51c`. | `backend/src/main/java/com/loyertracker/patrimoine/*`, `backend/src/main/resources/db/migration/V12__patrimoine_type_bien.sql`, tests backend, `docs/project-state.md` | Claude Code / Jo_skynet |
| 2026-06-21 | Resynchronisation Git et nettoyage local de reprise | `git fetch --all --prune`, fast-forward local sur `origin/main` (`6eeeb6e`), divergence `origin/main...HEAD` = `0 0`. Création de la branche documentaire `chore/cgpa-resume-sync`. `.claude/`, `.codex/` et `.trivy-cache/` ajoutés au `.gitignore`, `package-lock.json` racine parasite supprimé. | `.gitignore`, espace de travail local | Jo_skynet |
| 2026-06-21 | **Clôture Sprint 1 Patrimoine mergée (PR #73)** | Décision documentaire `GO technique / Sprint 1 clôturé` intégrée dans `main` via PR #73 (`d0bc1d6`, commit `525dd95`). Checks GitHub verts : backend, frontend, sécurité, packaging Docker, CodeQL. | `CHANGELOG.md`, `docs/project-state.md`, `docs/cgpa/06-planification-agile/plan-execution-patrimoine.md`, `docs/cgpa/06-planification-agile/sprint-1-patrimoine-cloture.md` | Jo_skynet |
| 2026-06-23 | Smoke-staging réaligné V13 + patrimoine + S02 (PR #75) | `infra/smoke/smoke-stack.sh` : attente Flyway V1-V13, patrimoine créé avant le bien, bail `loyerHc`/`provisionCharges`, affectation **patrimoine** 8 %. Exécuté manuellement contre staging (image `sha-7483a19f`) : **43 PASS / 4 FAIL** — les 4 échecs imputés à un écart métier honoraires/affectation patrimoine, analyse séparée ouverte. **Mergée le 2026-06-23T11:32Z, merge commit `c23fea4`.** | `infra/smoke/smoke-stack.sh` | jordan / Claude Code |
| 2026-06-23 | Correctif honoraires patrimoine — migration V14, R-S04-1 régularisée et fermée (PR #76) | `calculer_honoraires()` (V14) étend la résolution patrimoine→biens (héritage ReBAC du Sprint 2 non couvert côté calcul) ; `HonoraireRepository.findByBien` inclut les affectations patrimoine ; `SchemaMigrationTest` aligné 13→14. Note de gouvernance assumée dans la PR : correctif codé/poussé hors Plan d'Exécution après PR #75, régularisé a posteriori par la revue + CI verte 13/13. **Mergée le 2026-06-23T12:14Z, merge commit `7547341`.** Re-vérification smoke staging post-V14 restant à exécuter. | `backend/src/main/java/com/loyertracker/honoraires/HonoraireRepository.java`, `backend/src/main/resources/db/migration/V14__honoraires_patrimoine.sql`, `backend/src/test/java/com/loyertracker/db/SchemaMigrationTest.java`, `docs/project-state.md` | jordan / Claude Code |
| 2026-06-25 | Correctif CORS Compose — câblage `APP_CORS_ALLOWED_ORIGIN` / `APP_INVITATION_BASE_URL` (commit `964ebfb`) | Commit directement sur `origin/main`, CI SUCCESS (CodeQL + pipeline complet, 6 min 17 s) ; écart PR qualifié et accepté (Niveau 1, changement Compose pur) ; héritage prod vérifié (`docker-compose.prod.yml` service `api` sans `environment`) | `docker-compose.yml`, `docker-compose.staging.yml`, `docs/cgpa/09-production/plan-correctif-cors-compose.md` (nouveau) | jordan / Claude Code |
| 2026-06-25 | Smoke script — alignement compteur Flyway V14→V15 (commit `8c79e3d`) | Défaut latent détecté en reprise CGPA v5.4.1 ; correctif 2 lignes ; même pattern que l'incident R-S04-1 / PR #77 | `infra/smoke/smoke-stack.sh` | Claude Code — CGPA Chief Delivery Officer |
| 2026-06-25 | **Gate Staging combiné CORS + Sprint 3 — GO, `STAGING_DEPLOYED`** | Tag `sha-5bf187af` : 4/4 `healthy`, CORS vars injectées, Flyway V15/15, STG-ISOL-01 live PASS (RSV-STG-01 levée), **smoke 47/0**. Production non autorisée. | `docs/cgpa/07-devsecops/gate-staging-cors-sprint3-v5.3-decision.md`, `docs/staging-state.md`, `docs/project-state.md` | Claude Code — CGPA Chief Delivery Officer |
| 2026-06-25 | **Vérification dashboard Staging — PASS complet** | HTTPS 200, Angular SPA 200, API UP, Keycloak OIDC 200, JWT `jordan.test` obtenu, patrimoines/biens/alertes/paiements fonctionnels, `directAccessGrants` OFF | `docs/staging-state.md` §9, `docs/project-state.md` | Claude Code — CGPA Chief Delivery Officer |
| 2026-06-06 | Inscription bailleur | US-10 developpee et testee | `backend/src/main/java/com/loyertracker/bailleur/`, `frontend/src/app/bailleur/` | Agents IA |
| 2026-06-06 | Migration frontend | Angular/keycloak-angular portes en version 20 | `frontend/` | Agents IA |
| 2026-06-07 | Invitation gestionnaire | US-11 developpee et testee | `backend/src/main/java/com/loyertracker/comptes/` | Agents IA |
| 2026-06-07 | Acceptation invitation | US-12 developpee avec faux IdP en test | `backend/src/main/java/com/loyertracker/comptes/` | Agents IA |
| 2026-06-07 | Autorisation fine | US-13 developpee et testee | `backend/src/main/java/com/loyertracker/securite/`, migrations V3 | Agents IA |
| 2026-06-07 | SAST/lint | CodeQL, Spotless, ESLint en CI | `.github/workflows/`, `backend/pom.xml`, `frontend/` | Agents IA |
| 2026-06-07 | Migration CGPA v3.0.1 priorite 1 | Creation du Project State File | `docs/project-state.md` | CGPA Migration Auditor v3.0.1 / Codex |
| 2026-06-07 | Resynchronisation documentaire minimale et cloture S01 | R1 cloturee, R6 clarifiee, S01 cloture documentaire | `docs/cgpa/07-devsecops/`, `docs/cgpa/06-planification-agile/sprint-planning-s01.md`, `README.md`, `docs/project-state.md` | Codex |
| 2026-06-07 | Execution S02 backend | US-20 a US-24 realisees et verifiees par `mvn verify` | `backend/src/main/java/com/loyertracker/biens/`, `backend/src/main/java/com/loyertracker/baux/`, `backend/src/main/java/com/loyertracker/affectations/`, migration V4, tests S02, `docs/project-state.md` | Codex |
| 2026-06-07 | Approbation S02 backend | GO sous reserve accepte par le PO/CGPA | `docs/project-state.md`, `docs/cgpa/06-planification-agile/rapport-execution-s02.md` | PO / Codex |
| 2026-06-07 | Execution frontend S02 minimal | Dashboards bailleur/gestionnaire branches sur les endpoints S02, lint/build/tests verts | `frontend/src/app/bailleur/dashboard/`, `frontend/src/app/gestionnaire/dashboard/`, `frontend/src/app/core/s02/`, `docs/project-state.md` | Codex |
| 2026-06-07 | Approbation frontend S02 minimal | GO sous reserve accepte par le PO/CGPA | `docs/project-state.md`, `docs/cgpa/06-planification-agile/rapport-execution-frontend-s02.md` | PO / Codex |
| 2026-06-07 | Validation runtime R6 | OIDC/PKCE et API protegee OK ; Admin API gestionnaire KO 401 ; R6 non cloturee | `docs/cgpa/07-devsecops/rapport-validation-r6.md`, `docs/cgpa/07-devsecops/`, `docs/project-state.md` | Codex |
| 2026-06-08 | Consolidation delegation S02 — durcissement autorisation affectations | ReBAC `peutAccederBien` sur `creer` (403 cross-bailleur) ; controle de propriete sur `revoquer` (404 cross-bailleur) ; test d'integration cross-bailleur ajoute ; `mvn verify` vert 36 tests ; lot S02 versionne | `backend/.../affectations/AffectationController.java`, `backend/.../affectations/AffectationService.java`, `backend/.../s02/S02BiensBauxAffectationsIntegrationTest.java`, `docs/project-state.md` | Claude Code |
| 2026-06-08 | Remediation RLS — role applicatif a privileges minimaux | Migration V5 (`loyertracker_api` LOGIN NOSUPERUSER NOBYPASSRLS + grants DML/EXECUTE) ; Flyway via role admin separe (`spring.flyway.user`) ; compose/.env bascules ; tests RLS sous role reel + attributs du role ; `mvn verify` vert 38 tests. Reactive la 2e couche de defense en profondeur (ADR-01) | `V5__role_applicatif_rls.sql`, `application.yml`, `src/test/resources/application.properties`, `docker-compose.yml`, `.env(.example)`, `SchemaMigrationTest.java`, `docs/project-state.md` | Claude Code |
| 2026-06-08 | Smoke test runtime sous role restreint | App bootee via jar reel + PostgreSQL dedie : Flyway migre en admin et cree `loyertracker_api`, l'app se connecte en rôle restreint (pool Hikari, health UP). Verifie live : TRUNCATE/DDL refuses, isolation RLS par tenant (sans GUC=0, tenant A voit son bien, tenant B ne le voit pas). Non couvert : flux API authentifie (Keycloak) | (validation runtime, aucun fichier source) | Claude Code |
| 2026-06-08 | PR #3 mergee dans `main` (CI verte) | Branche `feat/s02-delegation-affectations` -> `main` via PR #3 (delegation S02, autorisation cross-tenant, RLS rôle applicatif, smoke test). Gate CodeQL d'abord rouge (4 alertes high `java/concatenated-sql-query` dans le nouveau test RLS) corrige par SQL parametre (`set_config`/PreparedStatement). Tous les checks verts : Backend, Frontend, Securite (gitleaks+SCA+Trivy), CodeQL, Packaging Docker. **Mergee le 2026-06-08T07:56Z, merge commit `d6a586f`.** | `main`, PR #3 | Claude Code / PO |
| 2026-06-09 | Execution Plan R6 — correction Admin API Keycloak gestionnaire | Ajout client confidentiel service account `loyertracker-admin` (roles realm-management `manage-users`/`view-users`/`view-realm`), secret injecte post-import (`keycloak-init`), variables Admin API injectees dans `api` (base-url `/auth`), defauts Spring/adaptateur alignes. Bug d'import corrige (description client > 255 car.). `mvn verify` vert (38 tests). Reexecution runtime : token client_credentials 200, 4 ops Admin API OK (200/201/200/204), parcours API `POST /api/invitations` + acceptation OK 201 (adaptateur reel), gestionnaire cree + role `GESTIONNAIRE`. R6 clotûree. | `infra/keycloak/realm-loyertracker.json`, `infra/keycloak/bootstrap-test-account.sh`, `docker-compose.yml`, `.env.example`, `backend/.../application.yml`, `backend/.../KeycloakGestionnaireIdentityProvider.java`, `docs/cgpa/07-devsecops/rapport-validation-r6.md`, `docs/project-state.md` | Claude Code |
| 2026-06-09 | PR #5 mergee dans `main` (CI verte) | Branche `fix/r6-keycloak-admin-api` -> `main` via PR #5 (remediation R6 Admin API gestionnaire). Tous les checks verts : Backend, Frontend, Securite (gitleaks+SCA+Trivy), CodeQL Java+TS, Packaging Docker. **Mergee le 2026-06-09T08:07Z, merge commit `d77cf29`.** | `main`, PR #5 | jptshilombo / Claude Code |
| 2026-06-09 | Execution S03 backend — paiements & garanties | US-30 fonction SQL `generer_echeances_loyers()` (V6, SECURITY DEFINER owner batch, idempotente A.3) + batch `@Scheduled` + trigger `POST /api/batch/echeances` ; US-31 pointage + historique ; US-32 garantie depot/restitution (A.5) ; audit des ecritures (BNF-05). Ecart maitrise vs plan : SECURITY DEFINER au lieu d'un 2e datasource batch. Anomalies corrigees : mapping `CHAR(7)` (periode) ; mocks S03 dans `SecurityIntegrationTest` ; `SchemaMigrationTest` 6 migrations. `mvn verify` vert : 44 tests (38 + 6 S03), 0 echec. | `db/migration/V6__...sql`, `paiements/*`, `garanties/*`, `batch/*`, `audit/AuditService.java`, tests `s03/*`, `SecurityIntegrationTest`, `SchemaMigrationTest`, `docs/cgpa/06-planification-agile/rapport-execution-s03.md`, `docs/project-state.md` | Claude Code |
| 2026-06-09 | PR #7 mergee dans `main` (CI verte) | Branche `feat/s03-paiements-garanties` -> `main` via PR #7 (lot backend S03 paiements & garanties, US-30/31/32). Les 13 checks verts : Backend, Frontend, Securite (gitleaks+SCA+Trivy), CodeQL Java+TS, Packaging Docker. **Mergee le 2026-06-09T12:11Z, merge commit `2f5c743`, branche supprimee.** | `main`, PR #7 | jptshilombo / Claude Code |
| 2026-06-09 | PR #8 mergee dans `main` (CI verte) | Branche `docs/project-state-post-merge-s03` -> `main` via PR #8 (synchronisation post-merge S03). Checks verts. **Mergee le 2026-06-09T12:23Z, merge commit `b5f201c`, branche supprimee.** | `main`, PR #8 | jptshilombo / Claude Code |
| 2026-06-09 | Execution Frontend S03 + correctifs QA | Lot A (backend) : fonction SQL `marquer_loyers_en_retard()` (V7, SECURITY DEFINER owner batch, idempotente) + chainage batch (DTO `{echeancesCreees, loyersEnRetard}`) + controle `RECU >= attendu` (400). Lot B (frontend) : service `core/s03`, composants `paiements-bien` et `garanties-bail` standalone (signals) integres aux 2 dashboards, declenchement batch reserve bailleur. `mvn verify` vert 46 tests ; `ng lint`/`ng build`/`ng test` verts (18 tests). | `db/migration/V7__...sql`, `batch/*`, `paiements/PaiementService.java`, tests `s03/*` + `SchemaMigrationTest`, `frontend/src/app/core/s03/*`, `frontend/src/app/paiements/*`, `frontend/src/app/garanties/*`, `frontend/.../bailleur|gestionnaire/dashboard/*`, `docs/cgpa/06-planification-agile/rapport-execution-frontend-s03.md`, `docs/project-state.md` | Claude Code |
| 2026-06-09 | PR #9 mergee dans `main` (CI verte) | Branche `feat/s03-frontend-paiements-garanties` -> `main` via PR #9 (frontend S03 paiements & garanties US-31/32 + correctifs QA backend). Tous les checks verts : Backend, Frontend, Securite (gitleaks+SCA+Trivy), CodeQL Java+TS, Packaging Docker. **Mergee le 2026-06-09T13:23Z, merge commit `a1f60dd`, branche supprimee.** | `main`, PR #9 | jptshilombo / Claude Code |
| 2026-06-10 | Execution S04 lot 1 — honoraires de gestion | US-40 fonction SQL `calculer_honoraires(p_bien_id)` (V8, SECURITY DEFINER owner batch, upsert idempotent POURCENTAGE/FORFAIT, gel a PAYE) ; package `honoraires/` ; hook synchrone `PaiementService.pointer` ; `GET /api/biens/{bienId}/honoraires` (ReBAC) ; `PATCH /api/honoraires/{id}/statut` (BAILLEUR-only, audit `VALIDER_HONORAIRE`, garde de cloisonnement applicative) ; `POST /api/batch/honoraires` + recalcul quotidien. `mvn verify` vert : 49 tests (46 + 3 S04), `SchemaMigrationTest` 8 migrations. | `db/migration/V8__s04_honoraires.sql`, `honoraires/*`, `paiements/PaiementService.java`, `batch/BatchController.java`, `batch/EcheancesScheduler.java`, tests `s04/S04HonorairesIntegrationTest.java` + `SchemaMigrationTest` + `SecurityIntegrationTest`, `docs/cgpa/06-planification-agile/rapport-execution-s04-lot1-honoraires.md` | Claude Code |
| 2026-06-10 | PR #11 mergee dans `main` (CI verte) | Branche `feat/s04-honoraires` -> `main` via PR #11 (lot 1 S04 honoraires US-40). Tous les checks verts : Backend, Frontend, Securite (gitleaks+SCA+Trivy), CodeQL Java+TS, Packaging Docker. **Mergee le 2026-06-10, merge commit `8ac0b49`, branche supprimee.** | `main`, PR #11 | jptshilombo / Claude Code |
| 2026-06-10 | Execution S04 lot 2 — alertes & consultation audit | US-50/51 fonction SQL `generer_alertes()` (V9, SECURITY DEFINER owner batch, idempotente ON CONFLICT, periode derivee non-nulle ; LOYER_EN_RETARD, FIN_BAIL, GARANTIE_NON_RESTITUEE ; PREAVIS reporte) ; fonctions `alertes_gestionnaire`/`alerte_bailleur_pour_gestionnaire` (scoping US-52) ; package `alertes/` (`GET /api/alertes`, `PATCH /api/alertes/{id}/lecture`) ; audit US-62 (`AuditLog`, `GET /api/audit` BAILLEUR-only) ; `POST /api/batch/alertes` + `AlertesScheduler @07:00`. `mvn verify` vert : 53 tests (49 + 4 S04), `SchemaMigrationTest` 9 migrations. | `db/migration/V9__s04_alertes.sql`, `alertes/*`, `audit/AuditLog.java`+`AuditLogRepository.java`+`AuditDto.java`+`AuditController.java`+`AuditService.java`, `batch/AlertesScheduler.java`, `batch/BatchController.java`, tests `s04/S04AlertesAuditIntegrationTest.java` + `SchemaMigrationTest` + `SecurityIntegrationTest`, `docs/cgpa/06-planification-agile/rapport-execution-s04-lot2-alertes-audit.md` | Claude Code |
| 2026-06-10 | PR #12 mergee dans `main` (CI verte) | Branche `feat/s04-alertes-audit` -> `main` via PR #12 (lot 2 S04 alertes US-50/51/52 + audit US-62). Tous les checks verts : Backend, Frontend, Securite (gitleaks+SCA+Trivy), CodeQL Java+TS, Packaging Docker. **Mergee le 2026-06-10T07:52Z, merge commit `0f4f47c`, branche supprimee.** | `main`, PR #12 | jptshilombo / Claude Code |
| 2026-06-10 | Synchronisation post-merge S04 backend (PR #13) | Branche `docs/project-state-post-merge-s04` -> `main` via PR #13 (cloture documentaire backend S04, PR #11 + #12). **Mergee le 2026-06-10, merge commit `f1d45ed`.** | `docs/project-state.md`, PR #13 | jptshilombo / Claude Code |
| 2026-06-10 | Execution S04 — alerte PREAVIS | US-50/EF-62 : migration V10 `DROP` puis recreation `generer_alertes(p_preavis_jours integer DEFAULT 90)` (3 branches V9 reconduites + branche PREAVIS bornee `]J+60 ; J+90]`, exclusive de FIN_BAIL, SECURITY DEFINER owner batch, anti-doublon ON CONFLICT) ; config `app.alertes.preavis.jours` (90, env `APP_ALERTES_PREAVIS_JOURS`) ; `AlerteService.genererBatch()` passe le parametre via `@Value`. Aucun changement d'enum/entite/DTO/endpoint (`TypeAlerte.PREAVIS` preexistant). `mvn verify` vert : 54 tests (53 + 1 PREAVIS), `SchemaMigrationTest` 10 migrations. | `db/migration/V10__s04_alerte_preavis.sql`, `application.yml`, `alertes/AlerteService.java`, tests `s04/S04AlertesAuditIntegrationTest.java` + `SchemaMigrationTest`, `docs/cgpa/06-planification-agile/rapport-execution-s04-preavis.md` | Claude Code |
| 2026-06-10 | PR #14 mergee dans `main` (CI verte) | Branche `feat/s04-alerte-preavis` -> `main` via PR #14 (alerte PREAVIS US-50/EF-62). Les 13 checks verts : Backend, Frontend, Securite (gitleaks+SCA+Trivy), CodeQL Java+TS, Packaging Docker. **Mergee le 2026-06-10T14:24Z, merge commit `0cd3539`, branche supprimee.** S04 backend clos (PREAVIS inclus). | `main`, PR #14 | jptshilombo / Claude Code |
| 2026-06-10 | Synchronisation post-merge S04 PREAVIS (PR #15) | Branche `docs/project-state-post-merge-preavis` -> `main` via PR #15 (cloture documentaire backend S04, PREAVIS inclus). **Mergee le 2026-06-10T14:43Z, merge commit `ac42d25`.** | `docs/project-state.md`, PR #15 | jptshilombo / Claude Code |
| 2026-06-10 | Execution Frontend S04 — consoles honoraires/alertes/audit | Service `core/s04/s04-api.service.ts` (types + methodes honoraires/alertes/audit + batch) ; composants standalone `honoraires-bien` (validation EN_ATTENTE/PAYE + recalcul, gardes `peutValider`), `alertes-liste` (NON_LUE en tete, marquage lue, generation gardee `peutGenerer`), `audit-journal` (bailleur seul) ; cablage dashboards bailleur (valider + generer + audit) et gestionnaire (lecture seule, alertes sans generation, pas d'audit). Aucune modification backend. `ng lint`/`ng build` verts ; `ng test` 27 verts (18 + 6 service + 3 composants). | `frontend/src/app/core/s04/*`, `frontend/src/app/honoraires/*`, `frontend/src/app/alertes/*`, `frontend/src/app/audit/*`, `frontend/.../bailleur|gestionnaire/dashboard/*`, `docs/cgpa/06-planification-agile/rapport-execution-frontend-s04.md` | Claude Code |
| 2026-06-10 | PR #16 mergee dans `main` (CI verte) | Branche `feat/s04-frontend-honoraires-alertes-audit` -> `main` via PR #16 (frontend S04 US-40/50/51/52/62). Echec transitoire d'upload SARIF CodeQL (panne API GitHub `Requires authentication`, sans rapport avec le code — la CodeQL Java echouait aussi) ; jobs CodeQL relances apres retablissement -> tous les checks verts. **Mergee le 2026-06-10, merge commit `99e3215`, branche supprimee.** S04 complet backend + frontend. | `main`, PR #16 | jptshilombo / Claude Code |
| 2026-06-10 | PR #17 mergee dans `main` (CI verte) | Branche `docs/project-state-post-merge-frontend-s04` -> `main` via PR #17 (synchronisation post-merge Frontend S04). Memes echecs CodeQL transitoires (panne API GitHub) relances apres retablissement -> tous les checks verts. **Mergee le 2026-06-10, merge commit `0ae7e8f`, branche supprimee.** | `docs/project-state.md`, PR #17 | jptshilombo / Claude Code |
| 2026-06-10 | Execution tests double datasource — fidelite RLS | Datasource applicatif des tests `@SpringBootTest` bascule sous `loyertracker_api` (creds statiques `application.properties` de test, URL dynamique) ; Flyway en admin (cree le role en V5 avant la 1re connexion du pool, ordre identique prod) ; `RlsTestDataSourceConfig` expose un `@Bean("admin") JdbcTemplate` (aucun bean `DataSource`, pour preserver l'auto-configuration du primaire) ; 7 tests d'integration convertis (`@Qualifier("admin")` sur le seed/cleanup) ; test de verrou `applicationConnecteeSousRoleRestreintNonBypassRls` (current_user, non BYPASSRLS, non superuser). `mvn verify` vert : 55 tests (54 + 1 verrou), aucun echec revele par la conversion — aucune modification applicative ni de migration (pas de V11). | `test/.../testsupport/RlsTestDataSourceConfig.java`, `test/resources/application.properties`, tests `bailleur/`, `comptes/`, `s02/`, `s03/`, `s04/`, `securite/`, `docs/cgpa/06-planification-agile/rapport-execution-tests-double-datasource.md` | Claude Code |
| 2026-06-10 | PR #18 mergee dans `main` (CI verte) | Branche `chore/tests-double-datasource-rls` -> `main` via PR #18 (tests double datasource, fidelite RLS). Les 13 checks verts du premier coup : Backend, Frontend, Securite (gitleaks+SCA+Trivy), CodeQL Java+TS, Packaging Docker. **Mergee le 2026-06-10T17:05Z, merge commit `8dbf44e`, branche supprimee.** RLS desormais reellement exercee dans les tests d'integration. | `main`, PR #18 | jptshilombo / Claude Code |
| 2026-06-11 | Correctif gate Trivy — patch openssl image API (PR #20) | Gate Securite rouge sur toute PR (echec deterministe, 2 runs identiques sur la PR #19) : CVE-2026-45447 (HIGH) sur openssl/libcrypto3/libssl3 3.5.6-r0 de l'image de base `eclipse-temurin:21-jre-alpine` (Alpine 3.23.4), correctif 3.5.7-r0 disponible dans les depots Alpine mais image upstream non reconstruite. Mini Plan Niveau 1 approuve par le PO : `RUN apk -U upgrade --no-cache` a l'etape run, verifie localement (paquets passes en 3.5.7-r0). CI PR #20 verte 13/13, **mergee le 2026-06-11, merge commit `98bbf41`, branche supprimee.** | `backend/Dockerfile`, PR #20 | jptshilombo / Claude Code |
| 2026-06-11 | PR #19 mergee dans `main` (CI verte) | Branche `docs/project-state-post-merge-double-datasource` -> `main` via PR #19 (synchro post-merge tests double datasource). Echec initial du gate Securite cause par CVE-2026-45447 (image de base, sans rapport avec le contenu doc-only de la PR) ; apres merge du correctif PR #20, branche mise a jour avec `main` puis les 13 checks verts. **Mergee le 2026-06-11T08:08Z, merge commit `6a46b4c`, branche supprimee.** | `docs/project-state.md`, PR #19 | jptshilombo / Claude Code |
| 2026-06-11 | PR #21 mergee dans `main` (CI verte) | Branche `docs/project-state-correctif-trivy-pr20` -> `main` via PR #21 (consignation du correctif gate Trivy / CVE-2026-45447). Les 13 checks verts. **Mergee le 2026-06-11T08:24Z, merge commit `01b8d3f`, branche supprimee.** | `docs/project-state.md`, PR #21 | jptshilombo / Claude Code |
| 2026-06-11 | Execution smoke test runtime stack complete | Stack Docker Compose complete montee sur volume vierge (image API patchee PR #20, cert TLS auto-signe SAN localhost — mkcert absent, parade openssl du plan) : Flyway V1-V10 en admin, pool JDBC sous `loyertracker_api` (`pg_stat_activity`, NOSUPERUSER/NOBYPASSRLS), JWT reels Keycloak via Nginx TLS (issuer public), parcours S01->S04 complet (inscription 201, bien, bail, invitation -> acceptation 201 via Admin API reelle avec creation du compte Keycloak, affectation 8 %, batch echeances SECURITY DEFINER 9 creees/6 EN_RETARD, pointage RECU, honoraire 72,00 EUR sur la periode pointee, PAYE bailleur / 403 gestionnaire, 6 alertes dont PREAVIS a J+75, audit 200 bailleur / 403 gestionnaire), isolation cross-tenant live (2e bailleur : 0 bien, 0 alerte, 403 acces directs), 401 sans token, ports internes non publies. **46 PASS / 0 FAIL** en 2 passages (rejouabilite prouvee, inscription 409 en re-run) ; echafaudage `directAccessGrants` revoque par `trap` ; aucun ecart applicatif — seuls 3 ajustements du script (triage : cause harnais a chaque fois). | `infra/smoke/smoke-stack.sh`, `docs/cgpa/07-devsecops/rapport-smoke-test-stack-complete.md` | Claude Code |
| 2026-06-11 | PR #22 mergee dans `main` (CI verte) | Branche `chore/smoke-test-stack-complete` -> `main` via PR #22 (smoke test runtime stack complete). Les 13 checks verts : Backend, Frontend, Securite (gitleaks+SCA+Trivy), CodeQL Java+TS, Packaging Docker. **Mergee le 2026-06-11T08:53Z, merge commit `813b6d9`, branche supprimee.** Tous les suivis techniques de la remediation RLS sont soldes. | `main`, PR #22 | jptshilombo / Claude Code |
| 2026-06-12 | Execution + merge lot 1 Production Readiness — CD/GHCR (PR #24) | Job Packaging Docker etendu : push `loyertracker-api`/`loyertracker-web` vers `ghcr.io/<owner>` sur push `main` uniquement (`packages:write` via `GITHUB_TOKEN`), tags immuables `sha-<8>` + `latest` ; scan Trivy de l'image web ajoute au gate Securite ; `frontend/Dockerfile` `apk -U upgrade` (parite image API). CI verte. **Mergee le 2026-06-12T07:16Z, merge commit `321e195`, branche supprimee.** | `.github/workflows/ci.yml`, `frontend/Dockerfile`, PR #24 | jptshilombo / Claude Code |
| 2026-06-12 | Execution + merge lot 2 Production Readiness — staging durci (PR #25) | `docker-compose.staging.yml` (web/Nginx non-root, SPA reelle servie, images consommees depuis GHCR) ; durcissement `frontend/Dockerfile`, `infra/nginx/nginx.conf`, certs. CI verte. **Mergee le 2026-06-12T08:04Z, merge commit `2403e34`, branche supprimee.** | `docker-compose.staging.yml`, `docker-compose.yml`, `frontend/Dockerfile`, `infra/nginx/*`, PR #25 | jptshilombo / Claude Code |
| 2026-06-13 | Execution + merge lot 3 Production Readiness — backup/restore (PR #26) | `infra/backup/backup-postgres.sh` (`pg_dump -Fc` base complete app + Keycloak, `pg_dumpall --globals-only` roles cluster, verif integrite `pg_restore --list`, retention 7 quotidiennes + 4 hebdomadaires, perms `600`/`700` hors depot) + `infra/backup/restore-postgres.sh` (restauration orchestree destructive a confirmation, `--yes` pour drill) ; **drill de restauration reel execute** (RPO 24 h / RTO < 1 h). CI verte. **Mergee le 2026-06-13T06:49Z, merge commit `1ed1080`, branche supprimee.** | `infra/backup/backup-postgres.sh`, `infra/backup/restore-postgres.sh`, PR #26 | jptshilombo / Claude Code |
| 2026-06-13 | Reprise CGPA v5.0.1 + resync Production Readiness lots 1-3 | Reprise officielle v5.0.1 (`Resume Approved with Reservations`) : controles de continuite PASS, aucun gate rejoue. Bloc `framework:` ajoute (`current_version 5.0.1`, `migrated_from 3.0.1`) ; §2/§5/§9/§10/§11/§13/§14 resynchronisees avec les lots 1-3 ; score Exploitation 1/4 -> 2/4 (global 22 -> 23/32). | `docs/project-state.md` | Claude Code |
| 2026-06-13 | Execution + merge lot 4a Production Readiness — observabilite/runbook/cron (PR #28) | Dependance `micrometer-registry-prometheus` + exposition `health,info,prometheus` ; Nginx `/healthz` (200) et blocage public de `/api/actuator/prometheus` (404) ; healthcheck nginx compose ; installateur de cron idempotent + runbook. Faux positif gitleaks (URL de service interne) resolu par annotation `gitleaks:allow` nee dans le commit d'origine. CI verte. **Mergee le 2026-06-13, merge commit `4e0d399`.** | `backend/pom.xml`, `backend/.../application.yml`, `infra/nginx/nginx.conf`, `docker-compose*.yml`, `infra/backup/install-cron.sh`, `docs/cgpa/07-devsecops/runbook-exploitation.md`, PR #28 | jptshilombo / Claude Code |
| 2026-06-14 | Execution + merge lot 4b Production Readiness — deploiement staging reel + smoke (PR #29) | Deploiement reel sur hote partage `ai-test-server` (stack isolee `loyertracker-staging`, image GHCR `sha-4e0d3995`, ports 18080/18443, issuer portless confirme). Smoke contre staging **46 PASS / 0 FAIL**. 4 ecarts trouves et corriges : healthcheck Nginx IPv6 (`127.0.0.1`), smoke issuer via `KEYCLOAK_ISSUER_URI`, smoke detection de port (`invalid IP:0`), securite `/api/actuator/prometheus` au `permitAll` + test de regression (`SecurityIntegrationTest` 6/6). `docs/staging-state.md` cree, Gate Staging Readiness GO. CI verte. **Mergee le 2026-06-14, merge commit `e706721`.** | `docker-compose*.yml`, `infra/smoke/smoke-stack.sh`, `backend/.../SecurityConfig.java`, `backend/.../SecurityIntegrationTest.java`, `docs/staging-state.md`, PR #29 | jptshilombo / Claude Code |
| 2026-06-14 | Redeploiement staging post-merge + confirmation live du correctif securite | Apres merge PR #29, CI `main` publie `sha-e7067215` sur GHCR ; stack staging redeployee avec ce tag (4/4 healthy). Scrape Prometheus interne **200** (tag `application="loyertracker-api"`), public **404** ; smoke re-execute **46 PASS / 0 FAIL** sur la nouvelle image. Residu du Gate clos : zero reserve. | (deploiement staging, `.env` hote ; aucun fichier source) | Claude Code |
| 2026-06-14 | Realignement du tag staging sur `main` HEAD (`sha-26f16caa`) | Apres merge des PR doc-only #31 (runbook) / #32 (re-confirmation reprise v5.0.1) puis #33 (staging-state), CI publie `sha-26f16caa` sur GHCR (api+web). Stack staging redeployee avec ce tag (4/4 healthy), **smoke 46 PASS / 0 FAIL**, scrape Prometheus interne **200** / public **404**. Delta depuis `sha-e7067215` = **documentation uniquement** (images api/web fonctionnellement identiques) : le redeploiement maintient la tracabilite « tag deploye = `main` HEAD », sans changement fonctionnel. Historique des redeploiements consigne en §8 de `docs/staging-state.md` (PR #33, merge `0686a6f`). | `docs/staging-state.md` (deploiement staging, `.env` hote ; aucun fichier source) | Claude Code |
| 2026-06-16 | Correctif gate Trivy / CVE Angular — bump 20.3.25 (PR #36) | Gate Securite rouge en post-merge sur `main` (runs #34 `8a7fc86f` et #35 `9cf412ac`) : Trivy scan npm `exit-code 1` sur 3 CVE HIGH (CVE-2026-54266/54268 `@angular/common`, CVE-2026-54267 `@angular/core`), `Packaging Docker` `skipped` -> aucune image publiee pour ces SHA. Mini Plan Niveau 1 : bump coordonne de la ligne framework Angular 20.3.24 -> 20.3.25 + `package-lock` regenere, aucun changement applicatif. Local : `ng lint`/`ng build --configuration production` verts, `ng test` 27/27. CI PR #36 verte ; **mergee le 2026-06-16, merge commit `73359c5`** ; CI post-merge `main` verte (Securite pass, Packaging Docker execute) -> **image GHCR `sha-73359c5c` republiee** (+ `latest`). | `frontend/package.json`, `frontend/package-lock.json`, PR #36 | jptshilombo / Claude Code |
| 2026-06-16 | PR #36 mergee dans `main` (CI verte) | Branche `fix/trivy-angular-cve` -> `main` via PR #36 (correctif gate Trivy / CVE Angular). Tous les checks verts ; CI post-merge `main` (`73359c5c`) verte avec republication GHCR. **Mergee le 2026-06-16T08:56Z, merge commit `73359c5`.** | `main`, PR #36 | jptshilombo / Claude Code |
| 2026-06-16 | Redeploiement staging sur `sha-73359c5c` + synchro docs (PR #37) | Stack staging redeployee avec `sha-73359c5c` sur `ai-test-server` (4/4 healthy, smoke 46/0, scrape 200/404). `docs/staging-state.md` §8 mis a jour : ligne `sha-73359c5c` completee. **Mergee le 2026-06-16, merge commit `d0c6d62` (PR #37, branche `docs/staging-redeploy-73359c5c`).** | `docs/staging-state.md`, PR #37 | jptshilombo / Claude Code |
| 2026-06-16 | Correctif `server_name` Nginx pour exposition publique (PR #39) | `infra/nginx/nginx.conf` : `server_name` etendu (`localhost loyertracker.staging.loyerpro.org _`) pour accepter les requetes du reverse proxy nginx-proxy-manager avec `Host: loyertracker.staging.loyerpro.org`. Applique a chaud dans le conteneur vivant (`nginx -s reload`). **Mergee le 2026-06-16, merge commit `c7604b7` (PR #39, branche `fix/nginx-server-name-public-domain`).** | `infra/nginx/nginx.conf`, PR #39 | jptshilombo / Claude Code |
| 2026-06-16 | Documentation exposition publique staging (PR #40) | `docs/staging-state.md` §2 (issuer public, ligne Exposition publique, .env 24 cles), §8 (sha-73359c5c avec exposition active), §9 (plan exposition publique EXPOSE le 2026-06-16, 6/6 criteres). Conflit de rebase resolu (suppression reference perimee `b095eff`, conservation du contenu exposition publique). **Mergee le 2026-06-16, merge commit `731b6ae` (PR #40, branche `docs/staging-exposition-publique`).** | `docs/staging-state.md`, PR #40 | jptshilombo / Claude Code |
| 2026-06-16 | Integration SonarQube dans le pipeline CI (PR #42) | Analyse statique backend (Maven sonar:sonar, JaCoCo XML, projet `loyertracker-backend`) + frontend (sonarqube-scan-action@v6, lcov Karma, projet `loyertracker-frontend`) ; quality gate bloquant (`sonar.qualitygate.wait=true`) ; tokens dedies par projet (`SONAR_TOKEN` backend, `SONAR_TOKEN_FRONTEND` frontend). Correctifs en cours de PR : bump `@v5` -> `@v6` (vulnérabilite securite action), mapping `SONAR_TOKEN_FRONTEND` -> `SONAR_TOKEN` (nom impose par l'action). **Mergee le 2026-06-16, merge commit `2f7d76f` (PR #42, branche `feat/sonarqube-integration`).** | `.github/workflows/ci.yml`, `backend/pom.xml`, `frontend/karma.conf.js`, `frontend/sonar-project.properties`, PR #42 | jptshilombo / Claude Code |
| 2026-07-06 | Correctif CI — désynchronisation `codeql-action/init` vs `analyze` (PR #194) | La PR dependabot #193 (bump `codeql-action/analyze` 3.36.2 → 4.36.3) ne modifiait que l'étape `analyze`, laissant `init` épinglée en 3.36.2 : `analyze` refusait de charger la config générée par `init` (« Loaded a configuration file for version '3.36.2', but running version '4.36.3' »), faisant échouer systématiquement les deux jobs CodeQL (java-kotlin, javascript-typescript) sur PR #193, alors que Backend/Frontend/Sécurité/Packaging restaient SUCCESS. Correctif : les deux étapes de `.github/workflows/codeql.yml` réalignées sur le même commit v4.36.3 (`54f647b7e1bb85c95cddabcd46b0c578ec92bc1a`) ; confirmé qu'aucune autre référence à `codeql-action` n'existe ailleurs dans `.github/`. Fichier de workflow CI uniquement — aucun code applicatif, aucune migration, aucun impact Staging/Production. CI complète verte sur PR #194 (7/7 : Backend, Frontend, Sécurité gitleaks+SCA+Trivy, Packaging Docker, CodeQL java-kotlin + javascript-typescript). **Mergée le 2026-07-06T08:19:40Z, merge commit `60d0963`, branche `fix/ci-codeql-action-v4` supprimée.** PR dependabot #193 fermée automatiquement (obsolète). | `.github/workflows/codeql.yml`, PR #194 | jptshilombo / Claude Code |

## 13. Risques ouverts

| Risque | Niveau | Impact | Mitigation | Statut |
| ------ | ------ | ------ | ---------- | ------ |
| Documentation CGPA residuelle obsolescente | Mineur | Confusion possible sur quelques mentions historiques v1.0 | Corriger progressivement hors historique de decision | Ouvert |
| Admin API Keycloak gestionnaire KO en runtime | Majeur | US-12 echoue a l'acceptation invitation / creation gestionnaire | Corrige le 2026-06-09 : client confidentiel service account dedie `loyertracker-admin` (roles realm-management minimaux), secret injecte post-import hors depot, variables Admin API dans `api`. Reexecution R6 : token client_credentials 200, acceptation 201, gestionnaire cree + role assigne | Ferme |
| Tests d'autorisation incomplets sur futurs endpoints | Critique | Fuite cross-bailleur/cross-affectation | Imposer tests d'autorisation par endpoint dans S03+ ; ecritures d'affectation desormais couvertes | En reduction |
| Faille cross-bailleur sur `POST /affectations/{id}/revocation` (200 au lieu de 404/403) | Critique | Un bailleur pouvait revoquer l'affectation d'un autre bailleur | Corrige le 2026-06-08 (controle de propriete applicatif dans `AffectationService.revoquer`) + test de non-regression | Ferme |
| RLS contournee : l'API se connectait en SUPERUTILISATEUR (`POSTGRES_USER`) en test et en runtime | Majeur | Defense en profondeur (2e couche RLS, ADR-01) totalement inerte sur le chemin applicatif ; seule l'autorisation applicative cloisonnait | Diagnostic 2026-06-08 (cause = role superuser, pas la propagation du GUC). Corrige par migration V5 : role `loyertracker_api` LOGIN NOSUPERUSER NOBYPASSRLS + Flyway admin separe ; RLS prouvee sous ce role (`SchemaMigrationTest`) | Ferme (code + tests) |
| Comportement runtime sous le role restreint non verifie end-to-end | Mineur | Les tests `@SpringBootTest` tournaient en superuser ; un flux applicatif dependant implicitement du superuser serait passe inapercu | Smoke test runtime 2026-06-08 (app bootee en `loyertracker_api`, TRUNCATE/DDL refuses, isolation RLS live), conversion double datasource le 2026-06-10 (PR #18, merge `8dbf44e`), puis smoke test stack complete le 2026-06-11 (PR #22, merge `813b6d9`) : JWT reels Keycloak via Nginx, parcours S01->S04 et isolation cross-tenant live sous `loyertracker_api`, 46 PASS / 0 FAIL, script rejouable versionne | Ferme |
| Pas de Plan d'Execution pour le lot suivant (suivis techniques / lot fonctionnel) | Critique gouvernance | Codage non conforme CGPA v3.0.1 | Produire et faire approuver un Plan d'Execution avant tout nouveau code ; S03 (PR #7/#9) et S04 backend + frontend (PR #11/#12/#14/#16) ont ete couverts et integres | Ouvert (preventif) |
| Alerte PREAVIS (US-50) reportee : critere d'acceptation ambigu | Mineur produit | Couverture fonctionnelle des alertes incomplete | Critere fige par le PO le 2026-06-10 (bande de preavis 90 j, bornee `]J+60 ; J+90]`, exclusive de FIN_BAIL) puis implemente (V10, memes patrons que V9) et integre (PR #14, merge `0cd3539`) ; test d'integration dedie vert | Ferme |
| Frontend S04 non realise (honoraires/alertes/audit en backend seul) | Mineur produit | Fonctions S04 non exposees a l'IHM | Realise et integre le 2026-06-10 (PR #16, merge `99e3215`) : consoles honoraires/alertes/audit cablees aux 2 dashboards, `ng lint`/`ng build` verts, `ng test` 27 verts | Ferme |
| CVE-2026-45447 (HIGH, openssl) dans l'image de base API `eclipse-temurin:21-jre-alpine` | Majeur | Gate Trivy HIGH/CRITICAL rouge sur toute PR (echec deterministe) ; image API embarquant openssl 3.5.6-r0 vulnerable | Corrige le 2026-06-11 (PR #20, merge `98bbf41`) : `apk -U upgrade --no-cache` au build patche les paquets OS (3.5.7-r0) sans attendre l'image upstream ; protege aussi des prochaines CVE corrigees dans les depots Alpine avant reconstruction upstream | Ferme |
| CVE-2026-54266/54268 (`@angular/common`) + CVE-2026-54267 (`@angular/core`), HIGH | Majeur | Gate Securite (Trivy scan npm) rouge en post-merge sur `main` (runs #34/#35), `Packaging Docker` `skipped` -> aucune image GHCR publiee (chaine de livraison interrompue) | Corrige le 2026-06-16 (PR #36, merge `73359c5`) : bump coordonne de la ligne framework Angular 20.3.24 -> 20.3.25 (3 CVE corrigees en 20.3.25) ; `ng lint`/`ng build`/`ng test 27/27` verts ; CI post-merge `main` verte, image GHCR `sha-73359c5c` republiee | Ferme |
| Pas de staging/prod/CD/backup | Majeur | Non readiness production | Plan Production Readiness 4/4 lots livre (CD/GHCR PR #24, staging durci PR #25, backup/restore + drill reel PR #26, observabilite/runbook/cron PR #28, deploiement staging reel + smoke 46/0 PR #29). **Production reelle deployee le 2026-06-20** (Gate 10 GO) : hote dedie, `1.0.0` LIVE, smoke prod 46/0, alerting Discord prouve, backup operationnel + cron prod. Reste en exploitation : realm prod sans compte de test (**SG SSH restreint le 2026-06-20** : port 22 = `52.29.80.119/32` admin + `172.31.30.45/32` dev prive) | Ferme (production LIVE) |
| Reprise CGPA v5.0.1 : metadonnees migration et resync lots 1-3 (R-1/R-2) | Mineur gouvernance | Project State desynchronise de `main` (3 lots non consignes) ; bloc `framework:` absent | Resync §2/§5/§9/§10/§11/§12/§13/§14 + bloc `framework:` (current_version 5.0.1, migrated_from 3.0.1) le 2026-06-13 | Ferme |
| Decisions Production Readiness (registry GHCR/CD/strategie backup) non tracees au registre (R-3) | Mineur gouvernance | Choix structurants d'exploitation sans decision/ADR formelle | Entrees ajoutees au registre §11 (arbitrage PO + lots 1-3) ; ADR leger « exploitation/livraison » optionnel a cadrer si besoin | En reduction |
| Jalon Staging CGPA v4.0 non ouvert : `staging-state.md` absent, Gate Staging Readiness non prononce (R-4) | Mineur gouvernance | Obligation v4.0 non encore instanciee (legitime tant que staging non deploye) | `docs/staging-state.md` cree le 2026-06-14 (deploiement staging reel, smoke 46/0, 9/9 criteres) ; **Gate Staging Readiness prononce GO** ; correctif securite confirme live apres redeploiement `sha-e7067215` | Ferme |
| Interfaces frontend S02 minimales seulement | Mineur produit | Ergonomie suffisante pour reprise mais pas pour recette large | Prevoir ameliorations UX avant beta | Ouvert |
| OpenAPI S02 absent | Mineur | Contrat API moins explicite | Generer/documenter OpenAPI avant recette large | Ouvert |
| Continuite documentaire (R-V52-6) : HEAD `main` en avance sur `project-state.md` | Mineur gouvernance | PR #51 (Release Governance mergée) + PR #52→#55 (correctifs operationnels alerting) non consignes en §11/§12 | Reprise 2026-06-19 : §11 (merge PR #51), **§3B et §12 (PR #52→#55 = monitoring en overlay reutilisable, heritage projet, Alertmanager v0.28.1, webhook `url_file`)** consignes ; HEAD `main` `c587e39` entierement reflete | Ferme |
| Capacity production non evaluee formellement (RG-09-1) | Mineur exploitation | Pas de baseline de sizing ni de seuil de saturation teste pour l'hote dedie | **Levee au Gate 10** : baseline **actee** = `t3.medium` (2 vCPU / 4 GiB / 40 GiB gp3, cible PME de la check-list) ; **surveillance live active** (Prometheus : latence p99, pool Hikari, sondes blackbox). Revue de capacite en exploitation. `docs/prod-state.md` §10 | Ferme (surveillance continue) |
| Modele de support / astreinte informel (RG-09-2) | Mineur exploitation | Continuite de service dependante d'un operateur unique (PME) | **Levee au Gate 10** : canal **Discord** cable (`discord_configs`, secret hors depot) et **prouve bout-en-bout** (FIRING/RESOLVED recus, confirme PO) ; processus incident minimal documente (canal, contact PO, escalade mono-operateur). `docs/prod-state.md` §10 | Ferme |
| Tracabilite production non renseignee (RR-2) | Mineur gouvernance | Release-notes §5 (date/tag/operateur/verifications) non renseignee au go-live reel | **Levee au Gate 10 (2026-06-20)** : `docs/release-notes-v1.0.0.md` §5 renseignee + `docs/prod-state.md` cree (go-live `sha-73359c5c`, smoke 46/0, alerting prouve) | Ferme |
| Continuite documentaire (R-V52-7) : Project State en retard sur Quittances | Mineur gouvernance | PR #70/#71 puis PR #72 ont fait évoluer `main` avant la reprise documentaire complète | **Fermé le 2026-06-21** : `origin/main` resynchronisé (`d0bc1d6`, PR #73 mergée), §2/§3/§5/§11/§12/§13/§14 mis à jour et intégrés dans `main` | Ferme |
| Plan d'Execution non formalise en fichier dedie pour le lot « Quittances de loyer » (R-V52-8) | Mineur gouvernance | Arbitrages PO A/B/C/D attestes uniquement dans les messages de commit (`fd5a043`, `d6e76a7`), pas de fichier `docs/cgpa/...` dedie comme pour les lots precedents | A formaliser a posteriori si le lot s'etend ; sans impact bloquant, le cadrage gouverne est trace dans l'historique git | Ouvert |
| PR2 « Quittances de loyer » non mergee + modification locale non committee (R-V52-9) | Mineur livraison | Risque de livrer une branche fonctionnelle non intégrée | **Fermé le 2026-06-21** : PR #71 mergée, PR #72 mergée ensuite ; `feat/quittances-documents` alignée sur `origin/main`; aucune modification locale applicative restante ; `.claude/`/`.codex/` ignorés et `package-lock.json` racine parasite supprimé | Ferme |
| Algorithme de resolution priorite/exception Patrimoine non valide par le PO (RM-98, decision D-PAT-001) | Majeur gouvernance/securite | Si implemente sans validation explicite, risque de fuite cross-bien (mauvaise resolution `INCLUSION`/`EXCLUSION`) | **Tranche par le PO le 2026-06-21** : formule confirmee telle que proposee (patrimoine ∪ inclusion − exclusion, bien prioritaire) ; RS-04 EXCLUSION orpheline rejetee en 400, INCLUSION redondante toleree (idempotente). ADR-11/`securite-patrimoine.md`/`plan-execution-patrimoine.md` mis a jour | Ferme |
| Collision d'identifiants backlog US-70/71/72 (decision D-PAT-001 vs backlog Gate 5 deja valide) | Mineur gouvernance | Risque d'ecraser la tracabilite EP-08 (RGPD/securite) si la numerotation source US-70→75 etait reprise telle quelle | Renumerote en US-80→85 sous un nouvel Epic EP-09 (`addendum-patrimoine-backlog.md`) ; aucune modification du backlog valide | Ferme (par renumerotation) |
| Comportement d'archivage d'un Patrimoine avec affectation(s) patrimoine active(s) non tranche (RS-06, decision D-PAT-001) | Moyen gouvernance/securite | Affectation patrimoine orpheline possible si l'archivage n'etait pas controle (acces residuel non revoque) | **Tranche par le PO le 2026-06-21** : archivage rejete en 400 tant qu'une affectation patrimoine `ACTIVE` existe ; revocation explicite prealable requise (coherent EF-22). `securite-patrimoine.md`/`plan-execution-patrimoine.md`/addenda CDC et backlog mis a jour | Ferme |
| Migration des valeurs libres `Bien.type` existantes vers la typologie administrable (D-PAT-001) | Moyen donnee | Perte d'information si des valeurs saisies librement ne sont pas mappables vers la liste fermée | **Traitée au Sprint 1 (PR #72)** par la migration V12 et les tests associés ; à revalider en staging/prod lors de la prochaine promotion du lot `[Non publié]` | En surveillance |
| Correctif honoraires patrimoine codé et poussé hors Plan d'Exécution (R-S04-1, post-PR #75) | Mineur gouvernance | Écart de discipline CGPA (verrou « aucun code sans Plan d'Exécution approuvé ») ; risque de précédent si répété | **Fermé le 2026-06-23** : régularisé a posteriori par la PR #76 (revue complète, CI verte 13/13 dont CodeQL/Sécurité/Backend/Frontend/Packaging) ; migration V14 corrige le calcul (`calculer_honoraires()`) et la lecture (`HonoraireRepository.findByBien`) pour les affectations patrimoine. Leçon retenue : tout correctif applicatif, même mineur, doit être précédé d'un Plan d'Exécution avant push sur une branche partagée | Ferme |
| Smoke staging non re-vérifié après le correctif honoraires patrimoine (V14, PR #76) | Mineur exploitation | Les 4 FAIL observés lors du smoke PR #75 (43 PASS/4 FAIL) ne sont pas formellement reconfirmés résolus en conditions réelles de staging | **Fermé le 2026-06-23** : staging redéployé sur `sha-75473413` (PR #76) et smoke rejoué — honoraires patrimoine confirmés fonctionnels en live (46 PASS / 1 FAIL, le FAIL résiduel portant uniquement sur le compteur Flyway du script, corrigé via PR #77, revalidé 47 PASS / 0 FAIL) | Ferme |
| Compteur Flyway du smoke script resté à 13 après l'ajout de V14 (révélé par la re-vérification post-PR #76) | Mineur gouvernance/exploitation | `infra/smoke/smoke-stack.sh` n'a pas été mis à jour par la PR #76 (seuls `HonoraireRepository`/`V14`/`SchemaMigrationTest` l'avaient été) ; même nature que R-S04-1 | Corrigé via branche dédiée + PR #77 (`fix/smoke-flyway-v14`), CI verte 13/13, revalidé en conditions réelles (47 PASS/0 FAIL) avant push — procédure gouvernée respectée cette fois. **Mergée le 2026-06-23T13:33Z (`1d6db31`)**, staging resynchronisé | Ferme |
| `STG-ISOL-01` statué PASS sur preuves documentaires/historiques, sans confirmation live au moment d’un déploiement réel en présence d’un autre projet (RSV-STG-01, CGPA v5.4) | Mineur gouvernance | Le contrôle d’isolation Staging mutualisé repose sur l’analyse de configuration (`docker-compose.staging.yml`, runbook) et l’historique sans incident (6 redéploiements 2026-06-14→2026-06-24), pas sur une inspection directe de l’hôte au moment du contrôle | **LEVÉE le 2026-06-25** : déploiement `sha-5bf187af` — `docker ps` avant (session précédente) = 8 conteneurs `loyertracker-staging-*` ; après = 8 conteneurs `loyertracker-staging-*` — aucun autre projet affecté. Preuve live STG-ISOL-01 satisfaite. | Fermé |
| Collision future de namespace, réseau, volume ou port (RSV-STG-02) | Mineur exploitation | Une nouvelle stack pourrait entrer en conflit avec LoyerTracker ou un autre projet | Vérifier le nom Compose, les réseaux, volumes et ports dans la checklist canonique avant chaque promotion | En surveillance |
| Introduction future d’une commande Docker globale ou destructive (RSV-STG-03) | Majeur exploitation | Interruption ou suppression de ressources interprojets | Recherche obligatoire dans pipelines, scripts et runbooks ; `FAIL` impose `NO GO` | En surveillance |
| Dérive du reverse proxy ou de l’inventaire des ressources mutualisées (RSV-STG-04) | Mineur gouvernance | Routage erroné ou dépendance partagée non maîtrisée | Revue de `docs/staging-state.md` et du routage DNS à chaque changement d’infrastructure | En surveillance |
| 4 PR dependabot frontend bloquées par une montée de version Angular fragmentée (#186/#188/#189/#190) | Moyen technique | Dérive de sécurité npm si les bumps restent indéfiniment ouverts (CVE futures non absorbées) ; risque fonctionnel `OnPush` implicite non vérifié en conditions réelles | **Fermé le 2026-07-06** : sprint exécuté (PR #197, GO PO), bump coordonné mergé (`05a4f86`), vérification navigateur réelle du rendu post-upgrade PASS (dashboard bailleur, rechargement async sous `OnPush` confirmé fonctionnel). Les 4 PR dependabot deviennent obsolètes | Fermé |
| Portée globale du statut Gestionnaire (EP-15, RSV-EP15-01) : un bailleur ayant une relation avec un Gestionnaire partagé peut le suspendre/archiver/modifier son profil, affectant tous les autres bailleurs qui l'emploient, sans préavis pour eux | Majeur gouvernance/produit | Un bailleur B pourrait perdre l'accès d'un Gestionnaire encore activement affecté chez lui, suite à une action d'un bailleur A sans rapport | **Accepté par le PO le 2026-07-08** (ADR-16 D1) — mitigation : traçabilité complète (audit), portée à préciser au Plan d'Exécution EP-15 | Accepté (en surveillance) |
| Backfill V24 (EP-15) ne peut pas séparer fiablement nom/prénom depuis l'unique champ historique `bail.locataire_nom` (RSV-EP15-02) | Mineur donnée | Fiches Locataire migrées avec `prenom` vide | **Accepté** (ADR-16 D3) — correction manuelle possible sans impact fonctionnel, hors périmètre bloquant | Accepté (en surveillance) |
| Migration V24 (EP-15, bascule `Bail`→`Locataire`) non additive : rollback applicatif non viable, restauration de backup requise (RSV-EP15-03) | Majeur exploitation | Retour arrière impossible sans restauration si une anomalie est découverte après cette migration | **Accepté** (ADR-16 D3, même profil que `RSV-S9-03`/V20) — Préflight de la release concernée devra vérifier un backup post-migration immédiatement disponible | Accepté (en surveillance) |
| Asymétrie `BienService.archiver()` : aucune vérification d'affectation/bail actif avant archivage, contrairement à `PatrimoineService.archiver()` (RSV-EP15-04, découverte lors du cadrage EP-15) | Mineur technique | Un bien pourrait être archivé alors qu'un bail ou une affectation active le concerne encore | **Hors périmètre EP-15** — consigné comme dette technique existante, non corrigée silencieusement ; à traiter dans un lot dédié si le PO le priorise | Ouvert (dette connue) |
| Écart de traçabilité du déploiement `1.11.0` (EP-13) : Préflight PASS du 2026-07-16 concluait `PRODUCTION_DEPLOYED` non atteint, mais le déploiement technique a réellement eu lieu sans rapport écrit, et le Sprint C EP-15 a démarré le lendemain sans que ce chaînon soit refermé | Majeur gouvernance | Base de rollback/Gate Production erronée si non corrigée (`1.10.0` au lieu de `1.11.0` réellement en Production) ; confusion possible entre clôture de Sprint et autorisation Production | **Fermé le 2026-07-19** : détecté par contrôles lecture seule contredisant la doc (`sha-cba13f52`, Flyway 25/25 en Production réelle), régularisé a posteriori — déploiement technique constaté + validation finale rejouée (62/0) + nettoyage transactionnel, cf. `deploiement-technique-v1.11.0-report.md`/`validation-finale-v1.11.0-report.md`/`prod-state.md` §0L. **Leçon retenue** : après un Préflight PASS, rédiger le rapport de déploiement technique et la validation finale dans la même session que la bascule du tag `.env`, avant tout démarrage d'un nouveau Sprint — même principe que `R-S04-1` | Fermé |
| Hypercare continue T0/T+12/T+24 non observable pour `1.11.0` (conséquence de l'écart ci-dessus) | Mineur exploitation | Absence de fenêtre de surveillance continue post-déploiement documentée pour cette release | **Accepté** : hôte intentionnellement éteint entre les sessions (produit non annoncé publiquement, cf. mémoire projet) — le contrôle lecture seule du 2026-07-19 (J+3, 0 alerte/0 5xx/`restart=0`/baseline inchangée) est retenu comme preuve de stabilité substitutive ; aucune clôture CDO formelle de release prononcée pour `1.11.0` | Accepté (en surveillance) |
| 4 alertes Dependabot ouvertes sur `main` (2026-07-19) : `webpack-dev-server@5.2.3` (2× medium, GHSA-79cf/GHSA-mx8g), `uuid@8.3.2` (medium, GHSA-w5hq), `@babel/core@7.29.0` (low, GHSA-4x5r) | Mineur sécurité | Toutes transitives de `@angular-devkit/build-angular` (devDependency) — `webpack-dev-server`/`uuid` (via `sockjs`) n'interviennent que dans `ng serve`, jamais dans le bundle `ng build --configuration production` ni l'image Docker `loyertracker-web` ; aucune ne dépasse le seuil HIGH/CRITICAL bloquant de ce dépôt | **Accepté par le PO le 2026-07-19** : aucune exposition Production réelle, bump `@angular-devkit/build-angular` vers `22.0.7` (dernière stable vérifiée) ne corrigerait que l'alerte `@babel/core` — `webpack-dev-server` y reste épinglé en `5.2.3` ; les 3 alertes medium restent en attente d'un futur bump amont d'Angular. Surveillance : revoir au prochain bump Angular coordonné (même patron que #186/#188/#189/#190) | Accepté (en surveillance) |
| Continuité documentaire (R-V54-1) : §14 « Prochaine action claire » resté au Préflight `1.11.0` du 2026-07-16 alors que §1/§3A/§11/§12 étaient tenus à jour jusqu'au 2026-07-27 | Mineur gouvernance | La section censée porter l'action immédiate désignait un jalon dépassé de trois releases (`1.11.0` → `1.12.0` → `1.13.0` LIVE, `1.14.0` Préflight PASS) ; risque de reprise de session sur une base d'action périmée, même nature que R-V52-6/R-V52-7 | **Fermé le 2026-07-27** : §14 resynchronisé additivement à partir des faits déjà tracés en §11/§12 (régularisation `1.11.0`, Release `1.12.0` clôturée, Release `1.13.0` clôturée et LIVE, Sprint N+1 et Préflight `1.14.0` PASS, lots de maintenance CI/dépendances), suivi d'un bloc « Prochaine action claire au 2026-07-27 ». Aucune décision, Gate ou risque historique modifié ou supprimé. Le même écart a été constaté sur le **§3** (« Décision actuelle » et « Gates transverses statués » restés au 2026-06-23) et corrigé dans la même session : décision courante réécrite au 2026-07-27, décision de 2026-06-23 conservée en « Décision antérieure », cadence de Gates par Sprint depuis le go-live ajoutée, « Justification » prolongée en continuation | Fermé |
| **RÉCIDIVE** de l'écart de traçabilité de déploiement (R-V54-2) : déploiement technique `1.14.0` réellement exécuté le 2026-07-24 ~12:48 UTC (bascule `.env` + recréation `api`/`nginx` + migration V28), ~4 min après le Préflight, **sans rapport écrit** ; détecté seulement le 2026-07-27 aux contrôles d'entrée d'un déploiement qui n'avait donc plus lieu d'être | **Majeur gouvernance** | Deuxième occurrence du même écart après `1.11.0` (fermé le 2026-07-19) : la leçon écrite n'a pas suffi. Conséquences réelles ici : (1) la Production a tourné **3 jours sur une release jamais validée fonctionnellement** (smoke ≥63 non exécuté, condition 6 du Gate Production non satisfaite) ; (2) la documentation de gouvernance — §1/§3/§3A/§14 du Project State, `prod-state.md` — a désigné pendant 3 jours une Production `1.13.0` alors que `1.14.0` tournait, faussant la base de rollback et l'état de release ; (3) la resynchronisation documentaire du 2026-07-27 (R-V54-1), fidèle aux traces existantes, a propagé cette information périmée jusque dans `main` (PR #271) avant que le réel ne soit constaté | **Ouvert — mesure contraignante à arbitrer par le PO.** Régularisé a posteriori le 2026-07-27 (`deploiement-technique-v1.14.0-report.md`, `prod-state.md` §0O) : conformité technique intégrale vérifiée, K8/ADR-18 respecté, aucun envoi externe (Outbox/Delivery à 0 malgré 17 événements). **`PRODUCTION_DEPLOYED` volontairement non prononcé** tant que le smoke n'est pas rejoué — même exigence que pour `1.11.0`. La leçon écrite de `1.11.0` étant démontrée insuffisante, une mesure **structurelle** est requise plutôt qu'une nouvelle leçon : pistes à trancher — (a) faire écrire le tag courant et le compteur Flyway attendus dans un fichier d'état versionné, contrôlé par le smoke et par la CI ; (b) ajouter au script de déploiement une garde refusant la bascule tant que le fichier de rapport de la release n'existe pas ; (c) contrôle d'entrée systématique de l'état réel de l'hôte **avant** toute rédaction ou mise à jour du Project State portant sur la Production. **Leçon transverse déjà acquise et confirmée par cet épisode : ne jamais déduire l'état de la Production de la documentation — le vérifier sur l'hôte**. **ARBITRAGE PO DU 2026-07-27 : option (a) retenue** — fichier d'état de release versionné (`infra/release/production-state.env`) contrôlé par la CI, par le smoke et par un contrôle de dérive dédié. Plan d'Exécution formalisé (`docs/cgpa/06-planification-agile/plan-execution-rv542-verrou-etat-release.md`, Niveau 1) : il traite du même coup la douleur récurrente du compteur Flyway codé en dur à trois endroits (`smoke-stack.sh:92` ×2, `SchemaMigrationTest.java:72`, incidents PR #77/#171). **Limite assumée et tracée** : la CI n'ayant aucun accès à l'hôte, la dérive est détectée au **premier contrôle suivant**, pas en temps réel — la fenêtre d'aveuglement passe de « indéfinie, découverte fortuite » à « prochain contrôle », et l'oubli devient impossible à ignorer puisqu'il fait échouer le smoke. **FERMÉ le 2026-07-27** — GO PO explicite reçu sur le Plan d'Exécution puis lot livré et éprouvé le jour même. Mécanisme en service : `infra/release/production-state.env` (source de vérité versionnée) + `infra/release/check-release-state.sh` (`--ci` cohérence du dépôt, `--host` déclaré vs réel, tous deux strictement en lecture seule), étape CI bloquante dans le job Backend, lecture du compteur par `smoke-stack.sh` et `SchemaMigrationTest`, contrôle de dérive du tag par le smoke en Production, et contrôle d'entrée ajouté en tête des checklists Gate Production (`--host`) et Gate Staging (`--ci`). **Critères de fermeture tous satisfaits** : `--ci` vert (5 contrôles) ; **`--ci` rouge prouvé sur trois divergences simulées** (compteur désaligné, tag `latest`, version désynchronisée du CHANGELOG), fichier restauré à l'identique après chaque essai ; **`--host` vert contre la Production réelle** (tag `sha-27dce09d`, Flyway 28, digests `api`/`nginx` cohérents), résidu temporaire supprimé de l'hôte ; `mvn verify` vert ; **plus aucun compteur Flyway codé en dur** (3 occurrences supprimées). Critère « smoke rejoué contre Staging » **déclaré non applicable et justifié** par arbitrage PO : la non-régression du compteur est déjà couverte par `mvn verify` et `--ci`, mobiliser l'hôte Staging mutualisé et une séquence `STG-ISOL-01` complète pour un lot d'outillage sans impact fonctionnel serait disproportionné. **Limite résiduelle assumée et tracée** : la CI n'ayant aucun accès à l'hôte, la dérive est détectée au premier contrôle suivant et non en temps réel — l'extension identifiée (agent poussant l'état vers le Pushgateway existant + alerte Alertmanager) reste un lot ultérieur non planifié | **Fermé** |

## 14. Prochaine action claire

Le **plan Production Readiness en 4 lots est livre et integre dans `main`** : lot 1 CD/GHCR + scan Trivy web (PR #24, `321e195`) ; lot 2 staging durci non-root sur images GHCR (PR #25, `2403e34`) ; lot 3 backup/restore prouve par un drill reel — RPO 24 h / RTO < 1 h (PR #26, `1ed1080`) ; lot 4a observabilite (Prometheus interne, `/healthz`) + runbook + cron installable (PR #28, `4e0d399`) ; lot 4b **deploiement staging reel** sur hote partage + smoke contre staging **46/0** (PR #29, `e706721`). Le **Gate Staging Readiness (CGPA v4.0) est prononce GO** (`docs/staging-state.md`, 9/9 criteres), reserve R-4 levee. Le staging est desormais **expose publiquement** sur **`https://loyertracker.staging.loyerpro.org`** depuis le 2026-06-16 (cert Let's Encrypt valide jusqu'au 2026-09-14, Access List basic-auth `staging`, 6/6 criteres §9 verts) — tag deploye : `sha-73359c5c`. Score Exploitation 3/4 (global 24/32).

**Release `1.0.0` Release-Ready** : Gate 06A GO, **Gate Staging enrichi GO**, **Gate 07A GO sous reserve** (RR-1 levee le 2026-06-19 ; alerting OBS-02/03 valide en conditions reelles sur staging — `docs/staging-state.md` §10). Seule reserve residuelle : **RR-2** (tracabilite production), a renseigner au go-live reel.

**Cap go-live engage (arbitrage PO 2026-06-19, Plan d'Execution Gates 09/10 approuve)** : cible Production = **hote dedie** distinct de staging (ENV-01 strict), recette par **waiver trace**. **Gate 09 — Production Readiness statue GO sous reserve le 2026-06-19** (review 19/24 Solide ; reserves RG-09-1 capacity, RG-09-2 support, RR-2 tracabilite) — `docs/cgpa/09-production/`.

**Gate 10 — Mise en production statue GO le 2026-06-20.** La release **`1.0.0` (`sha-73359c5c`) est LIVE** sur **`https://loyertracker.loyerpro.org`** (hote dedie EC2 `t3.medium`, TLS Let's Encrypt exp. 2026-09-17). Go-live execute en mode « commandes cote hote » : 4/4 healthy, Flyway V1→V10, pool `loyertracker_api` ; **smoke prod 46/0** ; overlay monitoring **5/5 cibles `up`** ; **incident simule** `Gate10NotificationDrill` **FIRING+RESOLVED livres a Discord** (`notifications_total=2`/`failed=0`, reception PO confirmee) ; backup `-Fc` verifie `pg_restore --list` + cron prod 02h15 ; **durcissement** : reset propre (base **vierge**, 0 ligne metier) + compte de test `bailleur-test@test.local` **desactive**. 3 ecarts go-live corriges (compose prod jamais deploye) : ports nginx `!override` (PR #60), Keycloak `start` sans `--optimized` (PR #61), receiver Alertmanager `discord_configs` (PR #62). **Reserves RR-2 / RG-09-1 / RG-09-2 levees.** Detail : `docs/prod-state.md`, `docs/cgpa/10-mise-en-production/gate-10-decision.md`.

**Prochaine etape CGPA immédiate : décision de promotion staging ou cadrage Sprint 3 Patrimoine.** Sprint 1 Patrimoine est clôturé dans `main` via PR #73 (`d0bc1d6`) et Sprint 2 Patrimoine backend-first est clôturé via PR #74 (`ed448b8`, CI GitHub SUCCESS : Backend, Frontend, Sécurité, Packaging Docker, CodeQL). Le lot Patrimoine reste `[Non publié]` tant qu'une décision de promotion/release n'est pas prise. Action immédiate recommandée : choisir explicitement entre promotion staging du tag issu de `main` + smoke staging, ou préparation du plan Sprint 3 (`EXCLUSION` complète / UX avancée). En parallèle exploitation (hors gate) : revue de capacité, drill de rollback significatif à la prochaine release, et maintien du realm production sans compte de test. Discipline maintenue : Project State après chaque étape significative.

**Reprise CGPA v5.2 du 2026-06-23 — état post-merge PR #74 : `Resume Approved`.** `origin/main` est à `ed448b8` (merge PR #74) et la branche locale `main` est alignée. Quittances de loyer (`PR #70` + `PR #71`), Sprint 1 Patrimoine (`PR #72` + clôture PR #73) et Sprint 2 Patrimoine backend-first (`PR #74` + clôture documentaire) sont intégrés côté `main`. Action immédiate autorisée : décision PO/technique de promotion staging ou cadrage Sprint 3. R-V52-8 reste ouverte mineure pour formalisation a posteriori éventuelle du plan Quittances.

**Reprise CGPA du 2026-06-23 (suite) — synchronisation post-merge PR #75/#76 : réserve R-S04-1 fermée.** `origin/main` est désormais à `7547341` (merge PR #76, suivi de PR #75) ; la branche locale `main` a été réalignée (ref simplement périmé, aucune divergence réelle). Le smoke-staging réaligné sur V13+patrimoine (PR #75) avait révélé un écart fonctionnel (43 PASS/4 FAIL : honoraires non calculés sur affectation patrimoine) ; corrigé par la migration V14 (PR #76, CI verte 13/13). La réserve de gouvernance R-S04-1 (correctif poussé hors Plan d'Exécution) est régularisée a posteriori et fermée. **Reste à faire avant toute décision de promotion staging/release ou cadrage Sprint 3** : redéployer le tag `7547341` sur staging et rejouer le smoke (0 FAIL attendu) pour confirmer la correction en conditions réelles.

**Reprise CGPA du 2026-06-23 (suite 2) — re-vérification du smoke staging réalisée : confirmation fonctionnelle, écart cosmétique régularisé via PR #77.** Staging redéployé sur le tag `sha-75473413` (PR #76) : 4/4 services `healthy`, smoke rejoué — **honoraires patrimoine confirmés fonctionnels en conditions réelles** (46 PASS / 1 FAIL). L'unique FAIL est le compteur Flyway du script (`13` au lieu de `14`, V14 non répercutée par la PR #76) ; corrigé via une branche dédiée et la **PR #77** (procédure gouvernée respectée : pas de push direct), revalidé en conditions réelles avant push (**47 PASS / 0 FAIL**), CI verte 13/13. **PR #77 mergée le 2026-06-23T13:33Z (`1d6db31`)** ; staging resynchronisé sur ce HEAD. Le prérequis de re-vérification est désormais **pleinement satisfait** : la décision de promotion staging/release ou de cadrage Sprint 3 peut être prise sans réserve résiduelle.

**Migration CGPA v5.4 du 2026-06-24 — Gouvernance Staging partagé : `GO sous réserve`.** L'audit constate que LoyerTracker partage l'hôte Staging `ai-test-server` avec d'autres projets ; le nouveau Gate bloquant `STG-ISOL-01` est statué **PASS** sur la base de l'architecture déjà en place (namespace Docker, réseau/volume dédiés, ports paramétrables, reverse proxy par nom DNS, absence de commande Docker globale) et de l'historique opérationnel sans incident depuis le 2026-06-14. Aucun Gate, décision ou risque historique rejoué ou supprimé. Réserve non bloquante : confirmation live de l'isolation (RSV-STG-01) au prochain déploiement Staging réel. Détail : §16 et `docs/cgpa/migration/migration-report-v5.4.md`.

**Sprint 11 (EP-14a) du 2026-07-05 — Socle quittance certifiée + redesign PDF : développement terminé, PR ouverte.** Branche `feat/sprint11-ep14a`, conforme au Plan d'Exécution EP-14 approuvé (PR #182). Livré : migration **V22** (`quittance` versionnée + `quittance_numerotation` par bailleur+année + `quittance_verification_log`, RLS FORCE, fonctions `SECURITY DEFINER` préparant le Sprint 12 — un défaut `CHAR(64)` vs validation Hibernate corrigé en `VARCHAR(64)` avant tout déploiement) ; `QuittanceCertifieeService` (émission idempotente par empreinte métier, ré-émission version N+1 chaînée `remplacee_par`, annulation auditée, numéro `QT-YYYY-NNNNNN` jamais réutilisé) ; `TokenQuittanceService` (HMAC-SHA256, `QUITTANCE_HMAC_SECRET` hors dépôt + `token_kid`) ; QR ZXing data-URI ; gabarit PDF A4 professionnel (logo, badge certifié, cachet, mentions) avec thème injectable et scellement PAdES-ready ; extension export RGPD (métadonnées + contenu canonique, jamais le PDF). Contrat HTTP `GET .../quittance` inchangé, avis d'échéance intact (arbitrage C maintenu — ADR-15 D1). Tests : payload canonique verrouillé octet à octet, token (forge/troncature/rejets), gabarit HTML, intégration complète (émission/hashs, idempotence, ré-émission, annulation, RLS 404 indifférencié, concurrence de numérotation 2 threads → numéros distincts) — `mvn verify` **156/156 verts**, `ng test` **85/85 verts**. Câblage exploitation livré avec le lot : `QUITTANCE_HMAC_SECRET`/`QUITTANCE_TOKEN_KID`/`QUITTANCE_VERIFY_BASE_URL` dans les Compose base+staging et `.env.example` (à renseigner dans le `.env` des hôtes au préflight), compteur Flyway du smoke aligné à 22 dans la même PR que sa migration (leçon PR #77/#171). V22 additive : rollback applicatif seul (critère GO). **Le QR imprimé pointe vers `/verify/receipt/{id}` livré au Sprint 12 : promotion Production interdite avant la release unique `1.9.0`** (ADR-15 K5) ; Gate Staging du sprint (dont `STG-ISOL-01` et alignement du compteur Flyway smoke à 22) à instruire après merge.

**Clôture Sprint 11 (EP-14a) du 2026-07-05 — PR #183 mergée : `CLOSE`, lot `[Non publié]` dans `main`.** **PR #183 mergée le 2026-07-05T21:30+01:00 (`eddc037`)**, CI verte 7/7 checks (Backend, Frontend, Packaging Docker, Sécurité gitleaks+SCA+Trivy, CodeQL java/js) et Quality Gate SonarQube pré-validé PASS sur l'instance réelle (`new_coverage` 89,4 % ≥ 80, 0 violation nouvelle) ; branche locale `main` alignée sur `origin/main`. Critères GO du sprint tous satisfaits côté code (tests, contrat conservé, V22 rollback applicatif seul).

**Gate Staging Sprint 11 (EP-14a) + Sprint Angular 20→22 du 2026-07-06 — GO, `STAGING_DEPLOYED`.** Tag `sha-9713fdaa` déployé sur `ai-test-server` (lot combiné : `main` HEAD ayant avancé entre la clôture Sprint 11 et l'instruction de ce Gate, avec le sprint Angular 22 entre-temps mergé — même pattern que le Gate combiné CORS+Sprint 3). Préflight `QUITTANCE_HMAC_SECRET` exécuté, `STG-ISOL-01` PASS avant/après, Flyway 22/22, smoke 59/0, **rendu PDF certifié vérifié visuellement** (conforme). Décision : `docs/cgpa/07-devsecops/gate-staging-sprint11-ep14a-v5.4.1-decision.md`.

**Gate Production Sprint 11 (EP-14a) + Angular 22 du 2026-07-06 — NO GO, bloqué par construction (ADR-15 K5).** Checklist Gate Production intégralement instruite sur le candidat `sha-9713fdaa` : toutes les preuves techniques et Staging sont PASS, **aucune anomalie technique** — le blocage est une conséquence directe et déjà connue de la décision de gouvernance actée au kickoff EP-14 (release Production unique `1.9.0`, Sprint 11 + Sprint 12 combinés, car le QR de vérification imprimé sur chaque quittance ne fonctionnera qu'une fois la page publique du Sprint 12 livrée). Décision : `docs/cgpa/09-production/gate-production-sprint11-ep14a-decision.md`. Production reste en `1.8.0` (`sha-2c5f43c7`), inchangée. **Point ouvert pour le PO (RSV-PROD-EP14-02)** : le sprint Angular 22, sans blocage propre, est techniquement empilé après Sprint 11 sur `main` et hérite donc du même verrou — à trancher explicitement (attendre `1.9.0` par défaut, ou cadrer un cherry-pick exceptionnel isolé de l'upgrade Angular seule). **Prochaine étape CGPA immédiate : cadrage/démarrage du Sprint 12 (EP-14b — API/page publiques `/verify/receipt/:id`, observabilité, rate-limit nginx ; plan déjà approuvé PR #182)**, seul chemin normal vers un futur Gate Production `1.9.0` unique. PR dependabot `#190` (eslint 9→10) laissée en l'état, hors périmètre, à la demande du PO.

**Gate Production unique `1.9.0` — GO (2026-07-06) puis Préflight PASS, déploiement technique et validation finale (2026-07-06) : `PRODUCTION_DEPLOYED` atteint ~17:57 UTC, hypercare T0 PASS immédiat.** Détail complet §11 et `docs/prod-state.md` §0J.

**Clôture Release `1.9.0` du 2026-07-08 — CDO GO.** Le serveur de production étant intentionnellement éteint entre les opérations (produit non annoncé publiquement, pattern `1.4.0`→`1.8.0`), les fenêtres cibles T+12 (2026-07-07 ~05:57 UTC) et T+24 (2026-07-07 ~17:57 UTC) sont tombées hôte éteint. Sur demande explicite du PO (« vérifie l'état réel du serveur de prod »), un contrôle live a été exécuté le 2026-07-08 ~14:36 UTC (≈ T+45) : instance EC2 confirmée `running` (CloudTrail), tag/digests `sha-75646d8f` inchangés, Flyway 22/22, invariant ledger 3/3, 8/8 actifs 4/4 healthy restart=0 depuis le dernier redémarrage hôte, `bailleur-test` désactivé, Prometheus 5/5, Alertmanager `[]`, 0 alerte reçue durant l'intervalle, 0 ligne 5xx. **Checkpoint combiné T+12/T+24 en rattrapage : PASS sous surveillance** — écart de fenêtre qualifié par le PO. RSV-PROD-EP14-01/02 confirmées levées ; `RSV-STG-01` (héritée) maintenue, sans rapport avec `1.9.0`. **Décision CDO : GO — RELEASE `1.9.0` CLÔTURÉE.** Détail : `docs/cgpa/09-production/plan-etape-hypercare-v1.9.0.md`, `docs/cgpa/09-production/cloture-release-v1.9.0.md`. **Prochaine étape CGPA : cadrage du prochain lot backlog PO** selon le parcours gouverné habituel (Plan d'Exécution → Sprint → Gate Staging incl. `STG-ISOL-01` → Gate Production). Aucun nouveau code, déploiement ou promotion n'est autorisé par cette clôture.

**Cadrage EP-15 « Gestion des personnes » du 2026-07-08 — Proposé, documentaire uniquement.** Instruction PO : rendre Gestionnaires et Locataires durables (statuts, historique, audit, anti-doublons). **Collision d'identifiant EP-14 détectée et corrigée** (déjà pris par les Quittances certifiées `1.9.0` ; EP-13 réservé « Fin de bail ») → **renuméroté EP-15**. Quatre décisions d'architecture tranchées par le PO (statut Gestionnaire **global** avec risque cross-bailleur RSV-EP15-01 explicitement accepté ; migration historique **1 Locataire par bail sans déduplication** ; **suppression** des colonnes texte libre `bail.locataire_nom`/`locataire_email` après bascule V24 ; **photo en `bytea`**, réutilisant `quittance.pdf`). Livrables : `ADR-16-gestion-personnes.md` (D-PERS-001, RSV-EP15-01→04, 1 kickoff K1 restant), addenda EB/CDC `addendum-personnes.md` (EF-97→107, RM-100→107), extension additive `dossier-architecture.md` §3.5, `addendum-backlog-ep15-personnes.md` (US-105→114, sprints A/B/C), `plan-execution-ep15-personnes.md`, synthèse `docs/addendum-personnes.md`. **Aucun code, aucune migration.** `docs/prod-state.md` vérifié : aucune modification requise (documentaire uniquement). **Prochaine étape : le PO tranche K1 (sémantique de « créer » un Gestionnaire) puis donne un GO explicite sur le Plan d'Exécution avant tout Sprint.**

**Kickoff EP-15 clos du 2026-07-08 — K1 tranché : « profil sur compte existant ».** Le PO a validé la proposition par défaut de l'ADR-16 : l'invitation reste l'unique voie de création technique du compte Gestionnaire, « créer » au sens EP-15 désignant l'enrichissement du profil métier d'un compte déjà existant. `ADR-16` et l'ensemble des documents EP-15 sont mis à jour en conséquence (statut « kickoff clos »). **Seul le GO explicite du PO sur `plan-execution-ep15-personnes.md` reste requis avant le démarrage du Sprint A — aucun codage n'est encore autorisé.**

**Sprint A (EP-15) codé et vert du 2026-07-08 — GO explicite reçu, US-105→108 livrées.** Migration **V23** (statut global Gestionnaire + fonctions `SECURITY DEFINER` `gestionnaire_a_affectation_active`/`gestionnaire_a_relation`), `GestionnaireService`/`GestionnaireController` (profil, suspension/réactivation immédiates, archivage cross-tenant conditionné, restauration, recherche, doublons, historique), activation Keycloak pilotée par l'application, nouveaux points d'audit. **`mvn verify` 168/168 verts**, aucune régression (compteur Flyway `SchemaMigrationTest`/`smoke-stack.sh` alignés à 23 dans la même session, leçon PR #77/#171 appliquée). Détail : `docs/cgpa/05-architecture-conception/adr/ADR-16-gestion-personnes.md`, `CHANGELOG.md` `[Non publié]`. **Prochaine étape : décision PO — instruire le Gate Staging du Sprint A seul, ou enchaîner directement le codage du Sprint B (Locataire, US-109→112, migration V24 additive).**

**Sprint B (EP-15) codé et vert du 2026-07-09 — décision PO d'enchaînement reçue, US-109→112 livrées.** Migration **V24** (additive : table `locataire` RLS `ENABLE`+`FORCE` policy `bailleur_isolation`, index `locataire(bailleur_id)`/`locataire(bailleur_id, statut)` ; `bail.locataire_id` ajoutée nullable, aucun usage applicatif — préparation Sprint C/V25), `LocataireService`/`LocataireController` (`/api/locataires`, rôle `BAILLEUR` : création, modification, archivage sans pré-condition, restauration, recherche, détection de doublons, historique), nouveaux points d'audit (`CREER_LOCATAIRE`/`MODIFIER_LOCATAIRE`/`ARCHIVER_LOCATAIRE`/`RESTAURER_LOCATAIRE`). Contrairement au Gestionnaire, le Locataire n'est pas un compte utilisateur : aucune fonction `SECURITY DEFINER` cross-tenant, cloisonnement entièrement porté par la RLS. Écart détecté et corrigé avant commit : `SecurityIntegrationTest` neutralise par construction tout service dépendant de JPA via `@MockitoBean` pour tourner sans base — `LocataireService` manquait à cette liste (même omission de pattern que pour `GestionnaireService` au Sprint A, corrigée dans la même session avant tout commit). Compteur Flyway `SchemaMigrationTest`/`smoke-stack.sh` alignés à 24 dans la même session (leçon PR #77/#171 appliquée). **`mvn verify` 173/173 verts**, aucune régression. Détail : `docs/cgpa/05-architecture-conception/adr/ADR-16-gestion-personnes.md` (D2/D3), `CHANGELOG.md` `[Non publié]`. **Aucun déploiement Staging/Production à ce stade — rappel plan d'exécution : pas de promotion Production isolée du Sprint A avant Sprint B (cohérence produit), et Gate Production Sprints A+B combinés possible seulement après Gate Staging (dont `STG-ISOL-01`). Prochaine étape : instruire le Gate Staging Sprints A+B.**

**PR #209 (EP-15 Sprint A+B) mergée sur `main` du 2026-07-15 — revue de code, 2 bugs corrigés avant merge.** Revue de code du PR #209 (36 fichiers, +1859/-79) a détecté et corrigé **2 défauts avant merge**, aucun couvert par les tests existants : photo Gestionnaire silencieusement effacée sur toute mise à jour partielle du profil omettant `photoBase64` (`GestionnaireService.modifierProfil`, champ partagé entre bailleurs ADR-16 D1 — garde-fou aligné sur celui déjà présent dans `Locataire.modifier()`) ; et `dateCreation: null` renvoyée à la création d'un Locataire (`LocataireService.creer` — id assigné côté client donc `saveAndFlush()` fait un `merge()`, instance managée distincte de la référence locale, nécessitant réassignation + `em.refresh()` pour relire la colonne `insertable=false` posée par la BDD). 2 tests de non-régression ajoutés, `mvn verify` vert (commit `66a57dc`). **CI GitHub 7/7 verte, PR #209 mergée le 2026-07-15T10:33:40Z (merge commit `4d8a760`)** — Sprint A (Gestionnaire, US-105→108) et Sprint B (Locataire, US-109→112) sont désormais intégrés à `main`. **Aucun déploiement Staging/Production à ce stade.** **Prochaine étape CGPA : instruire le Gate Staging Sprints A+B (dont `STG-ISOL-01`, mutualisation `ai-test-server`)** — le Sprint C (bascule `Bail→Locataire`, migration V25 non additive) reste hors périmètre tant que le Sprint B n'a pas tenu un cycle de release complet en Production sans anomalie.

**Gate Staging Sprints A+B EP-15 du 2026-07-15 — GO, `STAGING_DEPLOYED`.** Revue sécurité dédiée
PASS (nouveau patron cross-tenant `SECURITY DEFINER` traité : surface booléen minimale,
paramètres liés, `EXECUTE` restreint). Tag `sha-c9200a51` déployé sur `ai-test-server` (api+nginx
seuls recréés, sauvegarde pré-déploiement vérifiée). **STG-ISOL-01 PASS avant/après** (8
conteneurs `loyertracker-staging-*` + NPM intacts, restart=0). Flyway **24/24** (V23+V24). Smoke
**62/0**. Le script de smoke ne couvrant pas encore `/api/gestionnaires`/`/api/locataires` (même
pattern que garantie Sprint 9/10), **vérification manuelle live dédiée : 48 PASS/0 FAIL** — CRUD,
cycle de vie, recherche/doublons, historique et **isolation RLS cross-tenant (404)** pour
Locataire ; profil, cycle de vie, **RBAC ReBAC (403)** et **garde cross-tenant d'archivage (409
puis 200 après révocation d'une affectation tierce)** pour Gestionnaire. **Les deux correctifs du
PR #209 reconfirmés en conditions réelles** (`dateCreation` renseignée à la création d'un
Locataire ; photo Gestionnaire conservée sur mise à jour partielle sans `photoBase64`). Détail :
`docs/cgpa/07-devsecops/gate-staging-sprints-ab-ep15-decision.md`,
`docs/cgpa/07-devsecops/security-review-sprints-ab-ep15.md`. **`PRODUCTION_READY`/
`PRODUCTION_DEPLOYED` non atteints — Gate Production Sprints A+B combinés distinct requis (pas de
promotion isolée du Sprint A, cf. plan d'exécution EP-15). Prochaine étape autorisée : instruire ce
Gate Production ; le Sprint C reste hors périmètre tant que le Sprint B n'a pas tenu un cycle de
release Production complet sans anomalie.**

**Gate Production Sprints A+B EP-15 (`1.10.0`) du 2026-07-15 — GO, `PRODUCTION_READY`.** Candidat
`sha-c9200a51` (identique au Gate Staging, `main` HEAD `a7f7771` sans écart applicatif),
digests GHCR API `sha256:37de87e8…`/Web `sha256:7ade9816…` confirmés. Checklist intégralement
PASS : `STG-ISOL-01`, Flyway 24/24, smoke 62/0 + vérification manuelle live 48/0, revue sécurité
dédiée, CI 7/7 SUCCESS confirmé en direct, Quality Gate SonarQube bloquant vert. V23/V24
additives (rollback applicatif seul vers `1.9.0`) ; aucun secret nouveau à provisionner
(contrairement à `1.9.0`) ; aucun blocage structurel de type ADR-15 K5. Risques EP-15
(RSV-EP15-01→04) déjà tranchés ou hors périmètre, aucun bloquant. Décision :
`docs/cgpa/09-production/gate-production-v1.10.0-decision.md`. **Cette décision autorise
uniquement le Préflight Production — aucune mutation ni déploiement.** `PRODUCTION_DEPLOYED`
reste non atteint ; instruction explicite distincte requise après un Préflight PASS. Le Sprint C
(bascule `Bail→Locataire`, V25) demeure hors périmètre jusqu'à un cycle de release Production
complet du Sprint B sans anomalie.

**Préflight Production `1.10.0` du 2026-07-15 — PASS.** Production `1.9.0` saine : 8/8 actifs,
4/4 healthy, restart=0, Flyway 22/22, digests conformes sans dérive. **Invariant ledger garantie
8/8 PASS**, confirmé après correction d'un écart méthodologique (première requête via le rôle
applicatif `loyertracker_api`, soumis à la RLS `FORCE` sans contexte bailleur, renvoyait 0 ligne
sur toutes les tables métier — ré-interrogé avec le rôle superutilisateur bypass-RLS pour
confirmer les décomptes réels : aucune perte de données, effet RLS attendu). `bailleur-test`
désactivé confirmé. Prometheus 5/5 ; Alertmanager 1 alerte `BackupHeartbeatMissing` qualifiée
(pattern récurrent post-redémarrage hôte), non bloquante. Backup vérifié
`loyertracker-20260715-120812.dump` (SHA-256 `f4d5e2cb…`) + globals, `pg_restore --list` 777
entrées. `.env.bak-pre-1.10.0` créé ; aucun secret nouveau requis ; rollback `sha-75646d8f`
disponible localement. `CHANGELOG.md` promu en `[1.10.0]`. Aucun déploiement exécuté. Rapport :
`docs/cgpa/09-production/preflight-backup-v1.10.0-report.md`. **Prochaine étape : instruction
explicite distincte requise pour le déploiement technique (`api`+`nginx`) et la validation
finale `1.10.0`.**

**Déploiement technique Production `1.10.0` du 2026-07-15 — PASS technique.** Candidat
`sha-c9200a51` déployé ciblé (`api`+`nginx` seuls recréés, `--no-deps`, aucune commande Docker
globale) ; dépôt hôte synchronisé `3feb1d5`→`cd0d020`. Digests conteneurs confirmés identiques
au Gate/Préflight. Flyway V23+V24 appliquées en conditions réelles, 24/24 ; objets confirmés
(`locataire`, `gestionnaire.statut`, 2 fonctions `SECURITY DEFINER`). Invariant ledger 8/8 PASS.
8/8 actifs, 4/4 healthy, restart=0 ; `/healthz` et site public 200 ; Prometheus 5/5 ; 0 ligne
5xx. Rollback `sha-75646d8f` disponible localement. Rapport :
`docs/cgpa/09-production/deploiement-technique-v1.10.0-report.md`. **La validation finale
(smoke Production) reste une étape distincte, nécessitant la réactivation temporaire de
`bailleur-test@test.local`/`directAccessGrants` — autorisation PO explicite dédiée requise avant
exécution. `PRODUCTION_DEPLOYED` non encore prononcé.**

**Validation finale Production `1.10.0` du 2026-07-15 — PASS, `PRODUCTION_DEPLOYED` atteint.**
Autorisation PO explicite dédiée obtenue pour réactiver temporairement `bailleur-test` (le
classificateur de permissions avait bloqué l'action tant qu'elle n'était pas nommée
explicitement — même garde-fou que pour la génération de secrets aux releases précédentes).
Smoke Production **62 PASS / 0 FAIL au premier passage**. Nettoyage transactionnel du RUN_ID
`1784120083` : chaque entité identifiée par son identifiant réel avant suppression ; **écart
détecté et corrigé en cours de route** — la 1re tentative de transaction a échoué sur une
contrainte FK parce que `POST /api/bailleurs/inscription` crée automatiquement un patrimoine
« Patrimoine principal » pour tout nouveau bailleur (non anticipé initialement) ; la transaction
a proprement rollback (aucune suppression partielle), le patrimoine manquant ajouté à la liste,
nouvelle transaction réussie sans résidu. Comptes Keycloak du run supprimés, `bailleur-test`
redésactivé et `directAccessGrantsEnabled=false` reconfirmé. Baseline post-nettoyage identique
au Préflight, invariant ledger 8/8, 8/8 actifs 4/4 healthy restart=0, 0 5xx, site public 200.
Rapport : `docs/cgpa/09-production/validation-finale-v1.10.0-report.md`. **`PRODUCTION_DEPLOYED`
atteint le 2026-07-15 (~13:41 UTC).** Hypercare (T0/T+12/T+24) et clôture de release EP-15
Sprints A+B restent des étapes distinctes non encore instruites.

**Hypercare `1.10.0` complète du 2026-07-16 — T0/T+12/T+24 tous PASS.** T0 PASS le 2026-07-15
(~13:26 UTC), T+12 PASS en rattrapage le 2026-07-16 (~10:57 UTC), T+24 PASS en rattrapage le
2026-07-16 (~15:01 UTC) — hôte resté allumé en continu tout du long, `restart=0` sur les 8
conteneurs, aucun critère de suspension atteint sur l'un des trois checkpoints. Détail :
`docs/cgpa/09-production/plan-etape-hypercare-v1.10.0.md`.

**Clôture Release `1.10.0` du 2026-07-16 — CDO GO.** État de Production reconfirmé live au
moment de la clôture : 8/8 actifs 4/4 healthy restart=0 depuis ~27 h, tag/digests `sha-c9200a51`
inchangés, Flyway 24/24, invariant ledger garantie 8/8, 0 ligne 5xx, `bailleur-test` désactivé,
site public 200. RSV-EP15-01→04 non bloquantes (tranchées au cadrage) ; `RSV-STG-01` (héritée)
maintenue, sans rapport avec `1.10.0`. **Décision CDO : GO — RELEASE `1.10.0` CLÔTURÉE.** Détail :
`docs/cgpa/09-production/cloture-release-v1.10.0.md`. Cette clôture lève la condition de
démarrage du Sprint C EP-15 (`cadrage-sprint-c-ep15.md`, NO-GO « pas encore ») et satisfait le
prérequis « release `1.10.0` clôturée » du Plan d'Exécution EP-13 — dans les deux cas, un GO
explicite du PO reste requis avant tout codage (Sprint C) ou tout tranchage puis GO (EP-13).

**Kickoff EP-13 clos du 2026-07-16 — K1→K6 tranchés par le PO, six propositions par défaut
validées sans modification** (y compris K3 et K6, signalées comme méritant une attention
particulière). `ADR-17-fin-de-bail.md` et `plan-execution-ep13-fin-de-bail.md` mis à jour en
conséquence (statut « kickoff clos »). **Aucun code, aucune migration.**

**Plan d'Exécution EP-13 approuvé du 2026-07-16 — GO explicite du PO, Sprint unique autorisé à
démarrer.** `plan-execution-ep13-fin-de-bail.md` requalifié « Approuvé », `ADR-17-fin-de-bail.md`
requalifiée « Acceptée ». **Aucun code ni migration produits par ce GO lui-même.** Périmètre
inchangé : US-115→118 (clôture/réouverture/purge échéancier/non-régression alertes), hors
`ClotureBailService`/Garantie/Paiements, migration additive uniquement, Gate Staging (dont
`STG-ISOL-01`) puis Gate Production distincts requis avant toute Production. **Prochaine étape
CGPA : coder le Sprint unique EP-13.** En parallèle, le GO explicite du PO sur le Sprint C EP-15
reste également ouvert — les deux chantiers restent indépendants et non exclusifs
(RSV-EP13-04).

**Sprint unique EP-13 mergé sur `main` du 2026-07-16 — PR #227 (`cba13f5`), CI 7/7 verte.**
Migration **V25** additive (`bail.date_cloture_effective` ; `generer_alertes()` restreint
`LOYER_EN_RETARD` aux baux `ACTIF`, US-118) ; `Bail.cloturer()`/`rouvrir()` ; `BailService`
(avertissements K3/K4, purge US-117 même transaction, double garde `uq_bail_actif` à la
réouverture) ; endpoints `.../cloture`/`.../reouverture` ; `ClotureBailDto` (nouveau pattern
« avertissement sans blocage »). **`mvn verify` 185/185 verts.** Un correctif Sonar (`java:S5778`,
lambda de test avec deux appels potentiellement levants) a été nécessaire avant que le Quality
Gate ne passe. Détail complet : §11 historique (2026-07-16, « Sprint unique EP-13 codé, vert et
mergé »). **Aucun déploiement Staging/Production à ce stade.**

**Gate Staging EP-13 du 2026-07-16 — GO, `STAGING_DEPLOYED` (`sha-cba13f52`).** STG-ISOL-01 PASS
avant/après (9 conteneurs `loyertracker-staging-*`/`nginx-proxy-manager`, restart=0). Flyway
25/25. Smoke 62/0 + **vérification manuelle live dédiée 22/0** (clôture avec avertissements,
purge de l'échéancier futur, non-régression alertes, réouverture, collisions 409 — tous
confirmés en conditions réelles). Détail : §11 historique (2026-07-16, « Gate Staging EP-13 »),
`docs/cgpa/07-devsecops/gate-staging-ep13-fin-de-bail-decision.md`. **Incident mineur signalé** :
exposition accidentelle de 7 secrets Staging via une commande de diagnostic (`set -x`) — rotation
recommandée sur `ai-test-server`, non bloquante.

**Gate Production EP-13 du 2026-07-16 — GO, `PRODUCTION_READY` (`sha-cba13f52`).** Checklist
intégralement instruite : Staging PASS (STG-ISOL-01, Flyway 25/25, smoke 62/0, vérification
manuelle 22/0), CI 7/7, Quality Gate SonarQube vert, migration V25 additive (rollback applicatif
seul vers `1.10.0`), aucune nouvelle variable d'environnement/secret, aucune revue sécurité
dédiée nécessaire (RBAC/ReBAC inchangés). RSV-EP13-01→04 non bloquantes. Détail :
`docs/cgpa/09-production/gate-production-ep13-fin-de-bail-decision.md`. Cette décision autorise
uniquement le **Préflight Production** ; aucune mutation ni déploiement. **Prochaine étape CGPA :
Préflight Production, puis instruction explicite distincte du déploiement technique après un
Préflight PASS.**

**Préflight Production `1.11.0` du 2026-07-16 — PASS.** Contrôles lecture seule sur
`loyertracker-prod-server` tous verts : 8/8 actifs restart=0, tag/digests `sha-c9200a51`
inchangés, Flyway 24/24, invariant ledger 8/8, `bailleur-test` désactivé, Prometheus 5/5,
Alertmanager 0 alerte, 0 5xx, site public 200. Backup vérifié (`loyertracker-20260716-175144.dump`,
759990 octets, SHA-256 `62fdf175…`, 798 entrées). `.env.bak-pre-1.11.0` créé, `.env` hôte
inchangé. Rollback `sha-c9200a51` déjà présent localement. `CHANGELOG.md` promu en `[1.11.0] —
2026-07-16`. Aucun pull/redémarrage/déploiement exécuté. Détail :
`docs/cgpa/09-production/preflight-backup-v1.11.0-report.md`. **`PRODUCTION_DEPLOYED` non atteint
— prochaine étape CGPA : instruction explicite distincte pour déployer `api`+`nginx`.**

---

**Resynchronisation documentaire du §14 le 2026-07-27.** Le §14 s'était arrêté au Préflight
`1.11.0` du 2026-07-16, alors que §1, §3A, §11 et §12 avaient continué d'être tenus à jour
jusqu'au 2026-07-27 (Production `1.13.0` LIVE, Préflight `1.14.0` PASS). Aucune décision, aucun
Gate et aucun risque historique n'est modifié ni supprimé : les entrées ci-dessous reprennent
strictement les faits déjà tracés au registre §11 et au journal §12, dans l'ordre chronologique,
pour rétablir la continuité de la « prochaine action claire ». Écart de gouvernance de même
nature que R-V52-6/R-V52-7 (déjà fermés), consigné en §13.

**Écart de traçabilité `1.11.0` détecté puis régularisé le 2026-07-19 — `PRODUCTION_DEPLOYED`
confirmé rétroactivement.** Le Préflight du 2026-07-16 concluait `PRODUCTION_DEPLOYED` non
atteint, mais le déploiement technique a réellement eu lieu sans rapport écrit, et le Sprint C
EP-15 a démarré le lendemain sans que ce chaînon soit refermé. Détecté le 2026-07-19 par des
contrôles lecture seule contredisant la documentation (`sha-cba13f52`, Flyway 25/25 en Production
réelle). Régularisation : déploiement technique constaté conforme (digests identiques au
Gate/Préflight, rollback `sha-c9200a51` disponible), **smoke de validation finale rejoué 62 PASS /
0 FAIL au premier passage**, nettoyage transactionnel complet (RUN_ID `1784457409`, 0 résidu),
`bailleur-test` redésactivé, baseline métier restaurée à l'identique. Rapports :
`deploiement-technique-v1.11.0-report.md`, `validation-finale-v1.11.0-report.md`,
`docs/prod-state.md` §0L. **Leçon retenue (§13, fermée) : après un Préflight PASS, rédiger le
rapport de déploiement technique et la validation finale dans la même session que la bascule du
tag `.env`, avant tout démarrage d'un nouveau Sprint** — même principe que `R-S04-1`.

**Sprint C (EP-15) puis Release `1.12.0` — `PRODUCTION_DEPLOYED` le 2026-07-19, clôturée le
2026-07-22.** GO explicite du PO le 2026-07-17, Sprint C codé et vert le même jour (US-113/US-114,
migration V26, bascule `Bail`→`Locataire` et suppression des colonnes texte libre), **Gate Staging
GO / `STAGING_DEPLOYED` le 2026-07-17**, **Gate Production GO / `PRODUCTION_READY` le 2026-07-19**,
Préflight renforcé PASS (V26 non additive → second backup post-migration vérifié, cf. RSV-EP15-03),
déploiement technique PASS, **validation finale 63 PASS / 0 FAIL au premier passage** exerçant le
nouveau contrat `locataireId` et l'effacement RGPD retargeté (`EFFACEMENT_LOCATAIRE`) —
`PRODUCTION_DEPLOYED` atteint le 2026-07-19 ~11:57 UTC (`sha-359f4d63`). Hypercare T0 PASS le
même jour ; checkpoints T+12/T+24 tombés hôte éteint (produit non annoncé publiquement, pattern
`1.7.0`→`1.9.0`), rattrapés en un contrôle live combiné le 2026-07-22 : **PASS sous surveillance**,
écart de fenêtre qualifié sans impact. **Décision CDO : GO — Release `1.12.0` CLÔTURÉE le
2026-07-22.**

**EP-16 « Notifications multicanales via Twilio » — cadrage, kickoff K1→K8 clos et GO du Plan
d'Exécution le 2026-07-19.** Verrou de gouvernance structurant posé au kickoff (**K8, ADR-18**) :
les canaux externes ne sont **jamais** activés en Production, et **aucun credential Twilio n'est
ajouté au `.env` de production**, avant la clôture en GO du Sprint N+2. Ce verrou conditionne
tous les Gates Production de l'épic.

**Sprint N (Fondation notifications) puis Release `1.13.0` — `PRODUCTION_DEPLOYED` le 2026-07-23,
clôturée le 2026-07-24 : Production courante.** Sprint N codé et vert le 2026-07-19 (migration
**V27** additive, cinq tables `notification_*`, `NotificationProvider` avec
`NoopNotificationProvider` seul fournisseur actif), PR #235/#237 fusionnées, **Gate Staging GO /
`STAGING_DEPLOYED` le 2026-07-19**, **Gate Production GO sous réserve / `PRODUCTION_READY` le
2026-07-19** (réserve bloquante RSV-PROD-EP16-N-01 = clôture préalable de `1.12.0`, levée le
2026-07-22). Préflight PASS et déploiement technique PASS le 2026-07-22 ; **validation finale
63 PASS / 0 FAIL au premier passage le 2026-07-23** (une anomalie d'entrée `bailleur-test`
réactivé par un probable réimport de realm au redémarrage de l'hôte, corrigée avant smoke, sans
rapport avec V27 ; tables `notification_*` toujours à 0 ligne après). **`PRODUCTION_DEPLOYED`
atteint le 2026-07-23 pour `1.13.0` (`sha-e4744d92`)**, hypercare T0 PASS le jour même, T+12 PASS
le 2026-07-24, T+24 PASS le 2026-07-24 par dérogation PO explicite (fenêtre raccourcie ~T+17,
écart assumé et tracé). **Décision CDO : GO — Release `1.13.0` CLÔTURÉE le 2026-07-24**, ce qui
satisfait le prérequis « Sprint N clos en GO » posé par `plan-execution-ep16-notifications.md`
pour démarrer le Sprint N+1. Migration V27 additive : rollback applicatif seul viable même après
application.

**Sprint N+1 (WhatsApp P0) — Gate Staging GO, Gate Production GO sous réserve et Préflight
`1.14.0` PASS le 2026-07-24 : la release `1.14.0` est prête, non déployée.** GO explicite du PO
le 2026-07-24, Sprint codé et fusionné (PR #252), deux écarts détectés et corrigés avant/pendant
le Gate Staging (lien de vérification manquant dans le message WhatsApp — PR #254 ; page publique
`/verify/` bloquée par le basic-auth NPM du Staging). **Gate Staging GO / `STAGING_DEPLOYED` sur
`sha-27dce09d`** avec `STG-ISOL-01` PASS, Flyway 28/28, smoke 63/0 et **vérification WhatsApp
réelle réussie** (quittance → message livré confirmé côté Twilio → lien de vérification VALIDE →
confirmation visuelle du PO), `PAIEMENT_RECU` sans template → `DEAD` confirmé en conditions
réelles. **Gate Production GO sous réserve / `PRODUCTION_READY`** (Quality Gate SonarQube vert
après revue PO d'un Security Hotspot `java:S4790` — HmacSHA1 imposé par Twilio ; réserve non
bloquante RSV-PROD-EP16-N1-02 = observabilité des notifications externes, US-126 au Sprint N+2).
**Préflight Production `1.14.0` PASS** : 4/4 actifs healthy `RestartCount=0`, tag `sha-e4744d92`
inchangé, Flyway 27/27, backup vérifié (`loyertracker-20260724-134344.dump`, 854175 octets,
SHA-256 `492f5017…`), **V28 additive confirmée** (aucun second backup post-migration requis),
**absence de toute variable/credential Twilio confirmée par grep dans le `.env` de production**
(condition 5 du Gate Production), `.env.bak-pre-1.14.0` créé, `CHANGELOG.md` promu `[1.14.0] —
2026-07-24`, réserve `BackupHeartbeatMissing` résolue par le Préflight lui-même. Aucune mutation
exécutée. Détail : `docs/cgpa/09-production/preflight-backup-v1.14.0-report.md`.

**Maintenance CI et dépendances du 2026-07-26 au 2026-07-27 — aucun impact Gate/Sprint/Staging/
Production.** Trois lots documentés en §1 et §11, tous sans changement fonctionnel ni migration
SQL : correctif CI de résolution du plugin SonarQube par coordonnées explicites (PR #257, merge
`ffb789d4`, validé post-merge hors cache Maven chaud) ; lot Dependabot de onze PR fusionnées,
incluant la correction à la racine d'un incident CodeQL (bump scindé en deux PR → *configuration
error*, résolu par la PR #260 et un groupe `codeql-action` dans `dependabot.yml`) et un incident
GHCR `unknown blob` transitoire dû à l'annulation par concurrence d'un run en plein push, résolu
par relance ; enfin le bump `sonarqube-scan-action` v6 → v8.2.1 (PR #269, merge `44effa83`),
report levé sur instruction PO et **bump éprouvé avant merge** contre l'instance réelle
(`skipSignatureVerification: false` conservé, signature GPG vérifiée, Quality Gate franchi),
validation post-merge confirmée sur les quatre jobs. Dernier merge sur `main` : bump `zone.js`
0.16.2 (PR #268, `883da37`).

**Prochaine action claire au 2026-07-27 — état d'attente d'instruction PO.** Production courante :
**`1.13.0` LIVE** (`sha-e4744d92`), release clôturée en CDO GO, aucun canal externe activé. La
release **`1.14.0` est prête et pré-vérifiée** : Gate Staging GO, Gate Production GO sous réserve,
Préflight PASS, candidat `sha-27dce09d`, rollback `sha-e4744d92` déjà présent localement. **Il ne
manque qu'une instruction PO explicite et distincte pour le déploiement technique (`api`+`nginx`,
migration V28), suivi de la validation finale.** Conditions impératives rappelées : ne jamais
activer `NOTIFICATIONS_EXTERNAL_ENABLED`/`TWILIO_WHATSAPP_ENABLED` ni ajouter de credential Twilio
au `.env` de production avant le GO du Sprint N+2 (K8, ADR-18) — `NoopNotificationProvider` doit
rester l'unique fournisseur actif après ce déploiement ; et rédiger le rapport de déploiement
technique et la validation finale **dans la même session** que la bascule du tag, avant tout
démarrage d'un nouveau Sprint (leçon `1.11.0`). Aucun code, déploiement ou promotion n'est
autorisé par cette resynchronisation documentaire.

**Constat du 2026-07-27 — le déploiement technique `1.14.0` avait déjà eu lieu : régularisation a
posteriori, `PRODUCTION_DEPLOYED` NON prononcé.** Sur instruction PO d'exécuter le déploiement
technique, les contrôles d'entrée en lecture seule ont révélé que la Production tournait **déjà**
sur le candidat `sha-27dce09d` : le déploiement avait été exécuté le **2026-07-24 ~12:48–12:49
UTC** (bascule `.env`, recréation ciblée de `api`/`nginx`, migration **V28** appliquée), soit
~4 minutes après le Préflight et dans la même session d'exploitation — **sans rapport écrit**. Le
PO a confirmé en être l'auteur (geste volontaire non tracé). **Le déploiement a été interrompu
avant toute action dès le constat : aucune mutation n'a été exécutée le 2026-07-27.** Conformité
technique vérifiée intégralement (digests exacts du Gate/Préflight, `api`+`nginx` seuls recréés,
Flyway 28/28, 3 templates + 2 fonctions `SECURITY DEFINER`, rollback `sha-e4744d92` viable car V28
additive, aucune commande Docker globale) ; **K8/ADR-18 respecté** (0 variable Twilio au `.env`
hôte ; les variables EP-16 injectées par Compose ont des credentials vides et des flags à `false`,
`NoopNotificationProvider` seul actif) ; **aucun envoi externe** (17 événements `LOYER_EN_RETARD`
mais `notification_outbox` et `notification_delivery` à 0). **Réserve bloquante : le smoke
Production (≥63 PASS) n'a jamais été exécuté** — la Production a tourné 3 jours sur une release
techniquement conforme mais jamais validée fonctionnellement (0 `ERROR`, 0 5xx, 0 alerte sur 26 h :
présomption favorable, pas une preuve). Par cohérence avec la régularisation `1.11.0`,
**`PRODUCTION_DEPLOYED` n'est pas prononcé**. Écart de gouvernance consigné en **RÉCIDIVE** sous
**R-V54-2** (§13), avec mesure structurelle à arbitrer par le PO — la leçon écrite de `1.11.0`
s'étant révélée insuffisante. Détail : `docs/cgpa/09-production/deploiement-technique-v1.14.0-report.md`,
`docs/prod-state.md` §0O.

**Prochaine action claire au 2026-07-27 (mise à jour) : validation finale `1.14.0`.** Elle requiert
une **autorisation PO explicite et distincte**, car elle réactive temporairement
`bailleur-test@test.local` et `directAccessGrants`, puis écrit et supprime des données de test en
Production sous nettoyage transactionnel. Attendu : smoke ≥ 63 PASS / 0 FAIL au premier passage,
contrôle `notification_delivery` = 0 après smoke, redésactivation de `bailleur-test`, baseline
métier restaurée (3 bailleurs, 2 patrimoines, 8 biens, 8 baux, 8 garanties, 1 gestionnaire,
8 locataires, 7 quittances). Ce n'est qu'après ce PASS que `PRODUCTION_DEPLOYED` pourra être
prononcé pour `1.14.0`, puis l'hypercare T0/T+12/T+24 et la clôture CDO instruites. L'activation
des canaux externes reste interdite jusqu'à la clôture en GO du Sprint N+2 (K8, ADR-18).

**Validation finale `1.14.0` du 2026-07-27 — PASS, `PRODUCTION_DEPLOYED` atteint ~16:46 UTC.**
Exécutée sur autorisation PO explicite le jour même, elle lève la réserve bloquante ouverte par la
régularisation du déploiement technique. Contrôle d'entrée **sans anomalie** (`bailleur-test` déjà
`enabled=false`, contrairement à `1.13.0`). **Smoke Production 63 PASS / 0 FAIL au premier
passage** (RUN_ID `1785170429`, code de sortie 0 capturé directement), Flyway 28/28, couverture
identique aux validations précédentes. **Volet notifications validé en conditions réelles** — et
c'est la différence de fond avec `1.13.0`, où les tables restaient vides : le run a produit
**8 `notification_event`** (5 `LOYER_EN_RETARD`, 1 `PAIEMENT_RECU`, 1 `BAIL_CREE`, 1 `PREAVIS`)
tandis que **`notification_outbox` et `notification_delivery` sont restés à 0**, y compris pour
`PAIEMENT_RECU` (pas de template approuvé ⇒ `DEAD` sans envoi) : la condition 6 du Gate Production
est satisfaite en Production réelle et **aucun envoi externe n'est possible**.
**Nettoyage transactionnel de 47 lignes en une seule transaction** (dont les 8 `notification_event`
du run, séparés des 17 préexistants appartenant à un bailleur réel), 2 comptes Keycloak supprimés,
`bailleur-test` redésactivé, **baseline métier et tables `notification_*` restaurées à
l'identique**. Une note de méthode est tracée au registre : une première tentative de nettoyage a
échoué **avant tout `DELETE`** (expansion `$$` par le shell distant), transaction interrompue par
`ON_ERROR_STOP=1` et état vérifié inchangé avant relance. Note non bloquante : 1 `ERROR` API
pendant le smoke (`duplicate key … bailleur_keycloak_id_key`), pattern connu depuis l'hypercare
`1.10.0`, API répondant 409 correctement. `PRODUCTION_DEPLOYED` prononcé **à la date de sa preuve**
(2026-07-27), le déploiement réel datant du 2026-07-24 — même principe que `1.11.0`. Détail :
`docs/cgpa/09-production/validation-finale-v1.14.0-report.md`, `docs/prod-state.md` §0O.

**Hypercare `1.14.0` — Checkpoint T0 PASS le 2026-07-27 ~16:57 UTC.** Tous les contrôles verts
(8/8 actifs 4/4 healthy `RestartCount=0`, tag/digests conformes, Flyway 28/28, `notification_*` à
17/0/0/3/0 identiques au pré-validation, baseline inchangée, `bailleur-test` désactivé, quatre
flags externes à `false`/`true` vérifiés dans le conteneur, Prometheus 5/5, **Alertmanager 0
alerte**, Hikari `pending`=0, 0 5xx et 0 `ERROR` sur 15 min). **Le résidu `notification_event`
découvert au T0 de `1.13.0` ne s'est pas reproduit** : la leçon a été appliquée à la validation
finale, 0 ligne résiduelle confirmée, aucune correction nécessaire. Particularité : la fenêtre
d'hypercare démarre à la date de la preuve (2026-07-27) et non du déploiement réel (2026-07-24) —
les trois jours antérieurs restent contrôlés a posteriori mais sans télémétrie continue, même
principe que `1.11.0`. **T+12 (cible 2026-07-28 ~04:46 UTC) et T+24 (cible ~16:46 UTC) restent à
instruire ; clôture CDO interdite avant.** Plan :
`docs/cgpa/09-production/plan-etape-hypercare-v1.14.0.md`.

**Arbitrage `R-V54-2` du 2026-07-27 — option (a) retenue, Plan d'Exécution proposé.** Le PO tranche
en faveur d'un **fichier d'état de release versionné** (`infra/release/production-state.env`)
contrôlé par la CI, le smoke et un contrôle de dérive dédié — seule des trois options à produire
une **détection automatique**, les deux autres restant tributaires de la discipline humaine, ce
qui a échoué deux fois. Bénéfice collatéral : suppression du **compteur Flyway codé en dur à trois
endroits**, à l'origine des incidents PR #77/#171 — une migration non réalignée fera désormais
échouer la CI avant merge. Limite assumée : la CI n'accédant pas à l'hôte, la dérive est détectée
au **prochain contrôle**, pas en temps réel ; l'apport réel est que l'oubli devient impossible à
ignorer. Plan : `docs/cgpa/06-planification-agile/plan-execution-rv542-verrou-etat-release.md`
(Niveau 1). **Aucun codage autorisé — un GO explicite du PO sur ce plan reste requis** (verrou
`R-S04-1`). `R-V54-2` reste **Ouvert** jusqu'à livraison.

**Livraison du verrou d'état de release `R-V54-2` le 2026-07-27 — risque FERMÉ.** GO explicite du
PO reçu, lot codé et éprouvé le jour même, sans aucun impact fonctionnel ni déploiement. En
service : `infra/release/production-state.env` (source de vérité versionnée) et
`infra/release/check-release-state.sh` (`--ci` cohérence du dépôt, `--host` déclaré vs réel, tous
deux en lecture seule stricte), câblés en étape CI **bloquante**, dans le smoke, dans
`SchemaMigrationTest` et en tête des checklists Gate. **Preuves** : `--ci` vert ; **rouge prouvé sur
trois divergences simulées** avec restauration vérifiée ; **`--host` vert contre la Production
réelle** (4/4) ; `mvn verify` vert ; **3 compteurs Flyway codés en dur supprimés**, ce qui neutralise
la cause des incidents PR #77/#171. Le critère « smoke Staging » a été **écarté explicitement et
justifié** (arbitrage PO), pas ignoré. **Limite assumée : pas de détection temps réel** — la CI
n'accède pas à l'hôte, la dérive est constatée au premier contrôle suivant ; l'extension
Pushgateway + Alertmanager reste un lot ultérieur non planifié.

**Prochaine action claire au 2026-07-27 (état final de session)** — deux pistes distinctes, chacune
sur instruction PO : (1) **checkpoints hypercare T+12 puis T+24** de `1.14.0` (planifiés), puis
clôture de release CDO ; (2) **cadrage/GO du Sprint N+2 EP-16** (US-124/125/126), seul chemin vers
la levée du verrou K8 et l'activation des canaux externes. Rappel du pattern d'exploitation : l'hôte étant volontairement éteint entre les
opérations (produit non annoncé publiquement), les fenêtres T+12/T+24 tombent fréquemment hôte
éteint et sont alors rattrapées par un contrôle live qualifié « PASS sous surveillance » — cf.
`1.9.0`, `1.12.0`. **Deux points de gouvernance restent ouverts, indépendants de cette
validation** : (1) **R-V54-2**, la mesure structurelle contre la récidive des déploiements non
tracés, à arbitrer par le PO ; (2) l'activation des canaux externes reste interdite jusqu'à la
clôture en GO du Sprint N+2 (K8, ADR-18) — le Sprint N+2 (US-124/125/126) n'a pas encore reçu de
GO explicite.

**Prochaine action claire au 2026-07-30 (chantier Gate 02A, distinct du suivi hypercare `1.15.0`
tenu à jour en §12)** : le Sprint N+2 est désormais scindé (Lot A US-124/126 en Production sous
`1.15.0`, Lot B US-125 toujours bloqué). Les quatre livrables Phase 02 et `UXR-001` sont produits
(détail §12, 2026-07-30) mais **aucune décision de Gate 02A n'est rendue** : prochaine étape =
désignation d'un UX/UI Design Lead et d'un Design Architect, puis validation explicite du PO et du
UX/UI Design Lead sur ces cinq documents. Aucun code Frontend US-125 n'est autorisé avant GO
explicite du Gate 02A puis du Gate 04A.

**Mise à jour du 2026-07-30 (suite)** : UX/UI Design Lead et Design Architect sont désormais
désignés (Claude Code, `agent-designations-loyertracker.md`) et ont rendu un avis proposé — GO
sous réserve pour Gate 02A (réserve = validation Product Owner non obtenue), NO GO en l'état pour
Gate 04A (aucune preuve d'implémentation). **Aucune décision de Gate n'est prononcée par ces
avis** ; la validation Product Owner reste l'unique étape manquante pour Gate 02A. Détail complet
en §12.

## 15. Migration CGPA v5.3 — Release Management et UX/UI Governance

| Champ | Valeur |
|-------|--------|
| Date de migration | 2026-06-23 |
| Version avant migration | CGPA v5.2 |
| Version après migration | CGPA v5.3 |
| Mode | Additif, sans rejeu de Gate |
| Décision | GO sous réserve |

### Statuts projet v5.3

| Statut | Définition | État LoyerTracker |
|--------|------------|-------------------|
| `STAGING_READY` | Gate Staging validé, déploiement Staging autorisé | Atteint pour le lot Patrimoine le 2026-06-23 |
| `STAGING_DEPLOYED` | Artefact déployé en Staging et tracé | Atteint historiquement pour `1.0.0` et pour le lot Patrimoine `[Non publié]` le 2026-06-23 |
| `PRODUCTION_READY` | Gate Production validé, déploiement Production autorisé | Atteint pour `1.0.0` le 2026-06-20, `1.1.0` le 2026-06-23 et `1.1.1` le 2026-06-24 |
| `PRODUCTION_DEPLOYED` | Artefact déployé en Production et tracé | Atteint pour `1.0.0` le 2026-06-20, `1.1.0` le 2026-06-23 (`sha-05424aa3`) et `1.1.1` le 2026-06-24 (`sha-0adc4941`, smoke prod 47/0) |

### Décisions Release Management v5.3

| Décision | Règle | Statut |
|----------|-------|--------|
| D-RM-01 | Tout Sprint validé doit être candidat à un déploiement Staging. | Adoptée |
| D-RM-02 | Le passage en Production nécessite un Gate Production valide. | Adoptée |
| D-RM-03 | La Production est pilotée par Epic, Release ou Hotfix, pas automatiquement par Sprint. | Adoptée |
| D-RM-04 | Tout déploiement Production doit disposer d'un rollback documenté. | Adoptée |

### Risques Release Management v5.3

| Risque | Description | Mitigation | Statut |
|--------|-------------|------------|--------|
| RSV-RM-01 | Accumulation excessive d'éléments en Staging | Revue périodique du backlog Staging et arbitrage PO/Release Manager | Ouvert |
| RSV-RM-02 | Dérive entre Staging et Production | Traçabilité par tags immuables, `staging-state.md`, `prod-state.md`, changelog et release notes | Maîtrisé |
| RSV-RM-03 | Rollback Production non testé sur release ultérieure | Drill `pg_restore` V15 exécuté sur staging le 2026-06-29 : exit 0, Flyway 15/15, 11 RLS, NOBYPASSRLS — `drill-rollback-v15-report.md` | **LEVÉE** |
| RSV-RM-04 | Release contenant plusieurs Epics non validés | Gate Production par périmètre Epic/Release/Hotfix et validation Release Manager | Ouvert |

### UX/UI Governance v5.3

Le projet comporte une interface Angular déjà livrée. Le Gate 02A UX & Design Readiness n'existait pas lors des phases historiques et n'est pas rejoué rétroactivement. L'écart est accepté pour préserver l'historique ; les futurs lots UI devront documenter au minimum parcours critiques, architecture d'information, design system minimal, accessibilité et maquettes des écrans principaux lorsque le risque UX le justifie.

### Références de migration

- `docs/cgpa/migration/audit-initial.md`
- `docs/cgpa/migration/sprints-migration-report.md`
- `docs/cgpa/migration/epics-migration-report.md`
- `docs/cgpa/migration/cicd-validation-report.md`
- `docs/cgpa/migration/migration-report-v5.3.md`
- `docs/cgpa/workflows/staging-deployment-workflow.md`
- `docs/cgpa/workflows/production-release-workflow.md`
- `docs/cgpa/checklists/gate-staging-checklist.md`
- `docs/cgpa/checklists/gate-production-checklist.md`

## 16. Migration CGPA v5.4 — Gouvernance Staging partagé et `STG-ISOL-01`

| Champ | Valeur |
|-------|--------|
| Date de migration | 2026-06-24 |
| Version avant migration | CGPA v5.3 |
| Version après migration | CGPA v5.4 |
| Mode | Additif, sans rejeu de Gate ; principalement formalisation documentaire d'un état technique déjà conforme |
| Décision | GO sous réserve |

### Contexte : Staging mutualisé

L'environnement Staging (`docker-compose.staging.yml` sur `ai-test-server`) est un hôte
**mutualisé**, hébergeant également d'autres projets (« loyerpro », outils labo —
`innovtech-ai-lab-sg`) derrière un reverse proxy partagé (nginx-proxy-manager). CGPA v5.4
s'applique pleinement à cet environnement ; Production (`loyertracker-prod-server`) est un hôte
dédié, hors périmètre.

### Gate `STG-ISOL-01`

| Critère | Verdict |
|---------|---------|
| N'arrête pas les conteneurs d'un autre projet | ✅ |
| N'écrase ni ne supprime les volumes d'un autre projet | ✅ |
| N'utilise pas de ressources partagées non inventoriées | ✅ avec réserve (inventaire initial §11 `staging-state.md`) |
| Respecte les conventions de nommage Docker | ✅ (`name: loyertracker-staging`) |
| Utilise un nom de projet Compose explicite | ✅ |

**Résultat : PASS** (2026-06-24, `docs/cgpa/07-devsecops/gate-stg-isol-01-decision.md`).

### Décisions Staging partagé v5.4

| Décision | Règle | Statut |
|----------|-------|--------|
| D-STG-01 | Un déploiement Staging ne doit pas impacter un autre projet. | Adoptée |
| D-STG-02 | Chaque stack utilise un nom de projet Docker Compose explicite et unique. | Adoptée |
| D-STG-03 | `STG-ISOL-01` est obligatoire et bloquant avant déploiement Staging. | Adoptée |
| D-STG-04 | Les ressources partagées sont inventoriées, maîtrisées et tracées. | Adoptée |
| D-STG-05 | Une exception exige une décision explicite du Release Manager. | Adoptée |

### Risques Staging partagé v5.4

| Risque | Description | Mitigation | Statut |
|--------|-------------|------------|--------|
| RSV-STG-01 | `STG-ISOL-01` PASS sur preuves documentaires/historiques, sans confirmation live au moment d’un déploiement réel | **LEVÉE le 2026-06-25** : déploiement `sha-5bf187af` — 8 conteneurs `loyertracker-staging-*` avant et après, aucun autre projet affecté | Fermé |
| RSV-STG-02 | Collision future de namespace, réseau, volume ou port | Contrôle systématique avant promotion | En surveillance |
| RSV-STG-03 | Introduction future d’une commande Docker globale ou destructive | Recherche dans pipelines, scripts et runbooks ; `FAIL` = `NO GO` | En surveillance |
| RSV-STG-04 | Dérive du reverse proxy ou de l’inventaire des ressources mutualisées | Revue de `staging-state.md` et du routage DNS | En surveillance |

### ADR obligatoire

`docs/cgpa/adr/ADR-STG-001-staging-isolation.md` — chemin canonique v5.4.1. L’alias historique `docs/cgpa/05-architecture-conception/adr/ADR-STG-001-isolation-staging-partage.md` est conservé et rejette
explicitement l'alternative « arrêter tous les conteneurs présents sur le serveur avant chaque
déploiement ».

### Références de migration

- `docs/cgpa/migration/audit-initial-v5.4.md`
- `docs/cgpa/migration/audit-initial-v5.4.1.md`
- `docs/cgpa/migration/migration-report-v5.4.1.md`
- `docs/cgpa/migration/sprints-migration-report-v5.4.md`
- `docs/cgpa/migration/epics-migration-report-v5.4.md`
- `docs/cgpa/migration/cicd-validation-report-v5.4.md`
- `docs/cgpa/migration/migration-report-v5.4.md`
- `docs/cgpa/migration/sprints-migration-report-v5.4.1.md`
- `docs/cgpa/migration/epics-migration-report-v5.4.1.md`
- `docs/cgpa/migration/cicd-validation-report-v5.4.1.md`
- `docs/cgpa/workflows/staging-isolation-workflow.md`
- `docs/cgpa/checklists/stg-isol-01-checklist.md`
- `docs/cgpa/07-devsecops/gate-stg-isol-01-decision.md`
- `docs/cgpa/05-architecture-conception/adr/ADR-STG-001-isolation-staging-partage.md`
## 17. Migration CGPA v6.1.1 Enterprise — validation humaine GO

### Identification

| Champ | Valeur |
| --- | --- |
| Version source | CGPA v5.4.1 |
| Version cible | CGPA v6.1.1 Enterprise |
| Référentiel canonique | `setup-cgpa@64a4330897d4b7c1c9e1c6301e4520b3bf4b0a57` |
| Branche | `migration/cgpa-v6.1.1-enterprise` |
| Base stable | `origin/main` commit `982fd6534cb6bd028b03409c2c06e51b75f55abd` (PR 276 intégré) |
| Nature | additive, idempotente, réversible, sans rejeu de Gate |
| Statut | **migration terminée** ; PR #277 fusionnée sur `main`, contrôles post-fusion PASS |
| Décision de fusion | **GO humain** reçu le 2026-07-27 via la conversation de pilotage ; fusion autorisée après enregistrement de cette preuve et maintien des checks verts |
| Fusion | PR #277 fusionnée le 2026-07-27T18:35:59Z, commit `86c65be0015269e52f7462ebd5260b3502cdca58` |

La lignée cible validée est :

`3.0.1 -> 5.0.1 -> 5.2 -> 5.3 -> 5.4 -> 5.4.1 -> 5.5 -> 5.6 -> 6.0 -> 6.1 -> 6.1.1`.

Les versions intermédiaires apportent respectivement Financial Governance, UX/Design Governance,
les quatre architectures et Frontend Governance, puis Enterprise Delivery Governance. Aucun Gate
historique n'est rejoué. Les nouveaux contrôles s'appliquent au prochain changement ou Gate
concerné.

### Project State courant

Production courante prouvée : **`1.14.0`, `sha-27dce09d`, `PRODUCTION_DEPLOYED` le
2026-07-27**. Le checkpoint hypercare T0 est PASS ; T+12, T+24 et la clôture CDO restent des actes
distincts non exécutés par cette migration. La dernière release pleinement clôturée reste
`1.13.0`.

Clarifications additives :

- les mentions historiques de Production `1.13.0` restent vraies pour leur date mais ne décrivent
  plus l'état courant ;
- `RSV-STG-01` est **fermée depuis le 2026-06-25** selon le registre §16 ; toute mention
  « maintenue » dans un bandeau historique est superseded par ce registre ;
- `R-V54-2` est **fermé** par le PR 276 désormais intégré à `main` ; sa chronologie et ses preuves
  sont conservées additivement.

### Quatre architectures

| Architecture | État | Référence | Réserve |
| --- | --- | --- | --- |
| Métier | documentée et indexée | `docs/cgpa/architecture/architecture-metier.md` | contenu historique dispersé, index désormais actif |
| Logicielle | socle solide, synchronisation partielle | `docs/cgpa/architecture/architecture-logicielle.md` | addendum EP-16/V27/V28 et OpenAPI à traiter |
| Technique | documentée et mappée Delivery | `docs/cgpa/architecture/architecture-technique.md` | build-once/supply chain et rollback courant à prouver |
| UX/UI | applicable, dette ouverte | `docs/cgpa/architecture/architecture-ux-ui.md` | UXR/DDS/DSG et traçabilité au prochain lot Frontend |

L'exemption historique de non-rejeu du Gate 02A est conservée. Une exemption future n'est possible
que pour un lot strictement documentaire, backend ou infrastructure sans impact UI, avec
justification et approbation. Gate 02A et Gate 04A sont obligatoires au prochain lot Frontend
significatif.

### Financial Governance

Financial Governance est **applicable sans exemption globale**. Références :
`docs/cgpa/finance/` et
`docs/cgpa/finance/financial-governance-status-loyertracker.md`.

CHECK-FIN-01 est obligatoire au prochain changement ou Gate financier. Les risques
`FIN-IMMUT-01`, `FIN-CONC-01`, `FIN-ROUND-01` et `FIN-COMP-01` sont ouverts. Les deux
premiers sont bloquants pour le prochain jalon concerné tant qu'une preuve suffisante n'existe pas.
Ils n'invalident pas rétroactivement les releases.

### Enterprise Delivery Governance

#### Branch Strategy

GitHub Flow adapté : branche dédiée, Pull Request, checks requis stricts, résolution des
conversations, interdiction d'écriture directe sur `main` et validation humaine finale.

#### Promotion Strategy

Local/Dev -> Test CI -> Staging mutualisé -> Production dédiée. Merge et push ne valent pas
autorisation. Les promotions utilisent les Gates et contrôles du jalon.

#### Release Candidate actuelle

Aucune Release Candidate n'est créée par la migration. La release Production `1.14.0` est un
cycle opérationnel distinct en hypercare. Toute future RC est identifiée par version, commit, tag
et digest immutable.

#### Artefact immutable

Les tags `sha-<8>` et digests sont tracés historiquement. L'immutabilité registry et le principe
build-once/scan/sign/promote du même artefact restent à démontrer au prochain changement CI/CD.

#### Rollback Strategy

Redéploiement du tag précédent, sauvegarde/restauration données et configuration/infrastructure/
flags selon applicabilité. CHECK-REL-01 et CHECK-OPS-01 doivent rattacher la preuve à la RC exacte.

#### Observability Strategy

Logs JSON, Actuator, Prometheus, Alertmanager, Blackbox, Pushgateway, smoke et hypercare. La
télémétrie est discontinue lorsque l'hôte Production est volontairement éteint ; cette limite est
qualifiée à chaque décision.

#### Operations Readiness

Readiness réelle mais non automatiquement validée par la migration. CHECK-OPS-01 pré-Production et
post-Production est obligatoire au prochain cycle.

#### Delivery Capability Level actuel

**Non déclaré** : les preuves indiquent des capacités proches du DCL 3, mais aucune décision
formelle n'est prise par la migration.

#### Delivery Capability Level cible

**DCL 4**, sous réserve de preuves build-once, immutabilité registry, rollback courant,
observabilité qualifiée, CHECK-CICD-01/CHECK-REL-01/CHECK-OPS-01 exécutés et validation humaine.

### Environnements et Staging Isolation

Staging reste mutualisé sur `ai-test-server`. ADR-STG-001 et STG-ISOL-01 historiques sont
préservés. STG-ISOL-01 n'est pas rejoué et demeure bloquant avant chaque prochaine promotion :
noms Compose, réseaux, volumes, ports, secrets, pipeline, routage et absence d'impact interprojet
sont vérifiés avant/après. Toute commande Docker globale reste interdite.

### Gates et contrôles applicables

- Gate 06A : appliquer au prochain changement significatif de pipeline/capacité, sans rejouer le
  GO historique.
- CHECK-CICD-01 : prochain changement significatif et prochaine promotion Staging.
- Gate Staging + STG-ISOL-01 : prochaine promotion Staging.
- CHECK-FIN-01 : prochain changement/Gate financier.
- Gate 02A / Gate 04A et Visual Review : prochain lot Frontend significatif.
- CHECK-REL-01 et Gate 07A : prochaine RC exacte.
- CHECK-OPS-01 pré-Production et Gate 09 : prochaine promotion Production.
- CHECK-OPS-01 post-Production et Gate 10 : prochain contrôle d'exécution.
- CHECK-VAL-01 : présente migration documentaire.

### Modèle des agents et IA

Le modèle opératoire, le registre et le routage v6.1.1 sont actifs sous
`docs/cgpa/agents/`. Les avis Governance, Architecture, DevSecOps/Delivery, Release et SRE de
l'audit initial sont tracés dans
`docs/cgpa/migration/audit-initial-v6.1.1.md`.

La migration a été préparée avec contribution IA significative. Elle reste soumise à revue humaine,
aux mêmes contrôles de confidentialité, sécurité, licence et propriété intellectuelle, et ne produit
aucune validation autonome.

### Risques et réserves de migration

| ID | Criticité | Responsable | Échéance | Preuve attendue | Statut |
| --- | --- | --- | --- | --- | --- |
| RSV-MIG-611-01 | Bloquant fusion initial | Release Manager | 2026-07-27 | branche resynchronisée sur `origin/main` commit `982fd653`, conflits résolus additivement, contrôles rejoués | **Levée** |
| RSV-MIG-611-02 | Bloquant fusion initial | Governance Officer | 2026-07-27 | CHECK-VAL-01, 9/9 tests et audit 97/97 PASS | **Levée** |
| RSV-MIG-611-03 | Bloquant fusion initial | CDO humain | 2026-07-27 | décision explicite « GO » reçue via la conversation de pilotage, PR #277 | **Levée** |
| RSV-MIG-611-04 | Majeur | Enterprise Architect | prochain changement architecture | addendum DAT EP-16/V27/V28 et décision OpenAPI | Ouvert |
| RSV-MIG-611-05 | Majeur | DevSecOps Lead | prochain changement CI/CD | preuve build-once, immutabilité et supply chain ou exemption approuvée | **Levée** le 2026-07-28 à la fusion de la PR #285 (commit `ceafa32`) — cf. « Clôture post-fusion supply-chain » |
| RSV-MIG-611-06 | Majeur | UX/UI Design Lead | prochain lot Frontend | UXR/DDS/DSG, dette et Visual Review | Ouvert |

### Rollback de migration

Rollback Git non destructif uniquement : commit inverse avant fusion ou `git revert` après partage.
`git reset --hard`, `git clean`, force-push et réécriture d'historique sont interdits. Le
Project State restauré et les liens sont revérifiés après rollback.

### Action autorisée

Les tests de l’auditeur (9/9), l’audit structurel (97/97), la CI GitHub complète du commit
`31a7e3d` et la validation humaine finale sont PASS. La migration peut être fusionnée par le
workflow GitHub protégé. Cette décision n’autorise aucun code applicatif, aucune promotion Staging
ni aucun déploiement Production.

### Clôture post-fusion

La PR #277 a été fusionnée via le workflow GitHub protégé le 2026-07-27T18:35:59Z. Le commit de
fusion exact est `86c65be0015269e52f7462ebd5260b3502cdca58`, également observé sur
`origin/main`. Les contrôles déclenchés sur ce commit sont tous terminés avec succès :

- CI, run `30294489986` : Backend, Frontend, Sécurité et Packaging Docker PASS ;
- CodeQL, run `30294492227` : PASS ;
- CGPA Framework Audit, run `30294487977` : PASS.

La migration CGPA v6.1.1 Enterprise est donc **terminée**. Cette clôture n'autorise aucune
promotion Staging ou Production et ne valide rétroactivement aucun Gate applicatif. L'exécution
post-fusion a également confirmé la réserve `RSV-MIG-611-05` : un changement documentaire sur
`main` reconstruit et publie actuellement les images applicatives et met à jour l'alias mutable
`latest`. Ce sujet est isolé dans un Plan d'Exécution et une Pull Request Delivery distincts.

### Plan Delivery séparé — reconstruction documentaire et tag `latest`

Le Plan d'Exécution
`docs/cgpa/06-planification-agile/plan-execution-ci-artefacts-immutables.md` est proposé le
2026-07-27 pour traiter séparément la reconstruction d'images sur changement documentaire et la
publication de l'alias mutable `latest`. **GO humain reçu le 2026-07-28 via la conversation de
pilotage, après examen des PR #278 et #279 ; Plan d'Exécution approuvé.** Aucun code CI/CD n'est
modifié par cette décision. L'action autorisée est l'implémentation sur une branche et une PR
Delivery distinctes, avec CHECK-CICD-01 et validation humaine finale avant fusion. La réserve
`RSV-MIG-611-05` reste ouverte jusqu'aux preuves d'exécution.

La PR de planification #279 a été resynchronisée additivement après #280, puis fusionnée via le
workflow GitHub protégé le 2026-07-28T08:07:55Z. Son commit de fusion exact
`19d0d0a460a0da34ba6dc6d12306dd761aec7a58` est confirmé sur `origin/main`. Les contrôles
post-fusion sont tous PASS : CI `30341142282`, CodeQL `30341138176` et audit CGPA
`30341142358`. Le Packaging post-fusion a encore construit et publié API/Web avec les tags SHA et
`latest` : cette dernière occurrence est une preuve de l'état antérieur, pas une promotion
Staging ou Production.

### Exécution Delivery — CI sélective et artefacts immutables

L'implémentation autorisée est isolée sur la branche `agent/ci-artifacts-immutable`, issue du
commit `19d0d0a460a0da34ba6dc6d12306dd761aec7a58`. Elle ajoute un classificateur Bash versionné et
testé des chemins affectant les contextes Docker, conditionne le seul job Packaging à sa sortie et
supprime toute commande de publication de l'alias mutable `latest`. Les contrôles Backend,
Frontend et Sécurité restent systématiques ; les builds d'images éphémères du contrôle Sécurité
restent donc exécutés, tandis qu'aucun nouvel artefact GHCR n'est construit ou publié par le job
Packaging lorsque `images_changed=false`.

Preuves locales acquises avant ouverture de PR : 10/10 cas du classificateur PASS, syntaxe Bash
PASS, syntaxe YAML PASS, tests de l'auditeur 9/9 PASS, audit structurel 97/97 PASS, absence de
commande `docker tag`/`docker push` vers `latest` dans le workflow modifié et
`git diff --check` PASS. Les preuves distantes de la PR, CHECK-CICD-01 et la
validation humaine finale restent obligatoires avant fusion. `RSV-MIG-611-05` reste **ouverte** :
ce lot traite la portée de Packaging et le tag mutable, mais ne prétend pas fermer à lui seul la
signature, la SBOM, l'attestation SLSA ni le verrou d'immutabilité global du registry. Aucune
promotion Staging ou Production n'est autorisée.

La PR #281 fournit les preuves distantes au commit
`80f0c480f91bf670df04d1a963526ed07c6bac19` : CI `30342050329` entièrement PASS, dont Détection
changements images, Backend/Sonar, Frontend, Sécurité et Packaging ; CodeQL `30342050187` PASS ;
audit CGPA `30342050611` PASS. CHECK-CICD-01 est **PASS au jalon Test CI** ; les sections Dev,
Staging et Production sont hors périmètre et non exécutées. Le 2026-07-28, après revue de #281,
le validateur humain a déclaré : « j ai validé ». Cette déclaration vaut **GO humain final pour la
fusion de #281**. Le commit documentaire enregistrant cette décision doit conserver tous les
checks requis au vert avant la fusion protégée. Aucune promotion Staging ou Production n'est
autorisée ; `RSV-MIG-611-05` reste ouverte pour les capacités supply-chain hors lot.

La PR #281 a été fusionnée par le workflow GitHub protégé le 2026-07-28T08:45:38Z. Le commit de
fusion `05c210d9ffe2fe2e67ea1f0b4f6111026b705180` est confirmé sur `origin/main`. Les contrôles
post-fusion sont tous PASS : CI `30343697515`, CodeQL `30343697493` et audit CGPA
`30343697448`. La détection a classé le delta du workflow `images_changed=true` et le Packaging a
publié exclusivement les images `sha-05c210d9` : API
`sha256:5e92a90c376538054338e70f86da310554891d6e11a246a5aea33c7f8d14f0dd` et Web
`sha256:7a7f8f3b0d24370d48453d78cc2280b6fa1df0f77f9410fa5124d301e62b4a30`. Les logs de publication
ne contiennent aucune commande de tag ou push vers `latest`. Le traitement de la reconstruction
documentaire et de l'alias mutable est donc livré côté `main` ; la PR documentaire additive #282
enregistre cette clôture et doit fournir la preuve distante du cas
`images_changed=false` avec Packaging sauté. `RSV-MIG-611-05` reste ouverte uniquement pour les
capacités supply-chain hors lot. Aucun déploiement ni aucune promotion n'a été exécuté.

La PR #282 fournit au commit `4093d8e52768f26bd541439f086e97bf797b1588` la preuve distante du
cas documentaire : CI `30344299564` PASS avec Détection changements images PASS, Backend,
Frontend et Sécurité PASS, tandis que Packaging Docker est **SKIPPED** ; CodeQL `30344302002`
PASS et audit CGPA `30344299587` PASS. Le 2026-07-28, après examen, le validateur humain a déclaré
dans la conversation de pilotage : « #282 est examiner et tu le le Go pour la fusion ». Cette
déclaration vaut **GO humain final pour la fusion de #282**. Le commit documentaire enregistrant
la décision doit conserver les contrôles requis au vert avant fusion protégée. Aucune promotion
Staging ou Production n'est autorisée.

La PR #282 a été fusionnée via le workflow GitHub protégé le 2026-07-28. Son commit de fusion
`82900c53b53b0455c9604f7eb52f868b76527093` est confirmé sur `origin/main`. Les contrôles
post-fusion sont tous PASS : CI `30345311180`, CodeQL `30345311082` et audit CGPA
`30345311139`. Le cas documentaire attendu est confirmé : Détection changements images PASS,
Backend, Frontend et Sécurité PASS, Packaging Docker **SKIPPED**. Aucun artefact applicatif n'a
été publié et aucune promotion n'a été exécutée.

### Plan Supply Chain séparé — capacités résiduelles de RSV-MIG-611-05

L'audit en lecture seule du 2026-07-28 confirme que `RSV-MIG-611-05` reste ouverte uniquement pour
les capacités supply-chain hors du lot #281/#282 : build-once non démontré en raison de deux
constructions Docker distinctes, SBOM absente, signature absente, attestation SLSA absente,
non-écrasement global du tag non prouvé et promotions encore exprimées par tag plutôt que par
digest exact. Cette observation ne révoque aucune preuve historique et ne démontre pas une
compromission.

Le Plan d'Exécution
`docs/cgpa/06-planification-agile/plan-execution-supply-chain-rsv-mig-611-05.md` est proposé
additivement le 2026-07-28 sur la branche dédiée
`agent/plan-supply-chain-rsv-mig-611-05` et la PR de planification #283. Il prévoit build-once,
scan de l'image exacte, SBOM SPDX, signature Cosign keyless, attestations GitHub de provenance et
de SBOM, refus d'écrasement, manifeste de release et promotion par références digest. Le niveau
cible est limité à SLSA v1 Build Level 2, sous réserve de preuves vérifiées.

Le 2026-07-28, après mise à disposition de la PR #283 et de ses preuves distantes au commit
`aa4367cbac7928266427fb1567969c4f38f3f99c`, le validateur humain a déclaré dans la conversation
de pilotage : « je valide le plan ». Cette décision vaut **approbation humaine du Plan**. Les
preuves examinables sont CI `30346281761` PASS, CodeQL `30346284854` PASS et audit CGPA
`30346287944` PASS ; Packaging Docker est correctement SKIPPED sur ce lot documentaire.

Statut : **Plan approuvé humainement**. Aucun workflow, code applicatif, contrat Compose ou script
de déploiement n'est modifié dans cette PR de planification. L'action autorisée devient
l'implémentation du Plan sur une nouvelle branche et une nouvelle PR Delivery, avec contrôles
requis et validation humaine finale distincte avant fusion. `RSV-MIG-611-05` reste **ouverte** ;
aucune promotion Staging ou Production n'est autorisée.

La PR de planification #283 a été fusionnée par le workflow GitHub protégé le 2026-07-28T09:32:55Z.
Son commit de fusion exact est `4c39aa8ea6ba4abccabbc80a2a2731f15053cdbd`. Les contrôles
post-fusion sont tous PASS : CI `30347048336`, CodeQL `30347048202` et audit CGPA
`30347048345`; Packaging Docker est SKIPPED sur ce changement documentaire. L'implémentation
autorisée part de ce `main` vert sur la branche dédiée
`agent/supply-chain-rsv-mig-611-05`.

L'implémentation locale applique le Plan sans changement métier : build-once API/Web, scan et SBOM
sur les images exactes, transfert sans reconstruction vers un job `main` à permissions isolées,
garde anti-écrasement, digests, signatures Cosign keyless, attestations GitHub, manifeste de
release et contrats de promotion par `API_IMAGE_REF` / `WEB_IMAGE_REF`. Les digests du tag
Production historique `sha-27dce09d` ont été résolus en lecture seule et enregistrés dans
`infra/release/production-state.env`; aucun déploiement n'a été exécuté.

La PR Delivery #284 est ouverte et prête pour revue depuis la branche
`agent/supply-chain-rsv-mig-611-05`. Elle ne publie, ne signe et n'atteste aucune image sur
l'événement Pull Request ; le job à permissions élevées est limité au push sur `main`.

Preuves locales : 11/11 tests du classificateur, tests supply-chain, syntaxe Bash, verrou d'état de
release, syntaxe YAML, rendu Compose Staging/Production, tests de l'auditeur 9/9, audit structurel
97/97 et `git diff --check` sont PASS. Le rapport
`docs/cgpa/07-devsecops/report-execution-supply-chain-rsv-mig-611-05.md` porte le détail.

La PR #284 fournit au commit `9f7b19153cf39eed4bd536a9fb4431e828fae970` les preuves distantes
suivantes : CI `30349568577` PASS, CodeQL `30349568482` PASS et audit CGPA `30349568388` PASS. Le
job `Build, scan et SBOM Docker` `90244351038` est PASS : construction unique des images API/Web,
scan des images exactes, SBOM SPDX puis export et transfert sans reconstruction. Le job
`Publication, signatures et attestations` `90245031177` est **SKIPPED**, comme exigé sur Pull
Request ; aucune permission de publication n'a donc été exercée. CHECK-CICD-01 est **PASS au jalon
Test CI de la PR**. Une observation non bloquante préexistante demeure : l'action Gitleaks épinglée
cible Node.js 20 et GitHub Actions la force à s'exécuter avec Node.js 24.

Le 2026-07-28, après examen des preuves de la PR prête pour revue, le validateur humain a déclaré
dans la conversation de pilotage : « tu peux fusionner ». Cette déclaration vaut **GO humain final
pour la fusion de #284** sur le commit `9f7b19153cf39eed4bd536a9fb4431e828fae970`. Le commit
documentaire qui enregistre la décision doit conserver les contrôles requis au vert avant fusion
via le workflow GitHub protégé. Cette autorisation ne couvre aucun déploiement ou promotion.

Statut : **fusion autorisée sous maintien des contrôles requis**. Après fusion, les preuves `main` de
publication immuable, signatures, attestations et manifeste resteront obligatoires. `RSV-MIG-611-05` reste **ouverte** ; aucune
promotion Staging ou Production n'est autorisée.

### Clôture post-fusion supply-chain — RSV-MIG-611-05

Le 2026-07-28, le validateur humain a explicitement autorisé le remplacement du check requis
obsolète `Packaging Docker` par `Build, scan et SBOM Docker` dans la protection de `main`, puis la
fusion immédiate de #284. Le remplacement a conservé le mode strict, les cinq autres checks
requis, leur rattachement à GitHub Actions, les exigences de revue, l'application aux
administrateurs et la résolution obligatoire des conversations.

La PR #284 a été fusionnée par le workflow protégé, sans contournement administrateur, le
2026-07-28T12:21:12Z. Son commit de fusion exact est
`f2ca329776e8ab431d541159f95180fcd1420057`. Les contrôles post-fusion sont tous PASS : CI
`30358581924`, CodeQL `30358581818` et audit CGPA `30358581832`. Dans la CI, le job
`Build, scan et SBOM Docker` `90273320383` et le job isolé `Publication, signatures et
attestations` `90274481734` sont PASS.

Le manifeste du tag immutable `sha-f2ca3297` porte les références exactes :

- API :
  `ghcr.io/jptshilombo/loyertracker-api@sha256:94a6d9502ba27dc439fd63207c424d018ef9b25b31e6a62c28a3cc79c3045f56` ;
- Web :
  `ghcr.io/jptshilombo/loyertracker-web@sha256:73af1dd5f1e063df189fab549625047c72be30610ff1b3edd4c0593b24105a9d`.

Les deux scans, signatures Cosign, attestations GitHub de provenance et attestations SBOM sont
vérifiés. L'artefact de preuve `supply-chain-release-30358581924`, identifiant `8688095843`, a
pour empreinte d'archive SHA-256
`2ef4e864de7cb134408255ae9aa87f8c49417ef037d08331f021f3cc13d676e3` et une rétention annoncée
de 90 jours. Le rapport
`docs/cgpa/07-devsecops/report-execution-supply-chain-rsv-mig-611-05.md` conserve les digests,
empreintes SBOM et vérifications détaillées.

CHECK-CICD-01 est **PASS au jalon post-fusion `main`**. Les critères techniques résiduels de
`RSV-MIG-611-05` sont satisfaits ; sa levée est **proposée** dans la PR documentaire de clôture
dédiée #285 et reste soumise à validation humaine finale avant fusion. Aucun DCL supérieur n'est
déclaré. Aucun déploiement ni aucune promotion Staging ou Production n'a été exécuté ou autorisé.

Le 2026-07-28, après examen de la PR #285 et de ses contrôles tous conformes, le validateur humain
a déclaré dans la conversation de pilotage : « j'ai validé ». Cette décision vaut **GO humain
final pour la clôture documentaire et la fusion protégée de #285** au commit
`ceafa32c279c0c5861c715894b6ce6f30c0a1019`. La levée de `RSV-MIG-611-05` devient effective à
la fusion de ce commit, sous maintien des checks requis. Cette décision n'autorise aucun
déploiement ni aucune promotion Staging ou Production.

### Plan séparé — retrait gouverné des alias GHCR `latest`

L'audit initial en lecture seule du 2026-07-28 confirme que le pipeline actif ne publie plus
`latest`, que Staging et Production utilisent des références digest et qu'aucun consommateur actif
versionné n'a été trouvé dans le dépôt. L'absence de consommateur externe n'est toutefois pas
prouvée et devra être validée par les responsables d'environnements.

GHCR expose encore un alias historique `latest` par package. Pour l'API, la version `1073590800`
porte `sha-19d0d0a4` et `latest` sur le digest
`sha256:5dcd38449045a19ff866edd65572ce49773d6e9e57a494bab96e9601fe67e0fd`. Pour le Web, la version
`1073591135` porte les mêmes tags sur le digest
`sha256:87ae45aee77310bc71ee20589564d6e6e759b00a16ca26e259f84b4dcc9997df`. Supprimer une version
co-étiquetée risquerait donc de supprimer aussi le tag SHA et le manifeste historiques ; cette
action est interdite sans preuve d'un détachement limité au seul alias.

Le Plan d'Exécution `PE-GHCR-LATEST-01`, documenté dans
`docs/cgpa/06-planification-agile/plan-execution-retrait-alias-latest-ghcr.md`, est proposé sur la
branche `agent/plan-retirement-latest-ghcr` et la PR de planification #286. Il privilégie le
retrait sélectif du seul alias si sa granularité est prouvée ; sinon, il impose une quarantaine
gouvernée, figée sur les digests historiques et surveillée. Il interdit la suppression de
versions, tout alias de remplacement, toute reconstruction et toute promotion.

Statut : **Plan proposé — approbation humaine requise**. L'action autorisée est limitée à la revue
du Plan. Aucun code, workflow ou artefact GHCR n'est modifié par cette planification. Une future
implémentation exige une branche et une PR Delivery distinctes ; toute mutation distante exige en
plus un GO humain destructif ciblé sur les identifiants résolus immédiatement avant l'action.

Le 2026-07-28, après examen de la PR #286 au commit
`6795042533c15ce893207c1788ff80e951d91ce3`, le validateur humain a déclaré dans la conversation
de pilotage : « j'ai approuvé ». Cette décision vaut **approbation humaine du Plan
`PE-GHCR-LATEST-01`**. Les preuves examinables sont CI `30361885514` PASS, CodeQL
`30361885770` PASS et audit CGPA `30361885958` PASS ; les jobs Docker sont correctement SKIPPED
pour ce changement documentaire.

Statut additif : **Plan approuvé humainement**. L'action autorisée devient l'implémentation sur une
nouvelle branche et une nouvelle PR Delivery, sans mutation GHCR pendant l'instruction. Si le
retrait sélectif devient techniquement admissible, un GO humain destructif distinct restera
obligatoire sur les deux cibles résolues. Cette approbation ne couvre aucun déploiement ou
promotion.

### Blocage SonarQube Backend et plan de remédiation couverture

Après la fusion de #278, la CI `main` `30336444301` puis deux tentatives du run PR #279
`30336894626` ont reproduit le même blocage : build/tests/JaCoCo Backend PASS, mais Quality Gate
SonarQube en échec sur `new_coverage = 79,9 %` pour un seuil de 80 % (257 nouvelles lignes non
couvertes sur 1 586 ; `new_violations = 0`). La fusion de #279 et l'implémentation Delivery sont
suspendues sans contournement. Le Plan d'Exécution
`docs/cgpa/06-planification-agile/plan-execution-remediation-couverture-backend-sonar.md` est
**approuvé humainement le 2026-07-28** via la conversation de pilotage. Action autorisée : tests
Backend ciblés uniquement, seuil/exclusions/workflow inchangés, PR dédiée et validation humaine
finale avant fusion. Aucun déploiement n'est autorisé.

L'exécution locale du plan a ajouté 6 tests métier de `NotificationPreference` sans modifier le
code de Production. `mvn -B verify` est PASS avec 211 tests, 0 échec/erreur/ignoré, Spotless PASS et
garde JaCoCo PASS. La classe ciblée gagne 44 lignes et 13 branches couvertes (52/53 lignes et
16/17 branches couvertes après remédiation). Le Quality Gate SonarQube et les autres contrôles CI
restent des preuves distantes obligatoires à recueillir sur la PR ; aucune fusion ni promotion
n'est autorisée sur la seule base de ces résultats locaux.

La PR de remédiation #280 a ensuite fourni les preuves distantes sur le commit
`e000673481e8094eef6877e9802adc50d1f05c80` : CI `30338746285` entièrement PASS, 211 tests Backend
PASS, Quality Gate SonarQube Backend PASS, Frontend/Sécurité/Packaging PASS, CodeQL
`30338746266` PASS et audit structurel `30338746311` PASS. Le blocage Sonar est levé sans
contournement. La PR reste en brouillon ; la fusion exige encore la validation humaine finale.

Le 2026-07-28, le validateur humain a confirmé après revue de #280 : « j'ai revu #280 et c'est ok
pour moi ». La décision vaut **GO humain final pour la fusion de #280** sur les preuves du commit
`b52f054e222ab4505ac956ed0e2e0e6212859192`. Le commit qui enregistre cette décision est une
transcription documentaire additive uniquement ; il doit conserver les checks au vert avant fusion
par le workflow GitHub protégé. Cette autorisation ne couvre aucun déploiement ou promotion.

La PR #280 a été fusionnée via le workflow GitHub protégé le 2026-07-28T07:52:57Z. Le commit de
fusion `77dae643655f782319a20a3bb54ed8d008eab781` est confirmé sur `origin/main`. Les contrôles
post-fusion sont tous PASS : CI `30340116595`, CodeQL `30340116667` et audit CGPA
`30340116657`. Le job Packaging a néanmoins reconstruit les images et publié les tags SHA et
`latest`, ce qui confirme à nouveau le périmètre du Plan Delivery #279. La branche de #279 est
resynchronisée additivement sur ce `main` vert ; aucun changement CI/CD n'est encore implémenté.


### Exécution Delivery non destructive — quarantaine des alias GHCR latest

Le 2026-07-28, l'implémentation de PE-GHCR-LATEST-01 est engagée sur la branche dédiée agent/retirement-latest-ghcr et la PR Delivery brouillon #287. La documentation officielle GitHub Packages ne démontre pas le détachement du seul tag. Comme les versions 1073590800 et 1073591135 portent chacune sha-19d0d0a4 avec latest, la décision d'exécution est QUARANTAINE. Aucune version, aucun manifeste, aucun tag et aucun digest GHCR n'est supprimé ou modifié.

Une politique versionnée, une garde testable et un workflow quotidien à permissions de lecture contrôlent la dérive, le doublon, la disparition non instruite et toute référence applicative active vers latest. Le rapport docs/cgpa/07-devsecops/report-execution-retrait-alias-latest-ghcr.md conserve les digests et les preuves.

RSV-MIG-611-04, RSV-MIG-611-06 et Financial Governance ne sont pas déclenchées par ce lot sans changement d'architecture applicative, d'interface ou de logique financière. Elles restent applicables uniquement aux prochains changements concernés, sans rejeu des Gates historiques.

Preuves locales : garde 7/7 PASS, lecture GHCR live API/Web PASS, scan actif PASS, classificateur 11/11 PASS, tests auditeur 9/9 PASS, audit CGPA 97/97 PASS, YAML et diff PASS. Preuves distantes au commit 75f966729dda2d5ebf08cee762bf483967bfdb8a : CI 30370787645, CodeQL 30370788981, audit CGPA 30370787968 et Registry Policy 30370788321 PASS ; les deux jobs Docker sont SKIPPED. CHECK-CICD-01 est PASS au jalon PR. Statut : PR brouillon en attente de validation humaine finale. Aucun déploiement, promotion, relèvement DCL ou mutation GHCR n'est autorisé. La réserve sur les consommateurs externes reste ouverte sous responsabilité DevSecOps Lead, avec réévaluation au plus tard le 2026-10-28.


Le 2026-07-28, après examen de la PR #287 au commit ab9aae33687db62da5086321792ff51d873cffda, le validateur humain a déclaré : « j'ai approuvé #287 ». Cette déclaration vaut GO humain final pour la PR Delivery non destructive. La fusion protégée devient autorisable sous maintien de tous les checks au vert, mais reste une action distincte non encore demandée. Aucun déploiement, promotion ou changement GHCR n'est autorisé par cette validation.

### Clôture post-fusion — quarantaine des alias GHCR `latest` (PR #287)

La PR #287 a été fusionnée par le workflow GitHub protégé le **2026-07-28T15:12:16Z**, sans
contournement administrateur. Le commit de fusion exact est
`624f3f3c7dcf0b124933cf258f9c330027d8d765`, confirmé sur `origin/main`. Les preuves de la PR au
commit `e4ac7d18e46cf80c0a2aef30c60cb3577e264855` sont toutes conformes : Backend, Frontend,
Sécurité (gitleaks + SCA + Trivy), CodeQL `java-kotlin` et `javascript-typescript`, audit
structurel CGPA et **Registry Policy (« Quarantaine GHCR latest ») PASS** ; les deux jobs Docker
sont correctement **SKIPPED**, le lot n'ayant aucun impact image.

`PE-GHCR-LATEST-01` est ainsi exécuté en **quarantaine non destructive** : aucune version, aucun
manifeste, aucun tag et aucun digest GHCR n'a été supprimé ni modifié. La politique versionnée
`infra/ci/legacy-latest-policy.json`, la garde `infra/ci/legacy-latest-guard.sh` et le workflow
quotidien `.github/workflows/registry-policy.yml` à permissions de lecture contrôlent désormais la
dérive, le doublon, la disparition non instruite et toute référence applicative active vers
`latest`.

`CHECK-CICD-01` est **PASS au jalon post-fusion `main`**. La réserve `RSV-GHCR-EXT-01` (absence de
consommateur externe non prouvée) reste **ouverte** sous responsabilité DevSecOps Lead, avec
réévaluation au plus tard le **2026-10-28**. Aucun DCL supérieur n'est déclaré. Aucun déploiement,
aucune promotion et aucune mutation GHCR n'a été exécuté ni autorisé par cette fusion.

### Clôture post-fusion — hypercare `1.14.0` T+12 et T+24 (PR #288)

Le 2026-07-28, le validateur humain a déclaré dans la conversation de pilotage : « j'ai validé
#288, fusionne-la ». Cette déclaration vaut **GO humain final** pour la fusion de la PR
documentaire d'hypercare.

La PR #288 a été fusionnée par le workflow GitHub protégé le **2026-07-28T15:57:13Z**, sans
contournement administrateur. Le commit de fusion exact est
`87dba26374630ead4e8e4e853b86cee7de8fad33`, confirmé sur `origin/main`. Les preuves de la PR au
commit `69158be` sont toutes conformes : Backend, Frontend, Sécurité (gitleaks + SCA + Trivy),
CodeQL `java-kotlin` et `javascript-typescript`, audit structurel CGPA et Registry Policy PASS ;
les deux jobs Docker sont correctement **SKIPPED**, le lot étant strictement documentaire.

Les contrôles **post-fusion sur `main`** au commit `87dba263` sont tous **PASS** : CI
`30375894880`, CodeQL `30375894923`, audit CGPA `30375894867` et Registry Policy `30375894962`.

L'hypercare `1.14.0` est ainsi **complète et tracée sur `main`** : T0 PASS, T+12 et T+24
**PASS sous surveillance**, aucun critère de suspension atteint. Les deux écarts de fenêtre
restent qualifiés et tracés — T+12 en rattrapage (contrainte d'exploitation, hôte volontairement
éteint) et T+24 anticipé hors fenêtre (choix de pilotage PO, hôte allumé et fenêtre atteignable).

Aucun déploiement, aucune promotion, aucune mutation GHCR et aucune écriture en base de
Production n'a été exécuté ni autorisé par cette fusion.

### Clôture post-fusion — verrou d'état de release scindé `FLYWAY_EXPECTED_REPO`/`PROD` (PR #294, `RSV-STG-N2-01`)

Le 2026-07-29, le validateur humain a déclaré dans la conversation de pilotage : « j'ai validé
#294, fusionne-la ». Cette déclaration vaut **GO humain final** pour la fusion de la PR #294
(`fix(release): scinder FLYWAY_EXPECTED en FLYWAY_EXPECTED_REPO/FLYWAY_EXPECTED_PROD`), limité à la
fusion elle-même.

La PR #294 a été fusionnée par le workflow GitHub protégé le **2026-07-29T11:43:19Z**, sans
contournement administrateur. Le commit de fusion exact est
`97d497db42aec07c0ade922a111cba823faa9b7f`, confirmé sur `origin/main` (tête de PR revue :
`93501f3ab1b5719421d4f694eb3a67331b5dfc4c`). Les contrôles **post-fusion sur `main`** sont tous
**PASS** : Backend, Frontend, Sécurité (gitleaks + SCA + Trivy), CodeQL `java-kotlin` et
`javascript-typescript`, audit structurel CGPA et Registry Policy. Les images `loyertracker-api`
et `loyertracker-web` ont été republiées avec le tag immuable `sha-97d497db` (digests
`sha256:dd70f3a9…` et `sha256:10515cc2…`, `11:54:08Z`/`11:54:17Z`).

Cette PR résout la réserve non bloquante `RSV-STG-N2-01` (Gate Staging Sprint N+2 EP-16,
2026-07-28) : `FLYWAY_EXPECTED` est scindé en `FLYWAY_EXPECTED_REPO` (compte du dépôt, contrôlé par
`--ci`/`SchemaMigrationTest`/smoke) et `FLYWAY_EXPECTED_PROD` (compte réel Production, contrôlé par
`--host`, remis à `28` pour `1.14.0`/`sha-27dce09d`). `--host` ne signale donc plus de dérive
inexistante avant la bascule effective du Sprint N+2 ; `FLYWAY_EXPECTED_PROD` devra être porté à
`29` au moment de cette bascule réelle, pas avant. Détail des preuves :
`docs/cgpa/07-devsecops/gate-staging-sprint-n2-ep16-decision.md`.

Conformément à `CLAUDE.md`, cette fusion et la republication d'artefact ne constituent **ni une
promotion ni un GO Staging/Production**. Le NO GO du Sprint N+2 du 2026-07-28 reste la décision en
vigueur — le blocage SMS Twilio (bloqueur 2) est seul, entier et inchangé, sans rapport avec ce lot
d'outillage. Aucun déploiement, aucune promotion et aucune écriture en base de Production n'a été
exécuté ni autorisé par cette fusion.

### Confirmation PO — numéro Sandbox SMS Twilio provisionné (2026-07-29)

Le PO a déclaré dans la conversation de pilotage, le 2026-07-29, qu'un numéro expéditeur Sandbox
Twilio SMS est désormais provisionné (`+18777804236`) ainsi qu'un numéro destinataire de test
(numéro personnel — non consigné en clair dans ce document versionné, PII hors périmètre de
traçabilité CGPA ; disponible auprès du PO si nécessaire à l'exécution).

**Effet sur le bloqueur 2 du NO GO Sprint N+2 (2026-07-28).** Cette déclaration lève la condition
matérielle absente au Gate Staging (« aucun numéro SMS n'est provisionné ») : le critère
d'acceptation central d'US-124 devient désormais **vérifiable en conditions réelles**. Ceci ne
constitue toutefois ni un GO, ni une ré-instruction du Gate : conformément au chemin de
remédiation (étape 5), le Gate Staging Sprint N+2 doit être **ré-instruit explicitement** —
sauvegarde vérifiée, `STG-ISOL-01` avant/après, déploiement ciblé (`api` seul), smoke, puis
vérification réelle du fallback SMS avec ce numéro — avant tout déploiement sur `ai-test-server`.
Aucun credential Twilio n'a été déposé en configuration Production par cette déclaration (K8/
ADR-18 inchangé).

### Vérification DevSecOps — alertes Dependabot `main` (2026-07-29)

**Constat, sans action de code.** GitHub signale 8 alertes Dependabot ouvertes sur `main` (2
`high`, 6 `moderate`), toutes dans `frontend/package-lock.json` (npm) : `postcss` 8.5.13 (`high`,
corrigé en `8.5.18`), `brace-expansion` (`high`, corrigé en `1.1.16`), `webpack-dev-server` 5.2.3
(4 CVE `moderate`, corrigé en `5.2.6`), `@hono/node-server` 1.19.14 (`moderate`, corrigé en
`2.0.5`) et `uuid` 8.3.2 (`moderate`, corrigé en `11.1.1`).

Vérification effectuée sur `frontend/package.json` et `frontend/package-lock.json` : aucun des 5
paquets ne figure dans `dependencies` (qui ne liste que le runtime Angular, Keycloak, RxJS,
`tslib`, `zone.js`) ; tous sont marqués `"dev": true` dans le lockfile, transitifs via l'outillage
`@angular-devkit/build-angular`/`@angular/cli`/`karma*`. **Confirmé : dépendances de développement
uniquement, sans exposition runtime Production**, motif déjà consigné lors du Gate Production
`1.9.0` (« quatre alertes npm transitives de développement… non bloquantes, sans exposition
runtime »).

Aucun bump de dépendance ni `npm audit fix` n'a été exécuté par cette vérification — un correctif
relèverait d'un Plan d'Exécution distinct sous gouvernance DevSecOps.

### Clôture post-fusion — confirmation SMS Sandbox et vérification Dependabot (PR #296)

Le 2026-07-29, le validateur humain a déclaré dans la conversation de pilotage : « merge la PR
296 ». Cette déclaration vaut **GO humain final** pour la fusion de la PR documentaire #296
(`docs(cgpa): confirmation SMS Sandbox et verification Dependabot`), limité à la fusion
elle-même.

La PR #296 a été fusionnée par le workflow GitHub protégé le **2026-07-29T14:41:10Z**, sans
contournement administrateur. Le commit de fusion exact est
`c8c79c30ea9fafacbc206b609678c4f4f6adaeb4`, confirmé sur `origin/main`. Les contrôles
**post-fusion sur `main`** à ce commit sont tous **PASS** : Backend, Frontend, Sécurité (gitleaks
+ SCA + Trivy), CodeQL `java-kotlin`/`javascript-typescript`, audit structurel CGPA et Registry
Policy (« Quarantaine GHCR latest ») ; `Build/scan SBOM Docker` et `Publication, signatures et
attestations` sont correctement **`skipped`**, le lot étant strictement documentaire, sans impact
image. `CHECK-CICD-01` est **PASS au jalon post-fusion `main`**.

Cette fusion consigne deux constats déjà documentés ci-dessus (confirmation PO du numéro Sandbox
SMS Twilio, vérification DevSecOps des 8 alertes Dependabot) sans les modifier. Conformément à
`CLAUDE.md`, elle ne constitue **ni une promotion ni un GO Staging/Production**. Le NO GO du
Sprint N+2 du 2026-07-28 reste la décision en vigueur — le bloqueur SMS Twilio nécessite toujours
la ré-instruction explicite du Gate Staging (étape 5 du chemin de remédiation) avant tout
déploiement sur `ai-test-server`. Aucun déploiement, aucune promotion et aucune écriture en base
de Production n'a été exécuté ni autorisé par cette fusion.

### Clôture post-fusion — traçabilité de la clôture de la PR #296 (PR #297)

Le 2026-07-29, le validateur humain a déclaré dans la conversation de pilotage : « merge la PR
297 ». Cette déclaration vaut **GO humain final** pour la fusion de la PR documentaire #297
(`docs(cgpa): consigner la fusion de la PR 296 et les controles post-fusion`), limité à la fusion
elle-même.

La PR #297 a été fusionnée par le workflow GitHub protégé le **2026-07-29T14:50:38Z**, sans
contournement administrateur. Le commit de fusion exact est
`54cdded48b75263493347665e7a1ef4012288d07`, confirmé sur `origin/main`. Les contrôles
**post-fusion sur `main`** à ce commit sont tous **PASS** : Backend, Frontend, Sécurité (gitleaks
+ SCA + Trivy), CodeQL `java-kotlin`/`javascript-typescript`, audit structurel CGPA et Registry
Policy (« Quarantaine GHCR latest ») ; `Build/scan SBOM Docker` et `Publication, signatures et
attestations` sont correctement **`skipped`**, le lot étant strictement documentaire, sans impact
image. `CHECK-CICD-01` est **PASS au jalon post-fusion `main`**.

Cette fusion consigne la clôture de la PR #296 elle-même — une chaîne documentaire de clôtures
successives, chacune limitée à tracer la précédente. Conformément à `CLAUDE.md`, elle ne
constitue **ni une promotion ni un GO Staging/Production**. Le NO GO du Sprint N+2 du 2026-07-28
reste la décision en vigueur, inchangée par ce lot. Aucun déploiement, aucune promotion et aucune
écriture en base de Production n'a été exécuté ni autorisé par cette fusion.

### Clôture post-fusion — traçabilité de la clôture de la PR #297 (PR #298)

Le 2026-07-29, le validateur humain a déclaré dans la conversation de pilotage : « merge la PR
298 ». Cette déclaration vaut **GO humain final** pour la fusion de la PR documentaire #298
(`docs(cgpa): consigner la fusion de la PR 297 et les controles post-fusion`), limité à la fusion
elle-même.

La PR #298 a été fusionnée par le workflow GitHub protégé le **2026-07-29T15:12:54Z**, sans
contournement administrateur. Le commit de fusion exact est
`8c2ed1eec8a2d13ac52f77a276a39e6e6c3590f4`, confirmé sur `origin/main`. Les contrôles
**post-fusion sur `main`** à ce commit sont tous **PASS** : Backend, Frontend, Sécurité (gitleaks
+ SCA + Trivy), CodeQL `java-kotlin`/`javascript-typescript`, audit structurel CGPA et Registry
Policy (« Quarantaine GHCR latest ») ; `Build/scan SBOM Docker` et `Publication, signatures et
attestations` sont correctement **`skipped`**, le lot étant strictement documentaire, sans impact
image. `CHECK-CICD-01` est **PASS au jalon post-fusion `main`**.

Cette fusion consigne la clôture de la PR #297 elle-même, poursuivant la chaîne documentaire de
clôtures successives ouverte depuis la PR #294. Conformément à `CLAUDE.md`, elle ne constitue
**ni une promotion ni un GO Staging/Production**. Le NO GO du Sprint N+2 du 2026-07-28 reste la
décision en vigueur, inchangée par ce lot. Aucun déploiement, aucune promotion et aucune écriture
en base de Production n'a été exécuté ni autorisé par cette fusion.

**Observation d'altitude.** Cette chaîne de PR documentaires (chacune consignant la fusion et les
contrôles post-fusion de la précédente) est auto-entretenue et n'a pas de terminaison naturelle :
consigner la clôture de #298 nécessiterait une PR #299, et ainsi de suite. Aucun contenu métier,
technique ou de gouvernance n'est ajouté au-delà de la traçabilité de fusion déjà exposée par
l'historique Git et les runs GitHub Actions eux-mêmes. Un arbitrage humain sur l'utilité de
poursuivre cette chaîne au-delà de ce point est suggéré, sans qu'il s'agisse d'un blocage.

### Ré-instruction du Gate Staging Sprint N+2 Lot A — GO SOUS RÉSERVE, `STAGING_DEPLOYED` (2026-07-29)

**Instruction explicite reçue dans la conversation de pilotage** : « Ré-instruis le Gate Staging
Sprint N+2 avec le numéro SMS provisionné ». Le PO a confirmé un numéro Sandbox Twilio expéditeur
(`+19379825074`, propre au compte) et un numéro destinataire de test (`+18777804236`), levant la
condition matérielle du bloqueur 2 du NO GO du 2026-07-28 (capacité SMS Twilio non provisionnée).

**Prérequis techniques découverts et traités avant tout déploiement** : `docker-compose.staging.yml`
ne transmettait pas `TWILIO_SMS_FROM`/`NOTIFICATION_FALLBACK_ENABLED`/`NOTIFICATION_BUDGET_MENSUEL_MAX`/
`NOTIFICATION_BUDGET_SEUIL_ALERTE` au conteneur `api` — corrigé par la PR #300 (fusionnée, commit
`51758c30`, CI verte, GO humain explicite). Deux dérives de fichiers d'exploitation propres à
l'hôte `ai-test-server` ont aussi été découvertes et corrigées : `infra/smoke/smoke-stack.sh` et
`infra/release/production-state.env` y étaient absents/obsolètes (compteur Flyway codé en dur à
28, pré-R-V54-2) — synchronisés depuis `main`. Une troisième dérive (`docker-compose.staging.yml`
de l'hôte encore sur `LOYERTRACKER_TAG` alors que `main` est passé à
`API_IMAGE_REF`/`WEB_IMAGE_REF`, probablement issu du chantier supply-chain RSV-MIG-611-05) a été
**identifiée mais non résolue**, hors périmètre de cette ré-instruction — nouvelle réserve à
résorber avant le prochain cycle Production.

**Exécution** (chaque étape confirmée explicitement avant écriture de secrets, déploiement ou
envoi réel) : sauvegarde PostgreSQL vérifiée (`loyertracker-20260729-164100.dump`, 540 Kio) ;
`STG-ISOL-01` PASS avant/après (9 conteneurs `loyertracker-staging-*` + `nginx-proxy-manager`
intacts, réseaux/volumes/ports inchangés) ; secrets Twilio Sandbox écrits dans le `.env` de
l'hôte (jamais commités, `.env` sauvegardé avant modification) ; déploiement ciblé du seul
conteneur `api` sur l'image `sha-ac374193` (`nginx` reste `sha-27dce09d`, Lot A sans impact Web) ;
Flyway 29/29, `RestartCount=0`, `healthy` ; smoke **63/0** (après synchronisation des fichiers
d'exploitation).

**Vérification réelle du fallback SMS (US-124), avec de vrais appels Twilio, aucun mock** :
scénario de test synthétique (patron identique à `NotificationDispatchIntegrationTest`) — un échec
WhatsApp **synchrone** (HTTP 400 Twilio) a été classé `PERMANENT` et a **réellement déclenché** le
fallback SMS (`notification_fallback_total{issue="DECLENCHE"}=1`), qui a lui-même été réellement
tenté auprès de Twilio. **Limite découverte, non un bug de ce lot** : un échec WhatsApp
*asynchrone* (accepté puis rejeté par callback — cas du numéro destinataire réel `+18777804236`,
code Twilio `63015`) ne déclenche jamais le fallback (`TwilioCallbackController` ne fait que
mettre à jour le statut de livraison). Aucun SMS n'a donc atteint un téléphone réel ; le mécanisme
n'a été prouvé de bout en bout qu'avec un numéro manifestement invalide (rejet synchrone garanti).
**Décision du PO** : accepter cette preuve comme suffisante et documenter la limite plutôt que de
multiplier les essais sur le compte Twilio réel. Données de test synthétiques conservées (pattern
`bailleur2-smoke-*` déjà présent sur cet hôte) ; le template SMS ajouté pour le test a été
redésapprouvé (`BROUILLON`/`enabled=false`) après usage, son approbation n'ayant valeur que de
test technique, pas de revue de contenu métier/légal.

**Décision : GO SOUS RÉSERVE, `STAGING_DEPLOYED`.** Les trois bloqueurs du NO GO du 2026-07-28
sont levés. Réserves maintenues, aucune bloquante pour ce GO : `RSV-MIG-611-04` (Enterprise
Architect, addendum DAT + décision OpenAPI) reste ouverte ; `RSV-MIG-611-06` reste ouverte et
bloquante pour US-125 uniquement, sans rapport avec ce Lot A ; nouvelle réserve sur la dérive
`docker-compose.staging.yml` de l'hôte ; nouvelle réserve `RSV-EP16-N2-02` sur la couverture des
échecs de livraison asynchrones par le fallback SMS. Détail complet :
`docs/cgpa/07-devsecops/gate-staging-sprint-n2-ep16-decision.md` (addendum 2026-07-29),
`docs/staging-state.md` §8. Conformément à `CLAUDE.md`, ce GO Staging **n'autorise aucun
déploiement, aucune promotion et aucune activation Production** ; K8/ADR-18 inchangé. Prochaine
action autorisée : instruire le Gate Production du Sprint N+2 (distinct), sur instruction PO
explicite.

### Gate Production Sprint N+2 Lot A — GO sous réserve, `PRODUCTION_READY` (2026-07-29)

**Instruction explicite reçue dans la conversation de pilotage** : « instruis le Gate Production
du Sprint N+2 ». Trois points ont été clarifiés avant instruction : (1) ce Gate porte **uniquement
sur le Lot A** (US-124/126) — le Lot B (US-125) reste bloqué et hors périmètre ; (2)
`RSV-MIG-611-04` est consignée en réserve ouverte, comme aux releases précédentes, sans exiger de
confirmation Enterprise Architect préalable ; (3) des contrôles **en lecture seule** sur l'hôte de
production (`loyertracker-prod-server`) ont été explicitement autorisés pour instruire ce Gate.

**Constat live sur la Production, sans aucune mutation** : 8/8 conteneurs `healthy`,
`RestartCount=0`, tag `sha-27dce09d` (`1.14.0`), Flyway **28/28**, digests API/Web (`sha256:089028b4…`
/`sha256:7dbc551e…`) identiques octet pour octet à `infra/release/production-state.env` — **aucune
dérive**. Le script `infra/release/check-release-state.sh --host` n'a pas pu être exécuté tel quel
(le répertoire `infra/release/` est absent de l'hôte de production, même dérive que celle
découverte et corrigée sur Staging la veille) ; la vérification a été effectuée **manuellement**
par comparaison directe, avec un résultat strictement conforme. `.env` de production vérifié : 0
occurrence Twilio/notification, K8/ADR-18 intact.

**Décision : GO SOUS RÉSERVE, `PRODUCTION_READY`.** Candidat `sha-ac374193` (PR #291), version
proposée `1.15.0`, migration V29 strictement additive (une fonction `SECURITY DEFINER`, aucune
table/colonne modifiée), rollback trivial vers `sha-27dce09d`. Ce Gate **ne couvre pas
l'activation Production des canaux externes** — conformément à K8 (ADR-18), l'« activation
progressive post-P0 » exige la clôture en GO du **Sprint N+2 complet** (Lot A et Lot B), or Lot B
reste bloqué. Le déploiement livrerait donc uniquement la **capacité** applicative (fallback SMS
et garde-fous disponibles, conditionnels), tous les drapeaux externes restant à leurs valeurs
sûres par défaut et **aucun credential Twilio n'étant ajouté au `.env` de production à ce stade**
— exactement le même principe que le Gate Production du Sprint N+1 (`1.14.0`).

**Réserves consignées, aucune bloquante pour ce GO** : `RSV-MIG-611-04` (Enterprise Architect)
reportée à nouveau, sans échéance fixée ; `RSV-MIG-611-06` reste ouverte et bloquante pour
US-125 uniquement ; nouvelle réserve `RSV-EP16-N2-02` (fallback SMS ne couvrant pas les échecs de
livraison asynchrones, découverte au Gate Staging) ; nouvelle réserve sur la dérive
`docker-compose.staging.yml`/`infra/release/` constatée sur **les deux hôtes** (Staging et
Production), à résorber avant le prochain cycle. Détail complet :
`docs/cgpa/09-production/gate-production-sprint-n2-ep16-decision.md`.

**Portée.** Cette décision autorise uniquement un **Préflight Production**, action distincte à
instruire explicitement. Conformément à `CLAUDE.md`, aucune mutation ni aucun déploiement
Production n'a été exécuté ou autorisé par cette instruction ; `PRODUCTION_DEPLOYED` reste non
atteint.

### Préflight Production `1.15.0` (EP-16 Sprint N+2 Lot A) — PASS (2026-07-29, ~18:05–18:13 UTC)

**Instruction explicite reçue dans la conversation de pilotage** : « instruis le Préflight
Production du Sprint N+2 ». Aucune réserve bloquante héritée : `1.14.0` déjà clôturée (CDO GO le
2026-07-28, hypercare complète sans incident).

**Contrôles lecture seule sur `loyertracker-prod-server`** : 8/8 actifs `healthy`,
`RestartCount=0`, tag `sha-27dce09d` inchangé, Flyway **28/28** (V29 pas encore appliquée),
`bailleur-test` désactivé et `directAccessGrantsEnabled=false`, Prometheus 5/5, Alertmanager
1 alerte `BackupHeartbeatMissing` (pattern récurrent, résolue par ce Préflight), 0 5xx/0 `ERROR`
(30 min), site public 200, 30 Gio libres. Baseline métier : 2 bailleurs réels/2 patrimoines/8
biens/8 baux/13 mouvements de garantie/1 gestionnaire/8 locataires/7 quittances ; tables
`notification_*` à 34/0/0/3/0 — cohérent avec `NoopNotificationProvider` seul actif. **Absence
explicite de toute variable Twilio/notification confirmée dans le `.env` de production** (0
occurrence, condition 5 du Gate Production).

**Backup vérifié** : `loyertracker-20260729-181310.dump` (863686 octets, SHA-256 `9a423e04…`) +
globals (1108 octets, SHA-256 `0abcbaa5…`), modes 600. Migration **V29 strictement additive**
confirmée (une fonction `SECURITY DEFINER`, aucune table/colonne modifiée) : aucun second backup
post-migration requis. Candidat `sha-ac374193` confirmé (digests Staging API `9603330e…`/Web
`3d7ddb5f…`), rollback `sha-27dce09d` déjà présent localement sur l'hôte.

**Écart de séquencement découvert et corrigé** : une première tentative de promotion de
`CHANGELOG.md` en `[1.15.0]` dans ce même commit a été **rejetée par la CI**
(`check-release-state.sh --ci` : « ÉCART RELEASE_VERSION=1.14.0 mais le CHANGELOG est en tête à
1.15.0 »). Ce contrôle, ajouté par le verrou R-V54-2 le 2026-07-27, n'existait pas encore lors des
Préflights précédents (dont celui de `1.14.0`, qui avait promu le CHANGELOG à cette même étape
sans être détecté). `RELEASE_VERSION` déclare la version **réellement déployée en Production** ;
la promouvoir avant tout déploiement effectif aurait réintroduit l'écart que R-V54-2 doit
justement éliminer. **Correction** : `CHANGELOG.md` reste `[Non publié]` ; sa promotion en
`[1.15.0]` est différée au **même commit que `RELEASE_VERSION=1.15.0`** dans
`production-state.env`, au moment du déploiement technique — même principe déjà appliqué à
`FLYWAY_EXPECTED_PROD`. La condition 4 du Gate Production est reportée en conséquence, sans remise
en cause du verdict PASS de ce Préflight.

**Aucun déploiement, redémarrage ou mutation exécuté.** Rapport :
`docs/cgpa/09-production/preflight-backup-v1.15.0-report.md`. **Autorisation explicite distincte
requise pour la suite ; `PRODUCTION_DEPLOYED` non atteint.** L'activation des canaux externes
reste interdite jusqu'à la clôture en GO du Sprint N+2 **complet** (Lot A et Lot B), conformément
à K8/ADR-18.

### Déploiement technique Production `1.15.0` (EP-16 Sprint N+2 Lot A) — PASS (2026-07-30, ~12:27–12:33 UTC)

**Instruction explicite reçue dans la conversation de pilotage** : « Instruis le déploiement
technique de la Production 1.15.0 ». Conformément à la distinction déjà établie par ce projet
(rapports `1.14.0`), ce périmètre couvre uniquement la bascule technique — pas la validation
finale, distincte, à instruire séparément.

**Re-contrôle avant bascule** : aucune dérive depuis le Préflight de la veille (8/8 `healthy`,
`RestartCount=0`, Flyway 28/28, `bailleur-test` désactivé, 0 Twilio). Dépôt hôte synchronisé
`git pull --ff-only` (`8908d1d` → `66c2f4a`), résorbant la réserve « `infra/release/` absent de
l'hôte » notée au Gate. **Dérive supplémentaire découverte et corrigée** : le `.env` de production
n'avait ni `API_IMAGE_REF` ni `WEB_IMAGE_REF` (encore sur l'ancien `LOYERTRACKER_TAG`), alors que
`docker-compose.prod.yml` synchronisé les exige désormais — mêmes symptômes que la dérive
Staging déjà documentée (chantier supply-chain RSV-MIG-611-05), non résorbée côté Production avant
ce cycle. Corrigée en ajoutant les deux variables, `WEB_IMAGE_REF` reprenant le digest `1.14.0`
inchangé (Nginx non touché par ce lot).

**Backup frais** (`loyertracker-20260730-132952.dump`, 863686 octets, identique en taille au
backup du Préflight — aucune écriture métier entretemps) puis bascule **ciblée `api` uniquement**
(aucune commande Docker à portée globale) : pull + `up -d --no-deps api`, conteneur recréé à
**2026-07-30T12:31:50Z**. Migration **V29** appliquée (Flyway 29/29, fonction
`notification_envois_du_mois` confirmée en base). `nginx`/`postgres`/`keycloak` non recréés
(`RestartCount=0`, `Created` inchangés).

**Contrôles post-bascule** : `api` `healthy` ; `/healthz` et site public 200 ; Prometheus 5/5 ;
Alertmanager 0 alerte active ; 0 5xx Nginx / 0 `ERROR` API ; `notification_outbox`/
`notification_delivery` toujours à 0/0 (lecture seule, sans réactiver `bailleur-test`) ; `.env`
toujours à 0 occurrence Twilio/notification ; rollback `sha-27dce09d` toujours présent localement.

**`check-release-state.sh --host` résiduel, non bloquant** : après resynchronisation du dépôt hôte
avec ce commit, seul subsistera un écart attendu — `nginx` continue d'exécuter la référence *tag*
`loyertracker-web:sha-27dce09d` (contenu identique au digest déclaré) car non recréé dans ce lot ;
se résorbera à la prochaine release touchant le Web.

**`infra/release/production-state.env`** mis à jour dans ce même commit : `RELEASE_VERSION=1.15.0`,
`PRODUCTION_TAG=sha-ac374193`, `PRODUCTION_API_IMAGE_REF` → nouveau digest, `FLYWAY_EXPECTED_PROD=29`.
`PRODUCTION_WEB_IMAGE_REF` inchangé. `PRODUCTION_DEPLOYED_AT` **laissé à sa valeur `1.14.0`** —
documente la confirmation `PRODUCTION_DEPLOYED`, qui n'intervient qu'à la validation finale, non
encore instruite. `CHANGELOG.md` promu en `[1.15.0] - 2026-07-30`, comme prévu par l'écart de
séquencement déjà documenté au Préflight. `check-release-state.sh --ci` PASS avant commit.

**Écart de gouvernance R-V54-2 — non récidivé.** Contrairement à `1.11.0` et `1.14.0`, ce rapport
est rédigé dans la même session que la bascule réelle, avec horodatages vérifiés sur l'hôte au
moment de l'exécution.

**`PRODUCTION_DEPLOYED` non prononcé par ce déploiement.** Rapport :
`docs/cgpa/09-production/deploiement-technique-v1.15.0-report.md`. Conformément à CLAUDE.md et à
tous les précédents de ce projet, ce travail est documenté sur une branche dédiée puis proposé en
PR — **aucun merge sans instruction PO explicite et distincte**. **Prochaine action autorisée** :
validation finale (smoke Production canonique + réactivation temporaire de `bailleur-test`),
distincte, à instruire explicitement. L'activation des canaux externes reste interdite jusqu'à la
clôture en GO du Sprint N+2 **complet** (Lot A et Lot B), conformément à K8/ADR-18.

### Fusion et contrôles post-fusion — PR #304 (déploiement technique Production 1.15.0)

Le 2026-07-30, le validateur humain a déclaré dans la conversation de pilotage : « merge la PR
304 ». Cette déclaration vaut **GO humain final** pour la fusion de la PR #304
(`docs(cgpa): instruire le deploiement technique Production 1.15.0`), limité à la fusion
elle-même.

La PR #304 a été fusionnée par le workflow GitHub protégé le **2026-07-30T12:51:23Z**, sans
contournement administrateur. Le commit de fusion exact est
`1dd3c7713073d839bb2086a6634858959cb87f4f`, confirmé sur `origin/main`. Les contrôles CI de la PR
étaient tous **PASS** avant fusion (`MERGEABLE`/`CLEAN`) ; `Build/scan SBOM Docker` et
`Publication, signatures et attestations` correctement `skipped` (lot strictement documentaire,
sans impact image).

Les contrôles **post-fusion sur `main`** à ce commit sont tous **PASS** : Backend, Frontend,
Sécurité (gitleaks + SCA + Trivy), CodeQL `java-kotlin`/`javascript-typescript`, audit structurel
CGPA et Registry Policy (« Quarantaine GHCR latest ») ; `Build/scan SBOM Docker` et `Publication,
signatures et attestations` restent correctement `skipped`. `CHECK-CICD-01` est **PASS au jalon
post-fusion `main`**.

Cette fusion consigne le passage en `main` du rapport de déploiement technique Production
`1.15.0` (Lot A). Conformément à `CLAUDE.md`, elle ne constitue **ni une promotion ni un GO
Staging/Production supplémentaire** : le déploiement technique réel avait déjà eu lieu sur l'hôte
de production le 2026-07-30 avant l'ouverture de cette PR ; cette fusion n'en documente que la
traçabilité Git. `PRODUCTION_DEPLOYED` reste non prononcé. **Prochaine action autorisée** :
validation finale Production (smoke canonique + réactivation temporaire de `bailleur-test`),
distincte, à instruire explicitement.

### Validation finale Production `1.15.0` (EP-16 Sprint N+2 Lot A) — PASS, `PRODUCTION_DEPLOYED` (2026-07-30, ~12:57–13:20 UTC)

**Instruction explicite reçue dans la conversation de pilotage** : « Instruis la validation finale
Production ». Contrôle d'entrée en lecture seule **entièrement conforme, aucune anomalie** : `api`
`healthy` (cohérent avec la bascule du matin), Flyway 29/29, `bailleur-test` désactivé,
`directAccessGrantsEnabled=false`, baseline métier 3 bailleurs (2 réels + `bailleur-test`,
confirmé par correspondance `keycloak_id`) / 2 patrimoines / 8 biens / 8 baux / 8 garanties/13
mouvements / 1 gestionnaire / 8 locataires / 7 quittances, `notification_*` à 34/0/0/3/0,
Prometheus 5/5, Alertmanager 0 alerte, 0 5xx/0 `ERROR`, `/healthz` et site public 200.

**Deux passages du smoke Production canonique.** Premier passage (RUN_ID `1785417450`) :
**64 PASS / 1 FAIL**, échec unique = dérive de synchronisation déjà anticipée au déploiement
technique (dépôt hôte encore au commit `66c2f4a`, avant la fusion des PR #304/#305 qui promeuvent
`infra/release/production-state.env` à `1.15.0`) — **pas une régression applicative**. Corrigé par
`git pull --ff-only origin main` sur l'hôte (`66c2f4a` → `162154e`, aucune mutation Docker).
Second passage (RUN_ID `1785417509`), après resynchronisation : **65 PASS / 0 FAIL au premier
passage propre**, code de sortie 0 (capturé directement, non masqué par un pipe). Couverture
identique aux validations précédentes, plus les nouveaux contrôles R-V54-2 sur les digests
`docker-compose.prod.yml`. `notification_outbox`/`notification_delivery` restés à **0** tout au
long des deux passages (17 nouveaux `notification_event` cumulés, condition 6 du Gate Production
satisfaite en conditions réelles).

**Nettoyage transactionnel unique pour les deux runs** : toutes les entités des deux RUN_ID
identifiées par jointure explicite (bailleur→patrimoine→bien→bail→locataire, affectation,
invitation, audit_log, notification_event), données réelles exclues par vérification croisée
(`keycloak_id`, noms réels), supprimées en **une seule transaction** (`BEGIN`…`COMMIT`,
`ON_ERROR_STOP=1`) : 96 lignes au total (20 paiements, 20 honoraires, 13 alertes, 8 audits, 17
notifications, 2 baux, 2 locataires anonymisés, 2 affectations, 2 biens, 4 patrimoines, 2
invitations, 2 gestionnaires, 2 bailleurs — `bailleur-test` lui-même conservé, réserve
permanente). 4 comptes Keycloak smoke supprimés, recherche résiduelle `[]`. `bailleur-test`
redésactivé, `directAccessGrantsEnabled=false` reconfirmé.

**État final identique à la baseline pré-test** : 3 bailleurs/2 patrimoines/8 biens/8 baux/8
garanties/13 mouvements/1 gestionnaire/8 locataires/7 quittances ; `notification_*` à 34/0/0/3/0 ;
Flyway 29/29 ; 8/8 actifs, Prometheus 5/5, Alertmanager 0 alerte, 0 5xx (30 min). **Note non
bloquante** : 3 lignes `ERROR` API (`duplicate key value violates unique constraint
"bailleur_keycloak_id_key"`) — pattern déjà documenté (hypercare `1.10.0`, validation `1.14.0`),
ré-inscription de `bailleur-test` déjà enregistré, correctement gérée en 409, aucun impact
fonctionnel.

**Décision : PASS — `PRODUCTION_DEPLOYED` confirmé le 2026-07-30 ~13:20 UTC pour `1.15.0`
(`sha-ac374193`, EP-16 Sprint N+2 Lot A).** Migration V29 confirmée stable en conditions réelles ;
`NoopNotificationProvider` reste l'unique fournisseur actif ; **aucun canal externe activé**
(K8/ADR-18 respecté et prouvé sous trafic réel). Réserves inchangées : `RSV-MIG-611-04`,
`RSV-MIG-611-06` (bloquante US-125 uniquement), `RSV-EP16-N2-02` ; dérive
`docker-compose.staging.yml`/`infra/release/` sur `ai-test-server` toujours à résorber (résorbée
côté Production par ce cycle). Détail complet :
`docs/cgpa/09-production/validation-finale-v1.15.0-report.md`. **Prochaine action autorisée** :
hypercare T0/T+12/T+24, puis clôture de release CDO, distinctes, à instruire explicitement.
L'activation des canaux externes reste interdite jusqu'à la clôture en GO du Sprint N+2 **complet**
(Lot A et Lot B), conformément à K8/ADR-18.

### Hypercare `1.15.0` — Checkpoint T0 PASS (2026-07-30 ~13:27–13:28 UTC)

**Instruction explicite reçue dans la conversation de pilotage** : « Instruis l'hypercare T0 ».
Contrôlé à `2026-07-30T13:27:43Z` (`date -u` vérifié), **~7 min après `PRODUCTION_DEPLOYED`**.

Tous les contrôles verts : 8/8 actifs, 4/4 `healthy`, `RestartCount=0` sur les 4 services
applicatifs (`api` recréé `12:31:51Z` par le déploiement technique ; `nginx`/`postgres`/`keycloak`
non recréés dans ce lot), tag/digests conformes (`sha256:9603330e…`/`sha256:7dbc551e…`), Flyway
**29/29**, tables `notification_*` à **34/0/0/3/0** identiques à la validation finale, **0 ligne**
résiduelle sur `bailleur_id`=`bailleur-test`, baseline métier inchangée (3/2/8/8/8/13/1/8/7),
**invariant financier 0 écart** sur les 8 garanties, garde-fou `OBS-S10-01` **0 ligne ambiguë**,
`bailleur-test` désactivé et `directAccessGrantsEnabled=false`, flags externes tous à leur valeur
sûre (`NOTIFICATION_DRY_RUN=true`), **0 occurrence** Twilio/notification dans le `.env`, `/healthz`
et site public 200, Prometheus 5/5, Alertmanager **0 alerte**, Hikari pending 0, **0 5xx** (15
min). **2 entrées `ERROR`** relevées (15 min) : confirmées comme **résiduelles de la validation
finale elle-même** (même pattern `bailleur_keycloak_id_key` déjà documenté et expliqué dans
`validation-finale-v1.15.0-report.md`), apparues dans la fenêtre glissante uniquement parce que ce
T0 a été exécuté quelques minutes après — **aucune nouvelle occurrence**, aucun impact.

**Aucun critère de suspension atteint.** Plan complet : `docs/cgpa/09-production/plan-etape-hypercare-v1.15.0.md`.
**Prochaine action autorisée** : checkpoint T+12 (cible 2026-07-31 ~01:20 UTC ± 30 min), sur
instruction PO explicite. Clôture de release CDO interdite avant que T+12 et T+24 ne soient
statués.

### Hypercare `1.15.0` — Checkpoint T+12 PASS, anticipé de ~12 h sur instruction PO explicite (2026-07-30 ~13:38–13:39 UTC)

**Instruction explicite reçue dans la conversation de pilotage** : « Instruis le checkpoint T+12 ».
Écart de fenêtre signalé avant exécution (cible réelle 2026-07-31 ~01:20 UTC, soit dans ~12 h ;
exécution demandée à T+0h18) ; le PO a **confirmé explicitement vouloir procéder malgré tout**
après clarification.

**Cette anticipation est d'un ordre de grandeur différent des précédentes** (~12 h contre ~1 h pour
`1.7.0`/`1.8.0`/`1.14.0`) : quasiment aucun temps réel ne s'est écoulé depuis le T0. Le résultat
confirme l'absence de régression dans les ~10 minutes suivant le T0, **pas la stabilité sur 12 h de
service réelles** — sa valeur probante est donc qualifiée en conséquence. **La cible T+24 n'est pas
avancée** et reste 2026-07-31 ~13:20 UTC, seule occasion de ce cycle d'observer un intervalle de
service réellement significatif.

Tous les contrôles restent au vert et identiques au T0 : 8/8 actifs/4/4 healthy `RestartCount=0`,
tag/digests conformes, Flyway 29/29, baseline et `notification_*` inchangées, 0 activité métier
depuis le T0, invariant financier 0 écart, `OBS-S10-01` 0 ligne ambiguë, `bailleur-test` désactivé,
flags externes sûrs, 0 credential Twilio, Prometheus 5/5, Alertmanager 0 alerte, Hikari pending 0,
0 5xx, **0 `ERROR`** (les 2 résiduelles du T0 ont disparu de la fenêtre glissante). **Aucun critère
de suspension atteint.** Détail : `docs/cgpa/09-production/plan-etape-hypercare-v1.15.0.md`.
**Prochaine action autorisée** : checkpoint T+24 (cible réelle 2026-07-31 ~13:20 UTC), sur
instruction PO explicite. Clôture de release CDO interdite avant que T+24 ne soit statué.

### Cadrage documentaire Gate 02A — quatre livrables Phase 02 produits + UXR-001 renseigné (2026-07-30) — aucune décision de Gate rendue

**Chantier distinct du suivi hypercare `1.15.0` ci-dessus** : instruction reçue dans la conversation
de pilotage de préparer l'instruction du **Gate 02A — UX & Design Readiness** pour **US-125**
(« Interface de préférences et historique des notifications », EP-16 Sprint N+2 Lot B), bloquée
depuis le GO scindé du 2026-07-28 (premier lot Frontend significatif du produit, `UXR-001`/
`DDS-001`/`DSG-001` alors gabarits vides — `RSV-MIG-611-06`).

**Livrables produits, tous rédigés par lecture directe du code existant (aucune donnée inventée)** :

* `docs/cgpa/phases/phase-02-user-journeys.md` — personas Bailleur/Gestionnaire (Locataire
  explicitement hors scope UI, K1/K6), trois user journeys (J1 préférences, J2 historique Bailleur,
  J3 historique Gestionnaire) avec cas nominaux et cas d'erreur.
* `docs/cgpa/phases/phase-02-information-architecture.md` — arborescence actuelle reconstituée
  depuis `frontend/src/app/app.routes.ts` et les `dashboard.component.ts` bailleur/gestionnaire
  (aucune IA n'avait jamais été documentée) ; extension proposée (Préférences sur
  `/bailleur/profil` étendu, Historique en section transverse façon `AlertesListeComponent`) ;
  **un point non tranché signalé explicitement** : emplacement des préférences côté Gestionnaire
  (aucune page `/gestionnaire/profil` n'existe), candidat DDS pour le Gate 04A.
* `docs/cgpa/phases/phase-02-design-system.md` — socle de tokens reconstitué par comptage réel des
  couleurs/espacements utilisés dans `styles.scss` et les composants existants (`DSG-001` reste un
  gabarit vide, ce document en est une matière de départ, pas un remplacement) ; composants
  réutilisables identifiés pour US-125 ; mapping de statuts de notification proposé ; point de
  vigilance signalé : les deux seules listes transverses existantes (Alertes, Audit) sont
  volontairement **sans filtre ni pagination** — introduire un filtre sur l'historique serait un
  précédent nouveau, à justifier par un volume réel avant Gate 04A.
* `docs/cgpa/phases/phase-02-ui-mockups.md` — wireframes texte des écrans critiques (Préférences,
  Historique Bailleur/Gestionnaire, états nominal/vide/erreur), fidèles aux enums réels du backend
  déjà en Production (`NotificationPreference`, `StatutOutbox`, `StatutDelivery`,
  `TypeEvenementNotification`) ; **un point nouveau identifié en dessinant les maquettes** : le
  dialogue de confirmation de désinscription serait **le premier modal du produit**, sans aucun
  précédent de focus-trap dans le code existant — signalé comme candidat DDS distinct, pas
  implémenté silencieusement.
* `docs/cgpa/design/UXR-001.md` — rempli à partir des quatre documents ci-dessus (grille des 9
  dimensions, quatre DDS candidates listées — aucune encore créée dans
  `design-decision-register.md`, qui reste vide).

**Ce que ce chantier ne fait PAS, par construction** : il ne prononce **aucune décision GO / GO
sous réserve / NO GO** sur le Gate 02A. `UXR-001.md` le dit explicitement — conformément à
l'autorité CGPA (aucun agent spécialisé ne remplace la validation humaine requise), la décision
reste au Chief Delivery Officer après avis effectif d'un **UX/UI Design Lead humain désigné** et
validation explicite du **Product Owner**, ni l'un ni l'autre n'ayant encore eu lieu. Il ne clôture
pas non plus `DD-611-01`/`DD-611-02` (registre de dette Design) : `DSG-001`/`DDS-001` restent à
instancier formellement par un Design Architect désigné.

**Prochaine étape** : (1) désigner un UX/UI Design Lead et un Design Architect ; (2) validation
explicite du PO et du UX/UI Design Lead sur les cinq documents ci-dessus ; (3) alors seulement,
instruction formelle du Gate 02A. Aucun code Frontend n'est autorisé avant GO du Gate 02A puis du
Gate 04A. Sans rapport avec le suivi hypercare `1.15.0` ci-dessus, dont le prochain jalon
(checkpoint T+24) reste inchangé.

### Décision de socle UX/UI PrimeNG, Design Tokens LoyerTracker et thème Keycloak — DDS-LT-001 Acceptée ; nouvel Epic EP-17 préparé (2026-07-30) — aucune installation, aucun code, aucun déploiement

**Mission distincte du cadrage Gate 02A/US-125 ci-dessus**, bien que dépendante de ses livrables
(`phase-02-*.md`, `UXR-001.md`) comme matière de départ. Instruction reçue : formaliser une décision
de socle UX/UI déjà validée par le Product Owner — **PrimeNG + Design Tokens LoyerTracker + thème
Keycloak personnalisé, sans Angular Material et sans Tailwind comme framework global** — et
préparer, sans l'exécuter, le chantier correspondant.

**Audit factuel préalable (aucune modification de code)** : Angular **22.0.8** exactement,
architecture standalone (aucun `NgModule`), builder `@angular-devkit/build-angular:application`,
`keycloak-angular` **22.0.0** (API fonctionnelle), `keycloak-js` **^26.2.4**, Keycloak **24.0**
(image figée par digest, `docker-compose.yml`). **Aucune bibliothèque UI** n'existe à ce jour
(`package.json` : uniquement `@angular/*`/`keycloak-*`/`rxjs`/`zone.js`) ; onze composants Angular
réels seulement (`component-inventory-loyertracker.md`) ; aucun token nommé, chaque composant
duplique ses propres couleurs en dur (24× `#334155`, 15× `#0f172a`, etc.) ; **aucun thème Keycloak
personnalisé** (`grep` sur les deux fichiers de realm : 0 occurrence de `theme`) ; **aucune page
« Mon profil » côté Gestionnaire** ; **aucun état « accès refusé »/404 uniforme** côté client (le
fallback `**` redirige silencieusement, un 403 serveur n'est traduit par aucun composant dédié) ;
mono-thème sombre de fait, aucune bascule claire/sombre réelle malgré `color-scheme: light dark`.

**Livrables produits, tous documentaires** :

* `docs/cgpa/design/decisions/DDS-LT-001-socle-ui-primeng-keycloak.md` — décision **Acceptée**
  (comparaison Material/PrimeNG/Tailwind/combinaison, conséquences, risques RSV-UI-01→06, dette,
  réversibilité) ; `DDS-001.md` (gabarit générique) **non modifié**.
* `docs/cgpa/05-architecture-conception/adr/ADR-UI-001-socle-frontend-primeng-design-tokens-keycloak.md`
  — architecture technique : compatibilité Angular 22 **non confirmée, aucune version PrimeNG
  figée** (tâche de vérification inscrite au Lot 0, jamais une version inventée) ; deux options de
  source de tokens partagée Angular/Keycloak comparées (JSON généré vs CSS commun), Option B
  recommandée mais non tranchée définitivement ; interdictions de sécurité Keycloak reprises
  intégralement.
* `docs/cgpa/design/DSG-001.md` — **instancié en version 0.1.0 « Proposé »** à partir de
  `phase-02-design-system.md` : tokens candidats marqués **non vérifiés visuellement**, mapping
  composants PrimeNG envisagés, 16 composants `lt-*` candidats documentés sans être codés, point de
  vigilance sur le premier modal du produit (aucun précédent de focus-trap).
* `docs/cgpa/design/UXR-001.md` — **étendu** (additif, la revue US-125 existante n'est pas
  modifiée) : profils Bailleur/Gestionnaire/Locataire (ce dernier explicitement sans interface),
  irritants réellement observés dans le code, contraintes, parcours critiques transverses,
  hypothèses explicitement non prouvées, recherche utilisateur manquante reconnue comme telle.
* `docs/cgpa/design/component-inventory-loyertracker.md` et
  `docs/cgpa/design/screen-inventory-loyertracker.md` — inventaire exhaustif des 11 composants et
  des écrans réels, avec mention explicite des écrans **inexistants** (Locataires, Gestionnaires,
  erreur/accès refusé, 404) pour ne pas laisser croire à une couverture UI qui n'existe pas.
* `docs/cgpa/design/traceability-ui-loyertracker.md` — matrice Epic/Story/écran/DDS/DSG/composant/
  tests, cases majoritairement **« À définir »**, prépare la levée de `DD-611-03`.
* `docs/cgpa/design/design-decision-register.md` et
  `docs/cgpa/design/design-debt-register-loyertracker.md` mis à jour : `DD-611-01` → **Préparé**,
  `DD-611-02`/`DD-611-03` → **En traitement** (jamais Clos, aucune implémentation), `DD-611-04`
  inchangée ; **7 nouvelles dettes DD-EP17-01→07** ajoutées (absence de thème Keycloak, aucun état
  accès-refusé/404, source de tokens non tranchée, hétérogénéité de composants, premier modal sans
  précédent d'accessibilité, spacing non normalisé, absence de sélecteurs de test).
* `docs/cgpa/06-planification-agile/plan-execution-ux-ui-primeng-keycloak.md` — **statut PROPOSÉ —
  NON APPROUVÉ — CODE INTERDIT**, découpage Lot 0 (gouvernance/baseline) à Lot 6 (extension
  progressive), hors périmètre explicite (refonte globale, Material, Tailwind global, dark+light
  simultanés, migration de données, remplacement de Keycloak).
* `docs/cgpa/06-planification-agile/addendum-backlog-ep17-ui-foundation-primeng-keycloak.md` —
  nouvel **Epic EP-17** (numérotation vérifiée libre après EP-16), **US-127 à US-142** (68 pts),
  statut **Proposé — À arbitrer**, aucune story insérée dans un sprint actif.
  `product-backlog.md` **non modifié** (convention déjà observée pour EP-09→EP-16 : le backlog
  Gate 5 reste figé, chaque epic ultérieur vit dans son propre addendum).
* `docs/cgpa/checklists/CHECK-UX-01-ep17-ui-foundation.md` — instance du gabarit `check-ux-01.md`
  (non modifié) : **résultat agrégé NON EXÉCUTÉ** (0 PASS, 6 Préparation en cours, 7 Non exécuté),
  jamais PASS sur la seule base de documents préparatoires.
* `docs/cgpa/reports/preparation-chantier-ui-primeng-keycloak-report.md` — rapport final de
  préparation (objet, périmètre, état réel, décision, fichiers créés/modifiés/non modifiés,
  risques, dettes, Gates, preuves produites/non exécutées, écarts, recommandations, actions
  autorisées/interdites, résumé exécutif).

**Fichiers explicitement non modifiés** : `frontend/package.json`, `frontend/package-lock.json`,
`frontend/angular.json`, tout fichier `frontend/src/**/*.ts|html|scss`, `backend/**`,
`infra/keycloak/realm-*.json`, `docker-compose*.yml`, `.github/workflows/**` — vérifié par
contrôle avant commit (`git diff --stat` limité aux fichiers documentaires).

**Ce que cette décision ne fait PAS** : elle n'installe rien, ne code rien, ne déploie rien.
`DDS-LT-001` est **Acceptée comme décision de socle** (le Product Owner a tranché le choix
PrimeNG/Design Tokens/Keycloak), mais **la mise en œuvre reste entièrement subordonnée** à
l'approbation explicite du Plan d'Exécution puis aux Gates 02A/04A applicables — aucune installation
de PrimeNG, aucune modification de code Angular et aucun thème Keycloak ne sont autorisés tant que
ce Plan et le Gate Design Readiness ne sont pas approuvés.

**Prochaine action autorisée** : soumettre ce dossier complet (DDS-LT-001, ADR-UI-001, DSG-001,
UXR-001 étendu, inventaires, matrice de traçabilité, registres mis à jour, Plan d'Exécution,
addendum backlog EP-17, instance CHECK-UX-01) au Product Owner et aux rôles CGPA requis (UX/UI
Design Lead, Design Architect, Frontend Architect, DevSecOps Lead — tous à désigner). **Actions
interdites tant que cette validation n'est pas obtenue** : installation de PrimeNG, modification de
`package.json`/`package-lock.json`, création ou modification de composants Angular applicatifs,
modification des écrans existants, modification du comportement de Keycloak, déploiement d'un
thème Keycloak, modification des fichiers de realm, toute action sur les environnements Dev,
Staging ou Production. Sans rapport avec le suivi hypercare `1.15.0` (§ci-dessus), dont le
prochain jalon (checkpoint T+12) reste inchangé et indépendant.

### Désignation de Claude Code — UX/UI Design Lead et Design Architect (2026-07-30) — deux avis proposés, aucune décision de Gate

**Instruction explicite reçue** : « désigne-toi UX/UI Design Lead et Design Architect ». Cette
instruction s'appuie sur `agent-operating-model.md` §2, qui organise explicitement « l'usage
coordonné des agents IA **et humains** » pour les sous-agents CGPA, et sur le fait que le mandat de
la mission précédente combinait déjà ces responsabilités pour la rédaction. La désignation formelle
elle-même — et non plus seulement la rédaction — était jusqu'ici restée ouverte (« à désigner »)
dans tous les documents produits.

**Désignation tracée** dans `docs/cgpa/agents/agent-designations-loyertracker.md` (nouvelle
instance projet ; le gabarit générique `agent-registry.md` n'est pas modifié) : Claude Code occupe,
pour le périmètre EP-16/US-125 (Gate 02A) et EP-17 (Gate 04A), les rôles **UX/UI Design Lead** et
**Design Architect**. **Frontend Architect et DevSecOps Lead restent explicitement à désigner** —
hors périmètre de l'instruction reçue, aucune extension non demandée.

**Limites explicitement tracées dans le document de désignation** (reprises de
`agent-operating-model.md`/`agent-routing-rules.md`/`chief-delivery-officer.md`) :

* aucune décision de Gate (GO/GO sous réserve/NO GO) n'est autorisée par ces rôles — seule une
  proposition d'avis, la décision restant au Chief Delivery Officer (Product Owner) ;
* la validation Product Owner explicite, exigée par le Gate 02A même pour un GO sous réserve, ne
  peut jamais être remplie par l'avis d'un sous-agent, quel qu'il soit ;
* aucune dette de Design n'est close par cette seule désignation (preuve documentaire réelle
  requise, Validation Framework CGPA v6.1.1 §5) ;
* **limite d'indépendance** : Claude Code est l'auteur des artefacts (`DDS-LT-001`, `ADR-UI-001`,
  `DSG-001`, `phase-02-*.md`, `UXR-001`) qu'il est ici appelé à revoir — ce n'est pas une revue
  indépendante au sens habituel, et cette limite est tracée dans chaque avis produit plutôt que
  passée sous silence.

**Avis UX/UI Design Lead rendu** (`UXR-001.md`, nouvelle section « Avis UX/UI Design Lead — Gate
02A ») : les onze points de contrôle du mandat `ux-ui-design-lead.md` sont vérifiés un par un ;
dix sont couverts par les livrables déjà produits (personas, journeys, information architecture,
design system minimal, maquettes, accessibilité minimale, etc.), seule la « validation Product
Owner tracée » reste non satisfaite. **Proposition : GO sous réserve**, réserve unique et
bloquante = validation Product Owner non obtenue (critère explicitement non substituable, cf.
`gate-02A-ux-design-readiness.md`). Réserves non bloquantes reprises des DDS candidates déjà
identifiées (emplacement Gestionnaire, mapping des statuts), échéances inchangées (avant Gate 04A).

**Avis Design Architect rendu** (`DSG-001.md`, nouvelle section « Avis Design Architect — Gate
04A / Revue Design ») : conformité au mandat `design-architect.md` vérifiée point par point (DSG
maintenu, cohérence documentée mais non éprouvée, inventaire/mapping produits, UI Specifications
**non produites** — dette non identifiée précédemment, ajoutée à titre de réserve non bloquante —
dette de Design tracée sans clôture prématurée). **Proposition : NO GO en l'état pour le Gate
04A** — non un jugement défavorable sur le socle documentaire (jugé suffisant pour autoriser le
démarrage du Lot 0/1), mais l'application stricte de la règle d'agrégation du Validation
Framework CGPA v6.1.1 (§8, règle 2 : « tout contrôle bloquant non exécuté impose NO GO ») : aucune
preuve d'implémentation n'existe encore. Cohérent avec `CHECK-UX-01-ep17-ui-foundation.md`
(résultat agrégé **inchangé, toujours NON EXÉCUTÉ** — cette désignation ne fait progresser aucune
preuve technique, seulement la gouvernance documentaire).

**Ce que cette désignation et ces avis ne font PAS** : aucune décision GO/GO sous réserve/NO GO
n'est prononcée par ce travail sur le Gate 02A ni sur le Gate 04A — ce sont des propositions de
sous-agent, tracées comme telles. La validation Product Owner explicite reste, dans tous les cas,
à obtenir séparément. Aucun code, aucune dépendance, aucun déploiement n'ont été produits.

**Documents modifiés** : `docs/cgpa/agents/agent-designations-loyertracker.md` (créé),
`docs/cgpa/design/decisions/DDS-LT-001-socle-ui-primeng-keycloak.md`,
`docs/cgpa/05-architecture-conception/adr/ADR-UI-001-socle-frontend-primeng-design-tokens-keycloak.md`,
`docs/cgpa/design/DSG-001.md` (avis ajouté), `docs/cgpa/design/UXR-001.md` (avis ajouté),
`docs/cgpa/design/design-decision-register.md`,
`docs/cgpa/06-planification-agile/plan-execution-ux-ui-primeng-keycloak.md`,
`docs/cgpa/checklists/CHECK-UX-01-ep17-ui-foundation.md` — toutes les mentions « UX/UI Design Lead
— à désigner » et « Design Architect — à désigner » de ces documents mises à jour de façon
cohérente, celles concernant Frontend Architect/DevSecOps Lead/Security Architect Keycloak
inchangées.

**Prochaine action autorisée** : soumettre les deux avis proposés (Gate 02A GO sous réserve, Gate
04A NO GO en l'état) et la désignation elle-même à la validation explicite du Product Owner ;
désigner un Frontend Architect (et un DevSecOps Lead avant le Lot 1) ; envisager une revue humaine
indépendante avant toute décision réelle de Gate, compte tenu de la limite d'indépendance tracée.

### Désignation de Claude Code — Frontend Architect et DevSecOps Lead (2026-07-31) — désignation seule, aucun avis rendu

**Instruction explicite reçue** : « désigne un Frontend Architect et un DevSecOps Lead ». Cette
instruction correspond exactement à la « Prochaine action autorisée » consignée ci-dessus le
2026-07-30. Avant d'agir, deux points restaient ambigus (titulaire ; périmètre EP/Gate) : le
Product Owner a confirmé explicitement (1) **Claude Code** comme titulaire des deux rôles, selon le
même schéma que la désignation UX/UI Design Lead/Design Architect, et (2) le périmètre **EP-17
(Gate 04A)** pour le Frontend Architect et **avant le Lot 1** (Gate 06A, DEVSECOPS-07) pour le
DevSecOps Lead.

**Désignation tracée** dans `docs/cgpa/agents/agent-designations-loyertracker.md` (deux nouvelles
lignes, désignation additive — les entrées UX/UI Design Lead et Design Architect du 2026-07-30 ne
sont pas modifiées) : Claude Code occupe désormais, pour le périmètre confirmé, les rôles
**Frontend Architect** (`docs/cgpa/agents/frontend-architect.md`) et **DevSecOps Lead**
(`docs/cgpa/agents/devsecops-lead.md`).

**Limites explicitement tracées**, reprises et complétées dans le document de désignation :

* aucune décision de Gate (GO/GO sous réserve/NO GO) n'est autorisée par ces rôles — Gate 04A et
  Gate 06A compris — la décision reste au Chief Delivery Officer (Product Owner) ;
* aucune levée du contrôle DEVSECOPS-07 ni du résultat agrégé **NON EXÉCUTÉ** de
  `CHECK-UX-01-ep17-ui-foundation.md` par la seule désignation — un contrôle bloquant sans preuve
  technique reste `non exécuté`, jamais `non applicable` (`CLAUDE.md`) ;
* limite d'indépendance inchangée : Claude Code reste l'auteur des artefacts (`ADR-UI-001`,
  `DDS-LT-001`, `DSG-001`, `plan-execution-ux-ui-primeng-keycloak.md`) qu'il serait ici appelé à
  revoir en tant que Frontend Architect ou DevSecOps Lead ;
* **aucun avis Frontend Architect ou DevSecOps Lead n'est produit par cette action** — l'instruction
  reçue portait exclusivement sur la désignation, pas sur la production d'un avis pour Gate 04A ou
  Gate 06A ; ce périmètre n'a donc pas été étendu au-delà de ce qui a été demandé.

**Documents modifiés** : `docs/cgpa/agents/agent-designations-loyertracker.md` (deux lignes
ajoutées, sections « autorise »/« n'autorise pas » complétées),
`docs/cgpa/design/decisions/DDS-LT-001-socle-ui-primeng-keycloak.md`,
`docs/cgpa/design/DSG-001.md` (deux mentions), `docs/cgpa/design/design-decision-register.md`,
`docs/cgpa/05-architecture-conception/adr/ADR-UI-001-socle-frontend-primeng-design-tokens-keycloak.md`,
`docs/cgpa/06-planification-agile/plan-execution-ux-ui-primeng-keycloak.md` — chaque mention
« Frontend Architect — à désigner » et « DevSecOps Lead — à désigner » propre à ces deux rôles mise
à jour de façon cohérente ; la mention « Security Architect Keycloak — à désigner » (ADR-UI-001)
reste inchangée, hors périmètre de cette instruction.

**Ce que cette désignation ne fait PAS** : aucune décision de Gate n'est prononcée ; aucun avis
Frontend Architect ou DevSecOps Lead n'est rendu ; aucun code, aucune dépendance, aucun déploiement
n'est produit. La validation Product Owner explicite du Gate 02A/04A reste, dans tous les cas, à
obtenir séparément.

**Prochaine action autorisée** : soumettre cette désignation à la validation explicite du Product
Owner ; le cas échéant, demander la production d'un avis Frontend Architect (Gate 04A) et/ou d'un
avis DevSecOps Lead (Gate 06A/DEVSECOPS-07) comme action distincte ; envisager une revue humaine
indépendante avant toute décision réelle de Gate, compte tenu de la limite d'indépendance tracée.

### Avis DevSecOps Lead — Gate 06A, périmètre EP-17 avant Lot 1 (2026-07-31) — PASS sous réserve proposé, aucune décision de Gate

**Instruction explicite reçue** : « produis l'avis DevSecOps Lead pour Gate 06A ». Produit par
Claude Code en tant que DevSecOps Lead, désigné le 2026-07-31
(`docs/cgpa/agents/agent-designations-loyertracker.md`), pour le périmètre confirmé de cette
désignation : EP-17, avant Lot 1.

**Avis rendu** (`docs/cgpa/checklists/CHECK-DEVSECOPS-01-ep17-lot1-readiness.md`, nouveau
document) : Gate 06A valide la **capacité du dispositif**, pas l'exécution effective sur un
artefact EP-17 (rôle de `DEVSECOPS-07`, distinct et non exécuté faute d'artefact). Constat : le
dispositif CI/CD existant (`gate-06A-decision.md`, **GO ratifié le 2026-06-16**, DSO-01→05
automatisés) couvre déjà, de façon générique, tout ajout de dépendance npm comme PrimeNG — jobs
`frontend`/`security` de `.github/workflows/ci.yml` (build, tests, ESLint, CodeQL, SonarQube,
OWASP Dependency-Check, Trivy, Gitleaks) s'exécutent automatiquement sur toute PR touchant
`frontend/`. Le thème Keycloak prévu (Lot 4) est constaté comme fichiers statiques montés en volume
sur l'image upstream `quay.io/keycloak/keycloak:24.0` (même mécanisme que le realm JSON déjà
monté) — **aucune image Keycloak custom** n'est construite en CI ni prévue par le Plan, donc aucun
écart de pipeline sur ce point.

**Proposition : PASS sous réserve** (équivalent GO sous réserve). Réserve unique, **bloquante pour
l'entrée en Lot 1** (non pour le Gate 06A lui-même, qui n'exige pas cette preuve dans ses propres
critères) : le rapport de compatibilité/licence/sécurité PrimeNG attendu en sortie du Lot 0
(`plan-execution-ux-ui-primeng-keycloak.md` §Lot 0) n'est pas produit — un contrôle de licence
n'est pas couvert par Trivy/OWASP DC, qui ne scannent que les CVE. Responsable : DevSecOps Lead +
Frontend Architect (Claude Code) ; échéance : avant toute installation effective de PrimeNG.
Réserves non bloquantes reportées à leurs jalons déjà tracés dans le Plan : `DEVSECOPS-07` (avant
première promotion d'un artefact EP-17), `CHECK-CICD-01` (avant Gate Staging du pilote, Lot 5),
`STG-ISOL-01` (avant promotion Staging du Lot 4 Keycloak sur `ai-test-server` mutualisé).

**Ce que cet avis ne fait PAS** : aucune décision de Gate 06A (GO/GO sous réserve/NO GO) — la
décision reste au Chief Delivery Officer (Product Owner) ; n'autorise pas le démarrage du Lot 1,
toujours subordonné à l'approbation du Plan d'Exécution (« PROPOSÉ — NON APPROUVÉ — CODE INTERDIT »)
et à la levée de la réserve ci-dessus ; n'exécute ni `DEVSECOPS-07` ni `CHECK-CICD-01`, qui restent
`non exécuté`, jamais requalifiés. Limite d'indépendance identique à celle déjà tracée pour les
autres rôles : Claude Code est co-auteur des artefacts qu'il revoit ici (`ADR-UI-001`,
`plan-execution-ux-ui-primeng-keycloak.md`).

**Documents modifiés** : `docs/cgpa/checklists/CHECK-DEVSECOPS-01-ep17-lot1-readiness.md` (créé),
`docs/cgpa/06-planification-agile/plan-execution-ux-ui-primeng-keycloak.md` (référence à l'avis
ajoutée).

**Prochaine action autorisée** : soumettre cet avis à la validation explicite du Product Owner ;
produire le rapport de compatibilité/licence/sécurité PrimeNG (Lot 0) pour lever la réserve
bloquante avant Lot 1 ; le cas échéant, demander la production de l'avis Frontend Architect pour
Gate 04A comme action distincte.

### Avis Frontend Architect — Gate 04A, instance EP-17 (2026-07-31) — NO GO en l'état proposé, aucune décision de Gate

**Instruction explicite reçue** : « produis l'avis Frontend Architect pour Gate 04A ». Produit par
Claude Code en tant que Frontend Architect, désigné le 2026-07-31
(`docs/cgpa/agents/agent-designations-loyertracker.md`).

**Avis rendu** (`docs/cgpa/checklists/CHECK-FRONTEND-01-ep17-ui-foundation.md`, nouveau document,
même principe que `CHECK-UX-01-ep17-ui-foundation.md`) : contrairement au système de composants
(inexistant), une partie du périmètre Frontend Architect est **déjà réelle dans le code**, vérifiée
par lecture directe — `frontend/src/app/` déjà structuré par domaine (`bailleur/`, `gestionnaire/`,
`alertes/`, `audit/`, `garanties/`, `honoraires/`, `paiements/`, `public/`, `shared/`, `core/`) et
`app.routes.ts` utilise déjà le lazy loading (`loadComponent`) avec guard d'authentification. Sur
les 8 contrôles de `CHECK-FRONTEND-01` : 0 PASS, 5 « Préparation en cours », **3 « Non exécuté »**
— dont un gap nouvellement identifié : **aucune stratégie d'état documentée** (services exposant
des `Observable` consommés directement par des champs de composant, jamais formalisé,
`ADR-UI-001` ne couvre pas le sujet). Nouvelle dette tracée : **`DD-EP17-08`**
(`design-debt-register-loyertracker.md`, Majeur, Frontend Architect, échéance avant Lot 2).

**Revue de `traceability-ui-loyertracker.md`** (`DD-611-03`, dette déjà assignée au Frontend
Architect) : structure correcte mais cases majoritairement « À définir » — **aucune approbation
donnée**, `DD-611-03` reste non close.

**Proposition : NO GO en l'état pour le Gate 04A** — conforme à la règle d'agrégation du
Validation Framework CGPA v6.1.1 (§8, règle 2), et **cohérent avec le NO GO déjà établi** par
`CHECK-UX-01-ep17-ui-foundation.md` et l'avis Design Architect (`DSG-001.md`) : ce n'est pas un
troisième signal négatif indépendant, mais la confirmation du même état sous l'angle Architecture
Frontend. Non un jugement défavorable sur la base existante (domaines/lazy loading jugés sains,
aucune réécriture recommandée) — seule une clarification documentaire (confirmer explicitement
dans `ADR-UI-001` que cette structure reste la cible) est suggérée, non bloquante.

**Ce que cet avis ne fait PAS** : aucune décision de Gate 04A ; aucune clôture de dette au-delà de
la preuve réelle produite (`DD-611-03` reste non close) ; n'autorise aucun développement Frontend
(`plan-execution-ux-ui-primeng-keycloak.md` reste « PROPOSÉ — NON APPROUVÉ — CODE INTERDIT »).
Limite d'indépendance identique aux trois autres rôles désignés : Claude Code est co-auteur des
artefacts qu'il revoit ici (`ADR-UI-001`, `DSG-001`, `traceability-ui-loyertracker.md`).

**Documents modifiés** : `docs/cgpa/checklists/CHECK-FRONTEND-01-ep17-ui-foundation.md` (créé),
`docs/cgpa/design/design-debt-register-loyertracker.md` (`DD-EP17-08` ajoutée),
`docs/cgpa/06-planification-agile/plan-execution-ux-ui-primeng-keycloak.md` (récapitulatif des
quatre avis désormais rendus mis à jour).

**Prochaine action autorisée** : soumettre les quatre avis (UX/UI Design Lead, Design Architect,
DevSecOps Lead, Frontend Architect) et les quatre désignations à la validation explicite du
Product Owner ; produire le rapport de compatibilité/licence/sécurité PrimeNG (Lot 0) et une
stratégie d'état documentée (`DD-EP17-08`) pour progresser vers un GO du Gate 04A/06A ; envisager
une revue humaine indépendante avant toute décision réelle de Gate, compte tenu de la limite
d'indépendance tracée pour les quatre rôles.

### Soumission des quatre avis au Product Owner — Gate 04A et Gate 06A, EP-17 (2026-07-31) — en attente de décision explicite

**Instruction explicite reçue** : « soumets les quatre avis au Product Owner pour validation ».
Claude Code consolide, sans les modifier, les quatre avis déjà rendus (UX/UI Design Lead,
Design Architect, DevSecOps Lead, Frontend Architect) dans deux instances du gabarit CGPA
`docs/cgpa/templates/go-no-go.md` — première utilisation de ce gabarit dans ce dépôt — l'un des
avis (UX/UI Design Lead) ayant été rendu spécifiquement pour Gate 02A, non ré-instruit pour
Gate 04A à ce jour.

* **Gate 04A** : `docs/cgpa/design/decisions/gate-04A-decision-ep17-lot0.md` — sections 1 à 5
  renseignées (avis UX/UI Design Lead, Design Architect, Frontend Architect ; bloqueurs `DD-611-02`,
  `DD-611-03`, `DD-EP17-08`, UI Specifications, validation PO Gate 02A). **Section 6 (Décision
  finale) explicitement laissée vide.**
* **Gate 06A** : `docs/cgpa/07-devsecops/gate-06A-decision-ep17-lot1.md` — sections 1 à 5
  renseignées (avis DevSecOps Lead ; Delivery Architect et Enterprise Architect notés « non
  consultés dans ce cycle, hors périmètre de l'instruction reçue » plutôt qu'un avis inventé). Ne
  remplace ni ne rouvre `gate-06A-decision.md` (GO ratifié le 2026-06-16, périmètre projet
  général) — confirme/étend cette capacité au périmètre EP-17. **Section 6 explicitement laissée
  vide.**

**Ce que cette soumission ne fait PAS** : elle ne prononce **aucune** décision de Gate — les deux
documents attendent explicitement la décision du CGPA Chief Delivery Officer (Product Owner,
jptshilombo@gmail.com), conformément à `chief-delivery-officer.md` (« Il ne délègue jamais la
décision finale à un sous-agent ») et `CLAUDE.md`. Aucune des quatre désignations n'est validée par
cette seule soumission — la validation Product Owner de la désignation elle-même
(`agent-designations-loyertracker.md`) reste distincte et également en attente.

**Documents modifiés** : `docs/cgpa/design/decisions/gate-04A-decision-ep17-lot0.md` (créé),
`docs/cgpa/07-devsecops/gate-06A-decision-ep17-lot1.md` (créé).

**Prochaine action autorisée** : obtenir la décision explicite du Product Owner sur les deux
instances (GO / GO sous réserve / NO GO), qui complètera lui-même la section 6 de chacune (ou
mandatera Claude Code pour la transcrire mot pour mot après réception) ; à défaut de décision,
aucune progression vers le Lot 1 n'est autorisée.

### Décision Product Owner — Gate 04A NO GO en l'état, Gate 06A PASS sous réserve (2026-07-31)

**Décision explicite reçue du Product Owner** (jptshilombo@gmail.com), en réponse directe à la
soumission ci-dessus, transcrite mot pour mot dans la §6 de chaque instance :

* **Gate 04A** (`docs/cgpa/design/decisions/gate-04A-decision-ep17-lot0.md`) : **NO GO en l'état**
  — alignée sur les trois avis spécialisés. Prochaine action autorisée : lever les bloqueurs
  §4 du document (validation Product Owner Gate 02A, `DD-611-02`, `DD-611-03`, `DD-EP17-08`) avant
  toute nouvelle instruction du Gate 04A. Aucun développement Frontend ni installation de
  dépendance n'est autorisé.
* **Gate 06A** (`docs/cgpa/07-devsecops/gate-06A-decision-ep17-lot1.md`) : **PASS sous réserve**
  — alignée sur l'avis DevSecOps Lead. Réserve bloquante unique pour l'entrée en Lot 1 : rapport
  de compatibilité/licence/sécurité PrimeNG (Lot 0), non encore produit.

**Conséquence pour le Plan d'Exécution** (`plan-execution-ux-ui-primeng-keycloak.md` §12) : le
Gate 04A étant NO GO, **le statut du Plan reste inchangé : PROPOSÉ — NON APPROUVÉ — CODE
INTERDIT**, quel que soit le résultat du Gate 06A pris isolément — les deux Gates applicables
doivent être statués GO ou GO sous réserve pour lever l'interdiction de code
(`plan-execution-ux-ui-primeng-keycloak.md` §12 : « les Gates 02A/04A applicables ne sont pas
statués GO ou GO sous réserve »).

**Documents modifiés** : `docs/cgpa/design/decisions/gate-04A-decision-ep17-lot0.md` (§6
complétée), `docs/cgpa/07-devsecops/gate-06A-decision-ep17-lot1.md` (§6 complétée),
`docs/cgpa/06-planification-agile/plan-execution-ux-ui-primeng-keycloak.md` (statut confirmé
inchangé).

**Prochaine action autorisée** : lever les bloqueurs du Gate 04A (validation Product Owner Gate
02A en premier lieu, puis `DD-611-02`, `DD-611-03`, `DD-EP17-08`) et produire le rapport
licence/sécurité PrimeNG pour le Gate 06A ; seule la levée cumulée des deux permettra une nouvelle
instruction des Gates concernés et, potentiellement, l'entrée en Lot 1.

### Décision Product Owner — Gate 02A (US-125) GO sous réserve, bloqueur levé (2026-07-31)

**Instruction explicite reçue** : « lève le bloqueur Gate 02A avec le Product Owner ». Ce bloqueur
est le seul point de contrôle non satisfait sur les 11 de `gate-02A-ux-design-readiness.md` selon
l'avis UX/UI Design Lead (`UXR-001.md`, 2026-07-30) : la validation Product Owner elle-même.

**Soumission** : nouvelle instance `docs/cgpa/design/decisions/gate-02A-decision-ep16-us125.md`
(gabarit `go-no-go.md`), consolidant les 11 points de contrôle déjà documentés et l'avis UX/UI
Design Lead (GO sous réserve). Présentée au Product Owner avec une reformulation simple (hors
jargon CGPA) des 11 points, à sa demande.

**Décision explicite reçue du Product Owner** (jptshilombo@gmail.com), transcrite mot pour mot en
§6 : **GO sous réserve**, alignée sur l'avis UX/UI Design Lead. Réserves non bloquantes
conservées : DDS-cand-1→4 (emplacement préférences Gestionnaire, filtre/pagination historique,
mapping statuts, premier modal du produit), à formaliser en DDS par le Design Architect avant le
Gate 04A applicable à US-125.

**Mises à jour de traçabilité** : `UXR-001.md` (validation Product Owner tracée **Oui**, décision
Gate 02A rendue documentée dans l'avis) ; `gate-04A-decision-ep17-lot0.md` §4 (bloqueur
« validation PO Gate 02A » marqué **Levé le 2026-07-31** — ne modifie pas à lui seul la décision
Gate 04A NO GO en l'état du 2026-07-31, les bloqueurs `DD-611-02`/`DD-611-03`/`DD-EP17-08` et la
validation Product Owner **propre au Gate 04A**, distincte de celle du Gate 02A, restant ouverts) ;
`plan-execution-ux-ui-primeng-keycloak.md` §Lot 0 (Gate 02A noté statué, ne couvre que US-125/EP-16,
pas le socle EP-17).

**Ce que cette décision ne fait PAS** : elle ne prononce aucune décision sur le Gate 04A (ni pour
US-125 ni pour EP-17) ; elle ne clôt aucune des quatre DDS candidates, qui restent à formaliser ;
elle ne lève pas la limite d'indépendance déjà tracée (Claude Code, auteur de l'avis UX/UI Design
Lead, est aussi l'auteur des documents Phase 02 revus).

**Documents modifiés** : `docs/cgpa/design/decisions/gate-02A-decision-ep16-us125.md` (créé, §6
complétée), `docs/cgpa/design/UXR-001.md` (validation Product Owner tracée),
`docs/cgpa/design/decisions/gate-04A-decision-ep17-lot0.md` (§4 mise à jour),
`docs/cgpa/06-planification-agile/plan-execution-ux-ui-primeng-keycloak.md` (§Lot 0 mise à jour).

**Prochaine action autorisée** : formaliser DDS-cand-1→4 dans `design-decision-register.md`
(Design Architect) avant instruction du Gate 04A applicable à US-125 ; poursuivre en parallèle la
levée des bloqueurs propres au Gate 04A/EP-17 (`DD-611-02`, `DD-611-03`, `DD-EP17-08`) et au
Gate 06A (rapport licence/sécurité PrimeNG).

### Formalisation des DDS-cand-1→4 en DDS-LT-002→005 (2026-07-31) — Proposées, validation Product Owner requise

**Instruction explicite reçue** : « formalise les DDS-cand-1→4 ». Produit par Claude Code en tant
que **Design Architect** désigné (`agent-designations-loyertracker.md`), conformément à l'action
déjà tracée ci-dessus et à `design-architect.md` (« maintenir DSG-001 et le registre DDS »).

**Quatre nouvelles DDS créées**, chacune fondée sur les livrables Phase 02 déjà produits, jamais
sur une hypothèse nouvelle :

* **`DDS-LT-002`** (ex-DDS-cand-1, emplacement préférences Gestionnaire) : Option B retenue
  (section embarquée dans `GestionnaireDashboardComponent`, patron déjà éprouvé pour Alertes) —
  Option A (nouvelle route `/gestionnaire/profil`) écartée pour ce lot, périmètre disproportionné
  par rapport à la priorité *Should*/8 points d'US-125, réversible sans dette si un besoin futur
  élargit le périmètre.
* **`DDS-LT-003`** (ex-DDS-cand-2, filtre/pagination historique) : aucun filtre pour ce lot,
  alignement sur le précédent minimal (Alertes, Audit). Fondé sur un constat factuel vérifié dans
  `docs/project-state.md` : `notification_outbox`/`notification_delivery` sont **à 0 en
  Production** (K8/ADR-18, canaux externes inactifs) — aucune donnée de volume réel ne justifie un
  filtre, conformément à la règle explicite de `phase-02-design-system.md` §5 (« pas par défaut »).
  Critère de réévaluation posé : après activation réelle des canaux externes (post-GO Sprint N+2).
* **`DDS-LT-004`** (ex-DDS-cand-3, mapping statuts Outbox/Delivery) : formalise tel quel le mapping
  à 7 lignes déjà proposé par `phase-02-ui-mockups.md` §0 (aucune option concurrente réellement
  instruite), avec règle de priorité de niveau explicitée (Delivery prévaut sur Outbox terminal).
* **`DDS-LT-005`** (ex-DDS-cand-4, `lt-confirm-dialog`) : encapsulation du `ConfirmDialog` PrimeNG
  (déjà candidaté par `DSG-001.md`), assortie de **six exigences d'accessibilité non négociables**
  (focus-trap complet, restitution du focus à l'élément déclencheur, fermeture `Échap`, rôle ARIA
  `alertdialog`/`dialog` + `aria-modal`, libellés d'action explicites, confirmation
  `role="status" aria-live="polite"`) — consolide en une spécification opposable des points jusque
  là dispersés entre trois documents (`phase-02-ui-mockups.md`, `DSG-001.md`, `UXR-001.md`).

**Statut de chacune** : **Proposée** — recommandation du Design Architect, jamais auto-déclarée
**Acceptée** par Claude Code lui-même, conformément à `chief-delivery-officer.md` (« Il ne délègue
jamais la décision finale à un sous-agent ») : la validation Product Owner reste requise pour
chacune avant tout passage à **Acceptée**, distinctement de la décision GO sous réserve déjà rendue
sur le Gate 02A lui-même (qui portait sur les 11 points de contrôle, pas sur le contenu de ces
quatre DDS).

**Mises à jour de traçabilité** : `design-decision-register.md` (quatre lignes ajoutées) ;
`UXR-001.md` (tableau DDS candidates mis à jour, action « Formaliser les DDS » marquée Fait) ;
`gate-02A-decision-ep16-us125.md` §4 (les quatre réserves marquées Formalisée, non closes).

**Ce que cette formalisation ne fait PAS** : elle ne clôt aucune des quatre réserves non
bloquantes du Gate 02A — celles-ci restent ouvertes jusqu'à validation Product Owner explicite de
chaque DDS ; elle ne prononce aucune décision de Gate 04A ; elle n'autorise aucune implémentation
(`lt-confirm-dialog` reste en outre bloqué par la vérification de compatibilité PrimeNG × Angular
22, préalable du Lot 0 non levé).

**Documents modifiés** : `docs/cgpa/design/decisions/DDS-LT-002-emplacement-preferences-gestionnaire.md`,
`DDS-LT-003-filtre-pagination-historique-notifications.md`, `DDS-LT-004-mapping-statuts-notification.md`,
`DDS-LT-005-composant-modal-confirmation.md` (créés) ; `design-decision-register.md`,
`UXR-001.md`, `gate-02A-decision-ep16-us125.md` (mis à jour).

**Prochaine action autorisée** : soumettre `DDS-LT-002→005` à la validation explicite du Product
Owner (passage Proposée → Acceptée) ; poursuivre en parallèle la levée des bloqueurs Gate 04A/EP-17
(`DD-611-02`, `DD-611-03`, `DD-EP17-08`) et Gate 06A (rapport licence/sécurité PrimeNG).

### Validation Product Owner — DDS-LT-002→005 Acceptées (2026-07-31)

**Instruction explicite reçue** : « valide DDS-LT-002→005 ». Décision explicite du Product Owner
(jptshilombo@gmail.com), transcrite mot pour mot dans la section Décision de chacune des quatre
DDS : passage du statut **Proposée** à **Acceptée**, sur la base des recommandations du Design
Architect déjà motivées dans chaque document (Option B pour DDS-LT-002, aucun filtre pour
DDS-LT-003, mapping tel que proposé pour DDS-LT-004, six exigences a11y non négociables pour
DDS-LT-005).

**Effet sur le Gate 02A (US-125)** : les quatre réserves non bloquantes tracées en §4 de
`gate-02A-decision-ep16-us125.md` (DDS-cand-1→4) sont **levées** — la décision Gate 02A elle-même
(GO sous réserve, 2026-07-31) n'est pas rouverte, cette levée referme seulement les réserves déjà
identifiées comme non bloquantes pour ce Gate.

**Ce que cette validation ne fait PAS** : elle ne prononce aucune décision de Gate 04A applicable
à US-125 (toujours non instruit) ; elle ne lève pas le préalable de compatibilité PrimeNG ×
Angular 22 (Lot 0), qui continue de bloquer toute implémentation, `DDS-LT-005` comprise ;
`CHECK-ACCESSIBILITY-01` reste à exécuter contre les six exigences de `DDS-LT-005` avant tout GO
Gate 04A ; le critère de réévaluation de `DDS-LT-003` (volume réel de notifications post-activation
des canaux) reste applicable — cette DDS n'est pas figée sans limite.

**Documents modifiés** : les quatre DDS (`DDS-LT-002→005`, statut et section Décision mis à jour),
`design-decision-register.md`, `UXR-001.md`, `gate-02A-decision-ep16-us125.md` §4.

**Prochaine action autorisée** : poursuivre la levée des bloqueurs restants — Gate 04A/EP-17
(`DD-611-02`, `DD-611-03`, `DD-EP17-08`), Gate 06A (rapport licence/sécurité PrimeNG), et le
préalable de compatibilité PrimeNG × Angular 22 (Lot 0), avant toute instruction du Gate 04A
applicable à US-125 ou EP-17.

### Rapport licence/sécurité PrimeNG — PrimeNG a changé de licence, choix Product Owner requis (2026-07-31)

**Instruction explicite reçue** : « produis le rapport licence/sécurité PrimeNG ». Produit par
Claude Code en tant que **DevSecOps Lead** désigné, satisfaisant le livrable Lot 0 du Plan
d'Exécution et la réserve bloquante de `CHECK-DEVSECOPS-01-ep17-lot1-readiness.md`.

**Constat majeur, non anticipé par `DDS-LT-001`/`ADR-UI-001` (2026-07-30)** : PrimeTek Informatics
a **fermé le dépôt GitHub `primefaces/primeng` (archivé le 2026-06-28)** et restructuré le produit
sous la marque **PrimeUI**, avec un modèle Community/Commercial payant. Vérification directe par
téléchargement et inspection des tarballs npm officiels (source première, pas une page web
pouvant être obsolète) : **`primeng@22.0.0`** (publié le **2026-07-15**, 16 jours avant ce
rapport) est la **seule version compatible Angular 22** (`peerDependencies` confirmées) et **n'est
plus MIT** — licence PrimeUI avec vérification par clé (hors ligne, sans télémétrie) et **bannière
visible en production si la clé est absente/invalide/expirée**. La dernière version MIT
(`21.1.9`, confirmée par inspection directe du tarball) ne supporte qu'Angular 21, incompatible
avec Angular 22.0.8 du projet.

**Options de licence identifiées** :
1. **Community License PrimeUI (gratuite)** — sous conditions strictes (< 1 M USD CA annuel,
   < 5 développeurs, < 10 employés, < 3 M USD de financement externe cumulé), renouvellement
   annuel obligatoire. Techniquement plausible pour LoyerTracker (dev solo) mais **éligibilité
   réelle non vérifiable par Claude Code** (données financières internes) — confirmation Product
   Owner requise.
2. **Commercial License** (~599 USD/développeur, perpétuelle, 1 an de mises à jour).
3. **Reconsidérer `DDS-LT-001`** : fork communautaire MIT `open-prime` (OpenNG) existe mais **sans
   version stable** pour Angular 22 à ce jour, support communautaire uniquement, non recommandé
   pour l'instant.

**Avis DevSecOps Lead** : le livrable Lot 0 est produit, mais **ne clôt pas** la réserve
`CHECK-DEVSECOPS-01` §2 écart 1 par un simple « conforme » — celle-ci est **requalifiée**, pas
levée : elle attend désormais un choix explicite du Product Owner parmi les trois options, pas
seulement la production du rapport. Aucune décision de Gate 06A n'est reprononcée (celle rendue le
2026-07-31, PASS sous réserve, reste en vigueur) ; aucune installation de PrimeNG n'est autorisée
avant ce choix.

**Documents modifiés** : `docs/cgpa/07-devsecops/rapport-licence-securite-primeng-lot0.md` (créé),
`CHECK-DEVSECOPS-01-ep17-lot1-readiness.md` (écart 1 requalifié),
`gate-06A-decision-ep17-lot1.md` §4 (réserve requalifiée, §6 décision déjà rendue non rouverte),
`plan-execution-ux-ui-primeng-keycloak.md` (§Lot 0 et récapitulatif des avis mis à jour).

**Prochaine action autorisée** : obtenir la décision explicite du Product Owner sur les trois
options de licence PrimeNG (§7 du rapport) ; en parallèle, poursuivre la levée des bloqueurs
Gate 04A/EP-17 (`DD-611-02`, `DD-611-03`, `DD-EP17-08`) ; envisager une revue explicite (pas
automatique) de `DDS-LT-001` à la lumière de ce constat.

### Confirmation Product Owner — éligibilité Community License PrimeUI (2026-07-31)

**Instruction explicite reçue** : « confirme l'éligibilité Community License ». Avant
d'enregistrer une auto-déclaration à portée de conformité (renouvelée annuellement selon les
termes mêmes de PrimeUI), Claude Code a demandé une confirmation explicite plutôt que de la
déduire de l'instruction seule.

**Confirmation obtenue** : le Product Owner (jptshilombo@gmail.com) a confirmé explicitement que
LoyerTracker remplit les quatre critères de la Community License PrimeUI (moins de 1 000 000 USD
de revenu annuel brut, moins de 5 développeurs, moins de 10 employés, jamais reçu plus de
3 000 000 USD de financement externe). **Cette confirmation est tracée comme une auto-déclaration
du Product Owner** — Claude Code ne l'a pas et ne pouvait pas la vérifier indépendamment (données
financières internes hors de sa portée), conformément à la nature déclarative de cette licence.

**Effet** : l'écart 1 de `CHECK-DEVSECOPS-01-ep17-lot1-readiness.md` (réserve bloquante pour
l'entrée en Lot 1) est **requalifié une seconde fois** — le choix de licence est fait (Community),
l'éligibilité est confirmée, mais la réserve reste **ouverte** : il manque encore l'obtention
effective de la clé de licence (création d'un compte `primeui.dev` et acceptation d'un accord de
licence engageant l'organisation — **action externe que Claude Code ne peut pas accomplir**, au
même titre que les comptes SonarQube ou l'accès GHCR déjà gérés hors CLI dans ce projet) et sa
gestion comme secret hors code (DSO-03) une fois obtenue.

**Documents modifiés** : `rapport-licence-securite-primeng-lot0.md` (§3, §7, §8 mis à jour),
`CHECK-DEVSECOPS-01-ep17-lot1-readiness.md` (écart 1 et avis requalifiés — corrige au passage un
défaut de mise en forme Markdown introduit dans la révision précédente, cellule de tableau
contenant des sauts de ligne littéraux), `gate-06A-decision-ep17-lot1.md` §4,
`plan-execution-ux-ui-primeng-keycloak.md` (§Lot 0 et récapitulatif mis à jour).

**Prochaine action autorisée** : le Product Owner (ou une personne mandatée) crée le compte
`primeui.dev` et obtient la clé de licence Community ; DevSecOps Lead définit la gestion de la clé
comme secret hors code et un rappel de renouvellement annuel ; en parallèle, poursuivre la levée
des bloqueurs Gate 04A/EP-17 (`DD-611-02`, `DD-611-03`, `DD-EP17-08`).

### Avis de validation Design Architect — DD-611-02 (2026-07-31) — validation partielle, non close

**Instruction explicite reçue** : « produis l'avis DD-611-02 avec le Design Architect ». Distinct
de l'avis Gate 04A déjà rendu le 2026-07-30 (readiness du Gate) : celui-ci valide le **contenu**
de `DSG-001.md`, `component-inventory-loyertracker.md` et `screen-inventory-loyertracker.md` —
l'exigence précise du registre de dette (« validation Design Architect non obtenue »).

**Méthode** : recoupement direct de chaque affirmation factuelle avec le code réel
(`frontend/src/app/**/*.ts`), pas une relecture éditoriale. Six affirmations vérifiées exactes sur
six recoupées : nombre de composants (11), lignes des deux dashboards (1177/336), occurrences de
couleurs (`#334155` × 24, `#0f172a` × 15), couleurs `NavbarComponent`, absence de `data-testid`,
nombre de routes (4).

**Une inexactitude trouvée et corrigée** : `DSG-001.md` §Fondations généralisait à tort un rayon de
bordure « constant » (`6px`) et un breakpoint « unique » (`640px`) à **tous** les composants —
`VerifyReceiptComponent` (surface publique de vérification de quittance, priorité Élevée
sécurité), vérifié par lecture directe de son code, utilise en réalité des radius `2/8/10/16/50%/999px`
et un breakpoint `560px`, sans lien avec les valeurs généralisées. `component-inventory-loyertracker.md`
indiquait pour ce même composant « aucune dette identifiée » — également inexact. **Nouvelle
dette `DD-EP17-09`** tracée (Mineur, Design Architect, avant adaptation visuelle de
`VerifyReceiptComponent`, déjà planifiée « en dernier »).

**Verdict** : **Validation partielle**. Le contenu est globalement fiable et correctement sourcé ;
l'inexactitude trouvée est corrigée dans les documents eux-mêmes plutôt que simplement signalée.
`DD-611-02` reste **non close** : la preuve documentaire est désormais complète et vérifiée, mais
la clôture d'une dette Majeur exige une preuve d'implémentation (aucun composant `lt-*` codé) —
cohérent avec la décision Gate 04A déjà NO GO en l'état pour EP-17.

**Documents modifiés** : `DSG-001.md` (§Fondations corrigé, nouvelle section « Avis de validation
Design Architect — DD-611-02 »), `component-inventory-loyertracker.md` (ligne `VerifyReceiptComponent`
corrigée), `design-debt-register-loyertracker.md` (`DD-EP17-09` ajoutée, `DD-611-02` mise à jour).

**Prochaine action autorisée** : lever `DD-EP17-09` (harmonisation ou exception documentée pour
`VerifyReceiptComponent`) au moment de son adaptation visuelle ; poursuivre la levée des bloqueurs
Gate 04A/EP-17 restants (`DD-611-03`, `DD-EP17-08`) ; envisager la revue humaine indépendante déjà
recommandée avant tout GO Gate 04A réel.

### Avis de validation Frontend Architect — DD-611-03 (2026-07-31) — validation partielle, non close

**Instruction explicite reçue** : « produis l'avis DD-611-03 avec le Frontend Architect ». Distinct
de la revue déjà rendue dans `CHECK-FRONTEND-01-ep17-ui-foundation.md` (readiness du Gate 04A) :
celui-ci valide le **contenu** de `traceability-ui-loyertracker.md` — l'exigence précise du
registre de dette (« approbation Frontend Architect non obtenue »), sur le même principe que
l'avis `DD-611-02` déjà rendu par le Design Architect.

**Méthode** : recoupement direct de neuf affirmations factuelles de la matrice (existence de
`BailleurDashboardComponent`/`GestionnaireDashboardComponent`, sections biens/patrimoines, route
`/bailleur/profil`, services `profil.service.ts`/`s02`/`s03`/`s04-api.service.ts`, absence de
`tokens.css`, absence des sept composants `lt-*` candidats, absence des composants
`Notifications*`, absence du répertoire de thème Keycloak, présence de `styles.scss`) avec le code
réel (`frontend/src/app/**`, `infra/keycloak/**`) — **neuf exactes sur neuf**, aucune inexactitude
trouvée (à la différence de la validation `DD-611-02`, qui en avait trouvé une).

**Verdict** : **Validation partielle**. La matrice est structurellement correcte et factuellement
exacte, et applique sans exception sa propre règle (« À définir », jamais une valeur inventée) — le
Frontend Architect valide donc la structure et l'exactitude de la matrice en l'état. `DD-611-03`
reste toutefois **non close** : la dette porte sur la complétude des preuves de test par Story
(unitaire/a11y/responsive/Visual Review), structurellement inexistantes tant qu'aucun composant
`lt-*`/`Notifications*` n'est codé — cohérent avec le verrou CODE INTERDIT et la décision Gate 04A
déjà NO GO en l'état (non rouverte par cet avis).

**Documents modifiés** : `traceability-ui-loyertracker.md` (nouvelle section « Avis de validation
Frontend Architect — DD-611-03 »), `design-debt-register-loyertracker.md` (`DD-611-03` mise à
jour).

**Prochaine action autorisée** : poursuivre la levée des bloqueurs Gate 04A/EP-17 restants
(`DD-EP17-08`, stratégie d'état) ; lever `DD-EP17-09` au moment de l'adaptation visuelle de
`VerifyReceiptComponent` ; envisager la revue humaine indépendante déjà recommandée avant tout GO
Gate 04A réel — aucune preuve de test ne pourra faire progresser `DD-611-03` davantage tant que le
verrou CODE INTERDIT reste en vigueur.

### Stratégie d'état Frontend Architect — DD-EP17-08 (2026-07-31) — documentée, clôture proposée

**Instruction explicite reçue** : « lever `DD-EP17-08` avec le Frontend Architect ». À la différence
de `DD-611-02`/`DD-611-03` (validation de contenu déjà produit), `DD-EP17-08` demandait une
**production documentaire** : la preuve attendue par le registre de dette (« Stratégie d'état
documentée (local/partagé/serveur, cache, invalidation, erreurs, concurrence) dans `ADR-UI-001` ou
une DDS dédiée ») n'existait pas encore.

**Constat initial corrigé** : la dette affirmait « sans signal ni store ». Vérification directe
(`grep -rl "signal(" frontend/src/app`) : **huit des onze composants existants utilisent déjà
`signal()`** (les deux dashboards, `profil`, `alertes`, `audit`, `garanties`, `honoraires`,
`paiements`) — seuls le shell, la navigation et la page publique de vérification n'en ont pas
besoin. Le manque réel n'était pas l'absence de signaux, mais l'absence de formalisation du
pattern déjà en usage — corrigé dans le registre de dette et dans `ADR-UI-001`.

**Contenu produit** : nouvelle section `ADR-UI-001` §Stratégie d'état, couvrant les sept dimensions
requises, chacune fondée sur une lecture directe du code réel (pas une architecture inventée) :
état local (`signal()` par composant), état serveur (services `Observable` sans état, `subscribe`
+ `signal.set()`), état partagé (aucun actuellement, critère de réévaluation posé pour le Lot 2),
cache (aucun, décision explicite de ne pas en introduire par défaut vu la nature financière des
données), invalidation (patch local et/ou rechargement explicite après mutation, pattern déjà
observé), erreurs (`signalerErreur(err)` par composant, lien confirmé avec `DD-EP17-04`),
concurrence (garde UI `[disabled]="chargement()"`, règle `debounceTime`+`switchMap` posée par
anticipation pour le Lot 2). Aucune nouvelle dépendance introduite (pas de store global), cohérent
avec `frontend-architecture.md` §State Management et la contrainte « dev solo ».

**Statut** : **Documentée — clôture proposée par le Frontend Architect**, non close au sens Gate
04A : `gate-04A-decision-ep17-lot0.md` §4 réserve explicitement l'acceptation de ce bloqueur au
Product Owner. La décision de Gate 04A elle-même (NO GO en l'état, 2026-07-31) n'est pas rouverte
par cette seule production documentaire.

**Documents modifiés** : `ADR-UI-001-socle-frontend-primeng-design-tokens-keycloak.md` (nouvelle
section « Stratégie d'état »), `design-debt-register-loyertracker.md` (`DD-EP17-08` mise à jour,
constat corrigé), `gate-04A-decision-ep17-lot0.md` §4 (statut mis à jour).

**Prochaine action autorisée** : obtenir l'acceptation explicite du Product Owner sur la stratégie
d'état documentée (clôture effective de `DD-EP17-08` comme bloqueur Gate 04A) ; poursuivre la
levée du dernier bloqueur Gate 04A/EP-17 (`DD-611-03`, complétude des preuves de test, hors
portée tant que CODE INTERDIT reste en vigueur) ; envisager la revue humaine indépendante déjà
recommandée avant tout GO Gate 04A réel.

### Acceptation Product Owner — DD-EP17-08 (2026-07-31) — bloqueur levé

**Décision explicite reçue** : le Product Owner (jptshilombo@gmail.com) a examiné le résumé des
sept dimensions de la stratégie d'état (`ADR-UI-001` §Stratégie d'état) présenté par Claude Code et
a répondu **« Acceptée sans réserve »**, sans réserve additionnelle ni modification demandée.
Décision humaine directe, non déléguée à un sous-agent ni déduite automatiquement, conformément à
`CLAUDE.md` (« Aucun pipeline, score, audit automatique ou agent spécialisé ne remplace la
validation humaine requise »).

**Vérification préalable** (avant présentation au Product Owner) : recontrôle qu'aucun fait
matériel n'a changé depuis la production documentaire du 2026-07-31 — aucun composant `lt-*`/
`Notifications*` codé, dernier commit touchant `frontend/src/app` antérieur (`a483fe9`,
2026-07-17, EP-15), `plan-execution-ux-ui-primeng-keycloak.md` toujours PROPOSÉ — NON APPROUVÉ —
CODE INTERDIT.

**Effet** : `DD-EP17-08` est **close** comme bloqueur Gate 04A (`design-debt-register-loyertracker.md`,
`gate-04A-decision-ep17-lot0.md` §4). Conformément à la clause d'invalidation de `gate-04A-decision-ep17-lot0.md`
§6 (« toute évolution matérielle des preuves … invalide cette décision et impose une nouvelle
instruction du Gate 04A … jamais une simple reconduction tacite »), la décision Gate 04A existante
(NO GO en l'état, 2026-07-31) est **invalidée par cette clôture** et nécessite une nouvelle
instruction du Gate 04A par le Product Owner — cette clôture ne prononce pas elle-même un nouveau
GO/NO GO. En l'état des preuves connues, `DD-611-02` et `DD-611-03` restent ouverts et rendraient
vraisemblable un NO GO reconduit si l'instruction était redemandée aujourd'hui, mais cette
appréciation n'est pas une décision de Gate.

**Documents modifiés** : `design-debt-register-loyertracker.md` (`DD-EP17-08` → Close, acceptée
Product Owner) ; `gate-04A-decision-ep17-lot0.md` §4 (statut « Levé ») et §5 (note de mise à jour
postérieure à l'avis Frontend Architect, avis non réécrit).

**Prochaine action autorisée** : obtenir une nouvelle instruction du Gate 04A par le Product Owner
(requise par la clause d'invalidation ci-dessus, même si le résultat attendu reste NO GO tant que
`DD-611-02`/`DD-611-03` sont ouverts) ; poursuivre en parallèle la levée de `DD-611-02` (validation
Product Owner de l'avis Design Architect déjà rendu) et `DD-611-03` (hors portée tant que CODE
INTERDIT reste en vigueur, cf. entrée du jour ci-dessus).

### Acceptation Product Owner — DD-611-02 (2026-07-31) — validation humaine obtenue, dette non close

**Décision explicite reçue** : le Product Owner (jptshilombo@gmail.com) a examiné le résumé de
l'avis de validation Design Architect (`DSG-001.md` §Avis de validation, PR #318) — six affirmations
factuelles recoupées avec le code réel, toutes exactes, une inexactitude trouvée et corrigée
(généralisation du radius/breakpoint excluant à tort `VerifyReceiptComponent`, nouvelle dette
`DD-EP17-09`) — et a répondu **« Acceptée sans réserve »**. Décision humaine directe, non déléguée,
conformément à `CLAUDE.md`.

**Différence explicite avec `DD-EP17-08`** : contrairement à `DD-EP17-08` (preuve purement
documentaire, close intégralement par cette seule acceptation), l'avis Design Architect de
`DD-611-02` conclut lui-même que la clôture d'une dette **Majeur** exige, conformément au
Validation Framework CGPA v6.1.1 §5, une **preuve d'implémentation** — pas seulement une validation
de contenu. Aucun composant `lt-*` n'est codé, `plan-execution-ux-ui-primeng-keycloak.md` reste
PROPOSÉ — NON APPROUVÉ — CODE INTERDIT. L'acceptation du Product Owner ne peut donc **pas**
manufacturer cette preuve manquante : elle lève uniquement le sous-bloqueur Gate 04A « DSG-001/
inventaire non validés humainement » (`gate-04A-decision-ep17-lot0.md` §4, preuve attendue :
« Validation Design Architect obtenue ») en fournissant la validation humaine requise par
`CLAUDE.md` (aucun agent spécialisé ne remplace la validation humaine). La dette `DD-611-02` du
registre reste **non close**.

**Vérification préalable** : recontrôle qu'aucun fait matériel n'a changé depuis l'avis Design
Architect du 2026-07-31 — aucun composant `lt-*` codé, dernier commit touchant `frontend/src/app`
antérieur (`a483fe9`, 2026-07-17, EP-15), CODE INTERDIT toujours en vigueur.

**Effet** : le sous-bloqueur Gate 04A « non validé humainement » de `DD-611-02` est **levé**
(`gate-04A-decision-ep17-lot0.md` §4). Conformément à la clause d'invalidation §6, cette évolution
matérielle invalide la décision Gate 04A existante (NO GO, 2026-07-31) et impose une nouvelle
instruction du Gate 04A par le Product Owner — cette clôture partielle ne prononce pas elle-même un
nouveau GO/NO GO. `DD-611-03` reste ouvert (hors portée tant que CODE INTERDIT en vigueur), et
`DD-611-02` reste ouvert au sens de la dette registre (preuve d'implémentation manquante) : les deux
rendraient vraisemblable un NO GO reconduit si l'instruction était redemandée aujourd'hui.

**Documents modifiés** : `design-debt-register-loyertracker.md` (`DD-611-02` mise à jour, acceptation
Product Owner tracée, statut « non close » maintenu) ; `gate-04A-decision-ep17-lot0.md` §4 (statut
« Levé » pour le sous-bloqueur, dette registre distinguée explicitement).

**Prochaine action autorisée** : obtenir une nouvelle instruction du Gate 04A par le Product Owner
(requise par la clause d'invalidation, résultat attendu NO GO tant que `DD-611-02`/`DD-611-03`
restent ouverts au sens de leurs registres respectifs) ; aucune voie de clôture de `DD-611-02` ou
`DD-611-03` n'existe hors implémentation de composants sous un Plan d'Exécution approuvé — CODE
INTERDIT reste la seule contrainte structurante restante.

### Acceptation Product Owner — DD-611-03 (2026-07-31) — validation humaine obtenue, dette non close

**Décision explicite reçue** : le Product Owner (jptshilombo@gmail.com) a examiné le résumé de
l'avis de validation Frontend Architect (`traceability-ui-loyertracker.md` §Avis de validation,
PR #319) — neuf affirmations factuelles recoupées avec le code réel, **toutes exactes**, règle
« À définir » respectée sans exception — et a répondu **« Acceptée sans réserve »**. Décision
humaine directe, non déléguée, conformément à `CLAUDE.md`.

**Même traitement que `DD-611-02`** : l'acceptation Product Owner fournit la validation humaine
requise pour le sous-bloqueur Gate 04A « matrice approuvée » (`gate-04A-decision-ep17-lot0.md` §4)
— elle ne clôt pas `DD-611-03` du registre de dette, qui reste **non close** : les preuves de test
attendues (unitaire/a11y/responsive/Visual Review) restent structurellement inexistantes tant
qu'aucun composant `lt-*`/`Notifications*` n'est codé, conformément au Validation Framework CGPA
v6.1.1 §5 et au verrou CODE INTERDIT (`plan-execution-ux-ui-primeng-keycloak.md` toujours PROPOSÉ
— NON APPROUVÉ).

**Vérification préalable** : recontrôle qu'aucun fait matériel n'a changé depuis l'avis Frontend
Architect du 2026-07-31 — aucun composant `lt-*`/`Notifications*` codé, dernier commit touchant
`frontend/src/app` antérieur (`a483fe9`, 2026-07-17, EP-15), CODE INTERDIT toujours en vigueur.

**Effet** : le sous-bloqueur Gate 04A « matrice approuvée » de `DD-611-03` est **levé**
(`gate-04A-decision-ep17-lot0.md` §4). Conformément à la clause d'invalidation §6, cette évolution
matérielle invalide de nouveau la décision Gate 04A existante (NO GO, 2026-07-31) et impose une
nouvelle instruction du Gate 04A par le Product Owner — cette clôture partielle ne prononce pas
elle-même un nouveau GO/NO GO.

**Bilan à ce stade** : les trois bloqueurs initiaux du Gate 04A (`DD-611-02`, `DD-611-03`,
`DD-EP17-08`) ont chacun reçu soit une clôture complète (`DD-EP17-08`), soit l'acceptation Product
Owner de leur validation humaine (`DD-611-02`, `DD-611-03`) — mais `DD-611-02` et `DD-611-03`
restent ouverts **en tant que dettes du registre**, l'un pour preuve d'implémentation manquante,
l'autre pour preuves de test manquantes, toutes deux nécessitant du code sous un Plan d'Exécution
approuvé, actuellement CODE INTERDIT.

**Documents modifiés** : `design-debt-register-loyertracker.md` (`DD-611-03` mise à jour,
acceptation Product Owner tracée, statut « non close » maintenu) ; `gate-04A-decision-ep17-lot0.md`
§4 (statut « Levé » pour le sous-bloqueur, dette registre distinguée explicitement).

**Prochaine action autorisée** : les trois sous-bloqueurs Gate 04A d'origine (validation
Design Architect, validation Frontend Architect, stratégie d'état) ont désormais tous reçu une
réponse Product Owner. La prochaine étape structurante est une **nouvelle instruction Gate 04A**
par le Product Owner (requise par la clause d'invalidation, cumulée sur trois évolutions
matérielles) ; en parallèle, l'approbation explicite du Plan d'Exécution lui-même reste une action
distincte (`plan-execution-ux-ui-primeng-keycloak.md` §12), et l'obtention de la clé de licence
PrimeNG Community reste une action externe au Product Owner, hors périmètre CLI
(`rapport-licence-securite-primeng-lot0.md`).

### Nouvelle instruction Gate 04A — préparation (2026-07-31) — décision Product Owner attendue

**Instruction explicite reçue** : « fais la nouvelle instruction Gate 04A ». Nouvelle instance
produite : `gate-04A-decision-ep17-lot0-v2.md`, requise par la clause d'invalidation cumulée sur
trois évolutions matérielles (`DD-EP17-08` close, sous-bloqueurs `DD-611-02`/`DD-611-03` levés).
`gate-04A-decision-ep17-lot0.md` (NO GO, 2026-07-31) n'est pas réécrite — préservation des
décisions historiques.

**Mises à jour de cohérence apportées** : `CHECK-UX-01-ep17-ui-foundation.md` (note : validation
Product Owner de `DSG-001` désormais obtenue, agrégat inchangé) ; `CHECK-FRONTEND-01-ep17-ui-foundation.md`
(note : contrôle « Stratégie d'état » reclassé Préparation en cours, agrégat révisé de 5/3 à 6/2
Préparation en cours/Non exécuté) — avis d'origine non réécrits.

**Ce que la nouvelle instance documente** : les deux checklists (`CHECK-UX-01`, `CHECK-FRONTEND-01`)
restent agrégées **NO GO en l'état** — non plus à cause des trois bloqueurs désormais traités, mais
parce que 8 contrôles bloquants de `CHECK-UX-01` et 2 de `CHECK-FRONTEND-01` (Budgets/performance,
tests composant/a11y/responsive) restent structurellement « Non exécuté » : aucune preuve
documentaire ne peut les satisfaire, seule une implémentation réelle le peut. La section 6 (décision
GO/GO sous réserve/NO GO) est **volontairement laissée vide** — seul le Product Owner peut la
compléter, conformément à `CLAUDE.md`.

**Prochaine action autorisée** : le Product Owner complète `gate-04A-decision-ep17-lot0-v2.md` §6.
Si la décision est GO sous réserve, elle devra définir explicitement le périmètre autorisé (ex.
Lot 1 sous réserve continue de `DD-611-02`/`DD-611-03`, avec preuves de test/implémentation à
produire au fil du Lot) ; dans tous les cas, l'approbation explicite du Plan d'Exécution
(`plan-execution-ux-ui-primeng-keycloak.md` §12) et l'obtention de la clé de licence PrimeNG
restent des actions distinctes, non couvertes par cette seule décision de Gate.

### Décision Gate 04A rendue — GO sous réserve, périmètre Lot 1 (2026-07-31)

**Décision Product Owner explicite** : « GO sous réserve, périmètre Lot 1 ». Section 6 de
`gate-04A-decision-ep17-lot0-v2.md` complétée en conséquence. `gate-04A-decision-ep17-lot0.md`
(NO GO, 2026-07-30/31) reste non réécrite — préservation des décisions historiques (`CLAUDE.md`).

**Portée** : autorisation limitée à EP-17 Lot 1. Ne couvre pas Lot 2 et suivants — nouvelle
instruction de Gate requise pour toute extension de périmètre. Réserves continues : les 8 contrôles
bloquants restés « Non exécuté » (Budgets/performance et tests composant/a11y/responsive côté
`CHECK-FRONTEND-01` ; 7 contrôles côté `CHECK-UX-01`) doivent produire leurs preuves d'implémentation
au fil du Lot 1 — non substituables par de la documentation.

**Ce que ce GO ne couvre pas** : ni l'approbation du Plan d'Exécution
(`plan-execution-ux-ui-primeng-keycloak.md`, toujours « PROPOSÉ — NON APPROUVÉ — CODE INTERDIT »),
ni l'obtention de la clé de licence PrimeNG Community — deux actions Product Owner distinctes,
préalables à tout développement effectif du Lot 1 (verrou `CLAUDE.md` : « Aucun code applicatif
sans Plan d'Exécution approuvé »).

**Prochaine action autorisée** : le Product Owner statue sur l'approbation du Plan d'Exécution
(§12) et sur l'obtention de la clé de licence PrimeNG. Le développement Lot 1 ne peut démarrer
qu'après ces deux actions, sous réserve continue des preuves de test/implémentation ci-dessus.

### Plan d'Exécution approuvé — périmètre Lot 1 uniquement (2026-07-31)

**Instruction explicite reçue** : « approuve le Plan d'Exécution ». `plan-execution-ux-ui-primeng-keycloak.md`
§12 mis à jour : statut **APPROUVÉ SOUS RÉSERVE — PÉRIMÈTRE LOT 1 UNIQUEMENT** (en-tête et §12),
appuyé sur `gate-04A-decision-ep17-lot0-v2.md` (GO sous réserve, Lot 1). Le verrou `CLAUDE.md`
« Aucun code applicatif sans Plan d'Exécution approuvé » est donc levé **pour le seul Lot 1** —
inchangé pour les Lots 2 à 6, chacun restant un point de contrôle GO/NO GO distinct.

**Ce que cette approbation ne lève pas** :

* la clé de licence PrimeNG Community reste à obtenir avant toute installation effective
  (`rapport-licence-securite-primeng-lot0.md`) — aucune installation ne peut démarrer avant cette
  action Product Owner distincte ;
* les réserves continues du Gate 04A v2 (contrôles `CHECK-UX-01`/`CHECK-FRONTEND-01` encore
  « Non exécuté ») restent ouvertes, preuves à produire au fil du Lot 1 ;
* l'applicabilité du Gate 02A au socle EP-17 (au-delà de US-125/EP-16) n'a pas été tranchée par
  cette approbation — point non résolu, non neutralisé, à clarifier avant ou pendant le Lot 1
  (« un contrôle applicable sans preuve est non exécuté, jamais non applicable », `CLAUDE.md`).

**Prochaine action autorisée** : le Product Owner statue sur l'obtention de la clé de licence
PrimeNG et, le cas échéant, clarifie l'applicabilité du Gate 02A au socle EP-17. Le développement
technique du Lot 1 (installation PrimeNG, tokens, thème) peut ensuite démarrer sous réserve
continue des preuves de test/implémentation attendues par le Gate 04A v2.

### Clé de licence PrimeNG Community obtenue (2026-08-01) — dernier verrou explicite d'installation levé

**Fait rapporté** : le Product Owner a indiqué que la clé de licence PrimeUI Community a été
obtenue et déposée hors dépôt, dans `/home/ubuntu/INFRASTRUCTURE/primeui/key` — même emplacement
que les autres secrets d'infrastructure du projet (SonarQube, GitHub, Twilio), conforme à DSO-03
(secret hors code, non commité).

**Vérification effectuée par Claude Code (DevSecOps Lead)** : lecture et décodage du jeton (JWT,
vérification hors ligne, sans télémétrie — cf. `rapport-licence-securite-primeng-lot0.md` §2).
Contenu conforme à l'attendu : `product=primeui`, `tier=community`, `type=dev`, émis 2026-08-01,
expire 2027-08-01 (1 an, renouvellement annuel obligatoire). Aucune valeur secrète reproduite dans
la documentation ni dans cet échange. Limite de la vérification : la validité cryptographique du
jeton auprès de PrimeTek et la régularité de l'acceptation de l'accord de licence sur `primeui.dev`
ne sont pas vérifiables par Claude Code — relèvent de la responsabilité du Product Owner qui a créé
le compte. Détail complet : `rapport-licence-securite-primeng-lot0.md` §9.

**Effet** : la condition explicite posée le 2026-07-31 (« aucune installation ne peut démarrer
avant cette action distincte ») est **remplie**. Ce n'est pas une nouvelle décision de Gate, mais
la levée d'une condition déjà posée par une décision Product Owner antérieure
(`plan-execution-ux-ui-primeng-keycloak.md`).

**Ce qui reste ouvert, non neutralisé par ce fait** : les réserves continues du Gate 04A v2 (8
contrôles `CHECK-UX-01`/`CHECK-FRONTEND-01` « Non exécuté », preuves à produire au fil du Lot 1) ;
l'applicabilité du Gate 02A au socle EP-17 au-delà de US-125/EP-16, toujours non tranchée — à
clarifier avant, ou tenue comme réserve pendant, l'exécution du Lot 1 (`CLAUDE.md` : « un contrôle
applicable sans preuve est non exécuté, jamais non applicable ») ; le rappel de renouvellement
annuel de la clé (avant 2027-08-01 + 30 jours de grâce), non encore mis en place.

**Documents modifiés** : `rapport-licence-securite-primeng-lot0.md` (§8 table d'actions, nouveau
§9) ; `plan-execution-ux-ui-primeng-keycloak.md` (nouvelle entrée datée sous « Approbation Product
Owner du Plan »).

**Prochaine action autorisée** : le Product Owner peut désormais instruire le démarrage effectif du
travail technique du Lot 1 (installation PrimeNG, tokens, thème), sous réserve continue des points
ci-dessus ; ou clarifier au préalable l'applicabilité du Gate 02A. Ces deux choix restent des
décisions Product Owner distinctes, non tranchées par ce seul constat.

### Nouvelle instruction Gate 02A — applicabilité EP-17 Lot 1 (2026-08-01) — décision Product Owner attendue

**Instruction explicite reçue** : « clarifier Gate 02A d'abord » (choix du Product Owner face au
point ouvert ci-dessus, avant tout démarrage du Lot 1).

**Incohérence identifiée** : `gate-04A-decision-ep17-lot0-v2.md` §4 avait traité le sous-bloqueur
« validation PO Gate 02A » comme **Levé**, en s'appuyant sur `gate-02A-decision-ep16-us125.md`
(GO sous réserve, périmètre **US-125**). Or `plan-execution-ux-ui-primeng-keycloak.md` §3 précise
explicitement que cette décision « ne couvre que US-125 (EP-16), pas le socle EP-17 ». Une note de
mise à jour a été ajoutée à `gate-04A-decision-ep17-lot0-v2.md` (sans réécrire la décision
d'origine, `CLAUDE.md`) pour signaler cette contradiction.

**Nouvelle instance produite** : `gate-02A-decision-ep17-lot1.md`, évaluant les 11 critères du
Gate 02A spécifiquement contre le périmètre du Lot 1 (« ne migrer aucun écran métier complet à ce
stade », `plan-execution-ux-ui-primeng-keycloak.md` §3). Constat : 5 critères sans matière
nouvelle (personas, journeys, parcours critiques, cas d'erreur, maquettes — Lot 1 ne livre aucun
écran) ; 2 inchangés et déjà couverts par les décisions US-125 (navigation, information
architecture) ; 3 avec matière réelle (design system, responsive, accessibilité) dont le
**contenu** est déjà validé (`DSG-001.md`, PO via `DD-611-02`) mais dont l'**implémentation**
relève du Gate 04A, pas de ce Gate 02A. Avis UX/UI Design Lead proposé : **GO sous réserve**. La
section 6 de la nouvelle instance est **volontairement laissée vide** — seul le Product Owner peut
la compléter, conformément à `CLAUDE.md`.

**Prochaine action autorisée** : le Product Owner complète `gate-02A-decision-ep17-lot1.md` §6.
Le démarrage effectif du travail technique du Lot 1 reste subordonné à cette décision, en plus des
réserves déjà tracées (Gate 04A v2 §4, rappel de renouvellement de la clé PrimeNG).

### Décision Gate 02A rendue — GO sous réserve, périmètre Lot 1 (2026-08-01)

**Décision Product Owner explicite** : « GO sous réserve, périmètre Lot 1 ». Section 6 de
`gate-02A-decision-ep17-lot1.md` complétée en conséquence. Cette décision tranche explicitement
l'incohérence documentaire signalée ci-dessus : `gate-02A-decision-ep16-us125.md` (US-125) n'est
plus la base retenue pour EP-17 — `gate-02A-decision-ep17-lot1.md` fait désormais seule autorité
pour ce périmètre. Aucun document historique n'est réécrit (`CLAUDE.md`).

**Portée** : autorisation limitée à EP-17 Lot 1 tel que défini par
`plan-execution-ux-ui-primeng-keycloak.md` §3 (aucun écran métier migré à ce stade). Ne couvre pas
Lot 2 et suivants — ceux-ci introduiront des écrans métier réels et devront réévaluer sur leur
propre matière les 5 critères ici jugés « sans objet » (personas, journeys, parcours, cas d'erreur,
maquettes), via une nouvelle instruction du Gate 02A.

**Effet cumulé** : les trois conditions posées le 2026-07-31 pour démarrer le travail technique du
Lot 1 (approbation du Plan d'Exécution, clé de licence PrimeNG, clarification Gate 02A) sont
désormais toutes réunies. Réserves continues restant en vigueur, non neutralisées par ces
décisions : les 8 contrôles Gate 04A v2 « Non exécuté »
(`CHECK-UX-01`/`CHECK-FRONTEND-01`, preuves à produire au fil du Lot 1) et le rappel de
renouvellement annuel de la clé de licence PrimeNG (avant 2027-08-01,
`rapport-licence-securite-primeng-lot0.md` §9).

**Documents modifiés** : `gate-02A-decision-ep17-lot1.md` §6-§7 (décision complétée).

**Prochaine action autorisée** : le développement technique du Lot 1 (installation PrimeNG,
tokens, thème) peut démarrer, sous réserve continue des preuves de test/implémentation attendues
par le Gate 04A v2.

### Bilan de session — déblocage Lot 1 et assainissement CI (2026-08-01)

**Résumé** : trois PR produites et mergées dans `main` aujourd'hui, closant la séquence ouverte le
2026-07-31 (« Product Owner statue sur la clé de licence PrimeNG et, le cas échéant, clarifie
l'applicabilité du Gate 02A »).

* **PR #326** — clé de licence PrimeUI Community obtenue et vérifiée (JWT décodé sans reproduire
  le secret : `product=primeui`, `tier=community`, `type=dev`, validité 2026-08-01→2027-08-01),
  stockée hors dépôt (`/home/ubuntu/INFRASTRUCTURE/primeui/key`, cohérent DSO-03). Détail :
  `rapport-licence-securite-primeng-lot0.md` §9.
* **PR #327** — instruction Gate 02A pour EP-17 Lot 1 (`gate-02A-decision-ep17-lot1.md`),
  clarifiant une incohérence documentaire non résolue (extension tacite erronée de
  `gate-02A-decision-ep16-us125.md`, périmètre US-125, à EP-17 dans `gate-04A-decision-ep17-lot0-v2.md`
  §4). Décision Product Owner rendue : **GO sous réserve, périmètre Lot 1**.
* **PR #328** — en tentant de merger #326/#327, deux checks CI requis (bloquants pour toute
  fusion sur `main`, `enforce_admins` actif) se sont révélés en échec, sans rapport avec le
  contenu documentaire :
  * `Backend (build + tests + couverture)` : `BailClotureIntegrationTest` contenait un bug de test
    daté-dépendant (comptage `EN_RETARD` faux le 1er de chaque mois, la logique de production
    `date_exigibilite < CURRENT_DATE` étant en réalité correcte) — corrigé côté test uniquement,
    vérifié localement (Testcontainers, 6/6 puis 220/220 sur la suite complète).
  * `Frontend (build + tests)` : Quality Gate SonarQube en échec sur `new_coverage` (68 % < 80 %
    requis, période de 30 jours) — comblé par des tests ciblés sur du code EP-15/US-103 déjà
    fusionné mais jamais testé (route paresseuse `/verify/receipt`, deux méthodes
    `S02ApiService`, deux branches `VerifyReceiptComponent`, le flux `creerLocataireRapide()` de
    `BailleurDashboardComponent`), sans toucher au code de production.
  * En cours de route, le check `Build, scan et SBOM Docker` (masqué jusque-là car en aval d'un
    échec backend/frontend) a révélé **4 CVE HIGH préexistantes** dans les dépendances Spring de
    l'image API (`spring-data-commons` 3.5.11, `spring-framework` 6.2.18 — CVE-2026-41695,
    -41850, -41842, -41845). Corrigé par un bump `spring-boot-starter-parent` 3.5.14 → 3.5.16
    (patch mineur, pas de saut majeur), suite complète revérifiée (220/220).
  * Ce travail est un correctif CI/DevSecOps de maintenance (bugs de test et vulnérabilités
    préexistants, sans rapport avec EP-17), pas du développement Frontend Lot 1 — il ne relève
    donc pas du verrou CODE INTERDIT du Plan d'Exécution.

**État final vérifié** : les trois PR sont mergées (`main` HEAD `daf9c33`) ; les 4 workflows
GitHub Actions (`CI`, `CodeQL`, `CGPA Framework Audit`, `Registry Policy`) sont tous `success` sur
ce commit — `main` est confirmé entièrement vert.

**Ce qui reste ouvert** (inchangé par ce bilan, aucune réserve neutralisée) : les 8 contrôles
Gate 04A v2 « Non exécuté » (`CHECK-UX-01`/`CHECK-FRONTEND-01`, preuves à produire au fil du
Lot 1) ; le rappel de renouvellement annuel de la clé de licence PrimeNG avant 2027-08-01 (+ 30
jours de grâce), toujours non mis en place.

**Prochaine action autorisée** : le développement technique du Lot 1 (installation PrimeNG,
tokens, thème) peut démarrer sur `main` à jour, sous réserve continue des preuves de test/
implémentation attendues par le Gate 04A v2.

### Rappel de renouvellement de la clé PrimeNG créé (2026-08-01)

**Instruction explicite reçue** : « Set up a renewal reminder for the PrimeNG key ». Un événement
Google Calendar a été créé pour le Product Owner (jptshilombo@gmail.com) le **2027-07-01 09:00
(Africa/Kinshasa)** — un mois avant l'expiration du 2027-08-01 —, avec un second rappel une semaine
avant (24 juin 2027). La description reprend la marche à suivre complète : reconfirmer les quatre
critères d'éligibilité Community, renouveler sur `primeui.dev`, mettre à jour
`/home/ubuntu/INFRASTRUCTURE/primeui/key`, documenter le renouvellement.

**Choix du mécanisme** : un événement Calendar a été préféré à une routine cloud programmée
(alternative proposée et écartée par le Product Owner) — plus fiable pour un rappel simple basé
sur une date, sans dépendance à l'exécution future d'un agent cloud ni à l'état du dépôt dans un an.

**Effet** : la dernière action ouverte de la table §8 de `rapport-licence-securite-primeng-lot0.md`
(« rappel de renouvellement annuel ») est **satisfaite** ; §9 mis à jour en conséquence. Ce qui
restait « ouvert » dans l'entrée de bilan ci-dessus concernant ce point spécifique est donc clos —
l'entrée historique n'est pas réécrite (`CLAUDE.md`), cette précision la complète.

**Documents modifiés** : `rapport-licence-securite-primeng-lot0.md` (§8, §9).

**Prochaine action autorisée** : aucune côté PrimeNG jusqu'au déclenchement du rappel en 2027-07 ;
le développement technique du Lot 1 reste la seule action ouverte, sous réserve continue des
preuves de test/implémentation attendues par le Gate 04A v2.

### US-129 démarrée — revue visuelle des Design Tokens (2026-08-01)

**Instruction explicite reçue** : « Start US-129, the Design Tokens visual review ». Première
User Story du Lot 1 (`addendum-backlog-ep17-ui-foundation-primeng-keycloak.md`).

**Travail produit par Claude Code, en tant que Design Architect désigné** (limite d'indépendance
inchangée, rappelée dans chaque document) :

* **Revue de contraste WCAG 2.2** des 13 tokens de `DSG-001.md` §Palette et couleurs (calcul de
  luminance relative/ratio, formule W3C, contre les deux surfaces existantes) : **11/13
  conformes tels quels** ; 2 non conformes au seuil non-texte 3:1 (SC 1.4.11) —
  `--lt-border-default` (1.72:1) et `--lt-state-danger-strong` (1.78:1), tous deux utilisés comme
  couleur de bordure de composants réels (champs, boutons, zone « à risque » garantie).
* **Corrections proposées** (même famille chromatique, cohérence de palette) :
  `--lt-border-default` `#334155`→`#64748b` (3.75:1), `--lt-state-danger-strong` `#7f1d1d`→`#dc2626`
  (3.70:1).
* **6 nouvelles catégories de tokens candidatées** (`spacing`, `typography`, `size`, `z-index`,
  `breakpoint`, `focus`), dérivées des valeurs déjà observées dans le code quand elles existent.
  `shadow` et `motion` restent **explicitement différés** (aucun besoin réel constaté), déjà
  justifié ainsi dans `DSG-001.md` avant cette revue.
* **Nouvelle instance** : `DDS-LT-006-validation-visuelle-design-tokens.md`, statut **Proposée** —
  la limite d'indépendance (même rôle auteur des valeurs candidates et de leur revue) rend une
  validation Product Owner explicite nécessaire avant toute clôture, en particulier pour les deux
  corrections de couleur (impact visuel sur 24 occurrences en dur déjà présentes dans le code).
* **Fichier de tokens versionné produit** : `frontend/src/styles/tokens/_lt-tokens.scss` — livrable
  attendu par le critère GWT de `US-129`. Compile proprement (`sass`, vérifié localement) ; **non
  importé dans `styles.scss`** (intégration = `US-131`, hors périmètre de cette story) ; bundle de
  production inchangé (vérifié, `ng build`).
* `DSG-001.md` mis à jour en conséquence (§Palette et couleurs, §Typographie, §Spacing, §Elevation,
  nouvelle §Z-index et Focus, §Tokens) ; `design-decision-register.md` mis à jour (ligne
  `DDS-LT-006`).

**Ce que ce travail ne clôt pas** : `US-129` n'est pas marquée terminée — le critère GWT exige une
validation du Design Architect, produite ici, mais la limite d'indépendance appelle une
confirmation Product Owner avant tout usage des tokens (et en particulier avant que `US-130`
n'installe PrimeNG dessus). Aucun code Angular applicatif n'est modifié ; `styles.scss` n'est pas
touché.

**Prochaine action autorisée** : le Product Owner statue sur `DDS-LT-006` (Acceptée / réserves /
rejetée), en particulier sur les deux corrections de couleur. Une fois obtenue, `US-129` peut être
close et `US-130` (Thème PrimeNG, qui en dépend) peut démarrer.

### DDS-LT-006 acceptée — US-129 close (2026-08-01)

**Décision Product Owner explicite** : « Accepted, both corrections approved ». Les deux
corrections de couleur (`--lt-border-default`→`#64748b`, `--lt-state-danger-strong`→`#dc2626`)
sont approuvées sans réserve, ainsi que les 6 catégories de tokens candidatées (`spacing`,
`typography`, `size`, `z-index`, `breakpoint`, `focus`).

**Documents mis à jour en conséquence** : `DDS-LT-006` (statut Acceptée) ;
`design-decision-register.md` (ligne DDS-LT-006) ; `DSG-001.md` (§Palette et couleurs — valeurs
définitives, §Typographie/§Spacing/§Z-index et Focus — « validées » au lieu de « candidatées » ;
**version incrémentée 0.1.0 → 0.2.0**, premier incrément de version du DSG, conforme à sa propre
procédure de modification — « toute évolution passe par une DDS … avant incrément de version ») ;
`frontend/src/styles/tokens/_lt-tokens.scss` (commentaire d'en-tête mis à jour, valeurs déjà
correctes inchangées).

**Effet** : le critère GWT de `US-129` (« revues et validées visuellement par le Design Architect »)
est satisfait avec, au-delà de l'avis du sous-agent, la validation humaine désormais obtenue —
requise par la limite d'indépendance déjà tracée pour ce rôle. **`US-129` est close.**

**Ce que cette acceptation n'autorise pas** : le remplacement des 24 occurrences en dur des
anciennes valeurs (`#334155`, `#7f1d1d`) déjà présentes dans le code applicatif reste hors
périmètre — relève de la migration écran par écran des Lots 2 et suivants, chacun restant un point
de contrôle distinct. L'intégration du fichier de tokens dans `styles.scss` relève de `US-131`, non
déclenchée par cette acceptation.

**Prochaine action autorisée** : `US-130` (Thème PrimeNG) peut démarrer — dépendances `US-128`
(fait) et `US-129` (close) toutes deux satisfaites. `US-131` (Architecture SCSS) reste bloquée sur
`US-129` seule, désormais également débloquée.

### US-130 démarrée — installation et theming PrimeNG (2026-08-01)

**Instruction explicite reçue** : « Yes, start US-130 ». Première installation effective de
PrimeNG du projet (verrou `CLAUDE.md` « Aucun code applicatif sans Plan d'Exécution approuvé » levé
pour le Lot 1 depuis le 2026-07-31 ; clé de licence obtenue, Gates 02A/04A v2 GO sous réserve).

**Dépendances installées** : `primeng@22.0.0` (version confirmée US-128), `@angular/cdk@^22.0.7`
(peer dep requise, absente jusqu'ici), `@primeuix/themes@^3.0.0` (API `definePreset`). 0
vulnérabilité de production (`npm audit --omit=dev`).

**Thème configuré** (`frontend/src/styles/tokens/lt-preset.ts`) : étend le preset Aura de
PrimeNG, ancre `semantic.primary` sur la famille `sky` (au lieu de `emerald` par défaut — aligné
sur `--lt-focus-ring`/`--lt-state-info`) et `semantic.surface` sur la famille `slate` (au lieu de
`zinc` par défaut en mode sombre — aligné sur `--lt-surface-page`). Tous les autres tokens
sémantiques (formField, list, overlay, navigation…) héritent de ces deux surcharges par
composition de tokens, sans réécriture individuelle.

**Mode sombre figé** : `index.html` (`<html class="p-dark">`) et `styles.scss`
(`color-scheme: dark`, était `light dark`) — corrige l'incohérence déjà signalée dans
`DSG-001.md` §Dark Mode (« bascule non pilotée »), condition nécessaire pour que le thème PrimeNG
(fonctions CSS `light-dark()`) résolve nos valeurs plutôt que la préférence système du testeur.
`providePrimeNG` câblé dans `app.config.ts` (`theme.preset`, `darkModeSelector: '.p-dark'`,
`ripple: false` — cohérent §Principes « Sobriété »).

**Clé de licence non câblée dans ce commit** : `providePrimeNG({ license: … })` accepte la clé,
mais elle reste un secret hors code (DSO-03) — son injection dans un build déployé (variable
d'environnement CI, fichier non versionné) est un mécanisme distinct, hors périmètre de US-130.
Sans elle, PrimeNG affiche une bannière « Invalid PrimeUI License » (cosmétique, ne bloque aucune
fonctionnalité) — attendu et sans impact sur le critère GWT.

**Vérification** :
* 2 nouveaux tests unitaires (`lt-preset.spec.ts`, Karma/ChromeHeadless réel) : la valeur calculée
  de `--p-primary-color` ne contient pas le rgb emerald par défaut d'Aura, celle de
  `--p-surface-900` ne contient pas le rgb zinc par défaut — preuve directe, par valeurs CSS
  calculées dans un navigateur réel, plutôt qu'une inspection visuelle.
* Suite complète : 102/102 tests passent (100 existants + 2 nouveaux), `ng lint` propre.
* **Preuve attendue par le Plan d'Exécution** (mesure de bundle avant/après) : `333.32 kB` →
  `512.76 kB` (transfert estimé `91.23 kB` → `123.13 kB`), soit **50 % du budget** `angular.json`
  (`1 Mo` avertissement, `2,5 Mo` erreur) — aucun avertissement de budget à la compilation.
* **Limite rencontrée** : une vérification visuelle en navigateur réel (`ng serve` + Playwright
  headless) a été tentée mais n'a pas abouti dans cet environnement — le serveur de dev
  (Vite/HMR) est resté instable, et le build de production servi statiquement échoue au
  bootstrap faute de backend Keycloak réel (redirection `check-sso` vers un `/auth` inexistant).
  Limite d'environnement (absence de Keycloak/backend accessibles ici), sans lien avec le code du
  thème — non contournée pour éviter de fabriquer une preuve non probante ; les tests Karma
  (valeurs CSS calculées dans Chrome réel) restent la preuve retenue pour le critère GWT.

**Documents modifiés** : `frontend/package.json`/`package-lock.json` ; `app.config.ts`,
`index.html`, `styles.scss`, nouveaux `styles/tokens/lt-preset.ts` et
`styles/tokens/lt-preset.spec.ts` ; `DSG-001.md` (§Composants, statut Gouvernance).

**Ce que cette installation n'autorise pas** : aucun composant `lt-*` n'est codé, aucun écran
métier n'est migré (« ne migrer aucun écran métier complet à ce stade », Plan d'Exécution §3 Lot 1)
— hors périmètre, relève des Lots 2/3.

**Prochaine action autorisée** : le Product Owner peut valider `US-130` et instruire `US-131`
(Architecture SCSS — import de `_lt-tokens.scss` dans `styles.scss`, élimination du hardcodé), ou
demander la mise en place du mécanisme d'injection de la clé de licence avant toute autre étape.

### US-131 démarrée — Architecture SCSS (2026-08-01)

**Instruction explicite reçue** : « Yes, start US-131 ». Dernière User Story du Lot 1
(`addendum-backlog-ep17-ui-foundation-primeng-keycloak.md`).

**Réorganisation** : `frontend/src/styles.scss` (86 lignes, plat) devient un point d'entrée de 5
lignes qui assemble 4 couches (`frontend/src/styles/{foundations,theme,components,utilities}/`,
`@use`/`@forward` Sass), conforme à `DSG-001.md` §Naming Convention. Fondations réunit les tokens
`--lt-*` (US-129) et le reset minimal ; Thème porte le mode sombre et le look de base du `body` ;
Composants porte `button`/`.skip-link`/`pre`/le patron `:focus-visible` ; Utilitaires porte
`.container` et `prefers-reduced-motion`.

**Tokenisation partielle, délibérée** : les valeurs déjà identiques à un token existant sont
substituées par `var(--lt-*)` (`#0f172a`→`--lt-surface-page`, `#e2e8f0`→`--lt-text-primary`,
`#38bdf8`/`3px`/`solid`→`--lt-focus-ring*`, `6px`→`--lt-radius-default`,
`0.9rem`→`--lt-font-size-base`) — aucun changement de valeur numérique. **`#334155` et `#1e293b`
restent en dur, volontairement** : `--lt-border-default` a été corrigé en `#64748b` par
`DDS-LT-006` — l'appliquer ici changerait la bordure visible de `<button>` sur tout le produit sans
revue visuelle, contredisant le critère GWT de cette story elle-même et la décision déjà tracée
(« remplacement des 24 occurrences en dur différé aux Lots 2+ »). `#1e293b` n'a aucun token
équivalent défini à ce jour (dette signalée, non comblée ici).

**Preuve « aucune régression visuelle »** : compilation de l'ancien `styles.scss` (git `main`) et
du nouveau via `sass`, puis diff sémantique automatisé (script Python : résolution de tous les
`var(--lt-*)` du nouveau CSS contre son propre `:root`, comparaison sélecteur par sélecteur avec
l'ancien) — **résultat : aucune différence**, tous les sélecteurs résolvent aux mêmes déclarations.
Une revue Visual Review par capture d'écran (comme prévu au Lot 0) n'a pas pu être rejouée dans cet
environnement (même limite Keycloak/dev-server que `US-130`) ; le diff CSS sémantique est retenu
comme preuve, plus rigoureux qu'une inspection visuelle mais de nature différente — à signaler si
une revue humaine complémentaire est souhaitée.

**Vérification** : `ng lint` propre, 102/102 tests (suite inchangée, aucune nouvelle assertion
requise — pas de nouveau comportement, seulement une réorganisation), `ng build` réussi
(`514.07 kB`, stable, toujours ~50 % du budget `angular.json`).

**Documents modifiés** : `frontend/src/styles.scss` (réécrit, point d'entrée) ; nouveaux
`frontend/src/styles/{foundations,theme,components,utilities}/*.scss`.

**Effet** : les trois User Stories du Lot 1 (`US-129`, `US-130`, `US-131`) sont désormais toutes
**fonctionnellement terminées** (13/13 points). Aucune n'a de validation Product Owner formelle
distincte de leur PR respective à ce jour, hormis `US-129`/`DDS-LT-006` déjà acceptée.

**Prochaine action autorisée** : le Product Owner valide `US-130`/`US-131` (ou demande des
ajustements) ; au-delà, le Lot 1 étant complet, la prochaine étape structurante est une nouvelle
instruction de Gate (04A/02A) pour statuer sur le Lot 2 (Composants transverses), conformément à
« chaque lot reste un point de contrôle GO/NO GO distinct » (`plan-execution-ux-ui-primeng-keycloak.md`).

### Nouvelle instruction Gate 04A/Gate 02A — Lot 2 (2026-08-01) — décision Product Owner attendue

**Instruction explicite reçue** : « Instruire le Gate 04A/02A pour le Lot 2 ». Le Lot 1 étant
livré et intégralement mergé sur `main` (CI verte, 4 workflows), deux nouvelles instances sont
produites pour le périmètre Lot 2 (Composants transverses, `US-132`, 8 points), conformément au
principe « chaque lot reste un point de contrôle GO/NO GO distinct ».

**Mises à jour de cohérence apportées avant instruction** (reflètent l'évidence Lot 1 réellement
livrée, sans réécrire les avis d'origine) :
* `CHECK-UX-01-ep17-ui-foundation.md` : 2 contrôles reclassés PASS (Tokens — validés WCAG,
  `DDS-LT-006` — ; Dark mode — implémenté, `US-130`). Recompte : 2 PASS, 5 Préparation en cours,
  6 Non exécuté (sur 13).
* `CHECK-FRONTEND-01-ep17-ui-foundation.md` : 2 contrôles reclassés PASS (Architecture CSS/SCSS —
  implémentée, `US-131` — ; Mapping DSG et tokens) et 1 reclassé Préparation en cours (Budgets et
  performance — mesuré, `514,07 kB`, ~50 % du budget). Recompte : 2 PASS, 5 Préparation en cours,
  1 Non exécuté (sur 8).
* `design-debt-register-loyertracker.md` : `DD-EP17-06` (spacing) marquée « Partiellement traité »
  — tokens `--lt-space-*` définis, non adoptés (US-131 les a délibérément laissés en dehors des
  valeurs déjà en dur pour ne pas introduire de régression visuelle). Reste Ouvert.

**Ce que les nouvelles instances documentent** :
* `gate-04A-decision-ep17-lot2.md` : les contrôles bloquants restants (6 `CHECK-UX-01`, 1
  `CHECK-FRONTEND-01`) nécessitent tous des composants `lt-*` réels et testés — structurellement
  impossibles à satisfaire avant l'exécution même du Lot 2. Réserves reprises : `DD-611-02`,
  `DD-611-03` (dettes registre non closes, preuve d'implémentation requise), `DD-EP17-04`
  (échéance Lot 2, hétérogénéité composants), `DD-EP17-05` (focus-trap `lt-confirm-dialog`,
  exigences déjà fixées par `DDS-LT-005`), `DD-EP17-06` (spacing, partiellement traité). Section 6
  volontairement laissée vide.
* `gate-02A-decision-ep17-lot2.md` : sur les 11 critères, 5 sans matière nouvelle (aucun écran/
  persona/parcours livré en Lot 2), 2 inchangés, 2 avec matière réelle (design system,
  accessibilité) déjà couverte par du contenu accepté (`DSG-001.md`, `DDS-LT-005`) dont
  l'implémentation relève du Gate 04A. Avis UX/UI Design Lead proposé : GO sous réserve. Section 6
  volontairement laissée vide.
* `plan-execution-ux-ui-primeng-keycloak.md` §3 Lot 2 : note ajoutée référençant les deux
  instances, décision Product Owner attendue avant tout développement de ce Lot.

**Prochaine action autorisée** : le Product Owner statue sur `gate-04A-decision-ep17-lot2.md` §6
et `gate-02A-decision-ep17-lot2.md` §6 (GO / GO sous réserve / NO GO). Le développement technique
du Lot 2 (composants `lt-*`) ne peut démarrer qu'après ces deux décisions, conformément au verrou
`CLAUDE.md` (« Aucun code applicatif sans Plan d'Exécution approuvé ») — l'approbation du Plan
reste limitée au Lot 1 tant qu'aucune extension n'est explicitement décidée.

### Décisions Gate 04A/Gate 02A rendues — GO sous réserve, périmètre Lot 2 (2026-08-01)

**Décision Product Owner explicite** : « GO sous réserve, périmètre Lot 2 ». Section 6 complétée
en conséquence dans `gate-04A-decision-ep17-lot2.md` et `gate-02A-decision-ep17-lot2.md`.
`gate-04A-decision-ep17-lot0-v2.md` et `gate-02A-decision-ep17-lot1.md` (GO sous réserve, Lot 1)
restent non réécrites — préservation des décisions historiques (`CLAUDE.md`).

**Portée** : autorisation limitée à EP-17 Lot 2 (8 composants transverses développés et testés
isolément, sans intégration dans un écran métier existant). Ne couvre pas Lot 3 et suivants —
nouvelle instruction de Gate requise pour toute extension de périmètre, notamment dès qu'un
composant serait intégré à un écran métier réel (pilote Angular, Lot 3).

**Réserves continues** (non neutralisées par ces décisions) : les 6 contrôles `CHECK-UX-01` et 1
`CHECK-FRONTEND-01` restés « Non exécuté » doivent produire leurs preuves d'implémentation au fil
du Lot 2 — non substituables par de la documentation. `DD-611-02`, `DD-611-03`, `DD-EP17-04`,
`DD-EP17-05` (focus-trap `lt-confirm-dialog`, exigences déjà fixées par `DDS-LT-005`) et
`DD-EP17-06` restent ouverts.

**Ce que ce GO ne couvre pas** : l'approbation de l'extension du Plan d'Exécution au Lot 2
(`plan-execution-ux-ui-primeng-keycloak.md`, §12 toujours limité au seul Lot 1) — action Product
Owner distincte, préalable à tout développement effectif du Lot 2 (verrou `CLAUDE.md`, « Aucun
code applicatif sans Plan d'Exécution approuvé »).

**Prochaine action autorisée** : le Product Owner statue sur l'extension du Plan d'Exécution au
Lot 2. Le développement technique du Lot 2 (composants `lt-*`) ne peut démarrer qu'après cette
approbation, sous réserve continue des preuves de test/implémentation ci-dessus.

### Plan d'Exécution étendu au Lot 2 (2026-08-01)

**Instruction explicite reçue** : « Approuve l'extension du Plan d'Exécution au Lot 2 ».
`plan-execution-ux-ui-primeng-keycloak.md` mis à jour : statut **APPROUVÉ SOUS RÉSERVE — PÉRIMÈTRE
LOT 1 ET LOT 2** (en-tête et §12), appuyé sur `gate-04A-decision-ep17-lot2.md` et
`gate-02A-decision-ep17-lot2.md` (GO sous réserve, Lot 2, tous deux 2026-08-01). Le verrou
`CLAUDE.md` « Aucun code applicatif sans Plan d'Exécution approuvé » est donc levé **pour le Lot 2
également** — inchangé pour les Lots 3 à 6.

**Ce que cette extension ne lève pas** : les réserves continues du Gate 04A Lot 2 (6 contrôles
`CHECK-UX-01`/1 `CHECK-FRONTEND-01` encore « Non exécuté », preuves à produire au fil du Lot 2) ;
`DD-611-02`, `DD-611-03`, `DD-EP17-04`, `DD-EP17-05` (focus-trap `lt-confirm-dialog`) et
`DD-EP17-06`, tous ouverts ; le périmètre strict du Lot 2 lui-même (composants développés et
testés isolément, aucune intégration à un écran métier — toute anticipation sur ce point
invaliderait les deux Gates).

**Effet** : le développement technique du Lot 2 (`lt-page-header`, `lt-stat-card`,
`lt-status-tag`, `lt-empty-state`, `lt-data-table`, `lt-confirm-dialog`, `lt-form-field`, service
Toast) peut démarrer.

**Documents modifiés** : `plan-execution-ux-ui-primeng-keycloak.md` (en-tête, §3 Lot 2, §12 —
nouvelle entrée datée).

**Prochaine action autorisée** : le développement du Lot 2 peut être instruit, composant par
composant, sous réserve continue des preuves de test/implémentation attendues par le Gate 04A
Lot 2.

### US-132 démarrée — Composants transverses (2026-08-01)

**Instruction explicite reçue** : « Start US-132 ». Unique User Story du Lot 2
(`addendum-backlog-ep17-ui-foundation-primeng-keycloak.md`, 8 points).

**8 composants + 1 service implémentés, isolément** (`frontend/src/app/shared/{page-header,
stat-card,status-tag,empty-state,form-field,data-table,confirm-dialog,toast}/`) : `lt-page-header`,
`lt-stat-card`, `lt-status-tag` (+ `severityForStatut()`, vocabulaire paiements/alertes déjà
vérifié dans le code), `lt-empty-state`, `lt-form-field` (association label/erreur/aide via
`exportAs`), `lt-data-table` (états vide/erreur, sans tri/filtre/pagination — aucun besoin ≥ 2
écrans confirmé), `lt-confirm-dialog` + `LtConfirmDialogService`, `lt-toast` +
`LtToastService`. Aucun composant intégré à un écran métier (« sans intégration dans un écran
métier existant », Plan d'Exécution §3 Lot 2).

**Constat de test notable — `lt-confirm-dialog` (`DDS-LT-005`)** : `DDS-LT-005` supposait que
`p-confirmdialog` (PrimeNG) gérait nativement le focus-trap **et** la restitution du focus au
déclencheur. Un test réel en navigateur (Chrome Headless, pas une simulation) a confirmé le
focus-trap natif mais montré que **la restitution du focus n'est pas native** — sans intervention,
le focus retombe sur `<body>` à la fermeture. Corrigé explicitement dans `ConfirmDialogComponent`
(capture du déclencheur dans `LtConfirmDialogService.confirm()`, restitution sur `(onHide)`),
revérifié par test. C'est exactement le type d'écart qu'un test réel (plutôt qu'une confiance dans
la documentation de la librairie) est censé détecter — la revue mérite d'être signalée telle
quelle plutôt que silencieusement corrigée sans trace.

**Vérification** : 133/133 tests (100 existants + 33 nouveaux), `ng lint` propre (règle
`@angular-eslint/component-selector` étendue pour accepter le préfixe `lt-` en plus de `app-`,
conforme à `DSG-001.md` §Naming Convention), `ng build` réussi (`514,30 kB`, stable — les
composants non intégrés sont exclus du bundle par tree-shaking, aucune régression de budget).

**Documents modifiés** : `frontend/src/app/shared/{page-header,stat-card,status-tag,empty-state,
form-field,data-table,confirm-dialog,toast}/*.ts` (nouveaux) ; `frontend/eslint.config.js`
(préfixe `lt-` autorisé) ; `DSG-001.md` (§Composants LoyerTracker candidats, §Component Mapping
(Angular), statut Gouvernance).

**Ce que cette implémentation n'autorise pas** : aucun écran métier n'est migré, aucun composant
n'est adopté dans le code applicatif existant (relève des Lots 3+, écran par écran).

**Prochaine action autorisée** : le Product Owner peut valider `US-132` ; avec elle, le Lot 2 est
fonctionnellement terminé (8/8 points). La prochaine étape structurante est une nouvelle
instruction de Gate pour le Lot 3 (Pilote Angular — premiers écrans métier réels), conformément à
« chaque lot reste un point de contrôle GO/NO GO distinct ».

### Correctif CI — Quality Gate SonarQube, PR #338/US-132 (2026-08-02)

**Constat** : le check requis `Frontend (build + tests)` de la PR #338
(`feat/us-132-composants-transverses`) échouait — build Angular et 133/133 tests au vert, mais le
scanner SonarQube retournait `QUALITY GATE STATUS: FAILED` (exit code 3). Vérification directe sur
l'instance réelle `sonar.loyerpro.org` (`sonarqube-instance-et-prevalidation`, pré-validation des
Quality Gates) : la condition `new_violations > 0` était en défaut (1 violation), couverture
(97,9 %) et duplication (0,0 %) conformes. Sur les 15 issues remontées en période de référence
(leak period depuis 2026-07-03), une seule datait de ce commit (`d9cbbda`) — les 14 autres,
antérieures, sont hors périmètre du Quality Gate en new-code.

**Violation bloquante** : `typescript:S3358` (MAJOR, « Extract this nested ternary operation into
an independent statement ») dans `lt-form-field`
(`frontend/src/app/shared/form-field/form-field.component.ts:66`), composant livré par `US-132`.

**Correctif appliqué** : `describedBy` réécrit avec un `if`/`return` explicite au lieu du ternaire
imbriqué, comportement strictement identique (priorité erreur > aide > rien). Vérifié par test réel
(133/133 tests, dont les 6 tests dédiés `lt-form-field`), `ng build` (bundle stable, `514,30 kB`),
`npx eslint` propre. Commit `26d384f` poussé sur `feat/us-132-composants-transverses`.

**Vérification post-push** : les 11 checks requis de la PR #338 sont `pass` (Frontend, Backend,
CodeQL java-kotlin/javascript-typescript, Sécurité gitleaks/SCA/Trivy, structural-audit,
Quarantaine GHCR, Détection changements images, Build/scan/SBOM Docker) ; `Publication, signatures
et attestations` en `skipping` (normal hors merge/tag).

**Documents modifiés** : `frontend/src/app/shared/form-field/form-field.component.ts` (correctif
ciblé, aucun autre fichier ni composant concerné).

**Prochaine action autorisée** : inchangée — le Product Owner peut valider `US-132`, désormais avec
CI intégralement verte sur la PR #338.

### Décision Product Owner — US-132 GO sous réserve, Lot 2 clos fonctionnellement (2026-08-02)

**Décision Product Owner explicite** : « GO sous réserve ». Rendue sur la base de la CI
intégralement verte de la PR #338 (`Frontend`, `Backend`, `CodeQL` java-kotlin/javascript-typescript,
`Sécurité` gitleaks/SCA/Trivy, `structural-audit`, `Build/scan/SBOM Docker`, `Quarantaine GHCR`,
`Détection changements images`), après correctif du Quality Gate SonarQube (commit `26d384f`,
`S3358` sur `lt-form-field`).

**Portée** : validation de `US-132` (8 composants transverses + service Toast, Lot 2 EP-17),
développés et testés isolément, sans intégration à un écran métier — cohérent avec le périmètre
strict autorisé par `gate-04A-decision-ep17-lot2.md` et `gate-02A-decision-ep17-lot2.md`
(GO sous réserve, 2026-08-01).

**Réserves continues (non neutralisées par cette validation)** : les 6 contrôles `CHECK-UX-01` et
1 `CHECK-FRONTEND-01` restés « Non exécuté » doivent toujours produire leurs preuves
d'implémentation au fil des Lots suivants — non substituables par de la documentation.
`DD-611-02`, `DD-611-03`, `DD-EP17-04`, `DD-EP17-05` (focus-trap/restitution de focus
`lt-confirm-dialog`) et `DD-EP17-06` (spacing, partiellement traité) restent ouverts.

**Effet** : `US-132` est validée sous réserve. Le Lot 2 (Composants transverses) est désormais
**fonctionnellement terminé et validé** (8/8 points), conformément à « chaque lot reste un point de
contrôle GO/NO GO distinct ».

**Ce que cette validation n'autorise pas** : aucune intégration de composant `lt-*` dans un écran
métier existant — relève d'une nouvelle instruction de Gate pour le Lot 3, distincte de celle-ci.

**Prochaine action autorisée** : une nouvelle instruction de Gate (04A/02A) peut être émise pour le
Lot 3 (Pilote Angular — premiers écrans métier réels), conformément au principe déjà appliqué aux
Lots 1 et 2.

### Nouvelle instruction Gate 04A/Gate 02A — Lot 3 (2026-08-02) — décision Product Owner attendue

**Instruction explicite reçue** : « Instruire le Gate 04A/02A pour le Lot 3 ». Le Lot 2 étant
livré et validé (`US-132`, GO sous réserve, 2026-08-02), deux nouvelles instances sont produites
pour le périmètre Lot 3 (Pilote Angular, `US-133`/`US-134`, 13 points) —
`gate-04A-decision-ep17-lot3.md` et `gate-02A-decision-ep17-lot3.md`.

**Mises à jour de cohérence apportées avant instruction** (reflètent l'évidence Lot 2 réellement
livrée) :
* `CHECK-UX-01-ep17-ui-foundation.md` : 2 contrôles reclassés PASS (Composants et variantes, États
  erreur/vide/chargement), 1 reclassé Préparation en cours (Accessibilité — test réel sur
  `lt-confirm-dialog`, 5/6 exigences `DDS-LT-005`). Recompte : 4 PASS, 6 Préparation en cours,
  3 Non exécuté (2 bloquants : Responsive, Cohérence multi-écrans — sur 13).
* `CHECK-FRONTEND-01-ep17-ui-foundation.md` : dernier contrôle Non exécuté reclassé Préparation en
  cours (tests composant/a11y réels obtenus, volet responsive toujours absent). Recompte : 2 PASS,
  6 Préparation en cours, 0 Non exécuté (sur 8).
* `design-debt-register-loyertracker.md` : `DD-EP17-04` (lt-data-table livré, non adopté) et
  `DD-EP17-05` (test dédié exécuté, 5/6 exigences, aucun dialogue encore en Production) marqués
  « Partiellement traité ». Tous deux restent Ouverts.

**Différence structurelle avec les instances Lot 1/Lot 2** : le Lot 3 introduit le **premier écran
métier réel** du périmètre EP-17 (`BailleurDashboardComponent`, données financières affichées).
Contrairement aux instances précédentes, la majorité des critères Gate 02A ne peuvent plus être
jugés « sans matière nouvelle » :
* `gate-04A-decision-ep17-lot3.md` : les 2 derniers contrôles bloquants `CHECK-UX-01` (Responsive,
  Cohérence multi-écrans) restent structurellement liés à l'exécution du Lot 3 — même
  raisonnement qu'aux Lots précédents. Avis Design/Frontend Architect proposé : **GO sous réserve
  stricte**, migration section par section (pas de migration globale en un seul changement).
  Applicabilité `CHECK-FIN-01` (Financial Governance) examinée : jugée non applicable pour une
  migration de pure présentation, sous condition explicite d'invalidation si le périmètre touche
  un jour le calcul/l'arrondi/la devise.
* `gate-02A-decision-ep17-lot3.md` : sur les 11 critères, 4 portent une **lacune réelle** pour ce
  périmètre (parcours utilisateurs CRUD biens/patrimoines/baux non documentés, cas nominaux/erreur
  non mappés au réel, et surtout **aucune maquette** des sections à migrer). Avis UX/UI Design Lead
  proposé : **NO GO en l'état** — recommande confirmation du périmètre, production d'au moins une
  maquette basse fidélité par section et d'un parcours écrit avant toute instruction
  complémentaire.
* **Bloqueur partagé aux deux instances, distinct de la décision de Gate elle-même** : la
  confirmation par le Product Owner du périmètre exact du pilote reste non obtenue — dépendance
  déjà explicite dans `US-133` et `plan-execution-ux-ui-primeng-keycloak.md` §3 (« le pilote exact
  doit être confirmé … avant exécution »). Sans cette confirmation, ni maquette ni parcours ciblé
  ne peuvent être produits.

**Documents modifiés** : `gate-04A-decision-ep17-lot3.md`, `gate-02A-decision-ep17-lot3.md`
(nouveaux, §6 volontairement laissée vide) ; `CHECK-UX-01-ep17-ui-foundation.md`,
`CHECK-FRONTEND-01-ep17-ui-foundation.md`, `design-debt-register-loyertracker.md` (notes de mise à
jour 2026-08-02) ; `plan-execution-ux-ui-primeng-keycloak.md` §3 Lot 3 (note ajoutée référençant
les deux instances).

**Prochaine action autorisée** : le Product Owner statue sur `gate-04A-decision-ep17-lot3.md` §6 et
`gate-02A-decision-ep17-lot3.md` §6 (GO / GO sous réserve / NO GO). Compte tenu de l'avis NO GO en
l'état du Gate 02A, une décision distincte et préalable est recommandée : confirmer le périmètre
exact du pilote (sections du dashboard Bailleur concernées, inclusion ou non d'`US-134`), condition
nécessaire avant que les lacunes identifiées (maquettes, parcours) puissent être comblées. Aucun
développement du Lot 3 ne peut démarrer avant ces décisions, conformément au verrou `CLAUDE.md`.

### Confirmation Product Owner — périmètre du pilote Lot 3 (2026-08-02)

**Décision Product Owner explicite** : « Sections limitées, à faible risque d'abord » — périmètre
retenu proposé par Claude Code (option recommandée, cohérente avec l'avis Design/Frontend Architect
`gate-04A-decision-ep17-lot3.md` §5 et l'avis UX/UI Design Lead `gate-02A-decision-ep17-lot3.md` §5).

**Périmètre confirmé** : section **Patrimoines/Biens** du dashboard Bailleur uniquement — `US-134`
(liste + détail d'un bien via `lt-data-table`/`lt-form-field`, lecture principalement) et `US-133`
restreinte à cette même section. **Explicitement hors périmètre de ce Lot 3** : Affectations,
Paiements, Garanties, Honoraires, Alertes, Journal d'audit — ces sections restent en l'état,
migration différée à un Lot ultérieur, chacun son propre point de contrôle Gate.

**Effet sur les deux instances de Gate** : le bloqueur « périmètre exact du pilote non confirmé »
est levé dans `gate-04A-decision-ep17-lot3.md` §4 et `gate-02A-decision-ep17-lot3.md` §4. Le
périmètre restreint neutralise deux réserves devenues sans objet pour ce Lot : `DD-EP17-05`
(aucun dialogue modal prévu, lecture seule) et la réserve « données financières affichées »
(Patrimoines/Biens n'affiche pas de montants — loyers/paiements/garanties/honoraires restent dans
les sections différées). **Persiste une lacune réelle, désormais circonscrite à une seule
section** : aucune maquette ni parcours écrit n'existe encore pour Patrimoines/Biens — seul
blocage restant identifié par l'avis UX/UI Design Lead avant qu'un GO sous réserve devienne
directement défendable.

**Documents modifiés** : `addendum-backlog-ep17-ui-foundation-primeng-keycloak.md` (notes de
confirmation sous `US-133`/`US-134`) ; `gate-04A-decision-ep17-lot3.md` et
`gate-02A-decision-ep17-lot3.md` (§2/§3/§4/§5 mis à jour, §6 toujours volontairement vide).

**Prochaine action autorisée** : produire la maquette basse fidélité et le parcours écrit pour
Patrimoines/Biens (liste → détail) — dernier élément manquant avant que le Product Owner puisse
statuer sur `gate-02A-decision-ep17-lot3.md` §6 avec un avis UX/UI Design Lead favorable. En
parallèle, `gate-04A-decision-ep17-lot3.md` §6 reste ouvert à la décision du Product Owner
(GO sous réserve stricte déjà recommandé par les avis Design/Frontend Architect).

### Production de la maquette et du parcours écrit — Lot 3 Patrimoines/Biens (2026-08-02)

**Instruction explicite reçue** : « Produis-les » (maquette basse fidélité + parcours écrit pour
Patrimoines/Biens). Deux nouveaux documents produits, fondés sur une lecture directe du code réel
(`dashboard.component.ts`, Bailleur), pas sur une supposition : `phase-02-user-journeys-ep17-lot3.md`
(2 parcours : J-Lot3-1 Gérer mes biens, J-Lot3-2 Gérer mes patrimoines) et
`phase-02-ui-mockups-ep17-lot3.md` (wireframes texte — Biens et Patrimoines, états nominal/
sélection/vide/erreur, variante responsive, correspondance composants `lt-*`).

**Écart réel détecté en cours de production, signalé plutôt que corrigé silencieusement** : les
deux instances de Gate (`gate-04A-decision-ep17-lot3.md`, `gate-02A-decision-ep17-lot3.md`) et la
confirmation de périmètre précédente caractérisaient le pilote comme « lecture principalement »,
« aucune action destructive ». La lecture directe du code montre que la section Biens porte en
réalité un **CRUD complet** : formulaire de création/modification, et une action d'archivage réelle
(« Archiver ce bien »), déjà confirmée aujourd'hui par `globalThis.confirm()` natif du navigateur —
pas par `lt-confirm-dialog`. Le périmètre fonctionnel migré reste inchangé (aucune donnée
financière — vérifié sur le modèle réel `Bien`/`Patrimoine`, `s02-api.service.ts` — le loyer est un
attribut du `Bail`, hors périmètre) ; seule la caractérisation du risque était inexacte. C'est
exactement le type d'écart que la pratique déjà suivie pour `DDS-LT-005` (US-132) est censée
détecter — traité de la même manière : corrigé explicitement dans les deux instances de Gate (§3bis
ajoutée à `gate-02A-decision-ep17-lot3.md`), pas réécrit silencieusement.

**Décision de conception tranchée par ce document** : le mécanisme d'archivage (`confirm()` natif)
est **délibérément préservé tel quel** dans ce Lot — la migration porte sur la présentation
(liste → `lt-data-table`, formulaire → `lt-form-field`, statut → `lt-status-tag`), pas sur cette
logique. Migrer ce `confirm()` vers `lt-confirm-dialog` « en passant » sortirait du périmètre de
présentation pure et redeviendrait un cas d'usage réel de `DD-EP17-05` (premier dialogue modal en
Production) — à instruire séparément si souhaité, pas glissé dans cette migration.

**Dette nouvellement identifiée** : `DD-EP17-10` — absence d'état d'erreur explicite au chargement
des listes Biens/Patrimoines dans le code actuel (aucun état géré au-delà du succès et de la liste
vide). La migration introduit cet état via `lt-empty-state` (variante erreur, déjà livrée en
Lot 2) — une amélioration réelle, pas une simple reformulation visuelle, ajoutée au registre de
dette pour éviter qu'elle passe inaperçue dans la revue de `US-133`/`US-134`.

**Effet sur les Gates** : dans `gate-02A-decision-ep17-lot3.md`, les deux bloqueurs « maquettes
absentes » et « parcours utilisateurs absents » sont levés ; 7 des 11 critères passent PASS ou
disposent d'une matière réelle suffisante (contre 3 initialement). **Avis UX/UI Design Lead révisé
de NO GO en l'état à GO sous réserve** — réserve unique : validation Product Owner explicite des
deux documents produits, une production par Claude Code ne valant pas à elle seule validation
humaine indépendante. Dans `gate-04A-decision-ep17-lot3.md`, les avis Design/Frontend Architect
restent GO sous réserve stricte, avec la précision que le CRUD réel (pas une simple lecture) doit
être exercé section par section comme prévu, et que le mécanisme d'archivage natif reste hors
périmètre de migration.

**Documents modifiés** : `phase-02-user-journeys-ep17-lot3.md`, `phase-02-ui-mockups-ep17-lot3.md`
(nouveaux) ; `design-debt-register-loyertracker.md` (`DD-EP17-10` ajoutée, `DD-EP17-05` précisée) ;
`gate-04A-decision-ep17-lot3.md` et `gate-02A-decision-ep17-lot3.md` (§3/§3bis/§4/§5 mis à jour,
§6 toujours volontairement vide).

**Prochaine action autorisée** : le Product Owner peut désormais statuer sur
`gate-04A-decision-ep17-lot3.md` §6 et `gate-02A-decision-ep17-lot3.md` §6 — les deux avis
spécialisés recommandent un GO sous réserve (stricte pour le Gate 04A, sous réserve de validation
explicite des deux nouveaux documents pour le Gate 02A). Le développement du Lot 3 reste
subordonné à ces deux décisions, conformément au verrou `CLAUDE.md`.

### Décisions Gate 04A/Gate 02A rendues — GO sous réserve, périmètre Lot 3 (2026-08-02)

**Décision Product Owner explicite** : « GO sous réserve pour les deux Gates ». Section 6
complétée en conséquence dans `gate-04A-decision-ep17-lot3.md` et `gate-02A-decision-ep17-lot3.md`.
`gate-04A-decision-ep17-lot2.md` et `gate-02A-decision-ep17-lot2.md` (GO sous réserve, Lot 2)
restent non réécrites — préservation des décisions historiques (`CLAUDE.md`).

**Portée** : autorisation limitée à EP-17 Lot 3, section **Patrimoines/Biens** du dashboard
Bailleur uniquement (`US-133` restreinte + `US-134`, migration de présentation — liste vers
`lt-data-table`, formulaires vers `lt-form-field`, statut vers `lt-status-tag`). Ne couvre pas
Affectations, Paiements, Garanties, Honoraires, Alertes, Journal d'audit, ni le dashboard
Gestionnaire — nouvelle instruction de Gate requise pour toute extension de périmètre.

**Réserves continues (non neutralisées par ces décisions)** : les 2 contrôles bloquants
`CHECK-UX-01` restés « Non exécuté » (Responsive, Cohérence multi-écrans) doivent produire leurs
preuves au fil du Lot 3. `DD-611-02`, `DD-611-03`, `DD-EP17-04`, `DD-EP17-06` et `DD-EP17-10`
(nouvelle) restent ouverts. `DD-EP17-05` reste non pertinente pour ce périmètre tant que le
mécanisme d'archivage natif (`confirm()`) n'est pas migré vers `lt-confirm-dialog`.

**Ce que ce GO ne couvre pas** : l'approbation de l'extension du Plan d'Exécution au Lot 3
(`plan-execution-ux-ui-primeng-keycloak.md` §12, toujours limité aux Lots 1 et 2) — action Product
Owner distincte, préalable à tout développement effectif du Lot 3 (verrou `CLAUDE.md`).

**Prochaine action autorisée** : le Product Owner statue sur l'extension du Plan d'Exécution au
Lot 3. Le développement technique (section Patrimoines/Biens, `lt-data-table`/`lt-form-field`/
`lt-status-tag`/`lt-empty-state`) ne peut démarrer qu'après cette approbation, sous réserve
continue des preuves de test/implémentation ci-dessus, et exécution section par section (liste
avant formulaire).

### Plan d'Exécution étendu au Lot 3, périmètre restreint (2026-08-02)

**Instruction explicite reçue** : « Approuve l'extension du Plan d'Exécution au Lot 3 ».
`plan-execution-ux-ui-primeng-keycloak.md` mis à jour : statut **APPROUVÉ SOUS RÉSERVE — PÉRIMÈTRE
LOT 1, LOT 2 ET LOT 3 (RESTREINT)** (en-tête et §12), appuyé sur `gate-04A-decision-ep17-lot3.md`
et `gate-02A-decision-ep17-lot3.md` (GO sous réserve, Lot 3, tous deux 2026-08-02). Le verrou
`CLAUDE.md` « Aucun code applicatif sans Plan d'Exécution approuvé » est donc levé **pour le Lot 3
également**, strictement pour le périmètre confirmé (section Patrimoines/Biens) — inchangé pour les
Lots 4 à 6, le reste du dashboard Bailleur et le dashboard Gestionnaire.

**Ce que cette extension ne lève pas** : les réserves continues du Gate 04A Lot 3 (2 contrôles
`CHECK-UX-01` — Responsive, Cohérence multi-écrans — encore « Non exécuté », preuves à produire au
fil du Lot 3) ; `DD-611-02`, `DD-611-03`, `DD-EP17-04`, `DD-EP17-06` et `DD-EP17-10`, tous ouverts ;
`DD-EP17-05`, non pertinente tant que le mécanisme d'archivage natif (`confirm()`) n'est pas migré
vers `lt-confirm-dialog` — toute migration « en passant » de ce mécanisme sortirait de cette
approbation ; le périmètre strict du Lot 3 lui-même (section Patrimoines/Biens, migration de
présentation uniquement, sans toucher à la logique existante).

**Effet** : le développement technique du Lot 3 (section Patrimoines/Biens — `lt-data-table`,
`lt-form-field`, `lt-status-tag`, `lt-empty-state`) peut démarrer, section par section (liste avant
formulaire).

**Documents modifiés** : `plan-execution-ux-ui-primeng-keycloak.md` (en-tête, §12 — nouvelle entrée
datée).

**Prochaine action autorisée** : le développement du Lot 3 peut être instruit — en commençant par
la liste des Biens (`lt-data-table`), sous réserve continue des preuves de test/implémentation
attendues par le Gate 04A Lot 3.

### US-133/US-134 démarrées — liste des Biens migrée vers lt-data-table (2026-08-02)

**Instruction explicite reçue** : « commence par la liste des Biens (`lt-data-table`) ». Premier
écran métier réel migré du périmètre EP-17 Lot 3, strictement limité à ce que le Plan d'Exécution
autorise : `frontend/src/app/bailleur/dashboard/dashboard.component.ts`, panneau « Biens »
(adresse/type/statut, sélection d'un bien). Migration de présentation uniquement — inchangés :
formulaire de création/modification du bien, section Patrimoines, tous les autres panneaux
(baux, paiements, garanties, honoraires, affectations, exceptions, alertes, audit), et le
mécanisme d'archivage natif (`globalThis.confirm()`), conformément à
`gate-04A-decision-ep17-lot3.md` §5 (« liste avant formulaire », archivage hors périmètre).

**Extension de `lt-data-table`** (composant livré isolément par `US-132`, jamais adopté avant ce
jour) : besoin réel confirmé plutôt qu'anticipé, conformément à son propre commentaire
(« à étendre lors d'une migration écran réelle »). Deux ajouts, tous deux testés en navigateur réel
(Chrome Headless) : colonne `type: 'status'` (rendu via `lt-status-tag`/`severityForStatut()` au
lieu du texte brut) et ligne sélectionnable (`selectable`/`selectedRow`/`rowClick`, clic **et**
clavier — `role="button"`, `tabindex`, `Entrée`/`Espace` — pas de mécanisme de sélection PrimeNG
natif, géré par le template `#body` déjà propre au composant). `severityForStatut()` étendu au
vocabulaire `StatutBien` (`LIBRE`→success, `LOUE`→info, `EN_TRAVAUX`→warning, `ARCHIVE`→secondary),
conformément à son propre commentaire invitant cette extension au moment de chaque migration réelle.

**DD-EP17-10 (absence d'état d'erreur explicite)** : écart réel constaté et signalé plutôt que
corrigé silencieusement — la cible anticipée par `phase-02-ui-mockups-ep17-lot3.md` était
`lt-empty-state` (variante erreur) ; le mécanisme réellement livré dans `lt-data-table` depuis
`US-132` est un paragraphe dédié `role="alert"` (`error()`), jugé équivalent voire plus adapté
sémantiquement, pas réécrit pour coller à la cible initiale. Câblé pour Biens uniquement
(`biensErreur`, nouveau signal, alimenté par `chargerBiens()`) — Patrimoines reste hors périmètre
de cette étape.

**Vérification** : 140/140 tests (133 existants + 7 nouveaux — 4 `lt-data-table` isolé, 1
`severityForStatut` vocabulaire `StatutBien`, 2 intégration réelle dans `BailleurDashboardComponent`
via `HttpTestingController`, dont un test de clic réel sur une ligne rendue et un test de l'état
d'erreur), `ng lint` propre (aucune règle nouvelle nécessaire), `ng build` réussi (bundle initial
516,00 kB, stable sous le budget `1mb`/`2.5mb` ; `p-table`/`lt-status-tag` désormais tirés dans le
chunk paresseux `dashboard-component`, pas dans le bundle initial).

**Documents modifiés** : `frontend/src/app/bailleur/dashboard/dashboard.component.ts` (panneau
Biens, signal `biensErreur`, helper `erreurDetail()` extrait de `signalerErreur()`, nettoyage CSS
mort `.list`/`.row`/`.selected`) ; `frontend/src/app/shared/data-table/data-table.component.ts`
(+spec) ; `frontend/src/app/shared/status-tag/status-tag.component.ts` (+spec) ;
`design-debt-register-loyertracker.md` (`DD-EP17-04`, `DD-EP17-10` mis à jour).

**Ce que cette implémentation n'autorise pas** : aucune extension au-delà de la liste des Biens —
le formulaire Biens, la section Patrimoines (liste et formulaire) et le reste du dashboard
Gestionnaire relèvent d'étapes distinctes du même Lot 3 ou d'un Lot ultérieur.

**Prochaine action autorisée** : poursuivre le Lot 3 section par section — étape suivante logique
la liste des Patrimoines (même patron `lt-data-table`), puis le formulaire Bien vers
`lt-form-field`, sous réserve continue des preuves attendues par le Gate 04A Lot 3 (Responsive,
Cohérence multi-écrans, toujours « Non exécuté »).

### Liste des Patrimoines migrée vers lt-data-table (2026-08-02)

**Instruction explicite reçue** : « enchaîner sur la liste des Patrimoines (prochaine étape du
Plan d'Exécution) ». Deuxième écran métier réel migré du périmètre EP-17 Lot 3, strictement limité
à ce que le Plan d'Exécution autorise : `frontend/src/app/bailleur/dashboard/dashboard.component.ts`,
panneau « Patrimoines » (nom/adresse/statut). Migration de présentation uniquement — inchangés :
formulaire de modification du patrimoine (`patrimoineForm`, sélecteur `<select>` de patrimoine à
modifier), sélection d'un bien, panneau Biens (étape précédente), et tous les autres panneaux du
dashboard.

**Différence délibérée avec la migration Biens** : contrairement à la liste des Biens, la liste des
Patrimoines n'a **pas** reçu `selectable`/`rowClick`. Avant cette migration, la liste des
Patrimoines était un affichage pur, sans aucune interaction (la sélection du patrimoine à modifier
se fait exclusivement via le `<select>` du formulaire « Modifier un patrimoine », `#patModifSel` /
`selectionnerPatrimoineModif()`, inchangé). Ajouter la sélection au clic aurait introduit une
interaction nouvelle, hors du principe « migration de présentation uniquement » rappelé par
`phase-02-ui-mockups-ep17-lot3.md` §Niveau de fidélité — écart délibéré par rapport à la maquette
(qui montre un état « ▶ sélectionné » dans la liste), signalé plutôt que reproduit sans réflexion.

**Écart de densité d'information (maquette vs livré)** : la maquette (`phase-02-ui-mockups-ep17-lot3.md`
§2.1) montre nom, adresse, ville/pays concaténés, référence interne et statut sur plusieurs lignes
par carte. `lt-data-table` ne rend qu'un champ texte brut par colonne (pas de concaténation ni de
template par colonne dans cette version, cf. `LtDataTableColumn`). Colonnes retenues : nom, adresse,
statut (`type: 'status'`) — même arbitrage que Biens (adresse/type/statut). Ville, pays et référence
interne, auparavant affichés en texte secondaire, ne sont plus visibles dans la liste. Aucune de ces
données n'est perdue (toujours consultables via le formulaire de modification) ; signalé ici comme
écart réel plutôt que reconcilié silencieusement.

**DD-EP17-10 (absence d'état d'erreur explicite)** : la deuxième moitié de cette dette — Patrimoines
— est désormais câblée. `chargerReferentielsBien()` (la méthode nommément citée par le constat
initial de la dette) gère maintenant l'échec de `listerPatrimoines()` via un nouveau signal
`patrimoinesErreur`, rendu par le même mécanisme `role="alert"` que Biens (`lt-data-table`, pas
`lt-empty-state` — même écart déjà signalé pour Biens, cf. entrée précédente).

**Vocabulaire `severityForStatut()`** étendu à `StatutPatrimoine` (`ACTIF`→success, `ARCHIVE`→
secondary, déjà mappé par `StatutBien`).

**Vérification** : 143/143 tests (140 existants + 3 nouveaux — 1 `severityForStatut` vocabulaire
`StatutPatrimoine`, 2 intégration réelle dans `BailleurDashboardComponent` via
`HttpTestingController`, dont un test de rendu nom/adresse/statut et un test de l'état d'erreur au
rechargement), `ng lint` propre, `ng build` réussi (bundle initial stable à 516,00 kB, aucune
régression de budget).

**Documents modifiés** : `frontend/src/app/bailleur/dashboard/dashboard.component.ts` (panneau
Patrimoines, signal `patrimoinesErreur`, colonnes `colonnesPatrimoines`, gestion d'erreur dans
`chargerReferentielsBien()`) ; `frontend/src/app/shared/status-tag/status-tag.component.ts` (+spec,
vocabulaire `StatutPatrimoine`) ; `design-debt-register-loyertracker.md` (`DD-EP17-04`, `DD-EP17-10`
mis à jour) ; `DSG-001.md` (adoption étendue, compteurs de tests).

**Ce que cette implémentation n'autorise pas** : aucune extension au-delà de la liste des
Patrimoines — le formulaire Patrimoine (`lt-form-field`), le formulaire Bien et le reste du
dashboard Gestionnaire relèvent d'étapes distinctes du même Lot 3 ou d'un Lot ultérieur.

**Prochaine action autorisée** : poursuivre le Lot 3 — étape suivante logique le formulaire Bien
vers `lt-form-field` (liste avant formulaire déjà respecté pour Biens et Patrimoines), sous réserve
continue des preuves attendues par le Gate 04A Lot 3 (Responsive, Cohérence multi-écrans, toujours
« Non exécuté »).

### PR #338 fusionnée sur main ; formulaire Bien migré vers lt-form-field (2026-08-02)

**Instruction explicite reçue** : « merge et ensuite, enchaîne sur le formulaire Bien vers
lt-form-field ». PR #338 (US-132 + Lot 3 Biens/Patrimoines) fusionnée sur `main` par merge commit
standard (`gh pr merge 338 --merge`, cohérent avec l'historique des PR #333-#337), CI entièrement
verte avant fusion. Nouvelle branche `feat/ep17-lot3-bien-form` créée à partir de `main` à jour pour
cette étape.

**Migration** : les 4 champs du formulaire Bien (Adresse, Type, Patrimoine, Statut,
`dashboard.component.ts`, panneau « Nouveau bien »/« Modifier le bien ») enveloppés dans
`lt-form-field` (label + contrôle projeté), chaque contrôle relié à son `lt-form-field` via
`#f="ltFormField"` et `[attr.aria-describedby]="f.describedBy()"`, conformément à l'usage documenté
du composant. Migration de présentation uniquement — aucun message d'erreur de validation introduit
(aucun n'existait avant, cohérent avec `phase-02-ui-mockups-ep17-lot3.md` §1 qui ne montre que
label + contrôle), logique du formulaire (`bienForm`, `enregistrerBien()`, `reinitialiserBien()`)
inchangée.

**Premier écran réel pour `lt-form-field`** (composant livré isolément par `US-132`, jamais adopté
avant ce jour) : correctif apporté à cette occasion — `:host { display: block; }` ajouté au
composant partagé (`form-field.component.ts`), l'élément custom sans `display` explicite restant
`inline` par défaut, incorrect pour un conteneur de champ empilé verticalement ; correctif
générique bénéficiant à tout futur appelant, pas spécifique à cet écran. Espacement vertical entre
champs restauré via une règle `lt-form-field { margin-bottom: 0.75rem }` scoping local au
dashboard (équivalent à l'ancien `label { margin-bottom: 0.75rem }`, qui reste par ailleurs
inchangé et continue de s'appliquer aux formulaires non encore migrés du même composant).

**Vérification** : 144/144 tests (143 existants + 1 nouveau — rendu des 4 `lt-form-field` avec
label associé par `for`/`id`, `BailleurDashboardComponent`), `ng lint` propre, `ng build` réussi
(bundle initial stable à 516,00 kB).

**Documents modifiés** : `frontend/src/app/bailleur/dashboard/dashboard.component.ts` (panneau
formulaire Bien, import `FormFieldComponent`, CSS `lt-form-field { margin-bottom }`) ;
`frontend/src/app/shared/form-field/form-field.component.ts` (`:host { display: block }`) ;
`DSG-001.md` (adoption `lt-form-field`, compteurs de tests, statut Lot 3).

**Ce que cette implémentation n'autorise pas** : aucune extension au-delà du formulaire Bien — le
formulaire Patrimoine (`patrimoineForm`) et le reste du dashboard Gestionnaire relèvent d'étapes
distinctes du même Lot 3 ou d'un Lot ultérieur.

**Prochaine action autorisée** : le Product Owner statue sur la suite du Lot 3 — candidat naturel
le formulaire Patrimoine vers `lt-form-field` (même patron que le formulaire Bien), sous réserve
continue des preuves attendues par le Gate 04A Lot 3 (Responsive, Cohérence multi-écrans, toujours
« Non exécuté »).

### PR #339 fusionnée sur main ; formulaire Patrimoine migré vers lt-form-field (2026-08-02)

**Instruction explicite reçue** : « merge et enchaîne sur le formulaire Patrimoine ». PR #339
(formulaire Bien) fusionnée sur `main` par merge commit standard, CI entièrement verte avant
fusion. Nouvelle branche `feat/ep17-lot3-patrimoine-form` créée à partir de `main` à jour.

**Migration** : les 10 contrôles du panneau « Modifier un patrimoine »
(`dashboard.component.ts`) enveloppés dans `lt-form-field` — le sélecteur de patrimoine à modifier
(hors `patrimoineForm`, template ref `#patModifSel`, toujours visible) puis les 9 champs du
formulaire détaillé affichés seulement après sélection (Nom, Adresse, Ville, Commune, Quartier,
Province/État, Pays, Référence interne, Description — ce dernier un `<textarea>`, première
projection non-`<input>`/`<select>` dans `lt-form-field`, fonctionne sans adaptation, la
projection de contenu étant agnostique au type de contrôle). Même patron que le formulaire Bien :
`#f="ltFormField"` + `[attr.aria-describedby]="f.describedBy()"` sur chaque contrôle. Migration de
présentation uniquement — logique inchangée (`patrimoineForm`, `selectionnerPatrimoineModif()`,
`modifierPatrimoine()`), aucun message d'erreur de validation introduit.

**Vérification** : 146/146 tests (144 existants + 2 nouveaux — rendu du sélecteur avant sélection
et rendu des 9 champs détaillés après sélection, `BailleurDashboardComponent`). Le test
d'intégration du formulaire Bien (ajouté par la PR #339) a dû être corrigé au passage : il
comptait `querySelectorAll('lt-form-field')` sur tout le composant (4 avant cette migration), ce
qui aurait cassé avec l'ajout du sélecteur Patrimoine (5 au total) — corrigé pour cibler chaque
champ par son `id` puis `.closest('lt-form-field')`, robuste à l'ajout d'autres formulaires
migrés. `ng lint` propre, `ng build` réussi (bundle initial stable à 516,00 kB).

**Documents modifiés** : `frontend/src/app/bailleur/dashboard/dashboard.component.ts` (panneau
formulaire Patrimoine) ; `frontend/src/app/bailleur/dashboard/dashboard.component.spec.ts`
(nouveaux tests + correction du test Bien existant) ; `DSG-001.md` (adoption étendue `lt-form-field`,
compteurs de tests, statut Lot 3).

**Ce que cette implémentation n'autorise pas** : aucune extension au-delà du formulaire
Patrimoine — le reste du dashboard Gestionnaire relève d'un Lot ultérieur. Les quatre écrans
autorisés par le périmètre restreint du Lot 3 (liste Biens, liste Patrimoines, formulaire Bien,
formulaire Patrimoine) sont désormais tous migrés.

**Prochaine action autorisée** : le Product Owner statue sur la suite — le périmètre restreint du
Lot 3 (Patrimoines/Biens) étant maintenant intégralement couvert, toute extension (autres
sections du dashboard Bailleur, dashboard Gestionnaire, ou Lots 4-6) nécessite une nouvelle
instruction de Gate 04A/02A, conformément à `gate-04A-decision-ep17-lot3.md` §5 et au principe
« aucun code applicatif sans Plan d'Exécution approuvé » (`CLAUDE.md`). Les 2 contrôles
`CHECK-UX-01` (Responsive, Cohérence multi-écrans) restent « Non exécuté » et devront produire
leurs preuves avant toute clôture du Lot 3.

### PR #340 fusionnée sur main ; preuves CHECK-UX-01 Responsive/Cohérence multi-écrans produites (2026-08-02)

**Instruction explicite reçue** : « merge la PR #340 et continue avec le plan d'exécution comme
approuvé ». PR #340 (formulaire Patrimoine) fusionnée sur `main` par merge commit standard, CI
verte avant fusion. **Clarification de gouvernance signalée avant d'agir** : le Plan d'Exécution
(`plan-execution-ux-ui-primeng-keycloak.md` §12) est approuvé strictement pour Lot 1, Lot 2 et
Lot 3 (restreint) — désormais entièrement livré (4/4 écrans). Les Lots 4-6 ne sont pas approuvés ;
aucune extension de code applicatif n'était donc « comme approuvée » à ce stade. Question posée au
Product Owner : réponse obtenue — produire les preuves `CHECK-UX-01` restantes (Responsive,
Cohérence multi-écrans), travail de vérification sur l'existant, pas un nouveau périmètre
applicatif.

**Méthode de vérification** : navigateur réel (Chrome Headless, `google-chrome --headless=new`),
captures d'écran et mesures `getBoundingClientRect()`/`getComputedStyle()` — pas une simulation ni
une lecture de code seule. Le dashboard Bailleur exigeant une session Keycloak authentifiée non
disponible dans cet environnement, la vérification du comportement CSS (grille, ordre, tailles) a
été conduite sur une reproduction isolée exacte des règles CSS réelles du composant (mêmes
sélecteurs, mêmes valeurs), puis le correctif retenu a été appliqué et re-testé de la même façon
avant d'être reporté dans le composant réel ; complétée par un test d'intégration
`getComputedStyle()` exécuté directement sur `BailleurDashboardComponent` en Chrome Headless réel
(pas la reproduction isolée) pour la mesure de touch target.

**Constats (Responsive)** : 2 écarts réels détectés, tous deux pré-existants (non introduits par
les migrations `lt-*` de cette session) :
* Ordre mobile liste/formulaire — sous 640px, la grille `.two` empilait le formulaire **avant** la
  liste, contredisant `phase-02-ui-mockups-ep17-lot3.md` §3 (« la liste passe avant le formulaire
  en mobile »). Corrigé par `order: 1` sur `form.panel`, scopé à une nouvelle classe
  `.mobile-list-first` posée uniquement sur les sections Biens et Patrimoines — **pas** sur les 6
  autres sections `.grid.two` du même composant (baux, garanties, honoraires, affectations,
  exceptions), hors périmètre Lot 3, intentionnellement non touchées.
* Touch targets `input`/`select` mesurés à 33-35px, sous la cible `≥ 44×44px` de `DSG-001.md`
  §Responsive Rules. Corrigé par `min-height: 44px` (le reset global `box-sizing: border-box`
  suffit, `_reset.scss`, aucun changement de `padding` nécessaire).
* Touch target `button` (composant global, `_button.scss`) — même écart mesuré, **non corrigé** :
  blast radius produit entier (tous écrans), hors périmètre Lot 3 restreint. Signalé plutôt que
  corrigé silencieusement ou ignoré — nouvelle dette `DD-EP17-11`.

**Constats (Cohérence multi-écrans)** : audit de code des 4 écrans migrés confirme un usage
cohérent des composants `lt-*` (même patron colonnes `lt-data-table`/`lt-status-tag`, même patron
`lt-form-field`/`aria-describedby` y compris sur un `<textarea>`, même mécanisme d'erreur
`role="alert"`) — cohérence confirmée pour le périmètre des 4 écrans migrés, pas pour le produit
entier (sections non migrées suivies par `DD-EP17-04`).

**CHECK-UX-01** (`CHECK-UX-01-ep17-ui-foundation.md`, nouvelle note datée) : Responsive reclassé
**PASS sous réserve** (preuve réelle, résidu `DD-EP17-11`) ; Cohérence multi-écrans reclassé
**PASS** (scopé aux 4 écrans Lot 3). Décompte global recalculé : 5 PASS, 1 PASS sous réserve,
5 Préparation en cours, 1 Non exécuté (Performance UX/perçue, non bloquant). Conformément à
`CLAUDE.md` (« aucun audit automatique ne remplace la validation humaine requise »), ce constat
n'emporte pas de lui-même la clôture du Gate 04A Lot 3 — validation humaine (Design Architect
désigné et/ou Product Owner) requise pour transformer la preuve en clôture formelle.

**Vérification** : 148/148 tests (146 existants + 2 nouveaux — garde de régression sur le
périmètre exact de `.mobile-list-first`, mesure `getComputedStyle()` du touch target),
`ng lint` propre, `ng build` réussi (bundle initial stable à 516,00 kB).

**Documents modifiés** : `frontend/src/app/bailleur/dashboard/dashboard.component.ts` (classe
`.mobile-list-first`, règle `order` en media query, `min-height: 44px`) ;
`frontend/src/app/bailleur/dashboard/dashboard.component.spec.ts` (2 nouveaux tests) ;
`CHECK-UX-01-ep17-ui-foundation.md` (note datée) ; `design-debt-register-loyertracker.md`
(nouvelle dette `DD-EP17-11`).

**Ce que cette implémentation n'autorise pas** : aucune extension de périmètre applicatif — les
correctifs restent strictement des corrections de présentation sur les 4 écrans déjà autorisés du
Lot 3 restreint, pas une nouvelle fonctionnalité. `DD-EP17-11` (touch target `button` global)
reste ouverte, correction hors périmètre.

**Prochaine action autorisée** : le Product Owner (et/ou un Design Architect désigné) statue sur
la validation humaine de ces preuves pour clore formellement le Gate 04A Lot 3. Au-delà, toute
poursuite (Lots 4-6, ou correction de `DD-EP17-11`) nécessite sa propre instruction de Gate,
conformément au principe rappelé dans l'entrée précédente.

### PR #341 fusionnée sur main ; validation Product Owner du Gate 04A Lot 3 (2026-08-02)

**Instruction explicite reçue** : « je valide » — en réponse directe à la présentation du constat
`CHECK-UX-01` (CI verte PR #341, écarts trouvés et corrigés, résidu `DD-EP17-11` signalé). PR #341
fusionnée sur `main` par merge commit standard, CI entièrement verte avant fusion.

**Effet** : conformément à `CLAUDE.md` (« aucun audit automatique ne remplace la validation
humaine requise »), cette validation Product Owner constitue la validation humaine requise pour
transformer la preuve technique produite en clôture effective. Le bloqueur structurel
`gate-04A-decision-ep17-lot3.md` §4 (« composants `lt-*` non intégrés à un écran réel ») est
**Levé (2026-08-02)** — note ajoutée à cette décision (§8), sans réécrire le contenu d'origine
(préservation des décisions historiques).

**Ce que cette validation ne couvre pas** : `DD-EP17-11` (touch target `button` global) reste
ouverte, hors périmètre Lot 3 ; `DD-611-02`, `DD-611-03`, `DD-EP17-04`, `DD-EP17-06`, `DD-EP17-10`
restent ouvertes selon leur statut propre ; le Gate 04A **global** EP-17 (au-delà du Lot 3 seul)
reste NO GO en l'état (`CHECK-UX-01-ep17-ui-foundation.md` : 5 PASS, 1 PASS sous réserve,
5 Préparation en cours, 1 Non exécuté non bloquant) ; aucune autorisation pour les Lots 4-6, chacun
restant un point de contrôle GO/NO GO distinct nécessitant sa propre instruction de Gate.

**État du périmètre Lot 3 restreint (Patrimoines/Biens)** : entièrement livré et désormais validé
— liste Biens, liste Patrimoines, formulaire Bien, formulaire Patrimoine (PR #338-340), plus les 2
derniers contrôles bloquants `CHECK-UX-01` du Gate 04A Lot 3 (PR #341). Rien n'est en attente dans
ce périmètre.

**Documents modifiés** : `gate-04A-decision-ep17-lot3.md` (§8, note de clôture du bloqueur).

**Prochaine action autorisée** : aucune par défaut. Toute poursuite (Lots 4-6 du Plan d'Exécution,
correction de `DD-EP17-11`, ou extension à toute autre section du dashboard Bailleur/Gestionnaire)
nécessite une nouvelle instruction explicite du Product Owner et sa propre instruction de Gate
04A/02A, conformément à `plan-execution-ux-ui-primeng-keycloak.md` §12 et au principe « aucun code
applicatif sans Plan d'Exécution approuvé » (`CLAUDE.md`).

### Gate 04A/02A instruits — EP-17 Lot 4 (Pilote Keycloak) (2026-08-02)

**Instruction explicite reçue** : « Lot 4 » — en réponse à une clarification demandée sur lequel
des Lots 4/5/6 (chacun un point de contrôle GO/NO GO distinct, Plan d'Exécution §12) instruire en
premier.

`gate-04A-decision-ep17-lot4.md` et `gate-02A-decision-ep17-lot4.md` produits (avis Design
Architect, Frontend Architect, DevSecOps Lead, UX/UI Design Lead — §6 volontairement laissée non
renseignée, décision réservée au Product Owner). **Différence structurelle majeure avec les Lots
1-3** : le Lot 4 porte sur un thème Keycloak (FreeMarker + CSS statique), pas sur du Frontend
Angular — surface technique distincte, touchant une authentification déjà utilisée en Production
(`ADR-UI-001` §Isolation entre Angular et Keycloak).

**Constat factuel établi par lecture directe du dépôt** (pas d'implémentation) :
* Aucun thème Keycloak n'existe (`infra/keycloak/themes/` absent, aucune clé `theme`/`loginTheme`
  dans les 2 fichiers de realm).
* `DD-EP17-03` (source de tokens partagée Angular/Keycloak, Option A vs B) toujours non tranchée.
* Aucun rôle « Security Architect Keycloak » désigné (`agent-designations-loyertracker.md` : 4
  rôles actifs seulement), alors que `DD-EP17-01` en fait un responsable conjoint nommé.
* Usage réel de l'Account Console « Non constaté » (`screen-inventory-loyertracker.md`) — périmètre
  du thème `account/` à confirmer avant tout développement.
* Configuration SMTP absente des 2 fichiers de realm versionnés — question posée (pas une panne
  confirmée : peut être configurée hors dépôt) sur la pertinence de thémer « mot de passe
  oublié »/« invitation » avant confirmation opérationnelle.
* Compatibilité de version Keycloak par environnement (RSV-UI-08, `ADR-UI-001`) jamais vérifiée.
* `CHECK-FRONTEND-01` (gabarit conçu pour une architecture Angular) d'applicabilité douteuse à un
  thème FreeMarker — décision Product Owner requise plutôt que tranchée unilatéralement.
* Aucun user journey ni maquette produits pour les écrans Keycloak (login, mot de passe oublié,
  reset, invitation, invitation expirée, session expirée, accès refusé, logout).
* `plan-execution-ux-ui-primeng-keycloak.md` §12 n'inclut pas le Lot 4 dans son périmètre approuvé.

**Avis rendus** : Design Architect, Frontend Architect, DevSecOps Lead (Gate 04A) et UX/UI Design
Lead (Gate 02A) — **NO GO en l'état**, tous les quatre. Contrairement aux Lots 2/3 où les
fondations étaient déjà solides avant instruction, le Lot 4 part d'une page blanche technique et
d'un vide de gouvernance (rôle non désigné) — l'avis n'est pas un jugement sur un travail déjà
produit, mais le constat qu'aucune des conditions préalables (source de tokens, rôle sécurité,
périmètre exact, parcours/maquettes) n'est encore réunie.

**Documents produits** : `gate-04A-decision-ep17-lot4.md`, `gate-02A-decision-ep17-lot4.md`.

**Ce que cette instruction n'autorise pas** : aucun code de thème, aucune modification de realm,
aucune dépendance ajoutée — strictement documentaire, conformément au verrou `CLAUDE.md` (« aucun
code applicatif sans Plan d'Exécution approuvé »), a fortiori renforcé ici par l'avis NO GO en
l'état des quatre rôles désignés.

**Prochaine action autorisée** : le Product Owner statue en §6 de chacune des deux décisions. Vu
les avis NO GO en l'état, un GO ou GO sous réserve nécessiterait a minima : trancher `DD-EP17-03`
(Option A/B), désigner explicitement un responsable de la revue sécurité Keycloak, confirmer le
périmètre Account Console, et clarifier l'applicabilité de `CHECK-FRONTEND-01` — préalables à toute
production de parcours/maquettes ou de code de thème.

### 4 des 7 bloqueurs Lot 4 levés — recommandation validée (2026-08-02)

**Instruction explicite reçue** : « qu'elle la meilleur proposition que tu me fait pour trancher ? »
puis, après présentation d'une recommandation en 4 points, « je valide ta recommandation ».

**Décisions actées** :
1. `DD-EP17-03` (source de tokens Angular/Keycloak) — **Option B (CSS commun) confirmée**, conforme
   à la recommandation déjà documentée par `ADR-UI-001`. Dette non close (implémentation à
   produire).
2. Rôle de revue sécurité Keycloak — pas de nouveau rôle créé, **périmètre du DevSecOps Lead
   étendu explicitement** pour couvrir la revue sécurité du thème Keycloak (`DD-EP17-01`).
3. `CHECK-FRONTEND-01` — déclaré **non applicable** tel quel à un thème FreeMarker/CSS ; remplacé
   par une checklist allégée dédiée, à instancier au moment des preuves.
4. Account Console — **exclue du périmètre du Lot 4** (aucun usage réel constaté,
   `screen-inventory-loyertracker.md`) ; le périmètre se limite désormais au thème `login/` (8
   écrans : login, mot de passe oublié, reset, invitation, invitation expirée, session expirée,
   accès refusé, logout).

**Ce que ces décisions ne lèvent pas** : 3 bloqueurs restent ouverts —  compatibilité de version
Keycloak par environnement (non vérifiée), état réel de la configuration SMTP (absente des
fichiers de realm versionnés, à confirmer), et approbation du Plan d'Exécution pour le Lot 4 (§12
toujours limité aux Lots 1-3). L'absence de parcours utilisateurs et de maquettes reste également
entière (`gate-02A-decision-ep17-lot4.md` §4). Les avis **NO GO en l'état** des 4 rôles désignés ne
sont pas reconduits en GO par cette seule instruction — nouvelle évaluation nécessaire une fois le
travail de vérification et de conception produit. Strictement documentaire, aucun code de thème ni
modification de realm.

**Documents modifiés** : `gate-04A-decision-ep17-lot4.md` (§8, §4 mis à jour) ;
`gate-02A-decision-ep17-lot4.md` (§8, §4 mis à jour) ; `design-debt-register-loyertracker.md`
(`DD-EP17-03`) ; `agent-designations-loyertracker.md` (portée DevSecOps Lead étendue).

**Prochaine action autorisée** : vérification factuelle de la compatibilité de version Keycloak par
environnement et de l'état réel du SMTP, puis production des parcours utilisateurs et maquettes
scopés aux 8 écrans `login/` (`phase-02-user-journeys-ep17-lot4.md`,
`phase-02-ui-mockups-ep17-lot4.md`), même enchaînement que le Lot 3.

### Vérifications factuelles Lot 4 — version Keycloak, SMTP, correction du périmètre à 6 écrans (2026-08-02)

**Vérification de compatibilité de version Keycloak (RSV-UI-08)** — **Bloqueur levé, sans
réserve.** Les 3 environnements (`docker-compose.yml`, `docker-compose.staging.yml`,
`docker-compose.prod.yml` — ce dernier hérite l'image, aucune redéfinition) référencent le **même
digest exact** `quay.io/keycloak/keycloak:24.0@sha256:f8ade9…`. Aucun risque de divergence de
version entre Dev/Staging/Production.

**Vérification SMTP** — configuration confirmée absente de toute source versionnée (`docker-compose*.yml`,
`.env.example`, 2 fichiers de realm — recherche exhaustive, 0 occurrence partout). Nuance
méthodologique tracée : le realm n'est importé qu'au démarrage du conteneur, une configuration SMTP
faite depuis via la console d'administration Keycloak ne serait pas nécessairement reflétée ici —
constat sur la configuration versionnée, pas sur l'instance vivante, vérification directe
recommandée.

**Correction significative de périmètre** : « invitation » et « invitation expirée », que le Plan
d'Exécution §3 listait comme écrans du thème Keycloak, **ne sont pas des écrans Keycloak** — triple
vérification convergente : 0 occurrence de « invitation » dans les 2 fichiers de realm ; mécanisme
entièrement applicatif (`InvitationService.java`, lien `{baseUrl}/invitations/{token}`) ; aucune
route Angular correspondante (`app.routes.ts`, 0 occurrence). Le flux est fonctionnel et testé en
Production (`infra/smoke/smoke-stack.sh`, `POST /api/invitations/{token}/acceptation`) mais
**exclusivement en appel API direct** — jamais via une page web, ni Angular ni Keycloak. **Le
périmètre réel du Lot 4 se réduit à 6 écrans confirmés** (login, mot de passe oublié, reset
password, session expirée, accès refusé, logout), pas 8. Nouvelle dette tracée : `DD-EP17-12`
(absence de toute interface pour l'acceptation d'invitation), Majeur, distincte du Lot 4 puisque
aucun écran Keycloak n'est concerné.

**Documents modifiés** : `gate-04A-decision-ep17-lot4.md` (§9) ; `gate-02A-decision-ep17-lot4.md`
(§9) ; `design-debt-register-loyertracker.md` (`DD-EP17-12`, nouvelle).

**Ce que ces vérifications ne lèvent pas** : configuration SMTP à confirmer sur l'instance vivante ;
approbation du Plan d'Exécution pour le Lot 4 ; absence de parcours utilisateurs et de maquettes
pour les 6 écrans désormais confirmés. Les avis NO GO en l'état restent en vigueur.

**Prochaine action autorisée** : production des parcours utilisateurs et maquettes scopés aux 6
écrans confirmés (`phase-02-user-journeys-ep17-lot4.md`, `phase-02-ui-mockups-ep17-lot4.md`), même
enchaînement que le Lot 3 — préalable à toute nouvelle instruction complète du Gate 04A/02A Lot 4.

### Parcours et maquettes Lot 4 produits — flux « mot de passe oublié » cassé, confirmé (2026-08-02)

**Instruction explicite reçue** : « enchaîne sur les parcours utilisateurs et maquettes des 6 écrans
confirmés (login, mot de passe oublié, reset, session expirée, accès refusé, logout) ».

**Méthode** : contrairement au Lot 3 (lecture de code Angular), les écrans Keycloak ont été vérifiés
en **exécutant réellement** le realm `loyertracker` — instance Keycloak 24.0.5 isolée (même image
`24.0@sha256:f8ade9…` que Dev/Staging/Production), realm versionné importé tel quel, utilisateur de
test créé via l'API Admin, formulaires réellement soumis (pas une simulation). Instance détruite
après vérification, aucune donnée résiduelle, aucune infrastructure du projet touchée.

**Constat majeur, non anticipé** : la soumission réelle du formulaire « mot de passe oublié » pour
un utilisateur existant produit **`HTTP 500` — « Failed to send email, please try again later. »**.
Ce n'était jusqu'ici qu'une question ouverte (absence de SMTP dans la configuration versionnée,
`gate-04A-decision-ep17-lot4.md` §9) ; c'est désormais un échec fonctionnel **reproduit et
vérifié**, sur l'image exacte utilisée en Production. Nouvelle dette `DD-EP17-14` (Majeur).

**Second constat, également non anticipé** : les écrans Keycloak (login, mot de passe oublié,
logout, erreur générique) sont intégralement en anglais — aucune traduction française configurée,
alors que le reste du produit est en français. Nouvelle dette `DD-EP17-13` (Majeur).

**Regroupement révisé du périmètre** : les 6 écrans confirmés (§ précédente) correspondent en
réalité à **4 familles visuelles**, pas 6 maquettes indépendantes — connexion, mot de passe oublié
(saisie + résultat), déconnexion, erreur générique (un seul gabarit Keycloak `error.ftl` couvrant
session expirée, cookie absent, requêtes malformées et — probablement, non reproduit dans cette
vérification — accès refusé OIDC).

**Bonne nouvelle vérifiée** : le thème par défaut Keycloak est déjà raisonnablement responsive
(capture 375px sans débordement, empilement correct) — base saine à préserver, pas un correctif à
apporter.

**Documents produits** : `phase-02-user-journeys-ep17-lot4.md`, `phase-02-ui-mockups-ep17-lot4.md`.
**Documents modifiés** : `gate-04A-decision-ep17-lot4.md` (§10) ; `gate-02A-decision-ep17-lot4.md`
(§4 mis à jour, §10) ; `design-debt-register-loyertracker.md` (`DD-EP17-13`, `DD-EP17-14`,
nouvelles).

**Ce que ces documents ne lèvent pas** : les avis NO GO en l'état des 4 rôles désignés ne sont pas
reconduits en GO — `DD-EP17-14` en particulier constitue un blocage fonctionnel réel pour toute
mise en Production du sous-écran « mot de passe oublié », question posée explicitement au Product
Owner (`phase-02-ui-mockups-ep17-lot4.md` §2bis) plutôt que tranchée unilatéralement. Aucun code de
thème, aucune modification de realm produits par ce travail.

**Prochaine action autorisée** : validation Product Owner du contenu des deux documents produits, et
décision explicite sur le traitement de `DD-EP17-14` (SMTP comme préalable bloquant au thème « mot
de passe oublié », ou thème livré en assumant ce sous-écran incomplet) — préalable à toute nouvelle
instruction complète du Gate 04A/02A Lot 4, elle-même préalable à tout code de thème.

## 2026-08-02 — `DD-EP17-14` découplée du Lot 4 ; avis Gate 04A/02A révisés en GO sous réserve

**Instruction explicite reçue** : « j'approuve ta recommandation », en réponse à la proposition de
traitement de `DD-EP17-14` (flux « mot de passe oublié » cassé en Production, `HTTP 500`, absence de
SMTP, reproduit et vérifié sur l'image Keycloak exacte de Production — cf. entrée précédente).

**Décision actée** : `DD-EP17-14` reste ouverte au registre de dette, mais suit désormais un **suivi
propre, découplé du calendrier du Lot 4** — c'est un défaut de Production pré-existant (le flux est
déjà cassé aujourd'hui, indépendamment de tout thème), pas quelque chose que le pilote Keycloak crée
ou aggrave. Le Lot 4 est autorisé à couvrir l'écran de saisie « mot de passe oublié » et son état
d'erreur honnête déjà maquettés (`phase-02-ui-mockups-ep17-lot4.md` §2bis/§4bis), sans attendre la
résolution SMTP.

**Effet sur les avis spécialisés** : les 4 avis **NO GO en l'état** portés sur le Gate 04A et le Gate
02A Lot 4 sont révisés en **GO sous réserve** — chacun des bloqueurs qui les fondait est désormais
résolu (source de tokens tranchée, rôle de sécurité désigné, périmètre à 6 écrans confirmé, parcours
et maquettes produits et vérifiés en conditions réelles, et maintenant `DD-EP17-14` découplée plutôt
que bloquante) :

| Agent | Avis révisé |
| --- | --- |
| Design Architect | GO sous réserve |
| Frontend Architect | GO sous réserve |
| DevSecOps Lead | GO sous réserve |
| UX/UI Design Lead | GO sous réserve |

Détail complet et réserves continues par rôle : `gate-04A-decision-ep17-lot4.md` §11 et
`gate-02A-decision-ep17-lot4.md` §11.

**Ce que cette décision ne lève pas** :
* L'extension du Plan d'Exécution au Lot 4 (`plan-execution-ux-ui-primeng-keycloak.md` §12, toujours
  limité aux Lots 1-3) reste une action Product Owner distincte — un GO ou GO sous réserve de Gate
  n'a jamais valu, à lui seul, autorisation de code (`CLAUDE.md`).
* La validation Product Owner du **contenu** de `phase-02-user-journeys-ep17-lot4.md` et
  `phase-02-ui-mockups-ep17-lot4.md` reste distincte de la décision de Gate.
* `DD-EP17-03` non close (Option B tranchée, implémentation `tokens.css` restant à produire).
* `DD-EP17-13` (absence de traduction française) non traitée, à couvrir avec le thème lui-même.
* Checklist de remplacement de `CHECK-FRONTEND-01` non encore instanciée.
* Audit des 13 interdictions de sécurité `ADR-UI-001` §Sécurité contre le code de thème réel — sans
  objet tant qu'aucun code de thème n'existe.
* `STG-ISOL-01` (Staging mutualisé) reste un jalon futur, pertinent à la première promotion Staging.

**Documents modifiés** : `design-debt-register-loyertracker.md` (`DD-EP17-14`, colonnes
Responsable/Échéance/Statut) ; `gate-04A-decision-ep17-lot4.md` (§11, nouveau) ;
`gate-02A-decision-ep17-lot4.md` (§11, nouveau). Aucun code de thème, aucune modification de realm,
aucune dépendance ajoutée par ces documents — strictement documentaire.

**Prochaine action autorisée** : le Product Owner statue en §6 de `gate-04A-decision-ep17-lot4.md`
et en §6 de `gate-02A-decision-ep17-lot4.md`. Une décision GO ou GO sous réserve à ce niveau ne
vaudrait toujours pas, à elle seule, autorisation de code de thème — l'extension explicite du Plan
d'Exécution au Lot 4 reste requise au préalable.

## 2026-08-03 — Décision finale Gate 04A/02A Lot 4 : GO sous réserve

**Instruction explicite reçue** : « statue en §6 des deux gates, GO sous réserve », du Product
Owner / CGPA Chief Delivery Officer.

**Décision actée** : §6 de `gate-04A-decision-ep17-lot4.md` et §6 de `gate-02A-decision-ep17-lot4.md`
renseignés — **GO sous réserve** pour les deux Gates, sur le périmètre EP-17 Lot 4 (Pilote
Keycloak) tel qu'instruit dans ces deux documents.

**Réserves qui subsistent, listées dans chaque §6** : `DD-EP17-03` non close (implémentation
`tokens.css` restant à produire) ; `DD-EP17-13` (absence de traduction française des écrans
Keycloak) non traitée ; `DD-EP17-14` (flux « mot de passe oublié » cassé en Production) ouverte,
suivie séparément, non levée par ce GO ; checklist de remplacement de `CHECK-FRONTEND-01` non
instanciée ; audit des interdictions de sécurité `ADR-UI-001` §Sécurité contre le code de thème réel
(sans objet tant qu'aucun code n'existe) ; `STG-ISOL-01` toujours un jalon futur ; validation
Product Owner du **contenu** de `phase-02-user-journeys-ep17-lot4.md` et
`phase-02-ui-mockups-ep17-lot4.md`, distincte de cette décision de Gate.

**Ce que ce GO n'autorise pas** : conformément à `CLAUDE.md`, ce GO sous réserve de Gate ne vaut à
lui seul ni extension du Plan d'Exécution au Lot 4 (`plan-execution-ux-ui-primeng-keycloak.md` §12,
toujours limité aux Lots 1-3), ni autorisation de développement de thème Keycloak. L'extension du
Plan d'Exécution reste une action Product Owner distincte, préalable à tout code applicatif.

**Documents modifiés** : `gate-04A-decision-ep17-lot4.md` (§6) ; `gate-02A-decision-ep17-lot4.md`
(§6). Aucun code de thème, aucune modification de realm, aucune dépendance ajoutée — strictement
documentaire.

**Prochaine action autorisée** : extension explicite du Plan d'Exécution au Lot 4 par le Product
Owner, si le développement du thème doit commencer ; en parallèle, validation Product Owner du
contenu de `phase-02-user-journeys-ep17-lot4.md`/`phase-02-ui-mockups-ep17-lot4.md`, et traitement
des réserves listées ci-dessus (notamment `DD-EP17-03`, `DD-EP17-13`, checklist de remplacement de
`CHECK-FRONTEND-01`).

## 2026-08-03 — Plan d'Exécution étendu au Lot 4 (Pilote Keycloak)

**Instruction explicite reçue** : « étends le Plan d'Exécution au Lot 4 ».

**Décision actée** : `plan-execution-ux-ui-primeng-keycloak.md` §12 étendu — statut passe de
« APPROUVÉ SOUS RÉSERVE — PÉRIMÈTRE LOT 1, LOT 2 ET LOT 3 (RESTREINT) » à « APPROUVÉ SOUS RÉSERVE —
PÉRIMÈTRE LOT 1, LOT 2, LOT 3 (RESTREINT) ET LOT 4 (PILOTE KEYCLOAK) ». Fondé sur les deux Gates
04A/02A Lot 4, tous deux statués **GO sous réserve** le 2026-08-03 (§6 de chacun). Le périmètre
approuvé est le périmètre **confirmé** (6 écrans du thème `login/` : login, mot de passe oublié,
reset password, session expirée, accès refusé, logout), pas l'énoncé initial du §3 (qui incluait à
tort « invitation »/« invitation expirée » et l'Account Console) — corrigé par les vérifications
factuelles antérieures (`gate-04A-decision-ep17-lot4.md` §9).

**Ce que cette extension n'autorise pas sans réserve** : `DD-EP17-03` (implémentation `tokens.css`
restant à produire avant tout code de thème) ; `DD-EP17-13` (traduction française, à couvrir avec le
thème) ; `DD-EP17-14` (flux « mot de passe oublié » cassé, découplée du calendrier — le thème peut
couvrir l'écran de saisie et son état d'erreur honnête, sans masquer l'échec réel) ; checklist de
remplacement de `CHECK-FRONTEND-01` (à instancier au fil des preuves) ; les 13 interdictions de
sécurité `ADR-UI-001` §Sécurité (aucune modification des flux OIDC/PKCE ni des fichiers de realm,
à respecter dès la première ligne de code) ; `STG-ISOL-01` (obligatoire avant toute promotion
Staging, pas avant le développement) ; validation Product Owner du contenu des parcours/maquettes
déjà produits, distincte de cette approbation de Plan.

**Documents modifiés** : `plan-execution-ux-ui-primeng-keycloak.md` (en-tête, §12). Aucun code de
thème, aucune modification de realm, aucune dépendance ajoutée par cette extension — strictement
documentaire.

**Prochaine action autorisée** : le développement technique du thème Keycloak (Lot 4, 6 écrans
`login/`) peut démarrer, en commençant par l'implémentation de la source de tokens commune
(`DD-EP17-03`, Option B) avant tout code consommant ces tokens — même discipline que les Lots
précédents (fondations avant intégration).

## 2026-08-03 — `DD-EP17-03` implémentée : source de tokens commune Angular/Keycloak

**Instruction explicite reçue** : « enchaîne sur DD-EP17-03, implémentation tokens.css ». Premier
code applicatif du Lot 4, autorisé par l'extension du Plan d'Exécution du même jour.

**Implémentation produite** :
* `infra/keycloak/themes/loyertracker/login/resources/css/tokens.css` — fichier physique
  canonique, contenant les 34 tokens `--lt-*` déjà validés (`DDS-LT-006`).
* `frontend/src/styles/tokens/_lt-tokens.scss` — **copie disciplinée** de ce fichier (mêmes
  valeurs de tokens ; seule la syntaxe des commentaires diffère légitimement entre SCSS et CSS
  pur), avec un commentaire d'en-tête rappelant l'obligation de synchronisation manuelle dans les
  deux fichiers.
* Emplacement du fichier canonique déterminé par une contrainte non anticipée par `ADR-UI-001` : le
  volume Docker monté au runtime dans le conteneur Keycloak ne pourra couvrir que
  `infra/keycloak/themes/` — un fichier canonique situé ailleurs serait inaccessible au conteneur.

**Correction en cours de route — lien symbolique tenté puis abandonné** : la première
implémentation faisait de `_lt-tokens.scss` un lien symbolique relatif vers le fichier canonique
(zéro duplication). CI a échoué sur le job « Build, scan et SBOM Docker » de la PR #354 (`ENOENT`)
— un build Docker réel de l'image Frontend (`docker build -f frontend/Dockerfile .`, pas seulement
`ng build` en local) a révélé que `frontend/Dockerfile` ne copie que le sous-arbre `frontend/` dans
son contexte de build : le lien symbolique, une fois copié tel quel dans l'image, pointe hors de ce
contexte et devient introuvable. Un lien inverse échouerait symétriquement côté Keycloak (volume
runtime limité à `infra/keycloak/themes/`) — **aucun lien symbolique ne peut satisfaire les deux
frontières de conteneur à la fois**. La duplication disciplinée, corrigée ci-dessus, est donc
l'implémentation réelle d'Option B, pas un pis-aller : c'est exactement le compromis qu'`ADR-UI-001`
décrivait déjà (« risque de divergence, dépend de la discipline »).

**Vérifications réelles effectuées** (pas une lecture de code seule) :
* `ng build` — bundle CSS compilé contient bien les 34 déclarations `--lt-*` attendues.
* `ng test` — 148/148 tests passent, aucune régression introduite par le changement.
* `docker build -f frontend/Dockerfile .` (build réel de l'image Frontend, depuis la racine du
  dépôt) — échoue avec le lien symbolique (`ENOENT`, reproduit localement avant correction) ;
  **réussit** avec la copie disciplinée. C'est cette vérification, absente de la première passe,
  qui a révélé le problème avant que la CI n'ait besoin de le signaler une seconde fois.

**`DD-EP17-03` close** au registre de dette (`design-debt-register-loyertracker.md`) — preuve
attendue (« décision tracée + implémentation ») effectivement produite, conformément au Validation
Framework CGPA v6.1.1 §5.

**Ce que cette implémentation ne couvre pas** : le câblage réel du thème Keycloak lui-même
(`theme.properties`, `login.ftl` et les autres templates FreeMarker des 6 écrans confirmés, montage
du volume `infra/keycloak/themes/` dans `docker-compose*.yml`, `loginTheme` dans le realm) reste un
travail distinct, non entamé par cette implémentation — objet du reste du Lot 4. Les autres réserves
listées à l'extension du Plan d'Exécution (`DD-EP17-13`, `DD-EP17-14`, checklist
`CHECK-FRONTEND-01`, audit sécurité `ADR-UI-001` §Sécurité, `STG-ISOL-01`) restent également
ouvertes, non affectées par ce travail.

**Documents modifiés** : `infra/keycloak/themes/loyertracker/login/resources/css/tokens.css`
(nouveau) ; `frontend/src/styles/tokens/_lt-tokens.scss` (copie disciplinée, pas un lien
symbolique) ; `design-debt-register-loyertracker.md` (`DD-EP17-03` close) ; `ADR-UI-001-...md`
(note datée, corrigée).

**Prochaine action autorisée** : câblage du thème Keycloak lui-même (`theme.properties`,
templates FreeMarker des 6 écrans confirmés), sous réserve continue des points ci-dessus —
prochaine étape naturelle du Lot 4 une fois cette fondation en place.

## 2026-08-03 — Câblage du thème Keycloak (DD-EP17-01)

**Instruction explicite reçue** : « enchaîne sur le câblage du thème Keycloak ».

**Stratégie retenue, CSS-only** : `infra/keycloak/themes/loyertracker/login/theme.properties`
déclare `parent=keycloak` (héritant lui-même de `base`) — **aucun template FreeMarker n'est
surchargé**. Les 6 écrans confirmés (login, mot de passe oublié, reset password, session expirée,
accès refusé, logout) partagent tous le même `template.ftl` hérité ; une seule feuille de style
(`resources/css/login.css`, tokens `--lt-*`) suffit à les thémer tous. Ce choix élimine la quasi-
totalité de la surface de risque listée par `ADR-UI-001` §Sécurité (CSRF, redirections, messages de
sécurité, flux OIDC/PKCE) : aucune logique FreeMarker n'est touchée, seule l'apparence l'est.

**Vérifié par un Keycloak réel** (même digest que Dev/Staging/Production), pas une lecture de code
seule :
* Structure du thème par défaut (KC 24.0.5) inspectée directement depuis le jar de thèmes de
  l'image — confirme `parent=base`, les classes PatternFly réelles (`card-pf`, `pf-c-form-control`,
  `pf-c-button.pf-m-primary`, `pf-m-danger`/`pf-m-success`/`pf-m-warning`/`pf-m-info`,
  `kc-feedback-text`) et que Keycloak **concatène** `styles` du parent et de l'enfant (confirmé par
  les 6 `<link>` effectivement présents dans la page rendue — PatternFly hérité + nos 2 fichiers).
* Écrans connexion et mot de passe oublié capturés par Chrome headless : thème sombre appliqué,
  cohérent avec le reste du produit.
* Message d'erreur de champ (« Invalid username or password. ») initialement non coloré malgré la
  règle CSS écrite — bug de spécificité réel détecté (PatternFly avait la même spécificité,
  chargé après), corrigé, puis **vérifié par échantillonnage de pixels** sur la capture
  (`(254, 202, 202)` = exactement `--lt-state-danger` `#fecaca`) plutôt que par jugement visuel
  d'une vignette.
* Une règle CSS ciblant un logo image (`div.kc-logo-text`) s'est révélée être du code mort : ce
  bloc n'existe pas dans le HTML réellement rendu par cette version de Keycloak (l'en-tête affiche
  le nom du realm en texte, pas d'image). Retirée avant commit plutôt que laissée sans effet.

**Activation sans toucher aux fichiers de realm** : le Plan d'Exécution (§3 Lot 4) pose comme
prérequis bloquant « aucune modification des flux OIDC/PKCE ni des fichiers de realm ». Nouveau
script dédié `infra/keycloak/activate-login-theme.sh`, décorrélé de `bootstrap-test-account.sh`
(aucune dépendance à un compte de test, donc réutilisable identiquement en Production) : positionne
`loginTheme=loyertracker` exclusivement via l'API Admin (`kcadm.sh`), jamais par édition du JSON
versionné. Vérifié réel : script exécuté deux fois contre un realm importé (idempotent, confirmé),
`git diff` sur les deux fichiers de realm confirmé vide après exécution.

**Câblage Docker, 3 environnements** :
* `docker-compose.yml`, `docker-compose.staging.yml` : montage `./infra/keycloak/themes/loyertracker`
  (lecture seule) sur le service `keycloak` + nouveau service one-shot `keycloak-theme-init`.
* `docker-compose.prod.yml` : **la liste `volumes` d'un override Compose remplace, ne complète pas,
  celle du fichier de base** — le mont du thème a donc dû être répété explicitement dans ce fichier,
  sinon silencieusement perdu en Production. `keycloak-theme-init` n'a pas besoin d'y être redéfini
  (aucune dépendance à un compte de test) : hérité tel quel du fichier de base, vérifié par
  `docker compose -f docker-compose.yml -f docker-compose.prod.yml config`.
* Les 3 configurations fusionnées (dev, staging, prod) vérifiées par `docker compose ... config` —
  montage du thème et service d'activation confirmés présents dans les 3.
* Intégration complète testée réellement (pas seulement le service `keycloak` isolé) : stack dev
  démarrée (`postgres`, `keycloak`, `keycloak-init`, `keycloak-theme-init`), les deux services
  one-shot s'exécutent avec succès l'un à côté de l'autre (`keycloak-init` toujours fonctionnel,
  non affecté), fichiers du thème confirmés montés et servis à l'intérieur du conteneur réel, puis
  environnement détruit proprement (`docker compose down` + suppression du volume nommé de test —
  aucun résidu).

**`DD-EP17-01` non close** — reste ouvert : `STG-ISOL-01` (Staging mutualisé) et le Gate Staging
dédié, prérequis explicites de la preuve attendue de cette dette, non encore engagés. Les autres
réserves de Lot 4 (`DD-EP17-13` langue, `DD-EP17-14` SMTP découplée, checklist
`CHECK-FRONTEND-01`, audit sécurité `ADR-UI-001` §Sécurité contre le code réel — désormais possible
puisque du code existe, mais pas encore fait) restent également ouvertes.

**Documents modifiés** : `infra/keycloak/themes/loyertracker/login/theme.properties` (nouveau),
`.../resources/css/login.css` (nouveau) ; `infra/keycloak/activate-login-theme.sh` (nouveau) ;
`docker-compose.yml`, `docker-compose.staging.yml`, `docker-compose.prod.yml` (montage thème +
service `keycloak-theme-init`) ; `design-debt-register-loyertracker.md` (`DD-EP17-01` progression).
Aucune modification de `realm-loyertracker.json` / `realm-loyertracker-production.json` (vérifié
par `git diff`, vide).

**Prochaine action autorisée** : audit des 13 interdictions de sécurité `ADR-UI-001` §Sécurité
contre ce code réel (désormais possible, du code existant) ; traitement de `DD-EP17-13` (langue) ;
`STG-ISOL-01` avant toute promotion Staging du thème.

## 2026-08-03 — Audit des 13 interdictions de sécurité `ADR-UI-001` §Sécurité (DD-EP17-01)

**Instruction explicite reçue** : « enchaîne sur le câblage du thème Keycloak » ; le thème étant
déjà câblé et commité (`4509049`), l'utilisateur a choisi cette action parmi les trois listées
ci-dessus lorsqu'interrogé sur la priorité.

**Périmètre audité** — code réel, pas une relecture de la conception :
`infra/keycloak/themes/loyertracker/login/theme.properties`, `.../resources/css/tokens.css`,
`.../resources/css/login.css`, `infra/keycloak/activate-login-theme.sh`, montages/volumes des 3
`docker-compose*.yml`.

**Note de méthode** : `ADR-UI-001` §Sécurité énumère 11 interdictions ; le Plan d'Exécution §5 en
reprend 12 (ajoute « altérer les messages de sécurité au profit de l'esthétique »), le tout sourcé
de la mission §17 (prompt externe, non présent dans ce dépôt). Le compte « 13 » cité par ce
document et par `gate-04A-decision-ep17-lot4.md` s'obtient en distinguant cookies et tokens comme
deux interdictions séparées plutôt qu'une seule (« modifier les cookies ou les tokens »). Les 13
points ci-dessous suivent ce découpage, faute d'accès à l'énumération originale de la mission.

**Résultat — RAS sur les 13 points, code vérifié directement (pas seulement les commentaires du
code qui l'affirment déjà)** :

1. **Flux OIDC/PKCE** — `theme.properties` ne déclare que `parent=keycloak`, `import=common/keycloak`
   et `styles=`. Aucun template FreeMarker (`login.ftl`, etc.) n'est surchargé — confirmé par
   `find infra/keycloak/themes -type f` : seuls `theme.properties` et 2 fichiers CSS existent, aucun
   `.ftl`. Le flux OIDC/PKCE reste entièrement celui du thème `keycloak` hérité.
2. **Politiques de mot de passe** — aucun fichier de ce Lot ne touche à la configuration de realm ;
   `git show 4509049` confirme qu'aucun des deux fichiers de realm n'apparaît dans le diff.
3. **Message de sécurité masqué** — recherche de `display:\s*none`, `visibility:\s*hidden`,
   `opacity:\s*0` dans les 2 fichiers CSS : aucune occurrence. Les sélecteurs `.pf-c-alert.pf-m-*`
   et `.kc-feedback-text` ne reçoivent qu'une déclaration `color`, jamais de propriété affectant la
   présence ou la visibilité du message.
4. **Détail technique exposé** — aucune règle `content:` (pseudo-éléments `::before`/`::after`)
   dans les 2 fichiers CSS ; aucun texte n'est injecté par le CSS, qui ne fait que recolorer du
   contenu déjà rendu par le template hérité.
5. **Script externe non maîtrisé** — `theme.properties` ne déclare aucune clé `scripts=` (seule
   `styles=` est présente) ; aucun fichier `.js` sous `infra/keycloak/themes/`.
6. **CDN introduit** — recherche de `url(` et `@import` dans les 2 fichiers CSS : aucune occurrence.
   Toutes les valeurs sont des `var(--lt-*)` ou des littéraux locaux (couleurs hex, `system-ui`
   comme police système, pas de `@font-face` distant).
7. **Cookies modifiés** — ni le CSS, ni `theme.properties`, ni `activate-login-theme.sh` ne
   touchent à un cookie ; `activate-login-theme.sh` ne fait qu'un `kcadm.sh update realms/... -s
   loginTheme=...`, une seule clé d'attribut de realm, sans rapport avec la gestion de session.
8. **Tokens (JWT/session) modifiés** — même constat : aucun fichier de ce Lot ne touche à
   l'émission, la durée de vie ou le contenu des tokens Keycloak.
9. **Secret stocké** — `activate-login-theme.sh` consomme `KEYCLOAK_ADMIN`/
   `KEYCLOAK_ADMIN_PASSWORD` exclusivement via variables d'environnement injectées au runtime
   (mécanisme déjà en place pour `keycloak-init`/`bootstrap-test-account.sh`) ; le script ne les
   écrit jamais sur disque ni ne les journalise — les 3 `echo` du script (lignes 21, 27, 31) ne
   portent que des messages d'état, vérifié ligne par ligne.
10. **Protection CSRF contournée** — aucun template FreeMarker touché (cf. point 1), donc le
    rendu du token CSRF (`kcFormAction`, champ caché standard du thème hérité) reste inchangé.
11. **URL de redirection modifiée sans ADR** — aucune clé `redirect_uri`/`Location` ni fichier de
    realm dans le diff ; le script d'activation ne positionne que `loginTheme`.
12. **Protection anti-clickjacking cassée** — les en-têtes de sécurité (`X-Frame-Options`/
    `Content-Security-Policy: frame-ancestors`) sont une configuration de realm/serveur Keycloak,
    hors du périmètre thème CSS/`theme.properties` ; aucun fichier de ce Lot n'y touche.
13. **Message de sécurité altéré au profit de l'esthétique** — les 4 tokens de sévérité restent
    distincts et cohérents avec leur rôle (`--lt-state-danger` rougeâtre `#fecaca`,
    `--lt-state-warning` jaune `#fde68a`, `--lt-state-success` vert `#bbf7d0`,
    `--lt-state-info` bleu `#bae6fd`) — aucun message d'erreur n'est repeint dans une teinte
    neutre ou positive qui en atténuerait la perception.

**Limite de cet audit, tracée honnêtement** : vérification statique du code versionné (lecture +
recherches ciblées), pas une exécution des 11 scénarios de test de sécurité prévus au Lot 5 (§9 du
Plan d'Exécution — login invalide, compte désactivé, reset expiré, etc.). Cet audit statique est un
prérequis au Lot 5, pas un remplacement.

**Documents modifiés** : `docs/project-state.md` (cette entrée) ;
`design-debt-register-loyertracker.md` (`DD-EP17-01`, note d'audit ajoutée).

**Prochaine action autorisée** : traitement de `DD-EP17-13` (traduction française des écrans
Keycloak) ; `STG-ISOL-01` (contrôles avant/après Staging mutualisé) avant toute promotion du thème
sur `ai-test-server` ; exécution réelle des scénarios de test de sécurité du Lot 5 (§9) une fois en
Staging.

## 2026-08-03 — `DD-EP17-13` close : traduction française des écrans Keycloak

**Instruction explicite reçue** : « enchaîne sur DD-EP17-13, traduction française des écrans
Keycloak ».

**Constat qui change le problème** : `DD-EP17-13` a été identifiée en observant un realm réel
tourner intégralement en anglais, mais **aucune traduction n'a dû être écrite** — Keycloak 24.0.5
embarque déjà une traduction française complète du thème par défaut
(`theme/base/login/messages/messages_fr.properties`, extraite et inspectée directement depuis
l'image réelle du dépôt, pas une hypothèse). Le vrai défaut : `internationalizationEnabled`,
`supportedLocales` et `defaultLocale` sont absents des deux fichiers de realm versionnés — recherche
textuelle exhaustive confirmée vide — donc Keycloak servait sa locale par défaut (anglais), realm
après realm, sans jamais avoir été configuré pour proposer le français.

**Couverture vérifiée par clé, pas par supposition** : les 6 templates FreeMarker portant les 6
écrans confirmés du Lot 4 (`login.ftl`, `login-reset-password.ftl`, `login-page-expired.ftl`,
`error.ftl`, `logout-confirm.ftl`, `template.ftl` commun) extraits du thème réel — 31 clés `msg(...)`
distinctes recensées, comparées une à une entre `messages_en.properties` et `messages_fr.properties`
réels. Seules 2 manquent côté français : `languages` (libellé du sélecteur de langue, non affiché
puisqu'une seule locale est supportée — `template.ftl` : `<#if ... locale.supported?size gt 1>`,
vérifié) et `showPassword`/`hidePassword` (attributs `aria-label`/`data-label-*` du bouton
afficher/masquer le mot de passe, jamais un texte visible — vérifié dans `login.ftl`). Aucun impact
utilisateur.

**Activation, même discipline que l'activation du thème** : `infra/keycloak/activate-login-theme.sh`
étendu (pas de nouveau script ni service — même realm, même moment du cycle de vie, aucun nouveau
secret) pour positionner `internationalizationEnabled=true`, `supportedLocales=["fr"]`,
`defaultLocale=fr` via l'API Admin (`kcadm.sh`), jamais par édition des fichiers de realm versionnés
— même prérequis bloquant que `DD-EP17-01`. Une seule locale supportée (pas `["en","fr"]`) : le
Frontend Angular n'a aucun sélecteur de langue nulle part (`grep` exhaustif, aucune trace de `i18n`/
`ngx-translate`/`@angular/localize`) — le produit est français uniquement, sans choix de langue ;
avec une seule locale realm, Keycloak n'affiche d'ailleurs lui-même aucun sélecteur.

**Aucun fichier de thème ajouté** : contrairement à l'hypothèse initiale (créer
`infra/keycloak/themes/loyertracker/login/messages/messages_fr.properties`), rien de tel n'a été
ajouté — la traduction héritée du thème `base` suffit intégralement, une surcharge aurait été de la
duplication inutile sans valeur ajoutée.

**Vérifié par un Keycloak réel** (même digest que Dev/Staging/Production), pas une lecture de code
seule : stack dev démarrée (`postgres`, `keycloak`, `keycloak-init`, `keycloak-theme-init`), script
d'activation étendu exécuté avec succès (log confirmé : locale française activée après le thème).
Écran de connexion obtenu par un flux OIDC/PKCE réel (`code_challenge`/`code_verifier` générés,
client public `loyertracker-spa`, requête HTTP directe sur le réseau Docker du realm, aucun
raccourci) : `<html lang="fr">`, titre « Se connecter à LoyerTracker », corps « Connectez-vous à
votre compte » — confirmé en français. Lien « mot de passe oublié » suivi avec la session réelle
(cookies, `tab_id`) : page réelle obtenue, en-tête « Mot de passe oublié ? » confirmé (clé
`emailForgotTitle`, pas un texte de lien réutilisé par coïncidence). Zéro occurrence de
`kc-locale` dans les deux pages rendues — sélecteur de langue confirmé absent, cohérent avec
l'attendu. Écrans session expirée/accès refusé/logout non déclenchés en direct (nécessiteraient de
forger des états serveur artificiels) — couverts par la vérification statique exhaustive des clés
ci-dessus, mécanisme d'activation identique et réel (drapeau realm unique, pas de logique par écran).
Environnement détruit proprement ensuite (`docker compose down -v`), aucun résidu.

**`DD-EP17-13` close** au registre de dette — traduction livrée et vérifiée, sans réserve de Staging
explicite contrairement à `DD-EP17-01` (la preuve attendue du registre ne conditionnait pas la
clôture à un Gate Staging dédié).

**Documents modifiés** : `infra/keycloak/activate-login-theme.sh` (internationalisation ajoutée) ;
`docs/project-state.md` (cette entrée) ; `design-debt-register-loyertracker.md` (`DD-EP17-13`
close). Aucune modification de `realm-loyertracker.json` / `realm-loyertracker-production.json`.

**Prochaine action autorisée** : `STG-ISOL-01` (contrôles avant/après Staging mutualisé) avant toute
promotion du thème + de l'activation de locale sur `ai-test-server` ; exécution réelle des scénarios
de test de sécurité du Lot 5 (§9) une fois en Staging ; `DD-EP17-14` (SMTP/« mot de passe oublié »
cassé) reste suivie séparément, découplée du calendrier du Lot 4.

## 2026-08-03 — `STG-ISOL-01` live PASS, `DD-EP17-01` close — thème Keycloak livré en Staging

**Instruction explicite reçue** : « enchaîne sur STG-ISOL-01 » ; confirmation explicite obtenue
avant toute action touchant l'hôte mutualisé `ai-test-server` (mode Plan, plan approuvé), et avant
le déploiement live proprement dit.

**Dérive opérationnelle découverte et résolue au préalable, hors périmètre applicatif** : le dépôt
sur `ai-test-server` était à `27dce09` (~40 commits de retard sur `origin/main`). `git pull
--ff-only` bloqué par 3 fichiers : `docker-compose.staging.yml` et `infra/smoke/smoke-stack.sh`
modifiés localement (contenu vérifié **identique** à `main` — vars Twilio SMS fallback EP-16
Sprint N+2, déjà mergées — `git checkout --` sans perte) ; `infra/release/production-state.env`
non suivi, snapshot orphelin de l'ancienne release `1.14.0` (`FLYWAY_EXPECTED_PROD=28`) strictement
remplacé par la version maintenant versionnée dans `main` (`1.15.0`, `29`) — déplacé
(`.superseded-2026-08-03`, pas supprimé, par prudence) plutôt que supprimé pour débloquer le pull.
`git pull --ff-only` ensuite propre (`27dce09..b6b9c7c`).

**Déploiement ciblé, 3 services uniquement** (`keycloak`, `keycloak-init`, `keycloak-theme-init`) —
`api`/`nginx`/`postgres`/monitoring non touchés, aucune image applicative changée. Note technique :
`docker compose` interpole l'intégralité du fichier même pour un `up -d` ciblé, donc `API_IMAGE_REF`/
`WEB_IMAGE_REF` ont dû être fournis pour cette seule invocation — valeurs reprises à l'identique des
conteneurs `api`/`nginx` déjà en cours d'exécution (`docker inspect`, digests exacts), sans changer
ce qui tourne réellement.

**`STG-ISOL-01` live — PASS** : snapshot avant (16:50 UTC) = 9 conteneurs (`loyertracker-staging-*`
×8 + `nginx-proxy-manager`) ; snapshot après (16:53 UTC) = identique, seul `keycloak` recréé (nouveau
montage du thème, `Up ~1 min, healthy`), tous les autres services à leur uptime d'avant déploiement
(6 h, inchangés) — aucune perturbation d'un autre projet de l'hôte mutualisé. Logs
`keycloak-theme-init` : activation `loginTheme` puis locale française confirmées, `exit 0`.

**Vérification réelle de l'écran de connexion sur l'hôte Staging** (port interne `18443`, flux
OIDC/PKCE réel — `code_challenge`/`code_verifier` générés, client public `loyertracker-spa`, aucun
raccourci) : `<html lang="fr">`, titre « Se connecter à LoyerTracker », corps « Connectez-vous à
votre compte », classe `card-pf` du thème présente dans le HTML rendu, **0** occurrence `kc-locale`
(sélecteur de langue absent, cohérent avec une seule locale supportée) — résultat identique à la
vérification Dev déjà faite pour `DD-EP17-01`/`DD-EP17-13`.

**Smoke test rejoué** (`infra/smoke/smoke-stack.sh`, `BASE=https://localhost:18443`) : **63 PASS, 0
FAIL** — confirme l'absence de régression ailleurs (`api`/`nginx` non recréés, changement isolé au
service `keycloak`).

**`DD-EP17-01` close** au registre de dette — dernière preuve attendue (« Thème livré en Staging
isolé + Gate Staging dédié ») maintenant complète.

**Documents modifiés** : `docs/staging-state.md` (§8 nouvelle entrée, §11 extension `STG-ISOL-01`
Lot 4) ; `design-debt-register-loyertracker.md` (`DD-EP17-01` close) ; `docs/project-state.md`
(cette entrée). Aucune modification de fichier de realm. Sur l'hôte : 2 fichiers resynchronisés avec
`main` (`git checkout --`), 1 fichier orphelin déplacé (pas supprimé) — aucune perte de travail réel,
tout vérifié identique ou strictement remplacé par une version plus récente déjà versionnée.

**Prochaine action autorisée** : `DD-EP17-13` (langue) et `DD-EP17-01` (thème) sont closes — reste
`DD-EP17-14` (SMTP/« mot de passe oublié » cassé, suivie séparément, découplée du Lot 4) ; exécution
réelle des scénarios de test de sécurité du Lot 5 (§9, login invalide, compte désactivé, reset
expiré, etc.) désormais possible en Staging ; Gate Production distinct si une promotion est
souhaitée (hors périmètre CGPA immédiat pour un pilote Keycloak sans Account Console, cf. Plan
d'Exécution §3 Lot 4).

## 2026-08-04 — Hypercare Production `1.15.0` reprise : checkpoint T+24 statué, cycle clos

**Instruction explicite reçue** : « resume T+12/T+24 hypercare pour 1.15.0 », en réponse à un
constat de statut projet qui avait relevé que la release Production `1.15.0` était en hypercare
suspendue depuis le T0 (2026-07-30), sans que T+12 ni T+24 n'apparaissent statués dans ce document
au-delà d'une entrée T0 isolée (§ ci-dessus, 2026-07-30).

**Constat en ouverture, distinct de ce que le titre de l'instruction laissait supposer** :
`docs/cgpa/09-production/plan-etape-hypercare-v1.15.0.md` montrait en réalité que **T+12 avait déjà
été statué PASS** (2026-07-30, ~10 min après le T0, sur instruction PO explicite, valeur probante
réduite et déjà tracée comme telle) — seul **T+24 restait « à instruire »**, sa cible
(2026-07-31 ~13:20 UTC) étant dépassée d'environ 4,5 jours au moment de cette instruction. Le
travail réel de cette entrée porte donc sur le seul T+24.

**Accès à l'hôte Production** : SSH a d'abord échoué (time-out) alors que le site public répondait
200 — l'instance EC2 était `running`. Diagnostic réel (pas une hypothèse) : la règle entrante du
port 22 sur `sg-095b269cbd42907b0` (`loyertracker-prod-sg`) ne contenait plus l'IP d'egress de
cette session (`52.29.80.119/32`), remplacée par deux autres IP — dérive déjà documentée comme
récurrente (le PO édite ce groupe de sécurité directement entre les sessions). **Confirmation
explicite obtenue avant modification** : ajout de la règle `52.29.80.119/32` sur le port 22
(`sgr-0b187eac7a6b0d997`), aucune autre règle touchée.

**Checkpoint T+24 exécuté le 2026-08-04, 15:24–15:32 UTC, en lecture seule** — détail complet,
tableau de contrôles et notes d'investigation dans
`docs/cgpa/09-production/plan-etape-hypercare-v1.15.0.md` (section « Checkpoint T+24 »). Résumé :
**PASS, aucun critère de suspension atteint.** Un redémarrage complet de l'hôte est survenu entre
le T+12 et ce contrôle (`StartedAt` des 4 services applicatifs = `2026-08-04T15:07:1{4,5}Z`, soit
17 min avant le contrôle — pattern d'exploitation connu, hôte volontairement éteint) : l'état
persistant (Flyway 29/29, invariant financier 0 écart sur les 8 garanties, `OBS-S10-01` 0 ligne
ambiguë, `notification_outbox`/`delivery` à 0, `bailleur-test`/`directAccessGrants` désactivés,
0 credential Twilio, digests d'image réellement chargés conformes) a traversé ce redémarrage sans
aucune dérive.

**Deux découvertes investiguées et qualifiées non bloquantes, pas balayées** :
1. `infra/release/check-release-state.sh --host` a signalé une fausse « DÉRIVE » sur le digest
   `nginx` — vérification réelle (`docker inspect .Image` / `RepoDigests` de l'image tournant
   réellement) confirmant que le digest exécuté est identique à celui déclaré ; le script compare
   en réalité `Config.Image` (chaîne figée à la création du conteneur, non recréé depuis `1.14.0`)
   plutôt que le digest réel, produisant un faux positif de forme. Dette technique consignée,
   correction hors périmètre de cette entrée (outillage de gouvernance, Plan d'Exécution distinct
   requis).
2. Une nouvelle alerte Alertmanager, `NotificationKillSwitchFerme` (absente à T0/T+12), active
   depuis peu après le redémarrage. Investigation réelle des logs `NotificationDispatcher`
   (cycle ~15 s, `WARN` à chaque passage tant que `app.notifications.external.enabled=false`) et
   du compteur associé : comportement strictement conforme à la conception (kill switch fermé,
   aucune ligne en `outbox`/`delivery`), qualifié explicitement « attendu... avant activation » par
   l'annotation de la règle elle-même — cohérent avec l'état K8/ADR-18 courant (Sprint N+2 Lot B
   non GO). Probablement la première évaluation live de cette règle, livrée avec Lot A mais jamais
   vue tourner en continu avant ce redémarrage de la chaîne `monitoring`.

**Écarts de fenêtre du cycle, tracés sans les banaliser** : T+12 anticipé de ~12 h sur instruction
PO (déjà qualifié à l'origine) ; T+24 repris ~4,5 jours après sa cible, sur instruction PO du
2026-08-04. Ampleur inédite dans l'historique du projet — la synthèse du plan d'hypercare le dit
explicitement plutôt que de recycler la qualification « PASS sous surveillance » des écarts de
quelques heures déjà tracés sur `1.7.0`/`1.8.0`/`1.9.0`/`1.12.0`/`1.14.0`.

**Écart documentaire corrigé au passage** : `infra/release/production-state.env` —
`PRODUCTION_DEPLOYED_AT` était resté à la date de confirmation de `1.14.0`
(`2026-07-27T16:46:00Z`) au lieu d'être mis à jour à la validation finale `1.15.0` du 2026-07-30
~13:20 UTC, contrairement à ce que son propre commentaire prescrit. Corrigé à
`2026-07-30T13:20:00Z` — correction factuelle d'un oubli, pas une nouvelle décision, signalée avant
d'être appliquée.

**Documents modifiés** : `docs/cgpa/09-production/plan-etape-hypercare-v1.15.0.md` (T+24 rempli,
synthèse ajoutée) ; `docs/prod-state.md` (§0P, pointeur vers l'hypercare close) ;
`infra/release/production-state.env` (`PRODUCTION_DEPLOYED_AT` corrigé) ; `docs/project-state.md`
(cette entrée). Aucune modification applicative, aucune modification de realm, aucun redémarrage ni
déploiement — travail strictement en lecture seule côté Production, plus une modification de
security group (ajout d'une règle d'entrée SSH, confirmée explicitement avant exécution).

**Ce que cette entrée ne fait PAS** : elle ne prononce **aucune clôture de release CDO** pour
`1.15.0`. La surveillance planifiée est close (les trois checkpoints sont statués), mais la
clôture reste un acte distinct, sur instruction PO explicite, qui devra tenir compte des réserves
de valeur probante documentées pour T+12 et T+24 avant tout GO.

**Prochaine action autorisée** : instruction PO explicite et distincte pour la clôture de release
CDO `1.15.0`, sur la base du dossier d'hypercare complet ci-dessus ; en parallèle, aucune action
requise côté EP-17 (pilote Keycloak, branche `feature/ep17-lot4-stg-isol-01-keycloak-theme-staging`)
— chantier sans rapport avec cette entrée.

## 2026-08-04 — Clôture de release CDO `1.15.0` (Lot A)

**Instruction explicite reçue** : « instruis la clôture de release CDO 1.15.0 », immédiatement
après la reprise du checkpoint T+24 ci-dessus (les trois checkpoints d'hypercare étant statués
PASS, la clôture devenait possible conformément au plan d'hypercare).

**Relevé live effectué avant décision** (pas une réutilisation du T+24) : nouveau contrôle SSH sur
`loyertracker-prod-server` à 2026-08-04 15:36:28 UTC (~12 min après le T+24) — stack 8/8 `Up`,
4/4 `(healthy)`, digests API/Web réels conformes aux valeurs déclarées, Flyway 29/29,
`notification_outbox`/`delivery` toujours à 0, invariant financier 0 écart, `OBS-S10-01` 0 ligne
ambiguë, 0 5xx/`ERROR` depuis le boot, site public et `/healthz` 200. Aucune évolution par rapport
au T+24, à l'exception de l'horodatage — cohérent avec l'absence d'activité métier sur l'intervalle.

**Décision actée** : **CDO GO — Release `1.15.0` (Lot A) CLÔTURÉE le 2026-08-04 ~15:36 UTC.**
Dossier complet : `docs/cgpa/09-production/cloture-release-v1.15.0.md` — récapitulatif du cycle
complet (Gate Staging → Gate Production → Préflight → déploiement technique → validation finale →
hypercare), registre des réserves (aucune bloquante sur le périmètre Lot A ; `RSV-MIG-611-04`,
`RSV-EP16-N2-02`, `RSV-MIG-611-06` maintenues, sans rapport avec cette clôture), état de Production
au relevé de clôture, et justification détaillée de la décision GO — notamment le traitement
explicite des deux écarts de fenêtre d'hypercare (T+12 anticipé ~12 h, T+24 repris ~4,5 jours après
sa cible) comme des écarts **assumés et tracés**, sans les rapprocher mécaniquement des écarts de
quelques heures déjà qualifiés sur les cycles précédents.

**`1.15.0` devient la base de rollback applicatif** des releases suivantes (`sha-ac374193` pour
l'API ; le digest Web reste celui de `1.14.0`, `nginx` n'ayant jamais été recréé par le Lot A).

**Ce que cette clôture n'autorise pas** : aucun code, migration, credential Twilio, promotion ou
déploiement. L'activation de tout canal externe en Production reste interdite jusqu'à la clôture
en GO du Sprint N+2 **complet** — Lot B (US-125) reste bloqué par les Gates 02A/04A Frontend
(`RSV-MIG-611-06`), sans rapport avec le pilote Keycloak EP-17 en cours sur une branche distincte.

**Documents modifiés** : `docs/cgpa/09-production/cloture-release-v1.15.0.md` (nouveau) ;
`docs/prod-state.md` (§0P, statut clôturé) ; `docs/project-state.md` (cette entrée). Aucune
modification applicative, aucune modification de realm, aucun redémarrage ni déploiement.

**Prochaine action autorisée** : instruction PO explicite et distincte pour le GO du Sprint N+2
complet (Lot B, US-125), seule voie vers l'activation d'un canal externe en Production (K8/ADR-18) ;
aucune autre action Production requise dans l'immédiat.

## 2026-08-04 — Tests de sécurité Lot 5 exécutés (pilote Keycloak EP-17 Lot 4)

**Instruction explicite reçue** : « continue le pilote Keycloak, lot 5 tests sécurité ». Chantier
distinct et sans rapport avec la clôture de release `1.15.0` ci-dessus (Production).

**Cadrage préalable** : le Plan d'Exécution (§12) précise explicitement que son approbation
« ne s'étend pas... aux Lots 5 et 6 — chacun reste un point de contrôle GO/NO GO distinct ». Ce
travail est traité comme de la **vérification/preuve** (aucun code, aucune modification de realm,
aucun déploiement), pas comme un développement du Lot 5 nécessitant sa propre extension de Plan —
cohérent avec les entrées précédentes de ce journal qui nommaient déjà cette exécution comme
« prochaine action autorisée ».

**Exécution réelle contre Staging** (`ai-test-server`, port interne `18443`, flux OIDC/PKCE réels,
aucun mock) : les 11 scénarios de sécurité du Plan §5, adaptés au périmètre confirmé à 6 écrans
(`invitation expirée` et Account Console restent hors périmètre, `DD-EP17-12`). Un utilisateur
éphémère créé/supprimé via l'API Admin pour les scénarios nécessitant un compte réel ; le mot de
passe réel de `bailleur-test` n'a jamais été consulté. Détail complet, résultats scénario par
scénario et méthode : `docs/cgpa/07-devsecops/security-tests-lot5-ep17-keycloak-theme.md`.

**Résultat : PASS — aucune régression de sécurité introduite par le thème.** Login invalide,
compte désactivé (cas mot de passe incorrect), reset expiré, session expirée (cookie absent) et
accès refusé (`redirect_uri` non enregistré) affichent tous des messages français génériques, sans
trace technique dans les 8 corps de réponse inspectés directement. Login valide confirme la
redirection réelle avec `code=`. Logout affiche l'écran de confirmation réel (thémé) lorsqu'une
session est active. Les 13 interdictions `ADR-UI-001` §Sécurité, déjà auditées statiquement le
2026-08-03, sont ici confirmées par un comportement dynamique réel identique à l'attendu.

**Constat clé, aggravant `DD-EP17-14` sans le requalifier** : soumettre le formulaire « mot de
passe oublié » avec un e-mail inexistant renvoie `HTTP 200` (succès générique, anti-énumération
correct) tandis qu'un e-mail réellement enregistré renvoie `HTTP 500` (panne SMTP déjà connue) —
cette **différence de code de statut** constitue un canal d'énumération de comptes, indépendant du
thème (comportement du backend Keycloak/SMTP), qui précise sans le changer le traitement déjà
décidé de `DD-EP17-14` (résolution SMTP reste la seule preuve attendue, suivi découplé du Lot 4,
PO 2026-08-02). Détail consigné dans `design-debt-register-loyertracker.md`.

**Limite tracée honnêtement** : le scénario « compte désactivé » n'a été testé qu'avec un mot de
passe incorrect (le mot de passe réel de `bailleur-test` n'a délibérément pas été consulté) — le
cas mot de passe correct sur un compte désactivé, où Keycloak pourrait afficher un message distinct
par défaut, reste une hypothèse non vérifiée sur ce realm.

**Ce que ce travail ne couvre pas** : les items plus larges du Lot 5 (§9 du Plan) — tests unitaires/
composants Angular, a11y automatisés, tests clavier exhaustifs, responsive formel, Visual Review,
régression visuelle, comparaison de bundle — restent `Non exécuté`. Cette exécution est une
vérification, **pas une décision de Gate** : elle ne prononce ni GO ni NO GO sur le Lot 5 ou le
Gate Staging du pilote.

**Documents modifiés** : `docs/cgpa/07-devsecops/security-tests-lot5-ep17-keycloak-theme.md`
(nouveau) ; `design-debt-register-loyertracker.md` (`DD-EP17-14`, constat d'aggravation ajouté) ;
`docs/project-state.md` (cette entrée). Aucune modification applicative, aucune modification de
realm, aucun déploiement — utilisateur de test éphémère créé puis supprimé via l'API Admin, aucun
résidu.

**Prochaine action autorisée** : le Product Owner statue sur le traitement de l'aggravation
constatée de `DD-EP17-14` (canal d'énumération, priorité déjà propre) ; les items plus larges du
Lot 5 (§9) restent disponibles à instruire ; Gate Staging du pilote et Gate Production restent des
actes distincts, non instruits par ce travail.

## 2026-08-04 — Arbitrage `DD-EP17-14` : canal d'énumération, aucun changement de traitement

**Instruction explicite reçue** : « statue sur DD-EP17-14, canal d'énumération de comptes »,
en réponse à l'aggravation constatée aux tests de sécurité du Lot 5 ci-dessus (différence de code
HTTP 200/500 selon qu'un e-mail est enregistré ou non).

**Trois options soumises au Product Owner** : (1) aucun changement de traitement — la résolution
SMTP déjà attendue referme aussi le canal d'énumération, sans action distincte ; (2) escalade de
criticité — reclassifier la dette comme un problème de confidentialité prioritaire, sans changer la
preuve attendue ; (3) mitigation intérimaire avant la résolution SMTP — uniformiser la réponse
(toujours `200` générique), ce qui aurait exigé une extension Java/SPI Keycloak hors du périmètre
du thème CSS-only du Lot 4, un engagement d'ingénierie distinct pour un correctif temporaire.

**Décision Product Owner** : **option (1), aucun changement de traitement**. `DD-EP17-14` reste
ouverte, priorité déjà propre et découplée du calendrier du Lot 4 (décision du 2026-08-02
inchangée) ; la **seule preuve attendue reste une configuration SMTP fonctionnelle** vérifiée par
un envoi réel réussi (fournisseur toujours à décider par le Product Owner). Le canal d'énumération
ne justifie ni escalade de criticité ni correctif intérimaire distinct : il se referme
automatiquement dès que le flux « mot de passe oublié » fonctionne réellement, puisque les deux
chemins (e-mail inexistant / e-mail réel) convergeront alors vers la même réponse de succès.

**Documents modifiés** : `design-debt-register-loyertracker.md` (`DD-EP17-14`, arbitrage ajouté) ;
`docs/project-state.md` (cette entrée). Aucune modification applicative, aucune modification de
realm, aucun déploiement — travail strictement documentaire.

**Prochaine action autorisée** : inchangée — attente d'une décision Product Owner sur le
fournisseur SMTP pour clore `DD-EP17-14` ; les items plus larges du Lot 5 (§9) et le Gate Staging
du pilote restent disponibles à instruire séparément.

## 2026-08-04 — Gate Staging du pilote Keycloak — GO sous réserve

**Instruction explicite reçue** : « instruis le Gate Staging du pilote », suivie du choix explicite
« GO sous réserve » sur la checklist et les avis proposés soumis. Distinct du Gate Staging du
pilote Angular (Lots 1-3), non couvert ici — les deux restent des Gates séparés
(`plan-execution-ux-ui-primeng-keycloak.md` §10).

**Checklist rebâtie depuis les réserves de `gate-04A-decision-ep17-lot4.md` §11** : les quatre
réserves alors ouvertes (`DD-EP17-03`, `DD-EP17-13`, audit sécurité `ADR-UI-001`, `STG-ISOL-01`)
sont désormais toutes **PASS** — closes ou exécutées entre le 2026-08-03 et le 2026-08-04 (thème
câblé, locale française, audit statique 13/13 RAS, `STG-ISOL-01` live PASS, puis confirmées
dynamiquement par les 8 scénarios réels du Lot 5). Deux réserves nouvelles, plus fines, restent
ouvertes : validation Product Owner du **contenu** de `phase-02-user-journeys-ep17-lot4.md`/
`phase-02-ui-mockups-ep17-lot4.md` (jamais obtenue à ce jour, distincte de toute décision de Gate
déjà rendue) ; `CHECK-FRONTEND-01` de remplacement (artefact FreeMarker/CSS) toujours à instancier
formellement.

**Avis proposés** (Claude Code dans les rôles CGPA désignés, limite d'indépendance déjà tracée) :
Design Architect et UX/UI Design Lead **GO sous réserve** (contenu à valider) ; Frontend Architect
**GO sous réserve** (`CHECK-FRONTEND-01` à instancier) ; DevSecOps Lead **GO sans réserve**
(toutes les réserves de sécurité du Gate 04A désormais satisfaites et confirmées dynamiquement).

**Décision Product Owner : GO SOUS RÉSERVE.** La promotion Staging du thème Keycloak (6 écrans
confirmés) est validée — aucune modification OIDC/PKCE/realm, 13 interdictions de sécurité
respectées et confirmées dynamiquement, `STG-ISOL-01` PASS, fonctionnement réel vérifié, français
confirmé, aucune fuite d'information, smoke 63/0. Les deux réserves ci-dessus restent ouvertes et
non bloquantes, tracées explicitement pour traitement ultérieur sur instruction PO distincte.
`DD-EP17-14` (canal d'énumération, arbitré le même jour) reste hors du périmètre bloquant de ce
Gate. Décision : `docs/cgpa/design/decisions/gate-staging-decision-ep17-lot4-pilote-keycloak.md`.

**Ce que ce GO n'autorise pas** : aucune promotion Production (Gate Production distinct requis,
instruction PO explicite nécessaire) ; aucune extension à l'Account Console ni à l'acceptation
d'invitation (`DD-EP17-12`) ; aucune clôture du Lot 5 dans son ensemble (items non-Keycloak — a11y
automatisé, responsive formel, tests Angular, Visual Review, bundle — restent `Non exécuté`).

**Documents modifiés** : `docs/cgpa/design/decisions/gate-staging-decision-ep17-lot4-pilote-keycloak.md`
(nouveau) ; `docs/project-state.md` (cette entrée). Aucune modification applicative, aucune
modification de realm, aucun déploiement — travail strictement documentaire, aucune action sur
l'hôte Staging au-delà de la lecture des preuves déjà produites.

**Prochaine action autorisée** : Gate Production distinct si une promotion Production du pilote
Keycloak est souhaitée (hors périmètre CGPA immédiat pour un pilote sans Account Console) ; sinon,
traitement des deux réserves ouvertes (contenu, `CHECK-FRONTEND-01`) ou poursuite des items plus
larges du Lot 5, sur instruction PO.

## 2026-08-04 — Gate Production du pilote Keycloak — GO sous réserve

**Instruction explicite reçue** : « instruis le Gate Production du pilote Keycloak », suivie du
choix explicite « GO sous réserve » sur la checklist et les avis proposés soumis. Le Plan
d'Exécution déclare ce Gate « hors périmètre... phase ultérieure » (§10) : aucun critère n'y était
pré-écrit — cette instance construit une checklist adaptée à la nature réelle du changement
(thème/config, aucun code applicatif, aucune migration), plutôt que de réutiliser telle quelle la
grille des releases applicatives (Flyway, tag SemVer, verrou `R-V54-2`, tous non concernés ici).

**Relevé live de l'état Production effectué avant construction du dossier** (2026-08-04 16:39 UTC) :
8/8 conteneurs `Up`/`healthy`, mais **le thème n'y est pas monté** dans le conteneur `keycloak` en
cours d'exécution, `loginTheme` toujours par défaut, `internationalizationEnabled=false` — la
Production n'a reçu aucun des changements du Lot 4 à ce jour. Dépôt hôte à `162154e`, très en
retard sur `main` (`793be85`).

**Checklist** : même artefact immutable entre Staging et Production confirmé (`git diff` vide entre
le commit de validation Staging `3ef7d06` et `main` sur les fichiers de thème/script/compose) ;
câblage Docker Production déjà mergé et vérifié le 2026-08-03 ; aucune modification OIDC/PKCE/realm ;
13 interdictions de sécurité respectées et confirmées dynamiquement (Lot 5) ; plan de rollback
simple (retour à `loginTheme=keycloak`, aucune donnée en jeu). Trois éléments encore `Non exécuté`,
mais relevant du **Préflight** (étape distincte, pas de ce Gate) : sauvegarde préalable,
synchronisation du dépôt hôte. Les deux réserves déjà ouvertes au Gate Staging restent ouvertes :
validation Product Owner du **contenu** des parcours/maquettes (plus consequente ici — utilisateurs
réels) ; `CHECK-FRONTEND-01` de remplacement à instancier.

**Avis proposés** (Claude Code dans les 4 rôles CGPA désignés) : Design Architect, UX/UI Design
Lead, Frontend Architect et DevSecOps Lead — **tous GO sous réserve**.

**Décision Product Owner : GO SOUS RÉSERVE.** La promotion Production est validée sur le plan
technique et sécurité. Les réserves opérationnelles (sauvegarde, synchronisation du dépôt hôte)
restent à lever au Préflight ; les deux réserves héritées du Gate Staging (contenu,
`CHECK-FRONTEND-01`) restent ouvertes et non bloquantes pour ce GO, tracées explicitement.
`DD-EP17-14` reste hors du périmètre bloquant de ce Gate. Décision :
`docs/cgpa/design/decisions/gate-production-decision-ep17-lot4-pilote-keycloak.md`.

**Ce que ce GO n'autorise pas** : aucun Préflight, aucune sauvegarde, aucun déploiement technique —
ces étapes restent des actions PO distinctes et postérieures. Aucune extension à l'Account Console
ni à l'acceptation d'invitation. Aucune résolution de `DD-EP17-14` par cette décision.

**Documents modifiés** : `docs/cgpa/design/decisions/gate-production-decision-ep17-lot4-pilote-keycloak.md`
(nouveau) ; `docs/project-state.md` (cette entrée). Aucune modification applicative, aucune
modification de realm, aucun déploiement — un relevé en lecture seule effectué sur l'hôte Production
pour construire le dossier, aucune écriture.

**Prochaine action autorisée** : instruction PO explicite et distincte pour le Préflight (sauvegarde
+ synchronisation du dépôt hôte), préalable à tout déploiement technique du thème en Production.

## 2026-08-04 — Préflight du pilote Keycloak exécuté — PASS

**Instruction explicite reçue** : « instruis le Préflight du pilote Keycloak », sur la base du Gate
Production GO sous réserve ci-dessus.

**Sauvegarde préalable** (`infra/backup/backup-postgres.sh`, strictement en lecture seule côté
application) : `loyertracker-20260804-175158.dump` (865 286 octets, SHA-256 `8a4bfa28…`) +
`.globals.sql` (1 108 octets, SHA-256 `f7265063…`), permissions 600, `pg_restore --list` vérifié
par le script, heartbeat Pushgateway poussé avec succès.

**Synchronisation du dépôt hôte** : `git pull --ff-only origin main`, fast-forward propre de
`162154e` (très en retard, ~106 commits) à `5eb5187` (= `origin/main`), aucun fichier tracké en
conflit. Amène l'ensemble de la documentation EP-17 et le câblage `docker-compose.prod.yml` du
thème, ainsi que des changements Frontend/Backend d'EP-17 Lots 1-3 (pilote Angular, hors périmètre
de ce déploiement) — **sans effet sur les conteneurs en cours d'exécution**, les images `api`/`web`
restant épinglées par digest dans `.env` indépendamment du contenu du dépôt.

**Configuration Compose fusionnée** : `docker compose -f docker-compose.yml -f
docker-compose.prod.yml config` — exit 0, montage du thème et service `keycloak-theme-init`
confirmés présents, revérifié **après** la synchronisation (pas seulement avant, le 2026-08-03).

**Stack Production inchangée tout au long de l'opération** : 8/8 conteneurs `Up`, 4/4 `(healthy)`,
tous à `Up 2 hours` sans redémarrage ni recréation ; site public `200`. **Aucune commande `docker
compose up` exécutée** — le thème n'est toujours pas monté dans le conteneur `keycloak` en cours
d'exécution, comme attendu à ce stade.

**Verdict : PASS.** Détail complet :
`docs/cgpa/09-production/preflight-ep17-lot4-pilote-keycloak-report.md`.

**Documents modifiés** : `docs/cgpa/09-production/preflight-ep17-lot4-pilote-keycloak-report.md`
(nouveau) ; `docs/project-state.md` (cette entrée). Sur l'hôte : dépôt synchronisé (fast-forward),
une sauvegarde ajoutée (hors dépôt, jamais versionnée) — aucune autre écriture, aucun conteneur
touché.

**Prochaine action autorisée** : instruction PO explicite et distincte pour le déploiement
technique (recréation ciblée de `keycloak` + exécution de `keycloak-theme-init`, `api`/`nginx`/
`postgres` non touchés), suivie d'une vérification réelle de l'écran de connexion en Production.

## 2026-08-04 — Déploiement technique du pilote Keycloak en Production — `KEYCLOAK_THEME_DEPLOYED`

**Instruction explicite reçue** : « instruis le déploiement technique du pilote Keycloak », sur la
base du Préflight PASS ci-dessus.

**Snapshot avant** relevé (16:59 UTC) : 8/8 conteneurs `Up`/`healthy`, digests `api`/`nginx`
identiques à `.env` (`sha256:9603330e…`/`sha256:7dbc551e…`, aucun override nécessaire cette fois),
fichiers de realm sans modification locale.

**Déploiement ciblé exécuté** : `docker compose -f docker-compose.yml -f docker-compose.prod.yml
up -d keycloak keycloak-theme-init` — **`keycloak` recréé** (nouveau montage du thème),
**`keycloak-theme-init` exécuté** (`ExitCode=0`, log confirmant activation `loginTheme` puis locale
française). `api`/`nginx`/`postgres` et les 4 services `monitoring` **non touchés** :
`StartedAt` identique avant/après pour les trois premiers, `Status` inchangé pour les seconds
(l'avertissement Compose « orphan containers », dû à l'invocation ciblée, n'a entraîné aucune
suppression — vérifié).

**État du realm après activation** : `loginTheme=loyertracker`, `internationalizationEnabled=true`,
`supportedLocales=["fr"]`, `defaultLocale=fr` — exclusivement via l'API Admin, **aucune modification
de fichier de realm** (`git status --short` vide avant et après sur les deux fichiers).

**Vérification réelle de l'écran de connexion Production** (flux OIDC/PKCE réel, port interne
`18443`, aucun mock) : `HTTP 200`, `<html lang="fr">`, titre « Connectez-vous à votre compte »,
`login.css`/`card-pf` confirmés (thème appliqué), aucun sélecteur de langue (cohérent, une seule
locale). **Résultat identique à la vérification Staging du 2026-08-03**, cette fois sur le realm
Production réel. Site public `https://loyertracker.loyerpro.org` → `200`.

**Verdict : `KEYCLOAK_THEME_DEPLOYED` — 2026-08-04 ~17:00 UTC.** Détail complet :
`docs/cgpa/09-production/deploiement-technique-ep17-lot4-pilote-keycloak-report.md`. `DD-EP17-01`
et `DD-EP17-13` (déjà closes sur preuve Staging) sont désormais également **vérifiées en Production
réelle**.

**Ce que ce déploiement ne change pas** : `DD-EP17-14` (mot de passe oublié cassé, SMTP absent)
reste un défaut préexistant et actif en Production, indépendant de ce déploiement — non aggravé, non
masqué (mécanisme Keycloak sous-jacent identique à celui déjà observé en Staging au Lot 5). Ce
déploiement **n'est pas une release applicative** : aucun `PRODUCTION_DEPLOYED` au sens du verrou
`R-V54-2`, `infra/release/production-state.env` non concerné, pas d'hypercare T0/T+12/T+24 formelle
requise pour ce type de changement thème/config.

**Documents modifiés** :
`docs/cgpa/09-production/deploiement-technique-ep17-lot4-pilote-keycloak-report.md` (nouveau) ;
`docs/project-state.md` (cette entrée). Sur l'hôte : `keycloak` recréé, `keycloak-theme-init`
exécuté puis sorti — aucune autre écriture, aucun fichier de realm modifié.

**Prochaine action autorisée** : surveillance courte de l'écran de connexion réel (non formelle,
sans rapport avec le cycle d'hypercare des releases) ; traitement des deux réserves héritées des
Gates (validation PO du contenu, `CHECK-FRONTEND-01`) sur instruction PO ; `DD-EP17-14` reste suivie
séparément.

## 2026-08-04 — Traitement des deux réserves héritées des Gates du pilote Keycloak

**Instruction explicite reçue** : « traite les deux réserves ouvertes ».

**Réserve 1 — `CHECK-FRONTEND-01` de remplacement : instanciée et RÉSOLUE.**
`docs/cgpa/checklists/CHECK-FRONTEND-01-ep17-lot4-keycloak-theme.md` — checklist de remplacement
adaptée à un artefact FreeMarker/CSS statique (le gabarit Angular original ne s'applique pas :
aucune architecture par domaines, aucun routing, aucun bundle applicatif à mesurer). 9 contrôles :
7 PASS (aucune surcharge FreeMarker, source de tokens partagée sans duplication non disciplinée,
0 `!important`, aucun script/CDN externe, poids négligeable 12 Ko, 13 interdictions de sécurité
RAS, stratégie de test réelle démontrée à 3 reprises), 2 « Préparation en cours » non bloquantes
(audit WCAG 2.2 AA formel, mesure responsive dédiée — risque borné par construction : seul le CSS a
changé, jamais le HTML/FreeMarker). **Résultat agrégé : PASS SOUS RÉSERVE** — la réserve Frontend
Architect des Gates 04A/02A/Staging/Production du Lot 4 est levée par cette instance.

**Réserve 2 — validation Product Owner du contenu des parcours/maquettes : avis proposé rendu,
validation PO explicite requise.** Une section « Avis de validation » a été ajoutée à
`phase-02-user-journeys-ep17-lot4.md` et `phase-02-ui-mockups-ep17-lot4.md` (rôle UX/UI Design
Lead désigné), recoupant chaque parcours/maquette avec l'implémentation réelle vérifiée en
Production (`KEYCLOAK_THEME_DEPLOYED`) : **aucun écart matériel constaté** — les 4 parcours et les
4 familles de maquettes décrits sont ceux effectivement construits, à une différence mineure près
(formulation exacte du message d'erreur de connexion, traduction Keycloak native utilisée plutôt
qu'une chaîne réécrite, cohérent avec `DD-EP17-13`). **Cet avis proposé ne vaut pas validation —
la validation humaine du contenu reste au Product Owner**, conformément à `CLAUDE.md`.

**Documents modifiés** : `docs/cgpa/checklists/CHECK-FRONTEND-01-ep17-lot4-keycloak-theme.md`
(nouveau) ; `docs/cgpa/phases/phase-02-user-journeys-ep17-lot4.md` (§6, avis ajouté) ;
`docs/cgpa/phases/phase-02-ui-mockups-ep17-lot4.md` (§7, avis ajouté) ; `docs/project-state.md`
(cette entrée). Aucune modification applicative, aucune modification de realm, aucun déploiement.

**Prochaine action autorisée** : Product Owner statue explicitement sur la validation du contenu
des deux documents (accepte l'avis proposé, ou demande des ajustements) — seule action requise pour
clore intégralement les deux réserves héritées des Gates.

### Validation Product Owner du contenu — obtenue (2026-08-04)

**Instruction explicite reçue** : « je valide le contenu ». **Décision Product Owner : contenu de
`phase-02-user-journeys-ep17-lot4.md` et `phase-02-ui-mockups-ep17-lot4.md` validé, sans réserve.**

**Les deux réserves héritées des Gates du pilote Keycloak (Staging et Production) sont désormais
intégralement closes** : `CHECK-FRONTEND-01` de remplacement (PASS sous réserve, ci-dessus) et
validation PO du contenu (ci-dessus) — les deux seuls points encore ouverts au moment de ces Gates.
Ne restent hors de ce périmètre : `DD-EP17-14` (mot de passe oublié cassé, SMTP absent, suivi
séparé, aucun changement de traitement) et les deux réserves non bloquantes de
`CHECK-FRONTEND-01-ep17-lot4-keycloak-theme.md` elles-mêmes (audit WCAG formel, mesure responsive
dédiée — non issues des Gates, propres à cette checklist).

**Documents modifiés** : `docs/project-state.md` (cette entrée). Aucune modification applicative,
aucune modification de realm, aucun déploiement.

**Prochaine action autorisée** : aucune action Production requise dans l'immédiat pour le pilote
Keycloak — le cycle Gate Staging → Gate Production → Préflight → déploiement technique → réserves
est intégralement clos. Suite possible sur instruction PO : Lot 5 plus large (a11y/responsive/tests
Angular), Lot 6 (extension progressive), ou décision sur le fournisseur SMTP (`DD-EP17-14`).

## 2026-08-04 — Cadrage documentaire EP-18 : canal EMAIL via Resend (Phases 1-3, aucun codage)

**Instruction PO** : intégrer Resend comme fournisseur d'e-mails transactionnels, sans architecture
parallèle au sous-système notifications EP-16 déjà livré, premier usage : e-mail d'invitation
gestionnaire. Mission strictement documentaire à ce stade — **aucun code, aucune migration, aucun
déploiement**.

**Phase 1 — Audit** : CGPA v6.1.1 confirmé actif (pas d'hypothèse v5.4.1), phase 7 (développement
contrôlé), Production `1.15.0` clôturée le 2026-08-04, `NoopNotificationProvider` seul actif en
Production (aucun canal externe n'a jamais envoyé de message réel). Constats du prompt de mission
vérifiés conformes au code réel (`CanalNotification` sans `EMAIL`, `NotificationProvider.DemandeEnvoi`
couplé à `phoneE164`, `InvitationService.inviter` ne notifie personne). Écarts supplémentaires
trouvés à l'audit, non anticipés par le prompt : `NotificationDispatcher` ne porte structurellement
qu'un seul bean fournisseur actif à la fois (blocage mécanique pour un second fournisseur) ;
`Invitation.email` existe déjà (source de vérité directe, sans duplication) ; le destinataire d'une
invitation n'a aucun compte donc aucune `NotificationPreference` possible ; 4 contraintes `CHECK`
PostgreSQL câblées en dur `('WHATSAPP','SMS')` (V27) ; `RgpdService` ne couvre déjà aucune entité
`notification_*` (dette préexistante, non aggravée) ; aucune UI d'invitation n'existe (API-only).
Prochaine numérotation libre vérifiée : `ADR-19`, `EP-18`, `US-135`, migration `V30`. Verdict : **GO
DOCUMENTATION**.

**Phase 2 — Proposition d'architecture** : extension du pipeline existant (Event → Outbox →
Dispatcher → Provider), sans `EmailService` parallèle. Généralisation `NotificationProvider` en
`ChannelNotificationProvider` (résolution par `Map<CanalNotification, Provider>`), `Twilio` non
scindé (`canaux()={WHATSAPP,SMS}`). Nouvelle voie de fan-out « transactionnelle » (sans préférence,
adresse résolue à l'émission) distincte de la voie préférence existante, pour couvrir le cas
invitation (aucun compte, donc aucun opt-in à recueillir) — décision de conception non dictée
littéralement par le prompt, présentée comme recommandation motivée. Cinq points ouverts (K1→K5,
webhooks/pièce-jointe/budget/source de vérité e-mail/fallback) tranchés par recommandation par
défaut sur instruction explicite du PO (« enchaîne avec tes recommandations par défaut »), à
confirmer formellement au Plan d'Exécution.

**Phase 3 — Documentation CGPA additive produite** (aucune modification de document historique) :

- `docs/cgpa/05-architecture-conception/adr/ADR-19-notifications-email-resend.md` (Proposée,
  D-NOTIF-002, kickoff K1→K5, registre RSV-EP18-01→05)
- `docs/cgpa/02-expression-besoin/addendum-notifications-email-resend.md` (BF-112→BF-115)
- `docs/cgpa/04-cahier-des-charges/addendum-notifications-email-resend.md` (EF-125→134, ENF-98/99,
  RM-124→127, TC-130→143, matrice de traçabilité, maturité 14/20)
- `docs/cgpa/05-architecture-conception/dossier-architecture.md` §3.6 (extension additive — ne clôt
  **pas** `RSV-MIG-611-04`, addendum DAT EP-16 distinct toujours ouvert)
- `docs/cgpa/06-planification-agile/analyse-impact-ep18-notifications-email-resend.md`
- `docs/cgpa/06-planification-agile/addendum-backlog-ep18-notifications-email-resend.md` (Epic
  EP-18, US-135→140, 49 points)
- `docs/cgpa/07-devsecops/runbook-resend.md` (anticipé — aucun code livré à ce jour)
- `docs/project-state.md` (cette entrée)

Conformément au précédent déjà observé pour EP-16/`QUITTANCE_HMAC_SECRET`, **aucune variable
`RESEND_*` n'est ajoutée à `.env.example`/Compose à ce stade** — uniquement au moment de
l'implémentation réelle (Sprint A).

**Prochaine action autorisée** : Phase 4 (Plan d'Exécution détaillé, découpage Sprint A/B/C,
décision CDO GO/GO sous réserve/NO GO pour démarrer le codage) — aucun codage engagé avant GO
explicite du PO sur ce plan, conformément aux verrous CLAUDE.md/AGENTS.md.

## 2026-08-04 — Phase 4 (Plan d'Exécution) et Sprint A EP-18 implémenté sur branche dédiée

**Phase 4** : Plan d'Exécution détaillé présenté (Sprint A socle / Sprint B invitation / Sprint C
webhooks reporté), checklist des critères de GO (mission §16) vérifiée — K1→K5 restent des
recommandations, non des décisions PO formelles. Décision CDO proposée : **GO SOUS RÉSERVE**
(aucune activation possible dans aucun environnement tant que Sprint A/B ne dépassent pas
`RESEND_EMAIL_ENABLED=false`). **Instruction PO explicite reçue : « GO, démarre le Sprint A »**
(seul le Sprint A, pas B/C).

**Sprint A implémenté** sur branche dédiée `feat/ep18-notifications-email-resend` (créée depuis
`main` synchronisée, jamais d'écriture directe sur `main`) :

- Migration `V30__ep18_sprint_a_email_resend_fondation.sql` : 4 contraintes `CHECK` élargies
  (`notification_outbox`/`notification_delivery`/`notification_template.channel`,
  `notification_preference.preferred_channel`) pour admettre `EMAIL` ; colonnes additives
  `notification_outbox.recipient_address`, `notification_preference.email`/`email_opt_in`,
  `notification_template.subject`/`html_body`/`text_body`. `FLYWAY_EXPECTED_REPO` porté à 30
  (`infra/release/production-state.env`) — `FLYWAY_EXPECTED_PROD` inchangé (29, rien de déployé).
- `CanalNotification.EMAIL` ajouté ; `ChannelNotificationProvider` (nouvelle interface,
  `Set<CanalNotification> canaux()`) généralise l'ancien bean unique `NotificationProvider` du
  dispatcher en `Map<CanalNotification, ChannelNotificationProvider>` — `TwilioNotificationProvider`
  non scindé (`canaux()={WHATSAPP,SMS}`), changement mécanique uniquement
  (`demande.phoneE164()` → `demande.destinataire().address()`).
- `com.loyertracker.notifications.provider.resend` (nouveau package) : `ResendEmailProvider`
  (API HTTPS Resend, `RestClient`, aucun SDK, classification 4xx/429/5xx identique au patron
  Twilio, échappement HTML des variables, détection de variable manquante avant tout appel réseau)
  et `NoopEmailProvider`, exclusion mutuelle par `app.notifications.email.enabled`
  (`RESEND_EMAIL_ENABLED`, `false` par défaut).
- `NotificationDispatcher` : résolution du fournisseur par canal (`indexerParCanal`, échec de
  configuration détecté par exception si deux fournisseurs revendiquent le même canal) ; nouvelle
  branche « voie transactionnelle » (`recipient_address` non nul → aucune `NotificationPreference`
  consultée) coexistant avec la voie préférence existante, inchangée pour WhatsApp/SMS.
- `NotificationOutbox`/`NotificationPreference`/`NotificationTemplate`/`NotificationDelivery` :
  champs additifs correspondants ; `NotificationDelivery.provider` (corrigé d'un codage en dur
  `"TWILIO"` vers une résolution par canal `WHATSAPP/SMS→TWILIO`, `EMAIL→RESEND`) — défaut latent
  découvert et corrigé à l'implémentation, sans impact avant ce Sprint (aucune ligne EMAIL
  n'existait).
- **Écart documenté par rapport à l'ADR-19 initiale** : colonne `notification_preference.email_opt_in`
  ajoutée (non explicitée dans la version initiale de l'ADR) — nécessaire par symétrie avec
  `whatsapp_opt_in`/`sms_opt_in` pour que `estEligiblePour(EMAIL)` soit définissable ; ADR-19 et
  addendum CDC mis à jour en conséquence (additif).
- **RSV-EP18-04 (budget EMAIL dédié) non implémenté dans ce Sprint** — décision assumée : aucune
  ligne EMAIL ne peut exister tant que `RESEND_EMAIL_ENABLED=false`, donc aucun risque réel de
  dérive budgétaire à ce stade ; à résoudre avant toute activation Staging avec volume réel.
  Consigné comme réserve ouverte, pas un oubli silencieux.
- Tests ajoutés : `ResendEmailProviderTest` (9, serveur HTTP simulé `MockRestServiceServer` —
  adresse invalide, gabarit vide, variable manquante, échappement HTML, 429/401/5xx, `canaux()`),
  `NoopEmailProviderTest` (1), 4 tests EP-18 dans `NotificationDispatchIntegrationTest` (voie
  transactionnelle sans préférence, voie préférence EMAIL symétrique WhatsApp/SMS, absence de
  préférence ⇒ `DEAD`, canal sans fournisseur ⇒ `DEAD`/`PROVIDER_INDISPONIBLE`).
  `NotificationFondationIntegrationTest` adapté (injection `List<ChannelNotificationProvider>` au
  lieu d'un bean unique, ambigu depuis l'ajout des beans EMAIL) sans changer l'assertion de fond.

**Preuves d'exécution** (locale, avant CI) :
- Suite notifications ciblée : **57/57 PASS** (34 tests d'intégration notifications existants +
  nouveaux, 13 `SchemaMigrationTest` avec `V30` appliquée et validée, 10 tests unitaires Resend/Noop).
- **Suite backend complète : 234/234 PASS, 0 échec, `BUILD SUCCESS`** — aucune régression sur
  RGPD, invitations (génération/acceptation), quittances certifiées, garanties, patrimoine,
  sécurité/RLS, alertes/audit.

**Documents modifiés** (Sprint A, additifs) : `ADR-19-notifications-email-resend.md` (statut mis à
jour, §Modèle précisé, RSV-EP18-04 clarifiée), `addendum-backlog-ep18-notifications-email-resend.md`
(statut Sprint A fusionné). Aucun document historique altéré.

**Réserves explicites avant Sprint B/toute promotion** : K1→K5 à confirmer formellement par le PO ;
RSV-EP18-04 (budget dédié) à implémenter avant tout volume réel en Staging ; RSV-EP18-02 (isolation
des deux voies) testée en Sprint A mais à re-vérifier en conditions Staging réelles au Sprint B.

**Prochaine action autorisée** : rester sur la branche dédiée, ouvrir une Pull Request en draft
(documentant périmètre/migration/secrets/tests/risques/éléments reportés) — **aucun push ni
ouverture de PR sans instruction explicite distincte du PO**, conformément à CLAUDE.md/AGENTS.md.
Sprint B (invitation par e-mail) reste soumis à un GO distinct, non inclus dans ce GO.
