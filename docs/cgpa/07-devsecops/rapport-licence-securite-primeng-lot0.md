# Rapport licence et sécurité — dépendance PrimeNG (Lot 0, EP-17)

> Livrable attendu du Lot 0 (`plan-execution-ux-ui-primeng-keycloak.md` §Lot 0 : « Analyse
> licences et sécurité de la dépendance PrimeNG (gouvernance DevSecOps existante) ») et preuve
> attendue de la réserve bloquante unique de `CHECK-DEVSECOPS-01-ep17-lot1-readiness.md` §2
> (écart 1). Produit par Claude Code en tant que **DevSecOps Lead**, sous-agent CGPA désigné le
> 2026-07-31 (`docs/cgpa/agents/agent-designations-loyertracker.md`).

| Champ | Valeur |
|---|---|
| Date de recherche | 2026-07-31 |
| Périmètre | `primeng` (npm), version candidate pour Angular 22.0.8 (`frontend/package.json`) |
| Méthode | Registre npm (`registry.npmjs.org`, source première), tarballs officiels téléchargés et inspectés directement (`LICENSE.md` réel du paquet publié, pas une page web tierce), recherches web complémentaires (GitHub, blog éditeur, communauté) |
| Limite d'indépendance | **Sans objet ici** — contrairement aux avis UX/Design déjà produits, ce rapport porte sur une dépendance tierce que Claude Code n'a pas rédigée ; aucun conflit d'auteur/relecteur |
| Fraîcheur critique | La situation décrite a **moins de 3 semaines** au moment de ce rapport (bascule le 2026-06-28, version compatible Angular 22 publiée le 2026-07-15) — à revérifier avant toute installation effective si un délai s'écoule |

## 1. Constat majeur — PrimeNG n'est plus MIT à partir de la version compatible Angular 22

`ADR-UI-001` et `DDS-LT-001` (2026-07-30) ont raisonné sur PrimeNG comme dépendance **MIT**,
« aucune identité visuelle imposée forte », sans anticiper de coût de licence. **Ce n'est plus
exact pour la version requise.**

* **PrimeTek Informatics** (éditeur de PrimeNG) a **fermé le dépôt GitHub `primefaces/primeng`
  (archivé le 2026-06-28)** et restructuré le produit sous la marque **PrimeUI**, avec un modèle
  de licence Communautaire/Commercial payant.
* **`primeng@22.0.0`** (publié le **2026-07-15**, il y a **16 jours** à la date de ce rapport) est
  la **première et seule version compatible Angular 22** (`peerDependencies` confirmées :
  `@angular/core: ^22.0.0`, `@angular/cdk: ^22.0.0`, etc. — vérifié par lecture directe du
  registre npm). Elle est distribuée sous la nouvelle **PrimeUI License**, pas MIT.
* Vérification directe (téléchargement et extraction du tarball officiel
  `primeng-22.0.0.tgz`, fichier `package/LICENSE.md` réel du paquet, pas une page web pouvant être
  obsolète) :

  > « This package is part of **PrimeUI**, a family of commercial UI libraries by PrimeTek
  > Informatics. […] A valid license key is required to use this software. »

* **Par contraste**, la dernière version `primeng@21.x` (dernière : `21.1.9`) reste **authentiquement
  MIT** (vérifié de la même façon, tarball téléchargé et `LICENSE.md` extrait — licence MIT standard,
  copyright PrimeTek 2016-2026), **mais ne supporte qu'Angular 21** (`peerDependencies` :
  `@angular/core: ^21.0.7`) — **incompatible avec Angular 22.0.8** du projet, sans rétrograder
  Angular lui-même (hors périmètre, non envisagé).

**Conséquence directe** : il n'existe **aucune version de PrimeNG à la fois MIT et compatible
Angular 22** à ce jour. Le choix se limite à (A) la nouvelle licence PrimeUI (gratuite sous
conditions ou payante), ou (B) une alternative technique (cf. §5).

## 2. Détail de la licence PrimeUI applicable

Deux options, au choix selon l'éligibilité de l'organisation (texte extrait du `LICENSE.md` réel
du paquet `primeng@22.0.0`, recoupé avec `https://primeui.dev/licenses/community`) :

### Community License (gratuite)

Éligible si **toutes** les conditions suivantes sont réunies :

* moins de **1 000 000 USD** de revenu annuel brut ;
* moins de **5 développeurs** ;
* moins de **10 employés** ;
* jamais reçu plus de **3 000 000 USD** de financement externe (capital-risque ou autre).

Couvre PrimeNG, PrimeReact, PrimeVue, PrimeIcons et le serveur MCP ; jusqu'à **4 sièges
développeur** ; usage commercial explicitement autorisé (« vous pouvez utiliser le logiciel pour
des projets commerciaux et vendre les applications que vous construisez », y compris des SaaS).
**Renouvellement annuel obligatoire** par confirmation de l'éligibilité continue (période de grâce
de 30 jours après expiration). N'inclut pas les composants PrimeUI Pro, PrimeBlocks, Theme
Designer, ni le support premium.

### Commercial License (payante)

Pour les organisations non éligibles à la Community License. Environ **599 USD par développeur**,
licence perpétuelle avec un an de mises à jour incluses ; renouvellement optionnel pour prolonger
l'accès aux nouvelles versions.

### Mécanisme d'application technique

Le paquet embarque un module de vérification de licence
(`package/types/primeng-license.d.ts`, inspecté directement) : la vérification est **hors ligne,
sans télémétrie, sans connexion réseau** (point positif pour la conformité données/RGPD — aucune
donnée du projet n'est envoyée à PrimeTek). En revanche, **si la clé est absente, invalide ou
expirée, le paquet injecte une bannière visible en bas à droite de la page**, dans un shadow DOM
fermé délibérément conçu pour résister à un masquage trivial par CSS. **C'est un risque
opérationnel de production**, détaillé §4.

## 3. Éligibilité LoyerTracker — à confirmer explicitement par le Product Owner

Les critères techniques disponibles dans ce dépôt sont compatibles avec une éligibilité
**Community License** :

* équipe **dev solo** (1 développeur), très inférieure au seuil de 5 ;
* projet qualifié « MVP en cap vers la production (PME) » (`gate-06A-decision.md`, 2026-06-16) —
  cohérent avec une petite structure.

**Ce que ce rapport ne peut PAS vérifier** : le chiffre d'affaires annuel réel, le nombre
d'employés total (au-delà des développeurs) et le financement externe cumulé de l'organisation
opérant LoyerTracker sont des données financières internes auxquelles Claude Code n'a pas accès et
qu'il ne doit pas présumer. **Confirmation explicite du Product Owner requise** avant de retenir la
voie Community License comme acquise.

## 4. Sécurité (CVE) et maturité

* Aucune CVE directe connue sur `primeng` au moment de ce rapport (recherche croisée Snyk/GitHub) —
  mais l'indexation de sécurité pour `v22.0.0` (16 jours) est **probablement encore incomplète** :
  absence de CVE connue **n'est pas** une preuve d'absence de vulnérabilité pour une version aussi
  récente.
* Le dispositif CI existant (`CHECK-DEVSECOPS-01-ep17-lot1-readiness.md`, Gate 06A PASS sous
  réserve) couvre déjà la surveillance continue : Trivy + OWASP Dependency-Check scannent
  `package-lock.json` à chaque PR, y compris pour toute CVE PrimeNG publiée après ce rapport — filet
  de sécurité déjà actif, indépendant de ce rapport ponctuel.
* **Ce que Trivy/OWASP DC ne couvrent pas** : les termes de licence eux-mêmes (objet de ce
  rapport) et la présence d'un mécanisme de vérification de licence embarqué dans le bundle livré
  au navigateur — à surveiller manuellement en cas de changement de version.

## 5. Alternative technique — fork communautaire `open-prime` (OpenNG)

Une organisation communautaire (« OpenNG ») a créé un fork MIT à partir de `primeng@21.x` (dernière
version MIT), avec pour objectif déclaré de fournir un support Angular 22.

* **Licence** : MIT, avis de copyright d'origine conservés.
* **Statut** : en développement actif vers une **version bêta** avec support Angular 22 — **pas de
  version stable publiée à ce jour** (2026-07-31).
* **Support** : communautaire uniquement (forum/Discord), **aucun SLA, aucun support commercial**.
* **Nom** : encore en cours de stabilisation (`open-prime` provisoire, litige de marque avec
  PrimeTek en cours de résolution côté communauté).

**Évaluation** : option MIT valable **en principe**, mais **non recommandée pour ce projet
aujourd'hui** — aucune version stable, aucun engagement de maintenance à long terme, litige de
marque non résolu. À reconsidérer si `open-prime` atteint une version stable avec un historique de
maintenance avant que le Lot 1 ne soit réellement engagé.

## 6. Impact sur les décisions déjà actées

`DDS-LT-001` (Design Architect, Acceptée le 2026-07-30) et `ADR-UI-001` ont retenu PrimeNG **sans
connaissance de ce changement de licence**, intervenu et documenté publiquement dans les jours
suivants. Ce rapport **ne révise pas** `DDS-LT-001` de sa propre autorité — la décision de socle
reste celle du Design Architect/Product Owner — mais **signale explicitement** que l'hypothèse
« MIT, aucun coût de licence » sur laquelle `DDS-LT-001` §Justification s'appuyait implicitement
n'est plus exacte pour la version effectivement installable. Une révision ou une confirmation
explicite de `DDS-LT-001` à la lumière de ce constat est recommandée avant l'installation
effective (Lot 1), sans que ce rapport ne préjuge de l'issue.

## 7. Avis DevSecOps Lead

**Le rapport attendu par le Lot 0 et par la réserve bloquante de `CHECK-DEVSECOPS-01` est
produit.** Il ne clôt cependant pas cette réserve par un simple « conforme » : il révèle un fait
nouveau et significatif, non un problème de conformité résolu.

**Recommandation** : avant toute installation de PrimeNG (Lot 1), le Product Owner doit trancher
explicitement entre :

1. **Poursuivre avec PrimeNG 22 sous Community License**, sous réserve de confirmer l'éligibilité
   réelle de l'organisation (§3) — voie la moins coûteuse et la plus mature techniquement, mais
   introduit une **nouvelle obligation de gouvernance récurrente** (renouvellement annuel
   d'éligibilité, gestion de la clé de licence comme secret hors code — cohérent avec DSO-03,
   surveillance du risque de bannière de licence invalide en Production si la clé expire).
2. **Payer une Commercial License** (~599 USD/développeur) si l'éligibilité Community n'est pas
   confirmée ou pour éviter la contrainte de renouvellement annuel.
3. **Reconsidérer `DDS-LT-001`** : attendre une version stable d'`open-prime` (MIT), ou rouvrir
   l'évaluation d'une autre bibliothèque (Angular Material, déjà écartée par `DDS-LT-001` pour des
   raisons distinctes de la licence).

**Ce que cet avis ne fait PAS** : il ne choisit pas entre ces trois options — c'est une décision de
gouvernance (coût, risque de marque, dépendance à une bibliothèque non-open-source) qui revient au
Product Owner, pas au DevSecOps Lead ; il ne prononce aucune décision de Gate 06A (celle-ci reste
`gate-06A-decision-ep17-lot1.md` §6, déjà rendue PASS sous réserve) ; il ne lève pas la réserve de
`CHECK-DEVSECOPS-01` unilatéralement — la levée reste conditionnée au choix explicite du Product
Owner parmi les trois options ci-dessus.

## 8. Actions et échéances

| Action | Responsable | Échéance |
|---|---|---|
| Confirmer l'éligibilité réelle Community License (CA, effectifs, financement) | Product Owner | Avant Lot 1 |
| Choisir explicitement parmi les trois options §7 | Product Owner | Avant Lot 1 |
| Si Community/Commercial retenue : définir la gestion de la clé de licence comme secret hors code (cohérent DSO-03, Gitleaks) et un rappel de renouvellement annuel | DevSecOps Lead | Avant installation effective |
| Revoir `DDS-LT-001` à la lumière de ce constat (confirmation ou amendement) | Design Architect + Product Owner | Avant Lot 1 |

## Sources

- [PrimeNG package — npm registry (métadonnées officielles, `registry.npmjs.org`)](https://www.npmjs.com/package/primeng)
- [`LICENSE.md` réel extrait du tarball `primeng-22.0.0.tgz` — source première, téléchargée directement depuis `registry.npmjs.org`]
- [`LICENSE.md` réel extrait du tarball `primeng-21.1.9.tgz` — source première]
- [PrimeUI Community License — termes officiels](https://primeui.dev/licenses/community)
- [PrimeUI — page principale](https://primeui.dev/)
- [Ng-News 26/17: PrimeNG's New Licensing, and A2UI for Angular](https://dev.to/playfulprogramming-angular/ng-news-2617-primengs-new-licensing-and-a2ui-for-angular-4eik)
- [PrimeNG is no longer open source — OpenNG blog](https://www.openng.org/blog/primeng-is-no-longer-open-source)
- [`open-prime` fork (OpenNG) — GitHub](https://github.com/openng-foundation/open-prime)
- [Angular 22 Support · Issue #19608 · primefaces/primeng (dépôt archivé le 2026-06-28)](https://github.com/primefaces/primeng/issues/19608)
- [PrimeNG vulnerabilities — Snyk](https://security.snyk.io/package/npm/primeng)
