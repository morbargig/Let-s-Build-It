import { InventoryModel } from './inventory.model';
import { FuelType } from '../interfaces/fuel-type.enum';
import { TransmissionType } from '../interfaces/transmission-type.enum';
import { CarDamageModel } from './car-damage.model';
export interface CarModel {
  id?: number;
  carOwnerId?: number;
  partnerId: number;
  vin: string;
  plateNo: string;
  pricingType: string;
  manufacturerCode: string;
  modelCode: string;
  manufacturer: string;
  model: string;
  modelYear: number;
  fuelType: FuelType;
  seatsNo?: number;
  transmission: TransmissionType;
  enginePower?: number;
  engineDisplacement: number;
  doorsNumber: number;
  tankCapacity?: number;
  price?: number;
  vehiclePlugId: string;
  isNew?: boolean;
  kmAtInitiate?: number;
  serviceKmInterval?: number;
  kmAtServiceDate?: number;
  serviceDate?: Date;
  profileImgId?: number;
  stateId?: number;
  csmType: string;
  csmManufacturer: string;
  csmModel: string;
  // electricRefillFirstQuarter?: number;
  // electricRefillSecondQuarter?: number;
  // electricRefillThirdQuarter?: number;
  // electricRefillForthQuarter?: number;
  createUser: string;
  updateUser: string;
  createDate: Date;
  updateDate: Date;
  inventories?: InventoryModel[];
  mediaItems?: CarMedia[];
  carDamages?: CarDamageModel[];
}

export interface CarMedia {
  carId?: number;
  mediaId: number;
  carMediaType: CarMediaType;
  created?: Date;
  updated?: Date;
}

export enum CarMediaType {
  Front,
  RightSide,
  Rear,
  LeftSide,
  License,
  Insurance,
}
