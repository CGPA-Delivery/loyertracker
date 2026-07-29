# Rapport Préflight + Backup — Release `1.15.0` (EP-16 Sprint N+2 Lot A)

| Champ | Valeur |
|---|---|
| Date | 2026-07-29, ~18:05–18:13 UTC |
| Hôte | `loyertracker-prod-server` — `18.158.70.88` |
| Candidat | `sha-ac374193` |
| Digests Staging | API `sha256:9603330ea530d2fe4e90b49a63e648c7a8b7679e8819f026f79e8108ca14557a` ; Web `sha256:3d7ddb5fff6346726492079414cbd0679ee3833dfe8721662cd00527024c4067` |
| Production / rollback | `1.14.0` — `sha-27dce09d` |
| Verdict | **PASS** |

## Aucune réserve bloquante héritée

`1.14.0` est **déjà clôturée** (CDO GO le 2026-07-28, hypercare T0/T+12/T+24 complète, sans
incident) au moment de ce Préflight — aucune condition de séquencement de release précédente ne
s'applique ici.

## Contrôles lecture seule (Production `1.14.0` avant migration)

- 8/8 conteneurs actifs et `healthy` (`api`/`nginx`/`postgres`/`keycloak` + 4 services de
  monitoring), **`RestartCount=0`** sur les quatre services applicatifs ; tag courant
  `sha-27dce09d` inchangé.
- Flyway **28/28** ; V29 (une fonction `SECURITY DEFINER`, `notification_envois_du_mois()`)
  **pas encore appliquée** — état propre avant migration.
- `bailleur-test@test.local` confirmé **désactivé** (`enabled: false`, via `kcadm`) ;
  `directAccessGrantsEnabled=false` sur `loyertracker-spa`.
- Prometheus **5/5** cibles `up`. Alertmanager : **1 alerte active** `BackupHeartbeatMissing` au
  moment du contrôle — pattern récurrent déjà qualifié (cron 02h15 manqué) ; **résolue par ce
  Préflight** : le backup ci-dessous pousse un heartbeat réussi vers le Pushgateway.
- **0 ligne 5xx** (30 dernières minutes) ; **0 entrée `ERROR`** API (30 dernières minutes) ; site
  public `https://loyertracker.loyerpro.org` → **200**.
- 30 Gio disque libres (23 %), ~1,9 Gio mémoire disponible, charge 0,02/0,03/0,00.
- Données métier baseline : 2 bailleurs réels, 2 patrimoines, 8 biens, 8 baux, 13 mouvements de
  garantie, 1 gestionnaire, 8 locataires, 7 quittances.
- Tables `notification_*` : **34 `event`** (accumulation métier réelle depuis Sprint N+1),
  **0 `outbox`**, **0 `delivery`**, 3 `template`, 0 `preference` — cohérent avec
  `NoopNotificationProvider` seul actif, aucun envoi externe possible.
- **Aucune variable `TWILIO_*`/`NOTIFICATIONS_EXTERNAL_ENABLED`/`NOTIFICATION_FALLBACK_ENABLED`
  dans le `.env` hôte** (grep : 0 occurrence) — confirmation explicite exigée par le Gate
  Production (condition 5).
- Dépôt hôte au commit `8908d1d`, en retard sur `origin/main` — à synchroniser au déploiement
  technique (`git pull --ff-only`) ; aucun `pull` exécuté durant ce Préflight.
- Image candidate `sha-ac374193` **non présente localement** sur l'hôte — le `pull` reste une
  action du déploiement technique, hors périmètre de ce Préflight.
- Aucune commande de mutation applicative exécutée (lecture seule, `kcadm get`, `pg_dump`
  uniquement ; aucune commande Docker à portée globale).

## Backup vérifié (avant migration V29)

| Fichier | Taille | Mode | SHA-256 |
|---|---:|---:|---|
| `loyertracker-20260729-181310.dump` | 863686 | 600 | `9a423e04445aabe4d99a0eee9676278cafaea514e2f2f273f91034403145f2e4` |
| `loyertracker-20260729-181310.globals.sql` | 1108 | 600 | `0abcbaa5d3db097ddb09a2f8073aaa06c7e640be268c036a65892fc5d187567a` |

Backup produit et vérifié par `infra/backup/backup-postgres.sh` (« OK dump vérifié »). Heartbeat de
sauvegarde poussé avec succès vers le Pushgateway, levant l'alerte `BackupHeartbeatMissing`
constatée ci-dessus (propagation Alertmanager à la prochaine évaluation).

## Volet migration V29 — strictement additive (aucune condition renforcée)

Comme V27/V28, la migration V29 est **strictement additive** : une seule fonction
`SECURITY DEFINER` en lecture seule (`notification_envois_du_mois()`), aucune table ni colonne
créée ou modifiée, aucune donnée écrite. L'application `1.14.0` actuelle ignore simplement cette
fonction si un rollback applicatif seul devait être exécuté après migration. **Aucun second
backup post-migration n'est requis** ; le backup pré-migration ci-dessus suffit comme point de
restauration.

## Feature flags et absence de dépendance Twilio réelle (condition 5 du Gate Production)

Confirmé en double lecture :

- **Aucune variable `TWILIO_*`, `NOTIFICATIONS_EXTERNAL_ENABLED` ni
  `NOTIFICATION_FALLBACK_ENABLED`** dans le `.env` de l'hôte de production (grep explicite, 0
  occurrence).
- `application.yml` (`backend/src/main/resources/application.yml:108-126`) : chaque propriété a un
  fallback Spring sûr par défaut (`${VAR:false}` / `${VAR:0}`) — le `NotificationProvider` actif
  après déploiement restera donc **`NoopNotificationProvider`**, exactement comme en `1.14.0`.
- **Ce Préflight n'ajoute, ne modifie et ne planifie l'ajout d'aucun credential Twilio** au `.env`
  de production. Le compte Twilio Sandbox reste exclusivement sur `ai-test-server` (Staging).
  Conformément à K8 (ADR-18), cette situation perdure jusqu'à la clôture en GO du **Sprint N+2
  complet** (Lot A et Lot B) — Lot B (US-125) reste bloqué, sans échéance connue.

## Secrets et rollback

- **Aucune nouvelle variable d'environnement/secret requise** pour ce Préflight.
- `.env` hôte inchangé (tag `sha-27dce09d`, aucun service redémarré).
- Rollback `sha-27dce09d` : images API/Web déjà présentes localement sur l'hôte (aucun `pull`
  requis pour un retour arrière) ; V29 étant strictement additive, ce rollback reste viable
  **même après** application de la migration.

## Écart de séquencement découvert — condition 4 du Gate Production reportée au déploiement technique

Une première tentative de promotion de `CHANGELOG.md` en `[1.15.0]` dans ce même commit a été
**rejetée par la CI** (`check-release-state.sh --ci` : « ÉCART RELEASE_VERSION=1.14.0 mais le
CHANGELOG est en tête à 1.15.0 »). Ce contrôle, ajouté par le verrou R-V54-2 le 2026-07-27,
n'existait pas encore lors des Préflights précédents (dont celui de `1.14.0`, qui avait promu le
CHANGELOG à cette même étape sans que rien ne le détecte). `infra/release/production-state.env`
déclare la version **réellement déployée en Production** (`RELEASE_VERSION`) ; la promouvoir avant
tout déploiement effectif introduirait exactement l'écart de traçabilité que R-V54-2 a été conçu
pour éliminer.

**Correction** : `CHANGELOG.md` reste en `[Non publié]` à ce stade. Sa promotion en
`[1.15.0] — <date>` sera effectuée **dans le même commit que `RELEASE_VERSION=1.15.0` dans
`production-state.env`**, au moment du rapport de déploiement technique — même principe déjà
appliqué à `FLYWAY_EXPECTED_PROD` (ne bouge qu'à la bascule effective, pas avant). La condition 4
du Gate Production est donc **différée**, sans remettre en cause le verdict de ce Préflight.

## Verdict

**Préflight Production `1.15.0` : PASS.** Toutes les conditions bloquantes du Gate Production
(`gate-production-sprint-n2-ep16-decision.md`) applicables à ce stade sont satisfaites : (1)
Production `1.14.0` vérifiée saine en lecture seule (aucune réserve de séquencement héritée), (2)
backup base+globals produit et vérifié, (3) candidat `sha-ac374193` et rollback `sha-27dce09d`
confirmés, (4) **changelog à promouvoir au déploiement technique** (cf. écart ci-dessus,
séquencement corrigé), (5) **absence explicite de toute variable/credential Twilio confirmée**,
flags externes à valeurs sûres, (6) smoke canonique ≥63 et contrôle 0 activité
`notification_outbox`/`notification_delivery` restent à exécuter **au déploiement technique**
(prochaine étape), (7) déploiement/rollback devra cibler exclusivement `api` (aucun changement
Web dans ce lot). **Aucun déploiement exécuté par ce Préflight.** Une instruction explicite
distincte reste requise pour déployer `api` et appliquer la migration V29. **L'activation des
canaux externes reste interdite jusqu'à la clôture en GO du Sprint N+2 complet (Lot A et Lot B),
conformément à K8 (ADR-18).**
