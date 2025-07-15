import { Order, SortBy } from './movie.enum';

export interface MovieResponse {
  data: Movie[];
  pagination: Pagination;
  filters: Filters;
}

export interface Filters {
  sortBy: string;
  order: string;
  genero: null;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalMovies: number;
  moviesPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Movie {
  id: number;
  nome: string;
  anoLancamento: number;
  descricao: string;
  genero: string;
}

export interface MovieParamsRequest {
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  order?: Order;
  genero?: string;
}
