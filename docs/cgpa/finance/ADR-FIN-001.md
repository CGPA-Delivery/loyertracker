# ADR-FIN-001 — Ledger & Financial Immutability

## Statut

Accepted

## Contexte

Les projets gouvernés par le CGPA peuvent gérer des garanties, paiements, loyers, remboursements, pénalités, ajustements, soldes, devises ou autres mouvements financiers critiques. Ces opérations exigent une source de vérité explicable, reproductible et auditable.

## Problème

La modification directe d'un mouvement ou d'un solde détruit l'historique, empêche un rapprochement fiable et rend les erreurs, fraudes ou traitements concurrents difficiles à détecter.

## Décision

Le ledger immuable constitue la source de vérité des opérations financières. Le solde officiel est calculé à partir des mouvements. Toute correction est matérialisée par une nouvelle écriture compensatoire liée à l'écriture corrigée.

## Règles obligatoires

* Tout mouvement financier est immuable après validation.
* Aucune modification ou suppression directe d'un mouvement financier n'est autorisée.
* Toute correction passe par une écriture compensatoire, puis, si nécessaire, une nouvelle écriture correcte.
* Le solde officiel est calculé à partir des mouvements du ledger.
* Un solde stocké ne peut être qu'un cache technique recalculable, jamais la source de vérité.
* Chaque mouvement contient au minimum :
  * un identifiant unique ;
  * la date et l'heure ;
  * l'utilisateur ou le système source ;
  * le type d'opération ;
  * le montant ;
  * la devise ;
  * la référence métier ;
  * la justification ;
  * le lien éventuel vers l'écriture compensée ou compensatoire.
* Toute opération financière produit une trace d'audit exploitable.
* La devise est propagée depuis le contrat ou une autre source métier explicitement autorisée.
* Aucun changement silencieux de devise n'est autorisé. Toute conversion indique les devises source et cible, le taux, sa source, sa date et la règle d'arrondi.
* Toute opération exposée à une répétition doit être idempotente au moyen d'une clé stable et d'une contrainte technique vérifiable.

## Conséquences

### Positives

* reconstitution complète des soldes ;
* auditabilité et rapprochement facilités ;
* corrections explicables ;
* meilleure résistance aux doubles traitements et aux accès concurrents.

### Contraintes

* volume de données supérieur ;
* conception explicite des compensations, clés d'idempotence et règles de concurrence ;
* recalcul et rapprochement périodiques nécessaires ;
* purge ou anonymisation soumise aux obligations légales sans altérer l'intégrité financière.

## Critères de conformité

* `CHECK-FIN-01` est applicable et renseignée lorsque le projet entre dans le périmètre financier.
* Les écritures validées sont protégées contre `UPDATE` et `DELETE`, par conception et par contrôles techniques.
* Le solde peut être recalculé intégralement et rapproché avec tout cache.
* Les corrections, devises, arrondis, identités sources et références métier sont traçables.
* Les traitements rejoués ou concurrents ne créent pas de mouvement financier en double.
* Les migrations et restaurations préservent le ledger et son audit trail.

## Exemples acceptés

* un remboursement enregistré comme nouveau mouvement lié au paiement initial ;
* une erreur de montant annulée par une écriture inverse, suivie d'une écriture correcte ;
* un solde matérialisé utilisé pour la lecture, contrôlé et entièrement recalculable ;
* une requête de paiement rejouée retournant le résultat initial grâce à la même clé d'idempotence.

## Exemples interdits

* modifier le montant ou la devise d'un paiement validé ;
* supprimer une ligne de ledger pour corriger une erreur ;
* mettre à jour directement un solde officiel sans mouvement correspondant ;
* changer implicitement la devise héritée du contrat ;
* créer plusieurs paiements pour une même clé d'idempotence ;
* masquer une correction dans un champ technique sans écriture compensatoire ni audit.

## Références

* `docs/cgpa/finance/CHECK-FIN-01.md` ;
* `docs/cgpa/finance/FIN-ARCH-001.md` ;
* `docs/cgpa/finance/FIN-DOMAIN-GUIDE.md`.
