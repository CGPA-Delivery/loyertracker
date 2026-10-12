# Runbook — Nettoyage de `srv2044374` (SonarQube) après l'exécution par erreur du 2026-10-10

> **Statut : PROPOSÉ — rien n'a été exécuté.** À jouer par le CDO sur `srv2044374`. Contexte : `harden-host.sh
> prepare` et `edge.sh install` y ont été lancés à la place de `srv2050514` ; le projet `edge` a déjà été retiré
> (`staging-state.md` §12). Décision D8 du 2026-10-11 : pas de Staging sur ce serveur ; retirer `daemon.json`, le sudo
> sans mot de passe et les images ; pare-feu `sonar-baseline` à synchroniser et restreindre.
> **Ne pas interrompre SonarQube** : la CI (`sonar.tshilo.dev`) en dépend.

## Règles

- **Vérifier `hostname -s` = `srv2044374` avant toute commande.**
- Aucun `docker system prune`, aucun redémarrage de Docker, aucune commande Docker globale.
- Ne collez à l'assistant que des sorties **sans secret**.

## N0. Contrôle de l'hôte

```bash
hostname -s && sudo docker ps --format '{{.Names}} {{.Image}} {{.Status}}'
```

Attendu : `srv2044374` et les conteneurs `sonarqube-*` (caddy, sonarqube, db). L'état `unhealthy` de SonarQube
est **préexistant** et sans lien établi avec ces changements.

## N1. Lecture seule : ce que l'assistant a ajouté

```bash
sudo ls -l /etc/sudoers.d /etc/docker /etc/sysctl.d/90-staging.conf /etc/fail2ban/jail.d/sshd.local /etc/apt/apt.conf.d/52staging-no-reboot 2>&1
```

```bash
sudo passwd -S deploy
```

`passwd -S` indique si `deploy` a un **mot de passe** (`P`) ou non (`L`/`NP`). **Collez-moi les deux sorties.**

## N2. Retirer `daemon.json` (inactif)

Docker n'a pas redémarré depuis 09:57 UTC : le fichier n'a jamais été appliqué. Le retirer évite qu'il le soit au
prochain redémarrage (journaux limités, `no-new-privileges`, `live-restore`). Aucun redémarrage ici.

```bash
sudo rm -v /etc/docker/daemon.json
```

L'original n'existait probablement pas (aucun autre fichier dans `/etc/docker`) ; il n'a pas été sauvegardé par la
version initiale du script.

## N3. Sudo sans mot de passe

**Condition obligatoire** : `deploy` doit avoir un **mot de passe fonctionnel** (`passwd -S` = `P`) **avant** de
retirer le fichier ; sinon l'administration serait verrouillée. Si ce n'est pas le cas :

```bash
sudo passwd deploy
```

Tester ensuite dans une **deuxième session** que `sudo -k && sudo true` fonctionne avec ce mot de passe. Puis retirer
uniquement le fichier créé par le script (nom : `90-deploy`, ou `90-<login>` si un autre login avait été passé) :

```bash
sudo rm -v /etc/sudoers.d/90-deploy
```

Vérifier : `sudo -k && sudo true` doit **demander le mot de passe** et réussir.

## N4. Images

Retirer **uniquement** les images pull par le script, ciblées par nom (pas de `prune`) :

```bash
sudo docker image rm $(sudo docker images -q traefik) $(sudo docker images -q tecnativa/docker-socket-proxy)
```

Si Docker refuse (image utilisée), ne pas forcer : coller la sortie.

## N5. Autres résidus du script `prepare`

| Élément | Action recommandée | À décider |
|---|---|---|
| UFW actif (22/80/443, mention « SSH provisoire ») | **Garder** : équivaut au pare-feu Hostinger, défense en profondeur | Oui, à consigner |
| fail2ban (`sshd.local`) | **Garder** : SSH est ouvert à tous | Oui, à consigner |
| `/etc/sysctl.d/90-staging.conf`, `apt.conf.d/52staging-no-reboot`, `20auto-upgrades` | Bénins ; retirer pour un retour complet | Au choix |
| Paquets installés (`unattended-upgrades`, `fail2ban`, `ufw`, `jq`…) | Conserver | — |
| `/srv`, `deploy` dans `sudo` | Conserver (compte existant avant le script) | — |

Si vous gardez UFW, remplacer la mention du commentaire « SSH provisoire » n'est pas nécessaire : elle est
cosmétique. **Consignez votre choix** : l'assistant l'inscrit dans `decisions-staging-hostinger.md`.

## N6. Pare-feu Hostinger `sonar-baseline` (action de l'assistant, sur « oui »)

Constat : pare-feu `373761`, `is_synced: false`, TCP 22/80/443 ouverts à tous. L'assistant **peut synchroniser** les
règles sur sa demande (opération `vps_firewall_sync-to-all-assigned-v-ms`, sans changement de règle, effet : applique
l'état déclaré). **Restreindre le SSH** exige Tailscale sur cet hôte (même procédure que `srv2050514` : `tailscale up`,
test depuis un poste, puis retrait de la règle 22) : lot distinct, avec « oui » explicite avant chaque règle.

## N7. Demande au support Hostinger

Demander l'**emplacement du datacenter 15** (`data_center_id: 15`, absent de la liste des datacenters de l'API) :
pays et ville. Consigner la réponse ici et dans `staging-state.md`.

## N8. Vérifications et journal

```bash
ls /etc/docker /etc/sudoers.d; sudo docker images --format '{{.Repository}}:{{.Tag}}' | grep -E 'traefik|socket-proxy' || echo "images absentes"
```

Puis, depuis le poste : SonarQube joignable (`https://sonar.tshilo.dev`) et une analyse CI réussie.

| Étape | Heure UTC | Résultat | Preuve |
|---|---|---|---|
| N1 relevé | | | |
| N2 `daemon.json` | | | |
| N3 sudoers (mot de passe testé avant) | | | |
| N4 images | | | |
| N5 décision UFW / fail2ban | | | |
| N6 synchronisation `sonar-baseline` | | | |
| N7 datacenter 15 | | | |
| N8 SonarQube joignable, analyse CI | | | |
