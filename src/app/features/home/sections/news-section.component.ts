import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { NEWS } from '../../../core/data/home.data';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { SectionHeadingComponent } from '../../../shared/ui/section-heading/section-heading.component';

/** Scroll-snap news carousel of poster-style cards (native scrolling, buttons for desktop). */
@Component({
  selector: 'app-news-section',
  imports: [TranslatePipe, IconComponent, SectionHeadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section id="news" class="bg-white py-16 lg:py-24">
      <div class="container">
        <div class="flex items-end justify-between gap-6">
          <app-section-heading eyebrowKey="news.eyebrow" titleKey="news.title" align="start" data-aos="fade-up" />

          <div class="hidden gap-3 sm:flex">
            <button type="button" class="nav-btn" [attr.aria-label]="'a11y.previous' | translate" (click)="scrollBy(-1)">
              <app-icon name="chevron-left" [flipRtl]="true" class="h-5 w-5" />
            </button>
            <button type="button" class="nav-btn" [attr.aria-label]="'a11y.next' | translate" (click)="scrollBy(1)">
              <app-icon name="chevron-right" [flipRtl]="true" class="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          #track
          class="news-track -mx-[var(--gutter)] mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-10 pt-2 outline-none focus-visible:ring-2 focus-visible:ring-accent-600/40"
          tabindex="0"
          role="region"
          [attr.aria-label]="'news.title' | translate"
        >
          @for (item of news; track item.image) {
            <a
              [href]="item.image"
              target="_blank"
              rel="noopener"
              class="group relative block aspect-[4/5] w-[78%] shrink-0 snap-start overflow-hidden rounded-4xl bg-brand-900 shadow-card ring-1 ring-black/5 transition duration-500 hover:-translate-y-2 hover:shadow-luxe sm:w-[21rem]"
            >
              <img decoding="async"
                [src]="item.image"
                [alt]="item.textKey ? '' : ('news.alt' | translate)"
                width="640"
                height="800"
                class="absolute inset-0 h-full w-full object-cover object-top transition duration-1000 group-hover:scale-105"
                loading="lazy"
              />
              <div
                class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-900 via-brand-900/85 to-transparent px-6 pb-6 pt-24 text-white"
              >
                <span class="mb-3 block h-px w-10 bg-accent-500 transition-all duration-500 group-hover:w-20" aria-hidden="true"></span>
                @if (item.textKey) {
                  <p class="line-clamp-3 text-sm font-semibold leading-loose">{{ item.textKey | translate }}</p>
                } @else {
                  <p class="flex items-center gap-2 text-sm font-bold text-accent-200">
                    {{ 'news.view' | translate }}
                    <app-icon name="external" class="h-4 w-4" />
                  </p>
                }
              </div>
            </a>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .nav-btn {
      display: grid;
      height: 3rem;
      width: 3rem;
      place-items: center;
      border-radius: 9999px;
      border: 1px solid #006638;
      color: #006638;
      background: #fff;
      transition:
        background-color 0.3s,
        color 0.3s,
        transform 0.3s;
    }
    .nav-btn:hover {
      background: #006638;
      color: #fff;
      transform: translateY(-2px);
    }
    .news-track {
      scrollbar-width: thin;
      scrollbar-color: #52a97c transparent;
    }
  `,
})
export class NewsSectionComponent {
  private readonly language = inject(LanguageService);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  protected readonly news = NEWS;

  /** `direction`: 1 = towards later items, -1 = back. Scrolling flips in RTL. */
  protected scrollBy(direction: 1 | -1): void {
    const el = this.track().nativeElement;
    const sign = this.language.isRtl() ? -1 : 1;
    el.scrollBy({ left: direction * sign * el.clientWidth * 0.8, behavior: 'smooth' });
  }
}
