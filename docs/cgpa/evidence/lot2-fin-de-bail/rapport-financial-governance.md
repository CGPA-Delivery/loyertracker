# Avis Financial Governance — Lot 2 « interruption de bail prospective et échéancier clôturé »

- **Date** : 2026-10-16
- **Nature** : **avis préalable au développement**, exigé par le plan détaillé du lot 2 (§13) avant tout code.
- **Statut de ce document** : avis **rédigé par Claude Code (contribution IA) et validé par le PO/CDO le 2026-10-16** (message du chat : « j'ai aussi validé l'avis » ; bloc de décision en fin de document). Il **ne remplace pas** `CHECK-FIN-01`, à exécuter avec preuves avant le merge significatif du lot.
- **Plan examiné** : `docs/cgpa/06-planification-agile/plan-execution-lot2-interruption-prospective.md` (approuvé le 2026-10-16)
- **Référentiel** : `docs/cgpa/finance/ADR-FIN-001.md`, `FIN-DOMAIN-GUIDE.md`, `CHECK-FIN-01.md`, `financial-governance-status-loyertracker.md`.
- **Méthode** : lecture du plan, du code et des migrations. **Aucun test ni script exécuté, aucune base interrogée.**

## 1. Points soumis à l'avis

Le plan demande un avis sur : (1) le remplacement de la suppression physique des échéances par le statut `CLOTUREE` ; (2) `uq_paiement_periode` rendu partiel ; (3) le loyer du mois d'effet dû en entier (L2-D5). L'examen a aussi porté sur la réouverture qui rend les échéances (L2-D7).

## 2. Nature des objets financiers concernés

- `paiement` porte un loyer attendu et son pointage (`montant_attendu`, `montant_recu`, `statut`). **Ce n'est pas le ledger immuable** : `Paiement.pointer` modifie directement le montant et le statut, sans garde sur l'état courant (`Paiement.java`). Le ledger immuable de LoyerTracker est `garantie_movement` (ADR-14).
- Le lot 2 **ne modifie ni la garantie, ni son ledger, ni les soldes**. Les écarts déjà ouverts (FIN-IMMUT-01, FIN-CONC-01, FIN-ROUND-01, FIN-COMP-01) concernent la garantie : **le lot ne les aggrave pas et ne les lève pas**. À condition de ne pas modifier `GarantieService` (voir C3), `FIN-CONC-01` (« bloquant au prochain changement Garantie ») n'est pas déclenché.
- Aucune devise, aucun arrondi, aucune conversion nouvelle : le lot ne calcule aucun montant.

## 3. Avis par point

### 3.1 Statut `CLOTUREE` à la place de la suppression — **favorable**

Aujourd'hui, la clôture supprime physiquement les échéances `A_VENIR` postérieures au mois de clôture (`deleteByBailIdAndStatutAndPeriodeGreaterThan`). Ces lignes ne portent aucun montant reçu, mais ce sont des obligations attendues : leur suppression détruit l'historique et la reconstitution, ce que l'esprit d'ADR-FIN-001 (« aucune suppression directe », traçabilité) proscrit. Les conserver sous un statut explicite est conforme, **sous les conditions C1 à C4**.

Limite à consigner : les échéances déjà supprimées par d'anciennes clôtures ne sont pas reconstructibles. Le lot ne les restaure pas.

### 3.2 Index unique partiel — **favorable sous conditions**

Le plan montre que l'index total `(bien_id, periode)` ferait disparaître silencieusement les échéances d'un nouveau bail si des lignes `CLOTUREE` subsistaient. Le rendre partiel (hors `CLOTUREE`) préserve ce qui compte financièrement : **au plus une échéance active par bien et par période**, donc pas de double loyer attendu ni de double pointage. Plusieurs lignes `CLOTUREE` pour une même période deviennent possibles : conditions **C3** (finders, reste dû) et **C5** (réouverture).

### 3.3 Loyer du mois d'effet dû en entier (L2-D5) — **favorable**

Aucune règle monétaire nouvelle : l'échéance du mois d'effet est conservée en entier, comme la purge actuelle. Aucun arrondi n'est introduit. Un prorata serait une règle nouvelle, soumise séparément à la Financial Governance (précision et arrondi par devise, ADR-FIN-001).

### 3.4 Réouverture qui rend les échéances (L2-D7) — **favorable sous condition C5**

Remettre à `A_VENIR` les échéances `CLOTUREE` du bail est cohérent avec l'état antérieur à la clôture, tant que cela ne viole pas l'unicité des échéances actives.

## 4. Conditions

« **Avant développement** » : à intégrer au plan avant tout code. « **Avant merge** » : preuve exigée au `CHECK-FIN-01` du lot.

| ID | Condition | Échéance | Pourquoi |
|---|---|---|---|
| C1 | **Seules les échéances `A_VENIR` à `montant_recu = 0` passent à `CLOTUREE`.** Garantie par contrainte de données (par exemple `CHECK (statut <> 'CLOTUREE' OR montant_recu = 0)`) et par le code, pas seulement par le code. | Avant développement | Aucune somme perçue ne doit pouvoir être masquée sous un statut « clôturé ». ADR-FIN-001 exige des protections « par conception et par contrôles techniques ». |
| C2 | **Les montants déjà perçus au-delà de la date d'effet ne sont pas ignorés.** `Paiement.pointer` accepte un pointage `RECU` ou `PARTIEL` sur une échéance future (avance) : ces lignes ne sont pas `A_VENIR`, donc jamais clôturées, et resteraient muettes. L'aperçu et l'avertissement de fin de bail doivent lister, par devise, les sommes perçues pour des périodes postérieures au mois d'effet (« à régulariser »). Aucun mouvement automatique : le produit n'a pas de flux de remboursement de loyer, la régularisation reste manuelle. | Avant développement | Un trop-perçu non signalé est un risque financier direct. |
| C3 | **Une échéance `CLOTUREE` n'est pas une créance.** `Paiement.getResteDu()` retourne 0 pour `CLOTUREE` ; elle est exclue de tout total, relance et liste proposée à l'utilisateur (dont la liste de retenue sur garantie du frontend, `garanties-bail.component.ts`) ; le pointage est refusé (409) ; les finders de pointage et de quittance ignorent `CLOTUREE`. **Faire porter la garde par l'entité** (`reste dû = 0`) : la retenue sur garantie refuse alors tout montant positif par son contrôle existant (`montant > reste dû`), **sans modifier `GarantieService`**. | Avant développement | Sans cela, l'échéance clôturée afficherait un reste dû égal à son montant et pourrait être couverte par un mouvement de garantie (`GarantieService`, contrôle de `reste dû`). |
| C4 | **Audit complet de chaque opération qui change des échéances** : clôture immédiate, clôture par le job, annulation, réouverture. Une entrée par bail avec action, acteur (utilisateur ou « système »), bail, **nombre d'échéances concernées et somme des montants attendus par devise**, dans `audit_log.details` (colonne JSONB existante, non mappée par JPA ni écrite par `AuditService` aujourd'hui : ajout nécessaire). | Avant développement | ADR-FIN-001 : trace d'audit exploitable pour toute opération financière ; permet le rapprochement. |
| C5 | **Réouverture sans écrasement** : refusée (409) si rétablir une échéance `CLOTUREE` en `A_VENIR` créerait un doublon d'échéance active pour `(bien, période)` (par exemple parce qu'un autre bail a déjà des échéances pour cette période). Jamais d'erreur d'unicité remontée en 500. | Avant développement | L'index partiel autorise des `CLOTUREE` multiples, pas des actives multiples. |
| C6 | **Idempotence et concurrence démontrées** : deux exécutions du job donnent le même résultat ; job et annulation/clôture simultanés sur le même bail ; verrou du bail et du bien. | Avant merge | `CHECK-FIN-01` : tests de concurrence et d'idempotence (FAIL critique = NO GO). |
| C7 | **Migration et rollback sans perte** : sommes `montant_attendu` et `montant_recu` par bail identiques avant et après la migration ; la migration inverse ne supprime aucune ligne `CLOTUREE` ni ne modifie un montant ; contrôle de doublons avant retour à l'index total. | Avant merge | `CHECK-FIN-01` : migration et rollback vérifiés. |
| C8 | **Aucun montant dans les logs ni les messages d'erreur du job** ; les erreurs ne citent que des identifiants. | Avant merge | `CHECK-FIN-01` : données financières non exposées dans les logs. |
| C9 | **Non-régression des honoraires, quittances et alertes** : une échéance `CLOTUREE` n'altère pas `SUM(montant_recu)` (base des honoraires proportionnels), n'a jamais de quittance, ne génère jamais d'alerte de retard. | Avant merge | Une échéance clôturée a `montant_recu = 0` (C1) : neutre pour les honoraires, à prouver par test. |
| C10 | **Changement de comportement documenté** : la clôture ne supprime plus d'échéance (`CHANGELOG.md`, `project-state.md`). | Avant merge | Traçabilité de la décision. |

## 5. Amendements demandés au plan

À reporter dans le plan du lot 2 avant développement :

- §7 / §10 : ajouter C1 (contrainte de données), C2 (avances perçues dans l'aperçu et l'avertissement), C3 (reste dû nul, exclusion des listes, pointage refusé), C4 (audit avec `details`), C5 (réouverture refusée en cas de conflit).
- §6 : ajouter `Paiement.java` (reste dû) et `AuditService.java` (écriture de `details`) ; **ne pas modifier `GarantieService`** ; ajouter `garanties-bail.component.ts` (exclusion des échéances `CLOTUREE`) et son spec.
- §10 : ajouter les scénarios « avance perçue après la date d'effet », « retenue sur garantie refusée sur une échéance `CLOTUREE` », « réouverture en conflit », « audit avec nombre et somme par devise », « sommes inchangées avant/après migration ».

## 6. Position préalable sur `CHECK-FIN-01`

Règle du référentiel : un contrôle applicable sans preuve est `non exécuté`, jamais `N/A`. Rien n'ayant été exécuté, la colonne « position » ci-dessous est une **projection**, pas un résultat.

| Contrôle | Position préalable | Preuve attendue |
|---|---|---|
| Mise à jour directe des soldes officiels | `N/A` proposé (le lot ne touche aucun solde de garantie) — à approuver par le responsable | Absence de modification de `garantie`, `garantie_movement`, `GarantieService` |
| Modification ou suppression directe des mouvements | `N/A` proposé pour le ledger de garantie. Pour les loyers : **amélioration**, la suppression physique disparaît | Diff du lot ; test « aucune suppression à la clôture » |
| Écritures compensatoires | `N/A` proposé (aucune correction de montant) | — |
| Traçabilité complète et audit | `non exécuté`, conditionné par C4 | Test d'audit avec `details` |
| Gestion et propagation des devises | `non exécuté` ; aucun changement attendu | Test : devise de l'aperçu et de l'audit = devise du bail |
| Précision, arrondis | `N/A` proposé (aucun calcul nouveau) | — |
| Paiement total, partiel, double paiement | `non exécuté` | Pointage sur l'échéance active en présence d'une `CLOTUREE` pour la même période ; pointage d'une `CLOTUREE` refusé |
| Ajustement de garantie | `non exécuté` | Retenue sur garantie refusée sur une échéance `CLOTUREE` |
| Concurrence, idempotence | `non exécuté`, conditionné par C6 | Tests du job et des actions simultanées |
| Recalcul complet | `non exécuté` | Honoraires inchangés avec des échéances `CLOTUREE` (C9) |
| Migrations vérifiées, rollback sans perte | `non exécuté`, conditionné par C7 | Sommes avant/après ; migration inverse testée |
| Moindre privilège | `non exécuté` | Mêmes `@PreAuthorize` que la clôture ; accès croisé refusé |
| Données financières hors logs | `non exécuté`, conditionné par C8 | Revue des messages du job |
| Audit trail protégé et exploitable | `non exécuté`, conditionné par C4 | Lecture de l'audit après un cycle programmation, job, réouverture |

## 7. Avis

**Avis préalable proposé : FAVORABLE SOUS RÉSERVES.**

- Le développement du lot 2 peut démarrer **une fois les conditions C1 à C5 intégrées au plan** (amendements du §5) et cet avis validé.
- Les conditions C6 à C10 sont exigées par `CHECK-FIN-01` **avant le merge** du lot.
- Un `FAIL` sur la traçabilité, l'idempotence ou la cohérence d'une opération critique imposerait `NO GO` au merge, conformément à `CHECK-FIN-01`.
- Les trois points soumis (statut `CLOTUREE`, index partiel, loyer du mois d'effet) ne soulèvent **aucune objection de principe**.

## 8. Ce qui n'a pas été vérifié

- Aucune exécution : pas de test, pas de base, pas de script.
- L'état réel de la production (échéances avancées, doublons éventuels) est inconnu.
- La liste des lecteurs du reste dû a été établie par recherche textuelle dans le backend et le frontend ; un lecteur hors de ces zones pourrait manquer.
- L'absence d'impact sur les honoraires repose sur la lecture de `V15` (base `SUM(montant_recu)`) ; non prouvée par test.
- Je n'ai pas qualité pour valider cet avis : seule la relecture humaine le fait.

## 9. Décision

| Champ | Responsable Financial Governance / CDO |
|---|---|
| Décision (Avis validé / Validé sous réserves / À corriger) | **Avis validé** |
| Formulation | « j'ai aussi validé l'avis », exprimée dans le chat par le PO/CDO |
| Réserves complémentaires | Aucune exprimée dans le message ; les conditions C1 à C10 de l'avis s'appliquent telles qu'écrites |
| Qualité du validateur | PO/CDO (pas de nom nominatif : décision exprimée en conversation de pilotage) |
| Date | 2026-10-16 |

Reste à faire après cette validation : reporter les amendements du §5 (conditions C1 à C5) dans le plan du lot 2, avant tout code. `docs/project-state.md` est mis à jour avec la validation. Une réserve ne neutralise jamais un bloqueur.
