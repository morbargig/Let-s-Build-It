export interface ModalMessage {
    mode: 'Edit' | 'Create' | 'Not Found' | 'Assign',
    title: string,
    subTitle?: string,
    message?: string,
    closeUrl?: string,
    submitMessage?: string,
    cancelMessage?: string,
}