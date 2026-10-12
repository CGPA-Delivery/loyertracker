# Runbook — Rotation ciblée des secrets exposés de `srv2011505` (Hostinger Francfort)

> **Statut : PROPOSÉ — rien n'a été exécuté.** À jouer par le CDO sur l'hôte, une étape à la fois. L'assistant n'a
> aucun accès SSH ; il ne relit pas les `.env` de cet hôte (l'API VPS les renvoie en clair). Décision D1 du
> 2026-10-11 : geler, faire tourner les secrets, remettre les canaux externes à `false`, corriger `KC_HOSTNAME` ;
> **le décommissionnement est une décision distincte**. Ne vaut pas autorisation de déploiement.
> Contexte : R-HOST-01 à 04 ([plan parent](../../plan-staging-partage-hostinger.md) §0.2 et §7).

## Règles

- **Vérifier `hostname -s` = `srv2011505` avant toute commande.** Un incident de mauvais serveur a eu lieu le
  2026-10-10 (voir `staging-state.md` §12).
- **Aucun secret dans le chat, le dépôt ou l'historique du shell** : saisies sans écho (`read -rs`), éditions par
  `sudoedit`, jamais de `echo mot-de-passe`. Ne collez à l'assistant que des sorties **sans valeur secrète**.
- Les commandes Docker sont **ciblées par projet et par service**. Aucune commande globale ni `prune`.
- **Périmètre** : secrets exposés à l'extérieur. Hors périmètre : mots de passe PostgreSQL (aucun port publié),
  SSH ouvert à tous (22) de cet hôte, décommissionnement.

## Ce qui a été exposé et ce qui est traité

| Secret (projet) | Exposition | Traitement ici |
|---|---|---|
| Webhook Discord (`ALERTMANAGER_WEBHOOK_URL`, `loyertracker`) | Externe | R2.a |
| Identifiants SES SMTP (`KC_SMTP_*`, `loyertracker`) | Externe | R2.b |
| Mot de passe admin Keycloak et secret du client `loyertracker-admin` | Console publique `auth.tshilo.dev` | R2.c |
| Mot de passe du dashboard Traefik (`TRAEFIK_DASHBOARD_AUTH`) | Dashboard public `traefik.tshilo.dev` | R2.d |
| `QUITTANCE_HMAC_SECRET` | Forge de jetons de vérification (cet environnement) | R2.e |
| Mots de passe PostgreSQL (`loyertracker`, `keycloak-db`) | Interne (aucun port publié) | **Conservés jusqu'au décommissionnement** |

## R0. Précautions

**R0.1** Confirmer l'hôte :

```bash
hostname -s
```

**R0.2** Snapshot Hostinger de `srv2011505` : l'assistant le crée par l'API **sur votre « oui » explicite** (ou
vous le faites dans hPanel). Il expire 24 h après sa création et remplace un éventuel snapshot précédent.

**R0.3** Copie root-seul des fichiers d'environnement avant modification (aucune valeur affichée) :

```bash
sudo install -d -m 700 /root/rotation-20261012 && for f in /opt/loyertracker/.env /docker/keycloak/.env /docker/traefik/.env; do sudo test -f "$f" && sudo cp -a "$f" "/root/rotation-20261012/$(echo "$f" | tr '/' '_').bak"; done; sudo ls -l /root/rotation-20261012
```

Ces copies contiennent les **anciens** secrets : à détruire (`shred -u`) une fois la rotation vérifiée.

## R1. Identifier l'invocation réelle de chaque projet

Le fichier Compose lu via l'API (stack de développement) ne correspond pas aux 3 conteneurs actifs de
`loyertracker`. Relever, sans modifier :

```bash
for c in loyertracker-api-1 loyertracker-nginx-1 loyertracker-postgres-1 keycloak keycloak-db traefik; do sudo docker inspect -f '{{.Name}} | projet={{index .Config.Labels "com.docker.compose.project"}} | dir={{index .Config.Labels "com.docker.compose.project.working_dir"}} | fichiers={{index .Config.Labels "com.docker.compose.project.config_files"}} | env={{index .Config.Labels "com.docker.compose.project.environment_file"}}' "$c"; done
```

**Collez-moi cette sortie** (aucun secret) : elle fixe les `-f`, `--env-file` et profils à utiliser en R4. **Ne
relancez aucun projet sans elle.**

## R2. Secrets exposés à l'extérieur

**R2.a Webhook Discord.** Avant de supprimer l'ancien, vérifier **quels autres systèmes l'utilisent** (le même
webhook peut alimenter l'alerting du Staging AWS ou de la Production). Dans Discord (Paramètres du salon →
Intégrations → Webhooks) : créer un nouveau webhook, **mettre à jour chaque consommateur**, puis supprimer l'ancien.
Sur `srv2011505`, le monitoring ne tourne pas : seule la valeur dormante de `.env` est à remplacer (R3).

**R2.b Identifiants SES SMTP.** Créer de **nouveaux** identifiants SMTP (console AWS SES). **Ne pas supprimer les
anciens avant d'avoir vérifié leurs consommateurs** : ils ont servi à `ai-test-server` (`configure-smtp-staging.sh`)
et possiblement à la Production (profil `production-smtp`). Mettre à jour chaque consommateur, tester, puis
désactiver les anciens.

**R2.c Keycloak (`auth.tshilo.dev`).** Console `https://auth.tshilo.dev/auth/admin` :
1. Realm **master** → Users → compte admin → Credentials → **réinitialiser le mot de passe** (non temporaire).
2. Si le realm `loyertracker` existe : Clients → `loyertracker-admin` → Credentials → **Regenerate secret**, puis
   reporter la valeur dans `KEYCLOAK_API_CLIENT_SECRET` (R3, par `sudoedit`).

**R2.d Dashboard Traefik (`traefik.tshilo.dev`).** Recommandation : **supprimer l'exposition publique** plutôt que
changer le mot de passe. Dans `/docker/traefik/.env`, remplacer l'hôte par un nom non routable :

```bash
sudo sed -i 's/^TRAEFIK_DASHBOARD_HOST=.*/TRAEFIK_DASHBOARD_HOST=dashboard.disabled.invalid/' /docker/traefik/.env && sudo grep -n '^TRAEFIK_DASHBOARD_HOST=' /docker/traefik/.env
```

Le routeur ne correspond plus à `traefik.tshilo.dev` (404). Retirer ensuite l'enregistrement DNS `traefik` de la zone
`tshilo.dev` (action de l'assistant sur « oui »). Le hachage exposé devient sans objet, mais reste à supprimer du
fichier si vous préférez : `TRAEFIK_DASHBOARD_AUTH`.

**R2.e Secret HMAC des quittances.** Générer le nouveau secret **sans l'afficher** et incrémenter le `kid` :

```bash
sudo sed -i "s/^QUITTANCE_HMAC_SECRET=.*/QUITTANCE_HMAC_SECRET=$(openssl rand -hex 32)/" /opt/loyertracker/.env && sudo grep -c '^QUITTANCE_HMAC_SECRET=' /opt/loyertracker/.env
```

```bash
sudo sed -i 's/^QUITTANCE_TOKEN_KID=.*/QUITTANCE_TOKEN_KID=2/' /opt/loyertracker/.env && sudo grep -n '^QUITTANCE_TOKEN_KID=' /opt/loyertracker/.env
```

Les QR émis avec le `kid` 1 ne sont plus vérifiables : acceptable pour un Staging gelé.

## R3. Canaux externes à `false` et `KC_HOSTNAME`

Seules des valeurs **non secrètes** sont modifiées :

```bash
sudo sed -i -e 's/^NOTIFICATIONS_EXTERNAL_ENABLED=.*/NOTIFICATIONS_EXTERNAL_ENABLED=false/' -e 's/^NOTIFICATION_DRY_RUN=.*/NOTIFICATION_DRY_RUN=true/' -e 's/^RESEND_EMAIL_ENABLED=.*/RESEND_EMAIL_ENABLED=false/' -e 's/^KC_HOSTNAME=.*/KC_HOSTNAME=loyertracker.tshilo.dev/' /opt/loyertracker/.env && sudo grep -nE '^(NOTIFICATIONS_EXTERNAL_ENABLED|NOTIFICATION_DRY_RUN|RESEND_EMAIL_ENABLED|KC_HOSTNAME)=' /opt/loyertracker/.env
```

Attendu : `false`, `true`, `false`, `loyertracker.tshilo.dev`. `KC_HOSTNAME` ne doit plus désigner
`loyertracker.loyerpro.org` (domaine de la Production). Pour les valeurs secrètes de R2.a à R2.c, ouvrez le fichier
avec `sudoedit /opt/loyertracker/.env` (jamais `echo`).

## R4. Recréer uniquement les services concernés

D'après la sortie de R1, depuis le répertoire de travail du projet. **Gabarit** (à adapter : `<FICHIERS>` et
`<ENV>` viennent de R1) :

```bash
cd /opt/loyertracker && sudo docker compose -p loyertracker <FICHIERS> --env-file <ENV> up -d api
```

Puis Traefik **seul** (micro-coupure de toutes les routes de l'hôte) :

```bash
cd /docker/traefik && sudo docker compose up -d traefik
```

`nginx` et `postgres` ne sont pas recréés. Aucune commande globale.

## R5. Vérifications (sans afficher de secret)

```bash
sudo docker exec loyertracker-api-1 env | grep -E '^(NOTIFICATIONS_EXTERNAL_ENABLED|NOTIFICATION_DRY_RUN|RESEND_EMAIL_ENABLED|QUITTANCE_TOKEN_KID)='
```

```bash
sudo docker ps --format '{{.Names}} {{.Status}}'
```

Depuis votre poste : `https://traefik.tshilo.dev/` ne doit plus répondre sur le dashboard (404 ou nom absent) ;
connexion à `https://auth.tshilo.dev/auth/admin` **avec le nouveau mot de passe** ; test d'e-mail SMTP et message
Discord de test avec les **nouvelles** valeurs ; l'ancien mot de passe admin Keycloak est refusé.

## R6. Clôture

1. Détruire les copies : `sudo shred -u /root/rotation-20261012/*.bak && sudo rmdir /root/rotation-20261012`.
2. Ne **supprimer** les anciens identifiants SES et le webhook Discord qu'après vérification de leurs autres
   consommateurs (R2.a, R2.b).
3. Journal ci-dessous ; l'assistant met ensuite à jour R-HOST-02 à 04 dans `project-state.md` et `staging-state.md`.

| Étape | Heure UTC | Résultat | Preuve (sans secret) |
|---|---|---|---|
| R0.2 snapshot | | | id : |
| R1 invocation relevée | | | |
| R2.a Discord | | | consommateurs vérifiés : |
| R2.b SES | | | consommateurs vérifiés : |
| R2.c Keycloak | | | |
| R2.d Traefik dashboard | | | |
| R2.e HMAC + kid | | | |
| R3 drapeaux et `KC_HOSTNAME` | | | |
| R4 recréation `api`, `traefik` | | | |
| R5 vérifications | | | |

## Suites hors rotation

- **Décommissionnement** de `srv2011505` : décision distincte, après L3 et une semaine de stabilité (D1).
- **SSH ouvert à tous** (pare-feu `srv2011505-baseline`) : Tailscale puis fermeture, ou décommissionnement.
- **Mots de passe PostgreSQL** : conservés jusqu'au décommissionnement ; en cas de maintien, `ALTER ROLE` et mise
  à jour concertée des `.env` (procédure à instruire).
