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

import { AuthService } from '../../core/auth/auth.service';
import { FavoritesService } from '../../core/favorites/favorites.service';
import { Movie } from '../../core/movie/movie.model';
import { MovieService } from '../../core/movie/movie.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

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
  private movieService = inject(MovieService);
  private authService = inject(AuthService);
  private favoritesService = inject(FavoritesService);
  private router = inject(Router);
  private injector = inject(EnvironmentInjector);

  favorites: Movie[] = [];

  ngOnInit() {
    this.ensureMoviesLoaded();
  }

  private ensureMoviesLoaded() {
    const current = this.movieService.getMovies()();

    if (current.length === 0) {
      this.movieService.fetchMovies({ page: 1, limit: 100 });

      runInInjectionContext(this.injector, () => {
        effect(() => {
          const movies = this.movieService.getMovies()();
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
    const allFavorites = this.movieService.getMovies()();
    const favoritesIds = this.favoritesService.getFavoriteIds();

    this.favorites = allFavorites.filter((m) => favoritesIds.includes(m.id));
  }

  toggle() {
    this.getAllFavorites();
  }

  goToMovies() {
    this.router.navigate(['movies']);
  }

  logout() {
    this.authService.logout();
  }
}
