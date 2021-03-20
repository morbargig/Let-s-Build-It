export interface LoginContext {
  employId: number;
  pass: string;
  remember?: boolean;
}

export interface RegisterContext {
  employId: number;
  firstName: string;
  lastName: string;
  class: string;
  job: string;
  email: string;
  pass: string;
  phone: number
}

export interface AuthorizationEntity {
  employId: number;
  authorized: boolean;
  email: string;
  fullName: string;
  expiresIn: Date | string;
  accessToken: string;
  admin?: boolean;
  newUser?: boolean;
}
