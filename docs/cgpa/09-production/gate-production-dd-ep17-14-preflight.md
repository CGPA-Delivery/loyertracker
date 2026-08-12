# Gate Production — Préflight SMTP Keycloak (DD-EP17-14)

| Champ | Valeur |
|---|---|
| Date | 2026-08-12 |
| Statut | **NO GO technique temporaire — préparation en cours** |
| Dette | `DD-EP17-14` — flux Keycloak « mot de passe oublié » / SMTP |
| Référence Staging | PR #456 + PR #457 + PR #458 ; `gate-staging-smtp-keycloak-dd-ep17-14-decision.md` |
| Candidat source | `278d8b67961579b1f36274797eca2432e54ccee1` (`main`, après PR #458) |
| Nature du changement | Configuration runtime du realm Keycloak uniquement ; aucune image API/Web ni migration PostgreSQL à reconstruire |
| Décision CDO | En attente — aucune autorisation de déploiement Production par ce document |

---

## 1. Évidence Staging admissible

| Critère | Résultat | Preuve |
|---|---:|---|
| Configuration SMTP SES Mail Manager | PASS | PR #456 ; service one-shot `keycloak-smtp-init` |
| Parcours réel « mot de passe oublié » | PASS | Validation PO/CDO Staging, 2026-08-12 |
| Anti-énumération | PASS | Compte existant/inexistant : `HTTP 200` et message utilisateur identique |
| Isolation du déploiement Staging | PASS | Configuration de realm ciblée ; services non ciblés inchangés |

La promotion Production n'est pas implicite : le Gate Staging ne constitue pas une autorisation Production.

---

## 2. Préflight Production exécuté (lecture seule)

| Contrôle | Résultat | Preuve |
|---|---:|---|
| Hôte Production accessible depuis le réseau d'administration | PASS | `172.31.22.90` |
| Services `api`, `nginx`, `keycloak`, `postgres` | PASS | Tous healthy lors du préflight |
| Observabilité | PASS | Prometheus, Alertmanager, Pushgateway et Blackbox actifs |
| Verrou release | PASS | `infra/release/check-release-state.sh --host` : digests API/Web et Flyway 32 cohérents |
| Backup périodique | PASS | Dernier dump quotidien présent le 2026-08-12 02:15 |
| SMTP Keycloak Production | **FAIL / non configuré** | Aucune variable `KC_SMTP_*` présente dans `.env` Production |
| Mécanisme de déploiement Production | **FAIL / absent** | Aucun service SMTP équivalent dans `docker-compose.prod.yml` |
| État Git hôte Production | **RÉSERVE bloquante** | HEAD hôte antérieur à `main` et arborescence de travail locale non propre ; aucune synchronisation ou mutation effectuée |

---

## 3. Avis indépendants

| Rôle | Verdict | Conclusion |
|---|---:|---|
| QA / DevSecOps | **NO GO** | La preuve Staging est PASS, mais aucune preuve fonctionnelle/sécurité Production ni rollback de configuration realm n'est disponible. |
| SRE / Operations | **NO GO** | Le chemin SMTP est Staging-only ; préflight, backup hashé dédié, rollback et observabilité spécifique doivent être instruits. |
| Release Manager / Delivery Architect | **NO GO** | Aucun candidat de configuration Production immutable, ni service/script Production, ni CHECK-REL-01/CHECK-OPS-01 dédié. |

Ces avis sont produits par agents et ne constituent pas des signatures humaines. Ils exigent une décision CDO distincte après clôture des critères ci-dessous.

---

## 4. Critères impératifs avant réinstruction

1. **Mécanisme Production dédié et idempotent** : script/service explicitement Production, avec host/port/user/password/from injectés exclusivement depuis `.env` local ; pas de réemploi implicite du script Staging ni de secret versionné.
2. **Identité immutable de la configuration** : commit, script et compose exacts référencés dans une Release Candidate de configuration ; API/Web et Flyway restent les digests/versions déjà déployés, sans rebuild.
3. **Hygiène de l'hôte** : synchroniser de manière contrôlée le dépôt Production ou exécuter le mécanisme depuis un checkout propre et identifé ; ne pas écraser les fichiers `.env` ni les sauvegardes locales.
4. **Backup pré-changement** : dump PostgreSQL + globals, SHA-256, `pg_restore --list`, emplacement et responsable tracés. Le changement realm est stocké dans PostgreSQL : le backup est donc requis même sans migration.
5. **Rollback spécifique SMTP** : export/redaction de l'état `smtpServer` précédent, procédure d'effacement/restauration par API Admin, critères et responsable CDO/RM. Le rollback ne recrée pas API/Web et ne touche pas aux migrations.
6. **CHECK-REL-01 dédié** : périmètre, candidat, Staging PASS, preuve sécurité, rollback et Gate 07A documentés.
7. **CHECK-OPS-01 pré-Production dédié** : health Keycloak/API/Web, logs Keycloak, Prometheus/Alertmanager, seuils, canal d'escalade, fenêtre et hypercare.
8. **Tests Production contrôlés après déploiement** : compte de test autorisé, réception/action-token, puis comparaison anti-énumération existant/inexistant (même HTTP et même message). Aucun identifiant, contenu e-mail ou secret dans le dépôt.
9. **Décision humaine explicite** : après réinstruction, décision CDO `GO / PRODUCTION_READY`, puis instruction opérationnelle séparée de déploiement.

---

## 5. Rollback cible à valider avant exécution

| Niveau | Action autorisée | Interdit sans décision CDO/RM |
|---|---|---|
| Configuration Keycloak | Restaurer/effacer les champs `smtpServer` vers l'état pré-déploiement via API Admin | Recréation globale de la stack ou modification de realm JSON historique |
| Application | Aucune action attendue : API/Web restent inchangés | Rebuild ou remplacement des digests API/Web |
| Données | Utiliser le dump pré-Gate seulement si le rollback de configuration est insuffisant et sur décision CDO/RM | Restauration destructive automatique |

---

## 6. Décision de préflight

**NO GO technique temporaire.** Le correctif est validé en Staging, mais le mécanisme et les preuves Production n'existent pas encore. La seule action autorisée par ce préflight est la création contrôlée du mécanisme Production et de ses preuves sur branche dédiée, après plan d'exécution validé. Aucun déploiement Production, aucun secret, aucun changement de realm Production et aucune synchronisation destructive de l'hôte ne sont autorisés par ce document.
