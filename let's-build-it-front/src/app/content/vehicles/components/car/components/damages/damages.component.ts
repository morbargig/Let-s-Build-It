import { Component, OnInit } from '@angular/core';
import { UtilsService } from '@app/@core/services/utils.service';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { TableColumn, TableColumnType } from '@app/@ideo/components/table/models/table-column';
import { TableFilter } from '@app/@ideo/components/table/models/table-filter';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { CarModel } from '@app/@shared/models/car.model';
import { ImportConfig } from '@app/@shared/models/import.config';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { TablePageDirective } from '../../../../../../@shared/directives/table-page.directive';
import {
  CarDamageModel,
  DamagePositionType,
  DamageSideType,
  DamageType,
} from '../../../../../../@shared/models/car-damage.model';
import { CarProfileService } from '../../car-profile.service';
import { CarDamagesService } from './car-damages.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SideBarPageService } from '@app/@shared/components/side-bar-page/isidibar-service.interface';
import { SelectFilterComponent } from '../../../../../../@ideo/components/table/table-filters/select-filter/select-filter.component';
import { asSelectItem } from '../../../../../../prototypes';
import { MultiselectFilterComponent } from '../../../../../../@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { CalendarFilterComponent } from '../../../../../../@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { DamageDateType } from '../../../../../../@shared/models/car-damage.model';

@Component({
  selector: 'prx-damages',
  templateUrl: './damages.component.html',
  styleUrls: ['./damages.component.scss'],
})
export class DamagesComponent extends TablePageDirective<CarDamageModel> implements OnInit {
  public importConfig?: ImportConfig;
  public columns: TableColumn<CarDamageModel>[];
  public pageActions: ButtonItem<any>[];
  public filters: TableFilter[];
  public itemActions: ButtonItem<CarDamageModel>[] = [
    {
      tooltip: 'Details',
      permission: { values: ['AccessAgencyVehicles'] },
      icon: 'fas fa-handshake',
      click: (item, btn) => {
        this.router.navigate(['./', item.id], { relativeTo: this.route });
      },
    },
    {
      tooltip: 'Edit',
      permission: { values: ['EditAgencyVehicles'] },
      icon: 'fas fa-edit',
      styleClass: 'btn-outline-primary ml-2',
      click: (item) => {
        this.router.navigate(['edit', item.id], { relativeTo: this.route })
      },
    },
    {
      tooltip: 'Delete',
      icon: 'fas fa-trash',
      permission: { values: ['DeleteAgencyVehicles'] },
      hidden: () => false,
      click: (item) => this.deleteItem(item),
      styleClass: 'btn-outline-danger ml-2',
    }
    
  ];

  public dropdownActions: SelectItem[] = [
    { label: 'Damage Report', value: 'Damage-Report' },
    { label: 'Report Accident', value: 'Accident-Report' },
  ];
  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<CarDamageModel>> {
    return this.carDamagesService.getAll(this.car.id, evt);
  }
  public deleteEntity(item: CarDamageModel): Observable<any> {
    return this.carDamagesService.delete(this.car.id, item.id);
  }
  constructor(
    modalService: BsModalService,
    router: Router,
    private route: ActivatedRoute,
    notificationsService: NotificationsService,
    private carDamagesService: CarDamagesService,
    private sidebarPageService: SideBarPageService,
    private utilsService: UtilsService
  ) {
    super(modalService, true, notificationsService, router);
    this.sidebarPageService.breadcrumbs = [
      { label: 'Cars', url: '../../' },
      {
        label: `${this.sidebarPageService.entity.manufacturer} ${this.sidebarPageService.entity.model}
       ${this.sidebarPageService.entity.modelYear} | ${this.sidebarPageService.entity.plateNo} `, url: './'
      },
      { label: 'Damages' },
    ];
  }

  ngOnInit(): void {
    this.columns = [
      {
        field: 'id',
        header: 'Damage Id',
        sortable: true,
        filter: null,
      },
      {
        field: 'createDate',
        header: 'Date',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'CreateDate', type: CalendarFilterComponent, placeholder: 'Date' }],
      },
      {
        field: 'createUser',
        header: 'Reporter',
        sortable: true,
        filter: null,
      },
      {
        field: 'side',
        header: 'Side',
        hidden: true,
        sortable: true,
        parsedData: (val) => {
          return !!val ? DamageSideType[val] : '';
        },
        filter: [
          {
            name: 'Side',
            styleClass: 'col-12 col-md-4',
            placeholder: 'Damage Side',
            type: MultiselectFilterComponent,
            options: asSelectItem(DamageSideType),
          }
        ]
      },
      {
        field: 'position',
        header: 'Position',
        hidden: true,
        sortable: true,
        parsedData: (val) => {
          return !!val ? DamagePositionType[val] : '';
        },
        filter: [
          {
            name: 'Position',
            styleClass: 'col-12 col-md-4',
            placeholder: 'Damage Position',
            type: MultiselectFilterComponent,
            options: asSelectItem(DamagePositionType),
          }
        ],
      },
      {
        field: 'type',
        header: 'Type',
        hidden: true,
        sortable: true,
        parsedData: (val) => {
          return !!val ? DamageType[val] : '';
        },
        filter: [
          {
            name: 'Type',
            styleClass: 'col-12 col-md-4',
            placeholder: 'Damage Type',
            type: MultiselectFilterComponent,
            options: asSelectItem(DamageType),
          }
        ],

      },
      {
        field: 'description',
        header: 'Description',
        sortable: true,
        parsedFullData: (damage: CarDamageModel) => {
          return `${DamageSideType[damage.side]} ${DamagePositionType[damage.position]} ${DamageType[damage.type]}`;
        },
        filter: null,
      },
    ];
  }

  public get car(): CarModel {
    return this.sidebarPageService.entity;
  }
}
