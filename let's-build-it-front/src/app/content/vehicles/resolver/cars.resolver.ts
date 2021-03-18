import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BasePageConfig } from '../../../@shared/models/base-page.config';
import { SelectItem } from '../../../@forms/@core/interfaces';
import { LazyLoadEvent } from '../../../@ideo/components/table/events/lazy-load.event';
import { PartnersService } from '../../agencies/partners.service';
import { CarsService } from '../services/cars.service';
import { CarModel } from '../../../@shared/models/car.model';
import { MultiselectFilterComponent } from '../../../@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { map, tap } from 'rxjs/operators';
import { TextFilterComponent } from '../../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { NumericFilterComponent } from '../../../@ideo/components/table/table-filters/numeric-filter/numeric-filter.component';
import { TableColumnType } from '../../../@ideo/components/table/models/table-column';
import { CalendarFilterComponent } from '../../../@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';

@Injectable({
  providedIn: 'root',
})
export class CarsResolverService implements Resolve<BasePageConfig<any>> {
  constructor(
    private carsService: CarsService,
    private partnersService: PartnersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  private partners: SelectItem[] = [];
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BasePageConfig<CarModel> {
    return new BasePageConfig({
      columns: [
        {
          field: 'plateNo',
          header: 'Plate No.',
          sortable: true,
          filter: [{ name: 'PlateNo', type: TextFilterComponent, placeholder: 'Plate No.' }],
        },
        {
          field: 'manufacturer',
          header: 'Manufacturer',
          sortable: true,
          filter: [{ name: 'Manufacturer', type: TextFilterComponent, placeholder: 'Manufacturer' }],
        },
        {
          field: 'model',
          header: 'Model',
          sortable: true,
          filter: [{ name: 'Model', type: TextFilterComponent, placeholder: 'Model' }],
        },
        {
          field: 'partnerId',
          header: 'Agency',
          sortable: true,
          parsedData: (val) => {
            return this.partners.find((z) => z.value == val)?.label;
          },
          filter: [
            {
              name: 'PartnerId',
              type: MultiselectFilterComponent,
              placeholder: 'Agency',
              asyncOptions: this.partnersService
                .getAll({
                  page: 1,
                  pageSize: 200,
                } as LazyLoadEvent)
                .pipe(
                  map((r) =>
                    r?.data?.map((a) => {
                      return {
                        value: a.id,
                        label: a.name,
                      } as SelectItem;
                    })
                  ),
                  tap((x) => (this.partners = x))
                ),
            },
          ],
        },
        {
          field: 'pricingType',
          header: 'Pricing Group',
          sortable: true,
          filter: [{ name: 'PricingType', type: TextFilterComponent, placeholder: 'Pricing Group' }],
        },
        {
          field: 'doorsNumber',
          header: 'Doors Number',
          sortable: true,
          filter: [{ name: 'DoorsNumber', type: NumericFilterComponent, placeholder: 'Doors Number' }],
        },
        {
          field: 'vin',
          header: 'VIN',
          sortable: true,
          filter: [{ name: 'VIN', type: TextFilterComponent, placeholder: 'VIN' }],
        },
        {
          field: 'profileImgId',
          header: 'Profile Image',
          type: TableColumnType.Image,
        },
        {
          field: 'createDate',
          header: 'Created',
          sortable: true,
          type: TableColumnType.DateTime,
          filter: [{ name: 'CreateDate', type: CalendarFilterComponent, placeholder: 'Created' }],
        },
        {
          field: 'updateDate',
          header: 'Updated',
          sortable: true,
          type: TableColumnType.DateTime,
          filter: [{ name: 'UpdateDate', type: CalendarFilterComponent, placeholder: 'Updated' }],
        },
      ],
      deleteEntity: (evt) => this.carsService.delete(evt.id),
      getDataProvider: (evt) => this.carsService.getAll(evt),
      createLabel: 'Create Car',
      formRoute: 'users',
      title: 'Vehicles',
      preTitle: 'Cars',
      editAction: (item: CarModel) => {
        this.router.navigate(['/vehicles', item.id]);
      },
      createAction: () => {
        this.router.navigate(['/vehicles', 'create']);
      },
      itemActions: [
        {
          styleClass: 'btn-outline-success ml-2',
          tooltip: 'Details',
          icon: 'fas fa-car',
          click: (item, btn) => {
            this.router.navigate(['/vehicles', item.id, 'profile']);
          },
        },
      ],
      permissions: {
        create: ['CreateAgencyVehicles'],
        edit: ['EditAgencyVehicles'],
        delete: ['DeleteAgencyVehicles'],
      },
      stateKey: 'cars-table',
    });
  }
}
