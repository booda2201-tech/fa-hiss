import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
    <app-page-header image="images/ref/header/about.jpg" titleKey="pages.about.title" subtitleKey="pages.about.intro" />

    <!-- Numbers -->
    <section class="relative -mt-5 pb-6 sm:-mt-10">
      <div class="container">
        <div class="grid grid-cols-3 gap-2 rounded-3xl bg-white p-4 shadow-soft-lg sm:gap-4 sm:p-6">
          @for (stat of stats; track stat.labelKey) {
            <div class="flex flex-col items-center justify-center gap-2 p-1 text-center sm:flex-row sm:gap-4 sm:p-2 sm:text-start">
              <span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-gradient shadow-soft sm:h-16 sm:w-16">
                <img decoding="async" [src]="stat.icon" alt="" class="h-7 w-auto sm:h-9" loading="lazy" />
              </span>
              <div>
                <p class="text-xl font-extrabold text-brand-900 sm:text-3xl" dir="ltr">
                  <app-counter [value]="stat.value" [suffix]="stat.suffix ?? ''" />
                </p>
                <p class="text-[0.7rem] font-semibold leading-tight text-ink-muted sm:text-sm">{{ stat.labelKey | translate }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- History -->
    <section class="bg-white py-16 lg:py-24">
      <div class="container">
        <div class="mx-auto max-w-5xl">
          <div class="text-center" data-aos="fade-up">
            <span class="inline-flex items-center gap-2 rounded-full bg-accent-600/10 px-4 py-1.5 text-sm font-bold text-accent-600">
              <span class="h-1.5 w-1.5 rounded-full bg-accent-600"></span>
              1975 – {{ 'pages.about.historyNow' | translate }}
            </span>
            <h2 class="mt-4 text-3xl font-extrabold text-brand-900 lg:text-4xl">{{ 'pages.about.historyTitle' | translate }}</h2>
            <span class="mx-auto mt-4 block h-1 w-16 rounded-full bg-accent-gradient"></span>
          </div>

          <ol class="relative mt-14 space-y-6 md:space-y-8">
            <span
              class="pointer-events-none absolute bottom-0 top-2 start-[0.5625rem] w-0.5 bg-gradient-to-b from-brand-600/60 via-brand-300/50 to-transparent md:start-1/2"
              aria-hidden="true"
            ></span>
            @for (entry of 'pages.about.history' | translateList; track entry.year; let i = $index) {
              <li class="relative ps-10 md:grid md:grid-cols-2 md:gap-x-16 md:ps-0" data-aos="fade-up">
                <span
                  class="absolute start-0 top-7 grid h-5 w-5 place-items-center rounded-full bg-brand-gradient ring-[6px] ring-white md:start-1/2 md:ltr:-translate-x-1/2 md:rtl:translate-x-1/2"
                  aria-hidden="true"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-white"></span>
                </span>
                <div
                  class="group rounded-2xl bg-surface p-5 ring-1 ring-brand-100 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-soft lg:p-6"
                  [class]="i % 2 === 0 ? 'md:col-start-1' : 'md:col-start-2'"
                >
                  <p class="inline-flex items-center rounded-full bg-brand-gradient px-4 py-1 text-lg font-extrabold tabular-nums text-white shadow-soft">
                    {{ entry.year }}
                  </p>
                  <p class="mt-3 leading-loose text-ink/85">{{ entry.text }}</p>
                </div>
              </li>
            }
          </ol>

          <div class="mt-12 text-center">
            <a [href]="orgChart" target="_blank" rel="noopener noreferrer" class="btn-brand">
              <app-icon name="download" class="h-4 w-4" />
              {{ 'pages.about.orgChart' | translate }}
              <span class="sr-only">{{ 'a11y.newWindow' | translate }}</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Distinctive features -->
    <section class="bg-surface py-16 lg:py-24">
      <div class="container">
        <h2 class="text-center text-3xl font-extrabold text-brand-900" data-aos="fade-up">
          {{ 'pages.about.featuresTitle' | translate }}
        </h2>

        <ul class="mt-8 grid gap-3 sm:mt-12 sm:gap-5 md:grid-cols-2">
          @for (feature of 'pages.about.features' | translateList; track $index; let i = $index) {
            <li
              class="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-soft sm:gap-4 sm:p-6"
              [class.max-md:hidden]="!showAllFeatures() && i >= 4"
            >
              <span class="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600 text-white sm:h-8 sm:w-8">
                <app-icon name="check" class="h-4 w-4" />
              </span>
              <p class="text-[0.95rem] leading-loose text-ink/85 sm:text-base">{{ feature }}</p>
            </li>
          }
        </ul>
        <div class="mt-5 text-center md:hidden">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-brand-800 shadow-soft active:scale-95"
            [attr.aria-expanded]="showAllFeatures()"
            (click)="showAllFeatures.set(!showAllFeatures())"
          >
            {{ (showAllFeatures() ? 'dock.showLess' : 'dock.showMore') | translate }}
            <app-icon name="chevron-down" class="h-4 w-4 transition-transform" [class.rotate-180]="showAllFeatures()" />
          </button>
        </div>
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
  /** Phones show the first few distinctive features, the rest on demand. */
  protected readonly showAllFeatures = signal(false);
  protected readonly stats = STATS;
  protected readonly orgChart = ORG_CHART_PDF;
}
