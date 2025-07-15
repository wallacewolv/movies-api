import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly FAVORITES_KEY = 'favoriteMovieIds';
  private favorites = signal<Set<number>>(new Set());

  constructor() {
    this.loadFromStorage();

    // Atualiza localStorage sempre que o favorites mudar
    effect(() => {
      const ids = Array.from(this.favorites());
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(ids));
    });
  }

  /** Carrega favoritos do localStorage */
  private loadFromStorage() {
    const raw = localStorage.getItem(this.FAVORITES_KEY);
    const parsed: number[] = raw ? JSON.parse(raw) : [];
    this.favorites.set(new Set(parsed));
  }

  toggleFavorite(id: number) {
    const favorites = new Set(this.favorites());
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    this.favorites.set(favorites);
  }

  isFavorite(id: number): boolean {
    return this.favorites().has(id);
  }

  getFavoriteIds() {
    return Array.from(this.favorites());
  }
}
