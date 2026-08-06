# CHECK-RESPONSIVE-01 — US-125 Notifications

| Champ | Valeur |
|---|---|
| Périmètre | US-125 — Préférences et historique notifications |
| Date | 2026-08-06T06:40:53Z |
| Type | Contrôle documentaire pré-développement Gate 04A |
| Verdict | **PASS sous réserve non bloquante** |

| Contrôle | Preuve | Résultat | Bloquant |
|---|---|---|---|
| Breakpoint mobile défini | `DSG-001.md` §Responsive Rules : référence `640px`; `phase-02-ui-mockups.md` §5 | PASS | Oui |
| Reflow formulaire | UI specs : formulaire une colonne sur petit écran, labels persistants | PASS | Oui |
| Reflow historique | UI specs : liste simple, lignes empilables, pas de tableau dense en première itération | PASS | Oui |
| Touch targets | `DSG-001.md` cible `≥ 44×44px`; boutons principaux à valider en implémentation | PASS sous réserve | Oui |
| Contenu prioritaire | Aucun montant financier masqué ; statut, canal, date et motif restent visibles | PASS | Oui |
| Navigation clavier/mobile | Actions limitées : enregistrer, désinscrire, rafraîchir, fermer modal | PASS documentaire | Oui |
| Appareils représentatifs | Non exécuté car aucun code US-125 n'existe encore | Réserve non bloquante pré-dev | Oui |

## Réserve non bloquante

`RSV-US125-RESP-01` — exécuter une vérification navigateur réelle aux largeurs `360px`, `390px`, `640px`, `1024px` sur la PR d'implémentation Frontend avant tout merge applicatif. Cette réserve ne bloque pas le Gate 04A documentaire, mais bloquera la validation de l'implémentation.
