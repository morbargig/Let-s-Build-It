import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { TableColumn, TableColumnType } from '@app/@ideo/components/table/models/table-column';
import { TableFilter } from '@app/@ideo/components/table/models/table-filter';
import { CalendarFilterComponent } from '@app/@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { NumericFilterComponent } from '@app/@ideo/components/table/table-filters/numeric-filter/numeric-filter.component';
import { TextFilterComponent } from '@app/@ideo/components/table/table-filters/text-filter/text-filter.component';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { SideBarPageService } from '@app/@shared/components/side-bar-page/isidibar-service.interface';
import { TablePageDirective } from '@app/@shared/directives/table-page.directive';
import { CarModel } from '@app/@shared/models/car.model';
import { ImportConfig } from '@app/@shared/models/import.config';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { CarAlertModel } from '../../../../../../@shared/models/car-alert.model';
import { CarProfileService } from '../../car-profile.service';

@Component({
  selector: 'prx-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent extends TablePageDirective<CarAlertModel> implements OnInit {
  public importConfig?: ImportConfig;
  public columns: TableColumn<CarAlertModel>[];
  public pageActions: ButtonItem<any>[];
  public filters: TableFilter[];
  public itemActions: ButtonItem<CarAlertModel>[];

  public dropdownActions: SelectItem[] = [{ label: 'Damage Report', value: 'Damage-Report' }];

  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<CarAlertModel>> {
    return of({ data: [], total: 0 });
  }
  public deleteEntity(item: CarAlertModel): Observable<any> {
    throw new Error('Method not implemented.');
  }

  public get car(): CarModel {
    return this.sidebarPageService.entity;
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
    this.columns = [
      {
        field: 'date',
        header: 'Date',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'Date', type: CalendarFilterComponent, placeholder: 'Date' }],
      },
      {
        field: 'type',
        header: 'Type',
        sortable: true,
        filter: [{ name: 'Type', type: TextFilterComponent, placeholder: 'Type' }],
      },
      {
        field: 'importance',
        header: 'Importance',
        sortable: true,
        filter: [{ name: 'Importance', type: TextFilterComponent, placeholder: 'Severity' }],
      },
      {
        field: ' mileage',
        header: 'vehicle mileage',
        sortable: true,
        filter: [],
      },
      {
        field: ' description',
        header: 'Dscription',
        sortable: true,
        filter: [],
      },
    ];
  }
}
