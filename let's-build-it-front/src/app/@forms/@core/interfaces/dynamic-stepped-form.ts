import { FormGroup } from '@angular/forms';
import { DynamicFormControl } from './dynamic-form-control';
import { Observable } from 'rxjs';
export interface DynamicSteppedForm {
  title?: string;
  mode?: SteppedFormMode;
  group: DynamicFormControl[];
  form?: FormGroup;
}

export enum SteppedFormMode {
  Tabbed,
  Bulleted,
  Circled,
}

export enum SteppedFormFooterMode {
  Arrows,
  Paging,
  None,
}
