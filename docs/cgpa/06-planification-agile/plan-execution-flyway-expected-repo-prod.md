# Plan d'Exécution — Scission `FLYWAY_EXPECTED` en `_REPO` / `_PROD` (RSV-STG-N2-01)

| Champ | Valeur |
|---|---|
| Date | 2026-07-29 |
| Statut | **Proposé — approbation humaine requise** |
| Périmètre | Tooling DevSecOps de release (`infra/release/`, `infra/smoke/`, un test backend) — aucun code applicatif métier |
| Déclencheur | Réserve non bloquante `RSV-STG-N2-01`, révélée à l'instruction du Gate Staging Sprint N+2 (`gate-staging-sprint-n2-ep16-decision.md`) |
| Décision de timing | CDO, 2026-07-29 : corriger **maintenant**, en **PR isolée**, distincte de la ré-instruction du Gate Staging — ni bloquante sur elle, ni bloquée par elle |
| Hors périmètre | Déploiement du Lot A, ré-instruction du Gate Staging, décision SMS Twilio, avis Enterprise Architect, toute migration supplémentaire, tout changement fonctionnel |

## Diagnostic factuel

Le verrou d'état de release (R-V54-2) s'appuie sur une variable unique,
`FLYWAY_EXPECTED=29` dans `infra/release/production-state.env`, consommée à **quatre endroits** qui
n'attendent pas la même quantité pendant la fenêtre d'un sprint ajoutant une migration :

| Consommateur | Fichier | Quantité attendue |
|---|---|---|
| Mode `--ci` | `infra/release/check-release-state.sh` (~ligne 64) : compare à `find backend/src/main/resources/db/migration -name 'V*.sql' \| wc -l` | Compte du **dépôt** (29, depuis V29) |
| Mode `--host` | même script (~ligne 167) : compare à `SELECT count(*) FROM flyway_schema_history WHERE success` sur l'hôte réel | Compte réellement appliqué en **Production** (28 tant que le Lot A n'est pas déployé) |
| Smoke | `infra/smoke/smoke-stack.sh` (~lignes 100-106) : lit `FLYWAY_EXPECTED` depuis `.env` | Selon la cible : Staging → dépôt (29) ; hypercare Production → réel (28) |
| Test d'intégration | `SchemaMigrationTest.java` (backend, ~lignes 89-106) : lit `FLYWAY_EXPECTED=` depuis `production-state.env` | Compte du **dépôt** (29) |

Tant que le Lot A n'est pas promu en Production, `--host` et un smoke exécuté contre Production
signalent une « dérive » qui n'en est pas une. `ci.yml` n'invoque le script qu'en mode `--ci`, sans
argument — confirmé par recherche dans `.github/workflows/` — aucun changement de workflow n'est
requis pour ce mode.

Sans danger immédiat au moment de l'instruction du Gate (release `1.14.0` close, aucune activité
Production en cours), mais la fenêtre se referme dès l'exécution du smoke Staging prévue à l'étape
5 du chemin de remédiation du Gate — d'où la décision de corriger maintenant, en parallèle et non en
série de cette ré-instruction.

## Exécution autorisée

1. **Scinder `production-state.env`** : remplacer `FLYWAY_EXPECTED=29` par deux variables :
   - `FLYWAY_EXPECTED_REPO=29` — nombre de fichiers `V*.sql` du commit courant, contrôlé par `--ci`
     et par le test d'intégration ; évolue à chaque migration ajoutée/retirée, sans lien avec l'état
     réel de Production.
   - `FLYWAY_EXPECTED_PROD=28` — nombre de migrations réellement appliquées en Production ; ne
     bouge **qu'à la bascule effective**, selon la RÈGLE déjà documentée dans ce fichier (mise à
     jour dans le même commit que le rapport de déploiement technique).
   Conserver le commentaire explicatif de la limite connue, reformulé pour décrire la solution
   plutôt que le problème.

2. **`check-release-state.sh`** : le mode `--ci` lit et vérifie `FLYWAY_EXPECTED_REPO` ; le mode
   `--host` lit et vérifie `FLYWAY_EXPECTED_PROD`. La boucle de chargement des variables obligatoires
   (ligne ~48) est mise à jour pour exiger les deux nouvelles variables (remplace l'ancienne).

3. **`SchemaMigrationTest.java`** : lit désormais `FLYWAY_EXPECTED_REPO` (sémantique inchangée —
   c'est déjà le compte du dépôt qu'il vérifiait).

4. **`smoke-stack.sh`** : introduire une variable d'environnement explicite `SMOKE_TARGET` (valeurs
   `staging` | `production`, défaut `staging` — cohérent avec l'usage principal documenté en tête de
   script). Sélectionne `FLYWAY_EXPECTED_REPO` en `staging`, `FLYWAY_EXPECTED_PROD` en `production`.
   **Ce point précis (nom de variable, valeurs, défaut) reste à confirmer par le DevSecOps Lead à
   la relecture de ce Plan** — ce n'est qu'une proposition, pas encore une décision actée ; c'est le
   seul des quatre points qui n'est pas un simple renommage mécanique.

5. **Mettre à jour toute mention documentaire** de `FLYWAY_EXPECTED` (le fichier `.env` lui-même,
   `docs/cgpa/07-devsecops/gate-staging-sprint-n2-ep16-decision.md`,
   `docs/cgpa/07-devsecops/gate-staging-sprint-n2-ep16-checklist-reinstruction.md`) pour référencer
   les deux nouvelles variables et marquer `RSV-STG-N2-01` comme traitée par cette PR une fois
   fusionnée.

6. **Tests** : `mvn -B verify` (module concerné par `SchemaMigrationTest`), exécution locale de
   `bash infra/release/check-release-state.sh --ci` (exit 0 attendu). Les modes `--host` et le smoke
   ne sont pas exécutables en local (nécessitent l'hôte Staging/Production) — revue manuelle du
   script uniquement à ce stade ; leur vérification réelle aura lieu lors du prochain smoke Staging
   et de la prochaine bascule Production, hors périmètre de cette PR.

7. Synchroniser la branche avec `main`, committer, pousser, surveiller la CI GitHub Actions jusqu'à
   son état terminal vert (Backend, Sécurité, CodeQL, audit structurel, Registry Policy — Packaging
   Docker inclus si déclenché, sans en dépendre pour ce lot purement tooling).

## Critères de clôture

- Les quatre points de consommation distinguent explicitement dépôt (`_REPO`) et Production
  (`_PROD`) — plus aucune ambiguïté de sémantique sur une variable unique.
- `check-release-state.sh --ci` exit 0 en local et en CI.
- `mvn -B verify` PASS, aucune régression sur les autres contrôles du verrou d'état de release.
- Aucun compteur Flyway codé en dur introduit (contrôle déjà présent dans le script, à revérifier
  après le renommage).
- CI GitHub Actions verte sur la PR.
- `RSV-STG-N2-01` peut être marquée traitée dans le dossier de décision du Gate Staging, sous
  réserve de la validation humaine finale de cette PR.
- Aucun déploiement, aucune promotion, aucun changement fonctionnel ou de migration DB.

## Risques

- **Oubli d'un des quatre points de consommation** → incohérence résiduelle, même classe d'incident
  que celle ayant motivé l'existence même du verrou R-V54-2 (incidents PR #77/#171 déjà cités dans
  le script). Mitigation : grep exhaustif de `FLYWAY_EXPECTED` sur tout le dépôt avant fusion, pas
  seulement les quatre fichiers listés ici.
- **Choix de nom/paramètre pour `smoke-stack.sh` non aligné avec un usage opérationnel existant.**
  Vérifié par recherche sur `docs/cgpa/09-production/` et `docs/cgpa/10-mise-en-production/` :
  toutes les invocations historiques (v1.2.1 → v1.14.0) sélectionnent déjà la cible via
  `COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml` (Production) ou `BASE`/`CACERT`
  (Staging), jamais via une variable dédiée. `SMOKE_TARGET` serait donc une **convention
  nouvelle, additive** aux overrides existants (ne les remplace pas). Point à confirmer par le
  DevSecOps Lead : soit ajouter `SMOKE_TARGET` comme proposé, soit dériver la cible d'un override
  déjà présent (ex. détection de `docker-compose.prod.yml` dans `COMPOSE_FILE`) pour éviter un
  paramètre supplémentaire à retenir.
