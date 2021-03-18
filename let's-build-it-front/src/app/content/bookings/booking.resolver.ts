import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BasePageConfig } from '../../@shared/models/base-page.config';
import { TableColumn } from '../../@ideo/components/table/models/table-column';
import { BookingModel } from '../../@shared/models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingResolverService implements Resolve<BasePageConfig<any>> {
  constructor(
    // private router: Router,
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BasePageConfig<BookingModel> {
    return null
    //   const columns: TableColumn[] = [
    //     {
    //       field: 'inventoryType',
    //       header: 'Inventory Type',
    //       sortable: true,
    //       // parsedData: (val) => {
    //       //   return !!val ? InventoryType[val] : '';
    //       // },
    //       filter: [
    //         {
    //           name: 'InventoryType',
    //           // type: MultiselectFilterComponent,
    //           // options: this.utilsService.toSelectItem(InventoryType),
    //         },
    //       ],
    //     },
    //     {
    //       field: 'externalId',
    //       header: 'External Id',
    //       sortable: true,
    //       // filter: [{ name: 'ExternalId', type: TextFilterComponent, placeholder: 'External Id' }],
    //     },
    //     {
    //       field: 'chipProviderType',
    //       header: 'Chip Provider Type',
    //       sortable: true,
    //       // filter: [{ name: 'ChipProviderType', type: TextFilterComponent, placeholder: 'Chip Provider Type' }],
    //     },
    //     {
    //       field: 'carId',
    //       header: 'Car Id',
    //       sortable: true,
    //       // filter: [{ name: 'CarId', type: MultiselectFilterComponent, placeholder: 'Car Id', asyncOptions: this.cars$ }],
    //     },
    //     {
    //       field: 'partnerId',
    //       header: 'Partner Id',
    //       sortable: true,
    //       filter: [
    //         {
    //           name: 'PartnerId',
    //           type: MultiselectFilterComponent,
    //           placeholder: 'Partner Id',
    //           asyncOptions: this.partners$,
    //         },
    //       ],
    //     },
    //     {
    //       field: 'created',
    //       header: 'Created',
    //       sortable: true,
    //       type: TableColumnType.DateTime,
    //       filter: [{ name: 'Created', type: CalendarFilterComponent, placeholder: 'Created' }],
    //     },
    //     {
    //       field: 'updated',
    //       header: 'Updated',
    //       sortable: true,
    //       type: TableColumnType.DateTime,
    //       filter: [{ name: 'Updated', type: CalendarFilterComponent, placeholder: 'Updated' }],
    //     },
    //     {
    //       field: 'id',
    //       hidden: true,
    //       filter: [],
    //     },
    //   ];
    //   const formControls = this.inventoryFormService.generate(true);
    //   return new BasePageConfig({
    //     columns: columns,
    //     deleteEntity: (evt) => null,
    //     getDataProvider: (evt) => this.inventoriesService.getAll(evt),
    //     createLabel: 'Create Inventory',
    //     formRoute: 'users',
    //     title: 'Inventories',
    //     preTitle: 'Inventories',
    //     editAction: (item: BookingModel) => {
    //       // this.router.navigate(['/inventories', item.id]);
    //     },
    //     createAction: () => {
    //       // this.router.navigate(['/inventories', 'create']);
    //     },
    //     itemActions: [],
    //     permissions: {
    //       create: ['CreateAgencyFleetInventories'],
    //       edit: ['EditAgencyFleetInventories'],
    //       delete: ['DeleteAgencyFleetInventories'],
    //     },
    //     stateKey: 'inventories-table',
    //   });
    // }
  }
}