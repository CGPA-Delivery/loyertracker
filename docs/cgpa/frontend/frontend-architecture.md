# Frontend Architecture

## Principes

Architecture par domaines fonctionnels, dependances explicites, composants reutilisables, accessibilite native, performance mesurable et alignement DSG.

## Structure

Separer application shell, features, shared UI, services, modeles, state, routing, assets, styles et tests. Eviter les dependances circulaires et les modules partages sans proprietaire.

## Composants

Classer primitives, composants composites, patterns et pages. Documenter API, variantes, etats, accessibilite, responsive, tests et mapping DSG.

## Routing et chargement

Routes par feature, lazy loading proportionne, controle d'acces, gestion des erreurs et budgets de chargement.

## State Management

Choisir et documenter etat local, partage et serveur. Eviter un store global par defaut. Tracer caches, invalidation, erreurs et concurrence.

## CSS et SCSS

Tokens comme source de valeurs ; couches fondations, composants et utilitaires ; isolation des styles ; convention de nommage ; pas de valeur magique sans justification.

## Shared Library

Versionnement, ownership, compatibilite, tests, documentation, deprecation et changelog obligatoires.

## Qualite

Component Testing, Accessibility Testing, Responsive Testing et Visual Regression selon le risque.
