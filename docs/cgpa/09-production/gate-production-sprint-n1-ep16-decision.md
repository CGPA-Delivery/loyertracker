# Gate Production — EP-16 Sprint N+1 (WhatsApp P0)

| Champ | Valeur |
|---|---|
| Date | 2026-07-24 |
| Version | `1.14.0` MINOR (proposée — à confirmer et dater au Préflight) |
| Candidat applicatif | merge PR #252 + PR #254 (correctif lien de vérification), tag immuable `sha-27dce09d` |
| Digests Staging | API `sha256:089028b45a93afd4f12d5aa22cfc63a38f5687bb1d0f7204bc1965154ce8d7ff` ; Web `sha256:7dbc551ee722e1da7697d71749b94a731fce0b028b7b7288c88d8346488e8bc8` |
| Source | `ai-test-server`, `STAGING_DEPLOYED`, `STG-ISOL-01` PASS |
| Production actuelle / rollback | `1.13.0`, `sha-e4744d92` (clôturée le 2026-07-24) |
| Décision | **GO sous réserve — `PRODUCTION_READY`** |

## Périmètre

EP-16 Sprint N+1, US-122/123 : premiers envois WhatsApp réels, en environnement **Twilio Sandbox
exclusivement**. Migration additive V28 (seed de 3 templates P0, 2 fonctions `SECURITY DEFINER`
de découverte cross-tenant et d'application idempotente de callback). `TwilioNotificationProvider`
(implémentation réelle), `NotificationDispatcher`, callback de statut public signé,
`NotificationDispatchScheduler`.

**Le Gate ne couvre pas l'activation Production des canaux externes.** Conformément à K8
(ADR-18), toute activation réelle en Production reste interdite jusqu'à la clôture en GO du
Sprint N+2 — le déploiement de ce candidat en Production livre la **capacité** applicative
(`TwilioNotificationProvider` disponible, conditionnelle) sans jamais l'**activer** :
`NOTIFICATIONS_EXTERNAL_ENABLED`/`TWILIO_WHATSAPP_ENABLED` doivent rester à leurs valeurs sûres
par défaut (`false`) en Production, et **aucun credential Twilio ne doit être ajouté au `.env`
de l'hôte de production à ce stade** — `NoopNotificationProvider` reste l'unique fournisseur actif
après ce déploiement, exactement comme après le Sprint N.

## Checklist CGPA v5.4.1

| Critère | Statut | Preuve |
|---|---|---|
| Identification complète | PASS | Sprint N+1 EP-16, `1.14.0` proposée, tag/digests et environnements identifiés |
| Candidat exact en Staging | PASS | `sha-27dce09d`, Gate Staging GO (`gate-staging-sprint-n1-ep16-decision.md`) |
| `STG-ISOL-01` | PASS | 9 conteneurs projet+NPM intacts avant/après, restart=0, seuls API/Nginx recréés, aucune commande Docker globale |
| Migration | PASS | V28 additive, Flyway 28/28 ; seed de référentiel + fonctions `SECURITY DEFINER`, aucune colonne modifiée |
| Smoke Staging | PASS | 63 PASS / 0 FAIL |
| Validation fonctionnelle — critère GO explicite du sprint | PASS | Vérification manuelle réelle en Sandbox : quittance → WhatsApp livré (confirmé côté Twilio, `status: delivered`) → lien de vérification `VALIDE` → confirmé visuellement par le PO ; `PAIEMENT_RECU` (sans template) → `DEAD` sans envoi, confirmé en conditions réelles |
| Écarts détectés et corrigés avant/pendant le Gate | PASS | Lien de vérification manquant du payload (PR #254, avant déploiement) ; basic-auth NPM bloquant `/verify/` (corrigé après confirmation PO, scope précis, aucune commande Docker globale) |
| CI / tests | PASS | PR #252/#254/#255 : Backend, Frontend, Sécurité, Packaging Docker, CodeQL tous SUCCESS ; `mvn verify` 205/205 |
| SonarQube | PASS | Quality Gate vert après revue par le PO d'un Security Hotspot (`java:S4790`, HmacSHA1 imposé par le protocole Twilio, non modifiable) |
| Sécurité | PASS | Gitleaks, SCA, Trivy et CodeQL verts ; signature `X-Twilio-Signature` vérifiée avant tout traitement du callback public ; secrets Twilio jamais versionnés ni affichés dans une commande visible |
| Release notes / changelog | PASS | Section `[Non publié]` de `CHANGELOG.md` couvre le Sprint N+1 ; promotion en `[1.14.0]` datée au Préflight |
| Observabilité | **PASS avec limite connue** | Staging Prometheus 5/5, 0 erreur API, 0 HTTP 5xx pendant la vérification. Aucune métrique dédiée `notification.*`/alerte Alertmanager spécifique aux envois Twilio à ce stade — **explicitement prévu au Sprint N+2** (US-126) par le Plan d'Exécution, non un écart de ce sprint. Sans impact ici : les canaux externes restent inactifs en Production après ce déploiement |
| PO / Release Manager | PASS | Instructions PO explicites reçues le 2026-07-24 (GO Sprint N+1, Gate Staging, Gate Production) |
| État release précédente | PASS | `1.13.0` `PRODUCTION_DEPLOYED` et **RELEASE CLÔTURÉE** le 2026-07-24 (hypercare T0/T+12/T+24 complète) — aucune réserve bloquante héritée |

## Rollback

V28 est additive (seed de référentiel + fonctions `SECURITY DEFINER`, aucune colonne modifiée) :
le rollback applicatif ciblé vers `sha-e4744d92` (`1.13.0`) reste viable après migration —
l'ancienne application ignore les 3 templates seedés et les 2 nouvelles fonctions. La procédure
cible uniquement API et Nginx ; PostgreSQL, Keycloak et monitoring ne doivent pas être recréés.

Le Préflight devra néanmoins produire et vérifier un backup base + globals avant migration, par
discipline constante du projet — aucun second backup post-migration n'est requis (V28 additive,
même profil que V27/Sprint N).

## Réserves et conditions

| ID | Statut | Traitement |
|---|---|---|
| RSV-PROD-EP16-N1-01 — aucune activation réelle des canaux externes | Condition permanente du Gate | `NOTIFICATIONS_EXTERNAL_ENABLED`/`TWILIO_WHATSAPP_ENABLED` doivent rester `false` en Production ; aucun credential Twilio sur l'hôte de production avant le GO du Sprint N+2 (K8, ADR-18) |
| RSV-PROD-EP16-N1-02 — observabilité dédiée aux notifications externes non encore livrée | Non bloquante, prévue Sprint N+2 (US-126) | Sans impact tant que les canaux restent inactifs en Production |
| RSV-STG-01 — accès public Staging protégé par Access List NPM | Héritée, non bloquante | Sans rapport avec ce candidat |

Conditions bloquantes du Préflight distinct :

1. vérifier en lecture seule la Production `1.13.0`, sa capacité, Flyway 27/27 et son
   observabilité ;
2. produire et vérifier backup base + globals avant V28 ;
3. confirmer le tag `sha-27dce09d`, les deux digests Staging et la disponibilité du rollback
   `sha-e4744d92` ;
4. promouvoir le changelog en `[1.14.0]` daté et figer la fenêtre ;
5. **confirmer explicitement l'absence de toute variable ou credential Twilio dans le `.env` de
   production**, et que `NOTIFICATIONS_EXTERNAL_ENABLED`/`TWILIO_WHATSAPP_ENABLED` resteront à
   leurs valeurs sûres par défaut après déploiement ;
6. préparer le smoke canonique ≥63 et confirmer 0 activité sur les tables `notification_delivery`
   après déploiement (aucun envoi possible, `NoopNotificationProvider` actif) ;
7. cibler exclusivement API/Nginx pour déploiement ou rollback.

## Avis et décision

| Rôle | Avis |
|---|---|
| Governance Officer | **GO sous réserve** — checklist complète, historique préservé, `STG-ISOL-01` PASS, écarts détectés en cours de route tracés et corrigés (pas dissimulés) |
| Enterprise Architect | **GO** — V28 additive, callback public sur le patron `lire_quittance_publique`, rollback applicatif viable |
| DevSecOps Lead | **GO sous réserve** — CI, SonarQube (après revue Hotspot), sécurité, images, Flyway, smoke et vérification fonctionnelle réelle PASS ; backup Préflight obligatoire |
| Release Manager | **GO sous réserve** — candidat figé ; aucune activation externe autorisée avant le Sprint N+2 (K8) |
| Product Owner | **GO** — instruction explicite de passage au Gate Production reçue le 2026-07-24 |
| Chief Delivery Officer | **GO sous réserve — `PRODUCTION_READY`** |

**Décision finale : GO sous réserve.** `PRODUCTION_READY` est atteint le 2026-07-24.

Cette décision autorise uniquement un **Préflight Production**. Elle n'autorise aucune mutation
ni aucun déploiement Production. `PRODUCTION_DEPLOYED` reste non atteint. L'activation des canaux
externes reste interdite jusqu'à la clôture en GO du Sprint N+2, conformément à K8 — ce Gate
livre uniquement la capacité applicative, jamais son activation réelle en Production.
