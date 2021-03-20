export interface UserManagementModel {
  id?: number;
  firstName: string;
  lastName: string;
  role: string;
  username: string;
  email: string;
  phoneNumber: string;
  password?: string;
  lastLogin?: Date;
  createDate?: Date;
  tags?: string[];
  profileImageId?: number;
}
