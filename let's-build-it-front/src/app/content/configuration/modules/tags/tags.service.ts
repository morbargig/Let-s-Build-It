import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '../../../../@ideo/infrastructure/services/query-builder.service';
import { TagModel } from '../../../../@shared/models/tag.model';
import { BaseHttpService } from '@app/@core/base/base-http-service';

@Injectable({
  providedIn: 'root',
})
export class TagsService extends BaseHttpService<TagModel>{
  public collationName: string = 'tags'
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder)
  }
}
