import { Injectable } from '@angular/core';
import { AncillariesGroupService } from './ancillaries-group.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ModalPageModelConfig } from '../../../../@shared/components/modal-page/modal-page.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AncillariesGroupFormService } from './ancillaries-group-form.service';
import { SideBarPageService } from '../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { ModalMessage } from '../../../../@core/models/modal-message';
import { AncillaryGroupModel } from '../../../../@shared/models/ancillaries.model';
import { ErrorMessages } from '../../../../@shared/models/error-messages.model';

@Injectable({
  providedIn: 'root',
})
export class AncillariesGroupResolverService implements Resolve<ModalPageModelConfig> {
  constructor(
    private entityService: AncillariesGroupService,
    private entityFormService: AncillariesGroupFormService,
    private sideBarPageService: SideBarPageService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): ModalPageModelConfig | Observable<ModalPageModelConfig> | Promise<ModalPageModelConfig> {
    let formControls$: Subject<DynamicFormControl[]> = new Subject<DynamicFormControl[]>();
    let formControls: DynamicFormControl[] = null;
    let type$: BehaviorSubject<ModalMessage> = new BehaviorSubject<ModalMessage>(null);
    let closeEvent$: Subject<boolean> = new Subject<boolean>();
    return {
      type: type$,
      getEntityById: (routePrams) => {
        if ('id' in routePrams) {
          if (routePrams['id'] === 'create') {
            formControls = this.entityFormService.generate();
            setTimeout(() => {
              type$.next({
                mode: 'Create',
                title: 'Create Ancillary Group',
              });
            });
          } else if (!isNaN(+routePrams?.['id'])) {
            this.entityService
              .get(this.sideBarPageService.entity.id, routePrams.id)
              .toPromise()
              .then((res) => {
                if (!!res) {
                  formControls = this.entityFormService.generate(res);
                  formControls$.next(formControls);
                  type$.next({
                    mode: 'Edit',
                    title: 'Edit Ancillary Group',
                  });
                  return;
                }
                type$.next({
                  mode: 'Not Found',
                  title: 'Ancillary Group Not Found',
                  subTitle: 'Sorry, Ancillary Group not found',
                  message: 'Please make sure you have typed the correct URL',
                });
                return;
              });
          } else {
            setTimeout(() => {
              type$.next({
                mode: 'Not Found',
                title: 'Ancillary Group Not Found',
                subTitle: 'Sorry, Ancillary Group not found',
                message: 'Please make sure you have typed the correct URL',
              });
            });
          }
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
        formControls$.next(formControls);
      },
      submit: (val: AncillaryGroupModel) => {
        if (type$.getValue().mode === 'Create') {
          let errorMessages: ErrorMessages = {
            200: 'Ancillary Group Create Successfully',
          };
          let entityName = 'Ancillary Group';
          let req = this.entityService.create(this.sideBarPageService.entity.id, val, errorMessages, entityName);
          req.toPromise().then((res) => {
            if (!!res) {
              closeEvent$.next(true);
            }
          });
          return req;
        } else if (type$.getValue().mode === 'Edit') {
          let errorMessages: ErrorMessages = {
            200: 'Ancillary Group Update Successfully',
          };
          let entityName = 'Ancillary Group';
          let req = this.entityService.update(
            this.sideBarPageService.entity.id,
            val.id,
            val,
            errorMessages,
            entityName
          );
          req.toPromise().then((res) => {
            if (!!res) {
              closeEvent$.next(true);
            }
          });
          return req;
        }
      },
      closeEvent: closeEvent$,
      formControls: formControls$,
      closeUrl: '../../',
    } as ModalPageModelConfig;
  }
}
