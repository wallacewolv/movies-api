import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, take, tap } from 'rxjs';

import { AuthRequest, Auth } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = 'movies-token';

  isAuthenticated = signal(!!this.getToken());

  login(credentials: AuthRequest): Observable<Auth> {
    return this.http.post<Auth>(`/api-movies/auth/login`, credentials).pipe(
      tap(({ token }) => {
        this.isAuthenticated.set(true);
        this.setToken(token);
        this.router.navigate(['']);
      }),
      take(1),
    );
  }

  logout() {
    this.clearToken();
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string {
    return localStorage.getItem(this.TOKEN_KEY)!;
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}
