# Gate Production — Déploiement `noreply@loyertracker.org` (RSV-EMAIL-NOREPLY-01-UNIDIR)

| Champ | Valeur |
|---|---|
| Date d'instruction | 2026-08-13 |
| Cadre | CGPA v6.1.1 — Enterprise Delivery Governance |
| Périmètre | EP-18 / Lot 4 — Changement d'expéditeur Resend Production : `onboarding@resend.dev` → `noreply@loyertracker.org` |
| Instruction de référence | `docs/cgpa/design/decisions/instruction-rsv-dmarc-02-email-noreply-01-ep18.md` (PR #452) |
| Hôte Production | `loyertracker-prod-server` (`18.158.70.88`, instance `i-032524e6a47b72e05`) |
| Prérequis Staging | ✅ Gate Staging `noreply@loyertracker.org` exécuté et validé (2026-08-12, Resend ID `e7673f9b`) |
| Décision | **GO — déploiement `noreply@loyertracker.org` autorisé sur Production, sous réserve d'exécution contrôlée et validation par envoi réel** |

## 1. Objet

Ce Gate Production autorise le changement de l'expéditeur Resend en Production :

- `RESEND_FROM_EMAIL` : `onboarding@resend.dev` → `noreply@loyertracker.org`
- `RESEND_FROM_NAME` : `LoyerTracker` (inchangé)
- `RESEND_EMAIL_ENABLED` : `true` (inchangé)
- `RESEND_REPLY_TO` : `""` (pas de reply-to, unidirectionnel par construction)

Le domaine `loyertracker.org` est vérifié côté Resend (DKIM/SPF/DMARC alignés). Le Staging a validé l'envoi réel depuis `noreply@loyertracker.org` le 2026-08-12.

## 2. Préconditions

| Contrôle | Résultat | Preuve |
|---|---|---|
| PR #452 instruction EP-18 | ✅ MERGED | `25d236e` sur `main` |
| Gate Staging `noreply@loyertracker.org` | ✅ GO | `docs/cgpa/07-devsecops/gate-staging-noreply-loyertracker-org-ep18-decision.md` |
| Envoi Staging réel validé | ✅ | Resend ID `e7673f9b-a953-419b-90d8-36633ea83a52` |
| Domaine `loyertracker.org` vérifié Resend | ✅ Verified | DKIM/SPF/DMARC alignés, confirmé par rapport DMARC Google du 2026-08-13 |
| Premier rapport DMARC réel reçu | ✅ | Google, 2026-08-12, DKIM=pass, SPF=pass, 0 échec |
| Token Resend présent sur l'hôte Production | ✅ SET | `re_MNkK6MDs_***` (send-only, déjà actif) |
| `RESEND_EMAIL_ENABLED=true` en Production | ✅ | Confirmé depuis 2026-08-06 (activation Resend Production) |
| `RESEND_FROM_EMAIL=onboarding@resend.dev` actuel | ✅ | Valeur actuelle en Production |
| Budget mensuel | ✅ | `NOTIFICATION_BUDGET_MENSUEL_MAX=100`, seuil `0.8` |
| Allowlist de test | ✅ | Aucun utilisateur réel hors allowlist |

## 3. Procédure de déploiement

```bash
# === SUR loyertracker-prod-server ===

# 1. Vérifier l'état actuel
cd /home/ubuntu/loyertracker
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
# Tous les services doivent être healthy

# 2. Sauvegarde .env
cp .env .env.bak-pre-noreply-prod-$(date +%Y%m%dT%H%M%SZ)

# 3. Mise à jour .env — changer uniquement RESEND_FROM_EMAIL
sed -i \
  -e 's/^RESEND_FROM_EMAIL=.*/RESEND_FROM_EMAIL=noreply@loyertracker.org/' \
  -e 's/^RESEND_REPLY_TO=.*/RESEND_REPLY_TO=/' \
  .env

# 4. Vérifier le .env modifié
grep -E '^RESEND_' .env

# 5. Recréer api uniquement (sans toucher aux autres services)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps api

# 6. Vérifier la santé
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
curl -s https://loyertracker.loyerpro.org/healthz
```

## 4. Vérification post-déploiement

| Contrôle | Critère | Méthode |
|---|---|---|
| API healthy | `Up X seconds (healthy)` | `docker compose ps` |
| Actuator health | `{"status":"UP"}` | `curl /healthz` |
| Variables propagées | `RESEND_FROM_EMAIL=noreply@loyertracker.org` | `docker exec loyertracker-api-1 env \| grep RESEND` |
| Envoi e-mail test | Resend ID retourné, expéditeur `LoyerTracker <noreply@loyertracker.org>` | Endpoint de test ou déclenchement manuel |
| Réception e-mail test | Email reçu dans la boîte de destination | Vérification manuelle |
| DKIM/SPF/DMARC | `pass/pass/pass` dans les en-têtes | Inspection des en-têtes de l'email reçu |
| Budget | `notification_budget_consomme` incrémenté de 1 | Actuator ou requête DB |
| Services non ciblés | `postgres`, `keycloak`, `nginx` inchangés | `docker compose ps` (uptime antérieur) |

## 5. Kill-switch

En cas d'échec (email non reçu, erreur Resend, DKIM/SPF fail) :

```bash
# Restaurer .env
cp .env.bak-pre-noreply-prod-YYYYMMDDTHHMMSSZ .env
# Recréer api avec l'ancienne config
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps api
```

## 6. Post-déploiement — clôture de la réserve

Après validation réussie :

1. **Mettre à jour `production-state.env`** : documenter le changement d'expéditeur
2. **Mettre à jour `docs/prod-state.md`** : entrée `RESEND_FROM_EMAIL=noreply@loyertracker.org`
3. **Clôturer `RSV-EMAIL-NOREPLY-01-UNIDIR`** dans le Design Debt Register
4. **Conserver la contrainte d'unidirectionnalité** comme note permanente dans le runbook Resend §9.4

## 7. Contrainte permanente — unidirectionnalité

`noreply@loyertracker.org` n'est **pas une boîte de réception**. Aucun MX ne l'achemine. Toute réponse est perdue sans notification. Chaque e-mail envoyé depuis cette adresse doit porter un chemin de contact alternatif :

> *« Cet e-mail est envoyé automatiquement, merci de ne pas y répondre. Pour toute question, contactez votre gestionnaire ou le support. »*

Cette contrainte est documentée dans `docs/cgpa/07-devsecops/runbook-resend.md` §9.4 et reste applicable après clôture de la réserve.

## 8. Décision

**GO** — le déploiement de `noreply@loyertracker.org` comme expéditeur Resend en Production est autorisé. L'exécution est manuelle sur `loyertracker-prod-server` par un opérateur habilité. La validation inclut un envoi réel et la vérification DKIM/SPF/DMARC. Après succès, `RSV-EMAIL-NOREPLY-01-UNIDIR` est close, la contrainte d'unidirectionnalité restant documentée comme permanente.
