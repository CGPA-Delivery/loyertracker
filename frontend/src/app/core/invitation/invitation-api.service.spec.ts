import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { InvitationApiService } from './invitation-api.service';

describe('InvitationApiService', () => {
  let service: InvitationApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), InvitationApiService],
    });
    service = TestBed.inject(InvitationApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('invite un gestionnaire', () => {
    service.inviter('gestionnaire@example.com').subscribe();
    const req = http.expectOne('/api/invitations');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'gestionnaire@example.com' });
    req.flush({
      id: 'inv-1', email: 'gestionnaire@example.com', token: 'tok-abc',
      lien: 'https://app.loyertracker.com/invitations/tok-abc', statut: 'PENDING',
      dateExpiration: '2026-08-13T00:00:00Z',
    });
  });

  it('accepte une invitation', () => {
    service.accepter('tok-abc', 'Dupont', 'Jean', 'motdepasse12345').subscribe();
    const req = http.expectOne('/api/invitations/tok-abc/acceptation');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ nom: 'Dupont', prenom: 'Jean', motDePasse: 'motdepasse12345' });
    req.flush({ gestionnaireId: 'g-1', email: 'gestionnaire@example.com', compteCree: true });
  });
});
