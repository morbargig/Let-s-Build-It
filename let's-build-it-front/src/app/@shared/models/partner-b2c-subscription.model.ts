import { BillingPeriod } from '../interfaces/billing-period.enum';
export interface PartnerB2CSubscriptionModel{
  id?: number;
  name: string;
  discountPrecentage: number;
  payment: number;
  billingPeriod: BillingPeriod;
  billingDayOfMonth: number | string;
  isActive: boolean;
  customersCount: number;
  description: string;
  partnerId: number;
  created?: Date;
  updated?: Date;
}