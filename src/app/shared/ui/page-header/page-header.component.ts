import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../icon/icon.component';

/** Photo banner used by the legacy site's inner pages (same photos, same dark overlay). */
export const DEFAULT_PAGE_HEADER_IMAGE = 'images/ref/header/header.jpg';

/**
 * Full-bleed photo banner at the top of inner pages. The photo stays clearly visible; a dark
 * overlay keeps the title and the (transparent) fixed header readable.
 */
@Component({
  selector: 'app-page-header',
  imports: [RouterLink, TranslatePipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative isolate flex min-h-[17.5rem] items-end overflow-hidden bg-brand-950 text-white sm:min-h-[26rem] lg:min-h-[30rem]' },
  template: `
    <div class="absolute inset-0 -z-10" aria-hidden="true">
      <img decoding="async" [src]="image() ?? defaultImage" alt="" class="ph-photo h-full w-full object-cover object-center" fetchpriority="high" />
      <!-- Dark veil: heavier at the top (header) and bottom (title) so the photo breathes in the middle -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-brand-950/90"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-brand-950/55 via-transparent to-transparent rtl:bg-gradient-to-l"></div>
      <div class="orb absolute -bottom-32 end-[8%] h-80 w-80 rounded-full bg-accent-500/25 blur-[110px]"></div>
    </div>

    <div class="container pb-8 pt-28 sm:pb-12 sm:pt-40 lg:pb-16 lg:pt-44">
      <nav [attr.aria-label]="'a11y.breadcrumb' | translate" class="text-sm text-white/75">
        <ol class="flex flex-wrap items-center gap-2">
          <li>
            <a routerLink="/" class="transition-colors hover:text-white">{{ 'nav.home' | translate }}</a>
          </li>
          <li aria-hidden="true"><app-icon name="chevron-right" [flipRtl]="true" class="h-3.5 w-3.5" /></li>
          <li aria-current="page" class="font-semibold text-white">{{ titleKey() | translate }}</li>
        </ol>
      </nav>

      <h1 class="mt-3 max-w-4xl text-[1.9rem] font-extrabold sm:mt-5 sm:text-5xl leading-tight drop-shadow-[0_2px_12px_rgb(0_0_0/0.45)] lg:text-6xl">
        {{ titleKey() | translate }}
      </h1>
      <div class="mt-3 flex items-center gap-2 sm:mt-5" aria-hidden="true">
        <span class="h-1 w-16 rounded-full bg-accent-500"></span>
        <span class="h-1 w-3 rounded-full bg-white/70"></span>
      </div>
      @if (subtitleKey(); as subtitle) {
        <p class="mt-3 line-clamp-3 max-w-2xl text-[0.95rem] leading-relaxed text-white/85 sm:mt-5 sm:line-clamp-none sm:text-lg">{{ subtitle | translate }}</p>
      }
      <ng-content />
    </div>

    <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-400/70 to-transparent"></div>
  `,
  styles: `
    .ph-photo {
      animation: ph-settle 9s ease-out both;
    }
    @keyframes ph-settle {
      from {
        transform: scale(1.1);
      }
      to {
        transform: scale(1);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .ph-photo {
        animation: none;
      }
    }
  `,
})
export class PageHeaderComponent {
  protected readonly defaultImage = DEFAULT_PAGE_HEADER_IMAGE;

  readonly titleKey = input.required<string>();
  readonly subtitleKey = input<string | null>(null);
  readonly image = input<string | null>(null);
}
