import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Thème PrimeNG LoyerTracker — US-130 (Lot 1, EP-17).
 *
 * Étend le preset Aura (base PrimeNG) en ancrant `primary` et `surface` sur les mêmes familles
 * Tailwind que les Design Tokens LoyerTracker (DSG-001.md v0.2.0, `--lt-*`) :
 *  - `primary` = famille `sky` (Aura par défaut : `emerald`) — aligné sur `--lt-focus-ring`
 *    (`#38bdf8`, sky-400) et `--lt-state-info` (`#bae6fd`, sky-200), seul accent de marque défini
 *    par le DSG.
 *  - `surface` = famille `slate` (Aura par défaut, mode sombre : `zinc`) — aligné sur
 *    `--lt-surface-page`/`--lt-color-background` (`#0f172a`, slate-900). L'app n'a qu'un seul mode
 *    (sombre, DSG-001.md §Dark Mode) : la référence unique `surface` = slate évite d'introduire
 *    une seconde famille de gris (le `#111827`/gray-900 déjà en dur dans `styles.scss` reste une
 *    dette pré-existante distincte, hors périmètre de US-130).
 *
 * Tous les autres tokens sémantiques (formField, list, overlay, navigation, content, mask,
 * highlight…) référencent `{primary.*}`/`{surface.*}`/`{text.*}` par composition — ils héritent
 * automatiquement de ces deux surcharges sans réécriture individuelle.
 */
export const LtPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    },
    surface: {
      0: '{slate.50}',
      50: '{slate.50}',
      100: '{slate.100}',
      200: '{slate.200}',
      300: '{slate.300}',
      400: '{slate.400}',
      500: '{slate.500}',
      600: '{slate.600}',
      700: '{slate.700}',
      800: '{slate.800}',
      900: '{slate.900}',
      950: '{slate.950}',
    },
  },
});
