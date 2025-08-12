import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Route } from '@core/utils/enums/route.enum';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  let routerSpy: jasmine.SpyObj<Router>;

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
    routerSpy = jasmine.createSpyObj<Router>(['navigate']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    for (const k of Object.keys(localStore)) delete localStore[k];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logout', () => {
    it('should clear token, set isAuthenticated to false and navigate to /login', () => {
      localStore['movies-token'] = 'existing-token';
      service.isAuthenticated.set(true);

      service.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('movies-token');
      expect(service.isAuthenticated()).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith([Route.LOGIN]);
    });
  });

  describe('token helpers', () => {
    it('getToken should return value from localStorage', () => {
      localStore['movies-token'] = 'abc123';
      expect(service.getToken()).toBe('abc123');
    });

    it('clearToken should remove item from localStorage', () => {
      localStore['movies-token'] = 'toDelete';
      service.clearToken();
      expect(localStore['movies-token']).toBeUndefined();
    });

    it('changeToken should set item in localStorage', () => {
      service.changeToken('newToken');
      expect(localStore['movies-token']).toBe('newToken');
    });
  });
});
