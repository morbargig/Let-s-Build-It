import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Logger, AuthenticationService } from '@core';
import { ActivatedRoute, Params } from '@angular/router';

import { faLongArrowAltRight, faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { finalize, takeWhile } from 'rxjs/operators';
import { RedirectService } from '../../../@core/services/redirect.service';
import { BaseComponent } from '../../../@core/base/base-component';

const logger = new Logger('Register');

@Component({
  selector: 'prx-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss'],
})
export class AuthRegisterComponent extends BaseComponent implements OnInit {
  longArrowAltRight = faLongArrowAltLeft;
  public error: string;
  public form: FormGroup;

  public ctrArr: { controlName: string, translateName: string, type?: string }[] = [
    { controlName: 'pass', translateName: 'Password', type: 'password' },
    { controlName: 'confirmPass', translateName: 'Confirm Password' },
    { controlName: 'job', translateName: 'Job' },
    { controlName: 'email', translateName: 'Email', type: 'email' },
    { controlName: 'class', translateName: 'Class', type: 'text' },
    { controlName: 'employId', translateName: 'Employ id', type: 'text' },
    { controlName: 'phone', translateName: 'Phone Number', type: 'tel' },
  ]

  public validForm: boolean ;

  constructor(
    private _redirect: RedirectService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    super();
    this.createForm();
  }

  ngOnInit() {

    this.form.valueChanges.pipe(takeWhile(r => this.isAlive)).subscribe(res => {
      this.validForm = this.form.valid
    })
  }

  register() {
    this.form
    this.isLoading = true;

    let registerData = this.form.value
    delete registerData['confirmPass']
    this.authenticationService
      .register(this.form.value)
      .pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (credentials) => {
          // logger.debug(`${credentials.firstName + credentials.lastName} successfully registered`);
          this.route.queryParams.subscribe(
            (params) => {
              this.route.queryParams.subscribe((params) => this.redirect(params));
              // redirect here or de whatever you need to do with after registration
              // logger.debug(`redirecting to the confirmation page`)
              // this.route.queryParams.subscribe((params) => this.redirect(params));
            }
          );
        },
        (error) => {
          logger.debug(`Register error: ${error}`);
          this.error = error;
        }
      );
  }

  redirect(params: Params) {
    if (params.redirect) {
      this._redirect.to(params.redirect, { replaceUrl: true });
    } else {
      this._redirect.toHome();
    }
  }

  ctrHidden(ctrName: string) {
    return this.form.controls?.[ctrName].valid || this.form.controls?.[ctrName].untouched
  }

  private createForm() {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required, '', Validators.minLength(1)],
      lastName: ['', Validators.required, '', Validators.minLength(1)],

      employId: ['', Validators.required, '', Validators.min(0)],
      class: ['', Validators.required],
      job: ['', Validators.required],

      phone: ['', Validators.required, '', Validators.min(500000000), '', Validators.max(559999999)],
      email: ['', Validators.required, '', Validators.email],
      pass: ['', Validators.required],
      confirmPass: ['', Validators.required],
    });
  }
}
