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

  it('rend une colonne `type: "status"` via lt-status-tag, sévérité déduite de severityForStatut', () => {
    fixture.componentRef.setInput('columns', [
      { field: 'adresse', header: 'Adresse' },
      { field: 'statut', header: 'Statut', type: 'status' },
    ]);
    fixture.componentRef.setInput('rows', [{ adresse: '12 rue des Lilas', statut: 'LIBRE' }]);
    fixture.detectChanges();

    const tag = fixture.nativeElement.querySelector('lt-status-tag');
    expect(tag).not.toBeNull();
    expect(tag.textContent.trim()).toBe('LIBRE');
    expect(tag.querySelector('.p-tag-success')).not.toBeNull();
  });

  it('ne réagit pas au clic quand `selectable` est faux (par défaut)', () => {
    const row = { periode: '2026-08', montant: '850,00 €' };
    fixture.componentRef.setInput('rows', [row]);
    fixture.detectChanges();
    const emitted = jasmine.createSpy('rowClick');
    fixture.componentInstance.rowClick.subscribe(emitted);

    (fixture.nativeElement.querySelector('tbody tr') as HTMLElement).click();

    expect(emitted).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('tbody tr').getAttribute('role')).toBeNull();
  });

  it('émet `rowClick` au clic sur une ligne quand `selectable` est vrai, et marque la ligne sélectionnée', () => {
    const row = { periode: '2026-08', montant: '850,00 €' };
    fixture.componentRef.setInput('rows', [row]);
    fixture.componentRef.setInput('selectable', true);
    fixture.componentRef.setInput('selectedRow', row);
    fixture.detectChanges();
    const emitted = jasmine.createSpy('rowClick');
    fixture.componentInstance.rowClick.subscribe(emitted);

    const tr = fixture.nativeElement.querySelector('tbody tr') as HTMLElement;
    const selectButton = tr.querySelector('.row-select') as HTMLButtonElement;
    expect(tr.getAttribute('role')).toBeNull();
    expect(selectButton).not.toBeNull();
    expect(selectButton.getAttribute('aria-label')).toBe('Sélectionner la ligne : 2026-08');
    expect(tr.classList).toContain('selected');

    tr.click();

    expect(emitted).toHaveBeenCalledWith(row);
  });

  it('émet `rowClick` via le bouton natif de sélection', () => {
    const row = { periode: '2026-08', montant: '850,00 €' };
    fixture.componentRef.setInput('rows', [row]);
    fixture.componentRef.setInput('selectable', true);
    fixture.detectChanges();
    const emitted = jasmine.createSpy('rowClick');
    fixture.componentInstance.rowClick.subscribe(emitted);

    const selectButton = fixture.nativeElement.querySelector('tbody .row-select') as HTMLButtonElement;
    selectButton.click();

    expect(emitted).toHaveBeenCalledWith(row);
  });
});
