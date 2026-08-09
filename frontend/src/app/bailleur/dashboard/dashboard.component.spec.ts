import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { BailleurDashboardComponent } from './dashboard.component';

describe('BailleurDashboardComponent', () => {
  let fixture: ComponentFixture<BailleurDashboardComponent>;
  let http: HttpTestingController;
  let confirmSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BailleurDashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            getUsername: () => 'alice',
            roles: ['BAILLEUR'],
            hasRole: (role: string) => role === 'BAILLEUR',
          },
        },
      ],
    });
    fixture = TestBed.createComponent(BailleurDashboardComponent);
    http = TestBed.inject(HttpTestingController);
    confirmSpy = spyOn(globalThis, 'confirm').and.returnValue(true);

    fixture.detectChanges(); // ngOnInit -> inscription, puis chargement biens/référentiels

    http.expectOne('/api/bailleurs/inscription').flush({});
    http.expectOne('/api/biens').flush([]);
    http
      .expectOne('/api/patrimoines')
      .flush([{ id: 'patrimoine-1', nom: 'Patrimoine principal', adresse: '1 rue Test', statut: 'ACTIF' }]);
    http
      .expectOne('/api/types-biens')
      .flush([{ code: 'APPARTEMENT', libelle: 'Appartement', actif: true }]);
    // Locataires du bailleur chargés au même moment (EP-15 Sprint C, sélecteur de bail).
    http.expectOne('/api/locataires').flush([]);
    // Affectations patrimoine chargées après listerPatrimoines (Sprint 4 E2).
    http.expectOne('/api/patrimoines/patrimoine-1/affectations').flush([]);
    // Composants enfants toujours rendus dans le tableau de bord (alertes, historique notifications, audit).
    http.expectOne('/api/alertes').flush([]);
    http.expectOne('/api/notifications/history').flush([]);
    http.expectOne('/api/audit').flush([]);
  });

  afterEach(() => {
    http.verify();
  });

  describe('EP-17 Lot 3 — liste des biens via lt-data-table', () => {
    it('affiche adresse/type/statut (badge coloré) et sélectionne un bien au clic', () => {
      const cmp = fixture.componentInstance;
      cmp.chargerBiens();
      http.expectOne('/api/biens').flush([
        { id: 'bien-1', adresse: '12 rue des Lilas', type: 'APPARTEMENT', statut: 'LIBRE', patrimoineId: 'patrimoine-1' },
      ]);
      fixture.detectChanges();

      const table = fixture.nativeElement.querySelector('lt-data-table');
      expect(table).not.toBeNull();
      expect(table.textContent).toContain('12 rue des Lilas');
      expect(table.textContent).toContain('APPARTEMENT');
      const tag = table.querySelector('lt-status-tag');
      expect(tag.textContent.trim()).toBe('LIBRE');
      expect(tag.querySelector('.p-tag-success')).not.toBeNull();

      const tr = table.querySelector('tbody tr') as HTMLElement;
      expect(tr.getAttribute('role')).toBe('button');
      tr.click();

      expect(cmp.bienSelectionne()?.id).toBe('bien-1');
      http.expectOne('/api/biens/bien-1/baux').flush([]);
      http.expectOne('/api/biens/bien-1/affectations').flush([]);
    });

    it("affiche l'erreur de chargement des biens dans lt-data-table sans bloquer le reste du tableau de bord", () => {
      const cmp = fixture.componentInstance;
      cmp.chargerBiens();
      http.expectOne('/api/biens').flush('indisponible', { status: 500, statusText: 'Server Error' });
      fixture.detectChanges();

      expect(cmp.biensErreur()).toContain('500');
      const error = fixture.nativeElement.querySelector('lt-data-table .error');
      expect(error).not.toBeNull();
      expect(error.getAttribute('role')).toBe('alert');
    });
  });

  describe('EP-13 — cycle de vie du bail', () => {
    it('clôture le bail sélectionné après confirmation et recharge le détail du bien', () => {
      const cmp = fixture.componentInstance;
      const bail = {
        id: 'bail-1',
        bienId: 'bien-1',
        locataireNom: 'Locataire',
        locataireEmail: null,
        loyerHc: 800,
        provisionCharges: 0,
        loyerCc: 800,
        depotGarantie: 0,
        dateDebut: '2026-01-01',
        dateFin: null,
        statut: 'ACTIF',
        devise: 'EUR' as const,
      };
      cmp.bienSelectionne.set({ id: 'bien-1', adresse: '1 rue Test', type: 'APPARTEMENT', statut: 'LOUE', patrimoineId: 'patrimoine-1' });
      cmp.bailSelectionne.set(bail);

      cmp.cloturerBail();

      const req = http.expectOne('/api/biens/bien-1/baux/bail-1/cloture');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ dateClotureEffective: null });
      req.flush({ bail: { ...bail, statut: 'CLOS' }, avertissements: [] });
      http.expectOne('/api/biens/bien-1/baux').flush([]);
      http.expectOne('/api/biens/bien-1/affectations').flush([]);

      expect(cmp.message()).toBe('Bail clôturé');
      expect(cmp.bailSelectionne()?.statut).toBe('CLOS');
    });

    it('refuse la réouverture avant confirmation', () => {
      const cmp = fixture.componentInstance;
      confirmSpy.and.returnValue(false);
      cmp.bienSelectionne.set({ id: 'bien-1', adresse: '1 rue Test', type: 'APPARTEMENT', statut: 'LOUE', patrimoineId: 'patrimoine-1' });
      cmp.bailSelectionne.set({ id: 'bail-1', bienId: 'bien-1', locataireNom: 'Locataire', locataireEmail: null, loyerHc: 800, provisionCharges: 0, loyerCc: 800, depotGarantie: 0, dateDebut: '2026-01-01', dateFin: null, statut: 'CLOS', devise: 'EUR' });

      cmp.rouvrirBail();

      expect(confirmSpy).toHaveBeenCalled();
      http.expectNone('/api/biens/bien-1/baux/bail-1/reouverture');
    });
  });

  describe('EP-17 Lot 3 — liste des patrimoines via lt-data-table', () => {
    it('affiche nom/adresse/statut (badge coloré) du patrimoine chargé au démarrage', () => {
      fixture.detectChanges();

      const tables = fixture.nativeElement.querySelectorAll('lt-data-table');
      const table = tables[1] as HTMLElement; // 0 = Biens, 1 = Patrimoines
      expect(table.textContent).toContain('Patrimoine principal');
      expect(table.textContent).toContain('1 rue Test');
      const tag = table.querySelector('lt-status-tag');
      expect(tag?.textContent?.trim()).toBe('ACTIF');
      expect(tag?.querySelector('.p-tag-success')).not.toBeNull();
    });

    it("affiche l'erreur de rechargement des patrimoines dans lt-data-table sans bloquer le reste du tableau de bord", () => {
      const cmp = fixture.componentInstance;
      cmp.selectionnerPatrimoineModif('patrimoine-1');
      cmp.patrimoineForm.setValue({
        nom: 'Patrimoine Sud',
        adresse: '12 rue des Lilas, Paris',
        ville: 'Paris',
        commune: null,
        quartier: null,
        provinceEtat: null,
        pays: 'France',
        description: null,
        referenceInterne: 'PAT-SUD',
      });

      cmp.modifierPatrimoine();

      http
        .expectOne('/api/patrimoines/patrimoine-1')
        .flush({ id: 'patrimoine-1', nom: 'Patrimoine Sud', adresse: '12 rue des Lilas, Paris', statut: 'ACTIF' });

      // chargerReferentielsBien recharge les référentiels ; listerPatrimoines échoue ici
      http.expectOne('/api/patrimoines').flush('indisponible', { status: 500, statusText: 'Server Error' });
      http.expectOne('/api/types-biens').flush([{ code: 'APPARTEMENT', libelle: 'Appartement', actif: true }]);
      http.expectOne('/api/locataires').flush([]);
      fixture.detectChanges();

      expect(cmp.patrimoinesErreur()).toContain('500');
      const tables = fixture.nativeElement.querySelectorAll('lt-data-table');
      const error = tables[1].querySelector('.error');
      expect(error).not.toBeNull();
      expect(error.getAttribute('role')).toBe('alert');
    });
  });

  describe('EP-17 Lot 3 — formulaire Bien via lt-form-field', () => {
    it('rend les 4 champs (Adresse, Type, Patrimoine, Statut) via lt-form-field avec label associé', () => {
      fixture.detectChanges();

      const adresse = fixture.nativeElement.querySelector('#bien-adresse').closest('lt-form-field') as HTMLElement;
      expect(adresse.querySelector('label')?.textContent?.trim()).toBe('Adresse');
      expect(adresse.querySelector('label')?.getAttribute('for')).toBe('bien-adresse');

      const type = fixture.nativeElement.querySelector('#bien-type').closest('lt-form-field') as HTMLElement;
      expect(type.querySelector('label')?.textContent?.trim()).toBe('Type');

      const patrimoine = fixture.nativeElement.querySelector('#bien-patrimoine').closest('lt-form-field') as HTMLElement;
      expect(patrimoine.querySelector('label')?.textContent?.trim()).toBe('Patrimoine');

      const statut = fixture.nativeElement.querySelector('#bien-statut').closest('lt-form-field') as HTMLElement;
      expect(statut.querySelector('label')?.textContent?.trim()).toBe('Statut');
    });
  });

  it('régression Hotfix 2026-06-24 : le formulaire bien envoie un patrimoineId', () => {
    const cmp = fixture.componentInstance;
    expect(cmp.bienForm.invalid).toBe(true); // patrimoineId vide par défaut → requis

    cmp.bienForm.setValue({
      adresse: '12 rue des Lilas',
      type: 'APPARTEMENT',
      statut: 'LIBRE',
      patrimoineId: 'patrimoine-1',
    });
    expect(cmp.bienForm.valid).toBe(true);

    cmp.enregistrerBien();

    const req = http.expectOne('/api/biens');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.patrimoineId).toBe('patrimoine-1');
    req.flush({
      id: 'bien-1',
      adresse: '12 rue des Lilas',
      type: 'APPARTEMENT',
      statut: 'LIBRE',
      patrimoineId: 'patrimoine-1',
    });

    http.expectOne('/api/biens').flush([]); // rechargement de la liste après création
  });

  it('ne crée pas de locataire si le formulaire rapide est invalide', () => {
    const cmp = fixture.componentInstance;
    expect(cmp.locataireRapideForm.invalid).toBe(true); // nom vide par défaut → requis

    cmp.creerLocataireRapide();

    http.expectNone('/api/locataires');
  });

  it('crée un locataire rapide et pré-remplit le bail avec le nouveau locataire', () => {
    const cmp = fixture.componentInstance;
    cmp.locataireRapideOuvert.set(true);
    cmp.locataireRapideForm.setValue({ nom: 'Dupont', email: '' });

    cmp.creerLocataireRapide();

    const req = http.expectOne('/api/locataires');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ nom: 'Dupont', email: null });
    req.flush({ id: 'locataire-2', nom: 'Dupont', prenom: null, email: null, statut: 'ACTIVE' });

    expect(cmp.locataires().map((l) => l.id)).toContain('locataire-2');
    expect(cmp.bailForm.controls.locataireId.value).toBe('locataire-2');
    expect(cmp.locataireRapideForm.value).toEqual({ nom: '', email: '' });
    expect(cmp.locataireRapideOuvert()).toBe(false);
    expect(cmp.message()).toBe('Locataire créé');
  });

  it('signale une erreur si la création du locataire rapide échoue', () => {
    const cmp = fixture.componentInstance;
    cmp.locataireRapideForm.setValue({ nom: 'Dupont', email: '' });

    cmp.creerLocataireRapide();

    http.expectOne('/api/locataires').flush('conflit', { status: 409, statusText: 'Conflict' });

    expect(cmp.message()).toContain('409');
  });

  it('pré-remplit patrimoine et type à la sélection d’un bien existant', () => {
    const cmp = fixture.componentInstance;
    cmp.selectionnerBien({
      id: 'bien-1',
      adresse: '12 rue des Lilas',
      type: 'APPARTEMENT',
      statut: 'LIBRE',
      patrimoineId: 'patrimoine-1',
    });

    http.expectOne('/api/biens/bien-1/baux').flush([]);
    http.expectOne('/api/biens/bien-1/affectations').flush([]);

    expect(cmp.bienForm.getRawValue().patrimoineId).toBe('patrimoine-1');
    expect(cmp.bienForm.valid).toBe(true);
  });

  it('expose le référentiel des types de biens actifs pour le sélecteur', () => {
    const cmp = fixture.componentInstance;
    expect(cmp.typesBiensDisponibles().map((t) => t.code)).toEqual(['APPARTEMENT']);
    expect(cmp.patrimoinesDisponibles().map((p) => p.id)).toEqual(['patrimoine-1']);
  });

  it('annule l’archivage du bien quand la confirmation est refusée', () => {
    const cmp = fixture.componentInstance;
    cmp.bienSelectionne.set({
      id: 'bien-1',
      adresse: '12 rue des Lilas',
      type: 'APPARTEMENT',
      statut: 'LIBRE',
      patrimoineId: 'patrimoine-1',
    });
    confirmSpy.and.returnValue(false);

    cmp.archiverBien();

    expect(confirmSpy).toHaveBeenCalledWith('Archiver ce bien ?');
    http.expectNone('/api/biens/bien-1/archivage');
  });

  describe('EP-17 Lot 3 — création et archivage du patrimoine', () => {
    it('crée un patrimoine via le formulaire puis recharge les référentiels', () => {
      const cmp = fixture.componentInstance;
      cmp.preparerNouveauPatrimoine();
      cmp.patrimoineForm.setValue({
        nom: 'Patrimoine Sud', adresse: '12 rue des Lilas', ville: 'Paris', commune: null,
        quartier: null, provinceEtat: null, pays: 'France', description: null, referenceInterne: 'PAT-SUD',
      });
      cmp.enregistrerPatrimoine();
      const req = http.expectOne('/api/patrimoines');
      expect(req.request.method).toBe('POST');
      req.flush({ id: 'patrimoine-2', nom: 'Patrimoine Sud', adresse: '12 rue des Lilas', statut: 'ACTIF' });
      http.expectOne('/api/patrimoines').flush([]);
      http.expectOne('/api/types-biens').flush([]);
      http.expectOne('/api/locataires').flush([]);
    });

    it('archive le patrimoine sélectionné après confirmation', () => {
      const cmp = fixture.componentInstance;
      cmp.selectionnerPatrimoineModif('patrimoine-1');
      cmp.archiverPatrimoine();
      expect(confirmSpy).toHaveBeenCalledWith('Archiver ce patrimoine ?');
      const req = http.expectOne('/api/patrimoines/patrimoine-1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ id: 'patrimoine-1', nom: 'Patrimoine principal', statut: 'ARCHIVE' });
      http.expectOne('/api/patrimoines').flush([]);
      http.expectOne('/api/types-biens').flush([]);
      http.expectOne('/api/locataires').flush([]);
    });
  });

  describe('Sprint 5 B2 / Sprint 7 — modification patrimoine (nom + adresse + champs enrichis)', () => {
    it('selectionnerPatrimoineModif peuple le formulaire depuis le signal patrimoines', () => {
      const cmp = fixture.componentInstance;
      // patrimoines() est déjà chargé via beforeEach (patrimoine-1, adresse '1 rue Test')
      cmp.selectionnerPatrimoineModif('patrimoine-1');
      expect(cmp.patrimoineModifId()).toBe('patrimoine-1');
      expect(cmp.patrimoineForm.getRawValue().nom).toBe('Patrimoine principal');
    });

    it('modifierPatrimoine envoie PUT /api/patrimoines/{id} et recharge les référentiels', () => {
      const cmp = fixture.componentInstance;
      cmp.selectionnerPatrimoineModif('patrimoine-1');
      cmp.patrimoineForm.setValue({
        nom: 'Patrimoine Sud',
        adresse: '12 rue des Lilas, Paris',
        ville: 'Paris',
        commune: null,
        quartier: null,
        provinceEtat: null,
        pays: 'France',
        description: null,
        referenceInterne: 'PAT-SUD',
      });

      cmp.modifierPatrimoine();

      const req = http.expectOne('/api/patrimoines/patrimoine-1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({
        nom: 'Patrimoine Sud',
        adresse: '12 rue des Lilas, Paris',
        ville: 'Paris',
        commune: null,
        quartier: null,
        provinceEtat: null,
        pays: 'France',
        description: null,
        referenceInterne: 'PAT-SUD',
      });
      req.flush({ id: 'patrimoine-1', nom: 'Patrimoine Sud', adresse: '12 rue des Lilas, Paris', statut: 'ACTIF' });

      // chargerReferentielsBien recharge patrimoines + types-biens + locataires
      http.expectOne('/api/patrimoines').flush([{ id: 'patrimoine-1', nom: 'Patrimoine Sud', adresse: '12 rue des Lilas, Paris', statut: 'ACTIF' }]);
      http.expectOne('/api/types-biens').flush([{ code: 'APPARTEMENT', libelle: 'Appartement', actif: true }]);
      http.expectOne('/api/locataires').flush([]);
      http.expectOne('/api/patrimoines/patrimoine-1/affectations').flush([]);
    });
  });

  describe('EP-17 Lot 3 — formulaire Patrimoine via lt-form-field', () => {
    it('rend le sélecteur de patrimoine via lt-form-field avant toute sélection', () => {
      fixture.detectChanges();

      const select = fixture.nativeElement.querySelector('#patrimoine-select').closest('lt-form-field') as HTMLElement;
      expect(select.querySelector('label')?.textContent?.trim()).toBe('Patrimoine');
      expect(select.querySelector('label')?.getAttribute('for')).toBe('patrimoine-select');

      // Le formulaire détaillé (9 champs) reste masqué tant qu'aucun patrimoine n'est choisi.
      expect(fixture.nativeElement.querySelector('#patrimoine-nom')).toBeNull();
    });

    it('rend les 9 champs détaillés via lt-form-field une fois un patrimoine choisi', () => {
      const cmp = fixture.componentInstance;
      cmp.selectionnerPatrimoineModif('patrimoine-1');
      fixture.detectChanges();

      const nom = fixture.nativeElement.querySelector('#patrimoine-nom').closest('lt-form-field') as HTMLElement;
      expect(nom.querySelector('label')?.textContent?.trim()).toBe('Nom');
      expect(nom.querySelector('label')?.getAttribute('for')).toBe('patrimoine-nom');

      const adresse = fixture.nativeElement.querySelector('#patrimoine-adresse').closest('lt-form-field') as HTMLElement;
      expect(adresse.querySelector('label')?.textContent?.trim()).toBe('Adresse');

      const description = fixture.nativeElement.querySelector('#patrimoine-description').closest('lt-form-field') as HTMLElement;
      expect(description.querySelector('label')?.textContent?.trim()).toBe('Description');
      expect(description.querySelector('textarea')).not.toBeNull();
    });
  });

  describe('EP-17 Lot 3 — ordre mobile liste-avant-formulaire (CHECK-UX-01 Responsive)', () => {
    it('applique .mobile-list-first uniquement aux sections Biens et Patrimoines, pas aux 6 autres sections du dashboard', () => {
      fixture.detectChanges();

      const sections = fixture.nativeElement.querySelectorAll('section.mobile-list-first');
      expect(sections.length).toBe(2);
      expect(sections[0].querySelector('h2')?.textContent).toContain('Nouveau bien');
      expect(sections[1].querySelector('h2')?.textContent).toContain('Modifier un patrimoine');
    });

    it('applique un touch target minimal de 44px aux champs input/select (DSG-001 Responsive Rules)', () => {
      fixture.detectChanges();

      const adresse = fixture.nativeElement.querySelector('#bien-adresse') as HTMLElement;
      expect(getComputedStyle(adresse).minHeight).toBe('44px');
    });
  });

  describe('Sprint 4 — affectations patrimoine et exceptions', () => {
    const affectationPatrimoineActive = {
      id: 'aff-pat-1',
      patrimoineId: 'patrimoine-1',
      bienId: null,
      gestionnaireId: 'gest-uuid-1',
      typeHonoraires: 'POURCENTAGE' as const,
      montantHonoraires: 10,
      dateDebut: '2026-01-01',
      dateFin: null,
      statut: 'ACTIVE',
      dateRevocation: null,
      typeException: null,
    };

    it('peuple le signal affectationsPatrimoine au démarrage', () => {
      expect(fixture.componentInstance.affectationsPatrimoine()['patrimoine-1']).toEqual([]);
    });

    it('section exception masquée si aucune affectation patrimoine active', () => {
      expect(fixture.componentInstance.patrimoinesAvecAffectationActive()).toEqual([]);
    });

    it('crée une affectation patrimoine et recharge', () => {
      const cmp = fixture.componentInstance;
      cmp.affectationPatrimoineForm.setValue({
        patrimoineId: 'patrimoine-1',
        gestionnaireId: 'gest-uuid-1',
        typeHonoraires: 'POURCENTAGE',
        montantHonoraires: 10,
        dateDebut: '2026-01-01',
        dateFin: '',
      });

      cmp.creerAffectationPatrimoine();

      const req = http.expectOne('/api/affectations');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.patrimoineId).toBe('patrimoine-1');
      expect(req.request.body.bienId).toBeUndefined();
      req.flush(affectationPatrimoineActive);

      http.expectOne('/api/patrimoines/patrimoine-1/affectations').flush([]);
    });

    it("selectionnerPatrimoineException pré-remplit gestionnaireId depuis l'affectation active", () => {
      const cmp = fixture.componentInstance;
      cmp.affectationsPatrimoine.set({ 'patrimoine-1': [affectationPatrimoineActive] });

      cmp.selectionnerPatrimoineException('patrimoine-1');

      expect(cmp.patrimoineExceptionId()).toBe('patrimoine-1');
      expect(cmp.exceptionForm.value.gestionnaireId).toBe('gest-uuid-1');
      expect(cmp.patrimoinesAvecAffectationActive().map((p) => p.id)).toEqual(['patrimoine-1']);
    });

    it('crée une exception EXCLUSION sur un bien et recharge les exceptions', () => {
      const cmp = fixture.componentInstance;
      cmp.affectationsPatrimoine.set({ 'patrimoine-1': [affectationPatrimoineActive] });

      cmp.selectionnerPatrimoineException('patrimoine-1');
      cmp.selectionnerBienException('bien-1');
      http.expectOne('/api/biens/bien-1/affectations').flush([]);

      cmp.exceptionForm.patchValue({ montantHonoraires: 5, dateDebut: '2026-02-01', typeException: 'EXCLUSION' });

      cmp.creerException();

      const req = http.expectOne('/api/affectations');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.bienId).toBe('bien-1');
      expect(req.request.body.typeException).toBe('EXCLUSION');
      expect(req.request.body.patrimoineId).toBeUndefined();
      req.flush({
        id: 'exc-1',
        bienId: 'bien-1',
        patrimoineId: null,
        gestionnaireId: 'gest-uuid-1',
        typeHonoraires: 'POURCENTAGE',
        montantHonoraires: 5,
        dateDebut: '2026-02-01',
        dateFin: null,
        statut: 'ACTIVE',
        dateRevocation: null,
        typeException: 'EXCLUSION',
      });

      http.expectOne('/api/biens/bien-1/affectations').flush([]);
    });

    it('révoque une affectation patrimoine et recharge les affectations', () => {
      const cmp = fixture.componentInstance;
      cmp.revoquerAffectationPatrimoine('aff-pat-1');

      const req = http.expectOne('/api/affectations/aff-pat-1/revocation');
      expect(req.request.method).toBe('POST');
      req.flush({ ...affectationPatrimoineActive, statut: 'REVOQUEE', dateRevocation: '2026-06-27' });

      http.expectOne('/api/patrimoines/patrimoine-1/affectations').flush([]);
    });
    it('annule une révocation patrimoine refusée par l’utilisateur', () => {
      confirmSpy.and.returnValue(false);

      fixture.componentInstance.revoquerAffectationPatrimoine('aff-pat-1');

      expect(confirmSpy).toHaveBeenCalled();
      http.expectNone('/api/affectations/aff-pat-1/revocation');
    });

  });
});
