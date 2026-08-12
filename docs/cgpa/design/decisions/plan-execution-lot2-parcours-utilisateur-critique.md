# Plan d'Exécution — Lot 2 : Parcours utilisateur critique (DD-EP17-12 + DD-EP17-02)

| Champ | Valeur |
|---|---|
| Date | 2026-08-12 |
| Auteur | CDO / Enterprise Architect |
| Dettes | DD-EP17-12 (écran acceptation invitation), DD-EP17-02 (états 403/404) |
| Criticité | P1 |
| Statut | **Plan proposé — en attente de validation PO/CDO** |

---

## 1. Contexte

### DD-EP17-12 — Écran d'acceptation d'invitation

Le backend expose `POST /api/invitations/{token}/acceptation` (publique, sans auth) et `InvitationService.java` génère des liens `{baseUrl}/invitations/{token}`. Mais aucune route Angular ne correspond : `app.routes.ts` n'a pas de route `/invitations/:token`. Le flux n'est aujourd'hui exercé qu'en appel API direct (`smoke-stack.sh`).

Le service Angular `InvitationApiService.accepter()` existe déjà, prêt à être consommé.

### DD-EP17-02 — États 403/404 uniformes

Aucun composant `ForbiddenComponent` ni `NotFoundComponent` n'existe. La route `**` redirige vers `/bailleur` (ce qui masque les 404). Aucun intercepteur HTTP ne traduit les erreurs 403/404 en page dédiée.

---

## 2. Solution proposée

### 2.1 DD-EP17-12 — Écran d'acceptation d'invitation

**Route** : `/invitations/:token` (publique, SANS `authGuard` — le gestionnaire n'a pas encore de compte)

**Composant** : `InvitationAcceptationComponent` (nouveau, dans `frontend/src/app/invitation/`)

**États** :
| État | Affichage | Comportement |
|---|---|---|
| Chargement | Spinner `lt-loading` | Appel `GET /api/invitations/{token}` pour valider le token |
| Token invalide/expiré | Message d'erreur + lien contact | HTTP 400/404/410 → `lt-empty-state` variante erreur |
| Formulaire | Nom, prénom, mot de passe, confirmation | Validation client + soumission |
| Soumission | Spinner | `POST /api/invitations/{token}/acceptation` |
| Succès | Confirmation + redirection | Redirection vers Keycloak login après 3s |
| Erreur 409 | « Déjà acceptée » | Message informatif |
| Erreur réseau | Message d'erreur | `lt-empty-state` variante erreur + bouton réessayer |

**Dépendances** : `InvitationApiService` (existant), `ReactiveFormsModule` (existant), `lt-empty-state` (existant), `lt-loading` (existant).

### 2.2 DD-EP17-02 — États 403/404 uniformes

**Composants** :
- `ForbiddenComponent` — page 403 avec message « Accès refusé » + bouton retour
- `NotFoundComponent` — page 404 avec message « Page introuvable » + bouton retour

**Routes** :
- `/403` → `ForbiddenComponent`
- `/404` → `NotFoundComponent`
- `**` → `NotFoundComponent` (remplace le `redirectTo: 'bailleur'` actuel)

**Intercepteur HTTP** : `HttpErrorInterceptor` (nouveau) — sur erreur 403 → `router.navigate(['/403'])`, sur 404 → `router.navigate(['/404'])`.

**Design** : utiliser `lt-empty-state` (variante erreur) pour la cohérence visuelle, avec illustration et bouton d'action.

---

## 3. Tâches

| # | Tâche | Fichiers | Effort |
|---|---|---|---|
| 1 | Créer `InvitationAcceptationComponent` | `invitation/invitation-acceptation.component.ts` | 1 j |
| 2 | Ajouter route `/invitations/:token` | `app.routes.ts` | 0,1 j |
| 3 | Tests unitaires `InvitationAcceptationComponent` | `invitation-acceptation.component.spec.ts` | 0,5 j |
| 4 | Créer `ForbiddenComponent` | `shared/forbidden/forbidden.component.ts` | 0,3 j |
| 5 | Créer `NotFoundComponent` | `shared/not-found/not-found.component.ts` | 0,3 j |
| 6 | Ajouter routes `/403`, `/404`, `**` | `app.routes.ts` | 0,1 j |
| 7 | Créer `HttpErrorInterceptor` | `core/http/http-error.interceptor.ts` | 0,3 j |
| 8 | Tests unitaires intercepteur + composants 403/404 | `*.spec.ts` | 0,5 j |
| 9 | Test intégration : flux invitation complet | Playwright ou manuel | 0,5 j |
| 10 | Gate Staging → recette → Gate Production | — | 0,5 j |

**Total estimé** : 3-5 jours.

---

## 4. Prérequis

- Plan approuvé par PO/CDO (ce document)
- Gate 02A/04A applicable (Plan Frontend approuvé)
- `InvitationApiService.accepter()` déjà existant et testé
- `lt-empty-state` et `lt-loading` déjà disponibles

---

## 5. Décision

**GO proposé** — sous réserve de validation PO/CDO. Aucun code, aucune migration, aucun déploiement autorisé par ce plan seul.
