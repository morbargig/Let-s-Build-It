import { Injectable } from '@angular/core';
import { IFormGenerator } from '../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../@forms/@core/interfaces/dynamic-form-control';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, NavigationEnd } from '@angular/router';
import { PageFormConfig } from '../../../@shared/models/edit-form.config';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { FieldEvent, SelectItem } from '../../../@forms/@core/interfaces';
import { FormTextComponent } from '../../../@forms/form-fields/form-text/form-text.component';
import { Validators, AbstractControl, FormArray } from '@angular/forms';
import { FormFileComponent } from '../../../@forms/form-fields/form-file/form-file.component';
import { FormDateComponent, FormFile, FormSelectComponent, FormSwitchComponent } from '../../../@forms/form-fields';
import { CarsService } from '../services/cars.service';
import { PartnersService } from '../../agencies/partners.service';
import { LazyLoadEvent } from '../../../@ideo/components/table/events/lazy-load.event';
import { WizardFormConfig } from '@app/@shared/models/wizard-form.config';
import { DynamicSteppedForm, SteppedFormMode } from '@app/@forms/@core/interfaces/dynamic-stepped-form';
import { CarModel } from '@app/@shared/models/car.model';
import { CarMediaType } from '../../../@shared/models/car.model';
import { UtilsService } from '@app/@core/services/utils.service';
import { FuelType, GovFuelTypes } from '../../../@shared/interfaces/fuel-type.enum';
import { TransmissionType } from '../../../@shared/interfaces/transmission-type.enum';
import { CsmProvidersService } from '../services/csm-providers.service';
import { VehiclesService } from '../../../@shared/services/vehicles.service';
import { VehicleModelSearchModel } from '../../../@shared/models/vehicle-model-search.model';
import { PagedResponse } from '@app/@ideo/components/table/models/paged-response';
import { VehicleModelModel } from '../../../@shared/models/vehicle-model.model';
import { MatchMode } from '../../../@ideo/components/table/models/table-filter';
import { FormGroup } from '@angular/forms';
import { CarFormService } from '../services/car-form.service';

@Injectable({
  providedIn: 'root',
})
export class CarFormResolverService implements Resolve<WizardFormConfig> {
  constructor(
    private carFormService: CarFormService,
    private carsService: CarsService,
    private router: Router,
    private location: Location
  ) {}

  private formChanged$: Subject<FormGroup> = new Subject<FormGroup>();
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): WizardFormConfig {
    let isEdit = route.paramMap.get('id') != 'create';

    const titleEmitter: Subject<string> = new Subject<string>();

    const pageConfig = {
      title$: titleEmitter,
      breadcrumbs: [{ label: 'Cars', url: '../' }, { label: 'Car' }],
      arrayConfig: {
        controls: this.carFormService.generate(this.formChanged$, isEdit),
      },
      formChanged$: this.formChanged$,
      submit: (model: any) => {
        let modelToPost: CarModel = {} as CarModel;
        modelToPost.mediaItems = [];
        if (!!model.forms[6]?.profileImgId?.length) {
          modelToPost.profileImgId = model.forms[6].profileImgId[0];
        }
        if (!!model.forms[6]?.insuranceMediaId?.length) {
          modelToPost.mediaItems.push({
            mediaId: model.forms[6].insuranceMediaId[0],
            carMediaType: CarMediaType.Insurance,
          });
        }
        if (!!model.forms[6]?.licenceMediaId?.length) {
          modelToPost.mediaItems.push({
            mediaId: model.forms[6].licenceMediaId[0],
            carMediaType: CarMediaType.License,
          });
        }
        if (!!model.forms[6]?.frontImgMediaId?.length) {
          modelToPost.mediaItems.push({
            mediaId: model.forms[6].frontImgMediaId[0],
            carMediaType: CarMediaType.Front,
          });
        }
        if (!!model.forms[6]?.rearImgMediaId?.length) {
          modelToPost.mediaItems.push({
            mediaId: model.forms[6].rearImgMediaId[0],
            carMediaType: CarMediaType.Rear,
          });
        }
        if (!!model.forms[6]?.rightSideImgMediaId?.length) {
          modelToPost.mediaItems.push({
            mediaId: model.forms[6].rightSideImgMediaId[0],
            carMediaType: CarMediaType.RightSide,
          });
        }
        if (!!model.forms[6]?.leftSideImgMediaId?.length) {
          modelToPost.mediaItems.push({
            mediaId: model.forms[6].leftSideImgMediaId[0],
            carMediaType: CarMediaType.LeftSide,
          });
        }
        modelToPost.id = model.forms[0].id;
        modelToPost.carOwnerId = model.forms[0].carOwnerId;
        modelToPost.partnerId = model.forms[0].partnerId;
        modelToPost.stateId = model.forms[0].stateId;
        modelToPost.vin = model.forms[0].vin;
        modelToPost.plateNo = model.forms[0].plateNo + '';
        modelToPost.fuelType = model.forms[1].fuelType;
        modelToPost.seatsNo = model.forms[1].seatsNo;
        modelToPost.transmission = model.forms[1].transmission;
        modelToPost.enginePower = model.forms[1].enginePower;
        modelToPost.engineDisplacement = model.forms[1].engineDisplacement;
        modelToPost.doorsNumber = model.forms[1].doorsNumber;
        modelToPost.tankCapacity = model.forms[1].tankCapacity;
        modelToPost.isNew = model.forms[1].isNew;
        modelToPost.kmAtInitiate = model.forms[1].kmAtInitiate;
        modelToPost.manufacturer = model.forms[2].manufacturer;
        modelToPost.manufacturerCode = model.forms[2].manufacturerCode + '';
        modelToPost.model = model.forms[2].model;
        modelToPost.modelCode = model.forms[2].modelCode + '';
        modelToPost.modelYear = model.forms[2].modelYear;
        modelToPost.kmAtServiceDate = model.forms[3].kmAtServiceDate;
        modelToPost.serviceDate = model.forms[3].serviceDate;
        modelToPost.serviceKmInterval = model.forms[3].serviceKmInterval;
        modelToPost.csmType = model.forms[4].csmType;
        modelToPost.csmManufacturer = model.forms[4].csmManufacturer;
        modelToPost.csmModel = model.forms[4].csmModel;
        modelToPost.vehiclePlugId = model.forms[4].vehiclePlugId;
        modelToPost.price = model.forms[5].price;
        modelToPost.pricingType = model.forms[5].pricingType;

        if (isEdit) {
          return this.carsService.update(modelToPost.id, modelToPost);
        } else {
          return this.carsService.create(modelToPost);
        }
      },
      getEntityById: (id) =>
        this.carsService.get(id).pipe(
          tap((x) => {
            if (!!isEdit) {
              titleEmitter.next(`Edit ${x.plateNo}`);
            }
            return x;
          })
        ),
    } as WizardFormConfig;

    return pageConfig;
  }
}
