import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../icon/icon.component';

/**
 * Click-to-load YouTube player: shows a thumbnail first so the page doesn't
 * pull ~1 MB of third-party JS until the visitor actually wants the video.
 */
@Component({
  selector: 'app-youtube-facade',
  imports: [TranslatePipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative block aspect-video overflow-hidden rounded-3xl bg-brand-900 shadow-soft-lg' },
  template: `
    @if (playing()) {
      <iframe
        class="absolute inset-0 h-full w-full"
        [src]="embedUrl()"
        [title]="titleKey() | translate"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    } @else {
      <button
        type="button"
        class="group absolute inset-0 grid place-items-center"
        [attr.aria-label]="'a11y.playVideo' | translate"
        (click)="playing.set(true)"
      >
        <img decoding="async"
          [src]="thumbnail()"
          alt=""
          class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <span class="absolute inset-0 bg-brand-900/40 transition-colors group-hover:bg-brand-900/25"></span>
        <span
          class="relative grid h-20 w-20 place-items-center rounded-full bg-accent-600 text-white shadow-glow transition duration-300 group-hover:scale-110"
        >
          <app-icon name="play" class="h-8 w-8" />
        </span>
      </button>
    }
  `,
})
export class YoutubeFacadeComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly videoId = input.required<string>();
  readonly thumbnail = input.required<string>();
  readonly titleKey = input.required<string>();

  protected readonly playing = signal(false);

  /** `videoId` comes from our own config, never from user input. */
  protected readonly embedUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.videoId())}?autoplay=1&rel=0`,
    ),
  );
}
