# Gate 07 — Développement

## Conditions d'entrée

- La phase 07 a été exécutée ou auditée.
- Les livrables disponibles sont versionnés et accessibles.
- Les risques, hypothèses et décisions sont listés.
- Le score de maturité est calculé ou explicitement non applicable.
- Le Plan d'Exécution de l'intervention existe et son statut d'approbation est connu.

## Livrables obligatoires

- Livrable de phase complété selon le template CGPA applicable.
- Checklist transverse pertinente renseignée.
- Scorecard ou justification de non-scoring.
- Liste des réserves, risques et actions correctives.
- Décision proposée dans `../templates/go-no-go.md`.
- Plan d'Exécution approuvé.
- Rapport d'exécution si le codage a déjà eu lieu.

## Critères Go

- Livrables complets, cohérents et revus.
- Aucun risque bloquant non traité.
- Score recommandé au niveau Solide ou Excellent, sauf justification documentée.
- Sécurité, architecture, DevSecOps, qualité, documentation et exploitation vérifiées.
- La phase suivante peut commencer sans créer de dette de gouvernance critique.
- Plan d'Exécution produit.
- Plan approuvé explicitement.
- Critères d'acceptation validés.
- Tests définis.
- Risques documentés.

## Critères Go sous réserve

- Livrables exploitables mais incomplets sur des points non bloquants.
- Réserves documentées avec responsable, échéance et impact.
- Risques acceptés explicitement par le rôle redevable.
- Score au niveau Partiel avec trajectoire de correction réaliste.

## Critères No Go

- Livrable obligatoire absent ou incohérent.
- Risque critique non traité: sécurité, conformité, architecture, exploitation, valeur ou budget.
- Décision non traçable ou responsabilité non identifiée.
- Score insuffisant sans plan de correction crédible.
- Passage de phase demandé pour accélérer malgré des critères bloquants.
- Plan d'Exécution absent.
- Plan non approuvé.
- Périmètre flou.
- Fichiers concernés non identifiés.
- Tests absents.
- Risques non évalués.

## CHECK-FIN-01 - Controle avant merge significatif et cloture de sprint

Lorsque le changement manipule des valeurs monetaires, garanties, paiements, factures, loyers, remboursements, penalites, ajustements, soldes, devises ou mouvements financiers :

* `docs/cgpa/finance/CHECK-FIN-01.md` est un livrable obligatoire avant tout merge significatif et avant cloture du sprint ;
* les preuves de tests financiers et la decision PASS, PASS sous reserve ou FAIL sont jointes au rapport d'execution ;
* un FAIL sur l'immutabilite, la coherence du ledger, la tracabilite, la devise ou l'idempotence critique impose NO GO.

## Checklist de validation

- [ ] Livrables obligatoires présents.
- [ ] Critères d'acceptation ou de sortie vérifiables.
- [ ] Risques ouverts qualifiés et priorisés.
- [ ] Réserves datées et responsables si Go sous réserve.
- [ ] Score de maturité calculé.
- [ ] Contrôles sécurité et DevSecOps effectués.
- [ ] Documentation et traçabilité suffisantes.
- [ ] Décision Go / Go sous réserve / No Go consignée.
- [ ] Plan d'Exécution produit et approuvé.
- [ ] Critères d'acceptation validés.
- [ ] Tests prévus ou exécutés documentés.
