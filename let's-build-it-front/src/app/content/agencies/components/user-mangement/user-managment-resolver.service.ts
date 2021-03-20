import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ModalPageModelConfig } from '../../../../@shared/components/modal-page/modal-page.model';
import { Observable, Subject } from 'rxjs';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { UsersService } from '@app/content/users/services/users.service';
import { ModalMessage } from '../../../../@core/models/modal-message';
import { UserFormService } from './user-form-service.service';
import { UserManagementModel } from '../../../../@shared/models/user-management.model';
import { NotificationsService } from '../../../../@ideo/components/notifications/notifications.service';
import { Location } from '@angular/common';
import { UserManamenntService } from './user-manamennt.service';
import { SideBarPageService } from '../../../../@shared/components/side-bar-page/isidibar-service.interface';

@Injectable({
  providedIn: 'root',
})
export class UserManagmentResolverService implements Resolve<ModalPageModelConfig> {
  public modalType: string;
  public user: UserManagementModel = null;
  public formControls: DynamicFormControl[];

  constructor(
    private userManagmentsService: UserManamenntService,
    private sidebarService: SideBarPageService,
    private notificationsService: NotificationsService,
    private location: Location,
    private userFormService: UserFormService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): ModalPageModelConfig | Observable<ModalPageModelConfig> | Promise<ModalPageModelConfig> {
    let formControls$: Subject<DynamicFormControl[]> = new Subject<DynamicFormControl[]>();
    let type$: Subject<ModalMessage> = new Subject<ModalMessage>();
    this.formControls = this.userFormService.generate(this.user);
    return {
      type: type$,
      submit: (user: UserManagementModel) => {
        user.username = user.email;
        user.profileImageId =
          ['number', 'string'].indexOf(typeof user.profileImageId) >= 0
            ? user.profileImageId
            : user.profileImageId?.[0]?.id;
        if (!!user?.id) {
          this.userManagmentsService
            .update(this.sidebarService.entity.id, user.id, user)
            .toPromise()
            .then((res) => {
              if (!!res) {
                this.notificationsService.success('Subscription Updated Successfully');
                this.location.back();
              } else {
                this.notificationsService.error('Subscription Update Failed');
              }
            });
        } else {
          this.userManagmentsService
            .create(this.sidebarService.entity.id, user)
            .toPromise()
            .then((res) => {
              if (!!res) {
                this.notificationsService.success('Subscription Created Successfully');
                this.location.back();
              } else {
                this.notificationsService.error('Subscription Creation Failed');
              }
            });
        }
      },
      getEntityById: (routePrams) => {
        if ('id' in routePrams) {
          if (typeof routePrams['id'] === 'number') {
            this.userManagmentsService
              .get(this.sidebarService.entity.id, routePrams['id'])
              .toPromise()
              .then((user: UserManagementModel) => {
                if (!user) {
                  type$.next({
                    mode: 'Not Found',
                    title: 'Edit User',
                    subTitle: 'Sorry, user not found',
                    message: 'Please make sure you have typed the correct URL',
                    closeUrl: '../../',
                  });
                  return;
                }
                type$.next({
                  mode: 'Edit',
                  title: 'Edit User',
                  closeUrl: '../../',
                });
                this.user = user;
                this.formControls.patchValue(this.user);
                setTimeout(() => formControls$.next(this.formControls));
              });
          } else {
            setTimeout(() =>
              type$.next({
                mode: 'Not Found',
                title: 'Not Found',
                subTitle: 'Sorry, page not found',
                message: 'Please make sure you have typed the correct URL',
                closeUrl: '../../',
              })
            );
          }
        } else {
          setTimeout(() =>
            type$.next({
              mode: 'Create',
              title: 'Create User',
              closeUrl: '../',
            })
          );
          formControls$.next(this.formControls);
        }
      },
      formControls: formControls$,
    } as ModalPageModelConfig;
  }
}
