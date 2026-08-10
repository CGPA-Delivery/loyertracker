import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { InvitationApiService, InvitationDto } from '../core/invitation/invitation-api.service';

@Component({
  selector: 'app-invitation-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <div class="panel">
      <h2>Inviter un gestionnaire</h2>
      <p class="muted">Le gestionnaire recevra un lien valable 72h pour créer son compte.</p>

      <label>
        Email du gestionnaire
        <input
          type="email"
          [formControl]="email"
          placeholder="gestionnaire@exemple.com"
          autocomplete="email"
        />
      </label>

      <button type="button" (click)="envoyer()" [disabled]="email.invalid || chargement()">
        {{ chargement() ? 'Envoi…' : 'Inviter' }}
      </button>

      @if (succes(); as invitation) {
        <div class="success" role="status">
          ✅ Invitation envoyée à <strong>{{ invitation.email }}</strong>.
          <br />Lien : <code>{{ invitation.lien }}</code>
        </div>
      }

      @if (erreur()) {
        <div class="error" role="alert">{{ erreur() }}</div>
      }
    </div>
  `,
})
export class InvitationFormComponent {
  private readonly api = inject(InvitationApiService);

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly chargement = signal(false);
  readonly succes = signal<InvitationDto | null>(null);
  readonly erreur = signal<string | null>(null);

  readonly invitationEnvoyee = output<InvitationDto>();

  envoyer(): void {
    if (this.email.invalid) return;
    this.chargement.set(true);
    this.erreur.set(null);
    this.succes.set(null);

    this.api
      .inviter(this.email.value!)
      .pipe(finalize(() => this.chargement.set(false)))
      .subscribe({
        next: (invitation) => {
          this.succes.set(invitation);
          this.invitationEnvoyee.emit(invitation);
          this.email.reset();
        },
        error: (err: HttpErrorResponse) => {
          this.erreur.set(
            err.status === 409
              ? 'Ce gestionnaire a déjà une invitation en attente.'
              : 'Erreur lors de l\'envoi de l\'invitation.',
          );
        },
      });
  }
}
