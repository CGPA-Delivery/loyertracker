import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import {
  NotificationPreference,
  NotificationsService,
} from './notifications.service';
import { NotificationsPreferencesComponent } from './notifications-preferences.component';

const preferenceInitiale: NotificationPreference = {
  enabled: true,
  phoneE164: '+243999964331',
  preferredChannel: 'WHATSAPP',
  fallbackChannel: 'SMS',
  whatsappOptIn: true,
  smsOptIn: true,
  consentAt: '2026-08-06T06:40:53Z',
  consentSource: 'FORMULAIRE_LOYERTRACKER',
  language: 'fr',
};

describe('NotificationsPreferencesComponent', () => {
  let api: jasmine.SpyObj<NotificationsService>;

  beforeEach(() => {
    api = jasmine.createSpyObj<NotificationsService>('NotificationsService', [
      'consulterPreferences',
      'enregistrerPreferences',
      'desinscrire',
    ]);
    api.consulterPreferences.and.returnValue(of(preferenceInitiale));

    TestBed.configureTestingModule({
      imports: [NotificationsPreferencesComponent],
      providers: [{ provide: NotificationsService, useValue: api }],
    });
  });

  function creer(): NotificationsPreferencesComponent {
    const fixture = TestBed.createComponent(NotificationsPreferencesComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('charge les préférences et initialise le formulaire', () => {
    const cmp = creer();

    expect(cmp.preferences()).toEqual(preferenceInitiale);
    expect(cmp.form.getRawValue()).toEqual({
      phoneE164: '+243999964331',
      preferredChannel: 'WHATSAPP',
      fallbackChannel: 'SMS',
      whatsappOptIn: true,
      smsOptIn: true,
    });
  });

  it('bloque un canal préféré sans opt-in correspondant', () => {
    const cmp = creer();
    cmp.form.setValue({
      phoneE164: '+243999964331',
      preferredChannel: 'WHATSAPP',
      fallbackChannel: null,
      whatsappOptIn: false,
      smsOptIn: true,
    });

    cmp.enregistrer();

    expect(api.enregistrerPreferences).not.toHaveBeenCalled();
    expect(cmp.message()).toBe("Activez l'opt-in du canal préféré avant d'enregistrer.");
  });

  it('enregistre les préférences valides avec langue française', () => {
    const cmp = creer();
    api.enregistrerPreferences.and.returnValue(of({ ...preferenceInitiale, phoneE164: '+243810000000' }));
    cmp.form.setValue({
      phoneE164: '  +243810000000  ',
      preferredChannel: 'SMS',
      fallbackChannel: null,
      whatsappOptIn: false,
      smsOptIn: true,
    });

    cmp.enregistrer();

    expect(api.enregistrerPreferences).toHaveBeenCalledWith({
      phoneE164: '+243810000000',
      preferredChannel: 'SMS',
      fallbackChannel: null,
      whatsappOptIn: false,
      smsOptIn: true,
      language: 'fr',
    });
    expect(cmp.message()).toBe('Préférences enregistrées.');
  });

  it('ouvre un dialogue avant désinscription sans appeler immédiatement l API', () => {
    const fixture = TestBed.createComponent(NotificationsPreferencesComponent);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;

    cmp.demanderDesinscription();
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('[role="alertdialog"]') as HTMLElement;
    expect(api.desinscrire).not.toHaveBeenCalled();
    expect(cmp.confirmationDesinscription()).toBeTrue();
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe('notifications-unsubscribe-title');
    expect(dialog.textContent).toContain('Vos alertes dans l’application restent actives');
  });

  it('désinscrit après confirmation explicite et conserve les alertes in-app', () => {
    const cmp = creer();
    api.desinscrire.and.returnValue(of({ ...preferenceInitiale, enabled: false }));

    cmp.demanderDesinscription();
    cmp.confirmerDesinscription();

    expect(api.desinscrire).toHaveBeenCalled();
    expect(cmp.message()).toBe('Désinscription effective — aucun envoi externe ne sera plus tenté. Vos alertes dans l’application restent actives.');
    expect(cmp.preferences()?.enabled).toBeFalse();
    expect(cmp.confirmationDesinscription()).toBeFalse();
  });

  it('place le focus dans le dialogue, ferme avec Escape et restitue le focus', async () => {
    const fixture = TestBed.createComponent(NotificationsPreferencesComponent);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const bouton = fixture.nativeElement.querySelector('.danger') as HTMLButtonElement;
    bouton.focus();

    cmp.demanderDesinscription();
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));

    const dialog = fixture.nativeElement.querySelector('[role="alertdialog"]') as HTMLElement;
    expect(document.activeElement).toBe(dialog.querySelector('button'));

    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));

    expect(cmp.confirmationDesinscription()).toBeFalse();
    expect(document.activeElement).toBe(bouton);
  });

  it('retient la tabulation dans le dialogue de confirmation', async () => {
    const fixture = TestBed.createComponent(NotificationsPreferencesComponent);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;

    cmp.demanderDesinscription();
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));

    const dialog = fixture.nativeElement.querySelector('[role="alertdialog"]') as HTMLElement;
    const boutons = dialog.querySelectorAll('button');
    (boutons[1] as HTMLButtonElement).focus();
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

    expect(document.activeElement).toBe(boutons[0]);
  });

  it('annule la désinscription et restitue le focus au bouton déclencheur', async () => {
    const fixture = TestBed.createComponent(NotificationsPreferencesComponent);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const bouton = fixture.nativeElement.querySelector('.danger') as HTMLButtonElement;
    bouton.focus();

    cmp.demanderDesinscription();
    fixture.detectChanges();
    cmp.annulerDesinscription();
    await new Promise((resolve) => setTimeout(resolve));

    expect(cmp.confirmationDesinscription()).toBeFalse();
    expect(document.activeElement).toBe(bouton);
  });

  it('respecte les touch targets mobiles documentées par le DSG', () => {
    const fixture = TestBed.createComponent(NotificationsPreferencesComponent);
    fixture.detectChanges();

    const bouton = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input[type="tel"]') as HTMLElement;

    expect(getComputedStyle(bouton).minHeight).toBe('44px');
    expect(getComputedStyle(input).minHeight).toBe('44px');
  });

  it('respecte la mise en page responsive et n introduit pas de débordement horizontal', () => {
    const fixture = TestBed.createComponent(NotificationsPreferencesComponent);
    fixture.detectChanges();

    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
    const actions = fixture.nativeElement.querySelector('.actions') as HTMLElement;
    if (window.innerWidth <= 640) {
      expect(getComputedStyle(actions).flexDirection).toBe('column');
    }
  });

  it('signale les erreurs de chargement', () => {
    api.consulterPreferences.and.returnValue(throwError(() => new Error('boom')));

    const cmp = creer();

    expect(cmp.message()).toBe('Impossible de charger les préférences de notification.');
  });
});
