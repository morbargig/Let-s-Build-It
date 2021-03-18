import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '@app/@core/services/utils.service';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { ImportConfig } from '@app/@shared/models/import.config';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableColumn, TableColumnType } from '../../@ideo/components/table/models/table-column';
import { CalendarFilterComponent } from '../../@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { MultiselectFilterComponent } from '../../@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { NumericFilterComponent } from '../../@ideo/components/table/table-filters/numeric-filter/numeric-filter.component';
import { TextFilterComponent } from '../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { InventoryType } from '../../@shared/interfaces/inventory-type.enum';
import { BasePageConfig } from '../../@shared/models/base-page.config';
import { InventoryModel } from '../../@shared/models/inventory.model';
import { InventoriesService } from '../inventories/inventories.service';
import { CarsService } from '../vehicles/services/cars.service';
import { InventoryFormService } from './inventory-form.service';
import { PartnersService } from '../agencies/partners.service';
import { MAX_INT } from '@app/@ideo/components/table/table.component';

@Injectable({
  providedIn: 'root',
})
export class InventoriesResolverService implements Resolve<BasePageConfig<any>> {
  constructor(
    private inventoriesService: InventoriesService,
    private router: Router,
    private inventoryFormService: InventoryFormService,
    private carsService: CarsService,
    private utilsService: UtilsService,
    private partnersService: PartnersService
  ) {}
  private partners$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  private cars$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BasePageConfig<InventoryModel> {
    this.carsService
      .getAll({
        page: 1,
        pageSize: 200,
      } as LazyLoadEvent)
      .pipe(
        map((r) =>
          r?.data?.map((a) => {
            return {
              value: a.id,
              label: a.id.toString(),
            } as SelectItem;
          })
        )
      )
      .subscribe((res) => this.cars$.next(res));
    this.partnersService
      .getAll({
        page: 1,
        pageSize: MAX_INT,
      } as LazyLoadEvent)
      .pipe(
        map((r) =>
          r?.data?.map((a) => {
            return {
              value: a.id,
              label: a.id.toString(),
            } as SelectItem;
          })
        )
      )
      .subscribe((res) => this.partners$.next(res));

    const columns: TableColumn[] = [
      {
        field: 'inventoryType',
        header: 'Inventory Type',
        sortable: true,
        parsedData: (val) => {
          return !!val ? InventoryType[val] : '';
        },
        filter: [
          {
            name: 'InventoryType',
            type: MultiselectFilterComponent,
            options: this.utilsService.toSelectItem(InventoryType),
          },
        ],
      },
      {
        field: 'externalId',
        header: 'External Id',
        sortable: true,
        filter: [{ name: 'ExternalId', type: TextFilterComponent, placeholder: 'External Id' }],
      },
      {
        field: 'chipProviderType',
        header: 'Chip Provider Type',
        sortable: true,
        filter: [{ name: 'ChipProviderType', type: TextFilterComponent, placeholder: 'Chip Provider Type' }],
      },
      {
        field: 'carId',
        header: 'Car Id',
        sortable: true,
        filter: [{ name: 'CarId', type: MultiselectFilterComponent, placeholder: 'Car Id', asyncOptions: this.cars$ }],
      },
      {
        field: 'partnerId',
        header: 'Partner Id',
        sortable: true,
        filter: [
          {
            name: 'PartnerId',
            type: MultiselectFilterComponent,
            placeholder: 'Partner Id',
            asyncOptions: this.partners$,
          },
        ],
      },
      {
        field: 'created',
        header: 'Created',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'Created', type: CalendarFilterComponent, placeholder: 'Created' }],
      },
      {
        field: 'updated',
        header: 'Updated',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'Updated', type: CalendarFilterComponent, placeholder: 'Updated' }],
      },
      {
        field: 'id',
        hidden: true,
        filter: [],
      },
    ];
    const formControls = this.inventoryFormService.generate(true);
    return new BasePageConfig({
      columns: columns,
      deleteEntity: (evt) => this.inventoriesService.delete(evt.id),
      getDataProvider: (evt) => this.inventoriesService.getAll(evt),
      createLabel: 'Create Inventory',
      formRoute: 'users',
      title: 'Inventories',
      preTitle: 'Inventories',
      editAction: (item: InventoryModel) => {
        this.router.navigate(['/inventories', item.id]);
      },
      createAction: () => {
        this.router.navigate(['/inventories', 'create']);
      },
      importConfig: new ImportConfig({
        downloadTemplate: 'api/inventories/template',
        parseDataUrl: () => null,
        import: (model: InventoryModel[]) => this.inventoriesService.bulk(model),
        columns: columns,
        controls: formControls,
      }),
      itemActions: [],
      permissions: {
        create: ['CreateAgencyFleetInventories'],
        edit: ['EditAgencyFleetInventories'],
        delete: ['DeleteAgencyFleetInventories'],
      },
      stateKey: 'inventories-table',
    });
  }
}
