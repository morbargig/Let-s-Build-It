import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { SelectItem } from '../../../../@forms/@core/interfaces';
import { FormTextComponent } from '../../../../@forms/form-fields/form-text/form-text.component';
import { Validators } from '@angular/forms';
import { FormSelectComponent } from '../../../../@forms/form-fields/form-select/form-select.component';
import { LazyLoadEvent } from '../../../../@ideo/components/table/events/lazy-load.event';
import { PartnersService } from '../../../agencies/partners.service';
import { IFormGenerator } from '@app/@forms/@core/models/form-generator';
import { BehaviorSubject } from 'rxjs';
import { FormDateComponent } from '@app/@forms/form-fields';

@Injectable({
  providedIn: 'root',
})
export class SettingsFormService implements IFormGenerator<DynamicFormControl[]> {
  constructor(private partnersService: PartnersService) {}

  private partners$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);

  generate(isEdit: boolean): DynamicFormControl[] {
    let form: DynamicFormControl[] = [];
    this.partnersService
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
      .subscribe((res) => this.partners$.next(res));
    form.push(
      {
        type: FormTextComponent,
        config: {
          name: 'name',
          type: 'text',
          label: 'Setting Name',
          placeholder: 'Enter Setting Name',
          styleClass: 'col-4',
          validation: [Validators.required, Validators.maxLength(200)],
          errorMessages: {
            required: 'Setting Name is required',
            maxlength: 'Setting Name exceeds the maximum length',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'value',
          type: 'text',
          label: 'Setting Value',
          placeholder: 'Enter Setting Value',
          styleClass: 'col-4',
          validation: [Validators.required],
          errorMessages: {
            required: 'Setting Value is required',
          },
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'partnerId',
          label: 'Partner Name',
          placeholder: 'Select Partner Name',
          styleClass: 'col-4',
          validation: [],
          optionsArr$: this.partners$,
          errorMessages: {},
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
