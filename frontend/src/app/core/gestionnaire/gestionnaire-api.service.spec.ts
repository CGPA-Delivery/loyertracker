import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {
  Gestionnaire,
  GestionnaireApiService,
  GestionnaireHistorique,
  GestionnaireProfilPayload,
} from './gestionnaire-api.service';

const API = '/api/gestionnaires';

const gestionnaire: Gestionnaire = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  email: 'gest@example.com',
  nom: 'Dupont',
  prenom: 'Jean',
  statut: 'ACTIF',
  telephone: '+33123456789',
  photoPresente: false,
  observations: null,
  dateCreation: '2026-01-01T00:00:00Z',
  dateSuspension: null,
  dateArchivage: null,
};

const historique: GestionnaireHistorique = {
  gestionnaire,
  affectations: [],
  audit: [],
};

describe('GestionnaireApiService', () => {
  let service: GestionnaireApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GestionnaireApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(GestionnaireApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('recherche sans paramètre', () => {
    service.rechercher().subscribe((r) => expect(r).toEqual([gestionnaire]));
    const req = http.expectOne(`${API}`);
    expect(req.request.method).toBe('GET');
    req.flush([gestionnaire]);
  });

  it('recherche avec paramètre q', () => {
    service.rechercher('dupont').subscribe();
    const req = http.expectOne(`${API}?q=dupont`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('verificationDoublon avec email et telephone', () => {
    service.verificationDoublon('a@b.com', '+33').subscribe((r) => expect(r).toEqual([]));
    const req = http.expectOne(`${API}/verification-doublon?email=a@b.com&telephone=%2B33`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('verificationDoublon sans paramètre', () => {
    service.verificationDoublon().subscribe();
    const req = http.expectOne(`${API}/verification-doublon`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('consulter un gestionnaire', () => {
    service.consulter(gestionnaire.id).subscribe((r) => expect(r).toEqual(gestionnaire));
    const req = http.expectOne(`${API}/${gestionnaire.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(gestionnaire);
  });

  it('modifierProfil', () => {
    const payload: GestionnaireProfilPayload = { telephone: '+33', observations: 'note' };
    service.modifierProfil(gestionnaire.id, payload).subscribe((r) => expect(r).toEqual(gestionnaire));
    const req = http.expectOne(`${API}/${gestionnaire.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(gestionnaire);
  });

  it('suspendre', () => {
    service.suspendre(gestionnaire.id).subscribe();
    const req = http.expectOne(`${API}/${gestionnaire.id}/suspension`);
    expect(req.request.method).toBe('POST');
    req.flush(gestionnaire);
  });

  it('reactiver', () => {
    service.reactiver(gestionnaire.id).subscribe();
    const req = http.expectOne(`${API}/${gestionnaire.id}/reactivation`);
    expect(req.request.method).toBe('POST');
    req.flush(gestionnaire);
  });

  it('archiver', () => {
    service.archiver(gestionnaire.id).subscribe();
    const req = http.expectOne(`${API}/${gestionnaire.id}/archivage`);
    expect(req.request.method).toBe('POST');
    req.flush(gestionnaire);
  });

  it('restaurer', () => {
    service.restaurer(gestionnaire.id).subscribe();
    const req = http.expectOne(`${API}/${gestionnaire.id}/restauration`);
    expect(req.request.method).toBe('POST');
    req.flush(gestionnaire);
  });

  it('historique', () => {
    service.historique(gestionnaire.id).subscribe((r) => expect(r).toEqual(historique));
    const req = http.expectOne(`${API}/${gestionnaire.id}/historique`);
    expect(req.request.method).toBe('GET');
    req.flush(historique);
  });

  it('propage les erreurs HTTP', () => {
    service.consulter('id').subscribe({
      error: (err: HttpErrorResponse) => expect(err.status).toBe(404),
    });
    http.expectOne(`${API}/id`).flush(null, { status: 404, statusText: 'Not Found' });
  });
});
