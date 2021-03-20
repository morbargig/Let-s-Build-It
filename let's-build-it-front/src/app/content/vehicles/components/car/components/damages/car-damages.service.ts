import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '../../../../../../@ideo/infrastructure/services/query-builder.service';
import { environment } from '../../../../../../../environments/environment';
import { CarDamageModel } from '../../../../../../@shared/models/car-damage.model';
import { BaseParentHttpService } from '@app/@core/base/base-parent-http-service';
import { CarDamageGeneralInfoModel } from '../../../../../../@shared/models/car-damage-general-info.model';
import { Observable } from 'rxjs';
import { ErrorMessages } from '@app/@shared/models/error-messages.model';

@Injectable({
  providedIn: 'root',
})
export class CarDamagesService extends BaseParentHttpService<number, CarDamageModel> {
  public collationName: string = 'Damages';
  public parentRoute: string = 'Cars';
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }

  public bulk: any = null;

  public deleteDamageMedia(carId: number, damageId: number, mediaId: number) {
    return this.http.delete(`${this.apiUrl(carId)}/${damageId}/MediaItems/${mediaId}`);
  }

  public updateGeneralInfo(
    carId: number,
    damageId: number,
    model: CarDamageGeneralInfoModel,
    messages?: ErrorMessages,
    entityName?: string
  ): Observable<CarDamageGeneralInfoModel> {
    return this.http.patch<CarDamageGeneralInfoModel>(
      `${this.apiUrl(carId)}/${damageId}`,
      model,
      this.getOptions(messages, entityName)
    );
  }
}
