import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclesRoutingModule } from './vehicles-routing.module';
import { CarComponent } from './components/car/car.component';
import { SummaryComponent } from './components/car/components/summary/summary.component';
import { GeneralComponent } from './components/car/components/general/general.component';
import { RemoteControlComponent } from './components/car/components/remote-control/remote-control.component';
import { SettingsComponent } from './components/car/components/settings/settings.component';
import { DamagesComponent } from './components/car/components/damages/damages.component';
import { ZonesComponent } from './components/car/components/zones/zones.component';
import { ContractsComponent } from './components/car/components/contracts/contracts.component';
import { AlertsComponent } from './components/car/components/alerts/alerts.component';
import { NavigationsModule } from '@app/blocks/navigations/navigations.module';
import { CarDetailsComponent } from './components/car/components/car-details/car-details.component';
import { IdeoPipesModule } from '@app/@ideo/infrastructure/pipes/pipes.module';
import { LoaderModule } from '@app/@ideo/components/loader/loader.module';
import { CarCardComponent } from './components/car/components/car-card/car-card.component';
import { UtilsModule } from '@app/blocks/utils';
import { SharedModule } from '../../@shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TableModule } from '@app/@ideo/components/table/table.module';
import { IdeoFormsModule } from '@app/@forms/ideo-forms.module';
import { SelectModule } from '../../@ideo/components/select/select.module';
import { ButtonModule } from '@app/@ideo/components/button/button.module';
import { DamageDetailsComponent } from './components/car/components/damages/damage-details/damage-details.component';
import { AccidentsComponent } from './components/car/components/accidents/accidents.component';
import { AccidentDetailsComponent } from './components/car/components/accidents/accident-details/accident-details.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    CarComponent,
    SummaryComponent,
    GeneralComponent,
    RemoteControlComponent,
    SettingsComponent,
    DamagesComponent,
    ZonesComponent,
    ContractsComponent,
    AlertsComponent,
    CarDetailsComponent,
    CarCardComponent,
    DamageDetailsComponent,
    AccidentsComponent,
    AccidentDetailsComponent,
  ],
  imports: [
    CommonModule,
    VehiclesRoutingModule,
    NavigationsModule,
    IdeoPipesModule,
    LoaderModule,
    SharedModule,
    ModalModule,
    TableModule,
    IdeoFormsModule,
    SelectModule,
    ButtonModule,
    AgmCoreModule,
  ],
})
export class VehiclesModule {}
