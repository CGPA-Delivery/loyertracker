import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api/api.config';

export type CanalNotification = 'IN_APP' | 'WHATSAPP' | 'SMS' | 'EMAIL';
export type StatutNotification =
  | 'PENDING'
  | 'PROCESSING'
  | 'RETRY'
  | 'DEAD'
  | 'QUEUED'
  | 'ACCEPTED'
  | 'SENT'
  | 'DELIVERED'
  | 'READ'
  | 'FAILED'
  | 'UNDELIVERED'
  | 'CANCELLED';

export interface NotificationPreference {
  enabled: boolean;
  phoneE164?: string | null;
  preferredChannel: CanalNotification;
  fallbackChannel?: CanalNotification | null;
  whatsappOptIn: boolean;
  smsOptIn: boolean;
  consentAt?: string | null;
  consentSource?: string | null;
  language: string;
}

export interface NotificationPreferencePayload {
  phoneE164: string;
  preferredChannel: CanalNotification;
  fallbackChannel: CanalNotification | null;
  whatsappOptIn: boolean;
  smsOptIn: boolean;
  language: string;
}

export interface NotificationHistoriqueItem {
  id: string;
  dateCreation: string;
  notificationType: string;
  channel: CanalNotification;
  recipientAddressMasked: string;
  statut: StatutNotification;
  motif?: string | null;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/notifications`;

  consulterPreferences(): Observable<NotificationPreference> {
    return this.http.get<NotificationPreference>(`${this.baseUrl}/preferences/current`);
  }

  enregistrerPreferences(
    payload: NotificationPreferencePayload,
  ): Observable<NotificationPreference> {
    return this.http.put<NotificationPreference>(`${this.baseUrl}/preferences/current`, {
      ...payload,
      consentSource: 'FORMULAIRE_LOYERTRACKER',
    });
  }

  desinscrire(): Observable<NotificationPreference> {
    return this.http.post<NotificationPreference>(`${this.baseUrl}/preferences/current/unsubscribe`, {});
  }

  consulterHistorique(): Observable<NotificationHistoriqueItem[]> {
    return this.http.get<NotificationHistoriqueItem[]>(`${this.baseUrl}/history`);
  }
}
