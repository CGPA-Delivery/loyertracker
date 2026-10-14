# ADR-20 — Traitement de S12 : `bien.patrimoine_id` et cohérence du propriétaire

- **Date** : 2026-10-14
- **Point traité** : S12 du dossier de revue sécurité (`docs/cgpa/reports/revue-securite-adr20-rls-multi-bailleurs.md`)
- **Nature** : vérification par lecture du code et des migrations. **Aucune requête n'a été exécutée** sur une base.
- **Statut** : S12 **clos** pour la question posée ; un point voisin (S12b) est ouvert et un contrôle en lecture seule est proposé.

## 1. Question posée

ADR-11 prévoit `Bien.patrimoine_id` non nul. ADR-20 fait dépendre la visibilité des biens de l'appartenance au patrimoine : un bien sans patrimoine serait invisible sous la nouvelle policy. Le schéma garantit-il qu'aucun bien n'est sans patrimoine ?

## 2. Constat — S12 clos

| Élément | Résultat | Preuve |
|---|---|---|
| Colonne | `NOT NULL`, clé étrangère vers `patrimoine(id)` | `backend/src/main/resources/db/migration/V12__patrimoine_type_bien.sql:55` (ajout), `:72` (`ALTER COLUMN patrimoine_id SET NOT NULL`) |
| Reprise des biens existants | Un patrimoine « Patrimoine principal » créé par bailleur possédant au moins un bien, puis rattachement rétroactif | `V12__patrimoine_type_bien.sql:58-70` |
| Entité | `@Column(name = "patrimoine_id", nullable = false)` | `backend/src/main/java/com/loyertracker/biens/Bien.java:34` |
| Création et modification | Le service vérifie que le patrimoine existe avant d'enregistrer | `backend/src/main/java/com/loyertracker/biens/BienService.java:56, 66, 75-78` |

**Conclusion** : aucun bien ne peut être sans patrimoine, ni en base ni côté application. Aucune action n'est nécessaire pour la question initiale de S12.

## 3. Point voisin ouvert — S12b : le propriétaire du bien et celui du patrimoine peuvent diverger

Le schéma ne garantit **pas** que `bien.bailleur_id = patrimoine.bailleur_id` :

- aucune contrainte composite, aucun trigger sur `bien` (recherche dans les migrations : seul l'index `idx_bien_patrimoine` existe, `V12:73`) ;
- le seul garde-fou est applicatif : `BienService.validerPatrimoine` appelle `existsById`, qui passe par la RLS de `patrimoine` (`bailleur_isolation`, V12) et ne retrouve donc que les patrimoines du bailleur courant.

**Pourquoi c'est important pour ADR-20.** Aujourd'hui, la visibilité d'un bien suit `bien.bailleur_id`. Après ADR-20 (D-MB-03), elle suivra le patrimoine. Si un bien en production était rattaché à un patrimoine d'un autre bailleur (anomalie historique, bug, saisie directe en base), la migration **changerait qui le voit** : il deviendrait visible du bailleur du patrimoine, et invisible de son propre bailleur. Le risque est faible, mais la conséquence est une fuite de données ; il se vérifie par une requête.

À noter : après ADR-20, l'égalité `bien.bailleur_id = patrimoine.bailleur_id` **ne sera plus un invariant** (un co-bailleur B peut créer un bien dans un patrimoine créé par A). Ce contrôle ne vaut donc qu'**avant** la migration.

## 4. Script de contrôle proposé (lecture seule, non exécuté)

**Conditions d'exécution**

- Exécuter dans une transaction `READ ONLY`, sur une **copie** de la base de production si possible.
- Les tables sont sous `FORCE ROW LEVEL SECURITY` : le script doit tourner avec un rôle qui **contourne la RLS** (propriétaire `BYPASSRLS`, ou superutilisateur). Avec un rôle applicatif, il renverrait 0 ligne à tort et serait trompeur.
- Autorisation du PO requise avant toute exécution sur la production. Aucun accès à la production n'a été utilisé pour préparer ce script.

```sql
BEGIN READ ONLY;

-- C1. Biens sans patrimoine (attendu : 0, garanti par NOT NULL — contrôle de sûreté)
SELECT count(*) AS biens_sans_patrimoine FROM bien WHERE patrimoine_id IS NULL;

-- C2. Bien rattaché à un patrimoine d'un autre bailleur (attendu : 0) — S12b
SELECT b.id AS bien_id, b.bailleur_id AS bailleur_du_bien,
       p.id AS patrimoine_id, p.bailleur_id AS bailleur_du_patrimoine
FROM bien b
JOIN patrimoine p ON p.id = b.patrimoine_id
WHERE b.bailleur_id <> p.bailleur_id;

-- C3. Bail dont le bailleur diffère de celui du bien (attendu : 0)
SELECT ba.id AS bail_id, ba.bailleur_id AS bailleur_du_bail, b.bailleur_id AS bailleur_du_bien
FROM bail ba JOIN bien b ON b.id = ba.bien_id
WHERE ba.bailleur_id <> b.bailleur_id;

-- C4. Paiement dont le bailleur diffère de celui de son bail (attendu : 0)
SELECT pa.id AS paiement_id, pa.bailleur_id AS bailleur_du_paiement, ba.bailleur_id AS bailleur_du_bail
FROM paiement pa JOIN bail ba ON ba.id = pa.bail_id
WHERE pa.bailleur_id <> ba.bailleur_id;

-- C5. Garantie dont le bailleur diffère de celui de son bail (attendu : 0)
SELECT g.id AS garantie_id, g.bailleur_id AS bailleur_de_la_garantie, ba.bailleur_id AS bailleur_du_bail
FROM garantie g JOIN bail ba ON ba.id = g.bail_id
WHERE g.bailleur_id <> ba.bailleur_id;

-- C6. Locataire d'un bail appartenant à un autre bailleur (attendu : 0) — impacte D-MB-04
SELECT ba.id AS bail_id, ba.bailleur_id AS bailleur_du_bail, l.bailleur_id AS bailleur_du_locataire
FROM bail ba JOIN locataire l ON l.id = ba.locataire_id
WHERE ba.locataire_id IS NOT NULL AND ba.bailleur_id <> l.bailleur_id;

-- C7. Information : un seul bailleur par patrimoine aujourd'hui (la migration crée 1 ligne de liaison par patrimoine)
SELECT count(*) AS patrimoines, count(DISTINCT bailleur_id) AS bailleurs_distincts FROM patrimoine;

ROLLBACK;
```

## 5. Lecture des résultats

| Contrôle | Résultat attendu | Si non nul |
|---|---|---|
| C1 | 0 | Anormal (contrainte `NOT NULL`) : arrêter et enquêter. |
| C2 à C6 | 0 ligne | Chaque ligne est un cas à décider par le PO **avant** toute migration (réattribuer, corriger ou documenter). Ne pas corriger sans décision. |
| C7 | informatif | Confirme (ou non) la déclaration du PO : aucun co-bailleur en production. |

Les contrôles C3 à C6 vérifient la cohérence que le plan suppose pour D-MB-03 (héritage du patrimoine) et D-MB-04 (visibilité du locataire).

## 6. Suites

- **S12** : clos. À retirer de la liste « Restent ouverts » d'ADR-20 une fois la PR #575 fusionnée (pour ne pas créer de conflit sur l'ADR).
- **S12b** : ouvert, dépend de l'exécution du script §4 sur une copie de la production (décision et autorisation du PO).
- **Matrice de tests** : ajouter un test d'intégration qui prouve qu'un bien ne peut pas être rattaché à un patrimoine hors du périmètre du bailleur (cas actuel), et, au lot 4, qu'il peut l'être pour un co-bailleur membre.

## 7. Limites

- Aucune base interrogée : toutes les affirmations viennent de la lecture du code et des migrations.
- Les noms de colonnes du script viennent de `V1`, `V22` et `V24` ; ils doivent être revalidés contre le schéma réellement déployé.
- Le script ne couvre pas `quittance`, `honoraire`, `alerte` ni `notification_*` (inventaire S4 non terminé).
