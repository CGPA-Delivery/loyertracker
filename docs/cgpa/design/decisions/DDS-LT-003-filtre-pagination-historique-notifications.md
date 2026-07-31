# DDS-LT-003 — Filtre et pagination de l'historique des notifications

> Instance projet d'une Design Decision Specification, même convention que `DDS-LT-001`/`002`.
> Formalise **DDS-cand-2**, candidate identifiée par `UXR-001.md` (2026-07-30) et laissée ouverte
> par `phase-02-design-system.md` §5.

## Métadonnées

| Champ | Valeur |
|---|---|
| Identifiant | DDS-LT-003 |
| Titre | Filtre et pagination de l'historique des notifications |
| Statut | **Acceptée** — validation Product Owner explicite obtenue le 2026-07-31 |
| Date | 2026-07-31 |
| Responsable | Design Architect — Claude Code, sous-agent CGPA désigné le 2026-07-30 |
| Version DSG | `DSG-001.md` v0.1.0 |
| Product Owner | jptshilombo@gmail.com — validation requise avant instruction du Gate 04A applicable à US-125 |
| Documents amont | `phase-02-design-system.md` §5, `phase-02-user-journeys.md` (J2/J3), `UXR-001.md` |

## Contexte

Les deux seules listes transverses existantes (`AlertesListeComponent`, `AuditJournalComponent`)
sont volontairement **non filtrées et non paginées** : « liste brute la plus récente d'abord, sans
filtre ni pagination » (commentaire explicite du code, décision de Plan d'Exécution antérieure).
L'historique des notifications (J2/J3) envisage des filtres (bien, destinataire, statut, période),
ce qui en ferait le **premier composant filtrable/paginé du dépôt** — une extension du vocabulaire
de composants, pas une simple réutilisation.

`phase-02-design-system.md` §5 pose explicitement la règle de décision : un filtre ne doit être
introduit que « si le volume attendu de notifications rend la liste brute inexploitable — à
justifier par une estimation de volume réelle avant Gate 04A, pas par défaut ».

## Problème

Introduire ou non un filtre/pagination pour la première itération de l'historique des
notifications, et sur quelle base factuelle.

## Données de volume réel disponibles

Constat vérifié dans `docs/project-state.md` (validation finale Production `1.15.0`, 2026-07-30,
et hypercare `1.14.0`) : **`notification_outbox` et `notification_delivery` sont à 0 en
Production**, `NoopNotificationProvider` seul actif, aucun canal externe activé (verrou
`K8`/`ADR-18`, aucun credential Twilio en Production). Le volume réel de notifications en base est
donc **nul à ce jour** — aucune donnée n'existe pour estimer un volume qui justifierait un filtre.
L'activation des canaux externes reste conditionnée au GO explicite du Sprint N+2 (EP-16), non
encore obtenu pour la mise en Production des canaux (Sandbox Twilio utilisé en Staging
uniquement).

## Options étudiées

| Option | Description | Avantages | Inconvénients |
|---|---|---|---|
| **1 — Aligner sur le précédent minimal** | Liste brute la plus récente d'abord, sans filtre, pour cette première itération | Cohérent avec le format déjà accepté deux fois (Alertes, Audit) ; aucun nouveau composant filtrable à concevoir/tester/documenter accessibilité pour ce lot | Si le volume réel s'avère élevé après activation des canaux, la liste brute pourrait devenir peu exploitable — risque différé, pas immédiat |
| **2 — Introduire un filtre minimal (a minima par statut)** | Filtre dès la première itération | Anticipe un volume futur élevé | Introduit le premier composant filtrable du dépôt **sans aucune donnée de volume réel pour le justifier** — contraire à la règle explicite de `phase-02-design-system.md` §5 (« pas par défaut ») ; charge de conception/test/accessibilité supplémentaire non justifiée à ce stade |

## Décision retenue

**Option 1 — aligner sur le précédent minimal** : liste brute, la plus récente d'abord, sans
filtre ni pagination, pour cette première itération de l'historique des notifications.

## Justification

* La règle de décision posée par `phase-02-design-system.md` §5 est explicite : un filtre doit
  être « justifié par une estimation de volume réelle », jamais introduit par défaut. Le seul
  volume réel mesurable à ce jour est **0** (canaux externes inactifs en Production, K8/ADR-18) —
  aucune donnée ne justifie un filtre.
* Cohérence avec les deux précédents du dépôt (Alertes, Audit), tous deux volontairement non
  filtrés à leur introduction.
* Réversible sans dette : si le volume réel observé après activation des canaux externes (Sprint
  N+2 puis usage réel en Production) s'avère élevé, un filtre pourra être introduit dans un lot
  ultérieur, sur la base de données réelles — pas une hypothèse.

## Conséquences positives

* Aucun nouveau patron de composant à concevoir pour ce lot (filtre, pagination, état de
  chargement associé, tests d'accessibilité dédiés).
* Cohérence stricte avec les composants transverses existants.

## Conséquences négatives

* Si le volume de notifications croît rapidement après activation réelle des canaux externes, la
  liste brute pourrait devenir peu exploitable pendant la fenêtre entre l'activation et
  l'introduction éventuelle d'un filtre — risque accepté, à réévaluer avec des données réelles
  post-activation, pas avant.

## Alternatives rejetées

* **Option 2 (filtre minimal dès ce lot)** : rejetée — introduirait le premier composant
  filtrable du dépôt sur la seule base d'une anticipation, contrairement à la règle de décision
  explicitement posée pour ce point (« pas par défaut »).

## Compatibilité

* Aucun impact backend : les endpoints de lecture consolidée restent à créer indépendamment de
  cette décision (aucun endpoint de lecture consolidée n'existe encore, `phase-02-ui-mockups.md`
  §0).
* Aucun impact sur `DSG-001.md` : le composant `lt-data-table` reste candidat pour un usage futur
  filtrable, mais n'est pas requis pour cette première itération (liste simple, patron
  `.panel`/`.list`/`.row` existant suffit).

## Critère de réévaluation

Cette décision doit être réexaminée (nouvelle DDS, pas une réouverture de celle-ci) dès qu'un
volume réel de notifications est observé en Production après activation des canaux externes
(post-GO Sprint N+2) — pas sur simple anticipation.

## Traçabilité

* **Origine** : `UXR-001.md` (DDS-cand-2), `phase-02-design-system.md` §5.
* **Registre** : `design-decision-register.md`.
* **Gate concerné** : Gate 04A applicable à US-125 (non instruit à ce jour).

## Décision

* **Statut : Acceptée** — décision explicite du Product Owner (jptshilombo@gmail.com), 2026-07-31
  (« valide DDS-LT-002→005 »), sur la recommandation du Design Architect (aucun filtre pour ce lot).
* Cette acceptation ne vaut ni GO, ni GO sous réserve, ni NO GO du Gate 04A applicable à US-125 —
  elle clôt la réserve non bloquante DDS-cand-2 du Gate 02A
  (`gate-02A-decision-ep16-us125.md` §4). Le critère de réévaluation §Critère de réévaluation
  reste applicable : cette décision n'est pas figée sans limite, elle est due pour révision dès
  qu'un volume réel de notifications est observé en Production.
* Aucune implémentation n'est autorisée par ce document.
