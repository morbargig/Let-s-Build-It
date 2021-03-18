import { SelectItem } from './@ideo/components/table/models/select-item';
import { DynamicFormControl } from './@forms/@core/interfaces/dynamic-form-control';
declare global {
    interface Array<T = DynamicFormControl> {
        toSelectItem(filter?: (o: T) => boolean): SelectItem[];
        patchValue<E>(object: E): void
    }

    interface Date {
        toFormDateString(): string
    }

}

export function asSelectItem(obj: any, ...filter: string[]): SelectItem[] {
    const keys = Object.keys(obj);
    const isEnum = keys?.filter(x => x == obj[obj[x]])?.length == keys.length;
    let selectedKeys: string[] = null;
    if (!!isEnum) {
        selectedKeys = keys.slice(keys.length / 2).filter(x => !!filter?.length ? filter.indexOf(x) >= 0 : true);
    } else {
        selectedKeys = keys.filter(x => !!filter?.length ? filter.indexOf(x) >= 0 : true);
    }

    return selectedKeys?.map(key => {
        return {
            label: key,
            value: obj[key]
        } as SelectItem
    });
}

if (!Array.prototype.toSelectItem) {
    Array.prototype.toSelectItem = function (filter?: (o: DynamicFormControl) => boolean): Array<SelectItem> {
        return this.filter((x: DynamicFormControl) => x?.config?.type != 'hidden' && (!filter ? true : filter(x))).map((x: DynamicFormControl) => {
            return {
                label: x.config.label,
                value: x.config.value
            } as SelectItem
        });
    }
}

if (!Array.prototype.patchValue) {
    Array.prototype.patchValue = function <E>(object: E): void {
        const arr = this as DynamicFormControl[];
        if (!!arr?.length) {
            Object.keys(object).forEach((key: string) => {
                const item = arr.find(x => x.config.name == key);
                if (!!item?.config) {
                    item.config.value = object[key];
                }
            });
        }
    }
}

if (!Date.prototype.toFormDateString) {
    Date.prototype.toFormDateString = function (): string {
        return `${this.getFullYear()}-${(this.getMonth() + 1 + '').padStart(2, '0')}-${(this.getDate() + '').padStart(2, '0')}`;
    }
}