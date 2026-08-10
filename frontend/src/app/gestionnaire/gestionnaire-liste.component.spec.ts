import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { Gestionnaire, GestionnaireApiService } from '../core/gestionnaire/gestionnaire-api.service';
import { GestionnaireListeComponent } from './gestionnaire-liste.component';

const gestionnaires: Gestionnaire[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    email: 'jean@example.com',
    nom: 'Dupont',
    prenom: 'Jean',
    statut: 'ACTIF',
    telephone: '+33123456789',
    photoPresente: false,
    observations: null,
    dateCreation: '2026-01-01T00:00:00Z',
    dateSuspension: null,
    dateArchivage: null,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    email: 'marie@example.com',
    nom: 'Martin',
    prenom: 'Marie',
    statut: 'SUSPENDU',
    telephone: null,
    photoPresente: true,
    observations: 'En attente',
    dateCreation: '2026-02-01T00:00:00Z',
    dateSuspension: '2026-03-01T00:00:00Z',
    dateArchivage: null,
  },
];

describe('GestionnaireListeComponent', () => {
  let fixture: ComponentFixture<GestionnaireListeComponent>;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GestionnaireListeComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    fixture = TestBed.createComponent(GestionnaireListeComponent);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('charge la liste au init', () => {
    fixture.detectChanges();
    const req = http.expectOne('/api/gestionnaires');
    expect(req.request.method).toBe('GET');
    req.flush(gestionnaires);
    fixture.detectChanges();

    const lignes = fixture.debugElement.queryAll(By.css('.row'));
    expect(lignes.length).toBe(2);
    expect(lignes[0].nativeElement.textContent).toContain('Dupont');
    expect(lignes[0].nativeElement.textContent).toContain('jean@example.com');
    expect(lignes[1].nativeElement.textContent).toContain('Martin');
  });

  it('affiche les badges de statut', () => {
    fixture.detectChanges();
    http.expectOne('/api/gestionnaires').flush(gestionnaires);
    fixture.detectChanges();

    const badges = fixture.debugElement.queryAll(By.css('.badge'));
    expect(badges[0].nativeElement.textContent.trim()).toBe('ACTIF');
    expect(badges[1].nativeElement.textContent.trim()).toBe('SUSPENDU');
  });

  it('recherche avec un terme', () => {
    fixture.detectChanges();
    http.expectOne('/api/gestionnaires').flush(gestionnaires);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.value = 'dupont';
    input.dispatchEvent(new Event('input'));

    const btn = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();

    const req = http.expectOne('/api/gestionnaires?q=dupont');
    expect(req.request.method).toBe('GET');
    req.flush([gestionnaires[0]]);
    fixture.detectChanges();

    const lignes = fixture.debugElement.queryAll(By.css('.row'));
    expect(lignes.length).toBe(1);
  });

  it('affiche un message si liste vide', () => {
    fixture.detectChanges();
    http.expectOne('/api/gestionnaires').flush([]);
    fixture.detectChanges();

    const vide = fixture.debugElement.query(By.css('.muted'));
    expect(vide.nativeElement.textContent).toContain('Aucun gestionnaire');
  });

  it('affiche une erreur en cas d échec', () => {
    fixture.detectChanges();
    http.expectOne('/api/gestionnaires').flush(null, { status: 500, statusText: 'Erreur' });
    fixture.detectChanges();

    const msg = fixture.debugElement.query(By.css('.toolbar span'));
    expect(msg.nativeElement.textContent).toContain('erreur');
  });
});
