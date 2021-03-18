import { Component, OnInit } from '@angular/core';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { TablePageDirective } from '@app/@shared/directives/table-page.directive';
import { CarModel } from '@app/@shared/models/car.model';
import { CarContractModel } from '../../../../../../@shared/models/car-contract.model';
import { ImportConfig } from '@app/@shared/models/import.config';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { TableFilter } from '@app/@ideo/components/table/models/table-filter';
import { TableColumn } from '@app/@ideo/components/table/models/table-column';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { Observable, of } from 'rxjs';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { SideBarPageService } from '../../../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import { faTripadvisor } from '@fortawesome/free-brands-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'prx-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent extends TablePageDirective<CarContractModel> implements OnInit {
  public importConfig?: ImportConfig;
  public columns: TableColumn<CarContractModel>[];
  public pageActions: ButtonItem<any>[];
  public filters: TableFilter[];
  public itemActions: ButtonItem<CarContractModel>[];

  public dropdownActions: SelectItem[] = [{ label: 'Damage Report', value: 'Damage-Report' }];
  public dropdownTime: SelectItem[] = [
    { label: 'Today', value: 'today' },
    { label: 'Week', value: 'week' },
    { label: '2Weeks', value: 'two-weeks' },
  ];

  public stripes: SelectItem[] = [
    { label: 'Utillization', value: '78%', icon: faRoute },
    { label: 'Booking rate', value: '45%', icon: faTripadvisor },
    {
      label: 'Vehicle Service in',
      value: null,
      items: [
        { label: 'days', value: 24 },
        { label: 'km', value: 3543 },
      ],
    },
  ];

  public get car(): CarModel {
    return this.sidebarPageService.entity;
  }

  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<CarContractModel>> {
    return of({ data: [], total: 0 });
  }
  public deleteEntity(item: CarContractModel): Observable<any> {
    throw new Error('Method not implemented.');
  }
  constructor(
    private sidebarPageService: SideBarPageService,
    modalService: BsModalService,
    router: Router,
    notificationsService: NotificationsService
  ) {
    super(modalService, true, notificationsService, router);
  }

  ngOnInit(): void {
    this.sidebarPageService.breadcrumbs = [
      {
        label: `Vehicles`,
        url: '../../',
      },
      {
        label: `${this.car.manufacturer} ${this.car.model} ${this.car.modelYear} | ${this.car.plateNo}`,
        url: './',
      },
      { label: 'Summary' },
    ];

    this.columns = [
      {
        field: 'id',
        header: 'Contract Id',
        sortable: true,
        filter: null,
      },
      {
        field: 'customer',
        header: 'Customer',
        sortable: true,
        filter: null,
      },
      {
        field: 'pickUp',
        header: 'Collect location',
        sortable: true,
        filter: null,
      },
      {
        field: 'startDate',
        header: 'Date Start',
        sortable: true,
        filter: null,
      },
    ];
  }
}
