import { Injectable } from '@angular/core';
import { DynamicFormControl } from '../../../../../../@forms/@core/interfaces/dynamic-form-control';
import { IFormGenerator } from '../../../../../../@forms/@core/models/form-generator';
import { DiscountsModel, DiscountType } from '../../../../../../@shared/models/discounts-and-charges.model';
import { FormArrayData } from '../../../../../../@forms/form-fields/form-array/form-array';
import { Validators, AbstractControl } from '@angular/forms';
import { FormTextComponent } from '../../../../../../@forms/form-fields/form-text/form-text.component';
import { FormArrayComponent } from '../../../../../../@forms/form-fields/form-array/form-array.component';
import { FormSelectComponent } from '../../../../../../@forms/form-fields/form-select/form-select.component';

import { FormDateComponent } from '../../../../../../@forms/form-fields/form-date/form-date.component';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { FieldEvent } from '../../../../../../@forms/@core/interfaces/events';

@Injectable({
  providedIn: 'root',
})
export class DiscountFormService implements IFormGenerator<DynamicFormControl[]> {
  constructor(private date: DatePipe) {}
  generate(type: DiscountType, items: DiscountsModel[]): DynamicFormControl[] {
    switch (type) {
      case DiscountType.Weekend:
        return this.generateWeekend(items);
      case DiscountType.Hourly:
        return this.generateHourly(items);
      case DiscountType.Holiday:
        return this.generateHoliday(items);
    }
  }

  convert(values: DiscountsModel[], objInEdit?: any, options?: any): DiscountsModel[] {
    switch (options?.type) {
      case DiscountType.Weekend:
        return this.convertWeekend(values);
      case DiscountType.Hourly:
        return this.convertHourly(values);
      case DiscountType.Holiday:
        return this.convertHoliday(values);
    }
    return null;
  }

  convertHourly(items: any[]): DiscountsModel[] {
    return items.map((x) => {
      x.type = DiscountType.Hourly;
      x.start = this.hoursCount(x.start);
      x.end = this.hoursCount(x.end);
      return x as DiscountsModel;
    });
  }

  private hoursCount(val: any): Date | string {
    if (val.length == 5) {
      let start = new Date();
      const startSplit = val.split(':');
      start.setHours(startSplit[0], startSplit[1]);
      return start;
    }
    return val;
  }

  convertWeekend(items: any[]): DiscountsModel[] {
    return items.map((x) => {
      x.type = DiscountType.Weekend;
      x.start = this.weekendCalc(x.start);
      x.end = x.start;
      return x as DiscountsModel;
    });
  }

  convertHoliday(items: any[]): DiscountsModel[] {
    return items.map((x) => {
      x.type = DiscountType.Holiday;
      x.end = x.start;
      return x as DiscountsModel;
    });
  }

  private weekendCalc(val: any): Date | string {
    if (!(val instanceof Date)) {
      let date = new Date();
      let currDay = date.getDay();
      let daysCnt = 0;
      if (currDay > val) {
        while (currDay > val + daysCnt) {
          daysCnt++;
        }
        date.setDate(date.getDate() - daysCnt);
      } else {
        while (currDay < val - daysCnt) {
          daysCnt++;
        }
        date.setDate(date.getDate() + daysCnt);
      }
      return date.toISOString();
    }
    return val;
  }

  generateWeekend(items: DiscountsModel[]): DynamicFormControl[] {
    // items = items.map(x => {
    //   x.start = this.date.transform(x.start, 'hh:mm');
    //   x.end = this.date.transform(x.end, 'hh:mm')
    //   return x;
    // })
    const dayVal = {
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    let setter: Subject<FieldEvent> = new Subject<FieldEvent>();
    items.forEach((x) => {
      x.start = dayVal[this.date.transform(x.start, 'EEEE')];
      x.end = dayVal[this.date.transform(x.start || x.end, 'EEEE')];
    });
    return [
      {
        type: FormArrayComponent,
        config: {
          name: 'weekends',
          value: items,
          styleClass: 'col-12',
          setter: setter,
          data: {
            data: items,
            addLabel: 'Add',
            formConfig: [
              {
                type: FormSelectComponent,
                config: {
                  name: 'start',
                  label: 'Weekends Day',
                  placeholder: 'Select Day',
                  optionsArr: [
                    { label: 'Thursday', value: 4 },
                    { label: 'Friday', value: 5 },
                    { label: 'Saturday', value: 6 },
                  ],
                  validation: [Validators.required],
                },
              },
              {
                type: FormTextComponent,
                config: {
                  name: 'discount',
                  label: 'Discount (%)',
                  placeholder: 'Discount',
                  type: 'number',
                  validation: [Validators.max(100), Validators.min(0)],
                  errorMessages: {
                    max: 'Discount must be smaller then 100%',
                    min: 'Discount must be grater then 0%',
                  },
                },
              },
            ],
          } as FormArrayData,
        },
      },
    ];
  }

  generateHourly(items: DiscountsModel[]): DynamicFormControl[] {
    items.forEach((x) => {
      x.start = this.date.transform(x.start, 'hh:mm');
      x.end = this.date.transform(x.end, 'hh:mm');
    });
    let setter: Subject<FieldEvent> = new Subject<FieldEvent>();
    return [
      {
        type: FormArrayComponent,
        config: {
          name: 'hourly',
          value: items,
          styleClass: 'col-12',
          setter: setter,
          data: {
            data: items,
            addLabel: 'Add',
            formConfig: [
              {
                type: FormDateComponent,
                config: {
                  name: 'start',
                  label: 'Start Hour',
                  type: 'time',
                  placeholder: 'Select Hour',
                  // validation: [Validators.required, IdeoValidators.smallerThanOrEquals('end')]
                  validation: [Validators.required],
                },
              },
              {
                type: FormDateComponent,
                config: {
                  name: 'end',
                  type: 'time',
                  label: 'End Hour',
                  placeholder: 'Select Hour',
                  // validation: [Validators.required, IdeoValidators.greaterThanOrEquals('start')]
                  validation: [Validators.required],
                },
              },
              {
                type: FormTextComponent,
                config: {
                  name: 'discount',
                  label: 'Discount (%)',
                  placeholder: 'Discount',
                  type: 'number',
                  validation: [Validators.max(100), Validators.min(0)],
                  errorMessages: {
                    max: 'Discount must be smaller then 100%',
                    min: 'Discount must be grater then 0%',
                  },
                },
              },
            ],
          } as FormArrayData,
        },
      },
    ];
  }

  generateHoliday(items: DiscountsModel[]): DynamicFormControl[] {
    items.forEach((x) => {
      x.start = (x.start as string).slice(0, 10);
      x.end = (x.end as string).slice(0, 10);
    });
    let setter: Subject<FieldEvent> = new Subject<FieldEvent>();
    return [
      {
        type: FormArrayComponent,
        config: {
          name: 'holidays',
          value: items,
          styleClass: 'col-12 ',
          setter: setter,
          data: {
            data: items,
            addLabel: 'Add',

            formConfig: [
              {
                type: FormTextComponent,
                config: {
                  name: 'name',
                  label: 'Name',
                  placeholder: 'Name',
                  type: 'text',
                  validation: [Validators.required],
                },
              },
              {
                type: FormDateComponent,
                config: {
                  name: 'start',
                  label: 'Date',
                  type: 'date',
                  validation: [Validators.required],
                },
              },
              {
                type: FormTextComponent,
                config: {
                  name: 'discount',
                  label: 'Discount (%)',
                  type: 'number',
                  placeholder: 'Discount',
                  validation: [Validators.max(100), Validators.min(0)],
                  // setter: radiusSetter
                  errorMessages: {
                    max: 'Discount must be smaller then 100%',
                    min: 'Discount must be grater then 0%',
                  },
                },
              },
            ],
          } as FormArrayData,
        },
      },
    ];
  }
}
