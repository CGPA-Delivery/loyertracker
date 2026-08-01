import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableComponent, LtDataTableColumn } from './data-table.component';

describe('DataTableComponent', () => {
  let fixture: ComponentFixture<DataTableComponent>;
  const columns: LtDataTableColumn[] = [
    { field: 'periode', header: 'Période' },
    { field: 'montant', header: 'Montant' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DataTableComponent] });
    fixture = TestBed.createComponent(DataTableComponent);
    fixture.componentRef.setInput('columns', columns);
  });

  it('affiche les en-têtes de colonnes fournies', () => {
    fixture.componentRef.setInput('rows', []);
    fixture.detectChanges();

    const headers: string[] = Array.from(fixture.nativeElement.querySelectorAll('th')).map(
      (th) => (th as HTMLElement).textContent?.trim(),
    );
    expect(headers).toEqual(['Période', 'Montant']);
  });

  it('affiche une ligne par élément de données, dans les colonnes déclarées', () => {
    fixture.componentRef.setInput('rows', [{ periode: '2026-08', montant: '850,00 €' }]);
    fixture.detectChanges();

    const cells: string[] = Array.from(fixture.nativeElement.querySelectorAll('tbody td')).map(
      (td) => (td as HTMLElement).textContent?.trim(),
    );
    expect(cells).toEqual(['2026-08', '850,00 €']);
  });

  it('affiche lt-empty-state quand la liste est vide (hors chargement)', () => {
    fixture.componentRef.setInput('rows', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('lt-empty-state')).not.toBeNull();
  });

  it('affiche le message d’erreur à la place de la table quand `error` est fourni', () => {
    fixture.componentRef.setInput('rows', []);
    fixture.componentRef.setInput('error', 'Erreur de chargement (500)');
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.error');
    expect(error.textContent).toBe('Erreur de chargement (500)');
    expect(error.getAttribute('role')).toBe('alert');
    expect(fixture.nativeElement.querySelector('p-table')).toBeNull();
  });
});
