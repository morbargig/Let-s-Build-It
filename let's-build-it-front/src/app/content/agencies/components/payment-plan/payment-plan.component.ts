import { Component, OnInit } from '@angular/core';
import { SideBarPageService } from '@app/@shared/components/side-bar-page/isidibar-service.interface';
import { PaymentPlanModel } from '@app/@shared/models/payment-plan.model';
import { PaymentPlansService } from '../../../configuration/modules/payment-plans/payment-plans.service';
import { take } from 'rxjs/operators';
import { SelectItem } from '../../../../@ideo/components/table/models/select-item';
import { SymbolModel } from '@app/@shared/models/symbol.model';


@Component({
  selector: 'prx-payment-plan',
  templateUrl: './payment-plan.component.html',
  styleUrls: ['./payment-plan.component.scss'],
})
export class PaymentPlanComponent implements OnInit {
  public trialItems: SelectItem[];
  public fixedItems: SelectItem[];
  public revenueItems: SelectItem[];
  public vehicleRentItems: SelectItem[];
  public subscriptionItems: SelectItem[];

  public get partner() {
    return this.sidebarService.entity
  }

  public trialDaysLeft: number = null;

  public partnerPaymentPlan: PaymentPlanModel;

  constructor(
    private sidebarService: SideBarPageService,
    private paymentPlansService: PaymentPlansService,
  ) {
    this.sidebarService.breadcrumbs = [
      { label: 'Agencies', url: '../../' },
      { label: this.sidebarService.entity.name, url: './' },
      { label: 'Payment Plan', },
    ]
    let { paymentPlanId } = this.sidebarService.entity
    if (!!paymentPlanId) {
      this.paymentPlansService.get(paymentPlanId).pipe(take(1)).subscribe(res => {
        this.partnerPaymentPlan = res
        this.setSelectedItems()
      })
    }
  }

  getDifferenceInDays(date: Date): number {
    if (date) {
      try {
        this.trialDaysLeft = Math.floor(Math.abs(new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      }
      catch {
        return
      }
    }
  }

  setSelectedItems(): void {
    this.getDifferenceInDays(this.partnerPaymentPlan?.trialPeriodEnd)
    this.trialItems = [
      {
        // value: this.partnerPaymentPlan?.trialPeriodEnd ,
        value: 14, // TODO update with real data
        label: 'Trial Duration (Days)',
      },
    ]

    this.revenueItems = [
      {
        label: 'Billing Period',
        value: this.partnerPaymentPlan?.revenueFeesBillingPeriod
      }
    ]

    this.vehicleRentItems = [
      {
        value: this.partnerPaymentPlan?.vehicleBaseRentFees,
        label: 'Base Price Fees (%)',
      }, {
        value: this.partnerPaymentPlan?.vehicleExtraFees,
        label: 'Extra Fees (%)',
      }, {
        value: this.partnerPaymentPlan?.vehicleAncillaries,
        label: 'Ancillaries (%)',
      },
    ]
    this.subscriptionItems = [
      {
        value: this.partnerPaymentPlan?.subscriptionB2BFees,
        label: 'B2B Fees (%)',
      }, {
        value: this.partnerPaymentPlan?.subscriptionB2CFees,
        label: 'B2C Fees (%)',
      },
    ]

    this.fixedItems = [
      {
        value: this.partnerPaymentPlan?.fixedPaymentAmount,
        label: `Payment (${SymbolModel.NIS})`,
      },
      {
        value: this.partnerPaymentPlan?.fixedPaymentBillingPeriod,
        label: 'Billing Period',
      },
    ]
  }

  ngOnInit(): void {
    this.setSelectedItems()
  }
}
