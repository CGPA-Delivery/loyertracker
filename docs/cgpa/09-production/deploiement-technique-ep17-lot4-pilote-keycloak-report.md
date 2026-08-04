# Rapport Déploiement Technique — Pilote Keycloak EP-17 Lot 4

| Champ | Valeur |
|---|---|
| Date | 2026-08-04, ~16:59–17:00 UTC |
| Hôte | `loyertracker-prod-server` — `18.158.70.88` |
| Préflight préalable | `preflight-ep17-lot4-pilote-keycloak-report.md` — **PASS (2026-08-04)** |
| Candidat | `main` (`8aaafb8`) — thème `infra/keycloak/themes/loyertracker/`, `infra/keycloak/activate-login-theme.sh` |
| Commande | `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d keycloak keycloak-theme-init` |
| Verdict | **PASS — `KEYCLOAK_THEME_DEPLOYED`** |

## 1. Portée du déploiement — ciblé, 2 services uniquement

`keycloak` (recréé pour prendre le nouveau montage de volume) et `keycloak-theme-init` (one-shot,
activation via API Admin). **`api`, `nginx`, `postgres` et la chaîne `monitoring` non touchés** —
confirmé par `StartedAt` identique avant/après pour les trois premiers, et par leur `Status`
inchangé (`Up 2 h`) pour les quatre services de `monitoring`. Aucune image applicative modifiée :
`API_IMAGE_REF`/`WEB_IMAGE_REF` du `.env` hôte identiques aux digests réellement exécutés avant et
après (`sha256:9603330e…` / `sha256:7dbc551e…`).

Un avertissement Compose (« orphan containers » pour `prometheus`/`alertmanager`/`pushgateway`/
`blackbox`) est apparu car l'invocation ciblait explicitement 2 services — **aucun
`--remove-orphans` n'a été passé, aucun conteneur supprimé**, vérifié : les 4 services de
`monitoring` sont restés `Up 2 h` sans interruption tout au long de l'opération.

## 2. Séquence observée

```
Container loyertracker-postgres-1  Running   (référencé, dépendance service_healthy, non recréé)
Container loyertracker-keycloak-1  Recreate → Recreated → Starting → Started → Healthy
Container loyertracker-keycloak-theme-init-1  Created → Starting → Started → (Exited 0)
```

## 3. Activation vérifiée — logs réels

```
[theme-init] Connexion à l'API d'admin Keycloak (http://keycloak:8080/auth)...
[theme-init] Activation du thème 'loyertracker' (loginTheme) sur le realm loyertracker...
[theme-init] Activation de la locale française (fr, seule locale supportée) sur le realm loyertracker...
[theme-init] Thème de login et locale française activés. Terminé.
```

`keycloak-theme-init` : **`ExitCode=0`**.

## 4. État du realm après activation — API uniquement, aucun fichier touché

| Attribut | Valeur |
|---|---|
| `loginTheme` | `loyertracker` |
| `internationalizationEnabled` | `true` |
| `supportedLocales` | `["fr"]` |
| `defaultLocale` | `fr` |

`git status --short` sur `realm-loyertracker.json` et `realm-loyertracker-production.json` :
**vide, avant et après** — confirmé, aucune modification de fichier de realm.

## 5. Vérification réelle de l'écran de connexion — flux OIDC/PKCE réel, aucun mock

Requête directe sur le port interne `18443` (`code_challenge`/`code_verifier` S256 réels, client
public `loyertracker-spa`, `redirect_uri` réel) :

| Contrôle | Résultat |
|---|---|
| HTTP | `200` |
| `<html lang="…">` | `fr` |
| Titre | « Connectez-vous à votre compte » (traduit) |
| `login.css` chargé | Oui (1 occurrence) |
| Classe `card-pf` (thème appliqué) | Oui (1 occurrence) |
| Sélecteur de langue (`kc-locale`) | Absent (0 occurrence) — cohérent, une seule locale supportée |
| Site public `https://loyertracker.loyerpro.org` | `200` |

Résultat **identique** à la vérification déjà faite en Staging le 2026-08-03 — même thème, même
comportement, sur le realm Production réel.

## 6. Rollback — non nécessaire, viable si besoin

Aucune anomalie observée à aucune étape — rollback non déclenché. Si nécessaire : revenir
`loginTheme=keycloak` via la même API Admin (idempotent, déjà démontré), ou retirer le montage de
volume et recréer `keycloak` seul. Aucune donnée ni schéma concerné dans les deux cas.

## Conclusion

**`KEYCLOAK_THEME_DEPLOYED` — 2026-08-04 ~17:00 UTC.** Le thème Keycloak du pilote EP-17 Lot 4 est
**live en Production**, sur les 6 écrans confirmés du `login/`, vérifié en conditions réelles.
`api`/`nginx`/`postgres`/`monitoring` non affectés. Aucun fichier de realm modifié. `DD-EP17-01`
(déjà close depuis la preuve Staging) et `DD-EP17-13` (déjà close) sont désormais également
**vérifiées en Production réelle**, pas seulement en Staging.

**Ce que ce déploiement ne couvre pas** : `DD-EP17-14` (mot de passe oublié cassé, SMTP absent)
reste un défaut préexistant et actif en Production, indépendant de ce déploiement — le thème
couvre l'écran de saisie et son état d'erreur honnête, sans le masquer ni l'aggraver (vérifié : le
comportement observé en Staging au Lot 5 — succès générique pour e-mail inexistant, erreur 500
traduite pour e-mail réel — est le même mécanisme Keycloak sous-jacent, indépendant du thème).

**Prochaine action autorisée** : surveillance courte de l'écran de connexion réel (aucune hypercare
formelle requise — ceci n'est pas une release applicative, pas de `PRODUCTION_DEPLOYED` au sens du
verrou `R-V54-2`, sans rapport avec `infra/release/production-state.env`) ; traitement des deux
réserves héritées des Gates (validation PO du contenu, `CHECK-FRONTEND-01`) sur instruction PO.
