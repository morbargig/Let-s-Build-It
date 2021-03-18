import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { SideBarConfig } from '@app/@shared/components/side-bar-page/sidebar.config';
import { Observable } from 'rxjs';
import { PartnerModel } from '../../@shared/models/partner.model';
import { PartnersService } from './partners.service';
import { DatePipe } from '@angular/common';
import { EntityDetailsModel } from '@app/@shared/components/side-bar-page/entity-details/entity-details.component';
import { IdeoIconModel } from '../../@shared/models/ideo-icon.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerAgencyResolverService implements Resolve<SideBarConfig<PartnerModel>> {

  constructor(private partnersService: PartnersService, private router: Router, private date: DatePipe) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): SideBarConfig<PartnerModel> | Observable<SideBarConfig<PartnerModel>> | Promise<SideBarConfig<PartnerModel>> {
    return {
      backLink: { label: 'Partner Agency', value: '/agencies' },
      breadcrumbs: [],
      getEntityById: id => this.partnersService.get(id),
      getEntityDetails: (partner: PartnerModel) => {
        return {
          mediaId: partner.logoImgId,
          title: partner.name,
          subTitle: [`HQ: ${partner.address}`, `Phone:  ${partner.phone}`],
          rightValues: [
            { label: 'Status', value: partner.status ? 'Active' : 'InActive' },
            { label: 'Added', value: this.date.transform(partner.createDate, 'mediumDate') },
            { label: 'Vehicles', value: partner.vehiclesCount }
          ]
        } as EntityDetailsModel
      },
      sidebarItems: [
        {
          label: 'Summary', value: 'summary', icon: 'summary'
        },
        {
          label: 'General', value: 'general', icon: 'general'
        },
        {
          label: 'Fleets', value: 'fleets', icon: 'fleet'
        },
        {
          label: 'Payment Methods', value: 'payment-methods', icon: 'payment', permission: { values: ["AccessAgencyBankAccount", "AccessAgencyContacts"] }
        },
        {
          label: 'Users Management', value: 'user-management', icon: 'user', permission: { values: ["AccessAgencyUsers"] }
        },
        {
          label: 'Payment Plan', value: 'payment-plan', icon: 'plan', permission: { values: ["AccessPaymentPlans"] }
        },
        {
          label: 'Subscription', value: 'subscriptions', icon: 'subscription', permission: { values: ["AccessAgencyB2BSubsriptions", "AccessAgencyB2CSubsriptions"] }
        },
        {
          label: 'Discounts & Charges', value: 'discounts-and-charges', icon: 'invoices', permission: { values: ["AccessAgencyDiscounts", "AccessAgencyCharges"] }
        },
        {
          label: 'Ancillaries', value: 'ancillaries', icon: 'ancillaries', permission: { values: ["AccessAgencyAncillaries"] }
        },
        {
          label: 'Inventory', value: 'inventory', icon: 'inventory', permission: { values: ["AccessAgencyFleetInventories"] }
        },
        {
          label: 'Zones', value: 'zones', icon: 'zones', permission: { values: ["AccessAgencyFleetParkings"] }
        },
        {
          label: 'Reports', value: 'reports', icon: 'reports'
        },
        {
          label: 'Prices', value: 'tariff', icon: 'invoices', permission: { values: ["AccessAgencyPrices"] }
        },
      ]
    } as SideBarConfig<PartnerModel>
  }
}
