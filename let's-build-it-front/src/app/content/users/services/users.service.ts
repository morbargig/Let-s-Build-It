import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../../../@shared/models/user.model';
import { environment } from '../../../../environments/environment';
import { QueryBuilderService } from '../../../@ideo/infrastructure/services/query-builder.service';
import { BaseHttpService } from '@app/@core/base/base-http-service';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseHttpService<UserModel>{
  public collationName: string = 'Users'
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder)
  }
  public createCustomer(model: any): Observable<UserModel> {
    return this.http.post<UserModel>(`${environment.serverUrl}/api/Users/Customer`, model);
  }
  // way not use it build in the base api because the Customer ?
  // public create(model: any, entityName?: string, handelMessages?: ErrorMessages): Observable<T> {
  //    return this.http.post<T>(`${this.apiUrl}`, model, this.getOptions(handelMessages, entityName));
  // }
}
