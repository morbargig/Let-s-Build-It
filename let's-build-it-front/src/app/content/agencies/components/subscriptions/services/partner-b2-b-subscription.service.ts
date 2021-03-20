import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '../../../../../@ideo/infrastructure/services/query-builder.service';
import { PartnerB2BSubscriptionModel } from '../../../../../@shared/models/partner-b2b-subscription.model';
import { BaseParentHttpService } from '@app/@core/base/base-parent-http-service';

@Injectable({
  providedIn: 'root',
})
export class PartnerB2BSubscriptionService extends BaseParentHttpService<number, PartnerB2BSubscriptionModel> {
  public collationName: string = 'B2B/Subscriptions';
  public parentRoute: string = 'Partners';
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }
}
