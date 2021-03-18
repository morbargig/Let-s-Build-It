import { Permission } from '../../@ideo/infrastructure/permissions/permission';
export interface NavigationOptions {
  title: string;
  link?: string;
  icon?: NavigationIcon;
  level?: number;
  items?: NavigationOptions[];
  target?: string;
  open?: boolean;
  permission?: Permission;
}

export interface NavigationIcon {
  name?: any;
  letter?: string;
  size?: string;
}
