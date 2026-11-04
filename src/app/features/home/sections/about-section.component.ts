import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FOUNDED_YEAR, STATS } from '../../../core/data/home.data';
import { CounterComponent } from '../../../shared/ui/counter/counter.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { SectionHeadingComponent } from '../../../shared/ui/section-heading/section-heading.component';

/** "Who we are" + vision / mission + headline numbers. */
@Component({
  selector: 'app-about-section',
  imports: [RouterLink, TranslatePipe, IconComponent, SectionHeadingComponent, CounterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section id="about" class="relative overflow-hidden bg-white py-16 lg:py-24">
      <div class="pointer-events-none absolute -top-32 end-0 h-96 w-96 rounded-full bg-mist/60 blur-3xl" aria-hidden="true"></div>

      <div class="container relative">
        <div class="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <!-- Photo with offset red frame -->
          <div class="relative mx-4 sm:mx-0" data-aos="fade-start">
            <div
              class="absolute -bottom-5 -end-5 h-full w-full rounded-4xl border-2 border-accent-500/70 sm:-bottom-6 sm:-end-6"
              aria-hidden="true"
            ></div>
            <div class="relative overflow-hidden rounded-4xl shadow-luxe">
              <img
                src="images/ref/hero/slide-04.jpg"
                alt=""
                width="1024"
                height="640"
                class="aspect-[4/5] w-full object-cover sm:aspect-[4/3]"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-transparent to-transparent" aria-hidden="true"></div>
              <div class="absolute bottom-0 start-0 flex items-end gap-4 p-6 text-white sm:p-8">
                <span class="text-6xl font-extrabold leading-none text-white sm:text-7xl">{{ founded }}</span>
                <span class="mb-1 max-w-[9rem] text-sm font-semibold leading-snug text-white/90">
                  {{ 'about.since' | translate }}
                </span>
              </div>
            </div>
          </div>

          <div data-aos="fade-end">
            <app-section-heading eyebrowKey="about.eyebrow" titleKey="about.title" align="start" />
            <p class="mt-8 text-base leading-loose text-ink/85">{{ 'about.text' | translate }}</p>
            <a routerLink="/about" class="btn-accent mt-10 !px-8 !py-3.5">
              {{ 'about.readMore' | translate }}
              <app-icon name="arrow-right" [flipRtl]="true" class="h-4 w-4" />
            </a>
          </div>
        </div>

        <!-- Vision & mission -->
        <div class="mt-20 grid gap-8 md:grid-cols-2">
          @for (card of cards; track card.key; let i = $index) {
            <article
              class="group relative overflow-hidden rounded-4xl bg-surface-soft p-9 ring-1 ring-brand-100 transition duration-500 hover:-translate-y-1.5 hover:shadow-luxe sm:p-11"
              data-aos="fade-up"
              [attr.data-aos-delay]="i * 120"
            >
              <span
                class="absolute inset-x-9 top-0 h-px bg-gradient-to-r from-transparent via-accent-500 to-transparent"
                aria-hidden="true"
              ></span>
              <span class="grid h-20 w-20 place-items-center rounded-3xl bg-white shadow-soft ring-1 ring-brand-100">
                <img [src]="card.icon" alt="" width="64" height="64" class="h-12 w-12" loading="lazy" />
              </span>
              <h3 class="mt-7 text-2xl font-extrabold text-brand-900 sm:text-3xl">{{ card.key + '.title' | translate }}</h3>
              <p class="mt-4 text-base leading-loose text-ink/80">{{ card.key + '.text' | translate }}</p>
            </article>
          }
        </div>
      </div>

      <!-- Numbers band -->
      <div class="relative mt-20 overflow-hidden bg-brand-gradient text-white">
        <div class="pointer-events-none absolute -top-24 start-1/4 h-72 w-72 rounded-full bg-accent-500/30 blur-[100px]" aria-hidden="true"></div>
        <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-400/70 to-transparent" aria-hidden="true"></div>
        <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-400/70 to-transparent" aria-hidden="true"></div>

        <div class="container relative">
          <ul class="grid divide-white/15 sm:grid-cols-3 sm:divide-x rtl:sm:divide-x-reverse">
            @for (stat of stats; track stat.labelKey; let i = $index) {
              <li
                class="flex flex-col items-center px-6 py-10 text-center"
                data-aos="fade-up"
                [attr.data-aos-delay]="i * 120"
              >
                <img [src]="stat.icon" alt="" class="h-14 w-auto opacity-90" loading="lazy" />
                <p class="mt-5 text-5xl font-extrabold tabular-nums text-white sm:text-6xl" dir="ltr">
                  <app-counter [value]="stat.value" [suffix]="stat.suffix ?? ''" />
                </p>
                <p class="mt-3 text-base font-semibold text-white/85">{{ stat.labelKey | translate }}</p>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class AboutSectionComponent {
  protected readonly founded = FOUNDED_YEAR;
  protected readonly stats = STATS;
  protected readonly cards = [
    { key: 'about.vision', icon: 'images/ref/icons/vision.svg' },
    { key: 'about.mission', icon: 'images/ref/icons/mission.svg' },
  ] as const;
}
