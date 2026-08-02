import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';

import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { StatusTagComponent, severityForStatut } from '../status-tag/status-tag.component';

export interface LtDataTableColumn {
  field: string;
  header: string;
  /** `'status'` rend la cellule via `lt-status-tag` (`severityForStatut()`) plutôt qu'en texte brut. */
  type?: 'text' | 'status';
}

/**
 * Table de données avec états vide/chargement/erreur — DSG-001.md §Composants (`lt-data-table`,
 * P0), composant le plus réutilisé du produit visé (paiements, échéances, garanties, historique).
 * Encapsule `p-table` (PrimeNG). Colonnes génériques (`field`/`header`) — pas de tri/filtre/
 * pagination dans cette première version (aucun besoin réel confirmé sur ≥ 2 écrans à ce jour,
 * cf. DSG-001.md §Component Rules « Création »).
 *
 * Sélection de ligne (`selectable`/`selectedRow`/`rowClick`) et rendu `type: 'status'` ajoutés lors
 * de la première migration d'écran réel (EP-17 Lot 3, Patrimoines/Biens) — besoin confirmé, pas
 * anticipé (cf. commentaire ci-dessus). Ligne sélectionnable au clic et au clavier (`role="button"`,
 * `Entrée`/`Espace`) — pas de sélection PrimeNG native, gérée par le template `#body` déjà propre à
 * ce composant.
 *
 * `rows` reste générique (`T extends object`, défaut `object`) : les DTO du domaine (`Bien`,
 * `Paiement`…) n'ont pas de signature d'index, l'accès au champ dynamique passe par `cellValue()`,
 * un cast interne explicite plutôt que de contraindre l'appelant à `Record<string, unknown>`.
 */
@Component({
  selector: 'lt-data-table',
  imports: [TableModule, EmptyStateComponent, StatusTagComponent],
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
          <tr
            [class.selected]="row === selectedRow()"
            [attr.role]="selectable() ? 'button' : null"
            [attr.tabindex]="selectable() ? 0 : null"
            (click)="onRowClick(row)"
            (keydown)="onRowKeydown($event, row)"
          >
            @for (col of columns; track col.field) {
              <td>
                @if (col.type === 'status') {
                  <lt-status-tag
                    [value]="cellValue(row, col.field) + ''"
                    [severity]="severityForStatut(cellValue(row, col.field) + '')"
                  />
                } @else {
                  {{ cellValue(row, col.field) }}
                }
              </td>
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
    tr[role='button'] {
      cursor: pointer;
    }
    tr.selected {
      outline: var(--lt-focus-ring-width) var(--lt-focus-ring-style) var(--lt-focus-ring);
      outline-offset: -2px;
    }
  `,
})
export class DataTableComponent<T extends object = object> {
  readonly columns = input.required<LtDataTableColumn[]>();
  readonly rows = input.required<T[]>();
  readonly loading = input(false);
  readonly error = input<string | null>(null);
  readonly emptyMessage = input('Aucune donnée à afficher.');
  readonly selectable = input(false);
  readonly selectedRow = input<T | null>(null);
  readonly rowClick = output<T>();

  protected readonly severityForStatut = severityForStatut;

  protected cellValue(row: T, field: string): unknown {
    return (row as Record<string, unknown>)[field];
  }

  protected onRowClick(row: T): void {
    if (this.selectable()) {
      this.rowClick.emit(row);
    }
  }

  protected onRowKeydown(event: KeyboardEvent, row: T): void {
    if (!this.selectable() || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }
    event.preventDefault();
    this.rowClick.emit(row);
  }
}
