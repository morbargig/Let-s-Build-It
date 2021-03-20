import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FieldEvent, SelectItem } from '@app/@forms/@core/interfaces';
import { DynamicFormControl } from '@app/@forms/@core/interfaces/dynamic-form-control';
import { IFormGenerator, ModelConverter } from '@app/@forms/@core/models/form-generator';
import { FormTextComponent } from '@app/@forms/form-fields';
import { SideBarPageService } from '@app/@shared/components/side-bar-page/isidibar-service.interface';
import { CarModel } from '@app/@shared/models/car.model';
import { CarProfileService } from '../../car-profile.service';
import { FormCheckboxComponent } from '../../../../../../@forms/form-fields/form-checkbox/form-checkbox.component';
import { Subject } from 'rxjs';
import { CarsService } from '../../../../services/cars.service';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { FormDateComponent } from '../../../../../../@forms/form-fields/form-date/form-date.component';

@Component({
  selector: 'prx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(
    private sidebarPageService: SideBarPageService,
    private carsService: CarsService,
    private notificationsService: NotificationsService
  ) {
    this.sidebarPageService.breadcrumbs = [
      { label: 'Cars', url: '../../' },
      {
        label: `${this.sidebarPageService.entity.manufacturer} ${this.sidebarPageService.entity.model}
         ${this.sidebarPageService.entity.modelYear} | ${this.sidebarPageService.entity.plateNo} `,
        url: './',
      },
      { label: 'Settings' },
    ];
  }
  public generalControls: DynamicFormControl[];
  public serviceControls: DynamicFormControl[];
  public editMode: boolean = false;
  public generalForm: FormGroup;
  public serviceForm: FormGroup;

  ngOnInit(): void {
    const kmAtInitSetter: Subject<FieldEvent> = new Subject<FieldEvent>();
    let previousValue: number = this.car.kmAtInitiate;
    this.generalControls = [
      {
        type: FormCheckboxComponent,
        config: {
          name: 'isNew',
          value: this.car.isNew,
          styleClass: 'col-12',
          onChange: (val, ctrl: AbstractControl) => {
            if (!!val) {
              previousValue = ctrl.parent.controls['kmAtInitiate'].value;
              ctrl.parent.controls['kmAtInitiate'].setValue('0');
              kmAtInitSetter.next({ type: 'setDisabled', value: false });
            } else {
              kmAtInitSetter.next({ type: 'setDisabled', value: true });
              ctrl.parent.controls['kmAtInitiate'].setValue(previousValue);
            }
          },
          data: {
            checkboxLabel: 'New vehicle',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'kmAtInitiate',
          type: 'number',
          label: 'Offset(km)',
          setter: kmAtInitSetter,
          value: this.car.kmAtInitiate,
          styleClass: 'col-3',
        },
      },
    ];
    this.serviceControls = [
      {
        type: FormTextComponent,
        config: {
          name: 'serviceKmInterval',
          type: 'number',
          label: 'Service mileage interval(km)',
          value: this.car.serviceKmInterval,
          styleClass: 'col-3',
        },
      },

      {
        type: FormDateComponent,
        config: {
          name: 'serviceTimeInterval',
          type: 'date',
          value: '12',
          label: 'Service time interval(months)',
          styleClass: 'col-3',
        },
      },
    ];
  }

  public onSubmit(): void {
    this.editMode = false;
    let generalSettingsValues = this.generalForm.getRawValue();
    let serviceGeneralSettings = this.serviceForm.getRawValue();

    this.carsService
      .updateGeneralSettings(this.car.id, generalSettingsValues)
      .toPromise()
      .then((res) => {
        this.sidebarPageService.entity.kmAtInitiate = res.kmAtInitiate;
        this.notificationsService.success(`${this.car.manufacturer} ${this.car.model}
      ${this.car.modelYear}  details updated successfully`);
      });

    delete serviceGeneralSettings.serviceTimeInterval;
    this.carsService
      .updateServiceSettings(this.car.id, serviceGeneralSettings)
      .toPromise()
      .then((res) => {
        this.sidebarPageService.entity.serviceKmInterval = res.serviceKmInterval;
        this.notificationsService.success(`${this.car.manufacturer} ${this.car.model}
      ${this.car.modelYear}  details updated successfully`);
      });
  }

  public get car(): CarModel {
    return this.sidebarPageService.entity;
  }
}
