import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { InvitationAcceptationComponent } from './invitation-acceptation.component';

describe('InvitationAcceptationComponent', () => {
  let fixture: ComponentFixture<InvitationAcceptationComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationAcceptationComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(InvitationAcceptationComponent);
    fixture.componentRef.setInput('token', 'token-test');
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('affiche un formulaire accessible avec les champs requis', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('input[autocomplete="family-name"]'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('input[autocomplete="given-name"]'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('input[autocomplete="new-password"]'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('button[type="button"]'))).toBeTruthy();
  });

  it('ne fait aucun appel tant que le formulaire est invalide', () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('button[type="button"]')).nativeElement.click();

    http.expectNone('/api/invitations/token-test/acceptation');
  });

  it('soumet l’acceptation puis affiche la confirmation', () => {
    fixture.detectChanges();
    fixture.componentInstance.nom.setValue('Dupont');
    fixture.componentInstance.prenom.setValue('Jeanne');
    fixture.componentInstance.motDePasse.setValue('MotDePasseSecurise12!');
    fixture.componentInstance.confirmation.setValue('MotDePasseSecurise12!');
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button[type="button"]')).nativeElement.click();
    const request = http.expectOne('/api/invitations/token-test/acceptation');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      nom: 'Dupont',
      prenom: 'Jeanne',
      motDePasse: 'MotDePasseSecurise12!',
    });
    request.flush({ gestionnaireId: 'g-1', email: 'jeanne@example.test', compteCree: true });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Invitation acceptée');
    expect(fixture.nativeElement.textContent).toContain('jeanne@example.test');
  });

  it('signale les mots de passe non identiques sans appel HTTP', () => {
    fixture.detectChanges();
    fixture.componentInstance.nom.setValue('Dupont');
    fixture.componentInstance.prenom.setValue('Jeanne');
    fixture.componentInstance.motDePasse.setValue('MotDePasseSecurise12!');
    fixture.componentInstance.confirmation.setValue('AutreMotDePasseSecurise12!');
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button[type="button"]')).nativeElement.click();
    fixture.detectChanges();

    http.expectNone('/api/invitations/token-test/acceptation');
    expect(fixture.nativeElement.textContent).toContain('identiques');
  });

  it('affiche une erreur actionnable pour un token invalide', () => {
    fixture.detectChanges();
    fixture.componentInstance.nom.setValue('Dupont');
    fixture.componentInstance.prenom.setValue('Jeanne');
    fixture.componentInstance.motDePasse.setValue('MotDePasseSecurise12!');
    fixture.componentInstance.confirmation.setValue('MotDePasseSecurise12!');
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button[type="button"]')).nativeElement.click();
    http.expectOne('/api/invitations/token-test/acceptation').flush(
      { message: 'Introuvable' },
      { status: 404, statusText: 'Not Found' },
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('invalide ou a expiré');
  });
});
