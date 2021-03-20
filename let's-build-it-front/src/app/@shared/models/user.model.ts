export class UserModel {
  public id?: number;
  public userName: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public isActive: boolean;
  public isLicenceVerified: boolean;
  public roles: string[];
  // public role: string;
  public lastSeen: Date;
  public created: Date;
  public profileImageId?: number;
  public teudatZehut?: number;
  public phone?: number;
  public selectedSubscriptionId?: number;
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
