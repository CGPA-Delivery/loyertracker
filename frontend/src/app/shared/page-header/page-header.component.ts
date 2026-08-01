import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * En-tête de page LoyerTracker — titre, sous-titre optionnel, actions projetées.
 * DSG-001.md §Composants LoyerTracker candidats (`lt-page-header`, P0 backlog).
 */
@Component({
  selector: 'lt-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="lt-page-header">
      <div class="titles">
        <h1>{{ title() }}</h1>
        @if (subtitle()) {
          <p class="subtitle">{{ subtitle() }}</p>
        }
      </div>
      <div class="actions">
        <ng-content select="[ltPageHeaderActions]" />
      </div>
    </header>
  `,
  styles: `
    .lt-page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--lt-space-md);
      flex-wrap: wrap;
    }
    .titles h1 {
      margin: 0;
      font-size: var(--lt-font-size-xl);
      font-weight: var(--lt-font-weight-semibold);
      color: var(--lt-text-primary);
    }
    .subtitle {
      margin: 0;
      color: var(--lt-text-muted);
      font-size: var(--lt-font-size-sm);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: var(--lt-space-xs);
    }
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
}
