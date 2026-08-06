import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import {
  NotificationHistoriqueItem,
  NotificationsService,
} from './notifications.service';
import { NotificationsHistoriqueComponent } from './notifications-historique.component';

const historique: NotificationHistoriqueItem[] = [
  {
    id: 'n-1',
    dateCreation: '2026-08-06T06:40:53Z',
    notificationType: 'QUITTANCE_DISPONIBLE',
    channel: 'WHATSAPP',
    recipientAddressMasked: '+243****4331',
    statut: 'DELIVERED',
  },
  {
    id: 'n-2',
    dateCreation: '2026-08-05T06:40:53Z',
    notificationType: 'PAIEMENT_RECU',
    channel: 'SMS',
    recipientAddressMasked: '+243****0000',
    statut: 'DEAD',
    motif: 'gabarit non approuvé',
  },
];

describe('NotificationsHistoriqueComponent', () => {
  let api: jasmine.SpyObj<NotificationsService>;

  beforeEach(() => {
    api = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['consulterHistorique']);
    api.consulterHistorique.and.returnValue(of(historique));

    TestBed.configureTestingModule({
      imports: [NotificationsHistoriqueComponent],
      providers: [{ provide: NotificationsService, useValue: api }],
    });
  });

  function creer(): NotificationsHistoriqueComponent {
    const fixture = TestBed.createComponent(NotificationsHistoriqueComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('charge l historique le plus récent d abord', () => {
    const cmp = creer();

    expect(cmp.items()).toEqual(historique);
    expect(cmp.message()).toBe('2 notification(s)');
  });

  it('mappe les statuts techniques vers des libellés humains', () => {
    const cmp = creer();

    expect(cmp.libelleStatut('PENDING')).toBe("En attente d'envoi");
    expect(cmp.libelleStatut('PROCESSING')).toBe('Envoi en cours');
    expect(cmp.libelleStatut('DEAD')).toBe('Non envoyé');
    expect(cmp.libelleStatut('QUEUED')).toBe('Envoyé, en cours de livraison');
    expect(cmp.libelleStatut('DELIVERED')).toBe('Livré');
    expect(cmp.libelleStatut('READ')).toBe('Lu');
    expect(cmp.libelleStatut('FAILED')).toBe('Échec de livraison');
  });

  it('affiche un état vide explicite sans activer les canaux externes', () => {
    api.consulterHistorique.and.returnValue(of([]));

    const cmp = creer();

    expect(cmp.items()).toEqual([]);
    expect(cmp.message()).toBe('Aucune notification externe envoyée.');
  });

  it('signale les erreurs sans exposer de détail fournisseur', () => {
    api.consulterHistorique.and.returnValue(throwError(() => new Error('provider secret')));

    const cmp = creer();

    expect(cmp.message()).toBe('Impossible de charger l’historique des notifications.');
  });
});
