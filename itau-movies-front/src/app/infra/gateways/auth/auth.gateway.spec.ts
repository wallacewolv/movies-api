import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthServiceInterface } from '@core/contracts/auth/service/auth-service.interface';
import { Route } from '@core/utils/enums/route.enum';
import { AuthRequestDTO } from '@domain/auth/dto/auth-request.dto';
import { Auth } from '@domain/auth/entity/auth.entity';

import { AuthGateway } from './auth.gateway';

describe('AuthGateway', () => {
  let gateway: AuthGateway;
  let httpMock: HttpTestingController;
  let router: Router;

  let authServiceSpy: jasmine.SpyObj<AuthServiceInterface>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthServiceInterface>(
      ['changeToken'],
      {
        isAuthenticated: signal(true),
      },
    );

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthGateway,
        { provide: AuthServiceInterface, useValue: authServiceSpy },
      ],
    });

    gateway = TestBed.inject(AuthGateway);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(gateway).toBeTruthy();
  });

  describe('login', () => {
    it('should POST credentials, store token, set isAuthenticated and navigate to root', () => {
      const credentials: AuthRequestDTO = { usuario: 'john', senha: '123' };
      const mockResponse = new Auth({
        message: 'Login realizado com sucesso',
        token: 'fake-token',
        expiresIn: '30 minutos',
        tokenType: 'Bearer',
      });

      gateway.login(credentials).subscribe((resp) => {
        expect(resp).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api-movies/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);

      req.flush(mockResponse);

      expect(authServiceSpy.isAuthenticated()).toBeTrue();

      expect(router.navigate).toHaveBeenCalledWith([Route.HOME]);
    });
  });
});
