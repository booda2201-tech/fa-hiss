import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HERO_SLIDES } from '../../core/data/home.data';
import { HeroComponent } from './hero/hero.component';
import { AboutSectionComponent } from './sections/about-section.component';
import { DepartmentsSectionComponent } from './sections/departments-section.component';
import { EkbSectionComponent } from './sections/ekb-section.component';
import { LeadersSectionComponent } from './sections/leaders-section.component';
import { NewsSectionComponent } from './sections/news-section.component';
import { PartnersSectionComponent } from './sections/partners-section.component';
import { ServicesSectionComponent } from './sections/services-section.component';
import { VideoSectionComponent } from './sections/video-section.component';

/**
 * Home route. Section ids match the header anchors
 * (#about, #departments, #services, #news).
 */
@Component({
  selector: 'app-home-page',
  imports: [
    HeroComponent,
    AboutSectionComponent,
    DepartmentsSectionComponent,
    LeadersSectionComponent,
    ServicesSectionComponent,
    EkbSectionComponent,
    VideoSectionComponent,
    NewsSectionComponent,
    PartnersSectionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero [slides]="slides" />
    <app-about-section />
    <app-departments-section />
    <app-leaders-section />
    <app-services-section />
    <app-ekb-section />
    <app-video-section />
    <app-news-section />
    <app-partners-section />
  `,
})
export class HomePage {
  protected readonly slides = HERO_SLIDES;
}
