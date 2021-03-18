import { Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SelectItem } from '../../../../@forms/@core/interfaces';
import { Permission } from '../../../infrastructure/permissions/permission';
import { TableColumn } from './table-column';
import { FilterObject, LazyLoadEvent } from '../events/lazy-load.event';
import { IPagedList } from '../../../../@shared/models/paged-list.response';

export interface TableFilter {
  type?: Type<TableFilterInput>;
  defaultValue?: any;
  name?: string;
  label?: string;
  value?: any;
  apply?: (...args: any[]) => any;
  onChange?: (...args: any[]) => any;
  options?: SelectItem[];
  placeholder?: string;
  styleClass?: string;
  minDate?: Date;
  maxDate?: Date;
  showIcon?: boolean;
  completeMethod?: (...args: any[]) => any;
  disabled?: boolean;
  hidden?: boolean;
  hidePlaceholder?: boolean;
  matchMode?: MatchMode;
  selectionMode?: string;
  filter?: boolean;
  useOn?: number[];
  defaultLabel?: string;
  reverseSelection?: boolean;
  hideButtonBar?: boolean;
  hideClear?: boolean;
  required?: boolean;
  showWeek?: boolean;
  appendToBody?: string;
  asyncOptions?: Observable<SelectItem[]>;
  queryFilters?: (query: string) => FilterObject,
  lazyOptions?: (evt: LazyLoadEvent) => Observable<IPagedList<SelectItem>>;
  isFictive?: boolean;
  displayField?: string;
  valueField?: string;
  innerFilter?: TableFilter;
  inputType?: string;
  permission?: Permission;
  regularParam?: boolean;
}

export interface TableFilterInput {
  filter: TableFilter;
  column?: TableColumn<any>;
  group: FormGroup;
  comparisonOptions: SelectItem[];
  innerComparisonOptions?: SelectItem[];
}

export enum MatchMode {
  Contains = 2250,
  Equals = 2000,
  NotEquals = 2001,
  LessThan = 2002,
  LessThanOrEquals = 2003,
  GreaterThan = 2004,
  GreaterThanOrEquals = 2005,
  Before = 2002,
  BeforeOrEquals = 2003,
  After = 2004,
  EqualsOrAfter = 2005,
  StartsWith = 2251,
  EndsWith = 2252,
  Any = 2500,
}
