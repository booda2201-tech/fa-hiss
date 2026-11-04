import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { gsap } from 'gsap';

/**
 * Number that counts up from 0 the first time it scrolls into view.
 * Always renders Latin digits (matches the figures on the legacy site) and
 * jumps straight to the final value for users who prefer reduced motion.
 */
@Component({
  selector: 'app-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ text() }}{{ suffix() }}`,
})
export class CounterComponent {
  readonly value = input.required<number>();
  readonly suffix = input('');
  readonly duration = input(2.4);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly current = signal(0);
  protected readonly text = () => Math.round(this.current()).toLocaleString('en-US');

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduce || typeof IntersectionObserver === 'undefined') {
        this.current.set(this.value());
        return;
      }

      let tween: gsap.core.Tween | undefined;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          const state = { v: 0 };
          tween = gsap.to(state, {
            v: this.value(),
            duration: this.duration(),
            ease: 'power2.out',
            onUpdate: () => this.current.set(state.v),
          });
        },
        { threshold: 0.4 },
      );
      io.observe(el);

      this.destroyRef.onDestroy(() => {
        io.disconnect();
        tween?.kill();
      });
    });
  }
}
