import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, SecurityContext } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideMarkdown, MARKED_OPTIONS, KatexOptions, MarkedOptions } from 'ngx-markdown';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideMarkdown(),

    // 3. Marked Configuration (Optional but recommended for Chat)
    {
      provide: MARKED_OPTIONS,
      useValue: {
        gfm: true,      // GitHub Flavored Markdown
        breaks: true,   // Render \n as <br>
        pedantic: false // Don't be too strict
      } as MarkedOptions
    },
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
