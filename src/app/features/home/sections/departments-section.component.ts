import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DEPARTMENTS } from '../../../core/data/departments.data';
import { HoverLiftDirective } from '../../../shared/directives/hover-lift.directive';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { SectionHeadingComponent } from '../../../shared/ui/section-heading/section-heading.component';

/** The four academic departments, as photo cards. */
@Component({
  selector: 'app-departments-section',
  imports: [RouterLink, TranslatePipe, IconComponent, SectionHeadingComponent, HoverLiftDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section id="departments" class="relative bg-surface-soft py-16 lg:py-24">
      <div class="container">
        <app-section-heading eyebrowKey="departments.eyebrow" titleKey="departments.title" data-aos="fade-up" />

        <div class="mt-12 grid gap-8 md:grid-cols-2">
          @for (dept of departments; track dept.id; let i = $index) {
            <div data-aos="fade-up" [attr.data-aos-delay]="(i % 2) * 120">
            <a
              appHoverLift
              [routerLink]="['/departments', dept.slug]"
              class="group relative flex h-full flex-col overflow-hidden rounded-4xl bg-white shadow-card ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-luxe focus-visible:shadow-luxe"
            >
              <div class="relative aspect-[16/8] overflow-hidden bg-brand-900">
                <img
                  [src]="dept.image"
                  alt=""
                  width="800"
                  height="400"
                  class="h-full w-full object-cover opacity-80 transition duration-1000 group-hover:scale-110"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/30 to-transparent" aria-hidden="true"></div>
                <span class="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-accent-500 transition-transform duration-700 rtl:origin-right group-hover:scale-x-100" aria-hidden="true"></span>
              </div>

              <!-- Content; the icon medallion straddles the photo edge -->
              <div class="relative flex flex-1 flex-col px-8 pb-8 pt-12 sm:px-10 sm:pb-10">
                <span
                  data-hover-icon
                  class="absolute -top-10 start-8 grid h-20 w-20 place-items-center rounded-3xl bg-brand-gradient shadow-soft-lg ring-4 ring-white sm:start-10"
                >
                  <img [src]="dept.icon" alt="" width="56" height="56" class="h-12 w-12" loading="lazy" />
                </span>

                <h3 class="text-2xl font-extrabold text-brand-900 transition-colors group-hover:text-accent-600">
                  {{ 'departments.' + dept.id | translate }}
                </h3>
                <p class="mt-3 line-clamp-3 flex-1 leading-loose text-ink/75">
                  {{ 'dept.' + dept.id + '.short' | translate }}
                </p>
                <span class="mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent-600">
                  {{ 'departments.discover' | translate }}
                  <app-icon
                    name="arrow-right"
                    [flipRtl]="true"
                    class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5"
                  />
                </span>
              </div>
            </a>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class DepartmentsSectionComponent {
  protected readonly departments = DEPARTMENTS;
}
