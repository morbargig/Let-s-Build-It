import { Injectable } from '@angular/core';
import { PartnerModel } from '../../@shared/models/partner.model';
import { BreadcrumType } from '@app/blocks/navigations/breadcrum/breadcrum.component';

@Injectable({
  providedIn: 'root',
})
export class PartnerProfileService {
  constructor() {}

  public partner: PartnerModel;
  public breadcrumbs: BreadcrumType[] = [];
}
