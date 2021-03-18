import { Injectable } from '@angular/core';
import { IFormGenerator, ModelConverter } from '../../../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../../../@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from '../../../../../@forms/form-fields/form-text/form-text.component';
import { FixedDiscountsModel } from '../../../../../@shared/models/discounts-and-charges.model';
import { FormSubTextComponent } from '../../../../../@forms/form-fields/form-sub-text/form-sub-text.component';
import { SymbolModel } from '@app/@shared/models/symbol.model';

@Injectable({
  providedIn: 'root'
})
export class FixedDiscountsFormService implements IFormGenerator<DynamicFormControl[]>  {

  constructor() { }
  generate(fixedDiscounts: FixedDiscountsModel): DynamicFormControl[] {
    return [
      {
        type: FormSubTextComponent,
        config: {
          name: 'fixLabel',
          type: 'text',
          data: {
            text: 'Refuelling'
          },
          styleClass: 'd-flex align-items-center bold col-12 col-md-1 bold-label',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'refulingDiscount',
          type: 'number',
          label: `Discount (${SymbolModel.NIS})`,
          placeholder: 'Enter Refueling Discount',
          value: fixedDiscounts?.refulingDiscount,
          styleClass: 'col-12 col-md-2',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'refulingMaxDiscount',
          type: 'number',
          label: `Max Discount (${SymbolModel.NIS})`,
          placeholder: 'Enter Refueling Max Discount',
          value: fixedDiscounts?.refulingMaxDiscount,
          styleClass: 'col-12 col-md-2',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'refulingMinRefuelLevel',
          type: 'number',
          label: 'Min. Refuel Level (%)',
          placeholder: 'Enter Refueling Min Refuel Level',
          value: fixedDiscounts?.refulingMinRefuelLevel,
          styleClass: 'col-12 col-md-2',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'refulingMaxRefuelLevel',
          type: 'number',
          label: 'Max Refuel Level (%)',
          placeholder: 'Enter Refueling Max Refuel Level',
          value: fixedDiscounts?.refulingMaxRefuelLevel,
          styleClass: 'col-12 col-md-2',
        },
      },
      {
        type: null,
        config: {
          name: null,
          type: null,
          styleClass: 'd-flex align-items-center bold col-12 col-md-3',
        },
      },
      {
        type: FormSubTextComponent,
        config: {
          name: 'fixLabel',
          type: 'text',
          data: {
            text: 'Car Washing'
          },
          styleClass: 'd-flex align-items-center bold col-12 col-md-1 bold-label',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'carWashingDiscount',
          type: 'number',
          label: `Discount (${SymbolModel.NIS})`,
          placeholder: 'Car Washing Discount',
          value: fixedDiscounts?.carWashingDiscount,
          styleClass: 'col-12 col-md-2',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'carWashingMaxDiscount',
          type: 'number',
          label: `Max Discount (${SymbolModel.NIS})`,
          placeholder: 'Car Washing Discount',
          value: fixedDiscounts?.carWashingMaxDiscount,
          styleClass: 'col-12 col-md-2',
        },
      },
    ];
  }
  convert?: ModelConverter<DynamicFormControl[], any>;
}
