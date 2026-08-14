# Clôture EP20-US03 — Notification `GARANTIE_DEBITEE`, ReBAC et templates

| Champ | Valeur |
|---|---|
| Date | 2026-08-14 |
| Story | `EP20-US03` — Must |
| Autorité de clôture | PO/CDO — Jordan Tshilombo Kabamba (`Approuvé`) |
| PRs intégrées | #484 (`5c8c2c8`) et #485 (`b76b3dc`) |
| État | **CLOSE — intégrée sur `main`** |

## Résultat livré

- `GARANTIE_DEBITEE` persiste `notification_event.bien_id` dans la transaction métier ; l'historique Gestionnaire demeure ReBAC fail-closed.
- L'Outbox reste transactionnelle ; le Dispatcher seul peut appeler un provider après commit. Aucun provider n'a été activé ou appelé durant ce cycle.
- Le fallback SMS est fail-closed : il exige simultanément politique, préférence, opt-in, numéro, budget, absence de doublon, et template du même code/canal/langue avec statut `APPROUVE` et `enabled=true`.
- V34, additive, crée le template global `GARANTIE_DEBITEE / SMS / fr`. Le contrat de dépôt Flyway est passé à 34 ; le compteur Production reste inchangé.

## Preuves

- RED observé : sans template SMS approuvé, un échec permanent WhatsApp créait auparavant un SMS fallback (`expected: 0`, obtenu `1`).
- GREEN négatif : aucun SMS fallback sans template.
- GREEN positif : exactement un SMS fallback avec le template V34 approuvé/actif, y compris sous contexte tenant/RLS ; aucun doublon.
- `NotificationDispatchIntegrationTest` complet : PASS.
- `mvn -q verify` : PASS, validation Flyway/Testcontainers sur 34 migrations.
- PR #485 : merge `b76b3dc0d1b4fe7b754516619d48af69d5507b9b`, CI complète SUCCESS : structural audit, Backend, Frontend, Sécurité, CodeQL Java/TypeScript, accessibilité E2E et Build/scan/SBOM Docker. Publication/signatures/attestations : `SKIPPED` conformément au classifieur sans changement d'image.

## Bornes et suite

Cette clôture ne constitue ni un Gate Staging/Production, ni une activation Twilio/SMS/WhatsApp, ni une autorisation de secret ou d'envoi réel.

`EP20-US04` n'est **pas démarrée** par cette décision. Son démarrage nécessite une instruction PO/CDO distincte, limitée à la règle ADR-15 : quittance certifiée uniquement pour un paiement `RECU`; aucun document certifié téléchargeable pour `PARTIEL`.
