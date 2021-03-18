import { InventoryModel } from "./inventory.model";
import { PartnerMediaModel } from './partner-media.model';

export interface PartnerModel {
  id?: number;
  name: string;
  companyExternalId?: number;
  referenceNumber: string;
  vatId: string;
  phone: string;
  email: string;
  address: string;
  status: boolean;
  vehiclesCount?: number;
  paymentPlanId?: number;
  billingStartDate?: Date;
  billingEndDate?: Date;
  billingDate?: Date;
  approvalReferenceNumber: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  logoImgId: number;
  createUserId: number;
  updateUserId?: number;
  createDate: Date;
  updateDate: Date;
  inventories?: InventoryModel[];
  mediaItems?: PartnerMediaModel[];
}
