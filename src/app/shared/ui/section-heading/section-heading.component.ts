import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/** Eyebrow + red ornament + title (+ optional subtitle) used at the top of every home section. */
@Component({
  selector: 'app-section-heading',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="max-w-2xl" [class]="align() === 'center' ? 'mx-auto text-center' : 'text-start'">
      @if (eyebrowKey(); as eyebrow) {
        <p
          class="text-sm font-bold ltr:text-xs ltr:uppercase ltr:tracking-[0.2em]"
          [class]="light() ? 'text-accent-200' : 'text-accent-600'"
        >
          {{ eyebrow | translate }}
        </p>
      }

      <!-- Ornament -->
      <div
        class="mt-4 flex items-center gap-3"
        [class]="align() === 'center' ? 'justify-center' : ''"
        aria-hidden="true"
      >
        <span class="h-px w-12 bg-gradient-to-r from-transparent to-accent-500"></span>
        <span class="h-2 w-2 rotate-45 bg-accent-500"></span>
        <span class="h-px w-12 bg-gradient-to-l from-transparent to-accent-500"></span>
      </div>

      <h2
        class="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-4xl"
        [class]="light() ? 'text-white' : 'text-brand-900'"
      >
        {{ titleKey() | translate }}
      </h2>
      @if (subtitleKey(); as subtitle) {
        <p class="mt-4 text-lg leading-relaxed" [class]="light() ? 'text-white/75' : 'text-ink-muted'">
          {{ subtitle | translate }}
        </p>
      }
    </div>
  `,
})
export class SectionHeadingComponent {
  readonly eyebrowKey = input<string | null>(null);
  readonly titleKey = input.required<string>();
  readonly subtitleKey = input<string | null>(null);
  readonly light = input(false);
  readonly align = input<'center' | 'start'>('center');
}
