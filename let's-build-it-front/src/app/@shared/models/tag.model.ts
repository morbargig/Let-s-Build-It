import { TagType } from '../interfaces/tag-type.enum';

export interface TagModel {
  id?: number;
  key: string;
  value: string;
  Type: TagType;
  creationUser: string;
  externalId: number;
  createDate: Date;
  updateDate: Date;
}
