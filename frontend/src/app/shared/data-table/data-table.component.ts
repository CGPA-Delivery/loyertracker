import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';

import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { StatusTagComponent, severityForStatut } from '../status-tag/status-tag.component';

export interface LtDataTableColumn {
  field: string;
  header: string;
  /** `'status'` rend la cellule via `lt-status-tag` (`severityForStatut()`) plutôt qu'en texte brut.
   *  `'actions'` rend un bouton dont le clic émet `actionClick` avec la ligne et le champ. */
  type?: 'text' | 'status' | 'actions';
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
          <tr [class.selected]="row === selectedRow()" (click)="onRowClick(row)">
            @for (col of columns; track col.field; let first = $first) {
              <td>
                @if (first && selectable()) {
                  <button
                    type="button"
                    class="row-select"
                    [attr.aria-label]="'Sélectionner la ligne : ' + cellValue(row, col.field)"
                    (click)="onSelectButtonClick($event, row)"
                  >
                    {{ cellValue(row, col.field) }}
                  </button>
                } @else if (col.type === 'status') {
                  <lt-status-tag
                    [value]="cellValue(row, col.field) + ''"
                    [severity]="severityForStatut(cellValue(row, col.field) + '')"
                  />
                } @else if (col.type === 'actions') {
                  <button
                    type="button"
                    class="row-action"
                    (click)="onActionClick($event, row, col.field)"
                  >
                    {{ col.header }}
                  </button>
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
    :host {
      display: block;
      min-width: 0;
    }
    :host ::ng-deep .p-datatable-wrapper {
      max-width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    :host ::ng-deep .p-datatable-table {
      width: 100%;
      table-layout: fixed;
    }
    :host ::ng-deep th,
    :host ::ng-deep td {
      overflow-wrap: anywhere;
    }
    .error {
      margin: 0;
      padding: var(--lt-space-md);
      color: var(--lt-state-danger);
      font-size: var(--lt-font-size-sm);
    }
    tr.selected {
      outline: var(--lt-focus-ring-width) var(--lt-focus-ring-style) var(--lt-focus-ring);
      outline-offset: -2px;
    }
    .row-select {
      width: 100%;
      min-height: 44px;
      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
      text-align: left;
      font: inherit;
      cursor: pointer;
    }
    .row-select:focus-visible {
      outline: var(--lt-focus-ring-width) var(--lt-focus-ring-style) var(--lt-focus-ring);
      outline-offset: 2px;
    }
    .row-action {
      min-height: 44px;
      padding: var(--lt-space-2xs) 0.6rem;
      border: 1px solid #334155;
      border-radius: var(--lt-radius-default);
      background: #0f172a;
      color: var(--lt-text-primary);
      font-size: var(--lt-font-size-sm);
      cursor: pointer;
    }
    .row-action:hover {
      background: #334155;
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
  /** Émis quand une colonne de type 'actions' est cliquée. */
  readonly actionClick = output<{ row: T; field: string }>();

  protected readonly severityForStatut = severityForStatut;

  protected cellValue(row: T, field: string): unknown {
    return (row as Record<string, unknown>)[field];
  }

  protected onRowClick(row: T): void {
    if (this.selectable()) {
      this.rowClick.emit(row);
    }
  }

  protected onSelectButtonClick(event: MouseEvent, row: T): void {
    event.stopPropagation();
    this.onRowClick(row);
  }

  protected onActionClick(event: MouseEvent, row: T, field: string): void {
    event.stopPropagation();
    this.actionClick.emit({ row, field });
  }
}
