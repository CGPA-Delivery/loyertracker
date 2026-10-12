# Approbation du Plan d'Exécution — Staging mutualisé Hostinger et onboarding de LoyerTracker (lots L1 à L3)

> **Statut : TEXTE PRÊT — EN ATTENTE DE LA FORMULATION DU CDO.** Ce document **n'approuve rien** tant que le
> CGPA Chief Delivery Officer n'a pas prononcé, dans le chat, la phrase d'approbation du §6. Les « validé »
> et « OK recommandations » donnés sur des PR ou sur la fiche de décision **ne valent pas** approbation du Plan
> d'Exécution. Décision CGPA finale : CDO. Cadre : CGPA v6.1.1 Enterprise.

## 1. Objet

Autoriser l'exécution, **par le CDO**, des lots **L1 à L3** du plan d'onboarding de LoyerTracker sur l'hôte
Staging mutualisé `srv2050514` (Düsseldorf, `187.7.72.186`) : préparation de l'hôte pour le projet, déploiement de
LoyerTracker par digest **à vide**, smoke et preuves `STG-ISOL-01`.

## 2. Périmètre approuvé (si formulé)

| Lot | Contenu | Référence |
|---|---|---|
| L1 | Edge à jour (`transports.yml`), `add-project loyertracker`, `project-prep.sh`, `gen-env.sh`, `docker login` GHCR | `RUNBOOK-L1-L3.md` §L1 |
| L2 | **Non exécuté avant L3** : les artefacts sont déployés depuis `docs/…` (écart assumé, voir plan d'onboarding §10) | Plan d'onboarding §7 |
| L3 | `stg-deploy validate`, `pull`, `up`, contrôles, smoke (cible 63 PASS / 0 FAIL), instantanés `STG-ISOL-01` avant/après | `RUNBOOK-L1-L3.md` §L3 |

**Hors périmètre, soumis à des décisions distinctes** : L4 (Gate Staging), sauvegarde éprouvée, monitoring, bascule
DNS et décommissionnement (L5, M5, M6), tout changement de code applicatif, toute promotion.

## 3. Références

- Plans : `plan-staging-partage-hostinger.md` (parent) et `plan-onboarding-loyertracker-staging-hostinger.md`, tous
  deux « Proposés » avant cette approbation ; runbook `staging-hostinger/loyertracker/RUNBOOK-L1-L3.md`.
- Décisions acceptées le 2026-10-11 : `decisions-staging-hostinger.md` (D1, D4, D6 à D10, D-ONB-2 à 10, D-ONB-1).
- PR fusionnées : #555, #556, #557, #558, #559, #560, #561.

## 4. Conditions préalables (toutes requises au lancement)

1. **Snapshot Hostinger de `srv2050514` de moins de 24 h** (il expire 24 h après sa création ; à renouveler juste
   avant L3), plus le plan de `pg_dump -Fc` hors hôte (D6) pour la suite.
2. **Jeton GHCR en lecture seule** (`read:packages`), propriétaire le CDO, expiration 90 jours, saisi sur l'hôte.
3. **Archive du commit de release** (`d19c4fea…`) avec empreinte vérifiée par `project-prep.sh`.
4. **`EXPECTED_HOSTNAME=srv2050514`** à chaque commande ; profil SSH vérifié sur `187.7.72.186`.
5. **Canaux externes fermés** (K8, ADR-18) ; aucun secret repris d'un autre hôte (`gen-env.sh`).
6. `edge.sh verify` à **8 PASS / 0 FAIL** avant de commencer.

## 5. Limites et critères d'arrêt

- Aucune promotion ; `ai-test-server` et la Production AWS ne sont ni lus ni modifiés ; aucun accès de
  l'assistant aux hôtes (exécution par le CDO, l'assistant corrige les scripts à partir des sorties collées).
- **Arrêt immédiat** si : `hostname` différent de `srv2050514`, empreinte différente, `verify` avec un FAIL,
  `stg-deploy validate` refuse la configuration, un conteneur n'est pas `healthy`, ou un smoke a un FAIL.
  Corrections par le dépôt (branche, commit, PR, `SHA256SUMS` régénéré), jamais à la main sur l'hôte.
- **Contrôles applicables, tous `non exécuté` à ce jour** : STG-ISOL-01 (bloquant), CHECK-CICD-01, CHECK-REL-01,
  CHECK-OPS-01, CHECK-VAL-01. Un contrôle sans preuve n'est jamais `non applicable`.
- Une réserve ne neutralise pas un bloqueur : R-ONB-05 et R-ONB-09 restent bloquants pour L3.
- Les risques R-HOST-02 à 04 (secrets de `srv2011505`) sont traités par `srv2011505/RUNBOOK-ROTATION.md` ; leur
  traitement est **recommandé avant L3**, sans en être une condition technique.

## 6. Phrase d'approbation à prononcer par le CDO

> « **J'approuve le Plan d'Exécution du Staging mutualisé Hostinger et de l'onboarding de LoyerTracker pour les
> lots L1 à L3, aux conditions du document `approbation-plan-execution-staging-hostinger.md`, à la date du
> [date].** »

Toute autre formulation (« OK », « validé », fusion d'une PR) n'établit pas l'approbation. L'approbation peut être
**limitée ou assortie de réserves** : les préciser dans la même phrase.

## 7. Enregistrement (à remplir par l'assistant après la phrase du CDO)

| Champ | Valeur |
|---|---|
| Statut | **EN ATTENTE** |
| Approuvé par | — |
| Date et heure (UTC) | — |
| Périmètre et réserves | — |
| Inscription | `project-state.md` (en tête), `staging-state.md` §12, plans (bandeau « Statut ») — **après approbation seulement** |

Un changement de périmètre (ajout de L4 ou L5, nouvel hôte, nouveau projet) exige une **nouvelle formulation**.
