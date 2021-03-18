import { CarAccidentMediaModel } from './car-accident-media.model';

export interface CarAccidentModel {
  id?: number;
  orderId?: number;
  type: AccidentType;
  date: Date;
  location: string;
  comments: string;
  thirdPartyPhoneNumber: string;
  createUser: string;
  updateUser: string;
  createDate: Date;
  updateDate: Date;
  accidentMediaItems: CarAccidentMediaModel[];
}

export enum AccidentType {
  Unknown = 0,
  Self = 1,
  ThirdParty = 2,
}
