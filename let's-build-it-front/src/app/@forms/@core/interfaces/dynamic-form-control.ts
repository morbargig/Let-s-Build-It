import { Type } from '@angular/core';
import { Field, FieldConfig } from '.';

export interface DynamicFormControl {
  type: Type<Field>;
  config: FieldConfig;
}
