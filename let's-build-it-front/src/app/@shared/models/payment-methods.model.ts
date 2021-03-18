export interface BankAccountModel {
    id?: number,
    bankName: string,
    bankNumber: string,
    branchName: string,
    branchNumber: string,
    accountNumber: string,
    isDefault: boolean,
    partnerId: number,
    created?: Date,
    updated?: Date,
}