export interface LoginContext {
    employId: number;
    pass: string;
    remember?: boolean;
}
export interface RegisterContext {
    employId: number;
    pass: string;
    firstName: string;
    lastName: string;
    class: string;
    job: string;
    email: string;
    phone: number;
}
export interface AuthorizationEntity {
    employId: number;
    email: string;
    firstName: string;
    lastName: string;
    authorized: boolean;
    expiresIn: Date | string;
    accessToken: string;
    admin?: boolean;
    newUser?: boolean;
}