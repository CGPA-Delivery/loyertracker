import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { providePrimeNG } from 'primeng/config';

import { LtPreset } from './lt-preset';

/**
 * US-130 — vérifie que le thème LoyerTracker (`LtPreset`) surcharge bien la palette par défaut
 * d'Aura (`primary` = emerald) plutôt que de la laisser transparaître, conformément au critère GWT
 * de US-130 : « aucun composant PrimeNG n'affiche sa palette par défaut ».
 */
@Component({
  standalone: true,
  imports: [Button],
  template: `<p-button label="Test" />`,
})
class HostComponent {}

describe('LtPreset (US-130)', () => {
  beforeEach(() => {
    document.documentElement.classList.add('p-dark');
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        providePrimeNG({
          theme: { preset: LtPreset, options: { darkModeSelector: '.p-dark' } },
        }),
      ],
    });
  });

  afterEach(() => {
    document.documentElement.classList.remove('p-dark');
  });

  it("n'affiche pas la couleur primaire par défaut d'Aura (emerald)", () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--p-primary-color')
      .trim();

    expect(primaryColor).not.toBe('');
    // Emerald (Aura par défaut) : #10b981/#34d399. Notre thème ancre `primary` sur `sky`
    // (#0ea5e9/#38bdf8, cf. --lt-focus-ring) — la valeur résolue ne doit contenir aucune des deux.
    expect(primaryColor.toLowerCase()).not.toContain('16, 185, 129'); // emerald-500 en rgb
    expect(primaryColor.toLowerCase()).not.toContain('52, 211, 153'); // emerald-400 en rgb
  });

  it('ancre la surface sur la famille slate (pas zinc, défaut Aura en mode sombre)', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const surface900 = getComputedStyle(document.documentElement)
      .getPropertyValue('--p-surface-900')
      .trim();

    // slate-900 = #0f172a = rgb(15, 23, 42) ; zinc-900 (défaut Aura sombre) = #18181b = rgb(24, 24, 27).
    expect(surface900.toLowerCase()).not.toContain('24, 24, 27');
  });
});
