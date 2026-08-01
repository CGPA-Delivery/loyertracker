import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Service transverse de notification — DSG-001.md §Composants (`lt-toast`), « centralisation des
 * messages de statut déjà en place (`role="status"`) ». Encapsule `MessageService` (PrimeNG) avec
 * le vocabulaire de sévérité déjà utilisé ailleurs dans le produit (`lt-status-tag` :
 * info/success/warning/danger) plutôt que celui, légèrement différent, de PrimeNG Toast
 * (`success`/`info`/`warn`/`error`) — traduit en interne pour ne pas exposer deux vocabulaires.
 */
@Injectable({ providedIn: 'root' })
export class LtToastService {
  private readonly messageService = inject(MessageService);

  success(detail: string, summary?: string): void {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  info(detail: string, summary?: string): void {
    this.messageService.add({ severity: 'info', summary, detail });
  }

  warning(detail: string, summary?: string): void {
    this.messageService.add({ severity: 'warn', summary, detail });
  }

  danger(detail: string, summary?: string): void {
    this.messageService.add({ severity: 'error', summary, detail });
  }
}
