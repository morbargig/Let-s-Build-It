export interface PartnerPriceModel {
    id?: number;
    partnerId: number;
    pricingGroupId?: number;
    isPricingGroupDefault: boolean;
    carsCount: number;
    minChargeTime: number;
    extraMileageCharge: number;
    name: string;
    priceValues: PartnerPriceValueModel[];
    isActive: boolean;
    start?: Date;
    end?: Date;
    created?: Date;
    updated?: Date;
}

export interface PartnerPriceValueModel {
    partnerPriceId: number;
    type: Period;
    price: number;
    mileageIncluded: number;
    additionalMileagePrice: number;
    created?: Date;
    updated?: Date;
}

export interface partnerPriceCarModel {
    partnerPriceId: number;
    carId: number;
    created?: Date;
    updated?: Date;
}

export enum Period {
    Minutes = 1,
    Hours = 2,
    Daily = 3,
    Weekly = 4,
    Monthly = 5
}



