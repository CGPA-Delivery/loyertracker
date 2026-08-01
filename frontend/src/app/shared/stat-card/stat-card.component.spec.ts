import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatCardComponent } from './stat-card.component';

describe('StatCardComponent', () => {
  let fixture: ComponentFixture<StatCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [StatCardComponent] });
    fixture = TestBed.createComponent(StatCardComponent);
    fixture.componentRef.setInput('label', 'Loyers en retard');
    fixture.componentRef.setInput('value', '3');
  });

  it('affiche le libellé et la valeur', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.label').textContent).toBe('Loyers en retard');
    expect(fixture.nativeElement.querySelector('.value').textContent).toBe('3');
  });

  it("n'affiche aucune tendance par défaut", () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.trend')).toBeNull();
  });

  it('affiche la tendance quand elle est fournie, avec son attribut data-trend', () => {
    fixture.componentRef.setInput('trend', 'up');
    fixture.componentRef.setInput('trendLabel', '+2 vs mois dernier');
    fixture.detectChanges();

    const trend = fixture.nativeElement.querySelector('.trend');
    expect(trend.textContent).toBe('+2 vs mois dernier');
    expect(trend.getAttribute('data-trend')).toBe('up');
  });
});
