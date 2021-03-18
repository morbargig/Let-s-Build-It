import { BreadcrumType } from '../../../blocks/navigations/breadcrum/breadcrum.component';
export interface ISideBarService<T = any> {
  breadcrumbs: BreadcrumType[];
  entity: T;
  setEntity(val: T): void;
  setDetailsVisibility(val: boolean): void;
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SideBarPageService implements ISideBarService<any> {
  public breadcrumbs: BreadcrumType[] = [];
  public entity: any = null;
  public detailsVisible: any;
  setEntity(val: any): void {
    this.entity = val;
  }
  setDetailsVisibility(val: boolean): void {
    this.detailsVisible = val;
  }
}
