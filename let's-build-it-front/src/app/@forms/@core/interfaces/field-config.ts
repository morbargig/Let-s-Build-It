import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { CallbackFunction, ChangedCallBack, DynamicFormStepMode, FieldEvent, SelectItem } from '.';

export interface FieldConfig<T = any> {
  name: string;
  type?:
    | 'hidden'
    | 'text'
    | 'password'
    | 'number'
    | 'datetime-local'
    | 'date'
    | 'month'
    | 'week'
    | 'time'
    | 'tel'
    | 'separator';
  controlType?: 'control' | 'group' | 'array' | 'none';
  autoShowErrors?: boolean;
  disabled?: boolean;
  disabled$?: Observable<boolean>;
  label?: string;
  optionsArr?: SelectItem[];
  optionsArr$?: Observable<SelectItem[]>;
  placeholder?: string;
  data?: T;
  styleClass?: string;
  fieldStyleClass?: string;
  labelStyleClass?: string;
  inputStyleClass?: string;
  validation?: ValidatorFn[];
  asyncValidation?: AsyncValidatorFn[];
  errorMessages?: { [error: string]: string };
  createItem?: CallbackFunction;
  value?: any;
  nestedValue?: any;
  mode?: DynamicFormStepMode;
  description?: string;
  setter?: Observable<FieldEvent> | Subject<FieldEvent>;
  onChange?: ChangedCallBack;
  onBlur?: (control: AbstractControl) => void;
  icon?: string;
  startInvisible?: boolean;
  registerControl?: (ctrl: AbstractControl) => void;
}
