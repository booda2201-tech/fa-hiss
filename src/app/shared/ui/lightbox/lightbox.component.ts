import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  model,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Full-screen image viewer. The parent owns the open state through the `index` model:
 * `null` = closed, a number = the image being shown.
 */
@Component({
  selector: 'app-lightbox',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKey($event)',
  },
  template: `
    @if (current(); as src) {
      <div
        class="lb-backdrop fixed inset-0 z-[200] flex flex-col bg-brand-950/95 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        (click)="close()"
        (pointerdown)="swipeStart = $event.clientX"
        (pointerup)="onSwipeEnd($event)"
      >
        <!-- Top bar -->
        <div class="flex items-center justify-between px-4 py-3 text-white sm:px-6" (click)="$event.stopPropagation()">
          <span dir="ltr" class="rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold tabular-nums">
            {{ position() }} / {{ images().length }}
          </span>
          <button
            type="button"
            class="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-accent-600"
            [attr.aria-label]="'gallery.close' | translate"
            (click)="close()"
          >
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <!-- Stage -->
        <div class="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-20">
          @if (images().length > 1) {
            <button
              type="button"
              class="lb-nav start-3 sm:start-6"
              [attr.aria-label]="'gallery.prev' | translate"
              (click)="step(-1); $event.stopPropagation()"
            >
              <svg viewBox="0 0 24 24" class="h-6 w-6 rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
          }

          <img decoding="async"
            [src]="src"
            alt=""
            class="lb-image max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
            draggable="false"
            (click)="$event.stopPropagation()"
          />

          @if (images().length > 1) {
            <button
              type="button"
              class="lb-nav end-3 sm:end-6"
              [attr.aria-label]="'gallery.next' | translate"
              (click)="step(1); $event.stopPropagation()"
            >
              <svg viewBox="0 0 24 24" class="h-6 w-6 rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          }
        </div>

        <!-- Thumbnails -->
        @if (images().length > 1) {
          <div class="lb-thumbs flex gap-2 overflow-x-auto px-4 py-4 sm:justify-center" (click)="$event.stopPropagation()">
            @for (thumb of images(); track thumb; let i = $index) {
              <button
                type="button"
                class="h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition"
                [class]="i === index() ? 'opacity-100 ring-accent-500' : 'opacity-50 ring-transparent hover:opacity-90'"
                [attr.data-active]="i === index()"
                (click)="index.set(i)"
              >
                <img decoding="async" [src]="thumb" alt="" class="h-full w-full object-cover" loading="lazy" />
              </button>
            }
          </div>
        }
      </div>
    }
  `,
  styles: `
    .lb-backdrop {
      animation: lb-fade 0.25s ease-out;
    }
    .lb-image {
      animation: lb-zoom 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .lb-thumbs {
      scrollbar-width: none;
    }
    .lb-nav {
      position: absolute;
      top: 50%;
      z-index: 1;
      display: grid;
      width: 3rem;
      height: 3rem;
      transform: translateY(-50%);
      place-items: center;
      border-radius: 9999px;
      background: rgb(255 255 255 / 0.12);
      color: #fff;
      backdrop-filter: blur(6px);
      transition: background-color 0.2s, transform 0.2s;
    }
    .lb-nav:hover {
      background: #e11b22;
      transform: translateY(-50%) scale(1.08);
    }
    @keyframes lb-fade {
      from {
        opacity: 0;
      }
    }
    @keyframes lb-zoom {
      from {
        opacity: 0;
        transform: scale(0.94);
      }
    }
  `,
})
export class LightboxComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly images = input.required<readonly string[]>();
  readonly index = model<number | null>(null);

  protected swipeStart = 0;

  protected readonly current = computed(() => {
    const i = this.index();
    return i === null ? null : (this.images()[i] ?? null);
  });
  protected readonly position = computed(() => (this.index() ?? 0) + 1);

  constructor() {
    // Portal to <body>: ancestors with a transform (scroll animations) would otherwise
    // become the containing block of this position:fixed overlay and clip it.
    this.document.body.appendChild(this.host.nativeElement);

    // Keep the active thumbnail in view.
    effect(() => {
      if (this.index() === null) return;
      setTimeout(() =>
        this.host.nativeElement
          .querySelector('[data-active="true"]')
          ?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }),
      );
    });

    // Lock page scroll while the viewer is open.
    effect((onCleanup) => {
      if (this.index() === null) return;
      const body = this.document.body;
      const previous = body.style.overflow;
      body.style.overflow = 'hidden';
      onCleanup(() => (body.style.overflow = previous));
    });
  }

  ngOnDestroy(): void {
    this.host.nativeElement.remove();
  }

  protected close(): void {
    this.index.set(null);
  }

  protected step(delta: number): void {
    const total = this.images().length;
    const i = this.index();
    if (i === null || total === 0) return;
    this.index.set((i + delta + total) % total);
  }

  protected onSwipeEnd(event: PointerEvent): void {
    const dx = event.clientX - this.swipeStart;
    if (Math.abs(dx) < 60) return;
    const rtl = this.document.documentElement.dir === 'rtl';
    // Dragging towards the "end" of the reading direction goes to the previous image.
    this.step((dx > 0) === rtl ? 1 : -1);
  }

  protected onKey(event: KeyboardEvent): void {
    if (this.index() === null) return;
    const rtl = this.document.documentElement.dir === 'rtl';
    switch (event.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowRight':
        this.step(rtl ? -1 : 1);
        break;
      case 'ArrowLeft':
        this.step(rtl ? 1 : -1);
        break;
    }
  }
}
