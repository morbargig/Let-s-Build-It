import { AsyncCellComponent } from '../table-cells/async-cell/async-cell.component';
import { BooleanCellComponent } from '../table-cells/boolean-cell/boolean-cell.component';
import { DateCellComponent } from '../table-cells/date-cell/date-cell.component';
import { DateTimeCellComponent } from '../table-cells/date-time-cell/date-time-cell.component';
import { DefaultCellComponent } from '../table-cells/default-cell/default-cell.component';
import { ImageCellComponent } from '../table-cells/image-cell/image-cell.component';
import { LinkCellComponent } from '../table-cells/link-cell/link-cell.component';
import { StatusCellComponent } from '../table-cells/status-cell/status-cell.component';
import { SubStrCellComponent } from '../table-cells/sub-str-cell/sub-str-cell.component';
import { BooleanFilterComponent } from '../table-filters/boolean-filter/boolean-filter.component';
import { CalendarFilterComponent } from '../table-filters/calendar-filter/calendar-filter.component';
import { NumericFilterComponent } from '../table-filters/numeric-filter/numeric-filter.component';
import { TextFilterComponent } from '../table-filters/text-filter/text-filter.component';
import { SelectItem } from './select-item';
import { TableColumnType } from './table-column';

export const Rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: 'asc', '': 'asc' };
export type ChangeAction = { index: number; value: any };
export type SortDirection = 'asc' | 'desc' | '';
export const TableCellDic = {
  [TableColumnType.Image]: ImageCellComponent,
  [TableColumnType.StaticImage]: ImageCellComponent,
  [TableColumnType.Boolean]: BooleanCellComponent,
  [TableColumnType.Status]: StatusCellComponent,
  [TableColumnType.Date]: DateCellComponent,
  [TableColumnType.DateTime]: DateTimeCellComponent,
  [TableColumnType.Async]: AsyncCellComponent,
  [TableColumnType.Default]: DefaultCellComponent,
  [TableColumnType.Link]: LinkCellComponent,
  [TableColumnType.SubStr]: SubStrCellComponent,
};
export const TableFilterDic = {
  [TableColumnType.Date]: CalendarFilterComponent,
  [TableColumnType.DateTime]: CalendarFilterComponent,
  [TableColumnType.Numeric]: NumericFilterComponent,
  [TableColumnType.Boolean]: BooleanFilterComponent,
  [TableColumnType.SubStr]: TextFilterComponent,
  [TableColumnType.Status]: TextFilterComponent,
  [TableColumnType.Link]: TextFilterComponent,
  [TableColumnType.Image]: null as any,
};
export interface SelectItemStore<T> extends SelectItem {
  useOn: T[];
}
