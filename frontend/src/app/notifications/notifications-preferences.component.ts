import { Component, HostListener, OnInit, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  CanalNotification,
  NotificationPreference,
  NotificationsService,
} from './notifications.service';

@Component({
  selector: 'app-notifications-preferences',
  standalone: true,
  imports: [ReactiveFormsModule],
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
            placeholder="+243999964331"
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

      @if (confirmationDesinscription()) {
        <div class="modal-backdrop">
          <section
            class="confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="notifications-unsubscribe-title"
            aria-describedby="notifications-unsubscribe-description"
          >
            <h3 id="notifications-unsubscribe-title">Confirmer la désinscription ?</h3>
            <p id="notifications-unsubscribe-description">
              Vous ne recevrez plus aucun message WhatsApp ni SMS dès maintenant.
              Vos alertes dans l’application restent actives sans changement.
            </p>
            <div class="actions">
              <button type="button" (click)="annulerDesinscription()">Annuler</button>
              <button type="button" class="danger" (click)="confirmerDesinscription()">
                Confirmer la désinscription
              </button>
            </div>
          </section>
        </div>
      }

      @if (preferences()?.consentAt) {
        <p class="muted">Consentement recueilli le {{ preferences()?.consentAt }} via formulaire LoyerTracker.</p>
      }

      @if (message(); as m) {
        <p class="message" role="status" aria-live="polite">{{ m }}</p>
      }
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
      .invite,
      .message {
        color: var(--lt-state-info, #bae6fd);
      }
      .modal-backdrop {
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
        padding: 1rem;
        background: rgb(15 23 42 / 0.72);
        z-index: var(--lt-z-modal-backdrop, 1200);
      }
      .confirm-modal {
        width: min(100%, 34rem);
        border: 1px solid var(--lt-border-default, #64748b);
        border-radius: 6px;
        padding: 1rem;
        background: var(--lt-surface-card, #111827);
        color: var(--lt-text-primary, #e2e8f0);
        z-index: var(--lt-z-modal, 1300);
      }
      .confirm-modal .actions {
        margin-top: 1rem;
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

  readonly contexte = input<'bailleur' | 'gestionnaire'>('bailleur');
  readonly preferences = signal<NotificationPreference | null>(null);
  readonly confirmationDesinscription = signal(false);
  readonly chargement = signal(false);
  readonly message = signal<string | null>(null);
  private declencheurDesinscription: HTMLElement | null = null;

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
        this.message.set(null);
      },
      error: () => this.message.set('Impossible de charger les préférences de notification.'),
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
      this.message.set("Activez l'opt-in du canal préféré avant d'enregistrer.");
      return;
    }

    this.chargement.set(true);
    this.message.set(null);
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
          this.message.set('Préférences enregistrées.');
        },
        error: () => this.message.set("Échec de l'enregistrement des préférences."),
        complete: () => this.chargement.set(false),
      });
  }

  demanderDesinscription(): void {
    this.declencheurDesinscription = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.confirmationDesinscription.set(true);
    setTimeout(() => {
      const premierBouton = document.querySelector<HTMLElement>('[role="alertdialog"] button');
      premierBouton?.focus();
    });
  }

  @HostListener('document:keydown', ['$event'])
  gererClavier(event: KeyboardEvent): void {
    const dialog = document.querySelector<HTMLElement>('[role="alertdialog"]');
    if (!dialog || !this.confirmationDesinscription()) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.annulerDesinscription();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
    ).filter((element) => !element.hasAttribute('disabled'));
    if (focusables.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const first = focusables[0];
    const last = focusables.at(-1)!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  annulerDesinscription(): void {
    this.confirmationDesinscription.set(false);
    setTimeout(() => this.declencheurDesinscription?.focus());
  }

  confirmerDesinscription(): void {
    this.chargement.set(true);
    this.api.desinscrire().subscribe({
      next: (preferences) => {
        this.preferences.set(preferences);
        this.confirmationDesinscription.set(false);
        this.message.set(
          'Désinscription effective — aucun envoi externe ne sera plus tenté. Vos alertes dans l’application restent actives.',
        );
      },
      error: () => this.message.set('Échec de la désinscription.'),
      complete: () => this.chargement.set(false),
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
