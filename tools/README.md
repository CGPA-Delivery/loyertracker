# Tools

Ce dossier contient les scripts et utilitaires de support du CGPA. Aucun code applicatif metier ni secret ne doit y etre stocke.

## Audit structurel v6.1.1

* `cgpa_audit.py` execute les controles deterministes du LOT 8 ;
* `cgpa-audit-config.json` definit les chemins et invariants controles ;
* `tests/test_cgpa_audit.py` couvre les resultats PASS et les principaux echecs.

Execution :

```text
python -m unittest discover -s tools/tests -p "test_*.py"
python tools/cgpa_audit.py
```

Tout outil significatif doit servir la gouvernance, l'audit, la generation documentaire ou la qualite du referentiel. Toute evolution structurante est tracee dans `CHANGELOG.md` et soumise a revue Git.
