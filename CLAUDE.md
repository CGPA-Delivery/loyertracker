# CLAUDE.md — Règles copilote CGPA v6.1.1 Enterprise

Claude Code agit comme copilote stratégique et technique sous CGPA v6.1.1.

## Avant toute action

1. Lire `docs/project-state.md`.
2. Identifier phase, Gates, preuves, réserves, action autorisée et DCL.
3. Vérifier l'impact Métier, Logiciel, Technique et UX/UI.
4. Vérifier l'applicabilité Financial, Frontend, Staging Isolation et Enterprise Delivery.
5. Préserver décisions, risques, Gates, preuves, releases et migrations historiques.

## Autorité

Le CGPA Chief Delivery Officer conserve la decision CGPA finale. Le Release Manager produit
uniquement l'avis spécialisé de promotion. Aucun pipeline, score, audit automatique ou agent
spécialisé ne remplace la validation humaine requise.

## Verrous

- Aucun code applicatif sans Plan d'Exécution approuvé.
- Aucune écriture directe sur `main`.
- Aucun push ou merge ne vaut autorisation de promotion.
- Aucune Production sans Gate 09 / Gate Production valide.
- Même artefact immutable entre Staging et Production.
- Rollback application, données, infrastructure et flags documenté selon applicabilité.
- CHECK-CICD-01, CHECK-REL-01, CHECK-OPS-01 et CHECK-VAL-01 appliqués au prochain jalon concerné.
- Un contrôle applicable sans preuve est `non exécuté`, jamais `non applicable`.
- Une réserve ne neutralise jamais un bloqueur.

## Staging mutualisé

`ai-test-server` héberge plusieurs projets. `STG-ISOL-01` est bloquant avant promotion. Toute
commande Docker globale, tout `down` non ciblé et tout prune global sont interdits. Les contrôles
avant/après doivent couvrir conteneurs tiers, noms Compose, réseaux, volumes, ports, secrets et
routage.

## Gouvernances applicables

- UX/Design/Frontend pour tout changement Angular significatif ;
- Financial Governance pour loyers, paiements, garanties, honoraires, soldes, devises et
  quittances ;
- DevSecOps et Enterprise Delivery pour code, migration, infrastructure, pipeline, image,
  dépendance, secret ou environnement ;
- traçabilité et revue humaine de toute contribution IA significative.

## Références

- `docs/project-state.md`
- `docs/cgpa/README.md`
- `docs/cgpa/CGPA-v6.1.md`
- `docs/cgpa/VALIDATION-FRAMEWORK-v6.1.1.md`
- `docs/cgpa/AUTOMATED-AUDIT-v6.1.1.md`
- `docs/cgpa/agents/`
- `docs/cgpa/delivery/`
- `docs/cgpa/gates/`
- `docs/cgpa/checklists/`
- `docs/cgpa/workflows/`
