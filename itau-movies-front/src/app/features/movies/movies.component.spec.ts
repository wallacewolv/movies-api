import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { SortBy } from '../../core/movie/movie.enum';
import { Movie, Pagination } from '../../core/movie/movie.model';
import { MovieService } from '../../core/movie/movie.service';
import { MoviesComponent } from './movies.component';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;

  let movieServiceSpy: jasmine.SpyObj<MovieService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<any>;

  const _movies = signal<Movie[]>([]);
  const _pagination = signal<Pagination>({
    currentPage: 0,
    totalPages: 0,
    moviesPerPage: 0,
    totalMovies: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const _filters = signal<{
    availableGenres: string[];
    availableSortFields: string[];
    sortOrders: string[];
  }>({
    availableGenres: ['Drama', 'Ação', 'Comédia'],
    availableSortFields: ['nome', 'anoLancamento', 'genero'],
    sortOrders: ['asc', 'desc'],
  });

  beforeEach(async () => {
    movieServiceSpy = jasmine.createSpyObj<MovieService>([
      'getMovies',
      'getPagination',
      'getFilters',
      'fetchMovies',
      'fetchFilters',
    ]);
    authServiceSpy = jasmine.createSpyObj<AuthService>(['logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    movieServiceSpy.getMovies.and.returnValue(_movies.asReadonly());
    movieServiceSpy.getPagination.and.returnValue(_pagination.asReadonly());
    movieServiceSpy.getFilters.and.returnValue(_filters.asReadonly());

    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MoviesComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should expose movies, pagination and filters signals from service', () => {
    expect(component.movies).toBe(_movies.asReadonly());
    expect(component.pagination).toBe(_pagination.asReadonly());
    expect(component.filters).toBe(_filters.asReadonly());
  });

  it('should build form on init', () => {
    expect(component.filterGroup).toBeDefined();
    const controls = component.filterGroup.getRawValue();
    expect(controls.sortField).toBeDefined();
    expect(controls.sortOrder).toBeDefined();
    expect(controls.name).toBeDefined();
    expect(controls.releaseYear).toBeDefined();
    expect(controls.genre).toBeDefined();
  });

  it('should call fetchMovies and fetchFilters on init', () => {
    expect(movieServiceSpy.fetchMovies).toHaveBeenCalledWith(
      component.currentParams,
    );
    expect(movieServiceSpy.fetchFilters).toHaveBeenCalled();
  });

  it('onSelectionChange should update filters correctly for sort fields', () => {
    spyOn(component as any, 'updateFilters');
    component.onSelectionChange('nome');
    expect((component as any).updateFilters).toHaveBeenCalledWith({
      sortBy: 'nome',
    });

    component.onSelectionChange('anoLancamento');
    expect((component as any).updateFilters).toHaveBeenCalledWith({
      sortBy: 'anoLancamento',
    });

    component.onSelectionChange('genero');
    expect((component as any).updateFilters).toHaveBeenCalledWith({
      sortBy: 'genero',
    });
  });

  it('onSelectionChange should update filters correctly for sort orders', () => {
    spyOn(component as any, 'updateFilters');
    component.onSelectionChange('asc');
    expect((component as any).updateFilters).toHaveBeenCalledWith({
      order: 'asc',
    });

    component.onSelectionChange('desc');
    expect((component as any).updateFilters).toHaveBeenCalledWith({
      order: 'desc',
    });
  });

  it('toggleChip should update filters with genre', () => {
    spyOn(component as any, 'updateFilters');
    component.toggleChip('Drama');
    expect((component as any).updateFilters).toHaveBeenCalledWith({
      genero: 'Drama',
    });
  });

  it('handlePageEvent should update filters on page change', () => {
    spyOn(component as any, 'updateFilters');

    const event: PageEvent = {
      pageIndex: 2,
      pageSize: 20,
      length: 100,
    };

    component.currentParams = { page: 3, limit: 10 };
    component.handlePageEvent(event);

    expect((component as any).updateFilters).toHaveBeenCalledWith({
      page: 3,
      limit: 20,
    });
  });

  it('handlePageEvent should NOT update filters if no changes', () => {
    spyOn(component as any, 'updateFilters');

    const event: PageEvent = {
      pageIndex: 0,
      pageSize: 10,
      length: 100,
    };

    component.currentParams = { page: 1, limit: 10 };
    component.handlePageEvent(event);

    expect((component as any).updateFilters).not.toHaveBeenCalled();
  });

  it('updateFilters should update currentParams and call fetchMovies', () => {
    component.currentParams = { page: 1, limit: 10 };
    component.fetchMovies = jasmine.createSpy('fetchMovies');

    component.updateFilters({ page: 2, sortBy: SortBy.NOME });

    expect(component.currentParams).toEqual({
      page: 2,
      limit: 10,
      sortBy: SortBy.NOME,
    });

    expect(component.fetchMovies).toHaveBeenCalled();
  });

  it('goToFavorites should navigate to favorites route', () => {
    component.goToFavorites();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['favorites']);
  });

  it('logout should call authService.logout', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
