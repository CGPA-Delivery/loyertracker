# Réconciliation non destructive — SMTP Keycloak Production canonique (DD-EP17-14)

| Champ | Valeur |
|---|---|
| Date | 2026-08-13 |
| Hôte Production canonique | `18.158.70.88` (`ip-172-31-22-90`) |
| Domaine public | `loyertracker.loyerpro.org` |
| Décision d'accès | SSH d'administration autorisé par le CDO |
| Nature | Préflight et inventaire lecture seule ; aucune mutation realm/service/donnée |
| Statut | **NO GO pour nouvelle activation SMTP jusqu'à réconciliation CI-validée** |

## 1. État public et runtime constaté

| Contrôle | Résultat |
|---|---:|
| HTTPS public | PASS — HTTP 200 |
| Issuer Keycloak | PASS — domaine public canonique |
| Client SPA : origine, redirections et web origins publics | PASS |
| API, Nginx, Keycloak, PostgreSQL | PASS — healthy |
| Lock release / Flyway | PASS — cohérent / 32 |
| Relais SMTP interne | PASS — running, healthy |
| Erreurs SMTP Keycloak récentes filtrées | PASS — aucune détectée |
| `smtpServer` runtime | Configuré vers le relais interne ; aucune valeur secrète reproduite |

## 2. Traçabilité de l'état actif

Un instantané des quatre fichiers actifs de configuration SMTP/Keycloak a été préservé sur l'hôte Production dans un répertoire hors Git protégé (`0700`), avec copies fichier `0600` et manifest SHA-256. Le manifest et les valeurs sensibles ne sont pas recopiés dans ce dépôt.

Comparaison avec `origin/main` au moment du contrôle :

| Fichier | Différence source | Décision |
|---|---:|---|
| `docker-compose.prod.yml` | oui, différence bornée | préserver ; analyser dans une PR dédiée avant toute synchronisation |
| `infra/keycloak/realm-loyertracker-production.json` | oui, différence bornée | préserver ; aucun réimport d'un realm existant |
| `infra/keycloak/configure-smtp-production.sh` | non | mécanisme versionné à corriger et CI-valider avant réemploi |
| `infra/keycloak/rollback-smtp-production.sh` | non | mécanisme versionné à corriger et CI-valider avant réemploi |

Les archives locales `.env*` et les sauvegardes ne sont pas des candidats à une suppression ni à une synchronisation destructive.

## 3. Écarts de mécanisme corrigés dans le candidat de réconciliation

1. Keycloak 24 peut masquer `smtpServer` avec `--fields smtpServer` : la vérification doit lire le realm complet et n'afficher que le résultat de contrôle, jamais les valeurs.
2. Le rollback doit inspecter strictement le sous-objet `smtpServer`, pas rechercher des noms de clés dans le realm entier.
3. Toute invocation future du one-shot doit employer `docker compose run --no-deps` pour ne pas recréer des dépendances ; la seule exception est un conteneur one-shot explicitement ciblé.
4. Aucun endpoint, identifiant ou secret SMTP ne doit apparaître dans `.env.example`, YAML, documentation, Git ou logs.

## 4. Conditions avant nouveau Gate Production SMTP

- PR de réconciliation fusionnée avec CI verte ;
- comparaison contrôlée des différences de Compose/realm préservées, sans écrasement de l'hôte ;
- backup PostgreSQL neuf, hashé et validé immédiatement avant une éventuelle fenêtre ;
- décision CDO distincte avec fenêtre UTC ;
- test de réception réel et exécution de l'action-token ;
- anti-énumération compte existant/inexistant, puis hypercare T0/T+12h/T+24h.

Aucun de ces contrôles ne constitue une autorisation de modifier la Production.
