# Plan d'Exécution — retrait gouverné des alias GHCR `latest`

## 1. Identification et statut

| Champ | Valeur |
|---|---|
| Référence | `PE-GHCR-LATEST-01` |
| Version | 1.0 |
| Date de proposition | 2026-07-28 |
| Nature | DevSecOps / Enterprise Delivery Governance |
| Branche de planification | `agent/plan-retirement-latest-ghcr` |
| Statut | **PROPOSÉ — APPROBATION HUMAINE REQUISE** |
| Autorité finale | CGPA Chief Delivery Officer v6.1.1 |
| Responsables pressentis | DevSecOps Lead, Delivery Architect, Release Manager |

Ce document est un Plan d'Exécution. Il n'autorise ni modification du pipeline, ni mutation ou
suppression dans GHCR, ni promotion Staging ou Production. L'implémentation exige une approbation
humaine explicite du Plan, une branche et une Pull Request Delivery distinctes. Toute opération
destructive distante exige en plus une décision humaine explicite sur les identifiants GHCR
résolus immédiatement avant l'action.

## 2. Contexte historique préservé

Les PR #281 et #282 ont déjà supprimé la publication de `latest` et prouvé qu'un changement
documentaire ne construit ni ne publie d'image. Les PR #284 et #285 ont ensuite livré et clôturé
les capacités supply-chain résiduelles : build-once, scans, SBOM, publication sans écrasement,
digests, signatures et attestations. Ces décisions et preuves ne sont pas rejouées.

La stratégie active interdit `latest`. Les promotions Staging et Production utilisent les
références digest exactes du manifeste de release. Le présent Plan ne crée donc pas une nouvelle
politique de publication ; il traite seulement les deux alias historiques encore présents dans
GHCR.

## 3. Audit initial en lecture seule

### 3.1 Dépôt et environnements déclarés

L'inventaire du dépôt au 2026-07-28 constate :

- aucune publication active de `ghcr.io/jptshilombo/loyertracker-{api,web}:latest` dans les
  workflows ;
- aucun Compose Staging ou Production ne consomme un tag : les variables obligatoires
  `API_IMAGE_REF` et `WEB_IMAGE_REF` attendent des références digest ;
- `infra/ci/supply-chain.sh` n'accepte que `sha-<8>` et son test refuse explicitement `latest` ;
- le verrou d'état de release refuse `PRODUCTION_TAG=latest` ;
- les occurrences `ubuntu-latest` désignent l'image de runner GitHub et ne sont pas l'alias
  applicatif GHCR ;
- les références historiques à d'anciennes publications `latest` et les exemples d'outils tiers
  restent des preuves légitimes et ne seront pas réécrits.

Cet inventaire ne prouve pas l'absence de consommateurs externes non versionnés dans le dépôt.
Leur recherche et la validation par les responsables d'environnements restent obligatoires avant
toute mutation distante.

### 3.2 État GHCR observé

L'API GitHub Packages, interrogée en lecture seule, expose exactement une version portant
`latest` dans chaque package :

| Package | Version GHCR | Digest observé | Tags portés | Création / dernière mise à jour |
|---|---:|---|---|---|
| `loyertracker-api` | `1073590800` | `sha256:5dcd38449045a19ff866edd65572ce49773d6e9e57a494bab96e9601fe67e0fd` | `sha-19d0d0a4`, `latest` | 2026-07-28T08:14:13Z |
| `loyertracker-web` | `1073591135` | `sha256:87ae45aee77310bc71ee20589564d6e6e759b00a16ca26e259f84b4dcc9997df` | `sha-19d0d0a4`, `latest` | 2026-07-28T08:14:17Z |

Chaque alias `latest` partage donc sa version avec le tag historique légitime
`sha-19d0d0a4`. Une suppression de version via l'API GitHub Packages risquerait de supprimer
simultanément le tag SHA et son manifeste. Elle est **interdite** tant qu'une capacité prouvée de
détachement du seul alias n'est pas disponible.

## 4. Objectif

Retirer l'autorité opérationnelle des alias historiques `latest`, empêcher toute réapparition ou
dérive et, seulement si GHCR permet de détacher le seul alias sans supprimer la version ni le tag
SHA historique, supprimer ces alias de manière auditée et réversible.

Le résultat acceptable est l'un des deux états suivants :

1. **retrait physique sûr** : seul `latest` est détaché, tandis que le manifeste, le digest et
   `sha-19d0d0a4` sont conservés ; ou
2. **quarantaine gouvernée** : si le retrait sélectif n'est pas prouvable, `latest` reste figé sur
   son digest historique, explicitement non promouvable, surveillé et sans possibilité de mise à
   jour par le pipeline.

Le remplacement de `latest` par un digest ou une release plus récente n'est pas retenu : cela
muterait volontairement un alias interdit et recréerait une autorité concurrente aux digests.

## 5. Décisions d'architecture proposées

1. Les digests du manifeste de release restent l'unique identité de promotion.
2. Aucun workflow ne doit créer, déplacer ou mettre à jour `latest`.
3. La suppression d'une version GHCR co-étiquetée est bloquante et interdite.
4. La stratégie préférée est le détachement du seul alias, uniquement après preuve technique sur
   une cible non historique ou documentation officielle vérifiée.
5. À défaut, la quarantaine est la disposition sûre : conservation historique, garde de dérive
   en lecture seule et déclaration explicite de non-promouvabilité.
6. Aucun alias de remplacement (`stable`, `current`, `production` ou équivalent) n'est créé.
7. Les références historiques légitimes ne sont ni corrigées rétroactivement ni supprimées.

## 6. Périmètre

### Inclus

- inventaire des consommateurs versionnés et validation des consommateurs externes connus ;
- résolution à nouveau des deux versions, tags et digests GHCR avant décision ;
- étude et preuve de la granularité réelle des opérations GHCR disponibles ;
- garde automatisée en lecture seule contre la réapparition ou la dérive de `latest` ;
- retrait sélectif des alias uniquement si la conservation des versions historiques est prouvée ;
- sinon, mise en quarantaine documentée des alias ;
- rapport d'exécution, CHECK-CICD-01 selon applicabilité et Project State additif.

### Exclus

- suppression d'un package, d'une version, d'un manifeste, d'un digest ou d'un tag `sha-<8>` ;
- publication ou reconstruction d'une image ;
- création d'un nouvel alias flottant ;
- modification du code métier, du modèle financier ou des migrations SQL ;
- promotion ou déploiement Dev, Staging ou Production ;
- réécriture des documents et releases historiques ;
- relèvement automatique du DCL.

## 7. Fichiers pressentis pour l'implémentation

La PR Delivery distincte pourra créer ou modifier, selon la stratégie validée :

- un script de contrôle ciblé sous `infra/ci/` et ses tests ;
- `.github/workflows/ci.yml` ou un workflow dédié à permissions minimales si un contrôle distant
  périodique est retenu ;
- `docs/cgpa/delivery/loyertracker-delivery-strategy.md` ;
- un rapport d'exécution sous `docs/cgpa/07-devsecops/` ;
- `docs/project-state.md`.

Les Compose, le code applicatif et les documents historiques ne sont pas modifiés sans écart
nouveau démontré.

## 8. Séquence d'exécution proposée

1. Créer une nouvelle branche Delivery depuis un `main` vert, après approbation du Plan.
2. Réexécuter l'inventaire du dépôt et résoudre les versions GHCR exactes par des appels GET.
3. Recueillir la validation écrite des responsables Dev, Staging et Production indiquant
   qu'aucun consommateur externe connu ne dépend de `latest`.
4. Vérifier les journaux et configurations disponibles sans se substituer à une preuve absente.
5. Tester la granularité d'une opération de détachement sur une cible jetable ou s'appuyer sur une
   documentation officielle non ambiguë ; ne jamais tester sur les versions historiques.
6. Produire une décision d'exécution : `RETRAIT_SÉLECTIF` ou `QUARANTAINE`.
7. Ajouter une garde testable qui échoue si le pipeline publie `latest`, si l'alias dérive de son
   digest historique ou si un contrat actif tente de le consommer.
8. Pour `RETRAIT_SÉLECTIF`, résoudre une dernière fois les identifiants et demander un GO humain
   explicite pour le détachement exact de `latest` sur les deux packages.
9. Exécuter au maximum les deux détachements ciblés ; arrêter immédiatement au premier résultat
   inattendu.
10. Vérifier après action la présence des deux versions historiques, des tags `sha-19d0d0a4` et
    de leurs digests. Pour `QUARANTAINE`, vérifier au contraire que les alias restent inchangés.
11. Exécuter les tests, l'audit CGPA, CHECK-CICD-01 et ouvrir une PR Delivery pour revue humaine.
12. Enregistrer preuves, décision, réserves et résultat dans le Project State.

## 9. Contrôles et critères d'acceptation

### Communs aux deux stratégies

- inventaire du dépôt reproductible et absence de consommateur actif versionné ;
- validation humaine des consommateurs externes connus ;
- digests et versions GHCR résolus immédiatement avant et après l'action ;
- aucune publication, reconstruction ou promotion ;
- aucune référence historique supprimée ;
- garde automatisée et tests PASS ;
- CI, CodeQL, audit CGPA et `git diff --check` PASS ;
- validation humaine finale de la PR Delivery.

### Retrait sélectif

- capacité de détacher un tag sans supprimer la version démontrée avant l'action ;
- GO destructif explicite portant les packages et versions exacts ;
- `latest` absent des deux packages après action ;
- `sha-19d0d0a4` et les deux digests historiques toujours présents ;
- journal de l'opération conservé sans token ni secret.

### Quarantaine

- impossibilité ou risque du retrait sélectif documenté ;
- `latest` toujours associé uniquement aux deux digests inventoriés ;
- garde de dérive bloquante et responsable de surveillance identifié ;
- date de réévaluation et preuve attendue inscrites comme réserve non bloquante.

Tout écart touchant un tag SHA, un manifeste historique ou un digest impose l'arrêt, un
`NO GO` et l'instruction du rollback.

## 10. Risques et mesures

| Risque | Niveau | Mesure |
|---|---|---|
| suppression de la version co-étiquetée | Bloquant | interdire DELETE version ; exiger preuve de détachement du seul alias |
| consommateur externe caché | Majeur | validations responsables et période de quarantaine avant retrait |
| déplacement involontaire de `latest` | Majeur | aucun remplacement ; garde sur digest historique |
| perte de preuve historique | Bloquant | vérifier version, SHA et digest avant/après ; arrêt immédiat |
| token ou permissions trop larges | Majeur | job isolé, permissions minimales, aucune valeur sensible dans les logs |
| restauration recréant un alias mutable | Majeur | restauration uniquement sur décision d'incident et digest historique enregistré |
| confusion avec `ubuntu-latest` ou outils tiers | Mineur | limiter la garde aux deux références applicatives GHCR |
| contribution IA non relue | Majeur | traçabilité et validation humaine obligatoires |

## 11. Rollback non destructif

Les changements Git sont annulés uniquement par une PR de `git revert`. La quarantaine ne mute
pas GHCR et ne nécessite aucun rollback registry.

Si un détachement sélectif autorisé provoque une rupture prouvée, la restauration consiste à
réattacher temporairement `latest` au **digest historique enregistré**, jamais à une nouvelle
image, après décision humaine d'incident. Cette restauration est tracée, bornée dans le temps et
suivie d'une nouvelle instruction de retrait. Aucun package, version, manifeste ou tag SHA n'est
supprimé pendant le rollback.

## 12. Gates, DCL et gouvernances spécialisées

- Gate 06A historique : non rejoué ; CHECK-CICD-01 est appliqué au changement Delivery futur.
- Gate Staging, Gate 07A, Gate Production et Gate 10 : non applicables sans promotion.
- UX/Design/Frontend : non applicable, aucun changement d'interface.
- Financial Governance : non applicable, aucun changement monétaire ou de ledger.
- Staging Isolation : aucune action sur `ai-test-server` ; STG-ISOL-01 reste applicable à une
  promotion future.
- DCL actuel : non déclaré ; DCL cible DCL 4 inchangé.

## 13. Livrables attendus

- inventaire des consommateurs et validation des responsables d'environnements ;
- preuve de granularité GHCR et décision `RETRAIT_SÉLECTIF` ou `QUARANTAINE` ;
- garde automatisée et tests ;
- rapport d'exécution avec état avant/après ;
- CHECK-CICD-01 au jalon applicable ;
- Project State additif ;
- décision humaine finale avant fusion et, séparément, avant toute mutation GHCR destructive.

## 14. Conditions d'approbation et action autorisée

Décisions possibles sur ce Plan :

- `GO` : autoriser l'implémentation sur une nouvelle branche et une nouvelle PR Delivery ;
- `GO sous réserve` : uniquement avec une réserve non bloquante assignée, datée et assortie d'une
  preuve attendue ;
- `NO GO` : aucune implémentation ni mutation GHCR.

À ce stade, seule la revue humaine du Plan est autorisée. Même après approbation, le Plan
n'autorise pas à lui seul la suppression distante : le GO destructif ciblé prévu à l'étape 8 reste
obligatoire si la stratégie `RETRAIT_SÉLECTIF` devient techniquement admissible.
