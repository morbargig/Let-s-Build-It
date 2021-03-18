import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { ModalMessage } from "../../../../../../@core/models/modal-message";
import { NotificationsService } from "../../../../../../@ideo/components/notifications/notifications.service";
import { ModalAssignPageModelConfig } from '../../../../../../@shared/components/modal-assign-page/modal-assign-page.model';
import { PickModel } from "../../../../../../@shared/components/modal-assign-page/pick.model";
import { PartnerB2CSubscriptionService } from '../../services/partner-b2-c-subscription.service';
import { PartnerB2CSubscriptionModel } from '../../../../../../@shared/models/partner-b2c-subscription.model';
import { SideBarPageService } from '../../../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { map } from "rxjs/operators";
import { IPagedList } from "../../../../../../@shared/models/paged-list.response";
import { Location } from "@angular/common";
import { faStar, faUser } from '@fortawesome/free-regular-svg-icons';

@Injectable({
  providedIn: 'root'
})

export class B2CSubscriptionAssignResolver implements Resolve<ModalAssignPageModelConfig>  {

  constructor(
    private b2cSubscriptionsService: PartnerB2CSubscriptionService,
    private sidebarService: SideBarPageService,
    private notificationsService: NotificationsService,
    private location: Location
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ModalAssignPageModelConfig | Observable<ModalAssignPageModelConfig> | Promise<ModalAssignPageModelConfig> {

    let type$: Subject<ModalMessage> = new Subject<ModalMessage>();
    const handelPageNotFound = (): void => {
      setTimeout(() => {
        type$.next({
          mode: 'Not Found',
          title: 'Not Found',
          subTitle: 'Sorry, page not found',
          message: 'Please make sure you have typed the correct URL',
          closeUrl: '../../'
        })
      })
    }
    let handleError = (err: any) => {
      this.notificationsService.error(err || 'Assign Fail', "update Fail")
    }
    return {
      type: type$,
      submit: (selected: PickModel, model: PartnerB2CSubscriptionModel) => {
        this.b2cSubscriptionsService.deleteAndMove(this.sidebarService.entity.id, model.id, selected.id).toPromise().then(res => {
          if (!!res) {
            this.notificationsService.success("Inventory Assign Successfully", "Update Successfully");
            this.location.back();
          }
          else {
            handleError(res)
          }
        })
      },
      getAll: (evt) => {
        return this.b2cSubscriptionsService.getAll(this.sidebarService.entity.id, evt).pipe(map(res => {
          let pagedRes = {
            data: res?.data?.map(i => {
              return {
                id: i.id,
                title: i.name,
                detailsArr: [{ text: i.customersCount, icon: faUser }, { text: i.isActive, icon: faStar }]
              } as PickModel
            })
            , total: res?.total
          } as IPagedList<PickModel>;
          return pagedRes
        }));
      },
      getEntityById: (routePrams) => {
        if ('id' in routePrams) {
          let req = this.b2cSubscriptionsService.get(this.sidebarService.entity.id, routePrams.id);
          req.toPromise().then(res => {
            if (!!res) {
              type$.next({
                mode: 'Assign',
                title: 'Assign',
                closeUrl: '../../'
              })
              return

            }
            type$.next({
              mode: 'Not Found',
              title: 'Not Found',
              subTitle: 'Sorry, Subscription not found',
              message: 'Please make sure you have typed the correct URL',
              closeUrl: '../../'
            })
            return
          }).catch(() => {
            handelPageNotFound()
          })
          return req
        }
        else {
          handelPageNotFound()
        }
      },
      // filterControls: formControls,
    } as ModalAssignPageModelConfig
  }
}
