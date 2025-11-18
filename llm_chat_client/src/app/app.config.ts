import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideMarkdown, MARKED_OPTIONS } from 'ngx-markdown';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideMarkdown(),
    {
      provide: MARKED_OPTIONS,
      useValue: {
        katex: true,
        katexOptions: {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false },
            { left: '[', right: ']', display: true },
            { left: '(', right: ')', display: false },
          ],
          throwOnError: false 
        }
      }
    },
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
