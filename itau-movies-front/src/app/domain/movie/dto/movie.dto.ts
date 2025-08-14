import { DataDTO } from './data.dto';
import { FiltersDTO } from './filters.dto';
import { PaginationDTO } from './pagination.dto';

export interface MovieDTO {
  data: DataDTO[];
  pagination: PaginationDTO;
  filters: FiltersDTO;
}
