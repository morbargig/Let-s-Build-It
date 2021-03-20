import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ModalPageModelConfig } from '../../../../../../@shared/components/modal-page/modal-page.model';
import { ModalMessage } from '../../../../../../@core/models/modal-message';
import { DynamicFormControl } from '../../../../../../@forms/@core/interfaces/dynamic-form-control';
import { CarDamageModel } from '../../../../../../@shared/models/car-damage.model';
import { CarDamagesService } from './car-damages.service';
import { SideBarPageService } from '../../../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { NotificationsService } from '../../../../../../@ideo/components/notifications/notifications.service';
import { Location } from '@angular/common';
import { CarDamagesFormService } from './car-damages-form.service';
import { ErrorMessages } from '../../../../../../@shared/models/error-messages.model';

@Injectable({
  providedIn: 'root',
})
export class CarDamagesResolver implements Resolve<ModalPageModelConfig> {
  constructor(
    private carDamagesService: CarDamagesService,
    private sidebarService: SideBarPageService,
    private carDamageFormService: CarDamagesFormService,
    private notificationsService: NotificationsService,
    private location: Location
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): ModalPageModelConfig | Observable<ModalPageModelConfig> | Promise<ModalPageModelConfig> {
    let type$: Subject<ModalMessage> = new Subject<ModalMessage>();
    let formControls$: Subject<DynamicFormControl[]> = new Subject<DynamicFormControl[]>();
    let carDamagesFormControls: DynamicFormControl[] = null;
    let carDamage: CarDamageModel;
    return {
      type: type$,
      submit: (value: CarDamageModel) => {
        if (!!value?.id) {
          let errorMessages: ErrorMessages = {
            200: 'Car Damage Updated Successfully',
          };
          let entityName = 'Car Damage';
          this.carDamagesService
            .update(this.sidebarService.entity.id, carDamage.id, value, errorMessages, entityName)
            .toPromise()
            .then((res) => {
              if (!!res) {
                this.location.back();
              }
            });
        } else {
          if (!!value.damageMediaItems?.length) {
            value.damageMediaItems = Array.from(value.damageMediaItems).map((x) => {
              return { mediaId: x.id };
            });
          }
          this.carDamagesService
            .create(this.sidebarService.entity.id, value)
            .toPromise()
            .then((res) => {
              if (!!res) {
                this.notificationsService.success('Damage Created Successfully');
                this.location.back();
              }
            });
        }
      },
      getEntityById: (routeParams) => {
        if ('id' in routeParams) {
          this.carDamagesService
            .get(this.sidebarService.entity.id, routeParams.id)
            .toPromise()
            .then((res) => {
              if (!!res) {
                carDamagesFormControls = this.carDamageFormService.generate(true, res);
                carDamage = res;
                formControls$.next(carDamagesFormControls);
                type$.next({
                  mode: 'Edit',
                  title: 'Edit Car Damage',
                  closeUrl: '../../',
                });
              } else {
                setTimeout(() => {
                  type$.next({
                    mode: 'Not Found',
                    title: 'Not Found',
                    subTitle: 'Sorry, page not found',
                    message: 'Please make sure you have typed the correct URL',
                  });
                });
              }
            });
        } else {
          carDamagesFormControls = this.carDamageFormService.generate(false);
          formControls$.next(carDamagesFormControls);
          setTimeout(() => {
            type$.next({
              mode: 'Create',
              title: 'Create Car Damage',
              closeUrl: '../',
            });
          });
        }
      },
      formControls: formControls$,
      closeUrl: '../../',
    } as ModalPageModelConfig;
  }
}
