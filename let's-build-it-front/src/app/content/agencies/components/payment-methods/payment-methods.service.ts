import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '../../../../@ideo/infrastructure/services/query-builder.service';
import { BankAccountModel } from '../../../../@shared/models/payment-methods.model';
import { BaseParentHttpService } from '../../../../@core/base/base-parent-http-service'

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodsService extends BaseParentHttpService<number, BankAccountModel> {
  public collationName: string =  'BankAccounts'
  public parentRoute: string = 'Partners';
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder)
  }
  public get:any = null;
  public create:any = null;
  public bulk:any = null;
  public delete:any = null;


}
