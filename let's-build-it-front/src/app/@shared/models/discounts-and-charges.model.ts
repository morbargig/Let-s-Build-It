export interface FixedDiscountsModel {
  partnerId: number;
  isActive: boolean;
  refulingDiscount: number;
  refulingMaxDiscount: number;
  refulingMinRefuelLevel: number;
  refulingMaxRefuelLevel: number;
  carWashingDiscount: number;
  carWashingMaxDiscount: number;
  created?: Date;
  updated?: Date;
}

export interface ChargesModel {
  partnerId: number;
  outOfDropZoneParkingCharge: number;
  lateDropOffChargePerMinute: number;
  lateDropOffChargeDelayMinutes: number;
  lateDropOffChargeMinCharge: number;
  nonFulledReturnCharge: number;
  nonFulledReturnUnder: number;
  lateBookingCancellationCharge: number;
  lateBookingCancellationChargeHours: number;
  airportTaxes: number;
  cityTaxes: number;
  countryTaxes: number;
  created?: Date;
  updated?: Date;
}

export interface DiscountsModel {
  id: number;
  partnerId: number;
  type: number;
  start: Date | string;
  end: Date | string;
  discount: number;
  created?: Date;
  updated?: Date;
}

export enum DiscountType {
  Hourly = 1,
  Daily = 2,
  Holiday = 3,
  Weekend = 4,
}
