export interface AuthenticationResponseModel {
  username: string;
  userId: number;
  avatarId?: number;
  firstName: string;
  lastName: string;
  token: string;
  refreshToken: string;
  validFrom: Date;
  validTo: Date;
  roles: string[];
  partnerId?: number;
  partnerFleetIds?: number[];
}
