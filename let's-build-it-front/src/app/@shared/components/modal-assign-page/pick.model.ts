import { IdeoIconModel } from '../../models/ideo-icon.model';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

export interface PickModel {
    id?: number,
    img?: number;
    title?: string;
    detailsArr?: { text: string | number, icon: keyof IdeoIconModel | IconDefinition }[];
    active?: boolean;
}