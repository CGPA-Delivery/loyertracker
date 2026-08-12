# Registre Bugs, défauts, réserves et dérives — proposition

**Date d’audit :** 2026-08-09  
**Cadre :** CGPA v6.1.1  
**Release protégée :** `v1.17.0-rc.1` sous hypercare  
**Statut :** **VALIDÉ PO/CDO — Jordan Tshilombo, 2026-08-09**

## 1. Règles de lecture

Ce registre sépare les bugs produits des réserves, dettes, observations et dérives documentaires. Les éléments issus de l’audit restent des **candidats à qualifier bug par bug** ; l’approbation du registre ne transforme pas automatiquement chaque candidat en bug accepté. L’absence d’issue GitHub ne vaut pas absence de défaut : le projet trace historiquement les écarts dans les documents CGPA, Gates, PR et rapports d’environnement.

Criticité CGPA : `Bloquant`, `Majeur`, `Mineur`, `Observation`. Priorité proposée : `P0`, `P1`, `P2`.

## 2. Candidats ouverts ou actifs

| ID | Type | Périmètre | Constat et preuve | Criticité / priorité proposée | Statut de preuve | Décision attendue |
|---|---|---|---|---|---|---|
| `BUG-CAND-001` / `DD-EP17-14` | Bug sécurité / produit | EP-17 Keycloak | Mot de passe oublié : soumission réelle documentée en HTTP 500 avec SMTP absent ; risque d’énumération de comptes documenté dans `docs/cgpa/design/design-debt-register-loyertracker.md:27` et `docs/cgpa/06-planification-agile/security-tests-lot5-ep17-keycloak-theme.md:43-50`, défaut préexistant confirmé dans `docs/prod-state.md:34-35`. | Majeur / P0 à confirmer | Preuve documentaire + environnement | Décider si P0 bloquant ; cadrer SMTP réel, test d’envoi et réponse uniforme pour comptes existants/inexistants. |
| `BUG-CAND-002` / `DD-EP17-12` | Bug fonctionnel | EP-17 / invitation | Défaut historique résolu : PR #462 (`2b2b82c`) livre la route Angular `/invitations/:token` et le parcours d’acceptation ; smoke Staging réel 63/0 et recette humaine PO/CDO PASS (PR #464). | Majeur / P1 | Preuves CI + Staging + recette humaine | **CLOSE** — décision `cloture-dd-ep17-02-dd-ep17-12-lot2-2026-08-12.md`, bornée à Staging. |
| `BUG-CAND-003` / `RSV-EP18-03` | Réserve RGPD | EP-18 notifications | `ADR-19-notifications-email-resend.md:257` indique que `RgpdService` ne couvre pas les tables `notification_*`. | Majeur / P1 à confirmer | Preuve documentaire, couverture code à compléter | Décider l’extension RGPD et son Gate cible. |
| `BUG-CAND-004` / `DD-EP15-04` | Dette métier | EP-15 biens | `BienService.java:91-97` archive directement ; `PatrimoineService.java:61-64` applique une garde pour affectation active. Le comportement métier de Bien doit être tranché. | Majeur / P1 | Preuve code + ADR-16:254 | Décider règle métier et test d’intégrité avant nouveau périmètre concerné. |
| `BUG-CAND-005` | Sécurité dépendances | Développement | 5 alertes Dependabot ouvertes : `js-yaml` high, `postcss` medium, `hono` medium/low ; périmètre déclaré development. PR #395/#396/#397 signalées. | Majeur à mineur / P2, P1 si exposition runtime confirmée | Preuve GitHub à revalider | Vérifier `npm audit --omit=dev`, reachability et plan de mise à jour après hypercare. |
| `DOC-CAND-001` | Dérive release | Documentation | `CHANGELOG.md` contient encore “Aucun déploiement Production” pour `1.17.0-rc.1`, alors que `project-state.md` documente `PRODUCTION_DEPLOYED`. | Observation / P1 documentaire | Preuves contradictoires | Ajouter une correction additive sans réécrire l’historique. |
| `DOC-CAND-002` | Dérive environnement | Documentation | `docs/prod-state.md` commence encore sur `1.16.0`/EP-18 alors que la RC `1.17.0-rc.1` est déployée. | Observation / P1 documentaire | Preuves contradictoires | Ajouter un état courant en tête et préserver les sections historiques. |
| `DOC-CAND-003` | Traçabilité | Gouvernance | Les anciennes références de Gates/plans gardent des statuts ouverts ou bloqués alors que des preuves plus récentes les supplantent. | Observation / P1 documentaire | Preuve documentaire | Ajouter des bandeaux de supersession, sans réécriture historique. |
| `DEBT-CAND-001` | Dette design/UX | EP-17 | `DD-611-03/04` et `DD-EP17-04/05/06/07/09` restent ouverts selon le registre design ; `DD-611-02`, `DD-EP17-02`, `DD-EP17-10`, `DD-EP17-11` et `DD-EP17-12` sont clos. | Mineur à majeur selon rattachement / P1 | Preuve documentaire | Rattacher chaque dette encore ouverte à une US qualifiée et à un lot/Gate cible. |

## 3. Éléments non ouverts / requalifiés

- `RSV-EP18-06` / webhook réel Resend-Svix : **reclassé EP-19**, non-bug EP-18 ; fondation technique mergée, validation opérationnelle différée.
- `OBS-S10-01` : observation cosmétique acceptée en l’état et close.
- Alertes historiques `BackupHeartbeatMissing` et `NotificationKillSwitchFerme` : non bloquantes dans le contexte documenté ; à rouvrir uniquement sur nouvelle preuve.
- Premier smoke `1.15.0` `64 PASS / 1 FAIL` : dérive de synchronisation de l’hôte, pas régression applicative.
- Jobs Docker/signature skipped sur PR documentaire : comportement attendu, pas défaut CI.
- GitHub Issues : aucune issue ouverte/fermée retrouvée ; ce constat ne clôt pas les candidats documentés ci-dessus.

## 4. Seuils de triage proposés

- **P0** : sécurité, RGPD, intégrité financière, auth/tenant isolation ou parcours critique indisponible ; bloque toute nouvelle promotion fonctionnelle jusqu’à décision/remédiation.
- **P1** : défaut majeur ou dette de release/ops/documentation nécessitant responsable, échéance et Gate cible ; dérogation PO/CDO obligatoire si le périmètre continue.
- **P2** : mineur, observation, industrialisation ou preuve complémentaire ; ne bloque pas l’hypercare si explicitement accepté.

## 5. Décision proposée

> Le PO/CDO valide la création de ce registre Bugs normatif. Les éléments `BUG-CAND-*`, `DOC-CAND-*` et `DEBT-CAND-*` restent des candidats à qualifier et ne constituent pas une présomption de bug définitivement accepté. Toute criticité P0/P1 doit recevoir une décision humaine, une preuve, un responsable et une échéance/Gate. Pendant l’hypercare `v1.17.0-rc.1`, seules les corrections documentaires additives sont autorisées par ce registre ; aucun code, migration, Staging, Production, provider, secret, EP-19 ou observabilité critique n’est autorisé.

---

## 6. Addendum de suivi — 2026-08-10

**Contexte :** session de réconciliation documentaire post-Gate Production US-125 et post-EP-15 Frontend. Les DOC-CAND ont été résolus ; les BUG-CAND et DEBT-CAND restent ouverts.

### 6.1 DOC-CAND résolus

| ID | Résolution | PR |
|---|---|---|
| `DOC-CAND-001` | ✅ CHANGELOG.md — bandeau additif `PRODUCTION_DEPLOYED` | #425 |
| `DOC-CAND-002` | ✅ prod-state.md — section 0S `1.17.0-rc.1` en tête | #425 |
| `DOC-CAND-003` | ✅ 4 bandeaux `SUPERSEDED` sur Gates/plans US-125 + 2 bandeaux EP-16 | #425 |

### 6.2 BUG-CAND et DEBT-CAND restant ouverts

| ID | État au 2026-08-10 | Action recommandée |
|---|---|---|
| `BUG-CAND-001` | Ouvert — P0 à confirmer. SMTP Keycloak absent, HTTP 500 sur mot de passe oublié. | Décision PO : P0 bloquant ou P1 planifié ? Cadrage SMTP réel + test anti-énumération. |
| `BUG-CAND-002` | Ouvert — P1. Lien invitation sans route Angular d'acceptation. | Décision PO : parcours Angular dans EP-17 ou API-only assumé ? |
| `BUG-CAND-003` | Ouvert — P1. `RgpdService` ne couvre pas `notification_*`. | Extension RGPD à planifier. Gate cible à déterminer. |
| `BUG-CAND-004` | Ouvert — P1. Archivage Bien sans garde affectation active (asymétrie avec Patrimoine). | Décision métier PO : aligner ou documenter l'asymétrie. |
| `BUG-CAND-005` | Ouvert — P2. **12 alertes Dependabot** (4 high, 7 moderate, 1 low) sur la branche default, et non plus 5. | Vérifier `npm audit --omit=dev`, reachability. Plan de mise à jour post-hypercare. |
| `DEBT-CAND-001` | Ouvert — P1. 11 dettes design/UX EP-17 non rattachées. | Rattacher chaque `DD-*` à une US qualifiée et un lot/Gate cible. |

### 6.3 Points d'attention

- **BUG-CAND-005** : le nombre d'alertes Dependabot est passé de 5 à 12 depuis l'audit initial. Les 4 high méritent une analyse de reachability prioritaire.
- **EP-15 Frontend** : les composants Gestionnaire/Locataire sont désormais intégrés (PR #423/#424), ce qui réduit le périmètre de `DEBT-CAND-001` pour les dettes UI liées à ces écrans.
- **Aucun bug n'est fermé** par cet addendum — seuls les DOC-CAND documentaires sont résolus.
