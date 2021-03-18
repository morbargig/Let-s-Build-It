import { AbstractControl } from '@angular/forms';
import { TableColumn } from '@app/@ideo/components/table/models/table-column';
import { Observable } from 'rxjs';
import { DynamicFormControl } from '../../@forms/@core/interfaces/dynamic-form-control';

export class ImportConfig {
  constructor(config?: ImportConfig) {
    Object.keys(config).forEach((k) => (this[k] = config[k]));
  }
  downloadTemplate?: string;
  parseDataUrl: () => string;
  modalTitle?: string;
  controls?: DynamicFormControl[];
  columns?: TableColumn[];
  validator?: (item: any, key?: string) => boolean = (item: any, key?: string) => {
    let keys = Object.keys(item);
    var valid = true;
    const validate = (fCtrl: DynamicFormControl, val: any) => {
      let valid = true;
      if (!!formControl && !!valid && !!formControl.config.validation) {
        for (let z = 0; z < formControl.config.validation.length; z++) {
          if (!valid) {
            continue;
          }
          const validationFn = formControl.config.validation[z];
          const v = validationFn({ value: val } as AbstractControl);
          valid = !v || !Object.keys(v)?.length;
        }
      }

      return valid;
    };

    if (!key) {
      for (let index = 0; index < keys.length; index++) {
        if (!valid) {
          continue;
        }
        const key = keys[index];
        var formControl = this.controls.find((c) => c.config.name == key);
        valid = validate(formControl, item[key]);
      }
    } else {
      var formControl = this.controls.find((c) => c.config.name == key);
      valid = validate(formControl, item[key]);
    }

    return valid;
  };
  previewConfig?: {
    // columns: SimpleTableColumn[]
    // rowClass?: SimpleTableRowStyle;
  };
  import: (model: any[]) => Observable<any>;
}
