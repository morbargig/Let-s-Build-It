import { Injectable } from '@angular/core';
import { IFormGenerator, ModelConverter } from '../../../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../../../@forms/@core/interfaces/dynamic-form-control';
import { Validators } from '@angular/forms';
import { FormTextComponent } from '../../../../../@forms/form-fields/form-text/form-text.component';

@Injectable({
  providedIn: 'root'
})
export class CompanyFormService implements IFormGenerator<DynamicFormControl[]> {

  constructor() { }
  generate(...params: any[]): DynamicFormControl[] {
    return [
      {
        type: FormTextComponent,
        config: {
          name: 'vatId',
          type: 'text',
          label: 'Company VAT/ID',
          placeholder: 'Enter Company VAT/ID',
          value: params?.[0]?.vatId,
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Company VAT/ID is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'referenceNumber',
          type: 'text',
          label: 'Reference number',
          placeholder: 'Enter Reference number',
          value: params?.[0]?.referenceNumber,
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Reference number is required',
          },
        },
      },
  
    ]
  }
  convert?: ModelConverter<DynamicFormControl[], any>;
}
