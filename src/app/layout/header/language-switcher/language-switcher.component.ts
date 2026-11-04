import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { LangCode } from '../../../core/i18n/i18n.models';

export type HeaderTone = 'light' | 'dark';

/**
 * Presentational AR/EN toggle. Shows the language the user will switch TO,
 * written in that language (e.g. "العربية" while the site is in English).
 */
@Component({
  selector: 'app-language-switcher',
  imports: [IconComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors duration-300"
      [class]="toneClasses()"
      [attr.lang]="targetCode()"
      [attr.aria-label]="'a11y.switchLanguage' | translate"
      (click)="switchLanguage.emit()"
    >
      <app-icon name="globe" class="h-4 w-4" />
      <span>{{ targetLabel() }}</span>
    </button>
  `,
})
export class LanguageSwitcherComponent {
  readonly targetCode = input.required<LangCode>();
  readonly targetLabel = input.required<string>();
  /** `dark` = placed over a dark/transparent background (white text). */
  readonly tone = input<HeaderTone>('dark');

  readonly switchLanguage = output<void>();

  protected readonly toneClasses = computed(() =>
    this.tone() === 'dark'
      ? 'text-white hover:bg-white/15'
      : 'text-ink hover:bg-surface',
  );
}
