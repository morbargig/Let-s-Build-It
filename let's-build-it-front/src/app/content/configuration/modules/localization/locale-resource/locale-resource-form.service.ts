import { Injectable } from '@angular/core';
import { IFormGenerator } from '../../../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../../../@forms/@core/interfaces/dynamic-form-control';
import { LanguagesService } from '../language/languages.service';
import { FormTextComponent } from '../../../../../@forms/form-fields/form-text/form-text.component';
import { Validators } from '@angular/forms';
import { FormSelectComponent } from '../../../../../@forms/form-fields/form-select/form-select.component';
import { LazyLoadEvent } from '../../../../../@ideo/components/table/events/lazy-load.event';
import { SelectItem } from '../../../../../@forms/@core/interfaces';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocaleResourceFormService implements IFormGenerator<DynamicFormControl[]> {
  constructor(private languagesService: LanguagesService) {}
  private languages$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  generate(isEdit: boolean): DynamicFormControl[] {
    let form: DynamicFormControl[] = [];
    this.languagesService
      .getAll({
        page: 1,
        pageSize: 200,
      } as LazyLoadEvent)
      .pipe(
        map((r) =>
          r?.data?.map((a) => {
            return {
              value: a.id,
              label: a.name,
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
          label: 'Locale Resource Name',
          placeholder: 'Enter Locale Resource Name',
          styleClass: 'col-4',
          validation: [Validators.required, Validators.maxLength(200)],
          errorMessages: {
            required: 'Locale Resource is required',
            maxlength: 'Locale Resource Name exceeds the maximum length',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'value',
          type: 'text',
          label: 'Locale Resource Value',
          placeholder: 'Enter Locale Resource Value',
          styleClass: 'col-4',
          validation: [Validators.required],
          errorMessages: {
            required: 'Locale Resource Value is required',
          },
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'languageId',
          label: 'Language Name',
          placeholder: 'Select Language Name',
          styleClass: 'col-4',
          validation: [],
          optionsArr$: this.languages$,
          errorMessages: {},
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
