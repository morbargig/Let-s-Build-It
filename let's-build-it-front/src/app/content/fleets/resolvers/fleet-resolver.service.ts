import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SideBarPageService } from '@app/@shared/components/side-bar-page/isidibar-service.interface';
import { Observable } from 'rxjs';
import { EntityDetailsModel } from '../../../@shared/components/side-bar-page/entity-details/entity-details.component';
import { SideBarConfig } from '../../../@shared/components/side-bar-page/sidebar.config';
import { PartnerFleetModel } from '../../../@shared/models/partner-fleet.model';
import { FleetsService } from '../services/fleets.service';
import { AccountService } from '../../../@shared/services/account.service';

@Injectable({
  providedIn: 'root'
})
export class FleetResolverService implements Resolve<SideBarConfig<PartnerFleetModel>> {

  constructor(private fleetsService: FleetsService, private date: DatePipe, private accountService: AccountService) { }
  // constructor(private date: DatePipe) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): SideBarConfig<PartnerFleetModel> | Observable<SideBarConfig<PartnerFleetModel>> | Promise<SideBarConfig<PartnerFleetModel>> {

    return {
      backLink: { label: 'Fleet', value: '../../' },
      breadcrumbs: [],
      getEntityById: (id, params) => {
        if (!!params?.partnerId) {
          return this.fleetsService.get(params['partnerId'], id);
        } else if (!!this.accountService.partnerId) {
          return this.fleetsService.get(this.accountService.partnerId, this.accountService.partnerFleetIds?.[0]);
        }
      },
      getEntityDetails: (fleet: PartnerFleetModel) => {
        return {
          mediaId: fleet.logoImgId,
          title: fleet.name,
          subTitle: [`HQ: ${fleet.address}`, `Phone:  ${fleet.phone}`],
          rightValues: [
            { label: 'Status', value: fleet.status ? 'Active' : 'InActive' },
            { label: 'Added', value: this.date.transform(fleet.created, 'mediumDate') },
          ]
        } as EntityDetailsModel
      },
      sidebarItems: [
        // {
        //   label: 'Damages', value: 'damages', icon: 'damages'
        // },
        // {
        //   label: 'Accidents', value: 'accidents', icon: 'accidents'
        // },
        {
          label: 'Summary', value: 'summary', icon: 'summary'
        },
        {
          label: 'Users Management', value: 'user-management', icon: 'user', permission: { values: ["AccessAgencyUsers"] }
        },
        {
          label: 'Subscription', value: 'subscriptions', icon: 'subscription', permission: { values: ["AccessAgencyB2BSubsriptions", "AccessAgencyB2CSubsriptions"] }
        },
        {
          label: 'Discounts And Charges', value: 'discounts-and-charges', icon: 'discounts'
        },
        {
          label: 'Ancillaries', value: 'ancillaries', icon: 'ancillaries', permission: { values: ["AccessAgencyAncillaries"] }
        },
        {
          label: 'Zones', value: 'zones', icon: 'zones'
        },
        {
          label: 'Reports', value: 'reports', icon: 'reports'
        },

      ]

    } as SideBarConfig<PartnerFleetModel>
  }
}
