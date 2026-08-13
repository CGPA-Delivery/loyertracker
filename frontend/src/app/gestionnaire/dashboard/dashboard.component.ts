import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../core/auth/auth.service';
import { Bail, BailPayload, Bien, Devise, Locataire, S02ApiService } from '../../core/s02/s02-api.service';
import { AlertesListeComponent } from '../../alertes/alertes-liste.component';
import { GarantiesBailComponent } from '../../garanties/garanties-bail.component';
import { HonorairesBienComponent } from '../../honoraires/honoraires-bien.component';
import { PaiementsBienComponent } from '../../paiements/paiements-bien.component';
import { NotificationsHistoriqueComponent } from '../../notifications/notifications-historique.component';
import { NotificationsPreferencesComponent } from '../../notifications/notifications-preferences.component';
import { DataTableComponent, LtDataTableColumn } from '../../shared/data-table/data-table.component';
import { MoneyFormatPipe } from '../../shared/money/money-format.pipe';

@Component({
  selector: 'app-gestionnaire-dashboard',
  imports: [
    ReactiveFormsModule,
    PaiementsBienComponent,
    GarantiesBailComponent,
    HonorairesBienComponent,
    AlertesListeComponent,
    NotificationsPreferencesComponent,
    NotificationsHistoriqueComponent,
    DataTableComponent,
    MoneyFormatPipe,
  ],
  template: `
    <header class="page-head">
      <div>
        <h1>Espace gestionnaire</h1>
        <p>{{ username }} · {{ roles.join(', ') || 'aucun rôle' }}</p>
      </div>
      <button type="button" data-testid="gestionnaire-dashboard-refresh-btn" (click)="chargerBiens()" [disabled]="chargement()">Rafraîchir</button>
    </header>

    <section class="toolbar">
      <span>{{ message() }}</span>
    </section>

    <section class="grid two">
      <div class="panel">
        <h2>Biens affectés</h2>
        <lt-data-table
          [columns]="bienColumns"
          [rows]="biens()"
          [loading]="chargement()"
          [error]="erreur()"
          emptyMessage="Aucun bien affecté."
          [selectable]="true"
          [selectedRow]="bienSelectionne()"
          (rowClick)="selectionnerBien($event)"
        />
      </div>

      @if (bienSelectionne(); as bien) {
        <form [formGroup]="bailForm" (ngSubmit)="creerBail()" class="panel">
          <h2>Nouveau bail · {{ bien.adresse }}</h2>
          <label>
            Locataire
            <select formControlName="locataireId">
              <option value="" disabled>Choisir un locataire</option>
              @for (locataire of locataires(); track locataire.id) {
                <option [value]="locataire.id">
                  {{ locataire.nom }}{{ locataire.prenom ? ' ' + locataire.prenom : '' }}
                </option>
              }
            </select>
          </label>
          <div class="fields">
            <label>
              Loyer hors charges
              <input type="number" formControlName="loyerHc" min="0" step="0.01" />
            </label>
            <label>
              Provision charges
              <input type="number" formControlName="provisionCharges" min="0" step="0.01" />
            </label>
          </div>
          <div class="fields">
            <label>
              Devise
              <select formControlName="devise">
                <option value="EUR">EUR — Euro</option>
                <option value="USD">USD — Dollar américain</option>
                <option value="CDF">CDF — Franc congolais</option>
              </select>
            </label>
          </div>
          <div class="fields">
            <label>
              Début
              <input type="date" formControlName="dateDebut" />
            </label>
            <label>
              Fin
              <input type="date" formControlName="dateFin" />
            </label>
          </div>
          <button type="submit" [disabled]="bailForm.invalid || chargement()">Créer le bail</button>
        </form>
      } @else {
        <div class="panel">
          <h2>Baux</h2>
          <p class="muted">Sélectionner un bien affecté.</p>
        </div>
      }
    </section>

    @if (bienSelectionne(); as bien) {
      <section class="panel detail">
        <h2>Historique des baux</h2>
        @for (bail of baux(); track bail.id) {
          <div class="item" [class.selected]="bail.id === bailSelectionne()?.id">
            <strong>{{ bail.locataireNom }}</strong>
            <span>{{ bail.loyerCc | moneyFormat: bail.devise }} · {{ bail.dateDebut }} → {{ bail.dateFin || 'en cours' }}</span>
            <span class="badge">{{ bail.statut }}</span>
            <button type="button" (click)="selectionnerBail(bail)">Garanties</button>
          </div>
        } @empty {
          <p class="muted">Aucun bail.</p>
        }
      </section>

      <section class="grid two detail">
        <app-paiements-bien [bienId]="bien.id" />
        @if (bailSelectionne(); as bail) {
          <app-garanties-bail [bienId]="bien.id" [bailId]="bail.id" />
        } @else {
          <div class="panel">
            <h2>Garanties</h2>
            <p class="muted">Choisir un bail (bouton « Garanties »).</p>
          </div>
        }
      </section>

      <section class="detail">
        <app-honoraires-bien [bienId]="bien.id" [peutValider]="false" />
      </section>
    }

    <section class="detail">
      <app-alertes-liste [peutGenerer]="false" />
    </section>

    <section class="grid two detail">
      <app-notifications-preferences contexte="gestionnaire" />
      <app-notifications-historique contexte="gestionnaire" />
    </section>
  `,
  styles: [
    `
      .page-head,
      .toolbar,
      .fields,
      .item {
        display: flex;
        gap: var(--lt-space-sm);
      }
      .page-head,
      .toolbar,
      .item {
        align-items: center;
        justify-content: space-between;
      }
      h1,
      h2,
      p {
        margin-top: 0;
      }
      .grid {
        display: grid;
        gap: var(--lt-space-md);
        margin-top: var(--lt-space-md);
      }
      .two {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }
      .panel {
        border: 1px solid #334155;
        border-radius: 6px;
        padding: var(--lt-space-md);
        background: #111827;
      }
      label {
        display: grid;
        gap: var(--lt-space-2xs);
        margin-bottom: var(--lt-space-sm);
        color: #cbd5e1;
      }
      input {
        width: 100%;
        border: 1px solid #334155;
        border-radius: 6px;
        padding: var(--lt-space-xs);
        background: #0f172a;
        color: #e2e8f0;
      }
      .selected {
        border-color: #38bdf8;
      }
      .badge {
        color: #bae6fd;
        font-size: 0.85rem;
      }
      .muted,
      small {
        color: #94a3b8;
      }
      .detail {
        margin-top: var(--lt-space-md);
      }
    `,
  ],
})
export class GestionnaireDashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly api = inject(S02ApiService);

  readonly username = this.auth.getUsername();
  readonly roles = this.auth.roles;
  readonly message = signal('Prêt');
  readonly chargement = signal(false);
  readonly erreur = signal<string | null>(null);
  readonly biens = signal<Bien[]>([]);
  readonly baux = signal<Bail[]>([]);
  readonly locataires = signal<Locataire[]>([]);
  readonly bienSelectionne = signal<Bien | null>(null);
  readonly bienSelectionneId = computed(() => this.bienSelectionne()?.id ?? null);
  readonly bailSelectionne = signal<Bail | null>(null);

  readonly bienColumns: LtDataTableColumn[] = [
    { field: 'adresse', header: 'Adresse' },
    { field: 'type', header: 'Type' },
    { field: 'statut', header: 'Statut', type: 'status' },
  ];

  selectionnerBail(bail: Bail): void {
    this.bailSelectionne.set(bail);
  }

  readonly bailForm = new FormGroup({
    locataireId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    loyerHc: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
    provisionCharges: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
    dateDebut: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dateFin: new FormControl('', { nonNullable: true }),
    devise: new FormControl<Devise>('EUR', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.chargerBiens();
  }

  chargerBiens(): void {
    this.chargement.set(true);
    this.erreur.set(null);
    this.message.set('Chargement des biens affectés');
    this.api.listerBiens().subscribe({
      next: (biens) => {
        this.biens.set(biens);
        this.message.set(`${biens.length} bien(s) affecté(s)`);
        const selection = this.bienSelectionneId();
        if (selection && !biens.some((bien) => bien.id === selection)) {
          this.bienSelectionne.set(null);
          this.bailSelectionne.set(null);
          this.baux.set([]);
        }
      },
      error: (err: unknown) => this.signalerErreur(err),
      complete: () => this.chargement.set(false),
    });
  }

  selectionnerBien(bien: Bien): void {
    this.bienSelectionne.set(bien);
    this.bailSelectionne.set(null);
    this.chargerBaux(bien.id);
    this.api.listerLocatairesDuBien(bien.id).subscribe({
      next: (locataires) => this.locataires.set(locataires),
      error: (err: unknown) => this.signalerErreur(err),
    });
  }

  creerBail(): void {
    const bienId = this.bienSelectionneId();
    if (!bienId || this.bailForm.invalid) {
      return;
    }
    this.chargement.set(true);
    this.message.set('Création du bail');
    this.api.creerBail(bienId, this.bailPayload()).subscribe({
      next: () => {
        this.message.set('Bail créé');
        this.bailForm.reset({
          locataireId: '',
          loyerHc: 0,
          provisionCharges: 0,
          dateDebut: '',
          dateFin: '',
          devise: 'EUR',
        });
        this.chargerBaux(bienId);
        this.chargerBiens();
      },
      error: (err: unknown) => this.signalerErreur(err),
      complete: () => this.chargement.set(false),
    });
  }

  private chargerBaux(bienId: string): void {
    this.api.listerBaux(bienId).subscribe({
      next: (baux) => this.baux.set(baux),
      error: (err: unknown) => this.signalerErreur(err),
    });
  }

  private bailPayload(): BailPayload {
    const form = this.bailForm.getRawValue();
    return {
      ...form,
      dateFin: form.dateFin || null,
    };
  }

  private signalerErreur(err: unknown): void {
    if (err instanceof HttpErrorResponse) {
      const detail = err.status === 409 ? 'conflit métier' : err.status === 403 ? 'accès refusé' : 'erreur API';
      this.message.set(`${detail} (${err.status})`);
      this.erreur.set(`${detail} (${err.status})`);
      this.chargement.set(false);
      return;
    }
    this.message.set('erreur inconnue');
    this.erreur.set('erreur inconnue');
    this.chargement.set(false);
  }
}
