import { Location } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@app/@core';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { BreadcrumType } from '@app/blocks/navigations/breadcrum/breadcrum.component';
import { EMPTY, Observable, Subject } from 'rxjs';
import { take, catchError, takeWhile } from 'rxjs/operators';
import { ArrayConfig, WizardFormConfig } from '../../models/wizard-form.config';

@Component({
  selector: 'prx-wizard-page',
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.scss'],
})
export class WizardPageComponent extends BaseComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private locationService: Location,
    // private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private notificationsService: NotificationsService
  ) {
    super();
    this.route.data.pipe(take(2)).subscribe(async (data) => {
      this.config = data.config;
      this.title = data.config.title;
      let id = this.route.snapshot.paramMap.get('id');
      if (!!id && id != 'create') {
        this.loading = true;
        this.entity.next(
          await data.config
            .getEntityById(id)
            .pipe(catchError((err) => EMPTY))
            .toPromise()
        );
        this.loading = false;
      }

      if (!!data.config?.appendControl$) {
        data.config.appendControl$?.pipe(takeWhile((z) => !!this.isAlive)).subscribe((res: any) => {
          const appender = this.arrayConfig.controls[this.arrayConfig.controls.length - 1];
          this.arrayConfig.controls = [
            ...this.arrayConfig.controls.slice(0, this.arrayConfig.controls.length - 2),
            ...res,
            appender,
          ];
        });
      }
    });
  }

  public title: string;
  public arrayConfig: ArrayConfig;
  public formInstance: FormGroup;
  public isEdit: boolean = false;
  public breadcrumbs: BreadcrumType[] = [];
  public loading: boolean;
  private formChanged$: Subject<FormGroup> = new Subject<FormGroup>();
  public entity: Subject<any> = new Subject<any>();
  public submit: (values: any) => Observable<any>;

  public set config(config: WizardFormConfig) {
    if (!!config) {
      config.title$.subscribe((res: string) => {
        this.title = res;
      });
      this.breadcrumbs = config.breadcrumbs;
      this.arrayConfig = config.arrayConfig;
      this.formChanged$ = config.formChanged$;
      if (!!config.arrayConfig$) {
        config.arrayConfig$.pipe(takeWhile((z) => this.isAlive)).subscribe((arrayConfig) => {
          this.arrayConfig = arrayConfig;
        });
      }
      this.submit = config.submit;
      // this.formInstance = this.fb.group({
      //   forms: this.fb.array([...config?.arrayConfig?.controls.map((z, i) => this.fb.group({ [i]: {} as FormGroup }))]),
      // });
      this.ref.markForCheck();
    }
  }

  ngOnInit(): void { }

  public formChanged(form: FormGroup) {
    this.formInstance = form;
    this.formChanged$.next(this.formInstance);
  }

  public submitForm(values: any) {
    this.loading = true;
    this.submit(values)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.notificationsService.success(this.isEdit ? ' updated Successfully.' : ' created Successfully');
          this.locationService.back();
        },
        (err) => {
          console.error(err);
        },
        () => (this.loading = false)
      );
  }
}
