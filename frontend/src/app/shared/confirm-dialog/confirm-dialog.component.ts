import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { LtConfirmDialogService } from './confirm-dialog.service';

/**
 * Placement du dialogue de confirmation — DSG-001.md §Composants (`lt-confirm-dialog`, P0),
 * **premier composant modal du produit** (`DDS-LT-005`, Acceptée). Encapsule `p-confirmdialog`
 * (PrimeNG) avec les exigences non négociables fixées par `DDS-LT-005` §Décision retenue :
 *
 * 1. Focus-trap complet — `focusTrap` explicite (déjà `true` par défaut chez PrimeNG, fixé ici
 *    pour ne jamais dépendre silencieusement d'une valeur par défaut de la librairie). Natif chez
 *    PrimeNG, vérifié par test.
 * 2. Restitution du focus à l'élément déclencheur à la fermeture — **non natif chez PrimeNG**
 *    (constaté par test : le focus retombe sur `<body>` sans intervention), implémenté ici via
 *    `(onHide)` + `LtConfirmDialogService.elementDeclencheur()`, quel que soit le chemin de
 *    fermeture (Accepter, Annuler, Échap, bouton de fermeture).
 * 3. Fermeture par `Échap` obligatoire — `closeOnEscape` explicite.
 * 4. `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby` vers le titre — natifs chez
 *    `p-confirmdialog` (vérifié par lecture directe du code source PrimeNG et par test), non
 *    ré-implémentés.
 * 5. Libellés explicites non génériques — imposé par `LtConfirmDialogService` (accept/reject
 *    labels non optionnels dans son API), pas par ce composant de placement.
 * 6. Message de confirmation post-action (`role="status" aria-live="polite"`) — relève de
 *    l'appelant (patron déjà en place, ex. `ProfilComponent`), hors périmètre de ce composant.
 *
 * `motionOptions`/`maskMotionOptions` à durée quasi nulle (`1ms`, pas `0` — certains navigateurs
 * n'émettent pas l'événement `animationend` pour une durée strictement nulle) : pas d'animation
 * perceptible d'ouverture/fermeture, cohérent avec DSG-001.md §Principes « Sobriété » (« pas de
 * décoration sans fonction ») et le respect déjà en place de `prefers-reduced-motion` —
 * l'apparition quasi instantanée est aussi plus lisible pour une confirmation portant sur une
 * action irréversible.
 *
 * Un seul `<lt-confirm-dialog>` doit être placé par arbre de composants consommateur (patron
 * `ConfirmDialog`/`Toast` : un placement, déclenché via un service injectable).
 */
@Component({
  selector: 'lt-confirm-dialog',
  imports: [ConfirmDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-confirmdialog
      [pt]="{ host: { 'aria-label': 'Confirmation requise' } }"
      [focusTrap]="true"
      [closeOnEscape]="true"
      [motionOptions]="{ duration: 1 }"
      [maskMotionOptions]="{ duration: 1 }"
      (onHide)="restituerFocus()"
    />
  `,
})
export class ConfirmDialogComponent {
  private readonly confirmDialogService = inject(LtConfirmDialogService);

  protected restituerFocus(): void {
    // `onHide` peut se déclencher avant la suppression effective du panneau du DOM — si l'élément
    // encore focus au moment de sa suppression, le navigateur redonne alors le focus à <body>,
    // écrasant une restitution faite trop tôt. `setTimeout` la reporte après ce nettoyage.
    setTimeout(() => this.confirmDialogService.elementDeclencheur()?.focus());
  }
}
