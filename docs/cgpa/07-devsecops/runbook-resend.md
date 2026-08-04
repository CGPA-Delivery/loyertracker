# Runbook Resend — canal EMAIL

| Champ | Valeur |
|-------|--------|
| Statut | **Anticipé — aucun code livré à ce jour.** Ce runbook documente la procédure cible pour EP-18 (Sprint A/B), à valider/ajuster une fois le code réellement livré et déployé. Ne pas exécuter avant `RESEND_EMAIL_ENABLED` disponible en configuration. |
| Date | 2026-08-04 |
| Documents liés | `ADR-19-notifications-email-resend.md`, `runbook-exploitation.md` (runbook général, non modifié) |
| Portée | Canal `EMAIL` uniquement — le runbook Twilio (WhatsApp/SMS) reste couvert par les sections notifications de `runbook-exploitation.md` et par ADR-18, non dupliquées ici |

## 0. Principes

- Kill switch EMAIL (`RESEND_EMAIL_ENABLED`) est **indépendant** du kill switch WhatsApp/SMS
  (`TWILIO_WHATSAPP_ENABLED`/`TWILIO_SMS_ENABLED`) et du kill switch maître
  (`NOTIFICATIONS_EXTERNAL_ENABLED`) — couper EMAIL n'arrête jamais WhatsApp/SMS et réciproquement.
- Aucune activation Production sans Gate Production distinct, conformément à CLAUDE.md/AGENTS.md.
- Aucune clé Resend réelle n'est jamais committée, journalisée ou placée dans un test.

## 1. Activation (Staging)

1. Provisionner une clé Resend **Staging**, distincte de toute clé Production (même principe que
   `KEYCLOAK_API_CLIENT_SECRET`, secrets distincts par environnement).
2. Vérifier le domaine d'envoi Staging (SPF/DKIM/DMARC) — prérequis externe, non codé.
3. Renseigner sur l'hôte Staging (jamais versionné) :
   ```
   RESEND_EMAIL_ENABLED=true
   RESEND_API_KEY=<clé Staging>
   RESEND_FROM_EMAIL=<expéditeur Staging identifiable, ex. notifications@staging.loyerpro.org>
   RESEND_FROM_NAME=LoyerTracker (Staging)
   RESEND_WEBHOOK_SECRET=<si Sprint C livré>
   ```
4. Restreindre les destinataires de test à une allowlist explicite (adresses de test du PO/QA) —
   **aucun utilisateur réel ne doit recevoir d'e-mail de test**.
5. Redéployer ciblé (`api` uniquement si aucune migration Web) — patron `docker-compose.staging.yml`
   déjà en place.
6. Vérifier `notification.dispatch.total{canal="EMAIL", issue="ACCEPTE"}` après un envoi de test.

## 2. Désactivation (urgence, sans redéploiement)

```
RESEND_EMAIL_ENABLED=false
```

Puis redémarrage du conteneur `api` seul (pas de recréation nécessaire si la variable est déjà
câblée dans le Compose) — `NoopEmailProvider` reprend immédiatement, `WHATSAPP`/`SMS` non affectés.
Les lignes Outbox EMAIL en attente restent `PENDING`, aucune perte.

## 3. Rotation de la clé API

1. Générer une nouvelle clé dans la console Resend (privilège minimal — envoi seul si l'offre le
   permet).
2. Mettre à jour la variable d'environnement hôte (jamais dans le dépôt).
3. Redéployer `api` ciblé.
4. Vérifier un envoi de test réussi, puis révoquer l'ancienne clé côté Resend.
5. Consigner la rotation dans `docs/project-state.md` (date, environnement, sans exposer la valeur).

## 4. Diagnostic d'un incident Resend

| Symptôme | Vérification |
|---|---|
| `notification.dispatch.total{canal="EMAIL", issue="ECHEC_TEMPORAIRE"}` en hausse | Statut Resend (page de statut du fournisseur), latence réseau, timeout configuré (`RESEND_READ_TIMEOUT_MS`) |
| `notification.dispatch.total{canal="EMAIL", issue="ECHEC_PERMANENT"}` en hausse | Domaine d'envoi non vérifié, clé invalide/révoquée, adresses destinataires massivement invalides |
| Lignes `notification_outbox` bloquées en `DEAD` | Consulter `last_error_code` (RLS, accès bailleur du support), réinitialiser manuellement en `PENDING` si la cause est corrigée — jamais de reprise automatique |
| `notification.budget.bloque.total` incrémenté sur EMAIL | Plafond `RESEND_BUDGET_MENSUEL_MAX` atteint — décision d'exploitation explicite pour l'ajuster, jamais silencieuse |

## 5. Quota / budget

Plafond mensuel dédié (`RESEND_BUDGET_MENSUEL_MAX`, défaut `0` = aucun envoi autorisé). Atteint, le
dispatch EMAIL s'arrête (lignes restent `PENDING`, aucune perte) sans affecter le budget WhatsApp/SMS.
Ajustement = décision d'exploitation tracée, jamais un défaut de configuration silencieux.

## 6. Bounce / plainte (dette explicite tant que le Sprint C webhook n'est pas livré)

Sans webhook Resend actif, `NotificationDelivery` ne reflète que l'acceptation initiale par le
fournisseur (`ACCEPTED`), **jamais** une preuve de livraison finale. Ne jamais communiquer un
« e-mail livré » sur cette seule base. À l'activation du webhook (Sprint C) : mêmes statuts que le
patron Twilio (`delivered`/`bounced`/`complained`/`failed`), signature HMAC vérifiée, idempotence
par `provider_message_id`.

## 7. Rollback

Migration `V30` strictement additive — un rollback applicatif (redéploiement du tag précédent)
suffit, sans restauration de sauvegarde. `RESEND_EMAIL_ENABLED=false` comme filet de sécurité
supplémentaire, activable sans redéploiement.

## 8. Incident fournisseur (Resend indisponible)

Aucune opération métier n'est jamais bloquée (ADR-19 §1, EF-125/RM-124) — une invitation reste
créée et consultable même si Resend est totalement indisponible. Les lignes Outbox EMAIL
s'accumulent en `PENDING`/`RETRY` et seront rejouées automatiquement au rétablissement du
fournisseur (backoff exponentiel existant, hérité d'ADR-18). Aucune action manuelle requise sauf
dépassement du nombre maximal de tentatives (`DEAD`), auquel cas une reprise manuelle ciblée est
possible après diagnostic.
