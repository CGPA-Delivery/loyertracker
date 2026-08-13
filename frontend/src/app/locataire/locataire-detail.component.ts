import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

import {
  LocataireDetail,
  LocataireHistorique,
  S02ApiService,
} from '../core/s02/s02-api.service';

/**
 * Fiche détail d'un Locataire (EP-15). Actions cycle de vie (archiver, restaurer) avec
 * confirmation, et historique d'audit.
 */
@Component({
  selector: 'app-locataire-detail',
  standalone: true,
  imports: [DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <a [routerLink]="['/bailleur']">← Retour</a>
      <h1>{{ locataire()?.nom }}{{ locataire()?.prenom ? ' ' + locataire()?.prenom : '' }}</h1>
    </header>

    <section class="toolbar">
      <span>{{ message() }}</span>
    </section>

    @if (locataire(); as l) {
      <section class="panel">
        <div class="grid">
          <div class="field">
            <span class="label">Email</span>
            <span>{{ l.email || '—' }}</span>
          </div>
          <div class="field">
            <span class="label">Téléphone</span>
            <span>{{ l.telephone || '—' }}</span>
          </div>
          <div class="field">
            <span class="label">Profession</span>
            <span>{{ l.profession || '—' }}</span>
          </div>
          <div class="field">
            <span class="label">Date de naissance</span>
            <span>{{ l.dateNaissance || '—' }}</span>
          </div>
          <div class="field">
            <span class="label">Pièce d'identité</span>
            <span>{{ l.typePieceIdentite ? l.typePieceIdentite + ' ' + (l.numeroPieceIdentite || '') : '—' }}</span>
          </div>
          <div class="field">
            <span class="label">Contact urgence</span>
            <span>{{ l.contactUrgence || '—' }}</span>
          </div>
          <div class="field">
            <span class="label">Statut</span>
            <span class="badge" [attr.data-statut]="l.statut">{{ l.statut }}</span>
          </div>
          <div class="field">
            <span class="label">Créé le</span>
            <span>{{ l.dateCreation | date:'mediumDate' }}</span>
          </div>
          @if (l.dateArchivage) {
            <div class="field">
              <span class="label">Archivé le</span>
              <span>{{ l.dateArchivage | date:'mediumDate' }}</span>
            </div>
          }
          <div class="field full">
            <span class="label">Observations</span>
            <span>{{ l.observations || '—' }}</span>
          </div>
        </div>

        <div class="actions">
          @if (l.statut === 'ACTIVE') {
            <button type="button" data-action="archiver" (click)="archiver()" [disabled]="chargement()">Archiver</button>
          }
          @if (l.statut === 'ARCHIVE') {
            <button type="button" data-action="restaurer" (click)="restaurer()" [disabled]="chargement()">Restaurer</button>
          }
        </div>
      </section>

      @if (historique(); as h) {
        <section class="panel historique">
          <h2>Historique</h2>
          @if (h.audit.length) {
            <ul>
              @for (e of h.audit; track e.id) {
                <li>
                  <strong>{{ e.action }}</strong>
                  — {{ e.date | date:'medium' }}
                  @if (e.details) { <span> ({{ e.details }})</span> }
                </li>
              }
            </ul>
          } @else {
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
        gap: var(--lt-space-sm);
        align-items: center;
        margin-bottom: var(--lt-space-md);
      }
      h1 {
        margin: 0;
      }
      .panel {
        border: 1px solid #334155;
        border-radius: 6px;
        padding: var(--lt-space-md);
        background: #111827;
        margin-bottom: var(--lt-space-md);
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--lt-space-sm);
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
      .badge[data-statut='ARCHIVE'] {
        color: #94a3b8;
      }
      .actions {
        display: flex;
        gap: var(--lt-space-xs);
        margin-top: var(--lt-space-md);
      }
      button {
        border: 1px solid #334155;
        border-radius: 6px;
        padding: var(--lt-space-xs) var(--lt-space-md);
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
        margin: var(--lt-space-xs) 0;
      }
      li {
        padding: 0.25rem 0;
        border-bottom: 1px solid #1e293b;
      }
    `,
  ],
})
export class LocataireDetailComponent implements OnInit {
  private readonly api = inject(S02ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly confirmationService = inject(ConfirmationService);

  readonly locataire = signal<LocataireDetail | null>(null);
  readonly historique = signal<LocataireHistorique | null>(null);
  readonly message = signal('Chargement…');
  readonly chargement = signal(false);

  private get id(): string {
    return this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.charger();
  }

  archiver(): void {
    this.confirmationService.confirm({
      header: 'Archiver le locataire',
      message: 'Confirmez-vous l\'archivage de ce locataire ?',
      acceptLabel: 'Archiver',
      rejectLabel: 'Annuler',
      accept: () => this.executerAction('archiver', this.api.archiverLocataire(this.id)),
    });
  }

  restaurer(): void {
    this.confirmationService.confirm({
      header: 'Restaurer le locataire',
      message: 'Confirmez-vous la restauration de ce locataire ?',
      acceptLabel: 'Restaurer',
      rejectLabel: 'Annuler',
      accept: () => this.executerAction('restaurer', this.api.restaurerLocataire(this.id)),
    });
  }

  private charger(): void {
    this.chargement.set(true);
    this.message.set('Chargement…');
    this.api.consulterLocataire(this.id).subscribe({
      next: (l) => {
        this.locataire.set(l);
        this.message.set('Prêt');
        this.chargerHistorique();
      },
      error: (err: unknown) => this.signalerErreur(err),
    });
  }

  private chargerHistorique(): void {
    this.api.historiqueLocataire(this.id).subscribe({
      next: (h) => this.historique.set(h),
      error: () => {
        // Silencieux : l'historique est secondaire
      },
    });
  }

  private executerAction(nom: string, appel: ReturnType<typeof this.api.archiverLocataire>): void {
    this.chargement.set(true);
    this.message.set(`${nom} en cours…`);
    appel.subscribe({
      next: (l) => {
        this.locataire.set(l);
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
