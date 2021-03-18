import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from '../../../@ideo/components/table/models/select-item';
import { DynamicFormControl } from '../../../@forms/@core/interfaces/dynamic-form-control';
import { FieldConfig } from '../../../@forms/@core/interfaces/field-config';
import { AbstractControl } from '@angular/forms';
import { ChangedCallBack } from '../../../@forms/@core/interfaces/callbacks';

@Component({
  selector: 'prx-key-value-pair',
  templateUrl: './key-value-pair.component.html',
  styleUrls: ['./key-value-pair.component.scss'],
})
export class KeyValuePairComponent implements OnInit {
  constructor() { }

  @Input() public items: (SelectItem | DynamicFormControl | any)[];
  @Input() public itemsPerRow: number = 2;
  @Input() public viewType: 'inline' | 'block' = 'inline';



  ngOnInit(): void {
    if (!!this.items?.length) {
      const prevAction: { [name: string]: ChangedCallBack } = {};
      for (let i = 0; i < this.items.length; i++) {
        const element = this.items[i];
        if (element?.config) {
          const prevAction = (element?.config)['onChange'] as ChangedCallBack;
          (element?.config)['onChange'] = (curr: any, ctrl: AbstractControl) => {
            element.config.value = curr;
            if (!!prevAction) {
              prevAction(curr, ctrl);
            }
          }
        }
      }
    }
  }

  public get sizeStyle(): string {
    return `0 0 ${parseInt(100 / this.itemsPerRow + '')}%`;
  }

  public isDynamicForm(item: SelectItem | DynamicFormControl) {
    return !!(item as DynamicFormControl);
  }
}
