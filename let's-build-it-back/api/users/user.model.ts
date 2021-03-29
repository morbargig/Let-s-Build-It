import { RegisterContext } from '../auth/auth.model';
export interface User extends RegisterContext {
    role?: string[],
    _id?: number,
}