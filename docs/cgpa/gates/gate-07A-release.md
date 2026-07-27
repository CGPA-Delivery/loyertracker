# Gate 07A - Release Readiness

## Cadre

Gate actif CGPA v6.1.1. Il applique la Release Candidate governance introduite en CGPA v6.1.

## Objectif

Verifier qu'une Release Candidate est identifiable, versionnee, immutable, documentee, validee en Staging et reversible avant Gate Production.

## Conditions d'entree

* version cible definie selon SemVer, CalVer ou une convention documentee ;
* perimetre de release clarifie ;
* Release Candidate identifiee par version, provenance et identifiant immutable ;
* preuves Staging et rapport QA disponibles ;
* resultats DevSecOps applicables associes au meme artefact ;
* rollback documente ;
* `CHECK-REL-01` executee.

## Criteres GO

* `CHECK-REL-01` est `PASS` ;
* Release Candidate immutable et identique a l'artefact valide en Staging ;
* changelog et release notes disponibles ;
* tests critiques et non-regression QA conformes ;
* decisions et risques a jour ;
* rollback applicatif, donnees et configuration documente ;
* environnement Production et observabilite identifies ;
* Gate Production planifie avant toute mise en Production.

## Criteres GO sous reserve

* `CHECK-REL-01` est `PASS sous reserve` ;
* identite, immutabilite, tests critiques et rollback sont conformes ;
* uniquement des ecarts non bloquants, acceptes, assignes et dates.

## Criteres NO GO

* `CHECK-REL-01` absente ou `FAIL` ;
* version, perimetre, provenance ou identifiant immutable absent ;
* artefact different de celui valide en Staging ;
* tests critiques ou non-regression QA en echec ;
* rollback absent ou non credible ;
* preuves DevSecOps ou Staging absentes ;
* decision non tracable ;
* tentative de Production sans Gate Production.

## Avis et decision

* QA Lead : avis sur les preuves Staging et la non-regression ;
* Delivery Architect : avis sur la provenance et l'immutabilite de la Release Candidate ;
* Release Manager : avis sur la readiness de release et le rollback ;
* CGPA Chief Delivery Officer : decision finale `GO`, `GO sous reserve` ou `NO GO`.

## Sortie attendue

* decision Gate 07A et avis consolides ;
* Release Candidate et identifiant immutable ;
* resultat `CHECK-REL-01` ;
* reserves et actions correctives ;
* mise a jour de `docs/project-state.md`.

Le statut `PRODUCTION_READY` n'est attribue qu'apres validation du Gate Production.
