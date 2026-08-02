import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PageHeaderComponent] });
    fixture = TestBed.createComponent(PageHeaderComponent);
  });

  it('affiche le titre requis', () => {
    fixture.componentRef.setInput('title', 'Patrimoines');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Patrimoines');
  });

  it("n'affiche pas de sous-titre par défaut", () => {
    fixture.componentRef.setInput('title', 'Patrimoines');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.subtitle')).toBeNull();
  });

  it('affiche le sous-titre quand il est fourni', () => {
    fixture.componentRef.setInput('title', 'Patrimoines');
    fixture.componentRef.setInput('subtitle', '3 biens gérés');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.subtitle').textContent).toBe('3 biens gérés');
  });
});
