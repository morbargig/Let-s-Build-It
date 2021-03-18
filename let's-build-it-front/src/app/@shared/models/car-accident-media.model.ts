export interface CarAccidentMediaModel {
  accidentId: number;
  mediaId: number;
  mediaType: AccidentMediaType;
  created?: Date;
  updated?: Date;
}

export enum AccidentMediaType {
  ThirdPartyVehicleLicence,
  ThirdPartyDrivingLicense,
  ThirdPartyInsurance,
  ThirdPatyCarDamage,
  CarDamage,
}
