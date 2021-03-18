import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { BasePageConfig } from '../../../../@shared/models/base-page.config';
import { UserModel } from '../../../../@shared/models/user.model';
import { TextFilterComponent } from '../../../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { TableColumnType } from '../../../../@ideo/components/table/models/table-column';
import { of, throwError } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { CalendarFilterComponent } from '../../../../@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { RelatedFilterComponent } from '../../../../@ideo/components/table/table-filters/related-filter/related-filter.component';
import { SelectFilterComponent } from '../../../../@ideo/components/table/table-filters/select-filter/select-filter.component';
import { MultiselectFilterComponent } from '@app/@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { AccountService } from '@app/@shared/services/account.service';
import { map, filter } from 'rxjs/operators';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { MatchMode } from '@app/@ideo/components/table/models/table-filter';
import { LazyLoadEvent } from '../../../../@ideo/components/table/events/lazy-load.event';
import { ComponentDataStore } from '../../../../@shared/models/components-data-store';
import { UserFormComponentResolverService } from './users-form.component.resolver';
import { Location } from '@angular/common';
import { ImportConfig } from '../../../../@shared/models/import.config';

@Injectable({
  providedIn: 'root',
})
export class UsersComponentResolverService implements Resolve<BasePageConfig<any>> {
  constructor(
    private usersService: UsersService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  private dataStore: ComponentDataStore<UserModel>;
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BasePageConfig<UserModel> {
    const columns = [
      {
        field: 'userName',
        header: 'UserName',
        sortable: true,
        filter: [{ name: 'UserName', type: TextFilterComponent, placeholder: 'UserName' }],
      },
      {
        field: 'firstName',
        header: 'First Name',
        sortable: true,
        filter: [{ name: 'FirstName', type: TextFilterComponent, placeholder: 'First Name' }],
      },
      {
        field: 'lastName',
        header: 'Last Name',
        sortable: true,
        filter: [{ name: 'LastName', type: TextFilterComponent, placeholder: 'Last Name' }],
      },
      {
        field: 'email',
        header: 'Email',
        sortable: true,
        filter: [{ name: 'Email', type: TextFilterComponent, placeholder: 'Email' }],
      },
      {
        field: 'isLicenceVerified',
        header: 'Licence',
        sortable: false,
        type: TableColumnType.Boolean,
        filter: [
          {
            name: 'Licences',
            type: RelatedFilterComponent,
            placeholder: 'Licence Number',
            innerFilter: {
              name: 'LicenceNumber',
              type: TextFilterComponent,
              placeholder: 'Licence Number',
            },
          },
        ],
      },
      {
        field: 'lastSeen',
        header: 'Last Seen',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'LastSeen', type: CalendarFilterComponent, placeholder: 'Last Seen' }],
      },
      {
        field: 'CreateDate',
        header: 'Created',
        sortable: true,
        type: TableColumnType.DateTime,
        sorts: ['CreateDate'],
        filter: [{ name: 'CreateDate', type: CalendarFilterComponent, placeholder: 'Created' }],
      },
      { field: 'IsTestUser', header: 'Test User', sortable: true, type: TableColumnType.Boolean },
    ];

    const formControls = new UserFormComponentResolverService(
      this.usersService,
      this.accountService,
      this.location,
      null
    ).generate(false)[0].group;

    return new BasePageConfig({
      columns: columns,
      deleteEntity: (evt) => throwError('Not implemented exception'),
      getDataProvider: (evt) => {
        evt.filters['Roles'] = {
          matchMode: MatchMode.Any,
          'Role.Name': {
            matchMode: MatchMode.Equals,
            value: 'Customer',
          },
          innerFilter: {
            'Role.Name': {
              matchMode: MatchMode.Equals,
              value: 'Customer',
            }
          }
        }

        return this.usersService.getAll(evt);
      },
      createLabel: 'Create Customer',
      formRoute: 'users',
      registerDataStore: (ds) => {
        this.dataStore = ds;
      },
      title: 'Customers',
      preTitle: 'Users Managment',
      editAction: (item: UserModel) => {
        this.router.navigate(['/users', item.id]);
      },
      createAction: () => {
        this.router.navigate(['/users', 'create']);
      },
      importConfig: new ImportConfig({
        downloadTemplate: 'api/users/template',
        parseDataUrl: () => null,
        import: (model: any) => of(null),
        columns: columns,
        controls: formControls,
      }),
      itemActions: [
        {
          styleClass: 'btn-outline-success ml-2',
          tooltip: 'Profile',
          icon: 'fas fa-user',
          click: (item, btn) => { this.router.navigate([`/users/${item.id}`, "profile"]) },
        },
      ],
      permissions: {
        create: ['CreateUsers'],
        edit: ['EditUsers'],
        delete: ['DeleteUsers'],
      },
      stateKey: 'customers-table',
    });
  }
}
