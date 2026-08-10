# Runbook Resend — canal EMAIL

| Champ | Valeur |
|-------|--------|
| Statut | **Code EP-18 livré sur `main` — activation Staging uniquement sur Gate explicite.** Ce runbook décrit la procédure d'exploitation du canal EMAIL Resend. Ne pas activer hors Gate Staging/Production distinct ; les secrets restent hors dépôt. |
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
2. Utiliser l'expéditeur validé pour les essais officiels EP-18 : `onboarding@resend.dev`. L'hypothèse d'un domaine `staging.loyerpro.org` est **sans objet** et n'est pas un prérequis du Gate EP-18.
3. Renseigner sur l'hôte Staging (jamais versionné) :
   ```
   RESEND_EMAIL_ENABLED=true
   RESEND_API_KEY=<clé Staging>
   RESEND_FROM_EMAIL=onboarding@resend.dev
   RESEND_FROM_NAME=LoyerTracker (Staging)
   RESEND_WEBHOOK_SECRET=<si Sprint C livré>
   ```
4. Restreindre les destinataires de test à une allowlist explicite (adresses de test du PO/QA) —
   **aucun utilisateur réel ne doit recevoir d'e-mail de test**.
5. Vérifier que le Compose cible transmet bien `RESEND_EMAIL_ENABLED`, `RESEND_API_KEY`,
   `RESEND_FROM_EMAIL` et `RESEND_WEBHOOK_SECRET` au conteneur `api` — prérequis bloquant découvert
   lors de l'instruction Gate Staging EP-18.
6. Redéployer ciblé (`api` uniquement si aucune migration Web) — patron `docker-compose.staging.yml`
   déjà en place.
7. Vérifier `notification.dispatch.total{canal="EMAIL", issue="ACCEPTE"}` après un envoi de test.

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

## 6. Bounce / plainte — webhook Resend (hors périmètre EP-18, reporté EP-19)

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
3. **Vérification EP-19 (non bloquante pour EP-18)** : le schéma de signature
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

## 9. Domaine d'envoi vérifié `loyertracker.org` — capacité disponible (2026-08-10)

**Ce que cette section ajoute** : jusqu'ici le canal EMAIL ne disposait d'aucun domaine d'envoi
propriété du projet ; l'expéditeur retenu pour EP-18 était le domaine partagé du fournisseur,
`onboarding@resend.dev` (cf. §1.2, arbitrage PO maintenu et non réécrit). Le projet dispose
désormais d'un domaine d'envoi vérifié, ce qui rend **techniquement possible** l'envoi de
notifications depuis une adresse portant le nom du produit.

### 9.1 État établi

| Élément | Valeur | Nature de la preuve |
|---|---|---|
| Domaine | `loyertracker.org` | Enregistré le 2026-08-10, compte AWS `381492172662`, registrar Route 53 |
| Zone DNS | `Z0352366IY9T9FQ9R2JD` (publique) | Délégation registrar alignée sur les NS de la zone |
| DKIM | `resend._domainkey` TXT, clé RSA 1024 bits en une seule chaîne | Vérifié par résolution publique |
| SPF | `send` MX `10 feedback-smtp.eu-west-1.amazonses.com` + TXT `v=spf1 include:amazonses.com ~all` | Vérifié par résolution publique |
| DMARC | `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:dmarc@loyertracker.org;` | Vérifié par résolution publique |
| TTL | `3600` s sur les quatre enregistrements | Lu depuis la zone autoritaire |
| Statut Resend | **Verified** | **Déclaré par le PO** depuis l'interface Resend le 2026-08-10 — non rejoué par contrôle automatisé |

Le domaine est **distinct de `loyerpro.org`** (zone `Z073040513ST6OIJ46NHK`), qui porte le produit
lui-même (`loyertracker.loyerpro.org` en Production, `loyertracker.staging.loyerpro.org` en
Staging, URI de redirection Keycloak). Toute intervention DNS ultérieure doit viser la bonne zone.

### 9.2 Capacité ouverte

L'expéditeur peut désormais être une adresse `@loyertracker.org` authentifiée par DKIM et SPF
alignés, avec une politique DMARC publiée. Cela lève la cause « domaine d'envoi non vérifié »
listée en §4 comme motif d'`ECHEC_PERMANENT`, et supprime la dépendance au domaine partagé du
fournisseur pour tout envoi futur vers des destinataires réels.

**Adresse expéditrice retenue (décision PO, 2026-08-10)** : `noreply@loyertracker.org`.

```
RESEND_FROM_EMAIL=noreply@loyertracker.org
```

Cette valeur est **arrêtée mais non déployée** : elle ne devient effective qu'au terme du Gate
mentionné en §9.3. La partie locale est consignée en minuscules — la casse d'une partie locale
n'est pas significative pour les principaux fournisseurs, mais une écriture unique évite toute
divergence entre documentation, configuration et gabarits.

### 9.3 Ce que cette capacité n'autorise pas

- **Aucune modification de la Production.** `RESEND_FROM_EMAIL=onboarding@resend.dev` reste la
  valeur en vigueur (activation du 2026-08-06T00:21:46Z). Tout changement d'expéditeur est une
  modification de configuration Production et exige un Gate distinct, conformément à §0.
- **Aucun envoi vers des utilisateurs réels** n'est autorisé par le seul fait de cette
  vérification : l'allowlist de destinataires de test (§1.4) et le budget mensuel (§5) restent
  applicables.
- **L'adresse `noreply@loyertracker.org` est arrêtée, pas mise en service.** La consigner ici ne
  vaut ni déploiement, ni autorisation d'envoi. Le nom affiché (`RESEND_FROM_NAME`) et la
  cohérence de marque entre `loyertracker.org` et `loyerpro.org` restent à trancher.

### 9.4 Réserves

- `RSV-DMARC-01` — **LEVÉE le 2026-08-10**, cf. §9.5. Énoncé initial conservé : les rapports
  agrégés DMARC n'étaient pas délivrés, `rua=` pointant vers `dmarc@loyertracker.org` alors
  qu'aucun MX racine ni boîte n'existait sur ce domaine. La réception étant montée et prouvée de
  bout en bout, la directive `rua=` est désormais opérationnelle.
- `RSV-DMARC-02` — la politique est `p=none`, purement observatoire : elle n'impose ni mise en
  quarantaine ni rejet des messages usurpant le domaine. **Reste ouverte** : la levée de
  `RSV-DMARC-01` rend l'analyse possible mais ne la remplace pas — le durcissement vers
  `quarantine` puis `reject` suppose des rapports réels effectivement reçus et analysés.
- `RSV-EMAIL-NOREPLY-01` — `noreply@loyertracker.org` n'est pas une boîte : faute de MX racine,
  toute réponse d'un destinataire est perdue **sans notification à l'expéditeur ni à
  l'utilisateur**. Le canal reste donc unidirectionnel par construction ; tout message envoyé
  depuis cette adresse doit porter un chemin de contact alternatif exploitable. À cumuler avec
  §6 : les webhooks Resend n'étant pas activés (reportés EP-19), ni les réponses ni les rebonds
  ne sont observables aujourd'hui. **Reste ouverte** : la réception montée en §9.5 n'accepte que
  `dmarc@loyertracker.org` — `noreply@` demeure volontairement non recevable.

### 9.5 Réception mail `loyertracker.org` — SES inbound vers S3 (2026-08-10)

Montée pour rendre la directive `rua=` opérationnelle. Entièrement dans le compte AWS du projet,
**aucun tiers dans le flux mail**, aucun coût récurrent fixe.

| Composant | Valeur |
|---|---|
| Région | `eu-west-1` |
| Identité SES | `loyertracker.org` — `VerificationStatus: Success` |
| Vérification | TXT `_amazonses.loyertracker.org`, TTL `3600` |
| MX racine | `10 inbound-smtp.eu-west-1.amazonaws.com`, TTL `3600` |
| Bucket | `loyertracker-inbound-mail`, accès public bloqué |
| Policy bucket | `s3:PutObject` pour `ses.amazonaws.com` seul, conditionné par `AWS:SourceAccount` et `AWS:SourceArn` du rule set |
| Rule set actif | `loyertracker-inbound` (région `eu-west-1`) |
| Règle | `dmarc-reports` → destinataire `dmarc@loyertracker.org`, dépôt sous préfixe `dmarc/` |
| Rétention | Cycle de vie S3 `expire-inbound-mail-180j` : expiration à 180 jours, abandon des uploads incomplets à 7 jours |

**Preuve de bout en bout (2026-08-10)** : envoi réel vers `dmarc@loyertracker.org`
(`MessageId 0102019fecac261e-…`), objet récupéré depuis `s3://loyertracker-inbound-mail/dmarc/`,
en-têtes conformes (`To: dmarc@loyertracker.org`, `Received-SPF: pass`). L'objet
`AMAZON_SES_SETUP_NOTIFICATION` présent dans le préfixe est le test d'écriture généré par SES à
la création de la règle, non un message reçu.

**Surface d'exposition** : seule l'adresse `dmarc@` est acceptée. Tout autre destinataire est
rejeté faute de règle correspondante — le domaine n'est pas un puits à courrier. Ajouter une
adresse recevable est une modification explicite du rule set, jamais un effet de bord.

**Limite connue** : les rapports sont déposés en MIME brut, XML agrégé compressé en pièce jointe.
Ils ne sont pas lisibles en l'état ; leur exploitation suppose un traitement de décompression et
d'analyse qui n'est pas fourni ici.

**Point d'attention exploitation** : le rule set actif est un réglage **de compte et de région**.
Aucun rule set n'était actif en `eu-west-1` avant cette mise en place ; toute activation
concurrente d'un autre rule set dans cette région désactiverait celui-ci.
- Le TTL de `3600` s implique jusqu'à une heure de propagation avant qu'une correction DNS ne
  prenne effet — à intégrer à toute fenêtre d'intervention.
