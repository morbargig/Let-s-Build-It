import { Observable } from 'rxjs';
import { ValidatorFn } from '@angular/forms';
import { DynamicFormControl } from '../../@core/interfaces/dynamic-form-control';
import { FieldConfig } from '../../@core/interfaces/field-config';

export class FormArrayData {
  constructor(obj: FormArrayData = null) {
    if (!!obj) {
      const keys: string[] = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        this[key] = obj[key];
      }
    }
  }

  public dynamicConfig?: (index: number, item: any) => DynamicFormControl[];
  public formConfig: DynamicFormControl[];
  public nestedConfig?: DynamicFormControl[];
  public title?: string;
  public addLabel?: string;
  public isRoot?: boolean;
  public showSeparator?: boolean = true;
  public showAddingMode?: boolean = false;
  public disableAddAndRemoveMode?: boolean = false;
  public disabled?: boolean;
  public data?: any[] = null;
  public disabled$?: Observable<boolean>;
  public onRemove?: (item: any) => void;
  public groupValidations?: ValidatorFn[] = [];
  public errorMessages?: { [error: string]: string };
}
