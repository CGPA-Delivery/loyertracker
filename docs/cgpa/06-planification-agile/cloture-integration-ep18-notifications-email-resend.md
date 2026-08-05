# Clôture d’intégration — EP-18 Canal EMAIL via Resend

| Champ | Valeur |
|---|---|
| Date de décision | 2026-08-05 |
| Cadre | CGPA v6.1.1 — Enterprise Delivery Governance |
| Périmètre | EP-18 — Canal EMAIL via Resend, extension du système notifications EP-16 |
| Branche intégrée | `feat/ep18-notifications-email-resend` |
| Pull Request | [PR #368](https://github.com/jptshilombo/loyertracker/pull/368) |
| Merge commit | `8c9f1e4aaa2a57946af841bbccd052f38fd471be` |
| Head intégré | `e3f9d294a41113dd6b4ec1cbfc06b839ed92b7e2` |
| Décision | **GO sous réserve — clôture d’intégration repository uniquement** |

## 1. Objet de la décision

Cette décision clôt **l’intégration repository** d’EP-18 après fusion de la PR #368 sur `main`.

Elle ne constitue pas :

- un Gate Staging ;
- une promotion Staging ;
- une Release Candidate ;
- un Gate Production ;
- une activation réelle de Resend ;
- une autorisation d’utiliser ou d’exposer un secret Resend.

## 2. Périmètre intégré

EP-18 est intégré à `main` avec le périmètre suivant :

- **Sprint A** — socle EMAIL/Resend : canal `EMAIL`, abstraction `ChannelNotificationProvider`, providers `ResendEmailProvider` / `NoopEmailProvider`, configuration sûre par défaut, migration additive `V30`.
- **Sprint B** — invitation gestionnaire par e-mail : émission transactionnelle d’un événement et d’une ligne Outbox EMAIL depuis `InvitationService`, sans préférence préalable, migration additive `V31`.
- **Sprint C** — webhooks Resend : callback public signé Svix, vérification HMAC-SHA256, application de statut via la fonction générique existante `notification_delivery_appliquer_statut`, sans nouvelle migration.
- Documentation additive : ADR-19, backlog EP-18, addenda EB/CDC, analyse d’impact, runbook Resend et Project State.

## 3. Preuves de merge et de CI

### Pull Request

- PR : [#368](https://github.com/jptshilombo/loyertracker/pull/368)
- État : `MERGED`
- Fusion : 2026-08-05T13:28:32Z
- Merge commit : `8c9f1e4aaa2a57946af841bbccd052f38fd471be`
- Diff : 43 fichiers, `+3264 / -63`

### Checks PR sur le head `e3f9d29`

| Contrôle | Résultat |
|---|---|
| CI — Backend build/tests/couverture | SUCCESS |
| CI — Frontend build/tests | SUCCESS |
| CI — Sécurité gitleaks/SCA/Trivy | SUCCESS |
| CI — Build, scan et SBOM Docker | SUCCESS |
| CodeQL Java/Kotlin | SUCCESS |
| CodeQL JavaScript/TypeScript | SUCCESS |
| Registry Policy — GHCR latest | SUCCESS |
| CGPA Framework Audit | SUCCESS |

### Validation post-merge sur `main` / merge commit `8c9f1e4`

| Workflow `main` | Résultat | Run |
|---|---|---|
| CI | SUCCESS | `31010371683` |
| CodeQL | SUCCESS | `31010371695` |
| Registry Policy | SUCCESS | `31010371646` |
| CGPA Framework Audit | SUCCESS | `31010371651` |

## 4. État des environnements

| Environnement | État après cette décision |
|---|---|
| Dépôt `main` | EP-18 intégré via PR #368 |
| Dev/Test CI | Vert sur PR puis sur `main` |
| Staging | **Non instruit pour EP-18** |
| Production | **Inchangée** — `1.15.0`, `sha-ac374193`, Flyway Production `29/29` |
| Resend réel | **Non activé** |
| Secrets Resend | Non lus, non exposés, non committés |

Le fichier `infra/release/production-state.env` reste cohérent :

- `FLYWAY_EXPECTED_REPO=31` — le dépôt contient V30/V31 ;
- `FLYWAY_EXPECTED_PROD=29` — la Production n’a pas reçu EP-18 ;
- `PRODUCTION_TAG=sha-ac374193` — Production inchangée.

## 5. Réserves maintenues

| Réserve | Statut | Effet |
|---|---|---|
| `RSV-EP18-06` — signature webhook Resend/Svix non vérifiée contre trafic réel | **Ouverte** | Vérification obligatoire avant tout Gate Staging EP-18 |
| Activation Resend réelle | **Non autorisée** | Nécessite Gate Staging puis décisions distinctes |
| Promotion Staging EP-18 | **Non instruite** | Nécessite Gate Staging EP-18 + STG-ISOL-01 |
| Production EP-18 | **Interdite à ce stade** | Nécessite Gate Production distinct après Staging validé |

## 6. Décision CDO

**GO sous réserve — clôture d’intégration repository EP-18.**

La PR #368 est intégrée à `main`, les contrôles CI et sécurité sont verts sur le head PR puis sur le merge commit `8c9f1e4`, et le périmètre EP-18 est traçable dans les documents CGPA.

Cette décision clôt uniquement l’intégration repository. Elle **n’autorise aucune promotion Staging ou Production** et **n’active pas Resend**.

## 7. Prochaine décision autorisée

La prochaine décision CGPA logique est l’**instruction du Gate Staging EP-18**, sur décision PO/CDO distincte.

Prérequis minimaux du Gate Staging EP-18 :

1. vérifier l’artefact immutable publié depuis `main` ;
2. contrôler `CHECK-CICD-01` ;
3. exécuter `STG-ISOL-01` avant/après ;
4. appliquer V30/V31 en Staging ;
5. exécuter le smoke complet ;
6. vérifier un parcours EMAIL Resend contrôlé en Staging ;
7. vérifier réellement le webhook Resend/Svix (`RSV-EP18-06`) ;
8. confirmer qu’aucune Production n’est autorisée par ce Gate Staging.
