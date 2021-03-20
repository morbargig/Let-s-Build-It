import { Injectable } from '@angular/core';
import { BaseParentHttpService } from '../../../../@core/base/base-parent-http-service';
import { AncillaryGroupModel } from '../../../../@shared/models/ancillaries.model';
import { QueryBuilderService } from '../../../../@ideo/infrastructure/services/query-builder.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AncillariesGroupService extends BaseParentHttpService<number, AncillaryGroupModel> {
  public collationName: string = `Ancillaries/Groups`;
  public parentRoute: string = `Partners`;
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }
}
