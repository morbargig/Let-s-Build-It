import { Injectable } from '@angular/core';
import { IFormGenerator, ModelConverter } from '../../../../../@forms/@core/models/form-generator';
import { BankAccountModel } from '../../../../../@shared/models/payment-methods.model';
import { DynamicFormControl } from '../../../../../@forms/@core/interfaces/dynamic-form-control';
import { Validators } from '@angular/forms';
import { FormTextComponent } from '../../../../../@forms/form-fields/form-text/form-text.component';

@Injectable({
  providedIn: 'root',
})
export class BankAccountFormService implements IFormGenerator<DynamicFormControl[]> {
  constructor() {}
  generate(...params: any[]): DynamicFormControl[] {
    return [
      {
        type: FormTextComponent,
        config: {
          name: 'bankName',
          type: 'text',
          label: 'Bank Name',
          placeholder: 'Enter Bank Name',
          value: params?.[1]?.bankName,
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Bank Name is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'bankNumber',
          type: 'text',
          label: 'Bank Number',
          placeholder: 'Enter Bank Number',
          value: params?.[1]?.bankNumber,
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Bank Number is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'branchName',
          type: 'text',
          label: 'Branch Name',
          placeholder: 'Enter Branch Name',
          value: params?.[1]?.branchName,
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Branch Name is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'branchNumber',
          type: 'text',
          label: 'Branch Number',
          placeholder: 'Enter Branch Number',
          value: params?.[1]?.branchNumber,
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Branch Number is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'accountNumber',
          type: 'text',
          label: 'Account Number',
          placeholder: 'Enter Account Number',
          value: params?.[1]?.branchNumber,
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Account Number is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'id',
          type: 'hidden',
          value: params?.[1]?.id,
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'partnerId',
          type: 'hidden',
          value: params?.[0]?.id,
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'isDefault',
          type: 'hidden',
          value: true,
        },
      },
    ] as DynamicFormControl[];
  }
  convert?: ModelConverter<DynamicFormControl[], any>;
}
