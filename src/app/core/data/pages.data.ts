import {
  GRADUATION_ALBUMS,
  PR_ALBUMS,
  SEMINAR_CONFERENCE_ALBUMS,
  SEMINAR_OTHER_ALBUMS,
  SEMINAR_SEASON_ALBUMS,
} from './pages.albums';
import { PAGE_FILES } from './pages.files';
import { EXAM_GROUPS, RESULT_GROUPS, SCHEDULE_GROUPS } from './pages.files.extra';
import { PAGE_IMAGES } from './pages.images';

/**
 * Content model of the generic inner pages (`/pages/:slug`) that replace the
 * legacy WordPress pages. All strings live in `public/i18n/*.json` under `info.<slug>.*`.
 */
export type PageGroup = 'services' | 'faculty' | 'media' | 'quality';

export type PageBlock =
  /** One paragraph, `textKey` points to a string. */
  | { type: 'text'; titleKey?: string; textKey: string }
  /** Bullet list, `itemsKey` points to an array. */
  | { type: 'list'; titleKey?: string; itemsKey: string }
  /** Numbered steps, `itemsKey` points to an array. */
  | { type: 'steps'; titleKey?: string; itemsKey: string }
  /** Documents / external links; `labelsKey` is an array matching `hrefs` by index. */
  | { type: 'files'; titleKey?: string; labelsKey: string; hrefs: readonly string[]; kind: 'download' | 'external' }
  /** Photo grid. `contain` keeps flyers / posters uncropped. */
  | { type: 'gallery'; titleKey?: string; images: readonly string[]; contain?: boolean }
  /** Staff directory: `namesKey`, `rolesKey` arrays aligned with `photos`. */
  | { type: 'people'; titleKey?: string; namesKey: string; rolesKey: string; photos: readonly string[] }
  /** Titled events with text and a few photos each. */
  | { type: 'events'; titleKey?: string; titlesKey: string; textsKey: string }
  /** Several titled file lists: `titlesKey` / `filesKey` are arrays aligned with `groups[group][file]`. */
  | { type: 'fileGroups'; titlesKey: string; filesKey: string; groups: readonly (readonly string[])[]; kind: 'download' | 'external' }
  /** Titled photo albums with optional text: `titlesKey` / `textsKey` are arrays aligned with `albums`. */
  | { type: 'albums'; tabs?: boolean; titleKey?: string; titlesKey: string; textsKey: string; albums: readonly (readonly string[])[] }
  /** Quality-unit organizational chart (labels under `info.quality.org`). */
  | { type: 'org' }
  /** Call-to-action panel. */
  | { type: 'cta'; titleKey: string; textKey: string; buttonKey: string; route?: string; href?: string };

export interface InfoPageDef {
  slug: string;
  /** Existing `services.*` key – shared with nav, home grid and page title. */
  titleKey: string;
  group: PageGroup;
  introKey?: string;
  blocks: readonly PageBlock[];
}

const img = (key: string) => PAGE_IMAGES[key] ?? [];

export const INFO_PAGES: readonly InfoPageDef[] = [
  // ───────────── Student services
  {
    slug: 'schedules',
    titleKey: 'services.schedules',
    group: 'services',
    introKey: 'info.schedules.intro',
    blocks: [
      {
        type: 'fileGroups',
        titlesKey: 'info.schedules.groupTitles',
        filesKey: 'info.schedules.groupFiles',
        groups: SCHEDULE_GROUPS,
        kind: 'download',
      },
    ],
  },
  {
    slug: 'exams',
    titleKey: 'services.exams',
    group: 'services',
    introKey: 'info.exams.intro',
    blocks: [
      {
        type: 'fileGroups',
        titlesKey: 'info.exams.groupTitles',
        filesKey: 'info.exams.groupFiles',
        groups: EXAM_GROUPS,
        kind: 'download',
      },
    ],
  },
  {
    slug: 'results',
    titleKey: 'services.results',
    group: 'services',
    introKey: 'info.results.intro',
    blocks: [
      {
        type: 'fileGroups',
        titlesKey: 'info.results.groupTitles',
        filesKey: 'info.results.groupFiles',
        groups: RESULT_GROUPS,
        kind: 'external',
      },
      {
        type: 'cta',
        titleKey: 'info.results.ctaTitle',
        textKey: 'info.results.ctaText',
        buttonKey: 'header.studentPortal',
        route: '/student-portal',
      },
    ],
  },
  {
    slug: 'training',
    titleKey: 'services.training',
    group: 'services',
    introKey: 'info.training.intro',
    blocks: [
      { type: 'list', titleKey: 'info.training.listTitle', itemsKey: 'info.training.items' },
      { type: 'gallery', images: img('training') },
    ],
  },
  {
    slug: 'expatriates',
    titleKey: 'services.expatriates',
    group: 'services',
    introKey: 'info.expatriates.intro',
    blocks: [
      { type: 'text', titleKey: 'info.expatriates.egyptiansTitle', textKey: 'info.expatriates.egyptians' },
      {
        type: 'files',
        labelsKey: 'info.expatriates.egyptiansLinks',
        hrefs: ['https://www.tansik.egypt.gov.eg'],
        kind: 'external',
      },
      { type: 'text', titleKey: 'info.expatriates.foreignTitle', textKey: 'info.expatriates.foreign' },
      {
        type: 'files',
        labelsKey: 'info.expatriates.foreignLinks',
        hrefs: ['https://admission.study-in-egypt.gov.eg/'],
        kind: 'external',
      },
      { type: 'text', titleKey: 'info.expatriates.officeTitle', textKey: 'info.expatriates.office' },
    ],
  },
  {
    slug: 'activities',
    titleKey: 'services.activities',
    group: 'services',
    introKey: 'info.activities.intro',
    blocks: [{ type: 'gallery', titleKey: 'info.photosTitle', images: img('activities') }],
  },
  {
    slug: 'health',
    titleKey: 'services.health',
    group: 'services',
    introKey: 'info.health.intro',
    blocks: [{ type: 'list', titleKey: 'info.health.listTitle', itemsKey: 'info.health.items' }],
  },
  {
    slug: 'employment',
    titleKey: 'services.employment',
    group: 'services',
    introKey: 'info.employment.intro',
    blocks: [{ type: 'gallery', titleKey: 'info.photosTitle', images: img('employment'), contain: true }],
  },
  {
    slug: 'graduation',
    titleKey: 'services.graduation',
    group: 'services',
    introKey: 'info.graduation.intro',
    blocks: [
      {
        type: 'albums',
        tabs: true,
        titlesKey: 'info.graduation.titles',
        textsKey: 'info.graduation.texts',
        albums: GRADUATION_ALBUMS,
      },
    ],
  },
  {
    slug: 'military',
    titleKey: 'services.military',
    group: 'services',
    introKey: 'info.military.intro',
    blocks: [
      { type: 'list', titleKey: 'info.military.topicsTitle', itemsKey: 'info.military.topics' },
      { type: 'text', titleKey: 'info.military.notice', textKey: 'info.military.noticeText' },
      {
        type: 'files',
        titleKey: 'info.military.listsTitle',
        labelsKey: 'info.military.lists',
        hrefs: PAGE_FILES.military,
        kind: 'external',
      },
      { type: 'gallery', images: img('military'), contain: true },
    ],
  },
  {
    slug: 'advising',
    titleKey: 'services.advising',
    group: 'services',
    introKey: 'info.advising.intro',
    blocks: [
      { type: 'list', titleKey: 'info.advising.goalsTitle', itemsKey: 'info.advising.goals' },
      { type: 'text', titleKey: 'info.advising.onlineTitle', textKey: 'info.advising.online' },
      { type: 'steps', itemsKey: 'info.advising.steps' },
      {
        type: 'cta',
        titleKey: 'info.advising.ctaTitle',
        textKey: 'info.advising.ctaText',
        buttonKey: 'info.advising.ctaButton',
        href: 'https://sis.fa-hiss.edu.eg',
      },
    ],
  },

  // ───────────── Faculty
  {
    slug: 'faculty',
    titleKey: 'services.faculty',
    group: 'faculty',
    introKey: 'info.faculty.intro',
    blocks: [
      {
        type: 'people',
        namesKey: 'info.faculty.names',
        rolesKey: 'info.faculty.roles',
        photos: img('faculty'),
      },
    ],
  },
  {
    slug: 'seminars',
    titleKey: 'services.seminars',
    group: 'faculty',
    introKey: 'info.seminars.intro',
    blocks: [
      {
        type: 'albums',
        titleKey: 'info.seminars.conferencesTitle',
        titlesKey: 'info.seminars.conferenceTitles',
        textsKey: 'info.seminars.conferenceTexts',
        albums: SEMINAR_CONFERENCE_ALBUMS,
      },
      {
        type: 'albums',
        titleKey: 'info.seminars.seasonTitle',
        titlesKey: 'info.seminars.seminarTitles',
        textsKey: 'info.seminars.seminarTexts',
        albums: SEMINAR_SEASON_ALBUMS,
      },
      {
        type: 'albums',
        titleKey: 'info.seminars.otherTitle',
        titlesKey: 'info.seminars.otherTitles',
        textsKey: 'info.seminars.otherTexts',
        albums: SEMINAR_OTHER_ALBUMS,
      },
    ],
  },
  {
    slug: 'journals',
    titleKey: 'services.journals',
    group: 'faculty',
    introKey: 'info.journals.intro',
    blocks: [
      {
        type: 'files',
        titleKey: 'info.journals.linksTitle',
        labelsKey: 'info.journals.links',
        hrefs: [
          'https://ijtho.journals.ekb.eg/',
          'https://ijtho.journals.ekb.eg/journal/authors.note',
          'https://drive.google.com/open?id=1DtxgBS2R-D3yuekrXDTN7pTW6Ra0Ii0a',
          'https://ijtho.journals.ekb.eg/journal/process',
        ],
        kind: 'external',
      },
      { type: 'text', titleKey: 'info.journals.noteTitle', textKey: 'info.journals.note' },
    ],
  },

  // ───────────── News & media
  {
    slug: 'public-relations',
    titleKey: 'services.publicRelations',
    group: 'media',
    introKey: 'info.publicRelations.intro',
    blocks: [
      {
        type: 'albums',
        tabs: true,
        titlesKey: 'info.publicRelations.titles',
        textsKey: 'info.publicRelations.texts',
        albums: PR_ALBUMS,
      },
    ],
  },
  {
    slug: 'youth',
    titleKey: 'services.youth',
    group: 'media',
    introKey: 'info.youth.intro',
    blocks: [
      {
        type: 'files',
        titleKey: 'info.youth.reportsTitle',
        labelsKey: 'info.youth.reports',
        hrefs: PAGE_FILES.youth,
        kind: 'download',
      },
      { type: 'gallery', titleKey: 'info.photosTitle', images: img('youth') },
    ],
  },
  {
    slug: 'library',
    titleKey: 'services.library',
    group: 'media',
    introKey: 'info.library.intro',
    blocks: [
      { type: 'gallery', images: img('library') },
      { type: 'text', titleKey: 'info.library.visionTitle', textKey: 'info.library.vision' },
      { type: 'list', titleKey: 'info.library.goalsTitle', itemsKey: 'info.library.goals' },
      { type: 'text', titleKey: 'info.library.printingTitle', textKey: 'info.library.printingIntro' },
      { type: 'list', itemsKey: 'info.library.printing' },
      { type: 'text', titleKey: 'info.library.computerTitle', textKey: 'info.library.computer' },
      { type: 'text', titleKey: 'info.library.askTitle', textKey: 'info.library.ask' },
    ],
  },

  // ───────────── Quality
  {
    slug: 'quality',
    titleKey: 'services.quality',
    group: 'quality',
    introKey: 'info.quality.vision',
    blocks: [
      { type: 'text', titleKey: 'info.quality.missionTitle', textKey: 'info.quality.missionIntro' },
      { type: 'list', itemsKey: 'info.quality.mission' },
      { type: 'text', titleKey: 'info.quality.goalsTitle', textKey: 'info.quality.goalsIntro' },
      { type: 'list', itemsKey: 'info.quality.goals' },
      { type: 'text', titleKey: 'info.quality.establishedTitle', textKey: 'info.quality.established' },
      { type: 'list', titleKey: 'info.quality.boardTitle', itemsKey: 'info.quality.board' },
      { type: 'org' },
      {
        type: 'files',
        titleKey: 'info.quality.docsTitle',
        labelsKey: 'info.quality.docs',
        hrefs: PAGE_FILES.quality,
        kind: 'download',
      },
      { type: 'list', titleKey: 'info.quality.workshopsTitle', itemsKey: 'info.quality.workshops' },
      { type: 'list', titleKey: 'info.quality.coursesTitle', itemsKey: 'info.quality.courses' },
      { type: 'gallery', titleKey: 'info.quality.photosTitle', images: img('quality') },
    ],
  },
];

export const findInfoPage = (slug: string | null | undefined): InfoPageDef | undefined =>
  INFO_PAGES.find((p) => p.slug === slug);

/** Router path of an inner page. */
export const infoPath = (slug: string): string => `/pages/${slug}`;

