import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

import { Gestionnaire, GestionnaireApiService } from '../core/gestionnaire/gestionnaire-api.service';
import { GestionnaireDetailComponent } from './gestionnaire-detail.component';

const ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

const gestionnaire: Gestionnaire = {
  id: ID,
  email: 'jean@example.com',
  nom: 'Dupont',
  prenom: 'Jean',
  statut: 'ACTIF',
  telephone: '+33123456789',
  photoPresente: false,
  observations: 'Gestionnaire principal',
  dateCreation: '2026-01-01T00:00:00Z',
  dateSuspension: null,
  dateArchivage: null,
};

/** Flush le GET gestionnaire + le GET historique (appelé automatiquement par le composant). */
function flushGestionnaire(http: HttpTestingController, g: Gestionnaire = gestionnaire): void {
  http.expectOne(`/api/gestionnaires/${ID}`).flush(g);
  http.expectOne(`/api/gestionnaires/${ID}/historique`).flush({ gestionnaire: g, affectations: [], audit: [] });
}

describe('GestionnaireDetailComponent', () => {
  let fixture: ComponentFixture<GestionnaireDetailComponent>;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GestionnaireDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => ID } } },
        },
        ConfirmationService,
      ],
    });
    fixture = TestBed.createComponent(GestionnaireDetailComponent);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('charge le gestionnaire au init', () => {
    fixture.detectChanges();
    flushGestionnaire(http);
    fixture.detectChanges();

    const el = fixture.debugElement;
    expect(el.query(By.css('h1')).nativeElement.textContent).toContain('Dupont');
    expect(el.nativeElement.textContent).toContain('jean@example.com');
    expect(el.nativeElement.textContent).toContain('ACTIF');
  });

  it('affiche le bouton Suspendre si ACTIF', () => {
    fixture.detectChanges();
    flushGestionnaire(http);
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button[data-action="suspendre"]'));
    expect(btn).toBeTruthy();
  });

  it('n affiche pas Suspendre si SUSPENDU', () => {
    const suspendu = { ...gestionnaire, statut: 'SUSPENDU' as const };
    fixture.detectChanges();
    flushGestionnaire(http, suspendu);
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button[data-action="suspendre"]'));
    expect(btn).toBeNull();
  });

  it('affiche le bouton Réactiver si SUSPENDU', () => {
    const suspendu = { ...gestionnaire, statut: 'SUSPENDU' as const };
    fixture.detectChanges();
    flushGestionnaire(http, suspendu);
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button[data-action="reactiver"]'));
    expect(btn).toBeTruthy();
  });

  it('affiche le bouton Archiver si ACTIF', () => {
    fixture.detectChanges();
    flushGestionnaire(http);
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button[data-action="archiver"]'));
    expect(btn).toBeTruthy();
  });

  it('affiche le bouton Restaurer si ARCHIVE', () => {
    const archive = { ...gestionnaire, statut: 'ARCHIVE' as const };
    fixture.detectChanges();
    flushGestionnaire(http, archive);
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button[data-action="restaurer"]'));
    expect(btn).toBeTruthy();
  });

  it('charge l historique', () => {
    fixture.detectChanges();
    flushGestionnaire(http);
    fixture.detectChanges();

    const section = fixture.debugElement.query(By.css('.historique'));
    expect(section).toBeTruthy();
  });

  it('affiche une erreur si chargement échoue', () => {
    fixture.detectChanges();
    http.expectOne(`/api/gestionnaires/${ID}`).flush(null, { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    const msg = fixture.debugElement.query(By.css('.toolbar span'));
    expect(msg.nativeElement.textContent).toContain('erreur');
  });
});
