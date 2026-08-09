# Addendum — revue parallèle de l’audit backlog

**Date :** 2026-08-09  
**Référence :** `audit-complet-backlog-projet-2026-08-09.md`  
**Nature :** correction factuelle et extension du périmètre, sans modification applicative

## 1. Corrections factuelles

### Plages d’identifiants absentes

Le rapport initial indiquait une plage absente `US-73→US-89`. La revue historique confirme qu’EP-09 utilise `US-80→US-85` (`addendum-patrimoine-backlog.md`). Les plages réellement non retrouvées sont donc :

- `US-73→US-79` ;
- `US-86→US-89`.

Ces plages restent à requalifier : elles peuvent être réservées, annulées, ou correspondre à des stories non migrées dans les addenda.

### EP-17 / EP-18 / EP-19

La classification affinée est la suivante :

| Périmètre | Statut corrigé |
|---|---|
| EP-17 US-127 | Partielle, baseline globale encore incomplète |
| EP-17 US-128 | Livrée |
| EP-17 US-129→131 | Livrées |
| EP-17 US-132 | Livrée, GO sous réserve |
| EP-17 US-133→134 | Livrées sur le périmètre restreint Biens/Patrimoines |
| EP-17 US-135 | Livrée pour le thème Keycloak restreint |
| EP-17 US-136→140 | Partiellement couvertes, sans clôture globale EP-17 |
| EP-17 US-141 | Partielle : preuve Staging Keycloak, pas de Gate applicatif global |
| EP-17 US-142 | Non livrée / à cadrer |
| EP-18 US-135→138 | Livrées dans `1.16.0`, mais collision d’identifiants avec EP-17 |
| EP-18 US-139 | Livrée dans `1.16.0`, mais collision d’identifiant |
| EP-18 US-140 | Livrée fonctionnellement, mais collision d’identifiant |
| EP-18 US-143 | Fondation technique implémentée et mergée dans PR #368/`8c9f1e4`, non livrée opérationnellement ; validation reclassée EP-19 |
| EP-19 US-144→147 | Non livrées, Epic futur |

`US-143` ne doit donc ni être déclarée absente, ni être déclarée entièrement livrée : la signature et le contrôleur webhook existent et sont mergés, mais aucun webhook Resend/Svix réel n’a validé la chaîne de délivrabilité.

## 2. User Stories / bugs fonctionnels oubliés ou insuffisamment backlogués

La revue architecture/produit fait ressortir les éléments suivants. Ils ne doivent pas être ajoutés silencieusement au backlog : ils nécessitent une décision PO/CDO et un type explicite (bug, US, spike ou tâche documentaire).

### P0 — à enregistrer avant une nouvelle promotion

| Élément | Impact | Type recommandé |
|---|---|---|
| Flux Keycloak « mot de passe oublié » cassé ; différence de comportement selon l’existence du compte | Parcours critique indisponible et risque d’énumération de comptes | Bug sécurité/produit |
| Absence d’UI Angular d’acceptation d’invitation gestionnaire | EP-18 peut envoyer un e-mail, mais le gestionnaire ne dispose pas d’un parcours web complet | Nouvelle US UI invitation |
| Export/effacement RGPD incomplet pour les tables `notification_*` | Risque de données de notification non couvertes par les droits RGPD | US RGPD/sécurité |
| Budget e-mail Resend non clairement isolé du budget générique notifications | Risque de contrôle de coûts incomplet et d’écart avec ADR-19 | Spike/bug architecture |

### P1 — à planifier séparément

| Élément | Impact | Type recommandé |
|---|---|---|
| Plan hypercare T+12/T+24 de `v1.17.0-rc.1` absent comme artefact dédié | Risque de preuve opérationnelle incomplète | Tâche Ops/CGPA |
| Observabilité Resend non détaillée comme service externe critique | Métriques, alertes et runbook bounce/plainte incomplets | US observabilité |
| Runbook rollback/exploitation encore aligné sur V1→V10 alors que le dépôt est à V32 | Procédure opérationnelle obsolète | Bug documentation Ops |
| États 403/404 frontend non uniformisés | Parcours d’erreur et routage potentiellement trompeurs | US frontend |
| Boutons globaux mesurés à environ 35 px au lieu de la cible ≥44 px | Non-conformité accessibilité/tactile | Bug a11y |
| Régression visuelle non industrialisée | Gates UI dépendants de preuves manuelles | Spike Visual Review |
| Archivage Bien sans garde active bail/affectation suffisamment démontrée | Risque métier d’archiver un bien encore actif | Bug métier |
| UI Angular dédiée EP-15 Gestionnaire/Locataire absente | Les US-105→112 sont livrées côté API, mais l’expérience UI dédiée reste manquante | US frontend à créer ou portée à clarifier |

## 3. Statut consolidé après la revue

Le backlog doit désormais être considéré comme :

```text
FONCTIONNELLEMENT RICHE MAIS NON CONSOLIDÉ
avec des stories livrées, des stories partielles, des fondations non promues,
des bugs critiques non représentés et des identifiants réutilisés.
```

Le prochain travail autorisé sur Dev est la normalisation de cette matrice, pas l’implémentation spontanée d’une des anomalies ci-dessus.

## 4. Décision recommandée

Maintenir le **NO GO fonctionnel** jusqu’à :

1. décision sur les plages `US-73→79` et `US-86→89` ;
2. résolution de la collision EP-17/EP-18 `US-135→140` ;
3. requalification de `US-136→142` EP-17 ;
4. validation PO/CDO de la portée des nouveaux bugs/US P0 ;
5. production d’une matrice unique Story → code → test → Gate → environnement → décision humaine.

La Production `v1.17.0-rc.1` reste gelée et aucun de ces éléments ne justifie un changement pendant l’hypercare.