import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IsActiveMatchOptions, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { CONTACT, EXTERNAL_LINKS, HEADER_NAV, SOCIAL_LINKS } from '../../core/config/site.config';
import { DEPARTMENTS } from '../../core/data/departments.data';
import { LanguageService } from '../../core/i18n/language.service';
import { ScrollService } from '../../core/services/scroll.service';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { HeaderSearchComponent } from './header-search/header-search.component';
import { HeaderTone, LanguageSwitcherComponent } from './language-switcher/language-switcher.component';

/** Active when path AND fragment match, so `/#about` doesn't also light up "Home". */
const ACTIVE_MATCH: IsActiveMatchOptions = {
  paths: 'exact',
  queryParams: 'ignored',
  fragment: 'exact',
  matrixParams: 'ignored',
};

/**
 * Smart header.
 *  - Fixed; floats as a glass bar over the hero, turns solid once scrolled.
 *  - Hides while scrolling down, reappears on scroll up.
 *  - Hosts language switcher, search, "Student Portal" CTA and the mobile menu.
 */
@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    IconComponent,
    LanguageSwitcherComponent,
    HeaderSearchComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    class: 'fixed inset-x-0 top-0 z-50 block transition-transform duration-500 ease-out-expo',
    '[class.-translate-y-full]': 'hidden()',
    '(keydown.escape)': 'closeAll()',
  },
})
export class HeaderComponent {
  private readonly scroll = inject(ScrollService);
  private readonly router = inject(Router);
  protected readonly language = inject(LanguageService);

  /** Every page opens on a dark banner, so the bar floats as glass over it and turns white once scrolled. */
  readonly transparentOnTop = input(true);

  protected readonly nav = HEADER_NAV;
  /** Mobile/tablet panel: plain links as pills, dropdown groups as cards. */
  protected readonly navLinks = HEADER_NAV.filter((i) => !i.children);
  protected readonly navGroups = HEADER_NAV.filter((i) => i.children);
  protected readonly departments = DEPARTMENTS;
  protected readonly social = SOCIAL_LINKS;
  protected readonly contact = CONTACT;
  protected readonly scrolled = this.scroll.isScrolled;
  protected readonly portalUrl = EXTERNAL_LINKS.studentPortal;
  protected readonly activeMatch = ACTIVE_MATCH;

  protected readonly menuOpen = signal(false);
  protected readonly searchOpen = signal(false);

  /** Solid white bar once scrolled, on non-hero pages, or while the mobile menu is open. */
  protected readonly solid = computed(
    () => this.scroll.isScrolled() || !this.transparentOnTop() || this.menuOpen(),
  );

  protected readonly tone = computed<HeaderTone>(() => (this.solid() ? 'light' : 'dark'));

  protected readonly hidden = computed(
    () =>
      this.scroll.direction() === 'down' &&
      this.scroll.y() > 480 &&
      !this.menuOpen() &&
      !this.searchOpen(),
  );

  protected readonly barClasses = computed(() =>
    this.solid() ? 'text-ink' : 'text-white',
  );

  /** Frosted white with a hairline + soft drop shadow when solid; a dark fade for legibility when floating over the banner. */
  protected readonly barSurface = computed(() =>
    this.solid()
      ? 'bg-white/95 shadow-[0_1px_0_rgb(15_23_42/0.06),0_12px_32px_-20px_rgb(15_23_42/0.45)] backdrop-blur-xl'
      : 'bg-gradient-to-b from-black/55 via-black/25 to-black/0 backdrop-blur-[3px]',
  );

  protected readonly linkClasses = computed(() =>
    this.tone() === 'dark'
      ? 'text-white hover:bg-white/10'
      : 'text-ink hover:bg-surface hover:text-accent-600',
  );

  /** Hairline between the nav and the action buttons. */
  protected readonly dividerClasses = computed(() =>
    this.tone() === 'dark' ? 'xl:border-white/20' : 'xl:border-black/10',
  );

  protected readonly iconButtonClasses = computed(() =>
    this.tone() === 'dark' ? 'text-white hover:bg-white/15' : 'text-ink hover:bg-surface',
  );

  constructor() {
    // Close any open panel after navigating.
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeAll());
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    this.searchOpen.set(false);
  }

  protected toggleSearch(): void {
    this.searchOpen.update((open) => !open);
    this.menuOpen.set(false);
  }

  protected closeAll(): void {
    this.menuOpen.set(false);
    this.searchOpen.set(false);
  }

  protected switchLanguage(): void {
    void this.language.toggle();
  }

  protected onSearch(query: string): void {
    // No dedicated results page yet – route here once `/search` exists.
    void this.router.navigate(['/'], { queryParams: { q: query } });
  }
}
