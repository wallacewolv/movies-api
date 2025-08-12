import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertServiceInterface } from '@core/contracts/alert/service/alert-service.interface';
import { MovieServiceInterface } from '@core/contracts/movie/service/movie-service.interface';
import { Order, SortBy } from '@core/utils/enums/movie.enum';
import { DataDTO } from '@domain/movie/dto/data.dto';
import { FiltersMoviesDTO } from '@domain/movie/dto/filters-movies.dto';
import { MovieRequestDTO } from '@domain/movie/dto/movie-request.dto';
import { Movie } from '@domain/movie/entity/movie.entity';

import { MovieGateway } from './movie.gateway';

describe('MovieGateway', () => {
  let gateway: MovieGateway;
  let httpMock: HttpTestingController;

  let movieServiceSpy: jasmine.SpyObj<MovieServiceInterface>;
  let alertServiceSpy: jasmine.SpyObj<AlertServiceInterface>;

  beforeEach(() => {
    movieServiceSpy = jasmine.createSpyObj<MovieServiceInterface>(
      ['changeMovies', 'changePagination', 'changeFilters'],
      {
        filters: signal<FiltersMoviesDTO>({
          availableGenres: [],
          availableSortFields: [],
          sortOrders: [],
        }),
        movies: signal<DataDTO[]>([
          {
            anoLancamento: 2023,
            descricao: 'Tralalala',
            genero: 'Drama',
            id: 1,
            nome: 'Filme A',
          },
        ]),
      },
    );
    alertServiceSpy = jasmine.createSpyObj<AlertServiceInterface>(['show']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        MovieGateway,
        { provide: MovieServiceInterface, useValue: movieServiceSpy },
        { provide: AlertServiceInterface, useValue: alertServiceSpy },
      ],
    });

    gateway = TestBed.inject(MovieGateway);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(gateway).toBeTruthy();
  });

  it('should fetch movies and update signals on success', () => {
    const filters: MovieRequestDTO = {
      genero: 'Drama',
      page: 1,
      sortBy: SortBy.NOME,
      order: Order.ASC,
    };

    const mockResponse = new Movie({
      data: [
        {
          id: 1,
          nome: 'Filme A',
          genero: 'Drama',
          descricao: 'Tralalala',
          anoLancamento: 2023,
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 2,
        moviesPerPage: 10,
        totalMovies: 20,
        hasNextPage: true,
        hasPrevPage: false,
      },
      filters: {
        genero: '',
        order: '',
        sortBy: '',
      },
    });

    gateway.fetchMovies(filters);

    const req = httpMock.expectOne(
      (req) =>
        req.url === '/api-movies/movies' &&
        req.params.get('genero') === 'Drama' &&
        req.params.get('page') === '1', // corrigido aqui
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    // Agora chamamos a função para obter o valor do signal
    expect(movieServiceSpy.movies()).toEqual(mockResponse.data);
    expect(movieServiceSpy.pagination()).toEqual(mockResponse.pagination);
  });

  it('should call AlertGateway.show on fetchMovies error', () => {
    gateway.fetchMovies({});

    const req = httpMock.expectOne('/api-movies/movies');
    req.flush('Erro', { status: 500, statusText: 'Erro' });

    expect(alertServiceSpy.show).toHaveBeenCalled();
  });

  it('should fetch filters and update signal on success', () => {
    const mockFilters: FiltersMoviesDTO = {
      availableGenres: ['Drama', 'Comédia'],
      availableSortFields: ['nome', 'anoLancamento'],
      sortOrders: ['asc', 'desc'],
    };

    gateway.fetchFilters();

    const req = httpMock.expectOne('/api-movies/movies/filters');
    expect(req.request.method).toBe('GET');
    req.flush(mockFilters);

    expect(movieServiceSpy.filters()).toEqual(mockFilters); // chamando a função para obter valor
  });

  it('should call AlertGateway.show on fetchFilters error', fakeAsync(() => {
    gateway.fetchFilters();

    const req = httpMock.expectOne('/api-movies/movies/filters');
    req.flush('Erro ao buscar filtros', {
      status: 400,
      statusText: 'Bad Request',
    });

    tick();
    expect(alertServiceSpy.show).toHaveBeenCalled();
  }));
});
