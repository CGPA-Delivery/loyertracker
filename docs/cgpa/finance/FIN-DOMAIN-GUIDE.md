# FIN-DOMAIN-GUIDE — Financial Governance Guide

## Quand appliquer le pack

Le Financial Governance Pack s'applique dès qu'un projet crée, reçoit, transforme, conserve, expose ou rapproche des valeurs monétaires, garanties, paiements, factures, loyers, remboursements, pénalités, ajustements, soldes, devises ou mouvements financiers.

Il s'applique aux systèmes transactionnels, API, traitements batch, intégrations, imports, exports et outils d'administration. Un projet sans opération financière peut déclarer le pack non applicable dans `project-state.md`, avec justification.

## Principes

### Ledger et immutabilité

Le ledger est le journal des effets financiers validés et la source de vérité. Une écriture validée n'est ni modifiée ni supprimée. Les vues, agrégats et caches restent dérivés et recalculables.

### Compensation

Une erreur est corrigée par une écriture compensatoire liée à l'écriture initiale. Si une valeur correcte doit ensuite être appliquée, elle fait l'objet d'une nouvelle écriture distincte.

### Auditabilité et historisation

Chaque opération permet d'identifier son origine, son acteur ou système, sa date, son intention, sa référence métier, sa décision et ses éventuelles compensations. L'historique doit permettre la reconstitution et le rapprochement sans écraser les états antérieurs.

### Devises

La devise provient du contrat ou d'une source métier autorisée. Elle accompagne chaque mouvement. Une conversion est une opération explicite et auditée ; elle indique taux, source, date, devises source et cible, précision et arrondi. Aucun changement silencieux n'est admis.

### Précision monétaire et arrondis

Les montants utilisent une représentation décimale exacte ou des unités mineures. La précision, le mode d'arrondi et le moment de l'arrondi sont définis par devise et règle métier. Les arrondis intermédiaires non spécifiés sont interdits.

### Idempotence

Toute commande susceptible d'être rejouée porte une clé d'idempotence stable. Une répétition avec la même intention retourne le résultat existant ; une même clé avec un contenu incompatible est rejetée et auditée.

### Concurrence

Les opérations concurrentes utilisent transactions, contraintes d'unicité, verrouillage ou contrôle optimiste adaptés. La stratégie doit empêcher doubles paiements, dépassements de limite et projections incohérentes.

### Rapprochement

Les soldes calculés, caches, systèmes externes et relevés sont rapprochés selon une fréquence proportionnée au risque. Tout écart est quantifié, attribué, audité et résolu sans altérer les mouvements historiques.

## Erreurs fréquentes à éviter

* traiter un champ `solde` comme source de vérité ;
* corriger une écriture par `UPDATE` ou `DELETE` ;
* utiliser un flottant binaire pour un montant ;
* déduire implicitement ou remplacer silencieusement une devise ;
* confondre journal technique et audit financier ;
* se fier uniquement au code applicatif sans contraintes de données ;
* omettre les scénarios de rejouabilité, concurrence, restauration et recalcul ;
* exposer des informations financières dans des logs ou messages d'erreur non maîtrisés.

## Minimum attendu avant passage de Gate

* applicabilité du pack renseignée dans `project-state.md` ;
* architecture alignée sur `FIN-ARCH-001` ou écarts justifiés par ADR ;
* conformité à `ADR-FIN-001` ;
* `CHECK-FIN-01` complétée avec preuves ;
* tests financiers critiques exécutés ;
* recalcul, rapprochement, idempotence et concurrence vérifiés ;
* migrations, rollback, sécurité et audit évalués ;
* aucun `FAIL` bloquant ouvert.

## Application aux contrôles CGPA

Lorsque le pack est applicable, `CHECK-FIN-01` est obligatoire avant merge significatif, clôture de sprint, déploiement Staging et mise en Production. Les résultats et réserves sont inscrits dans le rapport d'exécution et `project-state.md`.
