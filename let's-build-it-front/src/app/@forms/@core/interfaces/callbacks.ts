import { AbstractControl, FormGroup } from '@angular/forms';

export type CallbackFunction = (item?: any) => FormGroup;
export type ChangedCallBack<T = any> = (currentValue: T, control: AbstractControl) => void;
