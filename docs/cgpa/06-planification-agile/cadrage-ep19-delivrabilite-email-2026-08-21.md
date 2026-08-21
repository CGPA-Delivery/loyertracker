# Cadrage EP-19 — Suivi avancé de délivrabilité des e-mails via Webhooks Resend

| Champ | Valeur |
|-------|--------|
| Projet | LoyerTracker |
| Objet | Cadrage EP-19 — Délivrabilité email, Webhooks Resend/Svix |
| Date | 2026-08-21 |
| Auteur | Jo_skynet (agent CGPA) |
| Destinataire | Jordan Tshilombo Kabamba, PO/CDO |
| Statut | **GO / EP19_CADRAGE_READY** |

---

## 1. Contexte et justification

EP-18 a livré l'envoi d'emails via Resend avec le domaine `loyertracker.org` vérifié. La réception DMARC est opérationnelle. Cependant, la **délivrabilité réelle** reste invisible :

- Les statuts `DELIVERED`, `BOUNCED`, `FAILED`, `COMPLAINED` ne sont pas remontés
- Aucun webhook Resend/Svix n'est consommé (reclassé hors périmètre EP-18 comme `RSV-EP18-06`)
- Pas de métriques ni alerting sur les échecs fournisseur

EP-19 comble ce gap pour une **exploitation production saine** du canal email.

---

## 2. Périmètre proposé

| US | Titre | Priorité | Effort estimé |
|----|-------|----------|---------------|
| **US-144** | Validation opérationnelle signatures Svix Resend | Must | 1 jour |
| **US-145** | Application statuts de délivrabilité | Must | 2 jours |
| **US-146** | Métriques, alertes et tableau de bord délivrabilité | Should | 3 jours |

**Total estimé : 6 jours**

---

## 3. Architecture technique proposée

```
Resend → Svix webhook → VerificationController (signature check)
                              ↓
                    NotificationDeliveryService
                              ↓
                    Mettre à jour NotificationDelivery.status
                              ↓
                    Prometheus metrics / Dashboard Angular
```

### 3.1 Backend (Spring Boot)

| Composant | Description |
|-----------|-------------|
| `SvixSignatureVerifier` | HMAC-SHA256 du payload avec `whsec_...` |
| `WebhookResendController` | POST `/api/webhooks/resend` — public, signature obligatoire |
| `NotificationDeliveryService` | Idempotence, mapping statuts |
| Migration | Colonnes `provider_status`, `delivered_at`, `bounced_at`, `complained_at` |

### 3.2 Frontend (Angular)

| Composant | Description |
|-----------|-------------|
| `DeliveryDashboardComponent` | Filtres statut/période |
| `DeliveryMetricsComponent` | Graphiques taux de succès/bounce |
| Route `/notifications/delivery` | Guard `planLimitGuard` + `onboardingGuard` |

### 3.3 Sécurité

- Webhook public mais **signature Svix obligatoire** (403 si invalide)
- Aucun PII dans les logs webhook
- Idempotence clé `provider_message_id`

---

## 4. Critères d'acceptation par US

### US-144 — Validation signatures Svix

| Critère | Test |
|---------|------|
| Signature valide acceptée | POST avec signature correcte → 200 |
| Signature invalide refusée | POST avec signature altérée → 403 |
| Timestamp frais obligatoire | Timestamp > 5 min → 403 |
| Aucun secret journalisé | Logs ne contiennent pas `whsec_` |

### US-145 — Statuts de délivrabilité

| Critère | Test |
|---------|------|
| `email.delivered` → `DELIVERED` | Statut mis à jour, timestamp persisted |
| `email.bounced` → `BOUNCED` | Soft/hard bounce distingués |
| `email.complained` → `COMPLAINED` | Marqué comme spam |
| `email.failed` → `FAILED` | Échec fournisseur |
| Idempotence | Même `provider_message_id` ×2 → 1 seule mutation |
| Callback hors ordre | `delivered` après `bounced` → statut finale `DELIVERED` |

### US-146 — Métriques, alertes et tableau de bord délivrabilité

**En tant que** exploitant / Product Owner, **je veux** des métriques Prometheus, des alertes sur les anomalies de délivrabilité et un tableau de bord Angular **afin de** détecter et visualiser les rebonds, plaintes et échecs fournisseur.

| Critère | Test |
|---------|------|
| Métrique `notification_delivery_total{status}` | Prometheus scrape |
| Métrique `notification_delivery_rate` | Taux de succès calculé |
| Alerte bounce rate > 5% | Alertmanager firing |
| Alerte complaint rate > 0.1% | Alertmanager firing |
| Dashboard liste filtrable par statut | UI fonctionnelle |
| Dashboard filtre par période (7j/30j/90j) | UI fonctionnelle |
| Aucune fuite cross-tenant | ReBAC/RLS testé |
| Masquage emails partiel | `j***@gmail.com` |

---

## 5. Plan d'exécution proposé

| Phase | Contenu | Livrable |
|-------|---------|----------|
| **Phase 0** | Cadrage, Gate 02A | Cette décision |
| **Phase 1** | US-144 + US-145 Backend | PR backend avec migration |
| **Phase 2** | US-146 Frontend + métriques | PR frontend avec tests |
| **Phase 3** | Intégration E2E | Smoke Staging |
| **Phase 4** | Gate Staging | GO / STAGING_DEPLOYED |
| **Phase 5** | Gate Production | GO / PRODUCTION_DEPLOYED |

---

## 6. Risques et réserves identifiés

| Risque | Mitigation |
|--------|------------|
| Webhook Resend indisponible | Retry + dead letter queue |
| Ordre des callbacks aléatoire | Timestamp + idempotence |
| Fuite PII via logs | Masquage + niveau INFO limité |
| Coût Resend (emails supplémentaires) | Budget déjà fixé à 100/mois |
| Secret webhook compromis | Rotation + validation IP Resend (option) |

---

## 7. Dépendances

| Dépendance | Statut | Impact |
|------------|--------|--------|
| EP-18 livré | ✅ Clôturé | Base Resend opérationnelle |
| Domaine `loyertracker.org` | ✅ Vérifié | Expéditeur stable |
| Webhook Resend/Svix | 🔄 À configurer | US-144 bloquant sans endpoint |
| Secret `whsec_...` | 🔄 À générer | Stocké hors Git (`.env`) |

---

## 8. Décision requise

| Option | Conséquence |
|--------|-------------|
| **GO / EP19_CADRAGE_READY** | Autorise Phase 1 (US-144/145 Backend) |
| **GO sous réserve** | Autorise Phase 1 avec réserves documentées |
| **NO GO** | EP-19 reporté, backlog préservé |

---

## 9. Décision finale

> **GO / EP19_CADRAGE_READY**
>
> Jordan Tshilombo Kabamba, Product Owner / CGPA Chief Delivery Officer, autorise le démarrage de **Phase 1** (US-144 + US-145 Backend) du périmètre EP-19.
>
> **Réserves et conditions :**
> - Toute activation opérationnelle (Production) requiert **Gate distinct** explicite
> - Le webhook Resend/Svix doit être configuré **avant** tout déploiement Staging
> - Le secret `whsec_...` doit être stocké **hors Git** (fichier `.env` local uniquement)
> - Aucun envoi réel supplémentaire n'est autorisé — seule la réception des callbacks existants
>
> **Date de décision** : 2026-08-21
> **Identité** : Jordan Tshilombo Kabamba, PO/CDO
> **Signature** : Décision prise via interface conversationnelle Hermes Agent, session du 2026-08-21

---

*Cadrage validé le 2026-08-21. Phase 1 autorisée.*