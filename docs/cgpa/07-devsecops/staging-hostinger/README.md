# Staging mutualisé Hostinger — artefacts proposés

> **Statut : PROPOSÉ, NON EXÉCUTÉ.** Aucun de ces fichiers n'a été lancé sur `srv2050514`. Leur
> exécution reste soumise à la relecture et au « oui » explicite du CDO. Plan parent :
> [`../plan-staging-partage-hostinger.md`](../plan-staging-partage-hostinger.md).

| Fichier | Rôle |
|---|---|
| `harden-host.sh` | Durcissement de l'hôte en 4 phases : `prepare`, `ssh-lockdown`, `tailscale-check`, `close-public-ssh` |

## Hôte visé

`srv2050514` — KVM 4, Düsseldorf, `187.7.72.186`, Ubuntu 26.04 LTS sans Docker, pare-feu Hostinger
`375064` (22/80/443 ouverts à tous, 22 provisoire).

## Déroulé (à faire par le CDO, en root puis en administrateur nominatif)

1. Se connecter à l'hôte, déposer le script, vérifier sa somme de contrôle contre le dépôt.
2. `STG_ADMIN_USER=<login> ./harden-host.sh prepare` — SSH reste inchangé, la session actuelle reste valable.
3. Ouvrir une **2e session** en tant que `<login>` ; vérifier `sudo -n true`.
4. `STG_ADMIN_USER=<login> ./harden-host.sh ssh-lockdown` ; **tester une nouvelle connexion** avant de
   fermer les sessions existantes.
5. Installer Tailscale et rejoindre le tailnet **à la main** (clé d'authentification saisie sur l'hôte
   uniquement, jamais dans le chat ni le dépôt) ; puis `./harden-host.sh tailscale-check`.
6. Tester SSH par l'adresse tailnet depuis un poste distinct, puis `./harden-host.sh close-public-ssh`.
7. Demander à l'assistant de retirer la règle 22 du pare-feu Hostinger (action distincte, accord requis).
8. Activer la sauvegarde automatique dans hPanel (non exposée par l'API).

## Points d'attention

- Aucune clé, aucun mot de passe, aucun jeton dans ce dépôt. La clé SSH autorisée est copiée depuis
  `/root/.ssh/authorized_keys` (clé ed25519 déjà enregistrée dans hPanel).
- Le dépôt Docker officiel n'est utilisé que s'il publie la version d'Ubuntu ; sinon repli sur
  `docker.io` d'Ubuntu (à signaler dans l'ADR).
- `NOPASSWD` sudo est limité au compte nominatif, faute de mot de passe sur ce compte.
- Ne pas rejouer `prepare` sur un hôte qui héberge des projets sans fenêtre de maintenance.
- Les ports publiés par Docker contournent UFW : seul Traefik publiera 80/443 (STG-ISOL-01).
- Le script ne crée ni Traefik, ni réseau, ni projet : ce sont des étapes distinctes du plan.
