import { DamageType } from './car-damage.model';
export interface CarDamageGeneralInfoModel{
  damageId?: number;
  type?: DamageType;
  additionalInfo: string;
}