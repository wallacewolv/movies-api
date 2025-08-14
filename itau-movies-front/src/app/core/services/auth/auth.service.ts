import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceInterface } from '@core/contracts/auth/service/auth-service.interface';
import { Route } from '@core/utils/enums/route.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements AuthServiceInterface {
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = 'movies-token';

  isAuthenticated = signal(!!this.getToken());

  logout() {
    this.clearToken();
    this.isAuthenticated.set(false);
    this.router.navigate([Route.LOGIN]);
  }

  getToken(): string {
    return localStorage.getItem(this.TOKEN_KEY)!;
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  changeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}
