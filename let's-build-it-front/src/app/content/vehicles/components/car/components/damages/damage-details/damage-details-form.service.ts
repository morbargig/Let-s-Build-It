import { Injectable } from '@angular/core';
import { IFormGenerator, ModelConverter } from '../../../../../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../../../../../@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from '../../../../../../../@forms/form-fields/form-text/form-text.component';
import { CarDamageModel, DamageType } from '../../../../../../../@shared/models/car-damage.model';
import { FormDateComponent } from '../../../../../../../@forms/form-fields/form-date/form-date.component';
import { FormSelectComponent } from '../../../../../../../@forms/form-fields/form-select/form-select.component';
import { UtilsService } from '../../../../../../../@core/services/utils.service';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DamageDetailsFormService implements IFormGenerator < DynamicFormControl[] >{

  constructor(private utilsService: UtilsService,) { }
  generate(carDamage: CarDamageModel = null): DynamicFormControl[] {
    return [
      {
        type: FormSelectComponent,
        config: {
          name: 'type',
          label: 'Type',
          placeholder: 'Select Damage Type',
          value: carDamage?.type,
          styleClass: 'col-4',
          optionsArr: this.utilsService.toSelectItem(DamageType),
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'additionalInfo',
          type: 'text',
          label: 'Additional Info',
          value: carDamage?.additionalInfo,
          data: {
            rows: 4,
          },
          styleClass: 'col-12',
          validation: [Validators.required, Validators.maxLength(2048)],
          errorMessages: {
            required: 'Additional Info is required',
            maxlength: 'Additional Info exceeds the maximum length',
          },
        },
      },
    ]
  }
  
}
