import { Injectable } from '@angular/core';
import { LazyLoadEvent } from '../../../@ideo/components/table/events/lazy-load.event';
import { IPagedList } from '../../../@shared/models/paged-list.response';
import { environment } from '../../../../environments/environment';
import { CarModel } from '../../../@shared/models/car.model';
import { ActionType } from '@app/@shared/interfaces/action-type.enum';
import { CarActionLogModel } from '../../../@shared/models/car-action-log.model';

import { BaseHttpService } from '@app/@core/base/base-http-service';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '@app/@ideo/infrastructure/services/query-builder.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarsService extends BaseHttpService<CarModel> {
  public collationName: string = 'cars';
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }

  public deleteCarMedia(id: number, mediaId: number) {
    return this.http.delete(`${this.apiUrl}/${id}/MediaItems/${mediaId}`);
  }
  public getActionLog(carId: number, actionLogId: number) {
    return this.http.get(`${this.apiUrl}/${carId}/Actions/${actionLogId}`);
  }

  public getAllActionsLog(carId: number, evt: LazyLoadEvent) {
    const url = this.queryBuilder.query(`${this.apiUrl}/${carId}/Actions`, evt);
    return this.http.get<IPagedList<CarActionLogModel>>(url);
  }

  public SendAction(carId: number, action: ActionType) {
    return this.http.get(`${this.apiUrl}/${carId}/Actions/Send?action=${action}`);
  }

  public updateGeneralSettings(id: number, model: any): Observable<{ kmAtInitiate: number }> {
    return this.http.patch<{ kmAtInitiate: number }>(`${this.apiUrl}/${id}`, model);
  }

  public updateServiceSettings(id: number, model: any): Observable<{ serviceKmInterval: number }> {
    return this.http.patch<{ serviceKmInterval: number }>(`${this.apiUrl}/${id}/Service`, model);
  }
}
