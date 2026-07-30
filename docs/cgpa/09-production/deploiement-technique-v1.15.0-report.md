# Rapport Déploiement Technique — Release `1.15.0` (EP-16 Sprint N+2 Lot A)

> **Rapport rédigé en temps réel**, dans la même session que la bascule elle-même — mesure
> corrective directe de l'écart de gouvernance R-V54-2 (déploiement non tracé, récidive
> `1.11.0`/`1.14.0`). Aucune reconstitution a posteriori dans ce document.

| Champ | Valeur |
|---|---|
| Date | 2026-07-30, ~12:27–12:33 UTC |
| Hôte | `loyertracker-prod-server` (`18.158.70.88`, instance `i-032524e6a47b72e05`) |
| Candidat | `sha-ac374193` (PR #291) |
| Tag précédent / rollback | `sha-27dce09d` (`1.14.0`) |
| Autorisation PO | Gate Production GO sous réserve (`gate-production-sprint-n2-ep16-decision.md`) + Préflight PASS (`preflight-backup-v1.15.0-report.md`) ; instruction explicite reçue dans la conversation de pilotage le 2026-07-30 : « Instruis le déploiement technique de la Production 1.15.0 » |
| Verdict technique | **PASS** |
| État CGPA | **`PRODUCTION_DEPLOYED` non prononcé** — validation finale requise, distincte (cf. §Réserve) |

## Périmètre — déploiement technique uniquement

Conformément à la distinction déjà établie par ce projet (`deploiement-technique-v1.14.0-report.md`
vs `validation-finale-v1.14.0-report.md`), ce rapport couvre exclusivement la bascule technique
(image, migration, contrôles techniques). Il ne couvre **pas** la validation finale (smoke
Production complet, réactivation temporaire de `bailleur-test@test.local`), qui reste une action
distincte à instruire explicitement par le PO.

## Séquence d'exécution (horodatages UTC réels)

| Étape | Résultat |
|---|---|
| Re-contrôle lecture seule (avant bascule) | 8/8 conteneurs `healthy`, `RestartCount=0`, tag `.env`=`sha-27dce09d`, Flyway 28/28, `bailleur-test` désactivé, `directAccessGrantsEnabled=false`, 0 occurrence Twilio/notification, `/healthz`=200, site public=200 — **aucune dérive depuis le Préflight** (~18 h plus tôt) |
| Synchronisation dépôt hôte | `git pull --ff-only origin main` : `8908d1d` → `66c2f4a` (fast-forward, 212 fichiers). Résorbe la réserve « `infra/release/` absent de l'hôte de production » notée au Gate |
| Backup base + globals (frais, pré-migration) | `loyertracker-20260730-132952.dump` (863686 octets, SHA-256 `0b59e207473a3aa8e7ba38cea58669dd9f06b4be3724b07ddfcbca09ab40d606`) + `loyertracker-20260730-132952.globals.sql` (1108 octets, SHA-256 `e5e26388fdd1dd806b487635dd6f9b4eb0f4273aeba7729a573081bac09cef2f`), modes 600. Taille identique au backup du Préflight (863686 octets) — aucune écriture métier entre les deux, cohérent avec un hôte sans trafic public annoncé |
| Sauvegarde `.env` | `.env.bak-pre-1.15.0` créé avant modification |
| Édition `.env` | `API_IMAGE_REF=ghcr.io/jptshilombo/loyertracker-api@sha256:9603330ea530d2fe4e90b49a63e648c7a8b7679e8819f026f79e8108ca14557a` et `WEB_IMAGE_REF=ghcr.io/jptshilombo/loyertracker-web@sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8` **ajoutés** (absents jusqu'ici — cf. §Dérive corrigée). `WEB_IMAGE_REF` reprend le digest `1.14.0` déjà en service, **inchangé** — aucun impact Nginx dans ce lot. `LOYERTRACKER_TAG=sha-27dce09d` laissé en place, désormais inerte (`docker-compose.prod.yml` ne le référence plus) |
| Pull image | `docker compose -f docker-compose.yml -f docker-compose.prod.yml pull api` (ciblé, aucune autre image tirée) |
| Recréation | `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps api` (ciblé) → `loyertracker-api-1` recréé à **2026-07-30T12:31:50Z**. Avertissement Compose bénin sur des « conteneurs orphelins » (les 4 services de monitoring, définis dans un autre fichier Compose non inclus dans cette invocation) — **aucune action prise**, `--remove-orphans` non utilisé, aucun conteneur affecté |
| Migration | Flyway applique **V29** (`ep16 sprint n2 budget notifications`) au démarrage de l'API |

## Dérive corrigée — `.env` encore sur l'ancien schéma `LOYERTRACKER_TAG`

Découverte au re-contrôle initial : le `.env` de production n'avait **ni** `API_IMAGE_REF` ni
`WEB_IMAGE_REF` — encore sur l'ancien schéma `LOYERTRACKER_TAG`, alors que
`docker-compose.prod.yml` (synchronisé depuis `main`) exige désormais ces deux variables
(`${API_IMAGE_REF:?...}` / `${WEB_IMAGE_REF:?...}`). C'est la même dérive que celle documentée pour
`docker-compose.staging.yml` sur `ai-test-server` (issue du chantier supply-chain RSV-MIG-611-05),
mais côté Production, non résorbée avant ce cycle malgré la réserve notée au Gate. **Corrigée par
ce déploiement** : les deux variables sont désormais présentes avec les digests exacts.

## Conformité aux conditions du Gate Production

| Condition | Constat | Verdict |
|---|---|---|
| Candidat déployé = `sha-ac374193` | `API_IMAGE_REF` pointe le digest exact, conteneur `api` exécute `9603330ea530` | ✅ |
| Digest identique au Gate/Préflight | `sha256:9603330ea530d2fe4e90b49a63e648c7a8b7679e8819f026f79e8108ca14557a` — exact | ✅ |
| (7) Déploiement ciblé `api` uniquement | Seul `loyertracker-api-1` recréé (`Created=2026-07-30T12:31:50Z`) ; `nginx`/`postgres`/`keycloak` non recréés (`Created` inchangés : `2026-07-24T12:48:51Z` / `2026-07-01T09:38:34Z` / `2026-07-01T09:38:35Z`) | ✅ |
| Aucune commande Docker à portée globale | `pull`/`up -d` ciblés `api` uniquement ; `--remove-orphans` jamais utilisé | ✅ |
| Migration V29 appliquée | Flyway **29/29 `success`**, `V29 ep16 sprint n2 budget notifications` | ✅ |
| Objet V29 présent | Fonction `notification_envois_du_mois` confirmée en base | ✅ |
| (5) Aucun credential Twilio dans le `.env` hôte | `grep -cE "TWILIO_\|NOTIFICATIONS_EXTERNAL_ENABLED\|NOTIFICATION_FALLBACK_ENABLED" .env` → **0**, avant et après édition | ✅ |
| (6) 0 activité `notification_delivery` (lecture seule) | `notification_outbox`=**0**, `notification_delivery`=**0** | ✅ |
| (6) Smoke Production ≥ 63 PASS | **Hors périmètre de ce rapport** — relève de la validation finale, distincte | — |
| Rollback disponible | Image `loyertracker-api:sha-27dce09d` (digest `089028b45a93…`) toujours présente localement sur l'hôte ; V29 additive ⇒ rollback applicatif seul viable | ✅ |

## Contrôles de plateforme post-bascule

| Contrôle | Résultat |
|---|---|
| `api` | `healthy`, `RestartCount=0` |
| `nginx`/`postgres`/`keycloak` | `healthy`, `RestartCount=0`, non recréés |
| `/healthz` | 200 |
| Production publique | `https://loyertracker.loyerpro.org` → 200 |
| Prometheus | **5/5** cibles `up` |
| Alertmanager | **0 alerte active** |
| 5xx Nginx (5 min post-bascule) | **0** |
| Logs API (3 min post-bascule) | **0** ligne `ERROR`/`Exception` |
| Disque / mémoire / charge | 30 Gio libres (23 %), ~1,8 Gio disponible, load average 0,41/0,21/0,07 |

## Vérification K8 / ADR-18 — aucun canal externe actif

`.env` de production toujours à **0 occurrence** Twilio/notification après la bascule. Les trois
drapeaux (`NOTIFICATIONS_EXTERNAL_ENABLED`, `TWILIO_WHATSAPP_ENABLED`, `TWILIO_SMS_ENABLED`) et le
plafond (`NOTIFICATION_BUDGET_MENSUEL_MAX`) retombent sur leurs valeurs sûres par défaut Spring
(`false`/`0`, `application.yml:108-126`). `NotificationProvider` en service reste exclusivement
`NoopNotificationProvider`. Conforme à `RSV-PROD-EP16-N2-01` et à K8 (ADR-18) : aucune activation
réelle avant la clôture en GO du Sprint N+2 complet (Lot A et Lot B).

## `check-release-state.sh --host` — écart résiduel attendu, non bloquant

Exécuté avant et après la bascule. Après bascule : **4 écarts signalés**, tous attendus et non
bloquants à ce stade précis de la séquence :

- 3 écarts (digest API, Flyway 28≠29, référence conteneur API) proviennent uniquement du fait que
  `infra/release/production-state.env` **du dépôt** déclare encore `1.14.0` — ce fichier est mis à
  jour dans le même commit que le présent rapport (cf. `production-state.env` modifié ci-après) ;
  une fois la PR fusionnée et le dépôt hôte resynchronisé (`git pull`), ces 3 écarts disparaîtront.
- 1 écart est **résiduel et durable jusqu'au prochain lot touchant le Web** :
  `loyertracker-nginx-1` exécute encore la référence `loyertracker-web:sha-27dce09d` (forme *tag*,
  héritée de l'ancien schéma), alors que `WEB_IMAGE_REF` déclare désormais la forme *digest*
  équivalente. Le contenu de l'image est strictement identique (même digest,
  `sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8`) ; seule la forme de
  référence diffère, parce que `nginx` n'est délibérément pas recréé dans ce lot (condition 7 du
  Gate). Cet écart se résorbera de lui-même à la prochaine release qui touche Nginx/Web.

## Rollback

Images `loyertracker-api:sha-27dce09d` (digest `089028b45a93afd4f12d5aa22cfc63a38f5687bb1d0f7204bc1965154ce8d7ff`)
toujours présentes localement — aucun `pull` requis pour un retour arrière. V29 étant strictement
additive, ce rollback applicatif reste viable **même après** application de la migration
(l'ancienne application ignore simplement la nouvelle fonction). Backup base + globals
pré-migration disponible en dernier recours (`loyertracker-20260730-132952.dump`).

## Réserve bloquante — validation finale non exécutée (par construction, hors périmètre)

Comme pour `1.14.0` et `1.11.0`, ce déploiement technique **n'inclut pas** l'exécution du smoke
Production canonique (condition 6 du Gate) ni la réactivation temporaire de
`bailleur-test@test.local`/`directAccessGrants` qu'il requiert. `PRODUCTION_DEPLOYED` n'est donc
**pas prononcé** par ce rapport.

**Prochaine étape** : validation finale sur autorisation PO explicite et distincte (« instruis la
validation finale »). L'activation des canaux externes reste interdite jusqu'à la clôture en GO du
Sprint N+2 complet (K8, ADR-18).

## Écart de gouvernance R-V54-2 — non récidivé

Contrairement à `1.11.0` et `1.14.0`, ce rapport est rédigé **dans la même session** que la
bascule réelle, avec horodatages vérifiés sur l'hôte au moment de l'exécution — la mesure attendue
depuis la récidive `1.14.0` est appliquée pour la première fois sur ce cycle.
