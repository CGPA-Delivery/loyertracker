import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <main class="error-page" aria-labelledby="error-title">
      <h1 id="error-title">Accès refusé</h1>
      <p>Vous n’avez pas les droits nécessaires pour accéder à cette page.</p>
      <a routerLink="/">Retour à l’accueil</a>
    </main>
  `,
  styles: `
    .error-page { display: grid; place-items: center; align-content: center; gap: var(--lt-space-sm); min-height: 100%; padding: var(--lt-space-lg); text-align: center; }
    a { min-height: 44px; display: inline-flex; align-items: center; }
  `,
})
export class ForbiddenComponent {}

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <main class="error-page" aria-labelledby="error-title">
      <h1 id="error-title">Page introuvable</h1>
      <p>La page demandée n’existe pas ou n’est plus disponible.</p>
      <a routerLink="/">Retour à l’accueil</a>
    </main>
  `,
  styles: `
    .error-page { display: grid; place-items: center; align-content: center; gap: var(--lt-space-sm); min-height: 100%; padding: var(--lt-space-lg); text-align: center; }
    a { min-height: 44px; display: inline-flex; align-items: center; }
  `,
})
export class NotFoundComponent {}
