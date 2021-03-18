import { Injectable } from '@angular/core';
import { IFormGenerator, ModelConverter } from '../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../@forms/@core/interfaces/dynamic-form-control';
import { FormSelectComponent } from '../../../@forms/form-fields/form-select/form-select.component';
import { Validators } from '@angular/forms';
import { UsersService } from '../../users/services/users.service';
import { SelectItem } from '../../../@forms/@core/interfaces';
import { BehaviorSubject } from 'rxjs';
import { LazyLoadEvent } from '../../../@ideo/components/table/events/lazy-load.event';
import { map } from 'rxjs/operators';
import { FormTextComponent } from '../../../@forms/form-fields/form-text/form-text.component';
import { CarsService } from '../../vehicles/services/cars.service';
import { AlertSubject } from '../../../@shared/interfaces/alert-subject.enum';
import { AlertSubjectStatus } from '../../../@shared/interfaces/alert-subject-status.enum';
import { AlertStatus } from '../../../@shared/interfaces/alert-status.enum';
import { UtilsService } from '@app/@core/services/utils.service';
import { FormDateComponent } from '@app/@forms/form-fields';

@Injectable({
  providedIn: 'root',
})
export class AlertFormService implements IFormGenerator<DynamicFormControl[]> {
  constructor(
    private usersService: UsersService,
    private carsService: CarsService,
    private utilsService: UtilsService
  ) {}
  private users$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  private cars$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  generate(): DynamicFormControl[] {
    let form: DynamicFormControl[] = [];
    this.usersService
      .getAll({
        page: 1,
        pageSize: 200,
      } as LazyLoadEvent)
      .pipe(
        map((r) =>
          r?.data?.map((a) => {
            return {
              value: a.id,
              label: a.userName,
            } as SelectItem;
          })
        )
      )
      .subscribe((res) => this.users$.next(res));

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
              label: a.plateNo,
            } as SelectItem;
          })
        )
      )
      .subscribe((res) => this.cars$.next(res));
    form.push(
      {
        type: FormSelectComponent,
        config: {
          name: 'userId',
          label: 'User Name',
          placeholder: 'Select User Name',
          styleClass: 'col-12',
          validation: [Validators.required],
          optionsArr$: this.users$,
          errorMessages: {
            required: 'User Name is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'orderId',
          type: 'number',
          label: 'Order Id',
          placeholder: 'Enter Order Id',
          styleClass: 'col-12',
          validation: [],
          errorMessages: {},
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'carId',
          label: 'Car Plate',
          placeholder: 'Select Car plate',
          styleClass: 'col-12',
          validation: [],
          optionsArr$: this.cars$,
          errorMessages: {},
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'subject',
          label: 'Subject',
          placeholder: 'Select Alert Subject',
          styleClass: 'col-12',
          validation: [Validators.required],
          optionsArr: this.utilsService.toSelectItem(AlertSubject),
          errorMessages: {
            required: 'Alert Subject is required',
          },
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'subjectStatus',
          label: 'Subject Status',
          placeholder: 'Select Subject Status',
          styleClass: 'col-12',
          validation: [],
          optionsArr: this.utilsService.toSelectItem(AlertSubjectStatus),
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'status',
          label: 'Status',
          placeholder: 'Select Alert Status',
          styleClass: 'col-12',
          validation: [Validators.required],
          optionsArr: this.utilsService.toSelectItem(AlertStatus),
          errorMessages: {
            required: 'Alert Status is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'comment',
          label: 'Comments',
          data: {
            rows: 4,
          },
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'createUserId',
          type: 'hidden',
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'updateUserId',
          type: 'hidden',
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'id',
          type: 'hidden',
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
      }
    );
    return form;
  }
}
