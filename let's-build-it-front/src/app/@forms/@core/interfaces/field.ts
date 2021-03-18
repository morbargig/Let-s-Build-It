import { FormGroup } from '@angular/forms';
import { FieldConfig } from '.';

export interface Field<T = any> {
  config: FieldConfig<T>;
  group: FormGroup;
  id: string;
}
