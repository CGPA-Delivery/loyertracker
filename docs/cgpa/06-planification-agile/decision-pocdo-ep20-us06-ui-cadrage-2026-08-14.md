# Décision PO/CDO — Cadrage EP20-US06 : confirmation et restitution UI

| Champ | Valeur |
|---|---|
| Date | 2026-08-14 |
| Story | `EP20-US06` — Must |
| Autorité | PO/CDO — Jordan Tshilombo Kabamba (`Approuvé`) |
| État | **GO / EP20-US06_CADRAGE_READY** |
| Prérequis constaté | EP20-US03, US04 et US05 clôturées sur `main` |

## Décision et périmètre autorisé

Le PO/CDO autorise exclusivement le cadrage documentaire de la confirmation d’une retenue de garantie et de la restitution de son résultat.

Le dossier de conception devra définir, avant toute implémentation :

1. le dialogue de confirmation : montant, échéance, reste dû, solde garantie, conséquence `RECU`/`PARTIEL`, avertissement ADR-15 lorsque la quittance certifiée n’est pas disponible ;
2. l’état de succès : mouvement retenu, montants avant/après, statut final, référence de quittance seulement si `RECU`, état de notification sans promettre une livraison externe ;
3. les états refusés et récupérables : autorisation, doublon/cardinalité, concurrence, plafond, indisponibilité documentaire ;
4. le contrat Frontend/API minimal, tenant-scopé, ReBAC/RLS et sans PII ou secret supplémentaire ;
5. la matrice responsive aux viewports `360`, `390`, `640` et `1024` px ;
6. la matrice accessibilité : focus initial/restitution, clavier, Escape, piège de focus si modal, annonces d’état, messages d’erreur, contraste et cibles tactiles 44 px.

## Contrôles à produire avant code

- spécification UI et critères GWT ;
- inventaire composants/design tokens et dette design éventuelle ;
- revue Design/Frontend Architecture ;
- checklist a11y et responsive documentaire.

Aucune preuve navigateur, axe ou recette n’est déclarée à ce stade : ces contrôles seront exécutés et tracés dans la future PR d’implémentation si elle est autorisée.

## Bornes explicites

Cette décision **n’autorise pas** de code Frontend/Backend, migration Flyway, modification d’API, Staging, Production, provider, secret, envoi réel, activation externe ou démarrage d’une autre story.

Après fusion humaine de la présente décision et CI verte, une décision PO/CDO distincte pourra, si souhaité, autoriser une branche d’implémentation Frontend strictement limitée à EP20-US06.
