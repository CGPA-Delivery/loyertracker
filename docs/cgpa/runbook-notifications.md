# Runbook — Notifications externes (EP-16)

| Champ | Valeur |
|---|---|
| Périmètre | Chaîne de notification externe Twilio (WhatsApp, SMS) — EP-16, ADR-18 |
| Sprint d'origine | Sprint N+2 Lot A (US-126), GO PO du 2026-07-28 |
| Complète | `docs/cgpa/07-devsecops/runbook-exploitation.md` (socle) et `docs/cgpa/observability-governance.md` |
| Public | Exploitant / DevSecOps Lead |

> **Verrou permanent K8 / ADR-18.** Aucun canal externe n'est activé en Production et aucun
> credential Twilio n'y est présent tant que le Sprint N+2 n'est pas **clos en GO**. Les procédures
> ci-dessous décrivent l'exploitation de la capacité, jamais une autorisation de l'activer.

## 1. Les trois verrous, du plus large au plus fin

La chaîne est fermée par défaut à trois niveaux indépendants. Comprendre lequel a agi est la
première question à se poser devant une notification non partie.

| Niveau | Drapeau | Défaut | Effet quand fermé |
|---|---|---|---|
| **Kill switch** | `app.notifications.external.enabled` (`NOTIFICATIONS_EXTERNAL_ENABLED`) | `false` | Le dispatch ne démarre pas. Les lignes restent `PENDING`, intactes. Métrique `notification_killswitch_bloque_total`. |
| **Plafond budgétaire** | `app.notifications.budget.mensuel-max` (`NOTIFICATION_BUDGET_MENSUEL_MAX`) | `0` | Le lot s'arrête. Les lignes restent `PENDING`. Métrique `notification_budget_bloque_total`. |
| **Fournisseur** | `app.notifications.whatsapp.enabled` (`TWILIO_WHATSAPP_ENABLED`) | `false` | `NoopNotificationProvider` est le seul bean actif : aucun appel réseau n'est possible. |

Le **fallback SMS** ajoute un quatrième verrou, propre à US-124 :
`app.notifications.fallback.enabled` (`NOTIFICATION_FALLBACK_ENABLED`), à `false` par défaut —
arbitrage **K5** : « pas de fallback automatique au premier pilote ».

**Aucun de ces verrous ne détruit de donnée.** Fermés, ils suspendent ; rouverts, la file repart.

## 2. Incident Twilio — que faire

### 2.1 Couper immédiatement

```bash
# Sur l'hôte, dans le répertoire du projet.
# 1. Fermer le kill switch dans le .env (jamais en ligne de commande : le secret ne doit
#    jamais transiter par l'historique shell — leçon de l'incident `set -x` du Gate Staging EP-13).
#    NOTIFICATIONS_EXTERNAL_ENABLED=false
# 2. Recréer le seul service api, jamais la stack entière.
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps api
```

> **Interdits absolus** (`CLAUDE.md`) : toute commande Docker à portée globale, tout `down` non
> ciblé, tout `prune`. L'hôte Staging est mutualisé ; l'hôte Production porte la base.

Le dispatch s'arrête au lot suivant (≤ 15 s par défaut). Les notifications déjà remises à Twilio
poursuivent leur cycle et leurs callbacks continuent d'être appliqués — c'est voulu : couper
l'émission ne doit pas faire perdre la traçabilité de ce qui est déjà parti.

### 2.2 Constater l'ampleur

```sql
-- File en attente, par statut. À exécuter dans le conteneur postgres.
SELECT statut, count(*) FROM notification_outbox GROUP BY statut ORDER BY 1;

-- Échecs récents et leur cause, sans exposer de destinataire.
SELECT last_error_code, count(*) FROM notification_outbox
WHERE statut IN ('RETRY', 'DEAD') GROUP BY 1 ORDER BY 2 DESC;

-- Consommation budgétaire du mois (fonction SECURITY DEFINER, retour agrégé).
SELECT notification_envois_du_mois();
```

### 2.3 Reprendre

Une fois l'incident fournisseur résolu :

1. Rouvrir le kill switch (`NOTIFICATIONS_EXTERNAL_ENABLED=true`), recréer `api` comme ci-dessus.
2. Les lignes `PENDING` repartent seules. Les lignes `RETRY` repartent à l'échéance de leur
   backoff exponentiel (1 min × 2^tentative).
3. Les lignes `DEAD` ne repartent **jamais** seules — c'est délibéré. Une reprise manuelle est
   une décision d'exploitation :

```sql
-- Reprise manuelle ciblée. À n'exécuter qu'après avoir établi que la cause est corrigée,
-- et en bornant explicitement le périmètre (ici : un code d'erreur et une fenêtre).
UPDATE notification_outbox
SET statut = 'PENDING', next_attempt_at = now(), attempt_count = 0
WHERE statut = 'DEAD'
  AND last_error_code = 'ERREUR_TRANSPORT_TWILIO'
  AND date_creation >= now() - interval '24 hours';
```

> Ne jamais relancer en masse sans filtre : une file `DEAD` contient aussi des échecs
> **définitifs légitimes** (numéro invalide, opt-out, destinataire hors Sandbox). Les rejouer
> consomme du budget et peut solliciter des destinataires qui se sont désinscrits.

## 3. Plafond budgétaire atteint

L'alerte `NotificationBudgetEpuise` signale que le dispatch est arrêté. Trois issues, à arbitrer :

1. **Laisser le mois s'achever** — les notifications partiront au 1er du mois suivant. Acceptable
   si le volume en attente est faible et non urgent.
2. **Relever le plafond** (`NOTIFICATION_BUDGET_MENSUEL_MAX`) — décision de coût, à tracer.
3. **Investiguer une dérive** — un plafond atteint prématurément est le symptôme attendu de
   `RSV-EP16-03` (dérive budgétaire) : boucle de retry, fan-out inattendu, incident de données.
   Vérifier `notification_dispatch_total` par issue avant de relever quoi que ce soit.

L'alerte `NotificationBudgetProche` (80 %) précède l'arrêt pour laisser le temps d'arbitrer.

## 4. Fallback SMS

Le fallback n'est **jamais** automatique. Pour qu'un SMS de secours parte, quatre conditions
cumulatives :

1. `NOTIFICATION_FALLBACK_ENABLED=true` (défaut `false`, K5) ;
2. l'échec WhatsApp est classé **`PERMANENT`** (un incident réseau est réessayé, jamais basculé) ;
3. le destinataire a `sms_opt_in = true` **et** `fallback_channel = 'SMS'` (K3) ;
4. aucun SMS n'existe déjà pour cet événement.

La quatrième condition est garantie en dernier ressort par la contrainte
`uq_notification_outbox_idempotence` : **un second SMS de secours est structurellement
impossible**, même en cas de bug applicatif.

Un `TWILIO_SMS_FROM` non provisionné fait échouer les SMS en `PERMANENT` (`CANAL_NON_PROVISIONNE`)
plutôt que de tenter un envoi — jamais de bascule silencieuse sur un autre canal.

Diagnostic : `notification_fallback_total` compte aussi les **refus**
(`REFUSE_POLITIQUE`, `REFUSE_CONSENTEMENT`, `DEJA_EN_FILE`), pas seulement les déclenchements. Un
fallback qui « ne marche pas » est presque toujours un refus explicite et compté.

## 5. Rotation des secrets Twilio

1. Créer le nouveau couple de credentials côté Twilio, **sans révoquer l'ancien**.
2. Mettre à jour le `.env` de l'hôte concerné (jamais versionné, jamais en ligne de commande).
3. Recréer le seul service `api` (`--no-deps`).
4. Vérifier qu'un envoi de test aboutit, puis seulement alors révoquer l'ancien credential.

Les secrets sont **distincts par environnement** (dev / staging / production). Un credential de
Sandbox ne doit jamais être réutilisé en Production — c'est un point de contrôle explicite du Gate
Production du Sprint N+2.

## 6. Métriques et absence de PII

| Métrique | Type | Labels |
|---|---|---|
| `notification_dispatch_total` | compteur | `canal`, `issue` |
| `notification_fallback_total` | compteur | `issue` |
| `notification_budget_consomme` | jauge | — |
| `notification_budget_plafond` | jauge | — |
| `notification_budget_bloque_total` | compteur | — |
| `notification_killswitch_bloque_total` | compteur | — |

**Aucun label ne porte de donnée personnelle.** Les seules dimensions sont des énumérations
fermées. Un numéro de téléphone, un identifiant de destinataire ou de bailleur en label
produirait à la fois une cardinalité non bornée et une fuite de données personnelles vers un
système de supervision qui n'est pas conçu pour en héberger.

La supervision dit **qu'**un problème existe et de quelle nature ; `notification_outbox` et
`notification_delivery`, sous RLS, disent **qui** est concerné. Cette séparation est délibérée et
doit être préservée par toute évolution ultérieure.
