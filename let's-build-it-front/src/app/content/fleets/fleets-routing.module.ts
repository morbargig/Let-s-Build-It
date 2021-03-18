import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModalAssignPageComponent } from '@app/@shared/components/modal-assign-page/modal-assign-page.component';
import { ModalPageComponent } from '@app/@shared/components/modal-page/modal-page.component';
import { SideBarPageComponent } from '@app/@shared/components/side-bar-page/side-bar-page.component';
import { TabsPageComponent } from '@app/@shared/components/tabs-page/tabs-page.component';
import { AncillariesAssignResolverService } from '../agencies/components/ancillaries/ancillaries-assign-resolver.service';
import { AncillariesGroupResolverService } from '../agencies/components/ancillaries/ancillaries-group-resolver.service';
import { AncillariesResolverService } from '../agencies/components/ancillaries/ancillaries-resolver.service';
import { AncillariesComponent } from '../agencies/components/ancillaries/ancillaries.component';
import { DiscountsAndChargesComponent } from '../agencies/components/discounts-and-charges/discounts-and-charges.component';
import { PaymentPlanComponent } from '../agencies/components/payment-plan/payment-plan.component';
import { B2BSubScriptionResolverService } from '../agencies/components/subscriptions/Components/b2-bsubscription/b2-bsubscription-resolver.service';
import { B2BSubscriptionComponent } from '../agencies/components/subscriptions/Components/b2-bsubscription/b2-bsubscription.component';
import { B2CSubscriptionAssignResolver } from '../agencies/components/subscriptions/Components/b2-csubscription/b2-csubscription-assign.reslover';
import { B2CSubscriptionComponent } from '../agencies/components/subscriptions/Components/b2-csubscription/b2-csubscription.component';
import { B2CSubscriptionResolver } from '../agencies/components/subscriptions/Components/b2-csubscription/b2-csubscription.resolver';
import { SubscriptionsResolverService } from '../agencies/components/subscriptions/subscriptions-resolver.service';
import { SubscriptionsComponent } from '../agencies/components/subscriptions/subscriptions.component';
import { UserManagmentResolverService } from '../agencies/components/user-mangement/user-managment-resolver.service';
import { UserMangementComponent } from '../agencies/components/user-mangement/user-mangement.component';
import { ZoneDetailsComponent } from '../agencies/components/zones/zone-details/zone-details.component';
import { ZonesComponent } from '../agencies/components/zones/zones.component';
import { SummaryComponent } from '../users/components/users/summary/summary.component';
import { GeneralComponent } from '../vehicles/components/car/components/general/general.component';
import { FleetAccidentsComponent } from './components/fleet-accidents/fleet-accidents.component';
import { FleetDamagesComponent } from './components/fleet-damages/fleet-damages.component';
import { FleetResolverService } from './resolvers/fleet-resolver.service';

const routes: Routes = [
  {
    path: ':id/profile',
    component: SideBarPageComponent,
    resolve: { config: FleetResolverService },
    children: [
      { path: 'summary', component: SummaryComponent },
      { path: 'general', component: GeneralComponent },
      {
        path: 'user-management', component: UserMangementComponent, children: [
          {
            path: 'edit/:id', component: ModalPageComponent,
            resolve: { config: UserManagmentResolverService }
          },
          {
            path: 'create', component: ModalPageComponent,
            resolve: { config: UserManagmentResolverService }
          }
        ]
      },

      { path: 'damages', component: FleetDamagesComponent },
      { path: 'accidents', component: FleetAccidentsComponent },
      { path: 'zones', component: ZonesComponent },
      { path: 'zones/create', component: ZoneDetailsComponent },
      { path: 'zones/edit/:id', component: ZoneDetailsComponent },
      {
        path: 'subscriptions',
        component: TabsPageComponent,
        resolve: {
          config: SubscriptionsResolverService
        },
        children: [
          {
            path: 'b2b', component: B2BSubscriptionComponent,
            children: [
              {
                path: 'edit/:id',
                component: ModalPageComponent,
                resolve: { config: B2BSubScriptionResolverService }
              },
              {
                path: 'create',
                component: ModalPageComponent,
                resolve: { config: B2BSubScriptionResolverService }
              },
            ]
          },
          {
            path: 'b2c', component: B2CSubscriptionComponent,
            children: [
              {
                path: 'edit/:id',
                component: ModalPageComponent,
                resolve: { config: B2CSubscriptionResolver }
              },
              {
                path: 'create',
                component: ModalPageComponent,
                resolve: { config: B2CSubscriptionResolver }
              },
              {
                path: 'assign/:id', component: ModalAssignPageComponent,
                resolve: { config: B2CSubscriptionAssignResolver }
              }
            ]
          },
          { path: '**', redirectTo: 'b2c', pathMatch: 'full' }
        ]
      },
      { path: 'discounts-and-charges', component: DiscountsAndChargesComponent },
      {
        path: 'ancillaries',
        component: AncillariesComponent,
        children: [
          {
            path: 'group/:id',
            component: ModalPageComponent,
            resolve: { config: AncillariesGroupResolverService }
          },
          {
            path: 'assign/:id',
            component: ModalAssignPageComponent,
            resolve: { config: AncillariesAssignResolverService }
          },
          {
            path: 'ancillary/:id',
            component: ModalPageComponent,
            resolve: { config: AncillariesResolverService }
          }
          // TODO fill here assign component and edit/create ancillaries or ancillaries group 
        ]
      },      { path: 'payment-plan', component: PaymentPlanComponent },
      { path: '**', redirectTo: 'summary', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'my/profile', pathMatch: 'full' },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetsRoutingModule { }
