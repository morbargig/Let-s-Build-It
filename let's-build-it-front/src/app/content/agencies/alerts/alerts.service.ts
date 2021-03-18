import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '../../../@ideo/infrastructure/services/query-builder.service';
import { AlertModel } from '../../../@shared/models/alert.model';
import { environment } from '../../../../environments/environment';
import { BaseHttpService } from '@app/@core/base/base-http-service';

@Injectable({
  providedIn: 'root',
})
export class AlertsService extends BaseHttpService<AlertModel>{
  public collationName: string = 'alerts'
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder)
  }
  
  public updateStatus(id: number, model: any) {
    return this.http.patch<AlertModel>(`${environment.serverUrl}/api/alerts/${id}`, model);
  }
}
