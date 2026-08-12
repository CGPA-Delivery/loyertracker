import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { httpErrorRedirectInterceptor } from './http-error-redirect.interceptor';

describe('httpErrorRedirectInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([httpErrorRedirectInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
  });

  afterEach(() => httpMock.verify());

  it('redirige une réponse 403 vers la page dédiée et propage l’erreur', () => {
    http.get('/api/protected').subscribe({ error: () => undefined });
    httpMock.expectOne('/api/protected').flush({}, { status: 403, statusText: 'Forbidden' });

    expect(router.navigate).toHaveBeenCalledWith(['/403']);
  });

  it('redirige une réponse 404 vers la page dédiée et propage l’erreur', () => {
    http.get('/api/unknown').subscribe({ error: () => undefined });
    httpMock.expectOne('/api/unknown').flush({}, { status: 404, statusText: 'Not Found' });

    expect(router.navigate).toHaveBeenCalledWith(['/404']);
  });

  it('préserve les erreurs attendues du parcours d’acceptation public', () => {
    http.post('/api/invitations/token-test/acceptation', {}).subscribe({ error: () => undefined });
    httpMock.expectOne('/api/invitations/token-test/acceptation').flush(
      {},
      { status: 404, statusText: 'Not Found' },
    );

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('ne redirige pas les autres erreurs', () => {
    http.get('/api/server-error').subscribe({ error: () => undefined });
    httpMock.expectOne('/api/server-error').flush({}, { status: 500, statusText: 'Server Error' });

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
