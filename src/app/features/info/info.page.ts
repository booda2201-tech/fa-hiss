import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';
import { SERVICES } from '../../core/data/home.data';
import { INFO_PAGES, InfoPageDef, findInfoPage, infoPath } from '../../core/data/pages.data';
import { TranslateListPipe } from '../../core/i18n/translate-list.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

const HEADER_IMAGES = ['slide-07', 'slide-03', 'slide-05', 'slide-02'];

/**
 * `/pages/:slug` – generic content page. Replaces the legacy WordPress pages
 * (schedules, library, quality unit…). The blocks of each page live in
 * `core/data/pages.data.ts`; copy lives in the i18n files under `info.<slug>`.
 */
@Component({
  selector: 'app-info-page',
  imports: [RouterLink, TranslatePipe, TranslateListPipe, IconComponent, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (page(); as p) {
      <app-page-header
        [titleKey]="p.titleKey"
        [subtitleKey]="p.group === 'quality' ? null : p.introKey ?? null"
        [image]="headerImage()"
      />

      <section class="bg-surface py-14 lg:py-20">
        <div class="container grid gap-10 lg:grid-cols-[1fr_20rem]">
          <!-- Main column -->
          <div class="min-w-0 space-y-6">
            @if (p.group === 'quality' && p.introKey) {
              <article class="card" data-aos="fade-up">
                <h2 class="card-title">{{ 'info.quality.visionTitle' | translate }}</h2>
                <p class="leading-loose text-ink/85">{{ p.introKey | translate }}</p>
              </article>
            }

            @for (block of p.blocks; track $index) {
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
                      <ul
                        class="grid grid-cols-2 gap-3 md:grid-cols-3"
                        [class]="!block.contain && block.images.length > 6 ? 'lg:grid-cols-4' : ''"
                      >
                        @for (src of block.images; track src) {
                          <li class="overflow-hidden rounded-2xl bg-surface-soft" [class]="block.contain ? 'p-2' : 'aspect-[4/3]'">
                            <img
                              [src]="src"
                              alt=""
                              loading="lazy"
                              class="h-full w-full transition-transform duration-500 hover:scale-105"
                              [class]="block.contain ? 'object-contain rounded-xl' : 'object-cover'"
                            />
                          </li>
                        }
                      </ul>
                    </article>
                  }
                }

                @case ('people') {
                  <ul class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                    @for (name of block.namesKey | translateList; track $index; let i = $index) {
                      <li class="card flex flex-col items-center !p-5 text-center" data-aos="fade-up">
                        <img
                          [src]="block.photos[i]"
                          alt=""
                          loading="lazy"
                          class="h-28 w-28 rounded-full object-cover object-top ring-4 ring-surface-soft"
                        />
                        <h3 class="mt-4 text-base font-extrabold leading-snug text-brand-900">{{ name }}</h3>
                        <p class="mt-1.5 text-sm leading-snug text-ink-muted">{{ (block.rolesKey | translateList)[i] }}</p>
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
            <div class="card !p-5" [class]="related().length < 2 ? 'hidden' : ''">
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
      padding: 1.75rem;
      box-shadow: 0 8px 30px -8px rgb(36 52 63 / 0.12);
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
  protected readonly headerImage = computed(() => {
    const index = INFO_PAGES.findIndex((p) => p.slug === this.slug());
    return `images/ref/hero/${HEADER_IMAGES[Math.max(index, 0) % HEADER_IMAGES.length]}.jpg`;
  });

  protected readonly path = infoPath;

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
