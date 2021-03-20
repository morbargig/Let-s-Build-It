import { Injectable, Type } from '@angular/core';
import { AncillariesService } from './ancillaries.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ModalPageModelConfig } from '../../../../@shared/components/modal-page/modal-page.model';
import { AncillariesFormService } from './ancillaries-form.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { ModalMessage } from '../../../../@core/models/modal-message';
import { SideBarPageService } from '../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { AncillaryModel } from '../../../../@shared/models/ancillaries.model';
import { MapType } from '@angular/compiler';
import { IdeoIconModel } from '../../../../@shared/models/ideo-icon.model';
import { MediaItemModel } from '../../../../@shared/models/media-item.model';
import { ErrorMessages } from '../../../../@shared/models/error-messages.model';

@Injectable({
  providedIn: 'root',
})
export class AncillariesResolverService implements Resolve<ModalPageModelConfig> {
  constructor(
    private entityService: AncillariesService,
    private entityFormService: AncillariesFormService,
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
    // let
    return {
      type: type$,
      getEntityById: (routePrams) => {
        if ('id' in routePrams) {
          if (routePrams['id'] === 'create') {
            formControls = this.entityFormService.generate();
            setTimeout(() => {
              type$.next({
                mode: 'Create',
                title: 'Create Ancillary',
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
                    title: 'Edit Ancillary',
                  });
                  return;
                }
                type$.next({
                  mode: 'Not Found',
                  title: 'Ancillary Not Found',
                  subTitle: 'Sorry, Ancillary not found',
                  message: 'Please make sure you have typed the correct URL',
                });
                return;
              });
          } else {
            setTimeout(() => {
              type$.next({
                mode: 'Not Found',
                title: 'Ancillary Not Found',
                subTitle: 'Sorry, Ancillary not found',
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
      formControls: formControls$,
      submit: (val: AncillaryModel) => {
        let fixDocuments = function () {
          for (let i in val) {
            if (i === 'documents')
              if (val[i] instanceof FileList) {
                let newFilesIdArr = [];
                val[i] as any;
                for (let ii of val[i] as any) {
                  newFilesIdArr.push({ id: ii?.id });
                }
                val[i] = newFilesIdArr.filter((i) => i.id) as any;
              } else {
                if (val[i]?.length) {
                  val[i] = (val[i] as any)?.map((ii: any) => {
                    return { id: ii?.id };
                  });
                } else if (typeof val[i] === 'object') {
                  val[i] = [{ id: (val[i] as any)?.id as MediaItemModel }] as any;
                }
              }
          }
        };
        if (type$.getValue().mode === 'Create') {
          fixDocuments();
          let errorMessages: ErrorMessages = {
            200: 'Ancillary Create Successfully',
          };
          let entityName = 'Ancillary';
          let req = this.entityService.create(this.sideBarPageService.entity.id, val, errorMessages, entityName);
          req.toPromise().then((res) => {
            if (!!res) {
              closeEvent$.next(true);
            }
          });
          return req;
        } else if (type$.getValue().mode === 'Edit') {
          fixDocuments();
          let errorMessages: ErrorMessages = {
            200: 'Ancillary Update Successfully',
          };
          let entityName = 'Ancillary';
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
      closeUrl: '../../',
    } as ModalPageModelConfig;
  }
}
