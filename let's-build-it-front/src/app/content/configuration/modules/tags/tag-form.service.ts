import { Injectable } from '@angular/core';
import { IFormGenerator } from '../../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { FormDateComponent, FormSelectComponent, FormTextComponent } from '@app/@forms/form-fields';
import { Validators } from '@angular/forms';
import { UtilsService } from '@app/@core/services/utils.service';
import { TagType } from '../../../../@shared/interfaces/tag-type.enum';

@Injectable({
  providedIn: 'root',
})
export class TagFormService implements IFormGenerator<DynamicFormControl[]> {
  constructor(private utilsService: UtilsService) {}
  generate(isEdit: boolean): DynamicFormControl[] {
    let form: DynamicFormControl[] = [];
    form.push(
      {
        type: FormTextComponent,
        config: {
          name: 'key',
          type: 'text',
          label: 'Key',
          placeholder: 'Enter Key',
          styleClass: 'col-12',
          validation: [Validators.maxLength(64)],
          errorMessages: {
            maxlength: 'Key exceeds the maximum length',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'value',
          type: 'text',
          label: 'Value',
          placeholder: 'Enter Value',
          styleClass: 'col-12',
          validation: [Validators.maxLength(64)],
          errorMessages: {
            maxlength: 'Value exceeds the maximum length',
          },
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'type',
          label: 'Type',
          placeholder: 'Select Type',
          styleClass: 'col-12',
          validation: [Validators.required],
          optionsArr: this.utilsService.toSelectItem(TagType),
          errorMessages: {
            required: 'Type is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'externalId',
          type: 'text',
          label: 'External Id',
          placeholder: 'Enter External Id',
          styleClass: 'col-12',
          validation: [],
          errorMessages: {},
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'id',
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
      }
    );
    return form;
  }
}
