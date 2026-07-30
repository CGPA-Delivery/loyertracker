# Phase 02 — Information Architecture

| Champ | Valeur |
|-------|--------|
| Livrable CGPA | Gate 02A — UX & Design Readiness (`docs/cgpa/gates/gate-02A-ux-design-readiness.md`) |
| Périmètre couvert | US-125 — Interface de préférences et historique des notifications (EP-16, Sprint N+2 Lot B) |
| Statut | **Proposé — premier jet, non validé** |
| Auteur | Claude Code (rédaction assistée) |
| Date | 2026-07-30 |
| Validateurs requis | Design Architect (à désigner), Product Owner (jptshilombo@gmail.com) |
| Document amont | `phase-02-user-journeys.md` (J1, J2, J3) |
| Registre de dette lié | `DD-611-02` (DDS-001/DSG-001/inventaire composants non instanciés) — un point de décision structurante est identifié ci-dessous comme candidat DDS |

> **Méthode.** L'arborescence existante n'a jamais été documentée formellement (aucun Gate 02A
> rejoué rétroactivement). Elle est reconstituée ci-dessous par lecture directe du code
> (`frontend/src/app/app.routes.ts` et des composants `dashboard.component.ts`
> bailleur/gestionnaire), puis étendue au strict nécessaire pour US-125 — sans réorganiser
> l'existant.

---

## 1. Arborescence actuelle (constat de code, 2026-07-30)

```
/                          → redirige vers /bailleur
/bailleur                  → BailleurDashboardComponent (page unique, sections empilées)
                              ├─ Patrimoines / Biens / Baux (formulaires + listes)
                              ├─ Affectations et exceptions
                              ├─ Paiements du bien sélectionné   ← <app-paiements-bien>
                              ├─ Garanties du bail sélectionné   ← <app-garanties-bail>
                              ├─ Honoraires du bien sélectionné  ← <app-honoraires-bien>
                              ├─ Alertes (globales au tenant)    ← <app-alertes-liste [peutGenerer]="true">
                              └─ Journal d'audit (global, Bailleur seul) ← <app-audit-journal>
/bailleur/profil           → ProfilComponent (page dédiée : identité, adresse postale)
/gestionnaire              → GestionnaireDashboardComponent (page unique, sections empilées)
                              ├─ Biens affectés / Baux
                              ├─ Paiements, Garanties, Honoraires du bien sélectionné
                              └─ Alertes (périmètre affecté)     ← <app-alertes-liste [peutGenerer]="false">
                              (pas de journal d'audit — réservé Bailleur, US-62)
/verify/receipt/:id        → page publique non authentifiée (vérification de quittance, EP-14)
```

**Constats structurants pour US-125 :**

- Le produit n'a **qu'une seule page « profil » routée** (`/bailleur/profil`), réservée au Bailleur.
  Il n'existe **aucune page équivalente côté Gestionnaire** à ce jour.
- Les sections transverses à tout le tenant (Alertes, Audit) ne sont **pas des pages dédiées** :
  ce sont des composants standalone réutilisables, embarqués en bas des deux dashboards
  (`<app-alertes-liste>` partagé, paramétré par un `@Input() peutGenerer`). C'est le patron déjà
  éprouvé pour une donnée « transverse au tenant, pas liée à un bien précis ».
- Les sections liées à un bien/bail précis (Paiements, Garanties, Honoraires) sont des composants
  paramétrés par `[bienId]`/`[bailId]`, imbriqués sous le bien sélectionné.

Les Notifications (préférences + historique) relèvent du premier patron : ce ne sont **pas** des
données liées à un bien précis mais des données liées au **destinataire** (le Bailleur ou le
Gestionnaire lui-même) et à son **périmètre** — pas de sélection préalable d'un bien nécessaire
pour consulter l'historique complet (K6), même si un filtre par bien peut exister en confort.

---

## 2. Arborescence proposée pour US-125

```
/bailleur/profil           → ProfilComponent (existant, ÉTENDU)
                              ├─ Identité (existant)
                              ├─ Adresse postale (existant)
                              └─ Préférences de notification (NOUVEAU — J1)
                                  numéro, canal préféré, canal de secours, opt-in WhatsApp/SMS,
                                  désinscription

/bailleur                  → BailleurDashboardComponent (ÉTENDU)
                              └─ Historique des notifications (NOUVEAU — J2)
                                 <app-notifications-historique> placé juste après
                                 <app-alertes-liste> et avant/après <app-audit-journal>,
                                 même niveau hiérarchique (section transverse au tenant)

/gestionnaire               → GestionnaireDashboardComponent (ÉTENDU)
                              ├─ Préférences de notification (NOUVEAU — J1, décision ouverte §4)
                              └─ Historique des notifications (NOUVEAU — J3)
                                 <app-notifications-historique> placé juste après
                                 <app-alertes-liste>, filtré par périmètre affecté (K6)
```

**Principe de composition retenu** : un même composant standalone
`NotificationsHistoriqueComponent` réutilisé dans les deux dashboards (patron
`AlertesListeComponent`), le filtrage de périmètre restant entièrement porté par le serveur
(RLS/ReBAC), jamais par un paramètre client. Un composant distinct
`NotificationsPreferencesComponent` porte le formulaire de préférences (patron `ProfilComponent`
existant), réutilisable qu'il soit intégré à une page dédiée ou à une section de dashboard.

---

## 3. Regroupement de l'information

| Bloc | Nature | Cardinalité | Emplacement |
|---|---|---|---|
| Préférences de notification | Formulaire d'édition | 1 enregistrement par destinataire (le titulaire connecté) | Page « profil » (Bailleur) — emplacement Gestionnaire en décision ouverte §4 |
| Historique des notifications | Liste consultable, filtrable | N notifications, périmètre RLS/ReBAC | Section transverse en bas de chaque dashboard, à côté d'Alertes/Audit |

Les deux blocs restent **des sections distinctes**, jamais fusionnées dans un même écran : le
formulaire de préférences est un acte d'édition personnelle (persona = soi-même), l'historique est
une consultation de périmètre (persona = soi-même **et**, pour le Bailleur, l'ensemble de son
tenant) — cohérent avec la distinction déjà faite dans les journeys J1 vs J2/J3.

---

## 4. Décision ouverte — candidat DDS pour Gate 04A

**Point non tranché par ce document** : où placer le bloc « Préférences de notification » côté
Gestionnaire, puisqu'aucune page `/gestionnaire/profil` n'existe aujourd'hui.

| Option | Description | Avantage | Inconvénient |
|---|---|---|---|
| A — Nouvelle route `/gestionnaire/profil` | Créer une page symétrique à `/bailleur/profil` | Cohérence de navigation entre les deux rôles ; extensible à d'autres réglages personnels futurs | Premier écran entièrement nouveau côté Gestionnaire ; périmètre plus large qu'US-125 seule |
| B — Section embarquée dans le dashboard Gestionnaire | Ajouter le bloc directement en haut/bas de `GestionnaireDashboardComponent`, sans nouvelle route | Aligné sur le patron déjà utilisé pour Alertes (composant embarqué, pas de route) ; footprint minimal, cohérent avec la priorité *Should* et les 8 points d'US-125 | Asymétrie durable avec le Bailleur (pas de page « profil » Gestionnaire) |

Aucune des deux options n'est retenue par ce document — elle sera actée par une **DDS** au Gate 04A
(Design Architect + Product Owner), après arbitrage explicite. Cette décision n'est pas bloquante
pour statuer le Gate 02A (la navigation reste « suffisamment stable pour cadrer l'architecture »,
critère GO sous réserve), mais devra être fermée avant les maquettes définitives.

---

## 5. Navigation et accessibilité (niveau IA)

- Aucun nouveau niveau de menu global n'est introduit : les Notifications restent accessibles
  depuis les points d'entrée existants (`/bailleur/profil`, dashboards), sans barre de navigation
  supplémentaire à créer — cohérent avec le fait que le produit ne dispose d'aucune navigation
  globale de type menu latéral (patron page unique par rôle déjà en place).
- Le lien existant `Mon profil` (visible depuis `/bailleur`) reste le point d'entrée du bloc
  Préférences ; aucun libellé de menu à renommer.
- Les sections « transverses au tenant » (Alertes, Audit, et désormais Historique des
  notifications) devront rester distinguables par un titre de section explicite (`<h2>`) et une
  région de repère (`role`/`aria-label` cohérent avec l'existant), pour qu'un lecteur d'écran
  distingue sans ambiguïté trois listes potentiellement similaires en bas de page.
- Le détail des règles d'accessibilité (contrastes, focus, structure sémantique complète) relève du
  livrable suivant (`phase-02-design-system.md`), pas de l'IA.

---

## 6. Traçabilité

- Personas/journeys : `phase-02-user-journeys.md` (J1 → Préférences ; J2/J3 → Historique).
- User Stories : US-125 (EF-121, EF-122, BF-107, BF-111).
- Composants existants réutilisés comme patron : `ProfilComponent`, `AlertesListeComponent`,
  `AuditJournalComponent`.
- Décision ouverte : candidat DDS « Emplacement des préférences côté Gestionnaire » — à instruire
  au Gate 04A, registre `design-decision-register.md`.
