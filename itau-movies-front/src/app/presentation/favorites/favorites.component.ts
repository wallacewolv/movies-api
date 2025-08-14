import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EnvironmentInjector,
  inject,
  OnInit,
  runInInjectionContext,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MovieCardComponent } from '@core/components/movie-card/movie-card.component';
import { AuthServiceInterface } from '@core/contracts/auth/service/auth-service.interface';
import { FavoriteServiceInterface } from '@core/contracts/favorite/service/favorite-service.interface';
import { MovieServiceInterface } from '@core/contracts/movie/service/movie-service.interface';
import { MOVIES_DUMMY } from '@core/utils/dummys/movies.dummy';
import { Route } from '@core/utils/enums/route.enum';
import { DataDTO } from '@domain/movie/dto/data.dto';
import { MovieGatewayInterface } from '@infra/interfaces/movie/movie-gateway.interface';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,

    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,

    MovieCardComponent,
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent implements OnInit {
  private movieService = inject(MovieServiceInterface);
  private movieGateway = inject(MovieGatewayInterface);
  private authService = inject(AuthServiceInterface);
  private favoriteService = inject(FavoriteServiceInterface);
  private router = inject(Router);
  private injector = inject(EnvironmentInjector);

  favorites: DataDTO[] = [];

  ngOnInit() {
    this.ensureMoviesLoaded();
  }

  private ensureMoviesLoaded() {
    const current = this.movieService.movies();

    if (current.length === 0) {
      this.movieGateway.fetchMovies(MOVIES_DUMMY.CURRENT_PARAMS);

      runInInjectionContext(this.injector, () => {
        effect(() => {
          const movies = this.movieService.movies();
          if (movies.length > 0) {
            this.getAllFavorites();
          }
        });
      });
    } else {
      this.getAllFavorites();
    }
  }

  getAllFavorites() {
    const allFavorites = this.movieService.movies();
    const favoritesIds = this.favoriteService.getFavoriteIds();

    this.favorites = allFavorites.filter((m) => favoritesIds.includes(m.id));
  }

  toggle() {
    this.getAllFavorites();
  }

  goToMovies() {
    this.router.navigate([Route.MOVIES]);
  }

  logout() {
    this.authService.logout();
  }
}
