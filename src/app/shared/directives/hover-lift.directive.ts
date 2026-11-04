import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { gsap } from 'gsap';

/**
 * GSAP hover / focus micro-interaction for cards.
 *
 * - The card lifts a little and its `[data-hover-icon]` child pops and tilts.
 * - Only `transform` is animated, so give the element `transition-shadow` (not `transition`)
 *   for any CSS shadow change, and keep AOS on a wrapper element rather than on the card itself.
 * - Skipped for users who prefer reduced motion and on touch devices (no real hover).
 */
@Directive({
  selector: '[appHoverLift]',
  host: {
    '(pointerenter)': 'enter($event)',
    '(pointerleave)': 'leave()',
    '(focusin)': 'enter()',
    '(focusout)': 'leave()',
  },
})
export class HoverLiftDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private ctx?: gsap.Context;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.ctx?.revert());
  }

  protected enter(event?: PointerEvent): void {
    if (event && event.pointerType !== 'mouse') return;
    this.play(true);
  }

  protected leave(): void {
    this.play(false);
  }

  private play(active: boolean): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ctx ??= gsap.context(() => undefined, this.el);
    const icon = this.el.querySelector<HTMLElement>('[data-hover-icon]');

    this.ctx.add(() => {
      gsap.to(this.el, {
        y: active ? -8 : 0,
        duration: active ? 0.45 : 0.6,
        ease: active ? 'power3.out' : 'power3.inOut',
        overwrite: 'auto',
      });
      if (icon) {
        gsap.to(icon, {
          scale: active ? 1.12 : 1,
          rotate: active ? -6 : 0,
          duration: active ? 0.5 : 0.6,
          ease: active ? 'back.out(2.2)' : 'power3.inOut',
          overwrite: 'auto',
        });
      }
    });
  }
}
