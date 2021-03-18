import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '../../../../@ideo/infrastructure/services/query-builder.service';
import { UserManagementModel } from '../../../../@shared/models/user-management.model';
import { BaseParentHttpService } from '@app/@core/base/base-parent-http-service';

@Injectable({
  providedIn: 'root'
})
export class UserManamenntService extends BaseParentHttpService<number, UserManagementModel> {
  public collationName: string =  'Users'
  public parentRoute: string = 'Partners';
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder)
  }
  public bulk: any = null;
}
