import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { AlertService } from '../alert/alert.service';
import {
  Movie,
  MovieParamsRequest,
  MovieResponse,
  Pagination,
} from './movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private http = inject(HttpClient);
  private alertService = inject(AlertService);

  private _movies = signal<Movie[]>([]);
  private _pagination = signal<Pagination>({
    currentPage: 0,
    totalPages: 0,
    moviesPerPage: 0,
    totalMovies: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  private _filters = signal<{
    availableGenres: string[];
    availableSortFields: string[];
    sortOrders: string[];
  }>({
    availableGenres: [
      'Drama',
      'Ação',
      'Documentário',
      'Thriller',
      'Crime',
      'Romance',
      'Animação',
      'Aventura',
      'Comédia',
      'Terror',
      'Fantasia',
      'Ficção Científica',
    ],
    availableSortFields: ['nome', 'anoLancamento', 'genero'],
    sortOrders: ['asc', 'desc'],
  });

  fetchMovies(filters: MovieParamsRequest) {
    let params = new HttpParams();

    (Object.keys(filters) as (keyof MovieParamsRequest)[]).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    this.http.get<MovieResponse>('/api-movies/movies', { params }).subscribe({
      next: ({ data, pagination }) => {
        this._movies.set(data);
        this._pagination.set(pagination);
      },
      error: (error) => {
        this.alertService.show(error);
      },
    });
  }

  getMovies() {
    return this._movies.asReadonly();
  }

  getPagination() {
    return this._pagination.asReadonly();
  }

  getFilters() {
    return this._filters.asReadonly();
  }
}
