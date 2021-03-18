import { Injectable } from '@angular/core';
import { IFormGenerator } from '../../@forms/@core/models/form-generator';
import { DynamicSteppedForm, SteppedFormMode } from '../../@forms/@core/interfaces/dynamic-stepped-form';
import { BookingModel } from '../../@shared/models/booking.model';
import { Validators, FormArray } from '@angular/forms';
import { TextFilterComponent } from '../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { TableColumnType, TableColumn } from '../../@ideo/components/table/models/table-column';
import { RelatedFilterComponent } from '../../@ideo/components/table/table-filters/related-filter/related-filter.component';
import { UsersService } from '../../content/users/services/users.service';
import { BookingAncillaryFormComponent } from './booking-ancillary-form/booking-ancillary-form.component';
import { AncillariesService } from '../agencies/components/ancillaries/ancillaries.service';
import { BookingDatesFormComponent } from './booking-dates-form/booking-dates-form.component';
import { UserModel } from '../../@shared/models/user.model';
import { ImageIdPipe } from '../../@ideo/infrastructure/pipes/image-id.pipe';
import { BookingCustomerFormComponent } from './booking-customer-form/booking-customer-form.component';
import { BookingVehiclesFormComponent } from './booking-vehicles-form/booking-vehicles-form.component';
import { CarModel } from '../../@shared/models/car.model';
import { IdeoIconModel } from '../../@shared/models/ideo-icon.model';
import { NumericFilterComponent } from '../../@ideo/components/table/table-filters/numeric-filter/numeric-filter.component';
import { FuelType } from '../../@shared/interfaces/fuel-type.enum';
import { TransmissionType } from '../../@shared/interfaces/transmission-type.enum';
import { SelectFilterComponent } from '../../@ideo/components/table/table-filters/select-filter/select-filter.component';
import { asSelectItem } from '../../prototypes';
import { ColorHashPipe } from '../../@ideo/infrastructure/pipes/color-hash.pipe';
import { AcronymPipe } from '../../@ideo/infrastructure/pipes/acronym.pipe';
import { BookingLocationFormComponent } from './booking-location-form/booking-location-form.component';
import { BookingFinishFormComponent } from './booking-finish-form/booking-finish-form.component';
@Injectable({
  providedIn: 'root'
})
export class BookingFormService implements IFormGenerator<DynamicSteppedForm[]> {
  constructor(
    private usersService: UsersService,
    private ancillariesService: AncillariesService,
    private imageIdPipe: ImageIdPipe,
    private colorHashPipe: ColorHashPipe,
    private acronymPipe: AcronymPipe,
  ) {

  }
  generate(entity?: BookingModel): DynamicSteppedForm[] {
    let form: DynamicSteppedForm[] = [];
    form.push(
      {
        title: 'Customer',
        mode: SteppedFormMode.Tabbed,
        group: [
          {
            type: BookingCustomerFormComponent,
            config: {
              name: 'customers',
              type: 'text',
              styleClass: 'col-12',
              // validation: [Validators.min(1), Validators.required],
              data: {
                columns: [
                  {
                    field: 'fullName',
                    header: 'Name',
                    parsedFullData: (model: UserModel) => {
                      // debugger
                      return {
                        name: model.firstName + ' ' + model.lastName,
                        email: model.email,
                        img: model.profileImageId,
                        userName: model.userName
                      }
                    },
                    parsedHtmlData: (model: {
                      name: string,
                      email: string,
                      userName: string,
                      img: number,

                    }) => {
                      let test = this.colorHashPipe.transform(model.name) // FIXME: need to make sure the color will append the user profile
                      let img = model.img ? `<img class="rounded-circle user-image"  src="${this.imageIdPipe.transform(model.img, true)}" />` : `<span class="acronym big text-primary" [style]="'background-color: ${this.colorHashPipe.transform(model.userName)};'" >${this.acronymPipe.transform(model.name.split(' '))} </span>`
                      let html = `<div class="d-flex pl-1 align-items-center" >  ${img}  <div > <h5 class="mb-1">${model.name} </h5> <span class="tex-muted" > ${model.email}</span> </div> </div>`
                      return html
                    },
                    sortable: true,
                    filter: [{ name: 'FirstName', type: TextFilterComponent, placeholder: 'First Name' }, { name: 'LastName', type: TextFilterComponent, placeholder: 'Last Name' }],
                  },
                  {
                    field: 'isLicenceVerified',
                    header: 'Licence Id',
                    sortable: false,
                    type: TableColumnType.Boolean, // FIXME: Need to get license id
                    filter: [
                      {
                        name: 'LicenceId',
                        type: RelatedFilterComponent,
                        placeholder: 'Licence Number',
                        innerFilter: {
                          name: 'LicenceNumber',
                          type: TextFilterComponent,
                          placeholder: 'Licence Number',
                        },
                      },
                    ],
                  },
                  {
                    field: 'subscription', // FIXME need support from server
                    header: 'Subscription',
                    sortable: true,
                    filter: null,
                  },
                  {
                    field: 'payment', // FIXME need support from server
                    header: 'Payment',
                    sortable: true,
                    filter: null,
                  },
                  {
                    field: 'tags', // FIXME need support from server
                    header: 'Tags',
                    sortable: true,
                    filter: null,
                  },
                ] as TableColumn[]
              }
            },
          }
        ],
      },
      {
        title: 'Location',
        mode: SteppedFormMode.Tabbed,
        group: [
          {
            type: BookingLocationFormComponent,
            config: {
              name: 'location',
              type: 'text',
              styleClass: 'col-12',
              data: {
                partnerId: 1
              }
            },
          }
        ],
      },
      {
        title: 'Dates',
        mode: SteppedFormMode.Tabbed,

        group: [
          {
            type: BookingDatesFormComponent,
            config: {
              name: 'dates',
              type: 'text',
              styleClass: 'col-12',
            },
          }
        ],
      },
      {
        title: 'Vehicles',
        mode: SteppedFormMode.Tabbed,
        group: [
          {
            type: BookingVehiclesFormComponent,
            config: {
              validation: [
                // (ctrl: FormArray) => {
                //   debugger
                //   return !ctrl.value?.length ? {
                //     'vehicles': 'you must select last one'
                //   } : null
                // },
                Validators.required],
              name: 'vehicles',
              type: 'text',
              styleClass: 'col-12',
              errorMessages: {
                'vehicles': 'you must select last one'
              },
              data: {
                columns: [
                  {
                    field: 'model',
                    header: 'MAKE & MODEL',
                    parsedFullData: (model: CarModel) => {
                      // debugger

                      return {
                        make: model.manufacturer,
                        model: model.model,
                        img: model.profileImgId
                      }
                    },
                    parsedHtmlData: (model: {
                      make: string,
                      model: string,
                      img: number
                    }) => {
                      let html = `<div class="d-flex pl-1 align-items-center" >  <img class="rounded-circle user-image"  src="${this.imageIdPipe.transform(model.img, true)}" /> <div > <h5 class="mb-1">${model.make + '' + model.model} </h5> </div> </div>`
                      return html
                    },
                    sortable: true,
                    filter: [{ name: 'Model', type: TextFilterComponent, placeholder: 'Model' }, { name: 'Manufacturer', type: TextFilterComponent, placeholder: 'Manufacturer' }],
                  },
                  {
                    field: 'model',
                    header: 'MAKE & MODEL',
                    parsedFullData: (model: CarModel) => {
                      model.fuelType
                      return {
                        doors: model.doorsNumber,
                        seats: model.seatsNo,
                      }
                    },
                    parsedHtmlData: (model: {
                      doors: number,
                      seats: number,

                    }) => {
                      let icon = new IdeoIconModel()
                      let html = `
                      <div class="text-center">
                      ${model.seats}
                      <img *ngIf="useIdeo; else useFeather" [class]="'icon-' + size" src="assets/icons/${icon.seats}">
                      &nbsp;
                      ${model.doors}
                      <img *ngIf="useIdeo; else useFeather" [class]="'icon-' + size" src="assets/icons/${icon.doors}">
                      </div>
                      `
                      return html
                    },
                    sortable: true,
                    filter: [{ name: 'DoorsNumber', type: NumericFilterComponent, placeholder: 'doorsNumber' }, { name: 'SeatsNo', type: NumericFilterComponent, placeholder: 'seatsNo' }],
                  },
                  {
                    field: 'modelYear',
                    header: 'YEAR',
                    sortable: true,
                  },
                  {
                    field: 'transmission',
                    header: 'GEARBOX TYPE',
                    parsedData: (type: number): string =>
                      TransmissionType[type]
                    ,
                    sortable: true,
                    filter: [{ name: 'Transmission', type: SelectFilterComponent, placeholder: 'GEARBOX TYPE', options: asSelectItem(TransmissionType) }],
                  },
                  {
                    field: 'fuelType',
                    header: 'FUEL',
                    parsedData: (type: number): string =>
                      FuelType[type]
                    ,
                    sortable: true,
                    filter: [{ name: 'FuelType', type: SelectFilterComponent, placeholder: 'FuelType', options: asSelectItem(FuelType) }],
                  },

                  {
                    field: 'pricingType',
                    header: 'PRICE',
                    sortable: true,
                    filter: [{ name: 'PricingType', type: TextFilterComponent, placeholder: 'Pricing Group' }],
                  },
                  {
                    field: 'tags',
                    header: 'TAGS',
                    sortable: true,
                    filter: [{ name: 'Tags', type: TextFilterComponent, placeholder: 'Tags' }],
                  },
                ] as TableColumn[]
              }
            },
          }
        ],
      },
      {
        title: 'Ancillary',
        mode: SteppedFormMode.Tabbed,
        group: [
          {
            type: BookingAncillaryFormComponent,
            config: {
              name: 'ancillaries',
              type: 'text',
              styleClass: 'col-12',
            },
          }
        ],
      },
      {
        title: 'Finish',
        mode: SteppedFormMode.Tabbed,
        group: [
          {
            type: BookingFinishFormComponent,
            config: {
              name: 'finish',
              type : 'text',
              styleClass: 'col-12',
              data: {
                partnerId: 1
              }
            },
          }
        ],
      },
    )
    return form;
  }
}

