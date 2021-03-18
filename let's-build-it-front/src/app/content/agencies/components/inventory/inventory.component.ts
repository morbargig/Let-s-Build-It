import { Component, OnInit } from '@angular/core';
import { InventoriesService } from '../../../inventories/inventories.service';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { SideBarPageService } from '../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { TablePageDirective } from '../../../../@shared/directives/table-page.directive';
import { InventoryModel } from '../../../../@shared/models/inventory.model';
import { ImportConfig } from '../../../../@shared/models/import.config';
import { ButtonItem } from '../../../../@ideo/core/models/button-item';
import { TableFilter, MatchMode } from '../../../../@ideo/components/table/models/table-filter';
import { TableColumn, TableColumnType } from '../../../../@ideo/components/table/models/table-column';
import { FilterObject, LazyLoadEvent } from '../../../../@ideo/components/table/events/lazy-load.event';
import { UtilsService } from '@app/@core/services/utils.service';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { CalendarFilterComponent } from '@app/@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { MultiselectFilterComponent } from '@app/@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { TextFilterComponent } from '@app/@ideo/components/table/table-filters/text-filter/text-filter.component';
import { MAX_INT } from '@app/@ideo/components/table/table.component';
import { InventoryType } from '@app/@shared/interfaces/inventory-type.enum';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { PartnerModel } from '@app/@shared/models/partner.model';
import { CarsService } from '@app/content/vehicles/services/cars.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PartnersService } from '../../partners.service';
import { Router, ActivatedRoute } from '@angular/router';
import { asSelectItem } from '../../../../prototypes';
import { faEdit, faHandshake, faLink } from '@fortawesome/free-solid-svg-icons';




@Component({
  selector: 'prx-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent extends TablePageDirective<InventoryModel> implements OnInit {
  public importConfig?: ImportConfig;
  public columns: TableColumn<InventoryModel>[];
  public pageActions: ButtonItem<any>[];
  public filters: TableFilter[];
  public itemActions: ButtonItem<InventoryModel>[] = [{
    tooltip: 'Edit',
    icon: faEdit,
    styleClass: 'btn-outline-primary ml-2',
    click: (item) => {
      this.router.navigate(['edit', item.id], { relativeTo: this.route })
    },
  },
  {
    label: 'Details',
    icon: faHandshake,
    styleClass: 'btn-outline-primary ml-2',
    click: (item) => {
      this.router.navigate([item.id], { relativeTo: this.route })
    },
  },
  {
    tooltip: 'Assign',
    styleClass: 'btn-outline-primary ml-2',
    icon: faLink,
    click: (item) => {
      this.router.navigate(['assign', item.id], { relativeTo: this.route })
    },
  },];
  public selectedClick: (pram: string | any) => void = (pram) => {
    pram.url ? this.router.navigate(['create', pram?.url], { relativeTo: this.route }) : null
  }
  public selectActions: SelectItem[] = [
    { label: 'Import Inventory', value: 'import-inventory' },
    { label: 'Export All', value: 'export-all' },
    { label: 'export filtered', value: 'export-filtered' },
    { label: 'Add IoT Key', value: { url: 'Chip' }, },
    { label: 'Add Sim Card', value: { url: 'SimCard' } },
    { label: 'Add Phone Number', value: { url: 'TelephoneLine' } },
  ];

  public totalUnused: number = 0
  public total: number = 0

  public stripes: SelectItem[] = [
    { label: 'Total', value: this.total, icon: 'car', },
    { label: 'Unused', value: this.totalUnused, icon: 'unused', flag: true },
  ];

  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<InventoryModel>> {
    evt.filters['PartnerId'] = {
      matchMode: 2000,
      value: this.sidebarService.entity.id
    };
    return this.inventoriesService.getAll(evt);
  }
  public deleteEntity(item: InventoryModel): Observable<any> {
    throw new Error('Method not implemented.');
  }

  constructor(
    private sidebarService: SideBarPageService,
    private inventoriesService: InventoriesService,
    private partnersService: PartnersService,
    private carsService: CarsService,
    private utilsService: UtilsService,
    modalService: BsModalService,
    router: Router,
    private route: ActivatedRoute,
    notificationsService: NotificationsService,
  ) {
    super(modalService, true, notificationsService, router)
    forkJoin([
      this.inventoriesService.count({
        PartnerId: {
          value: this.sidebarService.entity.id,
          matchMode: 2000,
        },
      })
      ,
      this.inventoriesService.count({
        'Car.PartnerId': {
          value: this.sidebarService.entity.id,
          matchMode: 2000,
        },
      })

    ]).pipe(take(1)).subscribe(res => {
      for (let i of Object.keys(res[0])) {
        this.total += +res[0][i]
      }
      (this.stripes.filter(x => x.label === "Total") as SelectItem[])[0].value = this.total

      let usedNum: number = 0
      for (let i of Object.keys(res[1])) {
        usedNum += +res[1][i]
      }
      this.totalUnused = this.total - usedNum;
      (this.stripes.filter(x => x.label === "Unused") as SelectItem[])[0].value = this.totalUnused
    })

    this.sidebarService.breadcrumbs = [
      { label: 'Agencies', url: '../../' },
      { label: this.sidebarService.entity.name, url: './' },
      { label: 'Inventories' },
    ];
  }

  public get partner(): PartnerModel {
    return this.sidebarService.entity;
  }
  public set partner(partner: PartnerModel) {
    this.sidebarService.entity = partner;
  }

  private cars$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  private partners$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);

  ngOnInit(): void {
    this.carsService
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
    this.columns = [
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
            options: asSelectItem(InventoryType),
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
        filter: [
          {
            name: 'CarId',
            type: MultiselectFilterComponent,
            placeholder: 'Car',
            // asyncOptions: this.cars$,
            styleClass: 'col-xl-3',
            queryFilters: (query) => {
              return {
                "Model": {
                  value: query,
                  matchMode: MatchMode.Contains
                }
              } as FilterObject
            },
            lazyOptions: (evt) => {
              evt.filters = evt.filters || {};
              evt.filters['PartnerId'] = {
                matchMode: MatchMode.Equals,
                value: this.sidebarService.entity.id
              }
              return this.carsService
                .getAll(evt)
                .pipe(
                  map((r) => {
                    let val = {
                      data: r?.data?.map((a) => {
                        return {
                          value: a.id,
                          label: `${a.model} ${a.modelYear}`,
                          // icon: a.profileImgId,
                          title: a.plateNo
                        } as SelectItem;
                      }),
                      total: r.total
                    };
                    return val;
                  })
                )
            }
          },
        ],
      },
      {
        field: 'partnerId',
        hidden: true,
        filter: [],
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
  }
}