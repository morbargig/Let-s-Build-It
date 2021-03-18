import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Permission } from '../../../infrastructure/permissions/permission';
import { IdeoIconModel } from '../../../../@shared/models/ideo-icon.model';
export interface SelectItem {
  label?: string;
  value: any;
  styleClass?: string;
  icon?: string | IconDefinition | number | keyof IdeoIconModel;
  title?: string;
  disabled?: boolean;
  click?: (evt: Event) => void;
  href?: (item: any) => any[];
  link?: string;
  items?: SelectItem[];
  flag?: boolean;
  permission?: Permission;
}
