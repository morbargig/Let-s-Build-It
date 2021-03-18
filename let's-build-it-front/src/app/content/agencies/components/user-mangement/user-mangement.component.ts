import { Component, OnInit } from '@angular/core';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { TableColumn } from '@app/@ideo/components/table/models/table-column';
import { MatchMode, TableFilter } from '@app/@ideo/components/table/models/table-filter';
import { MultiselectFilterComponent } from '@app/@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { RelatedFilterComponent } from '@app/@ideo/components/table/table-filters/related-filter/related-filter.component';
import { TextFilterComponent } from '@app/@ideo/components/table/table-filters/text-filter/text-filter.component';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { SideBarPageService } from '@app/@shared/components/side-bar-page/isidibar-service.interface';
import { TablePageDirective } from '@app/@shared/directives/table-page.directive';
import { ImportConfig } from '@app/@shared/models/import.config';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { AccountService } from '@app/@shared/services/account.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from '@app/content/users/services/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarFilterComponent } from '../../../../@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { UserManamenntService } from './user-manamennt.service';
import { UserManagementModel } from '../../../../@shared/models/user-management.model';
import { TableColumnType } from '../../../../@ideo/components/table/models/table-column';



@Component({
  selector: 'prx-user-mangement',
  templateUrl: './user-mangement.component.html',
  styleUrls: ['./user-mangement.component.scss'],
})
export class UserMangementComponent extends TablePageDirective<UserManagementModel> implements OnInit {
  public importConfig?: ImportConfig;
  public columns: TableColumn<UserManagementModel>[];
  public pageActions: ButtonItem<any>[];
  public filters: TableFilter[];
  public itemActions: ButtonItem<UserManagementModel>[] = [
    {
      tooltip: 'Edit',
      icon: 'fas fa-edit',
      styleClass: 'btn-outline-primary ml-2',
      click: (item) => {
        this.router.navigate(['edit', item.id], { relativeTo: this.route })
      },
    },
    {
      tooltip: 'Delete',
      icon: 'fas fa-trash',
      permission: { values: ['DeleteAgencyUsers'] },
      click: (item) => {
        this.deleteItem(item);
      },
      styleClass: 'btn-outline-danger ml-2',
    },
  ];

  constructor(private sidebarService: SideBarPageService,
    private userManagmentsService: UserManamenntService,
    private accountService: AccountService,
    private modalUserService: BsModalService,
    private route: ActivatedRoute,
    router: Router,
    modalService: BsModalService,
    notificationsService: NotificationsService,) {
    super(modalService, true, notificationsService, router);
    this.sidebarService.breadcrumbs = [
      { label: 'Agencies', url: '../../' },
      { label: this.sidebarService.entity.name, url: './' },
      { label: 'User Management' },
    ];
  }

  ngOnInit(): void {
    this.columns = [
      {
        field: 'profileImageId',
        header: 'Avatar',
        sortable: false,
        type: TableColumnType.Image
      },
      {
        field: 'fullName',
        header: 'Name',
        sortable: true,
        type: TableColumnType.Link,
        href: (evt, full) => {
          return [
            '/users', full.id, 'profile'
          ];
        },
        parsedFullData: (u) => `${u.firstName} ${u.lastName}`,
        filter: [{ name: 'FullName', type: TextFilterComponent, placeholder: 'Enter name' }],
      },
      {
        field: 'email',
        header: 'Email',
        sortable: true,
        filter: [{ name: 'Email', type: TextFilterComponent, placeholder: 'Enter email' }],
      },
      {
        field: 'phone',
        header: 'Phone',
        sortable: true,
        filter: [{ name: 'Phone', type: TextFilterComponent, placeholder: 'Enter phone' }],
      },
      {
        field: 'lastSeen',
        header: 'Last Seen',
        sortable: true,
        filter: [{ name: 'Phone', type: CalendarFilterComponent, placeholder: 'Last Seen' }],
      },
      {
        field: 'role',
        header: 'Role',
        sorts: ['Roles.Role.Name'],
        sortable: true,
        filter: [
          {
            name: 'Roles',
            type: RelatedFilterComponent,
            innerFilter: {
              name: 'Role.Name',
              type: MultiselectFilterComponent,
              placeholder: 'Roles',
              matchMode: MatchMode.Equals,
              asyncOptions: this.accountService.getRoles().pipe(
                map((r) =>
                  r.map((a) => {
                    return {
                      value: a.name,
                      label: a.name,
                    } as SelectItem;
                  }).filter(x => ['Admin', 'CarOwner', 'Customer'].indexOf(x.label) < 0)
                )
              ),
            },
          },
        ],
      },
      {
        field: 'created',
        header: 'Create date',
        sortable: true,
        filter: [],
      },
      // {
      //   field: 'tags',
      //   header: 'Tags',
      //   sortable: true,
      //   filter: [{
      //     name: 'State',
      //     type: MultiselectFilterComponent,
      //     placeholder: 'Select tags'
      //   }],
      // },
    ]
  }

  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<UserManagementModel>> {

    // evt.filters['Partners'] = {
    //   value: null,
    //   matchMode: MatchMode.Any,
    //   'PartnerId': {
    //     value: this.sidebarService.entity.id,
    //     matchMode: MatchMode.Equals
    //   },
    //   innerFilter: {
    //     'PartnerId': {
    //       value: this.sidebarService.entity.id,
    //       matchMode: MatchMode.Equals,
    //     }
    //   }
    // };

    evt.filters['Roles'] = !evt.filters['Roles'] ? {
      value: null,
      matchMode: MatchMode.Any,
      'Role.Name': {
        value: 'Customer',
        matchMode: MatchMode.NotEquals
      },
      innerFilter: {
        'Role.Name': {
          value: 'Customer',
          matchMode: MatchMode.NotEquals
        }
      }
    } : evt.filters['Roles'];
    return this.userManagmentsService.getAll(this.sidebarService.entity.id, evt);
  }

  public deleteEntity(item: UserManagementModel): Observable<any> {
    return this.userManagmentsService.delete(this.sidebarService.entity.id, item.id);
  }


}
