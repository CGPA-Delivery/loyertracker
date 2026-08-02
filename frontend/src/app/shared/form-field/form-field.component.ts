import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Champ de formulaire (label + contrôle projeté + aide + erreur) — DSG-001.md §Composants
 * (`lt-form-field`, P0 backlog). Le contrôle réel (`input`, `p-select`…) est projeté par
 * l'appelant, qui doit lui donner l'`id` passé à `inputId` pour l'association label/champ, et lire
 * `describedBy()` via `exportAs="ltFormField"` pour poser `[attr.aria-describedby]` sur le
 * contrôle projeté :
 *
 * ```html
 * <lt-form-field #f="ltFormField" inputId="tel" label="Téléphone" [error]="erreur()">
 *   <input id="tel" [attr.aria-describedby]="f.describedBy()" />
 * </lt-form-field>
 * ```
 */
@Component({
  selector: 'lt-form-field',
  exportAs: 'ltFormField',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lt-form-field">
      <label [for]="inputId()">{{ label() }}</label>
      <ng-content />
      @if (error()) {
        <p class="error" [id]="errorId()" role="alert">{{ error() }}</p>
      } @else if (help()) {
        <p class="help" [id]="helpId()">{{ help() }}</p>
      }
    </div>
  `,
  styles: `
    .lt-form-field {
      display: flex;
      flex-direction: column;
      gap: var(--lt-space-3xs);
    }
    label {
      color: var(--lt-text-subtle);
      font-size: var(--lt-font-size-sm);
    }
    .help {
      margin: 0;
      color: var(--lt-text-muted);
      font-size: var(--lt-font-size-xs);
    }
    .error {
      margin: 0;
      color: var(--lt-state-danger);
      font-size: var(--lt-font-size-xs);
    }
  `,
})
export class FormFieldComponent {
  readonly inputId = input.required<string>();
  readonly label = input.required<string>();
  readonly help = input<string | null>(null);
  readonly error = input<string | null>(null);

  protected readonly helpId = computed(() => `${this.inputId()}-help`);
  protected readonly errorId = computed(() => `${this.inputId()}-error`);

  /**
   * À passer en `[attr.aria-describedby]` sur le contrôle projeté par l'appelant (le composant ne
   * peut pas modifier l'élément projeté lui-même).
   */
  readonly describedBy = computed(() => {
    if (this.error()) {
      return this.errorId();
    }
    return this.help() ? this.helpId() : null;
  });
}
