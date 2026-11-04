import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { EXTERNAL_LINKS } from '../../core/config/site.config';
import { TranslateListPipe } from '../../core/i18n/translate-list.pipe';
import { BulletListComponent } from '../../shared/ui/bullet-list/bullet-list.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

/** `/admission` – admission rules per division and the required documents. */
@Component({
  selector: 'app-admission-page',
  imports: [RouterLink, TranslatePipe, TranslateListPipe, IconComponent, PageHeaderComponent, BulletListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header titleKey="pages.admission.title" subtitleKey="pages.admission.intro" image="images/ref/hero/slide-07.jpg" />

    <section class="bg-surface py-16 lg:py-24">
      <div class="container">
        <h2 class="text-3xl font-extrabold text-brand-900" data-aos="fade-up">{{ 'pages.admission.rulesTitle' | translate }}</h2>

        <div class="mt-10 grid gap-6 lg:grid-cols-2">
          <article class="card" data-aos="fade-up">
            <h3 class="card-title">{{ 'pages.admission.bisTitle' | translate }}</h3>
            <app-bullet-list [items]="'pages.admission.bis' | translateList" />
          </article>

          <article class="card" data-aos="fade-up" data-aos-delay="100">
            <h3 class="card-title">{{ 'pages.admission.tourismTitle' | translate }}</h3>
            <app-bullet-list [items]="'pages.admission.tourism' | translateList" />

            <h3 class="card-title mt-8">{{ 'pages.admission.guidingTitle' | translate }}</h3>
            <app-bullet-list [items]="'pages.admission.guiding' | translateList" />
          </article>

          <article class="card lg:col-span-2" data-aos="fade-up">
            <h3 class="card-title">{{ 'pages.admission.foreignTitle' | translate }}</h3>
            <p class="leading-loose text-ink/85">{{ 'pages.admission.foreign' | translate }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-white py-16 lg:py-24">
      <div class="container">
        <div class="mx-auto max-w-3xl">
          <h2 class="flex items-center gap-3 text-3xl font-extrabold text-brand-900" data-aos="fade-up">
            <app-icon name="clipboard-list" class="h-8 w-8 text-accent-600" />
            {{ 'pages.admission.documentsTitle' | translate }}
          </h2>

          <ol class="mt-8 space-y-3">
            @for (doc of 'pages.admission.documents' | translateList; track $index; let i = $index) {
              <li class="flex items-start gap-4 rounded-2xl bg-surface p-4 leading-loose text-ink/90" data-aos="fade-up">
                <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-600 text-sm font-extrabold text-white">
                  {{ i + 1 }}
                </span>
                <span>{{ doc }}</span>
              </li>
            }
          </ol>
        </div>
      </div>
    </section>

    <section class="bg-brand-gradient py-16 text-white lg:py-20">
      <div class="container">
        <div class="mx-auto max-w-2xl text-center" data-aos="fade-up">
          <h2 class="text-3xl font-extrabold">{{ 'pages.admission.ctaTitle' | translate }}</h2>
          <p class="mt-3 text-lg text-white/80">{{ 'pages.admission.ctaText' | translate }}</p>
          <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a routerLink="/contact" class="btn-light !px-7 !py-3.5">{{ 'nav.contact' | translate }}</a>
            <a routerLink="/student-portal" class="btn-glass !px-7 !py-3.5">
              {{ 'header.studentPortal' | translate }}
            </a>
          </div>
        </div>
      </div>
    </section>
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
      font-size: 1.25rem;
      font-weight: 800;
      line-height: 1.3;
      color: #002b19;
    }
  `,
})
export class AdmissionPage {
  protected readonly portalUrl = EXTERNAL_LINKS.studentPortal;
}
