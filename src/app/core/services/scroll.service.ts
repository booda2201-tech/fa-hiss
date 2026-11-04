import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { animationFrameScheduler, auditTime, fromEvent } from 'rxjs';

export type ScrollDirection = 'up' | 'down';

/** Minimum movement (px) before the scroll direction flips – avoids jitter. */
const DIRECTION_THRESHOLD = 8;

/**
 * Exposes window scroll position as signals. Events are throttled to one
 * update per animation frame and listeners are passive.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly window = inject(DOCUMENT).defaultView;

  private readonly _y = signal(0);
  private readonly _direction = signal<ScrollDirection>('up');
  private lastY = 0;

  readonly y = this._y.asReadonly();
  readonly direction = this._direction.asReadonly();
  /** True once the page has moved away from the very top. */
  readonly isScrolled = computed(() => this._y() > 24);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID)) || !this.window) return;

    this.update();
    fromEvent(this.window, 'scroll', { passive: true })
      .pipe(auditTime(0, animationFrameScheduler), takeUntilDestroyed())
      .subscribe(() => this.update());
  }

  private update(): void {
    const y = Math.max(0, this.window?.scrollY ?? 0);
    const delta = y - this.lastY;

    if (Math.abs(delta) >= DIRECTION_THRESHOLD) {
      this._direction.set(delta > 0 ? 'down' : 'up');
      this.lastY = y;
    }
    this._y.set(y);
  }
}
