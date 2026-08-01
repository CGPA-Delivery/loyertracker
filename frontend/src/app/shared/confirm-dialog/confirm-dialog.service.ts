import { Injectable, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

/**
 * Options de `LtConfirmDialogService.confirm()` — `acceptLabel`/`rejectLabel` sont **obligatoires**
 * (contrairement à l'API PrimeNG native, où ils sont optionnels et retombent sur « Yes »/« No » par
 * défaut) : impose l'exigence 5 de `DDS-LT-005` (« libellés explicites et non génériques … jamais
 * "OK"/"Annuler" seuls quand l'action a un effet significatif »).
 */
export interface LtConfirmOptions {
  header: string;
  message: string;
  acceptLabel: string;
  rejectLabel: string;
  accept: () => void;
  reject?: () => void;
}

/**
 * Service transverse de confirmation — DSG-001.md §Composants (`lt-confirm-dialog`). Encapsule
 * `ConfirmationService` (PrimeNG) pour rendre non contournables les exigences de `DDS-LT-005`
 * qu'une simple convention documentaire ne peut pas garantir (libellés explicites).
 *
 * Capture aussi l'élément déclencheur (`document.activeElement` au moment de l'appel) pour
 * l'exigence 2 (restitution du focus) : constaté par test (`confirm-dialog.component.spec.ts`)
 * que `p-confirmdialog` (PrimeNG) gère le focus-trap nativement (exigence 1) **mais ne restitue
 * pas le focus au déclencheur à la fermeture** (le focus retombe sur `<body>`) — DDS-LT-005
 * supposait cette restitution native ; ce n'est pas le cas, elle est donc implémentée ici.
 * `ConfirmDialogComponent` lit `elementDeclencheur()` sur `(onHide)` pour la restituer, quel que
 * soit le chemin de fermeture (Accepter, Annuler, Échap, bouton de fermeture).
 */
@Injectable({ providedIn: 'root' })
export class LtConfirmDialogService {
  private readonly confirmationService = inject(ConfirmationService);
  private declencheur: HTMLElement | null = null;

  confirm(options: LtConfirmOptions): void {
    this.declencheur = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.confirmationService.confirm({
      header: options.header,
      message: options.message,
      acceptLabel: options.acceptLabel,
      rejectLabel: options.rejectLabel,
      accept: options.accept,
      reject: options.reject,
    });
  }

  /** À appeler par `ConfirmDialogComponent` sur `(onHide)`, quel que soit le chemin de fermeture. */
  elementDeclencheur(): HTMLElement | null {
    return this.declencheur;
  }
}
