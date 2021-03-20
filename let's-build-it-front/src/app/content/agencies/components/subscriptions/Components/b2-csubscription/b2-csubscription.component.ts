import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { FilterObject, LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { TableColumn, TableColumnType } from '@app/@ideo/components/table/models/table-column';
import { MatchMode, TableFilter } from '@app/@ideo/components/table/models/table-filter';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { SideBarPageService } from '@app/@shared/components/side-bar-page/isidibar-service.interface';
import { TablePageDirective } from '@app/@shared/directives/table-page.directive';
import { BillingPeriod } from '@app/@shared/interfaces/billing-period.enum';
import { ImportConfig } from '@app/@shared/models/import.config';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { PartnerB2CSubscriptionModel } from '@app/@shared/models/partner-b2c-subscription.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { PartnerB2CSubscriptionService } from '../../services/partner-b2-c-subscription.service';
import { Router, ActivatedRoute } from '@angular/router';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { SelectFilterComponent } from '@app/@ideo/components/table/table-filters/select-filter/select-filter.component';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { MultiselectFilterComponent } from '@app/@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { map } from 'rxjs/operators';
import { FleetsService } from '../../../../../fleets/services/fleets.service';
import { NumericFilterComponent } from '../../../../../../@ideo/components/table/table-filters/numeric-filter/numeric-filter.component';
import { TextFilterComponent } from '../../../../../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { asSelectItem } from '../../../../../../prototypes';
import { CheckboxFilterComponent } from '../../../../../../@ideo/components/table/table-filters/checkbox-filter/checkbox-filter.component';
import { BooleanFilterComponent } from '../../../../../../@ideo/components/table/table-filters/boolean-filter/boolean-filter.component';

@Component({
  selector: 'prx-b2-csubscription',
  templateUrl: './b2-csubscription.component.html',
  styleUrls: ['./b2-csubscription.component.scss'],
})
export class B2CSubscriptionComponent extends TablePageDirective<PartnerB2CSubscriptionModel> implements OnInit {
  public importConfig?: ImportConfig;
  public columns: TableColumn<PartnerB2CSubscriptionModel>[];
  public pageActions: ButtonItem<any>[];
  public filters: TableFilter[];
  public itemActions: ButtonItem<PartnerB2CSubscriptionModel>[] = [
    {
      tooltip: 'Edit',
      icon: 'fas fa-edit',
      styleClass: 'btn-outline-primary ml-2',
      click: (item) => {
        this.router.navigate(['edit', item.id], { relativeTo: this.route });
      },
    },
    {
      tooltip: 'Delete',
      icon: 'fas fa-trash',
      permission: { values: ['DeleteAgencyFleetParkings'] },
      hidden: (item) => !!item.customersCount,
      click: (item) => {
        this.deleteItem(item);
      },
      styleClass: 'btn-outline-danger ml-2',
    },
    {
      tooltip: 'Disable',
      icon: 'fas fa-lock',
      permission: { values: ['DeleteAgencyFleetParkings'] },
      hidden: (item) => !item.isActive && !item.customersCount,
      click: (item) => {
        this.deleteItem(
          item,
          `As '${item.name}' has attached Customers please select another Subscription plan to move all current Customers.`
        );
      },
      styleClass: 'btn-outline-danger ml-2',
    },
  ];
  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<PartnerB2CSubscriptionModel>> {
    return this.b2CSubscriptionService.getAll(this.sidebarService.entity.id, evt);
  }
  public deleteEntity(item: PartnerB2CSubscriptionModel): Observable<any> {
    if (!!item.customersCount) {
      this.router.navigate(['assign', item.id], { relativeTo: this.route });
      return of(null);
    } else {
      return this.b2CSubscriptionService.delete(this.sidebarService.entity.id, item.id);
    }
  }

  constructor(
    modalService: BsModalService,
    notificationsService: NotificationsService,
    router: Router,
    private route: ActivatedRoute,
    private partnerFleetsService: FleetsService,
    private b2CSubscriptionService: PartnerB2CSubscriptionService,
    private sidebarService: SideBarPageService
  ) {
    super(modalService, true, notificationsService, router);
  }

  ngOnInit(): void {
    this.columns = [
      {
        field: 'fleetId',
        header: 'Fleet',
        sortable: true,
        permission: { roles: ['Admin', 'PartnerAdmin'] },
        filter: [
          {
            type: MultiselectFilterComponent,
            permission: { roles: ['Admin', 'PartnerAdmin'] },
            queryFilters: (query) => {
              return {
                Name: {
                  value: query,
                  matchMode: MatchMode.Contains,
                },
              } as FilterObject;
            },
            lazyOptions: (evt) => {
              evt.sorts = ['Name'];
              evt.sortDirection = 'asc';
              return this.partnerFleetsService.getAll(this.sidebarService.entity.id, evt).pipe(
                map((r) => {
                  let val = {
                    data: r?.data?.map((a) => {
                      return {
                        value: a.id,
                        label: a.name,
                        // icon: a.logoImgId,
                      } as SelectItem;
                    }),
                    total: r.total,
                  };
                  return val;
                })
              );
            },
          },
        ],
      },
      {
        field: 'name',
        header: 'Subscription',
        sortable: true,
        filter: [{ name: 'Name', type: TextFilterComponent, placeholder: 'Plan Name' }],
      },
      {
        field: 'discountPrecentage',
        header: 'Discount',
        sortable: true,
        filter: [{ name: 'DiscountPrecentage', type: NumericFilterComponent, placeholder: 'Discount' }],
      },
      {
        field: 'payment',
        header: 'Payment',
        sortable: true,
        filter: [{ name: 'Payment', type: NumericFilterComponent, placeholder: 'Payment' }],
      },
      {
        field: 'billingPeriod',
        header: 'Billing Period',
        filter: [
          {
            name: 'BillingPeriod',
            type: SelectFilterComponent,
            placeholder: 'Billing Period',
            options: asSelectItem(BillingPeriod),
          },
        ],
        parsedData: (val) => {
          return val != null ? BillingPeriod[val] : '';
        },
        sortable: true,
      },
      {
        field: 'billingDayOfMonth',
        header: 'Billing Period',
        sortable: true,
        filter: [{ name: 'BillingDayOfMonth', type: NumericFilterComponent, placeholder: 'Billing Period' }],
      },
      {
        field: 'isActive',
        header: 'Status',
        type: TableColumnType.Boolean,
        sortable: true,
        filter: [{ name: 'IsActive', type: BooleanFilterComponent, value: true, placeholder: 'Status' }],
      },
      {
        field: 'customersCount',
        header: 'Customers',
        sortable: true,
        filter: null,
      },
      {
        field: 'description',
        header: 'Description',
        sortable: true,
        filter: null,
      },
    ];
  }
}
