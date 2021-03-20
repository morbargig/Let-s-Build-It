import { Observable } from 'rxjs';
import { Permission } from '../../infrastructure/permissions/permission';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

export interface ButtonItem<T = any> {
  label?: string;
  click?: (item: T, btn: ButtonItem) => void;
  hidden?: (item: T) => boolean;
  useOn?: number[];
  styleClass?: string;
  icon?: IconDefinition | string;
  title?: string;
  item?: T;
  type?: string | 'topActions';
  disabled$?: Observable<boolean>;
  disable?: (item: T) => boolean;
  disabled?: boolean;
  tooltip?: string;
  // roles?: string | string[];
  permission?: Permission;
  href?: (item: T) => boolean | any[];
  queryParams?: (item: T) => any;
}
