import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { LtConfirmDialogService } from '../shared/confirm-dialog/confirm-dialog.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { LtToastService } from '../shared/toast/toast.service';
import {
  NotificationPreference,
  NotificationsService,
} from './notifications.service';
import { NotificationsPreferencesComponent } from './notifications-preferences.component';

const preferenceInitiale: NotificationPreference = {
  enabled: true,
  phoneE164: '+243****4331',
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
  let toast: jasmine.SpyObj<LtToastService>;
  let confirmDialog: jasmine.SpyObj<LtConfirmDialogService>;

  beforeEach(() => {
    api = jasmine.createSpyObj<NotificationsService>('NotificationsService', [
      'consulterPreferences',
      'enregistrerPreferences',
      'desinscrire',
    ]);
    api.consulterPreferences.and.returnValue(of(preferenceInitiale));

    toast = jasmine.createSpyObj<LtToastService>('LtToastService', [
      'success',
      'info',
      'warning',
      'danger',
    ]);

    confirmDialog = jasmine.createSpyObj<LtConfirmDialogService>('LtConfirmDialogService', [
      'confirm',
    ]);

    TestBed.configureTestingModule({
      imports: [NotificationsPreferencesComponent, ConfirmDialogComponent, ToastComponent],
      providers: [
        { provide: NotificationsService, useValue: api },
        { provide: LtToastService, useValue: toast },
        { provide: LtConfirmDialogService, useValue: confirmDialog },
        ConfirmationService,
        MessageService,
      ],
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
      phoneE164: '+243****4331',
      preferredChannel: 'WHATSAPP',
      fallbackChannel: 'SMS',
      whatsappOptIn: true,
      smsOptIn: true,
    });
  });

  it('bloque un canal préféré sans opt-in correspondant et notifie via toast', () => {
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
    expect(toast.warning).toHaveBeenCalledWith(
      "Activez l'opt-in du canal préféré avant d'enregistrer.",
    );
  });

  it('enregistre les préférences valides avec langue française et notifie via toast', () => {
    const cmp = creer();
    api.enregistrerPreferences.and.returnValue(of({ ...preferenceInitiale, phoneE164: '+243999960000' }));
    cmp.form.setValue({
      phoneE164: '  +243999960000  ',
      preferredChannel: 'SMS',
      fallbackChannel: null,
      whatsappOptIn: false,
      smsOptIn: true,
    });

    cmp.enregistrer();

    expect(api.enregistrerPreferences).toHaveBeenCalledWith({
      phoneE164: '+243999960000',
      preferredChannel: 'SMS',
      fallbackChannel: null,
      whatsappOptIn: false,
      smsOptIn: true,
      language: 'fr',
    });
    expect(toast.success).toHaveBeenCalledWith('Préférences enregistrées.');
  });

  it('ouvre le dialogue de confirmation via LtConfirmDialogService', () => {
    const cmp = creer();

    cmp.demanderDesinscription();

    expect(confirmDialog.confirm).toHaveBeenCalled();
    const options = confirmDialog.confirm.calls.mostRecent().args[0];
    expect(options.header).toBe('Confirmer la désinscription ?');
    expect(options.acceptLabel).toBe('Confirmer la désinscription');
    expect(options.rejectLabel).toBe('Annuler');
    expect(options.message).toContain('Vos alertes dans l’application restent actives');
  });

  it('désinscrit après confirmation et notifie via toast', () => {
    const cmp = creer();
    api.desinscrire.and.returnValue(of({ ...preferenceInitiale, enabled: false }));

    cmp.demanderDesinscription();

    // Récupérer le callback accept et l'exécuter
    const options = confirmDialog.confirm.calls.mostRecent().args[0];
    options.accept();

    expect(api.desinscrire).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(
      'Désinscription effective — aucun envoi externe ne sera plus tenté. Vos alertes dans l’application restent actives.',
    );
    expect(cmp.preferences()?.enabled).toBeFalse();
  });

  it('signale les erreurs de chargement via toast', () => {
    api.consulterPreferences.and.returnValue(throwError(() => new Error('boom')));

    creer();

    expect(toast.danger).toHaveBeenCalledWith(
      'Impossible de charger les préférences de notification.',
    );
  });

  it('signale les erreurs d\'enregistrement via toast', () => {
    const cmp = creer();
    api.enregistrerPreferences.and.returnValue(throwError(() => new Error('boom')));
    cmp.form.setValue({
      phoneE164: '+243999964331',
      preferredChannel: 'WHATSAPP',
      fallbackChannel: null,
      whatsappOptIn: true,
      smsOptIn: false,
    });

    cmp.enregistrer();

    expect(toast.danger).toHaveBeenCalledWith("Échec de l'enregistrement des préférences.");
  });

  it('signale les erreurs de désinscription via toast', () => {
    const cmp = creer();
    api.desinscrire.and.returnValue(throwError(() => new Error('boom')));

    cmp.demanderDesinscription();
    const options = confirmDialog.confirm.calls.mostRecent().args[0];
    options.accept();

    expect(toast.danger).toHaveBeenCalledWith('Échec de la désinscription.');
  });

  it('respecte les touch targets mobiles documentées par le DSG', () => {
    const fixture = TestBed.createComponent(NotificationsPreferencesComponent);
    fixture.detectChanges();

    const bouton = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input[type="tel"]') as HTMLElement;

    expect(getComputedStyle(bouton).minHeight).toBe('44px');
    expect(getComputedStyle(input).minHeight).toBe('44px');
  });

  it('respecte la mise en page responsive et n\'introduit pas de débordement horizontal', () => {
    const fixture = TestBed.createComponent(NotificationsPreferencesComponent);
    fixture.detectChanges();

    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
    const actions = fixture.nativeElement.querySelector('.actions') as HTMLElement;
    if (window.innerWidth <= 640) {
      expect(getComputedStyle(actions).flexDirection).toBe('column');
    }
  });
});
