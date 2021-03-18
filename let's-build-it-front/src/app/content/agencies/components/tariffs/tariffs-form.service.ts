import { Injectable } from '@angular/core';
import { SideBarPageService } from '../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { PricesService } from './prices.service';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from '../../../../@forms/form-fields/form-text/form-text.component';
import { PartnerPriceModel, Period, PartnerPriceValueModel } from '../../../../@shared/models/partner-price.model';
import { FormDateComponent } from '../../../../@forms/form-fields/form-date/form-date.component';
import { SymbolModel } from '@app/@shared/models/symbol.model';
import { FormCheckboxComponent } from '../../../../@forms/form-fields/form-checkbox/form-checkbox.component';
import { FormSelectComponent } from '../../../../@forms/form-fields/form-select/form-select.component';
import { PartnersService } from '../../partners.service';
import { MAX_INT } from '../../../../@ideo/components/table/table.component';
import { LazyLoadEvent } from '../../../../@ideo/components/table/events/lazy-load.event';
import { take, map } from 'rxjs/operators';
import { SelectItem } from '../../../../@ideo/components/table/models/select-item';
import { range } from 'lodash';
import { FormArrayComponent } from '../../../../@forms/form-fields/form-array/form-array.component';
import { AbstractControl, Validators, FormControl, FormArray } from '@angular/forms';
import { IdeoValidators } from '../../../../@forms/@core/validators/ideo.validators';
import { FormArrayData } from '../../../../@forms/form-fields/form-array/form-array';
import { asSelectItem } from '../../../../prototypes';
import { FormSubTextComponent } from '../../../../@forms/form-fields/form-sub-text/form-sub-text.component';

@Injectable({
  providedIn: 'root'
})
export class TariffsFormService {
  constructor(
    private partnersService: PartnersService
  ) { }

  generate(entity: PartnerPriceModel = null, duplicate?: boolean): DynamicFormControl[] {
    let form: DynamicFormControl[] = [];
    form.push(
      ...range(1).map(i => {
        if (entity?.id && !duplicate) {
          return {
            type: FormTextComponent,
            config: {
              name: 'id',
              type: 'hidden',
              styleClass: 'd-none',
              value: entity?.id,
            }
          } as DynamicFormControl
        }
        else {
          return null
        }
      }).filter(i => !!i),
      {
        type: FormSelectComponent,
        config: {
          name: 'partnerId',
          type: 'number',
          label: 'Partner',
          placeholder: 'Select Partner',
          styleClass: 'col-12 col-md-6',
          value: entity?.partnerId,
          validation: [Validators.required],
          errorMessages: {
            required: 'Partner is required'
          },
          optionsArr$: this.partnersService.getAll({ page: 1, pageSize: MAX_INT } as LazyLoadEvent).pipe(take(1), map(
            (res) => res?.data.map(i => { return { label: i.name, value: i.id } as SelectItem })
          )),
        },
      },

      {
        type: FormTextComponent,
        config: {
          name: 'name',
          type: 'text',
          label: 'Name',
          placeholder: 'Enter Name',
          value: entity?.name,
          styleClass: 'col-12 col-md-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Name is required'
          },
        },
      },
      // {
      //   type: FormTextComponent,
      //   config: {
      //     name: 'pricingGroupId',
      //     label: 'Pricing Group Id',
      //     type: 'number',
      //     placeholder: 'Enter Pricing Group Id',
      //     value: entity?.pricingGroupId,
      //     styleClass: 'col-12 col-md-6',
      //   },
      // },
      // {
      //   type: FormCheckboxComponent,
      //   config: {
      //     name: 'isPricingGroupDefault',
      //     label: 'Is Pricing Group Default',
      //     placeholder: 'Enter Is Pricing Group Default',
      //     value: entity?.isPricingGroupDefault,
      //     styleClass: 'col-12 col-md-6',
      //   },
      // },
      // TODO: add when server has Pricing Group 
      {
        type: FormCheckboxComponent,
        config: {
          name: 'isActive',
          label: 'State',
          value: entity?.isActive,
          styleClass: 'col-12 col-md-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'State is required'
          },
        },
      },
      {
        type: FormDateComponent,
        config: {
          name: 'start',
          type: 'date',
          label: 'Tariff Start',
          placeholder: 'Enter Tariff Start',
          value: entity?.start,
          styleClass: 'col-12 col-md-6',
          // validation: [IdeoValidators.greaterThanToday()],
          // errorMessages: {
          //   end: 'Start Date must be grater then End Date'
          // }
        },
      },
      {
        type: FormDateComponent,
        config: {
          name: 'end',
          type: 'date',
          label: 'Tariff End',
          placeholder: 'Enter Tariff End',
          value: entity?.start,
          styleClass: 'col-12 col-md-6',
          validation: [],
          // errorMessages: {
          //   end: 'End Date must be grater then Start Date'
          // }
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'minChargeTime',
          type: 'number',
          label: 'Min Charge (minutes)',
          placeholder: 'Enter Min Charge (minutes)',
          value: entity?.minChargeTime,
          styleClass: 'col-12 col-md-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Min Charge (minutes) is required'
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'extraMileageCharge',
          type: 'number',
          label: `Extra Mileage (${SymbolModel.NIS}/km)`,
          placeholder: `Enter Extra Mileage(${SymbolModel.NIS}/km)`,
          value: entity?.extraMileageCharge,
          styleClass: 'col-12 col-md-6',
          validation: [Validators.required],
          errorMessages: {
            required: `Extra Mileage (${SymbolModel.NIS}/km) is required`
          },
        },
      },

      {
        type: FormArrayComponent,
        config: {
          name: 'priceValues',
          value: entity?.priceValues || range(1, 6).map(i => {
            return {
              type: i,
              price: null,
              mileageIncluded: null,
              additionalMileagePrice: null,
            } as PartnerPriceValueModel
          }),
          validation: [Validators.required, (ctrl: FormArray) => {
            return !ctrl.value?.length ? {
              'subscriptions': 'you must add subscriptions.'
            } : null
          }],
          styleClass: 'col-12',
          data: {
            data: entity?.priceValues || range(1, 6).map(i => {
              return {
                type: i,
                price: null,
                mileageIncluded: null,
                additionalMileagePrice: null,
              } as PartnerPriceValueModel
            }),
            groupValidations: [],
            errorMessages: { '': '' },
            showSeparator: false,
            disableAddAndRemoveMode: true,
            showAddingMode: false,
            // dynamicConfig: (index: number, item: PartnerPriceValueModel) => {
            //   let i = index;
            //   return [{
            //     type: FormSelectComponent,
            //     config: {
            //       name: `priceValues-${i - 1}`,
            //       type: 'number',
            //       label: `${Period[i]} Price & Mileage`,
            //       placeholder: `Enter Extra Mileage(${SymbolModel.NIS}/km)`,
            //       value: entity?.priceValues?.[i - 1],
            //       styleClass: 'col-12 col-md-6',
            //       validation: [Validators.required],
            //       errorMessages: {
            //         required: `${Period[i]} Price & Mileage is required`
            //       },
            //     },
            //   },
            //   {
            //     type: FormTextComponent,
            //     config: {
            //       name: 'mileageIncluded',
            //       label: 'Discount (%)',
            //       placeholder: 'Discount',
            //       type: 'number',
            //       validation: [Validators.max(100), Validators.min(0)]
            //       , errorMessages: {
            //         max: 'Discount must be smaller then 100%',
            //         min: 'Discount must be grater then 0%'
            //       }
            //     }
            //   },]
            // },
            formConfig: [
              !!entity ? {
                type: FormTextComponent,
                config: {
                  type: 'hidden',
                  name: 'partnerPriceId',
                  disabled: true,
                  styleClass: 'd-none'
                },
              } : null,
              {
                type: FormSelectComponent,
                config: {
                  name: 'type',
                  label: 'Type',
                  placeholder: 'Select Day',
                  optionsArr: asSelectItem(Period),
                  disabled: true,
                  validation: [Validators.required]
                },
              },
              {
                type: FormTextComponent,
                config: {
                  name: 'price',
                  label: 'Price',
                  placeholder: 'Price',
                  type: 'number',
                  validation: [Validators.required],
                  errorMessages: {
                    required: 'Price is required',
                  },
                  onChange: (currentValue: any, control: AbstractControl) => {
                    let additionalMileagePrice = control.parent.controls['additionalMileagePrice'] as AbstractControl
                    let mileageIncluded = control.parent.controls['mileageIncluded'].value || 1
                    additionalMileagePrice.setValue(currentValue / (mileageIncluded))
                  },
                }
              },
              {
                type: FormTextComponent,
                config: {
                  name: 'mileageIncluded',
                  label: 'Mileage Included',
                  placeholder: 'Mileage Included',
                  type: 'number',
                  validation: [Validators.required],
                  errorMessages: {
                    required: 'Mileage Included is required',
                  },
                  onChange: (currentValue: any, control: AbstractControl) => {
                    let additionalMileagePrice = control.parent.controls['additionalMileagePrice'] as AbstractControl
                    let price = control.parent.controls['price'].value || 0
                    additionalMileagePrice.setValue(price / currentValue)
                  },
                }
              },
              {
                type: FormTextComponent,
                config: {
                  name: 'additionalMileagePrice',
                  label: 'additional Mileage Price',
                  placeholder: 'additional Mileage Price',
                  type: 'number',
                  disabled: true,
                }
              },
            ].filter(i => !!i)
          } as FormArrayData,
        }
      },
    );
    return form;
  }

  generateArrControl(entity: PartnerPriceModel) {
    let form: DynamicFormControl[][] = [];
    entity.priceValues.map(
      i => {
        form.push([

          {
            type: FormTextComponent,
            config: {
              type: 'hidden',
              name: 'partnerPriceId',
              value: i?.partnerPriceId,
              disabled: true,
              styleClass: 'd-none'
            },
          },
          {
            type: FormSelectComponent,
            config: {
              name: 'type',
              label: 'Type',
              type: 'hidden',
              placeholder: 'Select Type',
              styleClass: 'd-none',
              value: i?.type,
              optionsArr: asSelectItem(Period),
              disabled: true,
              validation: [Validators.required]
            },
          },
          {
            type: FormTextComponent,
            config: {
              name: 'price',
              label: 'Price',
              placeholder: 'Price',
              value: i?.price,
              type: 'number',
              validation: [Validators.required],
              errorMessages: {
                required: 'Price is required',
              },
              onChange: (currentValue: any, control: AbstractControl) => {
                let additionalMileagePrice = control.parent.controls['additionalMileagePrice'] as AbstractControl
                let mileageIncluded = control.parent.controls['mileageIncluded'].value || 1
                additionalMileagePrice.setValue(currentValue / (mileageIncluded))
              },
            }
          },
          {
            type: FormTextComponent,
            config: {
              name: 'mileageIncluded',
              label: 'Mileage Included',
              placeholder: 'Mileage Included',
              type: 'number',
              value: i.mileageIncluded,
              validation: [Validators.required],
              errorMessages: {
                required: 'Mileage Included is required',
              },
              onChange: (currentValue: any, control: AbstractControl) => {
                let additionalMileagePrice = control.parent.controls['additionalMileagePrice'] as AbstractControl
                let price = control.parent.controls['price'].value || 0
                additionalMileagePrice.setValue(price / currentValue)
              },
            }
          },
          {
            type: FormTextComponent,
            config: {
              name: 'additionalMileagePrice',
              label: 'additional Mileage Price',
              placeholder: 'additional Mileage Price',
              value: i.additionalMileagePrice,
              type: 'number',
              disabled: true,
            }
          }] as DynamicFormControl[]
        )
      }
    )
    return form
  }
}
