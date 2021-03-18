import { TableFilter } from '../models/table-filter';
import { SortDirection } from '../models/types';

export interface LazyLoadEvent {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortColumn?: string;
  sortDirection?: SortDirection;
  sorts?: string[];
  filters?: FilterObject | any;
  exportType?: string;
  exportAll?: boolean;
  exportIds?: number[];
  exportRequestTypePost?: boolean;
  selection?: number[];
}

export interface FilterObject {
  [key: string]: {
    value: any;
    matchMode: number;
    innerFilter?: FilterObject | TableFilter;
    regularParam?: boolean;
  };
}
