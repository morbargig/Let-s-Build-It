import { CarDamageMediaModel } from './car-damage-media.model';

export interface CarDamageModel {
  id?: number;
  carId: number;
  orderId?: number;
  occurrenceDate?: Date;
  type?: DamageType;
  position?: DamagePositionType;
  side?: DamageSideType;
  additionalInfo: string;
  points: string;
  damageDateType: DamageDateType;
  createUser: string;
  updateUser: string;
  createDate?: Date;
  updateDate?: Date;
  damageMediaItems?: (CarDamageMediaModel | any)[] ;
}

export enum DamageType {
  Scratch = 1,
  Bump = 2,
  Bend = 3,
  Dirt = 4,
  MechanicalFailure = 5,
  General = 6,
}

export enum DamagePositionType {
  Wing = 1,
  Door = 2,
  Trunk = 3,
  Roof = 4,
  Bumper = 5,
  Inside = 6,
  Hood = 7,
}

export enum DamageSideType {
  Left = 1,
  Right = 2,
  Front = 3,
  Rear = 4,
}

export enum DamageDateType {
  Unknown = 0,
  OnCreateVehicle = 1,
  OnUpdateVehicle = 2,
  OnCreateOrder = 3,
  OnCloseOrder = 4,
}
