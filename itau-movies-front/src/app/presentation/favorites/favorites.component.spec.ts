import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { AuthServiceInterface } from '@core/contracts/auth/service/auth-service.interface';
import { FavoriteServiceInterface } from '@core/contracts/favorite/service/favorite-service.interface';
import { MovieServiceInterface } from '@core/contracts/movie/service/movie-service.interface';
import { MOVIES_DUMMY } from '@core/utils/dummys/movies.dummy';
import { Route } from '@core/utils/enums/route.enum';
import { DataDTO } from '@domain/movie/dto/data.dto';
import { MovieGatewayInterface } from '@infra/interfaces/movie/movie-gateway.interface';

import { FavoritesComponent } from './favorites.component';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  let movieServiceSpy: jasmine.SpyObj<MovieServiceInterface>;
  let movieGatewaySpy: jasmine.SpyObj<MovieGatewayInterface>;
  let authServiceSpy: jasmine.SpyObj<AuthServiceInterface>;
  let favoriteServiceSpy: jasmine.SpyObj<FavoriteServiceInterface>;
  let routerSpy: jasmine.SpyObj<Router>;

  const moviesSignal = signal<DataDTO[]>([]);

  const mockMovies = MOVIES_DUMMY.MOVIES_VALUES;

  beforeEach(async () => {
    movieServiceSpy = jasmine.createSpyObj<MovieServiceInterface>([]);
    movieGatewaySpy = jasmine.createSpyObj<MovieGatewayInterface>([
      'fetchMovies',
    ]);
    authServiceSpy = jasmine.createSpyObj<AuthServiceInterface>(['logout']);
    favoriteServiceSpy = jasmine.createSpyObj<FavoriteServiceInterface>([
      'getFavoriteIds',
      'isFavorite',
    ]);
    routerSpy = jasmine.createSpyObj<Router>(['navigate']);

    movieGatewaySpy.fetchMovies.and.callFake(() => {
      moviesSignal.set(mockMovies);
    });

    favoriteServiceSpy.getFavoriteIds.and.returnValue([]);
    favoriteServiceSpy.isFavorite.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, FavoritesComponent],
      providers: [
        { provide: MovieServiceInterface, useValue: movieServiceSpy },
        { provide: MovieGatewayInterface, useValue: movieGatewaySpy },
        { provide: AuthServiceInterface, useValue: authServiceSpy },
        { provide: FavoriteServiceInterface, useValue: favoriteServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('getAllFavorites should filter favorites correctly', () => {
    moviesSignal.set(mockMovies);
    favoriteServiceSpy.getFavoriteIds.and.returnValue([2]);

    component.getAllFavorites();

    expect(component.favorites.length).toBe(1);
    expect(component.favorites[0].id).toBe(2);
  });

  it('toggle should call getAllFavorites', () => {
    spyOn(component, 'getAllFavorites').and.callThrough();
    component.toggle();
    expect(component.getAllFavorites).toHaveBeenCalled();
  });

  it('goToMovies should navigate to movies route', () => {
    component.goToMovies();
    expect(routerSpy.navigate).toHaveBeenCalledWith([Route.MOVIES]);
  });

  it('logout should call authService.logout', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
