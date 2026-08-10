import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api/api.config';

export type StatutInvitation = 'PENDING' | 'ACCEPTED' | 'EXPIRED';

export interface InvitationDto {
  id: string;
  email: string;
  token: string;
  lien: string;
  statut: StatutInvitation;
  dateExpiration: string;
}

export interface AcceptationDto {
  gestionnaireId: string;
  email: string;
  compteCree: boolean;
}

/**
 * Accès API Invitations (US-11, US-12). Émission réservée au bailleur, acceptation publique.
 */
@Injectable({ providedIn: 'root' })
export class InvitationApiService {
  private readonly http = inject(HttpClient);

  inviter(email: string): Observable<InvitationDto> {
    return this.http.post<InvitationDto>(`${API_BASE_URL}/invitations`, { email });
  }

  accepter(token: string, nom: string, prenom: string, motDePasse: string): Observable<AcceptationDto> {
    return this.http.post<AcceptationDto>(
      `${API_BASE_URL}/invitations/${token}/acceptation`,
      { nom, prenom, motDePasse },
    );
  }
}
