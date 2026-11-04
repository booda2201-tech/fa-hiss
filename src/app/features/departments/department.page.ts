import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';
import { DEPARTMENTS, DepartmentSection, findDepartment } from '../../core/data/departments.data';
import { TranslateListPipe } from '../../core/i18n/translate-list.pipe';
import { BulletListComponent } from '../../shared/ui/bullet-list/bullet-list.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (department(); as dept) {
      <app-page-header [titleKey]="'departments.' + dept.id" [image]="dept.image" />

      <section class="bg-surface py-16 lg:py-20">
        <div class="container grid gap-10 lg:grid-cols-[1fr_22rem]">
          <!-- Main column -->
          <div class="space-y-8">
            <article class="card" data-aos="fade-up">
              <h2 class="card-title">{{ 'deptPage.overview' | translate }}</h2>
              <div class="space-y-4 leading-loose text-ink/85">
                @for (paragraph of 'dept.' + dept.id + '.intro' | translateList; track $index) {
                  <p>{{ paragraph }}</p>
                }
              </div>
            </article>

            @if (has('mission')) {
              <article class="card" data-aos="fade-up">
                <h2 class="card-title">{{ 'deptPage.mission' | translate }}</h2>
                <p class="leading-loose text-ink/85">{{ 'dept.' + dept.id + '.mission' | translate }}</p>
              </article>
            }

            @if (has('degree')) {
              <article class="card" data-aos="fade-up">
                <h2 class="card-title">{{ 'deptPage.degree' | translate }}</h2>
                <p class="leading-loose text-ink/85">{{ 'dept.' + dept.id + '.degree' | translate }}</p>
              </article>
            }

            @if (has('careers')) {
              <article class="card" data-aos="fade-up">
                <h2 class="card-title">{{ 'deptPage.careers' | translate }}</h2>
                <app-bullet-list [items]="'dept.' + dept.id + '.careers' | translateList" />
              </article>
            }

            @if (has('facilities')) {
              <article class="card" data-aos="fade-up">
                <h2 class="card-title">{{ 'deptPage.facilities' | translate }}</h2>
                <app-bullet-list [items]="'dept.' + dept.id + '.facilities' | translateList" />
              </article>
            }

            @if (has('training')) {
              <article class="card" data-aos="fade-up">
                <h2 class="card-title">{{ 'deptPage.training' | translate }}</h2>
                <p class="leading-loose text-ink/85">{{ 'dept.' + dept.id + '.training' | translate }}</p>
              </article>
            }

            @if (has('fieldTrips')) {
              <article class="card" data-aos="fade-up">
                <h2 class="card-title">{{ 'deptPage.fieldTrips' | translate }}</h2>
                <p class="leading-loose text-ink/85">{{ 'dept.' + dept.id + '.fieldTrips' | translate }}</p>
              </article>
            }

            <article class="card" data-aos="fade-up">
              <h2 class="card-title">{{ 'deptPage.admission' | translate }}</h2>
              <app-bullet-list [items]="'dept.' + dept.id + '.admission' | translateList" />
            </article>

            @if (has('protocols')) {
              <article class="card" data-aos="fade-up">
                <h2 class="card-title">{{ 'deptPage.protocols' | translate }}</h2>
                <p class="mb-5 leading-loose text-ink/85">{{ 'dept.' + dept.id + '.protocolsIntro' | translate }}</p>
                <ul class="flex flex-wrap gap-2">
                  @for (name of 'dept.' + dept.id + '.protocols' | translateList; track $index) {
                    <li class="rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-800">{{ name }}</li>
                  }
                </ul>
              </article>
            }

            <article class="card" data-aos="fade-up">
              <h2 class="card-title">{{ 'deptPage.system' | translate }}</h2>
              <app-bullet-list [items]="'deptPage.systemItems' | translateList" />
            </article>
          </div>

          <!-- Sidebar -->
          <aside class="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div class="rounded-3xl bg-brand-gradient p-7 text-white shadow-soft-lg">
              <h2 class="text-xl font-extrabold">{{ 'nav.admission' | translate }}</h2>
              <p class="mt-2 text-sm leading-relaxed text-white/80">{{ 'pages.admission.intro' | translate }}</p>
              <a [routerLink]="applyUrl" class="btn-light mt-5 w-full">
                {{ 'deptPage.apply' | translate }}
                <app-icon name="arrow-right" [flipRtl]="true" class="h-4 w-4" />
              </a>
            </div>

            @if (dept.downloads.length) {
              <div class="card">
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
                        <img [src]="other.icon" alt="" class="h-9 w-9" loading="lazy" />
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
export class DepartmentPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly applyUrl = EXTERNAL_LINKS.apply;

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

  protected has(section: DepartmentSection): boolean {
    return this.department()?.sections.includes(section) ?? false;
  }
}
