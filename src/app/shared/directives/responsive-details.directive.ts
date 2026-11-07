import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

/**
 * A `<details>` that collapses into an accordion on phones/tablets and is always open on desktop
 * (≥ 1024px), where the summary stops being interactive.
 */
@Directive({
  selector: 'details[appResponsiveDetails]',
  host: { '(toggle)': 'keepOpenOnDesktop()' },
})
export class ResponsiveDetailsDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLDetailsElement>>(ElementRef).nativeElement;

  /** Starts expanded on small screens. */
  readonly openOnMobile = input(false);

  private readonly mq = typeof matchMedia === 'function' ? matchMedia('(min-width: 1024px)') : null;
  private readonly onChange = (): void => {
    if (this.mq?.matches) this.el.open = true;
  };

  constructor() {
    // Runs before first paint, so desktop never flashes closed.
    this.el.open = this.mq?.matches ?? true;
    this.mq?.addEventListener('change', this.onChange);
  }

  /** `openOnMobile` is an input, so it's only readable after the first change-detection pass. */
  ngOnInit(): void {
    if (!this.mq?.matches) this.el.open = this.openOnMobile();
  }

  protected keepOpenOnDesktop(): void {
    if (this.mq?.matches && !this.el.open) this.el.open = true;
  }

  ngOnDestroy(): void {
    this.mq?.removeEventListener('change', this.onChange);
  }
}
