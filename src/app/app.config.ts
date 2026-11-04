import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideI18n } from './core/i18n/i18n.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Smooth anchor links (/#about) + scroll-to-top on route change.
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      // Lets clicking "Home" while already on "/" scroll back to the top.
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
    ),
    provideI18n(),
  ],
};
