import { Injector, runInInjectionContext } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { FavoriteService } from './favorite.service';

describe('FavoriteService', () => {
  let service: FavoriteService;

  const store: Record<string, string> = {};

  beforeAll(() => {
    spyOn(localStorage, 'getItem').and.callFake(
      (key: string) => store[key] ?? null,
    );
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => {
        store[key] = value;
      },
    );
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete store[key];
    });
  });

  beforeEach(() => {
    for (const key of Object.keys(store)) {
      delete store[key];
    }

    TestBed.configureTestingModule({
      providers: [FavoriteService],
    });

    runInInjectionContext(TestBed.inject(Injector), () => {
      service = TestBed.inject(FavoriteService);
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty favorites when localStorage is empty', () => {
    expect(service.getFavoriteIds()).toEqual([]);
  });

  it('should remove a favorite if it already exists', fakeAsync(() => {
    service.toggleFavorite(7);
    tick();
    expect(service.getFavoriteIds()).toEqual([7]);

    service.toggleFavorite(7);
    tick();
    expect(service.getFavoriteIds()).toEqual([]);
  }));

  it('should correctly report if an ID is favorite', fakeAsync(() => {
    service.toggleFavorite(10);
    tick();
    expect(service.isFavorite(10)).toBeTrue();
    expect(service.isFavorite(99)).toBeFalse();
  }));
});
