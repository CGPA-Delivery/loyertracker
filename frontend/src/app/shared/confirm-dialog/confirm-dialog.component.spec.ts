import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { LtConfirmDialogService } from './confirm-dialog.service';

/**
 * DDS-LT-005 — premier composant modal du produit, aucun précédent de focus-trap ni de
 * restitution du focus dans le code existant avant `lt-confirm-dialog`. Ces tests auditent
 * directement les exigences non négociables 1, 2, 3 et 4 de la décision, dans un navigateur réel
 * (Chrome Headless, pas une simulation DOM) — le focus et `document.activeElement` s'y comportent
 * comme dans un vrai navigateur.
 *
 * PrimeNG porte le dialogue hors de l'arbre du composant, directement dans `document.body`
 * (constaté par inspection directe du DOM rendu) : le sélecteur `.p-confirmdialog.p-dialog` cible
 * le panneau réellement affiché — `<p-dialog>` (l'élément hôte léger, toujours présent dans
 * `<lt-confirm-dialog>`) ne doit jamais être confondu avec lui, il ne reflète pas l'état
 * ouvert/fermé.
 */
@Component({
  standalone: true,
  imports: [ConfirmDialogComponent],
  template: `
    <button id="trigger" type="button" (click)="open()">Supprimer le document</button>
    <lt-confirm-dialog />
  `,
})
class HostComponent {
  private readonly confirmDialog = inject(LtConfirmDialogService);
  accepted = false;
  rejected = false;

  open(): void {
    this.confirmDialog.confirm({
      header: 'Supprimer le document',
      message: 'Cette action est irréversible.',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      accept: () => (this.accepted = true),
      reject: () => (this.rejected = true),
    });
  }
}

function dialoguePanneau(): HTMLElement | null {
  return document.querySelector('.p-confirmdialog.p-dialog');
}

/**
 * L'ouverture/fermeture est pilotée par un signal Angular re-rendu au fil des cycles de détection
 * de changements, pas par une manipulation DOM immédiate — `fixture.detectChanges()` doit donc
 * être rappelé à chaque itération de l'attente, pas seulement une fois à la fin. `fakeAsync`/
 * `tick()` seuls ne suffisent pas non plus : ils n'avancent que l'horloge virtuelle des timers JS,
 * jamais les animations/compositing du navigateur — on attend ici pour de vrai (durée de
 * l'animation fixée à 1ms dans `ConfirmDialogComponent`).
 */
async function attendreFermeture(fixture: ComponentFixture<HostComponent>): Promise<void> {
  const debut = Date.now();
  while (dialoguePanneau() && Date.now() - debut < 2000) {
    await new Promise((resolve) => setTimeout(resolve, 20));
    fixture.detectChanges();
  }
}

async function attendreOuverture(fixture: ComponentFixture<HostComponent>): Promise<void> {
  const debut = Date.now();
  while (!dialoguePanneau() && Date.now() - debut < 2000) {
    await new Promise((resolve) => setTimeout(resolve, 20));
    fixture.detectChanges();
  }
}

describe('ConfirmDialogComponent (DDS-LT-005)', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [ConfirmationService],
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function ouvrirEtCliquerDeclencheur(): HTMLButtonElement {
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('#trigger');
    trigger.focus();
    trigger.click();
    fixture.detectChanges();
    return trigger;
  }

  it('nomme le host alertdialog même lorsque le dialogue est fermé', () => {
    const hostDialog: HTMLElement | null = document.querySelector('p-dialog[role="alertdialog"]');

    expect(hostDialog).withContext('le host p-dialog doit être rendu').not.toBeNull();
    expect(hostDialog!.getAttribute('aria-label')).toBe('Confirmation requise');
  });

  it('exigence 4 — role="alertdialog", aria-modal="true" et aria-labelledby vers le titre', fakeAsync(() => {
    ouvrirEtCliquerDeclencheur();
    tick(500);
    fixture.detectChanges();

    const dialog = dialoguePanneau();
    expect(dialog).withContext('le panneau du dialogue doit être rendu').not.toBeNull();
    expect(dialog!.getAttribute('role')).toBe('alertdialog');
    expect(dialog!.getAttribute('aria-modal')).toBe('true');

    const labelledBy = dialog!.getAttribute('aria-labelledby');
    expect(labelledBy).withContext('aria-labelledby doit être renseigné').toBeTruthy();
    const titre = document.getElementById(labelledBy!);
    expect(titre?.textContent).toContain('Supprimer le document');
  }));

  it('exigence 1 — focus-trap : le focus initial se déplace à l’intérieur du dialogue', fakeAsync(() => {
    ouvrirEtCliquerDeclencheur();
    tick(500);
    fixture.detectChanges();

    const dialog = dialoguePanneau()!;
    expect(dialog.contains(document.activeElement))
      .withContext('le focus doit être entré dans le dialogue à l’ouverture')
      .toBe(true);
  }));

  it('exigence 3 — fermeture par Échap, équivalente à Annuler', async () => {
    const trigger = ouvrirEtCliquerDeclencheur();
    await attendreOuverture(fixture);
    fixture.detectChanges();
    expect(dialoguePanneau()).not.toBeNull();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await attendreFermeture(fixture);
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();

    expect(dialoguePanneau()).withContext('Échap doit fermer le dialogue').toBeNull();
    expect(fixture.componentInstance.rejected).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('exigence 2 — restitution du focus au déclencheur après confirmation (bouton Accepter)', async () => {
    const trigger = ouvrirEtCliquerDeclencheur();
    await attendreOuverture(fixture);
    fixture.detectChanges();

    const acceptButton: HTMLButtonElement = document.querySelector('.p-confirmdialog-accept-button')!;
    expect(acceptButton).withContext('le bouton d’acceptation doit exister').not.toBeNull();
    acceptButton.click();
    await attendreFermeture(fixture);
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();

    expect(fixture.componentInstance.accepted).toBe(true);
    expect(dialoguePanneau()).withContext('le dialogue doit se fermer après acceptation').toBeNull();
    expect(document.activeElement)
      .withContext('le focus doit revenir exactement à l’élément déclencheur, pas au body')
      .toBe(trigger);
  });

  it('exigence 5 — les libellés du service sont ceux fournis, jamais un générique implicite', fakeAsync(() => {
    ouvrirEtCliquerDeclencheur();
    tick(500);
    fixture.detectChanges();

    const acceptButton: HTMLButtonElement = document.querySelector('.p-confirmdialog-accept-button')!;
    const rejectButton: HTMLButtonElement = document.querySelector('.p-confirmdialog-reject-button')!;
    expect(acceptButton.textContent).toContain('Supprimer');
    expect(rejectButton.textContent).toContain('Annuler');
  }));
});
