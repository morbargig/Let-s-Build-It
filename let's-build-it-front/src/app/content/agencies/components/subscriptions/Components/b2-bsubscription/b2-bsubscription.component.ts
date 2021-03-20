import { Component, OnInit } from '@angular/core';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { FilterObject, LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { TableColumn } from '@app/@ideo/components/table/models/table-column';
import { MatchMode, TableFilter } from '@app/@ideo/components/table/models/table-filter';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { SideBarPageService } from '@app/@shared/components/side-bar-page/isidibar-service.interface';
import { TablePageDirective } from '@app/@shared/directives/table-page.directive';
import { ImportConfig } from '@app/@shared/models/import.config';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { PaymentPlanType } from '@app/@shared/models/payment-plan.model';
import { PaymentPlansService } from '@app/content/configuration/modules/payment-plans/payment-plans.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { PartnerB2BSubscriptionModel } from '../../../../../../@shared/models/partner-b2b-subscription.model';
import { PartnerB2BSubscriptionService } from '../../services/partner-b2-b-subscription.service';
import { BillingPeriod } from '../../../../../../@shared/interfaces/billing-period.enum';
import { Router } from '@angular/router';
import { SelectFilterComponent } from '../../../../../../@ideo/components/table/table-filters/select-filter/select-filter.component';
import { FleetsService } from '../../../../../fleets/services/fleets.service';
import { map } from 'rxjs/operators';
import { MultiselectFilterComponent } from '../../../../../../@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { TextFilterComponent } from '../../../../../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { NumericFilterComponent } from '../../../../../../@ideo/components/table/table-filters/numeric-filter/numeric-filter.component';

@Component({
  selector: 'prx-b2-bsubscription',
  templateUrl: './b2-bsubscription.component.html',
  styleUrls: ['./b2-bsubscription.component.scss'],
})
export class B2BSubscriptionComponent extends TablePageDirective<PartnerB2BSubscriptionModel> implements OnInit {
  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<PartnerB2BSubscriptionModel>> {
    return this.b2BSubscriptionService.getAll(this.sidebarService.entity.id, evt);
  }
  public deleteEntity(item: PartnerB2BSubscriptionModel): Observable<any> {
    throw new Error('Method not implemented.');
  }
  public importConfig?: ImportConfig;
  public columns: TableColumn<PartnerB2BSubscriptionModel>[];
  public pageActions: ButtonItem<any>[] = [
    {
      title: 'Edit subscription',
      click: () => {},
    },
  ];
  public filters: TableFilter[];
  public itemActions: ButtonItem<PartnerB2BSubscriptionModel>[];
  public billingItems: SelectItem[];

  constructor(
    modalService: BsModalService,
    notificationsService: NotificationsService,
    private b2BSubscriptionService: PartnerB2BSubscriptionService,
    private sidebarService: SideBarPageService,
    router: Router,
    private partnerFleetsService: FleetsService,
    private paymentPlansService: PaymentPlansService
  ) {
    super(modalService, true, notificationsService, router);
  }

  ngOnInit(): void {
    this.paymentPlansService
      .getAll({ page: 1, pageSize: 1 })
      .toPromise()
      .then((res) => {
        this.billingItems = [
          {
            label: 'Billing Period',
            value:
              res?.data?.[0].selectedPlan == PaymentPlanType.Fixed
                ? BillingPeriod[res?.data?.[0]?.fixedPaymentBillingPeriod]
                : BillingPeriod[res?.data?.[0]?.revenueFeesBillingPeriod],
          } as SelectItem,
          { label: 'Billing Date', value: this.sidebarService.entity.billingDate } as SelectItem,
        ];
      });
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
        header: 'Plan Name',
        sortable: true,
        filter: [{ name: 'Name', type: TextFilterComponent, placeholder: 'Plan Name' }],
      },
      {
        field: 'fee',
        header: 'Subscription Fee',
        sortable: true,
        filter: [{ name: 'Fee', type: NumericFilterComponent, placeholder: 'Fee' }],
      },
      {
        field: 'discountPrecentage',
        header: 'Discount',
        sortable: true,
        filter: [{ name: 'DiscountPrecentage', type: NumericFilterComponent, placeholder: 'Discount' }],
      },

      {
        field: 'revenueRange',
        header: 'Revenue Range',
        sortable: true,
        filter: [
          { name: 'RevenueStart', type: NumericFilterComponent, placeholder: 'Revenue Start' },
          { name: 'RevenueEnd', type: NumericFilterComponent, placeholder: 'Revenue End' },
        ],
        parsedFullData: (item: PartnerB2BSubscriptionModel) => {
          return `${item.revenueStart}-${item.revenueEnd}K`;
        },
      },
    ];
  }
}
