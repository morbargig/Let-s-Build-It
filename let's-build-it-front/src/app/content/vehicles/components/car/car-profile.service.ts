import { Injectable } from '@angular/core';
import { BreadcrumType } from '@app/blocks/navigations/breadcrum/breadcrum.component';
import { CarModel } from '../../../../@shared/models/car.model';

@Injectable({
  providedIn: 'root',
})
export class CarProfileService {
  constructor() {}

  public car: CarModel;
  public breadcrumbs: BreadcrumType[] = [];
}
