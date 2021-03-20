import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../../@core/base/base-http-service';
import { PagedResponse } from '../../@ideo/components/table/models/paged-response';
import { QueryBuilderService } from '../../@ideo/infrastructure/services/query-builder.service';
import { VehicleModelSearchModel } from '../models/vehicle-model-search.model';
import { VehicleModelModel } from '../models/vehicle-model.model';

@Injectable({
  providedIn: 'root',
})
export class VehiclesService extends BaseHttpService<VehicleModelModel> {
  public collationName: string = `Vehicles`;

  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }

  public search(query: string, page: number = 0, take: number = 5): Observable<PagedResponse<VehicleModelSearchModel>> {
    return this.http.get<PagedResponse<VehicleModelSearchModel>>(
      `${this.apiUrl}/Search?page=${page}&take=${take}&query=${query}`
    );
  }
}
