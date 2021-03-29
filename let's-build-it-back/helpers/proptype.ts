declare global {
    // interface Array<T = DynamicFormControl> {
    //     toSelectItem(filter?: (o: T) => boolean): SelectItem[];
    //     patchValue<E>(object: E): void;
    // }

    // interface Date {
    //     toFormDateString(): string;
    // }
}

export function asSelectItem(obj: any, ...filter: string[]): any[] {
    const keys = Object.keys(obj);
    const isEnum = keys?.filter((x) => x == obj[obj[x]])?.length == keys.length;
    let selectedKeys: string[] = null;
    debugger
    if (!!isEnum) {
        selectedKeys = keys.slice(keys.length / 2).filter((x) => (!!filter?.length ? filter.indexOf(x) >= 0 : true));
    } else {
        selectedKeys = keys.filter((x) => (!!filter?.length ? filter.indexOf(x) >= 0 : true));
    }

    return selectedKeys?.map((key) => {
        return {
            label: key,
            value: obj[key],
        } as any;
    });
}
