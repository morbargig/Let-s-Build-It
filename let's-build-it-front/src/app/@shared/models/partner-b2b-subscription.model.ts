export interface PartnerB2BSubscriptionModel{
  id?: number;
  name: string;
  fee: number;
  discountPrecentage: number;
  revenueStart: number;
  revenueEnd: number;
  partnerId: number;
  created?: Date;
  updated?: Date;
}