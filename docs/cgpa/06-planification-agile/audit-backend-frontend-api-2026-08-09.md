# Audit Backend ↔ Frontend — APIs et endpoints

**Date :** 2026-08-09  
**Cadre :** CGPA v6.1.1  
**Release protégée :** `v1.17.0-rc.1` sous hypercare  
**Mode :** audit statique lecture seule  
**Statut :** validé comme règle de gouvernance PO/CDO

## 1. Résultat de l’audit

| Contrôle | Résultat |
|---|---:|
| Contrôleurs Spring | 24 |
| Endpoints applicatifs Backend | 71 |
| Endpoints Actuator | 4 |
| Total endpoints Backend | **75** |
| Usages API Angular uniques | **44** |
| Appels Angular sans endpoint Backend correspondant | **0** |
| Endpoints Backend non trouvés dans Angular | **27** |

Les 44 appels Frontend identifiés correspondent à des endpoints Backend existants. Aucun appel Angular orphelin n’a été trouvé.

L’absence d’appel dans `frontend/src` ne prouve pas qu’un endpoint est inutilisé : les autres consommateurs possibles sont les smoke tests, batchs d’exploitation, scripts Ops, Actuator/Prometheus, fournisseurs Twilio/Resend, QR/public receipts, tests d’intégration et workflows RGPD.

## 2. Surfaces Backend non trouvées directement dans Angular

Les surfaces suivantes sont couvertes par le Backend mais non retrouvées dans les appels Angular directs :

- cycle avancé Locataire : vérification doublon, détail, modification, suppression, restauration, historique ;
- clôture/réouverture de bail ;
- cycle Gestionnaire : liste, doublon, détail, modification, suspension, réactivation, archivage, restauration, historique ;
- création/suppression Patrimoine ;
- invitations et acceptation tokenisée ;
- annulation de quittance ;
- batch notifications ;
- callbacks publics Twilio et Resend/Svix ;
- export/effacement RGPD ;
- Actuator health/info/Prometheus.

Classification retenue :

- callbacks fournisseurs : **non-UI attendu** ;
- Actuator/Prometheus : **contrat Ops** ;
- batch : **exploitation/tests** ;
- RGPD : **contrat conformité** ;
- invitations, gestionnaires, locataires avancés, annulation quittance et cycles métier : **Backend livré / couverture UI absente ou incomplète à clarifier**.

Aucun endpoint n’est déclaré orphelin, legacy ou supprimable sur la seule base de cet audit statique.

## 3. Règle normative avant toute suppression ou dépréciation

Avant toute suppression future d’un endpoint, la procédure suivante est obligatoire :

1. recherche Angular complète ;
2. recherche des wrappers et appels indirects ;
3. vérification smoke/tests/backend ;
4. vérification NGINX, batch, monitoring et providers ;
5. recherche des consommateurs externes ;
6. vérification des logs d’usage si disponibles ;
7. décision PO/CDO ;
8. PR dédiée avec tests de non-régression ;
9. plan de rollback.

Une suppression est interdite tant que les neuf contrôles ne sont pas documentés, que les consommateurs potentiels ne sont pas qualifiés et que la décision PO/CDO n’est pas tracée.

## 4. Limite de preuve

L’audit réalisé est statique. Il n’a pas interrogé les logs runtime Production ni les métriques de trafic.

La conclusion porte donc précisément sur les usages détectés dans le code frontend et les consommateurs documentés ; elle ne constitue pas une preuve absolue d’absence de trafic Production.

Une future décision de dépréciation devra compléter cette limite par une vérification runtime lorsque les logs/métriques sont disponibles.

## 5. Décision gouvernée

Le PO/CDO approuve la règle des neuf contrôles comme prérequis obligatoire à toute suppression ou dépréciation d’endpoint. Cette validation n’autorise aucune suppression, modification applicative, migration, déploiement, activation provider, changement d’observabilité ou intervention Production.
