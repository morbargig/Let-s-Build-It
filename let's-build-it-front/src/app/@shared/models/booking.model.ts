export interface BookingModel {
  id?: number;
  customerId: number;
  carId?: number;
  partnerCarCategoryId?: number;
  pickUpZoneId: number;
  dropOffZoneId: number;
  startDate: Date;
  endDate: Date;
  created?: Date;
  updated?: Date;
  ancillaries?: BookingAncillary[];
  drivers?: BookingDriverModel[];
}

export interface BookingDriverModel {
  id?: number;
  BookingId?: number;
  UserId: number;
  created?: Date;
  updated?: Date;
}

export interface BookingAncillary {
  id?: number;
  BookingId?: number;
  AncillaryId: number;
  AdditionalPrice: number;
  created?: Date;
  updated?: Date;
}
