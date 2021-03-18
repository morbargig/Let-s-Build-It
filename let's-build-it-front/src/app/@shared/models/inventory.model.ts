import { InventoryType } from '../interfaces/inventory-type.enum';

export interface InventoryModel {
  id?: number;
  inventoryType: InventoryType;
  externalId: string;
  chipProviderType: string;
  carId?: number;
  partnerId?: number;
  created: Date;
  updated: Date;
}
