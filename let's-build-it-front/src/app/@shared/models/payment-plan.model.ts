export interface PaymentPlanModel {
    id?: number,
    trialPeriodEnd?: Date,
    fixedPaymentAmount?: number,
    vehicleBaseRentFees?: number,
    vehicleExtraFees?: number,
    vehicleAncillaries?: number,
    subscriptionB2BFees?: number,
    subscriptionB2CFees?: number,
    fixedPaymentBillingPeriod?: BillingPeriod,
    revenueFeesBillingPeriod?: BillingPeriod,
    selectedPlan?: PaymentPlanType,
    created?: Date,
    updated?: Date,
}

export enum BillingPeriod {
    Month = 0,
    Year = 1
}
export enum PaymentPlanType {
    Trial = 0,
    Fixed = 1,
    RevenueFees = 2
}

