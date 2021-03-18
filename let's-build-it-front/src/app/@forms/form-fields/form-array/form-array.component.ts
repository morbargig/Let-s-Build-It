import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArrayData } from './form-array';
import { FormGroup, FormArray, Form, FormBuilder } from '@angular/forms';
import { filter, map, take, takeWhile } from 'rxjs/operators';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { Field, FieldConfig } from '../../@core/interfaces';

@Component({
  selector: 'ideo-form-array',
  templateUrl: './form-array.component.html',
  styleUrls: ['./form-array.component.scss'],
})
export class FormArrayComponent extends BaseFieldDirective<FormArray> implements Field<FormArrayData>, OnInit {
  public config: FieldConfig<FormArrayData>;
  public group: FormGroup;
  public id: string;
  public folded: boolean = false;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    if (!(this.control instanceof FormArray)) {
      this.group.removeControl(this.config.name);
      this.group.addControl(
        this.config.name,
        this.fb.array([], this.config.validation || [], this.config.asyncValidation || [])
      );
    }

    if (Array.isArray(this.config.value) && !!this.config.value?.length) {
      const arr = this.config.value as any[];
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        let group = this.fb.group(
          Object.keys(element).reduce((acc, cur, i) => {
            acc[cur] = element[cur];
            return acc;
          }, {})
        );
        this.control.push(group);
        group.patchValue(element);
      }
      this.cd.markForCheck();
    }

    if (Array.isArray(this.config.nestedValue) && !!this.config.nestedValue?.length) {
      const arr = this.config.nestedValue as any[];
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        let group = this.fb.group(
          Object.keys(element).reduce((acc, cur, i) => {
            acc[cur] = element[cur];
            return acc;
          }, {})
        );
        this.control.push(group);
        group.patchValue(element);
      }
      this.cd.markForCheck();
    }
    if (!!this.config.setter) {
      this.config.setter
        .pipe(
          filter((evt) => evt.type == 'onPatchValue'),
          map((evt) => evt.value),
          takeWhile((x) => this.isAlive)
        )
        .subscribe((values: any[]) => {
          if (!!values) {
            this.control.clear();
            for (let i = 0; i < values.length; i++) {
              const value = values[i];
              let group = this.fb.group({});
              this.control.push(group);
              setTimeout(() => {
                group.patchValue(value);
              });
            }
          }

          this.cd.markForCheck();
        });
      this.config.setter
        .pipe(
          filter((evt) => evt.type == 'setValue'),
          map((evt) => evt.value),
          takeWhile((x) => this.isAlive)
        )
        .subscribe((values: any[]) => {
          if (!!values) {
            for (let i = 0; i < values.length; i++) {
              const value = values[i];
              const keys = Object.keys(value);
              let group = this.fb.group(
                keys.reduce((acc, cur, i) => {
                  acc[cur] = value[cur];
                  return acc;
                }, {})
              );
              this.control.push(group);
              this.cd.markForCheck();
              setTimeout(() => {
                group.patchValue(value);
              });
            }
          }
        });
    }
  }

  public removeConfig(index: number) {
    if (this.config.data?.onRemove) {
      this.config.data.onRemove(this.control.value[index]);
    }
    this.control.removeAt(index);
  }

  public addConfig() {
    this.control.push(this.fb.group({}, { validators: this.config?.data?.groupValidations }));
  }
}
