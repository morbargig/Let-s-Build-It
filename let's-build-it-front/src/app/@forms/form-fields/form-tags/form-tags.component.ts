import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { Field, FieldConfig } from '../../@core/interfaces';

@Component({
  selector: 'ideo-form-tags',
  templateUrl: './form-tags.component.html',
  styleUrls: ['./form-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormTagsComponent extends BaseFieldDirective<FormGroup> implements Field, OnInit {
  public config: FieldConfig<any>;
  public group: FormGroup;
  public id: string;

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
