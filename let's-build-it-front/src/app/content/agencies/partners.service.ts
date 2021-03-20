import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '../../@ideo/infrastructure/services/query-builder.service';
import { PartnerModel } from '../../@shared/models/partner.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorMessages } from '../../@shared/models/error-messages.model';
import { BaseHttpService } from '@app/@core/base/base-http-service';

@Injectable({
  providedIn: 'root',
})
export class PartnersService extends BaseHttpService<PartnerModel> {
  public collationName: string = 'partners';
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }

  public updateGeneralDetails(id: number, model: any): Observable<PartnerModel> {
    return this.http.patch<PartnerModel>(`${environment.serverUrl}/api/partners/${id}`, model);
  }

  public updateAccountDetails(id: number, model: any): Observable<PartnerModel> {
    return this.http.patch<PartnerModel>(`${environment.serverUrl}/api/partners/${id}/account`, model);
  }

  public updateBillingDetails(id: number, model: any): Observable<PartnerModel> {
    return this.http.patch<PartnerModel>(`${environment.serverUrl}/api/partners/${id}/Billing`, model);
  }

  public updateContactPersonDetails(id: number, model: any): Observable<PartnerModel> {
    return this.http.patch<PartnerModel>(`${environment.serverUrl}/api/partners/${id}/Contact`, model);
  }

  public updatePaymentPlan(
    id: number,
    paymentPlanId: number,
    messages: ErrorMessages,
    entity?: string
  ): Observable<PartnerModel> {
    let options = messages
      ? {
          params: {
            autoNotification: 'true',
            entity: entity,
            ...messages,
          },
        }
      : null;
    return this.http.patch<PartnerModel>(
      `${environment.serverUrl}/api/partners/${id}/PaymentPlan/${paymentPlanId}`,
      options
    );
  }
}
