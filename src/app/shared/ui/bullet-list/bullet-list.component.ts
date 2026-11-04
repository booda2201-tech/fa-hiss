import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/** Checkmark list for already-translated strings. */
@Component({
  selector: 'app-bullet-list',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <ul class="space-y-3">
      @for (item of items(); track $index) {
        <li class="flex items-start gap-3 leading-loose text-ink/85">
          <span class="mt-2 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
            <app-icon name="check" class="h-3 w-3" />
          </span>
          <span>{{ item }}</span>
        </li>
      }
    </ul>
  `,
})
export class BulletListComponent {
  readonly items = input.required<readonly string[]>();
}
