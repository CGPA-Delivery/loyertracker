import { Component, OnInit, computed, inject, input, signal } from '@angular/core';

import {
  NotificationHistoriqueItem,
  NotificationsService,
  StatutNotification,
} from './notifications.service';

@Component({
  selector: 'app-notifications-historique',
  standalone: true,
  template: `
    <section class="panel notifications-historique" aria-labelledby="notifications-historique-title">
      <header class="panel-head">
        <div>
          <h2 id="notifications-historique-title">Historique des notifications</h2>
          @if (contexte() === 'gestionnaire') {
            <p class="muted">Historique limité à vos biens affectés.</p>
          }
        </div>
        <button type="button" (click)="charger()" [disabled]="chargement()">Rafraîchir</button>
      </header>

      <p class="muted" role="status" aria-live="polite">{{ message() }}</p>

      <div class="list">
        @for (item of itemsTries(); track item.id) {
          <article class="row">
            <span>
              <strong>{{ item.notificationType }}</strong>
              <small>{{ item.dateCreation }}</small>
            </span>
            <span>{{ item.recipientAddressMasked }} · {{ item.channel }}</span>
            <span class="status" [attr.data-statut]="roleStatut(item.statut)">
              {{ libelleStatut(item.statut) }}@if (item.motif) { — {{ item.motif }} }
            </span>
          </article>
        } @empty {
          <p class="muted">Aucune notification externe envoyée.</p>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .panel {
        border: 1px solid var(--lt-border-default, #64748b);
        border-radius: 6px;
        padding: 1rem;
        background: var(--lt-surface-card, #111827);
      }
      .panel-head,
      .row {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        justify-content: space-between;
      }
      h2,
      p {
        margin-top: 0;
      }
      .list {
        display: grid;
        gap: 0.5rem;
      }
      .row {
        border: 1px solid var(--lt-border-default, #64748b);
        border-radius: 6px;
        padding: 0.5rem;
        background: var(--lt-surface-page, #0f172a);
        color: var(--lt-text-primary, #e2e8f0);
      }
      .row span:first-child {
        display: grid;
        gap: 0.25rem;
      }
      small,
      .muted {
        color: var(--lt-text-muted, #94a3b8);
      }
      button {
        border: 1px solid var(--lt-border-default, #64748b);
        border-radius: 6px;
        padding: 0.5rem 0.75rem;
        background: var(--lt-surface-page, #0f172a);
        color: var(--lt-text-primary, #e2e8f0);
      }
      .status[data-statut='info'] {
        color: var(--lt-state-info, #bae6fd);
      }
      .status[data-statut='success'] {
        color: var(--lt-state-success, #bbf7d0);
      }
      .status[data-statut='danger'] {
        color: var(--lt-state-danger, #fecaca);
      }
      @media (max-width: 640px) {
        .panel-head,
        .row {
          align-items: stretch;
          flex-direction: column;
        }
      }
    `,
  ],
})
export class NotificationsHistoriqueComponent implements OnInit {
  private readonly api = inject(NotificationsService);

  readonly contexte = input<'bailleur' | 'gestionnaire'>('bailleur');
  readonly items = signal<NotificationHistoriqueItem[]>([]);
  readonly chargement = signal(false);
  readonly message = signal('Prêt');

  readonly itemsTries = computed(() =>
    [...this.items()].sort((a, b) => b.dateCreation.localeCompare(a.dateCreation)),
  );

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.api.consulterHistorique().subscribe({
      next: (items) => {
        this.items.set(items);
        this.message.set(
          items.length === 0 ? 'Aucune notification externe envoyée.' : `${items.length} notification(s)`,
        );
      },
      error: () => this.message.set('Impossible de charger l’historique des notifications.'),
      complete: () => this.chargement.set(false),
    });
  }

  libelleStatut(statut: StatutNotification): string {
    switch (statut) {
      case 'PENDING':
      case 'RETRY':
        return "En attente d'envoi";
      case 'PROCESSING':
        return 'Envoi en cours';
      case 'DEAD':
        return 'Non envoyé';
      case 'QUEUED':
      case 'ACCEPTED':
      case 'SENT':
        return 'Envoyé, en cours de livraison';
      case 'DELIVERED':
        return 'Livré';
      case 'READ':
        return 'Lu';
      case 'FAILED':
      case 'UNDELIVERED':
      case 'CANCELLED':
        return 'Échec de livraison';
    }
  }

  roleStatut(statut: StatutNotification): 'info' | 'success' | 'danger' {
    switch (statut) {
      case 'DELIVERED':
      case 'READ':
        return 'success';
      case 'DEAD':
      case 'FAILED':
      case 'UNDELIVERED':
      case 'CANCELLED':
        return 'danger';
      default:
        return 'info';
    }
  }
}
