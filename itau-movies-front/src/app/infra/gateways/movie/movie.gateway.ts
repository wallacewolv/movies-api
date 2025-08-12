import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MovieServiceInterface } from '@core/contracts/movie/service/movie-service.interface';
import { AlertService } from '@core/services/alert/alert.service';
import { FiltersMoviesDTO } from '@domain/movie/dto/filters-movies.dto';
import { MovieRequestDTO } from '@domain/movie/dto/movie-request.dto';
import { MovieDTO } from '@domain/movie/dto/movie.dto';
import { MovieGatewayInterface } from '@infra/interfaces/movie/movie-gateway.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieGateway implements MovieGatewayInterface {
  private readonly http = inject(HttpClient);
  private readonly alertService = inject(AlertService);
  private readonly movieService = inject(MovieServiceInterface);

  fetchMovies(filters: MovieRequestDTO) {
    const params = this.mappingParams(filters);

    this.http.get<MovieDTO>('/api-movies/movies', { params }).subscribe({
      next: ({ data, pagination }) => {
        this.movieService.changeMovies(data);
        this.movieService.changePagination(pagination);
      },
      error: (error) => {
        this.alertService.show(error);
      },
    });
  }

  fetchFilters() {
    this.http.get<FiltersMoviesDTO>('/api-movies/movies/filters').subscribe({
      next: (filters) => {
        this.movieService.changeFilters(filters);
      },
      error: (error) => {
        this.alertService.show(error);
      },
    });
  }

  private mappingParams(filters: MovieRequestDTO): HttpParams {
    let params = new HttpParams();

    (Object.keys(filters) as (keyof MovieRequestDTO)[]).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return params;
  }
}
