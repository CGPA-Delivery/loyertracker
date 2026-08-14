# Décision PO/CDO — GO d’implémentation Frontend EP20-US06

| Champ | Valeur |
|---|---|
| Date | 2026-08-14 |
| Story | `EP20-US06` — Must |
| Autorité | PO/CDO — Jordan Tshilombo Kabamba (`Approuvé`) |
| Prérequis | PR #491 fusionnée, CI complète SUCCESS, merge `6d18cde13db4996be22849c36067cf05b41fe580` |
| État | **GO / EP20-US06_FRONTEND_IMPLEMENTATION_READY** |

## Autorisation

Le PO/CDO autorise une branche Frontend dédiée, strictement limitée à EP20-US06 :

- dialogue de confirmation de retenue de garantie ;
- restitution de succès, refus et récupération à partir des contrats API existants ;
- représentation explicite de `RECU` / `PARTIEL` et de l’absence de quittance certifiée pour `PARTIEL` conformément à ADR-15 ;
- tests unitaires et E2E sur les parcours concernés ;
- preuves runtime responsive `360/390/640/1024` et a11y prévues par le cadrage.

## Conditions de livraison

- TDD : RED observé, GREEN minimal, refactorisation ; commits atomiques.
- Aucun nouveau contrat API n’est présumé : tout besoin Backend non servi est un blocage à consigner, non un motif de modification serveur implicite.
- Les contrôles ReBAC/RLS existants et l’isolation tenant restent inchangés ; l’UI ne doit pas afficher de PII, secret, token, QR ou hash non nécessaire.
- Toute preuve navigateur/axe est issue d’une exécution réelle et versionnée ou attachée à la CI ; aucune preuve ne sera simulée.

## Exclusions

Cette décision n’autorise ni Backend/API, migration Flyway, Staging, Production, provider, secret, envoi réel, activation externe, ni une autre story.

Tout écart serveur, contrat manquant ou besoin de migration suspend l’exécution et exige une décision PO/CDO/addendum distinct avant code hors Frontend.
