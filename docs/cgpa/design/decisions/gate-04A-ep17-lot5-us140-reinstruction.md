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

## 6. Décision finale PO/CDO — réservée

> **À compléter exclusivement par le Product Owner / CGPA Chief Delivery Officer.**
>
> Décision : `GO` / `GO sous réserve` / `NO GO`
> Périmètre accepté ou refusé :
> Réserves explicitement acceptées :
> Date, identité et signature de validation :
