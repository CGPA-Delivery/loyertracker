import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { QuittanceApiService } from './quittance-api.service';

describe('QuittanceApiService', () => {
  let service: QuittanceApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), QuittanceApiService],
    });
    service = TestBed.inject(QuittanceApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('annule une quittance', () => {
    service.annuler('quittance-1').subscribe();
    const req = http.expectOne('/api/quittances/quittance-1/annulation');
    expect(req.request.method).toBe('POST');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
