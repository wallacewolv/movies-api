import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FavoritesService } from '../../../core/favorites/favorites.service';
import { Movie } from '../../../core/movie/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,

    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  private favoritesService = inject(FavoritesService);

  movie = input<Movie>();
  toggleFavorite = output<void>();

  toggle(id: number) {
    this.favoritesService.toggleFavorite(id);
    this.toggleFavorite.emit();
  }

  isFav(id: number) {
    return this.favoritesService.isFavorite(id);
  }
}
