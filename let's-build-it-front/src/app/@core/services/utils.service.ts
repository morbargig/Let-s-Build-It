import { Injectable } from '@angular/core';
import { EnumType } from 'typescript';
import { SelectItem } from '../../@ideo/components/table/models/select-item';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  public groupBy<T, K extends keyof any>(list: T[], getKey: (item: T) => K) {
    return list.reduce((previous, currentItem) => {
      const group = getKey(currentItem);
      if (!previous[group]) previous[group] = [];
      previous[group].push(currentItem);
      return previous;
    }, {} as Record<K, T[]>);
  }

  public toSelectItem(type: any): SelectItem[] {
    return Object.keys(type)
      .filter((value) => isNaN(Number(value)) === false)
      .map((k) => {
        return {
          label: type[k],
          value: parseInt(k),
        } as SelectItem;
      });
  }
}
