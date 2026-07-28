# DELIVERY-PIPELINE-001 - Pipeline Standard

## Objectif

Definir le standard minimal des pipelines CI/CD compatibles CGPA v6.1, independamment de l'outil utilise.

## Neutralite technologique

GitHub Actions, GitLab CI, Azure DevOps, Jenkins, CircleCI ou tout autre outil sont acceptes si les preuves sont auditables.

## Stages minimaux

1. Checkout.
2. Build.
3. Tests unitaires.
4. Tests d'integration critiques selon le risque.
5. Analyse qualite.
6. Scan secrets.
7. Scan dependances ou vulnerabilites selon le risque.
8. Packaging ou image.
9. Publication artefact.
10. Deploiement Dev si CI conforme.
11. Production des preuves exploitables par les Gates.

## Regles

* Le pipeline ne doit pas contenir de secrets en clair.
* Les commandes destructives globales sont interdites.
* Les artefacts doivent etre versionnes.
* Un changement sans impact sur les contextes de construction ne doit pas publier un nouvel
  artefact. La détection de portée doit être déterministe, versionnée et testée.
* Les publications LoyerTracker utilisent exclusivement le tag immutable `sha-<8>` ; l'alias
  mutable `latest` est interdit.
* Les echecs bloquants doivent empecher la promotion.
* Les preuves doivent etre conservees ou referencees.

## Sorties attendues

* rapport CI ;
* artefact ou image ;
* logs exploitables ;
* statut quality gate ;
* decision de promotion possible ou bloquee.
