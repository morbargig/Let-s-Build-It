import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormText } from '../form-text/form-text';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { Field, FieldConfig } from '../../@core/interfaces';

@Component({
  selector: 'ideo-form-button',
  templateUrl: './form-button.component.html',
  styleUrls: ['./form-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormButtonComponent extends BaseFieldDirective<FormControl> implements Field<FormText>, OnInit {
  public config: FieldConfig<FormText>;
  public group: FormGroup;
  public id: string;

  constructor(private cd: ChangeDetectorRef) {
    super();
  }
  ngOnInit(): void {}

  public onClick() {
    if (this.config.type === 'number') {
    }
    if (this.config.onChange) {
    }
  }
}
