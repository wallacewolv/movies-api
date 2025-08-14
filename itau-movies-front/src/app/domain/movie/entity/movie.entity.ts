import { DataDTO } from '../dto/data.dto';
import { FiltersDTO } from '../dto/filters.dto';
import { MovieDTO } from '../dto/movie.dto';
import { PaginationDTO } from '../dto/pagination.dto';

export class Movie {
  private _data: DataDTO[];
  private _pagination: PaginationDTO;
  private _filters: FiltersDTO;

  constructor({ data, pagination, filters }: MovieDTO) {
    this._data = data;
    this._pagination = pagination;
    this._filters = filters;
  }

  get data(): DataDTO[] {
    return this._data;
  }

  get pagination(): PaginationDTO {
    return this._pagination;
  }

  get filters(): FiltersDTO {
    return this._filters;
  }

  changeData(data: DataDTO[]): void {
    this._data = data;
  }

  changePagination(pagination: PaginationDTO): void {
    this._pagination = pagination;
  }

  changeFilters(filters: FiltersDTO): void {
    this._filters = filters;
  }

  toJON(): MovieDTO {
    return {
      data: this._data,
      pagination: this._pagination,
      filters: this._filters,
    };
  }
}
