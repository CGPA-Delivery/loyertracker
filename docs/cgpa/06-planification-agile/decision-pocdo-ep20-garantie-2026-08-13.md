# Décision PO/CDO — EP-20 : garantie locative appliquée à une échéance

| Champ | Valeur |
|---|---|
| Date de décision | 2026-08-13 |
| Autorité | PO/CDO — Jordan Tshilombo Kabamba |
| Décision humaine | **APPROUVÉ** |
| Référentiel | CGPA v6.1.1, ADR-14, ADR-15, ADR-18, Financial Governance |
| Périmètre | EP-20, sous réserve de la fusion de la présente décision documentaire |

## 1. Correction de nomenclature

La vérification post-cadrage a identifié une collision avec les stories historiques proposées du Lot 6 UX (`US-148` à `US-151`). Elles ne sont ni supprimées ni renumérotées.

La nomenclature canonique EP-20 devient :

| ID canonique | Objet |
|---|---|
| `EP20-US01` | Imputation garantie cumulée sur le reste dû réel |
| `EP20-US02` | Idempotence, concurrence, cardinalité et audit |
| `EP20-US03` | Notification `GARANTIE_DEBITEE`, ReBAC et templates |
| `EP20-US04` | Règle documentaire `RECU` / `PARTIEL` |
| `EP20-US05` | Nomenclature PDF sans PII |
| `EP20-US06` | Confirmation UI et restitution des états |

## 2. Statuts des réserves

### `RSV-EP20-PARTIEL-01` — DÉCIDÉE

Pour `PARTIEL`, EP-20 ne crée **aucun document téléchargeable certifié**. La quittance ADR-15 reste limitée à `RECU`. L’UI affiche les montants, soldes, reste dû et référence de mouvement sans les qualifier de quittance ou reçu certifié.

Un reçu partiel certifié est explicitement hors périmètre et nécessitera un cadrage légal/comptable et une décision future distincte.

### `RSV-EP20-CARDINALITE-02` — DÉCIDÉE

EP-20 autorise **une seule retenue de garantie par paiement/échéance**. Le garde applicatif est complété par une protection de persistance additive seulement après contrôle de données et test Flyway frais. Les opérations concurrentes doivent être sérialisées ou protégées par une stratégie de versionnement explicitement prouvée.

Les retenues multiples/fractionnées sont hors périmètre et relèvent d’un epic futur avec modèle append-only de liaison et analyse comptable propre.

### `RSV-EP20-NOTIF-03` — DÉCIDÉE

EP-20 persiste `notification_event.bien_id` dans la transaction métier et enrichit `GARANTIE_DEBITEE` avec identifiants métier, montants/devise, période, statut et référence documentaire éventuelle. Le payload exclut téléphone, nom, token, URL publique et PDF.

Les templates WhatsApp et SMS doivent être approuvés et testés. Le fallback reste soumis aux consentements, préférences, template, budget et garde-fous existants. Aucun fournisseur externe n’est activé ni appelé réellement par cette décision.

## 3. Décision CGPA consolidée

> **GO / EP20_IMPLEMENTATION_READY — borné aux `EP20-US01` à `EP20-US06`, après fusion humaine de cette PR documentaire.**

### Autorisé après fusion

- code applicatif minimal, piloté TDD ;
- migrations Flyway seulement si prouvées nécessaires, additives et testées sur base fraîche ;
- tests locaux, CI et revue humaine ;
- commits atomiques par story validée.

### Explicitement non autorisé

- Staging ou Production ;
- activation Twilio/SMS/WhatsApp, secrets ou envoi réel ;
- n8n/broker, paiement en ligne ;
- reçu partiel certifié ;
- modification rétroactive de migrations, ledger ou quittance existants.

## 4. Premier jalon autorisé après fusion

`EP20-US01` : cycle TDD strict sur le cas cumulatif `400 + 600 = RECU / 1000 / reste 0`, suivi des cas partiel, plafonds et non-régression. Aucun code de production avant test RED vérifié.
