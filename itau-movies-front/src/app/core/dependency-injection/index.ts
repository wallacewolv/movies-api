import { Provider } from '@angular/core';
import { AlertServiceInterface } from '@core/contracts/alert/service/alert-service.interface';
import { AuthServiceInterface } from '@core/contracts/auth/service/auth-service.interface';
import { FavoriteServiceInterface } from '@core/contracts/favorite/service/favorite-service.interface';
import { MovieServiceInterface } from '@core/contracts/movie/service/movie-service.interface';
import { AlertService } from '@core/services/alert/alert.service';
import { AuthService } from '@core/services/auth/auth.service';
import { FavoriteService } from '@core/services/favorite/favorite.service';
import { MovieService } from '@core/services/movie/movie.service';
import { AuthGateway } from '@infra/gateways/auth/auth.gateway';
import { MovieGateway } from '@infra/gateways/movie/movie.gateway';
import { AuthGatewayInterface } from '@infra/interfaces/auth/auth-gateway.interface';
import { MovieGatewayInterface } from '@infra/interfaces/movie/movie-gateway.interface';

export const dependencyInjection: Array<Provider> = [
  // Auth
  {
    provide: AuthGatewayInterface,
    useClass: AuthGateway,
  },
  {
    provide: AuthServiceInterface,
    useClass: AuthService,
  },
  // Movie
  {
    provide: MovieGatewayInterface,
    useClass: MovieGateway,
  },
  {
    provide: MovieServiceInterface,
    useClass: MovieService,
  },
  // Alert
  {
    provide: AlertServiceInterface,
    useClass: AlertService,
  },
  // Favorites
  {
    provide: FavoriteServiceInterface,
    useClass: FavoriteService,
  },
];
