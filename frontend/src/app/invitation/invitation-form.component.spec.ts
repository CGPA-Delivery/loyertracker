import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InvitationFormComponent } from './invitation-form.component';

describe('InvitationFormComponent', () => {
  let fixture: ComponentFixture<InvitationFormComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(InvitationFormComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('affiche le formulaire avec champ email et bouton', () => {
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input[type="email"]'));
    const button = fixture.debugElement.query(By.css('button[type="button"]'));

    expect(input).toBeTruthy();
    expect(button).toBeTruthy();
    expect(button.nativeElement.textContent).toContain('Inviter');
  });

  it('désactive le bouton quand le champ est vide', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button[type="button"]'));
    expect(button.nativeElement.disabled).toBeTrue();
  });

  it('active le bouton quand un email valide est saisi', () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input[type="email"]'));
    input.nativeElement.value = 'gestionnaire@test.local';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="button"]'));
    expect(button.nativeElement.disabled).toBeFalse();
  });

  it('envoie la requête et affiche le succès', () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input[type="email"]'));
    input.nativeElement.value = 'gestionnaire@test.local';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="button"]'));
    button.nativeElement.click();
    fixture.detectChanges();

    const req = httpMock.expectOne('/api/invitations');
    expect(req.request.body).toEqual({ email: 'gestionnaire@test.local' });
    req.flush({
      id: 'inv-1',
      email: 'gestionnaire@test.local',
      token: 'abc123',
      lien: 'https://app.local/invitations/abc123',
      statut: 'PENDING',
      dateExpiration: '2026-08-17T00:00:00Z',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Invitation envoyée');
    expect(fixture.nativeElement.textContent).toContain('gestionnaire@test.local');
  });

  it('affiche une erreur en cas d\'échec', () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input[type="email"]'));
    input.nativeElement.value = 'deja-invite@test.local';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="button"]'));
    button.nativeElement.click();
    fixture.detectChanges();

    httpMock.expectOne('/api/invitations').flush(
      { message: 'Ce gestionnaire a déjà une invitation en attente.' },
      { status: 409, statusText: 'Conflict' },
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('déjà une invitation');
  });

  it('émet un événement après succès', () => {
    let emis = false;
    fixture.componentInstance.invitationEnvoyee.subscribe(() => (emis = true));

    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input[type="email"]'));
    input.nativeElement.value = 'g@t.local';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button[type="button"]')).nativeElement.click();
    fixture.detectChanges();

    httpMock.expectOne('/api/invitations').flush({
      id: 'inv-2',
      email: 'g@t.local',
      token: 'xyz',
      lien: 'https://app.local/invitations/xyz',
      statut: 'PENDING',
      dateExpiration: '2026-08-17T00:00:00Z',
    });
    fixture.detectChanges();

    expect(emis).toBeTrue();
  });
});
