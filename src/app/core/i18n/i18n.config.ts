import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { DEFAULT_LANG } from './i18n.models';
import { LanguageService } from './language.service';

/**
 * One-stop provider for translations:
 *  - HttpClient (needed by the loader)
 *  - ngx-translate with a JSON loader reading `public/i18n/{lang}.json`
 *  - an app initializer that resolves the language and applies `lang`/`dir`
 *    on <html> BEFORE the first render (no LTR -> RTL flash).
 */
export function provideI18n(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(withFetch()),
    provideTranslateService({ fallbackLang: DEFAULT_LANG }),
    provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
    provideAppInitializer(() => inject(LanguageService).init()),
  ]);
}
