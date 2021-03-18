import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContactsModel } from '../../../../@shared/models/contacts.model';
import { QueryBuilderService } from '../../../../@ideo/infrastructure/services/query-builder.service';
import { BaseParentHttpService } from '../../../../@core/base/base-parent-http-service'

@Injectable({
  providedIn: 'root'
})
export class PartnerContactService extends BaseParentHttpService<number, ContactsModel> {

  public collationName: string =  'Contacts'
  public parentRoute: string = 'Partners';
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder)
  }
  public get = null;
  public update = null;
  public bulk = null;

}
