import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseParentHttpService } from '@app/@core/base/base-parent-http-service';
import { PartnerZone } from '@app/@shared/models/partner-zone.model';
import { QueryBuilderService } from '../../../../@ideo/infrastructure/services/query-builder.service';

@Injectable({
  providedIn: 'root',
})
export class PartnerZonesService extends BaseParentHttpService<number, PartnerZone> {
  public collationName: string = 'Zones';
  public parentRoute: string = 'Partners';
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }
  public bulk: any = null;
}
