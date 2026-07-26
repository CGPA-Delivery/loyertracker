# Gate Staging v5.4.1 — EP-16 Sprint N+1 (WhatsApp P0)

| Champ | Valeur |
|---|---|
| Date | 2026-07-24 |
| Candidat | merge PR #252 + PR #254 (correctif lien de vérification), `27dce09` |
| Périmètre | EP-16 Sprint N+1 — US-122/123, premiers envois WhatsApp réels en Sandbox Twilio |
| Rollback | `sha-e4744d92` (Sprint N) — rollback applicatif viable, V28 additive (seed + fonctions) |
| Environnement | `ai-test-server` mutualisé, accès Gate direct `https://localhost:18443` |
| Décision | **GO — `STAGING_DEPLOYED`** |

## Conditions d'entrée

| Critère | Résultat | Preuve |
|---|---|---|
| GO explicite Sprint N+1 | PASS | PO le 2026-07-24, distinct du GO Sprint N |
| PR #252 fusionnée | PASS | merge `69a7964`, Quality Gate Sonar validé (Security Hotspot `java:S4790` revu Safe par le PO) |
| Écart détecté et corrigé avant Gate | PASS | Lien de vérification manquant dans le payload `QUITTANCE_DISPONIBLE` — corrigé par PR #254 (`27dce09`) avant tout déploiement |
| CI post-fusion `main` | PASS | Runs `30087018848`/`30087855870`/`30090870442` : Backend, Frontend, Sécurité, Packaging Docker, CodeQL SUCCESS |
| Images immuables | PASS | API `sha256:089028b4…`, Web `sha256:7dbc551e…`, tag `sha-27dce09d` |
| Migration | PASS | V28 additive (seed 3 templates P0 + 2 fonctions `SECURITY DEFINER`) ; aucune modification de `docker-compose.staging.yml` structurelle (ajout de variables d'environnement Twilio uniquement) |
| Sauvegarde pré-déploiement | PASS | dump `loyertracker-20260724-125743.dump`, 541465 octets, SHA-256 `24aeeac3…` ; globals 1108 octets, SHA-256 `addb02e7…` ; vérifié par le script |
| Compte Twilio Sandbox | PASS | Fourni par le PO (jamais versionné) ; validé par appel read-only à l'API Twilio (compte `Trial` actif) avant toute utilisation |

## STG-ISOL-01

| Contrôle | Avant | Après | Résultat |
|---|---|---|---|
| Conteneurs projet et NPM | 9 actifs | 9 actifs (identiques) | PASS |
| Services recréés | aucun | `api` et `nginx` uniquement | PASS |
| Restart count | 0 | 0 sur API, Nginx, PostgreSQL, Keycloak, NPM et monitoring | PASS |
| Réseau dédié | `loyertracker-staging_loyertracker-net` | identique | PASS |
| Volumes dédiés | `loyertracker-staging_postgres-data`, `loyertracker-staging_prometheus-data` | identiques | PASS |
| Ports | 18080/18443 ; NPM sur 80/81/443 | identiques, aucune collision | PASS |
| Commandes Docker | lecture seule puis `pull`/`up -d --no-deps api nginx` (`--project-directory`/`-f` en chemins absolus) | aucune commande globale, aucun `down`, `prune` ou `--remove-orphans` | PASS |

**Verdict `STG-ISOL-01` : PASS.** L'avertissement Compose sur les conteneurs monitoring
« orphelins » est attendu (même cause qu'au Gate Sprint N) ; ils sont restés actifs, non supprimés.

## Déploiement

- Dépôt hôte avancé par fast-forward `e4744d9` → `27dce09`.
- `.env` sauvegardé sous `.env.bak-pre-sprint-n1-ep16`.
- `LOYERTRACKER_TAG` basculé de `sha-e4744d92` vers `sha-27dce09d`.
- **Premières variables Twilio réelles ajoutées à cet hôte mutualisé** (`TWILIO_ACCOUNT_SID`,
  `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM=+14155238886` — numéro Sandbox global Twilio,
  `TWILIO_STATUS_CALLBACK_BASE_URL`), `NOTIFICATIONS_EXTERNAL_ENABLED=true`,
  `TWILIO_WHATSAPP_ENABLED=true` : jamais affichées dans une commande visible, jamais versionnées.
- Images tirées avant recréation ; digests conformes au candidat.
- Déploiement strictement ciblé : `api` et `nginx` seulement (`--no-deps`).
- API et Nginx devenus `healthy`, `restart=0`.

## Migration V28

Flyway a confirmé **28** migrations réussies (V27 → V28 additive : seed de 3 templates P0
`QUITTANCE_DISPONIBLE`/`LOYER_EN_RETARD`/`GARANTIE_DEBITEE` en statut `APPROUVE`/`enabled=true`,
fonctions `SECURITY DEFINER` `notification_bailleurs_en_attente()` et
`notification_delivery_appliquer_statut()`).

## Validation fonctionnelle

Smoke canonique :

```bash
BASE=https://localhost:18443 COMPOSE_FILE=docker-compose.staging.yml \
  ./infra/smoke/smoke-stack.sh
```

Résultat : **63 PASS / 0 FAIL**. Aucune régression sur le socle existant.

### Vérification manuelle du parcours WhatsApp complet (critère GO explicite)

Le smoke ne couvre pas les notifications externes (même pattern que garantie/gestionnaire/
locataire aux sprints précédents) : vérification manuelle dédiée, en conditions réelles avec le
compte Twilio Sandbox du PO.

**Parcours exécuté** : patrimoine → bien → locataire (`+243999964331`, consentement WhatsApp
inséré directement — US-119 n'expose pas encore d'interface HTTP, différée à l'US-125/Sprint N+2)
→ bail → échéances → pointage (`RECU`) → téléchargement de la quittance certifiée.

| Étape | Résultat |
|---|---|
| `notification_event` (`QUITTANCE_DISPONIBLE`) créé, payload contient `lienVerification` | PASS |
| `notification_outbox` : 2 lignes créées (`QUITTANCE_DISPONIBLE`, `PAIEMENT_RECU`) | PASS |
| Dispatch automatique (sondage 15 s, avant même le déclenchement manuel) | PASS — `NotificationDispatchScheduler` : 2 ligne(s) traitée(s) |
| `PAIEMENT_RECU` → `DEAD` (`TEMPLATE_NON_APPROUVE`, aucun template pour cet événement) | PASS — critère GO explicite confirmé en conditions réelles |
| `QUITTANCE_DISPONIBLE` → `PROCESSED`, `notification_delivery` créée | PASS |
| Envoi Twilio réel accepté, statut progressé jusqu'à `DELIVERED` via callback public | PASS |
| Callback `X-Twilio-Signature` vérifié avant traitement (signature valide acceptée) | PASS |
| Confirmation côté Twilio (`GET .../Messages/{sid}.json`) : `status: delivered`, `to: whatsapp:+243999964331` | PASS |
| Lien de vérification (`/verify/receipt/{id}?token=...`) résolu : `resultat: VALIDE` | PASS |
| Confirmation visuelle du PO sur son téléphone | PASS |

**Écart détecté et corrigé avant cette vérification** : le payload `QUITTANCE_DISPONIBLE` ne
portait initialement ni l'`id` de la quittance ni le token HMAC, empêchant tout lien de
vérification réel. Corrigé par la PR #254 avant le déploiement de ce candidat (voir §Conditions
d'entrée) — aucune régression, `mvn verify` 205/205.

Nettoyage transactionnel complet après vérification : préférence, Outbox, Delivery, événements
(y compris un résidu `BAIL_CREE`/`PAIEMENT_RECU` propre au test, même pattern que le résidu détecté
au T0 de l'hypercare `1.13.0`), quittance, journal de vérification, paiement, bail, bien, locataire,
patrimoine — tous supprimés en transaction unique, 0 résidu vérifié. Échafaudage
`directAccessGrants` révoqué.

## État final

| Contrôle | Résultat |
|---|---|
| Services | 9 conteneurs actifs (8 LoyerTracker + NPM), 4/4 services applicatifs `healthy`, restart=0 |
| Santé directe | `https://localhost:18443/healthz` → 200 |
| Prometheus | 5/5 cibles `up` |
| Alertmanager | 0 alerte |
| Logs | 0 HTTP 5xx Nginx ; 1 erreur API qualifiée (`duplicate key bailleur_keycloak_id_key`, double inscription du smoke, patron déjà documenté historiquement, non bloquante) |
| Tag | `sha-27dce09d` |
| `notification_*` après nettoyage | `preference` 0, `outbox` 0, `delivery` 0, `template` 3, `event` 33 (empreinte cumulée du smoke, patron déjà documenté aux Gates précédents) |

## Écart post-confirmation — page `/verify/` bloquée par le basic-auth NPM

Après confirmation du PO de la bonne réception du message WhatsApp, l'ouverture du lien de
vérification demandait les identifiants basic-auth de l'hôte staging — contraire au contrat de
sécurité de cette page (accès sans compte, seule preuve = token HMAC de l'URL). Un retrait complet
du basic-auth sur tout le domaine a été explicitement écarté (exposerait le reste de
l'environnement de test partagé). **Correctif ciblé**, même patron que l'écart 5 déjà documenté
(`staging-state.md` §5, bypass `/api/` du 2026-06-30) : bloc `location /verify/ { auth_basic off; }`
ajouté à `18.conf`, persisté dans `advanced_config` (SQLite NPM), `nginx -s reload` sans redémarrer
le conteneur NPM. Vérifié : `/verify/receipt/{id}` sans identifiants → 200 ; `/` (racine) → 401
(reste protégée) ; 9 conteneurs inchangés. Détail : `staging-state.md` §5 écart 6.

## Avis des rôles

| Rôle | Avis |
|---|---|
| Governance Officer | GO : GO explicite Sprint N+1 distinct tracé, écart détecté et corrigé avant Gate (PR #254), historique préservé |
| Enterprise Architect | GO : V28 additive, callback public sur le patron `lire_quittance_publique`, aucun contournement RLS générique |
| DevSecOps Lead | GO : backup, images, Flyway, smoke, STG-ISOL-01, signature Twilio vérifiée, secrets jamais affichés/versionnés |
| Release Manager | GO Staging uniquement ; Gate Production distinct requis ; aucune activation Production (K8, Sandbox exclusivement) |
| Chief Delivery Officer | **GO — `STAGING_DEPLOYED`** |

## Rollback et suite

V28 est additive (seed + fonctions, aucune colonne modifiée) : un redéploiement de `sha-e4744d92`
est techniquement viable. Ce Gate n'autorise aucune Production. Prochaine étape : décision Gate
Production propre au Sprint N+1 — l'activation réelle en Production reste interdite jusqu'au GO
du Sprint N+2 (K8, ADR-18).
