# Décision GO / NO GO CGPA v6.1.1 — Gate 06A, instance EP-17 avant Lot 1

> Instance du gabarit `docs/cgpa/templates/go-no-go.md` (non modifié). Ne remplace ni ne rouvre
> `docs/cgpa/07-devsecops/gate-06A-decision.md` (Gate 06A **GO ratifié le 2026-06-16**,
> périmètre projet général) — cette instance confirme/étend cette capacité déjà prouvée au
> périmètre spécifique EP-17 avant Lot 1, conformément à `gate-06A-devsecops.md` (« Gate 06A
> valide la capacité du dispositif »). **La section 6 est volontairement laissée non renseignée
> par Claude Code** — seul le Product Owner peut la compléter.

## 1. Identification

* ID décision : `GATE-06A-EP17-LOT1-2026-07-31`
* Projet : LoyerTracker
* Gate ou jalon évalué : Gate 06A — DevSecOps Readiness (`docs/cgpa/gates/gate-06A-devsecops.md`)
* Phase : EP-17, avant Lot 1 (Fondation technique)
* Environnement source et cible : Aucun — aucune promotion en cours, capacité de dispositif uniquement
* Artefact, version, commit ou digest : Aucun artefact EP-17 candidat (aucune dépendance installée, `plan-execution-ux-ui-primeng-keycloak.md` non approuvé)
* Date : 2026-07-31
* Décision précédente référencée : `gate-06A-decision.md` (GO ratifié le 2026-06-16, périmètre projet général, DSO-01→05 automatisés)

## 2. Périmètre et applicabilité

* Contrôles applicables : critères GO de `gate-06A-devsecops.md`, appliqués au périmètre EP-17/Lot 1.
* Exemptions justifiées : aucune.
* Contrôles non exécutés : `DEVSECOPS-07` (aucun artefact EP-17 candidat), `CHECK-CICD-01` (jalon futur, promotion), `STG-ISOL-01` (jalon futur, Lot 4 Keycloak sur `ai-test-server`).

## 3. Preuves et résultats

| Contrôle | Résultat | Preuve | Criticité | Validité |
| --- | --- | --- | --- | --- |
| Capacité Gate 06A (dispositif, périmètre EP-17) | **PASS sous réserve** | `docs/cgpa/checklists/CHECK-DEVSECOPS-01-ep17-lot1-readiness.md` | Bloquant pour l'entrée en Lot 1 | 2026-07-31 |
| DEVSECOPS-07 (artefact EP-17) | Non exécuté | — | Non bloquant pour Gate 06A lui-même | — |
| CHECK-CICD-01 (promotion EP-17) | Non exécuté | — | Jalon futur | — |
| STG-ISOL-01 (Staging partagé, Lot 4) | Non exécuté | — | Jalon futur | — |

## 4. Bloqueurs et réserves

| ID | Type | Impact | Autorité d'acceptation | Responsable | Échéance | Preuve attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CHECK-DEVSECOPS-01 §2 écart 1 | Bloqueur (entrée Lot 1 uniquement) | Rapport produit et licence choisie le 2026-07-31 : Community License PrimeUI, éligibilité confirmée par le Product Owner (auto-déclaration) | Product Owner | Product Owner (obtention clé), DevSecOps Lead (secret + rappel annuel) | Avant installation effective de PrimeNG | Clé de licence obtenue et gérée comme secret hors code | **Requalifié le 2026-07-31** — licence choisie et éligibilité confirmée ; reste ouvert : obtention effective de la clé (action externe hors CLI) |
| CHECK-DEVSECOPS-01 §2 écart 2 | Réserve non bloquante | `DEVSECOPS-07` non exécuté | Product Owner | DevSecOps Lead | Avant première promotion d'un artefact EP-17 | `DEVSECOPS-07` renseigné | Ouvert, jalon futur déjà tracé |
| CHECK-DEVSECOPS-01 §2 écart 4 | Réserve non bloquante | `STG-ISOL-01` non réexécuté pour EP-17 | Product Owner | DevSecOps Lead | Avant promotion Staging du Lot 4 | `STG-ISOL-01` complétée | Ouvert, jalon futur déjà tracé |

## 5. Avis spécialisés

| Agent | Avis | Réserves |
| --- | --- | --- |
| DevSecOps Lead (Claude Code, désigné 2026-07-31) | PASS sous réserve (`CHECK-DEVSECOPS-01-ep17-lot1-readiness.md`) | Réserve bloquante unique pour Lot 1 : rapport licence/sécurité PrimeNG non produit |
| Delivery Architect | Non consulté dans ce cycle — hors périmètre de l'instruction reçue (rôle non désigné pour EP-17) | — |
| Enterprise Architect | Non consulté dans ce cycle — hors périmètre de l'instruction reçue (rôle non désigné pour EP-17) | — |

* Decision specialisee Release Manager, si applicable : Non applicable — aucun artefact candidat à une release.

## 6. Décision finale

* Décision du CGPA Chief Delivery Officer : **PASS sous réserve** (équivalent GO sous réserve) — décision explicite du Product Owner (jptshilombo@gmail.com), 2026-07-31, alignée sur l'avis DevSecOps Lead.
* Justification : le dispositif CI/CD existant (Gate 06A GO ratifié le 2026-06-16, DSO-01→05 automatisés) couvre déjà génériquement l'ajout de PrimeNG via les jobs `frontend`/`security` de `.github/workflows/ci.yml` ; le thème Keycloak prévu ne construit aucune image custom (fichiers statiques montés sur l'image upstream) et n'introduit donc aucun écart de pipeline.
* Validité : jusqu'à la levée de la réserve bloquante (rapport licence/sécurité PrimeNG) ou jusqu'à toute évolution du périmètre EP-17 non couverte par le dispositif actuel (ex. nouvelle image conteneur, nouveau composant nécessitant un contrôle de sécurité non prévu).
* Conditions d'invalidation : découverte d'un écart de pipeline non identifié ici, exposition de secret, ou dépendance critique non surveillée.
* Prochaine action autorisée : produire le rapport de compatibilité/licence/sécurité PrimeNG avant toute installation effective de la dépendance. **Cette décision ne suffit pas, à elle seule, à autoriser le Lot 1** : celui-ci reste également subordonné à la décision Gate 04A (NO GO en l'état, `gate-04A-decision-ep17-lot0.md`, 2026-07-31) et à l'approbation explicite du Plan d'Exécution.

## 7. Traçabilité

* Mise à jour `/docs/project-state.md` : entrée de décision ajoutée le 2026-07-31.
* Responsable de la décision : Product Owner (jptshilombo@gmail.com), CGPA Chief Delivery Officer.
* Date de validation humaine : 2026-07-31.
