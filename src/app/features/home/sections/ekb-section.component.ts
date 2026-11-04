import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { EXTERNAL_LINKS } from '../../../core/config/site.config';
import { EKB_IMAGE } from '../../../core/data/home.data';
import { IconComponent } from '../../../shared/ui/icon/icon.component';

/** Egyptian Knowledge Bank banner. */
@Component({
  selector: 'app-ekb-section',
  imports: [TranslatePipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section class="relative overflow-hidden bg-brand-900 py-16 text-white lg:py-20">
      <div class="absolute inset-0 bg-brand-gradient" aria-hidden="true"></div>
      <div class="pointer-events-none absolute -top-24 end-10 h-80 w-80 rounded-full bg-white/10 blur-[110px]" aria-hidden="true"></div>
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-400/70 to-transparent" aria-hidden="true"></div>

      <div class="container relative">
        <div class="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div data-aos="fade-start">
            <div class="flex items-center gap-3" aria-hidden="true">
              <span class="h-2 w-2 rotate-45 bg-accent-500"></span>
              <span class="h-px w-16 bg-gradient-to-r from-accent-500 to-transparent rtl:bg-gradient-to-l"></span>
            </div>
            <h2 class="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-4xl">{{ 'ekb.title' | translate }}</h2>
            <p class="mt-6 max-w-xl text-base leading-loose text-white/80">{{ 'ekb.text' | translate }}</p>
            <a [href]="url" target="_blank" rel="noopener noreferrer" class="btn-light mt-10 !px-8 !py-3.5">
              {{ 'ekb.cta' | translate }}
              <app-icon name="external" class="h-4 w-4" />
              <span class="sr-only">{{ 'a11y.newWindow' | translate }}</span>
            </a>
          </div>

          <div class="relative" data-aos="fade-end">
            <div class="absolute -bottom-4 -end-4 h-full w-full rounded-4xl border border-accent-400/60" aria-hidden="true"></div>
            <img
              [src]="image"
              alt=""
              width="640"
              height="420"
              class="relative mx-auto max-h-96 w-full rounded-4xl object-cover shadow-luxe ring-1 ring-white/20"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  `,
})
export class EkbSectionComponent {
  protected readonly url = EXTERNAL_LINKS.egyptianKnowledgeBank;
  protected readonly image = EKB_IMAGE;
}
