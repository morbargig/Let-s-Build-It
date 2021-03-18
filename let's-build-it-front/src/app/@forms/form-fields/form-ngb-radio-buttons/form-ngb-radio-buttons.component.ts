import { Component, OnInit } from '@angular/core';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { Field, FieldConfig } from '../../@core/interfaces';
import { FormGroup } from '@angular/forms';
import { NgbRadioButton } from './ngb-radio-button';

@Component({
  selector: 'ideo-form-ngb-radio-buttons',
  templateUrl: './form-ngb-radio-buttons.component.html',
  styleUrls: ['./form-ngb-radio-buttons.component.scss'],
})
export class FormNgbRadioButtonsComponent extends BaseFieldDirective<FormGroup> implements Field, OnInit {
  public config: FieldConfig<NgbRadioButton>;
  public group: FormGroup;
  public id: string;

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
