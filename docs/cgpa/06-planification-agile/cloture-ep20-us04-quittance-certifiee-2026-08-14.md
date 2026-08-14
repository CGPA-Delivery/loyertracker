# Clôture EP20-US04 — Quittance certifiée après retenue de garantie

| Champ | Valeur |
|---|---|
| Date | 2026-08-14 |
| Story | `EP20-US04` — Must |
| Autorité de clôture | PO/CDO — Jordan Tshilombo Kabamba (`Approuvé`) |
| PR intégrée | #487 — merge `d3c9b6ddff3ac5f5a74463bb4db0fb16f1d398a0` |
| État | **CLOSE — intégrée sur `main`** |

## Résultat livré

- ADR-15 est appliqué sans exception : une quittance certifiée est accessible uniquement pour un paiement `RECU`; un paiement `PARTIEL` ne produit ni document téléchargeable ni quittance persistée.
- Quand une retenue de garantie solde le paiement, une quittance `EMISE` unique est créée si le profil bailleur satisfait la précondition documentaire d’adresse.
- L’intégrité financière prévaut : une adresse bailleur absente ne bloque jamais le débit de garantie ni le passage à `RECU`; aucune quittance n’est alors créée et son émission demeure possible après correction du profil.

## Preuves

- RED observé : l’émission automatique naïve retournait `409` et bloquait une retenue validée lorsque l’adresse bailleur était absente.
- GREEN : retenue préservée avec profil incomplet, sans quittance; test Testcontainers ciblé PASS.
- ADR-15 négatif : `PARTIEL` retourne `409` et persiste `0` quittance; `QuittanceCertifieeIntegrationTest` PASS.
- ADR-15 positif : `PARTIEL → RECU` après retenue, profil complet, crée exactement `1` quittance `EMISE` liée au paiement; `S03PaiementsGarantiesIntegrationTest` PASS.
- `mvn -q verify` : PASS; Flyway/Testcontainers validés sur 34 migrations.
- PR #487 : CI complète SUCCESS — structural audit, Backend, Frontend, Sécurité, CodeQL Java/TypeScript, accessibilité E2E et Build/scan/SBOM Docker. Publication/signatures/attestations : `SKIPPED` conformément au classifieur sans changement d’image.

## Bornes et suite

Cette clôture ne constitue ni un Gate Staging/Production, ni une autorisation d’activer un provider, d’utiliser un secret ou d’émettre un message réel.

Toute story EP20 ultérieure nécessite une instruction PO/CDO distincte; cette décision n’autorise aucun nouveau code, migration, environnement ou promotion.
