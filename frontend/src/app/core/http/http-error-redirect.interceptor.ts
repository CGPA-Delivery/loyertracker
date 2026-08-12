import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/** Redirige les erreurs de navigation vers les pages publiques explicites. */
export const httpErrorRedirectInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: unknown) => {
      const invitationAcceptance = /^\/api\/invitations\/[^/]+\/acceptation$/i.test(request.url);
      if (
        error instanceof HttpErrorResponse &&
        !invitationAcceptance &&
        (error.status === 403 || error.status === 404)
      ) {
        void router.navigate([error.status === 403 ? '/403' : '/404']);
      }
      return throwError(() => error);
    }),
  );
};
