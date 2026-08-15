# Addendum PO/CDO — EP20-US06 : lecture Gestionnaire ReBAC

| Champ | Valeur |
|---|---|
| Date | 2026-08-15 |
| Story | `EP20-US06` — complément serveur borné |
| Autorité | PO/CDO — Jordan Tshilombo Kabamba (`Approuvé`) |
| Déclencheur | Preuve responsive locale : `/gestionnaire` déclenche un `403` sur le chargement des biens affectés, puis la redirection de sécurité Frontend. |
| État | **GO / EP20-US06_GESTIONNAIRE_REBAC_DESIGN_READY** |

## Constat factuel

Le deep-link HTTPS `/gestionnaire` est servi par Nginx (`200`) et le bundle courant conserve déjà la route de retour OIDC. Le refus provient du contrat lecture : le dashboard Gestionnaire appelle `S02ApiService.listerBiens()` et reçoit `403`. L’intercepteur Frontend redirige alors vers l’état interdit ; il ne doit pas être affaibli pour masquer un refus ReBAC.

## Autorisation documentaire

Le PO/CDO autorise l’instruction du complément Backend/API suivant :

- identifier le endpoint serveur de lecture des biens affectés par un Gestionnaire ;
- définir la règle ReBAC/RLS fail-closed : Gestionnaire affecté actif => lecture limitée à ses biens ; Gestionnaire non affecté ou autre tenant => `403` ;
- confirmer le DTO minimal réutilisé par le dashboard et l’absence de PII/secret inutile ;
- préparer les scénarios d’intégration : affecté `200`, non affecté `403`, cross-tenant `403` ;
- vérifier si une migration est réellement nécessaire. Toute migration éventuelle exige un addendum distinct, reste additive et est testée sur base fraîche.

## Limites impératives

Cet addendum **n’autorise pas encore de code Backend/API**, migration Flyway, changement RLS, Staging, Production, provider, secret, envoi réel ou contournement Frontend du `403`.

Après fusion humaine de cet addendum et CI verte, une décision PO/CDO distincte est requise avant une branche d’implémentation serveur.
