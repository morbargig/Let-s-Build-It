import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform<T, K>(values: T[], filters: { [key: string]: K }): any[] {
    if (!filters && filters == {}) {
      return values;
    }


    const properties = Object.keys(filters);
    const result =
      !!values?.length && !!properties?.length ?
        (
          values.filter((x) => !!properties.find((property) =>
            !!filters[property] ? x[property] === filters[property] ||
              (
                Array.isArray(filters[property]) ?
                  ((filters[property] as any).indexOf(property.split('.').reduce((a, v) => !!a ? a[v] : null, x)) >= 0) :
                  (property.split('.').reduce((a, v) => a[v], x) === filters[property])
              ) :
              !x[property]))
        )
        : values;
    return result;
  }
}
