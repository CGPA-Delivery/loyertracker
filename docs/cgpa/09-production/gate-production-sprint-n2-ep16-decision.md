# Gate Production — EP-16 Sprint N+2 Lot A (fallback SMS et garde-fous)

| Champ | Valeur |
|---|---|
| Date | 2026-07-29 |
| Version | `1.15.0` MINOR (proposée — à confirmer et dater au Préflight) |
| Périmètre | **Lot A uniquement** (US-124 fallback SMS, US-126 observabilité/garde-fous). Lot B (US-125, interface préférences/historique) reste **hors périmètre**, bloqué par les Gates 02A/04A Frontend (`RSV-MIG-611-06`), sans lien avec ce Gate |
| Candidat applicatif | merge PR #291 (`ac374193e58a7f8733b29de47a407031b3c1fd12`) + correctif transmission env `docker-compose.staging.yml` (PR #300, outillage Staging seul, sans effet sur l'image) |
| Tag immuable | `sha-ac374193` |
| Digests | API `sha256:9603330ea530d2fe4e90b49a63e648c7a8b7679e8819f026f79e8108ca14557a` ; Web `sha256:3d7ddb5fff6346726492079414cbd0679ee3833dfe8721662cd00527024c4067` |
| Source | `ai-test-server`, `STAGING_DEPLOYED`, `STG-ISOL-01` PASS avant/après |
| Production actuelle / rollback | `1.14.0`, `sha-27dce09d` (clôturée le 2026-07-28) — vérifié live ce jour : 8/8 conteneurs `healthy`, `RestartCount=0`, Flyway 28/28, digests API/Web identiques à `production-state.env`, aucune dérive |
| Décision | **GO sous réserve — `PRODUCTION_READY`** |

## Périmètre

EP-16 Sprint N+2 Lot A : fallback SMS contrôlé (US-124) sur échec WhatsApp `PERMANENT`, jamais
automatique (K5, `NOTIFICATION_FALLBACK_ENABLED=false` par défaut) ; kill switch enfin câblé
(US-126, `NOTIFICATIONS_EXTERNAL_ENABLED`, inerte depuis le Sprint N) ; plafond budgétaire mensuel
(`NOTIFICATION_BUDGET_MENSUEL_MAX=0` par défaut, bloquant) ; métriques `notification.*` et quatre
alertes Alertmanager dédiées ; canal SMS pris en charge par `TwilioNotificationProvider`. Migration
**V29 strictement additive** : une seule fonction `SECURITY DEFINER` (`notification_envois_du_mois`),
aucune table ni colonne modifiée.

**Le Gate ne couvre pas l'activation Production des canaux externes**, exactement comme le Gate
Production du Sprint N+1. Conformément à K8 (ADR-18), toute activation réelle en Production reste
interdite jusqu'à la clôture en GO du **Sprint N+2 complet** (Lot A **et** Lot B) — ce Gate ne
porte que sur le Lot A ; le Lot B restant bloqué, la condition K8 d'« activation progressive
post-P0 » n'est **pas** satisfaite. Le déploiement de ce candidat livre uniquement la **capacité**
applicative (fallback SMS et garde-fous disponibles, conditionnels) sans jamais l'**activer** :
`NOTIFICATIONS_EXTERNAL_ENABLED`, `TWILIO_WHATSAPP_ENABLED`, `NOTIFICATION_FALLBACK_ENABLED`
doivent rester à leurs valeurs sûres par défaut (`false`) en Production, `NOTIFICATION_BUDGET_MENSUEL_MAX`
à `0`, et **aucun credential Twilio ne doit être ajouté au `.env` de l'hôte de production à ce
stade** — `NoopNotificationProvider` reste l'unique fournisseur actif après ce déploiement,
inchangé depuis le Sprint N.

## Checklist CGPA v6.1.1

| Critère | Statut | Preuve |
|---|---|---|
| Contrôle d'entrée R-V54-2 (`--host`) | **PASS, vérifié manuellement** | Script `infra/release/check-release-state.sh` absent de l'hôte de production (même dérive que sur Staging, non résolue dans ce Gate) — comparaison manuelle live : tag `.env`=`sha-27dce09d` = `PRODUCTION_TAG`, Flyway 28 = `FLYWAY_EXPECTED_PROD`, digests API/Web live identiques octet pour octet à `PRODUCTION_API_IMAGE_REF`/`PRODUCTION_WEB_IMAGE_REF`. **Nouvelle réserve** : synchroniser `infra/release/` sur l'hôte de production avant le prochain cycle |
| Identification complète | PASS | Sprint N+2 Lot A EP-16, `1.15.0` proposée, tag/digests et environnements identifiés |
| Candidat exact en Staging | PASS | `sha-ac374193`, Gate Staging **GO sous réserve** (`gate-staging-sprint-n2-ep16-decision.md`, addendum 2026-07-29) |
| `STG-ISOL-01` | PASS | 9 conteneurs `loyertracker-staging-*` + `nginx-proxy-manager` intacts avant/après, restart=0, seul `api` recréé (aucun changement Web dans ce lot), aucune commande Docker globale |
| Migration | PASS | V29 strictement additive, Flyway 29/29 en Staging ; une fonction `SECURITY DEFINER` en lecture seule, aucune colonne ni table modifiée |
| Smoke Staging | PASS | 63 PASS / 0 FAIL (après synchronisation des fichiers d'exploitation de l'hôte, dérive découverte et corrigée pendant la ré-instruction) |
| Validation fonctionnelle — critère GO explicite du sprint | **PASS avec limite documentée** | Fallback SMS vérifié avec de **vrais appels Twilio, aucun mock** : échec WhatsApp synchrone (HTTP 400) → `PERMANENT` → fallback réellement déclenché et tenté (`notification_fallback_total{issue="DECLENCHE"}=1`). **Limite** : un échec de livraison *asynchrone* (le cas réel le plus probable) ne déclenche pas le fallback — aucun SMS n'a atteint un téléphone réel dans ce test. Réserve non bloquante `RSV-EP16-N2-02` |
| CI / tests | PASS | PR #291 : Backend, Frontend, Sécurité, CodeQL ×2, Registry Policy, audit structurel tous `success` ; 220 tests, 0 échec |
| SonarQube | PASS | Quality Gate vert après correctif du faux positif `java:S125` (reformulation de commentaire, contenu inchangé) |
| Sécurité | PASS | Gitleaks, SCA, Trivy et CodeQL verts ; aucun secret versionné ; `TWILIO_SMS_FROM` non provisionné refuse l'envoi en `PERMANENT` plutôt que de tenter silencieusement |
| Release notes / changelog | PASS | Section `[Non publié]` de `CHANGELOG.md` couvre le Lot A ; promotion en `[1.15.0]` datée au Préflight |
| Observabilité | PASS | Quatre alertes Alertmanager dédiées (`component: notifications`), métriques `notification.*` complètes, runbook `docs/cgpa/runbook-notifications.md` livré — comble la limite déjà notée au Gate Production Sprint N+1 |
| PO / Release Manager | PASS | Instructions PO explicites reçues le 2026-07-28 (GO Sprint N+2 scindé) et le 2026-07-29 (ré-instruction Gate Staging, instruction Gate Production) |
| État release précédente | PASS | `1.14.0` `PRODUCTION_DEPLOYED` et **RELEASE CLÔTURÉE** le 2026-07-28 (hypercare T0/T+12/T+24 complète, sans incident) — aucune réserve bloquante héritée pour ce lot |

## Rollback

V29 est strictement additive (une fonction `SECURITY DEFINER`, aucune colonne modifiée) : le
rollback applicatif ciblé vers `sha-27dce09d` (`1.14.0`) reste viable après migration — l'ancienne
application ignore simplement la nouvelle fonction. La procédure cible exclusivement `api`
(aucun changement Web dans ce lot) ; PostgreSQL, Keycloak et monitoring ne doivent pas être
recréés.

Le Préflight devra produire et vérifier un backup base + globals avant migration, par discipline
constante du projet — aucun second backup post-migration n'est requis (V29 additive, même profil
que V27/V28).

## Réserves et conditions

| ID | Statut | Traitement |
|---|---|---|
| RSV-PROD-EP16-N2-01 — aucune activation réelle des canaux externes | Condition permanente du Gate | `NOTIFICATIONS_EXTERNAL_ENABLED`/`TWILIO_WHATSAPP_ENABLED`/`NOTIFICATION_FALLBACK_ENABLED` doivent rester `false` en Production, `NOTIFICATION_BUDGET_MENSUEL_MAX=0` ; aucun credential Twilio sur l'hôte de production avant la clôture en GO du Sprint N+2 **complet** (Lot A et Lot B) — K8, ADR-18 |
| `RSV-MIG-611-04` — addendum DAT et décision OpenAPI (Enterprise Architect) | **Ouverte, non bloquante** — reportée comme aux releases précédentes (arbitrage PO explicite du 2026-07-29, cohérent avec le traitement à `1.14.0` et au Gate Staging) | Le Lot A introduit une fonction SQL et une logique de dispatch nouvelles ; à confirmer par l'Enterprise Architect au prochain changement d'architecture, sans échéance bloquante fixée |
| `RSV-MIG-611-06` — Gates 02A/04A Frontend | Ouverte et bloquante **pour US-125 uniquement** | Sans rapport avec ce Lot A, exclu du périmètre |
| `RSV-EP16-N2-02` — couverture des échecs de livraison asynchrones par le fallback SMS | Nouvelle, non bloquante | Limite de conception constatée en Staging avec de vrais appels Twilio ; à arbitrer PO/Enterprise Architect dans un lot futur |
| Dérive `docker-compose.staging.yml`/`infra/release/` sur les hôtes Staging et Production (`LOYERTRACKER_TAG` vs `API_IMAGE_REF`/`WEB_IMAGE_REF`, fichiers d'exploitation absents) | Nouvelle, non bloquante pour ce Gate | Constatée sur les deux hôtes lors de cette instruction ; à résorber avant le prochain cycle Production pour éviter une divergence croissante |

Conditions bloquantes du Préflight distinct :

1. vérifier en lecture seule la Production `1.14.0`, sa capacité, Flyway 28/28 et son
   observabilité — **déjà fait dans le cadre de l'instruction de ce Gate** (8/8 actifs, 4/4
   `healthy`, `RestartCount=0`, digests conformes, aucune dérive) ;
2. produire et vérifier backup base + globals avant V29 ;
3. confirmer le tag `sha-ac374193`, les deux digests Staging et la disponibilité du rollback
   `sha-27dce09d` ;
4. promouvoir le changelog en `[1.15.0]` daté et figer la fenêtre ;
5. **confirmer explicitement l'absence de toute variable ou credential Twilio dans le `.env` de
   production**, et que `NOTIFICATIONS_EXTERNAL_ENABLED`/`TWILIO_WHATSAPP_ENABLED`/
   `NOTIFICATION_FALLBACK_ENABLED` resteront à leurs valeurs sûres par défaut après déploiement —
   **déjà vérifié à l'instruction de ce Gate : 0 occurrence Twilio/notification dans le `.env` de
   production** ;
6. préparer le smoke canonique ≥63 et confirmer 0 activité sur les tables `notification_outbox`/
   `notification_delivery` après déploiement (aucun envoi possible, `NoopNotificationProvider`
   actif) ;
7. cibler exclusivement `api` pour déploiement ou rollback (Nginx/Web inchangé, Lot A sans impact
   Frontend).

## Avis et décision

| Rôle | Avis |
|---|---|
| Governance Officer | **GO sous réserve** — checklist complète, historique préservé, `STG-ISOL-01` PASS, dérives d'exploitation détectées et tracées (pas dissimulées) |
| Enterprise Architect | **GO sous réserve** — V29 additive, fonction `SECURITY DEFINER` sur le patron déjà validé (`notification_bailleurs_en_attente`, V28) ; `RSV-MIG-611-04` reste ouverte, sans effet bloquant sur ce lot précis |
| DevSecOps Lead | **GO sous réserve** — CI, SonarQube, sécurité, images, Flyway, smoke et vérification fonctionnelle réelle PASS ; backup Préflight obligatoire ; dérive `infra/release/`/`docker-compose` des hôtes à résorber hors urgence |
| Release Manager | **GO sous réserve** — candidat figé ; aucune activation externe autorisée avant la clôture en GO du Sprint N+2 complet (Lot A et B) — K8 |
| Product Owner | **GO** — instructions explicites reçues le 2026-07-28 (GO Sprint N+2 scindé) et le 2026-07-29 (ré-instruction Staging, instruction Gate Production) |
| Chief Delivery Officer | **GO sous réserve — `PRODUCTION_READY`** |

**Décision finale : GO sous réserve.** `PRODUCTION_READY` est atteint le 2026-07-29.

Cette décision autorise uniquement un **Préflight Production**, action distincte à instruire
explicitement. Elle n'autorise aucune mutation ni aucun déploiement Production.
`PRODUCTION_DEPLOYED` reste non atteint. L'activation des canaux externes reste interdite jusqu'à
la clôture en GO du **Sprint N+2 complet** (Lot A et Lot B), conformément à K8 — ce Gate livre
uniquement la capacité applicative du Lot A, jamais son activation réelle en Production.
