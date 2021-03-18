import { Pipe, PipeTransform } from '@angular/core';
import { DynamicFormControl } from '../interfaces/dynamic-form-control';

@Pipe({
  name: 'notHidden',
})
export class NotHiddenPipe implements PipeTransform {
  transform(ctrls: DynamicFormControl[]): DynamicFormControl[] {
    return ctrls.filter((ctrl) => ctrl.config.type != 'hidden');
  }
}
