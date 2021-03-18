import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TabsPageConfig } from '../../../../@shared/components/tabs-page/tabs-page.config';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsResolverService implements Resolve<TabsPageConfig> {

  constructor() { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): TabsPageConfig | Observable<TabsPageConfig> | Promise<TabsPageConfig> {
    return {
      tabs: [
        { label: 'B2C', value: 'b2c', permission: { values: ["AccessAgencyB2CSubsriptions"] } },
        { label: 'B2B', value: 'b2b', permission: { values: ["AccessAgencyB2BSubsriptions"] } },
      ],
    } as TabsPageConfig;
  }
}
