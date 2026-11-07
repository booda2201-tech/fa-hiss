import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';

export interface ShowcaseVideo {
  /** YouTube video id. */
  readonly id: string;
  readonly title: string;
}

/**
 * Featured YouTube player with a playlist rail. Nothing third-party loads until the visitor
 * presses play; picking another item from the rail swaps the video and plays it right away.
 */
@Component({
  selector: 'app-video-showcase',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="grid grid-cols-[minmax(0,1fr)] gap-6" [class]="videos().length > 1 ? 'lg:grid-cols-[minmax(0,1fr)_23rem]' : ''">
      <!-- Stage -->
      <div class="min-w-0">
        <div class="relative">
          <div class="absolute -inset-2 rounded-[2rem] border border-white/20 sm:-inset-3" aria-hidden="true"></div>
          <div class="relative aspect-video overflow-hidden rounded-3xl bg-black shadow-luxe ring-1 ring-white/10">
            @if (playing()) {
              <iframe
                class="absolute inset-0 h-full w-full"
                [src]="embedUrl()"
                [title]="current().title"
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
                <img loading="lazy" decoding="async"
                  [src]="thumb(current().id)"
                  alt=""
                  class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30"></span>
                <span class="relative grid h-20 w-20 place-items-center rounded-full bg-accent-600 text-white shadow-glow transition duration-300 group-hover:scale-110 sm:h-24 sm:w-24">
                  <span class="absolute inset-0 animate-ping rounded-full bg-accent-500/40"></span>
                  <svg viewBox="0 0 24 24" class="relative h-9 w-9 translate-x-0.5" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            }
          </div>
        </div>
        <h3 class="mt-6 text-xl font-extrabold leading-relaxed text-white sm:text-2xl">{{ current().title }}</h3>
      </div>

      <!-- Playlist -->
      @if (videos().length > 1) {
        <div class="relative min-h-0 min-w-0">
        <ol class="video-rail flex max-h-[26rem] gap-2.5 overflow-auto pb-2 lg:absolute lg:inset-0 lg:max-h-none lg:flex-col lg:pb-0 lg:pe-2">
          @for (video of videos(); track video.id; let i = $index) {
            <li class="shrink-0 max-lg:w-72 lg:w-full">
              <button
                type="button"
                class="group flex min-h-[5.5rem] w-full items-center gap-3 rounded-2xl p-2 text-start transition duration-300"
                [class]="
                  i === selected()
                    ? 'bg-white shadow-soft'
                    : 'bg-black/20 hover:bg-white/10'
                "
                [attr.aria-current]="i === selected() ? 'true' : null"
                (click)="select(i)"
              >
                <span class="relative aspect-video w-28 shrink-0 self-center overflow-hidden rounded-xl bg-brand-950">
                  <img decoding="async" [src]="thumb(video.id)" alt="" loading="lazy" class="h-full w-full object-cover" />
                  <span
                    class="absolute start-1 top-1 z-10 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.68rem] font-extrabold tabular-nums shadow"
                    [class]="i === selected() ? 'bg-accent-600 text-white' : 'bg-black/60 text-white'"
                  >
                    {{ i + 1 }}
                  </span>
                  <span class="absolute inset-0 grid place-items-center bg-black/25 transition-colors group-hover:bg-black/5">
                    <span
                      class="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-brand-900 shadow transition-transform duration-300 group-hover:scale-110"
                    >
                      <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 translate-x-px" fill="currentColor" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </span>
                <span class="min-w-0 flex-1 self-center pe-1">
                  <span
                    class="line-clamp-3 block text-[0.88rem] font-bold leading-relaxed"
                    [class]="i === selected() ? 'text-brand-900' : 'text-white'"
                  >
                    {{ video.title }}
                  </span>
                </span>
              </button>
            </li>
          }
        </ol>
        </div>
      }
    </div>
  `,
  styles: `
    .video-rail {
      scrollbar-width: thin;
      scrollbar-color: rgb(255 255 255 / 0.35) transparent;
    }
  `,
})
export class VideoShowcaseComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly videos = input.required<readonly ShowcaseVideo[]>();

  protected readonly selected = signal(0);
  protected readonly playing = signal(false);

  protected readonly current = computed(() => {
    const list = this.videos();
    return list[Math.min(this.selected(), list.length - 1)];
  });

  /** Ids come from our own data files, never from user input. */
  protected readonly embedUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.current().id)}?autoplay=1&rel=0`,
    ),
  );

  protected thumb(id: string): string {
    return `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
  }

  protected select(i: number): void {
    this.selected.set(i);
    this.playing.set(true);
  }
}
