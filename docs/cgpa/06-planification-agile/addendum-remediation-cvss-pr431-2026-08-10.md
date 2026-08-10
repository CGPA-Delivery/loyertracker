# Addendum CGPA — remédiation CVSS post-fusion PR #431

**Date :** 2026-08-10

**Statut :** autorisé par instruction explicite du CDO après fusion accidentelle de PR #431

**Branche corrective :** `fix/security-remediation-pr431-post-merge`

**Base :** `main` / merge commit `f32881766c46a7c6dd22cb0aa1dbbabfd7283ef7`

## Constat

Le rapport OWASP Dependency-Check du run CI `31394252410` a signalé deux avis à haute criticité dans le graphe npm complet. Le job est informatif ; sa réussite ne constitue pas une acceptation de risque.

| Paquet | Avis | Version observée | Correctif minimal |
|---|---|---:|---:|
| `playwright` / `playwright-core` | `GHSA-7mvr-c777-76hp` | `1.54.2` | `1.55.1` |
| `ip-address` transitif | `GHSA-mwp4-54f8-5fhr` | `10.2.0` | `10.3.1` |

## Décision technique

1. Conserver l’approche Playwright/axe de US-136 mais relever strictement `@playwright/test`, `playwright` et `playwright-core` à `1.55.1`, première version corrigée.
2. Appliquer l’override npm `ip-address@10.3.1` afin de ne pas mettre à niveau Angular CLI, MCP SDK ou `express-rate-limit` hors périmètre.
3. Rejouer lint, contrat de thème, CI complète et audit E2E. Aucun contournement TLS ou changement de realm/OIDC n’est autorisé.

## Périmètre exclu

Pas de rollback ou réécriture de la fusion `f328817`, pas de changement applicatif, Keycloak, Staging, Production, secret persistant, URI de redirection, migration ou publication d’artefact.

## Critères de clôture de la remédiation

- le graphe npm ne contient ni `playwright`/`playwright-core < 1.55.1`, ni `ip-address < 10.3.1` ;
- les avis `GHSA-7mvr-c777-76hp` et `GHSA-mwp4-54f8-5fhr` ne sont plus signalés par le rapport SCA de la PR corrective ;
- CI complète et Accessibilité E2E PASS sur le SHA de la PR corrective ;
- revue humaine CGPA avant fusion.
