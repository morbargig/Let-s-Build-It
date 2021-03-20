import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseParentHttpService } from '@app/@core/base/base-parent-http-service';
import { QueryBuilderService } from '@app/@ideo/infrastructure/services/query-builder.service';
import { PartnerFleetModel } from '@app/@shared/models/partner-fleet.model';

@Injectable({
  providedIn: 'root',
})
export class FleetsService extends BaseParentHttpService<number, PartnerFleetModel> {
  public parentRoute: string = 'Partners';
  public collationName: string = 'Fleets';

  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }
}
