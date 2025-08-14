import { effect, Injectable, signal } from '@angular/core';
import { FavoriteServiceInterface } from '@core/contracts/favorite/service/favorite-service.interface';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService implements FavoriteServiceInterface {
  private readonly FAVORITES_KEY = 'favoriteMovieIds';
  private _favorites = signal<Set<number>>(new Set());

  favorites = this._favorites.asReadonly();

  constructor() {
    this.loadFromStorage();

    effect(() => {
      const ids = Array.from(this._favorites());
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(ids));
    });
  }

  private loadFromStorage() {
    const raw = localStorage.getItem(this.FAVORITES_KEY);
    const parsed: number[] = raw ? JSON.parse(raw) : [];
    this._favorites.set(new Set(parsed));
  }

  toggleFavorite(id: number) {
    const favorites = new Set(this._favorites());
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    this._favorites.set(favorites);
  }

  isFavorite(id: number): boolean {
    return this._favorites().has(id);
  }

  getFavoriteIds() {
    return Array.from(this._favorites());
  }
}
