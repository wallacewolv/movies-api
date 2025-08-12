export abstract class FavoriteServiceInterface {
  abstract toggleFavorite(id: number): void;
  abstract isFavorite(id: number): boolean;
  abstract getFavoriteIds(): Array<number>;
}
