import { Component, OnInit } from '@angular/core';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { TablePageDirective } from '@app/@shared/directives/table-page.directive';
import { CarModel } from '@app/@shared/models/car.model';
import { CarProfileService } from '../../car-profile.service';
import { CarAccidentModel } from '../../../../../../@shared/models/car-accident.model';
import { ImportConfig } from '@app/@shared/models/import.config';
import { TableColumn, TableColumnType } from '@app/@ideo/components/table/models/table-column';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { TableFilter } from '@app/@ideo/components/table/models/table-filter';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { AccidentsService } from './accidents.service';
import { CalendarFilterComponent } from '@app/@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { UsersService } from '@app/content/users/services/users.service';
import { map } from 'rxjs/operators';
import { MultiselectFilterComponent } from '@app/@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { SideBarPageService } from '@app/@shared/components/side-bar-page/isidibar-service.interface';

@Component({
  selector: 'prx-accidents',
  templateUrl: './accidents.component.html',
  styleUrls: ['./accidents.component.scss'],
})
export class AccidentsComponent extends TablePageDirective<CarAccidentModel> implements OnInit {
  public importConfig?: ImportConfig;
  public columns: TableColumn<CarAccidentModel>[];
  public pageActions: ButtonItem<any>[];
  public filters: TableFilter[];
  public itemActions: ButtonItem<CarAccidentModel>[] = [
    { label: 'Details', click: (item) => this.router.navigate(['./', item.id], { relativeTo: this.route }) },
  ];

  public dropdownActions: SelectItem[] = [
    { label: 'Report Damage', value: 'Damage-Report' },
    { label: 'Report Accident', value: 'Accident-Report' },
  ];

  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<CarAccidentModel>> {
    return this.accidentsService.getAll(this.car.id, evt);
  }
  public deleteEntity(item: CarAccidentModel): Observable<any> {
    throw new Error('Method not implemented.');
  }

  constructor(
    private sidebarPageService: SideBarPageService,
    router: Router,
    private route: ActivatedRoute,
    private accidentsService: AccidentsService,
    private usersService: UsersService,
    modalService: BsModalService,
    notificationsService: NotificationsService
  ) {
    super(modalService, true, notificationsService, router);
  }
  private users$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  ngOnInit(): void {
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
      .subscribe((res) => this.users$.next(res));
    this.columns = [
      {
        field: 'id',
        header: 'Accient Id',
        sortable: true,
      },
      {
        field: 'date',
        header: 'Date',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'Date', type: CalendarFilterComponent, placeholder: 'Date' }],
      },
      {
        field: 'createUser',
        header: 'Reporter',
        sortable: true,
        filter: [
          {
            name: 'CreateUser',
            type: MultiselectFilterComponent,
            placeholder: 'Reporter',
            asyncOptions: this.users$,
          },
        ],
      },
      {
        field: 'location',
        header: 'Location',
        sortable: true,
      },
      {
        field: 'comments',
        header: 'Description',
        sortable: true,
      },
    ];
  }

  public get car(): CarModel {
    return this.sidebarPageService.entity;
  }
}
