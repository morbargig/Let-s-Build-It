import { Injectable } from '@angular/core';
import { IFormGenerator, ModelConverter } from '../../../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../../../@forms/@core/interfaces/dynamic-form-control';
import { Validators } from '@angular/forms';
import { FormTextComponent } from '../../../../../@forms/form-fields/form-text/form-text.component';
@Injectable({
  providedIn: 'root',
})
export class ContactPersonFormService implements IFormGenerator<DynamicFormControl[]> {
  constructor() {}
  generate(...params: any[]): DynamicFormControl[] {
    return [
      {
        type: FormTextComponent,
        config: {
          name: 'contactPersonName',
          type: 'text',
          label: 'Name',
          placeholder: 'Enter Contact Name',
          value: params?.[0]?.contactPersonName,
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Name is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'contactPersonEmail',
          label: 'Email',
          placeholder: 'Enter Contact Person Email',
          value: params?.[0]?.contactPersonEmail,
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Email is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'contactPersonPhone',
          label: 'Phone',
          placeholder: 'Enter Contact Person Phone',
          value: params?.[0]?.contactPersonPhone,
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Phone is required',
          },
        },
      },
    ];
  }
  convert?: ModelConverter<DynamicFormControl[], any>;
}
