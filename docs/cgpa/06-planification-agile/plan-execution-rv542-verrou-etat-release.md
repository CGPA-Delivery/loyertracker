# Plan d'Exécution CGPA — R-V54-2 : verrou d'état de release versionné

| Champ | Valeur |
|---|---|
| Statut | **Proposé — GO explicite du PO requis avant tout codage** |
| Origine | Arbitrage PO du 2026-07-27 : « tranche R-V54-2, je prends l'option (a) » |
| Risque traité | **R-V54-2** (§13) — récidive de l'écart de traçabilité des déploiements Production (`1.11.0` puis `1.14.0`) |
| Niveau | 1 (lot restreint, sans impact fonctionnel ni migration SQL) |
| Release cible | À déterminer — aucun déploiement Production requis par ce lot |

## Problème à traiter

Deux fois — `1.11.0` (2026-07-16) et `1.14.0` (2026-07-24) — un déploiement Production réel a eu
lieu sans rapport écrit, et la documentation de gouvernance a continué à décrire un état périmé.
Le second cas a duré **3 jours** et n'a été découvert que fortuitement, lors des contrôles
d'entrée d'un déploiement devenu sans objet. La leçon écrite après `1.11.0` n'a pas suffi : elle
reposait entièrement sur la discipline humaine, sans aucun mécanisme de détection.

Un second problème, indépendant mais de même nature, est récurrent depuis la PR #77 : le
**compteur Flyway attendu est codé en dur à trois endroits** — `infra/smoke/smoke-stack.sh:92`
(deux occurrences sur la même ligne) et
`backend/src/test/java/com/loyertracker/db/SchemaMigrationTest.java:72`. Chaque migration impose
de les réaligner manuellement, et l'oubli a déjà provoqué au moins deux incidents (PR #77, PR #171).

L'option (a) retenue par le PO traite les deux avec un seul mécanisme.

## Principe

Introduire **un fichier d'état de release versionné**, source de vérité unique de ce que la
Production est censée exécuter, et le faire contrôler à trois endroits : la CI, le smoke, et un
contrôle de dérive dédié.

### Livrable 1 — `infra/release/production-state.env`

```
# Source de vérité de l'état Production attendu.
# Toute bascule de tag en Production DOIT être accompagnée de la mise à jour de ce fichier,
# dans le même commit que le rapport de déploiement technique.
RELEASE_VERSION=1.14.0
PRODUCTION_TAG=sha-27dce09d
FLYWAY_EXPECTED=28
PRODUCTION_DEPLOYED_AT=2026-07-27T16:46:00Z
```

### Livrable 2 — `infra/release/check-release-state.sh`

Script unique, deux modes, **strictement en lecture seule** :

- `--ci` (exécutable sans accès à l'hôte) :
  - `FLYWAY_EXPECTED` == nombre de fichiers `V*.sql` dans
    `backend/src/main/resources/db/migration/` ;
  - `RELEASE_VERSION` == version en tête de `CHANGELOG.md` (hors `[Non publié]`) ;
  - format de `PRODUCTION_TAG` conforme à `sha-<8 hex>`.
- `--host` (exécuté sur l'hôte de production, en lecture seule) :
  - `PRODUCTION_TAG` == `LOYERTRACKER_TAG` du `.env` hôte ;
  - `FLYWAY_EXPECTED` == `count(*)` réel dans `flyway_schema_history where success` ;
  - digests des conteneurs `api`/`nginx` cohérents avec le tag déclaré.

Sortie non nulle et message explicite en cas de divergence.

### Livrable 3 — câblages

| Point de contrôle | Modification |
|---|---|
| CI (job Backend) | Nouvelle étape appelant `check-release-state.sh --ci`, **bloquante** |
| `smoke-stack.sh` | Lit `FLYWAY_EXPECTED` depuis le fichier au lieu du littéral `28` ; quand il tourne contre la Production, compare aussi `PRODUCTION_TAG` au `LOYERTRACKER_TAG` de l'hôte |
| `SchemaMigrationTest` | Lit `FLYWAY_EXPECTED` depuis le fichier au lieu du littéral `28` |
| Checklists Gate/Préflight/hypercare | `check-release-state.sh --host` ajouté en tête de contrôle d'entrée |

## Ce que ce mécanisme détecte — et ce qu'il ne détecte pas

**Il détecte** :
- toute migration ajoutée sans réalignement du compteur → **échec CI avant merge** (résout la
  douleur récurrente PR #77/#171) ;
- toute divergence entre l'état Production déclaré et l'état réel → **échec bruyant du smoke** et
  du contrôle de dérive, au premier contrôle suivant ;
- un déploiement effectué sans mise à jour du fichier d'état → même divergence.

**Il ne détecte pas en temps réel.** La CI n'a aucun accès à l'hôte de production (la clé SSH
n'existe que localement) : la dérive n'est donc constatée qu'à la **session de contrôle suivante**,
pas à l'instant de la bascule. C'est une limite assumée de l'option (a). Ce qu'elle change
réellement : la fenêtre d'aveuglement passe de « indéfinie, découverte fortuite » (3 jours pour
`1.14.0`) à « premier contrôle suivant », et surtout l'oubli devient **impossible à ignorer**
puisqu'il fait échouer le smoke au lieu de rester silencieux.

Une détection réellement temps réel supposerait un agent sur l'hôte poussant son état vers le
Pushgateway déjà en place, avec une alerte Alertmanager sur divergence — extension possible plus
tard, hors périmètre de ce lot.

## Critères GO de fin de lot

- `check-release-state.sh --ci` vert en CI, et **rouge prouvé** sur un cas de divergence simulé
  (compteur volontairement désaligné) ;
- `check-release-state.sh --host` exécuté avec succès contre la Production réelle, cohérence
  confirmée avec `1.14.0` / `sha-27dce09d` / Flyway 28 ;
- `mvn verify` vert (`SchemaMigrationTest` lisant désormais le fichier) ;
- smoke rejoué contre Staging, sans régression du compteur ;
- aucune valeur `28` codée en dur restante dans le dépôt pour le compteur Flyway ;
- §13 mis à jour : `R-V54-2` passe de **Ouvert** à **Fermé**, avec le mécanisme comme mitigation.

## Hors périmètre

- Toute modification fonctionnelle, migration SQL ou déploiement Production.
- L'alerte Alertmanager de dérive temps réel (extension future).
- La reprise rétroactive des états de release antérieurs à `1.14.0` dans le fichier.

## Verrou de gouvernance

**Aucun codage n'est autorisé par ce plan.** Conformément à la discipline CGPA du projet (« aucun
code sans Plan d'Exécution approuvé », rappelée par la réserve `R-S04-1`), un **GO explicite du
PO** est requis avant d'écrire la moindre ligne. Ce document ne fait que formaliser l'option (a)
arbitrée le 2026-07-27.
