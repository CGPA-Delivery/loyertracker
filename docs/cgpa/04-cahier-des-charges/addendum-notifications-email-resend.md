# Addendum CDC — Canal EMAIL via Resend (EP-18)

| Champ | Valeur |
|-------|--------|
| Document de référence | `cahier-des-charges.md` (✅ Validé — Gate 3 Go, 2026-06-04) — **non modifié** |
| Document de référence | `dossier-architecture.md` (✅ Validé — Gate 4 Go, 2026-06-04) — étendu narrativement (additif, §3.6) |
| Document de référence | `addendum-notifications-multicanales.md` (EP-16, CDC) — **non modifié**, socle réutilisé |
| Statut de l'addendum | **Proposé** — cadrage documentaire ; aucun codage ni migration SQL engagé. K1→K5 (ADR-19) entièrement ouverts |
| Date | 2026-08-04 |
| Décision liée | `ADR-19-notifications-email-resend.md` |
| Base besoin | `docs/cgpa/02-expression-besoin/addendum-notifications-email-resend.md` (BF-112→BF-115) |

---

## 1. Exigences fonctionnelles détaillées (addendum)

### 1.1 Production de l'événement transactionnel *(nouveau)*

| ID | Exigence | Critère d'acceptation | Priorité | Source |
|----|----------|------------------------|----------|--------|
| EF-125 | Événement `INVITATION_CREEE` (voie transactionnelle) | ED `InvitationService.inviter(...)` est appelé · Q la transaction commite · A un `notification_event` (`aggregate_type='INVITATION'`, `aggregate_id=Invitation.id`) et une ligne `notification_outbox` (`channel='EMAIL'`, `recipient_address` renseignée) sont créés **dans la même transaction**, sans aucun appel réseau Resend à ce stade ; une panne Resend ultérieure ne modifie jamais l'état de l'invitation déjà persistée. | Must | BF-113, BF-115, ADR-19 §2 |
| EF-126 | Voie transactionnelle distincte de la voie préférence | ED un événement de catégorie `TypeDestinataire.INVITATION` · Q le fan-out est exécuté · A aucune `NotificationPreference` n'est consultée ni requise ; `recipient_address` est résolue et écrite au moment de l'émission (jamais reconstruite par le dispatcher). Réciproquement, un événement `BAILLEUR`/`GESTIONNAIRE`/`LOCATAIRE` continue d'exiger une préférence active et opt-in — les deux voies ne se substituent jamais l'une à l'autre. | Must | ADR-19 §2, RSV-EP18-02 |

### 1.2 Fournisseur et envoi *(nouveau)*

| ID | Exigence | Critère d'acceptation | Priorité | Source |
|----|----------|------------------------|----------|--------|
| EF-127 | Généralisation du contrat fournisseur par canal | ED le `NotificationDispatcher` · Q il résout un fournisseur pour une ligne Outbox · A la résolution se fait via `Map<CanalNotification, ChannelNotificationProvider>`, jamais un `if/else` sur le nom du fournisseur ; un canal sans fournisseur enregistré produit `DEAD` avec `last_error_code='PROVIDER_INDISPONIBLE'`, jamais un succès silencieux. | Must | ADR-19 §3 |
| EF-128 | Envoi EMAIL via template approuvé uniquement | ED un `NotificationOutbox` en statut `PENDING`, canal `EMAIL` · Q le dispatcher le traite · A l'envoi n'est tenté que si `NotificationTemplate.approval_status='APPROUVE'`, `enabled=true`, `subject` et `html_body` non vides pour ce `code`/`channel`/`language` ; sinon la ligne passe en `DEAD`, jamais de texte codé en dur dans `ResendEmailProvider`. | Must | ADR-19 §5 |
| EF-129 | Validation stricte de l'adresse avant tout appel réseau | ED une adresse candidate au format invalide ou contenant un caractère de contrôle (`\r`/`\n`) · Q une tentative d'envoi EMAIL est évaluée · A rejet local classé `PERMANENT`, aucun appel HTTP vers Resend. | Must | ADR-19 §Sécurité |
| EF-130 | Aucun fallback automatique depuis EMAIL | ED un envoi EMAIL en échec, quelle que soit la catégorie · Q évalué par `NotificationFallbackService` · A aucun SMS/WhatsApp de secours n'est mis en file (le service ne branche que sur `WHATSAPP`, non modifié par ce périmètre). | Must | ADR-19 §7, K5 — proposition à confirmer |

### 1.3 Consentement et source de vérité *(nouveau)*

| ID | Exigence | Critère d'acceptation | Priorité | Source |
|----|----------|------------------------|----------|--------|
| EF-131 | Aucun consentement requis pour un e-mail transactionnel d'exécution | ED un destinataire d'invitation (aucun compte existant) · Q l'e-mail `INVITATION_CREEE` est émis · A aucune `NotificationPreference` n'est créée ni consultée ; l'adresse provient exclusivement de `Invitation.email`, jamais dupliquée dans une nouvelle table de préférence pour ce cas. | Must | BF-114, ADR-19 §2 — proposition à confirmer (K4) |
| EF-132 | Préférence EMAIL optionnelle pour comptes existants *(lots futurs, non codé ici)* | ED un `BAILLEUR`/`GESTIONNAIRE`/`LOCATAIRE` · Q il définit une adresse e-mail de notification | A `NotificationPreference.email` est persistée avec opt-in explicite, jamais copiée automatiquement depuis le compte — même principe que `phone_e164` (K3, ADR-18). | Could | BF-114, ADR-19 §2.6 — hors périmètre de codage de ce mandat |

### 1.4 Exploitation et garde-fous *(nouveau)*

| ID | Exigence | Critère d'acceptation | Priorité | Source |
|----|----------|------------------------|----------|--------|
| EF-133 | Feature flags et kill switch dédiés EMAIL | ED un environnement sans configuration Resend explicite · Q l'application démarre · A `RESEND_EMAIL_ENABLED=false` par défaut, aucune erreur au démarrage, `NoopEmailProvider` seul actif ; une désactivation EMAIL n'affecte jamais WhatsApp/SMS et réciproquement. | Must | ADR-19 §Coûts |
| EF-134 | Plafond budgétaire mensuel dédié Resend | ED un volume d'envois EMAIL approchant `RESEND_BUDGET_MENSUEL_MAX` · Q le compteur est évalué · A les envois EMAIL sont limités/arrêtés automatiquement sans jamais consommer ni bloquer le plafond WhatsApp/SMS existant. | Must | ADR-19 §Coûts, K3 — proposition à confirmer |

### 1.5 Confirmation de statut de livraison EMAIL *(Sprint C, EP-18)*

| ID | Exigence | Critère d'acceptation | Priorité | Source |
|----|----------|------------------------|----------|--------|
| EF-135 | Callback webhook Resend applique le statut de livraison | ED un `notification_delivery` EMAIL en statut non terminal · Q un callback webhook Resend signé valide arrive (`email.sent`/`email.delivered`/`email.opened`/`email.bounced`/`email.complained`) · A `NotificationDeliveryService.appliquerCallbackResend` fait progresser `statut` via la fonction `SECURITY DEFINER notification_delivery_appliquer_statut` (réutilisée telle quelle, aucune migration) ; `bounced`/`complained` sont classés `errorCategory=PERMANENT`. | Must | ADR-19 §Sécurité, RSV-EP18-01 |
| EF-136 | Idempotence et rejet des callbacks hors ordre/dupliqués | ED un callback dupliqué ou portant un statut de rang inférieur/égal au statut courant · Q traité par la fonction SQL réutilisée (V28) · A aucune transition supplémentaire, réponse HTTP toujours indifférenciée (204) — même garantie que le patron Twilio, sans nouvelle table de déduplication. | Must | ADR-19 §Sécurité, RM-128 |

---

## 2. Exigences non fonctionnelles (addendum)

| ID | Catégorie | Exigence | Critère d'acceptation | Source |
|----|-----------|----------|-----------------------|--------|
| ENF-98 | Sécurité — Secrets Resend | La clé API Resend et le corps des e-mails ne sont jamais journalisés. | ED un envoi EMAIL (succès ou échec) · Q journalisé · A seuls des identifiants et codes d'erreur apparaissent dans les logs, jamais `Authorization`, `variables` ou le corps du message — même discipline qu'ADR-18/`TwilioNotificationProvider`. | ADR-19 §Sécurité |
| ENF-99 | RGPD — Minimisation du payload EMAIL | Le payload transmis à Resend ne contient jamais de donnée personnelle au-delà des variables de template strictement nécessaires. | ED un `NotificationEvent.payload_minimal` (voie `INVITATION_CREEE`) · Q un envoi est déclenché · A uniquement le lien d'acceptation, l'adresse, la durée de validité — jamais de mot de passe, jamais de donnée technique interne. | ADR-19 §RGPD |

---

## 3. Registre des règles métier (RM) — *complète le registre ouvert par RM-100→123 (EP-13/EP-15/EP-16)*

| ID | Règle métier | Exigence(s) liée(s) |
|----|--------------|----------------------|
| RM-124 | Une notification EMAIL ne bloque, ne retarde ni n'annule jamais une opération métier (création d'invitation notamment). | EF-125, BF-115 |
| RM-125 | La voie transactionnelle (sans préférence) ne s'applique jamais à `BAILLEUR`/`GESTIONNAIRE`/`LOCATAIRE` ; la voie préférence ne s'applique jamais à `INVITATION`. | EF-126 |
| RM-126 | Un template EMAIL non approuvé, désactivé, ou sans sujet/corps HTML ne peut jamais servir à un envoi réel. | EF-128 |
| RM-127 | Aucun fallback automatique n'est jamais déclenché depuis un échec EMAIL vers un autre canal. | EF-130 |
| RM-128 | Aucune mutation de `notification_delivery` n'est jamais appliquée sans signature Resend (Svix) valide — un endpoint public sans preuve d'origine ne peut jamais écrire d'état de livraison. | EF-135, EF-136 |

---

## 4. Modèle de données (proposition logique — narratif, non implémenté)

### 4.1 Diagramme logique proposé (extension du diagramme EP-16)

```
NotificationOutbox (event_id, recipient_id, channel) ── UNIQUE (event_id, recipient_id, notification_type, channel)
        │
        ├── recipient_address NULL          → voie préférence (résolution via NotificationPreference, comme WhatsApp/SMS)
        └── recipient_address NON NULL      → voie transactionnelle (résolue à l'émission, ex. Invitation.email)

NotificationTemplate (code, channel, language, version)
        └── subject / html_body / text_body   (EMAIL uniquement, NULL pour WHATSAPP/SMS)
```

### 4.2 Cardinalités et contraintes d'intégrité (conceptuelles)

| Règle | Contrainte conceptuelle |
|-------|--------------------------|
| RM-125 | Aucune contrainte SQL ne peut porter cette règle (recipient_type détermine la voie applicative) — vérifiée par test dédié (isolation des deux voies), pas par CHECK |
| EF-125/126 | `notification_outbox.recipient_address VARCHAR(320)` nullable, additive |
| EF-128 | `notification_template.subject`/`html_body`/`text_body` nullables, additifs ; `utilisablePourEnvoi()` étendu pour EMAIL |
| ADR-19 §Modèle | 4 contraintes `CHECK` étendues pour admettre `'EMAIL'` (channel/preferred_channel) — additif, `DROP`/`ADD CONSTRAINT` équivalente élargie |

### 4.3 Impact migration base de données *(narratif)*

Migration additive uniquement (nouvelles colonnes nullables, CHECK élargis, aucune suppression) —
numéro réservé **V30** (dernière migration réelle à ce jour : V29), à reconfirmer au Plan
d'Exécution en cas de migration intercurrente. Rollback applicatif trivial.

---

## 5. Contrats d'API impactés (proposition — non implémentée)

Aucun endpoint public nouveau requis pour le Lot 1 (invitation). Endpoints proposés pour les lots
futurs (webhook Resend, préférences EMAIL) documentés mais non codés :

| Endpoint | Méthode | Description | Sécurité | Statut |
|---------------------|---------|--------------|----------|--------|
| `/api/public/notifications/resend/callback` | POST | Callback webhook Resend (`email.sent`/`email.delivered`/`email.opened`/`email.bounced`/`email.complained`) | Non authentifié JWT — signature Svix (`svix-id`/`svix-timestamp`/`svix-signature`, HMAC-SHA256, secret `RESEND_WEBHOOK_SECRET`), patron `TwilioCallbackController` | **Sprint C implémenté** — jamais activé côté dashboard Resend dans cette mission (RSV-EP18-06) |

---

## 6. Matrice de traçabilité (addendum)

| Besoin (EB) | Exigence (CDC) | Règle métier | Cas de test prévu |
|-------------|------------------|---------------|---------------------|
| BF-112, BF-113 | EF-125 | RM-124 | TC-130 événement + Outbox EMAIL créés dans la même transaction que l'invitation ; TC-131 panne Resend ⇒ invitation persistée, Outbox rejouable |
| BF-114 | EF-126, EF-131 | RM-125 | TC-132 voie transactionnelle jamais appliquée à un `BAILLEUR`/`GESTIONNAIRE`/`LOCATAIRE` ; TC-133 voie préférence jamais appliquée à `INVITATION` |
| BF-112 | EF-127 | — | TC-134 canal EMAIL résolu sans `if/else` dispersé ; TC-135 canal sans provider ⇒ `DEAD`, jamais de succès silencieux |
| BF-112 | EF-128 | RM-126 | TC-136 template EMAIL non approuvé/sujet vide ⇒ `DEAD`, aucun envoi |
| BF-115 | EF-129 | — | TC-137 adresse invalide ⇒ rejet local `PERMANENT`, aucun appel réseau |
| BF-114 | EF-130 | RM-127 | TC-138 échec EMAIL ⇒ aucun fallback WhatsApp/SMS déclenché |
| — | EF-133, EF-134 | — | TC-139 démarrage sans config Resend ⇒ sûr, `NoopEmailProvider` actif ; TC-140 plafond Resend atteint ⇒ envois EMAIL limités sans affecter WhatsApp/SMS |
| BF-113 | EF-125 | — | TC-141 régénération d'invitation ⇒ nouvel événement/nouvel e-mail lié au nouveau token |
| BF-115 | EF-125 | — | TC-142 deux traitements concurrents de la même invitation ⇒ un seul envoi logique (idempotence héritée d'ADR-18 §4) |
| — | EF-125 | — | TC-143 invitation d'un autre bailleur ⇒ aucun accès cross-tenant à l'Outbox/Delivery correspondante |
| — | EF-135, EF-136 | RM-128 | TC-144 signature Svix invalide ⇒ 403, aucune mutation ; TC-145 horodatage hors fenêtre ⇒ rejeté comme signature invalide |
| — | EF-135 | RM-128 | TC-146 `email.sent`/`email.delivered`/`email.opened` valides ⇒ 204, statut progresse dans l'ordre |
| — | EF-135 | RM-128 | TC-147 `email.bounced` ⇒ `UNDELIVERED`/`PERMANENT` ; TC-148 `email.complained` ⇒ `FAILED`/`PERMANENT` |
| — | EF-136 | RM-128 | TC-149 callback dupliqué ⇒ 204 les deux fois, aucune transition supplémentaire (idempotence) |
| — | EF-135, EF-136 | — | TC-150 type inconnu ou `provider_message_id` introuvable ⇒ 204 indifférencié, aucune mutation |

---

## 7. Score de maturité de l'addendum (/20)

| Axe | Note (0–4) | Commentaire |
|-----|-----------|-------------|
| Complétude | 2 | Cinq points de kickoff (K1→K5) ouverts avec recommandation par défaut documentée (contre 0 recommandation pour K3/K4/K6/K7 d'ADR-18 à ce stade) — cadrage plus avancé qu'EP-16 au même jalon, mais aucun arbitrage PO rendu |
| Qualité | 4 | Critères ED/Q/A testables sur chaque EF, ancrés sur du code réel vérifié (`InvitationService`, `NotificationDispatcher`, contraintes CHECK V27) |
| Sécurité | 4 | Validation d'adresse, protection injection, non-journalisation des secrets, patron webhook identique à Twilio — tous couverts (ENF-98, EF-129) |
| Traçabilité | 4 | Matrice BF→EF→RM→TC complète, numérotation vérifiée sans collision (EF-125+, RM-124+, ENF-98+, TC-130+) |
| Automatisation | 0 | Aucun code, aucune migration — conforme à la contrainte documentaire de cette mission |
| **Total** | **14/20** | Cadrage solide, complétude volontairement partielle tant que K1→K5 ne sont pas confirmés par le PO — ne constitue pas un Gate ; qualifie la maturité documentaire avant Plan d'Exécution |
