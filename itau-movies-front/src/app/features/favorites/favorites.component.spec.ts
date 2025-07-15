import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { FavoriteService } from '../../core/favorite/favorite.service';
import { Movie } from '../../core/movie/movie.model';
import { MovieService } from '../../core/movie/movie.service';
import { FavoritesComponent } from './favorites.component';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  let movieServiceSpy: jasmine.SpyObj<MovieService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let favoriteServiceSpy: jasmine.SpyObj<FavoriteService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const moviesSignal = signal<Movie[]>([]);

  const mockMovies: Movie[] = [
    {
      id: 1,
      nome: 'Filme 1',
      genero: 'Drama',
      descricao: '',
      anoLancamento: 2020,
    },
    {
      id: 2,
      nome: 'Filme 2',
      genero: 'Ação',
      descricao: '',
      anoLancamento: 2021,
    },
  ];

  beforeEach(async () => {
    movieServiceSpy = jasmine.createSpyObj<MovieService>([
      'getMovies',
      'fetchMovies',
    ]);
    authServiceSpy = jasmine.createSpyObj<AuthService>(['logout']);
    favoriteServiceSpy = jasmine.createSpyObj<FavoriteService>([
      'getFavoriteIds',
      'isFavorite',
    ]);
    routerSpy = jasmine.createSpyObj<Router>(['navigate']);

    movieServiceSpy.getMovies.and.returnValue(moviesSignal.asReadonly());

    movieServiceSpy.fetchMovies.and.callFake(() => {
      moviesSignal.set(mockMovies);
    });

    favoriteServiceSpy.getFavoriteIds.and.returnValue([]);
    favoriteServiceSpy.isFavorite.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, FavoritesComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: FavoriteService, useValue: favoriteServiceSpy },
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
    expect(routerSpy.navigate).toHaveBeenCalledWith(['movies']);
  });

  it('logout should call authService.logout', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
