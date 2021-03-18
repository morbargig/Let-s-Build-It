import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ModalMessage } from '../../../../../../@core/models/modal-message';
import { ModalPageModelConfig } from '../../../../../../@shared/components/modal-page/modal-page.model';
import { SideBarPageService } from '../../../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { DynamicFormControl } from '../../../../../../@forms/@core/interfaces/dynamic-form-control';
import { NotificationsService } from '../../../../../../@ideo/components/notifications/notifications.service';
import { Location } from '@angular/common';
import { B2BSubscriptionFormService } from './b2-bsubscription-form.service';
import { PartnerB2BSubscriptionService } from '../../services/partner-b2-b-subscription.service';
import { PartnerB2BSubscriptionModel } from '../../../../../../@shared/models/partner-b2b-subscription.model';
import { MAX_INT } from '../../../../../../@ideo/components/table/table.component';

@Injectable({
  providedIn: 'root'
})
export class B2BSubScriptionResolverService implements Resolve<ModalPageModelConfig>{

  constructor(private b2bSubscriptionsService: PartnerB2BSubscriptionService,
    private sidebarService: SideBarPageService,
    private b2bSubscriptionFormService: B2BSubscriptionFormService,
    private notificationsService: NotificationsService,
    private location: Location) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ModalPageModelConfig | Observable<ModalPageModelConfig> | Promise<ModalPageModelConfig> {
    let type$: Subject<ModalMessage> = new Subject<ModalMessage>();
    let formControls$: Subject<DynamicFormControl[]> = new Subject<DynamicFormControl[]>();
    let b2bSubscriptionformControls: DynamicFormControl[] = null;
    let b2bSubscription: PartnerB2BSubscriptionModel = null
    return {
      type: type$,
      submit: (value: { subscriptions: PartnerB2BSubscriptionModel[] }) => {
        if (!!value?.subscriptions?.length) {
          this.b2bSubscriptionsService.bulk(this.sidebarService.entity.id, value.subscriptions).toPromise().then(res => {
            if (!!res) {
              this.notificationsService.success("Subscription Updated Successfully");
              this.location.back();
            } else {
              this.notificationsService.error("Subscription Update Failed");
            }
          })
        }
      },
      getEntityById: (routePrams) => {
        this.b2bSubscriptionsService.getAll(this.sidebarService.entity.id, { page: 1, pageSize: MAX_INT }).toPromise().then(res => {
          b2bSubscriptionformControls = this.b2bSubscriptionFormService.generate(true, this.sidebarService.entity.id, res?.data);
          formControls$.next(b2bSubscriptionformControls);
          type$.next({
            mode: 'Edit',
            title: 'B2B Subscriptions',
          })
        })
      },
      formControls: formControls$,
      closeUrl: '../../',
    } as ModalPageModelConfig
  }

}