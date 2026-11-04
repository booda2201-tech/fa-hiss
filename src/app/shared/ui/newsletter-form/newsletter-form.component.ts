import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../icon/icon.component';

type FormStatus = 'idle' | 'invalid' | 'success';

/**
 * Newsletter email capture. Purely presentational: validates the address and
 * emits it via `subscribed`; the parent wires it to a real API.
 */
@Component({
  selector: 'app-newsletter-form',
  imports: [ReactiveFormsModule, TranslatePipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="w-full" novalidate (submit)="onSubmit($event)">
      <label for="newsletter-email" class="sr-only">{{ 'newsletter.label' | translate }}</label>

      <div
        class="flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-soft ring-1 ring-black/5 transition-shadow focus-within:ring-2 focus-within:ring-brand-600"
        [class.!ring-brand-900]="status() === 'invalid'"
      >
        <app-icon name="mail" class="ms-3 h-5 w-5 text-brand-600" />
        <input
          id="newsletter-email"
          type="email"
          autocomplete="email"
          class="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-base text-ink placeholder:text-ink/50 focus:outline-none focus-visible:ring-0"
          [formControl]="email"
          [placeholder]="'newsletter.placeholder' | translate"
          [attr.aria-invalid]="status() === 'invalid'"
          aria-describedby="newsletter-feedback"
          (input)="status.set('idle')"
        />
        <button type="submit" class="btn-brand !rounded-xl !px-5 !py-2.5">
          <span class="hidden sm:inline">{{ 'newsletter.button' | translate }}</span>
          <app-icon name="send" [flipRtl]="true" class="h-4 w-4" />
          <span class="sr-only sm:hidden">{{ 'newsletter.button' | translate }}</span>
        </button>
      </div>

      <p id="newsletter-feedback" class="mt-2 min-h-5 ps-2 text-xs" role="status" aria-live="polite">
        @switch (status()) {
          @case ('invalid') {
            <span class="font-semibold text-white underline">{{ 'newsletter.invalid' | translate }}</span>
          }
          @case ('success') {
            <span class="font-semibold text-white">{{ 'newsletter.success' | translate }}</span>
          }
        }
      </p>
    </form>
  `,
})
export class NewsletterFormComponent {
  readonly subscribed = output<string>();

  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  protected readonly status = signal<FormStatus>('idle');

  protected onSubmit(event: Event): void {
    event.preventDefault();

    if (this.email.invalid) {
      this.status.set('invalid');
      return;
    }
    this.subscribed.emit(this.email.value.trim());
    this.email.reset();
    this.status.set('success');
  }
}
