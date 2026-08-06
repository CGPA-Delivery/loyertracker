# Cadrage PO/CDO — US-125, Gates 02A/04A (EP-16 Sprint N+2 Lot B)

| Champ | Valeur |
|---|---|
| Décision | **GO PO/CDO — instruire le cadrage US-125 / Gate 04A, sans codage** |
| Date | `2026-08-06` |
| Contexte déclencheur | Release `1.16.0` / EP-18 clôturée CDO GO ; choix PO du prochain sprint backlog produit |
| Périmètre | EP-16 Sprint N+2 Lot B — **US-125** interface de préférences et historique des notifications |
| Nature | Cadrage UX/UI + instruction Gate 04A ; aucune exécution applicative |
| Branche documentaire | `docs/cadrage-us125-gates-02a-04a` |

## 1. Objet

Le Product Owner valide la reprise du **sprint backlog produit suivant** après clôture de la release
`1.16.0`. Le candidat retenu est **US-125** : interface de préférences et historique des
notifications.

Cette décision ne lance pas le développement Frontend. Elle autorise uniquement la **remise à jour du
cadrage CGPA** et la préparation de l'instruction **Gate 04A** applicable au premier lot Frontend
significatif lié à US-125.

## 2. État de départ vérifié

| Élément | État constaté |
|---|---:|
| Release `1.16.0` / EP-18 | ✅ clôturée CDO GO (`cloture-release-v1.16.0.md`) |
| Production | ✅ saine et alignée dépôt/hôte au dernier contrôle post-clôture |
| Plan EP-16 | ✅ existant et approuvé ; Sprint N+2 scindé Lot A / Lot B |
| Lot A US-124/US-126 | ✅ livré historiquement |
| US-125 | ⚠️ non codée ; lot Frontend significatif |
| Gate 02A US-125 | ✅ **GO sous réserve** déjà statué (`gate-02A-decision-ep16-us125.md`) |
| UXR-001 | ✅ renseigné et validé PO pour Gate 02A |
| DDS-LT-002→005 | ✅ formalisées et acceptées PO |
| DSG-001 | ✅ instancié, versionné en `0.2.0 — Proposé`, non implémenté |
| Gate 04A | ❌ non instruit pour US-125 |

## 3. Drift documentaire identifié

Le plan EP-16 contient encore une ligne historique indiquant que `UXR-001`, `DDS-001` et `DSG-001`
étaient des gabarits vides au moment du verrou initial US-125. Cette observation est **historique** :
les documents ont depuis été partiellement ou totalement renseignés, et Gate 02A a été statué GO sous
réserve.

La conclusion actuelle reste cependant inchangée : **US-125 ne peut toujours pas être codée tant que
Gate 04A n'est pas instruit et statué**.

## 4. Action autorisée

Cette décision autorise :

1. relire et consolider les livrables UX/UI existants pour US-125 ;
2. compléter ou produire les preuves manquantes exigées par `gate-04A-design-readiness.md` ;
3. produire une décision **Gate 04A US-125** (`GO`, `GO sous réserve` ou `NO GO`) ;
4. synchroniser les documents de gouvernance liés (`project-state`, backlog/plan, changelog si applicable) ;
5. ouvrir une PR documentaire et surveiller CI.

## 5. Action explicitement interdite

Cette décision **n'autorise pas** :

- codage Frontend Angular ;
- modification backend ;
- migration Flyway ;
- modification Docker/infra ;
- Staging ;
- Production ;
- smoke destructif ;
- activation Twilio/SMS/WhatsApp ;
- manipulation de secrets ;
- démarrage EP-19.

## 6. Checklist Gate 04A à instruire

| Contrôle Gate 04A | Preuve attendue | État de cadrage |
|---|---|---:|
| Navigation et user flows validés | `UXR-001`, Phase 02 journeys/IA | À revalider |
| Wireframes critiques validés | `phase-02-ui-mockups.md` / specs UI | À revalider |
| `DSG-001` versionné | `DSG-001.md` | Présent — à confirmer suffisant |
| DDS structurantes acceptées | DDS-LT-002→005, registre DDS | Présent — à confirmer |
| Responsive valide | `CHECK-RESPONSIVE-01` ou équivalent | À produire / compléter |
| Accessibilité revue | `CHECK-ACCESSIBILITY-01` | À produire / compléter |
| Composants et états inventoriés | `component-inventory-loyertracker.md` | À revalider US-125 |
| UI Specifications exploitables | specs écrans préférences/historique | À produire / compléter |
| Erreur, vide, chargement couverts | maquettes/DSG/specs | À confirmer |
| Dette UX acceptable | `design-debt-register-loyertracker.md` | À requalifier |
| Validation Product Owner | décision PO/CDO | Présente pour cadrage ; à obtenir pour Gate 04A |
| Revue Design | `CHECK-DESIGN-01` | À produire / compléter |
| Tokens conformes | `CHECK-DESIGN-TOKENS-01` | À confirmer |
| Architecture Frontend | `CHECK-FRONTEND-01` | À produire / compléter |

## 7. Décision

**GO PO/CDO — cadrage US-125 / Gate 04A autorisé, sans codage.**

La prochaine étape opérationnelle est documentaire : produire ou compléter le dossier Gate 04A US-125.
Le développement de l'interface préférences/historique ne pourra démarrer qu'après une décision Gate
04A explicite.
