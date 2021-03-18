import { LazyLoadEvent } from '../../@ideo/components/table/events/lazy-load.event';
import { TableColumn } from '../../@ideo/components/table/models/table-column';
import { TableComponent } from '../../@ideo/components/table/table.component';
export interface ITabledPage<T> {
  tc: TableComponent;
  items: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  totalRecords: number;
  onLazyLoad?(event: LazyLoadEvent): void;
}
