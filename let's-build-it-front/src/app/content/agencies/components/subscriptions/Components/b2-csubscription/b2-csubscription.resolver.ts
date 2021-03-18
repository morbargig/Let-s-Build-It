import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ModalMessage } from '../../../../../../@core/models/modal-message';
import { ModalPageModelConfig } from '../../../../../../@shared/components/modal-page/modal-page.model';
import { PartnerB2CSubscriptionService } from '../../services/partner-b2-c-subscription.service';
import { SideBarPageService } from '../../../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { DynamicFormControl } from '../../../../../../@forms/@core/interfaces/dynamic-form-control';
import { B2CSubscriptionFormService } from './b2-csubscription-form.service';
import { PartnerB2CSubscriptionModel } from '../../../../../../@shared/models/partner-b2c-subscription.model';
import { NotificationsService } from '../../../../../../@ideo/components/notifications/notifications.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class B2CSubscriptionResolver implements Resolve<ModalPageModelConfig>{

  constructor(private b2cSubscriptionsService: PartnerB2CSubscriptionService,
    private sidebarService: SideBarPageService,
    private b2cSubscriptionFormService: B2CSubscriptionFormService,
    private notificationsService: NotificationsService,
    private location: Location) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ModalPageModelConfig | Observable<ModalPageModelConfig> | Promise<ModalPageModelConfig> {
    let type$: Subject<ModalMessage> = new Subject<ModalMessage>();
    let formControls$: Subject<DynamicFormControl[]> = new Subject<DynamicFormControl[]>();
    let b2cSubscriptionformControls: DynamicFormControl[] = null;
    let b2cSubscription: PartnerB2CSubscriptionModel = null
    return {
      type: type$,
      submit: (value: PartnerB2CSubscriptionModel) => {
        if (!!value?.billingDayOfMonth && typeof value.billingDayOfMonth !== 'number') {
          value.billingDayOfMonth = Number((value.billingDayOfMonth as string).split('-')[2]);
        }
        if (!!value?.id) {
          this.b2cSubscriptionsService.update(this.sidebarService.entity.id, b2cSubscription.id, value).toPromise().then(res => {
            if (!!res) {
              this.notificationsService.success("Subscription Updated Successfully");
              this.location.back();
            }
          })
        }
        else {
          this.b2cSubscriptionsService.create(this.sidebarService.entity.id, value).toPromise().then(res => {
            if (!!res) {
              this.notificationsService.success("Subscription Created Successfully");
              this.location.back();
            }
          })
        }

      },
      getEntityById: (routePrams) => {
        if ('id' in routePrams) {
          if (!isNaN(+routePrams.id)) {
            this.b2cSubscriptionsService.get(this.sidebarService.entity.id, routePrams.id).toPromise().then(res => {
              if (!!res) {
                let date = new Date();
                date.setDate(Number(res.billingDayOfMonth));
                res.billingDayOfMonth = date.toFormDateString();
                b2cSubscriptionformControls = this.b2cSubscriptionFormService.generate(true, res);
                b2cSubscription = res;
                formControls$.next(b2cSubscriptionformControls);
                type$.next({
                  mode: 'Edit',
                  title: 'Edit Subscription',
                })
              }
              else {
                type$.next({
                  mode: 'Not Found',
                  title: 'Not Found',
                  subTitle: 'Sorry, Subscription not found',
                  message: 'Please make sure you have typed the correct URL'
                })
              }
            })
          }
          else {
            setTimeout(() => {
              type$.next({
                mode: 'Not Found',
                title: 'Not Found',
                subTitle: 'Sorry, page not found',
                message: 'Please make sure you have typed the correct URL'
              })
            });
          }
        } else {
          b2cSubscriptionformControls = this.b2cSubscriptionFormService.generate(false);
          formControls$.next(b2cSubscriptionformControls);
          setTimeout(() => {
            type$.next({
              mode: 'Create',
              title: 'Create Subscription',
            })
          });
        }
      },
      formControls: formControls$,
      closeUrl: '../../',
    } as ModalPageModelConfig
  }

}