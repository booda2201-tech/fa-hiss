import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
    <app-page-header image="images/ref/header/library.jpg" titleKey="pages.admission.title" subtitleKey="pages.admission.intro" />

    <section class="bg-surface py-16 lg:py-24">
      <div class="container">
        <h2 class="text-3xl font-extrabold text-brand-900" data-aos="fade-up">{{ 'pages.admission.rulesTitle' | translate }}</h2>

        <!-- Phones: one division at a time, picked from a pill rail -->
        <div role="tablist" class="hide-scrollbar -mx-[var(--gutter)] mt-6 flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1 lg:hidden">
          @for (label of 'pages.admission.tabs' | translateList; track $index; let i = $index) {
            <button
              type="button"
              role="tab"
              class="shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-[0.85rem] font-extrabold transition active:scale-95"
              [class]="i === rule() ? 'bg-brand-600 text-white shadow-soft' : 'bg-white text-brand-900 shadow-soft'"
              [attr.aria-selected]="i === rule()"
              (click)="rule.set(i)"
            >
              {{ label }}
            </button>
          }
        </div>

        <div class="mt-5 grid gap-6 lg:mt-10 lg:grid-cols-2">
          <article class="card" [class.max-lg:hidden]="rule() !== 0">
            <h3 class="card-title">{{ 'pages.admission.bisTitle' | translate }}</h3>
            <app-bullet-list [items]="'pages.admission.bis' | translateList" />
          </article>

          <article class="card" [class.max-lg:hidden]="rule() !== 1">
            <h3 class="card-title">{{ 'pages.admission.tourismTitle' | translate }}</h3>
            <app-bullet-list [items]="'pages.admission.tourism' | translateList" />
          </article>

          <article class="card" [class.max-lg:hidden]="rule() !== 2">
            <h3 class="card-title">{{ 'pages.admission.guidingTitle' | translate }}</h3>
            <app-bullet-list [items]="'pages.admission.guiding' | translateList" />
          </article>

          <article class="card" [class.max-lg:hidden]="rule() !== 3">
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
      padding: 1.25rem;
      box-shadow: 0 8px 30px -8px rgb(36 52 63 / 0.12);
    }
    @media (min-width: 640px) {
      .card {
        padding: 1.75rem;
      }
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
  /** Which division's rules are visible on phones. */
  protected readonly rule = signal(0);
  protected readonly portalUrl = EXTERNAL_LINKS.studentPortal;
}
