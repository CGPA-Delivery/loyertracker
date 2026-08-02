import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusTagComponent, severityForStatut } from './status-tag.component';

describe('StatusTagComponent', () => {
  let fixture: ComponentFixture<StatusTagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [StatusTagComponent] });
    fixture = TestBed.createComponent(StatusTagComponent);
  });

  it('affiche la valeur fournie via p-tag', () => {
    fixture.componentRef.setInput('value', 'EN_RETARD');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p-tag')).not.toBeNull();
    expect(fixture.nativeElement.textContent.trim()).toBe('EN_RETARD');
  });

  it('vaut "info" par défaut si aucune sévérité fournie', () => {
    fixture.componentRef.setInput('value', 'IMPAYE');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.p-tag-info')).not.toBeNull();
  });

  it('traduit "warning" en "warn" pour p-tag (nom PrimeNG)', () => {
    fixture.componentRef.setInput('value', 'PREAVIS');
    fixture.componentRef.setInput('severity', 'warning');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.p-tag-warn')).not.toBeNull();
  });
});

describe('severityForStatut', () => {
  it('mappe le vocabulaire paiements/alertes déjà vérifié dans le code', () => {
    expect(severityForStatut('EN_RETARD')).toBe('danger');
    expect(severityForStatut('LOYER_EN_RETARD')).toBe('danger');
    expect(severityForStatut('RECU')).toBe('success');
    expect(severityForStatut('PAYE')).toBe('success');
    expect(severityForStatut('A_VENIR')).toBe('warning');
    expect(severityForStatut('PREAVIS')).toBe('warning');
  });

  it('retombe sur "info" pour tout statut non reconnu', () => {
    expect(severityForStatut('IMPAYE')).toBe('info');
    expect(severityForStatut('PARTIEL')).toBe('info');
    expect(severityForStatut('STATUT_INCONNU')).toBe('info');
  });

  it('mappe le vocabulaire StatutBien (EP-17 Lot 3, dashboard Bailleur)', () => {
    expect(severityForStatut('LIBRE')).toBe('success');
    expect(severityForStatut('LOUE')).toBe('info');
    expect(severityForStatut('EN_TRAVAUX')).toBe('warning');
    expect(severityForStatut('ARCHIVE')).toBe('secondary');
  });
});
