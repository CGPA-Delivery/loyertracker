# Checklist de ré-instruction — Gate Staging Sprint N+2 (EP-16 Lot A)

> Instancie `docs/cgpa/checklists/gate-staging-checklist.md` et
> `docs/cgpa/checklists/stg-isol-01-checklist.md` pour l'étape 5 du chemin de remédiation défini
> dans `gate-staging-sprint-n2-ep16-decision.md`. Document préparatoire : aucune case n'est cochée
> tant que la preuve correspondante n'est pas produite au moment de la ré-instruction réelle.
> Ce document ne constitue ni une décision ni une autorisation — seule une nouvelle instruction du
> Gate, consignée dans le dossier de décision, vaut engagement.

| Champ | Valeur |
|---|---|
| Sprint | EP-16 Sprint N+2 Lot A (US-124, US-126 — US-125 hors périmètre) |
| Dossier de décision de référence | `gate-staging-sprint-n2-ep16-decision.md` — NO GO du 2026-07-28 |
| Candidat | commit `ac374193` (`main`), images `sha-ac374193` (api, web) |
| Environnement | `ai-test-server` — Staging mutualisé |

## Pré-requis à lever avant d'ouvrir la ré-instruction

Ces trois points ne sont **pas des cases de checklist standard** : ce sont les conditions propres à
ce Sprint qui doivent être actées **avant** de commencer l'exécution de la checklist ci-dessous.

- [x] **Confirmation PO — capacité SMS.** Confirmée le 2026-07-29 : `+19379825074` est la capacité
      destinée à US-124 ; arbitrage retenu **Option A (Trial + destinataire vérifié)** ; discrépance
      du 2026-07-28 considérée superseded par cette confirmation. Cf. addendum du 2026-07-29 dans le
      dossier de décision. **Reste ouvert :** ajout effectif du/des destinataire(s) aux Verified
      Caller IDs Twilio, non encore constaté.
- [x] **Avis Enterprise Architect — `RSV-MIG-611-04`.** Rendu le 2026-07-29 dans
      `dossier-architecture.md` §11 : aucun endpoint nouveau (contrairement à l'hypothèse initiale
      du Plan), fonction SQL V29 conforme au patron `SECURITY DEFINER` déjà établi, décision
      OpenAPI rendue (dette pré-existante, non aggravée, non bloquante). **Reste ouvert :**
      consolidation par le CDO humain avant clôture formelle de la réserve dans
      `docs/project-state.md` (opinion spécialisée, pas une décision de Gate).
- [ ] **Décision sur `RSV-STG-N2-01`.** `FLYWAY_EXPECTED` diverge entre `--ci` (29, dépôt) et
      `--host` (28, Production réelle tant que ce lot n'est pas déployé). Confirmer que
      l'opérateur exécutant `check-release-state.sh --host` sait interpréter cette dérive comme
      **attendue** et non comme un incident, ou appliquer le correctif
      `FLYWAY_EXPECTED_REPO`/`FLYWAY_EXPECTED_PROD` avant de poursuivre.

## Contrôle d'entrée — verrou d'état de release (R-V54-2)

- [ ] `bash infra/release/check-release-state.sh --ci` — exit 0, ré-exécuté sur l'état courant du
      dépôt (déjà PASS à l'instruction du 2026-07-28 ; à revérifier, `main` ayant avancé).
- [ ] `infra/release/production-state.env` à jour si ce lot modifie l'état Production attendu.

## Identification

- [x] Sprint identifié — EP-16 Sprint N+2 Lot A.
- [x] Plan d'Exécution approuvé — `plan-execution-ep16-notifications.md` §Sprint N+2.
- [x] Rapport d'exécution Sprint disponible — PR #291 (fusionnée) + CHANGELOG.
- [x] Commit/artefact candidat identifié — `ac374193`, images `sha-ac374193` (api, web) publiées et
      digests relevés (cf. addendum du 2026-07-29).
- [x] Environnement Staging identifié — `ai-test-server`.

## Critères Sprint

- [x] Stories terminées listées — US-124, US-126 (220 tests, 0 échec).
- [x] Stories exclues listées — US-125, exclusion tracée et légitime (Gates 02A/04A, `RSV-MIG-611-06`).
- [ ] Écarts au plan acceptés — à reconfirmer au moment de la ré-instruction (périmètre inchangé
      depuis le 2026-07-28 sauf fusion/publication).
- [x] Validation Product Owner obtenue — GO Sprint N+2 explicite du 2026-07-28 (distinct du GO
      d'entrée en Gate, qui reste NO GO).
- [ ] Validation Release Manager obtenue pour la promotion elle-même — **non obtenue**, objet de la
      ré-instruction.

## Contrôles DevSecOps

- [x] Build stable — `mvn -B verify` exit 0.
- [x] Tests unitaires et d'intégration — 220 tests, 0 échec/erreur (preuve locale et CI PR #291).
- [x] Contrôles secrets/SCA/SAST/images — gitleaks, SCA, Trivy, CodeQL ×3, Registry Policy PASS
      (post-fusion `main`, run déclenché par le merge du 2026-07-29).
- [x] SonarQube — Quality Gate `OK` après correctif `S125` (`b0e97b0`).
- [x] Migrations DB vérifiées (dépôt) — V29 additive, Flyway 29/29 en test local ; **divergence
      `--host` attendue tant que non déployé — cf. `RSV-STG-N2-01` ci-dessus**.
- [x] Secrets non exposés — aucun credential versionné, `TWILIO_SMS_FROM` vide ⇒ refus `PERMANENT`.

## Déploiement Staging

- [x] Rollback Staging identifié — `sha-27dce09d` (`1.14.0`), rollback applicatif seul viable.
- [x] Tag immuable `sha-<8>` identifié — `sha-ac374193` (api, web), digests relevés.
- [ ] Smoke tests Staging prévus — planifier avec `BASE=https://localhost:18443` ; **aligner le
      compteur Flyway attendu du smoke avant d'exécuter**, faute de quoi le smoke reflétera l'écart
      documenté dans `RSV-STG-N2-01`.
- [ ] `docs/staging-state.md` prêt à être mis à jour — à faire au moment du déploiement effectif.
- [ ] Déploiement strictement ciblé au service `api` — **aucun changement Web dans ce lot** ; ne pas
      redéployer `web` sans motif distinct.

## Isolation Staging (`STG-ISOL-01`)

> Checklist détaillée : `docs/cgpa/checklists/stg-isol-01-checklist.md`. À exécuter avant **et**
> après le déploiement — SSH par IP privée `172.31.11.102`, Compose `-f docker-compose.staging.yml`
> **seul** (jamais base+overlay), aucune commande Docker globale, aucun `down` non ciblé, aucun
> `prune` global.

- [ ] Nom de projet Compose explicite et unique vérifié.
- [ ] Réseaux et volumes dédiés au projet vérifiés (namespace Docker).
- [ ] Absence de conflit de ports avec les autres projets hébergés vérifiée.
- [ ] Reverse proxy mutualisé : publication par nom DNS confirmée, aucune modification de la
      configuration des autres projets.
- [ ] Absence de commande Docker globale dans le pipeline et les procédures de déploiement vérifiée.
- [ ] État des conteneurs/réseaux/volumes tiers relevé **avant** déploiement.
- [ ] État des conteneurs/réseaux/volumes tiers relevé **après** déploiement — identique à l'avant.
- [ ] Contrôle `STG-ISOL-01` exécuté : verdict **PASS** ou **FAIL** consigné.
- [ ] Si `FAIL` : Gate Staging **NO GO**, sauf exception explicite, motivée, datée, inscrite par le
      Release Manager.

## Vérification fonctionnelle spécifique au Lot A

- [ ] Destinataire(s) de test ajouté(s) aux « Verified Caller IDs » de la console Twilio (Option A
      confirmée par le PO le 2026-07-29) — préalable obligatoire au point suivant.
- [ ] Fallback SMS observé au moins une fois vers ce destinataire vérifié (conditions Trial,
      préfixe « Sent from a Twilio trial account » accepté par le PO).
- [ ] Kill switch et plafond testés en Staging (pas seulement en local/CI).
- [ ] Aucune activation de canal externe ni credential Twilio introduit en configuration Production
      (K8 / ADR-18 inchangé tant que le Sprint N+2 n'est pas clos en GO).

## Décision

- [ ] Décision GO, GO sous réserve ou NO GO formulée par le Release Manager / CDO.
- [ ] `STG-ISOL-01` = `PASS` (ou exception tracée) — requis pour toute décision GO/GO sous réserve.
- [ ] Statut `STAGING_READY` renseigné si le Gate est validé.
- [ ] Date de déploiement Staging renseignée après déploiement.
- [ ] Statut `STAGING_DEPLOYED` renseigné après déploiement effectif.
- [ ] Éligibilité Production indiquée — Gate Production distinct, non préjugé par ce document.
