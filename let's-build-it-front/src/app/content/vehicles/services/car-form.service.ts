import { Injectable } from '@angular/core';
import { IFormGenerator } from '../../../@forms/@core/models/form-generator';
import { DynamicSteppedForm, SteppedFormMode } from '../../../@forms/@core/interfaces/dynamic-stepped-form';
import { FormFile } from '../../../@forms/form-fields/form-file/form-file';
import { FormFileComponent } from '../../../@forms/form-fields/form-file/form-file.component';
import { Validators, AbstractControl, FormGroup, FormArray } from '@angular/forms';
import { SelectItem } from '../../../@forms/@core/interfaces';
import { FormTextComponent } from '../../../@forms/form-fields/form-text/form-text.component';
import { FormSelectComponent } from '../../../@forms/form-fields/form-select/form-select.component';
import { FormDateComponent } from '../../../@forms/form-fields/form-date/form-date.component';
import { FormSwitchComponent } from '../../../@forms/form-fields/form-switch/form-switch.component';
import { TransmissionType } from '../../../@shared/interfaces/transmission-type.enum';
import { FuelType, GovFuelTypes } from '../../../@shared/interfaces/fuel-type.enum';
import { LazyLoadEvent } from '../../../@ideo/components/table/events/lazy-load.event';
import { Observable, Subject } from 'rxjs';
import { CsmProvidersService } from './csm-providers.service';
import { UtilsService } from '../../../@ideo/infrastructure/services/utils.service';
import { CarsService } from './cars.service';
import { PartnersService } from '../../agencies/partners.service';
import { VehiclesService } from '../../../@shared/services/vehicles.service';
import { PagedResponse } from '../../../@ideo/components/table/models/paged-response';
import { MatchMode } from '../../../@ideo/components/table/models/table-filter';
import { VehicleModelSearchModel } from '../../../@shared/models/vehicle-model-search.model';
import { VehicleModelModel } from '../../../@shared/models/vehicle-model.model';
import { map, take, debounceTime } from 'rxjs/operators';
import { asSelectItem } from '../../../prototypes';

@Injectable({
  providedIn: 'root'
})
export class CarFormService implements IFormGenerator<DynamicSteppedForm[]> {

  private csm$: Subject<SelectItem[]> = new Subject<SelectItem[]>();
  private formInstance: FormGroup = {} as FormGroup;

  constructor(
    private csmService: CsmProvidersService,
    private partnersService: PartnersService,
    private vehiclesService: VehiclesService,

  ) { }

  generate(formChanged$: Subject<FormGroup>, isEdit: boolean): DynamicSteppedForm[] {
    formChanged$.subscribe(form => this.formInstance = form);
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
        ),
        take(1),
      )
      .subscribe((res) => setTimeout(() => this.csm$.next(res)));

    let form: DynamicSteppedForm[] = [];
    form.push({
      title: 'General Information',
      mode: SteppedFormMode.Tabbed,
      group: [
        {
          type: FormTextComponent,
          config: {
            name: 'vin',
            type: 'text',
            label: 'VIN',
            placeholder: 'Enter VIN',
            styleClass: 'col-4',
            validation: [Validators.required, Validators.maxLength(64)],
            onChange: (val: string, ctrl: AbstractControl) => {
              if (ctrl.valid) {
                this.vehiclesService.search(val).toPromise().then(res => {
                  if (!!res?.total) {
                    this.vehicleFound(ctrl.parent as FormGroup, res.data[0])
                  }
                })
              }
            },
            errorMessages: {
              required: 'VIN is required',
              maxlength: 'VIN exceeds the maximum length',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'plateNo',
            type: 'text',
            label: 'plate No.',
            placeholder: 'Enter Plate No.',
            styleClass: 'col-4',
            onChange: (val: string, ctrl: AbstractControl) => {
              if (ctrl.valid) {
                this.vehiclesService.search(val).toPromise().then(res => {
                  if (!!res?.total) {
                    this.vehicleFound(ctrl.parent as FormGroup, res.data[0])
                  }

                })
              }
            },
            validation: [Validators.required, Validators.minLength(7), Validators.maxLength(8)],
            errorMessages: {
              required: 'plate number is required',
              maxlength: 'Plate No. exceeds the maximum length',
              minlength: 'invalid Plate No.',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'carOwnerId',
            type: 'text',
            label: 'Car Owner Id',
            placeholder: 'Enter Car Owner Id',
            styleClass: 'col-4',
            validation: [],
            errorMessages: {},
          },
        },
        {
          type: FormSelectComponent,
          config: {
            name: 'partnerId',
            label: 'Agency',
            placeholder: 'Select Agency',
            styleClass: 'col-4',
            validation: [Validators.required],
            optionsArr$: this.partnersService
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
              ),
            errorMessages: {
              required: 'Partner Name is required',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'stateId',
            type: 'number',
            label: 'state Id',
            placeholder: 'Enter state Id',
            styleClass: 'col-4',
            validation: [],
            errorMessages: {},
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'id',
            type: 'hidden',
          },
        },
      ],
    });
    form.push({
      title: 'Vehicle Information',
      mode: SteppedFormMode.Tabbed,
      group: [

        {
          type: FormSelectComponent,
          config: {
            name: 'fuelType',
            label: 'Fuel Type',
            placeholder: 'Select Fuel Type',
            styleClass: 'col-4',
            optionsArr: asSelectItem(FuelType),
            validation: [Validators.required],
            errorMessages: {
              required: 'Fuel Type is required',
            },
          },
        },
        {
          type: FormSelectComponent,
          config: {
            name: 'transmission',
            label: 'Transmission',
            placeholder: 'Select transmission',
            styleClass: 'col-4',
            optionsArr: asSelectItem(TransmissionType),
            validation: [Validators.required],
            errorMessages: {
              required: 'Transmission is required',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'seatsNo',
            type: 'number',
            label: 'Seats No.',
            placeholder: 'Enter seats No.',
            styleClass: 'col-4',
            validation: [Validators.required],
            errorMessages: {
              required: 'Seats No. is required',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'enginePower',
            type: 'number',
            label: 'Engine Power',
            placeholder: 'Enter Engine Power',
            styleClass: 'col-4',
            validation: [],
            errorMessages: {},
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'doorsNumber',
            type: 'number',
            label: 'Doors Number',
            placeholder: 'Enter Doors Number',
            styleClass: 'col-4',
            validation: [Validators.required],
            errorMessages: { required: 'Doors Number is required' },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'engineDisplacement',
            type: 'number',
            label: 'Engine Displacement',
            placeholder: 'Enter Engine Displacement',
            styleClass: 'col-4',
            validation: [],
            errorMessages: {},
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'tankCapacity',
            type: 'number',
            label: 'Tank Capacity',
            placeholder: 'Enter Tank Capacity',
            styleClass: 'col-4',
            validation: [],
            errorMessages: {},
          },
        },
        {
          type: FormSwitchComponent,
          config: {
            name: 'isNew',
            type: 'text',
            label: 'is New',
            styleClass: 'col-4 col-md-6 col-lg-3 col-xl-2',
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'kmAtInitiate',
            type: 'number',
            label: 'km At Initiate',
            placeholder: 'Enter km At Initiate',
            styleClass: 'col-4',
            validation: [],
            errorMessages: {},
          },
        },
      ],
    });
    form.push({
      title: 'Manufacturer Information',
      mode: SteppedFormMode.Tabbed,
      group: [
        {
          type: FormTextComponent,
          config: {
            name: 'manufacturerCode',
            type: 'text',
            label: 'Manufacturer Code',
            placeholder: 'Enter Manufacturer Code',
            styleClass: 'col-4',
            validation: [Validators.maxLength(32)],
            errorMessages: {
              maxlength: 'Manufacturer Code exceeds the maximum length',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'manufacturer',
            type: 'text',
            label: 'Manufacturer',
            placeholder: 'Enter Manufacturer',
            styleClass: 'col-4',
            validation: [Validators.maxLength(128)],
            errorMessages: {
              maxlength: 'manufacturer exceeds the maximum length',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'modelCode',
            type: 'text',
            label: 'Model Code',
            placeholder: 'Enter Model Code',
            styleClass: 'col-4',
            validation: [Validators.maxLength(32)],
            errorMessages: {
              maxlength: 'Model Code exceeds the maximum length',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'model',
            type: 'text',
            label: 'Model',
            placeholder: 'Enter Model',
            styleClass: 'col-4',
            validation: [Validators.maxLength(128)],
            errorMessages: {
              maxlength: 'Model exceeds the maximum length',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'modelYear',
            type: 'number',
            label: 'Model Year',
            placeholder: 'Enter Model Year',
            styleClass: 'col-4',
            validation: [Validators.maxLength(8)],
            errorMessages: {
              maxlength: 'Model Year exceeds the maximum length',
            },
          },
        },
      ],
    });
    form.push({
      title: 'Service Information',
      mode: SteppedFormMode.Tabbed,
      group: [
        {
          type: FormTextComponent,
          config: {
            name: 'serviceKmInterval',
            type: 'number',
            label: 'service Km Interval',
            placeholder: 'Enter service Km Interval',
            styleClass: 'col-4',
            validation: [],
            errorMessages: {},
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'kmAtServiceDate',
            type: 'number',
            label: 'km At Service Date',
            placeholder: 'Enter km At Service Date',
            styleClass: 'col-4',
            validation: [],
            errorMessages: {},
          },
        },
        {
          type: FormDateComponent,
          config: {
            name: 'serviceDate',
            type: 'date',
            label: 'service Date',
            placeholder: 'Enter service Date',
            styleClass: 'col-4',
            validation: [],
            errorMessages: {},
          },
        },
      ],
    });
    form.push({
      title: 'Chip Provider Information',
      mode: SteppedFormMode.Tabbed,
      group: [
        {
          type: FormSelectComponent,
          config: {
            name: 'csmType',
            label: 'CSM Type',
            placeholder: 'Select CSM Type',
            styleClass: 'col-4',
            optionsArr$: this.csm$,
            validation: [Validators.required],
            errorMessages: { required: 'CSM Type is required' },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'vehiclePlugId',
            type: 'text',
            label: 'Vehicle Plug Id',
            placeholder: 'Enter Vehicle Plug Id',
            styleClass: 'col-4',
            validation: [Validators.maxLength(32)],
            errorMessages: { maxlength: 'Vehicle Plug Id exceeds the maximum length' },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'csmManufacturer',
            type: 'text',
            label: 'CSM Manufacturer',
            placeholder: 'Enter CSM Manufacturer',
            styleClass: 'col-4',
            validation: [Validators.maxLength(64)],
            errorMessages: { maxlength: 'otaKey Manufacturer exceeds the maximum length' },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'csmModel',
            type: 'text',
            label: 'CSM Model',
            placeholder: 'Enter CSM Model',
            styleClass: 'col-4',
            validation: [Validators.maxLength(64)],
            errorMessages: { maxlength: 'otaKey Model exceeds the maximum length' },
          },
        },
      ],
    });
    form.push({
      title: 'Price Information',
      mode: SteppedFormMode.Tabbed,
      group: [
        {
          type: FormTextComponent,
          config: {
            name: 'pricingType',
            type: 'text',
            label: 'Pricing Group',
            placeholder: 'Enter Pricing Group',
            styleClass: 'col-4',
            validation: [Validators.maxLength(64)],
            errorMessages: {
              maxlength: 'Pricing Group exceeds the maximum length',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'price',
            type: 'number',
            label: 'Price',
            placeholder: 'Enter Price',
            styleClass: 'col-4',
            validation: [],
            errorMessages: {},
          },
        },
      ],
    });
    form.push({
      title: 'Media Information',
      mode: SteppedFormMode.Tabbed,
      group: [
        {
          type: FormFileComponent,
          config: {
            name: 'profileImgId',
            label: 'Car profile Image',
            styleClass: 'col-6 col-md-4',
            data: {
              autoUpload: true,
              newStyle: true,
              title: 'Click here',
              subTile: 'to upload an image',
              multiple: false,
            } as FormFile,
          },
        },
        {
          type: FormFileComponent,
          config: {
            name: 'insuranceMediaId',
            label: 'Car Insurance',
            styleClass: 'col-6 col-md-4',
            data: {
              autoUpload: true,
              newStyle: true,
              title: 'Click here',
              subTile: 'to upload an image',
              multiple: false,
            } as FormFile,
          },
        },
        {
          type: FormFileComponent,
          config: {
            name: 'licenceMediaId',
            label: 'Car Licence',
            styleClass: 'col-6 col-md-4',
            data: {
              autoUpload: true,
              newStyle: true,
              title: 'Click here',
              subTile: 'to upload an image',
              multiple: false,
            } as FormFile,
          },
        },
        {
          type: FormFileComponent,
          config: {
            name: 'frontImgMediaId',
            label: 'Car Front Image',
            styleClass: 'col-6 col-md-4',
            data: {
              autoUpload: true,
              newStyle: true,
              title: 'Click here',
              subTile: 'to upload an image',
              multiple: false,
            } as FormFile,
          },
        },
        {
          type: FormFileComponent,
          config: {
            name: 'rearImgMediaId',
            label: 'Car Rear Image',
            styleClass: 'col-6 col-md-4',
            data: {
              autoUpload: true,
              newStyle: true,
              title: 'Click here',
              subTile: 'to upload an image',
              multiple: false,
            } as FormFile,
          },
        },
        {
          type: FormFileComponent,
          config: {
            name: 'rightSideImgMediaId',
            label: 'Car Right Side Image',
            styleClass: 'col-6 col-md-4',
            data: {
              autoUpload: true,
              newStyle: true,
              title: 'Click here',
              subTile: 'to upload an image',
              multiple: false,
            } as FormFile,
          },
        },
        {
          type: FormFileComponent,
          config: {
            name: 'leftSideImgMediaId',
            label: 'Car Left Side Image',
            styleClass: 'col-6 col-md-4',
            data: {
              autoUpload: true,
              newStyle: true,
              title: 'Click here',
              subTile: 'to upload an image',
              multiple: false,
            } as FormFile,
          },
        },
      ],
    });

    return form;
  }

  private getVehicleInformation(searchResult: VehicleModelSearchModel): Observable<PagedResponse<VehicleModelModel>> {
    let evt: LazyLoadEvent = {
      page: 1,
      pageSize: 5,
      filters: {
        "TozeretCd": {
          matchMode: MatchMode.Equals,
          value: searchResult.tozeret_cd,
        },
        "DegemCd": {
          matchMode: MatchMode.Equals,
          value: searchResult.degem_cd,
        },
        "ShnatYitzur": {
          matchMode: MatchMode.Equals,
          value: searchResult.shnat_yitzur,
        }
      }
    };

    return this.vehiclesService.getAll(evt);
  }

  private vehicleFound(step: FormGroup, vehicleInfo: VehicleModelSearchModel) {
    const array = this.formInstance.get("forms") as FormArray;
    this.getVehicleInformation(vehicleInfo).toPromise().then(modelRes => {
      if (!!modelRes?.total) {
        let vehicleModel: VehicleModelModel = modelRes.data[0];

        let generalInformationStep = array.get("0") as FormGroup;
        generalInformationStep.controls['vin'].patchValue(vehicleInfo.misgeret);
        generalInformationStep.controls['plateNo'].patchValue(vehicleInfo.mispar_rechev);

        let vehicleInformationStep = array.get("1") as FormGroup;
        vehicleInformationStep.controls['fuelType'].setValue(GovFuelTypes[vehicleInfo.sug_delek_nm]);
        vehicleInformationStep.controls['transmission'].setValue(!vehicleModel.automaticInd ? TransmissionType.Manual : TransmissionType.Auto);
        vehicleInformationStep.controls['seatsNo'].setValue(vehicleModel.misparMoshavim);
        vehicleInformationStep.controls['enginePower'].setValue(vehicleModel.koahSus);
        vehicleInformationStep.controls['doorsNumber'].setValue(vehicleModel.misparDlatot);
        vehicleInformationStep.controls['engineDisplacement'].setValue(vehicleModel.nefahManoa);
        // vehicleInformationStep.controls['tankCapacity'].setValue(vehicleModel.nefahManoa);
        vehicleInformationStep.controls['kmAtInitiate'].setValue(vehicleInfo.horaat_rishum);

        let manufacturerInformationStep = array.get("2") as FormGroup;
        manufacturerInformationStep.controls['manufacturer'].setValue(vehicleModel.tozar);
        manufacturerInformationStep.controls['manufacturerCode'].setValue(vehicleInfo.tozeret_cd);
        manufacturerInformationStep.controls['model'].setValue(vehicleInfo.kinuy_mishari);
        manufacturerInformationStep.controls['modelCode'].setValue(vehicleInfo.degem_cd);
        manufacturerInformationStep.controls['modelYear'].setValue(vehicleInfo.shnat_yitzur);

        let chipProviderStep = array.get("4") as FormGroup;
        chipProviderStep.controls['csmModel'].setValue(vehicleInfo.kinuy_mishari);
        chipProviderStep.controls['csmManufacturer'].setValue(vehicleModel.tozar);


      }
    });
  }
}
