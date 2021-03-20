import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { TableColumn, TableColumnType } from '@app/@ideo/components/table/models/table-column';
import { TableFilter } from '@app/@ideo/components/table/models/table-filter';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { TablePageDirective } from '@app/@shared/directives/table-page.directive';
import { ImportConfig } from '@app/@shared/models/import.config';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ActionType } from '../../../../../../@shared/interfaces/action-type.enum';
import { BooleanFilterComponent } from '../../../../../../@ideo/components/table/table-filters/boolean-filter/boolean-filter.component';
import { MultiselectFilterComponent } from '@app/@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { UtilsService } from '@app/@core/services/utils.service';
import { UsersService } from '../../../../../users/services/users.service';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { map } from 'rxjs/operators';
import { CarModel } from '@app/@shared/models/car.model';
import { SideBarPageService } from '@app/@shared/components/side-bar-page/isidibar-service.interface';
import { CarsService } from '../../../../services/cars.service';
import { CarActionLogModel } from '../../../../../../@shared/models/car-action-log.model';
import { CalendarFilterComponent } from '@app/@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { TableComponent } from '../../../../../../@ideo/components/table/table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'prx-remote-control',
  templateUrl: './remote-control.component.html',
  styleUrls: ['./remote-control.component.scss'],
})
export class RemoteControlComponent extends TablePageDirective<CarActionLogModel> implements OnInit {
  public importConfig?: ImportConfig;
  public columns: TableColumn<CarActionLogModel>[];
  public pageActions: ButtonItem<any>[];
  public filters: TableFilter[];
  public itemActions: ButtonItem<CarActionLogModel>[];

  @ViewChild('tc', { static: true }) public tc: TableComponent;

  public pActions: SelectItem[] = [{ label: 'Damage Report', value: 'Damage-Report' }];

  public dropdownActions: SelectItem[] = [{ label: 'Damage Report', value: 'Damage-Report' }];
  public controlButtons: ButtonItem[] = [
    {
      label: 'Lock Doors',
      item: ActionType.lock_doors,
      click: (item: ActionType) => {
        this.carsService
          .SendAction(this.car.id, item)
          .toPromise()
          .then((res) => {
            if (res == true) {
              this.notificationsService.success('action was sent successfully');
            } else {
              this.notificationsService.error('action failed');
            }

            this.tc.getData();
          });
      },
      styleClass: 'btn-outline-secondary flex-grow w-100',
    },
    {
      label: 'Allow Start Engine',
      item: ActionType.allow_start_engine,
      click: (item: ActionType) => {
        this.carsService
          .SendAction(this.car.id, item)
          .toPromise()
          .then((res) => {
            if (res == true) {
              this.notificationsService.success('action was sent successfully');
            } else {
              this.notificationsService.error('action failed');
            }
            this.tc.getData();
          });
      },
      styleClass: 'btn-outline-secondary flex-grow w-100',
    },
    {
      label: 'Reboot Modem',
      item: ActionType.reboot_modem,
      click: (item: ActionType) => {
        this.carsService
          .SendAction(this.car.id, item)
          .toPromise()
          .then((res) => {
            if (res == true) {
              this.notificationsService.success('action was sent successfully');
            } else {
              this.notificationsService.error('action failed');
            }
            this.tc.getData();
          });
      },
      styleClass: 'btn-outline-secondary flex-grow w-100',
    },
    { label: 'Blink car lights', click: (item) => {}, styleClass: 'btn-outline-secondary flex-grow w-100' },
    {
      label: 'Unlock Doors',
      item: ActionType.unlock_doors,
      click: (item: ActionType) => {
        this.carsService
          .SendAction(this.car.id, item)
          .toPromise()
          .then((res) => {
            if (res == true) {
              this.notificationsService.success('action was sent successfully');
            } else {
              this.notificationsService.error('action failed');
            }
            this.tc.getData();
          });
      },
      styleClass: 'btn-outline-secondary flex-grow w-100',
    },
    {
      label: 'Unlock & Allow Start',
      item: ActionType.unlock_doors_and_allow_start,
      click: (item: ActionType) => {
        this.carsService
          .SendAction(this.car.id, item)
          .toPromise()
          .then((res) => {
            if (res == true) {
              this.notificationsService.success('action was sent successfully');
            } else {
              this.notificationsService.error('action failed');
            }

            this.tc.getData();
          });
      },
      styleClass: 'btn-outline-secondary flex-grow w-100',
    },
    {
      label: 'Reboot All',
      item: ActionType.reboot_all,
      click: (item: ActionType) => {
        this.carsService
          .SendAction(this.car.id, item)
          .toPromise()
          .then((res) => {
            if (res == true) {
              this.notificationsService.success('action was sent successfully');
            } else {
              this.notificationsService.error('action failed');
            }
            this.tc.getData();
          });
      },
      styleClass: 'btn-outline-secondary flex-grow w-100',
    },
  ];

  public controlRefresh: ButtonItem = {
    label: 'Refresh',
    item: ActionType.refresh_data,
    click: (item: ActionType) => {
      this.carsService
        .SendAction(this.car.id, item)
        .toPromise()
        .then((res) => {
          if (res == true) {
            this.notificationsService.success('action was sent successfully');
          } else {
            this.notificationsService.error('action failed');
          }
          this.tc.getData();
        });
    },
    styleClass: 'btn-secondary',
  };

  public get car(): CarModel {
    return this.sidebarPageService.entity;
  }

  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<CarActionLogModel>> {
    return this.carsService.getAllActionsLog(this.car.id, evt);
  }
  public deleteEntity(item: CarActionLogModel): Observable<any> {
    throw new Error('Method not implemented.');
  }

  constructor(
    modalService: BsModalService,
    notificationsService: NotificationsService,
    private sidebarPageService: SideBarPageService,
    private utilsService: UtilsService,
    private usersService: UsersService,
    router: Router,
    private carsService: CarsService
  ) {
    super(modalService, true, notificationsService, router);
    this.sidebarPageService.breadcrumbs = [
      {
        label: `Vehicles`,
        url: '../../',
      },
      {
        label: `${this.car.manufacturer} ${this.car.model} ${this.car.modelYear} | ${this.car.plateNo}`,
        url: './',
      },
      { label: 'Remote Control' },
    ];
  }
  private users$: BehaviorSubject<SelectItem[]>;
  ngOnInit() {
    let users: SelectItem[] = [];
    this.usersService
      .getAll({
        page: 1,
        pageSize: 200,
      } as LazyLoadEvent)
      .pipe(
        map((r) =>
          r?.data?.map((a) => {
            return {
              value: a.id,
              label: a.userName,
            } as SelectItem;
          })
        )
      )
      .toPromise()
      .then((u) => {
        users = u;
        if (!!this.users$) {
          this.users$.next(u);
        } else {
          this.users$ = new BehaviorSubject<SelectItem[]>(u);
        }
      });

    this.columns = [
      {
        field: 'action',
        header: 'Action',
        sortable: true,
        parsedData: (val) => {
          return !!val ? ActionType[val] : '';
        },
        filter: [
          {
            name: 'ActionName',
            type: MultiselectFilterComponent,
            options: this.utilsService.toSelectItem(ActionType),
          },
        ],
      },
      {
        field: 'status',
        header: 'Status',
        sortable: true,
        filter: [{ name: 'Status', type: BooleanFilterComponent, placeholder: 'Status' }],
      },
      {
        field: 'createDate',
        header: 'Date',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'CreateDate', type: CalendarFilterComponent, placeholder: 'Date' }],
      },
      {
        field: 'userId',
        header: 'Issued By',
        parsedData: (val) => {
          return users.find((u) => u.value == val)?.label;
        },
        sortable: true,
        filter: [],
      },
      {
        field: 'contractId',
        header: 'Contract Id',
        sortable: true,
        filter: [],
      },
      {
        field: 'comments',
        header: 'Comments',
        sortable: true,
        filter: [],
      },
    ];
  }
}
