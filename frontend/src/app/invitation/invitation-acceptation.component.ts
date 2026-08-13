import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, input, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { InvitationApiService, AcceptationDto } from '../core/invitation/invitation-api.service';

@Component({
  selector: 'app-invitation-acceptation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="invitation-acceptation" aria-labelledby="invitation-title">
      @if (succes(); as acceptation) {
        <section class="panel" role="status" aria-live="polite">
          <h1 id="invitation-title">Invitation acceptée</h1>
          <p>Le compte associé à {{ acceptation.email }} est prêt. Vous pouvez maintenant vous connecter.</p>
          <a routerLink="/">Aller à la connexion</a>
        </section>
      } @else {
        <section class="panel">
          <h1 id="invitation-title">Créer votre accès gestionnaire</h1>
          <p class="muted">Renseignez vos informations pour accepter cette invitation.</p>

          <label for="invitation-nom">Nom
            <input id="invitation-nom" type="text" autocomplete="family-name" [formControl]="nom" />
          </label>
          <label for="invitation-prenom">Prénom
            <input id="invitation-prenom" type="text" autocomplete="given-name" [formControl]="prenom" />
          </label>
          <label for="invitation-password">Mot de passe
            <input id="invitation-password" type="password" autocomplete="new-password" [formControl]="motDePasse" />
          </label>
          <label for="invitation-confirmation">Confirmer le mot de passe
            <input id="invitation-confirmation" type="password" autocomplete="new-password" [formControl]="confirmation" />
          </label>

          @if (erreur(); as message) {
            <p class="error" role="alert">{{ message }}</p>
          }

          <button type="button" data-testid="invitation-accept-btn" (click)="accepter()" [disabled]="chargement()">
            {{ chargement() ? 'Création en cours…' : 'Accepter l’invitation' }}
          </button>
        </section>
      }
    </main>
  `,
  styles: `
    .invitation-acceptation { display: grid; place-items: center; min-height: 100%; padding: var(--lt-space-lg); }
    .panel { width: min(100%, 32rem); display: grid; gap: var(--lt-space-sm); }
    label { display: grid; gap: var(--lt-space-xs); }
    input, button { min-height: 44px; }
    .error { color: var(--lt-color-danger, #b91c1c); }
  `,
})
export class InvitationAcceptationComponent {
  private readonly api = inject(InvitationApiService);

  readonly token = input.required<string>();
  readonly nom = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly prenom = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly motDePasse = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(12)] });
  readonly confirmation = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly chargement = signal(false);
  readonly erreur = signal<string | null>(null);
  readonly succes = signal<AcceptationDto | null>(null);

  accepter(): void {
    this.erreur.set(null);
    if (this.nom.invalid || this.prenom.invalid || this.motDePasse.invalid || this.confirmation.invalid) {
      this.nom.markAsTouched();
      this.prenom.markAsTouched();
      this.motDePasse.markAsTouched();
      this.confirmation.markAsTouched();
      return;
    }
    if (this.motDePasse.value !== this.confirmation.value) {
      this.erreur.set('Les mots de passe doivent être identiques.');
      return;
    }

    this.chargement.set(true);
    this.api.accepter(this.token(), this.nom.value, this.prenom.value, this.motDePasse.value)
      .pipe(finalize(() => this.chargement.set(false)))
      .subscribe({
        next: (acceptation) => this.succes.set(acceptation),
        error: (error: HttpErrorResponse) => this.erreur.set(this.messageErreur(error.status)),
      });
  }

  private messageErreur(status: number): string {
    if (status === 404 || status === 409) return 'Cette invitation est invalide ou a expiré.';
    if (status === 400) return 'Les informations saisies ne sont pas valides.';
    return 'Le service est indisponible. Veuillez réessayer.';
  }
}
