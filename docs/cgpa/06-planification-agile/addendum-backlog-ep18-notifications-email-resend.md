# Addendum Backlog — Epic EP-18 (Canal EMAIL via Resend)

| Champ | Valeur |
|-------|--------|
| Document de référence | `product-backlog.md`, `addendum-backlog-ep16-notifications.md` — **non modifiés** |
| Statut | **Sprint A fusionné sur branche dédiée (2026-08-04), GO explicite du PO reçu pour ce seul Sprint.** US-135/136/137/138 et le socle de US-140 sont codés et testés ; K1→K5 restent en recommandations par défaut, aucune décision PO formelle distincte. Sprint B/C non démarrés, soumis chacun à un GO distinct. |
| Date | 2026-08-04 |
| Décision liée | `ADR-19-notifications-email-resend.md` |
| Plan d'exécution | `docs/project-state.md` (entrée Phase 4, 2026-08-04) |

> **Numérotation — vérification exhaustive.** Dernière US visible dans le dépôt : `US-134`
> (EP-17 Lot 3 Frontend, `lt-data-table`). Ce document introduit **US-135 à US-140** sous un
> **nouvel epic EP-18**, distinct d'EP-17 (Frontend/PrimeNG/Keycloak, chantier indépendant en
> cours) — EP-18 est un frère d'EP-16 (notifications), pas une suite d'EP-17.

---

## EP-18 — Canal EMAIL via Resend (extension du système multicanal EP-16)

| ID | Epic | Jalons | Priorité |
|----|------|--------|----------|
| EP-18 | **Canal EMAIL via Resend** — extension du système multicanal existant (EP-16) par un second fournisseur externe, premier usage : e-mail d'invitation gestionnaire | Aucun Sprint démarré ; K1→K5 (ADR-19) en attente de tranchage PO | Must |

### US-135 — Généralisation du contrat fournisseur par canal

**En tant que** développeur, **je veux** une interface `ChannelNotificationProvider` résolue par
canal (au lieu d'un unique bean `NotificationProvider`) **afin de** pouvoir ajouter Resend comme
second fournisseur sans toucher au comportement WhatsApp/SMS existant.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** le `NotificationDispatcher` **W** il reçoit plusieurs `ChannelNotificationProvider` **T** il résout le fournisseur applicable par `Map<CanalNotification, ChannelNotificationProvider>`, sans `if/else` dispersé. **G** un canal sans fournisseur enregistré **W** une ligne Outbox de ce canal est traitée **T** elle passe en `DEAD` (`PROVIDER_INDISPONIBLE`), jamais de succès silencieux. **G** les tests d'intégration WhatsApp/SMS existants **W** exécutés après ce changement **T** ils restent verts sans modification de leurs assertions. |
| Dépendances | Aucune |
| Priorité | Must |
| Points | 8 |
| Risques | Aucun nouveau — non-régression obligatoire sur `NotificationDispatchIntegrationTest` |
| Source | ADR-19 §3 ; EF-127 |
| Sprint cible | Sprint A — Socle EMAIL/Resend |

### US-136 — Canal EMAIL et migration additive

**En tant que** système, **je veux** que `EMAIL` soit un canal natif de `CanalNotification`, avec le
schéma PostgreSQL étendu en conséquence **afin de** pouvoir router une notification vers Resend
exactement comme vers Twilio.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** la migration `V30` appliquée **W** vérification du schéma **T** les 4 contraintes `CHECK` (`channel`/`preferred_channel`) admettent `'EMAIL'` ; `notification_outbox.recipient_address`, `notification_preference.email`, `notification_template.subject/html_body/text_body` existent, nullables ; aucune table/colonne existante n'est modifiée ou supprimée. |
| Dépendances | US-135 |
| Priorité | Must |
| Points | 5 |
| Risques | Aucun — migration strictement additive |
| Source | ADR-19 §Modèle de données ; EF-127 |
| Sprint cible | Sprint A — Socle EMAIL/Resend |

### US-137 — Adaptateur `ResendEmailProvider`

**En tant que** développeur, **je veux** un adaptateur Resend isolé dans son propre package **afin
de** ne jamais exposer le SDK/l'API Resend, les credentials, ni les DTO au domaine métier.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** le code du domaine métier (`comptes`, `paiements`, `garanties`) **W** revue de dépendances **T** aucune référence à Resend hors de `com.loyertracker.notifications.provider.resend`. **G** l'application démarre sans configuration Resend **W** au boot **T** aucune erreur bloquante, `RESEND_EMAIL_ENABLED=false` par défaut, `NoopEmailProvider` actif. **G** une adresse invalide ou un template sans sujet/HTML **W** tentative d'envoi **T** rejet `PERMANENT` local, aucun appel réseau Resend. |
| Dépendances | US-135, US-136 |
| Priorité | Must |
| Points | 13 |
| Risques | Aucun nouveau |
| Source | ADR-19 §4/§5 ; EF-128/129 ; BF-112 |
| Sprint cible | Sprint A — Socle EMAIL/Resend |

### US-138 — Configuration, secrets et kill switch dédiés

**En tant que** DevSecOps Lead, **je veux** une configuration Resend externalisée avec kill switch
et budget dédiés **afin de** exploiter Resend sans jamais affecter WhatsApp/SMS ni exposer de
secret.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** `RESEND_EMAIL_ENABLED=false` (défaut) **W** au démarrage **T** aucun appel réseau Resend possible. **G** le plafond `RESEND_BUDGET_MENSUEL_MAX` est atteint **W** un lot de dispatch EMAIL est évalué **T** les envois EMAIL sont arrêtés sans affecter le budget/dispatch WhatsApp/SMS. **G** un secret Resend **W** consulté dans les logs **T** jamais journalisé en clair. |
| Dépendances | US-137 |
| Priorité | Must |
| Points | 5 |
| Risques | RSV-EP18-04 (isolation budgétaire) |
| Source | ADR-19 §Coûts ; EF-133/134 ; K3 — proposition à confirmer |
| Sprint cible | Sprint A — Socle EMAIL/Resend |

### US-139 — Invitation gestionnaire par e-mail

**En tant que** bailleur, **je veux** que le destinataire d'une invitation reçoive un e-mail avec le
lien d'acceptation **afin de** ne plus avoir à transmettre ce lien manuellement.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** un bailleur crée une invitation **W** la transaction commite **T** un `notification_event`/`notification_outbox` (voie transactionnelle, `channel='EMAIL'`) est créé dans la même transaction, sans consultation de préférence. **G** Resend indisponible **W** l'envoi est tenté **T** l'invitation reste persistée et consultable, l'Outbox reste rejouable, l'API ne dépend jamais du succès de l'envoi. **G** une invitation régénérée **W** un nouveau token est émis **T** un nouvel événement/e-mail est produit, lié au nouveau token, sans doublon sur l'ancien. **G** deux traitements concurrents de la même ligne Outbox **W** exécutés **T** un seul envoi logique (idempotence héritée d'ADR-18 §4). **G** un autre bailleur **W** tente d'accéder à l'Outbox/Delivery **T** aucun accès cross-tenant (RLS). |
| Dépendances | US-136, US-137, US-138 |
| Priorité | Must |
| Points | 13 |
| Risques | RSV-EP18-02 (isolation des deux voies de fan-out) |
| Source | ADR-19 §2 ; EF-125/126/131 ; BF-113/114/115 |
| Sprint cible | Sprint B — Invitation par e-mail |

### US-140 — Observabilité EMAIL et runbook

**En tant que** DevSecOps Lead, **je veux** des métriques par canal et un runbook Resend **afin de**
exploiter ce second fournisseur externe de façon sûre et supervisée, symétriquement à Twilio.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation (GWT) | **G** la chaîne EMAIL en fonctionnement **W** scrape Prometheus **T** `notification.dispatch.total{canal="EMAIL", issue=...}` disponible, sans PII en label. **G** un incident Resend **W** survenu **T** `runbook-resend.md` applicable, kill switch EMAIL opérationnel sans redéploiement. |
| Dépendances | US-137, US-138 |
| Priorité | Must |
| Points | 5 |
| Risques | RSV-EP18-01 (webhooks non couverts, statut de livraison non confirmé) |
| Source | ADR-19 §Observabilité ; ENF-98 |
| Sprint cible | Sprint A (socle) / Sprint B (preuve invitation) |

---

## Récapitulatif & priorisation

| Story | Points | Priorité | Sprint cible |
|-------|--------|----------|---------------|
| US-135 — Généralisation du contrat fournisseur par canal | 8 | Must | A |
| US-136 — Canal EMAIL et migration additive | 5 | Must | A |
| US-137 — Adaptateur `ResendEmailProvider` | 13 | Must | A |
| US-138 — Configuration, secrets et kill switch dédiés | 5 | Must | A |
| US-139 — Invitation gestionnaire par e-mail | 13 | Must | B |
| US-140 — Observabilité EMAIL et runbook | 5 | Must | A/B |
| **Total EP-18** | **49** | — | — |

## Dépendances & risques (synthèse)

- **K1→K5 (ADR-19)** : recommandations par défaut documentées, **aucune confirmée par le PO**.
  Aucun GO sur le Plan d'Exécution n'est donné par ce document.
- **RSV-EP18-01** (webhooks non couverts) : dépend d'un Sprint C non planifié dans ce périmètre.
- **RSV-EP18-02** (isolation des deux voies de fan-out) : couverte par US-139, test dédié requis
  avant tout Gate Staging.
- **RSV-EP18-03** (dette RGPD préexistante `RgpdService`) : héritée, non traitée par cet Epic.
- **RSV-EP18-04** (isolation budgétaire EMAIL/WhatsApp-SMS) : couverte par US-138.
- **RSV-EP18-05** / **RSV-MIG-611-04** : addendum DAT EP-18 distinct de la dette DAT EP-16 encore
  ouverte — aucune confusion, aucune clôture croisée.
- Aucun Sprint ne démarre avant Plan d'Exécution approuvé et GO explicite du PO (Phase 4).
