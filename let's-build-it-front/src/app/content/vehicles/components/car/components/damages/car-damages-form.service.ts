import { Injectable } from '@angular/core';
import { IFormGenerator, ModelConverter } from '../../../../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../../../../@forms/@core/interfaces/dynamic-form-control';
import { CarDamageModel, DamageDateType, DamagePositionType, DamageSideType, DamageType } from '../../../../../../@shared/models/car-damage.model';
import { FormSelectComponent } from '../../../../../../@forms/form-fields/form-select/form-select.component';
import { FormDateComponent } from '../../../../../../@forms/form-fields/form-date/form-date.component';
import { UtilsService } from '../../../../../../@core/services/utils.service';
import { FormTextComponent } from '../../../../../../@forms/form-fields/form-text/form-text.component';
import { Validators } from '@angular/forms';
import { FormFileComponent } from '../../../../../../@forms/form-fields/form-file/form-file.component';
import { FormFile } from '../../../../../../@forms/form-fields/form-file/form-file';


@Injectable({
  providedIn: 'root'
})
export class CarDamagesFormService implements IFormGenerator < DynamicFormControl[] > {

  constructor(private utilsService: UtilsService,) { }
  generate(isEdit: boolean, carDamage: CarDamageModel = null): DynamicFormControl[] {
    let form: DynamicFormControl[] = [];
    form.push(
      {
        type: FormFileComponent,
        config: {
          name: 'damageMediaItems',
          label: 'Damage Media Items',
          data: {
            autoUpload: true,
          } as FormFile,
          styleClass: 'col-12',
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'orderId',
          label: 'Order Id',
          placeholder: 'Select Order Id',
          value: carDamage?.orderId,
          styleClass: 'col-4',
          //ToDo: add orders dropdown
        },
      },
      {
        type: FormDateComponent,
        config: {
          name: 'occurrenceDate',
          label: 'Occurrence Date',
          type: 'datetime-local',
          placeholder: 'Select Occurrence Date',
          styleClass: 'col-4',
          value: carDamage?.occurrenceDate,
          validation: [],
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'type',
          label: 'Type',
          placeholder: 'Select Damage Type',
          value: carDamage?.type,
          styleClass: 'col-4',
          optionsArr: this.utilsService.toSelectItem(DamageType),
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'position',
          label: 'Position',
          placeholder: 'Select Damage Position',
          value: carDamage?.position,
          styleClass: 'col-4',
          optionsArr: this.utilsService.toSelectItem(DamagePositionType),
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'side',
          label: 'Side',
          placeholder: 'Select Damage Side',
          value: carDamage?.side,
          styleClass: 'col-4',
          optionsArr: this.utilsService.toSelectItem(DamageSideType),
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'damageDateType',
          label: 'Damage Date Type',
          placeholder: 'Select Date Type',
          value: carDamage?.damageDateType,
          styleClass: 'col-4',
          optionsArr: this.utilsService.toSelectItem(DamageDateType),
          validation: [Validators.required],
          errorMessages: {
            required: 'Damage Date Type is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'additionalInfo',
          type: 'text',
          label: 'Additional Info',
          value: carDamage?.additionalInfo,
          data: {
            rows: 4,
          },
          styleClass: 'col-12',
          validation: [Validators.required, Validators.maxLength(2048)],
          errorMessages: {
            required: 'Additional Info is required',
            maxlength: 'Additional Info exceeds the maximum length',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'id',
          type: 'hidden',
          value: carDamage?.id
        },
      },
    );
    return form;
  }
  
}
