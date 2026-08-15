# Addendum PO/CDO — EP20-US06 : audit Gestionnaire ReBAC

| Champ | Valeur |
|---|---|
| Date | 2026-08-15 |
| Story | `EP20-US06` — complément Audit/ReBAC |
| Autorité | PO/CDO — Jordan Tshilombo Kabamba (`2`) |
| Déclencheur | Preuve runtime : `GET /api/audit` retourne `403` au dashboard Gestionnaire. |
| État | **GO / EP20-US06_GESTIONNAIRE_AUDIT_REBAC_DESIGN_READY** |

## Constat

`/api/audit` est délibérément réservé au rôle `BAILLEUR`. Le composant Audit ne devrait historiquement être monté que dans l’espace bailleur ; son montage dans le dashboard Gestionnaire fait échouer la preuve responsive sans constituer une défaillance OIDC.

L’entrée `audit_log` contient le tenant `bailleur_id`, l’acteur et l’entité, mais ne porte pas systématiquement un `bien_id`. Une simple ouverture du journal tenant entier au Gestionnaire violerait le moindre privilège.

## Autorisation documentaire

Le PO/CDO autorise l’instruction d’un complément serveur strictement borné :

- définir les actions et types d’entités consultables par un Gestionnaire affecté ;
- définir une dérivation vérifiable de chaque entrée vers un bien affecté, ou constater qu’une persistance additive de provenance est nécessaire ;
- conserver fail-closed : toute entrée non rattachable à un bien affecté reste invisible ;
- préparer les preuves d’intégration : Gestionnaire affecté voit seulement les entrées autorisées de son bien ; non affecté et cross-tenant ne voient aucune entrée ni élargissement ; Bailleur conserve son journal tenant ;
- analyser la compatibilité RLS et l’absence de PII, secret, token, QR ou hash non nécessaire.

## Limites

Cet addendum n’autorise **aucun code Backend/API**, modification de `@PreAuthorize`, changement RLS, migration Flyway, Staging, Production, provider, secret ou envoi réel.

Si `bien_id` ou une autre provenance durable est nécessaire, une migration Flyway additive et un addendum d’implémentation distinct sont obligatoires. Après fusion humaine/CI de cette décision, un GO PO/CDO séparé reste requis avant toute branche serveur.
