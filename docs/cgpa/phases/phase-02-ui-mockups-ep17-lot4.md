# Phase 02 — Maquettes des écrans critiques, EP-17 Lot 4 (Pilote Keycloak — thème `login/`)

| Champ | Valeur |
|-------|--------|
| Livrable CGPA | Gate 02A — UX & Design Readiness (`docs/cgpa/gates/gate-02A-ux-design-readiness.md`) |
| Périmètre couvert | EP-17 Lot 4 — thème Keycloak, **6 écrans confirmés regroupés en 4 familles visuelles** (login, reset password, logout, erreur générique), realm `loyertracker` |
| Statut | **Proposé — premier jet, non validé** |
| Auteur | Claude Code (rédaction assistée) |
| Date | 2026-08-02 |
| Validateurs requis | Product Owner (jptshilombo@gmail.com), UX/UI Design Lead (à désigner), DevSecOps Lead (revue sécurité Keycloak, `agent-designations-loyertracker.md`) |
| Documents amont | `phase-02-user-journeys-ep17-lot4.md`, `ADR-UI-001` §Sécurité/§Stratégie de thème Keycloak, `DSG-001.md` §Palette/§Responsive Rules |
| Comble le blocage | `gate-02A-decision-ep17-lot4.md` §4 (« maquettes absentes ») |

> **Niveau de fidélité et méthode.** Contrairement à `phase-02-ui-mockups-ep17-lot3.md` (wireframes
> texte d'un composant Angular existant), les écrans « État actuel » ci-dessous reproduisent le
> contenu et la structure **réellement observés** en exécutant le realm `loyertracker` sur l'image
> Keycloak `24.0` (même digest que Dev/Staging/Production) — pas une supposition sur le thème par
> défaut de Keycloak. Les écrans « Cible proposée » restent des wireframes texte basse fidélité, au
> même titre que le Lot 3.

---

## 0. Correspondance réel ↔ cible

| Famille d'écran | Gabarit Keycloak réel | Cible `login/theme.properties` | Constat |
|---|---|---|---|
| Connexion | `login.ftl` | Restylé, tokens partagés (Option B) | Fonctionnel, en anglais |
| Mot de passe oublié (saisie) | `login-reset-password.ftl` | Restylé | Fonctionnel, en anglais |
| Mot de passe oublié (résultat) | `error.ftl` (échec réel) / `info.ftl` (succès, jamais observé) | Restylé, **texte honnête sur l'indisponibilité si SMTP reste absent** | **Échec reproduit (HTTP 500)**, cf. `phase-02-user-journeys-ep17-lot4.md` J-Lot4-2 |
| Déconnexion | `logout-confirm.ftl` | Restylé | Fonctionnel, en anglais |
| Erreur générique (accès refusé, session expirée, requêtes malformées) | `error.ftl` | Restylé, message adapté au contexte | Fonctionnel, un seul gabarit partagé pour plusieurs causes |

---

## 1. Connexion — état actuel (réel, capturé)

```
┌────────────────────────────────────────┐
│              LOYERTRACKER               │   ← displayName du realm, pas un logo
│                                          │
│         ┌──────────────────────┐        │
│         │ Sign in to your      │        │
│         │ account              │        │
│         │                      │        │
│         │ Email                │        │
│         │ [                  ] │        │
│         │                      │        │
│         │ Password         👁  │        │
│         │ [                  ] │        │
│         │                      │        │
│         │        Forgot Password? │     │
│         │                      │        │
│         │ [      Sign In      ]│        │
│         └──────────────────────┘        │
└────────────────────────────────────────┘
```

**Constats** : fond sombre à motif géométrique (thème `keycloak.v2` par défaut), carte blanche,
accent bleu (`#0066CC`-like), aucune couleur ni typographie `--lt-*`. Champ « Email » cohérent avec
le modèle d'auth du produit (pas de « Username » générique). Bouton de visibilité du mot de passe
natif (👁) déjà présent — accessible, pas à réinventer.

## 1bis. Connexion — cible proposée

```
┌────────────────────────────────────────┐
│         [logo LoyerTracker]             │   ← Option B : tokens.css commun
│                                          │
│         ┌──────────────────────┐        │
│         │ Connexion à votre    │        │
│         │ compte                │        │
│         │                      │        │
│         │ E-mail               │        │
│         │ [                  ] │        │
│         │                      │        │
│         │ Mot de passe     👁  │        │
│         │ [                  ] │        │
│         │                      │        │
│         │      Mot de passe oublié ?    │
│         │                      │        │
│         │ [    Se connecter   ]│        │
│         └──────────────────────┘        │
└────────────────────────────────────────┘
```

**Annotations**
- Fond, carte, bouton : tokens `--lt-surface-*`/`--lt-state-*`/`--lt-radius-default` (Option B, CSS
  commun avec Angular, `DD-EP17-03`).
- Traduction française intégrale — corrige `DD-EP17-13` (nouvelle, langue non traitée par le
  constat initial du Lot 4).
- Structure DOM et attributs `name`/`id` des champs **non modifiés** (interdiction `ADR-UI-001` :
  ne jamais toucher aux flux OIDC/PKCE ni aux mécanismes de soumission).
- Message d'erreur « Invalid username or password. » → traduit « Identifiants invalides. », **sans
  changer la sémantique générique** (ne jamais révéler si l'email existe).

---

## 2. Mot de passe oublié — état actuel (réel, capturé/reproduit)

```
┌────────────────────────────────────────┐
│              LOYERTRACKER               │
│                                          │
│         ┌──────────────────────┐        │
│         │ Forgot Your          │        │
│         │ Password?            │        │
│         │                      │        │
│         │ Email                │        │
│         │ [                  ] │        │
│         │                      │        │
│         │ « Back to Login      │        │
│         │                      │        │
│         │ [      Submit       ]│        │
│         │                      │        │
│         │ Enter your username  │        │
│         │ or email address and │        │
│         │ we will send you     │        │
│         │ instructions...      │        │
│         └──────────────────────┘        │
└────────────────────────────────────────┘

           ↓ soumission réelle testée

┌────────────────────────────────────────┐
│ LoyerTracker                            │
│                                          │
│ We are sorry...                         │
│                                          │
│ Failed to send email, please try        │
│ again later.                            │
│                                          │
│ « Back to Application                   │
└────────────────────────────────────────┘
```

**Constat critique** : le second écran n'est pas une hypothèse — il a été obtenu en soumettant
réellement ce formulaire pour un utilisateur de test existant (`HTTP 500`). C'est le comportement
actuel de ce flux avec cette configuration de realm, sur l'image utilisée par les 3 environnements.

## 2bis. Mot de passe oublié — cible proposée (sous condition)

```
┌────────────────────────────────────────┐
│         [logo LoyerTracker]             │
│                                          │
│         ┌──────────────────────┐        │
│         │ Mot de passe oublié ?│        │
│         │                      │        │
│         │ E-mail               │        │
│         │ [                  ] │        │
│         │                      │        │
│         │ « Retour à la connexion │     │
│         │                      │        │
│         │ [      Envoyer      ]│        │
│         │                      │        │
│         │ Indiquez votre e-mail│        │
│         │ pour recevoir les    │        │
│         │ instructions de      │        │
│         │ réinitialisation.    │        │
│         └──────────────────────┘        │
└────────────────────────────────────────┘
```

**Annotation critique — décision Product Owner requise avant tout code** : thémer cet écran de
saisie sans résoudre la configuration SMTP produirait un écran soigné qui aboutit systématiquement
à l'écran d'erreur générique (§3bis). Deux voies, non tranchées par cette maquette :
1. Livrer ce thème en l'assumant explicitement incomplet (l'écran de résultat reste l'erreur
   générique tant que le SMTP n'est pas configuré) — traçable, pas trompeur si documenté.
2. Conditionner la mise en Production de ce thème précis à la résolution de la configuration SMTP
   (hors périmètre technique d'un thème FreeMarker, mais préalable fonctionnel réel).

---

## 3. Déconnexion — état actuel (réel, capturé)

```
┌────────────────────────────────────────┐
│              LOYERTRACKER               │
│                                          │
│         ┌──────────────────────┐        │
│         │ Logging out          │        │
│         │                      │        │
│         │ Do you want to log   │        │
│         │ out?                 │        │
│         │                      │        │
│         │ [      Logout       ]│        │
│         │                      │        │
│         │ « Back to Application│        │
│         └──────────────────────┘        │
└────────────────────────────────────────┘
```

## 3bis. Déconnexion — cible proposée

```
┌────────────────────────────────────────┐
│         [logo LoyerTracker]             │
│                                          │
│         ┌──────────────────────┐        │
│         │ Déconnexion          │        │
│         │                      │        │
│         │ Voulez-vous vraiment │        │
│         │ vous déconnecter ?   │        │
│         │                      │        │
│         │ [   Se déconnecter  ]│        │
│         │                      │        │
│         │ « Retour à l'application │    │
│         └──────────────────────┘        │
└────────────────────────────────────────┘
```

Aucune particularité — traduction et tokens seulement, comportement inchangé, non critique
(criticité faible, `phase-02-user-journeys-ep17-lot4.md` J-Lot4-3).

---

## 4. Erreur générique (accès refusé / session expirée / requête invalide) — état actuel (réel, capturé)

```
┌────────────────────────────────────────┐
│              LOYERTRACKER               │
│                                          │
│         ┌──────────────────────┐        │
│         │ We are sorry...      │        │
│         │                      │        │
│         │ [message contextuel] │        │
│         │                      │        │
│         │ « Back to Application│        │
│         └──────────────────────┘        │
└────────────────────────────────────────┘
```

**Messages réellement observés sur ce même gabarit** : « Invalid parameter: redirect_uri » (URL de
redirection non enregistrée), « Failed to send email, please try again later. » (§2), « Cookie not
found. Please make sure cookies are enabled in your browser. » (session/cookie absent). Le cas
strict `error=access_denied` (OIDC, ex. consentement refusé) n'a **pas** été reproduit dans cette
vérification — le realm ne configure aucun flux de consentement explicite sur le client SPA ; noté
comme hypothèse non testée plutôt qu'affirmée.

## 4bis. Erreur générique — cible proposée

```
┌────────────────────────────────────────┐
│         [logo LoyerTracker]             │
│                                          │
│         ┌──────────────────────┐        │
│         │ ⚠ Une erreur est     │        │
│         │   survenue           │        │
│         │                      │        │
│         │ [message contextuel  │        │
│         │  traduit, jamais un  │        │
│         │  détail technique]   │        │
│         │                      │        │
│         │ « Retour à l'application │    │
│         └──────────────────────┘        │
└────────────────────────────────────────┘
```

**Annotation sécurité (`ADR-UI-001` §Sécurité, interdiction « ne jamais exposer un détail
technique »)** : les messages actuels (« Failed to send email… », codes internes) devront être
reformulés en langage utilisateur sans perdre l'information utile — ex. « Impossible d'envoyer
l'e-mail pour le moment, réessayez plus tard » reste acceptable (déjà générique), mais toute
évolution future ne doit jamais exposer de trace technique (stack, nom de service SMTP, etc.).

---

## 5. Variante responsive (< 640px)

**Constat réel** : le thème par défaut Keycloak (non personnalisé) est **déjà raisonnablement
responsive** — capture à 375px de large confirme un empilement vertical correct, champs pleine
largeur, aucun débordement horizontal, carte occupant l'écran de façon lisible. Ce n'est pas un
correctif à apporter, mais une base saine à préserver lors du re-thème (ne pas régresser sur ce
point déjà acquis).

```
┌──────────────────────┐
│ LOYERTRACKER          │
│                        │
│ Sign in to your        │
│ account                │
│                        │
│ Email                  │
│ [                    ] │
│                        │
│ Password           👁  │
│ [                    ] │
│                        │
│      Forgot Password?  │
│                        │
│ [      Sign In        ]│
└──────────────────────┘
```

Touch targets non mesurés précisément dans cette vérification (à faire au moment de l'implémentation
réelle, même méthode que `DD-EP17-11` pour le Lot 3 — mesure `getBoundingClientRect()` en
navigateur réel).

---

## 6. Ce que cette maquette ne couvre pas

* Account Console (`account/`) — exclue du périmètre (`gate-04A-decision-ep17-lot4.md` §8).
* Invitation / invitation expirée — pas des écrans Keycloak (`DD-EP17-12`).
* Le contenu exact du texte final (copie française) reste à valider par le Product Owner — les
  formulations proposées ici sont des candidates, pas un texte figé.
* Aucun code de thème n'est produit par ce document — strictement une maquette, conformément au
  verrou `CLAUDE.md`.
