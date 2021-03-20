import { EventEmitter } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { SelectItem } from '../../../../@forms/@core/interfaces';
import { Permission } from '../../../infrastructure/permissions/permission';
import { TableFilter } from './table-filter';
import { ChangeAction } from './types';

export interface TableColumn<T = any> {
  field: string;
  bindTo?: string;
  header?: string;
  sortable?: boolean;
  sortName?: string;
  sorts?: string[];
  parsedData?: (...args: any[]) => any;
  parsedData$?: (...args: any[]) => Promise<any>;
  parsedHtmlData?: (...args: any[]) => any;
  parsedFullData?: (item: T) => any;
  type?: TableColumnType;
  defaultValue?: string;
  action?: (item: any) => void;
  hidden?: boolean;
  editable?: boolean | ((evt: any) => boolean);
  statusChanged?: (...args: any[]) => any;
  statuses?: SelectItem[];
  setValue?: EventEmitter<ChangeAction>;
  styleClass?: string;
  icon?: string;
  tipContent?: (...args: any[]) => any;
  useOn?: number[];
  data?: any;
  placeholder?: string;
  pairs?: boolean;
  getStatus?: (...args: any[]) => any;
  getStatusByFullData?: (...args: any) => any;
  permission?: Permission;
  tooltip?: string;
  options?: SelectItem[];
  getInnerHtml?: (...args: any[]) => any;
  onChange?: (...args: any[]) => any;
  href?: (evt: any, full?: T) => boolean | any[] | string[];
  queryParams?: (item: T) => any;
  onClick?: (...args: any[]) => any;
  appendToBody?: string;
  validation?: ValidatorFn[];
  errors?: SelectItem[];
  required?: boolean;
  chars?: number;
  colspan?: number;
  ignoreTimeZone?: boolean;
  endpoint?: string | string[];
  filter?: TableFilter | TableFilter[];
}

export enum TableColumnType {
  Image,
  Boolean,
  Status,
  Date,
  DateTime,
  Async,
  Numeric,
  Default,
  Link,
  SubStr,
  StaticImage,
}
