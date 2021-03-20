import { Injectable } from '@angular/core';
import { IFormGenerator } from '../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../@forms/@core/interfaces/dynamic-form-control';
import { FormDateComponent, FormSelectComponent } from '../../@forms/form-fields';
import { Validators } from '@angular/forms';
import { InventoryType } from '../../@shared/interfaces/inventory-type.enum';
import { FormTextComponent } from '../../@forms/form-fields/form-text/form-text.component';
import { UtilsService } from '@app/@core/services/utils.service';
import { CarsService } from '../vehicles/services/cars.service';
import { BehaviorSubject } from 'rxjs';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { map } from 'rxjs/operators';
import { CsmProvidersService } from '../vehicles/services/csm-providers.service';
import { PartnersService } from '../agencies/partners.service';
import { MAX_INT } from '@app/@ideo/components/table/table.component';
import { InventoryModel } from '../../@shared/models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryFormService implements IFormGenerator<DynamicFormControl[]> {
  constructor(
    private utilsService: UtilsService,
    private carsService: CarsService,
    private partnersService: PartnersService,
    private csmService: CsmProvidersService
  ) {}

  private partners$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  private cars$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  private csm$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  generate(isEdit: boolean, inventory: InventoryModel = null): DynamicFormControl[] {
    let form: DynamicFormControl[] = [];
    this.carsService
      .getAll({
        page: 1,
        pageSize: 200,
      } as LazyLoadEvent)
      .pipe(
        map((r) =>
          r?.data?.map((a) => {
            return {
              value: a.id,
              label: a.id.toString(),
            } as SelectItem;
          })
        )
      )
      .subscribe((res) => this.cars$.next(res));

    this.partnersService
      .getAll({
        page: 1,
        pageSize: MAX_INT,
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
    this.csmService
      .getTypes()
      .pipe(
        map((r) =>
          r?.map((a) => {
            return {
              value: a,
              label: a,
            } as SelectItem;
          })
        )
      )
      .subscribe((res) => this.csm$.next(res));
    form.push(
      {
        type: FormSelectComponent,
        config: {
          name: 'inventoryType',
          label: 'Inventory Type',
          placeholder: 'Select Inventory Type',
          value: inventory?.inventoryType,
          styleClass: 'col-12',
          validation: [Validators.required],
          optionsArr: this.utilsService.toSelectItem(InventoryType),
          errorMessages: {
            required: 'Inventory Type is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'externalId',
          type: 'text',
          label: 'External Id',
          value: inventory?.externalId,
          placeholder: 'Enter External Id',
          styleClass: 'col-12',
          validation: [Validators.required],
          errorMessages: {
            required: 'External Id is required',
          },
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'chipProviderType',
          label: 'Chip Provider Type',
          value: inventory?.chipProviderType,
          placeholder: 'Select Chip Provider Type',
          styleClass: 'col-12',
          optionsArr$: this.csm$,
          validation: [],
          errorMessages: {},
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'carId',
          label: 'Car Id',
          value: inventory?.carId,
          placeholder: 'Select Car Id',
          styleClass: 'col-12',
          optionsArr$: this.cars$,
          validation: [],
          errorMessages: {},
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'partnerId',
          label: 'Partner Id',
          value: inventory?.partnerId,
          placeholder: 'Select Partner Id',
          styleClass: 'col-12',
          optionsArr$: this.partners$,
          validation: [],
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
          value: inventory?.id,
          type: 'hidden',
        },
      }
    );
    return form;
  }
}
