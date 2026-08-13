import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';

import { Alerte, S04ApiService } from '../core/s04/s04-api.service';
import { DataTableComponent, LtDataTableColumn } from '../shared/data-table/data-table.component';

/**
 * Consultation et marquage des alertes de pilotage (US-50/51/52). Réutilisable par les deux espaces :
 * le backend cloisonne déjà la liste (bailleur = tout le tenant ; gestionnaire = biens affectés
 * actifs). La génération batch n'est exposée qu'au bailleur via {@code peutGenerer} (cohérent avec
 * {@code @PreAuthorize hasRole('BAILLEUR')} sur `POST /api/batch/alertes`). Seules les alertes
 * NON_LUE sont affichées ; les alertes LUE sont filtrées côté frontend (US-52).
 *
 * <p>EP-17 Lot 5 (DD-EP17-04) : migré du patron `.panel`/`.list`/`.row` vers `lt-data-table`
 * avec colonne d'actions.</p>
 */
@Component({
  selector: 'app-alertes-liste',
  imports: [DataTableComponent],
  template: `
    <div class="panel">
      <header class="panel-head">
        <h2>Alertes</h2>
        <span class="muted">{{ message() }}</span>
      </header>

      <div class="toolbar">
        <button type="button" (click)="charger()" [disabled]="chargement()">Rafraîchir</button>
        @if (peutGenerer()) {
          <button type="button" (click)="generer()" [disabled]="chargement()">
            Générer les alertes
          </button>
        }
      </div>

      <lt-data-table
        [columns]="columns"
        [rows]="alertesTriees()"
        [loading]="chargement()"
        [error]="erreur()"
        emptyMessage="Aucune alerte non lue."
        (actionClick)="marquerLue($event.row)"
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
export class AlertesListeComponent implements OnInit {
  private readonly api = inject(S04ApiService);

  readonly peutGenerer = input<boolean>(false);

  readonly alertes = signal<Alerte[]>([]);
  readonly message = signal('Prêt');
  readonly chargement = signal(false);
  readonly erreur = signal<string | null>(null);

  // Seules les alertes NON_LUE, du plus récent au plus ancien.
  readonly alertesTriees = computed(() =>
    this.alertes()
      .filter((a) => a.statut === 'NON_LUE')
      .sort((a, b) => b.dateCreation.localeCompare(a.dateCreation)),
  );

  readonly columns: LtDataTableColumn[] = [
    { field: 'type', header: 'Type' },
    { field: 'message', header: 'Message' },
    { field: 'marquerLue', header: 'Marquer lue', type: 'actions' },
  ];

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.erreur.set(null);
    this.api.listerAlertes().subscribe({
      next: (alertes) => {
        this.alertes.set(alertes);
        this.message.set(`${this.alertesTriees().length} alerte(s) non lue(s)`);
      },
      error: (err: unknown) => this.signalerErreur(err),
      complete: () => this.chargement.set(false),
    });
  }

  marquerLue(a: Alerte): void {
    this.chargement.set(true);
    this.message.set('Marquage…');
    this.api.marquerAlerteLue(a.id).subscribe({
      next: () => {
        this.message.set('Alerte marquée lue');
        this.charger();
      },
      error: (err: unknown) => this.signalerErreur(err),
      complete: () => this.chargement.set(false),
    });
  }

  generer(): void {
    this.chargement.set(true);
    this.message.set('Génération…');
    this.api.genererAlertes().subscribe({
      next: (res) => {
        this.message.set(`${res.alertesCreees} alerte(s) créée(s)`);
        this.charger();
      },
      error: (err: unknown) => this.signalerErreur(err),
      complete: () => this.chargement.set(false),
    });
  }

  private signalerErreur(err: unknown): void {
    this.chargement.set(false);
    if (err instanceof HttpErrorResponse) {
      const detail =
        err.status === 404 ? 'introuvable' : err.status === 403 ? 'accès refusé' : 'erreur API';
      this.message.set(`${detail} (${err.status})`);
      this.erreur.set(`${detail} (${err.status})`);
      return;
    }
    this.message.set('erreur inconnue');
    this.erreur.set('erreur inconnue');
  }
}
