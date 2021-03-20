import { Injectable } from '@angular/core';
import { IFormGenerator, ModelConverter } from '../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from '../../@forms/form-fields/form-text/form-text.component';
import { Validators } from '@angular/forms';
import { FormFileComponent } from '../../@forms/form-fields/form-file/form-file.component';
import { FormDateComponent, FormFile, FormSelectComponent, FormSwitchComponent } from '../../@forms/form-fields';
import { DynamicSteppedForm, SteppedFormMode } from '../../@forms/@core/interfaces/dynamic-stepped-form';

@Injectable({
  providedIn: 'root',
})
export class PartnerFormService implements IFormGenerator<DynamicSteppedForm[]> {
  constructor() {}
  generate(isEdit: boolean): DynamicSteppedForm[] {
    let form: DynamicSteppedForm[] = [];
    form.push({
      title: 'General Information',
      mode: SteppedFormMode.Tabbed,
      group: [
        {
          type: FormTextComponent,
          config: {
            name: 'name',
            type: 'text',
            label: 'Partner Name',
            placeholder: 'Enter Partner Name',
            styleClass: 'col-12',
            validation: [Validators.required],
            errorMessages: {
              required: 'Partner Name is required',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'companyExternalId',
            type: 'number',
            label: 'Company External Id',
            placeholder: 'Enter Company External Id',
            styleClass: 'col-12',
            validation: [],
            errorMessages: {},
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'vatId',
            type: 'text',
            label: 'Vat Id',
            placeholder: 'Enter Vat Id',
            styleClass: 'col-12',
            validation: [Validators.required, Validators.maxLength(64)],
            errorMessages: {
              required: 'Vat Id is required',
              maxlength: 'Vat Id exceeds the maximum length',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'phone',
            type: 'text',
            label: 'Phone',
            placeholder: 'Enter Phone',
            styleClass: 'col-12',
            validation: [Validators.required, Validators.maxLength(32)],
            errorMessages: {
              required: 'Phone is required',
              maxlength: 'Phone exceeds the maximum length',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'email',
            type: 'text',
            label: 'Email',
            placeholder: 'Enter Email',
            styleClass: 'col-12',
            validation: [Validators.required, Validators.maxLength(128)],
            errorMessages: {
              required: 'Email is required',
              maxlength: 'Email exceeds the maximum length',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'address',
            type: 'text',
            label: 'Address',
            placeholder: 'Enter Address',
            styleClass: 'col-12',
            validation: [],
            errorMessages: {},
          },
        },
        {
          type: FormSwitchComponent,
          config: {
            name: 'status',
            type: 'text',
            label: 'Status',
            styleClass: 'col-12',
            // setter: isActiveSetter,
          },
        },
        {
          type: FormSelectComponent,
          config: {
            name: 'createUserId',
            type: 'hidden',
          },
        },
        {
          type: FormSelectComponent,
          config: {
            name: 'updateUserId',
            type: 'hidden',
          },
        },
        {
          type: FormDateComponent,
          config: {
            name: 'createDate',
            type: 'hidden',
          },
        },
        {
          type: FormDateComponent,
          config: {
            name: 'updateDate',
            type: 'hidden',
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'id',
            type: 'hidden',
          },
        },
      ],
    }),
      form.push({
        title: ' Media Information',
        mode: SteppedFormMode.Tabbed,
        group: [
          {
            type: FormFileComponent,
            config: {
              name: 'logoImgId',
              label: 'Agency Logo',
              styleClass: 'col-12 col-md-6',
              data: {
                autoUpload: true,
              } as FormFile,
            },
          },
          {
            type: FormFileComponent,
            config: {
              name: 'contractMediaId',
              label: 'Contract',
              styleClass: 'col-12',
              data: {
                autoUpload: true,
              } as FormFile,
            },
          },
          {
            type: FormFileComponent,
            config: {
              name: 'disclaimerMediaId',
              label: 'Disclaimer',
              styleClass: 'col-12',
              data: {
                autoUpload: true,
              } as FormFile,
            },
          },
          {
            type: FormFileComponent,
            config: {
              name: 'legalMediaId',
              label: 'Legal',
              styleClass: 'col-12',
              data: {
                autoUpload: true,
              } as FormFile,
            },
          },
        ],
      });

    return form;
  }
}
