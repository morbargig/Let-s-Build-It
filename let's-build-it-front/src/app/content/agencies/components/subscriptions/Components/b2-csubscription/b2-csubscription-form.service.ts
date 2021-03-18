import { Injectable } from '@angular/core';
import { IFormGenerator, ModelConverter } from '../../../../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../../../../@forms/@core/interfaces/dynamic-form-control';
import { PartnerB2CSubscriptionModel } from '../../../../../../@shared/models/partner-b2c-subscription.model';
import { FormTextComponent, FormSelectComponent, FormDateComponent } from '../../../../../../@forms/form-fields';
import { Validators } from '@angular/forms';
import { BillingPeriod } from '../../../../../../@shared/models/payment-plan.model';
import { UtilsService } from '../../../../../../@core/services/utils.service';
import { SymbolModel } from '@app/@shared/models/symbol.model';

@Injectable({
  providedIn: 'root'
})
export class B2CSubscriptionFormService implements IFormGenerator<DynamicFormControl[]>{

  constructor(private utilsService: UtilsService,) { }
  generate(isEdit: boolean, b2CSubscription: PartnerB2CSubscriptionModel = null): DynamicFormControl[] {
    let form: DynamicFormControl[] = [];
    form.push(
      {
        type: FormTextComponent,
        config: {
          name: 'name',
          type: 'text',
          label: 'Subscription Name',
          placeholder: 'Enter Subscription Name',
          value: b2CSubscription?.name,
          styleClass: 'col-6',
          validation: [Validators.required, Validators.maxLength(100)],
          errorMessages: {
            required: 'Subscription Name is required',
            maxlength: 'Subscription Name exceeds the maximum length',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'discountPrecentage',
          type: 'number',
          label: 'Discount (%)',
          value: b2CSubscription?.discountPrecentage,
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Discount is required',
          },
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'billingPeriod',
          label: 'Billing Period',
          placeholder: 'Select Billing Period',
          value: b2CSubscription?.billingPeriod,
          styleClass: 'col-4',
          optionsArr: this.utilsService.toSelectItem(BillingPeriod),
        },
      },
      {
        type: FormDateComponent,
        config: {
          name: 'billingDayOfMonth',
          label: 'Billing Date',
          type: 'date',
          placeholder: 'Select Billing Date',
          styleClass: 'col-4',
          value: b2CSubscription?.billingDayOfMonth,
          validation: [Validators.required],
          errorMessages: {
            required: 'Billing Date is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'payment',
          type: 'number',
          label: `Payment (${SymbolModel.NIS})`,
          value: b2CSubscription?.payment,
          styleClass: 'col-4',
          validation: [Validators.required],
          errorMessages: {
            required: 'Payment is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'description',
          label: 'Description',
          styleClass: 'col-12',
          value: b2CSubscription?.description,
          validation: [Validators.maxLength(1024)],
          data: {
            rows: 4,
          },
          errorMessages: {
            maxlength: 'Description exceeds the maximum length',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'id',
          type: 'hidden',
          value: b2CSubscription?.id
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'isActive',
          type: 'hidden',
          value: b2CSubscription?.isActive || true,
        },
      },
    );
    return form;
  }
}
