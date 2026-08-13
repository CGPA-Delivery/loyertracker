import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';

import { AuditEntry, S04ApiService } from '../core/s04/s04-api.service';
import { DataTableComponent, LtDataTableColumn } from '../shared/data-table/data-table.component';

/**
 * Consultation du journal d'audit (US-62, ENF-05). Réservé au bailleur côté backend
 * ({@code @PreAuthorize hasRole('BAILLEUR')} ; un gestionnaire reçoit 403) : ce composant n'est
 * monté que dans l'espace bailleur. Liste brute la plus récente d'abord (le backend ordonne déjà
 * par horodatage décroissant), sans filtre ni pagination (défaut D du Plan d'Exécution).
 *
 * <p>EP-17 Lot 5 (DD-EP17-04) : migré du patron `.panel`/`.list`/`.row` vers `lt-data-table`.</p>
 */
@Component({
  selector: 'app-audit-journal',
  imports: [DataTableComponent],
  template: `
    <div class="panel">
      <header class="panel-head">
        <h2>Journal d'audit</h2>
        <span class="muted">{{ message() }}</span>
      </header>

      <div class="toolbar">
        <button type="button" (click)="charger()" [disabled]="chargement()">Rafraîchir</button>
      </div>

      <lt-data-table
        [columns]="columns"
        [rows]="entrees()"
        [loading]="chargement()"
        [error]="erreur()"
        emptyMessage="Aucune entrée."
      />
    </div>
  `,
  styles: [
    `
      .panel {
        border: 1px solid #334155;
        border-radius: 6px;
        padding: var(--lt-space-md);
        background: #111827;
      }
      .panel-head,
      .toolbar {
        display: flex;
        gap: var(--lt-space-sm);
        align-items: center;
      }
      .panel-head {
        justify-content: space-between;
      }
      h2 {
        margin-top: 0;
      }
      .toolbar {
        margin-bottom: var(--lt-space-sm);
      }
      .muted {
        color: #94a3b8;
      }
    `,
  ],
})
export class AuditJournalComponent implements OnInit {
  private readonly api = inject(S04ApiService);

  readonly entrees = signal<AuditEntry[]>([]);
  readonly message = signal('Prêt');
  readonly chargement = signal(false);
  readonly erreur = signal<string | null>(null);

  readonly columns: LtDataTableColumn[] = [
    { field: 'horodatage', header: 'Date' },
    { field: 'acteurRole', header: 'Rôle' },
    { field: 'action', header: 'Action' },
    { field: 'entityType', header: 'Entité' },
  ];

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.erreur.set(null);
    this.api.listerAudit().subscribe({
      next: (entrees) => {
        this.entrees.set(entrees);
        this.message.set(`${entrees.length} entrée(s)`);
      },
      error: (err: unknown) => this.signalerErreur(err),
      complete: () => this.chargement.set(false),
    });
  }

  private signalerErreur(err: unknown): void {
    this.chargement.set(false);
    if (err instanceof HttpErrorResponse) {
      const detail = err.status === 403 ? 'accès refusé' : 'erreur API';
      this.message.set(`${detail} (${err.status})`);
      this.erreur.set(`${detail} (${err.status})`);
      return;
    }
    this.message.set('erreur inconnue');
    this.erreur.set('erreur inconnue');
  }
}
