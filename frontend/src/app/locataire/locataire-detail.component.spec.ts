import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

import { LocataireDetail, LocataireHistorique } from '../core/s02/s02-api.service';
import { LocataireDetailComponent } from './locataire-detail.component';

const ID = 'loc-1';

const detail: LocataireDetail = {
  id: ID, nom: 'Dupont', prenom: 'Jean', telephone: '+33123456789', email: 'jean@example.com',
  profession: 'Ingénieur', dateNaissance: '1990-01-01', typePieceIdentite: 'CNI', numeroPieceIdentite: 'CNI-123',
  photoPresente: false, contactUrgence: '+33987654321', observations: 'Locataire fiable',
  statut: 'ACTIVE', dateCreation: '2026-01-01T00:00:00Z', dateArchivage: null,
};

const historique: LocataireHistorique = { locataire: detail, audit: [] };

function flushLocataire(http: HttpTestingController): void {
  http.expectOne(`/api/locataires/${ID}`).flush(detail);
  http.expectOne(`/api/locataires/${ID}/historique`).flush(historique);
}

describe('LocataireDetailComponent', () => {
  let fixture: ComponentFixture<LocataireDetailComponent>;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LocataireDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => ID } } } },
        ConfirmationService,
      ],
    });
    fixture = TestBed.createComponent(LocataireDetailComponent);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('charge le locataire au init', () => {
    fixture.detectChanges();
    flushLocataire(http);
    fixture.detectChanges();

    const el = fixture.debugElement;
    expect(el.query(By.css('h1')).nativeElement.textContent).toContain('Dupont');
    expect(el.nativeElement.textContent).toContain('jean@example.com');
    expect(el.nativeElement.textContent).toContain('ACTIVE');
  });

  it('affiche le bouton Archiver si ACTIVE', () => {
    fixture.detectChanges();
    flushLocataire(http);
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button[data-action="archiver"]'));
    expect(btn).toBeTruthy();
  });

  it('affiche le bouton Restaurer si ARCHIVE', () => {
    const archive = { ...detail, statut: 'ARCHIVE' };
    fixture.detectChanges();
    http.expectOne(`/api/locataires/${ID}`).flush(archive);
    http.expectOne(`/api/locataires/${ID}/historique`).flush({ locataire: archive, audit: [] });
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button[data-action="restaurer"]'));
    expect(btn).toBeTruthy();
  });

  it('affiche l historique', () => {
    fixture.detectChanges();
    flushLocataire(http);
    fixture.detectChanges();

    const section = fixture.debugElement.query(By.css('.historique'));
    expect(section).toBeTruthy();
  });

  it('affiche une erreur si chargement échoue', () => {
    fixture.detectChanges();
    http.expectOne(`/api/locataires/${ID}`).flush(null, { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    const msg = fixture.debugElement.query(By.css('.toolbar span'));
    expect(msg.nativeElement.textContent).toContain('erreur');
  });
});
