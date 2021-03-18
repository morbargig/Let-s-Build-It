import { FormGroup, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { DynamicSteppedForm } from '@app/@forms/@core/interfaces/dynamic-stepped-form';
import { Observable, Subject } from 'rxjs';
import { DynamicFormControl } from '../../@forms/@core/interfaces/dynamic-form-control';
import { BreadcrumType } from '../../blocks/navigations/breadcrum/breadcrum.component';

export interface WizardFormConfig<T = any> {
  arrayConfig: ArrayConfig;
  formChanged$?: Subject<FormGroup>;
  // stepBody?: { activeClass?: string, inactiveClass?: string };
  arrayConfig$?: Observable<ArrayConfig>;
  title$: Observable<string>;
  breadcrumbs?: BreadcrumType[];
  submit: (values: T) => Observable<any>;
  getEntityById?: (id: number) => Observable<T>;
  toForm?: (entity: T) => { [name: string]: FormGroup };
  fromForm?: (value: { [name: string]: FormGroup }) => FormGroup[];
  modifyOnEdit?: (config: ArrayConfig, form: FormGroup, data: T) => void;
  appendForm$?: Observable<DynamicSteppedForm>;
}

export interface ArrayConfig {
  controls: DynamicSteppedForm[];
  validation?: ValidatorFn[];
  asyncValidation?: AsyncValidatorFn[];
  errorMessages?: { [error: string]: string };
}
