import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabledPageComponent } from '@app/@shared/components/tabled-page/tabled-page.component';
import { CarsResolverService } from '../vehicles/resolver/cars.resolver';
import { CarFormResolverService } from '../vehicles/resolver/car-form.resolver';
import { CarComponent } from './components/car/car.component';
import { SummaryComponent } from './components/car/components/summary/summary.component';
import { GeneralComponent } from './components/car/components/general/general.component';
import { RemoteControlComponent } from './components/car/components/remote-control/remote-control.component';
import { SettingsComponent } from './components/car/components/settings/settings.component';
import { DamagesComponent } from './components/car/components/damages/damages.component';
import { ZonesComponent } from './components/car/components/zones/zones.component';
import { ContractsComponent } from './components/car/components/contracts/contracts.component';
import { AlertsComponent } from './components/car/components/alerts/alerts.component';
import { WizardPageComponent } from '@app/@shared/components/wizard-page/wizard-page.component';
import { DamageDetailsComponent } from './components/car/components/damages/damage-details/damage-details.component';
import { AccidentsComponent } from './components/car/components/accidents/accidents.component';
import { AccidentDetailsComponent } from './components/car/components/accidents/accident-details/accident-details.component';
import { SideBarPageComponent } from '../../@shared/components/side-bar-page/side-bar-page.component';
import { CarProfileResolverService } from './components/car/car-profile-resolver.service';
import { ModalPageComponent } from '../../@shared/components/modal-page/modal-page.component';
import { CarDamagesResolver } from './components/car/components/damages/car-damages-resolver.resolver';

const routes: Routes = [
  {
    path: '',
    component: TabledPageComponent,
    resolve: { config: CarsResolverService },
  },
  {
    path: ':id',
    component: WizardPageComponent,
    resolve: { config: CarFormResolverService },
  },
  {
    path: ':id/profile',
    component: SideBarPageComponent,
    resolve: { config: CarProfileResolverService },
    children: [
      { path: 'summary', component: SummaryComponent },
      { path: 'general', component: GeneralComponent },
      { path: 'remote-control', component: RemoteControlComponent },
      { path: 'settings', component: SettingsComponent },
      {
        path: 'damages',
        component: DamagesComponent,
        children: [
          {
            path: 'edit/:id',
            component: ModalPageComponent,
            resolve: { config: CarDamagesResolver },
          },
          {
            path: 'create',
            component: ModalPageComponent,
            resolve: { config: CarDamagesResolver },
          },
        ],
      },
      { path: 'damages/:damageId', component: DamageDetailsComponent },
      { path: 'accidents', component: AccidentsComponent },
      { path: 'accidents/:accidentId', component: AccidentDetailsComponent },
      { path: 'zones', component: ZonesComponent },
      { path: 'contracts', component: ContractsComponent },
      { path: 'alerts', component: AlertsComponent },
      { path: '**', redirectTo: 'summary', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehiclesRoutingModule {}
