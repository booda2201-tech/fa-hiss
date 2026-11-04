import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import {
  DEFAULT_LANG,
  LANG_STORAGE_KEY,
  LangCode,
  LanguageOption,
  SUPPORTED_LANGUAGES,
} from './i18n.models';

/**
 * Single source of truth for the active language.
 *
 * Responsibilities:
 *  - resolve the initial language (saved choice -> browser language -> default)
 *  - load translations through ngx-translate
 *  - keep `<html lang>` and `<html dir>` in sync (RTL / LTR)
 *  - persist the user's choice
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  private readonly _lang = signal<LangCode>(DEFAULT_LANG);

  readonly languages = SUPPORTED_LANGUAGES;

  /** Active language code. Only updates once translations are loaded. */
  readonly lang = this._lang.asReadonly();
  readonly current = computed(() => this.find(this._lang()));
  readonly dir = computed(() => this.current().dir);
  readonly isRtl = computed(() => this.dir() === 'rtl');
  /** The language the switcher would change to. */
  readonly alternate = computed<LanguageOption>(
    () => this.languages.find((l) => l.code !== this._lang()) ?? this.current(),
  );

  /** Called once from the app initializer. */
  init(): Promise<void> {
    return this.set(this.resolveInitialLang());
  }

  async set(lang: LangCode): Promise<void> {
    if (!this.isSupported(lang)) return;

    await firstValueFrom(this.translate.use(lang));

    this._lang.set(lang);
    this.applyToDocument(lang);
    this.persist(lang);
  }

  toggle(): Promise<void> {
    return this.set(this.alternate().code);
  }

  // ---------------------------------------------------------------------

  private applyToDocument(lang: LangCode): void {
    const html = this.document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', this.find(lang).dir);
  }

  private resolveInitialLang(): LangCode {
    const saved = this.readStorage();
    if (saved && this.isSupported(saved)) return saved;

    const browser = this.document.defaultView?.navigator?.language?.slice(0, 2).toLowerCase();
    return browser && this.isSupported(browser) ? browser : DEFAULT_LANG;
  }

  private find(code: LangCode): LanguageOption {
    return this.languages.find((l) => l.code === code) ?? this.languages[0];
  }

  private isSupported(code: string): code is LangCode {
    return this.languages.some((l) => l.code === code);
  }

  // Storage access can throw (private mode, blocked cookies) – never let it break the app.
  private readStorage(): string | null {
    try {
      return this.document.defaultView?.localStorage.getItem(LANG_STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  private persist(lang: LangCode): void {
    try {
      this.document.defaultView?.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }
}
