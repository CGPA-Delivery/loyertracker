# Addendum CDC — EP-20 : Garantie locative appliquée à une échéance

| Champ | Valeur |
|---|---|
| Date | 2026-08-13 |
| Statut | **Proposé — dépend du Plan d’Exécution et d’un GO PO/CDO distinct** |
| Références | BF-148→153, ADR-14/15/18 |

## Exigences fonctionnelles

| ID | Exigence vérifiable |
|---|---|
| EF-148 | `retenirSurLoyer` verrouille les agrégats concernés, calcule `resteAvant = max(0, attendu - reçu)`, refuse montant ≤0, >resteAvant ou >solde garantie, puis fixe `montantRecuApres = montantRecuAvant + retenue`; `RECU` si `montantRecuApres >= attendu`, sinon `PARTIEL`. |
| EF-149 | Dans la même transaction : solde garantie, `RETENUE_LOYER`, paiement lié, audit riche et événement/Outbox sont cohérents; aucune opération réseau. |
| EF-150 | L’événement `GARANTIE_DEBITEE` contient des IDs, montants, devise, période, états avant/après, statut et référence/lien de document; aucun téléphone, nom, token ou contenu PDF dans le payload. |
| EF-151 | La quittance ADR-15 reste limitée à `RECU`; le chemin `PARTIEL` doit être statué avant code comme reçu partiel certifié séparé ou explicitement exclu. |
| EF-152 | `QuittanceFilenameFactory` pure normalise période/numéro, utilise UUID8 documentés, et alimente identiquement les endpoints authentifié et public via `Content-Disposition`. |
| EF-153 | L’UI exige une confirmation explicite et affiche projeté/final, y compris état Outbox/Delivery; elle ne bloque jamais sur un dispatch externe. |

## Sécurité et intégrité

- RLS/ReBAC existants restent fail-closed; aucune lecture cross-bailleur ou hors affectation active.
- Idempotence métier à renforcer au-delà de l’unicité Outbox : double clic, retry HTTP et concurrence de deux retenues ne doivent pas débiter deux fois.
- Le callback Twilio signé et idempotent, le budget, kill-switch et fallback SMS existants sont réutilisés; aucun secret ni PII ne doit apparaître dans logs ou métriques.
