export interface AuthenticationResponseModel {
  employId: number;
  avatarId?: number;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  refreshToken?: string;
  validFrom?: Date;
  validTo?: Date;
  roles: string[];
  partnerId?: number;
  partnerFleetIds?: number[];
}
