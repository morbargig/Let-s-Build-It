import { Injectable } from '@angular/core';
import { DynamicFormControl } from '../../../../../../@forms/@core/interfaces/dynamic-form-control';
import { IFormGenerator, ModelConverter } from '../../../../../../@forms/@core/models/form-generator';
import { PartnerB2BSubscriptionModel } from '../../../../../../@shared/models/partner-b2b-subscription.model';
import { FormSelectComponent } from '../../../../../../@forms/form-fields/form-select/form-select.component';
import { FormArrayComponent } from '../../../../../../@forms/form-fields/form-array/form-array.component';
import { Subject } from 'rxjs';
import { FieldEvent } from '../../../../../../@forms/@core/interfaces/events';
import { FormArray, Validators } from '@angular/forms';
import { FormTextComponent } from '../../../../../../@forms/form-fields/form-text/form-text.component';
import { IdeoValidators } from '../../../../../../@forms/@core/validators/ideo.validators';
import { FormArrayData } from '../../../../../../@forms/form-fields/form-array/form-array';

@Injectable({
  providedIn: 'root'
})
export class B2BSubscriptionFormService implements IFormGenerator<DynamicFormControl[]> {

  constructor() { }
  generate(isEdit: boolean, partnerId: number, b2bSubscriptions: PartnerB2BSubscriptionModel[] = null): DynamicFormControl[] {
    let subscriptionSetter: Subject<FieldEvent> = new Subject<FieldEvent>();

    return [
      {
        type: FormArrayComponent,
        config: {
          name: 'subscriptions',
          value: b2bSubscriptions,
          styleClass: 'col-12',
          setter: subscriptionSetter,
          validation: [Validators.required, (ctrl: FormArray) => {
            return !ctrl.value?.length ? {
              'subscriptions': 'you must add subscriptions.'
            } : null
          }],
          data: {
            data: b2bSubscriptions,
            formConfig: [
              {
                type: FormTextComponent,
                config: {
                  name: 'name',
                  label: 'Plan Name',
                  placeholder: 'Plan Name',
                  inputStyleClass: 'form-control',
                  type: 'text',
                  validation: [Validators.required]
                }
              },
              {
                type: FormTextComponent,
                config: {
                  name: 'fee',
                  label: 'Subscription Fee',
                  placeholder: 'Subscription Fee',
                  inputStyleClass: 'form-control',
                  type: 'number',
                  validation: [Validators.required]
                }
              },
              {
                type: FormTextComponent,
                config: {
                  name: 'discountPrecentage',
                  label: 'Discount (%)',
                  placeholder: 'Discount (%)',
                  inputStyleClass: 'form-control',
                  type: 'number',
                  validation: [Validators.required]
                }
              },
              {
                type: FormTextComponent,
                config: {
                  name: 'revenueStart',
                  label: 'Revenue Start',
                  placeholder: 'Revenue Start',
                  inputStyleClass: 'form-control',
                  type: 'number',
                  validation: [Validators.required, IdeoValidators.smallerThanOrEquals('revenueEnd'), Validators.min(0)],
                  errorMessages: {
                    revenueEnd: 'Must be smaller then Revenue End',
                    min: 'Must be greater then 0',
                  },
                }
              },
              {
                type: FormTextComponent,
                config: {
                  name: 'revenueEnd',
                  label: 'Revenue End',
                  placeholder: 'Revenue End',
                  inputStyleClass: 'form-control',
                  type: 'number',
                  validation: [Validators.required, IdeoValidators.greaterThanOrEquals('revenueStart'), Validators.min(0)],
                  errorMessages: {
                    revenueStart: 'Must be greater then Revenue Start',
                    min: 'Must be greater then 0',
                  },
                }
              },
              {
                type: FormTextComponent,
                config: {
                  name: 'partnerId',
                  value: partnerId,
                  type: 'hidden',
                  validation: [Validators.required]
                }
              },
              {
                type: FormTextComponent,
                config: {
                  name: 'id',
                  type: 'hidden',
                }
              }

            ]
          } as FormArrayData,
          errorMessages: {
            'subscriptions': 'You must specify subscriptions'
          }
        }
      }
    ] as DynamicFormControl[]
  }
  convert?: ModelConverter<DynamicFormControl[], any>;
}
