# Matrice de traçabilité — EP-20 Garantie / échéance

| BF | EF/RM | US | Tests de validation prévus |
|---|---|---|---|
| BF-148 | EF-148 | EP20-US01 | total, complément après paiement classique, partiel, plafonds, retry, concurrence |
| BF-149 | EF-149 | EP20-US02 | mouvement/FK/audit, RLS/ReBAC, invariant ledger, cardinalité unique |
| BF-150 | EF-150 | EP20-US03 | payload, `bien_id`, consentement, templates WhatsApp/SMS, Outbox unique, Twilio indisponible, fallback/budget |
| BF-151 | EF-151 | EP20-US04 | `RECU`/`PARTIEL`, HTML/PDF/QR/hashes, aucun document certifié `PARTIEL` |
| BF-152 | EF-152 | EP20-US05 | factory pure, noms sûrs sans PII, Content-Disposition authentifié/public |
| BF-153 | EF-153 | EP20-US06 | confirmation, états finaux, a11y, responsive 360/390/640/1024 |

**Statut :** planifié, non exécuté. Toute ligne de preuve sera complétée de manière additive après GO et exécution réelle.
