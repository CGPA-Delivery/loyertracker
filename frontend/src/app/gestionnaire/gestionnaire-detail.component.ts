import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

import {
  Gestionnaire,
  GestionnaireApiService,
  GestionnaireHistorique,
} from '../core/gestionnaire/gestionnaire-api.service';

/**
 * Fiche détail d'un Gestionnaire (EP-15). Actions cycle de vie (suspendre, réactiver, archiver,
 * restaurer) avec confirmation, modification du profil métier, et historique.
 */
@Component({
  selector: 'app-gestionnaire-detail',
  standalone: true,
  imports: [DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <a [routerLink]="['/bailleur/gestionnaires']">← Retour</a>
      <h1>{{ gestionnaire()?.nom }}{{ gestionnaire()?.prenom ? ' ' + gestionnaire()?.prenom : '' }}</h1>
    </header>

    <section class="toolbar">
      <span>{{ message() }}</span>
    </section>

    @if (gestionnaire(); as g) {
      <section class="panel">
        <div class="grid">
          <div class="field">
            <span class="label">Email</span>
            <span>{{ g.email }}</span>
          </div>
          <div class="field">
            <span class="label">Téléphone</span>
            <span>{{ g.telephone || '—' }}</span>
          </div>
          <div class="field">
            <span class="label">Statut</span>
            <span class="badge" [attr.data-statut]="g.statut">{{ g.statut }}</span>
          </div>
          <div class="field">
            <span class="label">Créé le</span>
            <span>{{ g.dateCreation | date:'mediumDate' }}</span>
          </div>
          @if (g.dateSuspension) {
            <div class="field">
              <span class="label">Suspendu le</span>
              <span>{{ g.dateSuspension | date:'mediumDate' }}</span>
            </div>
          }
          @if (g.dateArchivage) {
            <div class="field">
              <span class="label">Archivé le</span>
              <span>{{ g.dateArchivage | date:'mediumDate' }}</span>
            </div>
          }
          <div class="field full">
            <span class="label">Observations</span>
            <span>{{ g.observations || '—' }}</span>
          </div>
        </div>

        <div class="actions">
          @if (g.statut === 'ACTIF') {
            <button type="button" data-action="suspendre" (click)="suspendre()" [disabled]="chargement()">Suspendre</button>
          }
          @if (g.statut === 'SUSPENDU') {
            <button type="button" data-action="reactiver" (click)="reactiver()" [disabled]="chargement()">Réactiver</button>
          }
          @if (g.statut === 'ACTIF' || g.statut === 'SUSPENDU') {
            <button type="button" data-action="archiver" (click)="archiver()" [disabled]="chargement()">Archiver</button>
          }
          @if (g.statut === 'ARCHIVE') {
            <button type="button" data-action="restaurer" (click)="restaurer()" [disabled]="chargement()">Restaurer</button>
          }
        </div>
      </section>

      @if (historique(); as h) {
        <section class="panel historique">
          <h2>Historique</h2>
          @if (h.affectations.length) {
            <h3>Affectations</h3>
            <ul>
              @for (a of h.affectations; track a.id) {
                <li>{{ a.bienId || a.patrimoineId || a.id }}</li>
              }
            </ul>
          }
          @if (h.audit.length) {
            <h3>Audit</h3>
            <ul>
              @for (e of h.audit; track e.id) {
                <li>
                  <strong>{{ e.action }}</strong>
                  — {{ e.date | date:'medium' }}
                  @if (e.details) { <span> ({{ e.details }})</span> }
                </li>
              }
            </ul>
          }
          @if (!h.affectations.length && !h.audit.length) {
            <p class="muted">Aucune entrée d'historique.</p>
          }
        </section>
      }
    }
  `,
  styles: [
    `
      .page-head,
      .toolbar {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        margin-bottom: 1rem;
      }
      h1 {
        margin: 0;
      }
      .panel {
        border: 1px solid #334155;
        border-radius: 6px;
        padding: 1rem;
        background: #111827;
        margin-bottom: 1rem;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .field.full {
        grid-column: 1 / -1;
      }
      .label {
        font-size: 0.85rem;
        color: #94a3b8;
      }
      .badge {
        font-size: 0.85rem;
        color: #bae6fd;
      }
      .badge[data-statut='SUSPENDU'] {
        color: #fecaca;
      }
      .badge[data-statut='ARCHIVE'] {
        color: #94a3b8;
      }
      .actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
      }
      button {
        border: 1px solid #334155;
        border-radius: 6px;
        padding: 0.5rem 1rem;
        background: #0f172a;
        color: #e2e8f0;
        cursor: pointer;
      }
      button:hover:not(:disabled) {
        border-color: #38bdf8;
      }
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .muted {
        color: #94a3b8;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0;
      }
      li {
        padding: 0.25rem 0;
        border-bottom: 1px solid #1e293b;
      }
    `,
  ],
})
export class GestionnaireDetailComponent implements OnInit {
  private readonly api = inject(GestionnaireApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly confirmationService = inject(ConfirmationService);

  readonly gestionnaire = signal<Gestionnaire | null>(null);
  readonly historique = signal<GestionnaireHistorique | null>(null);
  readonly message = signal('Chargement…');
  readonly chargement = signal(false);

  private get id(): string {
    return this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.charger();
  }

  suspendre(): void {
    this.confirmationService.confirm({
      header: 'Suspendre le gestionnaire',
      message: 'Confirmez-vous la suspension de ce gestionnaire ?',
      acceptLabel: 'Suspendre',
      rejectLabel: 'Annuler',
      accept: () => this.executerAction('suspendre', this.api.suspendre(this.id)),
    });
  }

  reactiver(): void {
    this.confirmationService.confirm({
      header: 'Réactiver le gestionnaire',
      message: 'Confirmez-vous la réactivation de ce gestionnaire ?',
      acceptLabel: 'Réactiver',
      rejectLabel: 'Annuler',
      accept: () => this.executerAction('réactiver', this.api.reactiver(this.id)),
    });
  }

  archiver(): void {
    this.confirmationService.confirm({
      header: 'Archiver le gestionnaire',
      message: 'Confirmez-vous l\'archivage de ce gestionnaire ?',
      acceptLabel: 'Archiver',
      rejectLabel: 'Annuler',
      accept: () => this.executerAction('archiver', this.api.archiver(this.id)),
    });
  }

  restaurer(): void {
    this.confirmationService.confirm({
      header: 'Restaurer le gestionnaire',
      message: 'Confirmez-vous la restauration de ce gestionnaire ?',
      acceptLabel: 'Restaurer',
      rejectLabel: 'Annuler',
      accept: () => this.executerAction('restaurer', this.api.restaurer(this.id)),
    });
  }

  private charger(): void {
    this.chargement.set(true);
    this.message.set('Chargement…');
    this.api.consulter(this.id).subscribe({
      next: (g) => {
        this.gestionnaire.set(g);
        this.message.set('Prêt');
        this.chargerHistorique();
      },
      error: (err: unknown) => this.signalerErreur(err),
    });
  }

  private chargerHistorique(): void {
    this.api.historique(this.id).subscribe({
      next: (h) => this.historique.set(h),
      error: () => {
        // Silencieux : l'historique est secondaire
      },
    });
  }

  private executerAction(nom: string, appel: ReturnType<typeof this.api.suspendre>): void {
    this.chargement.set(true);
    this.message.set(`${nom} en cours…`);
    appel.subscribe({
      next: (g) => {
        this.gestionnaire.set(g);
        this.message.set(`${nom} effectué`);
        this.chargement.set(false);
        this.chargerHistorique();
      },
      error: (err: unknown) => this.signalerErreur(err),
    });
  }

  private signalerErreur(err: unknown): void {
    this.chargement.set(false);
    if (err instanceof HttpErrorResponse) {
      this.message.set(`erreur API (${err.status})`);
      return;
    }
    this.message.set('erreur inconnue');
  }
}
