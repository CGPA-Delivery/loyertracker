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

  it('désinscrit avec confirmation explicite et conserve les alertes in-app', () => {
    const cmp = creer();
    api.desinscrire.and.returnValue(of({ ...preferenceInitiale, enabled: false }));

    cmp.confirmerDesinscription();

    expect(api.desinscrire).toHaveBeenCalled();
    expect(cmp.message()).toBe('Désinscription effective — aucun envoi externe ne sera plus tenté. Vos alertes dans l’application restent actives.');
    expect(cmp.preferences()?.enabled).toBeFalse();
  });

  it('signale les erreurs de chargement', () => {
    api.consulterPreferences.and.returnValue(throwError(() => new Error('boom')));

    const cmp = creer();

    expect(cmp.message()).toBe('Impossible de charger les préférences de notification.');
  });
});
