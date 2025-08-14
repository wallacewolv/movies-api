import { WritableSignal } from '@angular/core';

export abstract class AuthServiceInterface {
  abstract isAuthenticated: WritableSignal<boolean>;

  abstract logout(): void;
  abstract getToken(): string;
  abstract clearToken(): void;
  abstract changeToken(token: string): void;
}
