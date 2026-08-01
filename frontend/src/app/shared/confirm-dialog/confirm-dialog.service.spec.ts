import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';

import { LtConfirmDialogService } from './confirm-dialog.service';

describe('LtConfirmDialogService', () => {
  let service: LtConfirmDialogService;
  let confirmationService: ConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ConfirmationService] });
    service = TestBed.inject(LtConfirmDialogService);
    confirmationService = TestBed.inject(ConfirmationService);
  });

  it('délègue à ConfirmationService.confirm() avec les champs fournis, sans en ajouter', () => {
    const confirmSpy = spyOn(confirmationService, 'confirm');
    const accept = jasmine.createSpy('accept');
    const reject = jasmine.createSpy('reject');

    service.confirm({
      header: 'Résilier le bail',
      message: 'Cette action est irréversible.',
      acceptLabel: 'Résilier',
      rejectLabel: 'Annuler',
      accept,
      reject,
    });

    expect(confirmSpy).toHaveBeenCalledWith({
      header: 'Résilier le bail',
      message: 'Cette action est irréversible.',
      acceptLabel: 'Résilier',
      rejectLabel: 'Annuler',
      accept,
      reject,
    });
  });
});
