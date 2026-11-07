import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';
import { DEPARTMENTS, DepartmentSection, findDepartment } from '../../core/data/departments.data';
import { TranslateListPipe } from '../../core/i18n/translate-list.pipe';
import { ResponsiveDetailsDirective } from '../../shared/directives/responsive-details.directive';
import { BulletListComponent } from '../../shared/ui/bullet-list/bullet-list.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { PhotoGalleryComponent } from '../../shared/ui/photo-gallery/photo-gallery.component';
import { PlanCarouselComponent } from '../../shared/ui/plan-carousel/plan-carousel.component';
import { SectionHeadingComponent } from '../../shared/ui/section-heading/section-heading.component';
import { VideoShowcaseComponent } from '../../shared/ui/video-showcase/video-showcase.component';
import { EXTERNAL_LINKS } from '../../core/config/site.config';

/** Data-driven department page: `/departments/:slug`. Copy lives in the i18n files under `dept.<id>`. */
@Component({
  selector: 'app-department-page',
  imports: [
    RouterLink,
    TranslatePipe,
    TranslateListPipe,
    IconComponent,
    PageHeaderComponent,
    BulletListComponent,
    PhotoGalleryComponent,
    PlanCarouselComponent,
    SectionHeadingComponent,
    VideoShowcaseComponent,
    ResponsiveDetailsDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (department(); as dept) {
      <app-page-header [titleKey]="'departments.' + dept.id" [image]="dept.header" />

      <!-- Phones: jump links + apply, like an app tab strip -->
      <nav class="border-b border-black/5 bg-white lg:hidden" [attr.aria-label]="'deptPage.overview' | translate">
        <ul class="hide-scrollbar flex gap-2 overflow-x-auto px-[var(--gutter)] py-3">
          <li class="shrink-0">
            <a
              [routerLink]="applyUrl"
              class="flex items-center gap-2 whitespace-nowrap rounded-full bg-accent-gradient px-4 py-2 text-[0.82rem] font-extrabold text-white shadow-soft active:scale-95"
            >
              <app-icon name="graduation-cap" class="h-4 w-4" />
              {{ 'deptPage.apply' | translate }}
            </a>
          </li>
          @for (chip of chips(); track chip.id) {
            <li class="shrink-0">
              <button
                type="button"
                class="whitespace-nowrap rounded-full bg-surface px-4 py-2 text-[0.82rem] font-bold text-brand-900 active:scale-95 active:bg-brand-100"
                (click)="jump(chip.id)"
              >
                {{ chip.labelKey | translate }}
              </button>
            </li>
          }
        </ul>
      </nav>

      <section class="bg-surface py-8 sm:py-16 lg:py-20">
        <div class="container grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-10">
          <!-- Main column: an accordion on phones, plain cards on desktop -->
          <div class="min-w-0 space-y-4 lg:space-y-8">
            <details appResponsiveDetails [openOnMobile]="true" class="card acc" id="dept-overview" data-aos="fade-up">
              <summary class="acc-summary">
                <h2 class="card-title !mb-0">{{ 'deptPage.overview' | translate }}</h2>
                <span class="acc-chev lg:hidden"><app-icon name="chevron-down" class="h-4 w-4" /></span>
              </summary>
              <div class="acc-body">
                <div class="space-y-4 leading-loose text-ink/85">
                  @for (paragraph of 'dept.' + dept.id + '.intro' | translateList; track $index) {
                    <p>{{ paragraph }}</p>
                  }
                </div>
              </div>
            </details>
            @if (has('mission')) {
              <details appResponsiveDetails class="card acc" data-aos="fade-up">
                <summary class="acc-summary">
                  <h2 class="card-title !mb-0">{{ 'deptPage.mission' | translate }}</h2>
                  <span class="acc-chev lg:hidden"><app-icon name="chevron-down" class="h-4 w-4" /></span>
                </summary>
                <div class="acc-body">
                  <p class="leading-loose text-ink/85">{{ 'dept.' + dept.id + '.mission' | translate }}</p>
                </div>
              </details>
            }
            @if (has('degree')) {
              <details appResponsiveDetails class="card acc" data-aos="fade-up">
                <summary class="acc-summary">
                  <h2 class="card-title !mb-0">{{ 'deptPage.degree' | translate }}</h2>
                  <span class="acc-chev lg:hidden"><app-icon name="chevron-down" class="h-4 w-4" /></span>
                </summary>
                <div class="acc-body">
                  <p class="leading-loose text-ink/85">{{ 'dept.' + dept.id + '.degree' | translate }}</p>
                </div>
              </details>
            }
            @if (has('careers')) {
              <details appResponsiveDetails class="card acc" data-aos="fade-up">
                <summary class="acc-summary">
                  <h2 class="card-title !mb-0">{{ 'deptPage.careers' | translate }}</h2>
                  <span class="acc-chev lg:hidden"><app-icon name="chevron-down" class="h-4 w-4" /></span>
                </summary>
                <div class="acc-body">
                  <app-bullet-list [items]="'dept.' + dept.id + '.careers' | translateList" />
                </div>
              </details>
            }
            @if (has('facilities')) {
              <details appResponsiveDetails class="card acc" data-aos="fade-up">
                <summary class="acc-summary">
                  <h2 class="card-title !mb-0">{{ 'deptPage.facilities' | translate }}</h2>
                  <span class="acc-chev lg:hidden"><app-icon name="chevron-down" class="h-4 w-4" /></span>
                </summary>
                <div class="acc-body">
                  <app-bullet-list [items]="'dept.' + dept.id + '.facilities' | translateList" />
                </div>
              </details>
            }
            @if (has('training')) {
              <details appResponsiveDetails class="card acc" data-aos="fade-up">
                <summary class="acc-summary">
                  <h2 class="card-title !mb-0">{{ 'deptPage.training' | translate }}</h2>
                  <span class="acc-chev lg:hidden"><app-icon name="chevron-down" class="h-4 w-4" /></span>
                </summary>
                <div class="acc-body">
                  <p class="leading-loose text-ink/85">{{ 'dept.' + dept.id + '.training' | translate }}</p>
                </div>
              </details>
            }
            @if (has('fieldTrips')) {
              <details appResponsiveDetails class="card acc" data-aos="fade-up">
                <summary class="acc-summary">
                  <h2 class="card-title !mb-0">{{ 'deptPage.fieldTrips' | translate }}</h2>
                  <span class="acc-chev lg:hidden"><app-icon name="chevron-down" class="h-4 w-4" /></span>
                </summary>
                <div class="acc-body">
                  <p class="leading-loose text-ink/85">{{ 'dept.' + dept.id + '.fieldTrips' | translate }}</p>
                </div>
              </details>
            }
            <details appResponsiveDetails class="card acc" data-aos="fade-up">
              <summary class="acc-summary">
                <h2 class="card-title !mb-0">{{ 'deptPage.admission' | translate }}</h2>
                <span class="acc-chev lg:hidden"><app-icon name="chevron-down" class="h-4 w-4" /></span>
              </summary>
              <div class="acc-body">
                <app-bullet-list [items]="'dept.' + dept.id + '.admission' | translateList" />
              </div>
            </details>
            @if (has('protocols')) {
              <details appResponsiveDetails class="card acc" data-aos="fade-up">
                <summary class="acc-summary">
                  <h2 class="card-title !mb-0">{{ 'deptPage.protocols' | translate }}</h2>
                  <span class="acc-chev lg:hidden"><app-icon name="chevron-down" class="h-4 w-4" /></span>
                </summary>
                <div class="acc-body">
                  <p class="mb-5 leading-loose text-ink/85">{{ 'dept.' + dept.id + '.protocolsIntro' | translate }}</p>
                  <ul class="flex flex-wrap gap-2">
                    @for (name of 'dept.' + dept.id + '.protocols' | translateList; track $index) {
                      <li class="rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-800">{{ name }}</li>
                    }
                  </ul>
                </div>
              </details>
            }
            <details appResponsiveDetails class="card acc" data-aos="fade-up">
              <summary class="acc-summary">
                <h2 class="card-title !mb-0">{{ 'deptPage.system' | translate }}</h2>
                <span class="acc-chev lg:hidden"><app-icon name="chevron-down" class="h-4 w-4" /></span>
              </summary>
              <div class="acc-body">
                <app-bullet-list [items]="'deptPage.systemItems' | translateList" />
              </div>
            </details>
          </div>

          <!-- Sidebar -->
          <aside class="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div class="rounded-3xl bg-brand-gradient p-7 text-white shadow-soft-lg max-lg:hidden">
              <h2 class="text-xl font-extrabold">{{ 'nav.admission' | translate }}</h2>
              <p class="mt-2 text-sm leading-relaxed text-white/80">{{ 'pages.admission.intro' | translate }}</p>
              <a [routerLink]="applyUrl" class="btn-light mt-5 w-full">
                {{ 'deptPage.apply' | translate }}
                <app-icon name="arrow-right" [flipRtl]="true" class="h-4 w-4" />
              </a>
            </div>

            @if (dept.downloads.length) {
              <div class="card" id="dept-downloads">
                <h2 class="card-title">{{ 'deptPage.downloads' | translate }}</h2>
                <ul class="space-y-3">
                  @for (file of dept.downloads; track file.href) {
                    <li>
                      <a
                        [href]="file.href"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center gap-3 rounded-xl bg-surface p-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-600 hover:text-white"
                      >
                        <app-icon name="download" class="h-5 w-5 shrink-0" />
                        {{ file.labelKey | translate }}
                      </a>
                    </li>
                  }
                </ul>
              </div>
            }

            <div class="card">
              <h2 class="card-title">{{ 'deptPage.otherDepartments' | translate }}</h2>
              <ul class="space-y-1">
                @for (other of others(); track other.id) {
                  <li>
                    <a
                      [routerLink]="['/departments', other.slug]"
                      class="flex items-center gap-3 rounded-xl p-2 text-sm font-semibold text-brand-900 transition-colors hover:bg-surface hover:text-accent-600"
                    >
                      <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-gradient">
                        <img decoding="async" [src]="other.icon" alt="" class="h-9 w-9" loading="lazy" />
                      </span>
                      {{ 'departments.' + other.id | translate }}
                    </a>
                  </li>
                }
              </ul>
            </div>
          </aside>
        </div>
      </section>

      @if (dept.videoGroups.length) {
        <section id="dept-videos" class="relative isolate overflow-hidden bg-brand-900 py-14 text-white sm:py-20 lg:py-28">
          <div class="absolute inset-0 -z-10 bg-brand-gradient" aria-hidden="true"></div>
          <div class="orb pointer-events-none absolute -top-40 start-1/2 -z-10 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-white/10 blur-[120px]" aria-hidden="true"></div>
          <div class="orb pointer-events-none absolute -bottom-40 end-0 -z-10 h-96 w-96 rounded-full bg-brand-300/15 blur-[120px]" aria-hidden="true"></div>
          <div class="container relative">
            <app-section-heading
              eyebrowKey="deptPage.eyebrow.videos"
              titleKey="deptPage.videos.title"
              [light]="true"
              data-aos="fade-up"
            />

            @if (dept.videoGroups.length > 1) {
              <div class="mt-10 flex flex-wrap justify-center gap-3" role="tablist" data-aos="fade-up">
                @for (group of dept.videoGroups; track group.titleKey; let i = $index) {
                  <button
                    type="button"
                    role="tab"
                    class="rounded-full px-6 py-2.5 text-sm font-extrabold ring-1 transition"
                    [class]="
                      i === videoTab()
                        ? 'bg-accent-600 text-white shadow-glow ring-accent-500'
                        : 'bg-white/5 text-white/80 ring-white/20 hover:bg-white/15 hover:text-white'
                    "
                    [attr.aria-selected]="i === videoTab()"
                    (click)="videoTab.set(i)"
                  >
                    {{ group.titleKey | translate }}
                    <span class="ms-1.5 text-xs font-bold opacity-70">{{ group.videos.length }}</span>
                  </button>
                }
              </div>
            }

            <div class="mt-12" data-aos="zoom-in">
              @for (group of dept.videoGroups; track group.titleKey; let i = $index) {
                @if (i === videoTab()) {
                  <app-video-showcase [videos]="group.videos" />
                }
              }
            </div>
          </div>
        </section>
      }

      @if (dept.studyPlans.length) {
        <section id="dept-plans" class="overflow-x-clip bg-surface-soft py-14 sm:py-20 lg:py-28">
          <div class="container">
            <app-section-heading
              eyebrowKey="deptPage.eyebrow.plans"
              titleKey="deptPage.studyPlans"
              data-aos="fade-up"
            />
            <div class="mt-12" data-aos="fade-up">
              <app-plan-carousel [images]="dept.studyPlans" />
            </div>
          </div>
        </section>
      }

      @if (dept.events.length) {
        <section id="dept-events" class="bg-white py-14 sm:py-20 lg:py-28">
          <div class="container">
            <app-section-heading
              eyebrowKey="deptPage.eyebrow.events"
              titleKey="deptPage.events"
              data-aos="fade-up"
            />
            <div class="mt-12" data-aos="fade-up">
              <app-photo-gallery [images]="dept.events" />
            </div>
          </div>
        </section>
      }
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
    .acc-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      list-style: none;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .acc-summary::-webkit-details-marker {
      display: none;
    }
    .acc-chev {
      display: grid;
      height: 2rem;
      width: 2rem;
      flex-shrink: 0;
      place-items: center;
      border-radius: 9999px;
      background: #f1f5f2;
      color: #b70503;
      transition: transform 0.3s, background-color 0.3s;
    }
    .acc[open] .acc-chev {
      transform: rotate(180deg);
      background: #fde8e8;
    }
    .acc-body {
      margin-top: 1.1rem;
    }
    @media (min-width: 1024px) {
      .acc-summary {
        cursor: default;
        pointer-events: none;
      }
      .acc-body {
        margin-top: 1.25rem;
      }
    }
    .card-title {
      margin-bottom: 1.25rem;
      padding-inline-start: 0.9rem;
      border-inline-start: 4px solid #b70503;
      font-size: 1.15rem;
      font-weight: 800;
      line-height: 1.3;
      color: #002b19;
    }
    @media (min-width: 640px) {
      .card-title {
        font-size: 1.35rem;
      }
    }
  `,
})
export class DepartmentPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly applyUrl = EXTERNAL_LINKS.apply;
  protected readonly videoTab = signal(0);

  private readonly slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('slug'))), { initialValue: null });

  protected readonly department = computed(() => findDepartment(this.slug()));
  protected readonly others = computed(() => DEPARTMENTS.filter((d) => d.id !== this.department()?.id));

  constructor() {
    // Unknown slug -> back to the home page's departments section.
    effect(() => {
      if (this.slug() && !this.department()) {
        void this.router.navigate(['/'], { fragment: 'departments' });
      }
    });
  }

  /** Jump links shown on phones. */
  protected readonly chips = computed(() => {
    const d = this.department();
    if (!d) return [];
    return [
      { id: 'dept-overview', labelKey: 'deptPage.overview' },
      ...(d.videoGroups.length ? [{ id: 'dept-videos', labelKey: 'deptPage.videos.title' }] : []),
      ...(d.studyPlans.length ? [{ id: 'dept-plans', labelKey: 'deptPage.studyPlans' }] : []),
      ...(d.events.length ? [{ id: 'dept-events', labelKey: 'deptPage.events' }] : []),
      ...(d.downloads.length ? [{ id: 'dept-downloads', labelKey: 'deptPage.downloads' }] : []),
    ];
  });

  protected jump(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected has(section: DepartmentSection): boolean {
    return this.department()?.sections.includes(section) ?? false;
  }
}
