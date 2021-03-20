import { Injectable } from '@angular/core';
import { BaseParentHttpService } from '../../../../@core/base/base-parent-http-service';
import { QueryBuilderService } from '../../../../@ideo/infrastructure/services/query-builder.service';
import { HttpClient } from '@angular/common/http';
import { PartnerPriceModel } from '../../../../@shared/models/partner-price.model';

@Injectable({
  providedIn: 'root',
})
export class PricesService extends BaseParentHttpService<number, PartnerPriceModel> {
  public collationName: string = `Prices`;
  public parentRoute: string = `Partners`;
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }
}
