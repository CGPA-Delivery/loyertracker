# Audit de reliquat Sprint — après déploiement US-125

**Date :** 2026-08-09T06:27:44Z  
**Cadre :** CGPA v6.1.1  
**Release sous hypercare :** `v1.17.0-rc.1` / US-125  
**Branche d’audit :** `audit/sprint-remainder-after-us125`  
**Base :** `main` / `origin/main` à `379babfa361ade2d4c2623d895a12f10e4753cc5`

## 1. Décision d’exécution

**Décision : `Resume Approved with Reservations` — audit et travail Dev isolé autorisés ; aucun nouveau codage EP-16 identifié à ce stade.**

L’hypercare T+12/T+24 reste prioritaire. La branche d’audit ne modifie ni l’artefact Production, ni la configuration d’environnement, ni le schéma partagé. Aucun merge applicatif, déploiement Staging/Production ou activation de canal externe n’est autorisé avant la clôture de l’hypercare et une décision CGPA distincte.

## 2. État de référence vérifié

| Élément | Preuve actuelle | Classification |
|---|---|---|
| Production | `v1.17.0-rc.1`, `PRODUCTION_DEPLOYED`, smoke **63 PASS / 0 FAIL**, API/Web healthy | PASS — hypercare active |
| US-124 | Release `1.15.0`, EP-16 Sprint N+2 Lot A, validation et clôture documentées | Livrée / pas de nouveau codage identifié |
| US-126 | Release `1.15.0`, EP-16 Sprint N+2 Lot A, observabilité/sécurité/exploitation documentées | Livrée / pas de nouveau codage identifié |
| US-125 | Release `1.17.0-rc.1`, Gate Staging et Production validés | Livrée / hypercare en cours |
| EP-16 Sprint N+2 | Lot A (`US-124/126`) puis Lot B (`US-125`) traités dans des releases distinctes | Aucun reliquat fonctionnel prouvé |
| Git | `main` alignée sur `origin/main`, working tree propre avant branche | PASS |

## 3. Réconciliation du backlog

### 3.1 Items déjà livrés

- `US-119` à `US-121` : Sprint N Fondation, livré antérieurement.
- `US-122` et `US-123` : Sprint N+1 WhatsApp P0, livré antérieurement.
- `US-124` et `US-126` : Lot A du Sprint N+2, release `1.15.0`, clôturée par CDO.
- `US-125` : Lot B du Sprint N+2, release `1.17.0-rc.1`, actuellement sous hypercare.

### 3.2 Dérive documentaire identifiée

Les documents historiques suivants contiennent encore des formulations antérieures au déploiement de US-125 :

- `docs/cgpa/06-planification-agile/addendum-backlog-ep16-notifications.md` : statut global et séquencement historique indiquant encore que N+1/N+2 ne sont pas démarrés ;
- `docs/cgpa/06-planification-agile/plan-execution-ep16-notifications.md` : sections historiques indiquant que le Backend US-125 n’est pas livré ;
- certains rapports de Gate `1.15.0` : Lot B/US-125 indiqué comme bloqué, avant la décision Gate 04A, Gate 05, Staging et Production US-125.

Ces formulations ne doivent pas être réécrites comme si elles n’avaient jamais existé. Elles doivent être conservées comme historique et complétées par une mise à jour additive indiquant l’état courant.

### 3.3 Résultat

**Aucun reliquat EP-16 suffisamment démontré pour autoriser immédiatement une nouvelle implémentation.** Le prochain travail autorisé est la synchronisation documentaire et l’identification du backlog produit post-EP-16, pas le recodage d’une US déjà livrée.

## 4. Zone verte Dev pendant l’hypercare

Autorisé sur une branche dédiée, sans merge vers `main` :

- réconciliation du backlog et des plans historiques ;
- analyse d’impact du prochain Epic/Sprint ;
- ADR, spécifications, critères d’acceptation et plan d’exécution ;
- tests unitaires ou prototypes non connectés aux données Production ;
- documentation d’exploitation sans changement de runtime ;
- préparation d’une PR future, explicitement non promue.

## 5. Zone rouge jusqu’à T+24

Interdit dans cette branche et pendant l’hypercare :

- migration Flyway ou modification du schéma partagé ;
- changement d’authentification, autorisation, RLS/ReBAC ou secrets ;
- modification de l’observabilité nécessaire au diagnostic ;
- changement de `docker-compose`, manifests Production ou release lock ;
- activation Twilio/SMS/WhatsApp/Resend ;
- modification de `v1.17.0-rc.1` ou de sa capacité de rollback ;
- merge applicatif, promotion Staging ou déploiement Production.

## 6. Séquencement décidé

1. Fusionner cet audit documentaire après CI verte.
2. Maintenir `main` et `v1.17.0-rc.1` inchangés pendant T+12/T+24.
3. Identifier le prochain item produit réel dans le backlog post-EP-16.
4. Pour un item admissible, produire son plan d’exécution et ses Gates avant codage.
5. Après clôture de l’hypercare, soumettre séparément le GO humain du prochain développement.

**Conclusion :** nous avançons immédiatement sur la gouvernance et le cadrage Dev, mais nous ne prétendons pas qu’un reliquat fonctionnel EP-16 existe tant que l’inventaire ne le prouve pas.
