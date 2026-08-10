import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { Locataire } from '../core/s02/s02-api.service';
import { LocataireListeComponent } from './locataire-liste.component';

const locataires: Locataire[] = [
  { id: 'l1', nom: 'Dupont', prenom: 'Jean', email: 'jean@test.local', statut: 'ACTIF' },
  { id: 'l2', nom: 'Martin', prenom: null, email: null, statut: 'ARCHIVE' },
];

describe('LocataireListeComponent', () => {
  let fixture: ComponentFixture<LocataireListeComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocataireListeComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LocataireListeComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('affiche la liste des locataires après chargement', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('/api/locataires');
    req.flush(locataires);
    fixture.detectChanges();

    const lignes = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(lignes.length).toBe(2);
    expect(lignes[0].nativeElement.textContent).toContain('Dupont');
    expect(lignes[1].nativeElement.textContent).toContain('Martin');
  });

  it('affiche un message quand la liste est vide', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/locataires').flush([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Aucun locataire');
  });

  it('filtre par terme de recherche', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/locataires').flush(locataires);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input[type="search"]'));
    input.nativeElement.value = 'dupont';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const lignes = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(lignes.length).toBe(1);
    expect(lignes[0].nativeElement.textContent).toContain('Dupont');
  });

  it('affiche un message quand aucun résultat de recherche', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/locataires').flush(locataires);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input[type="search"]'));
    input.nativeElement.value = 'inexistant';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Aucun résultat');
  });

  it('affiche le statut via lt-status-tag', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/locataires').flush(locataires);
    fixture.detectChanges();

    const tags = fixture.debugElement.queryAll(By.css('lt-status-tag'));
    expect(tags.length).toBe(2);
  });
});
