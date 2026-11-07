import { ChangeDetectionStrategy, Component, DOCUMENT, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LightboxComponent } from '../lightbox/lightbox.component';

/** Scroll-snap carousel for study-plan tables (published as images); tap a card to zoom. */
@Component({
  selector: 'app-plan-carousel',
  imports: [TranslatePipe, LightboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative block' },
  template: `
    <div
      #track
      class="plan-track -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 pt-2 sm:-mx-8 sm:px-8"
      [class]="images().length <= 3 ? 'sm:justify-center' : ''"
      tabindex="0"
      role="list"
    >
      @for (src of images(); track src; let i = $index) {
        <figure
          role="listitem"
          class="group relative w-[84%] shrink-0 snap-center overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-brand-900/5 sm:w-[22rem]"
        >
          <button
            type="button"
            class="block h-full w-full cursor-zoom-in"
            [attr.aria-label]="'gallery.open' | translate"
            (click)="active.set(i)"
          >
            <span class="relative block h-[26rem] overflow-hidden bg-white p-3">
              <img decoding="async"
                [src]="src"
                alt=""
                loading="lazy"
                class="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </span>
            <figcaption class="flex items-center justify-between border-t border-brand-900/10 bg-surface-soft px-5 py-3">
              <span class="text-lg font-extrabold tabular-nums text-brand-800">{{ pad(i + 1) }}</span>
              <span class="text-xs font-bold text-accent-600 opacity-0 transition-opacity group-hover:opacity-100">
                {{ 'gallery.open' | translate }}
              </span>
            </figcaption>
          </button>
        </figure>
      }
    </div>

    @if (images().length > 1) {
      <div class="mt-2 flex items-center justify-center gap-3">
        <button type="button" class="plan-arrow" [attr.aria-label]="'gallery.prev' | translate" (click)="scroll(-1)">
          <svg viewBox="0 0 24 24" class="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button type="button" class="plan-arrow" [attr.aria-label]="'gallery.next' | translate" (click)="scroll(1)">
          <svg viewBox="0 0 24 24" class="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    }

    <app-lightbox [images]="images()" [(index)]="active" />
  `,
  styles: `
    .plan-track {
      scrollbar-width: thin;
      scrollbar-color: #006638 transparent;
    }
    .plan-arrow {
      display: grid;
      width: 3rem;
      height: 3rem;
      place-items: center;
      border-radius: 9999px;
      background: #fff;
      color: #003f23;
      box-shadow: 0 8px 24px -10px rgb(36 52 63 / 0.4);
      transition: background-color 0.2s, color 0.2s, transform 0.2s;
    }
    .plan-arrow:hover {
      background: #e11b22;
      color: #fff;
      transform: translateY(-2px);
    }
  `,
})
export class PlanCarouselComponent {
  private readonly document = inject(DOCUMENT);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  readonly images = input.required<readonly string[]>();
  protected readonly active = signal<number | null>(null);

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  /** `direction` follows reading order: 1 = next. */
  protected scroll(direction: 1 | -1): void {
    const el = this.track().nativeElement;
    const rtl = this.document.documentElement.dir === 'rtl';
    const card = el.firstElementChild?.clientWidth ?? 320;
    el.scrollBy({ left: direction * (rtl ? -1 : 1) * (card + 20), behavior: 'smooth' });
  }
}
