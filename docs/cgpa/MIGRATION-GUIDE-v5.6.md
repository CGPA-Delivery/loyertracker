# Guide de migration CGPA v5.5 vers v5.6

## Principe

Migration additive sans reinitialisation, suppression d'historique ni rejeu de Gate.

## Procedure

1. Lire docs/project-state.md et conserver phase, Gates et decisions.
2. Determiner si le projet livre une interface.
3. Pour backend/API-only, tracer l'exemption.
4. Inventorier les artefacts UX v5.3 existants.
5. Creer ou adopter DDS-001, DSG-001, Component Inventory et UI Specifications.
6. Planifier Phase 04A et Gate 04A au prochain changement Frontend significatif.
7. Activer Design Architect pour les User Stories Frontend.
8. Executer CHECK-UX-01 et CHECK-DESIGN-01.
9. Mettre a jour Project State et registre des decisions.

## Regle pour projets en cours

Un Gate deja valide n'est pas rejoue. Les increments Frontend deja livres restent valides. Les nouveaux ecrans, refontes et changements structurants appliquent v5.6.

## Decisions

GO si artefacts et controles sont suffisants ; GO sous reserve uniquement pour ecarts non bloquants dates ; NO GO si un changement Frontend significatif commence sans Gate 04A.
