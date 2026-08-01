import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldComponent } from './form-field.component';

@Component({
  standalone: true,
  imports: [FormFieldComponent],
  template: `
    <lt-form-field inputId="tel" label="Téléphone" [help]="help" [error]="error">
      <input id="tel" type="text" />
    </lt-form-field>
  `,
})
class HostComponent {
  help: string | null = null;
  error: string | null = null;
}

describe('FormFieldComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
  });

  it('associe le label au contrôle projeté via for/id', () => {
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');
    expect(label.getAttribute('for')).toBe('tel');
    expect(label.textContent).toBe('Téléphone');
  });

  it('affiche l’aide quand aucune erreur n’est présente', () => {
    fixture.componentInstance.help = 'Format international, ex. +33612345678';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.help').textContent).toBe(
      'Format international, ex. +33612345678',
    );
    expect(fixture.nativeElement.querySelector('.error')).toBeNull();
  });

  it("l'erreur remplace l'aide quand les deux sont présentes, avec role=\"alert\"", () => {
    fixture.componentInstance.help = 'Format international';
    fixture.componentInstance.error = 'Numéro invalide';
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.error');
    expect(error.textContent).toBe('Numéro invalide');
    expect(error.getAttribute('role')).toBe('alert');
    expect(fixture.nativeElement.querySelector('.help')).toBeNull();
  });

  it('describedBy() vaut null sans aide ni erreur', () => {
    fixture.detectChanges();

    const field: FormFieldComponent = fixture.debugElement.children[0].componentInstance;
    expect(field.describedBy()).toBeNull();
  });

  it('describedBy() pointe vers l’id de l’aide quand elle seule est présente', () => {
    fixture.componentInstance.help = 'Aide';
    fixture.detectChanges();

    const field: FormFieldComponent = fixture.debugElement.children[0].componentInstance;
    expect(field.describedBy()).toBe('tel-help');
  });

  it('describedBy() pointe vers l’id de l’erreur quand aide et erreur sont présentes', () => {
    fixture.componentInstance.help = 'Aide';
    fixture.componentInstance.error = 'Erreur';
    fixture.detectChanges();

    const field: FormFieldComponent = fixture.debugElement.children[0].componentInstance;
    expect(field.describedBy()).toBe('tel-error');
  });
});
