import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { ToastComponent } from './toast.component';
import { LtToastService } from './toast.service';

@Component({
  standalone: true,
  imports: [ToastComponent],
  template: `<lt-toast />`,
})
class HostComponent {
  readonly toast = inject(LtToastService);
}

describe('ToastComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent], providers: [MessageService] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('affiche un message déclenché via LtToastService, avec role="alert"', fakeAsync(() => {
    fixture.componentInstance.toast.success('Locataire créé');
    tick(100);
    fixture.detectChanges();

    const toast = document.querySelector('[role="alert"]');
    expect(toast).withContext('le message doit être rendu avec role="alert"').not.toBeNull();
    expect(toast!.textContent).toContain('Locataire créé');
    expect(document.querySelector('.p-toast-message-success')).not.toBeNull();
  }));
});
