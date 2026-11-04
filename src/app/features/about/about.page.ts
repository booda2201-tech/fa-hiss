import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ORG_CHART_PDF, STATS } from '../../core/data/home.data';
import { TranslateListPipe } from '../../core/i18n/translate-list.pipe';
import { CounterComponent } from '../../shared/ui/counter/counter.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

/** `/about` – history, distinctive features and certificate equivalency. */
@Component({
  selector: 'app-about-page',
  imports: [TranslatePipe, TranslateListPipe, IconComponent, PageHeaderComponent, CounterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header titleKey="pages.about.title" subtitleKey="pages.about.intro" image="images/ref/hero/slide-05.jpg" />

    <!-- Numbers -->
    <section class="relative -mt-10 pb-6">
      <div class="container">
        <div class="grid gap-4 rounded-3xl bg-white p-6 shadow-soft-lg sm:grid-cols-3">
          @for (stat of stats; track stat.labelKey) {
            <div class="flex items-center justify-center gap-4 p-2">
              <span class="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-gradient shadow-soft">
                <img [src]="stat.icon" alt="" class="h-9 w-auto" loading="lazy" />
              </span>
              <div>
                <p class="text-3xl font-extrabold text-brand-900" dir="ltr">
                  <app-counter [value]="stat.value" [suffix]="stat.suffix ?? ''" />
                </p>
                <p class="text-sm font-semibold text-ink-muted">{{ stat.labelKey | translate }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- History -->
    <section class="bg-white py-16 lg:py-24">
      <div class="container">
        <div class="mx-auto max-w-3xl">
          <h2 class="text-3xl font-extrabold text-brand-900" data-aos="fade-up">{{ 'pages.about.historyTitle' | translate }}</h2>

          <ol class="relative mt-10 space-y-8 border-s-2 border-brand-100 ps-8">
            @for (entry of 'pages.about.history' | translateList; track entry.year) {
              <li class="relative" data-aos="fade-up">
                <span
                  class="absolute -start-[2.65rem] top-1.5 h-4 w-4 rounded-full border-4 border-white bg-accent-600 shadow"
                  aria-hidden="true"
                ></span>
                <p class="text-xl font-extrabold text-accent-600">{{ entry.year }}</p>
                <p class="mt-2 leading-loose text-ink/85">{{ entry.text }}</p>
              </li>
            }
          </ol>

          <a [href]="orgChart" target="_blank" rel="noopener noreferrer" class="btn-brand mt-12">
            <app-icon name="download" class="h-4 w-4" />
            {{ 'pages.about.orgChart' | translate }}
            <span class="sr-only">{{ 'a11y.newWindow' | translate }}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Distinctive features -->
    <section class="bg-surface py-16 lg:py-24">
      <div class="container">
        <h2 class="text-center text-3xl font-extrabold text-brand-900" data-aos="fade-up">
          {{ 'pages.about.featuresTitle' | translate }}
        </h2>

        <ul class="mt-12 grid gap-5 md:grid-cols-2">
          @for (feature of 'pages.about.features' | translateList; track $index; let i = $index) {
            <li
              class="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-soft"
              data-aos="fade-up"
              [attr.data-aos-delay]="(i % 2) * 100"
            >
              <span class="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                <app-icon name="check" class="h-4 w-4" />
              </span>
              <p class="leading-loose text-ink/85">{{ feature }}</p>
            </li>
          }
        </ul>
      </div>
    </section>

    <!-- Equivalency -->
    <section class="bg-brand-gradient py-16 text-white lg:py-20">
      <div class="container">
        <div class="mx-auto max-w-3xl text-center" data-aos="fade-up">
          <app-icon name="badge-check" class="mx-auto h-12 w-12 text-white/90" />
          <h2 class="mt-4 text-3xl font-extrabold">{{ 'pages.about.equivalencyTitle' | translate }}</h2>
          <p class="mt-4 text-base leading-loose text-white/85">{{ 'pages.about.equivalency' | translate }}</p>
        </div>
      </div>
    </section>
  `,
})
export class AboutPage {
  protected readonly stats = STATS;
  protected readonly orgChart = ORG_CHART_PDF;
}
