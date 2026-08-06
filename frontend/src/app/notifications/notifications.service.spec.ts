import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {
  NotificationPreferencePayload,
  NotificationsService,
} from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NotificationsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulte les préférences du destinataire connecté', () => {
    service.consulterPreferences().subscribe();

    const req = http.expectOne('/api/notifications/preferences/current');
    expect(req.request.method).toBe('GET');
    req.flush({ enabled: true, preferredChannel: 'IN_APP', whatsappOptIn: false, smsOptIn: false });
  });

  it('enregistre les préférences avec consentSource formulaire', () => {
    const payload: NotificationPreferencePayload = {
      phoneE164: '+243999964331',
      preferredChannel: 'WHATSAPP',
      fallbackChannel: 'SMS',
      whatsappOptIn: true,
      smsOptIn: true,
      language: 'fr',
    };

    service.enregistrerPreferences(payload).subscribe();

    const req = http.expectOne('/api/notifications/preferences/current');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({
      ...payload,
      consentSource: 'FORMULAIRE_LOYERTRACKER',
    });
    req.flush({ ...payload, enabled: true, consentAt: '2026-08-06T06:40:53Z' });
  });

  it('désinscrit immédiatement le destinataire courant', () => {
    service.desinscrire().subscribe();

    const req = http.expectOne('/api/notifications/preferences/current/unsubscribe');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({ enabled: false });
  });

  it('consulte l historique de notifications du périmètre serveur', () => {
    service.consulterHistorique().subscribe();

    const req = http.expectOne('/api/notifications/history');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
