import { Injectable } from '@angular/core';
import { IFormGenerator, ModelConverter } from '../../../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../../../@forms/@core/interfaces/dynamic-form-control';
import { Validators } from '@angular/forms';
import { FormTextComponent } from '../../../../../@forms/form-fields/form-text/form-text.component';
import { FormDateComponent } from '../../../../../@forms/form-fields/form-date/form-date.component';

@Injectable({
  providedIn: 'root',
})
export class BillingFormService implements IFormGenerator<DynamicFormControl[]> {
  constructor() {}
  generate(...params: any[]): DynamicFormControl[] {
    return [
      {
        type: FormDateComponent,
        config: {
          name: 'billingStartDate',
          type: 'date',
          label: 'Billing start date',
          placeholder: 'Enter Billing start date',
          value: params?.[0]?.billingStartDate,
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Billing start date is required',
          },
        },
      },

      {
        type: FormDateComponent,
        config: {
          name: 'billingEndDate',
          type: 'date',
          label: 'Billing end date',
          placeholder: 'Enter Billing end date',
          value: params?.[0]?.billingEndDate,
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Billing end date is required',
          },
        },
      },
      {
        type: FormDateComponent,
        config: {
          name: 'billingDate',
          type: 'date',
          label: 'Billing date',
          placeholder: 'Enter Billing date',
          value: params?.[0]?.billingDate,
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Billing date is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'approvalReferenceNumber',
          type: 'text',
          label: 'Approval Reference Number',
          placeholder: 'Enter Approval Reference Number',
          value: params?.[0]?.approvalReferenceNumber,
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Approval Reference is required',
          },
        },
      },
    ];
  }
  convert?: ModelConverter<DynamicFormControl[], any>;
}
