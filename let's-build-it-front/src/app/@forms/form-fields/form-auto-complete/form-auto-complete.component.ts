import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormAutoComplete } from './auto-complete';
import { Observable } from 'rxjs';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { Field, FieldConfig } from '../../@core/interfaces';

@Component({
  selector: 'ideo-form-auto-complete',
  templateUrl: './form-auto-complete.component.html',
  styleUrls: ['./form-auto-complete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormAutoCompleteComponent extends BaseFieldDirective implements Field<FormAutoComplete> {
  public config: FieldConfig<FormAutoComplete>;
  public group: FormGroup;
  public id: string;

  constructor() {
    super();
  }

  public optionsFetcher: (query: string) => Observable<any[]> = (query) =>
    this.config.data.optionsFetcher(this.control, query);

  public resolveLabel: (val: string) => Promise<string> | string = (val) =>
    this.config.data.resolveLabel(this.config, this.group) || `${val}`;
}
