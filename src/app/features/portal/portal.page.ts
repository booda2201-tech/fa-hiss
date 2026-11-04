import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CONTACT, EXTERNAL_LINKS } from '../../core/config/site.config';
import { SERVICES } from '../../core/data/home.data';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

/** Keys of the services most students come to the portal for. */
const QUICK = ['schedules', 'exams', 'results', 'advising', 'library', 'activities'];

/**
 * `/student-portal` – branded gateway to the university system (UMIS).
 * UMIS itself is a separate application on sis.fa-hiss.edu.eg; sign-in happens there.
 */
@Component({
  selector: 'app-portal-page',
  imports: [RouterLink, TranslatePipe, IconComponent, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header titleKey="pages.portal.title" subtitleKey="pages.portal.intro" image="images/ref/hero/slide-03.jpg" />

    <section class="bg-surface py-16 lg:py-20">
      <div class="container">
        <div class="grid gap-6 lg:grid-cols-5">
          <!-- Sign in -->
          <article class="relative overflow-hidden rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5 sm:p-10 lg:col-span-3" data-aos="fade-up">
            <span class="absolute inset-x-0 top-0 h-1 bg-accent-gradient" aria-hidden="true"></span>
            <div class="flex items-center gap-4">
              <span class="grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft">
                <app-icon name="user" class="h-7 w-7" />
              </span>
              <div>
                <h2 class="text-2xl font-extrabold text-brand-900">{{ 'pages.portal.loginTitle' | translate }}</h2>
                <p class="text-sm font-semibold text-ink-muted" dir="ltr">UMIS · sis.fa-hiss.edu.eg</p>
              </div>
            </div>

            <p class="mt-6 text-base leading-loose text-ink/85">{{ 'pages.portal.loginText' | translate }}</p>

            <a [href]="portalUrl" target="_blank" rel="noopener noreferrer" class="btn-accent mt-8 !px-8 !py-3.5">
              {{ 'pages.portal.loginCta' | translate }}
              <app-icon name="external" class="h-4 w-4" />
              <span class="sr-only">{{ 'a11y.newWindow' | translate }}</span>
            </a>
            <p class="mt-4 text-xs text-ink-muted">{{ 'pages.portal.loginNote' | translate }}</p>
          </article>

          <!-- Help -->
          <aside class="rounded-3xl bg-brand-900 p-8 text-white shadow-card sm:p-10 lg:col-span-2" data-aos="fade-up" data-aos-delay="100">
            <span class="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-accent-300">
              <app-icon name="message-circle" class="h-6 w-6" />
            </span>
            <h2 class="mt-5 text-xl font-extrabold">{{ 'pages.portal.helpTitle' | translate }}</h2>
            <p class="mt-3 text-sm leading-loose text-white/75">{{ 'pages.portal.helpText' | translate }}</p>

            <ul class="mt-6 space-y-3 text-sm">
              <li>
                <a [href]="'mailto:' + contact.emails.support" class="flex items-center gap-3 transition-colors hover:text-accent-300">
                  <app-icon name="mail" class="h-4 w-4 text-accent-300" />
                  {{ contact.emails.support }}
                </a>
              </li>
              <li>
                <a [href]="'tel:' + contact.mobiles[0].tel" class="flex items-center gap-3 transition-colors hover:text-accent-300">
                  <app-icon name="phone" class="h-4 w-4 text-accent-300" />
                  <span dir="ltr">{{ contact.mobiles[0].label }}</span>
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>

    <!-- Quick links -->
    <section class="bg-white py-16 lg:py-20">
      <div class="container">
        <h2 class="text-center text-2xl font-extrabold text-brand-900 sm:text-3xl" data-aos="fade-up">
          {{ 'pages.portal.quickTitle' | translate }}
        </h2>

        <ul class="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          @for (link of quick; track link.labelKey; let i = $index) {
            <li data-aos="fade-up" [attr.data-aos-delay]="(i % 3) * 60">
              <a
                [routerLink]="link.path"
                class="group flex items-center gap-4 rounded-2xl bg-surface-soft p-4 ring-1 ring-black/5 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-soft"
              >
                <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white transition-colors group-hover:bg-accent-600">
                  <app-icon [name]="link.icon" class="h-5 w-5" />
                </span>
                <span class="flex-1 text-sm font-bold text-brand-900">
                  {{ link.labelKey | translate }}
                </span>
                <app-icon name="arrow-right" [flipRtl]="true" class="h-3.5 w-3.5 text-ink-muted/60" />
              </a>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class PortalPage {
  protected readonly portalUrl = EXTERNAL_LINKS.studentPortal;
  protected readonly contact = CONTACT;
  protected readonly quick = QUICK.map((k) => SERVICES.find((s) => s.labelKey === `services.${k}`)!);
}
