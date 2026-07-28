# Plan d'Exécution — CI sélective et artefacts immutables

## 1. Identification

- Projet : LoyerTracker.
- Version : sans changement de version applicative.
- Phase CGPA : Phase 06 — DevSecOps Readiness.
- Étape : remédiation Delivery `RSV-MIG-611-05`.
- Date : 2026-07-27.
- Responsables : DevSecOps Lead, Delivery Architect et Release Manager.
- Statut : **approuvé humainement**.
- Décision : **GO explicite reçu le 2026-07-28 via la conversation de pilotage**, après examen
  humain des PR #278 et #279.

## 2. D'où l'on vient

- La migration CGPA v6.1.1 Enterprise a été fusionnée par la PR #277.
- Le push documentaire du commit `86c65be0015269e52f7462ebd5260b3502cdca58` a déclenché le
  build et la publication des images API et Web.
- Le job Packaging publie aujourd'hui un tag `sha-<8>` et l'alias mutable `latest`.
- Staging et Production consomment déjà exclusivement `LOYERTRACKER_TAG=sha-<8>` ; `latest`
  n'est pas utilisé pour les promotions.
- La réserve `RSV-MIG-611-05` demande une preuve build-once et une supply chain immutable.

## 3. Où l'on est

- État : pipeline fonctionnel et vert, mais publication trop large sur chaque push `main`.
- Gate concerné : Gate 06A et CHECK-CICD-01 pour le changement de capacité CI/CD.
- Blocage connu : aucun pour préparer la modification ; approbation humaine du présent plan
  obligatoire avant tout changement de `.github/workflows/ci.yml` ou script CI.

## 4. Où l'on va

### Objectifs

1. Ne plus reconstruire ni publier d'image lorsqu'un push ne modifie que la documentation ou des
   fichiers sans impact sur les contextes Docker.
2. Publier uniquement les tags immuables `sha-<8>` et supprimer toute création ou mise à jour de
   l'alias mutable `latest`.
3. Conserver les contrôles Backend, Frontend et Sécurité ainsi que les protections de branche.
4. Produire une décision auditable sans promouvoir d'artefact vers Staging ou Production.

### Critères d'acceptation

- un delta limité à `docs/**` classe `images_changed=false` ;
- un delta dans `backend/**`, `frontend/**`, `infra/nginx/nginx.conf`, `.dockerignore` ou le
  workflow de packaging classe `images_changed=true` ;
- le job Packaging Docker est explicitement sauté lorsque `images_changed=false` ;
- aucun `docker tag` ou `docker push` vers `:latest` ne subsiste ;
- un push `main` pertinent publie uniquement `loyertracker-api:sha-<8>` et
  `loyertracker-web:sha-<8>` après les jobs qualité et sécurité ;
- les Compose Staging et Production continuent de refuser un tag absent et documentent
  l'interdiction de `latest` ;
- CHECK-CICD-01 et les contrôles CI de la PR sont PASS avant fusion.

## 5. Périmètre

### Inclus

- détection locale et testable des chemins affectant les images ;
- conditionnement du job Packaging Docker ;
- suppression de la publication de `latest` ;
- tests du détecteur, documentation Delivery et Project State ;
- preuve d'un cas documentaire et d'un cas applicatif dans la PR.

### Exclus

- promotion Staging ou Production ;
- modification des images, du code Java/TypeScript ou des migrations SQL ;
- signature, SBOM, attestation SLSA ou verrou registry complet, qui restent des capacités
  ultérieures de `RSV-MIG-611-05` ;
- modification rétroactive ou suppression des tags GHCR historiques.

## 6. Fichiers concernés

### À créer

- `infra/ci/artifact-scope.sh` : classification déterministe d'une liste de chemins.
- `infra/ci/test-artifact-scope.sh` : tests shell du classificateur.

### À modifier

- `.github/workflows/ci.yml` ;
- `docs/project-state.md` ;
- `docs/cgpa/delivery/DELIVERY-PIPELINE-001.md` ;
- `docs/cgpa/delivery/loyertracker-delivery-strategy.md` ;
- `docs/cgpa/checklists/CHECK-CICD-01.md` si une précision projet est nécessaire.

### À ne pas toucher

- code applicatif Backend/Frontend ;
- migrations Flyway et état de release Production ;
- Docker Compose Staging/Production, déjà stricts sur `LOYERTRACKER_TAG` ;
- Gates et décisions historiques.

## 7. Étapes techniques prévues

1. Ajouter un script shell recevant des chemins sur l'entrée standard et renvoyant un résultat
   booléen GitHub Actions `images_changed`.
2. Couvrir les chemins réellement copiés par les Dockerfiles : `backend/**`, `frontend/**`,
   `infra/nginx/nginx.conf`, `.dockerignore` et `.github/workflows/ci.yml`.
3. Ajouter les cas de tests positifs et négatifs, dont un lot documentaire pur.
4. Ajouter un job initial de détection dans la CI, calculant le delta PR ou push `main`, puis
   appelant le script versionné.
5. Ajouter ce job aux dépendances du Packaging et conditionner le Packaging à
   `images_changed == 'true'`, sans relâcher Backend, Frontend ou Sécurité.
6. Remplacer l'étape « sha + latest » par la publication des seuls tags `sha-<8>`.
7. Mettre à jour la documentation Delivery et le Project State.
8. Exécuter les tests, l'audit CGPA, une revue du diff et CHECK-CICD-01.
9. Ouvrir une PR distincte et attendre validation humaine avant fusion.

## 8. Dépendances

- Techniques : Git, Bash, GitHub Actions et Docker/GHCR.
- Sécurité : actions tierces inchangées et épinglées ; aucun nouveau secret.
- Delivery : noms des checks requis et protection de `main` à vérifier avant fusion.
- Exploitation : aucune dépendance Staging/Production.

## 9. Risques et mesures

| Risque | Impact | Mesure |
| --- | --- | --- |
| faux négatif du classificateur | image non reconstruite après changement pertinent | liste positive issue des `COPY` Docker, tests et fail-safe sur workflow/.dockerignore |
| job requis sauté bloque la fusion | indisponibilité du workflow PR | vérifier le comportement des checks requis sur la PR avant fusion |
| suppression de `latest` casse un consommateur caché | consommation externe échouée | recherche dépôt/Compose et validation humaine ; aucun consommateur connu |
| tag `sha-<8>` déjà présent | écrasement potentiel | ne pas republier un SHA existant sans vérification ; conserver la réserve registry globale |
| changement CI déclenche une dernière publication | image du commit Delivery publiée | attendu pour valider le chemin pertinent ; uniquement tag SHA, jamais promotion |

## 10. Tests prévus

- `bash infra/ci/test-artifact-scope.sh` ;
- cas négatifs : `docs/project-state.md`, `README.md` ;
- cas positifs : Backend, Frontend, Nginx, `.dockerignore`, workflow CI ;
- `git diff --check` ;
- `python3 -m unittest discover -s tools/tests -p 'test_*.py'` ;
- `python3 tools/cgpa_audit.py --root . --config tools/cgpa-audit-config.json --format text` ;
- CI GitHub complète et revue des jobs/skips ;
- inspection de la commande de publication pour confirmer l'absence de `latest`.

## 11. Rollback

Utiliser exclusivement `git revert <commit-de-fusion>` via une PR dédiée. Le revert restaure le
comportement précédent du workflow, mais ne supprime aucun artefact GHCR historique. Aucun
force-push, reset destructif ou suppression de package n'est autorisé.

## 12. Critères de validation

- Plan approuvé explicitement par un humain.
- Tests du classificateur tous PASS.
- CI et CodeQL de la PR PASS, aucun check requis manquant.
- CHECK-CICD-01 PASS ou réserve non bloquante assignée.
- Validation humaine finale avant fusion.

## 13. Décision attendue

- `GO` : implémenter le plan dans une PR Delivery distincte.
- `GO sous réserve` : uniquement pour une réserve non bloquante avec responsable, échéance et
  preuve attendue.
- `NO GO` : ne modifier aucun workflow.

## 14. Action autorisée à ce stade

Le Plan d'Exécution est approuvé. L'implémentation peut commencer sur une branche Delivery dédiée,
avec une Pull Request distincte, CHECK-CICD-01, CI complète et validation humaine finale avant
fusion. Cette décision n'autorise aucune promotion Staging ou Production.

## 15. Validation finale de l'implémentation

La PR #281 porte l'implémentation au commit
`80f0c480f91bf670df04d1a963526ed07c6bac19`. CHECK-CICD-01 au jalon Test CI est PASS ; la CI
`30342050329`, CodeQL `30342050187` et l'audit CGPA `30342050611` sont tous PASS. Le 2026-07-28,
après revue, le validateur humain a déclaré dans la conversation de pilotage : « j ai validé ».
Cette déclaration vaut **GO humain final pour la fusion de la PR #281**, sous réserve que le commit
documentaire enregistrant la décision conserve tous les contrôles requis au vert. Elle n'autorise
aucune promotion Staging ou Production.

## 16. Clôture post-fusion

La PR #281 a été fusionnée par le workflow GitHub protégé le 2026-07-28T08:45:38Z au commit
`05c210d9ffe2fe2e67ea1f0b4f6111026b705180`. Les workflows post-fusion CI `30343697515`, CodeQL
`30343697493` et audit CGPA `30343697448` sont PASS. Le delta contenant le workflow a déclenché le
Packaging attendu ; seules les images `sha-05c210d9` ont été publiées. Digests : API
`sha256:5e92a90c376538054338e70f86da310554891d6e11a246a5aea33c7f8d14f0dd`, Web
`sha256:7a7f8f3b0d24370d48453d78cc2280b6fa1df0f77f9410fa5124d301e62b4a30`. Aucune commande de
publication `latest` n'apparaît dans l'étape GHCR. La PR documentaire additive distincte #282
enregistre cette clôture et doit prouver le cas réel `images_changed=false` avec Packaging sauté.
