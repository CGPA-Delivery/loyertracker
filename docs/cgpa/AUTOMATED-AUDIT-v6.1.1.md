# Audit automatique du framework CGPA v6.1.1

## 1. Objet

L'auditeur LOT 8 verifie automatiquement la coherence structurelle du repository CGPA. Il applique des controles deterministes deja issus du Validation Framework et ne cree aucun concept, role, Gate ou workflow.

## 2. Autorite

L'auditeur produit uniquement `PASS` ou `FAIL` pour des controles techniques. Il ne produit jamais GO, GO sous reserve ou NO GO, n'autorise aucune promotion et ne remplace ni les avis specialises, ni la decision finale du CGPA Chief Delivery Officer.

## 3. Controles

* existence et casse exacte des chemins actifs requis ;
* absence de collision de chemins selon la casse ;
* presence des marqueurs de version et invariants de gouvernance configures ;
* resolution des liens Markdown relatifs suivis par Git ;
* absence de liens absolus locaux non portables ;
* absence de marqueurs de mojibake dans les documents actifs configures.

La configuration versionnee `tools/cgpa-audit-config.json` rend le perimetre auditable. Toute extension de ce perimetre requiert une revue humaine.

## 4. Execution locale

Prerequis : Python 3.11 ou version ulterieure, sans dependance externe.

```text
python -m unittest discover -s tools/tests -p "test_*.py"
python tools/cgpa_audit.py
python tools/cgpa_audit.py --format json
python tools/cgpa_audit.py --format markdown --output cgpa-audit-report.md
```

Codes de sortie :

* `0` : tous les controles structurels sont PASS ;
* `1` : au moins un controle structurel est FAIL ;
* `2` : erreur d'execution ou de configuration.

## 5. Integration continue

Le workflow `.github/workflows/cgpa-framework-audit.yml` execute les tests et l'audit sur les Pull Requests et sur les branches configurees. Le rapport Markdown est publie comme artefact de CI, y compris lorsque le job echoue.

Le workflow ne modifie aucun fichier du repository et ne cree ni decision, ni tag, ni release.

## 6. Limites

L'auditeur ne peut pas :

* juger la qualite semantique complete d'une preuve ;
* approuver une exemption ou une reserve ;
* calculer automatiquement un DCL ;
* rejouer un Gate historique ;
* valider une Release Candidate, Staging ou Production ;
* remplacer une validation humaine.

Un PASS automatique signifie uniquement que les invariants structurels configures sont satisfaits.

## 7. Maintenance et rollback

Les changements du script, de sa configuration et du workflow suivent une revue Git normale. Le rollback utilise un nouveau commit ou `git revert`, sans reecriture d'historique.
