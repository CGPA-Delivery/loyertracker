# Clôture Release `1.16.0` — EP-18 Notifications EMAIL Resend

| Champ | Valeur |
|---|---|
| Décision | **RELEASE `1.16.0` CLÔTURÉE — CDO GO** |
| Date décision | `2026-08-06T05:59:59Z` |
| Release | `1.16.0` |
| Épisode | EP-18 — Notifications EMAIL Resend |
| Tag / candidat historique | `sha-8c9f1e4a` |
| Merge repository final | PR #381 — `52683c5` |
| Statut Production | `PRODUCTION_DEPLOYED` confirmé |
| Statut Resend | `RESEND_PRODUCTION_ENABLED` |
| Décision suivante autorisée | instruction séparée du prochain chantier PO/CDO |

## 1. Objet de la décision

Cette décision clôt officiellement le cycle Release `1.16.0` / EP-18 après :

- Gate Staging EP-18 **GO** ;
- Gate Production EP-18 réinstruit **GO sous réserve / `PRODUCTION_READY`** ;
- Préflight Production EP-18 **PASS** ;
- déploiement technique Production EP-18 **PASS technique** ;
- validation finale Production **PASS / `PRODUCTION_DEPLOYED`** ;
- hypercare T0/T+12/T+24 accepté PO et terminé sans incident bloquant ;
- activation Resend Production exécutée et tracée ;
- merge de la PR #381 et resynchronisation dépôt/hôte Production.

## 2. Synthèse des preuves

| Contrôle | Résultat |
|---|---:|
| PR #381 | ✅ mergée le `2026-08-06T05:41:38Z` |
| Merge commit #381 | `52683c5a859a44499f3814c31c956b01620254e8` |
| `main` local | ✅ resynchronisé sur `origin/main` |
| Hôte Production | ✅ resynchronisé sur `52683c5` |
| `check-release-state.sh --ci` | ✅ **COHÉRENT** |
| `check-release-state.sh --host` | ✅ **COHÉRENT** |
| API / Web digests | ✅ conformes aux digests EP-18 |
| Flyway Production | ✅ `31/31` |
| API / Nginx / PostgreSQL / Keycloak | ✅ healthy |
| `/healthz` / racine publique | ✅ `200 / 200` |
| Smoke Production final | ✅ **65 PASS / 0 FAIL** — RUN_ID `1785957904` |
| Nettoyage smoke | ✅ 47 lignes DB supprimées, 2 comptes Keycloak supprimés, résidus `0` |
| `directAccessGrantsEnabled` / bailleur test | ✅ `false` / `enabled=false` |
| `notification_outbox` / `notification_delivery` | ✅ `0 / 0` |
| `notification_event` | `34` |

## 3. État Resend Production clôturé

| Variable / garde-fou | Valeur finale |
|---|---:|
| `RESEND_EMAIL_ENABLED` | `true` |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` |
| `NOTIFICATIONS_EXTERNAL_ENABLED` | `true` |
| `NOTIFICATION_DRY_RUN` | `false` |
| `NOTIFICATION_BUDGET_MENSUEL_MAX` | `100` |
| `NOTIFICATION_BUDGET_SEUIL_ALERTE` | `0.8` |
| `TWILIO_SMS_ENABLED` / `TWILIO_WHATSAPP_ENABLED` | `false / false` |

La dérive opérationnelle initiale est résorbée : le correctif `docker-compose.yml` transmet désormais les variables budget au conteneur `api`, et ce correctif est présent dans `main` via la PR #381.

## 4. Réserves / observations

| Réserve / observation | Statut clôture |
|---|---:|
| `R-V54-2` — drift tag/digest Production | ✅ levée avant Gate Production réinstruit |
| Webhook Resend/Svix EP-18 | ✅ non bloquant EP-18, reclassé en EP-19 |
| Hypercare T+12/T+24 hors fenêtre | ✅ accepté PO comme valeur probante suffisante |
| `NotificationKillSwitchFerme` historique | ✅ non bloquant ; activation Resend effectuée ensuite avec `outbox/delivery=0/0` |
| `BackupHeartbeatMissing` historique | ✅ non bloquant pour EP-18 ; sujet exploitation récurrent hors critère de suspension release |

Aucune réserve bloquante ne s'oppose à la clôture de la release `1.16.0`.

## 5. Décision CDO

**CDO GO — RELEASE `1.16.0` CLÔTURÉE.**

La release `1.16.0` / EP-18 est considérée livrée, validée, hypercare acceptée, activée Resend selon instruction PO, et alignée entre dépôt `main` et hôte Production.

## 6. Limites explicites de cette clôture

Cette décision :

- n'autorise pas de nouveau développement ;
- n'autorise pas de nouveau déploiement Production ;
- n'autorise pas de migration supplémentaire ;
- n'autorise pas de smoke destructif ;
- n'autorise pas l'activation Twilio SMS/WhatsApp ;
- ne démarre pas automatiquement EP-19 ;
- ne ferme pas les sujets futurs reclassés hors EP-18, notamment Webhooks Resend/Svix.

## 7. Prochaine étape autorisée

La prochaine étape doit être une décision PO/CDO distincte choisissant le prochain chantier, par exemple :

1. EP-19 — Webhooks Resend/Svix ;
2. surveillance opérationnelle Resend réelle ;
3. prochain sprint backlog produit.
