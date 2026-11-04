export type DepartmentId = 'guiding' | 'tourism' | 'hospitality' | 'bis';

export interface DepartmentDownload {
  /** ngx-translate key. */
  readonly labelKey: string;
  readonly href: string;
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
  readonly downloads: readonly DepartmentDownload[];
}

const UPLOADS = 'https://fa-hiss.edu.eg/wp-content/uploads';

/** Order matches the legacy home page. */
export const DEPARTMENTS: readonly Department[] = [
  {
    id: 'guiding',
    slug: 'tour-guiding',
    sections: ['mission', 'facilities'],
    icon: 'images/ref/departments/guiding.svg',
    image: 'images/ref/hero/slide-06.jpg',
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
    image: 'images/ref/hero/slide-03.jpg',
    downloads: [],
  },
  {
    id: 'hospitality',
    slug: 'hospitality-management',
    sections: ['degree', 'careers', 'facilities', 'training', 'fieldTrips', 'protocols'],
    icon: 'images/ref/departments/hospitality.svg',
    image: 'images/ref/hero/slide-09.jpg',
    downloads: [],
  },
  {
    id: 'bis',
    slug: 'business-information-systems',
    sections: ['facilities'],
    icon: 'images/ref/departments/bis.svg',
    image: 'images/ref/hero/slide-02.jpg',
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
