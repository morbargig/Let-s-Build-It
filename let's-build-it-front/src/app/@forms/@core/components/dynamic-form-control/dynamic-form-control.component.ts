import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Type,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { filter, takeWhile, takeUntil } from 'rxjs/operators';
import { DynamicFormStepMode, Field, FieldConfig } from '../../interfaces';
import { DynamicFormControl } from '../../interfaces/dynamic-form-control';
import { StringHelperService } from '../../../../@ideo/infrastructure/services/string-helper.service';
import { FormTextComponent } from '../../../form-fields/form-text/form-text.component';

@Component({
  selector: 'ideo-dynamic-form-control',
  templateUrl: './dynamic-form-control.component.html',
  styleUrls: ['./dynamic-form-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormControlComponent implements OnInit, AfterViewInit {
  public type: Type<Field>;
  public config: FieldConfig<any>;
  public id: string = `control-${this.stringHelper.randomStr(4)}`;
  public control: AbstractControl;
  @Input() public mode: DynamicFormStepMode;
  public visible: boolean = true;
  @Input() public isRequired: boolean;
  private isActive: boolean = true;
  @Input() public showLabel: boolean = true;

  @Input() public group: FormGroup;
  @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() public set dynamicControl(dynamicControl: DynamicFormControl) {
    if (!dynamicControl?.type) {
      return;
    }
    this.type = dynamicControl.type || FormTextComponent;
    this.config = dynamicControl.config;
    this.mode = this.mode || (dynamicControl.config && dynamicControl.config.mode) || DynamicFormStepMode.Regular;
    this.isRequired =
      dynamicControl.config.validation && !!dynamicControl.config.validation.find((x) => x == Validators.required);
    this.cd.detectChanges();
  }

  constructor(private stringHelper: StringHelperService, private cd: ChangeDetectorRef) {}
  ngAfterViewInit(): void {
    if (!!this.config && !!this.control && !!this.onChange) {
      this.control.valueChanges.pipe(takeWhile((z) => this.isActive)).subscribe((val) => this.onChange.emit(val));
    }
  }

  ngOnInit(): void {
    if (this.config && this.config.setter) {
      this.config.setter
        .pipe(
          filter((evt) => evt.type == 'requiredSetter'),
          takeWhile((x) => this.isActive)
        )
        .subscribe((value) => {
          this.isRequired = value.value;
          this.cd.detectChanges();
        });

      this.config.setter
        .pipe(
          filter((evt) => evt.type == 'setVisibility'),
          takeWhile((x) => this.isActive)
        )
        .subscribe((value) => {
          this.visible = value.value;
          this.cd.detectChanges();
        });
    }
  }

  public setVisibility(isVisibile: boolean) {
    this.visible = isVisibile;
    this.cd.markForCheck();
  }
}
