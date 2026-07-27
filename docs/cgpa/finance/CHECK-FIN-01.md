# CHECK-FIN-01 — Financial Integrity Checklist

## Applicabilité

Cette checklist est obligatoire pour tout changement significatif touchant des valeurs monétaires, garanties, paiements, factures, loyers, remboursements, pénalités, ajustements, soldes, devises ou mouvements financiers.

Elle est exécutée avant :

* merge significatif ;
* clôture de sprint ;
* Gate Staging ;
* Gate Production.

Projet :

Version / changement :

Gate ou contrôle :

Date :

Responsable :

Preuves :

## Intégrité du ledger

| Contrôle | PASS | FAIL | N/A justifié | Preuve |
| -------- | ---- | ---- | ------------ | ------ |
| Absence de mise à jour directe des soldes officiels |  |  |  |  |
| Absence de modification ou suppression directe des mouvements |  |  |  |  |
| Écritures compensatoires présentes pour toute correction |  |  |  |  |
| Cohérence entre solde calculé et mouvements |  |  |  |  |
| Recalcul complet du ledger réussi |  |  |  |  |

## Traçabilité et audit

| Contrôle | PASS | FAIL | N/A justifié | Preuve |
| -------- | ---- | ---- | ------------ | ------ |
| Traçabilité complète de chaque opération |  |  |  |  |
| Audit utilisateur ou système, date, action et référence métier |  |  |  |  |
| Justification et liens de compensation disponibles |  |  |  |  |

## Devises et précision

| Contrôle | PASS | FAIL | N/A justifié | Preuve |
| -------- | ---- | ---- | ------------ | ------ |
| Gestion correcte des devises |  |  |  |  |
| Devise propagée depuis le contrat ou la source autorisée |  |  |  |  |
| Aucun changement silencieux de devise |  |  |  |  |
| Précision, arrondis et éventuelles conversions documentés |  |  |  |  |

## Tests financiers

| Contrôle | PASS | FAIL | N/A justifié | Preuve |
| -------- | ---- | ---- | ------------ | ------ |
| Paiement total |  |  |  |  |
| Paiement partiel |  |  |  |  |
| Double paiement |  |  |  |  |
| Remboursement |  |  |  |  |
| Ajustement de garantie ou équivalent métier |  |  |  |  |
| Compensation |  |  |  |  |
| Recalcul complet du ledger |  |  |  |  |
| Concurrence |  |  |  |  |
| Idempotence |  |  |  |  |

## Données, exploitation et sécurité

| Contrôle | PASS | FAIL | N/A justifié | Preuve |
| -------- | ---- | ---- | ------------ | ------ |
| Migrations de base de données vérifiées |  |  |  |  |
| Rollback vérifié sans perte ni altération du ledger |  |  |  |  |
| Accès aux opérations financières protégés selon le moindre privilège |  |  |  |  |
| Données financières non exposées dans les logs, erreurs ou exports non autorisés |  |  |  |  |
| Audit trail protégé, horodaté et exploitable |  |  |  |  |

## Décision

* PASS
* PASS sous réserve
* FAIL

Un `FAIL` concernant l'immutabilité, la cohérence du ledger, la traçabilité, la devise ou l'idempotence d'une opération critique impose `NO GO`. Un `N/A` doit être justifié et approuvé par le rôle responsable du Gate.

Réserves, responsables et échéances :
