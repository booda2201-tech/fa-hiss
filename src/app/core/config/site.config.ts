import { IconName } from '../../shared/ui/icon/icon.component';

export interface NavItem {
  /** ngx-translate key for the label. */
  readonly labelKey: string;
  readonly path: string;
  readonly fragment?: string;
}

/** Header entry: an internal route, a dropdown of internal pages, or the departments flyout. */
export interface HeaderNavItem {
  readonly labelKey: string;
  /** Internal route (use with `routerLink`). */
  readonly path?: string;
  readonly fragment?: string;
  /** Dropdown links to inner pages. */
  readonly children?: readonly HeaderNavChild[];
  /** Renders the rich departments flyout instead of a plain dropdown. */
  readonly departments?: boolean;
}

export interface HeaderNavChild {
  readonly labelKey: string;
  readonly path: string;
}

export interface LinkGroup {
  readonly titleKey: string;
  readonly links: readonly NavItem[];
}

export interface SocialLink {
  readonly name: string;
  readonly icon: IconName;
  readonly href: string;
}

/** Content that still lives on the legacy WordPress site (https://fa-hiss.edu.eg). */
export const LEGACY_SITE = 'https://fa-hiss.edu.eg';

/** Primary navigation (header + mobile menu + footer "Explore"). */
export const MAIN_NAV: readonly NavItem[] = [
  { labelKey: 'nav.home', path: '/' },
  { labelKey: 'nav.about', path: '/about' },
  { labelKey: 'nav.admission', path: '/admission' },
  { labelKey: 'nav.departments', path: '/', fragment: 'departments' },
  { labelKey: 'nav.services', path: '/', fragment: 'services' },
  { labelKey: 'nav.news', path: '/', fragment: 'news' },
  { labelKey: 'nav.contact', path: '/contact' },
];

/** Dropdown link to an inner content page (`/pages/:slug`). */
const info = (labelKey: string, slug: string): HeaderNavChild => ({ labelKey, path: `/pages/${slug}` });

/** Header navigation (desktop + mobile), mirroring the legacy site's menu. */
export const HEADER_NAV: readonly HeaderNavItem[] = [
  { labelKey: 'nav.about', path: '/about' },
  { labelKey: 'nav.admission', path: '/admission' },
  { labelKey: 'nav.academics', path: '/', fragment: 'departments', departments: true },
  {
    labelKey: 'nav.services',
    children: [
      info('services.schedules', 'schedules'),
      info('services.training', 'training'),
      info('services.expatriates', 'expatriates'),
      info('services.activities', 'activities'),
      info('services.health', 'health'),
      info('services.exams', 'exams'),
      info('services.results', 'results'),
      info('services.employment', 'employment'),
      info('services.graduation', 'graduation'),
      info('services.military', 'military'),
    ],
  },
  {
    labelKey: 'nav.faculty',
    children: [
      info('services.faculty', 'faculty'),
      info('services.seminars', 'seminars'),
      info('services.journals', 'journals'),
    ],
  },
  {
    labelKey: 'nav.newsMedia',
    children: [
      info('services.publicRelations', 'public-relations'),
      info('services.youth', 'youth'),
      info('services.library', 'library'),
    ],
  },
  { labelKey: 'nav.quality', path: '/pages/quality' },
  { labelKey: 'nav.advising', path: '/pages/advising' },
];

export const DEPARTMENT_LINKS: readonly NavItem[] = [
  { labelKey: 'departments.tourism', path: '/departments/tourism-studies' },
  { labelKey: 'departments.hospitality', path: '/departments/hospitality-management' },
  { labelKey: 'departments.guiding', path: '/departments/tour-guiding' },
  { labelKey: 'departments.bis', path: '/departments/business-information-systems' },
];

export const IMPORTANT_LINKS: readonly NavItem[] = [
  { labelKey: 'nav.admission', path: '/admission' },
  { labelKey: 'footer.careers', path: '/contact', fragment: 'jobs' },
  { labelKey: 'footer.complaints', path: '/contact', fragment: 'complaints' },
  { labelKey: 'footer.contact', path: '/contact' },
];

export const FOOTER_GROUPS: readonly LinkGroup[] = [
  { titleKey: 'footer.explore', links: MAIN_NAV.slice(1) },
  { titleKey: 'footer.departments', links: DEPARTMENT_LINKS },
  { titleKey: 'footer.links', links: IMPORTANT_LINKS },
];

export const EXTERNAL_LINKS = {
  studentPortal: 'https://sis.fa-hiss.edu.eg/Default.aspx',
  /** Internal route – use with `routerLink`. */
  apply: '/admission',
  egyptianKnowledgeBank: 'https://www.ekb.eg/ar/web/guest/login',
} as const;

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { name: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/Hiss.Hegaz' },
  { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/hiss.heliopolis/' },
  { name: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/hiss-heliopolis/' },
  { name: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/@hiss-heliopolis' },
  { name: 'X', icon: 'twitter', href: 'https://x.com/HHeliopolis' },
  { name: 'WhatsApp', icon: 'whatsapp', href: 'https://wa.me/201274066668' },
];

export interface PhoneNumber {
  /** Text shown to the user. */
  readonly label: string;
  /** Dialable number (E.164). */
  readonly tel: string;
}

/**
 * Contact details published on the legacy site.
 * Landlines are printed there without an area code; Cairo's is +20 2.
 */
export const CONTACT = {
  landlines: [
    { label: '21804904', tel: '+20221804904' },
    { label: '21805459', tel: '+20221805459' },
    { label: '21804267', tel: '+20221804267' },
    { label: '21805041', tel: '+20221805041' },
  ] as readonly PhoneNumber[],
  mobiles: [
    { label: '01221732300', tel: '+201221732300' },
    { label: '01221732299', tel: '+201221732299' },
  ] as readonly PhoneNumber[],
  whatsapp: { label: '01274066668', tel: '+201274066668' } as PhoneNumber,
  emails: {
    support: 'support@fa-hiss.edu.eg',
    help: 'help@fa-hiss.edu.eg',
    jobs: 'jobs@fa-hiss.edu.eg',
  },
} as const;

