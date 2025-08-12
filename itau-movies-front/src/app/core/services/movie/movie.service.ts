import { Injectable, signal } from '@angular/core';
import { MovieServiceInterface } from '@core/contracts/movie/service/movie-service.interface';
import { MOVIES_DUMMY } from '@core/utils/dummys/movies.dummy';
import { DataDTO } from '@domain/movie/dto/data.dto';
import { FiltersMoviesDTO } from '@domain/movie/dto/filters-movies.dto';
import { PaginationDTO } from '@domain/movie/dto/pagination.dto';

@Injectable({
  providedIn: 'root',
})
export class MovieService implements MovieServiceInterface {
  private _movies = signal<DataDTO[]>([]);
  private _pagination = signal<PaginationDTO>(MOVIES_DUMMY.PAGINATION_INITIAL);
  private _filters = signal<FiltersMoviesDTO>(MOVIES_DUMMY.FILTER_INITIAL);

  movies = this._movies.asReadonly();
  pagination = this._pagination.asReadonly();
  filters = this._filters.asReadonly();

  changeMovies(movies: DataDTO[]) {
    this._movies.set(movies);
  }

  changePagination(pagination: PaginationDTO) {
    this._pagination.set(pagination);
  }

  changeFilters(filters: FiltersMoviesDTO) {
    this._filters.set(filters);
  }
}
