import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SERVICES, ServiceLink } from '../../../core/data/home.data';
import { HoverLiftDirective } from '../../../shared/directives/hover-lift.directive';
import { IconComponent, IconName } from '../../../shared/ui/icon/icon.component';
import { SectionHeadingComponent } from '../../../shared/ui/section-heading/section-heading.component';

interface ServiceGroup {
  readonly titleKey: string;
  readonly icon: IconName;
  readonly items: readonly ServiceLink[];
}

interface FeaturedService extends ServiceLink {
  readonly id: string;
}

/** The four services students reach for most; they get large quick-access cards. */
const FEATURED_IDS = ['schedules', 'results', 'training', 'employment'] as const;

/** Which services belong to which group (by label key). */
const GROUPS: readonly { titleKey: string; icon: IconName; keys: readonly string[] }[] = [
  {
    titleKey: 'services.groups.academic',
    icon: 'book-open',
    keys: ['schedules', 'exams', 'results', 'advising', 'library', 'faculty'],
  },
  {
    titleKey: 'services.groups.life',
    icon: 'users',
    keys: ['activities', 'youth', 'health', 'military', 'expatriates', 'graduation'],
  },
  {
    titleKey: 'services.groups.institute',
    icon: 'badge-check',
    keys: ['training', 'employment', 'seminars', 'journals', 'quality'],
  },
];

const findService = (key: string): ServiceLink => SERVICES.find((s) => s.labelKey === `services.${key}`)!;

/**
 * Student services: four large quick-access cards for the most-used services,
 * followed by the complete list grouped so all 17 links stay scannable.
 * The pages still live on the legacy WordPress site, so each link opens it in a new tab.
 */
@Component({
  selector: 'app-services-section',
  imports: [RouterLink, TranslatePipe, IconComponent, SectionHeadingComponent, HoverLiftDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section id="services" class="relative bg-white py-16 lg:py-24">
      <div class="container">
        <app-section-heading
          eyebrowKey="services.eyebrow"
          titleKey="services.title"
          subtitleKey="services.subtitle"
          data-aos="fade-up"
        />

        <!-- Featured quick-access cards -->
        <ul class="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          @for (item of featured; track item.id; let i = $index) {
            <li data-aos="fade-up" [attr.data-aos-delay]="i * 90">
              <a
                appHoverLift
                [routerLink]="item.path"
                class="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-4 shadow-card ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-luxe focus-visible:shadow-luxe active:scale-[0.98] sm:p-7"
              >
                <span
                  class="absolute inset-x-0 top-0 h-1.5 origin-left scale-x-0 bg-accent-gradient transition-transform duration-500 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100 rtl:origin-right"
                  aria-hidden="true"
                ></span>

                <span
                  data-hover-icon
                  class="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-soft sm:h-16 sm:w-16"
                >
                  <app-icon [name]="item.icon" class="h-6 w-6 sm:h-8 sm:w-8" />
                </span>

                <h3 class="mt-4 text-base font-extrabold leading-snug text-brand-900 transition-colors group-hover:text-accent-600 sm:mt-6 sm:text-xl">
                  {{ item.labelKey | translate }}
                </h3>
                <p class="mt-2 line-clamp-3 flex-1 text-[0.8rem] leading-relaxed text-ink/70 sm:mt-2.5 sm:line-clamp-none sm:text-base sm:leading-loose sm:text-ink/75">
                  {{ 'services.desc.' + item.id | translate }}
                </p>

                <span class="mt-4 inline-flex items-center gap-2 text-xs font-bold text-accent-600 sm:mt-6 sm:text-sm">
                  {{ 'services.open' | translate }}
                  <app-icon
                    name="arrow-right"
                    [flipRtl]="true"
                    class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5"
                  />
                </span>
              </a>
            </li>
          }
        </ul>

        <!-- Complete list -->
        <div class="mt-16 lg:mt-20" data-aos="fade-up">
          <h3 class="flex items-center gap-4 text-xl font-extrabold text-brand-900">
            {{ 'services.allTitle' | translate }}
            <span class="h-px flex-1 bg-brand-100" aria-hidden="true"></span>
          </h3>

          <div class="mt-6 grid overflow-hidden rounded-3xl bg-surface-soft ring-1 ring-black/5 lg:grid-cols-3">
            @for (group of groups; track group.titleKey; let last = $last) {
              <section
                class="p-4 sm:p-8"
                [class]="last ? '' : 'border-b border-black/5 lg:border-b-0 lg:border-e'"
                [attr.aria-labelledby]="group.titleKey"
              >
                <h4 [id]="group.titleKey" class="flex items-center gap-3 text-lg font-extrabold text-brand-900">
                  <span class="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
                    <app-icon [name]="group.icon" class="h-5 w-5" />
                  </span>
                  {{ group.titleKey | translate }}
                </h4>

                <ul class="mt-4 grid grid-cols-2 gap-2 sm:mt-5 lg:block lg:space-y-1">
                  @for (service of group.items; track service.labelKey) {
                    <li>
                      <a
                        [routerLink]="service.path"
                        class="group flex h-full items-center gap-2.5 rounded-xl bg-white px-3 py-3 text-[0.8rem] font-semibold leading-snug text-ink shadow-soft transition-colors duration-200 hover:text-accent-600 active:scale-[0.97] sm:text-[0.95rem] lg:gap-3 lg:bg-transparent lg:text-[0.95rem] lg:shadow-none lg:hover:bg-white"
                      >
                        <app-icon
                          [name]="service.icon"
                          class="h-[1.15rem] w-[1.15rem] shrink-0 text-brand-600 transition-colors group-hover:text-accent-600"
                        />
                        <span class="flex-1">
                          {{ service.labelKey | translate }}
                        </span>
                        <app-icon
                          name="arrow-right"
                          [flipRtl]="true"
                          class="hidden h-3.5 w-3.5 opacity-0 transition duration-200 lg:block group-hover:translate-x-0.5 group-hover:opacity-100 rtl:group-hover:-translate-x-0.5"
                        />
                      </a>
                    </li>
                  }
                </ul>
              </section>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ServicesSectionComponent {
  protected readonly featured: readonly FeaturedService[] = FEATURED_IDS.map((id) => ({
    ...findService(id),
    id,
  }));

  protected readonly groups: readonly ServiceGroup[] = GROUPS.map((g) => ({
    titleKey: g.titleKey,
    icon: g.icon,
    items: g.keys.map(findService),
  }));
}
