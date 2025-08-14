import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthServiceInterface } from '@core/contracts/auth/service/auth-service.interface';
import { AuthRequestDTO } from '@domain/auth/dto/auth-request.dto';
import { Auth } from '@domain/auth/entity/auth.entity';
import { AuthGatewayInterface } from '@infra/interfaces/auth/auth-gateway.interface';
import { Observable, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGateway implements AuthGatewayInterface {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthServiceInterface);

  login(credentials: AuthRequestDTO): Observable<Auth> {
    return this.http.post<Auth>(`/api-movies/auth/login`, credentials).pipe(
      tap(({ token }) => {
        this.authService.isAuthenticated.set(true);
        this.authService.changeToken(token);
      }),
      take(1),
    );
  }
}
