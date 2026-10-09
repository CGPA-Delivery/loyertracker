# Runbook — Hébergement sur VPS derrière Traefik avec IAM central (K26-A)

> Document d'exploitation. Il décrit la configuration `docker-compose.k26.yml`. Il ne vaut ni Gate, ni
> autorisation de promotion : toute mise en Production reste soumise à la chaîne Enterprise Delivery
> (`AGENTS.md`).

## Principe

LoyerTracker peut tourner sans Keycloak embarqué, sur un serveur qui fournit déjà :

- **Traefik** (TLS public, certificats ACME, réseau Docker `traefik_web`) ;
- un **Keycloak 26 partagé** (réseau Docker `iam`, nom `keycloak`, port 8080, chemin relatif `/auth`).

Le frontend appelle toujours `/auth` (même origine). nginx transmet `/auth/` au Keycloak externe : **aucun
changement de code applicatif, aucune nouvelle image**.

```
Internet ──TLS──> Traefik ──HTTPS interne :8443──> nginx (web) ──/api──> api ──> postgres
                                                        └────/auth────> Keycloak 26 (réseau iam)
```

## Fichiers

| Fichier | Rôle |
|---|---|
| `docker-compose.k26.yml` | Overlay : désactive Keycloak embarqué, branche `api`/`nginx` sur `iam`, route Traefik, aucun port hôte, limites mémoire |
| `infra/nginx/admin-access.k26.conf` | Masque la console d'administration Keycloak et le realm `master` sur le point d'entrée public |
| `infra/nginx/nginx.conf` | Gagne un `include` avec motif, **vide par défaut** (comportement inchangé en dev, CI, staging) |
| `infra/traefik/dynamic/loyertracker-transport.yml` | Transport Traefik vers le port interne 8443 (certificat auto-signé) |
| `infra/traefik/dynamic/old-domain-redirect.yml.example` | Exemple de redirection permanente d'un ancien domaine (liens et QR déjà diffusés) |

## Démarrage

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.k26.yml up -d
```

Les images sont tirées par digest (`API_IMAGE_REF`, `WEB_IMAGE_REF`), comme en `docker-compose.prod.yml`.

## Variables `.env` propres à ce mode

| Variable | Valeur |
|---|---|
| `KEYCLOAK_ISSUER_URI` | `https://<hôte public>/auth/realms/loyertracker` |
| `KEYCLOAK_JWK_SET_URI` | `http://keycloak:8080/auth/realms/loyertracker/protocol/openid-connect/certs` |
| `KEYCLOAK_ADMIN_BASE_URL` | `http://keycloak:8080/auth` |
| `APP_CORS_ALLOWED_ORIGIN`, `APP_INVITATION_BASE_URL`, `QUITTANCE_VERIFY_BASE_URL` | `https://<hôte public>` |
| `APP_PUBLIC_HOST` | `<hôte public>` (règle de routage Traefik) |

Les secrets (`QUITTANCE_HMAC_SECRET` et son `QUITTANCE_TOKEN_KID`, `KEYCLOAK_API_CLIENT_SECRET`, mots de passe
des rôles PostgreSQL) doivent être repris **à l'identique** lors d'un changement d'hôte, sinon les QR émis
deviennent invérifiables et l'API ne parvient plus à joindre l'API Admin. Ils ne sont jamais versionnés.

## Prérequis côté Keycloak externe

1. Le Keycloak est démarré avec `--http-relative-path=/auth`.
2. Le realm `loyertracker` est importé avec ses utilisateurs **et leurs identifiants** (la base applicative
   référence les comptes par `keycloak_id`) : export `--users realm_file`, import dans le Keycloak externe.
3. L'attribut de realm **URL frontale** vaut `https://<hôte public>/auth` : l'émetteur (`iss`) des jetons doit
   correspondre à `KEYCLOAK_ISSUER_URI`. Sans cela, les redirections et l'émetteur pointent vers l'hôte
   propre au Keycloak et la même origine est perdue.
4. Le client `loyertracker-spa` déclare l'hôte public dans ses URI de redirection, origines web et URI de
   déconnexion ; le client `loyertracker-admin` conserve son secret.
5. Le thème `loyertracker` est monté dans le Keycloak externe (`infra/keycloak/themes/loyertracker`).
6. Le SMTP du realm est configuré dans le Keycloak externe (le relais Postfix de la pile n'est pas utilisé).

## Vérifications après démarrage

- `api` et `nginx` sont `healthy`, aucun redémarrage de conteneur.
- `https://<hôte>/api/actuator/health` renvoie `UP` ; `/api/actuator/prometheus` renvoie 404 depuis l'extérieur.
- `https://<hôte>/auth/realms/loyertracker/.well-known/openid-configuration` annonce l'émetteur attendu.
- `https://<hôte>/auth/admin/…` et `https://<hôte>/auth/realms/master` renvoient 404.
- Un jeton du client `loyertracker-admin` (flux `client_credentials`) est accepté par l'API (réponse
  authentifiée, pas 401) ; une connexion réelle d'un utilisateur aboutit.

## Retour arrière

Revenir à `docker-compose.yml` + `docker-compose.prod.yml` (Keycloak embarqué) sur l'hôte précédent, dont la
base reste intacte tant qu'il n'est pas décommissionné. Toute écriture faite depuis la bascule doit être
rapatriée par dump avant de revenir.
