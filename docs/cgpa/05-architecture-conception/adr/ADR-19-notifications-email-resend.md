# ADR-19 — Canal EMAIL via Resend, extension du système multicanal (EP-18)

| Champ | Valeur |
|-------|--------|
| Statut | **Gate Staging EP-18 GO (2026-08-05)** — émission/réception EMAIL via Resend validée par le Product Owner (`onboarding@resend.dev`, Provider Message ID `fdac0ef4-a19f-4893-9f89-abe55b1f25c8`). Socle EMAIL/Resend (Sprint A) et invitation par e-mail (Sprint B, US-139) validés ; fondation technique webhook (US-143) conservée mais validation opérationnelle reclassée hors périmètre EP-18 dans EP-19. `RESEND_EMAIL_ENABLED=false` remis après test, aucune activation Production. |
| Date | 2026-08-04 |
| Origine | Instruction PO du 2026-08-04 (« intégrer Resend comme fournisseur d'e-mails transactionnels ») |
| Décision | **D-NOTIF-002** |
| Principe | Additif — n'invalide, ne rejoue ni ne modifie ADR-18/D-NOTIF-001, ni aucun Gate/décision/risque déjà statué |

## Contexte

ADR-18 (Accepté, 2026-07-19) a livré un système de notifications multicanal
(`IN_APP`/`WHATSAPP`/`SMS`) : `NotificationEvent`/`NotificationOutbox`/`NotificationDelivery`/
`NotificationPreference`/`NotificationTemplate`, `NotificationDispatcher`, abstraction
`NotificationProvider`, adaptateur `TwilioNotificationProvider`. En Production `1.15.0`
(clôturée le 2026-08-04), ce socle tourne avec `NoopNotificationProvider` seul actif — aucun canal
externe n'a jamais envoyé de message réel en Production (K8/ADR-18 prouvé sous trafic réel).

Le PO souhaite ajouter **Resend** comme fournisseur d'e-mails transactionnels, en **API HTTPS**
(pas SMTP), pour le premier usage suivant : notifier par e-mail le destinataire d'une invitation de
délégation gestionnaire (`InvitationService`), qui n'est aujourd'hui notifié par aucun canal.

## Problème

Étendre le système multicanal existant pour qu'EMAIL devienne un canal natif au même titre que
WHATSAPP/SMS, **sans** :

1. créer un `EmailService` parallèle contournant l'Outbox ;
2. coupler le domaine métier (`InvitationService`, et les services financiers futurs) à Resend ;
3. rejouer ou modifier ADR-18/D-NOTIF-001 ;
4. introduire un fallback automatique non désiré entre EMAIL et WHATSAPP/SMS ;

et en traitant une différence structurelle qu'ADR-18 n'a pas eu à couvrir : **le destinataire d'une
invitation n'a pas encore de compte**, donc pas de `NotificationPreference` à laquelle rattacher un
opt-in.

## Constats de l'analyse du code réel (au-delà de ce qu'ADR-18 documentait déjà)

1. **`NotificationDispatcher` reçoit aujourd'hui un unique bean `NotificationProvider`**, choisi par
   exclusion mutuelle Spring (`@ConditionalOnProperty` opposé entre `TwilioNotificationProvider` et
   `NoopNotificationProvider`, même flag `whatsapp.enabled`). Ce modèle "un seul fournisseur pour
   tout" ne peut structurellement pas accueillir un second fournisseur pour un second canal — ce
   n'est pas une préférence de conception, c'est un blocage mécanique vérifié dans le code.
2. **`NotificationProvider.DemandeEnvoi` est couplé à `phoneE164`** (`record DemandeEnvoi(String
   phoneE164, CanalNotification canal, String templateCode, Map<String,String> variables)`) — ne
   peut pas porter une adresse e-mail sans généralisation.
3. **`NotificationFallbackService.evaluer(...)` ne se déclenche que depuis `WHATSAPP`**
   (`if (echec.getChannel() != WHATSAPP) return false`) — un fallback EMAIL→SMS/WHATSAPP n'existe
   pas et ne serait pas un correctif mais une extension de comportement délibérée (cf. K5).
4. **`InvitationService.inviter(...)` ne notifie personne** — persiste l'invitation et retourne
   `InvitationDto`, aucun appel notification. `Invitation.email` existe déjà comme champ natif :
   source de vérité directe pour ce destinataire, sans duplication à inventer.
5. **Aucune `NotificationPreference` ne peut exister pour un destinataire d'invitation** —
   `TypeDestinataire` est aujourd'hui `BAILLEUR`/`GESTIONNAIRE`/`LOCATAIRE`, trois comptes existants.
   Un invité n'est encore aucun des trois : le fan-out par préférence (`NotificationOutboxService
   .emettre`, qui exige une préférence active et opt-in) ne s'applique pas à ce cas, qui n'est pas
   une communication soumise à consentement mais l'exécution d'une action déjà demandée par le
   bailleur (base légale distincte, cf. §RGPD).
6. **Quatre contraintes `CHECK` PostgreSQL** (`notification_outbox.channel`,
   `notification_delivery.channel`, `notification_template.channel`,
   `notification_preference.preferred_channel`) sont câblées en dur `('WHATSAPP','SMS')` (V27) —
   ajouter `EMAIL` exige une migration additive (`ALTER ... DROP/ADD CONSTRAINT`), pas une simple
   valeur d'enum côté Java.
7. **`generer_alertes()` (SQL, voie A) insère déjà `channel = p.preferred_channel`** sans branche
   conditionnelle sur la valeur — une fois la contrainte CHECK étendue, EMAIL fonctionnerait
   automatiquement pour `LOYER_EN_RETARD`/`FIN_BAIL`/`PREAVIS`/`GARANTIE_NON_RESTITUEE` sans toucher
   à la fonction SQL. Confirme que le verrou technique est uniquement le CHECK, pas la logique.
8. **`RgpdService` ne référence aucune entité `notification_*`**, y compris pour WhatsApp/SMS déjà en
   Staging — dette préexistante, non introduite ni aggravée par ce mandat.
9. **Aucune UI d'invitation n'existe** (`grep` frontend vide) — le flux est API-only aujourd'hui.

## Options étudiées

| # | Option | Verdict |
|---|--------|---------|
| 1 | `EmailService` autonome appelant Resend directement depuis `InvitationService` | **Rejetée** — viole explicitement le principe d'ADR-18 (indépendance du domaine métier vis-à-vis d'un fournisseur externe), duplique l'Outbox/retry/dead-letter déjà éprouvés |
| 2 | Généraliser `NotificationProvider` en `ChannelNotificationProvider` (par canal) + adaptateur `ResendEmailProvider`, réutilisation intégrale de l'Outbox/Dispatcher | **Recommandée — D-NOTIF-002** |
| 3 | SMTP au lieu de l'API HTTPS Resend | **Rejetée** — décision PO explicite pour l'API HTTPS (meilleure observabilité des statuts, pas de gestion de file SMTP) |
| 4 | Étendre `NotificationPreference` pour couvrir aussi les destinataires d'invitation (créer une préférence "à la volée") | **Rejetée** — une préférence porte une sémantique de consentement/opt-in ; un e-mail d'invitation n'a pas cette nature (l'invité n'a pas encore de compte auquel rattacher un consentement), et forcer une préférence ici brouillerait la distinction transactionnel/optionnel exigée par le mandat |

## Décision D-NOTIF-002

**LoyerTracker utilisera Resend (API HTTPS) comme fournisseur du canal `EMAIL`, encapsulé derrière
la même abstraction généralisée que Twilio.** EMAIL devient un canal natif de
`CanalNotification`, au même titre que `WHATSAPP`/`SMS`. Le domaine métier ne connaît jamais Resend.

### 1. Architecture cible

```text
Transaction métier (InvitationService.inviter, futurs : Paiement/Garantie/Quittance)
        │
        ├── écriture métier
        └── NotificationOutboxService.emettre(...) | .emettreTransactionnel(...)   (même transaction)
                    │
                    ▼ (après commit)
          NotificationDispatcher (@Scheduled, inchangé)
                    │
                    ▼ Map<CanalNotification, ChannelNotificationProvider>
           ┌────────┴────────┐
   TwilioNotificationProvider   ResendEmailProvider (nouveau, isolé)
    (WHATSAPP, SMS)              (EMAIL, com.loyertracker.notifications.provider.resend)
```

### 2. Deux voies de fan-out — extension du constat ADR-18 §2

ADR-18 distinguait déjà deux voies d'alimentation de l'Outbox (batch / transactionnelle inline),
toutes deux **gated par préférence**. Ce mandat en ajoute une troisième dimension, orthogonale :

- **Voie préférence** (inchangée) : `BAILLEUR`/`GESTIONNAIRE`/`LOCATAIRE`, gated par
  `NotificationPreference.estEligiblePour(canal)`. S'applique à EMAIL exactement comme à
  WHATSAPP/SMS pour les lots optionnels futurs (quittance disponible, avis d'échéance...).
- **Voie transactionnelle** (nouvelle, `NotificationOutboxService.emettreTransactionnel`) : un
  événement nécessaire à l'exécution d'une action utilisateur déjà demandée (invitation) — sans
  préférence, sans opt-in, adresse résolue et écrite dans l'Outbox **au moment de l'émission**
  (`notification_outbox.recipient_address`, nouvelle colonne nullable). Le dispatcher, générique,
  n'a jamais besoin de savoir ce qu'est une "Invitation" : si `recipient_address` est renseignée, il
  saute la résolution par préférence et l'utilise directement — même sélection de template, même
  retry, même dead-letter, même métriques que la voie préférence.

`TypeDestinataire.INVITATION` (additif) porte cette catégorie ; `recipient_id` = `Invitation.id`
(patron polymorphe déjà utilisé partout dans ce module, sans FK stricte).

### 3. Généralisation du contrat fournisseur

```java
public interface ChannelNotificationProvider {
    java.util.Set<CanalNotification> canaux();
    ResultatEnvoi envoyer(DemandeEnvoi demande);
}

record NotificationRecipient(CanalNotification canal, String address) {}
record DemandeEnvoi(NotificationRecipient destinataire, String templateCode,
        Map<String, String> variables) {}
```

`TwilioNotificationProvider` **n'est pas scindé** : il implémente `ChannelNotificationProvider` avec
`canaux() = {WHATSAPP, SMS}` — un seul composant gère deux canaux depuis toujours en Production,
aucune raison de fragmenter un composant déjà éprouvé pour satisfaire l'abstraction ; c'est
`Set<CanalNotification>` plutôt que `CanalNotification` seul qui permet cette symétrie. Changement
mécanique uniquement (`demande.phoneE164()` → `demande.destinataire().address()`), zéro changement
de comportement WhatsApp/SMS.

`NotificationDispatcher` reçoit `List<ChannelNotificationProvider>` et construit
`Map<CanalNotification, ChannelNotificationProvider>` au démarrage. Canal sans provider enregistré →
`marquerDead("PROVIDER_INDISPONIBLE")`, jamais un succès silencieux.

### 4. Adaptateur Resend — `com.loyertracker.notifications.provider.resend`

`ResendEmailProvider`/`NoopEmailProvider`, en exclusion mutuelle par `app.notifications.email.enabled`
(même patron que Twilio/Noop, flag distinct — une panne ou une désactivation Resend n'affecte jamais
WhatsApp/SMS et réciproquement). API HTTPS via `RestClient` Spring (aucun SDK Resend, cohérent avec
le choix déjà fait pour Twilio). Auth `Bearer`, jamais journalié. Classification : `401/403/422` →
`PERMANENT` ; `429`/`5xx`/timeout/réponse vide → `TEMPORAIRE`. `providerMessageId` = `id` Resend.

### 5. Templates EMAIL

`NotificationTemplate` étendu par trois colonnes nullables (`subject`, `html_body`, `text_body`),
utilisées uniquement pour `channel = EMAIL` — `WHATSAPP`/`SMS` gardent leur rendu `code+variables`
existant, inchangé. `utilisablePourEnvoi()` étendu pour exiger sujet et corps HTML non vides côté
EMAIL. Variables échappées HTML avant substitution (`HtmlUtils.htmlEscape`, déjà disponible via
`spring-web`, aucune dépendance nouvelle) — protection injection.

### 6. Lien d'acceptation — réutilisation du précédent ADR-18 §7

`QUITTANCE_DISPONIBLE` transmet déjà un lien complet dans `payload_minimal` au moment de l'émission,
jamais reconstruit par le dispatcher. Même choix pour l'invitation : `InvitationService.inviter`
connaît déjà `lienAcceptation(token)` — écrit dans `payload_minimal` dans la même transaction.
Alternative rejetée : faire connaître au dispatcher générique la structure d'une URL d'invitation
(recouplerait un composant générique à un agrégat métier précis).

### 7. Aucun fallback EMAIL

Confirmé par le code (constat 3) : `NotificationFallbackService` ne branche que sur `WHATSAPP`.
Aucune extension de ce comportement dans ce mandat (K5) — resterait un ajout de comportement
délibéré, pas une correction, et nécessiterait sa propre US/ADR si le PO le demandait un jour.

## Modèle de données (migration `V30`, additive)

Voir `docs/cgpa/06-planification-agile/analyse-impact-ep18-notifications-email-resend.md` §3 pour le
détail complet (colonnes, contraintes). Résumé, **livré par la migration `V30` (Sprint A,
implémentée le 2026-08-04)** :

- `CanalNotification` : ajout `EMAIL`.
- 4 contraintes `CHECK` étendues (`notification_outbox.channel`, `notification_delivery.channel`,
  `notification_template.channel`, `notification_preference.preferred_channel`) — additif, aucune
  donnée touchée.
- `notification_outbox.recipient_address VARCHAR(320)` nullable (voie transactionnelle).
- `notification_preference.email VARCHAR(320)` **et** `email_opt_in BOOLEAN NOT NULL DEFAULT false`
  nullable/inerte (lots futurs, non exercées au Lot 1) — `email_opt_in` complète le triptyque
  adresse+opt-in déjà en place pour `whatsapp_opt_in`/`sms_opt_in`, nécessaire par symétrie pour que
  `NotificationPreference.estEligiblePour(EMAIL)` soit définissable ; ce détail n'était pas explicité
  dans la version initiale de cet ADR, corrigé à l'implémentation (additif, sans impact sur le reste
  du modèle).
- `notification_template.subject`/`html_body`/`text_body` nullables (EMAIL uniquement).

**Livré par la migration `V31` (Sprint B, implémentée le 2026-08-05, GO explicite du PO)** :
`TypeDestinataire.INVITATION`, `TypeEvenementNotification.INVITATION_CREEE`,
`TypeAgregatNotification.INVITATION` (trois enums additifs, une valeur ajoutée en fin
d'énumération), l'extension des contraintes `CHECK` de `notification_event`
(`event_type`/`aggregate_type`) correspondantes, et le seed du gabarit EMAIL `INVITATION_CREEE`
(sujet/HTML/texte, variables `lien`/`dureeValiditeHeures`). `NotificationOutboxService
.emettreTransactionnel(...)` (nouvelle méthode) et le câblage dans `InvitationService.inviter(...)`
complètent la voie transactionnelle : `NotificationDispatcher`/`ResendEmailProvider`/
`NoopEmailProvider` n'ont nécessité aucune modification (déjà entièrement câblés depuis le
Sprint A).

`fallback_channel` reste `CHECK (fallback_channel IN ('SMS'))` — décision K5 ADR-18 non rejouée,
cohérent avec §7 ci-dessus.

## Sécurité

Secrets (hors dépôt, convention `${VAR}`/`${VAR:}`) : `RESEND_API_KEY`, `RESEND_FROM_EMAIL`,
`RESEND_FROM_NAME`, `RESEND_REPLY_TO`, `RESEND_WEBHOOK_SECRET`, `RESEND_BASE_URL`,
`RESEND_CONNECT_TIMEOUT_MS`, `RESEND_READ_TIMEOUT_MS`. Secrets distincts par environnement, clé à
privilège minimal. Validation stricte d'adresse avant tout appel réseau. Protection injection
d'en-tête. Webhook (si Sprint C confirmé) : même triple patron que `TwilioCallbackController`
(endpoint public whitelisté, signature HMAC, idempotence, réponse indifférenciée). RLS inchangée.

## RGPD

Base légale de l'e-mail d'invitation : exécution d'une démarche demandée par le bailleur — pas de
consentement marketing (l'invité n'a pas encore de compte). Minimisation stricte (`payload_minimal` :
lien, adresse, durée de validité, rien d'autre). Dette RGPD préexistante (`RgpdService` sans
couverture `notification_*`) signalée, non aggravée, non traitée dans ce périmètre (RSV-EP18-03).

## Observabilité

`notification.dispatch.total{canal="EMAIL", issue=...}` — réutilise l'énumération `Issue` existante,
aucun nouveau label à cardinalité non bornée. Budget Resend : voir §Coûts ci-dessous.
`observability-governance.md` étendu additivement (second service externe critique).

## Coûts et garde-fous budgétaires

Plafond **dédié** (K3, tranché ci-dessous), distinct du plafond WhatsApp/SMS : un pic EMAIL ne doit
jamais geler WhatsApp/SMS, et réciproquement (deux fournisseurs facturés séparément).

```text
app.notifications.email.enabled          # RESEND_EMAIL_ENABLED, false par défaut
app.notifications.budget.resend.mensuel-max   # RESEND_BUDGET_MENSUEL_MAX, 0 par défaut
app.notifications.budget.resend.seuil-alerte  # RESEND_BUDGET_SEUIL_ALERTE, 0.8 par défaut
```

## Rollback

Migration `V30` strictement additive — rollback applicatif trivial (redéploiement du tag
précédent). `RESEND_EMAIL_ENABLED=false` en dernier recours, sans redéploiement, sans affecter
WhatsApp/SMS. Aucun impact sur `Alerte`, `Paiement`, `Garantie`, `Quittance`,
`notification_*` WhatsApp/SMS existants.

## Registre des risques (RSV-EP18)

| # | Risque | Mitigation proposée | Statut |
|---|--------|----------------------|--------|
| RSV-EP18-01 | Webhooks Resend non couverts au Lot 1 : le statut `ACCEPTED` par Resend n'est jamais confirmé livré | Documenté comme dette explicite (K1), aucune prétention de statut final de livraison tant que non couvert | **Couvert techniquement (2026-08-05, Sprint C)** — `ResendCallbackController`/`NotificationDeliveryService.appliquerCallbackResend` codés et testés ; validation opérationnelle réelle reclassée dans EP-19, hors condition de GO EP-18 |
| RSV-EP18-02 | Confusion entre voie préférence et voie transactionnelle produisant un envoi non désiré (ex. un opt-out contourné) | La voie transactionnelle ne s'applique qu'à `TypeDestinataire.INVITATION`, jamais à `BAILLEUR`/`GESTIONNAIRE`/`LOCATAIRE` — vérification explicite par test dédié (isolation des deux voies) | **Verrouillé (2026-08-05, Sprint B)** — `emettreTransactionnel` n'appelle jamais `NotificationPreferenceRepository` (mécanisme structurel) ; test TC-130 prouve qu'une ligne Outbox transactionnelle passe `PENDING` sans aucune `NotificationPreference` créée ; non-régression `NotificationDispatchIntegrationTest` inchangée (voie préférence sans préférence ⇒ `DEAD`) |
| RSV-EP18-03 | Dette RGPD préexistante (`RgpdService` sans couverture `notification_*`) étendue à EMAIL sans être comblée | Signalée, non aggravée — hors périmètre de ce Lot (aucune `NotificationPreference` créée pour l'invitation) | Accepté (en surveillance), sans échéance dans ce mandat |
| RSV-EP18-04 | Budget EMAIL mal isolé du budget WhatsApp/SMS, un pic EMAIL bloquant les canaux existants | Plafond dédié (K3), fonction SQL paramétrée par canal | **Ouvert, non implémenté au Sprint A** — sans risque réel tant que `RESEND_EMAIL_ENABLED=false` (aucune ligne EMAIL possible) ; à résoudre avant toute activation Staging avec volume réel (avant Sprint B ou en tout début de Sprint B) |
| RSV-EP18-05 | `RSV-MIG-611-04` (addendum DAT EP-16 encore ouvert) confondu avec le nouvel addendum DAT EP-18 | Addendum DAT §3.6 explicitement distinct, ne clôt pas RSV-MIG-611-04 | Ouvert (hérité, sans rapport direct) |
| RSV-EP18-06 | Schéma de signature webhook Resend (Svix — en-têtes `svix-id`/`svix-timestamp`/`svix-signature`, HMAC-SHA256) implémenté par recommandation par défaut fondée sur la documentation publique Resend/Svix, jamais vérifié contre un webhook réel | Tests d'intégration prouvent la cohérence interne du vérificateur (accepte ce qu'il aurait lui-même signé), pas la conformité au service réel ; aucune activation dans cette mission, secret jamais lu | **Clôturé pour EP-18 / reclassé EP-19 (2026-08-05)** — non bloquant pour le Gate EP-18 ; suivi avancé de délivrabilité à traiter dans l'Epic séparé EP-19 |

## Kickoff K1→K5 — recommandations par défaut, PO à confirmer

| # | Question | Recommandation | Statut |
|---|----------|-----------------|--------|
| K1 | Webhooks Resend inclus ce sprint ? | Reportés hors périmètre GO EP-18 ; fondation technique livrée mais validation opérationnelle reclassée EP-19 | **Décidé par le PO (2026-08-05)** — non bloquant EP-18 ; EP-19 créé pour délivrabilité avancée |
| K2 | Pièce jointe vs lien sécurisé pour documents futurs | Lien sécurisé par défaut | Proposé |
| K3 | Budget EMAIL partagé ou dédié | Plafond dédié `RESEND_BUDGET_MENSUEL_MAX` | Proposé |
| K4 | Source de vérité de l'adresse par catégorie | Voie transactionnelle (`Invitation.email`) pour l'invitation ; voie préférence (opt-in `NotificationPreference.email`) pour les lots optionnels futurs | Proposé |
| K5 | Fallback EMAIL→WHATSAPP/SMS | Aucun au premier lot | Proposé |

**Aucun GO n'est donné sur le Plan d'Exécution par ce document** : requis distinctement (Phase 4).

## Compatibilité et migration

Aucune migration créée par ce cadrage. Migration future strictement additive — numéro réservé
**`V30`** (dernière migration réelle à ce jour : `V29`), à reconfirmer au Plan d'Exécution en cas de
migration intercurrente. Rollback applicatif trivial.
