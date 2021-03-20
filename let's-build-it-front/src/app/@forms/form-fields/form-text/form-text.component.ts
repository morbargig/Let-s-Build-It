import { takeWhile, take, filter } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { Field, FieldConfig } from '../../@core/interfaces';
import { FormGroup, FormControl } from '@angular/forms';
import { FormText } from './form-text';

@Component({
  selector: 'ideo-form-text',
  templateUrl: './form-text.component.html',
  styleUrls: ['./form-text.component.scss'],
})
export class FormTextComponent extends BaseFieldDirective<FormControl> implements Field<FormText>, OnInit {
  public config: FieldConfig<FormText>;
  public group: FormGroup;
  public id: string;

  constructor(private cd: ChangeDetectorRef) {
    super();
  }
  ngOnInit(): void {
    if (this.config.disabled) {
      this.control.disable();
    }
  }

  public autoGeneratorClicked() {
    this.config.data.autoGeneratorAction(this.config, this.group);
    this.control.valueChanges
      .pipe(
        takeWhile((x) => this.isAlive),
        take(1)
      )
      .subscribe((evt) => {
        this.cd.markForCheck();
      });
  }

  public onChange(val: string) {
    if (this.config.type === 'number' && !!val) {
      this.control.setValue(parseFloat(val));
    }
    if (this.config.onChange) {
      this.config.onChange(val, this.control);
    }
  }
}
