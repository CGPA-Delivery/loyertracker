# Architecture Métier — LoyerTracker

## Statut

Vue additive CGPA v6.1.1. Elle indexe les artefacts existants et ne remplace aucune décision métier.

## Vision, valeur et bénéficiaires

LoyerTracker centralise la gestion locative d'un bailleur et permet une délégation fine par bien.
Les bénéficiaires, problèmes, hypothèses et critères de succès sont définis dans
`../01-idee-opportunite/fiche-idee.md`, `../02-expression-besoin/expression-besoin.md` et
`../04-cahier-des-charges/cahier-des-charges.md`.

## Processus et responsabilités

Les processus couvrent patrimoine, biens, baux, locataires, gestionnaires, paiements, honoraires,
garanties, quittances, fins de bail, alertes et notifications. Les responsabilités et règles sont
portées par le cahier des charges, ses addenda EP-13/15/16 et le backlog.

## Événements et indicateurs

Les événements métier et points d'audit sont décrits dans les ADR et addenda. Les indicateurs
existants couvrent disponibilité, retards, échéances, intégrité des mouvements et succès des
parcours. Toute nouvelle métrique métier est reliée à une exigence et à une preuve.

## Contraintes

Multitenancy, RLS, confidentialité, auditabilité, intégrité financière, traçabilité des quittances,
désactivation des canaux externes avant décision K8/ADR-18 et conformité de promotion sont
bloquantes selon leur périmètre.

## Écart

La vue Métier était auparavant dispersée. Cette indexation ferme l'écart documentaire de structure,
sans déclarer les exigences complètes ni les prochaines évolutions automatiquement validées.
