import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { QueryBuilderService } from '../../@ideo/infrastructure/services/query-builder.service';
import { LazyLoadEvent } from '../../@ideo/components/table/events/lazy-load.event';
import { Observable } from 'rxjs';
import { IPagedList } from '../../@shared/models/paged-list.response';
import { ErrorMessages } from '../../@shared/models/error-messages.model';
export abstract class BaseParentHttpService<TParentId, T> {

    public abstract collationName: string;
    public abstract parentRoute: string;
    public apiUrl(parentId: TParentId) {
        return `${environment.serverUrl}/api/${this.parentRoute}/${parentId}/${this.collationName}`;
    }
    public getOptions(messages: ErrorMessages, entityName: string) {
        return !!messages || !!entityName ? {
            params: {
                'autoNotification': 'true',
                'entity': entityName,
                ...messages
            }
        } : {}
    }
    constructor(protected http: HttpClient, protected queryBuilder: QueryBuilderService) { }

    public getAll(parentId: TParentId, evt: LazyLoadEvent, messages?: ErrorMessages, entityName?: string): Observable<IPagedList<T>> {
        const url = this.queryBuilder.query(`${this.apiUrl(parentId)}`, evt);
        return this.http.get<IPagedList<T>>(url, this.getOptions(messages, entityName));
    }
    public get(parentId: TParentId, id: number, messages?: ErrorMessages, entityName?: string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl(parentId)}/${id}`, this.getOptions(messages, entityName));
    }
    public update(parentId: TParentId, id: number, model: T, messages?: ErrorMessages, entityName?: string): Observable<T> {
        return this.http.put<T>(`${this.apiUrl(parentId)}/${id}`, model, this.getOptions(messages, entityName));
    }
    public create(parentId: TParentId, model: any, messages?: ErrorMessages, entityName?: string): Observable<T> {
        return this.http.post<T>(`${this.apiUrl(parentId)}`, model, this.getOptions(messages, entityName));
    }
    public bulk(parentId: TParentId, model: T[], messages?: ErrorMessages, entityName?: string): Observable<T[]> {
        return this.http.post<T[]>(`${this.apiUrl(parentId)}/bulk`, model, this.getOptions(messages, entityName));
    }
    public delete(parentId: TParentId, id: number, messages?: ErrorMessages, entityName?: string) {
        return this.http.delete(`${this.apiUrl(parentId)}/${id}`, this.getOptions(messages, entityName));
    }
}