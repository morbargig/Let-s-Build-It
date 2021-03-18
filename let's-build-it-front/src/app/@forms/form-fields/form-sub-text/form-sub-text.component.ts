import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { Field, FieldConfig } from '../../@core/interfaces';
import { FormGroup } from '@angular/forms';
import { FormSubText } from './form-sub-text';

@Component({
  selector: 'ideo-form-sub-text',
  templateUrl: './form-sub-text.component.html',
  styleUrls: ['./form-sub-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSubTextComponent extends BaseFieldDirective implements Field<FormSubText> {
  public config: FieldConfig<FormSubText>;
  public group: FormGroup;
  public id: string;

  constructor() {
    super();
  }
}
