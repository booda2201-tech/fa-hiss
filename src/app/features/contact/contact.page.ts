import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CONTACT, SOCIAL_LINKS } from '../../core/config/site.config';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

/** `/contact` – phones, e-mails, careers (#jobs) and complaints & suggestions (#complaints). */
@Component({
  selector: 'app-contact-page',
  imports: [TranslatePipe, IconComponent, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header titleKey="pages.contact.title" subtitleKey="pages.contact.intro" image="images/ref/hero/slide-08.jpg" />

    <section class="bg-surface py-16 lg:py-24">
      <div class="container">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <!-- Landlines -->
          <article class="card" data-aos="fade-up">
            <span class="icon-chip"><app-icon name="phone" class="h-6 w-6" /></span>
            <h2 class="mt-4 text-xl font-extrabold text-brand-900">{{ 'pages.contact.phones' | translate }}</h2>
            <ul class="mt-4 space-y-2">
              @for (phone of contact.landlines; track phone.tel) {
                <li>
                  <a [href]="'tel:' + phone.tel" dir="ltr" class="link inline-block">{{ phone.label }}</a>
                </li>
              }
            </ul>
          </article>

          <!-- Mobiles -->
          <article class="card" data-aos="fade-up" data-aos-delay="100">
            <span class="icon-chip"><app-icon name="phone" class="h-6 w-6" /></span>
            <h2 class="mt-4 text-xl font-extrabold text-brand-900">{{ 'pages.contact.mobiles' | translate }}</h2>
            <ul class="mt-4 space-y-2">
              @for (phone of contact.mobiles; track phone.tel) {
                <li>
                  <a [href]="'tel:' + phone.tel" dir="ltr" class="link inline-block">{{ phone.label }}</a>
                </li>
              }
            </ul>
          </article>

          <!-- WhatsApp -->
          <article class="card" data-aos="fade-up" data-aos-delay="200">
            <span class="icon-chip"><app-icon name="message-circle" class="h-6 w-6" /></span>
            <h2 class="mt-4 text-xl font-extrabold text-brand-900">{{ 'pages.contact.whatsapp' | translate }}</h2>
            <p class="mt-4">
              <a
                [href]="'https://wa.me/' + contact.whatsapp.tel.slice(1)"
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                class="link inline-block"
              >{{ contact.whatsapp.label }}</a>
            </p>
          </article>

          <!-- E-mails -->
          <article class="card md:col-span-2 lg:col-span-3" data-aos="fade-up">
            <div class="flex items-center gap-4">
              <span class="icon-chip"><app-icon name="mail" class="h-6 w-6" /></span>
              <h2 class="text-xl font-extrabold text-brand-900">{{ 'pages.contact.emailTitle' | translate }}</h2>
            </div>
            <dl class="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <dt class="text-sm font-semibold text-ink-muted">{{ 'pages.contact.support' | translate }}</dt>
                <dd><a [href]="'mailto:' + contact.emails.support" class="link break-all">{{ contact.emails.support }}</a></dd>
              </div>
              <div>
                <dt class="text-sm font-semibold text-ink-muted">{{ 'pages.contact.help' | translate }}</dt>
                <dd><a [href]="'mailto:' + contact.emails.help" class="link break-all">{{ contact.emails.help }}</a></dd>
              </div>
              <div>
                <dt class="text-sm font-semibold text-ink-muted">{{ 'pages.contact.jobsMail' | translate }}</dt>
                <dd><a [href]="'mailto:' + contact.emails.jobs" class="link break-all">{{ contact.emails.jobs }}</a></dd>
              </div>
            </dl>
          </article>
        </div>

        <!-- Social -->
        <div class="mt-10 flex flex-wrap items-center justify-center gap-3" data-aos="fade-up">
          <span class="font-bold text-brand-900">{{ 'pages.contact.social' | translate }}</span>
          @for (social of socials; track social.name) {
            <a
              [href]="social.href"
              target="_blank"
              rel="noopener noreferrer"
              [attr.aria-label]="social.name"
              class="grid h-11 w-11 place-items-center rounded-xl bg-white text-brand-700 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-brand-600 hover:text-white"
            >
              <app-icon [name]="social.icon" class="h-5 w-5" />
            </a>
          }
        </div>
      </div>
    </section>

    <section id="jobs" class="scroll-mt-20 bg-white py-16 lg:py-20">
      <div class="container">
        <div class="mx-auto flex max-w-3xl flex-col items-center text-center" data-aos="fade-up">
          <span class="icon-chip"><app-icon name="briefcase" class="h-6 w-6" /></span>
          <h2 class="mt-4 text-3xl font-extrabold text-brand-900">{{ 'pages.contact.jobsTitle' | translate }}</h2>
          <p class="mt-4 leading-loose text-ink/85">{{ 'pages.contact.jobsText' | translate }}</p>
          <a [href]="'mailto:' + contact.emails.jobs" class="btn-brand mt-6">
            <app-icon name="mail" class="h-4 w-4" />
            {{ contact.emails.jobs }}
          </a>
        </div>
      </div>
    </section>

    <section id="complaints" class="scroll-mt-20 bg-brand-gradient py-16 text-white lg:py-20">
      <div class="container">
        <div class="mx-auto flex max-w-3xl flex-col items-center text-center" data-aos="fade-up">
          <app-icon name="message-circle" class="h-12 w-12 text-white/90" />
          <h2 class="mt-4 text-3xl font-extrabold">{{ 'pages.contact.complaintsTitle' | translate }}</h2>
          <p class="mt-4 leading-loose text-white/85">{{ 'pages.contact.complaintsText' | translate }}</p>
          <a [href]="'mailto:' + contact.emails.help" class="btn-light mt-6">
            <app-icon name="mail" class="h-4 w-4" />
            {{ contact.emails.help }}
          </a>
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
    .icon-chip {
      display: grid;
      height: 3.25rem;
      width: 3.25rem;
      place-items: center;
      border-radius: 1rem;
      background: #005f37;
      color: #fff;
    }
    .link {
      font-weight: 700;
      color: #005f37;
      transition: color 0.2s;
    }
    .link:hover {
      color: #b70503;
    }
  `,
})
export class ContactPage {
  protected readonly contact = CONTACT;
  protected readonly socials = SOCIAL_LINKS;
}
