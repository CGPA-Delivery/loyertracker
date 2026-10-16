# ADR-20 — Décisions techniques S5, S11, S12b et registre des fonctions `SECURITY DEFINER`

- **Date** : 2026-10-16
- **Points traités** : S5, S11 et S12b du dossier de revue sécurité (`docs/cgpa/reports/revue-securite-adr20-rls-multi-bailleurs.md`)
- **Nature** : décisions du PO/CDO du 2026-10-16 et registre initial. **Aucune base interrogée, aucun corps de fonction audité ligne à ligne.**
- **Statut** : décisions prises ; l'audit des fonctions (S5), la mesure de performance (S11) et l'exécution du contrôle (S12b) restent à faire. ADR-20 reste « Proposée ».
- **Pourquoi un document séparé** : la PR #578 modifiait encore l'ADR-20 au moment de la rédaction. Ces décisions seront reportées dans l'ADR-20 après sa fusion.

## 1. Décisions du PO/CDO (2026-10-16)

| Code | Point | Décision retenue |
|---|---|---|
| DT-01 | S5 — `bailleur_id` des lignes générées par les fonctions batch | La ligne générée reprend le `bailleur_id` **de sa ligne parente** : une échéance celui de son bail, une alerte celui de son bail (ou de son bien), un honoraire celui de son affectation. La visibilité vient du patrimoine (D-MB-03), pas de ce champ. |
| DT-02 | S5 — Gouvernance des fonctions `SECURITY DEFINER` | **Contrôle CI + revue sécurité obligatoire.** Un contrôle CI liste les fonctions `SECURITY DEFINER` des migrations et échoue si l'une est ajoutée ou modifiée sans fichier de revue associé. Un registre est tenu à jour (§3 de ce document). |
| DT-03 | S11 — Approche de performance | **Mesurer d'abord, dénormaliser si nécessaire.** On commence par la fonction d'appartenance par ligne ; `patrimoine_id` n'est dénormalisé (avec contrainte de cohérence) que si le seuil n'est pas tenu. |
| DT-04 | S11 — Seuil | Dégradation **au plus +20 % de latence p95** sur les requêtes principales (liste des paiements, quittances, échéancier), mesurée avant/après sur la même base de test à volume réaliste. |
| DT-05 | S12b — Où exécuter le contrôle | Sur une **copie restaurée de la production**, dans une base isolée. Jamais sur le staging mutualisé sans les précautions `STG-ISOL-01`. L'accès à la sauvegarde requiert l'autorisation du PO. |
| DT-06 | S12b — Anomalies | **Cas par cas, validé par le PO avant correction.** Aucune correction automatique. La migration ADR-20 est bloquée tant qu'une anomalie reste non décidée. |

## 2. Conséquences à traiter

- **DT-01** : les fonctions `generer_echeances_loyers`, `generer_alertes` et `calculer_honoraires` doivent écrire le `bailleur_id` de la ligne parente. À noter : `alerte.destinataire_id` est unique et polymorphe (V1) ; avec la table de lecture par destinataire (D-MB-15), son rôle exact est à fixer à la conception du lot.
- **DT-02** : le contrôle CI est une évolution de pipeline (CHECK-CICD-01 s'applique). Il doit comparer l'ensemble des fonctions `SECURITY DEFINER` des migrations au registre (§3) et exiger, pour toute différence, un document de revue référencé. Il ne remplace pas la revue humaine.
- **DT-03 / DT-04** : le plan de test de performance (T14 du dossier de revue) doit fixer le volume de référence (cible ADR-11 : 50 biens par bailleur, à compléter par le volume réel de la production) et la méthode de mesure (p95, même base, mêmes requêtes).
- **DT-05 / DT-06** : le script de contrôle est dans `docs/cgpa/evidence/adr20-s12/controle-coherence-bien-patrimoine.md` (§4). Un rapport d'exécution horodaté, listant chaque anomalie et la décision du PO, sera produit à l'exécution.

## 3. Registre initial des fonctions `SECURITY DEFINER`

Relevé par recherche dans les migrations `V1` à `V36`. **23 fonctions distinctes** (le dossier de revue n'en citait qu'une partie). Toutes sont propriété de `loyertracker_batch` (rôle `BYPASSRLS`), exécutables par `loyertracker_api`.

La colonne « Impact ADR-20 présumé » vient du **nom et du commentaire** des fonctions, pas d'une lecture du corps. Elle est à confirmer par l'audit.

| Fonction | Migration | Rôle | Impact ADR-20 présumé |
|---|---|---|---|
| `resolve_bailleur_id` | V2 | Résout le bailleur depuis l'identité Keycloak | Aucun (identité) |
| `resolve_invitation_bailleur` | V2 | Résout le bailleur d'une invitation | À revoir (D-MB-16 : type d'invitation) |
| `resolve_bien_bailleur` | V4 | Résout le bailleur d'un bien (contexte du gestionnaire) | **À réécrire** (règle du bailleur acteur, S3) |
| `bien_appartient_au_bailleur` | V3 | Prédicat de propriété d'un bien | **À réécrire** (appartenance au patrimoine) |
| `patrimoine_appartient_au_bailleur` | V12 | Prédicat de propriété d'un patrimoine | **À réécrire** (appartenance) |
| `gestionnaire_affecte_actif` | V3, V13, V15 | Prédicat d'affectation active (bien ou patrimoine) | À revoir (D-MB-10 : affectation portée par le patrimoine) |
| `gestionnaire_a_relation` | V23 | Relation bailleur / gestionnaire | À revoir (co-bailleurs) |
| `gestionnaire_a_affectation_active` | V23 | Affectation active d'un gestionnaire | À revoir (D-MB-10) |
| `biens_affectes_gestionnaire` | V4, V13, V15 | Biens affectés à un gestionnaire | À revoir (D-MB-10) |
| `audit_paiements_biens_affectes_gestionnaire` | V35 | Audit des paiements des biens affectés | À revoir (D-MB-10, D-MB-14) |
| `alertes_gestionnaire` | V9 | Alertes visibles d'un gestionnaire | À revoir (D-MB-06, D-MB-15) |
| `alerte_bailleur_pour_gestionnaire` | V9 | Bailleur d'une alerte pour un gestionnaire | À revoir (D-MB-06) |
| `notifications_gestionnaire` | V32 | Notifications d'un gestionnaire | À revoir (D-MB-13) |
| `generer_echeances_loyers` | V6, V18 | Génère les échéances pour tous les baux actifs (batch) | **À modifier** (DT-01) |
| `marquer_loyers_en_retard` | V7 | Marque les loyers en retard (batch) | À vérifier (touche toutes les lignes) |
| `generer_alertes` | V9, V10, V25, V27 | Génère les alertes pour tous les bailleurs (batch) | **À modifier** (DT-01, D-MB-06, D-MB-15) |
| `calculer_honoraires` | V8, V14, V15 | Calcule les honoraires par affectation (batch) | **À modifier** (DT-01, D-MB-17) |
| `notification_bailleurs_en_attente` | V28 | Bailleurs ayant des notifications en attente (batch) | À revoir (D-MB-13) |
| `notification_delivery_appliquer_statut` | V28 | Applique un statut de livraison (webhooks) | À vérifier |
| `notification_envois_du_mois` | V29 | Budget mensuel d'envois | À revoir (budget par bailleur, D-MB-13) |
| `lire_quittance_publique` | V22 | Lecture publique d'une quittance | À vérifier (ne doit rien exposer d'un patrimoine) |
| `lire_pdf_quittance_publique` | V22 | Lecture publique du PDF | À vérifier (idem) |
| `journaliser_evenement_quittance` | V22 | Journal de vérification publique | À vérifier |

Répartition présumée : 1 sans impact, 3 à réécrire, 3 à modifier (batch de génération), 11 à revoir selon une décision ADR-20, 5 à vérifier (23 au total).

## 4. Suites

1. **Audit des 23 fonctions** par un relecteur humain : lecture du corps, propriétaire, `search_path`, `GRANT EXECUTE`, comportement avec plusieurs bailleurs. Produire un fichier de revue par fonction ou par groupe, référencé depuis le registre.
2. **Contrôle CI** (DT-02) : à spécifier (entrée : migrations ; sortie : échec si une fonction `SECURITY DEFINER` change sans revue référencée). Passer par le Plan d'Exécution du lot concerné (changement de pipeline).
3. **Mesure de performance** (DT-03, DT-04) : définir le jeu de données et les requêtes avant d'écrire la policy.
4. **Exécution du contrôle S12b** (DT-05, DT-06) : après autorisation du PO d'accès à une sauvegarde.
5. **Report dans ADR-20** : intégrer DT-01 à DT-06 dans la section Gouvernance après la fusion de la PR #578, et mettre à jour la liste « Restent ouverts ».

## 5. Limites

- Le relevé a été fait par recherche textuelle sur `SECURITY DEFINER` et `CREATE FUNCTION` : une fonction définie autrement (par exemple dans un bloc `DO`) pourrait manquer.
- Les corps des fonctions n'ont pas été relus ; les impacts sont présumés.
- Le schéma déployé en production n'a pas été comparé aux migrations.
