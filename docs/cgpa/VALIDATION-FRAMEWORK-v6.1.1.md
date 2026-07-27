# Validation Framework CGPA v6.1.1

## 1. Objet

Ce document consolide les regles de validation deja presentes dans CGPA v6.1. Il ne cree aucun concept, role, Gate ou workflow supplementaire.

Le Validation Framework garantit qu'une evaluation CGPA est applicable, fondee sur des preuves recevables, auditable et conclue par une decision non ambigue.

## 2. Autorite et responsabilites

* l'agent specialise evalue son domaine et produit un avis ;
* le Governance Officer controle la conformite, l'applicabilite et la tracabilite ;
* le Release Manager produit la decision specialisee de promotion lorsque Staging ou Production est concerne ;
* le CGPA Chief Delivery Officer v6.1.1 consolide les avis et porte seul la decision CGPA finale.

Un score, une checklist, un pipeline ou un avis specialise ne remplace jamais la decision du CGPA Chief Delivery Officer.

## 3. Types de validation

| Type | Fonction | Sortie |
| --- | --- | --- |
| Controle | Verifier un critere elementaire | PASS / PASS sous reserve / FAIL / non applicable / non execute |
| Checklist | Agreger des controles d'un domaine | PASS / PASS sous reserve / FAIL |
| Assessment | Evaluer un domaine et sa maturite | score, avis specialise et reserves |
| Gate | Autoriser ou interdire une transition | GO / GO sous reserve / NO GO |
| Validation humaine | Accepter explicitement une decision ou un lot | decision datee et tracee |

Un assessment Production Readiness collecte et analyse les preuves. Il ne constitue pas un Gate Production parallele.

## 4. Applicabilite

Chaque controle est classe :

* **applicable** : le critere doit etre evalue ;
* **non applicable** : l'exemption est justifiee, approuvee et tracee ;
* **non execute** : le controle est applicable mais sa preuve n'est pas encore disponible.

Un controle applicable sans preuve ne peut jamais etre classe non applicable. Un controle bloquant non execute produit FAIL pour la decision concernee.

## 5. Preuve recevable

Une preuve recevable identifie au minimum :

* le controle couvert ;
* la source ou le chemin portable ;
* le projet, l'environnement et le perimetre ;
* la version, le commit, le digest ou l'identifiant immutable lorsque applicable ;
* la date de production ;
* le producteur et le verificateur ;
* le resultat et les limites connues.

La preuve doit etre accessible, lisible, rattachee a l'artefact evalue et suffisamment recente pour la decision. Une affirmation, une valeur inventee ou un lien casse ne constitue pas une preuve.

## 6. Validite et reevaluation

Une validation historique reste conservee et n'est jamais rejouee artificiellement.

Une reevaluation est une nouvelle decision tracee lorsque le contexte a change, notamment :

* nouvel artefact, version, commit ou digest ;
* changement significatif de code, infrastructure, pipeline, secret ou migration ;
* changement d'environnement ou de strategie de promotion ;
* expiration explicite d'une preuve ;
* incident, anomalie critique ou invalidation d'un prerequis.

La reevaluation reference la decision precedente et ne la supprime pas.

## 7. Criticite

| Niveau | Effet |
| --- | --- |
| Bloquant | Echec incompatible avec la transition ou le Gate evalue |
| Majeur | Ecart important, non bloquant seulement si accepte formellement |
| Mineur | Ecart limite pouvant devenir une reserve |
| Observation | Information sans effet immediat sur la decision |

Une exigence normative critique, un prerequis obligatoire, une preuve obligatoire absente ou un controle explicitement bloquant ne peut faire l'objet d'une derogation par simple reserve.

## 8. Resultats et aggregation

| Resultat | Regle |
| --- | --- |
| PASS | Controle applicable satisfait avec preuve recevable |
| PASS sous reserve | Controle satisfait de maniere suffisante avec ecart non bloquant accepte |
| FAIL | Controle non satisfait, preuve obligatoire absente ou bloqueur detecte |
| Non applicable | Exemption justifiee et tracee |
| Non execute | Controle applicable en attente d'execution |

Compatibilite de vocabulaire : `Conforme` equivaut a PASS, `Conforme sous reserve` a PASS sous reserve et `Non conforme` a FAIL. Les documents actifs doivent privilegier le vocabulaire canonique.

Regles d'agregation :

1. tout FAIL bloquant impose FAIL a la checklist et NO GO au Gate concerne ;
2. tout controle bloquant non execute impose NO GO ;
3. sans bloqueur, une reserve ouverte impose au minimum PASS sous reserve et GO sous reserve ;
4. PASS et GO exigent que tous les controles applicables requis soient satisfaits ;
5. les controles futurs d'une checklist multi-etapes sont exclus du jalon courant et restent non executes ;
6. le resultat est toujours rattache a un jalon, un environnement et un artefact identifies.

## 9. Reserves

Chaque reserve contient :

* un identifiant ;
* le constat et son impact ;
* la criticite ;
* le controle et la preuve concernes ;
* l'autorite ayant accepte la reserve ;
* le responsable de remediation ;
* l'echeance ;
* la preuve attendue ;
* le statut ouvert, leve, accepte ou expire.

Une reserve expiree ou sans responsable redevient un ecart non accepte. Une reserve ne peut pas neutraliser un bloqueur.

## 10. Score de maturite

Le score utilise l'echelle historique de 0 a 4 :

| Note | Signification |
| --- | --- |
| 0 | Absent |
| 1 | Evoque, incomplet ou non tracable |
| 2 | Partiel, exploitable avec reserves |
| 3 | Revu, coherent et maitrise |
| 4 | Complet, verifie et demontre |

```text
Score normalise =
  somme des notes des axes applicables
  / (4 x nombre d'axes applicables)
  x 100
```

Les axes non applicables sont exclus du denominateur. Un axe applicable sans preuve recoit 0. Si aucun axe n'est applicable, le score est non calcule et la justification est tracee. Le score mesure une maturite ; il n'autorise aucun Gate et ne compense jamais un FAIL bloquant.

Le score de maturite et le Delivery Capability Level sont deux mesures distinctes. Aucune conversion automatique n'est autorisee.

## 11. Decision

| Decision | Condition minimale |
| --- | --- |
| GO | Aucun bloqueur, controles requis PASS, aucune reserve ouverte |
| GO sous reserve | Aucun bloqueur, uniquement des reserves non bloquantes acceptees, assignees et datees |
| NO GO | Bloqueur, preuve obligatoire absente, controle critique non execute ou reserve invalide |

La decision trace :

* l'identifiant et le Gate ou jalon ;
* le perimetre, l'environnement et l'artefact ;
* les preuves et resultats ;
* les avis specialises ;
* les reserves et bloqueurs ;
* le CGPA Chief Delivery Officer responsable ;
* la date, la validite et les conditions d'invalidation ;
* la prochaine action autorisee.

## 12. Historique et Project State

Toute decision significative met a jour `/docs/project-state.md` sans supprimer :

* les decisions et Gates historiques ;
* les preuves et artefacts precedents ;
* les risques et reserves ;
* les avis des agents ;
* les etapes realisees.

La checklist `checklists/CHECK-VAL-01.md` verifie l'application du present framework.
