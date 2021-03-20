import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabledPageComponent } from '@app/@shared/components/tabled-page/tabled-page.component';
import { PartnersResolverService } from '../agencies/partners.resolver';
import { PartnerFormResolverService } from '../agencies/partner-form.resolver';
import { SummaryComponent } from './components/summary/summary.component';
import { GeneralComponent } from './components/general/general.component';
import { UserMangementComponent } from './components/user-mangement/user-mangement.component';
import { SettingsComponent } from './components/settings/settings.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { PaymentMethodsComponent } from './components/payment-methods/payment-methods.component';
import { PaymentPlanComponent } from './components/payment-plan/payment-plan.component';
import { DiscountsAndChargesComponent } from './components/discounts-and-charges/discounts-and-charges.component';
import { AncillariesComponent } from './components/ancillaries/ancillaries.component';
import { ReportsComponent } from './components/reports/reports.component';
import { WizardPageComponent } from '../../@shared/components/wizard-page/wizard-page.component';
import { SideBarPageComponent } from '../../@shared/components/side-bar-page/side-bar-page.component';
import { PartnerAgencyResolverService } from './partner-agency-resolver.service';
import { AgencySelectionComponent } from './components/agency-selection/agency-selection.component';
import { ModalPageComponent } from '../../@shared/components/modal-page/modal-page.component';
import { CreateOrEditResolverService } from './components/inventory/create-or-edit-resolver.service';
import { UserManagmentResolverService } from './components/user-mangement/user-managment-resolver.service';
import { InventoryDetailsComponent } from './components/inventory/inventory-details/inventory-details.component';
import { ZonesComponent } from './components/zones/zones.component';
import { ZoneDetailsComponent } from './components/zones/zone-details/zone-details.component';
import { ModalAssignPageComponent } from '../../@shared/components/modal-assign-page/modal-assign-page.component';
import { InventoryAssignResolverService } from './components/inventory/inventory-assign-resolver.service';
import { B2BSubscriptionComponent } from './components/subscriptions/Components/b2-bsubscription/b2-bsubscription.component';
import { B2CSubscriptionComponent } from './components/subscriptions/Components/b2-csubscription/b2-csubscription.component';
import { TabsPageComponent } from '../../@shared/components/tabs-page/tabs-page.component';
import { SubscriptionsResolverService } from './components/subscriptions/subscriptions-resolver.service';
import { B2CSubscriptionResolver } from './components/subscriptions/Components/b2-csubscription/b2-csubscription.resolver';
import { B2CSubscriptionAssignResolver } from './components/subscriptions/Components/b2-csubscription/b2-csubscription-assign.reslover';
import { AncillariesResolverService } from './components/ancillaries/ancillaries-resolver.service';
import { AncillariesGroupResolverService } from './components/ancillaries/ancillaries-group-resolver.service';
import { AncillariesAssignResolverService } from './components/ancillaries/ancillaries-assign-resolver.service';
import { B2BSubScriptionResolverService } from './components/subscriptions/Components/b2-bsubscription/b2-bsubscription-resolver.service';
import { FleetsComponent } from './components/fleets/fleets.component';
import { TariffsComponent } from './components/tariffs/tariffs.component';
import { TariffsResolverService } from './components/tariffs/tariffs-resolver.service';
import { TariffDetailsComponent } from './components/tariffs/tariff-details/tariff-details.component';

const routes: Routes = [
  {
    path: '',
    component: TabledPageComponent,
    resolve: { config: PartnersResolverService },
  },
  {
    path: 'alerts',
    loadChildren: () => import('./alerts/alerts.module').then((m) => m.AlertsModule),
  },
  {
    path: ':id',
    component: WizardPageComponent,
    resolve: { config: PartnerFormResolverService },
  },
  {
    path: ':id/profile',
    component: SideBarPageComponent,
    resolve: { config: PartnerAgencyResolverService },
    children: [
      { path: 'summary', component: SummaryComponent },
      { path: 'general', component: GeneralComponent },
      { path: 'payment-methods', component: PaymentMethodsComponent },
      {
        path: 'user-management',
        component: UserMangementComponent,
        children: [
          {
            path: 'edit/:id',
            component: ModalPageComponent,
            resolve: { config: UserManagmentResolverService },
          },
          {
            path: 'create',
            component: ModalPageComponent,
            resolve: { config: UserManagmentResolverService },
          },
        ],
      },
      { path: 'payment-plan', component: PaymentPlanComponent },
      {
        path: 'subscriptions',
        component: TabsPageComponent,
        resolve: {
          config: SubscriptionsResolverService,
        },
        children: [
          {
            path: 'b2b',
            component: B2BSubscriptionComponent,
            children: [
              {
                path: 'edit/:id',
                component: ModalPageComponent,
                resolve: { config: B2BSubScriptionResolverService },
              },
              {
                path: 'create',
                component: ModalPageComponent,
                resolve: { config: B2BSubScriptionResolverService },
              },
            ],
          },
          {
            path: 'b2c',
            component: B2CSubscriptionComponent,
            children: [
              {
                path: 'edit/:id',
                component: ModalPageComponent,
                resolve: { config: B2CSubscriptionResolver },
              },
              {
                path: 'create',
                component: ModalPageComponent,
                resolve: { config: B2CSubscriptionResolver },
              },
              {
                path: 'assign/:id',
                component: ModalAssignPageComponent,
                resolve: { config: B2CSubscriptionAssignResolver },
              },
            ],
          },
          { path: '**', redirectTo: 'b2c', pathMatch: 'full' },
        ],
      },
      { path: 'discounts-and-charges', component: DiscountsAndChargesComponent },
      {
        path: 'ancillaries',
        component: AncillariesComponent,
        children: [
          {
            path: 'group/:id',
            component: ModalPageComponent,
            resolve: { config: AncillariesGroupResolverService },
          },
          {
            path: 'assign/:id',
            component: ModalAssignPageComponent,
            resolve: { config: AncillariesAssignResolverService },
          },
          {
            path: 'ancillary/:id',
            component: ModalPageComponent,
            resolve: { config: AncillariesResolverService },
          },
        ],
      },
      {
        path: 'tariff',
        children: [
          {
            path: '',
            component: TariffsComponent,
            children: [
              {
                path: ':action/:id',
                component: ModalPageComponent,
                resolve: { config: TariffsResolverService },
              },
            ],
          },
          {
            path: ':id',
            component: TariffDetailsComponent,
          },
        ],
      },
      { path: 'settings', component: SettingsComponent },
      {
        path: 'inventory',
        component: InventoryComponent,
        children: [
          {
            path: 'create/:type',
            component: ModalPageComponent,
            resolve: { config: CreateOrEditResolverService },
          },
          {
            path: 'edit/:id',
            component: ModalPageComponent,
            resolve: { config: CreateOrEditResolverService },
          },
          {
            path: 'assign/:id',
            component: ModalAssignPageComponent,
            resolve: { config: InventoryAssignResolverService },
          },

          { path: '**', redirectTo: 'inventory', pathMatch: 'full' },
        ],
      },
      {
        path: 'inventory/:id',
        component: InventoryDetailsComponent,
      },
      {
        path: 'fleets',
        component: FleetsComponent,
        // children: [
        //   {
        //     path: 'edit/:id',
        //     component: ModalPageComponent,
        //     // resolve: { config: B2CSubscriptionResolver }
        //   },
        //   {
        //     path: 'create',
        //     component: ModalPageComponent,
        //     // resolve: { config: B2CSubscriptionResolver }
        //   }
        // ]
      },
      { path: 'reports', component: ReportsComponent },
      { path: 'zones', component: ZonesComponent },
      { path: 'zones/create', component: ZoneDetailsComponent },
      { path: 'zones/edit/:id', component: ZoneDetailsComponent },
      { path: 'agency-selection', component: AgencySelectionComponent },
      { path: '**', redirectTo: 'summary', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgenciesRoutingModule {}
