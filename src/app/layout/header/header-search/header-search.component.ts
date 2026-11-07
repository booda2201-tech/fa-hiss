import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchEntry, SearchService } from '../../../core/services/search.service';
import { IconComponent } from '../../../shared/ui/icon/icon.component';

/**
 * Search panel that slides open under the header: live suggestions as you type
 * (popular pages before you do), arrow-key navigation, Enter to open the highlighted result.
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
        <div class="mb-3 mt-2 overflow-hidden rounded-2xl bg-white text-ink ring-1 ring-black/10">
          <form class="flex items-center gap-2 border-b border-black/5 p-2.5 sm:gap-3 sm:p-3" role="search" (submit)="onSubmit($event)">
            <app-icon name="search" class="ms-2 h-5 w-5 shrink-0 text-ink-muted" />
            <input
              #field
              type="search"
              name="q"
              autocomplete="off"
              enterkeyhint="search"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="search-results"
              [attr.aria-expanded]="open()"
              [attr.aria-activedescendant]="active() >= 0 ? 'search-opt-' + active() : null"
              class="min-w-0 flex-1 bg-transparent py-2 text-base text-ink placeholder:text-ink-muted !outline-none focus:!outline-none focus-visible:!outline-none focus-visible:ring-0"
              [placeholder]="'header.searchPlaceholder' | translate"
              [attr.aria-label]="'header.search' | translate"
              [value]="query()"
              (input)="onInput($any($event.target).value)"
              (keydown.arrowdown)="move($event, 1)"
              (keydown.arrowup)="move($event, -1)"
            />
            @if (query()) {
              <button
                type="button"
                class="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-muted hover:bg-surface"
                [attr.aria-label]="'search.clear' | translate"
                (click)="clear()"
              >
                <app-icon name="close" class="h-4 w-4" />
              </button>
            }
            <button type="submit" class="btn-brand !px-5 !py-2 max-sm:hidden">
              {{ 'header.search' | translate }}
            </button>
            <button
              type="button"
              class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface text-ink-muted hover:text-accent-600"
              [attr.aria-label]="'a11y.closeSearch' | translate"
              (click)="closed.emit()"
            >
              <app-icon name="chevron-down" class="h-5 w-5 rotate-180" />
            </button>
          </form>

          <div class="hide-scrollbar max-h-[min(24rem,58svh)] overflow-y-auto overscroll-contain p-2" aria-live="polite">
            @if (items().length) {
              <p class="px-3 pb-1.5 pt-2 text-xs font-extrabold text-accent-700">
                {{ (query().trim() ? 'search.results' : 'search.popular') | translate }}
              </p>
              <ul id="search-results" role="listbox" class="grid grid-cols-2 gap-1.5 lg:grid-cols-3">
                @for (item of items(); track item.path + (item.fragment ?? ''); let i = $index) {
                  <li role="option" [id]="'search-opt-' + i" [attr.aria-selected]="i === active()">
                    <button
                      type="button"
                      class="flex h-full w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-start transition-colors max-sm:flex-col max-sm:justify-center max-sm:gap-2 max-sm:py-3.5 max-sm:text-center"
                      [class]="i === active() ? 'border-brand-200 bg-brand-50' : 'border-black/5 hover:bg-surface'"
                      (mouseenter)="active.set(i)"
                      (click)="go(item)"
                    >
                      <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-soft">
                        <app-icon [name]="item.icon" class="h-5 w-5" />
                      </span>
                      <span class="min-w-0 flex-1 max-sm:w-full max-sm:flex-none">
                        <span class="block truncate font-bold text-brand-900">{{ item.title }}</span>
                        <span class="block text-xs font-semibold text-ink-muted">{{ 'search.kind.' + item.kind | translate }}</span>
                      </span>
                      <app-icon name="arrow-right" [flipRtl]="true" class="h-4 w-4 shrink-0 text-accent-600 max-sm:hidden" />
                    </button>
                  </li>
                }
              </ul>
            } @else {
              <p class="px-4 py-8 text-center text-sm leading-relaxed text-ink-muted">{{ 'search.empty' | translate }}</p>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HeaderSearchComponent {
  private readonly router = inject(Router);
  private readonly search = inject(SearchService);

  readonly open = input(false);
  readonly closed = output<void>();

  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  protected readonly query = signal('');
  protected readonly active = signal(-1);

  /** Matches while typing; popular destinations while the field is empty. */
  protected readonly items = computed<readonly SearchEntry[]>(() =>
    this.query().trim() ? this.search.search(this.query()) : this.search.popular(),
  );

  constructor() {
    // Focus the field whenever the panel opens.
    afterRenderEffect(() => {
      if (this.open()) this.field().nativeElement.focus({ preventScroll: true });
    });

    // Start fresh every time it closes.
    effect(() => {
      if (!this.open()) {
        untracked(() => {
          this.query.set('');
          this.active.set(-1);
        });
      }
    });
  }

  protected onInput(value: string): void {
    this.query.set(value);
    this.active.set(value.trim() && this.items().length ? 0 : -1);
  }

  protected clear(): void {
    this.query.set('');
    this.active.set(-1);
    this.field().nativeElement.focus();
  }

  protected move(event: Event, dir: 1 | -1): void {
    event.preventDefault();
    const n = this.items().length;
    if (!n) return;
    this.active.update((i) => (i + dir + n) % n);
    document.getElementById('search-opt-' + this.active())?.scrollIntoView({ block: 'nearest' });
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    const list = this.items();
    const target = list[this.active()] ?? (this.query().trim() ? list[0] : undefined);
    if (target) this.go(target);
  }

  protected go(entry: SearchEntry): void {
    void this.router.navigate([entry.path], { fragment: entry.fragment });
    this.closed.emit();
  }
}
