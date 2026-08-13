import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Gestionnaire, GestionnaireApiService } from '../core/gestionnaire/gestionnaire-api.service';

/**
 * Liste des Gestionnaires avec recherche (EP-15). Accessible depuis le dashboard bailleur.
 * Chaque ligne est un lien vers la fiche détail {@code /bailleur/gestionnaires/:id}.
 */
@Component({
  selector: 'app-gestionnaire-liste',
  standalone: true,
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div>
        <h1>Gestionnaires</h1>
      </div>
    </header>

    <section class="toolbar">
      <input
        type="text"
        placeholder="Rechercher par nom ou email…"
        [(ngModel)]="terme"
        (keyup.enter)="rechercher()"
      />
      <button type="button" (click)="rechercher()" [disabled]="chargement()">Rechercher</button>
      <span>{{ message() }}</span>
    </section>

    <section class="panel">
      <div class="list">
        @for (g of gestionnaires(); track g.id) {
          <a class="row" [routerLink]="['/bailleur/gestionnaires', g.id]">
            <span>
              <strong>{{ g.nom }}{{ g.prenom ? ' ' + g.prenom : '' }}</strong>
              <small>{{ g.email }}</small>
            </span>
            <span class="badge" [attr.data-statut]="g.statut">{{ g.statut }}</span>
          </a>
        } @empty {
          <p class="muted">Aucun gestionnaire.</p>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .page-head,
      .toolbar {
        display: flex;
        gap: var(--lt-space-sm);
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--lt-space-md);
      }
      h1 {
        margin: 0;
      }
      input {
        box-sizing: border-box;
        min-height: 44px;
        border: 1px solid #334155;
        border-radius: 6px;
        padding: var(--lt-space-xs);
        background: #0f172a;
        color: #e2e8f0;
        flex: 1;
      }
      .panel {
        border: 1px solid #334155;
        border-radius: 6px;
        padding: var(--lt-space-md);
        background: #111827;
      }
      .list {
        display: grid;
        gap: var(--lt-space-xs);
      }
      .row {
        box-sizing: border-box;
        min-width: 0;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--lt-space-sm);
        width: 100%;
        text-align: left;
        border: 1px solid #334155;
        border-radius: 6px;
        padding: var(--lt-space-xs);
        background: #0f172a;
        color: #e2e8f0;
        text-decoration: none;
      }
      .row:hover {
        border-color: #38bdf8;
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
      .muted,
      small {
        color: #94a3b8;
      }
      @media (max-width: 640px) {
        .toolbar {
          align-items: stretch;
          flex-direction: column;
        }
        .toolbar input {
          width: 100%;
        }
      }
    `,
  ],
})
export class GestionnaireListeComponent implements OnInit {
  private readonly api = inject(GestionnaireApiService);

  readonly gestionnaires = signal<Gestionnaire[]>([]);
  readonly message = signal('Prêt');
  readonly chargement = signal(false);
  terme = '';

  ngOnInit(): void {
    this.charger();
  }

  rechercher(): void {
    this.charger();
  }

  private charger(): void {
    this.chargement.set(true);
    this.message.set('Chargement…');
    const q = this.terme.trim() || undefined;
    this.api.rechercher(q).subscribe({
      next: (gestionnaires) => {
        this.gestionnaires.set(gestionnaires);
        this.message.set(`${gestionnaires.length} gestionnaire(s)`);
      },
      error: (err: unknown) => this.signalerErreur(err),
      complete: () => this.chargement.set(false),
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
