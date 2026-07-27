# Gate 02A - UX Gate

## Objectif

Valider la comprehension des utilisateurs et des parcours avant de figer le cahier des charges et l'architecture. Le Design implementable est controle separement par Gate 04A.

Verifier que les decisions UX/UI structurantes sont suffisamment stabilisees avant l'architecture detaillee et avant le developpement.

## Position

Phase 02 - Faisabilite -> Gate 02A -> Phase 03 - Cahier des charges.

Le Gate 02A ne remplace pas le Gate Architecture. Il stabilise les besoins UX/UI et les ecrans critiques avant les choix d'architecture detaillee.

## Applicabilite

Le Gate 02A est obligatoire pour tout projet comportant une interface utilisateur.

Les projets backend/API-only peuvent etre exemptes si :

* aucune interface utilisateur n'est livree dans le perimetre ;
* les consommateurs API sont identifies ;
* les contrats d'API ou interfaces techniques sont documentes dans les livrables fonctionnels ou architecture ;
* l'exemption est tracee dans `project-state.md` ;
* le Chief Delivery Officer valide l'exemption.

## Conditions d'entree

* Phase 02 executee ou audit de faisabilite disponible ;
* besoin utilisateur suffisamment identifie ;
* perimetre interface utilisateur clarifie ;
* Product Owner ou responsable metier identifie ;
* UX/UI Design Lead consulte si le projet comporte une interface utilisateur.

## Criteres GO

* personas valides ;
* user journeys valides ;
* parcours critiques identifies ;
* cas nominaux et cas d'erreur documentes ;
* information architecture validee ;
* navigation globale stabilisee ;
* design system valide ;
* responsive strategy definie ;
* accessibilite minimale definie ;
* maquettes des ecrans critiques disponibles ;
* validation Product Owner obtenue.

## Criteres GO sous reserve

* personas et journeys exploitables avec reserves non bloquantes ;
* navigation suffisamment stable pour cadrer l'architecture ;
* design system minimal defini avec actions correctives datees ;
* maquettes des ecrans critiques majoritaires disponibles ;
* accessibilite minimale documentee mais a completer ;
* validation Product Owner obtenue avec reserves tracees.

## Criteres NO GO

* navigation non stabilisee ;
* ecrans critiques non definis ;
* design system absent ;
* UX non validee ;
* Product Owner non identifie ou validation absente ;
* exemption backend/API-only non justifiee ;
* passage vers architecture demande malgre des decisions UX bloquantes.

## Livrables attendus

* `docs/cgpa/phases/phase-02-user-journeys.md` ;
* `docs/cgpa/phases/phase-02-information-architecture.md` ;
* `docs/cgpa/phases/phase-02-design-system.md` ;
* `docs/cgpa/phases/phase-02-ui-mockups.md` ;
* decision GO / GO sous reserve / NO GO ;
* mise a jour de `/docs/project-state.md`.

## Decision

* GO
* GO sous reserve
* NO GO
