import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [EmptyStateComponent] });
    fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('message', 'Aucun bien enregistré');
    fixture.detectChanges();
  });

  it('affiche le message fourni', () => {
    expect(fixture.nativeElement.querySelector('.message').textContent).toBe('Aucun bien enregistré');
  });

  it('porte role="status" pour une annonce lecteur d’écran non intrusive', () => {
    const root = fixture.nativeElement.querySelector('.lt-empty-state');
    expect(root.getAttribute('role')).toBe('status');
  });
});
