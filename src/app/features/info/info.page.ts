import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';
import { SERVICES } from '../../core/data/home.data';
import { INFO_PAGES, InfoPageDef, findInfoPage, infoPath } from '../../core/data/pages.data';
import { TranslateListPipe } from '../../core/i18n/translate-list.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { ScrollActiveDirective } from '../../shared/directives/scroll-active.directive';
import { AlbumSliderComponent } from '../../shared/ui/album-slider/album-slider.component';
import { PhotoGalleryComponent } from '../../shared/ui/photo-gallery/photo-gallery.component';

/** Same banners as the legacy site: per page first, then per group. */
const PAGE_HEADERS: Record<string, string> = {
  seminars: 'images/ref/header/seminars.jpg',
  library: 'images/ref/header/library.jpg',
  advising: 'images/ref/header/library.jpg',
  quality: 'images/ref/header/library.jpg',
  military: 'images/ref/header/military.jpg',
  'public-relations': 'images/ref/header/pr.jpg',
  youth: 'images/ref/header/youth.jpg',
  journals: 'images/ref/header/youth.jpg',
};
const GROUP_HEADERS: Record<string, string> = {
  faculty: 'images/ref/header/faculty.jpg',
  services: 'images/ref/header/students.jpg',
};

/**
 * `/pages/:slug` – generic content page. Replaces the legacy WordPress pages
 * (schedules, library, quality unit…). The blocks of each page live in
 * `core/data/pages.data.ts`; copy lives in the i18n files under `info.<slug>`.
 */
@Component({
  selector: 'app-info-page',
  imports: [RouterLink, TranslatePipe, TranslateListPipe, IconComponent, PageHeaderComponent, PhotoGalleryComponent, AlbumSliderComponent, ScrollActiveDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (page(); as p) {
      <app-page-header
        [titleKey]="p.titleKey"
        [subtitleKey]="p.group === 'quality' ? null : p.introKey ?? null"
        [image]="headerImage()"
      />

      <!-- Phones/tablets: sibling pages as a sticky swipe rail instead of a sidebar card -->
      @if (related().length > 1) {
        <nav
          class="border-b border-black/5 bg-white lg:hidden"
          [attr.aria-label]="'info.groups.' + p.group | translate"
        >
          <ul appScrollActive class="hide-scrollbar flex gap-2 overflow-x-auto px-[var(--gutter)] py-3">
            @for (item of related(); track item.slug) {
              <li class="shrink-0">
                <a
                  [routerLink]="path(item.slug)"
                  class="flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[0.82rem] font-bold transition-colors active:scale-95"
                  [class]="item.slug === p.slug ? 'bg-brand-600 text-white shadow-soft' : 'bg-surface text-brand-900'"
                  [attr.aria-current]="item.slug === p.slug ? 'page' : null"
                >
                  <app-icon [name]="iconOf(item)" class="h-4 w-4" />
                  {{ item.titleKey | translate }}
                </a>
              </li>
            }
          </ul>
        </nav>
      }

      <section class="bg-surface py-8 sm:py-14 lg:py-20">
        <div class="container grid gap-8 lg:grid-cols-[1fr_20rem] lg:gap-10">
          <!-- Main column -->
          <div class="min-w-0 space-y-6">
            @if (p.group === 'quality' && p.introKey) {
              <article class="card" data-aos="fade-up">
                <h2 class="card-title">{{ 'info.quality.visionTitle' | translate }}</h2>
                <p class="leading-loose text-ink/85">{{ p.introKey | translate }}</p>
              </article>
            }

            @for (block of p.blocks; track $index; let bi = $index) {
              @switch (block.type) {
                @case ('text') {
                  <article class="card" data-aos="fade-up">
                    @if (block.titleKey) {
                      <h2 class="card-title">{{ block.titleKey | translate }}</h2>
                    }
                    <p class="leading-loose text-ink/85">{{ block.textKey | translate }}</p>
                  </article>
                }

                @case ('list') {
                  <article class="card" data-aos="fade-up">
                    @if (block.titleKey) {
                      <h2 class="card-title">{{ block.titleKey | translate }}</h2>
                    }
                    <ul class="space-y-3">
                      @for (item of block.itemsKey | translateList; track $index) {
                        <li class="flex items-start gap-3 leading-loose text-ink/85">
                          <span class="mt-2 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                            <app-icon name="check" class="h-3 w-3" />
                          </span>
                          <span>{{ item }}</span>
                        </li>
                      }
                    </ul>
                  </article>
                }

                @case ('steps') {
                  <article class="card" data-aos="fade-up">
                    @if (block.titleKey) {
                      <h2 class="card-title">{{ block.titleKey | translate }}</h2>
                    }
                    <ol class="space-y-3">
                      @for (item of block.itemsKey | translateList; track $index; let i = $index) {
                        <li class="flex items-start gap-4 rounded-2xl bg-surface p-4 leading-loose text-ink/90">
                          <span
                            class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-600 text-sm font-extrabold text-white"
                          >
                            {{ i + 1 }}
                          </span>
                          <span>{{ item }}</span>
                        </li>
                      }
                    </ol>
                  </article>
                }

                @case ('files') {
                  <article class="card" data-aos="fade-up">
                    @if (block.titleKey) {
                      <h2 class="card-title">{{ block.titleKey | translate }}</h2>
                    }
                    <ul class="grid gap-3 md:grid-cols-2">
                      @for (label of block.labelsKey | translateList; track $index; let i = $index) {
                        <li>
                          <a
                            [href]="block.hrefs[i]"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="group flex h-full items-center gap-4 rounded-2xl bg-surface p-4 transition-colors hover:bg-brand-600"
                          >
                            <span
                              class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-accent-600 shadow-sm transition-colors group-hover:bg-white/15 group-hover:text-white"
                            >
                              <app-icon [name]="block.kind === 'download' ? 'download' : 'external'" class="h-5 w-5" />
                            </span>
                            <span class="min-w-0 flex-1 font-semibold leading-snug text-brand-900 transition-colors group-hover:text-white">
                              {{ label }}
                            </span>
                            <span class="shrink-0 text-xs font-bold text-ink-muted transition-colors group-hover:text-white/80">
                              {{ (block.kind === 'download' ? 'info.download' : 'info.open') | translate }}
                            </span>
                          </a>
                        </li>
                      }
                    </ul>
                  </article>
                }

                @case ('gallery') {
                  @if (block.images.length) {
                    <article class="card" data-aos="fade-up">
                      @if (block.titleKey) {
                        <h2 class="card-title">{{ block.titleKey | translate }}</h2>
                      }
                      @if (block.contain) {
                        <ul class="grid grid-cols-2 gap-3 md:grid-cols-3">
                          @for (src of block.images; track src) {
                            <li class="overflow-hidden rounded-2xl bg-surface-soft p-2">
                              <img decoding="async"
                                [src]="src"
                                alt=""
                                loading="lazy"
                                class="h-full w-full rounded-xl object-contain transition-transform duration-500 hover:scale-105"
                              />
                            </li>
                          }
                        </ul>
                      } @else {
                        <app-photo-gallery [images]="block.images" [compact]="true" />
                      }
                    </article>
                  }
                }

                @case ('people') {
                  <ul class="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    @for (name of block.namesKey | translateList; track $index; let i = $index) {
                      <li
                        class="group relative flex flex-col items-center overflow-hidden rounded-3xl bg-white text-center shadow-card ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
                        data-aos="fade-up"
                      >
                        <div class="relative h-24 w-full bg-brand-gradient">
                          <span class="absolute -end-6 -top-8 h-24 w-24 rounded-full bg-white/10"></span>
                          <span class="absolute -start-4 bottom-0 h-12 w-12 rounded-full bg-accent-600/30"></span>
                        </div>
                        <img decoding="async"
                          [src]="block.photos[i]"
                          alt=""
                          loading="lazy"
                          class="relative -mt-[3.75rem] h-[7.5rem] w-[7.5rem] rounded-full bg-white object-cover object-top shadow-soft ring-4 ring-white"
                        />
                        <div class="flex w-full flex-1 flex-col items-center px-4 pb-5 pt-3">
                          <h3 class="text-[0.95rem] font-extrabold leading-snug text-brand-900">{{ name }}</h3>
                          <span class="mt-2 h-0.5 w-8 rounded-full bg-accent-600 transition-all duration-300 group-hover:w-14"></span>
                          <p class="mt-2.5 text-[0.82rem] leading-relaxed text-ink-muted">{{ (block.rolesKey | translateList)[i] }}</p>
                        </div>
                      </li>
                    }
                  </ul>
                }

                @case ('events') {
                  @if (block.titleKey) {
                    <h2 class="pt-2 text-2xl font-extrabold text-brand-900">{{ block.titleKey | translate }}</h2>
                  }
                  <div class="space-y-4">
                    @for (title of block.titlesKey | translateList; track $index; let i = $index) {
                      <article class="card" data-aos="fade-up">
                        <h3 class="card-title">{{ title }}</h3>
                        <p class="leading-loose text-ink/85">{{ (block.textsKey | translateList)[i] }}</p>
                      </article>
                    }
                  </div>
                }

                @case ('fileGroups') {
                  @for (title of block.titlesKey | translateList; track $index; let gi = $index) {
                    <article class="card" data-aos="fade-up">
                      <h2 class="card-title">{{ title }}</h2>
                      <ul class="grid gap-3 md:grid-cols-2">
                        @for (label of (block.filesKey | translateList)[gi]; track $index; let i = $index) {
                          <li>
                            <a
                              [href]="block.groups[gi][i]"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="group flex h-full items-center gap-4 rounded-2xl bg-surface p-4 transition-colors hover:bg-brand-600"
                            >
                              <span
                                class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-accent-600 shadow-sm transition-colors group-hover:bg-white/15 group-hover:text-white"
                              >
                                <app-icon [name]="block.kind === 'download' ? 'download' : 'external'" class="h-5 w-5" />
                              </span>
                              <span class="min-w-0 flex-1 font-semibold leading-snug text-brand-900 transition-colors group-hover:text-white">
                                {{ label }}
                              </span>
                              <span class="shrink-0 text-xs font-bold text-ink-muted transition-colors group-hover:text-white/80">
                                {{ (block.kind === 'download' ? 'info.download' : 'info.open') | translate }}
                              </span>
                            </a>
                          </li>
                        }
                      </ul>
                    </article>
                  }
                }

                @case ('albums') {
                  @if (block.tabs) {
                    <!-- Album picker (like the legacy site's tab list) + one album at a time -->
                    <div class="flex flex-col gap-4" data-aos="fade-up">
                      <div class="min-w-0">
                        <p class="mb-2.5 flex items-center gap-2 px-1 text-sm font-extrabold text-brand-800">
                          <span class="h-5 w-1 rounded-full bg-accent-600"></span>
                          {{ 'gallery.albumsTitle' | translate }}
                        </p>
                        <div
                          role="tablist"
                          class="album-picker -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-3"
                        >
                          @for (title of block.titlesKey | translateList; track $index; let ai = $index) {
                            <button
                              type="button"
                              role="tab"
                              class="group flex shrink-0 items-center gap-3 rounded-2xl border p-2.5 text-start transition duration-300 w-60"
                              [class]="
                                ai === albumTab(bi)
                                  ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
                                  : 'border-black/5 bg-white text-brand-900 shadow-card hover:-translate-y-0.5 hover:border-brand-600/30 hover:shadow-soft'
                              "
                              [attr.aria-selected]="ai === albumTab(bi)"
                              (click)="setAlbumTab(bi, ai)"
                            >
                              <span
                                class="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-extrabold tabular-nums transition-colors"
                                [class]="
                                  ai === albumTab(bi)
                                    ? 'bg-white text-brand-700'
                                    : 'bg-brand-50 text-brand-700 group-hover:bg-brand-600 group-hover:text-white'
                                "
                              >
                                {{ ai + 1 }}
                              </span>
                              <span class="line-clamp-2 min-w-0 flex-1 text-[0.82rem] font-bold leading-snug">{{ title }}</span>
                            </button>
                          }
                        </div>
                      </div>

                      <article class="card min-w-0">
                        <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
                          <h2 class="card-title !mb-0">{{ (block.titlesKey | translateList)[albumTab(bi)] }}</h2>
                          <span class="rounded-full bg-brand-50 px-3.5 py-1 text-sm font-extrabold tabular-nums text-brand-800">
                            {{ block.albums[albumTab(bi)].length }}
                          </span>
                        </div>
                        @if ((block.textsKey | translateList)[albumTab(bi)]; as text) {
                          <p class="mb-5 leading-loose text-ink/85">{{ text }}</p>
                        }
                        <h3 class="mb-4 text-xl font-extrabold text-brand-800">{{ 'gallery.photosTitle' | translate }}</h3>
                        <app-album-slider [images]="block.albums[albumTab(bi)]" />
                      </article>
                    </div>
                  } @else {
                    @if (block.titleKey) {
                      <h2 class="pt-4 text-2xl font-extrabold text-brand-900 lg:text-3xl">{{ block.titleKey | translate }}</h2>
                    }
                    @for (title of block.titlesKey | translateList; track $index; let ai = $index) {
                      <article class="card" data-aos="fade-up">
                        <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
                          <h2 class="card-title !mb-0">{{ title }}</h2>
                          <span class="rounded-full bg-brand-50 px-3.5 py-1 text-sm font-extrabold tabular-nums text-brand-800">
                            {{ block.albums[ai].length }}
                            <svg viewBox="0 0 24 24" class="ms-1 inline h-4 w-4 -translate-y-px" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                              <rect x="3" y="5" width="18" height="14" rx="2.5" />
                              <circle cx="9" cy="10.5" r="1.6" />
                              <path d="M21 16l-5-5-8 8" />
                            </svg>
                          </span>
                        </div>
                        @if ((block.textsKey | translateList)[ai]; as text) {
                          <p class="mb-5 leading-loose text-ink/85">{{ text }}</p>
                        }
                        <app-photo-gallery [images]="block.albums[ai]" [compact]="true" />
                      </article>
                    }
                  }
                }

                @case ('org') {
                  <article class="card" data-aos="fade-up">
                    <h2 class="card-title">{{ 'info.quality.org.title' | translate }}</h2>

                    <div class="flex flex-col items-center">
                      <div class="org-node">{{ 'info.quality.org.head' | translate }}</div>
                      <span class="org-stem" aria-hidden="true"></span>
                      <div class="org-node">{{ 'info.quality.org.executive' | translate }}</div>
                      <span class="org-stem" aria-hidden="true"></span>

                      <div class="org-branch max-w-xl" style="--n: 2">
                        <div class="org-child"><div class="org-node">{{ 'info.quality.org.deputy' | translate }}</div></div>
                        <div class="org-child"><div class="org-node">{{ 'info.quality.org.secretary' | translate }}</div></div>
                      </div>

                      <div class="mt-10 flex w-full flex-col items-center border-t border-dashed border-brand-600/25 pt-10">
                        <div class="org-node">{{ 'info.quality.org.committees' | translate }}</div>
                        <span class="org-stem" aria-hidden="true"></span>
                        <div class="org-branch" style="--n: 3">
                          <div class="org-child"><div class="org-node">{{ 'info.quality.org.awareness' | translate }}</div></div>
                          <div class="org-child"><div class="org-node">{{ 'info.quality.org.training' | translate }}</div></div>
                          <div class="org-child"><div class="org-node">{{ 'info.quality.org.evaluation' | translate }}</div></div>
                        </div>
                      </div>
                    </div>
                  </article>
                }

                @case ('cta') {
                  <div class="flex flex-col gap-5 rounded-3xl bg-brand-gradient p-7 text-white shadow-luxe sm:flex-row sm:items-center sm:justify-between" data-aos="fade-up">
                    <div>
                      <h2 class="text-xl font-extrabold">{{ block.titleKey | translate }}</h2>
                      <p class="mt-2 max-w-xl text-sm leading-relaxed text-white/80">{{ block.textKey | translate }}</p>
                    </div>
                    @if (block.route) {
                      <a [routerLink]="block.route" class="btn-light shrink-0">
                        {{ block.buttonKey | translate }}
                        <app-icon name="arrow-right" [flipRtl]="true" class="h-4 w-4" />
                      </a>
                    } @else {
                      <a [href]="block.href" target="_blank" rel="noopener noreferrer" class="btn-light shrink-0">
                        {{ block.buttonKey | translate }}
                        <app-icon name="external" class="h-4 w-4" />
                      </a>
                    }
                  </div>
                }
              }
            }
          </div>

          <!-- Sidebar -->
          <aside class="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div class="card !p-5 max-lg:hidden" [class]="related().length < 2 ? 'hidden' : ''">
              <h2 class="card-title !mb-3 !text-lg">{{ 'info.groups.' + p.group | translate }}</h2>
              <ul class="space-y-1">
                @for (item of related(); track item.slug) {
                  <li>
                    <a
                      [routerLink]="path(item.slug)"
                      class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors"
                      [class]="
                        item.slug === p.slug
                          ? 'bg-brand-600 text-white'
                          : 'text-brand-900 hover:bg-surface hover:text-accent-600'
                      "
                      [attr.aria-current]="item.slug === p.slug ? 'page' : null"
                    >
                      <app-icon [name]="iconOf(item)" class="h-[18px] w-[18px]" />
                      {{ item.titleKey | translate }}
                    </a>
                  </li>
                }
              </ul>
            </div>

            <div class="rounded-3xl bg-brand-gradient p-6 text-white shadow-luxe">
              <h2 class="text-lg font-extrabold">{{ 'info.sidebarPortalTitle' | translate }}</h2>
              <p class="mt-2 text-sm leading-relaxed text-white/80">{{ 'info.sidebarPortalText' | translate }}</p>
              <a routerLink="/student-portal" class="btn-light mt-5 w-full">
                {{ 'header.studentPortal' | translate }}
                <app-icon name="arrow-right" [flipRtl]="true" class="h-4 w-4" />
              </a>
            </div>
          </aside>
        </div>
      </section>
    }
  `,
  styles: `
    .card {
      border-radius: 1.5rem;
      background: #fff;
      padding: 1.25rem;
      box-shadow: 0 8px 30px -8px rgb(36 52 63 / 0.12);
    }
    @media (min-width: 640px) {
      .card {
        padding: 1.75rem;
      }
    }
    /* Organizational chart: nodes joined by stems and a horizontal bar */
    .org-node {
      min-width: 11rem;
      border-radius: 0.9rem;
      background: #006638;
      padding: 0.9rem 1.5rem;
      text-align: center;
      font-weight: 800;
      line-height: 1.4;
      color: #fff;
      box-shadow: 0 8px 20px -10px rgb(0 102 56 / 0.7);
    }
    .org-stem {
      display: block;
      width: 2px;
      height: 1.75rem;
      background: #006638;
    }
    .org-branch {
      position: relative;
      display: grid;
      grid-template-columns: repeat(var(--n), minmax(0, 1fr));
      gap: 0.75rem;
      width: 100%;
    }
    .org-branch::before {
      content: '';
      position: absolute;
      top: 0;
      inset-inline: calc(50% / var(--n));
      height: 2px;
      background: #006638;
    }
    .org-child {
      position: relative;
      display: flex;
      justify-content: center;
      padding-top: 1.75rem;
    }
    .org-child::before {
      content: '';
      position: absolute;
      top: 0;
      width: 2px;
      height: 1.75rem;
      background: #006638;
    }
    .org-child .org-node {
      width: 100%;
      min-width: 0;
      padding-inline: 0.75rem;
      font-size: 0.95rem;
    }
    .album-picker {
      scrollbar-width: thin;
      scrollbar-color: rgb(0 102 56 / 0.35) transparent;
    }
    .card-title {
      margin-bottom: 1.25rem;
      padding-inline-start: 0.9rem;
      border-inline-start: 4px solid #b70503;
      font-size: 1.35rem;
      font-weight: 800;
      line-height: 1.3;
      color: #002b19;
    }
  `,
})
export class InfoPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('slug'))), { initialValue: null });

  protected readonly page = computed<InfoPageDef | undefined>(() => findInfoPage(this.slug()));
  protected readonly related = computed(() => INFO_PAGES.filter((p) => p.group === this.page()?.group));
  protected readonly headerImage = computed(() => PAGE_HEADERS[this.slug() ?? ''] ?? GROUP_HEADERS[this.page()?.group ?? ''] ?? null);

  protected readonly path = infoPath;

  /** Selected album per tabbed block (block index -> album index). */
  private readonly albumTabs = signal<Record<number, number>>({});
  protected albumTab(block: number): number {
    return this.albumTabs()[block] ?? 0;
  }
  protected setAlbumTab(block: number, album: number): void {
    this.albumTabs.update((tabs) => ({ ...tabs, [block]: album }));
  }

  constructor() {
    effect(() => {
      if (this.slug() && !this.page()) {
        void this.router.navigate(['/']);
      }
    });
  }

  protected iconOf(page: InfoPageDef) {
    return SERVICES.find((s) => s.labelKey === page.titleKey)?.icon ?? 'file-text';
  }
}
