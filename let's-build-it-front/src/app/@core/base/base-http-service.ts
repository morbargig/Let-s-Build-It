import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { QueryBuilderService } from '../../@ideo/infrastructure/services/query-builder.service';
import { LazyLoadEvent } from '../../@ideo/components/table/events/lazy-load.event';
import { Observable } from 'rxjs';
import { IPagedList } from '../../@shared/models/paged-list.response';
import { ErrorMessages } from '../../@shared/models/error-messages.model';
export abstract class BaseHttpService<T> {
  model: T;
  public abstract collationName: string;
  protected get apiUrl() {
    return `${environment.serverUrl}/api/${this.collationName}`;
  }
  public getOptions(messages?: ErrorMessages, entityName?: string) {
    return !!messages || !!entityName
      ? {
          params: {
            autoNotification: 'true',
            entity: entityName,
            ...messages,
          },
        }
      : {};
  }
  constructor(protected http: HttpClient, protected queryBuilder: QueryBuilderService) {}

  public getAll(evt: LazyLoadEvent, entityName?: string, handelMessages?: ErrorMessages): Observable<IPagedList<T>> {
    const url = this.queryBuilder.query(`${this.apiUrl}`, evt);
    return this.http.get<IPagedList<T>>(url, this.getOptions(handelMessages, entityName));
  }
  public get(id: number, entityName?: string, handelMessages?: ErrorMessages): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`, this.getOptions(handelMessages, entityName));
  }
  public update(id: number, model: T, entityName?: string, handelMessages?: ErrorMessages): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, model, this.getOptions(handelMessages, entityName));
  }
  public create(model: any, entityName?: string, handelMessages?: ErrorMessages): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}`, model, this.getOptions(handelMessages, entityName));
  }
  public bulk(model: T[], entityName?: string, handelMessages?: ErrorMessages): Observable<T[]> {
    return this.http.post<T[]>(`${this.apiUrl}/bulk`, model, this.getOptions(handelMessages, entityName));
  }

  public delete(id: number, entityName?: string, handelMessages?: ErrorMessages) {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getOptions(handelMessages, entityName));
  }
}
