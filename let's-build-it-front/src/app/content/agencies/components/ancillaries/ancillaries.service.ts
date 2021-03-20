import { Injectable } from '@angular/core';
import { AncillaryModel } from '../../../../@shared/models/ancillaries.model';
import { QueryBuilderService } from '../../../../@ideo/infrastructure/services/query-builder.service';
import { HttpClient } from '@angular/common/http';
import { BaseParentHttpService } from '../../../../@core/base/base-parent-http-service';

@Injectable({
  providedIn: 'root',
})
export class AncillariesService extends BaseParentHttpService<number, AncillaryModel> {
  public collationName: string = `Ancillaries`;
  public parentRoute: string = `Partners`;
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder);
  }
}
