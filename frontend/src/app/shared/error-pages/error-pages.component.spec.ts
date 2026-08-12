import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ForbiddenComponent, NotFoundComponent } from './error-pages.component';

describe('Error pages', () => {
  async function create<T>(component: new () => T): Promise<ComponentFixture<T>> {
    await TestBed.configureTestingModule({
      imports: [component],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(component);
    fixture.detectChanges();
    return fixture;
  }

  it('affiche la page accès refusé avec retour', async () => {
    const fixture = await create(ForbiddenComponent);
    expect(fixture.nativeElement.textContent).toContain('Accès refusé');
    expect(fixture.nativeElement.querySelector('a[href="/"]')).not.toBeNull();
  });

  it('affiche la page introuvable avec retour', async () => {
    const fixture = await create(NotFoundComponent);
    expect(fixture.nativeElement.textContent).toContain('Page introuvable');
    expect(fixture.nativeElement.querySelector('a[href="/"]')).not.toBeNull();
  });
});
