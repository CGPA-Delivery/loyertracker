# Checklist de migration CGPA v5.0.1

## Objectif

Verifier qu'un projet existant peut etre repris sous CGPA v5.0.1 sans perte d'historique.

## Controles obligatoires

* [ ] `project-state.md` present ;
* [ ] phase connue ;
* [ ] gate connu ;
* [ ] backlog present ;
* [ ] registre des risques present ;
* [ ] decisions presentes ;
* [ ] historique present ;
* [ ] version cible renseignee ;
* [ ] version source renseignee si migration depuis v3.0, v3.0.1, v4.0 ou v5.0 ;
* [ ] aucun gate valide marque a rejouer ;
* [ ] aucune phase validee reinitialisee ;
* [ ] rapports d'execution conserves ;
* [ ] rapports de staging conserves si applicables.

## Resultat

Decision possible :

* `GO` : migration coherente, reprise autorisee ;
* `GO sous reserve` : migration autorisee avec actions correctives tracees ;
* `NO GO` : incoherence bloquante, remediation obligatoire avant reprise.

## Reserves typiques

* version source absente ;
* gate courant incomplet ;
* backlog non localise ;
* registre des risques incomplet ;
* rapport d'execution manquant ;
* etat staging non renseigne alors qu'un sprint valide existe.
