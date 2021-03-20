import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '../../../../../../@ideo/infrastructure/services/query-builder.service';
import { RoleModel } from '../../../../../../@shared/models/role.model';
import { BaseHttpService } from '@app/@core/base/base-http-service';

@Injectable({
  providedIn: 'root',
})
export class RolesService extends BaseHttpService<RoleModel> {
  public collationName: string = 'Security/Roles';
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }
  public bulk: any = null;
}
