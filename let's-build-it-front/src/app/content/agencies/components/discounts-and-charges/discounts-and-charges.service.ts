import { Injectable } from '@angular/core';
import { BaseParentHttpService } from '../../../../@core/base/base-parent-http-service';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '../../../../@ideo/infrastructure/services/query-builder.service';
import {
  FixedDiscountsModel,
  ChargesModel,
  DiscountsModel,
} from '../../../../@shared/models/discounts-and-charges.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ErrorMessages } from '../../../../@shared/models/error-messages.model';

@Injectable({
  providedIn: 'root',
})
export class DiscountsAndChargesService extends BaseParentHttpService<number, DiscountsModel> {
  public collationName: string = `Discounts`;
  public parentRoute: string = `Partners`;
  public newApiUrl(parentId: number, subCollationName: string) {
    return `${environment.serverUrl}/api/${this.parentRoute}/${parentId}/${subCollationName}`;
  }
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }

  public getCharges(
    parentId: number,
    messages: ErrorMessages = null,
    entityName: string = null
  ): Observable<ChargesModel> {
    return this.http.get<ChargesModel>(`${this.newApiUrl(parentId, 'Charges')}`, this.getOptions(messages, entityName));
  }
  public updateCharges(
    parentId: number,
    model: ChargesModel,
    messages: ErrorMessages = null,
    entityName: string = null
  ): Observable<ChargesModel> {
    return this.http.post<ChargesModel>(
      `${this.newApiUrl(parentId, 'Charges')}`,
      model,
      this.getOptions(messages, entityName)
    );
  }

  // public deleteCharges(parentId: number, id: number) {
  //   return this.http.delete(`${this.newApiUrl(parentId, 'Charges')}/${id}`,);
  // }

  public getFixedDiscounts(
    parentId: number,
    messages: ErrorMessages = null,
    entityName: string = null
  ): Observable<FixedDiscountsModel> {
    return this.http.get<FixedDiscountsModel>(
      `${this.newApiUrl(parentId, 'FixedDiscounts')}`,
      this.getOptions(messages, entityName)
    );
  }
  public updateFixedDiscounts(
    parentId: number,
    model: FixedDiscountsModel,
    messages: ErrorMessages = null,
    entityName: string = null
  ): Observable<FixedDiscountsModel> {
    return this.http.post<FixedDiscountsModel>(
      `${this.newApiUrl(parentId, 'FixedDiscounts')}`,
      model,
      this.getOptions(messages, entityName)
    );
  }

  public deleteDiscounts(
    parentId: number,
    modelsArr: number[],
    messages: ErrorMessages = null,
    entityName: string = null
  ) {
    let option = this.getOptions(messages, entityName) as any;
    option.body = modelsArr;
    return this.http.request<FixedDiscountsModel>('delete', this.newApiUrl(parentId, 'Discounts'), option);
  }

  // public deleteFixedDiscounts(parentId: number, id: number) {
  //   return this.http.delete(`${ this.newApiUrl(parentId, 'FixedDiscounts') } /${id}`,);
  // }
}
