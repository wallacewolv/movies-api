import { DataDTO } from '@domain/movie/dto/data.dto';
import { FiltersMoviesDTO } from '@domain/movie/dto/filters-movies.dto';
import { MovieRequestDTO } from '@domain/movie/dto/movie-request.dto';
import { PaginationDTO } from '@domain/movie/dto/pagination.dto';

export const MOVIES_DUMMY = {
  get MOVIES_VALUES(): DataDTO[] {
    return [
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
  },

  get FILTER_INITIAL(): FiltersMoviesDTO {
    return {
      availableGenres: [],
      availableSortFields: [],
      sortOrders: [],
    };
  },

  get FILTERS_VALUES(): FiltersMoviesDTO {
    return {
      availableGenres: ['Drama', 'Ação', 'Comédia'],
      availableSortFields: ['nome', 'anoLancamento', 'genero'],
      sortOrders: ['asc', 'desc'],
    };
  },

  get PAGINATION_INITIAL(): PaginationDTO {
    return {
      currentPage: 0,
      totalPages: 0,
      moviesPerPage: 0,
      totalMovies: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };
  },

  get CURRENT_PARAMS(): MovieRequestDTO {
    return {
      page: 1,
      limit: 10,
    };
  },

  get SORT_FIELDS(): string[] {
    return ['nome', 'anoLancamento', 'genero'];
  },
};
