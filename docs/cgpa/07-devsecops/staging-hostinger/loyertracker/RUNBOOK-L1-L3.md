# Runbook — Onboarding de LoyerTracker sur `srv2050514` (lots L1 à L3)

> **Statut : PROPOSÉ — rien n'a été exécuté.** À jouer par le CDO sur l'hôte, une étape à la fois.
> Plan parent : [`../../plan-onboarding-loyertracker-staging-hostinger.md`](../../plan-onboarding-loyertracker-staging-hostinger.md).
> Ne vaut ni approbation du Plan d'Exécution ni autorisation de promotion.

## 0. Décisions retenues pour ce runbook

| Décision | Valeur | Origine |
|---|---|---|
| D-ONB-1 Données | **Démarrage à vide** (aucune donnée ni rôle repris d'`ai-test-server`) | **Décidé par le CDO** (2026-10-11) |
| D-ONB-2 Candidat | Digests du Gate Staging US-125, commit `d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a` : API `…@sha256:8e94c002a65bff590c9694b1dd79ca2eb9ab04639f9f59ddb5b735afe001a30d`, Web `…@sha256:18ade4b483955691fedd7d46a2c893ff27facd9d6dcf5249350005080d679d67` (registre `ghcr.io/cgpa-delivery`) | **Hypothèse de l'assistant**, à confirmer |
| D-ONB-3 Hôte | `loyertracker.staging.tshilo.dev` | Proposition du plan |
| D-ONB-4 / 5 / 6 / 7 | Exceptions `/api/` et `/verify/` reconduites ; saut TLS interne sans vérification ; SMTP Keycloak différé (« mot de passe oublié » indisponible) ; monitoring hors lot | Propositions du plan |
| D-ONB-8 Dépôt sur l'hôte | Archive du commit de release (`git archive`), empreinte vérifiée | Proposition du plan |
| Canaux externes | **Tous fermés** (K8, ADR-18) : aucun secret Twilio, Resend ni SMTP | Plan §6 |

**Écart assumé au plan §10** : le lot L2 (PR C1 à C4) n'est pas fait avant L3. Les scripts et le Compose
sont déployés depuis `docs/cgpa/07-devsecops/staging-hostinger/` (versionnés dans `main`, empreintes dans
`SHA256SUMS`), pas depuis `infra/`. Ils seront portés dans `infra/` par PR après un premier déploiement réussi.

## Règles d'arrêt

**Arrêtez-vous et collez la sortie** si : le `hostname` n'est pas `srv2050514` ; une empreinte ne
correspond pas ; `edge.sh verify` n'est pas à 0 FAIL ; `stg-deploy … validate` refuse la configuration ;
un conteneur n'est pas `healthy` ; le smoke affiche au moins un `FAIL`. Ne corrigez rien à la main : je corrige
les scripts.

## P. Prérequis (sur votre poste)

**P1.** Archive du commit de release (tous les chemins sous `repo/`). Depuis la racine du dépôt :

```bash
git archive --format=tar.gz --prefix=repo/ -o loyertracker-d19c4fea-infra.tar.gz d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a infra/keycloak infra/release infra/smoke infra/backup
```

**P2.** Relevez son empreinte (à comparer sur l'hôte ; elle peut différer de celle que l'assistant a calculée
selon la version de `git` et de `gzip`, c'est l'empreinte de **votre** fichier qui fait foi) :

```bash
sha256sum loyertracker-d19c4fea-infra.tar.gz
```

**P3.** Jeton GHCR en **lecture seule** (`read:packages`) sur un compte autorisé à lire les paquets
`cgpa-delivery/loyertracker-api` et `loyertracker-web` (autorisation SSO de l'organisation si demandée).
Il sera saisi sur l'hôte, jamais dans le chat.

**P4.** Dossier `docs/cgpa/07-devsecops/staging-hostinger/` à jour (branche `main` après fusion de la PR de ce
runbook) copié sur l'hôte, ainsi que l'archive, par exemple dans `~/`.

**P5.** Sauvegarde valide avant L3 : le snapshot `395915` expire le 2026-10-11 à 13:30 UTC. Prenez-en un
nouveau (hPanel, ou demandez-le à l'assistant) et notez son identifiant et sa date.

## L1. Préparation de l'hôte

Toutes les commandes se lancent sur `srv2050514`, en `deploy`.

**L1.1** Vérifier le dossier copié (les empreintes doivent toutes afficher `OK`) :

```bash
cd ~/staging-hostinger && find . -type f \( -name '*.sh' -o -name '*.yml' \) -exec sed -i 's/\r$//' {} + && sha256sum -c SHA256SUMS
```

**L1.2** Mettre à jour l'edge (copie `transports.yml`, idempotent) puis le contrôler :

```bash
cd ~/staging-hostinger/edge && sudo EXPECTED_HOSTNAME=srv2050514 ACME_EMAIL=jptshilombo373@gmail.com bash edge.sh install
```

```bash
sudo EXPECTED_HOSTNAME=srv2050514 bash edge.sh verify
```

Attendu : `8 PASS, 0 FAIL`, et `/srv/edge/dynamic/` contient `middlewares.yml` et `transports.yml`.

**L1.3** Rattacher le projet à l'edge (crée `edge-loyertracker`, recrée **Traefik seul**, micro-coupure) :

```bash
sudo EXPECTED_HOSTNAME=srv2050514 bash edge.sh add-project loyertracker
```

**L1.4** Préparer le projet (utilisateur, arborescence, archive vérifiée, certificat interne, `stg-deploy`).
Remplacez `<EMPREINTE>` par celle de P2 :

```bash
cd ~/staging-hostinger/loyertracker && sudo EXPECTED_HOSTNAME=srv2050514 APP_PUBLIC_HOST=loyertracker.staging.tshilo.dev ARCHIVE=$HOME/loyertracker-d19c4fea-infra.tar.gz ARCHIVE_SHA256=<EMPREINTE> COMMIT=d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a bash project-prep.sh
```

Attendu : `Préparation terminée. Aucun conteneur démarré.`

**L1.5** Générer les secrets **neufs** (rien n'est affiché) :

```bash
sudo EXPECTED_HOSTNAME=srv2050514 APP_PUBLIC_HOST=loyertracker.staging.tshilo.dev API_IMAGE_REF=ghcr.io/cgpa-delivery/loyertracker-api@sha256:8e94c002a65bff590c9694b1dd79ca2eb9ab04639f9f59ddb5b735afe001a30d WEB_IMAGE_REF=ghcr.io/cgpa-delivery/loyertracker-web@sha256:18ade4b483955691fedd7d46a2c893ff27facd9d6dcf5249350005080d679d67 bash gen-env.sh
```

Attendu : `/srv/loyertracker/env/.env créé (0600, stg-loyertracker)`. Les canaux externes y sont à `false`.

**L1.6** Connexion au registre, dans la configuration propre au projet (le jeton est saisi sans écho) :

```bash
read -rs GHCR_TOKEN && printf '%s' "$GHCR_TOKEN" | sudo env DOCKER_CONFIG=/srv/loyertracker/.docker docker login ghcr.io -u <COMPTE_GITHUB> --password-stdin; unset GHCR_TOKEN
```

## L3. Déploiement par digest et preuves

**L3.1** Preuve `STG-ISOL-01` **avant** (conteneurs, réseaux, volumes) :

```bash
cd ~/staging-hostinger/edge && sudo EXPECTED_HOSTNAME=srv2050514 bash edge.sh snapshot avant-deploiement-loyertracker
```

**L3.2** Valider la configuration (refuse ports publiés, `privileged`, réseau hôte, montages hors projet, image
sans digest) :

```bash
sudo stg-deploy loyertracker validate
```

**L3.3** Tirer les deux images par digest :

```bash
sudo stg-deploy loyertracker pull
```

**L3.4** Démarrer le projet (les one-shots `keycloak-init`, `keycloak-theme-init`, `keycloak-public-host-init`
s'exécutent après l'import du realm) :

```bash
sudo stg-deploy loyertracker up
```

**L3.5** Attendre 2 à 3 minutes, puis l'état :

```bash
sudo stg-deploy loyertracker ps
```

Attendu : `postgres`, `keycloak`, `api`, `nginx` en `healthy` ; les trois one-shots en `Exited (0)`.

**L3.6** Redirect URIs restreintes à l'hôte du Staging :

```bash
sudo stg-deploy loyertracker logs keycloak-public-host-init
```

Attendu : `Redirect URIs et web origins limités à https://loyertracker.staging.tshilo.dev`.

**L3.7** Premier appel public (déclenche l'émission du certificat Let's Encrypt ; si le code est `000`,
attendez une minute **sans boucler** : les émissions Let's Encrypt sont limitées) :

```bash
curl -s -o /dev/null -w '%{http_code}\n' --max-time 20 https://loyertracker.staging.tshilo.dev/
```

Attendu : `401` (basic-auth `staging-auth`).

**L3.8** Smoke complet (63 PASS / 0 FAIL attendus) ; saisissez le mot de passe d'accès Staging :

```bash
cd ~/staging-hostinger/loyertracker && sudo EXPECTED_HOSTNAME=srv2050514 bash run-smoke.sh
```

**L3.9** Preuve `STG-ISOL-01` **après**, puis contrôle de l'edge :

```bash
cd ~/staging-hostinger/edge && sudo EXPECTED_HOSTNAME=srv2050514 bash edge.sh snapshot apres-deploiement-loyertracker
```

```bash
sudo EXPECTED_HOSTNAME=srv2050514 bash edge.sh verify
```

Attendu : 8 PASS ; les instantanés ne diffèrent que par les conteneurs, le réseau et le volume
`loyertracker-staging*` et `edge-loyertracker`.

## Rollback

| Situation | Action |
|---|---|
| Avant L3.4 | Rien à défaire côté applicatif ; `docker network rm edge-loyertracker` seulement après retrait de Traefik de ce réseau (demander le correctif) |
| Après L3.4 | `sudo stg-deploy loyertracker down` (conteneurs et réseau du projet, **volumes conservés**) ; `ai-test-server` n'a jamais été touché |
| Données | Aucune donnée à restaurer (démarrage à vide) ; pour repartir de zéro : demander la procédure de suppression du volume `loyertracker-staging_postgres-data` |

## Journal d'exécution (à compléter)

| Étape | Heure UTC | Résultat | Preuve |
|---|---|---|---|
| P5 snapshot | | | id : |
| L1.1 empreintes | | | |
| L1.2 edge verify | | | 8 PASS |
| L1.3 add-project | | | |
| L1.4 project-prep | | | empreinte archive : |
| L1.5 gen-env | | | |
| L3.2 validate | | | |
| L3.4 up | | | |
| L3.8 smoke | | | PASS / FAIL : |
| L3.9 STG-ISOL-01 après | | | fichiers `/srv/edge/snapshots/` |

Contrôles applicables, tous `non exécuté` tant que leur preuve n'est pas consignée : STG-ISOL-01,
CHECK-CICD-01, CHECK-REL-01, CHECK-OPS-01, CHECK-VAL-01.
