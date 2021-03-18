import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingRoutingModule } from './booking-routing.module';
import { BookingAncillaryFormComponent } from './booking-ancillary-form/booking-ancillary-form.component';
import { SharedModule } from '../../@shared/shared.module';
import { BookingDatesFormComponent } from './booking-dates-form/booking-dates-form.component';
import { IdeoModule } from '../../@ideo/ideo.module';
import { TableModule } from '../../@ideo/components/table/table.module';
import { BookingCustomerFormComponent } from './booking-customer-form/booking-customer-form.component';
import { BookingVehiclesFormComponent } from './booking-vehicles-form/booking-vehicles-form.component';
import { BookingLocationFormComponent } from './booking-location-form/booking-location-form.component';
import { IdeoFormsModule } from '@app/@forms/ideo-forms.module';
import { AgmCoreModule } from '@agm/core';
import { BookingFinishFormComponent } from './booking-finish-form/booking-finish-form.component';

@NgModule({
  declarations: [BookingAncillaryFormComponent, BookingDatesFormComponent, BookingCustomerFormComponent, BookingVehiclesFormComponent, BookingLocationFormComponent, BookingFinishFormComponent],
  imports: [CommonModule, BookingRoutingModule, SharedModule, IdeoModule, TableModule, IdeoFormsModule,AgmCoreModule],
})
export class BookingModule { }
