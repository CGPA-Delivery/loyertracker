import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BailPayload, LocataireDetail, LocataireHistorique, LocatairePayload, LocataireQuickAddPayload, PatrimoinePayload, S02ApiService } from './s02-api.service';

describe('S02ApiService', () => {
  let service: S02ApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), S02ApiService],
    });
    service = TestBed.inject(S02ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    TestBed.resetTestingModule();
  });

  it('liste les biens', (done) => {
    service.listerBiens().subscribe((biens) => {
      expect(biens.length).toBe(1);
      expect(biens[0].adresse).toBe('10 rue A');
      done();
    });

    const req = http.expectOne('/api/biens');
    expect(req.request.method).toBe('GET');
    req.flush([
      { id: 'bien-1', adresse: '10 rue A', type: 'APPARTEMENT', statut: 'LIBRE', patrimoineId: 'patrimoine-1' },
    ]);
  });

  it('liste les patrimoines et les types de biens', () => {
    service.listerPatrimoines().subscribe();
    let req = http.expectOne('/api/patrimoines');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 'patrimoine-1', nom: 'Patrimoine principal', statut: 'ACTIF' }]);

    service.listerTypesBiens().subscribe();
    req = http.expectOne('/api/types-biens');
    expect(req.request.method).toBe('GET');
    req.flush([{ code: 'APPARTEMENT', libelle: 'Appartement', actif: true }]);
  });

  it('crée et archive logiquement un patrimoine', () => {
    const payload: PatrimoinePayload = {
      nom: 'Patrimoine Sud', adresse: '12 rue des Lilas', ville: 'Paris', commune: null,
      quartier: null, provinceEtat: null, pays: 'France', description: null, referenceInterne: 'PAT-SUD',
    };
    service.creerPatrimoine(payload).subscribe();
    let req = http.expectOne('/api/patrimoines');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 'patrimoine-2', ...payload, statut: 'ACTIF' });

    service.archiverPatrimoine('patrimoine-2').subscribe();
    req = http.expectOne('/api/patrimoines/patrimoine-2');
    expect(req.request.method).toBe('DELETE');
    req.flush({ id: 'patrimoine-2', ...payload, statut: 'ARCHIVE' });
  });

  it('cree modifie et archive un bien', () => {
    const payload = {
      adresse: '20 rue B',
      type: 'MAISON',
      statut: 'LIBRE' as const,
      patrimoineId: 'patrimoine-1',
    };

    service.creerBien(payload).subscribe();
    let req = http.expectOne('/api/biens');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 'bien-2', ...payload });

    service.modifierBien('bien-2', { ...payload, statut: 'EN_TRAVAUX' }).subscribe();
    req = http.expectOne('/api/biens/bien-2');
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 'bien-2', ...payload, statut: 'EN_TRAVAUX' });

    service.archiverBien('bien-2').subscribe();
    req = http.expectOne('/api/biens/bien-2/archivage');
    expect(req.request.method).toBe('PATCH');
    req.flush({ id: 'bien-2', ...payload, statut: 'ARCHIVE' });
  });

  it('cree et liste les baux', () => {
    const payload: BailPayload = {
      locataireId: 'locataire-1',
      loyerHc: 850,
      provisionCharges: 0,
      dateDebut: '2026-06-01',
      dateFin: null,
      devise: 'EUR',
    };

    service.creerBail('bien-1', payload).subscribe();
    let req = http.expectOne('/api/biens/bien-1/baux');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({
      id: 'bail-1',
      bienId: 'bien-1',
      locataireNom: 'Locataire',
      locataireEmail: 'locataire@test.local',
      loyerHc: payload.loyerHc,
      provisionCharges: payload.provisionCharges,
      dateDebut: payload.dateDebut,
      dateFin: payload.dateFin,
      devise: payload.devise,
      loyerCc: 850,
      statut: 'ACTIF',
    });

    service.listerBaux('bien-1').subscribe();
    req = http.expectOne('/api/biens/bien-1/baux');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('cloture et rouvre un bail avec les contrats Backend dédiés', () => {
    service.cloturerBail('bien-1', 'bail-1', { dateClotureEffective: '2026-08-10' }).subscribe();
    let req = http.expectOne('/api/biens/bien-1/baux/bail-1/cloture');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ dateClotureEffective: '2026-08-10' });
    req.flush({
      bail: { id: 'bail-1', bienId: 'bien-1', statut: 'CLOS' },
      avertissements: ['Échéances futures supprimées'],
    });

    service.rouvrirBail('bien-1', 'bail-1').subscribe();
    req = http.expectOne('/api/biens/bien-1/baux/bail-1/reouverture');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush({ id: 'bail-1', bienId: 'bien-1', statut: 'ACTIF' });
  });

  it('cree un locataire et liste les locataires actifs d’un bien', () => {
    const payload: LocataireQuickAddPayload = { nom: 'Dupont', prenom: 'Marie', email: null };

    service.creerLocataire(payload).subscribe();
    let req = http.expectOne('/api/locataires');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 'locataire-1', nom: 'Dupont', prenom: 'Marie', email: null, statut: 'ACTIVE' });

    service.listerLocatairesDuBien('bien-1').subscribe();
    req = http.expectOne('/api/biens/bien-1/locataires');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('cree revoque et liste les affectations', () => {
    const payload = {
      bienId: 'bien-1',
      gestionnaireId: 'gestionnaire-1',
      typeHonoraires: 'POURCENTAGE' as const,
      montantHonoraires: 10,
      dateDebut: '2026-06-01',
      dateFin: null,
    };

    service.creerAffectation(payload).subscribe();
    let req = http.expectOne('/api/affectations');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 'affectation-1', ...payload, statut: 'ACTIVE', dateRevocation: null });

    service.revoquerAffectation('affectation-1').subscribe();
    req = http.expectOne('/api/affectations/affectation-1/revocation');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'affectation-1', ...payload, statut: 'REVOQUEE', dateRevocation: '2026-06-07T00:00:00Z' });

    service.listerAffectations('bien-1').subscribe();
    req = http.expectOne('/api/biens/bien-1/affectations');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  // --- Locataire endpoints (EP-15) ---

  it('verificationDoublonLocataire', () => {
    service.verificationDoublonLocataire('a@b.com', '+33', 'CNI-123').subscribe();
    const req = http.expectOne('/api/locataires/verification-doublon?email=a@b.com&telephone=%2B33&piece=CNI-123');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('consulterLocataire', () => {
    const detail: LocataireDetail = {
      id: 'loc-1', nom: 'Dupont', prenom: 'Jean', telephone: '+33', email: 'j@d.com',
      profession: null, dateNaissance: null, typePieceIdentite: null, numeroPieceIdentite: null,
      photoPresente: false, contactUrgence: null, observations: null, statut: 'ACTIVE',
      dateCreation: '2026-01-01T00:00:00Z', dateArchivage: null,
    };
    service.consulterLocataire('loc-1').subscribe((r) => expect(r).toEqual(detail));
    const req = http.expectOne('/api/locataires/loc-1');
    expect(req.request.method).toBe('GET');
    req.flush(detail);
  });

  it('modifierLocataire', () => {
    const payload: LocatairePayload = { nom: 'Dupont', prenom: 'Jean', telephone: '+33' };
    service.modifierLocataire('loc-1', payload).subscribe();
    const req = http.expectOne('/api/locataires/loc-1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 'loc-1', ...payload, statut: 'ACTIVE' });
  });

  it('archiverLocataire', () => {
    service.archiverLocataire('loc-1').subscribe();
    const req = http.expectOne('/api/locataires/loc-1/archivage');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'loc-1', statut: 'ARCHIVE' });
  });

  it('restaurerLocataire', () => {
    service.restaurerLocataire('loc-1').subscribe();
    const req = http.expectOne('/api/locataires/loc-1/restauration');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'loc-1', statut: 'ACTIVE' });
  });

  it('historiqueLocataire', () => {
    const historique: LocataireHistorique = {
      locataire: { id: 'loc-1', nom: 'Dupont', prenom: null, telephone: null, email: null,
        profession: null, dateNaissance: null, typePieceIdentite: null, numeroPieceIdentite: null,
        photoPresente: false, contactUrgence: null, observations: null, statut: 'ACTIVE',
        dateCreation: '2026-01-01T00:00:00Z', dateArchivage: null },
      audit: [],
    };
    service.historiqueLocataire('loc-1').subscribe((r) => expect(r).toEqual(historique));
    const req = http.expectOne('/api/locataires/loc-1/historique');
    expect(req.request.method).toBe('GET');
    req.flush(historique);
  });
});
