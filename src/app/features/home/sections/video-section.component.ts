import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HOME_VIDEO } from '../../../core/data/home.data';
import { SectionHeadingComponent } from '../../../shared/ui/section-heading/section-heading.component';
import { YoutubeFacadeComponent } from '../../../shared/ui/youtube-facade/youtube-facade.component';

/** Institute introduction video. */
@Component({
  selector: 'app-video-section',
  imports: [SectionHeadingComponent, YoutubeFacadeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section id="video" class="bg-surface-soft py-16 lg:py-24">
      <div class="container">
        <app-section-heading eyebrowKey="video.eyebrow" titleKey="video.title" data-aos="fade-up" />
        <div class="relative mx-auto mt-12 max-w-4xl" data-aos="zoom-in">
          <div class="absolute -inset-3 rounded-[2.5rem] border border-accent-400/70 sm:-inset-4" aria-hidden="true"></div>
          <div class="relative overflow-hidden rounded-4xl shadow-luxe ring-1 ring-black/5">
            <app-youtube-facade [videoId]="video.youtubeId" [thumbnail]="video.thumbnail" titleKey="video.title" />
          </div>
        </div>
      </div>
    </section>
  `,
})
export class VideoSectionComponent {
  protected readonly video = HOME_VIDEO;
}
