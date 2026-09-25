import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TitleStrategy, provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { SeoTitleStrategy } from './core/seo/seo-title.strategy';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    // `withFetch` lets the same HTTP stack run on the server during prerendering
    // without falling back to the xhr2 polyfill.
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideToastr(),
    { provide: TitleStrategy, useClass: SeoTitleStrategy },
  ],
};
