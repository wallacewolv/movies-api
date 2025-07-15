import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AlertService } from '../alert/alert.service';
import { Order, SortBy } from './movie.enum';
import {
  FiltersMoviesResponse,
  MovieParamsRequest,
  MovieResponse,
} from './movie.model';
import { MovieService } from './movie.service';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(() => {
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['show']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MovieService,
        { provide: AlertService, useValue: alertServiceSpy },
      ],
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch movies and update signals on success', () => {
    const filters: MovieParamsRequest = {
      genero: 'Drama',
      page: 1,
      sortBy: SortBy.NOME,
      order: Order.ASC,
    };

    const mockResponse: MovieResponse = {
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
    };

    service.fetchMovies(filters);

    const req = httpMock.expectOne(
      (req) =>
        req.url === '/api-movies/movies' &&
        req.params.get('genero') === 'Drama' &&
        req.params.get('page') === '1', // corrigido aqui
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    // Agora chamamos a função para obter o valor do signal
    expect(service.getMovies()()).toEqual(mockResponse.data);
    expect(service.getPagination()()).toEqual(mockResponse.pagination);
  });

  it('should call AlertService.show on fetchMovies error', () => {
    service.fetchMovies({});

    const req = httpMock.expectOne('/api-movies/movies');
    req.flush('Erro', { status: 500, statusText: 'Erro' });

    expect(alertServiceSpy.show).toHaveBeenCalled();
  });

  it('should fetch filters and update signal on success', () => {
    const mockFilters: FiltersMoviesResponse = {
      availableGenres: ['Drama', 'Comédia'],
      availableSortFields: ['nome', 'anoLancamento'],
      sortOrders: ['asc', 'desc'],
    };

    service.fetchFilters();

    const req = httpMock.expectOne('/api-movies/movies/filters');
    expect(req.request.method).toBe('GET');
    req.flush(mockFilters);

    expect(service.getFilters()()).toEqual(mockFilters); // chamando a função para obter valor
  });

  it('should call AlertService.show on fetchFilters error', () => {
    service.fetchFilters();

    const req = httpMock.expectOne('/api-movies/movies/filters');
    req.flush('Erro ao buscar filtros', {
      status: 400,
      statusText: 'Bad Request',
    });

    expect(alertServiceSpy.show).toHaveBeenCalled();
  });
});
