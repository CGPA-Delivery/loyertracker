# Fiche de décision — Staging mutualisé Hostinger et onboarding de LoyerTracker

> **Statut : décisions du CDO du 2026-10-11 enregistrées (« OK recommandations »).** Les recommandations
> sont celles de l'assistant ; le CGPA Chief Delivery Officer les a acceptées en bloc le 2026-10-11, **sans
> exception**. Cela ne vaut **ni approbation du Plan d'Exécution**, ni exécution des actions décidées,
> ni autorisation de déploiement ou de promotion (voir §C).
> Date de la fiche : 2026-10-11. Plans : [`plan-staging-partage-hostinger.md`](plan-staging-partage-hostinger.md)
> (parent) et [`plan-onboarding-loyertracker-staging-hostinger.md`](plan-onboarding-loyertracker-staging-hostinger.md).

## Mode d'emploi

Réponse du CDO du 2026-10-11 : « **OK recommandations** » pour D1, D4, D6 à D10 et D-ONB-2 à 10, sans
exception. Inscrit par l'assistant, daté, dans cette fiche et dans les journaux.

## Déjà décidées (pour mémoire)

| # | Décision | Date |
|---|---|---|
| D2 ter | `srv2050514` conservé (KVM 4, Düsseldorf, Ubuntu 26.04) | 2026-10-10 |
| D3 | Domaine Staging `*.staging.tshilo.dev` | 2026-10-10 |
| D5 | Accès SSH par Tailscale, pas d'IP fixe | 2026-10-10 |
| D-ONB-1 | Données : démarrage à vide | 2026-10-11 |
| Sauvegarde | Manuelle hebdomadaire dans hPanel (le snapshot expire 24 h après sa création : voir l'erratum des plans) | 2026-10-11 |

## A. Décisions du plan parent

| # | Question | État | Recommandation | Si autre choix | Décision CDO |
|---|---|---|---|---|---|
| **D1** | Sort du VPS Francfort `srv2011505` (hors gouvernance, héberge LoyerTracker, secrets exposés) | Ouvert | **Geler** (aucun nouveau déploiement) ; **faire tourner ses secrets** et remettre les canaux externes à `false`, corriger `KC_HOSTNAME` (par le propriétaire) ; **décommissionner après L3 et une semaine de stabilité** du nouveau Staging, sur décision distincte | Le conserver tel quel : R-HOST-02 à 04 restent ouverts et K8 / ADR-18 potentiellement contournés. Attention : les enregistrements DNS `loyertracker`, `auth` et `traefik` de `tshilo.dev` pointent sur lui | ☑ OK (2026-10-11) ☐ Autre : |
| **D4** | Reverse proxy | **Mis en œuvre** (Traefik installé, `verify` 8/8) | **Ratifier Traefik** | Revenir à nginx-proxy-manager : reconstruction de l'edge et des exceptions, écarts NPM 5 et 6 à reproduire | ☑ OK (2026-10-11) ☐ Autre : |
| **D6** | Cible des sauvegardes hors hôte (le snapshot ne suffit pas) | Ouvert | **Copie hebdomadaire du `pg_dump -Fc` vers le poste du CDO par le tailnet** (cohérent avec la sauvegarde manuelle ; aucun nouveau secret entre fournisseurs) | Bucket S3 chiffré avec clé IAM en écriture seule : automatisable, mais place une clé AWS sur l'hôte Hostinger ; sauvegarde automatique Hostinger : payante à vérifier | ☑ OK (2026-10-11) ☐ Autre : |
| **D7** | Quotas disque par projet | Ouvert | **Supervision seule** (alerte à 80 %) tant qu'il n'y a qu'un projet ; revoir au troisième | XFS `prjquota` : exige une partition dédiée, donc une reconstruction de l'hôte | ☑ OK (2026-10-11) ☐ Autre : |
| **D8** | `srv2044374` (SonarQube, datacenter 15 inconnu) | Ouvert | **Ne pas y héberger de Staging** ; terminer son nettoyage (voir ci-dessous) ; **synchroniser et restreindre** son pare-feu `sonar-baseline` (SSH ouvert à tous) ; demander à Hostinger l'emplacement du datacenter 15 | L'utiliser pour le Staging : mélange CI et Staging, emplacement inconnu | ☑ OK (2026-10-11) ☐ Autre : |
| **D9** | Propriétaire de l'hôte et astreinte | Ouvert | **Propriétaire : le CDO** ; exploitation en heures ouvrées, **pas d'astreinte 24 h/24** (Staging non critique) ; DevSecOps Lead (rôle tenu par Claude Code, désigné le 2026-07-31) : préparation et contrôle, sans accès d'exécution à l'hôte | Désigner un autre propriétaire ou une astreinte | ☑ OK (2026-10-11) ☐ Autre : |
| **D10** | Calendrier de M0 à M6 et autres projets d'`ai-test-server` | Ouvert | **L1 à L3 dans la fenêtre de validité du snapshot** (ou le renouveler) ; **Gate Staging après le smoke** ; **`ai-test-server` non touché** : M0 (inventaire des autres projets, propriétaires) avant toute décision de retrait ; M5 et M6 jalons distincts | Fixer des dates précises | ☑ OK (2026-10-11) ☐ Autre : |

Nettoyage restant de `srv2044374` (D8), à décider par le CDO : retirer `/etc/docker/daemon.json` (inactif),
le sudo sans mot de passe (`/etc/sudoers.d/90-<login>` si c'est le fichier de l'assistant), les images Traefik
et socket-proxy ; garder ou retirer UFW et fail2ban. L'état `unhealthy` de SonarQube n'a pas de lien établi
avec ces changements.

## B. Décisions du plan d'onboarding

| # | Question | Recommandation | Si autre choix | Décision CDO |
|---|---|---|---|---|
| **D-ONB-2** | Candidat à déployer | **Digests du Gate Staging US-125** (commit `d19c4fea…`), déjà éprouvés sur `ai-test-server` ; Gate Staging dédié après le smoke | Dernier `main` (migration Spring Boot 4.1.1 fusionnée, Flyway 12) : non encore passée par un Gate Staging, risque de mélanger migration et onboarding | ☑ OK (2026-10-11) ☐ Autre : |
| **D-ONB-3** | Hôte applicatif | **`loyertracker.staging.tshilo.dev`** (le realm versionné ne connaît que `loyerpro.org` : le one-shot `keycloak-public-host-init` le corrige) | `loyertracker.staging.loyerpro.org` : zone Route 53 et non Hostinger, DNS-01 ou changement de zone | ☑ OK (2026-10-11) ☐ Autre : |
| **D-ONB-4** | `/api/` et `/verify/` sans basic-auth | **Reconduites** (JWT Bearer et page publique, écarts NPM 5 et 6) ; risque résiduel : API joignable sans basic-auth, quota de débit partagé par l'IP du proxy | Tout protéger par basic-auth : casse les JWT et la page publique | ☑ OK (2026-10-11) ☐ Autre : |
| **D-ONB-5** | Saut TLS interne Traefik → nginx | **`insecureSkipVerify` sur réseau dédié** `edge-loyertracker` ; CA privée plus tard | CA privée dès maintenant : plus strict, plus de travail avant le premier déploiement | ☑ OK (2026-10-11) ☐ Autre : |
| **D-ONB-6** | SMTP Keycloak (« mot de passe oublié ») | **Différé** (profil `smtp` inactif) ; les anciens identifiants SMTP sont à considérer exposés | Fournir de nouveaux identifiants SES avant L3 | ☑ OK (2026-10-11) ☐ Autre : |
| **D-ONB-7** | Monitoring (Prometheus, Alertmanager, Pushgateway) | **Lot séparé après la sauvegarde** ; webhook d'alerte et heartbeat à régénérer | L'inclure dans L3 : plus de surface, plus de secrets | ☑ OK (2026-10-11) ☐ Autre : |
| **D-ONB-8** | Provenance des fichiers `infra/` sur l'hôte | **Archive du commit de release** (empreinte vérifiée par `project-prep.sh`) | `git clone` authentifié : une clé ou un jeton d'accès de plus sur l'hôte | ☑ OK (2026-10-11) ☐ Autre : |
| **D-ONB-9** | Jeton GHCR en lecture seule | **Propriétaire : le CDO** ; `read:packages` uniquement ; **expiration à 90 jours** avec rappel ; stocké seulement dans `/srv/loyertracker/.docker` (root, 0700) | Jeton d'organisation ou GitHub App : plus robuste, plus de mise en place | ☑ OK (2026-10-11) ☐ Autre : |
| **D-ONB-10** | Calendrier de L1 à L4 | **Même fenêtre que D10** ; L3 avant l'expiration du snapshot (2026-10-12 13:50 UTC), sinon le renouveler | Fixer des dates | ☑ OK (2026-10-11) ☐ Autre : |

## Précisions sur ce qui est décidé (et ce qui ne l'est pas)

- **D1** : décidé = geler, faire tourner les secrets, remettre les canaux externes à `false`, corriger `KC_HOSTNAME`
  (actions du propriétaire du VPS, **non exécutées à ce jour**) ; le décommissionnement reste une **décision
  distincte**, après L3 et une semaine de stabilité.
- **D6** : décidé = copie hebdomadaire du `pg_dump -Fc` vers le poste du CDO par le tailnet. **La procédure reste
  à écrire** (script ou étape de runbook) et n'est pas exécutée.
- **D6 — note du 2026-10-12** : `srv2011505` a des sauvegardes Hostinger hebdomadaires (`backup_create` des
  2026-10-03 et 2026-10-10) ; aucune n'est listée pour `srv2050514`. Si elle y est ou y sera active, le
  complément `pg_dump -Fc` reste utile (sauvegarde applicative) mais l'hypothèse « aucune sauvegarde
  automatique » est à corriger. **Aucune décision n'est modifiée** ; à confirmer par le CDO.
- **D8** : décidé = pas de Staging sur `srv2044374`, pare-feu `sonar-baseline` à synchroniser et restreindre,
  emplacement du datacenter 15 à demander à Hostinger. Au nettoyage : `daemon.json`, sudo sans mot de passe et
  images Traefik et socket-proxy à retirer (recommandation acceptée) ; **UFW et fail2ban : toujours à décider**.
- **D9** : le DevSecOps Lead prépare et contrôle ; il n'a pas d'accès d'exécution à l'hôte.
- **D10** : fenêtre L1 à L3 avant l'expiration du snapshot (2026-10-12 13:50 UTC) ou snapshot renouvelé ; aucune
  date calendaire n'est fixée.

## C. Points hors fiche mais bloquants pour L3

- **Approbation du Plan d'Exécution** : les deux plans portent « Proposé » ; la fusion des PR ne l'établit pas.
  À formuler explicitement par le CDO, avec sa date.
- **Rotation des secrets de `srv2011505`** (R-HOST-02) et remise à `false` de ses canaux externes (R-HOST-03).
- **Snapshot valide au lancement** (erratum sur la sauvegarde).
