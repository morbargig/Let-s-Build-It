import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GroupConfig, PageFormConfig } from '@app/@shared/models/edit-form.config';
import { Observable, of } from 'rxjs';
import { catchError, take, takeWhile } from 'rxjs/operators';
import { BaseComponent } from '../../../@core/base/base-component';
import { Location } from '@angular/common';
import { BreadcrumType } from '../../../blocks/navigations/breadcrum/breadcrum.component';
import { NotificationsService } from '../../../@ideo/components/notifications/notifications.service';

@Component({
  selector: 'prx-form-paged',
  templateUrl: './form-paged.component.html',
  styleUrls: ['./form-paged.component.scss'],
})
export class FormPagedComponent extends BaseComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private locationService: Location,
    private notificationsService: NotificationsService
  ) {
    super();
    this.route.data.pipe(take(1)).subscribe(async (data) => {
      this.config = data.config;
      this.title = data.config.title;
      let id = this.route.snapshot.paramMap.get('id');
      if (!!id && id != 'create') {
        this.loading = true;
        let entity = await data.config
          .getEntityById(id)
          .pipe(catchError((err) => of(null)))
          .toPromise();

        if (!!entity) {
          setTimeout(() => {
            if (!!this.formInstance && !!this.formInstance.patchValue) {
              this.formInstance.patchValue(entity);
            }
            if (!!data.config.modifyOnEdit) {
              data.config.modifyOnEdit(this.groupConfig, this.formInstance, entity);
            }
          });
          this.isEdit = true;
        } else {
          setTimeout(() => this.locationService.back());
        }
        this.loading = false;
      }

      if (!!data.config?.appendControl$) {
        data.config.appendControl$?.pipe(takeWhile((z) => !!this.isAlive)).subscribe((res: any) => {
          const appender = this.groupConfig.controls[this.groupConfig.controls.length - 1];
          this.groupConfig.controls = [
            ...this.groupConfig.controls.slice(0, this.groupConfig.controls.length - 2),
            ...res,
            appender,
          ];
        });
      }
    });
  }
  public title: string;
  public groupConfig: GroupConfig;
  public formInstance: FormGroup = {} as FormGroup;
  public isEdit: boolean = false;
  public breadcrumbs: BreadcrumType[] = [];
  public loading: boolean;
  public submit: (values: any) => Observable<any>;

  public set config(config: PageFormConfig) {
    if (!!config) {
      config.title$.subscribe((res) => {
        this.title = res;
      });
      this.breadcrumbs = config.breadcrumbs;
      this.groupConfig = config.groupConfig;
      if (!!config.groupConfig$) {
        config.groupConfig$.pipe(takeWhile((z) => this.isAlive)).subscribe((groupConfig) => {
          this.groupConfig = groupConfig;
        });
      }
      this.submit = config.submit;
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  public submitForm(values: any) {
    this.loading = true;
    this.submit(values).subscribe(
      (res) => {
        this.loading = false;
        this.notificationsService.success(this.isEdit ? ' updated Successfully.' : ' created Successfully');
        this.locationService.back();
        // this.sidebarService.onFormSucces(res);
        // this.closeSideBar()
      },
      (err) => {
        this.loading = false;
      }
    );
  }
}
