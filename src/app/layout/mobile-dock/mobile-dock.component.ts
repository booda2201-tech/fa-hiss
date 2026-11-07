import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { CONTACT, HEADER_NAV, SOCIAL_LINKS } from '../../core/config/site.config';
import { DEPARTMENTS } from '../../core/data/departments.data';
import { SERVICES } from '../../core/data/home.data';
import { LanguageService } from '../../core/i18n/language.service';
import { IconComponent, IconName } from '../../shared/ui/icon/icon.component';

type Sheet = 'departments' | 'services' | 'more';

interface ServiceTile {
  readonly labelKey: string;
  readonly path: string;
  readonly icon: IconName;
}

interface ServiceGroup {
  readonly titleKey: string;
  readonly tiles: readonly ServiceTile[];
}

const iconFor = (path: string): IconName => SERVICES.find((s) => s.path === path)?.icon ?? 'newspaper';

/**
 * Phone-only app-style navigation: a floating dock with five targets and slide-up sheets
 * (departments, student services, everything else). Replaces the hamburger below `md`.
 */
@Component({
  selector: 'app-mobile-dock',
  imports: [RouterLink, TranslatePipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'md:hidden', '(keydown.escape)': 'close()' },
  template: `
    <!-- Dim backdrop behind a sheet -->
    <div
      class="fixed inset-0 z-[55] bg-brand-950/60 backdrop-blur-[2px] transition-opacity duration-300"
      [class]="sheet() ? 'opacity-100' : 'pointer-events-none opacity-0'"
      (click)="close()"
      aria-hidden="true"
    ></div>

    <!-- Sheet -->
    <section
      class="fixed inset-x-2 z-[58] transition-[transform,visibility] duration-500 ease-out-expo"
      [class]="sheet() ? 'visible translate-y-0' : 'invisible translate-y-[calc(100%+8rem)]'"
      style="bottom: calc(5.6rem + env(safe-area-inset-bottom))"
      role="dialog"
      aria-modal="true"
      [attr.inert]="sheet() ? null : ''"
      [attr.aria-label]="sheetTitleKey() | translate"
    >
      <div
        class="hide-scrollbar max-h-[68svh] overflow-y-auto overscroll-contain rounded-[2rem] bg-white p-5 shadow-luxe ring-1 ring-black/5"
        [style.overflow-y]="sheet() === 'departments' ? 'hidden' : null"
      >
        <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-black/10" aria-hidden="true"></div>
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="text-xl font-extrabold text-brand-900">{{ sheetTitleKey() | translate }}</h2>
          <button
            type="button"
            class="grid h-9 w-9 place-items-center rounded-full bg-surface text-ink/70 active:scale-90"
            [attr.aria-label]="'dock.close' | translate"
            (click)="close()"
          >
            <app-icon name="close" class="h-4 w-4" />
          </button>
        </div>

        @switch (sheet()) {
          @case ('departments') {
            <ul class="grid grid-cols-2 gap-3">
              @for (dept of departments; track dept.id) {
                <li>
                  <a
                    [routerLink]="['/departments', dept.slug]"
                    class="group relative flex h-[min(12.5rem,calc((68svh-8rem)/2))] w-full flex-col justify-end overflow-hidden rounded-3xl bg-brand-900 p-3.5 text-white shadow-soft active:scale-[0.97]"
                  >
                    <img decoding="async" [src]="dept.image" alt="" class="absolute inset-0 h-full w-full object-cover opacity-80" loading="lazy" />
                    <span class="absolute inset-0 bg-gradient-to-t from-brand-950/95 via-brand-950/35 to-transparent" aria-hidden="true"></span>
                    <span class="relative grid h-10 w-10 place-items-center rounded-2xl bg-brand-gradient shadow-soft ring-2 ring-white/90">
                      <img loading="lazy" decoding="async" [src]="dept.icon" alt="" class="h-7 w-7" />
                    </span>
                    <span class="relative mt-2.5 text-[0.95rem] font-extrabold leading-snug">
                      {{ 'departments.' + dept.id | translate }}
                    </span>
                  </a>
                </li>
              }
            </ul>
          }
          @case ('services') {
            <div class="space-y-5">
              @for (group of serviceGroups; track group.titleKey) {
                <section>
                  <h3 class="mb-2.5 flex items-center gap-3 text-sm font-extrabold text-accent-700">
                    {{ group.titleKey | translate }}
                    <span class="h-px flex-1 bg-black/5" aria-hidden="true"></span>
                  </h3>
                  <ul class="grid grid-cols-3 gap-2">
                    @for (tile of group.tiles; track tile.path) {
                      <li>
                        <a
                          [routerLink]="tile.path"
                          class="flex h-full flex-col items-center gap-2 rounded-2xl bg-surface px-1.5 py-3 text-center text-[0.72rem] font-bold leading-snug text-ink active:scale-95 active:bg-brand-50"
                        >
                          <span class="grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient text-white shadow-soft">
                            <app-icon [name]="tile.icon" class="h-5 w-5" />
                          </span>
                          {{ tile.labelKey | translate }}
                        </a>
                      </li>
                    }
                  </ul>
                </section>
              }
            </div>
          }
          @case ('more') {
            <ul class="grid gap-2">
              @for (link of moreLinks; track link.path) {
                <li>
                  <a
                    [routerLink]="link.path"
                    class="flex items-center gap-3.5 rounded-2xl bg-surface px-4 py-3 font-bold text-ink active:scale-[0.98] active:bg-brand-50"
                  >
                    <span class="grid h-9 w-9 place-items-center rounded-xl bg-brand-100 text-brand-700">
                      <app-icon [name]="link.icon" class="h-[1.1rem] w-[1.1rem]" />
                    </span>
                    <span class="flex-1">{{ link.labelKey | translate }}</span>
                    <app-icon name="arrow-right" [flipRtl]="true" class="h-4 w-4 text-accent-600" />
                  </a>
                </li>
              }
            </ul>

            <a routerLink="/student-portal" class="btn-brand mt-3 w-full">
              <app-icon name="user" class="h-4 w-4" />
              {{ 'header.studentPortal' | translate }}
            </a>

            <div class="mt-3 grid grid-cols-2 gap-2">
              <a
                [href]="'tel:' + contact.landlines[0].tel"
                class="flex items-center justify-center gap-2 rounded-2xl bg-brand-50 px-3 py-3 text-sm font-bold text-brand-800 active:scale-95"
              >
                <app-icon name="phone" class="h-4 w-4" />
                {{ 'dock.call' | translate }}
              </a>
              <a
                [href]="'https://wa.me/' + contact.whatsapp.tel.replace('+', '')"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-2 rounded-2xl bg-[#e7f8ee] px-3 py-3 text-sm font-bold text-[#128c4a] active:scale-95"
              >
                <app-icon name="whatsapp" class="h-4 w-4" />
                {{ 'dock.whatsapp' | translate }}
              </a>
            </div>

            <div class="mt-4 flex items-center justify-between gap-3 border-t border-black/5 pt-4">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-bold text-ink active:scale-95"
                (click)="switchLanguage()"
              >
                <app-icon name="globe" class="h-4 w-4 text-accent-600" />
                {{ language.alternate().nativeLabel }}
              </button>
              <ul class="flex gap-2" [attr.aria-label]="'dock.follow' | translate">
                @for (s of social; track s.name) {
                  <li>
                    <a
                      [href]="s.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-700 active:scale-90"
                      [attr.aria-label]="s.name"
                    >
                      <app-icon [name]="s.icon" class="h-4 w-4" />
                    </a>
                  </li>
                }
              </ul>
            </div>
          }
        }
      </div>
    </section>

    <!-- Dock -->
    <nav
      class="fixed inset-x-3 z-[57] grid grid-cols-5 items-end rounded-[1.75rem] bg-brand-950/95 px-1.5 py-1.5 text-white shadow-[0_18px_40px_-12px_rgb(0_30_15/0.65)] ring-1 ring-white/10 backdrop-blur-xl"
      style="bottom: max(0.75rem, env(safe-area-inset-bottom))"
      [attr.aria-label]="'dock.label' | translate"
    >
      <a
        routerLink="/"
        class="dock-item"
        [class.is-active]="active() === 'home' && !sheet()"
        (click)="close()"
      >
        <app-icon name="home" class="h-[1.35rem] w-[1.35rem]" />
        <span>{{ 'dock.home' | translate }}</span>
      </a>

      <button
        type="button"
        class="dock-item"
        [class.is-active]="sheet() === 'departments' || (!sheet() && active() === 'departments')"
        [attr.aria-expanded]="sheet() === 'departments'"
        (click)="toggle('departments')"
      >
        <app-icon name="book-open" class="h-[1.35rem] w-[1.35rem]" />
        <span>{{ 'dock.departments' | translate }}</span>
      </button>

      <a routerLink="/admission" class="dock-fab" (click)="close()">
        <span
          class="grid h-[3.6rem] w-[3.6rem] -translate-y-5 place-items-center rounded-full bg-accent-gradient text-white shadow-[0_12px_24px_-6px_rgb(225_27_34/0.65)] ring-[5px] ring-brand-950 transition-transform active:scale-90"
          [class]="active() === 'admission' && !sheet() ? 'scale-110' : ''"
        >
          <app-icon name="graduation-cap" class="h-7 w-7" />
        </span>
        <span class="-mt-4 text-[0.68rem] font-extrabold text-white">{{ 'dock.apply' | translate }}</span>
      </a>

      <button
        type="button"
        class="dock-item"
        [class.is-active]="sheet() === 'services' || (!sheet() && active() === 'services')"
        [attr.aria-expanded]="sheet() === 'services'"
        (click)="toggle('services')"
      >
        <app-icon name="layout-grid" class="h-[1.35rem] w-[1.35rem]" />
        <span>{{ 'dock.services' | translate }}</span>
      </button>

      <button
        type="button"
        class="dock-item"
        [class.is-active]="sheet() === 'more' || (!sheet() && active() === 'more')"
        [attr.aria-expanded]="sheet() === 'more'"
        (click)="toggle('more')"
      >
        <app-icon name="menu" class="h-[1.35rem] w-[1.35rem]" />
        <span>{{ 'dock.more' | translate }}</span>
      </button>
    </nav>
  `,
  styles: `
    .dock-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
      border-radius: 1.1rem;
      padding: 0.52rem 0 0.58rem;
      font-size: 0.68rem;
      font-weight: 700;
      color: rgb(255 255 255 / 0.62);
      transition: color 0.25s, background-color 0.25s, transform 0.2s;
      -webkit-tap-highlight-color: transparent;
    }
    .dock-item > span {
      /* Tight, fixed line box so Arabic glyphs sit centred and top/bottom padding look equal. */
      line-height: 1.2;
    }
    .dock-item:active {
      transform: scale(0.92);
    }
    .dock-item.is-active {
      color: #fff;
      background: rgb(255 255 255 / 0.12);
    }
    .dock-fab {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      /* Same box height as a regular dock item: the raised button overflows upwards, so it must not
         make the bar taller than the pills (that was the extra space above them). */
      height: 3.566rem;
    }
    .dock-fab > * {
      flex-shrink: 0;
      -webkit-tap-highlight-color: transparent;
    }
  `,
})
export class MobileDockComponent {
  private readonly router = inject(Router);
  protected readonly language = inject(LanguageService);

  protected readonly departments = DEPARTMENTS;
  protected readonly contact = CONTACT;
  /** WhatsApp already has its own button in the sheet. */
  protected readonly social = SOCIAL_LINKS.filter((s) => s.name !== 'WhatsApp');
  protected readonly sheet = signal<Sheet | null>(null);
  private readonly url = signal(this.router.url);

  protected readonly active = computed<'home' | 'departments' | 'admission' | 'services' | 'more'>(() => {
    const u = this.url().split(/[?#]/)[0];
    if (u === '/' || u === '') return 'home';
    if (u.startsWith('/departments')) return 'departments';
    if (u.startsWith('/admission')) return 'admission';
    if (u.startsWith('/pages/') && !/\/pages\/(quality|advising)$/.test(u)) return 'services';
    return 'more';
  });

  protected readonly sheetTitleKey = computed(() => {
    switch (this.sheet()) {
      case 'departments':
        return 'dock.departmentsTitle';
      case 'services':
        return 'dock.servicesTitle';
      default:
        return 'dock.moreTitle';
    }
  });

  protected readonly serviceGroups: readonly ServiceGroup[] = HEADER_NAV.filter((i) => i.children).map((g) => ({
    titleKey: g.labelKey,
    tiles: g.children!.map((c) => ({ labelKey: c.labelKey, path: c.path, icon: iconFor(c.path) })),
  }));

  protected readonly moreLinks: readonly ServiceTile[] = [
    { labelKey: 'nav.about', path: '/about', icon: 'badge-check' },
    { labelKey: 'nav.quality', path: '/pages/quality', icon: 'shield' },
    { labelKey: 'nav.advising', path: '/pages/advising', icon: 'compass' },
    { labelKey: 'nav.contact', path: '/contact', icon: 'mail' },
  ];

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        this.url.set((e as NavigationEnd).urlAfterRedirects);
        this.sheet.set(null);
      });
  }

  protected toggle(target: Sheet): void {
    this.sheet.update((s) => (s === target ? null : target));
  }

  protected close(): void {
    this.sheet.set(null);
  }

  protected switchLanguage(): void {
    this.close();
    void this.language.toggle();
  }
}
