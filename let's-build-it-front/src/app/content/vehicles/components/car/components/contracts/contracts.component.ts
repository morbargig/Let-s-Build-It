import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { TableColumn, TableColumnType } from '@app/@ideo/components/table/models/table-column';
import { TableFilter } from '@app/@ideo/components/table/models/table-filter';
import { TableService } from '@app/@ideo/components/table/services/table.service';
import { CalendarFilterComponent } from '@app/@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { NumericFilterComponent } from '@app/@ideo/components/table/table-filters/numeric-filter/numeric-filter.component';
import { TextFilterComponent } from '@app/@ideo/components/table/table-filters/text-filter/text-filter.component';
import { MAX_INT } from '@app/@ideo/components/table/table.component';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { TablePageDirective } from '@app/@shared/directives/table-page.directive';
import { CarContractModel } from '@app/@shared/models/car-contract.model';
import { CarModel } from '@app/@shared/models/car.model';
import { ImportConfig } from '@app/@shared/models/import.config';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { ToolbarAction } from '@app/@shared/models/tool-bar.action';
import { faFileUpload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { CarProfileService } from '../../car-profile.service';
import { SideBarPageService } from '../../../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'prx-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
})
export class ContractsComponent extends TablePageDirective<CarContractModel> implements OnInit {
  public importConfig?: ImportConfig;
  public columns: TableColumn<CarContractModel>[];
  public pageActions: ButtonItem<any>[];
  public filters: TableFilter[];
  public itemActions: ButtonItem<CarContractModel>[];

  public topRightButtons: ToolbarAction[] = [
    {
      label: 'Export Page',
      icon: 'fas fa-download',
      optionsArr: [
        { label: 'Excel', icon: 'fas fa-file-excel', click: (evt: any) => this.tc.export(false) },
        { label: 'Csv', icon: 'fas fa-file-csv', click: (evt: any) => this.tc.export(false, 'Csv') },
      ],
      faIcon: faFileUpload,
      click: (evt) => this.tc.export(false),
    },
    { label: 'Export All', icon: 'fas fa-download', faIcon: faUpload, click: (evt) => this.tc.export(true) },
  ];

  public dropdownActions: SelectItem[] = [{ label: 'Damage Report', value: 'Damage-Report' }];

  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<CarContractModel>> {
    return of({ data: [], total: 0 });
  }
  public deleteEntity(item: CarContractModel): Observable<any> {
    throw new Error('Method not implemented.');
  }

  public get car(): CarModel {
    return this.sidebarPageService.entity;
  }

  // @Output() public onLazyLoad: EventEmitter<LazyLoadEvent> = new EventEmitter<LazyLoadEvent>();

  // export(all: boolean, type: 'Excel' | 'Csv' = 'Excel'): void {
  //   let currentState = this.service.getTableState();
  //   if (all) {
  //     currentState.pageSize = MAX_INT;
  //     currentState.exportType = type;
  //     currentState.exportAll = true;
  //   } else {
  //     currentState.exportType = type;
  //   }
  //   this.onLazyLoad.emit({ ...currentState });
  // }

  constructor(
    public service: TableService,
    private sidebarPageService: SideBarPageService,
    router: Router,
    modalService: BsModalService,
    notificationsService: NotificationsService
  ) {
    super(modalService, true, notificationsService, router);
  }

  ngOnInit(): void {
    this.columns = [
      {
        field: 'id',
        header: 'Contract ID',
        sortable: true,
        filter: [{ name: 'Id', type: NumericFilterComponent, placeholder: 'Enter Contract ID' }],
      },
      {
        field: 'status',
        header: 'Status',
        sortable: true,
        filter: [{ name: 'Status', type: TextFilterComponent, placeholder: 'Status' }],
      },
      {
        field: 'customer',
        header: 'Customer',
        sortable: true,
        filter: [{ name: 'Customer', type: TextFilterComponent, placeholder: 'Customer' }],
      },
      {
        field: 'pickUp',
        header: 'Pick-up Location',
        sortable: true,
      },
      {
        field: 'dropOff',
        header: 'Drop off Location',
        sortable: true,
      },
      {
        field: 'payment',
        header: 'Payment',
        sortable: true,
      },
      {
        field: 'startDate',
        header: 'Date Start',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'StartDate', type: CalendarFilterComponent, placeholder: 'Date from' }],
      },
      {
        field: 'endDate',
        header: 'Date End',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'EndDate', type: CalendarFilterComponent, placeholder: 'Date to' }],
      },
      {
        field: 'price',
        header: 'Price',
        sortable: true,
      },
    ];
  }
}
