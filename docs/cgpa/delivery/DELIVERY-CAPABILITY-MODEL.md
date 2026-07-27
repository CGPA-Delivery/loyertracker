# DELIVERY-CAPABILITY-MODEL - Delivery Capability Levels

## Objectif

Evaluer la maturite de livraison logicielle d'un projet CGPA.

## Niveaux

| Niveau | Description | Indicateurs |
| --- | --- | --- |
| DCL 1 | Livraison manuelle | peu de preuves, controles informels |
| DCL 2 | CI de base | build et tests automatises, environnements identifies |
| DCL 3 | Delivery gouvernee | Dev/Staging automatises, Gates appliques, rollback documente |
| DCL 4 | Release robuste | RC immutable, observabilite complete, rollback eprouve |
| DCL 5 | Delivery optimisee | audit continu, automatisation avancee, amelioration continue |

## Regle

Chaque projet doit declarer son Delivery Capability Level dans `/docs/project-state.md` et justifier les reserves.

## Utilisation

Le niveau DCL ne remplace pas les Gates. Il aide a prioriser les ameliorations et a mesurer la maturite dans le temps.