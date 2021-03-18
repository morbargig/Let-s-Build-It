export interface PartnerFleetModel {
    id?: number;
    partnerId: number;
    name: string;
    referenceNumber: string;
    vatId: string;
    phone: string;
    email: string;
    address: string;
    status: boolean;
    logoImgId: number;
    created: Date;
    updated: Date;
}