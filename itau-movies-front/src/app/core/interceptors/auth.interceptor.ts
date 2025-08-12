import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { Route } from '@core/utils/enums/route.enum';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const isTargetUrl =
    req.url.includes('/movies') || req.url.includes('/movies/filters');

  if (!token) {
    router.navigate([Route.LOGIN]);
  }

  if (token && isTargetUrl) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(clonedRequest).pipe(
      catchError((error) => {
        if ((isTargetUrl && error.status === 401) || error.status === 403) {
          authService.clearToken();
          router.navigate([Route.LOGIN]);
        }
        return throwError(() => error);
      }),
    );
  }

  return next(req);
};
