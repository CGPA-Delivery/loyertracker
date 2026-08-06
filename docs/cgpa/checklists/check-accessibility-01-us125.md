# CHECK-ACCESSIBILITY-01 — US-125 Notifications

| Champ | Valeur |
|---|---|
| Périmètre | US-125 — Préférences et historique notifications |
| Date | 2026-08-06T06:40:53Z |
| Type | Contrôle documentaire pré-développement Gate 04A |
| Verdict | **PASS sous réserve non bloquante** |

| Contrôle | Preuve | Résultat | Bloquant |
|---|---|---|---|
| Structure sémantique et titres | Sections dédiées avec titres explicites ; historique séparé des alertes/audit | PASS | Oui |
| Navigation clavier et focus visible | `DSG-001.md` focus visible ; actions limitées et ordre logique | PASS documentaire | Oui |
| Labels, noms accessibles et erreurs | UI specs : labels permanents, `aria-describedby` pour erreurs de champ | PASS | Oui |
| Contrastes et information non fondée sur couleur | `DSG-001.md` v0.2.0, `DDS-LT-006` acceptée ; statuts combinent libellé + couleur | PASS | Oui |
| Zoom, reflow, lecteur d'écran | Reflow prévu ; messages `role=status`/`aria-live` | PASS documentaire | Oui |
| Mouvement réduit et absence de piège | `prefers-reduced-motion` existant ; modal encadré par `DDS-LT-005` | PASS sous réserve | Oui |
| Tests automatiques et manuels | Non exécutés car aucun code US-125 n'existe encore | Réserve non bloquante pré-dev | Oui |

## Réserve non bloquante

`RSV-US125-A11Y-01` — l'implémentation devra prouver en navigateur réel : focus-trap du modal de désinscription, restitution du focus, fermeture `Escape`, labels accessibles, absence d'erreur axe critique, zoom 200 %. Cette réserve bloque l'implémentation si elle n'est pas levée, mais ne bloque pas la décision documentaire Gate 04A.
