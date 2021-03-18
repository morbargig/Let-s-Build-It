import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '../../../../@ideo/infrastructure/services/query-builder.service';
import { SettingModel } from '../../../../@shared/models/setting.model';
import { BaseHttpService } from '@app/@core/base/base-http-service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService extends BaseHttpService<SettingModel>{
  public collationName: string = 'configuration/settings'
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder)
  }
}
