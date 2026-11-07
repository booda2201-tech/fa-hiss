import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LightboxComponent } from '../lightbox/lightbox.component';

/**
 * Photo mosaic with a lightbox. With six or more photos it lays out a "bento" grid (one hero tile,
 * one wide tile, the rest square); long albums collapse behind a "+N" tile that opens the viewer.
 */
@Component({
  selector: 'app-photo-gallery',
  imports: [TranslatePipe, LightboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <ul
      class="grid gap-2.5 sm:gap-3"
      [class]="gridClass()"
    >
      @for (src of visible(); track src; let i = $index) {
        <li
          class="group relative overflow-hidden rounded-2xl bg-brand-900/10 shadow-soft"
          [class]="tileClass(i)"
        >
          <button
            type="button"
            class="absolute inset-0 block h-full w-full cursor-zoom-in"
            [attr.aria-label]="'gallery.open' | translate"
            (click)="open(i)"
          >
            <img decoding="async"
              [src]="src"
              alt=""
              loading="lazy"
              class="h-full w-full transition-transform duration-700 ease-out-expo group-hover:scale-105"
              [class]="layout() === 'single' ? 'object-contain' : 'object-cover'"
            />
            <span
              class="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            ></span>
            <span
              class="absolute bottom-3 end-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-white/90 text-brand-900 opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            >
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M20 20l-4.2-4.2M11 8.5v5M8.5 11h5" />
              </svg>
            </span>
            @if (i === visible().length - 1 && hidden() > 0) {
              <span
                class="absolute inset-0 grid place-items-center bg-brand-950/75 text-white backdrop-blur-[2px] transition-colors group-hover:bg-accent-700/80"
              >
                <span class="text-center">
                  <span class="block text-4xl font-extrabold">+{{ hidden() }}</span>
                  <span class="mt-1 block text-sm font-bold text-white/85">{{ 'gallery.more' | translate }}</span>
                </span>
              </span>
            }
          </button>
        </li>
      }
    </ul>

    <app-lightbox [images]="images()" [(index)]="active" />
  `,
})
export class PhotoGalleryComponent {
  readonly images = input.required<readonly string[]>();
  /** How many tiles to show before collapsing the rest behind "+N". */
  readonly limit = input(8);
  /** Smaller rows – used inside cards. */
  readonly compact = input(false);

  protected readonly active = signal<number | null>(null);

  /**
   * Layout by photo count, so no tile row is left half-empty:
   * 1 single · 2 pair · 3 trio · 4 quad · 5 hero + 4 · 6 two rows of three · 7 plain grid · 8+ bento with "+N".
   */
  protected readonly layout = computed<'single' | 'pair' | 'trio' | 'quad' | 'hero' | 'six' | 'grid' | 'bento'>(() => {
    const n = this.images().length;
    if (n <= 1) return 'single';
    if (n === 2) return 'pair';
    if (n === 3) return 'trio';
    if (n === 4) return 'quad';
    if (n === 5) return 'hero';
    if (n === 6) return 'six';
    if (n === 7) return 'grid';
    return 'bento';
  });

  protected readonly visible = computed(() => this.images().slice(0, this.layout() === 'bento' ? this.limit() : 99));
  protected readonly hidden = computed(() => this.images().length - this.visible().length);

  protected readonly gridClass = computed(() => {
    const rows = this.compact() ? 'auto-rows-[7.5rem] sm:auto-rows-[9rem]' : 'auto-rows-[8.5rem] sm:auto-rows-[11rem]';
    switch (this.layout()) {
      case 'single':
        return 'grid-cols-1 max-w-xl';
      case 'pair':
        return 'grid-cols-2';
      case 'trio':
        return 'grid-cols-2 sm:grid-cols-3';
      case 'quad':
        return 'grid-cols-2';
      case 'six':
        return 'grid-cols-2 sm:grid-cols-3';
      case 'grid':
        return 'grid-cols-2 lg:grid-cols-4';
      default:
        return `grid-cols-2 lg:grid-cols-4 [grid-auto-flow:dense] ${rows}`;
    }
  });

  protected tileClass(i: number): string {
    switch (this.layout()) {
      case 'single':
        return 'aspect-[16/10] bg-white';
      case 'pair':
      case 'quad':
        return 'aspect-[16/10]';
      case 'trio':
      case 'six':
      case 'grid':
        return 'aspect-[4/3]';
      case 'hero':
        return i === 0 ? 'col-span-2 row-span-2' : '';
      default:
        return i === 0 ? 'col-span-2 row-span-2' : i === 5 ? 'col-span-2' : '';
    }
  }

  protected open(i: number): void {
    this.active.set(i);
  }
}
