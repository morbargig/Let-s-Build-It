import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FleetsRoutingModule } from './fleets-routing.module';
import { FleetDamagesComponent } from './components/fleet-damages/fleet-damages.component';
import { FleetAccidentsComponent } from './components/fleet-accidents/fleet-accidents.component';


@NgModule({
  declarations: [FleetDamagesComponent, FleetAccidentsComponent],
  imports: [
    CommonModule,
    FleetsRoutingModule
  ],
  providers: [DatePipe]
})
export class FleetsModule { }
