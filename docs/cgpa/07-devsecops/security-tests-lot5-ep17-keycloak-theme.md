# Tests de sécurité Lot 5 — Thème Keycloak EP-17 Lot 4

| Champ | Valeur |
|---|---|
| Date | 2026-08-04 |
| Périmètre | Les 6 écrans confirmés du thème `login/` (`plan-execution-ux-ui-primeng-keycloak.md` §3 Lot 4) : login, mot de passe oublié, reset password, session expirée, accès refusé, logout |
| Environnement | Staging (`ai-test-server`), port interne `18443`, flux OIDC/PKCE réels contre le realm `loyertracker`, client public `loyertracker-spa` — aucun mock |
| Instruction reçue | « continue le pilote Keycloak, lot 5 tests sécurité » — exécution des 11 scénarios listés au Plan d'Exécution §5 (« Tests de sécurité prévus au Lot 5 »), adaptés au périmètre confirmé à 6 écrans (`invitation expirée` et Account Console hors périmètre, `DD-EP17-12`) |
| Verdict | **PASS — aucune régression de sécurité introduite par le thème** ; une aggravation de `DD-EP17-14` (préexistante, indépendante du thème) constatée et documentée |

## Méthode

Chaque scénario est exécuté par une requête HTTP réelle (`curl`) reproduisant le flux OIDC/PKCE
qu'un navigateur exécuterait (code_verifier/code_challenge S256 réels, cookies de session suivis
d'une requête à l'autre, action de formulaire extraite du HTML réellement rendu — jamais une URL
supposée). Aucun template FreeMarker n'est modifié par cette vérification, elle n'exerce que le
thème CSS déjà livré (`DD-EP17-01`, close). Un utilisateur éphémère est créé via l'API Admin pour
les scénarios nécessitant un compte réel (positive control), puis supprimé en fin de script —
aucun résidu. Le compte `bailleur-test@test.local` (`enabled=false` en Staging) sert de compte
désactivé réel pour le scénario dédié, sans jamais consulter son mot de passe réel.

## Résultats

| # | Scénario | HTTP | Constat réel | Fuite d'information |
|---|---|---|---|---|
| 1 | Login invalide (identifiants inexistants) | 200 | « Nom d'utilisateur ou mot de passe invalide. » — français, générique | Aucune |
| 2 | Login valide + redirection après login | 302 | Redirection vers `redirect_uri` déclaré avec `code=`/`session_state=`/`iss=` conformes | Aucune |
| 3 | Compte désactivé (`bailleur-test`, mauvais mot de passe) | 200 | **Message strictement identique au scénario 1** — aucune distinction observable entre « mot de passe faux » et « compte désactivé » dans ce cas | Aucune dans ce cas testé — cf. limite ci-dessous |
| 4 | Mot de passe oublié — e-mail inexistant | 200 | « Vous devriez recevoir rapidement un courriel avec de plus amples instructions. » (succès générique, anti-énumération correct) | Aucune |
| 4bis | Mot de passe oublié — e-mail réel existant | **500** | « Erreur lors de l'envoi du courriel, veuillez essayer plus tard. » (français, générique, sans trace technique) | **Oui — cf. constat clé ci-dessous** |
| 5 | Reset expiré / lien invalide (`action-token` bidon) | 400 | « Une erreur est survenue, veuillez vous reconnecter à votre application. » — français, générique | Aucune |
| 6 | Session expirée (cookies absents à la soumission) | 400 | « Cookie introuvable. Assurez-vous que les cookies soient activés dans votre navigateur. » — français | Aucune |
| 7 | Accès refusé (`redirect_uri` non enregistré) | 400 | « Paramètre invalide : redirect_uri » — français, comportement Keycloak standard, déjà observé avant le thème | Nom de paramètre OAuth standard, pas un détail d'implémentation |
| 8 | Logout — sans session active | 302 | Redirection immédiate vers `post_logout_redirect_uri`, aucune confirmation (rien à confirmer sans session) | Aucune |
| 8bis | Logout — avec session active, sans `id_token_hint` | 200 | Écran de confirmation réel affiché, titre « Déconnexion », thème appliqué | Aucune |

Sur les 8 corps de réponse inspectés directement (pas seulement les en-têtes) : **aucune trace**
d'exception Java, de nom de package `org.keycloak.*`, de `SQLException`, de numéro de version
Keycloak, ni d'aucun autre détail technique — conforme à l'interdiction `ADR-UI-001` §Sécurité
« ne jamais exposer un détail technique ». Le thème est confirmé actif sur les 8 écrans
(`login.css` et classe `card-pf` présents dans chaque corps HTML capturé).

## Constat clé — `DD-EP17-14` crée un canal d'énumération de comptes

Le scénario 4 (e-mail inexistant → 200 succès générique) et le scénario 4bis (e-mail réel →
500 erreur) **diffèrent par leur code de statut HTTP**, pas seulement par leur contenu. Un
attaquant peut donc distinguer un compte existant d'un compte inexistant en observant uniquement
si la soumission échoue (500) ou réussit apparemment (200) — sans avoir besoin de lire le message
affiché. C'est un canal d'énumération de comptes, conséquence directe de la panne SMTP déjà
tracée sous `DD-EP17-14`, mais plus précis que le simple « flux cassé » initialement consigné :
l'échec n'est pas uniforme, il **varie selon que le compte existe**, ce qui en fait un problème de
confidentialité (énumération), pas seulement de disponibilité fonctionnelle.

Ce constat **ne remet pas en cause la clôture de `DD-EP17-01`** (le thème lui-même ne cause ni
n'aggrave la logique de statut HTTP — c'est un comportement du backend Keycloak/SMTP, hors du
CSS/`theme.properties` livré) et **ne change pas le traitement déjà décidé de `DD-EP17-14`**
(résolution SMTP reste la seule preuve attendue, suivi découplé du Lot 4, PO 2026-08-02) — il en
précise la nature et renforce la priorité déjà propre de cette dette. Détail consigné dans
`design-debt-register-loyertracker.md` (`DD-EP17-14`).

## Limite du scénario 3 (compte désactivé), tracée honnêtement

Le test exécuté utilise un **mot de passe incorrect** sur le compte désactivé `bailleur-test` — son
mot de passe réel n'a délibérément pas été consulté (discipline de manipulation des secrets). Ce
test confirme l'absence de fuite **dans ce cas précis**. Le comportement Keycloak avec le **mot de
passe correct** sur un compte désactivé n'a pas été vérifié ici — le comportement par défaut de
Keycloak dans ce cas (message `accountDisabledMessage` distinct, potentiellement non traduit) est
documenté dans la littérature Keycloak mais reste une hypothèse non vérifiée sur ce realm précis,
à couvrir si jugé nécessaire (nécessiterait un compte de test dédié dont le mot de passe est connu
et volontairement désactivé, plutôt que de manipuler le mot de passe de `bailleur-test`).

## Ce que ce travail ne couvre pas

Conformément au périmètre demandé (« tests sécurité »), cette vérification couvre les 11 scénarios
de sécurité du Plan §5, pas l'ensemble plus large du Lot 5 (§9 du Plan) : tests unitaires/composants
Angular, tests d'accessibilité automatisés, tests manuels clavier exhaustifs, tests responsive
formels, Visual Review, régression visuelle, comparaison de bundle. Des signaux positifs ont été
observés en passant (viewport mobile présent, `aria-live`/`aria-invalid`/`label for=` présents sur
le formulaire de connexion) mais ne constituent pas une preuve formelle de ces lignes du tableau
§9 — elles restent `Non exécuté` tant qu'un contrôle dédié n'est pas mené.

Cette exécution est une **vérification, pas une décision de Gate** : elle ne prononce ni GO ni
NO GO sur le Lot 5 ou le Gate Staging du pilote — ces décisions restent, conformément à `CLAUDE.md`,
des actes distincts nécessitant validation humaine explicite.

## Conclusion

Aucune régression de sécurité introduite par le thème Keycloak (`DD-EP17-01`) sur les 8 scénarios
testés. Les 13 interdictions de sécurité `ADR-UI-001` §Sécurité restent respectées (audit statique
du 2026-08-03, confirmé ici par un audit dynamique — comportement réel identique à l'attendu). Une
aggravation de `DD-EP17-14` (canal d'énumération de comptes) est documentée avec précision,
indépendante du thème, sans nouvelle action requise au-delà du suivi déjà décidé par le Product
Owner.
