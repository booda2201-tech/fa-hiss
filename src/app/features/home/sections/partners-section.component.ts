import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GALLERY, PARTNERS } from '../../../core/data/home.data';
import { SectionHeadingComponent } from '../../../shared/ui/section-heading/section-heading.component';

/** Partner logos + a photo mosaic of institute events. */
@Component({
  selector: 'app-partners-section',
  imports: [TranslatePipe, SectionHeadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section id="partners" class="bg-surface-soft py-16 lg:py-24">
      <div class="container">
        <app-section-heading eyebrowKey="partners.eyebrow" titleKey="partners.title" data-aos="fade-up" />

        <ul class="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          @for (partner of partners; track partner.nameKey; let i = $index) {
            <li
              class="group relative grid aspect-[3/2] place-items-center overflow-hidden rounded-3xl bg-white p-6 shadow-card ring-1 ring-black/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-luxe"
              data-aos="zoom-in"
              [attr.data-aos-delay]="(i % 5) * 60"
            >
              <span class="absolute inset-x-6 bottom-0 h-0.5 origin-center scale-x-0 bg-accent-500 transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true"></span>
              <img decoding="async"
                [src]="partner.logo"
                [alt]="partner.nameKey | translate"
                class="max-h-full max-w-full object-contain opacity-80 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                loading="lazy"
              />
            </li>
          }
        </ul>

        <div class="mt-20 text-center" data-aos="fade-up">
          <h3 class="text-3xl font-extrabold text-brand-900 sm:text-4xl">{{ 'gallery.title' | translate }}</h3>
          <div class="mt-5 flex items-center justify-center gap-3" aria-hidden="true">
            <span class="h-px w-12 bg-gradient-to-r from-transparent to-accent-500"></span>
            <span class="h-2 w-2 rotate-45 bg-accent-500"></span>
            <span class="h-px w-12 bg-gradient-to-l from-transparent to-accent-500"></span>
          </div>
        </div>

        <ul class="mt-12 grid grid-flow-dense grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          @for (photo of gallery; track photo; let i = $index) {
            <li
              class="group relative aspect-[16/10] overflow-hidden rounded-3xl bg-brand-900 shadow-card"
              [class]="i === 0 || i === 5 ? 'lg:col-span-2 lg:row-span-2 lg:aspect-auto' : ''"
              data-aos="fade-up"
              [attr.data-aos-delay]="(i % 4) * 60"
            >
              <img decoding="async"
                [src]="photo"
                [alt]="'gallery.alt' | translate"
                width="640"
                height="311"
                class="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-110"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true"></div>
              <span class="absolute inset-x-0 bottom-0 h-1 origin-center scale-x-0 bg-accent-500 transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true"></span>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class PartnersSectionComponent {
  protected readonly partners = PARTNERS;
  // 10 photos fill the 4-column mosaic evenly (two 2×2 tiles + 8 singles).
  protected readonly gallery = GALLERY.slice(0, 10);
}
