import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { Field, FieldConfig } from '../../@core/interfaces';
import { FormGroup } from '@angular/forms';
import { takeWhile, tap } from 'rxjs/operators';

@Component({
  selector: 'ideo-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSelectComponent extends BaseFieldDirective implements Field, OnInit {
  public config: FieldConfig<any>;
  public group: FormGroup;
  public id: string;

  constructor() {
    super();
  }
  public ngOnInit(): void {
    let valid = this.config.data && this.config.data.autoSelect != false;
    if (this.config.optionsArr$ && !!valid) {
      this.config.optionsArr$ = this.config.optionsArr$.pipe(
        tap((res) => {
          if (res.length == 1) {
            this.control.setValue(res[0].value);
          }
        })
      );
    }
    if (this.config.disabled) {
      this.control.disable();
    }
  }
}
