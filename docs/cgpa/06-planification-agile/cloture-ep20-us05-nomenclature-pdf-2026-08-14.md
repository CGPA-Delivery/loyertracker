# Clôture EP20-US05 — Nomenclature PDF unifiée et sans PII

| Champ | Valeur |
|---|---|
| Date | 2026-08-14 |
| Story | `EP20-US05` — Must |
| Autorité de clôture | PO/CDO — Jordan Tshilombo Kabamba (`Approuvé`) |
| PR intégrée | #489 — merge `d911044466cb3d3c8ce4ed05dfeb752252e9db3f` |
| État | **CLOSE — intégrée sur `main`** |

## Résultat livré

- Les téléchargements de quittance authentifié et public servent la même nomenclature déterministe : `quittance-certifiee-YYYY-MM.pdf`.
- `QuittanceFilenameFactory` ne retient que la période certifiée et accepte strictement `YYYY-MM` : aucune identité, adresse, email, token, QR, devise ou hash n’entre dans le nom de fichier.
- Le téléchargement public maintient le contrôle HMAC, l’intégrité `pdf_hash` / `content_hash` et la réponse `404` indifférenciée.
- La représentation de l’exemplaire PDF applique une sémantique de valeur défensive pour `byte[]`, sans exposer le contenu dans `toString`.

## Preuves

- RED/GREEN : factory absente, divergence des noms authentifié/public, période hostile acceptée, puis sémantique valeur `byte[]` incorrecte.
- Tests ciblés PASS : `DocumentGenerationIntegrationTest`, `PublicQuittanceIntegrationTest`, `QuittanceFilenameFactoryTest` et `QuittanceTelechargeeTest`.
- `mvn -q verify` : PASS avec Testcontainers/Flyway sur 34 migrations.
- PR #489 : CI complète SUCCESS — structural audit, Backend/Sonar Quality Gate, Frontend, Sécurité, CodeQL Java/TypeScript, accessibilité E2E et Build/scan/SBOM Docker.
- Publication/signatures/attestations : `SKIPPED` attendu, après classifieur vert et sans publication d’artefact.

## Bornes et suite

Cette clôture ne constitue ni un Gate Staging/Production, ni une autorisation d’activer un provider, d’utiliser un secret, d’émettre un message réel ou de démarrer une nouvelle story.

Toute suite EP20 requiert une instruction PO/CDO distincte ; elle n’autorise aucun nouveau code, migration, environnement ou promotion.
