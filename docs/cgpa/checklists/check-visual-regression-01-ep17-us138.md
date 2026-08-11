# CHECK-VISUAL-REGRESSION-01 — EP-17 Lot 5 (US-138)

| Champ | Valeur |
|---|---|
| Périmètre | Écrans pilotés Lots 1-4 (4 écrans Angular + thème Keycloak login) |
| Date | 2026-08-11 |
| Type | Contrôle de régression visuelle — baseline post-pilote de fait |
| Référence | `CHECK-VISUAL-REGRESSION-01.md`, `gate-04A-decision-ep17-lot5.md` |
| Verdict | **GO sous réserve** — baseline post-pilote capturée, comparaison avant/après impossible (US-127 non exécutée) |

## Contexte

US-138 exige une comparaison avant/après pilote. La baseline avant (US-127) n'a jamais été produite
(statut documenté : « Partielle, baseline globale encore incomplète »). Ce contrôle capture donc
l'état visuel actuel comme **baseline post-pilote de fait**, documente l'absence de baseline US-127
comme réserve, et atteste qu'aucune dérive visuelle n'est détectable entre les écrans (tous issus
du même build).

## Écrans sous revue

| # | Écran | Route | Lot | Source |
|---|-------|-------|-----|--------|
| 1 | Dashboard Bailleur | `/bailleur` | 3 | US-133 |
| 2 | Dashboard Gestionnaire | `/gestionnaire` | 3 | US-133 |
| 3 | Profil Bailleur | `/bailleur/profil` | 3 | US-133 |
| 4 | Keycloak Login | `/auth/realms/loyertracker/...` | 4 | US-135 |

## Critères de test

| # | Critère | Source | Méthode |
|---|--------|--------|---------|
| V01 | Cohérence visuelle entre écrans (même thème, mêmes tokens) | DSG-001 | Inspection visuelle |
| V02 | Pas de régression visible vs. état documenté (maquettes Lot 3/Lot 4) | Gate 04A Lot 3/Lot 4 | Comparaison manuelle |
| V03 | Thème Keycloak aligné visuellement avec l'Angular (couleurs, typographie) | US-135 | Inspection visuelle |
| V04 | Captures aux viewports 640px et 390px | DSG-001 §Responsive | Capture navigateur |
| V05 | Aucun élément cassé, chevauché ou mal rendu | Gate 04A | Inspection visuelle |

## Résultats par écran

| # | Écran | 640px | 390px | V01 (cohérence) | V02 (régression) | V03 (Keycloak) | V05 (rendu) | Verdict |
|---|-------|:-----:|:-----:|:---:|:---:|:---:|:---:|:---:|
| 1 | Dashboard Bailleur | ✅ | ✅ | ✅ | ⬜ Baseline absente | N/A | ✅ | **PASS** |
| 2 | Dashboard Gestionnaire | ⬜ | ⬜ | ⬜ | ⬜ | N/A | ⬜ | **INACCESSIBLE** — `/gestionnaire` redirige vers `/bailleur` |
| 3 | Profil Bailleur | ⬜ | ⬜ | ⬜ | ⬜ | N/A | ⬜ | **INACCESSIBLE** — `/bailleur/profil` redirige vers `/bailleur` |
| 4 | Keycloak Login | ⚠️ +10px | ⚠️ +10px | ✅ | ⬜ Baseline absente | ✅ | ⚠️ overflow horizontal | **PASS sous réserve** |

## Preuves produites

Captures Playwright déterministes (Chromium headless, `ignoreHTTPSErrors: true`) sous
`docs/cgpa/evidence/ep17-us138/` :

- `dashboard-bailleur-640.png`, `dashboard-bailleur-390.png` — rendu réel PASS, `overflowX=0`, aucune image cassée ;
- `keycloak-login-640.png`, `keycloak-login-390.png` — rendu cohérent mais `overflowX=10` ;
- `dashboard-gestionnaire-{640,390}.png` et `profil-bailleur-{640,390}.png` — preuve de redirection vers le dashboard Bailleur ; ils ne constituent pas une capture valide de ces écrans.

## Réserves

| ID | Description | Statut |
|----|-------------|--------|
| RES-VR-01 | US-127 (baseline avant pilote) non exécutée — comparaison avant/après impossible. Baseline post-pilote capturée comme référence. | **Ouverte** — nécessite US-127 |
| RES-VR-02 | 6 écrans inaccessibles (même bug build que US-137) — périmètre de revue réduit à 4 écrans. | **Ouverte** — dépend de RES-01 (US-137) |
| RES-VR-03 | Comparaison automatisée (pixel-diff) non réalisée — inspection visuelle manuelle uniquement. | **Acceptée** — Should, outillage non disponible |
| RES-VR-04 | Le thème Keycloak présente un débordement horizontal déterministe de **10px** aux viewports 640px et 390px. | **Ouverte** — correction CSS dédiée ou acceptation PO avant clôture complète |
