import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgenciesRoutingModule } from './agencies-routing.module';
import { PartnerDetailsComponent } from './components/partner-details/partner-details.component';
import { LoaderModule } from '@app/@ideo/components/loader/loader.module';
import { IdeoPipesModule } from '@app/@ideo/infrastructure/pipes/pipes.module';
import { SummaryComponent } from './components/summary/summary.component';
import { NavigationsModule } from '@app/blocks/navigations/navigations.module';
import { GeneralComponent } from './components/general/general.component';
import { UserMangementComponent } from './components/user-mangement/user-mangement.component';
import { SettingsComponent } from './components/settings/settings.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { TableModule } from '../../@ideo/components/table/table.module';
import { SelectModule } from '@app/@ideo/components/select/select.module';
import { PaymentMethodsComponent } from './components/payment-methods/payment-methods.component';
import { PaymentPlanComponent } from './components/payment-plan/payment-plan.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { DiscountsAndChargesComponent } from './components/discounts-and-charges/discounts-and-charges.component';
import { AncillariesComponent } from './components/ancillaries/ancillaries.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SharedModule } from '@app/@shared';
import { IdeoFormsModule } from '@app/@forms/ideo-forms.module';
import { ButtonModule } from '@app/@ideo/components/button/button.module';
import { SwitchOverPlanComponent } from './components/payment-plan/components/switch-over-plan/switch-over-plan.component';
import { AgencySelectionComponent } from './components/agency-selection/agency-selection.component';
import { InventoryDetailsComponent } from './components/inventory/inventory-details/inventory-details.component';
import { ZonesComponent } from './components/zones/zones.component';
import { AgmCoreModule } from '@agm/core';
import { ZoneDetailsComponent } from './components/zones/zone-details/zone-details.component';
import { ZoneTypeFormComponent } from './components/zones/zone-details/zone-type-form/zone-type-form.component';
import { B2BSubscriptionComponent } from './components/subscriptions/Components/b2-bsubscription/b2-bsubscription.component';
import { B2CSubscriptionComponent } from './components/subscriptions/Components/b2-csubscription/b2-csubscription.component';
import { ChargesComponent } from './components/discounts-and-charges/charges/charges.component';
import { FixedDiscountsComponent } from './components/discounts-and-charges/fixed-discounts/fixed-discounts.component';
import { DiscountsComponent } from './components/discounts-and-charges/discounts/discounts.component';
import { DiscountFillerComponent } from './components/discounts-and-charges/discounts/discount-filler/discount-filler.component';
import { FleetsComponent } from './components/fleets/fleets.component';
import { TariffsComponent } from './components/tariffs/tariffs.component';
import { TariffDetailsComponent } from './components/tariffs/tariff-details/tariff-details.component';

const EXPORTED_COMPONENTS = [
  UserMangementComponent, SubscriptionsComponent, DiscountsAndChargesComponent, AncillariesComponent,
  ZonesComponent, ZoneDetailsComponent, ZoneTypeFormComponent, B2BSubscriptionComponent, B2CSubscriptionComponent,
  ChargesComponent, FixedDiscountsComponent, DiscountsComponent, DiscountFillerComponent
];

@NgModule({
  declarations: [...EXPORTED_COMPONENTS, PartnerDetailsComponent, SummaryComponent, GeneralComponent, SettingsComponent, InventoryComponent, PaymentMethodsComponent, PaymentPlanComponent, ReportsComponent, SwitchOverPlanComponent, AgencySelectionComponent, InventoryDetailsComponent, FleetsComponent, TariffsComponent, TariffDetailsComponent,],
  exports: [...EXPORTED_COMPONENTS],
  imports: [CommonModule, NavigationsModule, AgenciesRoutingModule, TableModule, LoaderModule, IdeoPipesModule, SelectModule, SharedModule, IdeoFormsModule, ButtonModule, AgmCoreModule],
})
export class AgenciesModule { }
