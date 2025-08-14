import { Signal } from '@angular/core';
import { DataDTO } from '@domain/movie/dto/data.dto';
import { FiltersMoviesDTO } from '@domain/movie/dto/filters-movies.dto';
import { PaginationDTO } from '@domain/movie/dto/pagination.dto';

export abstract class MovieServiceInterface {
  abstract movies: Signal<DataDTO[]>;
  abstract pagination: Signal<PaginationDTO>;
  abstract filters: Signal<FiltersMoviesDTO>;

  abstract changeMovies(movies: DataDTO[]): void;
  abstract changePagination(pagination: PaginationDTO): void;
  abstract changeFilters(filters: FiltersMoviesDTO): void;
}
