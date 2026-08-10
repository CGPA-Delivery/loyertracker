# Rapport d’audit accessibilité — EP-17 / US-136

**Date :** 2026-08-10T10:06:41Z  
**Branche d’évidence :** `qa/ep17-us136-accessibility-audit`  
**Périmètre :** validation WCAG 2.2 AA du pilote EP-17, sans changement applicatif ni promotion d’environnement.

## Verdict

**NO GO technique pour clôturer EP-17 / US-136.**

La non-régression Frontend est confirmée, mais l’acceptation US-136 exige un audit automatisé et manuel clavier des parcours pilote. Les preuves ne sont pas réunies et un défaut de contraste Keycloak a été diagnostiqué.

## Éléments vérifiés

| Contrôle | Commande / observation | Résultat |
|---|---|---|
| État Git après nettoyage | `git status --short --branch` | PASS — branche propre avant création de cette branche documentaire |
| Lint Angular | `cd frontend && npm run lint` | PASS — `All files pass linting.` |
| Tests Angular | `CHROME_BIN=/usr/bin/google-chrome npm test -- --watch=false --browsers=ChromeHeadlessNoSandbox` | PASS — **223/223 SUCCESS** |
| Navigation navigateur contrôlé | URL OIDC locale | BLOQUÉ — `net::ERR_CERT_AUTHORITY_INVALID` ; aucune dérogation TLS utilisée comme preuve |
| Audit axe-core exploratoire | Thème Keycloak rendu localement | Diagnostic : `.instruction` à `#72767b` sur `#111827` = **3,88:1** (< 4,5:1, SC 1.4.3) ; absence de landmark principal détectée dans le template hérité |

## Revue croisée indépendante

Deux avis secondaires indépendants ont été recueillis avant la décision :

| Rôle | Avis | Impact |
|---|---|---|
| UX / Accessibilité | Le correctif de contraste proposé est minimal ; l’approche de landmark doit être prouvée runtime sur les six flux Keycloak | Aucun PASS sans preuve navigateur complète |
| Qualité / Outillage | Les scripts axe temporaires étaient exploratoires : URL et Chrome codés en dur, pas de session OIDC authentifiée, dépendances non prévues dans le Lot 5 | Outillage retiré ; aucun résultat axe ne vaut clôture CGPA |

## Décision de périmètre

Le Plan d’Exécution Lot 5 précise qu’il s’agit de validation, sans nouvelle dépendance ni nouveau code. Les essais locaux `axe-core` / Puppeteer, scripts de diagnostic et modifications CSS/JS du thème ont donc été explicitement supprimés après validation PO. Cette décision conserve le dépôt conforme au périmètre approuvé.

## Conditions de reprise

1. Statuer une extension de périmètre pour le correctif Keycloak si le Product Owner autorise une correction applicative ciblée.
2. Mettre à disposition un environnement de test qui respecte TLS et l’URI OIDC (sans assouplir ces contrôles pour les preuves).
3. Auditer les six écrans Keycloak et les parcours Angular authentifiés avec comptes de test injectés de façon non secrète dans le runner.
4. Réaliser la matrice manuelle clavier/focus/zoom/reflow ; mettre à jour `CHECK-ACCESSIBILITY-01 — EP-17 / US-136` à partir de résultats reproductibles.

## Non-actions explicites

Aucun changement de produit, migration, secret, provider, Staging ou Production n’a été réalisé. Les Gates existants ne sont ni rejoués ni modifiés par ce rapport.

## Addendum — preuve CI isolée du login Keycloak (2026-08-10T13:35:29Z)

La branche `feat/ep17-us136-accessibility-reserve-closure`, SHA `1767be79567fa1257bd8bf196b475e8e6411708f`, a fait l’objet d’une exécution GitHub Actions complète : CI `31393393832`, job `Accessibilité E2E (Playwright + axe)` `93470300794`.

| Élément | Preuve vérifiée | Résultat |
|---|---|---|
| Isolation et TLS | Stack Docker éphémère ; CA `localhost` générée au run et importée dans NSS/Chromium ; aucun bypass de certificat | PASS |
| Audit runtime | Playwright `1.54.2`, axe `4.10.2`, Chromium ; écran login Keycloak réel | **1 passed (2.8s)** |
| Contrôles axe bloquants | Landmark principal natif ; filtre des violations `serious` et `critical` | PASS — aucune violation bloquante |
| Preuve téléchargeable | Artifact GitHub `9064684806` ; SHA-256 `7549d5aef8e9f1f0e61bd29e0c0c327ad681c3406ca52be4436105b2c7256523` ; 30 jours | PASS |

Les correctifs ont retiré le contraste non conforme, ajouté le landmark principal natif et supprimé les `tabindex` positifs de l’upstream Keycloak 24.0.5. La surcharge `login.ftl` a été comparée à l’upstream : seuls ces attributs ont été retirés.

### Portée exacte de la preuve

Cette exécution ne clôt pas US-136 : elle couvre **le seul écran login Keycloak**, sans session Angular authentifiée. Les flux mot de passe oublié, réinitialisation, session expirée, accès refusé et logout, ainsi que la matrice manuelle clavier/focus/zoom/reflow/reduced-motion, restent à exécuter et à tracer. Verdict maintenu : **NO GO de clôture US-136**, avec réserve technique partiellement levée par preuve automatisée CI.
