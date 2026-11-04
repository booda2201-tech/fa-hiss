export type LangCode = 'en' | 'ar';
export type TextDirection = 'ltr' | 'rtl';

export interface LanguageOption {
  readonly code: LangCode;
  /** Name of the language written in that language (used by the switcher). */
  readonly nativeLabel: string;
  readonly dir: TextDirection;
}

export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  { code: 'en', nativeLabel: 'English', dir: 'ltr' },
  { code: 'ar', nativeLabel: 'العربية', dir: 'rtl' },
];

export const DEFAULT_LANG: LangCode = 'en';
export const LANG_STORAGE_KEY = 'hiss.lang';
