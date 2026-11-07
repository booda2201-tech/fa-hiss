import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { gsap } from 'gsap';
import { EXTERNAL_LINKS } from '../../../core/config/site.config';
import { LanguageService } from '../../../core/i18n/language.service';
import { IconComponent } from '../../../shared/ui/icon/icon.component';

interface HeadlineLine {
  readonly accent: boolean;
  readonly words: readonly string[];
}

/**
 * Full-screen hero.
 *
 * The headline is split into WORDS (never characters): splitting Arabic into
 * letters would break its cursive joining.
 * All motion is created inside `gsap.matchMedia()` so it is skipped for users
 * who prefer reduced motion, and is fully reverted on destroy / language change.
 */
@Component({
  selector: 'app-hero',
  imports: [RouterLink, TranslatePipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  host: { class: 'block' },
})
export class HeroComponent {
  private readonly translate = inject(TranslateService);
  private readonly language = inject(LanguageService);

  /** Optional hero photo (e.g. `images/hero-bg.jpg`). Falls back to the green gradient scene. */
  readonly backgroundImage = input<string | null>(null);

  /** Optional list of photos shown as a cross-fading slideshow (takes precedence over `backgroundImage`). */
  readonly slides = input<readonly string[]>([]);

  protected readonly images = computed<readonly string[]>(() => {
    const slides = this.slides();
    if (slides.length) return slides;
    const single = this.backgroundImage();
    return single ? [single] : [];
  });
  protected readonly activeSlide = signal(0);
  /** How many slides are in the DOM (current + the next one are always loaded). */
  protected readonly loadedCount = signal(2);

  private readonly destroyRef = inject(DestroyRef);

  protected readonly applyUrl = EXTERNAL_LINKS.apply;

  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private mm?: gsap.MatchMedia;

  /** Endless background tweens – paused while the hero is scrolled out of view (nothing visible changes). */
  private ambient: gsap.core.Tween[] = [];
  private inView = true;

  /** Headline as lines of words; recomputed when the language changes. */
  protected readonly lines = computed<HeadlineLine[]>(() => {
    this.language.lang(); // dependency: re-run on language switch
    const split = (key: string) => this.translate.instant(key).trim().split(/\s+/);
    return [
      { accent: false, words: split('hero.titleLead') },
      { accent: true, words: split('hero.titleAccent') },
    ];
  });

  constructor() {
    // (Re)play the intro after the DOM for the current language is rendered.
    afterRenderEffect(() => {
      this.lines();
      this.playIntro();
    });

    // Slideshow autoplay (browser only, skipped for reduced motion).
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const timer = setInterval(() => {
        const total = this.images().length;
        if (total < 2 || !this.inView) return;
        const next = (this.activeSlide() + 1) % total;
        this.activeSlide.set(next);
        this.loadedCount.update((count) => Math.max(count, next + 2));
      }, 6000);
      this.destroyRef.onDestroy(() => clearInterval(timer));
    });

    // Stop all ambient motion (orbs, photo zoom, CSS ping/bounce) while the hero is off-screen so it
    // doesn't keep the main thread / compositor busy during the rest of the page.
    afterNextRender(() => {
      const el = this.root().nativeElement;
      if (typeof IntersectionObserver === 'undefined') return;
      const io = new IntersectionObserver(([entry]) => {
        this.inView = entry.isIntersecting;
        el.classList.toggle('is-offscreen', !this.inView);
        for (const tween of this.ambient) {
          if (this.inView) tween.resume();
          else tween.pause();
        }
      });
      io.observe(el);
      this.destroyRef.onDestroy(() => io.disconnect());
    });

    this.destroyRef.onDestroy(() => this.mm?.revert());
  }

  private playIntro(): void {
    this.mm?.revert();
    this.mm = gsap.matchMedia(this.root().nativeElement);

    this.mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Always use explicit fromTo() values here: elements carry CSS transitions
      // (Tailwind `transition`), and `from()` would read a mid-transition value
      // as its end state when the intro is replayed. `clearProps` hands control
      // back to CSS afterwards so hover effects keep working.
      const reveal = { opacity: 1, y: 0, clearProps: 'transition,opacity,transform' };
      const hidden = { opacity: 0, y: 24, transition: 'none' };

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.fromTo('.hero-badge', hidden, { ...reveal, duration: 0.9 })
        .fromTo(
          '.hero-word',
          { yPercent: 115 },
          { yPercent: 0, duration: 1.1, stagger: 0.07, clearProps: 'transform' },
          '-=0.5',
        )
        .fromTo('.hero-sub', hidden, { ...reveal, duration: 0.9 }, '-=0.6')
        .fromTo('.hero-cta', hidden, { ...reveal, duration: 0.8, stagger: 0.12 }, '-=0.6')
        .fromTo(
          '.hero-scroll',
          { opacity: 0, transition: 'none' },
          { opacity: 1, duration: 1, clearProps: 'transition,opacity' },
          '-=0.3',
        );

      // Ambient background motion.
      const ambient = [
        gsap.to('.hero-orb-a', { x: 50, y: -30, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
        gsap.to('.hero-orb-b', { x: -40, y: 40, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
      ];
      if (this.root().nativeElement.querySelector('.hero-photo')) {
        ambient.push(gsap.fromTo('.hero-photo', { scale: 1.12 }, { scale: 1, duration: 14, ease: 'power1.out' }));
      }
      this.ambient = ambient;
      if (!this.inView) ambient.forEach((tween) => tween.pause());
    });
  }
}
