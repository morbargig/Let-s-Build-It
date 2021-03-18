import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '../../../../../../@ideo/infrastructure/services/query-builder.service';
import { CarAccidentModel } from '../../../../../../@shared/models/car-accident.model';
import { environment } from '../../../../../../../environments/environment';
import { BaseParentHttpService } from '@app/@core/base/base-parent-http-service';

@Injectable({
  providedIn: 'root',
})
export class AccidentsService extends BaseParentHttpService<number, CarAccidentModel> {
  public collationName: string =  'accidents'
  public parentRoute: string = 'cars';
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder)
  }

  public bulk:any = null;

  public deleteAccidentMedia(carId: number, id: number, mediaId: number) {
    return this.http.delete(`${environment.serverUrl}/api/cars/${carId}/accidents/${id}/MediaItems/${mediaId}`);
  }
}
