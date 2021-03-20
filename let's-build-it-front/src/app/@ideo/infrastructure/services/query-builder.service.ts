import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilterObject, LazyLoadEvent } from '../../components/table/events/lazy-load.event';
import { StringHelperService } from './string-helper.service';

@Injectable({
  providedIn: 'root',
})
export class QueryBuilderService {
  constructor(private stringHelper: StringHelperService, private http: HttpClient) {}

  public query(url: string, evt: LazyLoadEvent, params: any = null): string {
    let newEvt = {};
    Object.keys(evt?.filters || {}).forEach(function (key) {
      newEvt[key.charAt(0).toUpperCase() + key.slice(1)] = evt.filters[key];
    });
    evt.filters = newEvt;
    let isExport = !!evt && !!evt.exportType;
    let isAll = !!evt && evt.exportType == 'All';
    let queryParamsUrl = !!evt ? `?${this.getQueryParams(evt)}` : '';
    // let exportUrl = !!isExport ? `${((queryParamsUrl?.indexOf('?') >= 0 || false ? '&' : '?') + 'export=' + evt.exportType)}` +
    //   `${!!isAll ? `&all=true` : ''}` : '';
    let urlWithParams = `${url}${queryParamsUrl}`;
    if (!isExport) {
      return urlWithParams;
    } else {
      this.http
        .get<Blob>(urlWithParams, { params: { export: evt.exportType } })
        .subscribe();
    }
  }

  public getQueryParams(evt: LazyLoadEvent, filterObjName: string = 'filter'): string {
    let params = '';
    if (evt.page != null && evt.page >= 0) {
      params = this.appendParam(params, 'page', evt.page - 1);
    }
    if (evt.pageSize) {
      params = this.appendParam(params, 'take', evt.pageSize);
    }
    if (evt.searchTerm) {
      params = this.appendParam(params, 'search', evt.searchTerm);
    }
    if (!!evt.sorts?.length) {
      let keys = Object.keys(evt.sorts);
      for (let i = 0; i < evt.sorts.length; i++) {
        const sort = evt.sorts[i];
        params = this.appendParam(params, `sort[${i}].Key`, this.stringHelper.toPascal(sort));
        params = this.appendParam(params, `sort[${i}].Value`, evt.sortDirection == 'asc' ? 1 : -1);
      }
    } else if (evt.sortColumn && evt.sortDirection) {
      params = this.appendParam(params, `sort[0].Key`, this.stringHelper.toPascal(evt.sortColumn));
      params = this.appendParam(params, `sort[0].Value`, evt.sortDirection == 'asc' ? 1 : -1);
    }

    if (evt.filters) {
      params = this.appendFilters(params, evt.filters, filterObjName);
    }

    if (evt.selection) {
      params = this.appendArray(params, 'selection', evt.selection);
    }
    return params;
  }

  private appendFilter(
    params: string,
    i: number,
    key: string,
    value: any,
    matchMode: any,
    filterObjName: string
  ): string {
    params = this.appendParam(params, `${filterObjName}[${i}].Operator`, matchMode || 2250);
    params = this.appendParam(params, `${filterObjName}[${i}].Field`, this.stringHelper.toPascal(key));
    if (!!Array.isArray(value)) {
      // params = this.appendParam(params, `${filterObjName}[${i}].Value.Value`, `[${value}]`);
      params = this.appendParam(params, `${filterObjName}[${i}].Value`, JSON.stringify(value));
    } else {
      params = this.appendParam(params, `${filterObjName}[${i}].Value`, value);
    }
    return params;
  }

  // private appendFilter(params: string, i: number, key: string, value: any, matchMode: any, filterObjName: string): string {
  //   params = this.appendParam(params, `${filterObjName}[${i}].Key`, matchMode || 2250);
  //   params = this.appendParam(params, `${filterObjName}[${i}].Value.Key`, this.stringHelper.toPascal(key));
  //   if (!!Array.isArray(value)) {
  //     // params = this.appendParam(params, `${filterObjName}[${i}].Value.Value`, `[${value}]`);
  //     params = this.appendParam(params, `${filterObjName}[${i}].Value.Value`, JSON.stringify(value));
  //   } else {
  //     params = this.appendParam(params, `${filterObjName}[${i}].Value.Value`, value + '');
  //   }
  //   return params;
  // }

  private appendFilters(params: string, filters: FilterObject, filterObjName: string): string {
    let filterIndex = 0;
    let filterKeys = Object.keys(filters);
    for (let i = 0; i < filterKeys.length; i++) {
      const filterKey = filterKeys[i];

      if (this.validVal(filters[filterKey].value)) {
        params = filters[filterKey].regularParam
          ? this.appendParam(params, filterKey, filters[filterKey].value)
          : this.appendFilter(
              params,
              filterIndex++,
              filterKey,
              filters[filterKey].value,
              filters[filterKey].matchMode,
              filterObjName
            );
      } else if (filters[filterKey].innerFilter) {
        let innerKeys = Object.keys(filters[filterKey]);
        for (let i = 0; i < innerKeys.length; i++) {
          const innerKey = innerKeys[i];
          if (
            !!filters[filterKey][innerKey] &&
            typeof filters[filterKey][innerKey] == 'object' &&
            this.validVal(filters[filterKey][innerKey].value)
          ) {
            params = this.appendInnerFilter(
              params,
              filterIndex++,
              innerKey,
              filters[filterKey][innerKey].value,
              filterKey,
              filters[filterKey].value,
              filters[filterKey][innerKey].matchMode,
              filterObjName
            );
          }
        }
      }
    }
    return params;
  }

  private appendInnerFilter(
    params: string,
    i: number,
    innerKey: string,
    innerValue: any,
    key: string,
    value: any,
    matchMode: any,
    filterObjName: string
  ): string {
    params = this.appendParam(params, `${filterObjName}[${i}].Operator`, 2500);
    params = this.appendParam(params, `${filterObjName}[${i}].Field`, this.stringHelper.toPascal(key));
    params = this.appendParam(params, `${filterObjName}[${i}].ValueFilter.Field`, innerKey);
    params = this.appendParam(params, `${filterObjName}[${i}].ValueFilter.Operator`, matchMode);
    if (!!Array.isArray(innerValue || value)) {
      params = this.appendParam(
        params,
        `${filterObjName}[${i}].ValueFilter.Value`,
        JSON.stringify(innerValue || value)
      );
    } else {
      params = this.appendParam(
        params,
        `${filterObjName}[${i}].ValueFilter.Value`,
        this.validVal(innerValue) ? innerValue : value
      );
    }
    return params;
  }

  // private appendInnerFilter(params: string, i: number, innerKey: string, innerValue: any, key: string, value: any, matchMode: any, filterObjName: string): string {
  //   params = this.appendParam(params, `${filterObjName}[${i}].Key`, 2500);
  //   params = this.appendParam(params, `${filterObjName}[${i}].Value.Key`, this.stringHelper.toPascal(key));
  //   if (!!Array.isArray(value)) {
  //     for (let j = 0; j < value.length; j++) {
  //       const element = value[j];
  //       params = this.appendParam(params, `${filterObjName}[${i}].Value.Value`, element + '');
  //     }
  //   } else {
  //     params = this.appendParam(params, `${filterObjName}[${i}].Value.Value`, JSON.stringify([{
  //       key: innerKey,
  //       value: [{
  //         key: matchMode,
  //         value: this.validVal(innerValue) ? innerValue : value
  //       }]
  //     }]));
  //   }
  //   return params;
  // }

  private validVal = (val: any) =>
    (!!Array.isArray(val) && val.length) || (!Array.isArray(val) && !!val) || val === 0 || val === false;

  private appendParam(current: string, param: string, value: any): string {
    return `${!!current ? `${current}&` : ''}${param}=${value}`;
  }

  private appendArray(current: string, param: string, value: any[]) {
    let arrayParam = value.reduce(
      (acc, x, i) => (acc = acc.concat(`${param}=${x}${value.length - 1 > i ? '&' : ''}`)),
      ''
    );
    return `${!!current ? `${current}&` : ''}${arrayParam}`;
  }
}
