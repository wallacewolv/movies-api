import { inject } from '@angular/core';
import { Router, type CanActivateChildFn } from '@angular/router';

import { AuthService } from './auth.service';

export const AuthGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
