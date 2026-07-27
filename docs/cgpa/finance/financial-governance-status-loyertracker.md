# État Financial Governance — LoyerTracker

## Applicabilité

Applicable sans exemption globale : loyers, paiements, honoraires, garanties, mouvements, soldes,
devises et quittances sont des objets financiers du produit.

## Acquis

ADR-13 Money/Devise, ADR-14 Garantie ledger, BigDecimal/NUMERIC(12,2), devises EUR/USD/CDF,
mouvements crédit/débit, invariant solde-somme, audit, RLS et tests historiques.

## Contrôles v6.1.1

- `ADR-FIN-001.md` : référence normative active.
- `CHECK-FIN-01.md` : obligatoire au prochain changement, merge, clôture Sprint ou Gate financier.
- `FIN-ARCH-001.md` et `FIN-DOMAIN-GUIDE.md` : références d'architecture.

## Écarts et risques

| ID | Criticité | Constat | Effet |
| --- | --- | --- | --- |
| FIN-IMMUT-01 | Bloquant au prochain Gate financier | UPDATE/DELETE autorisés en base sur `garantie_movement` | immutabilité du ledger non démontrée |
| FIN-CONC-01 | Bloquant au prochain changement Garantie | absence de verrou/version et test concurrent du solde | risque de perte de mise à jour ou solde incohérent |
| FIN-ROUND-01 | Majeur | politique setScale/RoundingMode et limites non formalisée | résultat monétaire insuffisamment déterministe |
| FIN-COMP-01 | Majeur | correction exclusivement compensatoire non démontrée | correction historique potentiellement mutable |

Ces écarts ne rejouent ni n'invalident les releases historiques. Ils imposent un Plan d'Exécution
avant correction applicative et CHECK-FIN-01 au prochain jalon concerné. Tout FAIL critique impose
NO GO.
