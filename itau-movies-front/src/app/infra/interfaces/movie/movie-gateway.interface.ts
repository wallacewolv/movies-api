import { MovieRequestDTO } from '@domain/movie/dto/movie-request.dto';

export abstract class MovieGatewayInterface {
  abstract fetchMovies(filters: MovieRequestDTO): void;
  abstract fetchFilters(): void;
}
