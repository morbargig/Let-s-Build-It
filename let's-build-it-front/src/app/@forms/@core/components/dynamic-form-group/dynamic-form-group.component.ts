import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { DynamicFormStepMode } from '../../interfaces';
import { DynamicFormControl } from '../../interfaces/dynamic-form-control';

@Component({
  selector: 'ideo-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  styleUrls: ['./dynamic-form-group.component.scss'],
})
export class DynamicFormGroupComponent implements OnInit {
  @ViewChild('submitBtn', { static: false }) public submitBtn: ElementRef<HTMLButtonElement>;

  @Input() public config: DynamicFormControl[] = [];
  @Input() public mode: DynamicFormStepMode = DynamicFormStepMode.Regular;
  @Input() public validation: ValidatorFn[] = null;
  @Input() public errorMessages?: { [error: string]: string };
  @Input() public showSubmitButton?: boolean = true;

  @Input() public formRowCssClass: string = '';
  @Input() public formCssClass: string = '';
  @Input() public errMsgClass: string = '';

  @Output() public onSubmit: EventEmitter<any> = new EventEmitter<any>();

  private _form: FormGroup;
  @Output() public formChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Input() public get form(): FormGroup {
    return this._form;
  }
  public set form(v: FormGroup) {
    this._form = v;
    this.formChange.emit(this._form);
  }

  constructor(private fb: FormBuilder, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.form = this.createGroup();
  }

  private createGroup(): FormGroup {
    const group = !!this.form?.controls?.length
      ? this.form
      : this.fb.group(
        this.config.reduce((prev, curr, i) => {
          prev[this.config[i].config.name] = this.config[i].config?.value;
          return prev;
        }, {})
      );
    if (!!this.validation && !!this.validation.length) {
      group.setValidators(this.validation);
    }
    return group;
  }

  public submit() {
    this.submitBtn.nativeElement.click();
  }

  public handleSubmit(evt: any) {
    this.form.updateValueAndValidity();

    if (this.form.valid && !!this.submit) {
      this.onSubmit.emit(this.form.getRawValue());
    }
  }
}
