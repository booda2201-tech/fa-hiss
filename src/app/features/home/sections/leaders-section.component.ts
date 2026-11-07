import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LEADERS } from '../../../core/data/home.data';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { SectionHeadingComponent } from '../../../shared/ui/section-heading/section-heading.component';

/** Messages from the dean and the chairman. */
@Component({
  selector: 'app-leaders-section',
  imports: [TranslatePipe, IconComponent, SectionHeadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section id="leaders" class="relative overflow-hidden bg-brand-900 py-16 text-white lg:py-24">
      <div class="absolute inset-0 bg-brand-gradient opacity-90" aria-hidden="true"></div>
      <div class="orb pointer-events-none absolute -bottom-24 start-0 h-96 w-96 rounded-full bg-accent-500/25 blur-[110px]" aria-hidden="true"></div>
      <div class="orb pointer-events-none absolute -top-24 end-0 h-80 w-80 rounded-full bg-accent-500/10 blur-[100px]" aria-hidden="true"></div>

      <div class="container relative">
        <app-section-heading eyebrowKey="leaders.eyebrow" titleKey="leaders.title" [light]="true" data-aos="fade-up" />

        <div class="hide-scrollbar -mx-[var(--gutter)] mt-10 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-6 md:mx-0 md:mt-12 md:grid md:gap-8 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-2">
          @for (leader of leaders; track leader.id; let i = $index) {
            <figure
              class="relative flex w-[86vw] max-w-[26rem] shrink-0 snap-start flex-col overflow-hidden rounded-4xl bg-white p-6 text-ink shadow-luxe sm:p-10 md:w-auto md:max-w-none"
              data-aos="fade-up"
              [attr.data-aos-delay]="i * 150"
            >
              <span class="absolute inset-x-10 top-0 h-1 rounded-b-full bg-gradient-to-r from-accent-400 via-accent-600 to-accent-400" aria-hidden="true"></span>
              <app-icon name="quote" class="absolute end-8 top-8 hidden h-16 w-16 text-accent-400/50 sm:block" />

              <figcaption class="flex items-center gap-4 sm:gap-6">
                <span class="rounded-full bg-gradient-to-br from-accent-400 to-accent-700 p-1 shadow-soft">
                  <img decoding="async"
                    [src]="leader.photo"
                    alt=""
                    width="112"
                    height="112"
                    class="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-white sm:h-28 sm:w-28"
                    loading="lazy"
                  />
                </span>
                <div>
                  <p class="text-xl font-extrabold text-brand-900 sm:text-2xl">{{ 'leaders.' + leader.id + '.name' | translate }}</p>
                  <p class="mt-1.5 text-sm font-bold text-accent-600">{{ 'leaders.' + leader.id + '.role' | translate }}</p>
                </div>
              </figcaption>

              <blockquote class="mt-6 flex-1 border-s-2 border-accent-400 ps-4 text-[0.95rem] sm:mt-8 sm:ps-6 sm:text-base leading-loose text-ink/80">
                {{ 'leaders.' + leader.id + '.message' | translate }}
              </blockquote>
            </figure>
          }
        </div>
      </div>
    </section>
  `,
})
export class LeadersSectionComponent {
  protected readonly leaders = LEADERS;
}
