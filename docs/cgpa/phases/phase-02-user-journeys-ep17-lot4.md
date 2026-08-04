# Phase 02 — Parcours écrit, EP-17 Lot 4 (Pilote Keycloak — thème `login/`)

| Champ | Valeur |
|-------|--------|
| Livrable CGPA | Gate 02A — UX & Design Readiness (`docs/cgpa/gates/gate-02A-ux-design-readiness.md`) |
| Périmètre couvert | EP-17 Lot 4 — thème Keycloak, **6 écrans confirmés** (login, mot de passe oublié, reset password, session expirée, accès refusé, logout), realm `loyertracker`. Hors périmètre : Account Console (exclue, `gate-04A-decision-ep17-lot4.md` §8), invitation/invitation expirée (pas des écrans Keycloak, `DD-EP17-12`). |
| Statut | **Proposé — premier jet, non validé** |
| Auteur | Claude Code (rédaction assistée) |
| Date | 2026-08-02 |
| Validateurs requis | Product Owner (jptshilombo@gmail.com), UX/UI Design Lead (à désigner) |
| Documents amont | `ADR-UI-001` §Stratégie de thème Keycloak/§Sécurité ; `gate-04A-decision-ep17-lot4.md` §9 (vérifications factuelles) ; `infra/keycloak/realm-loyertracker.json` |
| Comble le blocage | `gate-02A-decision-ep17-lot4.md` §4 (« parcours utilisateurs absents ») |

> **Méthode de vérification.** Contrairement aux parcours Angular du Lot 3 (lecture de code), les
> parcours ci-dessous ont été établis en **exécutant réellement** le realm `loyertracker` : instance
> Keycloak 24.0.5 isolée, lancée localement avec le fichier de realm versionné importé tel quel
> (même image que Dev/Staging/Production, `gate-04A-decision-ep17-lot4.md` §9), utilisateur de test
> créé via l'API Admin, écrans capturés et actions réellement soumises (formulaires POST, pas une
> simulation). Instance détruite après capture, aucune donnée résiduelle. Ceci révèle des faits que
> la seule lecture du realm JSON ne pouvait pas montrer — notamment un flux réellement en échec
> (§2, J-Lot4-2).

---

## 1. Personas

Réutilise les personas Bailleur/Gestionnaire (`phase-02-user-journeys.md` §1.1/§1.2) — l'écran de
connexion ne distingue pas les rôles avant authentification. Un persona supplémentaire, implicite
mais réel, est concerné : **le visiteur non encore authentifié** (session expirée, lien de reset
reçu par e-mail, accès direct à une URL protégée) — sans profil produit dédié à ce jour.

---

## 2. User journeys

### J-Lot4-1 — Se connecter (login nominal et échec d'identifiants)

**Déclencheur** : le Bailleur ou le Gestionnaire accède à l'application, redirigé vers Keycloak
(flux Authorization Code + PKCE, `loyertracker-spa`, client public).

**Parcours nominal** (vérifié réellement, capture d'écran)

1. Redirection vers `/realms/loyertracker/protocol/openid-connect/auth?...` — Keycloak affiche
   « Sign in to your account », champ **Email** (cohérent avec `loginWithEmailAllowed: true`,
   `registrationEmailAsUsername: true`), champ **Password** avec bouton de visibilité natif, lien
   « Forgot Password? », bouton **Sign In**.
2. Saisie email + mot de passe corrects → redirection vers `redirect_uri` avec le code
   d'autorisation.

**Cas d'erreur / limites** (vérifiés réellement)

- Identifiants invalides → message **« Invalid username or password. »**, générique par design
  (aucune indication si c'est l'email ou le mot de passe qui est incorrect — bonne pratique de
  sécurité déjà en place, pas à modifier).
- 5 échecs consécutifs → verrouillage temporaire (`bruteForceProtected: true`, `failureFactor: 5`,
  `maxFailureWaitSeconds: 900` = 15 min) — comportement non capturé visuellement dans cette
  vérification (délai trop long pour ce test), mais confirmé par la configuration du realm.
- Cookie de session absent/rejeté → **« Cookie not found. Please make sure cookies are enabled in
  your browser. »**, rendu via le même template générique que les autres erreurs (§J-Lot4-4).
- **Écart réel constaté, non anticipé par le Plan** : l'intégralité de l'écran est en **anglais**
  (« Sign in to your account », « Email », « Password », « Forgot Password? », « Sign In ») —
  aucune traduction française n'est configurée, alors que le reste du produit est intégralement en
  français. Absent de tout constat antérieur (`DD-EP17-01` ne mentionnait que l'absence de thème
  visuel, pas la langue) — nouvelle dette à tracer (§4).

**Parcours critique ?** Oui, bloquant — point d'entrée unique de toute session applicative.

---

### J-Lot4-2 — Réinitialiser son mot de passe oublié (flux actuellement EN ÉCHEC)

**Déclencheur** : le Bailleur ou le Gestionnaire a oublié son mot de passe, clique « Forgot
Password? » depuis l'écran de connexion.

**Parcours nominal attendu**

1. Écran « Forgot Your Password? » — champ **Email**, lien « « Back to Login », bouton **Submit**,
   texte d'aide : « Enter your username or email address and we will send you instructions on how
   to create a new password. »
2. Soumission de l'email d'un compte existant → attendu : e-mail envoyé, écran de confirmation
   neutre (ne révélant pas si le compte existe, comportement standard Keycloak).

**Constat réel — écart critique, pas une hypothèse** : la soumission réelle de ce formulaire, sur
un utilisateur de test existant, produit **`HTTP 500`** et l'écran « We are sorry… Failed to send
email, please try again later. » — **le flux est fonctionnellement cassé aujourd'hui**, cohérent
avec l'absence de configuration SMTP confirmée sur toute source versionnée (`gate-04A-decision-ep17-lot4.md`
§9). Ce n'est plus une question ouverte : c'est un échec reproduit et vérifié, avec la même image
Keycloak que Production.

**Conséquence pour ce Lot** : thémer visuellement un écran de saisie qui aboutit systématiquement à
une page d'erreur ne change rien à l'expérience réelle — **l'écran « Reset Password » réussi n'a
jamais pu être observé**, faute d'e-mail sortant fonctionnel. Deux options se présentent, à trancher
par le Product Owner avant toute maquette de ce parcours précis :
1. Thémer uniquement l'écran de saisie et l'écran d'erreur générique (§J-Lot4-4), en l'état, sans
   prétendre à un parcours de bout en bout fonctionnel.
2. Traiter la configuration SMTP comme un **préalable bloquant** à ce parcours spécifique — hors
   périmètre théorique d'un « thème » (FreeMarker + CSS statique), mais nécessaire pour que le
   parcours ait un sens.

**Parcours critique ?** Oui pour la légitimité même de l'écran — thémer un flux cassé sans le
signaler serait trompeur pour l'utilisateur final.

---

### J-Lot4-3 — Se déconnecter

**Déclencheur** : l'utilisateur clique « Se déconnecter » (Angular, hors périmètre Keycloak) ou une
déconnexion RP-initiated est déclenchée.

**Parcours nominal** (vérifié réellement, capture d'écran)

1. Sans `id_token_hint` transmis, Keycloak affiche un écran de confirmation : « Logging out — Do
   you want to log out? », bouton **Logout**, lien « « Back to Application ».
2. Confirmation → session invalidée, redirection.

**Cas d'erreur / limites** : non testés dans cette vérification (hors budget de risque pour un
flux de déconnexion, peu critique).

**Parcours critique ?** Non bloquant pour Gate 04A (risque faible), mais partie du périmètre
confirmé.

---

### J-Lot4-4 — Rencontrer une erreur générique (accès refusé, session expirée, lien invalide)

**Déclencheur** : plusieurs situations distinctes convergent, réellement vérifié, vers le **même
template Keycloak** (`error.ftl`, l'écran « We are sorry… ») :
- `redirect_uri` non enregistré pour le client → « Invalid parameter: redirect_uri » (vérifié).
- Échec technique (ex. SMTP, §J-Lot4-2) → message contextuel sur le même gabarit visuel (vérifié).
- Cookie de session absent/expiré → « Cookie not found… » (vérifié, formulée différemment de
  « session expirée » mais relevant de la même famille fonctionnelle).
- Accès refusé au sens strict OIDC (`error=access_denied`, ex. consentement refusé) — **non
  reproduit dans cette vérification** (le realm ne configure aucun flux de consentement explicite,
  `consentRequired` absent des clients) ; hypothèse non testée, à surveiller plutôt qu'à affirmer.

**Conséquence pour la maquette** : un seul template visuel (`error.ftl`) couvre plusieurs
situations sémantiquement différentes (accès refusé, session expirée, requête malformée) —
contrairement à l'hypothèse initiale du Plan qui traitait « session expirée » et « accès refusé »
comme deux écrans distincts, ils partagent en réalité un seul gabarit Keycloak. La maquette (§ui-mockups)
en tient compte : un seul écran-type « Erreur générique », avec variantes de message.

**Parcours critique ?** Oui, bloquant — c'est l'écran qu'un utilisateur perdu verra le plus souvent
en cas de problème, quelle qu'en soit la cause exacte.

---

## 3. Effet des constats sur le périmètre de maquette retenu

* Le périmètre reste **6 écrans confirmés**, mais leur regroupement visuel réel diffère de la liste
  initiale du Plan : login (1 écran), reset password (2 écrans : saisie + confirmation neutre —
  jamais observée en pratique, cf. J-Lot4-2), logout (1 écran de confirmation), erreur générique (1
  gabarit couvrant accès refusé/session expirée/erreurs techniques). Soit **4 familles d'écrans**
  pour les 6 intitulés du Plan, pas 6 maquettes indépendantes.
* **Écart critique non anticipé** : le parcours « mot de passe oublié » est aujourd'hui non
  fonctionnel en pratique (§J-Lot4-2) — signalé au Product Owner avant toute maquette, plutôt que
  masqué par un habillage visuel qui laisserait croire à un parcours qui fonctionne.
* **Nouvelle dette** : absence de traduction française des écrans Keycloak (§J-Lot4-1) — à tracer
  au registre (§4).

## 4. Nouvelle dette identifiée

| ID (proposé) | Constat | Criticité |
|---|---|---|
| `DD-EP17-13` (à confirmer au registre) | Écrans Keycloak intégralement en anglais (« Sign in to your account », etc.), aucune traduction française configurée, alors que le reste du produit est en français | Majeur — incohérence linguistique visible par tout utilisateur au premier contact |

---

## 5. Synthèse — parcours retenus pour le Gate 02A, Lot 4

| Parcours | Persona | Criticité | Bloquant Gate 04A ? | État réel constaté |
|---|---|---|---|---|
| J-Lot4-1 — Se connecter | Bailleur, Gestionnaire | Élevée (point d'entrée unique) | Oui | Fonctionnel, en anglais |
| J-Lot4-2 — Réinitialiser mot de passe | Bailleur, Gestionnaire | Élevée | Oui | **Cassé (HTTP 500, SMTP absent)** |
| J-Lot4-3 — Se déconnecter | Bailleur, Gestionnaire | Faible | Non | Fonctionnel, en anglais |
| J-Lot4-4 — Erreur générique (accès refusé/session expirée) | Tous | Élevée (fréquence d'exposition) | Oui | Fonctionnel, un seul gabarit partagé |

## 6. Avis de validation — recoupement avec l'implémentation réelle (2026-08-04)

Rendu par Claude Code en tant que **UX/UI Design Lead**, sous-agent CGPA désigné
(`agent-designations-loyertracker.md`), en vue de la validation Product Owner du contenu, restée
distincte de toutes les décisions de Gate déjà rendues (`gate-04A-decision-ep17-lot4.md`,
`gate-staging-decision-ep17-lot4-pilote-keycloak.md`, `gate-production-decision-ep17-lot4-pilote-keycloak.md`).

Les quatre parcours ci-dessus ont depuis été **implémentés et vérifiés en Production réelle**
(`KEYCLOAK_THEME_DEPLOYED`, 2026-08-04) — recoupement factuel, pas une relecture :

* **J-Lot4-1** — le constat « intégralement en anglais » qui fondait ce parcours n'est plus vrai :
  `DD-EP17-13` a fermé cet écart, écran de connexion confirmé en français en Production
  (`<html lang="fr">`, « Connectez-vous à votre compte »). Le message d'erreur générique
  (« Nom d'utilisateur ou mot de passe invalide. ») reste conforme à la bonne pratique déjà notée
  ici (aucune indication email/mot de passe).
* **J-Lot4-2** — le constat « flux cassé, HTTP 500 » reste **exact et non résolu** : reproduit à
  nouveau en Staging au Lot 5 (2026-08-04), avec une précision supplémentaire non prévue par ce
  document d'origine (canal d'énumération de comptes via la différence de code HTTP), arbitrée par
  le Product Owner sans changement de traitement. L'option 1 envisagée ici (« thémer l'écran de
  saisie et l'erreur générique, sans prétendre à un parcours fonctionnel ») est celle qui a
  effectivement été retenue et implémentée.
* **J-Lot4-3** — implémenté et vérifié : écran de confirmation réel obtenu avec une session active
  (Lot 5), titre traduit « Déconnexion ».
* **J-Lot4-4** — confirmé : un seul gabarit `error.ftl` partagé couvre bien les trois causes
  distinctes (redirect_uri invalide, session/cookie absent, échec technique), chacune vérifiée
  réellement au Lot 5 avec un message français distinct et cohérent.

**Aucun écart entre ce document et l'implémentation réelle** — les quatre parcours décrits ici sont
ceux qui ont été construits, sans dérive de périmètre.
