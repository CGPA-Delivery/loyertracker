import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type StatCardTrend = 'up' | 'down' | 'neutral';

/**
 * Carte de synthèse chiffrée (dashboard) — DSG-001.md §Composants LoyerTracker candidats
 * (`lt-stat-card`). Composition pure, aucun composant PrimeNG unique équivalent.
 */
@Component({
  selector: 'lt-stat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="lt-stat-card">
      <p class="label">{{ label() }}</p>
      <p class="value">{{ value() }}</p>
      @if (trendLabel()) {
        <p class="trend" [attr.data-trend]="trend()">{{ trendLabel() }}</p>
      }
    </article>
  `,
  styles: `
    .lt-stat-card {
      display: flex;
      flex-direction: column;
      gap: var(--lt-space-2xs);
      padding: var(--lt-space-md);
      border-radius: var(--lt-radius-default);
      background: var(--lt-surface-card);
    }
    .label {
      margin: 0;
      color: var(--lt-text-muted);
      font-size: var(--lt-font-size-sm);
    }
    .value {
      margin: 0;
      color: var(--lt-text-primary);
      font-size: var(--lt-font-size-xl);
      font-weight: var(--lt-font-weight-semibold);
    }
    .trend {
      margin: 0;
      font-size: var(--lt-font-size-xs);
      color: var(--lt-state-info);
    }
    .trend[data-trend='up'] {
      color: var(--lt-state-success);
    }
    .trend[data-trend='down'] {
      color: var(--lt-state-danger);
    }
  `,
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly trend = input<StatCardTrend | null>(null);
  readonly trendLabel = input<string | null>(null);
}
