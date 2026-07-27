# Rapport Déploiement Technique — Release `1.14.0` (EP-16 Sprint N+1 — WhatsApp P0)

> **Rapport établi a posteriori le 2026-07-27.** Le déploiement a réellement été exécuté le
> 2026-07-24 par le PO, sans rapport écrit au moment de la bascule. Ce document constate l'état
> réel de la Production et le confronte aux conditions du Gate Production et du Préflight. Il ne
> décrit pas une opération conduite le 2026-07-27 : aucune mutation n'a été exécutée à cette date,
> uniquement des contrôles en lecture seule.

| Champ | Valeur |
|---|---|
| Date du déploiement réel | 2026-07-24, ~12:48–12:49 UTC |
| Date du constat | 2026-07-27, ~16:27–16:31 UTC |
| Hôte | `loyertracker-prod-server` (`18.158.70.88`, instance `i-032524e6a47b72e05`) |
| Candidat | `sha-27dce09d` |
| Tag précédent | `sha-e4744d92` (`1.13.0`) |
| Autorisation PO | Gate Production GO sous réserve (`gate-production-sprint-n1-ep16-decision.md`) + Préflight PASS (`preflight-backup-v1.14.0-report.md`) ; exécution confirmée par le PO le 2026-07-27 (« c'est moi qui ai déployé le 24 ») |
| Verdict technique | **PASS — conforme, constaté a posteriori** |
| État CGPA | **`PRODUCTION_DEPLOYED` non prononcé** — validation finale non exécutée (cf. §Réserve) |

## Chronologie établie par horodatages sur l'hôte

L'hôte est en `Africa/Kinshasa` (+0100), le conteneur PostgreSQL en `UTC` ; les heures ci-dessous
sont normalisées en UTC.

| Horodatage (UTC) | Événement | Source |
|---|---|---|
| 2026-07-24 12:44 | `.env.bak-pre-1.14.0` créé (mode 600) | mtime fichier — étape du Préflight |
| 2026-07-24 12:48:22 | `.env` modifié → `LOYERTRACKER_TAG=sha-27dce09d` | mtime `.env` |
| 2026-07-24 12:48:50 | Conteneur `loyertracker-api-1` recréé | `docker inspect .Created` |
| 2026-07-24 12:48:51 | Conteneur `loyertracker-nginx-1` recréé | `docker inspect .Created` |
| 2026-07-24 12:49:00 | Migration **V28** `ep16 sprint n1 whatsapp` appliquée | `flyway_schema_history.installed_on` |
| 2026-07-26 14:41 | Redémarrage de l'instance EC2 (hôte éteint entre les opérations) | `aws ec2 describe-instances` `LaunchTime` |

Le déploiement a donc suivi le Préflight à ~4 minutes d'intervalle, dans la même session
d'exploitation. Le rapport de Préflight, rédigé et commité avant cette bascule, conclut
« *Aucun déploiement exécuté par ce Préflight* » et « *`PRODUCTION_DEPLOYED` non atteint* » : ces
deux phrases sont exactes au moment où elles ont été écrites, mais ont cessé de l'être quelques
minutes plus tard sans que la documentation soit reprise.

## Conformité aux conditions du Gate Production

| Condition | Constat au 2026-07-27 | Verdict |
|---|---|---|
| Candidat déployé = `sha-27dce09d` | `.env` : `LOYERTRACKER_TAG=sha-27dce09d` | ✅ |
| Digests identiques au Gate/Préflight | API `sha256:089028b45a93afd4f12d5aa22cfc63a38f5687bb1d0f7204bc1965154ce8d7ff` ; Web `sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8` — exacts | ✅ |
| (7) Déploiement ciblé `api`+`nginx` uniquement | `api`/`nginx` recréés le 2026-07-24 ; `postgres` créé le 2026-07-01, Keycloak et les 4 services de monitoring inchangés | ✅ |
| Aucune commande Docker à portée globale | Aucun conteneur hors périmètre recréé ; 8/8 conteneurs présents | ✅ |
| Migration V28 appliquée | Flyway **28/28 `success`**, V28 `ep16 sprint n1 whatsapp` | ✅ |
| Objets V28 présents | 3 lignes dans `notification_template` ; fonctions `notification_bailleurs_en_attente` et `notification_delivery_appliquer_statut` présentes | ✅ |
| (5) Aucun credential Twilio dans le `.env` hôte | `grep -cE "TWILIO_\|NOTIFICATIONS_EXTERNAL_ENABLED" .env` → **0** | ✅ |
| (6) 0 activité `notification_delivery` | `notification_outbox` = **0**, `notification_delivery` = **0** | ✅ |
| (6) Smoke Production ≥ 63 PASS | **Non exécuté** | ❌ |
| Rollback disponible | Images `loyertracker-api:sha-e4744d92` et `loyertracker-web:sha-e4744d92` présentes localement ; V28 additive ⇒ rollback applicatif seul viable | ✅ |

Le dépôt hôte a été synchronisé de `5d59b5f` à `8908d1d` (merge PR #255). Le seul écart sur les
fichiers Compose est l'ajout de 10 lignes à `docker-compose.yml` (bloc EP-16), détaillé ci-dessous ;
`docker-compose.prod.yml` est inchangé.

## Vérification K8 / ADR-18 — aucun canal externe actif

Point de lecture important pour les contrôles futurs : **le `.env` de production ne contient
aucune variable Twilio** (condition 5 du Gate, vérifiée à 0 occurrence), mais le
`docker-compose.yml` du Sprint N+1 déclare désormais ces variables avec des valeurs de repli
sûres. Elles sont donc **présentes dans l'environnement du conteneur `api`, mais vides ou à
`false`** — ce n'est pas une violation de K8, c'est le mécanisme de repli prévu par ADR-18 :

```
NOTIFICATIONS_EXTERNAL_ENABLED=false
TWILIO_WHATSAPP_ENABLED=false
TWILIO_SMS_ENABLED=false
NOTIFICATION_DRY_RUN=true
TWILIO_ACCOUNT_SID=            (vide)
TWILIO_AUTH_TOKEN=             (vide)
TWILIO_WHATSAPP_FROM=          (vide)
```

`TwilioNotificationProvider` n'est donc pas instancié ; `NoopNotificationProvider` reste l'unique
fournisseur actif, exactement comme en `1.13.0`.

**Preuve comportementale** : 17 événements `LOYER_EN_RETARD` ont été enregistrés dans
`notification_event` depuis le déploiement (activité métier normale, voie A `generer_alertes()`),
alors que `notification_outbox` et `notification_delivery` sont **tous deux à 0**. Aucune tentative
d'envoi externe n'a donc eu lieu, et aucun message n'a pu partir vers WhatsApp ou SMS.

## Contrôles de plateforme au 2026-07-27 (26 h après le dernier démarrage)

| Contrôle | Résultat |
|---|---|
| Services | 8/8 actifs, 4/4 healthy (`api`, `nginx`, `postgres`, `keycloak`) |
| `RestartCount` | 0 sur `api` et `nginx` |
| `/healthz` | 200 |
| Production publique | `https://loyertracker.loyerpro.org` → 200 |
| Prometheus | **5/5** cibles `up` |
| Alertmanager | **0 alerte active** |
| Erreurs API (26 h) | **0** entrée `ERROR` |
| 5xx Nginx (26 h) | **0** |
| Charge | load average 0,13 / 0,08 / 0,02 |

## Réserve bloquante — validation finale non exécutée

La condition 6 du Gate Production prévoyait l'exécution du **smoke Production canonique
(≥ 63 PASS / 0 FAIL)** au déploiement technique. Ce smoke n'a jamais été joué pour `1.14.0`. La
Production a donc tourné du 2026-07-24 au 2026-07-27 sur une release **techniquement conforme mais
jamais validée fonctionnellement**. Aucun incident n'est observable sur la période (0 `ERROR`,
0 5xx, 0 alerte, healthz et site public 200), ce qui constitue une présomption favorable, non une
preuve de conformité fonctionnelle.

En conséquence, et par cohérence avec la régularisation `1.11.0` du 2026-07-19 — où
`PRODUCTION_DEPLOYED` n'avait été confirmé rétroactivement qu'**après** avoir rejoué le smoke
(62 PASS / 0 FAIL) —, **`PRODUCTION_DEPLOYED` n'est pas prononcé par le présent rapport**.

**Prochaine étape** : validation finale sur autorisation PO explicite et distincte (elle réactive
temporairement `bailleur-test@test.local` et `directAccessGrants`, écrit puis supprime des données
de test en Production sous nettoyage transactionnel). L'activation des canaux externes reste
interdite jusqu'à la clôture en GO du Sprint N+2 (K8, ADR-18).

## Écart de gouvernance

Cet épisode est la **récidive** de l'écart de traçabilité déjà constaté et fermé pour `1.11.0` le
2026-07-19, dont la leçon enregistrée en §13 du Project State était : « *après un Préflight PASS,
rédiger le rapport de déploiement technique et la validation finale dans la même session que la
bascule du tag `.env`, avant tout démarrage d'un nouveau Sprint* ». Consigné en §13 sous
**R-V54-2**, avec une mesure plus contraignante qu'une simple leçon écrite.
