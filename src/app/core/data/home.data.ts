import { IconName } from '../../shared/ui/icon/icon.component';
import { LEGACY_SITE } from '../config/site.config';

const IMG = 'images/ref';
const pad = (n: number) => String(n).padStart(2, '0');

// ---------------------------------------------------------------- Hero
export const HERO_SLIDES: readonly string[] = Array.from(
  { length: 10 },
  (_, i) => `${IMG}/hero/slide-${pad(i + 1)}.jpg`,
);

// ---------------------------------------------------------------- About
export interface Stat {
  readonly value: number;
  readonly suffix?: string;
  readonly labelKey: string;
  readonly icon: string;
}

export const STATS: readonly Stat[] = [
  { value: 90573, labelKey: 'about.stats.graduates', icon: `${IMG}/icons/stat-graduates.svg` },
  { value: 8, labelKey: 'about.stats.labs', icon: `${IMG}/icons/stat-labs.svg` },
  { value: 50, suffix: '+', labelKey: 'about.stats.years', icon: `${IMG}/icons/stat-history.svg` },
];

export const FOUNDED_YEAR = 1975;

// ---------------------------------------------------------------- Leaders
export interface Leader {
  readonly id: 'dean' | 'chairman';
  readonly photo: string;
}

export const LEADERS: readonly Leader[] = [
  { id: 'dean', photo: `${IMG}/leaders/dean.png` },
  { id: 'chairman', photo: `${IMG}/leaders/chairman.png` },
];

// ---------------------------------------------------------------- Student services
export interface ServiceLink {
  readonly labelKey: string;
  readonly icon: IconName;
  /** Inner content page (`/pages/:slug`). */
  readonly path: string;
}

export const SERVICES: readonly ServiceLink[] = [
  { labelKey: 'services.schedules', icon: 'calendar', path: '/pages/schedules' },
  { labelKey: 'services.exams', icon: 'clipboard-list', path: '/pages/exams' },
  { labelKey: 'services.results', icon: 'award', path: '/pages/results' },
  { labelKey: 'services.training', icon: 'monitor', path: '/pages/training' },
  { labelKey: 'services.expatriates', icon: 'globe', path: '/pages/expatriates' },
  { labelKey: 'services.activities', icon: 'users', path: '/pages/activities' },
  { labelKey: 'services.health', icon: 'heart', path: '/pages/health' },
  { labelKey: 'services.employment', icon: 'briefcase', path: '/pages/employment' },
  { labelKey: 'services.graduation', icon: 'graduation-cap', path: '/pages/graduation' },
  { labelKey: 'services.military', icon: 'shield', path: '/pages/military' },
  { labelKey: 'services.youth', icon: 'user', path: '/pages/youth' },
  { labelKey: 'services.advising', icon: 'compass', path: '/pages/advising' },
  { labelKey: 'services.library', icon: 'book-open', path: '/pages/library' },
  { labelKey: 'services.quality', icon: 'badge-check', path: '/pages/quality' },
  { labelKey: 'services.faculty', icon: 'file-text', path: '/pages/faculty' },
  { labelKey: 'services.seminars', icon: 'mic', path: '/pages/seminars' },
  { labelKey: 'services.journals', icon: 'newspaper', path: '/pages/journals' },
];

// ---------------------------------------------------------------- Video
export const HOME_VIDEO = {
  youtubeId: 'eykWptbcDNw',
  thumbnail: `${IMG}/video-thumb.jpg`,
} as const;

// ---------------------------------------------------------------- Knowledge bank
export const EKB_IMAGE = `${IMG}/ekb.jpg`;

// ---------------------------------------------------------------- News
export interface NewsItem {
  readonly image: string;
  /** Caption key. The last three items on the legacy site are image-only. */
  readonly textKey?: string;
}

export const NEWS: readonly NewsItem[] = [
  { image: `${IMG}/news/news-1.jpg`, textKey: 'news.n1' },
  { image: `${IMG}/news/news-2.jpg`, textKey: 'news.n2' },
  { image: `${IMG}/news/news-3.jpg`, textKey: 'news.n3' },
  { image: `${IMG}/news/news-4.jpg`, textKey: 'news.n4' },
  { image: `${IMG}/news/news-5.png` },
  { image: `${IMG}/news/news-6.png` },
  { image: `${IMG}/news/news-7.png` },
];

// ---------------------------------------------------------------- Gallery + partners
export const GALLERY: readonly string[] = Array.from({ length: 15 }, (_, i) => `${IMG}/gallery/g-${pad(i + 1)}.jpg`);

export interface Partner {
  readonly nameKey: string;
  readonly logo: string;
}

export const PARTNERS: readonly Partner[] = [
  { nameKey: 'partners.aaru', logo: `${IMG}/partners/aaru.png` },
  { nameKey: 'partners.certiport', logo: `${IMG}/partners/certiport.png` },
  { nameKey: 'partners.erasmus', logo: `${IMG}/partners/erasmus.png` },
  { nameKey: 'partners.huawei', logo: `${IMG}/partners/huawei.png` },
  { nameKey: 'partners.microsoft', logo: `${IMG}/partners/microsoft.png` },
  { nameKey: 'partners.sgs', logo: `${IMG}/partners/sgs.png` },
  { nameKey: 'partners.stFatima', logo: `${IMG}/partners/st-fatima.png` },
  { nameKey: 'partners.widener', logo: `${IMG}/partners/widener.png` },
  { nameKey: 'partners.philadelphia', logo: `${IMG}/partners/philadelphia.png` },
  { nameKey: 'partners.commerce', logo: `${IMG}/partners/commerce.png` },
];

// ---------------------------------------------------------------- About page
export const ORG_CHART_PDF = `${LEGACY_SITE}/wp-content/uploads/2025/10/09172025_flll-A-%5E.pdf`;
