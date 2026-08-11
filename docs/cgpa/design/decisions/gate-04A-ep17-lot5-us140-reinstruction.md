# Réinstruction additive — Gate 04A EP-17 Lot 5 / US-140

| Champ | Valeur |
|---|---|
| Projet | LoyerTracker |
| Objet | Mise à jour des preuves postérieures à `GATE-04A-EP17-LOT5-2026-08-10` |
| Date | 2026-08-11 |
| Décision historique préservée | `gate-04A-decision-ep17-lot5.md` — non modifiée |
| Statut de cette réinstruction | **Soumis au PO/CDO** — aucune décision finale automatisée |
| Recommandation consolidée | **NO GO pour clôture complète** ; un **GO sous réserve documentaire** est possible uniquement sur décision humaine explicite |

## 1. Motif et périmètre

La décision historique Lot 5 référencie des contrôles alors non exécutés et `DSG-001` v0.2.0.
Les preuves EP-17/US-136 à US-139 ont depuis été produites et la documentation post-pilote
`DSG-001` v0.3.0 a été fusionnée sur `main` via PR #443. Cette réinstruction est additive : elle
ne rejoue ni ne réécrit la décision historique, et ne prononce aucune clôture de Gate.

## 2. Preuves consolidées

| Contrôle | Preuve | État vérifié | Impact Gate |
|---|---|---|---|
| Documentation post-pilote | `DSG-001.md` v0.3.0, inventaire composants, matrice de traçabilité ; PR #443 fusionnée | PASS documentaire — source, runtime et réserves distingués | Preuve disponible |
| Accessibilité Keycloak — EP-17/US-136 | `check-accessibility-01-ep17-us136.md`, PR #437/#438, artefacts `9064684806`/`9095712663` | 6/6 flux Keycloak PASS | Partiellement levé ; Angular authentifié et matrice manuelle ouverts |
| Responsive — EP-17/US-137 | `check-responsive-01-ep17-us137.md` **non suivi Git** ; preuves croisées US-138 | Dashboard Bailleur et Login Keycloak contrôlés ; périmètre incomplet | Non satisfaisant pour clôture complète |
| Visual Review — EP-17/US-138 | `check-visual-regression-01-ep17-us138.md`, `evidence/ep17-us138/` | Dashboard Bailleur PASS ; Keycloak cohérent avec overflow 10px ; baseline US-127 absente | Sous réserve forte |
| Revue Design | `CHECK-DESIGN-01` Lot 5 | Non instanciée | Bloqueur de clôture |

## 3. Réserves et bloquants maintenus

| ID | Constat | Impact | Statut requis |
|---|---|---|---|
| RES-BUILD-RUNTIME-01 | Routes déclarées dans `app.routes.ts` mais `/gestionnaire`, `/bailleur/profil`, locataires, gestionnaires et détails redirigés vers `/bailleur` dans le build contrôlé | Écrans non validables responsive/visuellement | Ouverte — rebuild/réalignement puis revalidation |
| RES-RESP-PROOF-01 | Checklist et scripts US-137 non suivis Git ; preuve non immutable dans le dépôt | Contrôle responsive non auditable/reproductible | Ouverte — versionner ou produire artefact CI équivalent |
| RES-DATA-01 | Invitation, Notifications et informations financières non rendues/testables sans données | Couverture fonctionnelle et R03 insuffisantes | Ouverte — jeux de données de test |
| RES-VR-04 | Overflow horizontal Keycloak déterministe de 10px à 640px et 390px | Non-conformité à la règle sans scroll horizontal | Ouverte — correction CSS ou acceptation PO explicite |
| RES-A11Y-ANGULAR-01 | Parcours Angular authentifié et matrice clavier/focus/zoom/reflow/reduced-motion non prouvés | Critère a11y Gate 04A incomplet | Ouverte — exécuter les preuves |
| RES-BASELINE-01 | Baseline US-127 avant pilote absente | Comparaison visuelle avant/après complète impossible | Ouverte — baseline ou acceptation PO explicite |
| RES-DESIGN-01 | `CHECK-DESIGN-01` Lot 5 absent | Revue Design Gate 04A non instruite | Ouverte — instancier/revoir ou exemption PO explicite |

## 4. Avis spécialisés indépendants

| Rôle | Avis | Conclusion |
|---|---|---|
| Governance Officer / QA Lead | Accès aux preuves US-136→139 et Gate 04A historique | **NO GO pour clôture complète** ; GO sous réserve seulement si le CDO borne explicitement le périmètre documentaire et accepte les réserves |
| Frontend Architect / Design QA | Contrôle source/runtime, responsive et Visual Review | Risque moyen à élevé pour readiness complète ; **GO sous réserve documentaire possible**, clôture complète déconseillée |

Les avis sont consultatifs ; ils ne remplacent pas l’autorité PO/CDO.

## 5. Recommandation soumise au PO/CDO

1. **Ne pas prononcer la clôture complète US-140 / Gate 04A Lot 5** en l’état.
2. Le cas échéant, décider un **GO sous réserve documentaire** strictement borné, qui :
   - ne déclare aucune réserve ci-dessus levée ;
   - n’autorise aucun déploiement, promotion ni développement applicatif additionnel ;
   - assigne la résolution des réserves à un plan distinct et traçable.
3. Produire une décision finale humaine explicite dans la section suivante.

## 6. Addendum post-US-137 — 2026-08-11

La PR #447 puis la PR documentaire #448 sont fusionnées dans `main` (`e1c72d7`, puis `02efe86`). Les contrôles CI, CodeQL, Registry Policy et CGPA Audit sont verts. `CHECK-RESPONSIVE-01` porte désormais un addendum de clôture technique : preuve authentifiée TLS stricte **20/20 PASS**, seed non sensible **14 PASS / 0 FAIL**, et matrice QA/UX validée par le PO/CDO.

| Réserve de §3 | État après US-137 | Justification |
|---|---|---|
| RES-BUILD-RUNTIME-01 | **Levée pour les routes couvertes** | URL exacte et heading vérifiés dans la preuve runtime authentifiée. |
| RES-RESP-PROOF-01 | **Levée** | Tests/versionnement/artifacts CI durables. |
| RES-DATA-01 | **Levée** | Seed isolé et parcours non vides. |
| RES-A11Y-ANGULAR-01 | **Levée pour le périmètre couvert** | axe, clavier/focus, zoom, reflow et reduced-motion validés. |
| RES-VR-04 | **À instruire séparément** | Réserve de régression visuelle Keycloak, non couverte par cette clôture. |
| RES-BASELINE-01 | **Ouverte** | Baseline US-127 antérieure inexistante ; aucune preuve ne peut être rétrofabriquée. |
| RES-DESIGN-01 | **Ouverte** | `CHECK-DESIGN-01` spécifique Lot 5 reste à produire/valider. |

### Recommandation actualisée

**NO GO pour la clôture complète du Gate 04A global.** La réinstruction est désormais recevable pour une décision humaine de **GO sous réserve** limitée aux preuves US-136/US-137, sous maintien explicite de `RES-VR-04`, `RES-BASELINE-01`, `RES-DESIGN-01` et des dettes design/traçabilité (`DD-EP17-10`, `DD-611-02`, `DD-611-03`). Aucun développement, Staging, Production ou promotion n’est autorisé par cet addendum.

## 7. Décision finale PO/CDO — réservée

> **À compléter exclusivement par le Product Owner / CGPA Chief Delivery Officer.**
>
> Décision : `GO` / `GO sous réserve` / `NO GO`
> Périmètre accepté ou refusé :
> Réserves explicitement acceptées :
> Date, identité et signature de validation :
