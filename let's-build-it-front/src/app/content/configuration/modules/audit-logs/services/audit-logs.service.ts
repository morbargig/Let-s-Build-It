import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { LazyLoadEvent } from '../../../../../@ideo/components/table/events/lazy-load.event';
import { IPagedList } from '../../../../../@shared/models/paged-list.response';
import { QueryBuilderService } from '../../../../../@ideo/infrastructure/services/query-builder.service';
import { AuditLogModel } from '../models/audiit-log';
import { BaseHttpService } from '@app/@core/base/base-http-service';

@Injectable({
  providedIn: 'root',
})
export class AuditLogsService extends BaseHttpService<AuditLogModel>{
  public collationName: string = 'AuditLogs'
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder)
  }

  // public getAll(evt: LazyLoadEvent): Observable<IPagedList<AuditLogModel>> {
  //   const url = this.queryBuilder.query(`${environment.serverUrl}/api/AuditLogs`, evt);
  //   // const filter = "";
  //   //'?filter[0].Key=2500&filter[0].Value.Key=Roles&filter[0].Value.Value=[{"key":  "Role.Name", "value": [{ "key": 2000, "value": "Admin" }] }]';
  //   // const filter = '?filter[0].Key=2250&filter[0].Value.Key=UserName&filter[0].Value.Value=yehonatan@ideo-digital.com'
  //   return this.http.get<IPagedList<AuditLogModel>>(url);
  // }

  public getEntityTypes(evt: LazyLoadEvent): Observable<IPagedList<string>> {
    const url = this.queryBuilder.query(`${this.apiUrl}/EntityTypes`, evt);
    return this.http.get<IPagedList<string>>(url);
  }
}
