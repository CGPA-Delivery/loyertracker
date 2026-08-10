# Analyse des endpoints Backend sans appel Angular direct — LoyerTracker

**Date :** 2026-08-10  
**Mode :** audit statique lecture seule du code + rédaction documentaire  
**Release protégée :** `v1.17.0-rc.1` en Production / hypercare  
**Références lues :**
- `docs/project-state.md` — release `v1.17.0-rc.1` Production déployée, aucun code/migration/déploiement autorisé hors décision explicite.
- `docs/cgpa/06-planification-agile/audit-endpoints-backend-orphelins-2026-08-10.md`.
- `docs/cgpa/06-planification-agile/audit-backend-frontend-api-2026-08-09.md`.
- `docs/cgpa/04-cahier-des-charges/cahier-des-charges.md`.

## Synthèse exécutive

Aucun endpoint ne doit être supprimé sur la seule base de l'absence d'appel Angular direct. L'analyse révèle toutefois deux points à traiter :

1. **RGPD** : `GET /api/bailleurs/export` et `DELETE /api/locataires/{id}/effacement` ont une utilité utilisateur directe et devraient être exposés dans un parcours Angular « Confidentialité / RGPD ».
2. **Locataire archivage** : `DELETE /api/locataires/{id}` n'est pas une suppression physique ; le code backend archive logiquement. L'Angular actuel appelle `POST /api/locataires/{id}/archivage`, non exposé par `LocataireController` : c'est un écart de contrat à corriger côté Frontend ou via alias backend gouverné.

Les callbacks fournisseurs, le dispatch batch et Actuator sont légitimes sans UI Angular standard. Une correction documentaire est nécessaire : le webhook Resend réel est `POST /api/public/notifications/resend/callback`, pas `/api/public/resend/callback`.

## Tableau récapitulatif

| # | Endpoint réel | Contrôleur / config | Utilité | Recommandation | Priorité | Impact CDC |
|---|---|---|---|---|---|---|
| 1 | `POST /api/batch/notifications` | `BatchController` | Exploitation / tests / relance outbox | **INTÉGRER_INDIRECT** | Moyenne | Ajouter contrat d'exploitation/runbook ; pas écran bailleur standard |
| 2 | `POST /api/public/notifications/callback` | `TwilioCallbackController` | Callback fournisseur Twilio | **CONSERVER** | Basse | Documenter comme intégration externe non-UI |
| 3 | `POST /api/public/notifications/resend/callback` | `ResendCallbackController` | Callback fournisseur Resend/Svix | **CONSERVER** | Basse | Corriger le chemin dans audit/CDC ; EP-19 pour validation réelle |
| 4 | `GET /api/bailleurs/export` | `RgpdController` | Droit d'accès RGPD du bailleur | **INTÉGRER_DIRECT** | Haute | Ajouter US UI « Exporter mes données » |
| 5 | `DELETE /api/locataires/{id}/effacement` | `RgpdController` | Droit à l'effacement RGPD | **INTÉGRER_DIRECT** | Haute | Ajouter US UI « Effacer/anonymiser locataire » |
| 6 | `DELETE /api/locataires/{id}` | `LocataireController` | Archivage logique locataire | **INTÉGRER_DIRECT** | Haute | Corriger contrat EP-15 Frontend ; ce n'est pas suppression physique |
| 7 | `/api/actuator/health`, `/api/actuator/info`, `/api/actuator/prometheus` | `SecurityConfig` + `application.yml` + Nginx | Ops / monitoring | **CONSERVER** | Basse | Formaliser contrat Ops ; pas UI Angular |

> Note : l'audit parle parfois d'Actuator sous `/actuator/...`; dans cette application le `base-path` Spring est `/api/actuator` (`backend/src/main/resources/application.yml:46-55`).

---

## Fiches d'analyse

### 1. `POST /api/batch/notifications`

- **Contrôleur :** `backend/src/main/java/com/loyertracker/batch/BatchController.java:17-75`.
- **Méthode :** `traiterNotifications()` exposée par `@PostMapping("/notifications")` sous `@RequestMapping("/api/batch")` (`BatchController.java:69-73`).
- **Autorisation :** `@PreAuthorize("hasRole('BAILLEUR')")` (`BatchController.java:70-72`).
- **Fonction exacte :** déclenche manuellement le dispatch de l'Outbox notifications via `notifications.traiterLot(limiteParBailleur)` et renvoie le nombre de lignes traitées (`BatchController.java:46-47`, `72-73`). La limite vient de `app.notifications.dispatch.limite-par-bailleur` (`BatchController.java:27-34`, `application.yml:146-150`).
- **Pourquoi pas d'Angular aujourd'hui :** l'audit 2026-08-10 le classe « Exploitation/tests uniquement » (`audit-endpoints-backend-orphelins-2026-08-10.md:41`). Le dispatch normal existe aussi par polling scheduler (`application.yml:146-148` mentionne le sondage Outbox).
- **Utilité utilisateur humain :** faible pour un bailleur standard ; un bouton « relancer les notifications » pourrait créer des effets globaux/coûts si exposé sans garde-fou.
- **Utilité automatisée / conformité :** utile pour reprise d'exploitation, tests, smoke, relance contrôlée de l'Outbox.
- **Analyse sécurité :** le rôle `BAILLEUR` est large pour une action batch d'exploitation. Le commentaire indique des jobs « idempotents et multi-bailleur » (`BatchController.java:13-15`) ; si l'action est réellement globale, elle ne devrait pas être banalisée dans l'UI bailleur.
- **Recommandation :** **INTÉGRER_INDIRECT** — conserver le backend, ne pas l'ajouter dans Angular standard. L'intégrer via runbook Ops, smoke contrôlé ou future console Admin/Ops avec rôle dédié si le produit ajoute une administration interne.
- **Écran/parcours si intégré indirectement :** pas de parcours bailleur ; éventuel écran futur « Administration / Notifications / Relance Outbox » sous rôle Admin/Ops non présent aujourd'hui.
- **Impact CDC :** améliorer `docs/cgpa/04-cahier-des-charges/cahier-des-charges.md` §5.3/§5.4 pour distinguer jobs planifiés, relance manuelle d'exploitation, rôle autorisé et garde-fous coût/budget.

### 2. `POST /api/public/notifications/callback` — Twilio

- **Contrôleur :** `backend/src/main/java/com/loyertracker/notifications/TwilioCallbackController.java:26-58`.
- **Méthode :** `recevoirCallback(...)`, `@PostMapping(path = "/callback", consumes = application/x-www-form-urlencoded)` sous `/api/public/notifications` (`TwilioCallbackController.java:27`, `42-45`).
- **Autorisation :** non authentifié par design ; whitelist `SecurityConfig.java:62-66`, `permitAll` sur `POST /api/public/notifications/callback`.
- **Fonction exacte :** vérifie `X-Twilio-Signature`, extrait `MessageSid`, `MessageStatus`, `ErrorCode`, puis applique le statut de livraison (`TwilioCallbackController.java:43-56`).
- **Sécurité :** signature Twilio obligatoire (`TwilioCallbackController.java:47-49`), réponse indifférenciée documentée (`TwilioCallbackController.java:18-24`), rate-limit Nginx sur `/api/public/` (`infra/nginx/nginx.conf:46-52`, `105-114`). Tests d'intégration : signature invalide rejetée sans effet de bord (`NotificationDispatchIntegrationTest.java:213-226`) et signature valide faisant progresser le statut (`NotificationDispatchIntegrationTest.java:231-239`).
- **Pourquoi pas d'Angular aujourd'hui :** callback fournisseur serveur-à-serveur ; aucune interaction utilisateur directe.
- **Utilité utilisateur humain :** aucune UI directe ; résultat visible indirectement dans historique notifications si exposé.
- **Utilité automatisée / conformité :** indispensable à la délivrabilité et à l'audit des notifications.
- **Recommandation :** **CONSERVER** — absence d'UI légitime.
- **Impact CDC :** l'ancien CDC MVP excluait les intégrations externes (`cahier-des-charges.md:162-164`), mais EP-16 les a ajoutées. Ajouter une section additive CDC/Backlog notifications pour formaliser le callback Twilio, sa signature et son absence d'UI.

### 3. `POST /api/public/notifications/resend/callback` — Resend/Svix

- **Contrôleur :** `backend/src/main/java/com/loyertracker/notifications/ResendCallbackController.java:26-63`.
- **Méthode :** `recevoirCallback(...)`, `@PostMapping(path = "/resend/callback", consumes = application/json)` sous `/api/public/notifications` (`ResendCallbackController.java:27`, `41-46`).
- **Endpoint réel :** **`/api/public/notifications/resend/callback`**. L'intitulé `/api/public/resend/callback` dans la demande/l'audit est inexact.
- **Autorisation :** non authentifié par design ; whitelist `SecurityConfig.java:67-71`, `permitAll` sur `POST /api/public/notifications/resend/callback`.
- **Fonction exacte :** vérifie la signature Svix (`svix-id`, `svix-timestamp`, `svix-signature`) sur le corps brut, parse le payload, exige `data.emailId` et `type`, puis applique le statut Resend (`ResendCallbackController.java:42-61`).
- **Sécurité :** HMAC Svix sur corps brut documenté (`ResendCallbackController.java:16-24`), rate-limit Nginx `/api/public/` (`infra/nginx/nginx.conf:46-52`, `105-114`). Tests : signature invalide rejetée (`ResendCallbackIntegrationTest.java:95-113`), timestamp ancien rejeté (`ResendCallbackIntegrationTest.java:115-136`), transitions de statut testées (`ResendCallbackIntegrationTest.java:139-171`). Limite connue : cohérence interne testée, webhook Resend réel non prouvé (`ResendCallbackIntegrationTest.java:47-49`).
- **Pourquoi pas d'Angular aujourd'hui :** webhook fournisseur serveur-à-serveur.
- **Utilité utilisateur humain :** pas de UI directe ; effet indirect dans historique de livraison.
- **Utilité automatisée / conformité :** délivrabilité email, audit opérationnel, traitement des bounces/plaintes.
- **Recommandation :** **CONSERVER** — absence d'UI légitime. Prévoir validation fournisseur réelle en EP-19.
- **Impact CDC :** corriger le chemin dans les documents d'audit/CDC additif ; rattacher l'opérationnel réel à EP-19 (`matrice-tracabilite-story-bug-2026-08-09.md:30-31`).

### 4. `GET /api/bailleurs/export` — export RGPD

- **Contrôleur :** `backend/src/main/java/com/loyertracker/rgpd/RgpdController.java:19-46`.
- **Méthode :** `exporter(Authentication)`, `@GetMapping("/bailleurs/export")` (`RgpdController.java:29-33`).
- **Autorisation :** `@PreAuthorize("hasRole('BAILLEUR')")` (`RgpdController.java:30-32`).
- **Fonction exacte :** export JSON complet scopé bailleur via `RgpdService.exporter(authentication)` (`RgpdController.java:29-33`). Le service active le tenant depuis le JWT (`RgpdService.java:71-75`) et exporte biens, baux, paiements, garanties/mouvements, affectations et quittances certifiées (`RgpdService.java:76-149`).
- **Couverture Angular actuelle :** aucun appel trouvé dans `frontend/src/app`; `S02ApiService` ne contient pas d'export bailleur (`frontend/src/app/core/s02/s02-api.service.ts:192-317`).
- **Pourquoi pas d'Angular aujourd'hui :** Sprint 6 a livré l'API et les tests ; le CDC exige le droit RGPD mais ne décrit pas encore un écran « confidentialité ».
- **Utilité utilisateur humain :** forte. Un bailleur doit pouvoir obtenir ses données sans intervention technique.
- **Utilité automatisée / conformité :** obligatoire au titre ENF-04 : « une demande d'export ... export des données du bailleur » (`cahier-des-charges.md:132`) et product backlog US-70 (`product-backlog.md:140`).
- **Tests / preuves :** export sans JWT 401 (`RgpdIntegrationTest.java:157-160`), gestionnaire 403 (`RgpdIntegrationTest.java:163-167`), export avec données (`RgpdIntegrationTest.java:82-99`, `117-148`).
- **Recommandation :** **INTÉGRER_DIRECT** — ajouter méthode Angular typée + bouton « Exporter mes données » dans un écran compte/profil/confidentialité bailleur, téléchargement JSON horodaté.
- **Epic/US proposée :** EP « Compte & conformité » ou addendum EP-15/EP-08, US « En tant que bailleur, je télécharge mon export RGPD depuis l'interface ».
- **Impact CDC :** préciser que le droit d'accès RGPD n'est pas seulement un endpoint API ; il doit avoir un parcours utilisateur authentifié avec UX, confirmation, format et journalisation.

### 5. `DELETE /api/locataires/{id}/effacement` — effacement RGPD

- **Contrôleur :** `backend/src/main/java/com/loyertracker/rgpd/RgpdController.java:36-45`.
- **Méthode :** `anonymiserLocataire(UUID, Authentication)`, `@DeleteMapping("/locataires/{locataireId}/effacement")` (`RgpdController.java:40-44`).
- **Autorisation :** `@PreAuthorize("hasRole('BAILLEUR')")` (`RgpdController.java:40-43`).
- **Fonction exacte :** anonymise les PII du Locataire et trace `EFFACEMENT_LOCATAIRE`; les données financières restent conservées. `RgpdService.anonymiserLocataire` active le tenant via JWT, charge le locataire RLS-scopé, appelle `locataire.anonymiser()`, puis écrit l'audit (`RgpdService.java:152-171`).
- **Couverture Angular actuelle :** aucun appel trouvé dans `frontend/src/app`; le détail Locataire expose archiver/restaurer mais pas effacer/anonymiser (`locataire-detail.component.ts:79-86`, `205-222`).
- **Pourquoi pas d'Angular aujourd'hui :** API conformité livrée, UI non ajoutée.
- **Utilité utilisateur humain :** forte mais destructive sur PII ; doit être volontaire et encadrée.
- **Utilité automatisée / conformité :** obligatoire RGPD, ENF-04 (`cahier-des-charges.md:132`) et US-70/US-114 (`RgpdController.java:36-39`, `product-backlog.md:140`).
- **Tests / preuves :** anonymisation + conservation financier (`RgpdIntegrationTest.java:174-194`), export reflète anonymisation (`RgpdIntegrationTest.java:196-211`), cross-bailleur 404 (`RgpdIntegrationTest.java:214-227`), gestionnaire 403 (`RgpdIntegrationTest.java:230-234`), sans JWT 401 (`RgpdIntegrationTest.java:237-240`).
- **Recommandation :** **INTÉGRER_DIRECT** — ajouter action « Effacer/anonymiser les données personnelles » sur fiche Locataire ou écran conformité, avec double confirmation, mention d'irréversibilité, désactivation si locataire déjà anonymisé, rafraîchissement de la fiche et de l'historique.
- **Epic/US proposée :** US RGPD complémentaire : « En tant que bailleur, je peux anonymiser un locataire depuis sa fiche pour répondre au droit à l'effacement ».
- **Impact CDC :** enrichir ENF-04 / US-70 avec parcours utilisateur, garde-fous UX, preuve d'audit et critères d'acceptation 401/403/404/cross-tenant.

### 6. `DELETE /api/locataires/{id}` — archivage logique Locataire

- **Contrôleur :** `backend/src/main/java/com/loyertracker/locataires/LocataireController.java:27-84`.
- **Méthode :** `archiver(UUID, Authentication)`, `@DeleteMapping("/{id}")` (`LocataireController.java:70-72`).
- **Autorisation :** `@PreAuthorize("hasRole('BAILLEUR')")` au niveau classe (`LocataireController.java:27-30`), avec RLS bailleur selon le service (`LocataireService.java:20-24`).
- **Fonction exacte :** **archivage logique**, pas suppression physique. Le service charge le locataire, appelle `l.archiver()`, trace `ARCHIVER_LOCATAIRE`, et renvoie le DTO (`LocataireService.java:98-104`). L'entité a une `date_archivage` (`Locataire.java:78-79`).
- **Couverture Angular actuelle :** le composant existe et propose « Archiver » / « Restaurer » (`locataire-detail.component.ts:79-85`, `205-222`), mais le service Angular appelle **`POST /api/locataires/{id}/archivage`** (`s02-api.service.ts:306-308`, spec `s02-api.service.spec.ts:216-220`). Aucun endpoint backend correspondant n'existe ; le backend expose `DELETE /api/locataires/{id}`.
- **Pourquoi pas d'Angular direct :** écart de contrat HTTP, pas absence fonctionnelle. L'audit post-EP-15 a probablement classé à tort `DELETE /api/locataires/{id}` comme non couvert car Angular utilise un chemin/méthode différents.
- **Utilité utilisateur humain :** forte ; l'archivage est une action de cycle de vie standard déjà présente dans l'UI.
- **Utilité automatisée / conformité :** non RGPD ; conservation historique et audit métier.
- **Recommandation :** **INTÉGRER_DIRECT** — corriger le contrat. Option préférée : changer `S02ApiService.archiverLocataire` en `this.http.delete<LocataireDetail>(/api/locataires/${id})` et adapter la spec. Option alternative : ajouter un alias backend `POST /{id}/archivage`, mais cela ajoute une surface inutile.
- **Suppression ?** Non. L'endpoint est utile et implémenté comme archivage logique. La qualification « suppression physique » est incorrecte.
- **Impact CDC :** préciser la distinction : archivage logique métier (`DELETE /api/locataires/{id}` aujourd'hui) versus effacement RGPD (`DELETE /api/locataires/{id}/effacement`). Le CDC devrait éviter le terme « suppression physique » pour ce endpoint.

### 7. Actuator — `/api/actuator/health`, `/api/actuator/info`, `/api/actuator/prometheus`

- **Configuration :** `backend/src/main/resources/application.yml:46-55` définit `management.endpoints.web.base-path: /api/actuator` et expose `health,info,prometheus`.
- **Sécurité applicative :** `SecurityConfig.java:49-54` autorise anonymement health/info/prometheus côté Spring ; prometheus est explicitement pensé pour scrape interne.
- **Protection réseau :** Nginx bloque publiquement `location = /api/actuator/prometheus { return 404; }` (`infra/nginx/nginx.conf:97-103`) puis proxy le reste `/api/` (`nginx.conf:116-123`). Healthcheck Compose utilise `http://localhost:8080/api/actuator/health` (`docker-compose.yml:162`, `docker-compose.staging.yml:188`). Prometheus scrape `metrics_path: /api/actuator/prometheus` (`infra/monitoring/prometheus.yml:23`).
- **Tests / preuves :** health public OK (`SecurityIntegrationTest.java:131-134`), prometheus non bloqué par Spring Security, jamais 401 (`SecurityIntegrationTest.java:137-146`).
- **Pourquoi pas d'Angular aujourd'hui :** contrat Ops/monitoring, pas fonctionnalité produit.
- **Utilité utilisateur humain :** pas pour un bailleur/gestionnaire. Éventuelle page status publique distincte, mais hors Angular applicatif courant.
- **Utilité automatisée / conformité :** essentielle pour healthchecks Docker, Prometheus, Gate Staging/Production et hypercare.
- **Recommandation :** **CONSERVER** — absence d'UI légitime. Ne pas intégrer dans Angular métier.
- **Impact CDC :** ajouter une annexe Ops/observabilité mentionnant `health`, `info`, `prometheus`, leurs expositions attendues et la règle : Prometheus interne uniquement, public 404 via Nginx.

---

## Priorisation proposée

### P0 / Haute — corriger ou intégrer côté Angular

1. **Corriger l'archivage Locataire** : aligner Angular sur `DELETE /api/locataires/{id}` ou créer un alias backend gouverné. Aujourd'hui l'UI semble appeler un endpoint absent.
2. **Ajouter export RGPD bailleur** : bouton/parcours Angular de téléchargement JSON.
3. **Ajouter effacement RGPD locataire** : action Angular encadrée par double confirmation.

### P1 / Moyenne — gouvernance / exploitation

4. **Clarifier le batch notifications** : conserver sans UI bailleur standard ; formaliser runbook et éventuellement rôle Admin/Ops futur. Revoir le choix `hasRole('BAILLEUR')` si l'action est globale.
5. **Corriger documentation Resend** : chemin réel `/api/public/notifications/resend/callback`, limite de validation réelle EP-19.

### P2 / Basse — conserver tel quel

6. **Callbacks Twilio/Resend** : conserver sans UI ; signature + rate-limit en place.
7. **Actuator** : conserver comme contrat Ops ; prometheus interne uniquement.

## Recommandation globale

- **NO GO suppression** pour les 7 surfaces analysées : aucune ne satisfait les neuf contrôles de suppression, et plusieurs sont légales/Ops/fournisseurs.
- **GO backlog documentaire** pour améliorer le CDC : ajouter explicitement les parcours RGPD, la distinction archivage vs effacement, le contrat Ops Actuator, et les callbacks fournisseurs introduits après le MVP.
- **GO candidat Frontend futur** sous plan approuvé pour : correction `archiverLocataire`, export RGPD et effacement RGPD.
