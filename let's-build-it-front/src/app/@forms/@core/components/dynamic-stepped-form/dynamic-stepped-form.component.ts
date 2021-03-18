import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { DynamicSteppedForm, SteppedFormFooterMode } from '../../interfaces/dynamic-stepped-form';
import { CdkStepper } from '@angular/cdk/stepper';
import { Directionality } from '@angular/cdk/bidi';
import { faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { Observable, config } from 'rxjs';
import { take } from 'rxjs/operators';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'ideo-dynamic-stepped-form',
  templateUrl: './dynamic-stepped-form.component.html',
  styleUrls: ['./dynamic-stepped-form.component.scss'],
})
export class DynamicSteppedFormComponent extends CdkStepper implements OnInit {
  constructor(private fb: FormBuilder, ref: ChangeDetectorRef, dir: Directionality) {
    super(dir, ref);
  }

  @ViewChild('submitBtn', { static: false }) public submitBtn: ElementRef<HTMLButtonElement>;
  @Input() public stepBody: Object;
  @Input() public config: DynamicSteppedForm[] = [];
  @Input() public validation: ValidatorFn[] = null;
  @Input() public errorMessages?: { [error: string]: string };
  @Input() public formRowCssClass: string = '';
  @Input() public formCssClass: string = '';
  @Input() public isLinear = true;
  @Input() public isEditable = true;
  @Input() public footerMode: SteppedFormFooterMode = SteppedFormFooterMode.Arrows;
  @Input() public formValue?: Observable<any>;

  @Output() public onSubmit: EventEmitter<any> = new EventEmitter<any>();

  private _form: FormGroup = null;
  @Output() public formChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Input() public get form(): FormGroup | any {
    return this._form;
  }
  public set form(v: FormGroup | any) {
    this._form = v;
    this.formChange.emit(this._form);
  }

  public icons: any = {
    arrowLeft: faLongArrowAltLeft,
    arrowRight: faLongArrowAltRight,
  };

  ngOnInit(): void {
    setTimeout(() => {

      this.form = this.fb.group({
        forms: this.fb.array([
          ...this.config.map((z, i) =>
            this.fb.group(
              this.config[i].group.reduce((prev, curr, i) => {
                prev[curr.config.name] = curr.config?.value;
                return prev;
              }, {})
            )
          ),
        ]),
      });

    });

    this.formValue.pipe(take(2)).subscribe((res) => {
      if (!!this.form.get('forms')?.controls?.length) {
        let forms = this.form.get('forms').controls;
        for (let i = 0; i < forms.length; i++) {
          const form = forms[i] as FormGroup;
          setTimeout(() => {
            form.patchValue(res, { onlySelf: false, emitEvent: true });
          }, 0);
        }
      }
    });

    if (!!this.validation && !!this.validation.length) {
      this.form.setValidators(this.validation);
    }
  }

  public handleSubmit(evt: any) {
    this.form.updateValueAndValidity();

    if (this.form.valid && !!this.submit) {
      this.onSubmit.emit(this.form.getRawValue());
    }
  }

  public submit() {
    this.submitBtn.nativeElement.click();
  }
}
