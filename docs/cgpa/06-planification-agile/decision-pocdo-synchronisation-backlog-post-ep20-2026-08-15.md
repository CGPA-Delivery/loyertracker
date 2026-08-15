# Décision PO/CDO — Synchronisation du Product Backlog après clôture EP-20

| Champ | Valeur |
|---|---|
| Date | 2026-08-15 |
| Autorité | PO/CDO — Jordan Tshilombo Kabamba (`Synchronisation product-backlog`) |
| Nature | Migration documentaire additive |
| Périmètre | `product-backlog.md`, `CHANGELOG.md`, `project-state.md` |
| Décision | **GO documentaire — synchronisation post-EP-20** |

## Constat

La vue additive du backlog datée du 2026-08-10 ne reflète plus l’état réel :

- EP-17 est encore présenté comme « proposé — non approuvé », alors que les Lots 1→5 ont été autorisés ou exécutés selon leurs Gates ; aucune décision de clôture globale EP-17 n’est toutefois identifiée et `EP-17/US-142` reste non approuvée ;
- EP-19 reste proposé et non approuvé, conformément à son addendum ; la fondation callback/signature livrée sous EP-18/US-143 ne vaut ni validation opérationnelle Svix réelle, ni livraison de `EP-19/US-144→147` ;
- EP-20, absent de la table post-EP-08, est clôturé après intégration de `EP20-US01→EP20-US06` et fusion de la clôture documentaire PR #501.

## Décision

1. Préserver intégralement la table historique du 2026-08-10.
2. Ajouter une vue canonique datée du 2026-08-15 qui fait autorité pour les arbitrages suivants.
3. Classer EP-17 **Partiellement livré / exécuté par lots — clôture globale non prononcée** ; maintenir `EP-17/US-142` hors périmètre tant qu’elle n’est pas approuvée.
4. Maintenir EP-19 **Proposé — non approuvé** ; la fondation EP-18/US-143 est un prérequis technique, pas une preuve de réalisation EP-19. Aucune implémentation ou activation webhook n’est autorisée.
5. Classer EP-20 **Clôturé — intégré sur `main`**, avec les preuves de merge des six stories.
6. Ne créer ni n’autoriser EP-21 par cette synchronisation.

## Traçabilité EP-20

| Story | Livraison principale | État |
|---|---|---|
| `EP20-US01` | PR #482 — merge `5b059c153061e221f3c47e7ef38f8fd4ed985215` | Intégrée ; couverte par la clôture globale EP-20, sans acte individuel |
| `EP20-US02` | PR #483 — merge `cd0b0beadde1683833baf7e32849494e868f3af1` | Intégrée ; couverte par la clôture globale EP-20, sans acte individuel |
| `EP20-US03` | PR #484/#485 ; clôture PR #486 | CLOSE |
| `EP20-US04` | PR #487 ; clôture PR #488 | CLOSE |
| `EP20-US05` | PR #489 ; clôture PR #490 | CLOSE |
| `EP20-US06` | chaîne #491→#500 ; clôture PR #501, merge `293dd50b91cdd21786994d6b44c100599c0fcf28` | CLOSE |

## Bornes

Cette décision autorise uniquement la synchronisation documentaire. Elle n’autorise aucun code, migration, nouvel Epic, Staging, Production, provider, secret, webhook ni envoi réel.

Une promotion EP-20 vers Staging exige un Gate Staging distinct, un RC immuable, `STG-ISOL-01`, un préflight live, backup/rollback et une instruction opérationnelle explicite. Un nouvel EP-21 exige un cadrage PO/CDO séparé et un contrôle de collisions d’identifiants.
