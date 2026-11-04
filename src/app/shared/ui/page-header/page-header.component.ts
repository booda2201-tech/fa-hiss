import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../icon/icon.component';

/**
 * Dark banner at the top of inner pages. Being dark, it lets the fixed header
 * keep its transparent look until the user scrolls.
 */
@Component({
  selector: 'app-page-header',
  imports: [RouterLink, TranslatePipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative isolate block overflow-hidden bg-brand-900 text-white' },
  template: `
    <div class="absolute inset-0 -z-10" aria-hidden="true">
      @if (image(); as src) {
        <img [src]="src" alt="" class="h-full w-full object-cover opacity-30" />
      }
      <div class="absolute inset-0 bg-brand-gradient opacity-90"></div>
      <div class="absolute -top-24 start-[10%] h-80 w-80 rounded-full bg-white/10 blur-[110px]"></div>
      <div class="absolute -bottom-32 end-[8%] h-80 w-80 rounded-full bg-accent-500/30 blur-[110px]"></div>
    </div>

    <div class="container pb-16 pt-36 lg:pb-16 lg:pt-40">
      <nav [attr.aria-label]="'a11y.breadcrumb' | translate" class="text-sm text-white/70">
        <ol class="flex flex-wrap items-center gap-2">
          <li>
            <a routerLink="/" class="transition-colors hover:text-white">{{ 'nav.home' | translate }}</a>
          </li>
          <li aria-hidden="true"><app-icon name="chevron-right" [flipRtl]="true" class="h-3.5 w-3.5" /></li>
          <li aria-current="page" class="font-semibold text-white">{{ titleKey() | translate }}</li>
        </ol>
      </nav>

      <h1 class="mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
        {{ titleKey() | translate }}
      </h1>
      @if (subtitleKey(); as subtitle) {
        <p class="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">{{ subtitle | translate }}</p>
      }
      <ng-content />
    </div>

    <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-400/70 to-transparent"></div>
  `,
})
export class PageHeaderComponent {
  readonly titleKey = input.required<string>();
  readonly subtitleKey = input<string | null>(null);
  readonly image = input<string | null>(null);
}
