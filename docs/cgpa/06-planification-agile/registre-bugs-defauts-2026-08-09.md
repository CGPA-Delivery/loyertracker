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
| `BUG-CAND-002` / `DD-EP17-12` | Bug fonctionnel | EP-17 / invitation | Le lien généré par `InvitationService.java:78-80` vise `/invitations/{token}`, mais aucune route Angular d’acceptation n’a été retrouvée ; dette `design-debt-register-loyertracker.md:25`. | Majeur / P1 | Preuve code + documentaire | Décider parcours Angular, API-only explicite ou requalification. |
| `BUG-CAND-003` / `RSV-EP18-03` | Réserve RGPD | EP-18 notifications | `ADR-19-notifications-email-resend.md:257` indique que `RgpdService` ne couvre pas les tables `notification_*`. | Majeur / P1 à confirmer | Preuve documentaire, couverture code à compléter | Décider l’extension RGPD et son Gate cible. |
| `BUG-CAND-004` / `DD-EP15-04` | Dette métier | EP-15 biens | `BienService.java:91-97` archive directement ; `PatrimoineService.java:61-64` applique une garde pour affectation active. Le comportement métier de Bien doit être tranché. | Majeur / P1 | Preuve code + ADR-16:254 | Décider règle métier et test d’intégrité avant nouveau périmètre concerné. |
| `BUG-CAND-005` | Sécurité dépendances | Développement | 5 alertes Dependabot ouvertes : `js-yaml` high, `postcss` medium, `hono` medium/low ; périmètre déclaré development. PR #395/#396/#397 signalées. | Majeur à mineur / P2, P1 si exposition runtime confirmée | Preuve GitHub à revalider | Vérifier `npm audit --omit=dev`, reachability et plan de mise à jour après hypercare. |
| `DOC-CAND-001` | Dérive release | Documentation | `CHANGELOG.md` contient encore “Aucun déploiement Production” pour `1.17.0-rc.1`, alors que `project-state.md` documente `PRODUCTION_DEPLOYED`. | Observation / P1 documentaire | Preuves contradictoires | Ajouter une correction additive sans réécrire l’historique. |
| `DOC-CAND-002` | Dérive environnement | Documentation | `docs/prod-state.md` commence encore sur `1.16.0`/EP-18 alors que la RC `1.17.0-rc.1` est déployée. | Observation / P1 documentaire | Preuves contradictoires | Ajouter un état courant en tête et préserver les sections historiques. |
| `DOC-CAND-003` | Traçabilité | Gouvernance | Les anciennes références de Gates/plans gardent des statuts ouverts ou bloqués alors que des preuves plus récentes les supplantent. | Observation / P1 documentaire | Preuve documentaire | Ajouter des bandeaux de supersession, sans réécriture historique. |
| `DEBT-CAND-001` | Dette design/UX | EP-17 | `DD-611-02/03/04` et `DD-EP17-02/04/05/06/07/09/10/11` restent ouvertes selon le registre design. | Mineur à majeur selon rattachement / P1 | Preuve documentaire | Rattacher chaque dette à une US qualifiée et à un lot/Gate cible. |

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
