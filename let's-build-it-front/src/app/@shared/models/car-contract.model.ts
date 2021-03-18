export interface CarContractModel {
  id?: number;
  status: string;
  customer: string;
  pickUp: string;
  dropOff: string;
  payment: string;
  startDate: Date;
  endDate: Date;
  price: number;
}
