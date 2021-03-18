import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { MultiselectFilterComponent } from '@app/@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { ImportConfig } from '@app/@shared/models/import.config';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableColumn, TableColumnType } from '../../@ideo/components/table/models/table-column';
import { CalendarFilterComponent } from '../../@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { NumericFilterComponent } from '../../@ideo/components/table/table-filters/numeric-filter/numeric-filter.component';
import { TextFilterComponent } from '../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { BasePageConfig } from '../../@shared/models/base-page.config';
import { PartnerModel } from '../../@shared/models/partner.model';
import { PartnersService } from '../agencies/partners.service';
import { UsersService } from '../users/services/users.service';
import { PartnerFormService } from './partner-form.service';

@Injectable({
  providedIn: 'root',
})
export class PartnersResolverService implements Resolve<BasePageConfig<any>> {
  constructor(
    private partnersService: PartnersService,
    private router: Router,
    private usersService: UsersService,
    private partnerFormService: PartnerFormService
  ) {}
  private users$: BehaviorSubject<SelectItem[]>;
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<BasePageConfig<PartnerModel>> {
    let users = await this.usersService
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
      .toPromise();
    if (!!this.users$) {
      this.users$.next(users);
    } else {
      this.users$ = new BehaviorSubject<SelectItem[]>(users);
    }
    const columns: TableColumn[] = [
      {
        field: 'name',
        header: 'Name',
        sortable: true,
        filter: [{ name: 'Name', type: TextFilterComponent, placeholder: 'Name' }],
      },
      {
        field: 'companyExternalId',
        header: 'Company External Id',
        sortable: true,
        filter: [{ name: 'CompanyExternalId', type: NumericFilterComponent, placeholder: 'Company External Id' }],
      },
      {
        field: 'vatId',
        header: 'Vat Id',
        sortable: true,
        filter: [{ name: 'VatId', type: TextFilterComponent, placeholder: 'Vat Id' }],
      },
      {
        field: 'phone',
        header: 'Phone',
        sortable: true,
        filter: [{ name: 'Phone', type: TextFilterComponent, placeholder: 'Phone' }],
      },
      {
        field: 'email',
        header: 'Email',
        sortable: true,
        filter: [{ name: 'Email', type: TextFilterComponent, placeholder: 'Email' }],
      },
      {
        field: 'address',
        header: 'Address',
        sortable: true,
        filter: [{ name: 'Address', type: TextFilterComponent, placeholder: 'Address' }],
      },
      { field: 'status', header: 'Status', sortable: true, type: TableColumnType.Boolean },
      {
        field: 'createUserId',
        header: 'Create User',
        sortable: true,
        hidden: true,
        filter: [
          {
            name: 'CreateUserId',
            type: MultiselectFilterComponent,
            placeholder: 'Create User',
            asyncOptions: this.users$,
          },
        ],
      },
      {
        field: 'updateUserId',
        header: 'Update User',
        sortable: true,
        hidden: true,
        filter: [
          {
            name: 'UpdateUserId',
            type: MultiselectFilterComponent,
            placeholder: 'Update User',
            asyncOptions: this.users$,
          },
        ],
      },
      {
        field: 'logoImgId',
        header: 'Logo',
        type: TableColumnType.Image,
      },
      {
        field: 'createDate',
        header: 'Create Date',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'CreateDate', type: CalendarFilterComponent, placeholder: 'Create Date' }],
      },
      {
        field: 'updateDate',
        header: 'Update Date',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'UpdateDate', type: CalendarFilterComponent, placeholder: 'Update Date' }],
      },
      {
        field: 'id',
        hidden: true,
        filter: [],
      },
    ];
    const formControls = this.partnerFormService.generate(true)[0].group;
    return new BasePageConfig({
      columns: columns,
      deleteEntity: (evt) => this.partnersService.delete(evt.id),
      getDataProvider: (evt) => this.partnersService.getAll(evt),
      createLabel: 'Create Partner',
      formRoute: 'users',
      title: 'Partners',
      preTitle: 'Agencies',
      editAction: (item: PartnerModel) => {
        this.router.navigate(['/agencies', item.id]);
      },
      createAction: () => {
        this.router.navigate(['/agencies', 'create']);
      },
      importConfig: new ImportConfig({
        downloadTemplate: 'api/partners/template',
        parseDataUrl: () => null,
        import: (model: PartnerModel[]) => this.partnersService.bulk(model),
        columns: columns,
        controls: formControls,
      }),
      itemActions: [
        {
          styleClass: 'btn-outline-success ml-2',
          tooltip: 'Details',
          icon: 'fas fa-handshake',
          click: (item, btn) => {
            this.router.navigate(['/agencies', item.id, 'profile']);
          },
        },
      ],
      permissions: {
        create: ['CreateAgencies'],
        edit: ['EditAgencies'],
        delete: ['DeleteAgencies'],
      },
      stateKey: 'partners-table',
    });
  }
}
