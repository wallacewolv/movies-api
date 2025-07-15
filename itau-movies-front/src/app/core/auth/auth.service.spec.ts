import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthRequest, Auth } from './auth.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  const localStore: Record<string, string> = {};
  beforeAll(() => {
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => {
        localStore[key] = value;
      },
    );
    spyOn(localStorage, 'getItem').and.callFake(
      (key: string) => localStore[key] || null,
    );
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete localStore[key];
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  afterEach(() => {
    httpMock.verify();
    for (const k of Object.keys(localStore)) delete localStore[k];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#login', () => {
    it('should POST credentials, store token, set isAuthenticated and navigate to root', () => {
      const credentials: AuthRequest = { usuario: 'john', senha: '123' };
      const mockResponse: Auth = {
        message: 'Login realizado com sucesso',
        token: 'fake-token',
        expiresIn: '30 minutos',
        tokenType: 'Bearer',
      };

      service.login(credentials).subscribe((resp) => {
        expect(resp).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api-movies/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);

      req.flush(mockResponse);

      expect(service.isAuthenticated()).toBeTrue();

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'movies-token',
        'fake-token',
      );

      expect(router.navigate).toHaveBeenCalledWith(['']);
    });
  });

  describe('#logout', () => {
    it('should clear token, set isAuthenticated to false and navigate to /login', () => {
      localStore['movies-token'] = 'existing-token';
      service.isAuthenticated.set(true);

      service.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('movies-token');
      expect(service.isAuthenticated()).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('#getMovies & #getFilters', () => {
    it('should GET movies list', () => {
      const mockMovies = [{ id: 1, name: 'Matrix' }];

      service.getMovies().subscribe((list) => expect(list).toEqual(mockMovies));

      const req = httpMock.expectOne('/api-movies/movies');
      expect(req.request.method).toBe('GET');
      req.flush(mockMovies);
    });

    it('should GET filters', () => {
      const mockFilters = { genres: ['Ação'], sortFields: ['name'] };

      service.getFilters().subscribe((f) => expect(f).toEqual(mockFilters));

      const req = httpMock.expectOne('/api-movies/movies/filters');
      expect(req.request.method).toBe('GET');
      req.flush(mockFilters);
    });
  });

  describe('#token helpers', () => {
    it('getToken should return value from localStorage', () => {
      localStore['movies-token'] = 'abc123';
      expect(service.getToken()).toBe('abc123');
    });

    it('clearToken should remove item from localStorage', () => {
      localStore['movies-token'] = 'toDelete';
      service.clearToken();
      expect(localStore['movies-token']).toBeUndefined();
    });
  });
});
