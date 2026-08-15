# EP20-US06 — preuve locale responsive du dialogue de retenue

- **Date UTC :** 2026-08-15
- **Branche :** `feat/ep20-us06-garantie-responsive-proof`
- **Environnement :** stack Docker locale `https://localhost`
- **Nature :** preuve candidate à revue et CI ; aucune clôture, promotion ou autorisation de déploiement
- **Contribution IA :** implémentation et exécution par Hermes Agent, soumises à revue humaine et aux mêmes Gates CGPA

## Portée vérifiée

Le scénario authentifié sélectionne exclusivement le bien produit par le seed courant via `RESPONSIVE_SEED_RUN_ID`, ouvre une garantie créée par le contrat métier `POST /api/biens/{bienId}/baux/{bailId}/garanties`, choisit une échéance impayée et saisit une retenue partielle de `1`.

Aux viewports `360`, `390`, `640` et `1024 px`, il vérifie :

- ouverture réelle de l’`alertdialog` nommé « Confirmer la retenue » ;
- projection `PARTIEL` et avertissement ADR-15 sans quittance certifiée ;
- focus initial sur **Annuler** ;
- confinement `Tab` / `Shift+Tab` entre les deux actions ;
- `Escape` fermant sans `POST .../retenue-loyer` ;
- restitution du focus au déclencheur ;
- zéro appel de retenue avant confirmation ;
- absence d’overflow horizontal ;
- boutons d’au moins `44 × 44 px` ;
- absence de violation Axe `serious` ou `critical` ;
- captures générées sous `frontend/test-results/responsive/dialogue-retenue-garantie-{viewport}.png` (répertoire gitignored).

## Cycle RED → GREEN observé

1. sélection non déterministe d’un ancien bien synthétique : scénario borné au `RESPONSIVE_SEED_RUN_ID` courant ;
2. focus initial absent dans le navigateur réel aux quatre viewports : focus différé après rendu DOM ;
3. `Tab` quittait le dernier bouton : confinement symétrique `Tab` / `Shift+Tab` ;
4. overflow global aux quatre viewports dans les formulaires Garanties : champs flexibles, wrappables et bornés ;
5. résidu `2 px` à `640 px` sur la carte Garantie : carte bornée en `border-box` ;
6. résidu `22 px` à `360 px` : diagnostic des ancêtres DOM identifiant `app-honoraires-bien`, puis track Grid `minmax(0, 1fr)` et lignes/actions wrappables.

Aucun contournement de l’intercepteur HTTP, OIDC, ReBAC, RLS, Audit ou ADR-15 n’a été introduit. Le scénario annule systématiquement et ne modifie aucune écriture financière.

## Données locales contrôlées

Commande :

```bash
./infra/test-data/seed-a11y-responsive-data.sh
```

Résultat : **15 PASS / 0 FAIL**. Le seed utilise les API métier ; `directAccessGrantsEnabled` est temporairement activé puis restauré à **false** par trap de sortie. Aucun SQL direct, secret versionné, fournisseur externe, Staging ou Production.

## Preuves GREEN finales

```bash
CHROME_BIN=/usr/bin/google-chrome npm test -- --watch=false --browsers=ChromeHeadless
npm run lint
npm run build
npm run responsive:e2e
```

| Contrôle | Résultat |
|---|---:|
| Suite Angular | **241/241 SUCCESS** |
| Lint Angular | **SUCCESS** |
| Build production | **SUCCESS** |
| Dialogue ciblé | **4/4 PASS** |
| Matrice responsive authentifiée complète | **24/24 PASS** |
| Nginx local | **healthy** |

La matrice complète couvre six parcours à chacun des quatre viewports : dashboard Bailleur, profil Bailleur, locataires, gestionnaires, dashboard Gestionnaire et dialogue de retenue de garantie.

## Gouvernance

- preuve locale uniquement ;
- aucune donnée Production/Staging ;
- aucun déploiement ;
- aucun nettoyage du conteneur orphelin `loyertracker-smtp-relay-1` ;
- commit, PR, CI et fusion humaine restent requis avant toute déclaration de clôture EP20-US06.
