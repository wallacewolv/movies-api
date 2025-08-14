import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { AuthServiceInterface } from '@core/contracts/auth/service/auth-service.interface';
import { MovieServiceInterface } from '@core/contracts/movie/service/movie-service.interface';
import { MOVIES_DUMMY } from '@core/utils/dummys/movies.dummy';
import { SortBy } from '@core/utils/enums/movie.enum';
import { Route } from '@core/utils/enums/route.enum';
import { DataDTO } from '@domain/movie/dto/data.dto';
import { FiltersMoviesDTO } from '@domain/movie/dto/filters-movies.dto';
import { PaginationDTO } from '@domain/movie/dto/pagination.dto';
import { MovieGatewayInterface } from '@infra/interfaces/movie/movie-gateway.interface';

import { MoviesComponent } from './movies.component';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;

  let movieServiceSpy: jasmine.SpyObj<MovieServiceInterface>;
  let movieGatewaySpy: jasmine.SpyObj<MovieGatewayInterface>;
  let authServiceSpy: jasmine.SpyObj<AuthServiceInterface>;
  let routerSpy: jasmine.SpyObj<any>;

  const _movies = signal<DataDTO[]>([]);
  const _pagination = signal<PaginationDTO>(MOVIES_DUMMY.PAGINATION_INITIAL);
  const _filters = signal<FiltersMoviesDTO>(MOVIES_DUMMY.FILTERS_VALUES);

  beforeEach(async () => {
    movieServiceSpy = jasmine.createSpyObj<MovieServiceInterface>([], {
      movies: _movies.asReadonly(),
      pagination: _pagination.asReadonly(),
      filters: _filters.asReadonly(),
    });
    movieGatewaySpy = jasmine.createSpyObj<MovieGatewayInterface>([
      'fetchMovies',
      'fetchFilters',
    ]);
    authServiceSpy = jasmine.createSpyObj<AuthServiceInterface>(['logout']);
    routerSpy = jasmine.createSpyObj<Router>(['navigate']);

    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MoviesComponent],
      providers: [
        { provide: MovieServiceInterface, useValue: movieServiceSpy },
        { provide: MovieGatewayInterface, useValue: movieGatewaySpy },
        { provide: AuthServiceInterface, useValue: authServiceSpy },
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
    expect(movieGatewaySpy.fetchMovies).toHaveBeenCalledWith(
      component.currentParams,
    );
    expect(movieGatewaySpy.fetchFilters).toHaveBeenCalled();
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
    expect(routerSpy.navigate).toHaveBeenCalledWith([Route.FAVORITES]);
  });

  it('logout should call authService.logout', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
