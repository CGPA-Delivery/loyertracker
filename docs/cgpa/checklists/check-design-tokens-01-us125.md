# CHECK-DESIGN-TOKENS-01 — US-125 Notifications

| Champ | Valeur |
|---|---|
| Périmètre | US-125 — usage des tokens DSG-001 |
| Date | 2026-08-06T06:40:53Z |
| Verdict | **PASS documentaire** |

| Contrôle | Preuve | Résultat |
|---|---|---|
| Palette et surfaces | `DSG-001.md` v0.2.0, `DDS-LT-006` acceptée | PASS |
| Texte primaire/secondaire | Tokens `--lt-text-*` définis | PASS |
| États info/success/warning/danger | Mapping US-125 aligné `DDS-LT-004` | PASS |
| Focus ring | `--lt-focus-ring*` défini, contraste conforme | PASS |
| Breakpoint mobile | `--lt-breakpoint-mobile: 640px` | PASS |
| Interdiction couleurs en dur nouvelles | `DSG-001.md` règle d'usage | PASS |

## Contrainte d'implémentation

Tout code Frontend US-125 devra consommer les tokens existants ou ouvrir une DDS dédiée avant introduction d'un nouveau token.
