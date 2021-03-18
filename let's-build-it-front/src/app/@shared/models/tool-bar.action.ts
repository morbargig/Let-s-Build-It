import { EventEmitter } from '@angular/core';
import { Permission } from '../../@ideo/infrastructure/permissions/permission';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface ToolbarAction {
  label?: string;
  styleClass?: string;
  icon?: string;
  faIcon?: IconDefinition;
  optionsArr?: any[];
  selected?: any[];
  selectLabel?: string;
  click?: (...args: any[]) => any;
  changed?: (...args: any[]) => any;
  hide?: (...args: any[]) => any;
  showHeader?: boolean;
  disabled?: boolean;
  setDisabled?: EventEmitter<boolean>;
  fromDate?: Date;
  toDate?: Date;
  hidden?: boolean;
  useOn?: number[];
  // endpoints?:string | string[],
  // roles?: string | string[];
  permission?: Permission;
}
