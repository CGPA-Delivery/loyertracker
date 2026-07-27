# Profil Frontend Angular

Ce profil est obligatoire uniquement lorsqu'Angular est retenu.

## Organisation

* standalone components par defaut pour les nouveaux projets, sauf ADR contraire ;
* features alignees sur les domaines ;
* lazy routes aux frontieres fonctionnelles ;
* core limite aux services singleton et infrastructure ;
* shared UI limite aux elements reutilisables sans logique metier ;
* bibliotheque Design System distincte si plusieurs applications la consomment.

## Etat et donnees

Signals ou etat local pour le scope composant/feature ; solution globale uniquement si le partage et la complexite le justifient. Les choix sont traces par ADR.

## Mapping

Chaque composant DSG reference son composant Angular, ses inputs/outputs, etats, tokens, tests, accessibilite et version.

## Performance

Budgets, lazy loading, trackBy/equivalent, images optimisees, hydratation/SSR si justifie et mesure des parcours critiques.
