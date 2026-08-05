# Analyse d'Impact — EP-18 : Canal EMAIL / Resend (extension du système multicanal EP-16)

| Champ | Valeur |
|-------|--------|
| Statut | **Documentation seule — aucun développement engagé.** Conforme à la règle CGPA « Codage suspendu : Plan d'Exécution requis avant modification du code ». |
| Date | 2026-08-04 |
| Demandeur | PO (jordan) |
| Niveau | **Niveau 2** (extension d'un domaine transverse déjà livré — EP-16 — plutôt qu'introduction d'un domaine neuf ; nouveau fournisseur externe, migration additive, pas de nouvelle table de fond) |
| Documents liés | `ADR-19-notifications-email-resend.md`, `addendum-notifications-email-resend.md` (EB/CDC), `addendum-backlog-ep18-notifications-email-resend.md`, `ADR-18-notifications-multicanales-twilio.md` (non modifiée, socle réutilisé) |
| Contexte de gouvernance | Production `1.15.0` (Lot A EP-16 Sprint N+2) **clôturée le 2026-08-04**, hypercare complète. Le pilote Keycloak EP-17 Lot 4 est un chantier Frontend/Infra strictement indépendant, en cours en parallèle. Cette analyse ne dépend d'aucun des deux et n'ouvre aucun Sprint tant qu'un GO PO explicite n'est pas reçu sur le Plan d'Exécution. |

## 0. Méthode

Exploration factuelle du code réel (aucune modification), en continuité directe de l'audit ayant
produit ADR-18 : package `com.loyertracker.notifications` complet (28 classes/enums), migrations
V27→V29, `application.yml` §`app.notifications`/`twilio`, `InvitationService`/`InvitationController`/
`Invitation`, `RgpdService`, frontend (recherche `invitation` : aucun résultat). Les constats
ci-dessous citent des fichiers réels.

## 1. Constat central

EP-16 a livré un système de notifications multicanal (`IN_APP`/`WHATSAPP`/`SMS`) structurellement
**capable d'un seul fournisseur actif à la fois** (`NotificationDispatcher` reçoit un unique bean
`NotificationProvider`, choisi par exclusion mutuelle Spring entre `TwilioNotificationProvider` et
`NoopNotificationProvider` sur le même flag `whatsapp.enabled`). Ajouter `EMAIL`/Resend comme second
fournisseur, pour un canal différent, **ne peut pas** s'accueillir dans ce modèle sans le
généraliser en `Map<CanalNotification, ChannelNotificationProvider>` — ce n'est pas un choix de
conception parmi d'autres, c'est une contrainte mécanique découverte à l'audit.

**Second constat, non anticipé par le cadrage initial** : le destinataire d'une invitation
(`Invitation.email`) n'a, par construction, **aucun compte** (`Gestionnaire`) au moment de l'envoi —
il n'existe donc aucune `NotificationPreference` à laquelle rattacher un opt-in. Le fan-out actuel
(`NotificationOutboxService.emettre`) exige une préférence active et opt-in pour créer une ligne
Outbox : ce mécanisme, conçu pour des communications à consentement (WhatsApp/SMS), **ne s'applique
pas** à un e-mail transactionnel nécessaire à l'exécution d'une action déjà demandée par le
bailleur. Une seconde voie de fan-out (« transactionnelle », sans préférence) est requise —
détaillée dans ADR-19 §Modèle et non présente dans ADR-18.

## 2. Impact Domaine (backend)

| Composant existant | Modification |
|---|---|
| `CanalNotification` | Ajout `EMAIL` (additif) |
| `NotificationProvider` / `TwilioNotificationProvider` / `NoopNotificationProvider` | Généralisés en `ChannelNotificationProvider` (méthode `canaux()` → `Set<CanalNotification>`) ; **zéro changement de comportement** pour WHATSAPP/SMS, changement mécanique de signature uniquement (`demande.phoneE164()` → `demande.destinataire().address()`) |
| `NotificationDispatcher` | Résolution du provider par canal via une map construite une fois au démarrage (remplace l'injection d'un provider unique) ; ajout d'un chemin « adresse déjà résolue » (`recipient_address` non nul) pour la voie transactionnelle |
| `NotificationOutboxService` | Nouvelle méthode `emettreTransactionnel(...)`, distincte de `emettre(...)` (préférence), sans modification de cette dernière |
| `TypeDestinataire` | Ajout `INVITATION` (additif) |
| `TypeEvenementNotification` | Ajout `INVITATION_CREEE` (additif) |
| `TypeAgregatNotification` | Ajout `INVITATION` (additif) |
| `InvitationService.inviter(...)` | Un appel supplémentaire dans la même transaction (patron `AuditService.enregistrer`, déjà éprouvé trois fois dans ce projet) — aucun changement de signature publique, aucune dépendance à Resend |
| **Nouveau package** | `com.loyertracker.notifications.provider.resend` (`ResendEmailProvider`, `NoopEmailProvider`, `ResendProperties`, DTO internes, classification d'erreurs) |

Aucune modification de `PaiementService`, `GarantieService`, `QuittanceCertifieeService`,
`AlerteService`/`generer_alertes()` dans ce périmètre (ces intégrations restent des lots futurs
documentés mais non codés, §8 du mandat).

## 3. Impact Base de données

**Migration `V30`, strictement additive** (dernière migration réelle à ce jour : `V29`) :

- Extension de 4 contraintes `CHECK` (`notification_outbox.channel`, `notification_delivery.channel`,
  `notification_template.channel`, `notification_preference.preferred_channel`) pour admettre `EMAIL`
  — `DROP CONSTRAINT` + `ADD CONSTRAINT` équivalente élargie, aucune donnée touchée.
- Extension de `notification_event.event_type` (ajout `INVITATION_CREEE`) et
  `notification_event.aggregate_type` (ajout `INVITATION`), même mécanique.
- Colonne nouvelle nullable `notification_outbox.recipient_address VARCHAR(320)` (voie
  transactionnelle uniquement, `NULL` pour toutes les lignes existantes et pour la voie préférence).
- Colonnes nouvelles nullables `notification_preference.email VARCHAR(320)` (lots futurs, non
  exercée par ce Lot 1).
- Colonnes nouvelles nullables `notification_template.subject`/`html_body`/`text_body` (EMAIL
  uniquement ; `WHATSAPP`/`SMS` continuent le rendu `code+variables` existant, inchangé).

Deux tests de compteur Flyway à incrémenter (`SchemaMigrationTest.java`, `infra/smoke/smoke-stack.sh`)
— même leçon déjà tracée dans ce projet (incident R-S04-1).

## 4. Impact Sécurité

- Nouveau fournisseur externe (Resend) : clé API à privilège minimal, jamais journalisée.
- Validation stricte d'adresse avant tout appel réseau (rejet `PERMANENT` local, aucun appel Resend
  sur une adresse malformée).
- Protection injection d'en-tête (`\r`/`\n` dans `to`/`subject`).
- Webhook Resend (si Sprint C confirmé) : même triple patron que `TwilioCallbackController`
  (endpoint public whitelisté, signature HMAC du secret, idempotence par `provider_message_id`,
  réponse indifférenciée) — **non codé dans ce périmètre**, dette tracée (RSV-EP18-01).
- Aucune extension RBAC/ReBAC.
- RLS inchangée : `notification_outbox`/`notification_delivery`/`notification_preference` restent
  sous `bailleur_isolation` standard pour EMAIL comme pour WHATSAPP/SMS.

## 5. Impact RGPD

- E-mail d'invitation : base légale = exécution d'une démarche demandée par le bailleur (pas de
  consentement marketing à recueillir — il n'y a pas encore de compte destinataire).
- Dette **préexistante et non aggravée** : `RgpdService` ne référence aujourd'hui aucune entité
  `notification_*`, y compris pour WhatsApp/SMS déjà en Staging. Ce mandat ne comble pas cette dette
  (aucune `NotificationPreference` n'est créée pour la voie transactionnelle invitation — rien à
  exporter/anonymiser pour un destinataire qui n'a pas encore de compte) ; elle reste consignée au
  registre des risques pour un futur lot, indépendamment de Resend.
- Minimisation : `payload_minimal` porte uniquement le lien d'acceptation, l'adresse, la durée de
  validité — jamais de mot de passe ni de donnée technique interne.

## 6. Impact API

Aucun contrat existant modifié (`InvitationDto` inchangé). Aucun nouvel endpoint public requis pour
le Lot 1 (l'émission est interne à `InvitationService`, le webhook Resend étant hors périmètre
Sprint A/B).

## 7. Impact UI (frontend)

**Constat confirmé à l'audit** : aucune UI d'invitation n'existe aujourd'hui (`grep` frontend vide,
`POST /api/invitations` est API-only). Cela signifie que l'exigence du mandat *"l'API ne doit plus
dépendre du succès de l'envoi pour retourner l'invitation créée"* est **déjà vraie par construction**
— il n'existe même pas de retour front à ajuster. Aucun changement UI requis par ce Lot.

## 8. Impact Observabilité

Extension de `notification.dispatch.total{canal=...}` (énumération déjà fermée, `EMAIL` s'ajoute
sans nouveau label) — aucune nouvelle dimension à cardinalité non bornée. `observability-governance.md`
étendu additivement pour Resend comme second service externe critique (aux côtés de Twilio,
RSV-EP16-05 déjà ouvert — extension, pas un nouveau risque).

## 9. Impact Secrets

Sept variables nouvelles (`RESEND_*`), toutes hors dépôt, convention `${VAR}`/`${VAR:}` déjà en
place. **Précédent appliqué** (déjà observé pour EP-16 §11 de son analyse d'impact et pour
`QUITTANCE_HMAC_SECRET`) : ces variables ne sont ajoutées à `.env.example`/Compose **qu'au moment de
l'implémentation réelle** (Sprint A), pas à ce stade de cadrage — aucune modification de fichier de
configuration dans cette phase.

## 10. Impact Staging / Production

Aucun déploiement engagé par cette analyse. Recommandation reprise d'ADR-18/K8 : socle livré fermé
(`RESEND_EMAIL_ENABLED=false`), Gate Staging (dont `STG-ISOL-01`) requis avant toute promotion,
clé Resend Staging distincte, allowlist de destinataires de test, aucune activation Production sans
Gate distinct.

## 11. Impact Coûts

Resend facturé à l'envoi, indépendamment de Twilio (un seul compte facturé par fournisseur) — d'où
la recommandation de plafond budgétaire dédié plutôt que partagé (ADR-19 §Budget), pour qu'un pic
EMAIL ne gèle jamais WhatsApp/SMS et réciproquement.

## 12. Impact Rollback

Migration `V30` strictement additive — rollback applicatif trivial. Kill switch dédié
(`RESEND_EMAIL_ENABLED=false`) distinct du kill switch maître (`NOTIFICATIONS_EXTERNAL_ENABLED`) et
du flag WhatsApp/SMS — une coupure Resend n'affecte jamais WhatsApp/SMS et réciproquement.

## 13. Dépendances avec EP-16

Réutilise intégralement le socle EP-16 (`NotificationEvent`/`NotificationOutbox`/`NotificationDelivery`/
`NotificationDispatcher`/budget/métriques/fallback) — **aucune régression tolérée** sur les tests
existants (`NotificationDispatchIntegrationTest`, `NotificationFondationIntegrationTest`,
`NotificationPreferenceTest`). `RSV-MIG-611-04` (Enterprise Architect, addendum DAT EP-16/V27/V28
déjà ouvert) reste distinct et n'est ni traité ni aggravé par ce mandat — l'addendum DAT produit ici
(§3.6) s'y raccroche explicitement sans le clore.

## 14. Décisions PO proposées par défaut (à confirmer, cf. ADR-19 kickoff K1→K5)

| # | Point | Recommandation |
|---|---|---|
| K1 | Webhooks Resend | Reportés (Sprint C), dette tracée |
| K2 | Pièce jointe vs lien | Lien sécurisé par défaut |
| K3 | Budget EMAIL | Plafond dédié `RESEND_BUDGET_MENSUEL_MAX` |
| K4 | Source de vérité e-mail | Voie transactionnelle (sans préférence) pour invitation ; voie préférence (opt-in) pour les lots optionnels futurs |
| K5 | Fallback EMAIL→autre canal | Aucun au premier lot |

## Verdict

**GO DOCUMENTATION.** Aucun bloqueur factuel. Passage à l'ADR-19 et aux addenda EB/CDC/Backlog
autorisé ; aucun code ne sera produit avant Plan d'Exécution approuvé et GO explicite du PO.
