import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertsRoutingModule } from './alerts-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CarDamageModalComponent } from './components/car-damage-modal/car-damage-modal.component';
import { IdeoFormsModule } from '@app/@forms/ideo-forms.module';
import { IconsModule } from '@app/blocks/icons/icons.module';
import { CarAccidentModalComponent } from './components/car-accident-modal/car-accident-modal.component';
import { TouristVisaModalComponent } from './components/tourist-visa-modal/tourist-visa-modal.component';
import { RentalForceCloseModalComponent } from './components/rental-force-close-modal/rental-force-close-modal.component';
import { RentalForceCloseWithNoChargeModalComponent } from './components/rental-force-close-with-no-charge-modal/rental-force-close-with-no-charge-modal.component';

@NgModule({
  declarations: [
    CarDamageModalComponent,
    CarAccidentModalComponent,
    TouristVisaModalComponent,
    RentalForceCloseModalComponent,
    RentalForceCloseWithNoChargeModalComponent,
  ],
  imports: [CommonModule, AlertsRoutingModule, ModalModule, IdeoFormsModule, IconsModule],
})
export class AlertsModule {}
