export interface PermissionModel {
  id?: number;
  name: string;
  systemName: string;
  category: string;
  roleIds: number[];
}
