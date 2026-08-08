# Changelog — LoyerTracker

Toutes les évolutions notables de ce projet sont consignées dans ce fichier.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et le projet adhère au
[Semantic Versioning](https://semver.org/lang/fr/) (D-REL-002, CGPA v6.1.1 ; origine v5.3 conservée dans l’historique).


## [Non publié]

### Gouvernance — Levée technique des réserves US-125

- Addendum DAT/OpenAPI US-125 ajouté : quatre routes, schémas, sécurité JWT, RLS/ReBAC et masquage PII.
- Dialogue de désinscription renforcé : focus initial, boucle Tab, fermeture `Escape` et restitution du focus.
- Preuves locales : ChromeHeadless ciblé 10/10, lint/build Frontend PASS, compilation Backend PASS,
  `NotificationFondationIntegrationTest` PASS avec Flyway V1→V32.
- `RSV-MIG-611-04`, `RSV-US125-FE-01` et `RSV-US125-A11Y-01` techniquement traitées, sous réserve de validation humaine et CI distante.
- `RSV-US125-RESP-01` reste ouverte jusqu'à la preuve visuelle réelle aux largeurs 360/390/640/1024 px.
- Aucun Staging, Production, secret, provider ou migration supplémentaire exécuté.


### Ajouts — US-125 Backend notifications

- API authentifiée de préférences, désinscription et historique, avec résolution du sujet uniquement depuis le JWT.
- Préférence Bailleur tenant-scopée ; préférence Gestionnaire globale isolée par RLS.
- Migration V32 additive : provenance `notification_event.bien_id` et fonction ReBAC `notifications_gestionnaire(...)` fail-closed ; historique masqué côté API.
- Aucun environnement, provider, secret, flag d'activation ou EP-19 modifié.

### Gouvernance — Addendum Gate 05 US-125 sécurité

- Décision PO/CDO : option S1 autorisée pour l'implémentation Backend US-125 — préférence globale du Gestionnaire, provenance `bien_id` des événements et fonction ReBAC PostgreSQL `SECURITY DEFINER` fail-closed.
- Exception strictement bornée : migration Flyway additive + API/services/tests US-125 autorisés ; Staging, Production, secrets, providers/kill-switches et EP-19 restent exclus.

### Gouvernance — Gate 05 US-125 Backend

- Après merge de la PR #385 (`b54303d`), régularisation de l'état fonctionnel US-125 : l'interface Frontend est intégrée, mais les endpoints de préférences, désinscription et historique ne sont pas encore livrés côté Backend.
- Planification Gate 05 ajoutée : contrat API minimal, autorisation serveur, RLS/ReBAC, masquage, tests 401/403/cross-tenant/périmètre Gestionnaire et validation d'intégration Frontend.
- Plan approuvé par merge humain de la PR #386 (`a3354c1`) ; la migration de sécurité est ensuite autorisée par addendum PO/CDO borné.

### Gouvernance — Gate 04A US-125

- Gate 04A **US-125** instruit et statué **GO sous réserve documentaire** : UI specs, responsive, accessibilité, revue design, tokens, inventaire composants, dette design et architecture Frontend consolidés.
- Réserves transférées comme critères bloquants de la future PR Frontend : `RSV-US125-A11Y-01`, `RSV-US125-RESP-01`, `RSV-US125-FE-01`.
- Portée autorisée uniquement après merge de la PR documentaire : démarrer le développement **Frontend US-125** sur branche dédiée ; backend, migration, Staging, Production, secrets, activation Twilio/SMS/WhatsApp et EP-19 restent interdits.

### Gouvernance — Cadrage US-125

- GO PO/CDO de cadrage **US-125 / Gates 02A-04A**, sans codage : prochain sprint backlog produit retenu après clôture `1.16.0`, Gate 02A déjà GO sous réserve, Gate 04A à instruire avant tout développement Frontend ; aucune activation Twilio/SMS/WhatsApp ni EP-19 autorisée.

### Production — Préflight EP-18 Resend

- Préflight Production EP-18 **PASS** après merge PR #372 : hôte Production resynchronisé sur `a6c1c16`, `check-release-state.sh --host` cohérent, Production `1.15.0` healthy, Flyway `29/29`.
- Backup base + globals créé et vérifié : `/home/ubuntu/backups/loyertracker/preflight-ep18-20260805T183406Z/`, dump SHA-256 `8f71bd15551a96af69e4328f8857336441fd3f6782f84dd3fa4b154bced9fb83`.
- Resend reste désactivé (`RESEND_EMAIL_ENABLED` absent) ; aucun déploiement EP-18, aucune migration V30/V31 et aucun `PRODUCTION_DEPLOYED`.

### Gouvernance — Gate Production EP-18 réinstruit

- Après correction `R-V54-2`, Gate Production EP-18 statué **GO sous réserve / `PRODUCTION_READY`** pour Préflight uniquement.
- Contrôles live Production verts : `check-release-state.sh --host` cohérent, API/Web par digest attendu, Flyway `29/29`, `/healthz` et racine publique `200`.
- Aucun déploiement EP-18, aucune migration V30/V31 et aucune activation Resend ; `RESEND_EMAIL_ENABLED` reste absent donc désactivé par défaut.

### Exploitation Production — correction dérive `R-V54-2`

- Dérive Production traitée sans promotion EP-18 : `loyertracker-nginx-1` recréé uniquement pour passer de la référence tag `sha-27dce09d` au digest `PRODUCTION_WEB_IMAGE_REF` attendu.
- `check-release-state.sh --host` repasse **COHÉRENT** ; API/PostgreSQL/Keycloak inchangés, Flyway Production `29/29`, `/healthz` et racine publique `200`.
- Resend reste désactivé en Production (`RESEND_EMAIL_ENABLED` absent) ; aucune migration et aucun déploiement EP-18 effectués.

### Gouvernance — Gate Production EP-18 Resend

- Gate Production EP-18 instruit après merge de la PR #371 : **NO GO technique temporaire**.
- Motif : contrôle `R-V54-2` Production `check-release-state.sh --host` en échec — conteneur Web/Nginx courant encore référencé par tag `sha-27dce09d` au lieu du digest `PRODUCTION_WEB_IMAGE_REF`, malgré une Production healthy.
- Aucun déploiement, aucune migration et aucune activation Resend effectués ; prochaine action CGPA = correction préalable de dérive Production puis réinstruction du Gate.

### Gouvernance — Gate EP-18 Resend

- Gate Staging EP-18 reclassé en **GO** : API Resend authentifiée, e-mail envoyé et réception confirmée par le Product Owner, Provider Message ID `fdac0ef4-a19f-4893-9f89-abe55b1f25c8`, PR #371 mergeable et contrôles CI verts.
- Réserve domaine `staging.loyerpro.org` supprimée comme **Sans objet (Not Applicable)** ; les essais officiels EP-18 utilisent `onboarding@resend.dev`.
- Webhook Resend/Svix non bloquant pour EP-18 : `RSV-EP18-06` clôturée comme réserve EP-18 et reclassée en amélioration future EP-19.
- Staging remis en état sécurisé après test : `RESEND_EMAIL_ENABLED=false`.

## [1.16.0] - 2026-08-05

### Production — Déploiement technique EP-18 Resend

- Clôture CDO Release `1.16.0` **GO** après merge PR #381 (`52683c5`) et resync hôte Production : EP-18 livré, `PRODUCTION_DEPLOYED` confirmé, hypercare accepté PO, Resend activé, release lock cohérent, `notification_outbox`/`notification_delivery=0/0`.
- Activation Production Resend **RESEND_PRODUCTION_ENABLED** : `RESEND_EMAIL_ENABLED=true`, `NOTIFICATIONS_EXTERNAL_ENABLED=true`, `NOTIFICATION_DRY_RUN=false`, budget conservateur `NOTIFICATION_BUDGET_MENSUEL_MAX=100`, `RESEND_FROM_EMAIL=onboarding@resend.dev`; correction Compose de propagation budget, recréation ciblée `api` uniquement, release lock et santé publics verts, outbox/delivery `0/0`.
- Déploiement technique Production EP-18 **PASS** : API `ghcr.io/jptshilombo/loyertracker-api@sha256:2522ae210603cb94efc03ce5f8053a0c20b2c10e81ff6c48cde62b3c53232d60`, Web `ghcr.io/jptshilombo/loyertracker-web@sha256:9be1a4cd8b0b27d3b868e69481e7255ecbd1c3c47251875136d1ea897727c359`, tag historique `sha-8c9f1e4a`.
- Flyway Production passe de `29/29` à **`31/31`** avec V30 `ep18 sprint a email resend fondation` et V31 `ep18 sprint b invitation email`.
- `check-release-state.sh --host` **COHÉRENT** après bascule ; `/healthz` et racine publique `200`, `api`/`nginx` healthy, PostgreSQL/Keycloak inchangés.
- Resend reste désactivé (`RESEND_EMAIL_ENABLED=false`, `RESEND_FROM_EMAIL` absent, `notification_outbox`/`notification_delivery` `0/0`) ; validation finale Production ensuite exécutée et verte.
- Validation finale Production EP-18 **PASS** : smoke canonique RUN_ID `1785957904` **65 PASS / 0 FAIL**, nettoyage complet des résidus smoke, `directAccessGrants=false`, `bailleur-test=false`, `PRODUCTION_DEPLOYED` confirmé pour `1.16.0`.
- Hypercare EP-18 T0 **PASS** : release lock cohérent, stack healthy, Flyway `31/31`, baseline inchangée, Resend désactivé ; alertes `NotificationKillSwitchFerme`/`BackupHeartbeatMissing` qualifiées non bloquantes.
- Pré-check Hypercare EP-18 T+12 anticipé **PASS technique / WARN fenêtre** : release lock cohérent, stack healthy, Flyway `31/31`, `notification_outbox`/`delivery=0/0`, Resend toujours désactivé ; alertes `NotificationKillSwitchFerme`/`BackupHeartbeatMissing` requalifiées non bloquantes au moment du contrôle.
- Pré-check Hypercare EP-18 T+24 anticipé **PASS technique / WARN fenêtre** : release lock cohérent, stack healthy, Flyway `31/31`, baseline inchangée, `notification_outbox`/`delivery=0/0`, Resend toujours désactivé ; alertes requalifiées non bloquantes au moment du contrôle.
- Décision PO : pré-checks T+12/T+24 anticipés acceptés comme valeur probante suffisante ; hypercare EP-18 considéré terminé sans incident bloquant, Resend toujours désactivé.

## [1.15.0] - 2026-07-30

### Ajouts — EP-16 Sprint N+2 Lot A : fallback SMS et garde-fous (US-124, US-126)

- **US-124 — fallback SMS contrôlé.** Un échec WhatsApp classé `PERMANENT` peut déclencher un
  unique SMS de secours, sous quatre conditions cumulatives : politique activée
  (`NOTIFICATION_FALLBACK_ENABLED`, **`false` par défaut**, arbitrage K5), opt-in SMS explicite du
  destinataire et canal de secours désigné (K3), et aucun SMS déjà en file. L'unicité est garantie
  en dernier ressort par la contrainte `uq_notification_outbox_idempotence` : un second SMS de
  secours est structurellement impossible. Aucun fallback d'un fallback — aucune boucle possible.
- **Classification des erreurs fournisseur** (`ResultatEnvoi.categorieErreur`) : `TEMPORAIRE`
  (nouvelle tentative) vs `PERMANENT` (`DEAD` immédiat, sans consommer le quota de tentatives).
  Seul `PERMANENT` ouvre le fallback ; un incident réseau est réessayé, jamais basculé.
- **Canal SMS pris en charge** par `TwilioNotificationProvider`. Sans `TWILIO_SMS_FROM`
  provisionné, un envoi SMS est refusé en `PERMANENT` plutôt que tenté.
- **US-126 — kill switch câblé.** `app.notifications.external.enabled` était déclaré depuis le
  Sprint N mais **n'était lu par aucun code** : le garde-fou documenté était inerte. Il coupe
  désormais le dispatch en amont de tout appel réseau, sans redémarrage du fournisseur, en
  laissant les lignes `PENDING` intactes.
- **US-126 — plafond budgétaire mensuel** (`NOTIFICATION_BUDGET_MENSUEL_MAX`, **`0` par défaut**,
  soit aucun envoi autorisé). Atteint, il arrête le lot sans rien détruire. Consommation globale
  lue par la fonction `notification_envois_du_mois()` (migration **V29**, additive, `SECURITY
  DEFINER`, retour strictement agrégé — aucune donnée personnelle exposée).
- **US-126 — métriques `notification.*`** (Micrometer) : dispatch par canal et issue, fallback par
  issue (les refus sont comptés au même titre que les déclenchements), consommation et plafond
  budgétaires, blocages kill switch et budget. **Aucun label ne porte de donnée personnelle** —
  seules des énumérations fermées, contrainte structurante documentée.
- **US-126 — quatre alertes Alertmanager** portant `component: notifications` : budget approché
  (80 %), budget épuisé, taux d'échec permanent élevé, kill switch fermé.
- **US-126 — runbook dédié** `docs/cgpa/runbook-notifications.md` (incident Twilio, reprise
  manuelle bornée, plafond, rotation des secrets, diagnostic du fallback) et extension **additive**
  de `docs/cgpa/observability-governance.md`.
- Neuf tests d'intégration dédiés couvrant les critères GO : fallback jamais déclenché sans
  politique ni opt-in, unicité du SMS, kill switch bloquant, dépassement de plafond simulé.
- **Aucune activation de canal externe en Production** (K8, ADR-18) : le Sprint N+2 doit d'abord
  être clos en GO. Aucun credential Twilio ajouté à la Production.

### Gouvernance — migration CGPA v6.1.1 Enterprise

- Migration additive depuis v5.4.1, sans rejeu ni suppression de Gate, décision, risque, réserve,
  preuve ou release historique.
- Ajout des quatre architectures, des packs Financial Governance, UX/Design/Frontend et Enterprise
  Delivery Governance.
- Ajout des contrôles CHECK-CICD-01, CHECK-REL-01, CHECK-OPS-01, CHECK-VAL-01 et de l'auditeur
  structurel.
- Synchronisation du modèle des agents, du Project State, des Gates et workflows actifs.
- Aucun changement fonctionnel, aucune migration SQL, aucune promotion ni aucun déploiement.
- Candidate documentaire resynchronisée avec le PR #276 et structurellement validée ; validation
  humaine finale obligatoire avant fusion.

### Ajouts — verrou d'état de release (gouvernance, R-V54-2)

- `infra/release/production-state.env` : source de vérité versionnée de l'état Production attendu
  (`RELEASE_VERSION`, `PRODUCTION_TAG`, `FLYWAY_EXPECTED`, `PRODUCTION_DEPLOYED_AT`). Toute bascule
  de tag en Production doit s'accompagner de sa mise à jour, dans le même commit que le rapport de
  déploiement technique.
- `infra/release/check-release-state.sh` : contrôle de cohérence à deux modes, strictement en
  lecture seule. `--ci` (cohérence du dépôt : compteur Flyway vs fichiers de migration, version vs
  `CHANGELOG`, format de tag immuable, absence de compteur codé en dur) et `--host` (déclaré vs
  réel : tag `.env`, compteur Flyway en base, digests des conteneurs).
- Étape CI bloquante « Verrou d'état de release » dans le job Backend, exécutée avant `mvn verify`.
- Contrôle d'entrée ajouté en tête des checklists Gate Production (`--host`) et Gate Staging
  (`--ci`).

### Modifications

- `infra/smoke/smoke-stack.sh` et `SchemaMigrationTest` lisent désormais le compteur Flyway attendu
  depuis `production-state.env` au lieu de le coder en dur (trois occurrences supprimées) — cause
  directe des incidents PR #77 et PR #171. Le smoke vérifie en outre, lorsqu'il tourne contre la
  Production, que le tag déployé correspond au tag déclaré.

### Corrections — RSV-STG-N2-01 (verrou d'état de release)

- `FLYWAY_EXPECTED` scindé en deux variables dans `production-state.env` : `FLYWAY_EXPECTED_REPO`
  (nombre de fichiers `V*.sql` du dépôt, contrôlé par `--ci`, `SchemaMigrationTest` et le smoke) et
  `FLYWAY_EXPECTED_PROD` (compte réellement appliqué en Production, contrôlé par `--host`, ne
  bougeant qu'à la bascule). La variable unique servait ces deux usages, qui divergent pendant tout
  sprint ajoutant une migration avant sa bascule en Production — réserve non bloquante consignée au
  Gate Staging Sprint N+2 EP-16 (2026-07-28).
- `FLYWAY_EXPECTED_PROD` remis à sa valeur réelle (28, pour `1.14.0`/`sha-27dce09d`, inchangée) :
  `--host` ne signalera plus de fausse dérive tant que le Sprint N+2 (V29) n'est pas basculé en
  Production.

Aucun changement fonctionnel, aucune migration SQL, aucun impact sur le comportement applicatif.

## [1.14.0] — 2026-07-24

### Ajouts — WhatsApp P0 en Sandbox Twilio (Sprint N+1, EP-16, US-122/123)

- Migration additive V28 : seed des trois templates P0 (`QUITTANCE_DISPONIBLE`,
  `LOYER_EN_RETARD`, `GARANTIE_DEBITEE`, canal WhatsApp, `fr`) et deux fonctions
  `SECURITY DEFINER` (`notification_bailleurs_en_attente()`,
  `notification_delivery_appliquer_statut()`), même patron que
  `lire_quittance_publique`/`journaliser_evenement_quittance` (V22).
- `TwilioNotificationProvider` (implémentation réelle de `NotificationProvider`, canal WhatsApp
  uniquement, appel direct de l'API REST Messages de Twilio) — actif uniquement si
  `TWILIO_WHATSAPP_ENABLED=true` (exclusion mutuelle avec `NoopNotificationProvider`, toujours
  actif par défaut).
- `NotificationDispatcher` : consomme l'Outbox par bailleur (réclamation `FOR UPDATE SKIP
  LOCKED` déjà en place), résout préférence/template, invoque le fournisseur actif, journalise
  la livraison (`NotificationDelivery`). Backoff exponentiel puis `DEAD` au-delà de 5 tentatives ;
  `DEAD` immédiat si préférence introuvable/inéligible ou template non approuvé.
- Callback de statut Twilio public (`POST /api/public/notifications/callback`), signature
  `X-Twilio-Signature` vérifiée avant tout traitement, application idempotente (progression
  uniquement, jamais en arrière).
- Déclenchement du dispatch par sondage périodique (`NotificationDispatchScheduler`) et
  manuellement (`POST /api/batch/notifications`, exploitation/tests).
- Aucune activation Production : socle désactivé par défaut (K8) dans tous les environnements ;
  Sandbox Twilio exclusivement (ADR-18, K4).

## [1.13.0] — 2026-07-22

### Ajouts — Fondation des notifications multicanales (Sprint N, EP-16, US-119/120/121)

- Migration additive V27 : tables `notification_preference`, `notification_event`,
  `notification_outbox`, `notification_delivery` et `notification_template`. RLS
  `bailleur_isolation` en mode `ENABLE` + `FORCE` sur les quatre tables tenant-scopées ; le
  référentiel `notification_template` reste global.
- Outbox transactionnelle idempotente avec réclamation concurrente
  `FOR UPDATE SKIP LOCKED`, sans appel réseau dans les transactions métier.
- Événements alimentés par le batch d'alertes et par les opérations métier quittance, garantie,
  paiement et bail ; le compteur historique des alertes reste inchangé.
- Abstraction `NotificationProvider` avec `NoopNotificationProvider` comme seul fournisseur
  disponible dans ce sprint. Aucun SDK, credential, template ou appel Twilio n'est inclus.
- Feature flags à valeurs sûres par défaut : notifications externes, WhatsApp et SMS désactivés ;
  dry-run activé. Aucun envoi externe n'est possible sans consentement et sans sprint ultérieur.
- Gate Staging : `STG-ISOL-01` PASS, Flyway 27/27, smoke 63 PASS / 0 FAIL, 24 événements
  persistés et 0 préférence / 0 Outbox / 0 Delivery.

## [1.12.0] — 2026-07-19

### Ajouts — Bascule Bail → Locataire & RGPD (Sprint C, EP-15, US-113/114)

- **Bail référence désormais un `Locataire` structuré** (migration V26, non additive) : backfill
  d'un `Locataire` par bail historique (`nom` = valeur intégrale de l'ancien `locataire_nom`,
  `prenom` non renseigné — RSV-EP15-02), `bail.locataire_id` rendu `NOT NULL`, suppression de
  `bail.locataire_nom`/`locataire_email`. **Rupture de contrat HTTP intentionnelle** :
  `POST .../baux` exige désormais `locataireId` (UUID) au lieu de `locataireNom`/`locataireEmail`
  en texte libre ; la lecture (`GET .../baux`, export RGPD) reste inchangée, dérivée du
  `Locataire` lié.
- **Nouveau `GET /api/biens/{bienId}/locataires`** (lecture seule, BAILLEUR et GESTIONNAIRE
  affecté) : liste les locataires `ACTIVE` du bailleur propriétaire du bien, pour la sélection à
  la création d'un bail sans ouvrir l'accès global à `/api/locataires` (réservé BAILLEUR).
- **Effacement RGPD retargeté sur `Locataire`** (`DELETE /api/locataires/{locataireId}/effacement`,
  remplace `DELETE /api/biens/{bienId}/baux/{bailId}/locataire`) : anonymise en une seule
  opération tout l'historique de baux rattachés à ce locataire (US-114).
- Frontend : les formulaires de création de bail (Bailleur et Gestionnaire) remplacent les champs
  texte libre nom/email par un sélecteur de `Locataire` existant ; le tableau de bord Bailleur
  ajoute une création rapide de locataire inline.
- Décisions : `docs/cgpa/05-architecture-conception/adr/ADR-16-gestion-personnes.md` (D2/D3/D6).

## [1.11.0] — 2026-07-16

### Ajouts — Fin de bail (EP-13, US-115→118)

- **Clôture manuelle d'un `Bail`** (`POST /api/biens/{bienId}/baux/{bailId}/cloture`, migration V25
  additive) : `statut: ACTIF -> CLOS`, nouvelle colonne `bail.date_cloture_effective` (nullable,
  distincte de `dateFin` contractuelle, jamais réécrite). Une garantie non intégralement
  restituée et/ou des paiements `IMPAYE`/`EN_RETARD`/`PARTIEL` en cours ne bloquent jamais la
  clôture (200) : signalés via un nouveau champ `avertissements` (`ClotureBailDto`) — aucun
  couplage transactionnel nouveau entre `Bail`, `Garantie` et `Paiement` (ADR-17).
- **Réouverture** (`POST /api/biens/{bienId}/baux/{bailId}/reouverture`) : `CLOS -> ACTIF`,
  `dateClotureEffective` remise à `null` ; rejet 409 si un autre bail `ACTIF` existe déjà sur le
  même bien (contrainte `uq_bail_actif`, EF-12, inchangée).
- **Purge de l'échéancier futur à la clôture** : les paiements `A_VENIR` de période strictement
  postérieure à `dateClotureEffective` sont supprimés dans la même transaction ; les paiements
  `RECU`/`PARTIEL`/`EN_RETARD`/`IMPAYE` (faits historiques) ne sont jamais retouchés.
- **Non-régression des alertes** : `generer_alertes()` (V25) restreint désormais `LOYER_EN_RETARD`
  aux baux `ACTIF`, comme c'était déjà le cas pour `FIN_BAIL`/`PREAVIS`.
- **Audit** : nouveaux points `CLOTURER_BAIL`/`ROUVRIR_BAIL`.
- Décisions : `docs/cgpa/05-architecture-conception/adr/ADR-17-fin-de-bail.md` (K1→K6).

## [1.10.0] — 2026-07-15

### Ajouts — Entité Locataire (Sprint B, EP-15, US-109→112)

- **Locataire, entité de domaine persistante** (migration V24, additive) : table `locataire`
  cloisonnée par bailleur (RLS `ENABLE`+`FORCE`, policy `bailleur_isolation`), statut
  `ACTIVE`/`ARCHIVE`. Contrairement au Gestionnaire, le Locataire n'est **pas** un compte
  utilisateur (aucune identité Keycloak, aucun rôle RBAC) — le cloisonnement repose entièrement
  sur la RLS, sans fonction `SECURITY DEFINER` cross-tenant. Nouveau
  `LocataireController`/`LocataireService` (`/api/locataires`, rôle `BAILLEUR`) : création,
  modification, archivage (sans pré-condition), restauration, recherche, détection de doublons
  (email/téléphone/numéro de pièce d'identité), historique (audit RLS-scopé).
- `bail.locataire_id` ajoutée **nullable**, sans aucun usage applicatif dans ce sprint —
  préparation de la bascule V25 (Sprint C).
- **Audit** : nouveaux points `CREER_LOCATAIRE`/`MODIFIER_LOCATAIRE`/`ARCHIVER_LOCATAIRE`/
  `RESTAURER_LOCATAIRE`.
- Décisions et risques : `docs/cgpa/05-architecture-conception/adr/ADR-16-gestion-personnes.md`
  (D2 Locataire lié à un seul bailleur, D3 préparation `bail.locataire_id`).

### Ajouts — Cycle de vie du Gestionnaire (Sprint A, EP-15, US-105→108)

- **Statut global du compte Gestionnaire** (`ACTIVE`/`SUSPENDU`/`ARCHIVE`, migration V23) :
  profil enrichi (téléphone, photo, observations), suspension immédiate sans pré-condition
  (désactivation Keycloak), réactivation, archivage conditionné à l'absence de toute
  `Affectation` `ACTIVE` **tous bailleurs confondus** (fonction `SECURITY DEFINER`
  `gestionnaire_a_affectation_active`, traverse la RLS d'`affectation`), restauration.
  Nouveau `GestionnaireController`/`GestionnaireService` ; réservé au rôle `BAILLEUR` ayant
  une relation d'affectation avec le gestionnaire (`gestionnaire_a_relation`, RM-107 : un
  Gestionnaire n'administre jamais un autre Gestionnaire).
- **Recherche multicritère et détection de doublons** (nom/téléphone/email) parmi les
  gestionnaires en relation avec le bailleur courant.
- **Historique Gestionnaire** : profil, affectations et audit du bailleur courant (aucune
  fuite d'information sur les relations avec d'autres bailleurs).
- **Audit** : nouveaux points `MODIFIER_GESTIONNAIRE`/`SUSPENDRE_GESTIONNAIRE`/
  `REACTIVER_GESTIONNAIRE`/`ARCHIVER_GESTIONNAIRE`/`RESTAURER_GESTIONNAIRE`.
- Décisions et risques : `docs/cgpa/05-architecture-conception/adr/ADR-16-gestion-personnes.md`
  (D1 statut global, D4 fonction cross-tenant, RSV-EP15-01 risque accepté).

## [1.9.0] — 2026-07-06

### Ajouts — Quittances certifiées : socle + redesign PDF (Sprint 11, EP-14a, US-99/100/101)

> ⚠️ Lot non promouvable en Production seul : le QR imprimé pointe vers la page publique de
> vérification livrée au Sprint 12 (EP-14b) — release unique `1.9.0` (ADR-15 K5).

- **Quittance certifiée persistante (US-99)** : la quittance n'est plus générée à la volée
  (renversement partiel et tracé de l'arbitrage C — ADR-15 D1, l'avis d'échéance reste à la
  volée) mais devient un **exemplaire officiel stocké** (migration V22 : tables `quittance`,
  `quittance_numerotation`, `quittance_verification_log`, RLS FORCE, fonctions SECURITY DEFINER
  pour la vérification publique du Sprint 12). Numéro permanent `QT-YYYY-NNNNNN` par
  bailleur+année (K1), jamais réutilisé ; ré-émission en version N+1 chaînée (`remplacee_par`,
  statuts `EMISE`/`REMPLACEE`/`ANNULEE`) quand les données métier changent, idempotente sinon ;
  annulation via `POST /api/quittances/{id}/annulation` (bailleur propriétaire, audit).
  Le contrat HTTP `GET .../quittance` est inchangé.
- **Certification vérifiable (US-100)** : payload canonique déterministe octet à octet
  (`contenu`, format versionné `schema:1`) haché en `content_hash` (SHA-256), PDF stocké haché
  en `pdf_hash` ; token HMAC-SHA256 (`QUITTANCE_HMAC_SECRET` hors dépôt, `token_kid` pour la
  rotation) encodé dans un **QR de vérification** (ZXing, data-URI) pointant vers
  `/verify/receipt/{id}` ; architecture extensible : thème injectable par bailleur
  (`ThemeQuittanceProvider`) et scellement PAdES-ready (`ScellementQuittance`).
- **Redesign professionnel du PDF (US-101)** : gabarit A4 dédié — logo LoyerTracker embarqué,
  badge « DOCUMENT CERTIFIÉ », cartes bailleur/locataire, bloc location
  (patrimoine/bien/période), tableau des montants, mode de paiement (dont « Retenue sur dépôt
  de garantie », V21), encart QR + empreinte, cachet électronique et mentions légales.
- **Export RGPD** : les métadonnées et le contenu canonique des quittances certifiées sont
  inclus dans l'export bailleur (jamais les octets du PDF) — ADR-15 §RGPD ; une anonymisation
  locataire ultérieure ne réécrit pas les documents certifiés (obligation comptable).

### Ajouts — Quittances certifiées : vérification publique + observabilité (Sprint 12, EP-14b, US-102/103/104)

> Complète le Sprint 11 : le QR imprimé devient vérifiable. Ensemble ils forment la release
> unique `1.9.0` (ADR-15 K5) — la promotion Production reste subordonnée à son Gate.

- **API publique de vérification (US-102)** : `GET /api/public/receipts/{id}?token=…` renvoie un
  **contrat public strict (K2)** — numéro, bailleur, patrimoine, bien, locataire, période,
  montants+devise, date d'émission, statut, empreinte — reconstruit à partir du contenu certifié,
  **sans jamais** le mode de paiement ni la garantie retenue (test de non-fuite). Toute cause
  d'échec (id inconnu, token forgé/tronqué/d'une autre quittance/version décalée) produit une
  réponse **indifférenciée** `INVALIDE` (aucun oracle). `GET …/{id}/download?token=…` ne sert
  l'exemplaire officiel qu'après **re-vérification du `pdf_hash`** (défense contre une altération
  en base). Lecture via les fonctions `SECURITY DEFINER` de V22 (jamais de désactivation RLS) ;
  accès non authentifié autorisé par le seul token HMAC (`SecurityConfig` `permitAll` ciblé).
- **Page publique de vérification (US-103)** : route Angular `/verify/receipt/:id` **sans
  `authGuard`** et `noindex` — cible du QR, atteinte sans compte. Verdict lisible ✓ Authentique /
  ❌ Quittance non authentifiée, champs K2, statut temps réel (« remplacée par QT-… », annulée),
  bouton de téléchargement du PDF officiel. Le bootstrap Keycloak passe en `check-sso` (plus de
  `login-required`) ; l'intercepteur Bearer exclut `/api/public/` ; les routes métier restent
  gardées (test de non-régression).
- **Observabilité & anti-fraude (US-104)** : métriques Prometheus
  `quittance_verifications_total{resultat}`, `quittance_telechargements_total`,
  `quittance_qr_invalides_total` ; journal `quittance_verification_log` **RGPD-minimal** (ni IP ni
  user-agent) ; compteurs par quittance exposés au bailleur via l'export RGPD ; rate-limit nginx
  (`limit_req` 60 r/min/IP, `429`) sur `/api/public/` et `/verify/`.

## [1.8.0] — 2026-07-04

### Ajouts — Garantie : usage métier du ledger (Sprint 10, EP-12b, US-95/96/97)

- **Retenue explicite sur un loyer impayé (US-95)** : nouvel endpoint
  `POST .../garanties/{id}/retenue-loyer` — jamais un prélèvement automatique (ADR-14 §5), le
  gestionnaire choisit le paiement et le montant. Le paiement couvert transitionne vers
  `RECU`/`PARTIEL` (mêmes seuils qu'un pointage manuel), les honoraires sont recalculés, et le
  mouvement `RETENUE_LOYER` est lié au paiement via `paiement.garantie_movement_id`
  (migration V21, FK nullable + index).
- **Réapprovisionnement d'une garantie active (US-96)** : endpoint
  `POST .../garanties/{id}/complement` avec motif obligatoire, audit `COMPLEMENT_GARANTIE`.
- **Historique des mouvements (US-97)** : endpoints `GET .../mouvements` (chronologique) et
  `GET .../mouvements/export` (CSV, tous champs échappés contre la formula injection) ; UI
  triable et filtrable par type dans le panneau Garanties ; l'export RGPD du bailleur inclut
  désormais le ledger complet (chargement batch, sans N+1).
- Correctif : `Garantie.restituerPartiel` calculait le solde depuis le montant initial au lieu
  du `soldeActuel` courant — sans effet avant ce sprint, critique dès qu'une retenue ou un
  complément existe.
- ADR-14 §8 exécuté : `sommeMontantDeposeParBail` recalculé depuis `garantie_movement`.
- Couverture de test frontend du panneau Garanties (17 scénarios composant + 4 méthodes API),
  exigée par le Quality Gate SonarQube (`new_coverage` ≥ 80 %).
- Correctif (RSV-S10-01) : ordre chronologique stable du ledger pour les mouvements d'un même
  jour — `date_mouvement` est un `DATE` et le tri retombait sur l'UUID aléatoire ; tri désormais
  `date_mouvement, cree_le, id` (`cree_le` TIMESTAMPTZ posé par Postgres depuis V20, mappé en
  lecture seule), appliqué à l'historique US-97 et à l'export RGPD. Aucune migration.

## [1.7.0] — 2026-07-03

### Ajouts — Garantie : ledger de mouvements (Sprint 9, EP-12a, US-94)

- **`GarantieMovement`** (nouvelle table `garantie_movement`, migration V20) : journal
  append-only des mouvements de garantie (`DEPOT_INITIAL`, `COMPLEMENT`, `RETENUE_LOYER`,
  `RETENUE_CHARGES`, `RETENUE_REPARATION`, `RESTITUTION`, `AJUSTEMENT`, `ANNULATION`), isolé par
  RLS `bailleur_id` (même patron que `patrimoine`).
- `Garantie.soldeActuel` : cache transactionnel recalculé de façon synchrone à chaque mouvement
  (création, restitution) — `garantie.statut` inchangé, aucune rupture du batch d'alertes
  `GARANTIE_NON_RESTITUEE`.
- Migration rétroactive : chaque garantie existante génère les mouvements reconstituant son
  historique (dépôt initial, retenue le cas échéant, clôture si déjà totalement restituée) —
  aucune perte de traçabilité.
- **`bail.depot_garantie` devient une valeur dérivée** (ADR-14, arbitrage PO kickoff) : la colonne
  est supprimée, le dépôt ne se saisit plus à la création du bail (il se déclare via le flux
  « Ajouter garantie » existant) ; `BailDto.depotGarantie` reste exposé, désormais calculé.
- Aucun nouvel usage métier exposé par ce sprint (retenue typée, réapprovisionnement, écran
  d'historique) — modèle et migration uniquement, préparant le Sprint 10 (EP-12b).

## [1.6.0] — 2026-07-02

### Ajouts — Patrimoine enrichi (Sprint 7, EP-10, US-90, V19)

- Sept nouveaux champs optionnels sur `Patrimoine` : `ville`, `commune`, `quartier`,
  `province_etat`, `pays`, `description`, `reference_interne`.
- **`patrimoine.adresse` devient obligatoire** (`NOT NULL`) — était nullable depuis V16 ;
  backfill placeholder (`"Adresse à renseigner"`) pour tout patrimoine existant sans adresse,
  migration V19.
- Extension du formulaire « Modifier un patrimoine » du dashboard bailleur avec les nouveaux
  champs.
- ADR-12 (D-PAT-002).

### Correctifs — Devise réelle sur les documents locatifs (Sprint 8, EP-11, US-92)

- **Value Object `Money(montant, devise)`** (`com.loyertracker.baux.Money`) : corrige un bug
  réel où `DocumentHtmlBuilder.euros()` affichait systématiquement « € » sur les quittances et
  avis d'échéance, quelle que soit la devise réelle du bail (EUR/USD/CDF).
- Formats d'affichage par devise (décision PO, ADR-13) : EUR `800,00 €`, USD `$1,000.00`,
  CDF `1 000,00 CDF`.
- `DonneesDocument` porte désormais des `Money` au lieu de `BigDecimal` nus ;
  `QuittanceService.assembler()` résout `bail.getDevise()` avant construction.
- Aucune migration Flyway requise (`bail.devise` existe depuis V17).
- ADR-13 (D-DEV-001).

### Ajouts — Devise affichée sur Paiements et Honoraires (Sprint 8, EP-11, US-93)

- Les vues Paiements et Honoraires (bailleur et gestionnaire) affichent désormais la devise à
  côté des montants, cohérent avec le dashboard Bail.
- Backend : `PaiementDto`/`HonoraireDto` exposent un champ `devise`, résolu via le bail parent
  (paiement) ou le bail le plus récent du bien (honoraire — approximation documentée, `Honoraire`
  n'ayant pas de lien direct vers un bail).
- Frontend : `MoneyFormatPipe` partagé (`shared/money/`), miroir exact du formatage backend.
- Aucune duplication de colonne devise introduite (règle métier ADR-13).

## [1.5.0] — 2026-07-01

### Ajouts — RGPD export & effacement locataire (Sprint 6, US-70)

- **`GET /api/bailleurs/export`** : export JSON complet scopé `bailleurId` (patrimoines, biens,
  baux, paiements, affectations, garanties) — droit d'accès RGPD.
- **`DELETE /api/biens/{bienId}/baux/{bailId}/locataire`** : anonymisation des données
  personnelles du locataire (`locataireNom` → `"[anonymisé]"`, `locataireEmail` → `null`),
  données financières conservées, opération tracée dans `audit_log`
  (`EFFACEMENT_LOCATAIRE`) — droit à l'effacement RGPD (PR #123).

### Durcissement — CSP Nginx (Sprint 6, US-72)

- Extension de la `Content-Security-Policy` de la SPA : `script-src 'self'`, `font-src 'self'`,
  `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`
  (PR #123).

## [1.4.0] — 2026-06-30

### Ajouts — Statut d'échéance `A_VENIR` (Sprint 5 Lot B4, US-60, V18)

- **`StatutPaiement.A_VENIR`** : nouveau statut pour les loyers dont la date d'exigibilité est
  dans le futur. `generer_echeances_loyers()` produit désormais `A_VENIR` (au lieu de `IMPAYE`)
  pour les échéances futures ; les `IMPAYE` existants dont la date est dans le futur ont été
  basculés rétroactivement. La contrainte CHECK `paiement_statut_check` a été étendue en
  conséquence (PR #115, migration V18).

### Ajouts — Devise sur le bail (Sprint 5 Lot B3, V17)

- **`bail.devise`** : le bail supporte désormais EUR, USD et CDF (franc congolais), valeur
  par défaut EUR (PR #115, migration V17).

### Ajouts — Adresse patrimoine et synchronisation statut biens (Sprint 5 Lots B1/B2, V16)

- **`patrimoine.adresse`** : nouveau champ adresse libre sur le patrimoine.
- **`bien.statut` rétroactif** : les biens ayant un bail `ACTIF` sont synchronisés vers `LOUE`
  lors de la migration (PR #115, migration V16).

### Corrections UX — Alertes, inscription, navbar, quittance (PR #110, PR #113)

- **Navbar** : lien profil bailleur présent dans la barre de navigation principale (PR #110).
- **Quittance 409** : message d'erreur actionnable lorsque l'adresse bailleur est manquante (PR #110).
- **Alertes** : affichage des seules alertes `NON_LUE` ; suppression du badge de statut redondant
  et du style `opacity` sur les lues (PR #113, Lot A).
- **Échéances** : statut `A_VENIR` visible dans la liste des loyers (PR #113, Lot C).
- **Inscription** : suppression du bruit UI lors d'une double inscription 409 (PR #113, Lot C).

## [1.3.0] — 2026-06-29

### Ajouts — Sprint 4 UI Patrimoine

- Interface bailleur pour créer, afficher et révoquer les affectations au niveau patrimoine.
- Interface d’exceptions fines `INCLUSION`/`EXCLUSION` par bien, conditionnée à une affectation patrimoine active et alignée sur RS-04.
- Modèle frontend étendu et tests du dashboard ; PR #82 fusionnée dans `main` (`7738a08`) après CI, CodeQL, SonarQube, Gitleaks, Trivy et packaging verts.

### Ajouts — Endpoint historique affectations patrimoine

- `GET /api/patrimoines/{id}/affectations` : retourne l’historique complet des affectations d’un patrimoine, scopé par bailleur (403 sur patrimoine tiers ou inexistant). Correctif É-01 détecté en Staging lors de la validation E6 Sprint 4 ; PR #96.

### Gouvernance — Remédiation audit CGPA v5.4.1

- Activation de Dependabot et des correctifs automatiques ; mise à jour Angular DevKit/CLI `20.3.30` et override ciblé `http-proxy-middleware` `3.0.7` : `npm audit` passe de 3 alertes High à **0 High/Critical** (5 Moderate, 5 Low résiduelles dans la chaîne de build).
- Correction du clone superficiel du job Frontend (`fetch-depth: 0`) afin de restaurer le blame SonarQube et le calcul fiable du code nouveau.

## [1.2.1] — 2026-06-27

### Corrigé — Dashboard bailleur

- **Chargement des biens garanti même en cas d'erreur d'inscription** : `chargerBiens()` et
  `chargerReferentielsBien()` n'étaient appelés que dans le callback `next` de `inscrire()` ;
  une erreur d'inscription (401, 500, réseau) laissait le tableau de bord vide. `finalize`
  garantit désormais que `chargerBiens()` s'exécute en succès comme en erreur ;
  `chargerReferentielsBien()` est lancé immédiatement en parallèle de l'inscription.
  (`dashboard.component.ts` — `c1e9c73`)

## [1.2.0] — 2026-06-26

### Ajouts — Patrimoine (Sprint 3, exceptions fines par bien, US-85)

- **Exceptions `INCLUSION`/`EXCLUSION`** sur les affectations bien : une affectation bien `ACTIVE`
  court-circuite désormais toujours l'héritage d'une affectation patrimoine (RM-98) — `INCLUSION`
  accorde l'accès (comportement historique inchangé, US-23/24), `EXCLUSION` le refuse précisément
  sur ce bien tout en conservant l'accès aux autres biens du patrimoine.
- **RS-04** : une `EXCLUSION` sans affectation patrimoine `ACTIVE` du même gestionnaire est rejetée
  en 400 (état incohérent) ; une `INCLUSION` redondante reste tolérée (idempotente).
- **Migration V15** : colonne `affectation.type_exception`, backfill `INCLUSION` sur les
  affectations bien existantes, réécriture à priorité de `gestionnaire_affecte_actif` et
  `biens_affectes_gestionnaire`, et correctif ciblé de `calculer_honoraires` pour qu'une
  `EXCLUSION` ne génère jamais d'honoraire (carve-out d'accès, pas un mandat de gestion).
- **Backend-only** (périmètre tranché par le PO le 2026-06-24) : aucune UI livrée pour les
  exceptions, différée à un lot ultérieur.
- Kickoff confirmé par le PO le 2026-06-25 ; validation locale `mvn verify` 99 tests / 0 échec,
  Gitleaks 168 commits / no leaks, Trivy SCA 0 HIGH/CRITICAL. Rapport :
  `docs/cgpa/06-planification-agile/sprint-3-patrimoine-rapport-validation.md`.
- Intégrée à `main` via la PR #81 (`1c06085`, 2026-06-25) après correction d'un défaut latent de CI
  (clone Git superficiel cassant le blame SonarQube du job Backend) et résolution de 3 violations
  SonarQube nouvelles sur `AffectationService.creer()` (complexité cognitive, ternaire imbriqué,
  faux-positif NPE), sans changement de comportement.

### Corrigé — Câblage CORS Compose (2026-06-25)

- `APP_CORS_ALLOWED_ORIGIN` et `APP_INVITATION_BASE_URL` sont définies dans `.env` sur les hôtes
  staging et production depuis l'exposition publique (2026-06-16) mais n'étaient jamais transmises
  au conteneur `api` dans aucun fichier Compose — Spring utilisait le fallback `https://localhost`,
  cassant les requêtes CORS depuis l'origine publique et générant des liens d'invitation incorrects.
- Ajout des deux variables dans `docker-compose.yml` (couvre dev et prod par héritage Compose) et
  `docker-compose.staging.yml`. `docker-compose.prod.yml` non modifié : le service `api` n'y déclare
  pas de bloc `environment`, l'héritage du fichier de base est donc suffisant.
- Aucun code applicatif, aucune migration SQL. Commit `964ebfb`.

## [1.1.1] — 2026-06-24

### Release — Hotfix Production `1.1.1`

- Candidat Production recevable : commit `0adc4941`, images API/Web `sha-0adc4941`.
- CI, CodeQL, SonarQube et scans de sécurité verts ; Staging 4/4 healthy, smoke 47/0 et parcours navigateur réel validé.
- Gate Production accéléré : GO sous réserve acceptée ; `PRODUCTION_READY` atteint.
- Préflight Production PASS et backup `loyertracker-20260624-140441.dump` vérifié.
- Production `1.1.1` déployée sur `sha-0adc4941` ; smoke 47/0, nettoyage complet et `PRODUCTION_DEPLOYED` atteint.
- Hypercare 24 h : T0 PASS sous surveillance (2026-06-24 16:11:35 UTC), T+12 PASS sous surveillance (2026-06-25 06:21:54 UTC, fenêtre étendue par décision CDO), T+24 PASS sous surveillance (2026-06-25 16:48:05 UTC) — aucune alerte critique, tous seuils respectés.
- Statut CGPA v5.4.1 : **`PRODUCTION_DEPLOYED` — RELEASE CLÔTURÉE** (CDO : GO le 2026-06-25). Réserves maintenues : `RSV-STG-01`, dette CORS Compose.

### Gouvernance — Migration corrective CGPA v5.4.1 (2026-06-24)

- Normalisation de l’ADR-STG-001 au chemin canonique `docs/cgpa/adr/ADR-STG-001-staging-isolation.md`, avec conservation de l’ancien chemin v5.4 comme alias.
- Ajout des rapports de migration v5.4.1, maintien de `STG-ISOL-01` et ajout des risques RSV-STG-02 à RSV-STG-04.
- Aucun Gate rejoué ; décision GO sous réserve de la preuve live RSV-STG-01.

### Gouvernance — Migration CGPA v5.4 (2026-06-24)

- Migration additive du projet vers **CGPA v5.4** : `docs/project-state.md` passe à `framework.current_version: "5.4"` sans suppression d'historique, de décision, de risque ou de Gate validé.
- Ajout de la gouvernance des environnements Staging partagés : LoyerTracker partage l'hôte `ai-test-server` avec d'autres projets.
- Ajout du Gate bloquant **`STG-ISOL-01`** (isolation du déploiement Staging), statué **PASS** sur la base de l'architecture existante (namespace Docker, réseau/volume dédiés, ports paramétrables, reverse proxy par nom DNS, absence de commande Docker globale).
- Ajout du workflow `staging-isolation-workflow.md` et de la checklist `stg-isol-01-checklist.md`.
- Ajout des décisions D-STG-01 à D-STG-05 et du risque RSV-STG-01.
- Ajout de l'ADR obligatoire `ADR-STG-001-isolation-staging-partage.md` (rejette explicitement l'arrêt de tous les conteneurs de l'hôte avant chaque déploiement).
- Mise à jour des responsabilités Release Manager, DevSecOps Lead, Governance Officer et Enterprise Architect.
- Création des rapports de migration v5.4 dans `docs/cgpa/migration/`.

### Corrigé — Hotfix création/édition de bien cassée en Production (2026-06-24)

- Le tableau de bord bailleur n'envoyait pas `patrimoineId` (devenu obligatoire depuis `1.1.0`/V12) lors
  de la création ou la modification d'un bien : toute soumission échouait en 400. Le formulaire propose
  désormais un sélecteur de patrimoine (`GET /api/patrimoines`) et un sélecteur de type de bien
  (`GET /api/types-biens`), au lieu d'un champ texte libre.
- Tout nouveau bailleur se voit désormais créer automatiquement un patrimoine par défaut
  (« Patrimoine principal ») à l'inscription ; auparavant seuls les bailleurs déjà existants au moment
  de la migration V12 en disposaient, bloquant l'onboarding de tout nouveau bailleur.
- Aucune migration de schéma, aucun changement de contrat API existant.

## [1.1.0] — 2026-06-23

### Release — Production `1.1.0`

- Déploiement Production le 2026-06-23 avec le tag immuable GHCR `sha-05424aa3`.
- Backup pré-déploiement vérifié : `loyertracker-20260623-150659.dump`.
- Smoke Production post-déploiement : 47 PASS / 0 FAIL.
- Statut CGPA v5.3 : `PRODUCTION_DEPLOYED`.

### Gouvernance — Migration CGPA v5.3

- Migration additive du projet vers **CGPA v5.3** : `docs/project-state.md` passe à `framework.current_version: "5.3"` sans suppression d'historique, de décision, de risque ou de Gate validé.
- Ajout des statuts Release Management `STAGING_READY`, `STAGING_DEPLOYED`, `PRODUCTION_READY` et `PRODUCTION_DEPLOYED`.
- Ajout des workflows v5.3 Sprint -> Staging, Epic -> Production, Release -> Production et Hotfix -> Production.
- Ajout des checklists Gate Staging et Gate Production.
- Ajout des décisions D-RM-01 à D-RM-04 et des risques RSV-RM-01 à RSV-RM-04.
- Création des rapports de migration dans `docs/cgpa/migration/`.


### Ajouts — Patrimoine (Sprint 2, affectations patrimoine, PR #74)

- **Affectations patrimoine backend-first** : un bailleur peut affecter un gestionnaire à un
  patrimoine entier (`patrimoineId`) en complément des affectations bien existantes ; le modèle
  impose l'exclusivité bien/patrimoine et la migration V13 porte les contraintes/index nécessaires.
- **Héritage dynamique ReBAC** : `AuthorizationService` accorde l'accès aux biens d'un patrimoine
  affecté, y compris les biens ajoutés après l'affectation, tout en conservant la priorité des
  affectations bien existantes.
- **Liste effective gestionnaire** : `GET /api/biens` inclut le périmètre hérité par patrimoine sans
  doublons.
- **Garde RS-06** : l'archivage d'un patrimoine avec affectation patrimoine `ACTIVE` est refusé en
  400 jusqu'à révocation explicite.
- **Clôture Sprint 2** : validations locales backend/frontend/sécurité du 2026-06-23 puis CI GitHub
  PR #74 entièrement verte ; décision documentaire
  `docs/cgpa/06-planification-agile/sprint-2-patrimoine-cloture.md`.

### Documentation — Patrimoine (Sprint 2, plan approuvé)

- **Plan d'exécution Sprint 2 Patrimoine** : GO PO Option A confirmé pour un démarrage
  backend-first, couvrant les affectations au niveau patrimoine, l'héritage dynamique gestionnaire,
  la priorité de résolution avec les affectations bien existantes et la garde RS-06 avant archivage
  patrimoine. Document : `docs/cgpa/06-planification-agile/sprint-2-patrimoine-plan-execution.md`.

### Ajouts — Patrimoine (Sprint 1, modèle de données, PR #72)

- **Patrimoines bailleur** : nouveau niveau `Patrimoine` entre bailleur et bien, avec endpoints
  `/api/patrimoines` et statut d’archivage.
- **Typologie administrable des biens** : référentiel `TypeBien` administrable par le bailleur, en
  remplacement progressif de la saisie libre historique.
- **Rattachement obligatoire des biens** : `Bien.patrimoineId` devient obligatoire ; migration V12
  avec patrimoine par défaut par bailleur et rattachement des biens existants.
- **Sécurité / non-régression** : RLS activée/forcée sur les nouvelles tables et tests
  d’intégration Patrimoine + adaptations S02/S03/S04/documents.
- **Clôture Sprint 1 préparée** : validations complètes backend/frontend/sécurité rejouées le
  2026-06-21 (backend 78 tests, frontend 41 tests, Gitleaks/Trivy OK) ; décision documentaire
  `docs/cgpa/06-planification-agile/sprint-1-patrimoine-cloture.md`.

### Ajouts — Quittances de loyer (documents, lot post-go-live, PR2)

- **Quittance de loyer** et **avis d'échéance** générés **à la volée en PDF** (jamais stockés) à
  partir d'un loyer : `GET /api/biens/{bienId}/paiements/{periode}/quittance` (loyer `RECU`) et
  `…/avis-echeance` (loyer non soldé). Mise en page XHTML→PDF côté serveur (OpenHTMLtoPDF), avec
  ventilation loyer/charges et mentions bailleur/locataire/bien. Accès ReBAC (bailleur propriétaire
  ou gestionnaire affecté), cloisonné RLS. Adresse bailleur requise (409 explicite sinon).
- **Frontend** : boutons « Télécharger la quittance » / « Télécharger l'avis d'échéance » sur chaque
  loyer, selon son statut.

### Ajouts — Quittances de loyer (socle données, lot post-go-live, PR1)

- **Ventilation du loyer** : le bail distingue désormais le loyer hors charges (`loyer_hc`) et la
  provision de charges (`provision_charges`) ; le « charges comprises » (`loyer_cc`) en est dérivé
  et la cohérence `loyer_cc = loyer_hc + provision_charges` est imposée en base (migration V11).
  Formulaires de bail (bailleur + gestionnaire) mis à jour.
- **Profil bailleur** : adresse postale (`bailleur.adresse`), endpoint `GET`/`PUT /api/bailleurs/profil`
  et écran « Mon profil » — mention obligatoire de la future quittance.

### Suivi (déjà réalisé, consigné a posteriori)

- Validation staging par simulation d'incident de l'alerting (OBS-02/03) et re-validation du
  Gate Staging enrichi.
- Ratification du Gate 07A — Release Readiness.
- Go-live production réel (provisioning hôte, Gate 09/10) — réalisé le 2026-06-20, Gate 10 GO.

## [1.0.0] — 2026-06-16

Première release destinée à la production : MVP de gestion locative bailleur-centrée
fonctionnellement complet (S01→S04), industrialisé et observable. Validée sur staging ;
go-live production différé à un lot ultérieur.

### Ajouts — Fonctionnel (EP-03 / EP-04 / EP-05)

- **Comptes & délégation** : inscription bailleur, invitation gestionnaire tokenisée,
  acceptation d'invitation, autorisation fine ReBAC par bien (US-10→US-13).
- **Biens, baux, affectations** : CRUD biens, baux avec unicité, historiques, affectations avec
  honoraires (US-20→US-24) + frontend bailleur/gestionnaire.
- **Paiements & garanties** : génération des loyers attendus, pointage (RECU/PARTIEL/EN_RETARD/
  IMPAYE), dépôt/restitution de garantie, audit des écritures (US-30→US-32).
- **Honoraires & pilotage** : calcul des honoraires (POURCENTAGE/FORFAIT), alertes
  LOYER_EN_RETARD / FIN_BAIL / PREAVIS / GARANTIE_NON_RESTITUEE, scoping, journal d'audit
  bailleur (US-40, US-50/51/52, US-62) + consoles frontend.

### Ajouts — Sécurité & architecture

- Cloisonnement multi-tenant PostgreSQL RLS `FORCE` réellement exercée (rôle applicatif à
  privilèges minimaux), fonctions `SECURITY DEFINER` pour batch et résolution de tenant.
- AuthN Keycloak OIDC/PKCE, resource server JWT, RBAC realm + ReBAC applicatif.
- Schéma Flyway V1→V10.

### Ajouts — Industrialisation (Production Readiness)

- CD vers GHCR par tag immuable `sha-<8>` + scan Trivy des images api/web.
- Stack staging durcie (non-root, images GHCR), déploiement staging réel + smoke 46/0.
- Sauvegarde/restauration PostgreSQL versionnée, drill de restauration réel (RPO 24 h / RTO < 1 h).
- Observabilité : métriques Prometheus, `/healthz`, runbook, cron de backup installable.
- **Alerting des composants critiques** : Prometheus + Alertmanager + blackbox-exporter +
  Pushgateway (profil `monitoring`), 10 règles (API, base de données, Keycloak, jobs planifiés,
  sauvegarde) — OBS-02/03.

### Ajouts — Gouvernance (CGPA v5.2)

- Reprise CGPA v5.2 (`Resume Approved with Reservations`), Gate 06A — DevSecOps Readiness **GO**,
  Environment Promotion Model (ENV-01), Observability Governance, Release Governance.

### DevSecOps

- CI GitHub Actions : build, tests (backend Testcontainers, frontend Karma, smoke stack),
  SAST (CodeQL + SonarQube quality gate bloquant), SCA + scan d'images (Trivy bloquant), secrets
  (Gitleaks). Alignement `docker-compose.prod.yml` sur images GHCR par tag immuable.

### Limitations connues

- Go-live production réalisé le 2026-06-20 (Gate 10 GO) ; `1.0.0` LIVE.
- Alerting validé sur staging puis prouvé en production lors du Gate 10.
- OpenAPI non encore produit ; UX S02 minimale.

[Non publié]: https://github.com/jptshilombo/loyertracker/compare/v1.8.0...HEAD
[1.8.0]: https://github.com/jptshilombo/loyertracker/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/jptshilombo/loyertracker/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/jptshilombo/loyertracker/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/jptshilombo/loyertracker/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/jptshilombo/loyertracker/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/jptshilombo/loyertracker/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/jptshilombo/loyertracker/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/jptshilombo/loyertracker/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/jptshilombo/loyertracker/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/jptshilombo/loyertracker/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/jptshilombo/loyertracker/releases/tag/v1.0.0
