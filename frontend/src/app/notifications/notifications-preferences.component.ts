import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { LtConfirmDialogService } from '../shared/confirm-dialog/confirm-dialog.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { LtToastService } from '../shared/toast/toast.service';
import {
  CanalNotification,
  NotificationPreference,
  NotificationsService,
} from './notifications.service';

@Component({
  selector: 'app-notifications-preferences',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmDialogComponent, ToastComponent],
  template: `
    <section class="panel notifications-preferences" aria-labelledby="notifications-preferences-title">
      <header class="panel-head">
        <div>
          <h2 id="notifications-preferences-title">Préférences de notification</h2>
          @if (contexte() === 'gestionnaire') {
            <p class="muted">Ces préférences concernent votre compte gestionnaire connecté.</p>
          } @else {
            <p class="muted">Les alertes dans l’application restent actives quel que soit ce réglage.</p>
          }
        </div>
        <button type="button" (click)="charger()" [disabled]="chargement()">Rafraîchir</button>
      </header>

      @if (preferences(); as pref) {
        @if (!pref.enabled) {
          <p class="invite" role="status">
            Vous êtes désinscrit des canaux externes. Les alertes dans l’application restent actives.
          </p>
        }
      } @else if (!chargement()) {
        <p class="muted" role="status">
          Vous ne recevez aujourd’hui que les alertes dans l’application.
        </p>
      }

      <form [formGroup]="form" (ngSubmit)="enregistrer()" class="form-grid">
        <label>
          Numéro de téléphone
          <input
            type="tel"
            formControlName="phoneE164"
            autocomplete="tel"
            placeholder="+243****4331"
            aria-describedby="phone-help"
          />
          <span id="phone-help" class="field-help">Format international E.164, sans espace.</span>
        </label>

        <label>
          Canal préféré
          <select formControlName="preferredChannel">
            <option value="IN_APP">Application uniquement</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="SMS">SMS</option>
          </select>
        </label>

        <label>
          Canal de secours
          <select formControlName="fallbackChannel">
            <option [ngValue]="null">Aucun</option>
            <option value="SMS">SMS</option>
          </select>
        </label>

        <label class="check">
          <input type="checkbox" formControlName="whatsappOptIn" />
          J’accepte de recevoir des messages WhatsApp pour mes notifications.
        </label>

        <label class="check">
          <input type="checkbox" formControlName="smsOptIn" />
          J’accepte de recevoir des SMS en secours.
        </label>

        <div class="actions">
          <button type="submit" [disabled]="chargement() || form.invalid">
            Enregistrer les préférences
          </button>
          <button type="button" class="danger" (click)="demanderDesinscription()" [disabled]="chargement()">
            Se désinscrire des canaux externes
          </button>
        </div>
      </form>

      @if (preferences()?.consentAt) {
        <p class="muted">Consentement recueilli le {{ preferences()?.consentAt }} via formulaire LoyerTracker.</p>
      }

      <lt-confirm-dialog />
      <lt-toast />
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
      .actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        justify-content: space-between;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 0.75rem;
      }
      @media (max-width: 640px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
      h2,
      p {
        margin-top: 0;
      }
      label {
        display: grid;
        gap: 0.35rem;
        color: var(--lt-text-subtle, #cbd5e1);
      }
      input,
      select,
      button {
        min-height: 44px;
        border: 1px solid var(--lt-border-default, #64748b);
        border-radius: 6px;
        padding: 0.5rem 0.75rem;
        background: var(--lt-surface-page, #0f172a);
        color: var(--lt-text-primary, #e2e8f0);
      }
      .check {
        display: flex;
        align-items: center;
      }
      .check input {
        width: auto;
      }
      .actions {
        grid-column: 1 / -1;
        justify-content: flex-start;
        flex-wrap: wrap;
      }
      .danger {
        border-color: var(--lt-state-danger-strong, #dc2626);
      }
      .muted,
      .field-help {
        color: var(--lt-text-muted, #94a3b8);
      }
      .invite {
        color: var(--lt-state-info, #bae6fd);
      }
      @media (max-width: 640px) {
        .panel-head,
        .actions {
          align-items: stretch;
          flex-direction: column;
        }
      }
    `,
  ],
})
export class NotificationsPreferencesComponent implements OnInit {
  private readonly api = inject(NotificationsService);
  private readonly confirmDialog = inject(LtConfirmDialogService);
  private readonly toast = inject(LtToastService);

  readonly contexte = input<'bailleur' | 'gestionnaire'>('bailleur');
  readonly preferences = signal<NotificationPreference | null>(null);
  readonly chargement = signal(false);

  readonly form = new FormGroup({
    phoneE164: new FormControl('', {
      nonNullable: true,
      validators: [Validators.pattern(/^\+[1-9]\d{7,14}$/)],
    }),
    preferredChannel: new FormControl<CanalNotification>('IN_APP', { nonNullable: true }),
    fallbackChannel: new FormControl<CanalNotification | null>(null),
    whatsappOptIn: new FormControl(false, { nonNullable: true }),
    smsOptIn: new FormControl(false, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.api.consulterPreferences().subscribe({
      next: (preferences) => {
        this.preferences.set(preferences);
        this.form.patchValue({
          phoneE164: preferences.phoneE164 ?? '',
          preferredChannel: preferences.preferredChannel,
          fallbackChannel: preferences.fallbackChannel ?? null,
          whatsappOptIn: preferences.whatsappOptIn,
          smsOptIn: preferences.smsOptIn,
        });
      },
      error: () => this.toast.danger('Impossible de charger les préférences de notification.'),
      complete: () => this.chargement.set(false),
    });
  }

  enregistrer(): void {
    const phoneE164 = this.form.controls.phoneE164.value.trim();
    this.form.controls.phoneE164.setValue(phoneE164);
    if (this.form.invalid) {
      return;
    }
    const valeur = this.form.getRawValue();
    if (!this.canalPrefereAutorise(valeur.preferredChannel, valeur.whatsappOptIn, valeur.smsOptIn)) {
      this.toast.warning("Activez l'opt-in du canal préféré avant d'enregistrer.");
      return;
    }

    this.chargement.set(true);
    this.api
      .enregistrerPreferences({
        phoneE164: valeur.phoneE164.trim(),
        preferredChannel: valeur.preferredChannel,
        fallbackChannel: valeur.fallbackChannel,
        whatsappOptIn: valeur.whatsappOptIn,
        smsOptIn: valeur.smsOptIn,
        language: 'fr',
      })
      .subscribe({
        next: (preferences) => {
          this.preferences.set(preferences);
          this.toast.success('Préférences enregistrées.');
        },
        error: () => this.toast.danger("Échec de l'enregistrement des préférences."),
        complete: () => this.chargement.set(false),
      });
  }

  demanderDesinscription(): void {
    this.confirmDialog.confirm({
      header: 'Confirmer la désinscription ?',
      message:
        'Vous ne recevrez plus aucun message WhatsApp ni SMS dès maintenant. Vos alertes dans l’application restent actives sans changement.',
      acceptLabel: 'Confirmer la désinscription',
      rejectLabel: 'Annuler',
      accept: () => {
        this.chargement.set(true);
        this.api.desinscrire().subscribe({
          next: (preferences) => {
            this.preferences.set(preferences);
            this.toast.success(
              'Désinscription effective — aucun envoi externe ne sera plus tenté. Vos alertes dans l’application restent actives.',
            );
          },
          error: () => this.toast.danger('Échec de la désinscription.'),
          complete: () => this.chargement.set(false),
        });
      },
    });
  }

  private canalPrefereAutorise(
    canal: CanalNotification,
    whatsappOptIn: boolean,
    smsOptIn: boolean,
  ): boolean {
    return canal === 'IN_APP' || (canal === 'WHATSAPP' && whatsappOptIn) || (canal === 'SMS' && smsOptIn);
  }
}
