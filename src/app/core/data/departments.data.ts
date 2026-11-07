export type DepartmentId = 'guiding' | 'tourism' | 'hospitality' | 'bis';

export interface DepartmentDownload {
  /** ngx-translate key. */
  readonly labelKey: string;
  readonly href: string;
}

export interface DepartmentVideo {
  /** YouTube video id. */
  readonly id: string;
  /** Caption as published by the legacy site (Arabic lecture / episode titles). */
  readonly title: string;
}

export interface DepartmentVideoGroup {
  /** ngx-translate key. */
  readonly titleKey: string;
  readonly videos: readonly DepartmentVideo[];
}

/** Optional blocks of the department page; the intro and admission rules are always shown. */
export type DepartmentSection =
  | 'mission'
  | 'degree'
  | 'careers'
  | 'facilities'
  | 'protocols'
  | 'training'
  | 'fieldTrips';

export interface Department {
  readonly id: DepartmentId;
  readonly slug: string;
  readonly sections: readonly DepartmentSection[];
  /** Raster icon shipped as an SVG wrapper by the legacy site. */
  readonly icon: string;
  /** Page-header photo. */
  readonly image: string;
  /** Banner behind the page title (same photo as the legacy page). */
  readonly header: string;
  readonly downloads: readonly DepartmentDownload[];
  /** YouTube videos grouped under a translated heading (legacy lectures section). */
  readonly videoGroups: readonly DepartmentVideoGroup[];
  /** Study-plan tables published as images by the legacy site. */
  readonly studyPlans: readonly string[];
  /** Event / field-trip photos ("صور الفعاليات"). */
  readonly events: readonly string[];
}

const UPLOADS = 'https://fa-hiss.edu.eg/wp-content/uploads';

/** Files `NN.<ext>` under `images/ref/departments/gallery/<id>/`, numbered from `from` to `to` inclusive. */
const gallery = (id: DepartmentId, from: number, to: number, ext = 'jpg'): string[] =>
  Array.from(
    { length: to - from + 1 },
    (_, i) => `images/ref/departments/gallery/${id}/${String(from + i).padStart(2, '0')}.${ext}`,
  );

/** Order matches the legacy home page. */
export const DEPARTMENTS: readonly Department[] = [
  {
    id: 'guiding',
    slug: 'tour-guiding',
    sections: ['mission', 'facilities'],
    icon: 'images/ref/departments/guiding.svg',
    image: 'images/ref/departments/gallery/guiding/12.jpg',
    header: 'images/ref/departments/gallery/guiding/12.jpg',
    videoGroups: [
      {
        titleKey: 'deptPage.videos.lectures',
        videos: [
          { id: '-E0WsdFg6bc', title: 'المحاضرة الأولى: تاريخ وآثار مصر البيزنطية - دكتور شروق عاشور' },
          { id: 'EVEc1r5SrSw', title: 'لغة مصرية قديمة 1 - دكتور إيمان عشم' },
          { id: 'DPdO0CH17Mo', title: 'تاريخ مصر الفرعونية 3 - دكتور إسلام محمد' },
          { id: 'JwfYJoXBWhw', title: 'تاريخ مصر الفرعونية 1 - دكتور هناء مختار' },
          { id: 'PPfWoAj29v4', title: 'المحاضرة الأولى: ثقافة وعادات الشعوب - دكتور منى فريد' },
        ],
      },
      {
        titleKey: 'deptPage.videos.ancestors',
        videos: [
          { id: 'w048n94mfHw', title: 'أحفاد الأجداد - حماية المتاحف' },
          { id: 'bOpan8CAp1Q', title: 'الحلقة الثانية - أحفاد الأجداد - بورتريهات' },
          { id: '8txbk1NToDQ', title: 'الحلقة الثالثة - أحفاد الأجداد - الملك آخناتون' },
          { id: '5uWMDaic8UA', title: 'الحلقة الرابعة - أحفاد الأجداد - الحلي المصري القديم' },
        ],
      },
      {
        titleKey: 'deptPage.videos.fieldProgram',
        videos: [{ id: 'zwUkobbylxk', title: 'برنامج المزارات الميدانية - لقسم الإرشاد السياحي' }],
      },
    ],
    studyPlans: gallery('guiding', 4, 5),
    events: [...gallery('guiding', 6, 22), ...gallery('guiding', 23, 27, 'png')],
    downloads: [
      {
        labelKey: 'dept.guiding.downloads.fieldGuide',
        href: `${UPLOADS}/2026/01/%D9%85%D8%B1%D9%81%D9%82-5.1.3-%D8%AF%D9%84%D9%8A%D9%84-%D8%A7%D9%84%D8%B2%D9%8A%D8%A7%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%D8%B9%D9%84%D9%85%D9%8A%D9%87-%D8%A7%D9%84%D9%85%D9%8A%D8%AF%D8%A7%D9%86%D9%8A%D9%87-%D8%A8%D8%B1%D9%86%D8%A7%D9%85%D8%AC-%D8%A7%D9%84%D8%A7%D8%B1%D8%B4%D8%A7%D8%AF.pdf`,
      },
      {
        labelKey: 'dept.guiding.downloads.fieldGuideDoc',
        href: `${UPLOADS}/2026/01/%D8%AF%D9%84%D9%8A%D9%84-%D8%A7%D9%84%D8%B2%D9%8A%D8%A7%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%D8%B9%D9%84%D9%85%D9%8A%D8%A9-%D8%A7%D9%84%D9%85%D9%8A%D8%AF%D8%A7%D9%86%D9%8A%D8%A9-%D9%82%D8%B3%D9%85-%D8%A7%D9%84%D8%A5%D8%B1%D8%B4%D8%A7%D8%AF-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D9%89.docx`,
      },
      {
        labelKey: 'dept.guiding.downloads.selfLearning',
        href: `${UPLOADS}/2026/01/%D8%AF%D9%84%D9%8A%D9%84-%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%85-%D8%A7%D9%84%D8%B0%D8%A7%D8%AA%D9%89-%D9%82%D8%B3%D9%85-%D8%A7%D9%84%D8%A5%D8%B1%D8%B4%D8%A7%D8%AF-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D9%89.docx`,
      },
    ],
  },
  {
    id: 'tourism',
    slug: 'tourism-studies',
    sections: ['degree', 'careers', 'facilities'],
    icon: 'images/ref/departments/tourism.svg',
    image: 'images/ref/hero/slide-10.jpg',
    header: 'images/ref/hero/slide-10.jpg',
    videoGroups: [],
    studyPlans: gallery('tourism', 2, 17),
    events: gallery('tourism', 18, 27),
    downloads: [],
  },
  {
    id: 'hospitality',
    slug: 'hospitality-management',
    sections: ['degree', 'careers', 'facilities', 'training', 'fieldTrips', 'protocols'],
    icon: 'images/ref/departments/hospitality.svg',
    image: 'images/ref/departments/gallery/hospitality/13.jpg',
    header: 'images/ref/departments/gallery/hospitality/07.jpg',
    videoGroups: [],
    studyPlans: gallery('hospitality', 3, 4),
    events: [...gallery('hospitality', 1, 2), ...gallery('hospitality', 5, 24)],
    downloads: [],
  },
  {
    id: 'bis',
    slug: 'business-information-systems',
    sections: ['facilities'],
    icon: 'images/ref/departments/bis.svg',
    image: 'images/ref/hero/slide-05.jpg',
    header: 'images/ref/hero/slide-05.jpg',
    videoGroups: [],
    studyPlans: [],
    events: gallery('bis', 1, 5),
    downloads: [
      {
        labelKey: 'dept.bis.downloads.studyPlan',
        href: `${UPLOADS}/2025/03/%D8%A7%D9%84%D8%AE%D8%B7%D8%A9-%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%B1%D8%B4%D8%A7%D8%AF%D9%8A%D8%A9-%D9%84%D9%84%D8%B7%D9%84%D8%A7%D8%A8.docx`,
      },
    ],
  },
];

export const findDepartment = (slug: string | null | undefined): Department | undefined =>
  DEPARTMENTS.find((d) => d.slug === slug);
