import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * État vide uniforme — DSG-001.md §Etats transverses (`lt-empty-state`, P0 backlog), remplace le
 * patron `<p class="muted">Aucun…</p>` dupliqué dans plusieurs écrans.
 */
@Component({
  selector: 'lt-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lt-empty-state" role="status" aria-live="polite">
      <p class="message">{{ message() }}</p>
      <ng-content select="[ltEmptyStateAction]" />
    </div>
  `,
  styles: `
    .lt-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--lt-space-xs);
      padding: var(--lt-space-lg);
      text-align: center;
    }
    .message {
      margin: 0;
      color: var(--lt-text-muted);
      font-size: var(--lt-font-size-sm);
    }
  `,
})
export class EmptyStateComponent {
  readonly message = input.required<string>();
}
