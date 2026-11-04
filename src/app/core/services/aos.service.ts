import { DOCUMENT } from '@angular/common';
import { Injectable, afterRenderEffect, inject } from '@angular/core';
import AOS from 'aos';
import { LanguageService } from '../i18n/language.service';

/**
 * Thin wrapper around AOS (Animate On Scroll).
 *
 * - Respects `prefers-reduced-motion`.
 * - Re-measures element positions whenever the language changes, because
 *   switching LTR <-> RTL and translated text reflow the page.
 *
 * Usage in templates: `<div data-aos="fade-up" data-aos-delay="100">`.
 * Prefer `fade-start` / `fade-end` over `fade-left` / `fade-right` so the
 * motion follows the reading direction (see styles/_aos.scss).
 */
@Injectable({ providedIn: 'root' })
export class AosService {
  private readonly window = inject(DOCUMENT).defaultView;
  private readonly language = inject(LanguageService);

  private initialized = false;

  constructor() {
    // Runs in the browser only, after Angular has finished rendering.
    afterRenderEffect(() => {
      this.language.lang();
      this.refresh();
    });
  }

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      offset: 80,
      once: true,
      disable: () => this.window?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false,
    });
  }

  refresh(): void {
    if (this.initialized) AOS.refreshHard();
  }
}
