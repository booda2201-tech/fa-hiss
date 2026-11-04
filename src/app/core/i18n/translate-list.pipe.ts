import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './language.service';

/**
 * Reads an ARRAY from the translation files (paragraph lists, bullet lists,
 * timeline entries…). `TranslatePipe` is typed for strings only.
 *
 *   @for (item of 'dept.tourism.careers' | translateList; track $index) { … }
 *
 * Impure on purpose: the active language is read as a signal so the host
 * component re-renders when the user switches language.
 */
@Pipe({ name: 'translateList', pure: false })
export class TranslateListPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);
  private readonly language = inject(LanguageService);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(key: string): readonly any[] {
    this.language.lang();
    const value: unknown = this.translate.instant(key);
    return Array.isArray(value) ? value : [];
  }
}
