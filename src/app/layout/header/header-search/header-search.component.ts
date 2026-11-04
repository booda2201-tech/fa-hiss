import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../../shared/ui/icon/icon.component';

/**
 * Presentational search bar that slides open under the header.
 * Emits `submitted` with the trimmed query; the parent decides what to do.
 */
@Component({
  selector: 'app-header-search',
  imports: [IconComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(keydown.escape)': 'closed.emit()',
  },
  template: `
    <div
      class="grid transition-[grid-template-rows,opacity] duration-300 ease-out-expo"
      [class]="open() ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
      [attr.inert]="open() ? null : ''"
    >
      <div class="overflow-hidden">
        <form
          class="mb-2 mt-2 flex items-center gap-3 rounded-2xl bg-surface p-3"
          role="search"
          (submit)="onSubmit($event, field.value)"
        >
          <app-icon name="search" class="ms-2 h-5 w-5 text-ink-muted" />
          <input
            #field
            type="search"
            name="q"
            autocomplete="off"
            class="min-w-0 flex-1 bg-transparent py-2 text-base text-ink placeholder:text-ink-muted focus:outline-none focus-visible:ring-0"
            [placeholder]="'header.searchPlaceholder' | translate"
            [attr.aria-label]="'header.search' | translate"
          />
          <button type="submit" class="btn-brand !px-5 !py-2">
            {{ 'header.search' | translate }}
          </button>
          <button
            type="button"
            class="grid h-9 w-9 place-items-center rounded-lg text-ink-muted hover:bg-surface"
            [attr.aria-label]="'a11y.closeSearch' | translate"
            (click)="closed.emit()"
          >
            <app-icon name="close" class="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  `,
})
export class HeaderSearchComponent {
  readonly open = input(false);

  readonly closed = output<void>();
  readonly submitted = output<string>();

  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  constructor() {
    // Move focus into the field whenever the panel opens.
    afterRenderEffect(() => {
      if (this.open()) this.field().nativeElement.focus({ preventScroll: true });
    });
  }

  protected onSubmit(event: Event, value: string): void {
    event.preventDefault();
    const query = value.trim();
    if (query) this.submitted.emit(query);
  }
}
