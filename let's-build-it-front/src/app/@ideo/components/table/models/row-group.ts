import { SelectItem } from './select-item';
export interface TableRowGroup {
    field: string;
    title?: string;
    parsedTitle?: (item: any) => string;
    actions?: SelectItem[];
}