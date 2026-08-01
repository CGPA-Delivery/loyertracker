import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Tag } from 'primeng/tag';

export type StatusTagSeverity = 'info' | 'success' | 'warning' | 'danger' | 'secondary';

/**
 * Badge de statut coloré — DSG-001.md §Composants (`lt-status-tag`, P0), encapsule `p-tag`
 * (PrimeNG). Le mapping couleur est fixé par `LtPreset` (`frontend/src/styles/tokens/lt-preset.ts`)
 * sur les mêmes tokens `--lt-state-*` que le reste du produit — « ne doit jamais diverger »
 * (DSG-001.md §Mapping composants).
 *
 * Ce composant ne décide pas lui-même du statut métier → sévérité : voir `severityForStatut()`
 * ci-dessous pour le vocabulaire déjà vérifié dans le code existant (paiements, alertes). Un
 * appelant peut aussi passer `severity` directement pour un vocabulaire non encore couvert.
 */
@Component({
  selector: 'lt-status-tag',
  imports: [Tag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p-tag [value]="value()" [severity]="ptSeverity()" />`,
})
export class StatusTagComponent {
  readonly value = input.required<string>();
  readonly severity = input<StatusTagSeverity>('info');

  protected ptSeverity(): 'info' | 'success' | 'warn' | 'danger' | 'secondary' {
    const severity = this.severity();
    return severity === 'warning' ? 'warn' : severity;
  }
}

/**
 * Vocabulaire vérifié par lecture directe du code existant :
 * `paiements-bien.component.ts` (`EN_RETARD`→danger, `RECU`→success, `À VENIR`→warning, sinon
 * info) et `alertes-liste.component.ts` (`LOYER_EN_RETARD`→danger, `PREAVIS`→warning, sinon info).
 * Volontairement limité à ce vocabulaire déjà confirmé — l'extension à d'autres domaines
 * (garanties, honoraires…) est un jugement métier distinct, à faire au moment de leur migration
 * (Lot 3+), pas ici.
 */
export function severityForStatut(statut: string): StatusTagSeverity {
  switch (statut) {
    case 'EN_RETARD':
    case 'LOYER_EN_RETARD':
      return 'danger';
    case 'RECU':
    case 'PAYE':
      return 'success';
    case 'A_VENIR':
    case 'À VENIR':
    case 'PREAVIS':
      return 'warning';
    default:
      return 'info';
  }
}
