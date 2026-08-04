# Rapport Préflight — Pilote Keycloak EP-17 Lot 4

| Champ | Valeur |
|---|---|
| Date | 2026-08-04, ~16:51–16:53 UTC |
| Hôte | `loyertracker-prod-server` — `18.158.70.88` |
| Gate Production préalable | `gate-production-decision-ep17-lot4-pilote-keycloak.md` — **GO sous réserve (2026-08-04)** |
| Candidat | `main` (`5eb5187`) — thème `infra/keycloak/themes/loyertracker/`, `infra/keycloak/activate-login-theme.sh`, montage `docker-compose.prod.yml` |
| Verdict | **PASS** |

## Nature de ce Préflight

Ce changement ne déploie **aucune image Docker, aucune migration Flyway, aucun code applicatif** —
uniquement des fichiers de thème/CSS montés en lecture seule et un attribut de realm
(`loginTheme`) positionné via l'API Admin. `infra/release/production-state.env` et
`check-release-state.sh` ne sont pas concernés par ce Préflight ni par le déploiement à venir.

## 1. Sauvegarde préalable

Exécutée via `infra/backup/backup-postgres.sh` (script existant, déjà utilisé à chaque Préflight
de release) — **strictement en lecture seule côté application**, aucune commande de mutation.

| Fichier | Taille | Mode | SHA-256 |
|---|---|---|---|
| `loyertracker-20260804-175158.dump` | 865 286 octets | 600 | `8a4bfa281c292d2f98f8743552642bdc9a279fa472763a82caeb09acfb9f59bd` |
| `loyertracker-20260804-175158.globals.sql` | 1 108 octets | 600 | `f72a3650632b0655e270624a63a629cd3bfd1f31f1070460a3c783b1e0b86091` |

`pg_restore --list` intégré au script : **vérifié, dump lisible**. Heartbeat de sauvegarde poussé
vers Pushgateway avec succès. Rétention (7 j quotidien / 28 j hebdomadaire) appliquée sans action
manuelle. Répertoire `~/loyertracker-backups/daily/` en mode 700, fichiers 600 — conforme au
protocole déjà en vigueur.

## 2. Synchronisation du dépôt hôte

| Avant | Après |
|---|---|
| `162154ef1dd45813d7da46c4c47a2f67020241a8` (très en retard, ~106 commits) | `5eb5187058306265960860f671d7a9dcc5f7033e` (= `origin/main`) |

`git pull --ff-only origin main` — **fast-forward propre**, aucun fichier tracké en conflit
(seuls des fichiers `.env.bak-pre-*`/`.env_bkp` non suivis préexistaient, non touchés). 106 fichiers
mis à jour, incluant l'ensemble de la documentation EP-17 (Lots 0-5), le thème Keycloak et le
câblage `docker-compose.prod.yml`, ainsi que des changements Frontend/Backend d'EP-17 Lots 1-3
(pilote Angular, hors périmètre de ce déploiement — ces fichiers sources n'affectent **aucun**
conteneur en cours d'exécution : les images `api`/`web` restent épinglées par digest dans `.env`,
indépendamment du contenu du dépôt).

**Aucune commande `docker compose up` exécutée à cette étape** — le dépôt est synchronisé, aucun
conteneur recréé.

## 3. Vérification de la configuration Compose fusionnée

`docker compose -f docker-compose.yml -f docker-compose.prod.yml config` — **exit 0**, aucune
erreur d'interpolation. Confirmé dans la sortie :
* montage `infra/keycloak/themes/loyertracker` → `/opt/keycloak/themes/loyertracker` (lecture
  seule) sur le service `keycloak` ;
* service `keycloak-theme-init` présent (hérité du fichier de base, dépendant de `keycloak`
  `service_healthy`), cohérent avec la vérification déjà faite le 2026-08-03
  (`docs/project-state.md`, entrée du même jour) — reconfirmée ici **après** la synchronisation du
  dépôt, pas seulement avant.

## 4. État de la stack après ces opérations — inchangé

| Contrôle | Résultat |
|---|---|
| Conteneurs | 8/8 `Up`, 4/4 `(healthy)`, tous à `Up 2 hours` — **aucun redémarrage, aucune recréation** |
| Site public | `https://loyertracker.loyerpro.org` → `200` |
| Thème monté dans le conteneur `keycloak` en cours d'exécution | **Non** — attendu : la synchronisation du dépôt ne recrée pas les conteneurs ; le montage ne prendra effet qu'à la recréation du service `keycloak`, objet du déploiement technique (étape distincte) |

## 5. Plan de rollback (rappel, inchangé depuis le Gate Production)

Revenir `loginTheme=keycloak` (défaut) via le même mécanisme API Admin, idempotent et déjà
démontré en Staging. Aucune donnée ni schéma concerné — la sauvegarde ci-dessus est une précaution
de principe, pas une nécessité fonctionnelle pour ce changement précis.

## Conclusion

**PASS — Préflight complet.** Sauvegarde vérifiée, dépôt hôte synchronisé sans conflit, configuration
Compose fusionnée validée avec le nouveau montage de thème, stack Production inchangée et saine tout
au long de l'opération. **Aucun déploiement technique n'a été exécuté ni autorisé par ce Préflight.**

**Prochaine action autorisée** : instruction Product Owner explicite et distincte pour le
déploiement technique (recréation ciblée de `keycloak` + exécution de `keycloak-theme-init`,
`api`/`nginx`/`postgres` non touchés), suivie d'une vérification réelle de l'écran de connexion en
Production.
