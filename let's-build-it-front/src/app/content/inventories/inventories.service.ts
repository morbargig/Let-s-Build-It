import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '../../@ideo/infrastructure/services/query-builder.service';
import { FilterObject, LazyLoadEvent } from '../../@ideo/components/table/events/lazy-load.event';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InventoryModel } from '../../@shared/models/inventory.model';
import { MAX_INT } from '../../@ideo/components/table/table.component';
import { BaseHttpService } from '@app/@core/base/base-http-service';

@Injectable({
  providedIn: 'root',
})
export class InventoriesService extends BaseHttpService<InventoryModel> {
  public collationName: string = 'inventories';
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }

  public count(filters?: FilterObject): Observable<{ [type: number]: number }> {
    let evt = {
      filters: filters,
      page: 1,
      pageSize: MAX_INT,
    } as LazyLoadEvent;
    const url = this.queryBuilder.query(`${environment.serverUrl}/api/inventories/Count`, evt);
    return this.http.get<{ [type: number]: number }>(url);
  }
}
