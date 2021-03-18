import { DynamicFormControl } from '@app/@forms/@core/interfaces/dynamic-form-control';
import { Observable } from 'rxjs';
import { SelectItem } from '../../@forms/@core/interfaces';
import { LazyLoadEvent } from '../../@ideo/components/table/events/lazy-load.event';
import { TableColumn } from '../../@ideo/components/table/models/table-column';
import { TableFilter } from '../../@ideo/components/table/models/table-filter';
import { ButtonItem } from '../../@ideo/core/models/button-item';
import { ComponentDataStore } from './components-data-store';
import { ImportConfig } from './import.config';
import { IPagedList } from './paged-list.response';
import { ToolbarAction } from './tool-bar.action';
export class BasePageConfig<T = any> {
  constructor(obj: BasePageConfig<T> = null) {
    if (!!obj) {
      const keys: string[] = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        this[key] = obj[key];
      }
    }
  }

  title: string;
  preTitle?: string;
  dataKey?: string = 'id';
  stateKey?: string;
  columns: TableColumn<T>[] = [];
  filters?: TableFilter[];
  showFilters?: boolean = true;
  getPageActions?: (dataStore: ComponentDataStore<T>) => ButtonItem<T>[] = () => [];
  itemActions?: ButtonItem<T>[] = [];
  selectionMode?: SelectionMode;
  topRightButtons?: ToolbarAction[];
  topRightAppendExport?: boolean = true;

  formRoute?: string;

  showCreateButton?: boolean = true;
  createLabel?: string = 'Create';

  showEditButton?: boolean = true;
  editLabel?: string = 'Edit';
  editAction?: (item: T) => void; // = 'Edit';
  createAction?: () => void; // = 'Edit';
  showDeleteButton?: boolean = true;
  deleteLabel?: string = 'Delete';
  deleteRoles?: string = '';
  controllerName?: string;

  permissions?: { [key in TablePermissions | string]: string[] };
  // exportRequestType?: 'get' | 'post' = 'get';
  importConfig?: ImportConfig = null;
  getDataProvider: (evt: LazyLoadEvent, ...args: any[]) => Observable<IPagedList<T>>;
  deleteEntity: (item: T, ...args: any[]) => Observable<any>;
  getEntityById?: (item: T) => Observable<any>;
  headerBar$?: Observable<SelectItem[]>;
  fetchData$?: Observable<boolean>;

  registerDataStore?: (dataStore: ComponentDataStore<T>) => void;
  initSelections$?: Observable<number[]>;

  lazy?: boolean = true;
}

export enum TablePermissions {
  Create = 'create',
  Edit = 'edit',
  Delete = 'delete',
}
