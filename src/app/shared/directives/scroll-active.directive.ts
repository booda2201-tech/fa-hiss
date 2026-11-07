import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

/**
 * On a horizontally scrolling rail, brings the item marked `aria-current` into view on load
 * (no smooth scrolling, so it never animates on arrival).
 */
@Directive({ selector: '[appScrollActive]' })
export class ScrollActiveDirective implements AfterViewInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  ngAfterViewInit(): void {
    const rail = this.host.nativeElement;
    const target = rail.querySelector<HTMLElement>('[aria-current]');
    if (!target) return;
    const left = target.offsetLeft - (rail.clientWidth - target.clientWidth) / 2;
    rail.scrollTo({ left, behavior: 'instant' as ScrollBehavior });
  }
}
