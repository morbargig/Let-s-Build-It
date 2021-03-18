import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { Field, FieldConfig } from '../../@core/interfaces';
import { FormDate } from './form-date';

@Component({
  selector: 'ideo-form-date',
  templateUrl: './form-date.component.html',
  styleUrls: ['./form-date.component.scss'],
})
export class FormDateComponent extends BaseFieldDirective implements Field, OnInit {
  public config: FieldConfig<FormDate>;
  public group: FormGroup;
  public id: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (
      !this.control.value &&
      (this.config.type == 'datetime-local' || this.config.type == 'month') &&
      (this.config?.validation?.includes(Validators.required) || true)
    ) {
      if (this.config.type == 'datetime-local') {
        this.control.setValue(new Date().toISOString().replace('Z', '').split(':').slice(0, 2).join(':'));
      } else {
        this.control.setValue(new Date().toISOString().split('T')[0]);
      }
    }
  }
}
