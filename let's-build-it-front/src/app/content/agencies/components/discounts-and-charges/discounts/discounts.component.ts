import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { DynamicFormControl } from '@app/@forms/@core/interfaces/dynamic-form-control';
import { FixedDiscountsModel } from '@app/@shared/models/discounts-and-charges.model';
import { DiscountsAndChargesService } from '../discounts-and-charges.service';
import { FormTextComponent } from '../../../../../@forms/form-fields/form-text/form-text.component';

@Component({
  selector: 'prx-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss']
})
export class DiscountsComponent implements OnInit {

  constructor() { }

  public form: FormGroup;
  // @Output('form') public formChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  @Input() public partnerId: number;
  public limitForm: FormGroup;
  public limitControls: DynamicFormControl[] = [{
    type: FormTextComponent,
    config: {
      name: 'discountLimit',
      type: 'number',
      label: 'Limit total discounts to (%)',
      placeholder: 'Enter Limit',
      validation: [Validators.max(100), Validators.min(0), Validators.maxLength(3)],
      value: '', // FIXME: fill me with real data
      errorMessages: {
        max: 'limit must be smaller then 100%',
        min: 'limit must be grater then 0%',
        maxlength: 'limit must be smaller then 100%',
      },
      onChange: () => {
        // TODO: send req to the server and change the value
      },
    }
  }
  ];


  public fixedDiscountControls: DynamicFormControl[];
  public fixedDiscountItems: SelectItem[];
  public fixedDiscounts: FixedDiscountsModel = null;



  ngOnInit(): void {
  }

}
