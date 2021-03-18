export interface CarActionLogModel{
  id?: number;
  carId: number;
  userId?: number;
  contractId?: number;
  actionNmae: string;
  createUser: string;
  updateUser: string;
  status: boolean;
  comments: string;
  createDate?: Date;
  updateDate?: Date;

}