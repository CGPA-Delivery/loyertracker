import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';

import { EmptyStateComponent } from '../empty-state/empty-state.component';

export interface LtDataTableColumn {
  field: string;
  header: string;
}

/**
 * Table de données avec états vide/chargement/erreur — DSG-001.md §Composants (`lt-data-table`,
 * P0), composant le plus réutilisé du produit visé (paiements, échéances, garanties, historique).
 * Encapsule `p-table` (PrimeNG). Colonnes génériques (`field`/`header`) — pas de tri/filtre/
 * pagination dans cette première version (aucun besoin réel confirmé sur ≥ 2 écrans à ce jour,
 * cf. DSG-001.md §Component Rules « Création » ; à étendre lors d'une migration écran réelle).
 *
 * `rows` accepte n'importe quel type d'objet (les DTO du domaine — `Paiement`, `Echeance`… —
 * n'ont pas de signature d'index) ; l'accès au champ dynamique passe par `cellValue()`, un cast
 * interne explicite plutôt que de contraindre l'appelant à `Record<string, unknown>`.
 */
@Component({
  selector: 'lt-data-table',
  imports: [TableModule, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (error()) {
      <p class="error" role="alert">{{ error() }}</p>
    } @else {
      <p-table [value]="rows()" [loading]="loading()" [columns]="columns()">
        <ng-template #header let-columns>
          <tr>
            @for (col of columns; track col.field) {
              <th>{{ col.header }}</th>
            }
          </tr>
        </ng-template>
        <ng-template #body let-row let-columns="columns">
          <tr>
            @for (col of columns; track col.field) {
              <td>{{ cellValue(row, col.field) }}</td>
            }
          </tr>
        </ng-template>
        <ng-template #emptymessage>
          <tr>
            <td [attr.colspan]="columns().length">
              <lt-empty-state [message]="emptyMessage()" />
            </td>
          </tr>
        </ng-template>
      </p-table>
    }
  `,
  styles: `
    .error {
      margin: 0;
      padding: var(--lt-space-md);
      color: var(--lt-state-danger);
      font-size: var(--lt-font-size-sm);
    }
  `,
})
export class DataTableComponent {
  readonly columns = input.required<LtDataTableColumn[]>();
  readonly rows = input.required<object[]>();
  readonly loading = input(false);
  readonly error = input<string | null>(null);
  readonly emptyMessage = input('Aucune donnée à afficher.');

  protected cellValue(row: object, field: string): unknown {
    return (row as Record<string, unknown>)[field];
  }
}
