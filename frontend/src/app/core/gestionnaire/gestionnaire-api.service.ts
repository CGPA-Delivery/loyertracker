import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api/api.config';
import { Affectation } from '../s02/s02-api.service';

/** Entrée d'audit (commune à Gestionnaire et Locataire). */
export interface AuditEntry {
  id: string;
  action: string;
  details: string | null;
  date: string;
  auteur: string;
}

/** Vue API d'un Gestionnaire (EP-15, miroir de GestionnaireDto). */
export interface Gestionnaire {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  statut: 'ACTIF' | 'SUSPENDU' | 'ARCHIVE';
  telephone: string | null;
  photoPresente: boolean;
  observations: string | null;
  dateCreation: string;
  dateSuspension: string | null;
  dateArchivage: string | null;
}

/** Payload de modification du profil métier d'un Gestionnaire (K1, ADR-16). */
export interface GestionnaireProfilPayload {
  telephone?: string | null;
  photoBase64?: string | null;
  observations?: string | null;
}

/** Historique d'un Gestionnaire (EP-15, EF-104). */
export interface GestionnaireHistorique {
  gestionnaire: Gestionnaire;
  affectations: Affectation[];
  audit: AuditEntry[];
}

const BASE = `${API_BASE_URL}/gestionnaires`;

/**
 * Accès aux endpoints d'administration des Gestionnaires (EP-15, ADR-16).
 * Réservé au rôle BAILLEUR — l'intercepteur Bearer existant attache le token
 * automatiquement sur /api/* (hors /api/public/).
 */
@Injectable({ providedIn: 'root' })
export class GestionnaireApiService {
  private readonly http = inject(HttpClient);

  rechercher(q?: string): Observable<Gestionnaire[]> {
    const params = q ? new HttpParams().set('q', q) : undefined;
    return this.http.get<Gestionnaire[]>(BASE, { params });
  }

  verificationDoublon(email?: string, telephone?: string): Observable<Gestionnaire[]> {
    let params = new HttpParams();
    if (email) params = params.set('email', email);
    if (telephone) params = params.set('telephone', telephone);
    return this.http.get<Gestionnaire[]>(`${BASE}/verification-doublon`, { params });
  }

  consulter(id: string): Observable<Gestionnaire> {
    return this.http.get<Gestionnaire>(`${BASE}/${id}`);
  }

  modifierProfil(id: string, payload: GestionnaireProfilPayload): Observable<Gestionnaire> {
    return this.http.put<Gestionnaire>(`${BASE}/${id}`, payload);
  }

  suspendre(id: string): Observable<Gestionnaire> {
    return this.http.post<Gestionnaire>(`${BASE}/${id}/suspension`, null);
  }

  reactiver(id: string): Observable<Gestionnaire> {
    return this.http.post<Gestionnaire>(`${BASE}/${id}/reactivation`, null);
  }

  archiver(id: string): Observable<Gestionnaire> {
    return this.http.post<Gestionnaire>(`${BASE}/${id}/archivage`, null);
  }

  restaurer(id: string): Observable<Gestionnaire> {
    return this.http.post<Gestionnaire>(`${BASE}/${id}/restauration`, null);
  }

  historique(id: string): Observable<GestionnaireHistorique> {
    return this.http.get<GestionnaireHistorique>(`${BASE}/${id}/historique`);
  }
}
