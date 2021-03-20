import { Injectable } from '@angular/core';
import { IFormGenerator, ModelConverter } from '../../../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../../../@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from '../../../../../@forms/form-fields/form-text/form-text.component';
import { FormSubTextComponent } from '../../../../../@forms/form-fields/form-sub-text/form-sub-text.component';
import { ChargesModel } from '../../../../../@shared/models/discounts-and-charges.model';
import { SymbolModel } from '@app/@shared/models/symbol.model';

@Injectable({
  providedIn: 'root',
})
export class ChargesFormService implements IFormGenerator<DynamicFormControl[]> {
  constructor() {}

  generate(charges: ChargesModel): DynamicFormControl[] {
    return [
      {
        type: FormSubTextComponent,
        config: {
          name: 'null11',
          type: 'text',
          data: {
            text: `Out of drop
            off zone 
            parking`,
          },
          styleClass: 'd-flex align-items-center bold col-12 col-md-3 bold-label',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'outOfDropZoneParkingCharge',
          type: 'number',
          label: `Charge (${SymbolModel.NIS})`,
          placeholder: 'Enter Charge',
          value: charges?.outOfDropZoneParkingCharge,
          styleClass: 'col-12 col-md-3',
        },
      },

      {
        type: null,
        config: {
          name: null,
          type: null,
          styleClass: 'col-12 d-none d-md-flex col-md-6',
        },
      },

      // row 2
      {
        type: FormSubTextComponent,
        config: {
          name: 'null21',
          type: 'text',
          data: {
            text: `Late drop off`,
          },
          styleClass: 'd-flex align-items-center bold col-12 col-md-3 bold-label',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'lateDropOffChargePerMinute',
          type: 'number',
          label: `Per 1 Min (${SymbolModel.NIS})`,
          placeholder: 'Enter Charge',
          value: charges?.lateDropOffChargePerMinute,
          styleClass: 'col-12 col-md-3',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'lateDropOffChargeDelayMinutes',
          type: 'number',
          label: 'Charge Delay (min)',
          placeholder: 'Enter Charge Delay',
          value: charges?.lateDropOffChargeDelayMinutes,
          styleClass: 'col-12 col-md-3',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'lateDropOffChargeMinCharge',
          type: 'number',
          label: `Min charge (${SymbolModel.NIS})`,
          placeholder: 'Enter Min charge',
          value: charges?.lateDropOffChargeMinCharge,
          styleClass: 'col-12 col-md-3',
        },
      },
      // row 3
      {
        type: FormSubTextComponent,
        config: {
          name: 'null31',
          type: 'text',
          data: {
            text: `Non-fuelled
            return`,
          },
          styleClass: 'd-flex align-items-center bold col-12 col-md-3 bold-label',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'nonFulledReturnCharge',
          type: 'number',
          label: `Charge (${SymbolModel.NIS})`,
          placeholder: 'Enter Charge',
          value: charges?.nonFulledReturnCharge,
          styleClass: 'col-12 col-md-3',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'nonFulledReturnUnder',
          type: 'number',
          label: 'Return Under (%)',
          placeholder: 'Enter Return Under',
          value: charges?.nonFulledReturnUnder,
          styleClass: 'col-12 col-md-3',
        },
      },
      {
        type: null,
        config: {
          name: null,
          type: null,
          styleClass: 'col-12 col-md-3',
        },
      },

      // row 4
      {
        type: FormSubTextComponent,
        config: {
          name: 'null41',
          type: 'text',
          data: {
            text: `Late booking
            cancellation`,
          },
          styleClass: 'd-flex align-items-center bold col-12 col-md-3 bold-label',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'lateBookingCancellationCharge',
          type: 'number',
          label: `Charge (${SymbolModel.NIS})`,
          placeholder: 'Enter Charge',
          value: charges?.lateBookingCancellationCharge,
          styleClass: 'col-12 col-md-3',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'lateBookingCancellationChargeHours',
          type: 'number',
          label: 'Return Under (%)',
          placeholder: 'Enter Return Under',
          value: charges?.lateBookingCancellationChargeHours,
          styleClass: 'col-12 col-md-3',
        },
      },
      {
        type: null,
        config: {
          name: null,
          type: null,
          styleClass: 'col-12 col-md-3',
        },
      },
    ];
  }

  generateTaxes(charges: ChargesModel): DynamicFormControl[] {
    return [
      {
        type: FormSubTextComponent,
        config: {
          name: 'null12',
          type: 'text',
          data: {
            text: `Airport taxes`,
          },
          styleClass: 'd-flex align-items-center bold col-12 col-md-5 bold-label',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'airportTaxes',
          type: 'number',
          label: `Charge (${SymbolModel.NIS})`,
          placeholder: 'Enter Charge',
          value: charges?.airportTaxes,
          styleClass: 'col-12 col-md-7',
        },
      },
      {
        type: FormSubTextComponent,
        config: {
          name: 'null22',
          type: 'text',
          data: {
            text: `City Taxes`,
          },
          styleClass: 'd-flex align-items-center bold col-12 col-md-5 bold-label',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'cityTaxes',
          type: 'number',
          label: `Charge (${SymbolModel.NIS})`,
          placeholder: 'Enter Charge',
          value: charges?.cityTaxes,
          styleClass: 'col-12 col-md-7',
        },
      },
      {
        type: FormSubTextComponent,
        config: {
          name: 'null32',
          type: 'text',
          data: {
            text: `Country Taxes`,
          },
          styleClass: 'd-flex align-items-center bold col-12 col-md-5 bold-label',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'countryTaxes',
          type: 'number',
          label: `Charge (${SymbolModel.NIS})`,
          placeholder: 'Enter Charge',
          value: charges?.countryTaxes,
          styleClass: 'col-12 col-md-7',
        },
      },
    ];
  }
  convert?: ModelConverter<DynamicFormControl[], any>;
}
