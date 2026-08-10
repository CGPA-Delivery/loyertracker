import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Locataire, S02ApiService } from '../core/s02/s02-api.service';
import { DataTableComponent, LtDataTableColumn } from '../shared/data-table/data-table.component';

@Component({
  selector: 'app-locataire-liste',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DataTableComponent],
  template: `
    <header class="page-head">
      <div>
        <h1>Locataires</h1>
        <p>{{ message() }}</p>
      </div>
      <div class="status">
        <a routerLink="/bailleur">← Dashboard</a>
      </div>
    </header>

    <section class="toolbar">
      <input
        type="search"
        placeholder="Rechercher un locataire…"
        (input)="termeRecherche.set($any($event.target).value)"
        [attr.aria-label]="'Rechercher un locataire'"
      />
      <button type="button" (click)="charger()" [disabled]="chargement()">Rafraîchir</button>
    </section>

    @if (erreur()) {
      <div class="panel error" role="alert">{{ erreur() }}</div>
    }

    @if (locatairesFiltres(); as liste) {
      @if (liste.length > 0) {
        <lt-data-table
          [columns]="colonnes"
          [rows]="liste"
          [loading]="chargement()"
          emptyMessage="Aucun résultat."
        />
      } @else if (!chargement()) {
        <p class="muted">{{ termeRecherche() ? 'Aucun résultat.' : 'Aucun locataire.' }}</p>
      }
    }
  `,
})
export class LocataireListeComponent implements OnInit {
  private readonly s02 = inject(S02ApiService);

  readonly chargement = signal(true);
  readonly erreur = signal<string | null>(null);
  readonly message = signal('');
  readonly locataires = signal<Locataire[]>([]);
  readonly termeRecherche = signal('');

  readonly locatairesFiltres = computed(() => {
    const terme = this.termeRecherche().toLowerCase().trim();
    if (!terme) return this.locataires();
    return this.locataires().filter(
      (l) =>
        l.nom.toLowerCase().includes(terme) ||
        (l.prenom?.toLowerCase().includes(terme) ?? false) ||
        (l.email?.toLowerCase().includes(terme) ?? false),
    );
  });

  readonly colonnes: LtDataTableColumn[] = [
    { field: 'nom', header: 'Nom' },
    { field: 'prenom', header: 'Prénom' },
    { field: 'email', header: 'Email' },
    { field: 'statut', header: 'Statut', type: 'status' },
  ];

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.erreur.set(null);
    this.message.set('Chargement…');
    this.s02
      .listerLocataires()
      .pipe(finalize(() => this.chargement.set(false)))
      .subscribe({
        next: (locataires) => {
          this.locataires.set(locataires);
          this.message.set(`${locataires.length} locataire(s)`);
        },
        error: (err: HttpErrorResponse) => {
          this.erreur.set(err.status === 403 ? 'Accès refusé.' : 'Erreur de chargement.');
          this.message.set('');
        },
      });
  }
}
