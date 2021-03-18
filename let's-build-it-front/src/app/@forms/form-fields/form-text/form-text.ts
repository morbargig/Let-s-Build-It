import { FieldConfig } from '@app/@forms/@core/interfaces';
import { FormGroup } from '@angular/forms';

type AutoGeneratorAction = (config: FieldConfig, form: FormGroup) => string | void;

export class FormText {
  constructor(obj: FormText = null) {
    if (!!obj) {
      Object.keys(obj).forEach((key) => (this[key] = obj[key]));
    }
  }

  public autocomplete?: string = 'off';
  public autoGenerator?: boolean = false;
  public autoGeneratorLabel?: string = null;
  public autoGeneratorAction?: AutoGeneratorAction = null;
  public rows?: number = null;
  public cols?: number = 4;
}
