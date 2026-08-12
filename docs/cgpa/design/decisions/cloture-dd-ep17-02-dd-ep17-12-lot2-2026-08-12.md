# Décision de clôture — DD-EP17-02 et DD-EP17-12 (EP-17 Lot 2)

| Champ | Valeur |
|---|---|
| Date | 2026-08-12 |
| Périmètre | `DD-EP17-02`, `DD-EP17-12` |
| Release applicative | PR #462, merge `2b2b82cda49b31a2caebaef589f6d8e683118a1e` |
| Gate Staging | GO / `STAGING_DEPLOYED`, PR #463, merge `c98f5838bdb045a9be8433ebb6428f14e0feae7f` |
| Recette humaine | PASS, PR #464, merge `20e2838236bd3ae573e0157c4cfcc78d672425f4` |
| Décision | **CLOSE — preuves techniques, Staging et recette humaine complètes** |

## 1. DD-EP17-12 — Acceptation publique d’invitation

**Preuves de fermeture :**

- `InvitationAcceptationComponent` et route publique `/invitations/:token` livrés dans PR #462 ;
- formulaire nom/prénom/mot de passe, états de succès et erreurs couverts ;
- smoke Staging réel : invitation → acceptation publique → compte Keycloak/JWT Gestionnaire, inclus dans **63 PASS / 0 FAIL** ;
- recette humaine externe du PO/CDO : **PASS**.

**Statut : CLOSE.** Le défaut qui consistait à générer un lien sans route Frontend est résolu dans l’artefact immuable validé sur Staging.

## 2. DD-EP17-02 — États 403/404

**Preuves de fermeture :**

- composants 403 et 404, routes dédiées et intercepteur HTTP livrés dans PR #462 ;
- fallback Frontend explicite livré ;
- CI post-merge, smoke Staging **63 PASS / 0 FAIL** et recette humaine **PASS** couvrent le périmètre déclaré.

**Statut : CLOSE.** Les états d’accès refusé et ressource introuvable ne reposent plus sur le fallback silencieux historique.

## 3. Limites préservées

- Cette clôture ne ferme pas `DD-EP17-14`, `DD-611-03`, les réserves e-mail/DMARC, ni le Gate 04A global.
- La validation est limitée à Staging et à la recette humaine consignée ; elle **n’autorise aucune promotion ou action Production**.
- Toute future promotion devra conserver les digests immuables déjà validés et passer ses contrôles et Gate Production propres.
