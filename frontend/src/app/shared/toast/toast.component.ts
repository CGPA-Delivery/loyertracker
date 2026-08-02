import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Toast } from 'primeng/toast';

/**
 * Placement du composant de notification — DSG-001.md §Composants (`lt-toast`). Encapsule
 * `p-toast` (PrimeNG), qui porte déjà `role="alert"`/`aria-live="assertive"` en natif (vérifié par
 * lecture directe du code source PrimeNG) — non ré-implémenté ici.
 *
 * Un seul `<lt-toast>` doit être placé par arbre de composants consommateur, déclenché via
 * `LtToastService` (patron identique à `lt-confirm-dialog`/`LtConfirmDialogService`).
 */
@Component({
  selector: 'lt-toast',
  imports: [Toast],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p-toast />`,
})
export class ToastComponent {}
