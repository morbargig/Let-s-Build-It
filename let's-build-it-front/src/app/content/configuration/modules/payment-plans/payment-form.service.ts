import { Injectable } from '@angular/core';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from '../../../../@forms/form-fields/form-text/form-text.component';
import { PaymentPlanType } from '../../../../@shared/models/payment-plan.model';
import { FormSelectComponent } from '../../../../@forms/form-fields/form-select/form-select.component';
import { asSelectItem } from '../../../../prototypes';
import { AbstractControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { FieldEvent } from '@app/@forms/@core/interfaces';
import { IFormGenerator } from '../../../../@forms/@core/models/form-generator';
import { BillingPeriod } from '../../../../@shared/interfaces/billing-period.enum';
import { SymbolModel } from '../../../../@shared/models/symbol.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentFormService implements IFormGenerator<DynamicFormControl[]> {
  constructor
    (
      // private symbolModel: SymbolModel
    ) {
  }
  generate(): DynamicFormControl[] {
    let form: DynamicFormControl[] = [];
    let trialSubject: Subject<FieldEvent> = new Subject<FieldEvent>();
    let fixedSubject: Subject<FieldEvent> = new Subject<FieldEvent>();
    let revenueSubject: Subject<FieldEvent> = new Subject<FieldEvent>();
    form.push(
      {
        type: FormSelectComponent,
        config: {
          name: 'selectedPlan',
          type: 'number',
          label: 'Selected Plan',
          optionsArr: asSelectItem(PaymentPlanType),
          placeholder: 'Enter SelectedPlan',
          styleClass: 'col-12 col-md-6 col-xl-4',
          validation: [Validators.required],
          errorMessages: {
            'required': 'Selected Plan is required'
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'temp',
          type: 'separator',
          styleClass: 'hidden col-12',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'trialPeriodEnd',
          type: 'date',

          setter: trialSubject,
          label: 'Trial PeriodEnd',
          placeholder: 'Enter Trial PeriodEnd',
          styleClass: 'col-12 col-md-6 col-xl-4',
          validation: [Validators.required],
          errorMessages: {
            'required': 'Trial Period End is required'
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'temp',
          type: 'separator',
          styleClass: 'hidden col-12',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'fixedPaymentAmount',
          type: 'number',
          label: `Fixed Payment Amount (${SymbolModel.NIS})`,
          setter: fixedSubject,
          placeholder: `Enter Fixed Payment Amount (${SymbolModel.NIS})`,
          styleClass: 'col-12 col-md-6 col-xl-4',
          validation: [Validators.required, Validators.min(0)],
          errorMessages: {
            'required': 'Fixed Payment Amount is required',
            'min': 'value must be grater than 0'
          },
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'fixedPaymentBillingPeriod',
          label: 'Fixed Payment Billing Period',
          placeholder: 'Enter Fixed Payment Billing Period',
          styleClass: 'col-12 col-md-6 col-xl-4',
          setter: fixedSubject,
          optionsArr: asSelectItem(BillingPeriod),
          validation: [Validators.required],
          errorMessages: {
            required: 'Fixed Payment Billing Period is required'
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'temp',
          type: 'separator',
          styleClass: 'hidden col-12',
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'revenueFeesBillingPeriod',
          type: 'number',
          setter: revenueSubject,
          label: 'Revenue Fees Payment Billing Period (%)',
          placeholder: 'Enter Revenue Fees Payment Billing Period (%)',
          styleClass: 'col-12 col-md-6 col-xl-4',
          optionsArr: asSelectItem(BillingPeriod),
          validation: [Validators.required],
          errorMessages: {
            required: 'Revenue Fees Payment Billing Period is required'
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'vehicleBaseRentFees',
          setter: revenueSubject,
          type: 'number',
          label: 'Vehicle Base Rent Fees (%)',
          placeholder: 'Enter Vehicle Base Rent Fees (%)',
          styleClass: 'col-12 col-md-6 col-xl-4',
          validation: [Validators.required, Validators.min(0)],
          errorMessages: {
            required: 'Vehicle Base Rent Fees is required',
            'min': 'value must be grater than 0'
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'vehicleExtraFees',
          setter: revenueSubject,
          type: 'number',
          label: 'Vehicle Extra Fees (%)',
          placeholder: 'Enter Vehicle Extra Fees (%)',
          styleClass: 'col-12 col-md-6 col-xl-4',
          validation: [Validators.required, Validators.min(0)],
          errorMessages: {
            required: 'Vehicle Extra Fees is required',
            'min': 'value must be grater than 0'
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'vehicleAncillaries',
          setter: revenueSubject,
          type: 'number',
          label: 'Vehicle Ancillaries',
          placeholder: 'Enter Vehicle Ancillaries',
          styleClass: 'col-12 col-md-6 col-xl-4',
          validation: [Validators.required, Validators.min(0)],
          errorMessages: {
            required: 'Ancillaries is required',
            'min': 'value must be grater than 0'
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'subscriptionB2BFees',
          setter: revenueSubject,
          type: 'number',
          label: 'Subscription B2B Fees (%)',
          placeholder: 'Enter Subscription B2B Fees (%)',
          styleClass: 'col-12 col-md-6 col-xl-4',
          validation: [Validators.required, Validators.min(0)],
          errorMessages: {
            required: 'B2B Fees is required',
            'min': 'value must be grater than 0'
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'subscriptionB2CFees',
          setter: revenueSubject,
          type: 'number',
          label: `Subscription B2C Fees (%)`,
          placeholder: 'Enter Subscription B2C Fees (%)',
          styleClass: 'col-12 col-md-6 col-xl-4',
          validation: [Validators.required, Validators.min(0)],
          errorMessages: {
            required: 'B2C Fees is required',
            'min': 'value must be grater than 0'
          },
        }
      },
      {
        type: FormTextComponent,
        config: {
          name: 'id',
          type: 'hidden',
          styleClass: 'hidden',
        },
      },
    );
    return form;
  }
}

