export interface User {
    _id?: number,
    email: string,
    pass: string,
    role?: string[],
    date?: Date,
}