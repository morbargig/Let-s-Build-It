import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseParentHttpService } from '@app/@core/base/base-parent-http-service';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { QueryBuilderService } from '../../../../../@ideo/infrastructure/services/query-builder.service';
import { PartnerB2CSubscriptionModel } from '../../../../../@shared/models/partner-b2c-subscription.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerB2CSubscriptionService extends BaseParentHttpService<number, PartnerB2CSubscriptionModel> {
  public collationName: string =  'B2C/Subscriptions'
  public parentRoute: string = 'Partners';
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder)
  }
  public updateStatus(partnerId: number, id: number, model: any): Observable<PartnerB2CSubscriptionModel> {
    return this.http.patch<PartnerB2CSubscriptionModel>(`${environment.serverUrl}/api/Partners/${partnerId}/B2C/Subscriptions/${id}`, model);
  }
  public deleteAndMove(partnerId: number, id: number, toSubscriptionId?: number) {
    return this.http.delete(`${environment.serverUrl}/api/Partners/${partnerId}/B2C/Subscriptions/${id}/Move/${toSubscriptionId}`)
  }
}
