export interface PartnerMediaModel {
  partnerId?: number;
  mediaId: number;
  documentType?: PartnerDocumentType;
  created?: number;
  updated?: number;
}

export enum PartnerDocumentType {
  Contract,
  Disclaimer,
  Legal,
}
