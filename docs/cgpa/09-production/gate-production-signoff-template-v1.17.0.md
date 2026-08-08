# Modèle de validation — Gate Production

## Utilisation

Ce modèle est à copier pour chaque signataire autorisé de la RC `1.17.0-rc.1` / US-125 Notifications.

- Une personne = une validation distincte.
- Le rôle doit correspondre à l’habilitation réelle de la personne.
- Une validation `PASS sous réserve` doit lister des réserves non bloquantes, datées et assignées.
- Une validation `NO GO` bloque la promotion Production.
- Ne pas utiliser ce modèle pour fabriquer une signature : remplacer les champs uniquement après validation réelle.

## Références communes de la RC

```text
Projet       : LoyerTracker
Périmètre    : EP-16 / US-125 Notifications
RC           : v1.17.0-rc.1
Source code  : d19c4fea850263c5bfbb92fcb288dd7bd2e56e2a
API digest   : sha256:8e94c002a65bff590c9694b1dd79ca2eb9ab04639f9f59ddb5b735afe001a30d
Web digest   : sha256:18ade4b483955691fedd7d46a2c893ff27facd9d6dcf5249350005080d679d67
Staging      : Gate GO / STAGING_DEPLOYED
STG-ISOL-01  : PASS
Smoke        : 63 PASS / 0 FAIL
Flyway       : 32/32 en Staging ; 31/31 en Production avant promotion
Production   : aucun déploiement exécuté
```

## Format standard à copier

```text
[Nom complet] — [Rôle habilité] — [PASS / PASS sous réserve / NO GO]
RC v1.17.0-rc.1 — US-125 Notifications
Date UTC : [YYYY-MM-DDTHH:MM:SSZ]
Périmètre examiné : [QA / métier / SRE / architecture / release / Gate Production]
Preuves consultées : [liens ou chemins exacts]
Réserves : [aucune / liste précise avec responsable et échéance]
Décision : [formulation claire]
Référence de signature : [URL commentaire GitHub / ID PV / ID signature électronique]
```

## Exemples par rôle

### 1. QA Lead — PASS

```text
Alice Dupont — QA Lead — PASS
RC v1.17.0-rc.1 — US-125 Notifications
Date UTC : 2026-08-09T00:10:00Z
Périmètre examiné : validation QA fonctionnelle, non-régression et critères d’acceptation
Preuves consultées :
- docs/cgpa/09-production/qa-report-v1.17.0-rc.1-us125.md
- smoke Staging : 63 PASS / 0 FAIL
- STG-ISOL-01 : PASS
- CI #31281982226 : Backend/Frontend/Sécurité PASS
Réserves : aucune
Décision : la RC est acceptable du point de vue QA pour l’instruction du Gate Production.
Référence de signature : commentaire GitHub PR #408, commentaire 123456789
```

### 2. Product Owner — PASS

```text
Jordan Tshilombo — Product Owner — PASS
RC v1.17.0-rc.1 — US-125 Notifications
Date UTC : 2026-08-08T23:55:00Z
Périmètre examiné : acceptation métier de la RC et périmètre US-125
Preuves consultées :
- docs/release-notes-v1.17.0-rc.1.md
- rapport QA RC
- Gate Staging US-125 : GO / STAGING_DEPLOYED
Réserves : aucune
Décision : j’accepte la RC du point de vue métier Product Owner.
Référence de signature : commentaire GitHub PR #407, commentaire 987654321
```

### 3. SRE — PASS sous réserve

```text
Bob Martin — Site Reliability Engineer — PASS sous réserve
RC v1.17.0-rc.1 — US-125 Notifications
Date UTC : 2026-08-09T00:15:00Z
Périmètre examiné : observabilité, sauvegarde, rollback, seuils et escalade
Preuves consultées :
- docs/cgpa/09-production/check-ops-01-v1.17.0-rc.1.md
- backup pré-Gate : pg_restore --list = 858 entrées
- check-release-state.sh --host : COHÉRENT
Réserves : l’astreinte SRE et les seuils d’escalade sont confirmés pour la fenêtre [date/heure] ; responsable : [nom] ; échéance : [UTC].
Décision : readiness opérationnelle acceptable sous réserve de la clôture de cette réserve non bloquante.
Référence de signature : PV Gate Production PV-[ID]
```

### 4. Delivery Architect — PASS

```text
Claire Bernard — Delivery Architect — PASS
RC v1.17.0-rc.1 — US-125 Notifications
Date UTC : 2026-08-09T00:20:00Z
Périmètre examiné : architecture, isolation, artefact immutable et stratégie de promotion
Preuves consultées :
- digests API/Web identiques Staging → RC
- STG-ISOL-01 : PASS
- addendum DAT/OpenAPI US-125
- gate-07a-v1.17.0-rc.1-decision.md
Réserves : aucune
Décision : la promotion de la RC est cohérente avec l’architecture et le modèle CGPA.
Référence de signature : commentaire GitHub PR #408, commentaire 246813579
```

### 5. Release Manager — PASS

```text
David Kabila — Release Manager — PASS
RC v1.17.0-rc.1 — US-125 Notifications
Date UTC : 2026-08-09T00:25:00Z
Périmètre examiné : versioning, release notes, traçabilité, rollback et fenêtre de release
Preuves consultées :
- Release GitHub v1.17.0-rc.1
- docs/release-notes-v1.17.0-rc.1.md
- CHECK-REL-01
- backup Production pré-Gate
Réserves : aucune
Décision : la RC est prête pour la décision formelle du Gate Production.
Référence de signature : signature électronique SIGN-[ID]
```

### 6. CDO / Enterprise Architect — décision finale

```text
Jordan Tshilombo — CDO / Enterprise Architect — GO
RC v1.17.0-rc.1 — US-125 Notifications
Date UTC : 2026-08-09T00:30:00Z
Périmètre examiné : dossier complet CHECK-REL-01, CHECK-OPS-01, Gate 07A et avis indépendants
Preuves consultées :
- docs/cgpa/09-production/independent-reviews-v1.17.0-rc.1-us125.md
- gate-07a-v1.17.0-rc.1-decision.md
- avis QA, SRE, Delivery Architect et Release Manager
Réserves : aucune
Décision : Gate Production validé GO ; PRODUCTION_READY peut être prononcé. Le déploiement reste limité aux mêmes digests et doit suivre CHECK-OPS-01 final.
Référence de signature : commentaire GitHub PR #408, commentaire 1122334455
```

## Matrice finale à compléter

| Rôle | Nom | Décision | Date UTC | Référence exacte | Statut |
|---|---|---|---|---|---|
| QA Lead | [à renseigner] | [PASS/RESERVE/NO GO] | [UTC] | [URL/ID] | À VALIDER |
| Product Owner | Jordan Tshilombo | PASS | 2026-08-08T23:55:00Z | À préciser | PASS |
| SRE | [à renseigner] | [PASS/RESERVE/NO GO] | [UTC] | [URL/ID] | À VALIDER |
| Delivery Architect | [à renseigner] | [PASS/RESERVE/NO GO] | [UTC] | [URL/ID] | À VALIDER |
| Release Manager | [à renseigner] | [PASS/RESERVE/NO GO] | [UTC] | [URL/ID] | À VALIDER |
| CDO / Enterprise Architect | [à renseigner] | [GO/RESERVE/NO GO] | [UTC] | [URL/ID] | À VALIDER |

## Règle de clôture

`PRODUCTION_READY` ne peut être renseigné que lorsque les réserves bloquantes sont nulles et que les validations obligatoires disposent chacune d’une référence exacte et vérifiable.
