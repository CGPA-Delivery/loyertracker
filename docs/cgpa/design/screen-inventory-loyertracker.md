# Inventaire des écrans — LoyerTracker

| Champ | Valeur |
|---|---|
| Périmètre | Chantier socle UI PrimeNG/Design Tokens/Keycloak (EP-17) |
| Méthode | Lecture de `frontend/src/app/app.routes.ts` et des composants montés, 2026-07-30 |
| Statut | Instantané factuel — aucun écran futur n'est inventé ; les écrans non existants sont
  marqués explicitement |

## Écrans réellement existants

| Écran | Route | Rôle | Domaine | Composants | Formulaires | Tables | Actions critiques | État vide | État chargement | État erreur | Mobile | Dette UX | Criticité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Dashboard Bailleur | `/bailleur` | BAILLEUR | Application shell / Patrimoines / Biens / Baux / Affectations | `BailleurDashboardComponent` + composants embarqués | Bien, Patrimoine, Bail, Affectation, Exception | Listes de biens/patrimoines/baux/affectations | Créer/modifier/archiver bien, créer bail, créer/révoquer affectation | `<p class="muted">` par liste | Texte `chargement()` local, non uniforme | Message texte local (`message.set(...)`), pas de composant dédié | Empilement vertical < 640px | Composant monolithique, styles dupliqués | Élevée |
| Profil Bailleur | `/bailleur/profil` | BAILLEUR | Profil et session | `ProfilComponent` | Adresse postale (+ futures préférences US-125) | — | Enregistrer adresse | — | `<p>Chargement…</p>` | Message texte | Non vérifié spécifiquement | Faible | Moyenne |
| Dashboard Gestionnaire | `/gestionnaire` | GESTIONNAIRE | Biens affectés / Baux | `GestionnaireDashboardComponent` + composants embarqués | Bail | Listes de biens affectés/baux | Créer bail sur bien affecté | `<p class="muted">` | Idem | Idem | Idem | Duplication avec dashboard Bailleur | Élevée |
| Vérification quittance | `/verify/receipt/:id` | Public (non authentifié) | Quittances (EP-14) | `VerifyReceiptComponent` | — | — | Consultation seule | À vérifier | À vérifier | À vérifier | À vérifier | Non auditée en détail (hors scope initial) | Élevée (surface publique) |
| Paiements/Échéances (section) | Intégré à `/bailleur` et `/gestionnaire` | BAILLEUR, GESTIONNAIRE | Paiements & échéances | `PaiementsBienComponent` | Pointage de statut | Liste des échéances par bien | Pointer statut, télécharger quittance/avis | Non auditée en détail | Non auditée en détail | Non auditée en détail | Non vérifié | Action financière sans confirmation systématique constatée à ce stade — à vérifier | Élevée |
| Garanties (section) | Intégré à `/bailleur` et `/gestionnaire` | BAILLEUR, GESTIONNAIRE | Garanties | `GarantiesBailComponent` | Dépôt/restitution/mouvement | Historique des mouvements | Débiter/réapprovisionner garantie | Non auditée en détail | Non auditée en détail | Non auditée en détail | Non vérifié | Financier, à vérifier confirmation | Élevée |
| Honoraires (section) | Intégré à `/bailleur` et `/gestionnaire` | BAILLEUR, GESTIONNAIRE (lecture seule) | Honoraires | `HonorairesBienComponent` | Validation | Liste des honoraires par bien | Valider honoraire (Bailleur seul) | Non auditée en détail | Non auditée en détail | Non auditée en détail | Non vérifié | Financier, à vérifier confirmation | Élevée |
| Alertes (section) | Intégré à `/bailleur` et `/gestionnaire` | BAILLEUR, GESTIONNAIRE | Alertes et notifications | `AlertesListeComponent` | — | Liste NON_LUE, badge par type | Générer (Bailleur), marquer lue | `<p class="muted">Aucune alerte non lue.</p>` | `chargement()` | `message` texte | Non spécifique | Sans filtre ni pagination (assumé) | Moyenne |
| Journal d'audit (section) | Intégré à `/bailleur` uniquement | BAILLEUR | Audit et historique | `AuditJournalComponent` | — | Liste chronologique | Consultation seule | `<p class="muted">Aucune entrée.</p>` | `chargement()` | `message` texte | Non spécifique | Sans filtre ni pagination (assumé) | Faible |

## Écrans NON existants aujourd'hui (à ne pas confondre avec le périmètre livré)

Ces lignes sont **des besoins identifiés, pas des écrans du code** — marquées explicitement pour ne
pas laisser croire à une couverture UI qui n'existe pas.

| Besoin d'écran | Domaine | Statut | Constat |
|---|---|---|---|
| Gestion des Locataires (CRUD) | Locataires | **Inexistant** | US-109→112 (EP-15) livrées **backend uniquement** ; aucune UI Angular (constat déjà tracé en `project-state.md`, EP-15 Sprint B) |
| Gestion des Gestionnaires (profil, cycle de vie) | Gestionnaires | **Inexistant** | US-105→108 (EP-15) livrées **backend uniquement** |
| Préférences de notification | Alertes et notifications | **En attente** | US-125 (EP-16 Lot B) — cadrage UX produit (`phase-02-*.md`, `UXR-001.md`), aucun code, bloqué par les Gates 02A/04A |
| Historique des notifications externes | Alertes et notifications | **En attente** | US-125, idem |
| Écran d'erreur / accès refusé générique | Erreurs et accès refusé | **Inexistant** | Aucun composant dédié constaté dans `component-inventory-loyertracker.md` ; les 403 serveur ne sont traduits par aucun état uniforme |
| Page 404 dédiée | Erreurs et accès refusé | **Inexistant** | `app.routes.ts` : le fallback `**` redirige silencieusement vers `/bailleur`, aucune page « introuvable » |
| Compte Keycloak personnalisé (Account Console) | Profil et session | **Non constaté** | Aucune preuve d'usage réel de l'Account Console Keycloak dans le produit — à confirmer avant tout thème `account/` (cf. `ADR-UI-001`) |

## Constats transverses

* Le produit ne compte que **4 routes** (`/bailleur`, `/bailleur/profil`, `/gestionnaire`,
  `/verify/receipt/:id`) plus un fallback — la majorité des « écrans » fonctionnels sont en réalité
  des **sections empilées** dans deux pages uniques (patron déjà documenté en
  `phase-02-information-architecture.md` §1).
* Aucun écran d'erreur générique (403, 404) n'existe : dette nouvelle à ajouter au registre.
* La criticité métier est concentrée sur les sections financières (Paiements, Garanties,
  Honoraires) — priorité de migration naturelle pour le Lot 3 (pilote) du Plan d'Exécution, en
  cohérence avec la recommandation de pilote de la mission (dashboard Bailleur, liste
  Patrimoines/Biens, détail d'un bien, tableau des paiements/échéances).
