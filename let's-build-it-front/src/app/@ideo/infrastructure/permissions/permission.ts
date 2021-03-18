export interface Permission {
  roles?: string[];
  action?: ActionPermission;
  values?: string[];
}

export interface ActionPermission {
  controller: string;
  name: string;
}
