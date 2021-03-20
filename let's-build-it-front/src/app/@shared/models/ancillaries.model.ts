import { MediaItemModel } from './media-item.model';
export interface AncillaryModel {
  id?: number;
  ancillaryGroupId: number;
  ancillaryGroupName: string;
  title: string;
  description: string;
  price: number;
  documents?: MediaItemModel[] | FileList;
  created?: Date;
  updated?: Date;
}

export interface AncillaryGroupModel {
  id?: number;
  name: string;
  partnerId: number;
  created?: Date;
  updated?: Date;
}
