import { Injectable, computed, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DEPARTMENTS } from '../data/departments.data';
import { SERVICES } from '../data/home.data';
import { INFO_PAGES, infoPath } from '../data/pages.data';
import { LanguageService } from '../i18n/language.service';
import type { IconName } from '../../shared/ui/icon/icon.component';

export type SearchKind = 'department' | 'service' | 'page';

export interface SearchEntry {
  readonly title: string;
  readonly kind: SearchKind;
  readonly path: string;
  readonly fragment?: string;
  readonly icon: IconName;
  /** Normalised title + searchable body text. */
  readonly haystackTitle: string;
  readonly haystackBody: string;
}

/** Lower-cases and folds Arabic letter variants / diacritics so "الاداره" finds "الإدارة". */
export const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const skeleton = (s: string): string => s.replace(/[اويء]/g, '');

const POPULAR_PATHS = ['/admission', '/pages/schedules', '/pages/results', '/pages/exams', '/student-portal', '/contact'];

/**
 * Client-side site search over departments, student services and main pages.
 * The index is rebuilt in the active language, so Arabic and English both work.
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly translate = inject(TranslateService);
  private readonly language = inject(LanguageService);

  private readonly index = computed<readonly SearchEntry[]>(() => {
    this.language.lang(); // rebuild when the language flips
    return this.build();
  });

  /** Entries shown before the user types anything. */
  readonly popular = computed(() =>
    POPULAR_PATHS.map((p) => this.index().find((e) => e.path === p && !e.fragment)).filter(
      (e): e is SearchEntry => !!e,
    ),
  );

  search(query: string, limit = 7): readonly SearchEntry[] {
    const tokens = normalize(query).split(' ').filter(Boolean);
    if (!tokens.length) return [];

    const scored: { entry: SearchEntry; score: number }[] = [];
    for (const entry of this.index()) {
      let score = 0;
      let ok = true;
      for (const t of tokens) {
        if (entry.haystackTitle.startsWith(t)) score += 6;
        else if (entry.haystackTitle.split(' ').some((w) => w.startsWith(t))) score += 5;
        else if (entry.haystackTitle.includes(t)) score += 3;
        else if (entry.haystackBody.includes(t)) score += 1;
        else if (this.skeletonMatch(entry, t)) score += 1;
        else {
          ok = false;
          break;
        }
      }
      if (ok) scored.push({ entry, score });
    }
    return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.entry);
  }

  /**
   * Arabic broken plurals ("جدول" → "جداول") differ only by weak letters, so as a last resort compare
   * words with ا و ي removed.
   */
  private skeletonMatch(entry: SearchEntry, token: string): boolean {
    const t = skeleton(token);
    if (t.length < 2) return false;
    return skeleton(entry.haystackTitle + ' ' + entry.haystackBody)
      .split(' ')
      .some((w) => w.startsWith(t));
  }

  private text(key: string | undefined): string {
    if (!key) return '';
    const value: unknown = this.translate.instant(key);
    if (Array.isArray(value)) return value.map((v) => (typeof v === 'string' ? v : Object.values(v ?? {}).join(' '))).join(' ');
    return typeof value === 'string' && value !== key ? value : '';
  }

  private entry(
    kind: SearchKind,
    titleKey: string,
    path: string,
    icon: IconName,
    body: string[] = [],
    fragment?: string,
  ): SearchEntry {
    const title = this.text(titleKey) || titleKey;
    return {
      title,
      kind,
      path,
      fragment,
      icon,
      haystackTitle: normalize(title),
      haystackBody: normalize(body.join(' ')),
    };
  }

  private build(): SearchEntry[] {
    const out: SearchEntry[] = [];

    for (const d of DEPARTMENTS) {
      out.push(
        this.entry('department', `departments.${d.id}`, `/departments/${d.slug}`, 'graduation-cap', [
          this.text(`dept.${d.id}.short`),
          this.text(`dept.${d.id}.intro`),
          this.text(`dept.${d.id}.careers`),
          this.text(`dept.${d.id}.facilities`),
        ]),
      );
    }

    for (const page of INFO_PAGES) {
      const icon = SERVICES.find((s) => s.path === infoPath(page.slug))?.icon ?? 'file-text';
      const blockTitles = page.blocks
        .map((b) => ('titleKey' in b && typeof b.titleKey === 'string' ? this.text(b.titleKey) : ''))
        .filter(Boolean);
      out.push(
        this.entry('service', page.titleKey, infoPath(page.slug), icon, [this.text(page.introKey), ...blockTitles]),
      );
    }

    out.push(
      this.entry('page', 'nav.home', '/', 'home', [this.text('hero.subtitle')]),
      this.entry('page', 'nav.about', '/about', 'badge-check', [this.text('pages.about.intro'), this.text('pages.about.features')]),
      this.entry('page', 'nav.admission', '/admission', 'clipboard-list', [
        this.text('pages.admission.intro'),
        this.text('pages.admission.documents'),
      ]),
      this.entry('page', 'nav.contact', '/contact', 'mail', [this.text('pages.contact.intro')]),
      this.entry('page', 'footer.careers', '/contact', 'briefcase', [this.text('pages.contact.jobsText')], 'jobs'),
      this.entry('page', 'footer.complaints', '/contact', 'message-circle', [this.text('pages.contact.complaintsText')], 'complaints'),
      this.entry('page', 'header.studentPortal', '/student-portal', 'user', [this.text('pages.portal.intro')]),
      this.entry('page', 'nav.news', '/', 'newspaper', [], 'news'),
    );

    return out;
  }
}
