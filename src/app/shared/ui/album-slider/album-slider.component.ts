import { ChangeDetectionStrategy, Component, effect, input, signal, untracked } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LightboxComponent } from '../lightbox/lightbox.component';

/** One photo at a time with arrows, a counter and a thumbnail strip; the photo opens in the lightbox. */
@Component({
  selector: 'app-album-slider',
  imports: [TranslatePipe, LightboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', '(keydown)': 'onKey($event)' },
  template: `
    <div class="relative overflow-hidden rounded-2xl bg-brand-950 shadow-soft">
      <button
        type="button"
        class="group block aspect-[16/10] w-full cursor-zoom-in"
        [attr.aria-label]="'gallery.open' | translate"
        (click)="lightbox.set(current())"
      >
        <img decoding="async" [src]="images()[current()]" alt="" class="h-full w-full object-contain" />
      </button>

      @if (images().length > 1) {
        <button
          type="button"
          class="absolute start-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-accent-600 text-white shadow-lg transition hover:bg-accent-700 sm:h-12 sm:w-12"
          [attr.aria-label]="'gallery.prev' | translate"
          (click)="step(-1)"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button
          type="button"
          class="absolute end-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-accent-600 text-white shadow-lg transition hover:bg-accent-700 sm:h-12 sm:w-12"
          [attr.aria-label]="'gallery.next' | translate"
          (click)="step(1)"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7" /></svg>
        </button>
        <span
          dir="ltr"
          class="absolute bottom-3 end-3 rounded-full bg-black/55 px-3 py-1 text-xs font-bold tabular-nums text-white backdrop-blur"
        >
          {{ current() + 1 }} / {{ images().length }}
        </span>
      }
    </div>

    @if (images().length > 1) {
      <ul class="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist">
        @for (src of images(); track src; let i = $index) {
          <li class="shrink-0">
            <button
              type="button"
              class="block h-14 w-20 overflow-hidden rounded-lg border-2 transition sm:h-16 sm:w-24"
              [class]="i === current() ? 'border-accent-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'"
              [attr.data-active]="i === current()"
              (click)="current.set(i)"
            >
              <img decoding="async" [src]="src" alt="" loading="lazy" class="h-full w-full object-cover" />
            </button>
          </li>
        }
      </ul>
    }

    <app-lightbox [images]="images()" [(index)]="lightbox" />
  `,
})
export class AlbumSliderComponent {
  readonly images = input.required<readonly string[]>();

  protected readonly current = signal(0);
  protected readonly lightbox = signal<number | null>(null);

  constructor() {
    // Switching to another album starts from its first photo.
    effect(() => {
      this.images();
      untracked(() => this.current.set(0));
    });
  }

  protected step(dir: 1 | -1): void {
    const n = this.images().length;
    this.current.update((i) => (i + dir + n) % n);
  }

  protected onKey(e: KeyboardEvent): void {
    if (this.lightbox() !== null) return;
    const rtl = document.documentElement.dir === 'rtl';
    if (e.key === 'ArrowRight') this.step(rtl ? -1 : 1);
    else if (e.key === 'ArrowLeft') this.step(rtl ? 1 : -1);
  }
}
