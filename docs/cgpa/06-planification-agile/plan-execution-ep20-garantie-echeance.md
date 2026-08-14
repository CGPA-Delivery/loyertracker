# Plan d’Exécution CGPA — EP-20 : Paiement d’une échéance par garantie locative

> **Pour Hermes :** appliquer TDD strict pour chaque tâche applicative après approbation PO/CDO.

**Date :** 2026-08-13
**État :** **GO PO/CDO documenté — démarrage applicatif uniquement après fusion humaine de la décision EP-20**
**Référentiel :** CGPA v6.1.1 ; ADR-14 (ledger), ADR-15 (quittance), ADR-18 (Outbox/Twilio).
**Branche analysée :** `main` / `0161a16d00c4`; URL historique demandée `jptshilombo/loyertracker` redirigée vers l’organisation canonique `CGPA-Delivery/loyertracker` au même SHA.
**Production observée :** release applicative `v1.17.0-rc.1` (artefacts `sha-d19c4fea`, Flyway 32); validations SMTP DD-EP17-14 en hypercare, donc aucune promotion EP-20 n’est autorisée.

## 1. Audit factuel

### Gouvernance et état
- CGPA actif : **v6.1.1** (migration documentaire v5.4.1 complétée); les mentions v5.x de `prod-state.md`/`staging-state.md` sont historiques.
- Dernière release Production explicitement clôturée : **1.16.0**; la release US-125 `1.17.0-rc.1` est `PRODUCTION_DEPLOYED` et la documentation SMTP récente maintient une hypercare séparée.
- Epic le plus récent attribué : **EP-19** (webhooks Resend, futur). EP-20 est donc disponible, sans collision. V32 est la dernière migration : la suivante serait **V33**, seulement si le design prouve une nécessité.
- Gates historiques et réserves sont préservés; aucune étape de ce plan n’autorise Staging/Production, activation Twilio, secrets, ni migration.

### Composants existants confirmés
| Domaine | Conforme existant |
|---|---|
| Garantie | `GarantieService.retenirSurLoyer`, `RetenueLoyerRequest`, `GarantieMovement`, `RETENUE_LOYER`, V21 `paiement.garantie_movement_id`, contrôles bail/bien/garantie, audit, recalcul honoraires. |
| Paiement | `Paiement.getResteDu()`, lien de mouvement, statuts `RECU`/`PARTIEL`; API/UI de retenue explicite. |
| Quittance | `QuittanceCertifieeService`, `DonneesQuittanceCertifiee`, `DocumentHtmlBuilder.construireQuittanceCertifiee`, HMAC/QR (`TokenQuittanceService`), PDF/hash/versions et accès public sécurisé. Le mode et montant garantie sont déjà dérivés. |
| Notifications | `NotificationOutboxService`, `NotificationDispatcher`, `NotificationProvider`, `TwilioNotificationProvider`, `GARANTIE_DEBITEE`, template WhatsApp approuvé seedé V28, préférences/opt-ins, budget, fallback SMS et callback Twilio signé/idempotent. |
| Isolation | contrôleurs ReBAC, `TenantContext`, RLS FORCE et tests d’intégration existent. |

## 2. Écarts prouvés

1. **Critique financier :** `GarantieService` contrôle correctement `montant <= paiement.getResteDu()`, mais décide `RECU` avec `retenue >= montantAttendu` et appelle `paiement.pointer(retenue, ...)`. Après un encaissement antérieur de 400 et une retenue de 600 sur 1 000, il écrase 400 par 600 et conclut `PARTIEL` au lieu de `RECU`.
2. **Concurrence et cardinalité métier :** aucune stratégie de verrou pessimiste/optimiste explicite n’est visible sur `Garantie` + `Paiement`. V21 a une FK/index mais pas de contrainte DB `UNIQUE` sur `paiement.garantie_movement_id`; le garde applicatif interdit actuellement plusieurs retenues. Le PO doit décider « une retenue » (contrainte DB + idempotence) ou « plusieurs retenues » (liaison append-only) avant code.
3. **Notification/ReBAC :** payload réel limité à `bailId,montant`; il n’apporte ni références complètes, ni soldes avant/après, ni statut, ni numéro/lien de quittance. En outre, V32 prévoit `notification_event.bien_id` pour l’historique gestionnaire fail-closed, mais l’émission actuelle ne le persiste pas. Le rendu Twilio est générique `clé=valeur`; `GARANTIE_DEBITEE` est seedé WhatsApp seulement, pas SMS/Email, donc le fallback ne peut pas être réputé complet.
4. **Document :** la quittance est interdite pour `PARTIEL`, conformément à ADR-15; aucun reçu partiel distinct n’existe. Le nom authentifié est `quittance-<periode>.pdf`, le public `quittance-certifiee.pdf`: nomenclature et parité manquantes.
5. **UI :** la retenue est explicite et affiche solde/reste dû, mais sans dialogue de confirmation projeté, résultat détaillé, lien/référence de quittance ni statut de livraison.
6. **Contrat :** `PaiementDto` n’expose ni mode, ni mouvement, ni informations de garantie/document/notification nécessaires à l’UI; les écritures d’audit sont limitées à cible paiement.

## 3. Conception cible et arbitrage

### Flux local atomique
1. Autoriser par tenant/ReBAC, charger paiement et garantie avec verrou de concurrence.
2. Calculer `resteAvant`; valider; calculer `montantRecuApres`, `resteApres`, `soldeGarantieApres`.
3. Insérer le mouvement append-only, mettre à jour le cache garantie, le paiement et la liaison dont la cardinalité a été approuvée, recalculer les honoraires, écrire audit riche.
4. Si `RECU`, émettre/récupérer la quittance ADR-15 de manière idempotente puis produire un unique événement `GARANTIE_DEBITEE` enrichi, avec `bien_id` persistant. Si `PARTIEL`, ne pas émettre une quittance intégrale.
5. Créer événement/Outbox dans la transaction; le Dispatcher seul appelle Twilio après commit, et seulement avec templates WhatsApp/SMS approuvés selon le canal/fallback.

### Arbitrage documentaire requis avant code
**Option décidée :** conserver strictement ADR-15 : quittance uniquement `RECU`; aucun document téléchargeable certifié pour `PARTIEL` dans EP-20. Un reçu partiel certifié est hors périmètre et ne pourra être étudié que dans une décision future distincte. V33 n’est pas réservée pour ce sous-flux; elle reste conditionnelle aux protections de persistance réellement nécessaires et à leur test sur base fraîche.

### Fichier PDF
Créer `QuittanceFilenameFactory`, composant pur. Entrées : période `YYYY-MM`, UUID locataire/paiement, numéro permanent; nettoyage allow-list ASCII/`-`; UUID8 déterministes, plus numéro permanent préservé. Les UUID complets restent en base/audit. Le contrôleur authentifié et le contrôleur public récupèrent la même métadonnée de quittance puis appellent la même factory.

## 4. Périmètre

**Inclus après GO :** correction cumul paiement/garantie, verrouillage/idempotence, payload/rendu `GARANTIE_DEBITEE`, document intégral ou reçu partiel selon décision, noms de fichiers, contrat/API/UI, tests, documentation.

**Exclus :** recréation de modules, n8n/broker, appel direct Twilio, modification de migrations appliquées, provider activation, Staging/Production, envoi réel non autorisé, paiement en ligne.

## 5. Stories proposées

| ID | Story | Priorité |
|---|---|---|
| EP20-US01 | Imputation garantie cumulée et sûre sur le reste dû réel | Must |
| EP20-US02 | Traçabilité, cardinalité, audit et concurrence | Must |
| EP20-US03 | Notification détaillée Outbox WhatsApp/SMS `GARANTIE_DEBITEE` | Must |
| EP20-US04 | Quittance intégrale `RECU` et absence de document certifié `PARTIEL` | Must |
| EP20-US05 | Nomenclature PDF unifiée et sans PII | Must |
| EP20-US06 | Confirmation et résultat UI accessibles/responsives | Must |

## 6. Exécution TDD proposée

### Tâche 1 — Décision documentaire préalable
**Fichiers :** créer addendum ADR/ADR-15 et Gate de conception; modifier backlog, matrice de traçabilité, `project-state.md`.
**Preuve :** approbation humaine explicite du présent plan et de l’option `PARTIEL`; sans elle, arrêt.

### Tâche 2 — Invariant financier (RED/GREEN)
**Fichiers probables :** `backend/.../garanties/GarantieService.java`, `paiements/Paiement.java`, repositories; test `S03PaiementsGarantiesIntegrationTest`.
**RED :** 400 déjà reçu + retenue 600 doit être `RECU`, reçu=1000, reste=0; cas retenue 200 => `PARTIEL`, reçu=600, reste=400.
**GREEN :** additionner au reçu courant et dériver statut du nouveau solde; ne jamais dépasser plafonds.
**Preuve EP20-US01 :** test RED observé puis GREEN au commit `f5727f2` : `300 + 550 = RECU`, reçu `850`, reste `0`; `S03PaiementsGarantiesIntegrationTest` et `mvn -q verify` PASS sur PostgreSQL Testcontainers/Flyway 32. PR applicative et revue humaine requises avant toute suite.
**Tests :** négatifs, double retry, concurrence, cross-bailleur, gestionnaire non affecté, invariant ledger.

### Tâche 3 — Idempotence/concurrence, cardinalité et audit
**Fichiers probables :** repositories verrouillés, `GarantieService`, modèle/audit et, seulement si validé, V33 additive.
**RED :** deux requêtes concurrentes ne créent qu’un mouvement/débit/Outbox; test de contrainte DB pour une retenue si ce choix est retenu, ou tests de lien append-only si plusieurs retenues sont approuvées.
**GREEN :** verrou ou contrôle de version choisi et testé; cardinalité imposée en DB selon décision; audit contextualisé sans PII/secret.

### Tâche 4 — Document et nom de téléchargement
**Fichiers :** créer `quittances/QuittanceFilenameFactory.java` + test; adapter `DocumentController`, `PublicQuittanceController`, quittance/HTML/tests.
**RED :** noms identiques entre endpoints, EUR/USD/CDF, caractères sûrs, QR/content_hash/pdf_hash, garantie retenue, distinction intégral/partiel.
**GREEN :** factory unique; conserver contrôle HMAC et absence d’oracle.

### Tâche 5 — Notification
**Fichiers :** `GarantieService`, `NotificationOutboxService`/événement, renderer/templates, migration additive uniquement si persistance/seed requis, tests notification/dispatcher/fallback.
**RED :** payload minimisé mais complet avec `bien_id` persistant, outbox unique, templates WhatsApp **et SMS** approuvés; absence consentement/téléphone/template/budget => aucun appel; indisponibilité Twilio => transaction financière commitée; historique gestionnaire affecté visible uniquement dans son périmètre.
**GREEN :** Outbox enrichie, résolution de variables sûre, fallback existant réutilisé et test du provider Twilio pour body/callback/préfixe WhatsApp/classification 4xx-429.

### Tâche 6 — API/UI et UX
**Fichiers :** DTO/contrat OpenAPI, `s03-api.service.ts`, `garanties-bail.component.ts` et specs.
**RED :** confirmation et calculs projetés, résultat non bloquant, états notification, a11y clavier/focus, viewports 360/390/640/1024.
**GREEN :** composants/design tokens existants; aucune logique d’autorité uniquement front.

### Tâche 7 — Validation et documentation
**Commandes prévues :** tests backend ciblés puis `mvn verify`; migration fraîche Testcontainers si V33; tests Angular ciblés puis suite complète/build; RLS/ReBAC, EP-12/14/16, Gitleaks/SCA/packaging CI.
**Gates ultérieurs :** PR+CI humaine → Gate 06A/CHECK-CICD-01 → Gate Staging avec STG-ISOL-01 → RC immutable → Gate 09/Production explicites. Aucun déploiement n’est autorisé par ce plan.

## 7. Migration et rollback

- **Migration : non décidée.** L’option recommandée de reçu partiel peut imposer **V33 additive**, jamais une modification de V20/V21/V22/V32.
- Précondition V33 : ADR/plan approuvés, test de migration fraîche, RLS FORCE, rollback applicatif/documenté, compatibilité ascendante.
- Rollback : aucun débit ni ledger ne sera supprimé; seulement écritures compensatoires régies par Financial Governance. Le rollback applicatif ne modifie jamais une quittance émise.

## 8. Risques et mitigations

| Risque | Niveau | Mitigation |
|---|---|---|
| Sous/sur-comptage après paiement classique préalable | Critique | TDD cumulatif + tests intégration + invariant ledger. |
| Double débit concurrent | Critique | verrouillage + idempotence DB/test concurrent. |
| Quittance trompeuse pour PARTIEL | Élevé | décision explicite reçu partiel avant code. |
| PII/token dans Outbox ou logs | Élevé | payload d’IDs/valeurs minimales, `bien_id` persistant pour ReBAC, tests de redaction. |
| Historique gestionnaire incomplet | Élevé | persister `notification_event.bien_id` et tests gestionnaire affecté/hors périmètre. |
| Fallback SMS inexploitable | Élevé | templates SMS approuvés et tests de disponibilité avant activation. |
| Notification facturée en double | Élevé | Outbox unique, SKIP LOCKED, callback/fallback idempotents. |
| Écart UX/accessibilité | Moyen | Gate design/UI et preuves responsive/a11y avant promotion. |

## 9. Décision CGPA

**GO / EP20_IMPLEMENTATION_READY documenté, effectif après fusion humaine de la présente décision.** Les conditions de déclenchement sont satisfaites : décision `PARTIEL` (aucun document certifié), cardinalité (une retenue par échéance), `bien_id`/templates notification et renommage anti-collision `EP20-US01→EP20-US06`. L’autorisation couvre seulement le développement contrôlé et tests locaux/CI; elle n’autorise ni Staging, ni Production, ni activation fournisseur, ni secret.

## 10. Clôture additive EP20-US03 (2026-08-14)

**État : `CLOSE` — intégré sur `main`.** La story Must `EP20-US03` est livrée par les PR #484 (persistance transactionnelle de `bien_id`, ReBAC fail-closed) et #485 (template SMS/fallback fermé), merges `5c8c2c8` et `b76b3dc`. La preuve inclut RED observé sans template, scénarios négatif/positif d’unicité, `NotificationDispatchIntegrationTest`, `mvn -q verify`, Flyway 34 migrations et CI complète SUCCESS.

V34 est additive et se limite au seed `GARANTIE_DEBITEE / SMS / fr` approuvé/actif. Le contrat de dépôt est à 34 ; l'état Flyway Production n'est pas modifié. Aucun provider, secret, envoi réel, Staging ou Production n'est autorisé ou réalisé par cette clôture.

## 11. Avancement additif EP20-US04 (2026-08-14)

**État : `CANDIDAT_REVUE_LOCALE` — non intégré.** La politique PO/CDO privilégie l’intégrité financière : lorsqu’un débit de garantie fait passer un paiement à `RECU`, l’émission automatique est tentée seulement si le profil bailleur satisfait la précondition documentaire d’adresse. Sans adresse, la retenue et le passage `RECU` restent validés, aucune quittance n’est créée et l’émission reste disponible après correction du profil.

ADR-15 est conservé strictement : `PARTIEL` retourne `409` pour le téléchargement et ne crée aucune quittance; un `RECU` issu d’une retenue, avec profil complet, crée exactement une quittance `EMISE` liée au paiement. Preuves : `S03PaiementsGarantiesIntegrationTest`, `QuittanceCertifieeIntegrationTest` et `mvn -q verify` PASS sur Flyway 34. Commits locaux `57e0391`, `a8c555b`, `fde5965`; PR, CI et revue humaine restent requis. Aucun Staging, Production, provider, secret ou envoi réel.

## 12. Clôture additive EP20-US04 (2026-08-14)

**État : `CLOSE` — intégré sur `main`.** PR #487 fusionnée via `d3c9b6d`; CI complète SUCCESS. ADR-15 est confirmé par les preuves négative (`PARTIEL` : `409`, `0` quittance) et positive (`RECU` après retenue, profil complet : exactement une quittance `EMISE`). La précondition documentaire ne bloque jamais le débit financier : sans adresse bailleur, la retenue et `RECU` persistent, la quittance reste réémissible après correction.

`mvn -q verify` est PASS avec Flyway 34. Build/scan/SBOM Docker est SUCCESS; publication/signatures est `SKIPPED` attendu après classifieur sans changement image. Aucun Staging, Production, provider, secret ou envoi réel. Référence : `cloture-ep20-us04-quittance-certifiee-2026-08-14.md`; tout travail EP20 suivant requiert un GO PO/CDO séparé.

## 13. Avancement additif EP20-US05 (2026-08-14)

**État : `CLOSE` — intégré sur `main`.** PR #489 fusionnée via `d911044`; CI complète SUCCESS. Les endpoints quittance authentifié et public utilisent `QuittanceFilenameFactory` et servent `quittance-certifiee-YYYY-MM.pdf`. La période vient du contenu certifié après contrôle HMAC/intégrité sur le flux public ; aucune PII n’est exposée. La factory n’accepte que `YYYY-MM`, bloquant l’injection de chemin/caractères dangereux.

Preuves TDD : RED noms divergents et période hostile, puis GREEN. `DocumentGenerationIntegrationTest`, `PublicQuittanceIntegrationTest`, `QuittanceFilenameFactoryTest`, `QuittanceTelechargeeTest` et `mvn -q verify` sont PASS sur Flyway 34. Le `404` public indifférencié est préservé. Build/scan/SBOM Docker SUCCESS; publication/signatures `SKIPPED` attendue après classifieur vert. Référence : `cloture-ep20-us05-nomenclature-pdf-2026-08-14.md`. Aucun Staging, Production, provider, secret ou envoi réel; toute suite exige un GO PO/CDO distinct.
