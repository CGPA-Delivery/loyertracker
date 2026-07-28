# Rapport d'Exécution — quarantaine des alias GHCR `latest`

## 1. Identification

| Champ | Valeur |
|---|---|
| Plan approuvé | `PE-GHCR-LATEST-01` |
| Date d'exécution | 2026-07-28 |
| Branche | `agent/retirement-latest-ghcr` |
| Pull Request Delivery | #287 |
| Stratégie retenue | `QUARANTAINE` |
| Nature | Delivery / DevSecOps, non destructive |
| Mutation GHCR | Aucune |
| Promotion ou déploiement | Aucun |
| Statut | Implémenté localement — revue humaine de la PR requise |

## 2. Décision d'exécution

La documentation officielle GitHub Packages consultée le 2026-07-28 expose des opérations de
lecture, de suppression et de restauration au niveau de la **package version**. Elle ne documente
pas d'opération REST permettant de détacher uniquement un tag d'une version de conteneur.

Chaque version portant `latest` porte aussi le tag historique légitime `sha-19d0d0a4`. Supprimer
la version supprimerait donc une unité historique plus large que l'alias ciblé. Conformément au
Plan, la stratégie retenue est `QUARANTAINE` : aucune requête DELETE, aucune réécriture de tag et
aucun alias de remplacement.

Référence officielle examinée :
`https://docs.github.com/en/rest/packages/packages`.

## 3. État distant relu avant implémentation

Les appels GET GitHub Packages ont confirmé :

| Package | Version | Digest | Tags |
|---|---:|---|---|
| `loyertracker-api` | `1073590800` | `sha256:5dcd38449045a19ff866edd65572ce49773d6e9e57a494bab96e9601fe67e0fd` | `sha-19d0d0a4`, `latest` |
| `loyertracker-web` | `1073591135` | `sha256:87ae45aee77310bc71ee20589564d6e6e759b00a16ca26e259f84b4dcc9997df` | `sha-19d0d0a4`, `latest` |

Les dates `created_at` et `updated_at` restent respectivement
`2026-07-28T08:14:13Z` pour l'API et `2026-07-28T08:14:17Z` pour le Web. Cette lecture ne
démontre pas l'absence de consommateurs externes non inventoriés.

## 4. Contrôles livrés

- politique versionnée avec versions, digests et co-étiquette historique attendus ;
- garde qui exige exactement un `latest` par package, sur l'identité historique exacte ;
- échec sur dérive de digest, version, tags, disparition non instruite ou doublon ;
- scan des chemins applicatifs et Delivery actifs contre toute consommation ou publication
  explicite des deux références `:latest` ;
- workflow Pull Request, `main`, manuel et quotidien en permissions `contents: read` et
  `packages: read` ;
- tests locaux couvrant les scénarios conformes et les dérives ;
- aucun changement de `.github/workflows/ci.yml`, donc aucun impact image selon le classificateur
  actif et aucune reconstruction attendue pour cette PR.

Une disparition de `latest` échoue volontairement tant qu'elle n'est pas instruite : elle peut
signaler une suppression de version historique. Après un futur détachement sélectif prouvé et
autorisé, la politique et la garde devront évoluer dans une PR distincte.

## 5. Applicabilité des contrôles CGPA

- Gate 06A historique : non rejoué ;
- CHECK-CICD-01 : applicable à cette PR Delivery ; preuve distante requise ;
- Gate Staging, Gate 07A, Gate Production et Gate 10 : non applicables sans promotion ;
- STG-ISOL-01 : non déclenché, aucune action sur `ai-test-server` ;
- `RSV-MIG-611-04` : non déclenchée, aucun changement d'architecture logicielle ou de contrat API ;
- `RSV-MIG-611-06` : non déclenchée, aucun changement UX, Design ou Frontend ;
- Financial Governance : non déclenchée, aucune règle monétaire, écriture, solde, devise ou
  logique de ledger modifiée.

Les trois derniers contrôles restent ouverts prospectivement et s'appliquent uniquement au
prochain changement concerné. Aucun Gate historique n'est rejoué.

## 6. Vérifications et preuves attendues

Avant ouverture de la PR :

- `bash infra/ci/test-legacy-latest-guard.sh` ;
- `bash infra/ci/legacy-latest-guard.sh scan` ;
- `bash infra/ci/legacy-latest-guard.sh live` ;
- `bash infra/ci/test-artifact-scope.sh` ;
- `python3 -m unittest discover -s tools/tests -p "test_*.py"` ;
- `python3 tools/cgpa_audit.py` ;
- `git diff --check`.

Sur la PR, CI, CodeQL, audit CGPA et `Quarantaine GHCR latest` doivent être PASS. Le job Docker
doit être SKIPPED puisque le lot ne modifie aucun contexte image. La revue et la décision humaines
finales restent obligatoires avant fusion.

## 7. Résultats locaux

- garde de quarantaine : 7/7 scénarios PASS ;
- lecture GHCR live : API et Web PASS sur les versions, digests et tags attendus ;
- scan des références actives : PASS ;
- classificateur d'impact image : 11/11 PASS et lot attendu sans image ;
- tests de l'auditeur : 9/9 PASS ;
- audit structurel CGPA : 97/97 PASS ;
- syntaxe Bash, syntaxe YAML et git diff --check : PASS.

Actionlint n'est pas installé dans l'environnement local. La preuve du workflow GitHub Actions et CHECK-CICD-01 au jalon PR restent obligatoires.

## 8. Preuves distantes de la PR

Au commit 75f966729dda2d5ebf08cee762bf483967bfdb8a, les contrôles sont conformes : CI 30370787645 PASS, CodeQL 30370788981 PASS, audit CGPA 30370787968 PASS et Registry Policy 30370788321 PASS. La garde Quarantaine GHCR latest a vérifié les deux packages en lecture seule. Build, scan et SBOM Docker ainsi que Publication, signatures et attestations sont SKIPPED. Aucun artefact n'a été reconstruit ou publié.

CHECK-CICD-01 est PASS au jalon Test CI de la PR. La validation humaine finale reste obligatoire avant fusion.

## 9. Validation humaine finale

Le 2026-07-28, après examen de la PR #287 au commit ab9aae33687db62da5086321792ff51d873cffda et de ses contrôles conformes, le validateur humain a déclaré dans la conversation de pilotage : « j'ai approuvé #287 ». Cette déclaration vaut GO humain final pour la PR Delivery #287. Elle autorise une fusion protégée uniquement après maintien des checks requis au vert ; elle n'autorise aucune mutation GHCR, promotion ou mise en Production.

## 10. Risques, réserves et rollback

| Élément | Niveau | Traitement |
|---|---|---|
| suppression de la version co-étiquetée | Bloquant | aucun DELETE ; quarantaine uniquement |
| dérive ou recréation de `latest` | Majeur | contrôle quotidien et à chaque PR/push `main` |
| consommateur externe non versionné | Majeur | réserve maintenue ; validation humaine des responsables attendue |
| panne temporaire API GitHub | Mineur | check échoue sans mutation ; relance après diagnostic |
| contribution IA | Majeur | PR, preuves et validation humaine finale obligatoires |

Responsable de la surveillance : DevSecOps Lead. Réévaluation : au prochain changement de
politique registry ou, au plus tard, le 2026-10-28. Preuve attendue : documentation officielle
ou essai sur cible jetable démontrant le détachement tag-only, et validation écrite des
responsables d'environnements.

Le rollback Git est une PR de `git revert`. La quarantaine n'ayant muté aucun artefact distant,
aucun rollback registry n'est requis. Aucune fusion n'est autorisée avant validation humaine.
