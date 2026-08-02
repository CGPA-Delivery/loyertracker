import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { LtToastService } from './toast.service';

describe('LtToastService', () => {
  let service: LtToastService;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [MessageService] });
    service = TestBed.inject(LtToastService);
    messageService = TestBed.inject(MessageService);
  });

  it('traduit chaque méthode de sévérité vers la sévérité PrimeNG Toast attendue', () => {
    const addSpy = spyOn(messageService, 'add');

    service.success('Locataire créé', 'Succès');
    expect(addSpy).toHaveBeenCalledWith({ severity: 'success', summary: 'Succès', detail: 'Locataire créé' });

    service.info('Chargement en cours');
    expect(addSpy).toHaveBeenCalledWith({ severity: 'info', summary: undefined, detail: 'Chargement en cours' });

    service.warning('Échéance proche');
    expect(addSpy).toHaveBeenCalledWith({ severity: 'warn', summary: undefined, detail: 'Échéance proche' });

    service.danger('Échec de la requête');
    expect(addSpy).toHaveBeenCalledWith({ severity: 'error', summary: undefined, detail: 'Échec de la requête' });
  });
});
