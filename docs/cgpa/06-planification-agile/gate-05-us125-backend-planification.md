# Gate 05 — Backlog et planification Agile — US-125 Backend

## 1. Identification

| Champ | Valeur |
|---|---|
| ID décision | `GATE-05-EP16-US125-BACKEND-2026-08-06` |
| Projet | LoyerTracker |
| Gate évalué | Gate 05 — Backlog et planification Agile |
| Phase | Phase 05 — planification du complément Backend US-125 |
| Environnement | Aucun — décision et planification documentaires uniquement |
| Artefact de départ | `main` après PR #385, merge commit `b54303d14880af279e6df224f428f07da3dbb435` |
| Date | 2026-08-06T09:23:18+01:00 |
| Décisions précédentes | Gate 02A US-125 GO sous réserve ; Gate 04A US-125 GO sous réserve ; PR #385 Frontend mergée |

## 2. Objet et constat post-merge

La PR #385 a intégré l'interface Angular US-125 : préférences de notification, historique, états UI et tests Frontend. Elle est mergée sur `main` avec ses contrôles CI verts.

Le service Frontend `frontend/src/app/notifications/notifications.service.ts` appelle toutefois les contrats suivants :

- `GET` et `PUT` `/api/notifications/preferences/current` ;
- `POST` `/api/notifications/preferences/current/unsubscribe` ;
- `GET` `/api/notifications/history`.

Le socle Backend EP-16 contient les entités et services de notification, mais aucun contrôleur HTTP ne livre ces contrats à ce commit. L'interface ne doit donc pas être déclarée fonctionnellement complète : elle reste dépendante d'un complément Backend explicitement planifié et autorisé.

Ce Gate ne rejoue ni Gate 02A ni Gate 04A. Il régularise l'état post-merge et instruit le plan du périmètre serveur nécessaire à la réserve `RSV-US125-FE-01`.

## 3. Périmètre proposé

### Inclus après décision PO/CDO explicite distincte

1. Exposer les quatre opérations HTTP prévues par le contrat Frontend pour l'utilisateur authentifié.
2. Ajouter les DTO, validations et mapping nécessaires, sans exposer de données personnelles non requises.
3. Appliquer l'autorisation **côté serveur** :
   - Bailleur : accès à son propre périmètre ;
   - Gestionnaire : accès uniquement à son périmètre affecté selon K6 ;
   - aucun filtre Frontend ne constitue une barrière de sécurité.
4. Garantir RLS/ReBAC, isolation inter-bailleur et absence de fuite par énumération, réponse ou journalisation.
5. Protéger consentement, désinscription, changement de canal et coordonnées E.164 avec validations métier cohérentes avec ADR-18/K3/K6/K7.
6. Produire les tests unitaires et d'intégration : authentification, rôles, 403, cross-tenant, périmètre Gestionnaire, historique masqué, consentement et désinscription.
7. Aligner et vérifier les tests d'intégration Frontend sur le contrat HTTP réel ; documenter les preuves restant nécessaires pour `RSV-US125-A11Y-01` et `RSV-US125-RESP-01`.

### Explicitement exclu

- migration Flyway, sauf nouvelle décision/plan distinct démontrant qu'elle est indispensable ;
- Staging, Production, smoke destructif ou promotion de release ;
- modification Docker/infrastructure ou manipulation de secrets ;
- activation ou changement des canaux Twilio, SMS, WhatsApp, Resend ou de leurs kill-switches ;
- EP-19 ;
- auto-gestion par un Locataire ou extension fonctionnelle hors US-125.

## 4. Contrat cible et règles de sécurité

| Opération | Sujet authentifié | Règle serveur | Résultat attendu |
|---|---|---|---|
| Consulter préférences | Bailleur/Gestionnaire | Résoudre le destinataire autorisé depuis l'identité et le contexte serveur | DTO de préférences sans données tierces |
| Modifier préférences | Bailleur/Gestionnaire | Écrire uniquement la préférence du sujet autorisé ; valider E.164, canal et opt-in | Préférence persistée et consentement tracé |
| Se désinscrire | Bailleur/Gestionnaire | Désactiver les canaux externes du seul sujet autorisé ; préserver l'historique | Préférence mise à jour sans suppression d'audit |
| Consulter historique | Bailleur/Gestionnaire | RLS/ReBAC appliqué avant sérialisation ; adresse destinataire masquée | Liste limitée au périmètre autorisé |

Le contrôleur ne reçoit jamais un identifiant de bailleur, gestionnaire ou destinataire permettant d'élargir arbitrairement le périmètre. L'identité JWT, les relations métier autorisées et la politique RLS/ReBAC restent les sources d'autorité.

## 5. Découpage d'exécution proposé

| Étape | Livrable | Contrôles minimaux | Critère de sortie |
|---|---|---|---|
| B1 — contrat et autorisation | Controller, DTO, service de résolution du sujet | tests 401/403, rôle et validation | aucun accès à un identifiant arbitraire |
| B2 — préférences | lecture, mise à jour, désinscription | consentement, E.164, canaux, audit | effet immédiat et idempotence définie |
| B3 — historique | projection masquée et filtrée côté serveur | cross-tenant, périmètre Gestionnaire, absence de PII excessive | K6 prouvé par tests d'intégration |
| B4 — intégration | contrat Frontend réel et régression | tests Angular ciblés, backend `mvn test`/`verify`, CI | appels UI compatibles avec l'API réelle |
| B5 — clôture technique locale | levée ou maintien justifié des réserves | a11y navigateur, responsive 360/390/640/1024 px, sécurité | preuves recevables avant toute instruction Staging |

Chaque étape d'implémentation devra être sur branche dédiée, validée puis commitée avant de passer à la suivante. Aucune promotion d'environnement n'est incluse dans ce plan.

## 6. Risques et réserves

| ID | Type | Impact | Responsable | Échéance | Preuve attendue | Statut |
|---|---|---|---|---|---|---|
| `RSV-US125-FE-01` | Bloquante implémentation | Fuite de périmètre si le serveur délègue la sécurité au client | Engineering Lead | Avant merge de la PR Backend | tests API RLS/ReBAC/cross-tenant et revue de contrat | Ouverte |
| `RSV-US125-A11Y-01` | Bloquante clôture US-125 | Modal et labels non prouvés dans un navigateur réel | Frontend Architect / QA | Avant instruction Staging | axe/manual, focus, Escape, zoom 200 % | Ouverte |
| `RSV-US125-RESP-01` | Bloquante clôture US-125 | Reflow et cibles tactiles non prouvés sur code réel | Frontend Architect / QA | Avant instruction Staging | captures/mesures 360/390/640/1024 px | Ouverte |
| `RSV-MIG-611-04` | Majeure | Nouveaux endpoints sans décision OpenAPI/DAT explicite | Enterprise Architect | Avant merge Backend | addendum DAT/OpenAPI ou exemption justifiée | Ouverte — à instruire |

## 7. Contrôles Gate 05

| Contrôle | Résultat | Preuve | Criticité |
|---|---|---|---|
| Périmètre et dépendance Frontend/Backend explicités | PASS | §2 à §4 ; PR #385 / `b54303d` | Bloquant |
| Backlog, critères et découpage vérifiables | PASS | §3 et §5 ; addendum backlog EP-16 | Bloquant |
| Risques, réserves, responsables et preuves attendues | PASS sous réserve | §6 | Bloquant |
| Architecture, RLS/ReBAC et contrat API prévus | PASS sous réserve | §4 ; ADR-18 K3/K6/K7 | Bloquant |
| Migration, fournisseurs et environnements exclus | PASS | §3 | Bloquant |
| Décision PO/CDO d'autoriser le codage Backend | Non exécuté | Validation humaine distincte requise | Bloquant |
| Score de maturité | Non applicable | Gate de planification ciblé ; pas de score outillé applicable au référentiel | Mineur |

## 8. Avis spécialisés

| Rôle | Avis | Réserves |
|---|---|---|
| Governance Officer | Plan exploitable ; régularisation post-merge nécessaire | la présente PR ne vaut pas autorisation de coder |
| Enterprise Architect | Exiger une résolution de périmètre serveur et l'instruction `RSV-MIG-611-04` | aucun identifiant client ne doit élargir l'accès |
| DevSecOps Lead | Aucun changement d'environnement, secret ou provider requis | CI sécurité et tests d'intégration requis avant merge Backend |
| Frontend Architect | Contrat HTTP à stabiliser avec l'API réelle | a11y/responsive restent à prouver et à tracer |

## 9. Décision proposée

**Décision proposée au CGPA Chief Delivery Officer : GO sous réserve — Gate 05 US-125 Backend.**

Le plan est suffisamment complet pour soumettre une décision PO/CDO de lancement du **seul complément Backend US-125**. Le GO ne peut devenir une autorisation de codage qu'après validation humaine explicite de la présente décision.

### Action autorisée par la présente PR

- maintenir l'état documentaire post-merge ;
- faire valider ou amender le plan par le PO/CDO ;
- préparer la branche Backend uniquement après GO humain explicite.

### Actions non autorisées par la présente PR

- coder le Backend ou modifier le Frontend ;
- créer une migration ;
- déployer ou promouvoir vers Staging/Production ;
- modifier secrets, providers, flags d'activation ou EP-19.

## 10. Traçabilité

- `docs/project-state.md` : état post-merge #385 et Gate 05 ajouté.
- `docs/cgpa/06-planification-agile/plan-execution-ep16-notifications.md` : addendum de régularisation et plan Backend.
- `CHANGELOG.md` : évolution documentaire ajoutée sous `[Non publié]`.
- Validation humaine finale : Product Owner / CGPA Chief Delivery Officer requise via cette PR.
