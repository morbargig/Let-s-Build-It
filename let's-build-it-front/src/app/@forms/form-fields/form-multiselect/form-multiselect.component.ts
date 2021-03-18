import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { Field, FieldConfig } from '../../@core/interfaces';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ideo-form-multiselect',
  templateUrl: './form-multiselect.component.html',
  styleUrls: ['./form-multiselect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormMultiselectComponent extends BaseFieldDirective implements Field {
  public config: FieldConfig<any>;
  public group: FormGroup;
  public id: string;

  constructor() {
    super();
  }

  getValue(evt: any): any[] {
    return Array.from(evt.target.selectedOptions).map((option: any) => option.value);
  }
}
