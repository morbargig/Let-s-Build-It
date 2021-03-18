export interface MediaItemModel {
    id?: number;
    size?: number;
    name: string;
    extension: string;
    created?: Date;
    content: string;
    url: string;
    thumbnailUrl: string;
}