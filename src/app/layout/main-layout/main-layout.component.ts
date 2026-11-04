import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

/** Page shell: skip link + fixed header + routed content + footer. */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-screen flex-col' },
  template: `
    <a
      href="#main-content"
      class="sr-only z-[60] rounded-xl bg-accent-600 px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
    >
      {{ 'a11y.skipToContent' | translate }}
    </a>

    <app-header />

    <main id="main-content" class="flex-1" tabindex="-1">
      <router-outlet />
    </main>

    <app-footer />
  `,
})
export class MainLayoutComponent {}
