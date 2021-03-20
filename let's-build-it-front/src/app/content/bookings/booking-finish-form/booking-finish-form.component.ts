import { Component, OnInit } from '@angular/core';
import { BaseFieldDirective } from '../../../@forms/@core/directives/base-field.directive';
import { FormArray, FormGroup } from '@angular/forms';
import { FieldConfig } from '../../../@forms/@core/interfaces/field-config';

@Component({
  selector: 'prx-booking-finish-form',
  templateUrl: './booking-finish-form.component.html',
  styleUrls: ['./booking-finish-form.component.scss'],
})
export class BookingFinishFormComponent extends BaseFieldDirective<FormArray> implements OnInit {
  public config: FieldConfig;
  public group: FormGroup;
  public id: string;
  public bookingId: number | string = 'No Booking Id';
  public customerName: string = 'User name';
  public customerEmail: string = 'example@exam.com';
  // FIXME need to fill all this variable with real value

  private get partnerId() {
    return this.config.data.partnerId;
  }

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
