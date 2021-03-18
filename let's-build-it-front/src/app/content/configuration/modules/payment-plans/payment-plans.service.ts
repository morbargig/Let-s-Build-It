import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '../../../../@ideo/infrastructure/services/query-builder.service';
import { PaymentPlanModel } from '../../../../@shared/models/payment-plan.model';
import { BaseHttpService } from '@app/@core/base/base-http-service';

@Injectable({
  providedIn: 'root'
})
export class PaymentPlansService extends BaseHttpService<PaymentPlanModel>{
  public collationName: string =  `PaymentPlans`
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder)
  }
}
