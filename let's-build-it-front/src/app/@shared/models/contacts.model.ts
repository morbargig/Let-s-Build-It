export class ContactsModel {
  partnerId: number;
  userId: number;
  position: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  created?: Date;
  updated?: Date;
  public get fullName(): string {
    return `${this?.firstName} ${this?.lastName}`;
  }
}
