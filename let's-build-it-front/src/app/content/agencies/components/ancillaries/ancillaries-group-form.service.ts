import { Injectable } from '@angular/core';
import { AncillaryGroupModel } from '../../../../@shared/models/ancillaries.model';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { Validators } from '@angular/forms';
import { FormTextComponent } from '../../../../@forms/form-fields/form-text/form-text.component';

@Injectable({
  providedIn: 'root'
})
export class AncillariesGroupFormService {

  constructor(
  ) { }

  generate(entity: AncillaryGroupModel = null): DynamicFormControl[] {
    let form: DynamicFormControl[] = [];
    form.push(
      {
        type: FormTextComponent,
        config: {
          name: 'name',
          type: 'text',
          label: 'Name',
          value: entity?.name,
          placeholder: 'Enter Name',
          styleClass: 'col-12',
          validation: [Validators.required],
          errorMessages: {
            required: 'Name is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'id',
          type: 'hidden',
          value: entity?.id,
        },
      },
    );
    return form;
  }
}
