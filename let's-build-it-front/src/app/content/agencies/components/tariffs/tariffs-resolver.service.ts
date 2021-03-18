import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PricesService } from './prices.service';
import { TariffsFormService } from './tariffs-form.service';
import { SideBarPageService } from '../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { ModalPageModelConfig } from '../../../../@shared/components/modal-page/modal-page.model';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { ModalMessage } from '../../../../@core/models/modal-message';
import { ErrorMessages } from '../../../../@shared/models/error-messages.model';
import { PartnerPriceModel } from '../../../../@shared/models/partner-price.model';

@Injectable({
  providedIn: 'root'
})
export class TariffsResolverService implements Resolve<ModalPageModelConfig>  {

  constructor(private entityService: PricesService, private entityFormService: TariffsFormService, private sideBarPageService: SideBarPageService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ModalPageModelConfig | Observable<ModalPageModelConfig> | Promise<ModalPageModelConfig> {
    let formControls$: Subject<DynamicFormControl[]> = new Subject<DynamicFormControl[]>();
    let formControls: DynamicFormControl[] = null;
    let type$: BehaviorSubject<ModalMessage> = new BehaviorSubject<ModalMessage>(null);
    let closeEvent$: Subject<boolean> = new Subject<boolean>();
    return {
      type: type$,
      getEntityById: (routePrams) => {
        if ('action' in routePrams) {
          if (routePrams['action'] === 'create') {
            if (!isNaN(+routePrams?.['id']) && !!routePrams['id']) {
              this.entityService.get(this.sideBarPageService.entity.id, routePrams.id).toPromise().then(res => {
                if (!!res) {
                  formControls = this.entityFormService.generate(res, true)
                  formControls$.next(formControls);
                  type$.next({
                    mode: 'Create',
                    title: 'Duplicate Tariff',
                  })
                  return
                }
                type$.next({
                  mode: 'Not Found',
                  title: 'Tariff Not Found',
                  subTitle: "Sorry, Can not Duplicate Tariff, Tariff not found",
                  message: 'Please try agin, and make sure you have typed the correct URL'
                })
                return
              })
            }
            else if (routePrams['id'] === 'new') {
              formControls = this.entityFormService.generate()
              formControls$.next(formControls);
              setTimeout(() => {
                type$.next({
                  mode: 'Create',
                  title: 'Create Tariff',
                })
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
              })
            }
          }
          else if (routePrams['action'] === 'edit') {
            if ('id' in routePrams) {
              if (!isNaN(+routePrams?.['id'])) {
                this.entityService.get(this.sideBarPageService.entity.id, routePrams.id).toPromise().then(res => {
                  if (!!res) {
                    formControls = this.entityFormService.generate(res)
                    formControls$.next(formControls);
                    type$.next({
                      mode: 'Edit',
                      title: 'Edit Tariff',
                    })
                    return
                  }
                  type$.next({
                    mode: 'Not Found',
                    title: 'Tariff Not Found',
                    subTitle: 'Sorry, Can not Edit Tariff, Tariff not found',
                    message: 'Please try agin, and make sure you have typed the correct URL'
                  })
                  return
                })
              }
              else {
                setTimeout(() => {
                  type$.next({
                    mode: 'Not Found',
                    title: 'Tariff Not Found',
                    subTitle: 'Sorry, Tariff not found',
                    message: 'Please make sure you have typed the correct URL'
                  })
                })
              }
            }
            else {
              setTimeout(() => {
                type$.next({
                  mode: 'Not Found',
                  title: 'Not Found',
                  subTitle: 'Sorry, page not found',
                  message: 'Please make sure you have typed the correct URL'
                })
              })
            }
          }
        }
        else {
          setTimeout(() => {
            type$.next({
              mode: 'Not Found',
              title: 'Not Found',
              subTitle: 'Sorry, page not found',
              message: 'Please make sure you have typed the correct URL'
            })
          })
        }
        formControls$.next(formControls);
      },
      formControls: formControls$,
      submit: (val: PartnerPriceModel) => {
        debugger
        if (type$.getValue().mode === 'Create') {
          let errorMessages: ErrorMessages = {
            200: 'Tariff Create Successfully'
          }
          let entityName = 'Tariff'
          let req = this.entityService.create(this.sideBarPageService.entity.id, val, errorMessages, entityName)
          req.toPromise().then(res => {
            if (!!res) {
              closeEvent$.next(true)
            }
          })
          return req
        }
        else if (type$.getValue().mode === 'Edit') {
          let errorMessages: ErrorMessages = {
            200: 'Tariff Update Successfully'
          }
          let entityName = 'Tariff'
          let req = this.entityService.update(this.sideBarPageService.entity.id, val.id, val, errorMessages, entityName)
          req.toPromise().then(res => {
            if (!!res) {
              closeEvent$.next(true)
            }
          })
          return req
        }
      },
      closeEvent: closeEvent$,
      closeUrl: '../../',
    } as ModalPageModelConfig
  }
}

