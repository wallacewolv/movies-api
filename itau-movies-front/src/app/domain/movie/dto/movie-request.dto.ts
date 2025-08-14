import { Order, SortBy } from '@core/utils/enums/movie.enum';

export interface MovieRequestDTO {
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  order?: Order;
  genero?: string;
}
