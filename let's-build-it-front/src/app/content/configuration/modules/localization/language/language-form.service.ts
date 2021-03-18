import { Injectable } from '@angular/core';
import { IFormGenerator } from '../../../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../../../@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from '../../../../../@forms/form-fields/form-text/form-text.component';
import { Validators } from '@angular/forms';
import { FormSelectComponent } from '../../../../../@forms/form-fields/form-select/form-select.component';
import { SelectItem } from '../../../../../@forms/@core/interfaces';
import { FormSwitchComponent } from '../../../../../@forms/form-fields/form-switch/form-switch.component';
import { LanguagesService } from './languages.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { FormDateComponent } from '@app/@forms/form-fields';

@Injectable({
  providedIn: 'root',
})
export class LanguageFormService implements IFormGenerator<DynamicFormControl[]> {
  constructor(private languagesService: LanguagesService) {}
  private languages$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  generate(isEdit: boolean): DynamicFormControl[] {
    let form: DynamicFormControl[] = [];
    this.languagesService
      .getCultures()
      .pipe(
        map((r) =>
          r.map((a) => {
            return {
              value: a,
              label: a,
            } as SelectItem;
          })
        )
      )
      .subscribe((res) => this.languages$.next(res));

    form.push(
      {
        type: FormTextComponent,
        config: {
          name: 'name',
          type: 'text',
          label: 'Language Name',
          placeholder: 'Enter Language Name',
          styleClass: 'col-12 col-md-6',
          validation: [Validators.required, Validators.maxLength(100)],
          errorMessages: {
            required: 'Language Name is required',
            maxlength: 'Language Name exceeds the maximum length',
          },
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'languageCulture',
          label: 'Language Culture',
          placeholder: 'Select Language Culture',
          styleClass: 'col-12 col-md-6',
          validation: [Validators.required],
          optionsArr$: this.languages$,
          errorMessages: {
            required: 'Language Culture is required',
          },
        },
      },
      {
        type: FormSwitchComponent,
        config: {
          name: 'rtl',
          type: 'text',
          label: 'Rtl',
          styleClass: 'col-12 col-md-6 col-lg-3 col-xl-2',
          errorMessages: {
            required: 'Rtl is required',
          },
        },
      },
      {
        type: FormSwitchComponent,
        config: {
          name: 'active',
          type: 'text',
          label: 'Is Active',
          styleClass: 'col-12 col-md-6 col-lg-3 col-xl-2',
          errorMessages: {
            required: 'active is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'displayOrder',
          type: 'hidden',
        },
      },
      {
        type: FormDateComponent,
        config: {
          name: 'created',
          type: 'hidden',
        },
      },
      {
        type: FormDateComponent,
        config: {
          name: 'updated',
          type: 'hidden',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'id',
          type: 'hidden',
        },
      }
    );

    return form;
  }
}
