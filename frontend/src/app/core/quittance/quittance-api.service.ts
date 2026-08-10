import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api/api.config';

/**
 * Accès API Quittance (US-99). Annulation réservée au bailleur propriétaire.
 */
@Injectable({ providedIn: 'root' })
export class QuittanceApiService {
  private readonly http = inject(HttpClient);

  annuler(quittanceId: string): Observable<void> {
    return this.http.post<void>(
      `${API_BASE_URL}/quittances/${quittanceId}/annulation`,
      null,
    );
  }
}
