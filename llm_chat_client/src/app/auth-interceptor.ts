import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth-service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const reqWithCreds = req.clone({
    withCredentials: true,
  });

  return next(reqWithCreds).pipe(
    catchError((error: HttpErrorResponse) => {
      // If we get a 401, the session is invalid.
      if (error.status === 401) {
        console.log('Session expired or invalid. Logging out.');
        authService.logout().subscribe();
      }
      return throwError(() => error);
    })
  );
};
