# DDS-LT-005 — Composant modal de confirmation (`lt-confirm-dialog`) — premier modal du produit

> Instance projet d'une Design Decision Specification, même convention que `DDS-LT-001→004`.
> Formalise **DDS-cand-4**, candidate identifiée par `UXR-001.md` (2026-07-30) et déjà partiellement
> cadrée par `DSG-001.md` §Composants et `phase-02-ui-mockups.md` §1.4/§6.

## Métadonnées

| Champ | Valeur |
|---|---|
| Identifiant | DDS-LT-005 |
| Titre | Composant modal de confirmation (`lt-confirm-dialog`) — premier modal du produit |
| Statut | **Acceptée** — validation Product Owner explicite obtenue le 2026-07-31 |
| Date | 2026-07-31 |
| Responsable | Design Architect — Claude Code, sous-agent CGPA désigné le 2026-07-30 |
| Version DSG | `DSG-001.md` v0.1.0 |
| Product Owner | jptshilombo@gmail.com — validation requise avant instruction du Gate 04A applicable à US-125 |
| Documents amont | `phase-02-ui-mockups.md` §1.4 (confirmation de désinscription), §6 (accessibilité), `DSG-001.md` §Composants, `UXR-001.md` |

## Contexte

Le dialogue de confirmation de désinscription des canaux externes (US-125, J1 cas d'erreur) est le
**premier dialogue modal du produit** : aucun précédent de focus-trap ni de restitution du focus
n'existe dans le code actuel (`phase-02-ui-mockups.md` §6, constat vérifié). `DSG-001.md` a déjà
candidaté ce composant comme `lt-confirm-dialog`, encapsulant le `ConfirmDialog` de PrimeNG
(`DSG-001.md` §Composants, ligne « Confirmation | ConfirmDialog | Oui | P0 | Premier modal du
produit, focus-trap à garantir uniformément »).

## Problème

Fixer les exigences fonctionnelles et d'accessibilité non négociables de `lt-confirm-dialog`, pour
qu'il devienne la référence de tout futur dialogue modal du produit (`lt-detail-drawer` et
équivalents ultérieurs s'appuieront sur le même socle) — pas seulement pour ce premier usage.

## Options étudiées

| Option | Description | Avantages | Inconvénients |
|---|---|---|---|
| **A — Encapsuler `ConfirmDialog` de PrimeNG dans `lt-confirm-dialog`** | Composant `lt-*` dédié, engine PrimeNG, exigences d'accessibilité explicites imposées par-dessus le défaut PrimeNG | Cohérent avec la décision de socle `DDS-LT-001` (PrimeNG retenu, encapsulation `lt-*` systématique pour tout composant porteur d'une exigence d'accessibilité renforcée) ; `ConfirmDialog` fournit nativement la gestion de focus de base à auditer, pas à réécrire entièrement | Compatibilité PrimeNG × Angular 22 non encore vérifiée (dépendance à `ADR-UI-001`/Lot 0), donc ce composant ne peut être implémenté avant la levée de ce préalable |
| **B — Composant modal maison, sans dépendance PrimeNG** | Développer un dialogue custom (`<dialog>` natif HTML ou implémentation manuelle) | Aucune dépendance à la levée du préalable PrimeNG | Réinvente une gestion de focus-trap complète pour un besoin déjà couvert par `ConfirmDialog` ; contredit la décision de socle `DDS-LT-001` (composants « entreprise » couverts par PrimeNG, pas recodés à la main) |

## Décision retenue

**Option A — encapsuler `ConfirmDialog` de PrimeNG dans un composant `lt-confirm-dialog`**, avec
les exigences non négociables suivantes, applicables à toute instance présente et future :

1. **Focus-trap complet** : le focus clavier ne doit jamais pouvoir sortir du dialogue tant qu'il
   est ouvert (Tab/Shift+Tab bouclent à l'intérieur).
2. **Restitution du focus** : à la fermeture (validation, annulation, ou `Échap`), le focus revient
   exactement à l'élément déclencheur d'origine — jamais au `body` ni à un élément arbitraire.
3. **Fermeture par `Échap`** obligatoire, équivalente au bouton « Annuler ».
4. **Rôle ARIA** `role="alertdialog"` (action destructive/irréversible, cf. désinscription) ou
   `role="dialog"` selon la nature de l'action, avec `aria-modal="true"` et un `aria-labelledby`
   pointant vers le titre du dialogue.
5. **Libellés explicites et non génériques** sur les actions — jamais « OK »/« Annuler » seuls
   quand l'action a un effet significatif (ex. « Confirmer la désinscription », pas « OK »,
   conforme au wireframe `phase-02-ui-mockups.md` §1.4).
6. **Message de confirmation post-action** via `role="status" aria-live="polite"` — patron déjà en
   place ailleurs dans le produit (`ProfilComponent`), repris tel quel.

## Justification

* Ces six exigences ne sont pas inventées par ce document : elles reprennent et rendent
  **non négociables** des points déjà identifiés séparément dans `phase-02-ui-mockups.md` §1.4/§6,
  `DSG-001.md` §Composants et l'avis UX/UI Design Lead (`UXR-001.md` §Coherence/§Accessibilite) —
  cette DDS les consolide en une spécification unique et opposable, plutôt que de les laisser
  dispersées entre trois documents.
* `ConfirmDialog` de PrimeNG fournit une base de gestion de focus à **auditer** contre ces six
  exigences plutôt qu'à développer entièrement à la main — cohérent avec la charge proportionnée
  exigée pour une équipe dev solo (`DDS-LT-001` §Contraintes).
* Fixer ces exigences maintenant, avant tout codage, évite qu'un premier modal mal implémenté ne
  devienne — par copier-coller — le patron de tous les dialogues futurs du produit.

## Conséquences positives

* Référence unique et testable pour tout futur dialogue modal (`lt-detail-drawer` compris),
  au-delà du seul cas de désinscription.
* `CHECK-ACCESSIBILITY-01` dispose d'une checklist précise et non ambiguë à vérifier avant tout GO
  Gate 04A, au lieu d'un principe général.

## Conséquences négatives

* Charge de test dédiée nouvelle (focus-trap, restitution du focus, navigation clavier complète)
  qui n'existait pour aucun composant du produit jusqu'ici — première dette de test
  d'accessibilité de ce type, à budgétiser explicitement dans le Lot d'implémentation.

## Alternatives rejetées

* **Option B (modal maison sans PrimeNG)** : rejetée — contredit `DDS-LT-001` et impose une charge
  de développement/test disproportionnée pour un besoin déjà couvert par la bibliothèque retenue.

## Compatibilité

* Bloqué par le même préalable que toute l'implémentation EP-17/US-125 : compatibilité PrimeNG ×
  Angular 22.0.8 non encore vérifiée formellement (`ADR-UI-001` §Compatibilité, Lot 0 du Plan
  d'Exécution). Cette DDS ne lève pas ce préalable — elle fixe seulement les exigences à respecter
  une fois l'implémentation autorisée.
* Aucun impact backend.

## Traçabilité

* **Origine** : `UXR-001.md` (DDS-cand-4), `phase-02-ui-mockups.md` §1.4/§6, `DSG-001.md` §Composants (`lt-confirm-dialog`).
* **Registre** : `design-decision-register.md`.
* **Gate concerné** : Gate 04A applicable à US-125 (non instruit à ce jour) ; contrôle dédié
  `CHECK-ACCESSIBILITY-01`.

## Décision

* **Statut : Acceptée** — décision explicite du Product Owner (jptshilombo@gmail.com), 2026-07-31
  (« valide DDS-LT-002→005 »), incluant les six exigences d'accessibilité non négociables §Décision
  retenue.
* Cette acceptation ne vaut ni GO, ni GO sous réserve, ni NO GO du Gate 04A applicable à US-125 —
  elle clôt la réserve non bloquante DDS-cand-4 du Gate 02A
  (`gate-02A-decision-ep16-us125.md` §4). `CHECK-ACCESSIBILITY-01` reste à exécuter contre ces six
  exigences avant tout GO Gate 04A.
* Aucune implémentation n'est autorisée par ce document, et ne pourrait de toute façon débuter
  avant la levée du préalable de compatibilité PrimeNG × Angular 22 (Lot 0).
