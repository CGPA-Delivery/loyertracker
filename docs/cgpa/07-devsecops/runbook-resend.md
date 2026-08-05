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

## 6. Bounce / plainte — webhook Resend (Sprint C, implémenté 2026-08-05, jamais activé)

Le code est livré (`ResendCallbackController`, `ResendSignatureVerifier`,
`NotificationDeliveryService.appliquerCallbackResend`) mais **rien n'est activé côté dashboard
Resend** dans cette mission — sans configuration côté fournisseur, aucun webhook réel n'arrive
jamais, `NotificationDelivery` continue de refléter uniquement l'acceptation initiale
(`QUEUED`/`SENT` selon transition). Ne jamais communiquer un « e-mail livré » sans confirmation
webhook réelle.

**Activation (Staging/Production uniquement, hors périmètre de cette mission)** :
1. Configurer un endpoint webhook dans le dashboard Resend pointant vers
   `https://<domaine>/api/public/notifications/resend/callback`, événements
   `email.sent`/`email.delivered`/`email.opened`/`email.bounced`/`email.complained`.
   `email.delivery_delayed`/`email.clicked` et tout autre type sont reçus (204) mais ignorés
   (aucune mutation) — comportement volontaire, pas une lacune.
2. Copier le secret de signature généré par Resend dans `RESEND_WEBHOOK_SECRET` (format
   `whsec_<base64>`, jamais journalisé, jamais commité).
3. **Vérification obligatoire avant tout Gate Staging (RSV-EP18-06)** : le schéma de signature
   implémenté (Svix — en-têtes `svix-id`/`svix-timestamp`/`svix-signature`, HMAC-SHA256 sur
   `{svix-id}.{svix-timestamp}.{corps brut}`, secret préfixé `whsec_` puis décodé en base64,
   fenêtre de fraîcheur ±5 min) a été implémenté par recommandation par défaut, **jamais vérifié
   contre un webhook réel envoyé par Resend**. Déclencher un envoi de test depuis le dashboard
   Resend et confirmer en base que `notification_delivery.statut` progresse correctement avant de
   considérer ce risque clos.
4. Correlation : `provider_message_id` (capturé à l'émission, `ResendEmailProvider`) =
   `data.email_id` du payload webhook — aucune configuration supplémentaire requise.
5. Idempotence : callback dupliqué/hors ordre → aucune transition supplémentaire (fonction
   `SECURITY DEFINER notification_delivery_appliquer_statut`, V28, réutilisée sans modification).

**Désactivation d'urgence** : retirer/désactiver l'endpoint côté dashboard Resend (aucun
redéploiement applicatif requis — l'endpoint reste en écoute mais ne reçoit plus rien) ; en dernier
recours, retirer l'entrée `permitAll()` de `SecurityConfig` (redéploiement).

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
