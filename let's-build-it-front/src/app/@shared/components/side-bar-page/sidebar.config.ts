import { SelectItem } from '../../../@ideo/components/table/models/select-item';
import { BreadcrumType } from '@app/blocks/navigations/breadcrum/breadcrum.component';
import { Observable } from 'rxjs';
import { EntityDetailsModel } from './entity-details/entity-details.component';
import { Params } from '@angular/router';
export interface SideBarConfig<T = any> {
  sidebarItems: SelectItem[];
  backLink: SelectItem;
  breadcrumbs: BreadcrumType[];
  getEntityById: (id: any, params?: Params) => Observable<T>;
  getEntityDetails?: (entity: any) => EntityDetailsModel;
}
