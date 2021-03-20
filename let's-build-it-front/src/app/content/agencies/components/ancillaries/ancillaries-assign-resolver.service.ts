import { Injectable } from '@angular/core';
import { AncillariesService } from './ancillaries.service';
import { AncillariesGroupService } from './ancillaries-group.service';
import { NotificationsService } from '../../../../@ideo/components/notifications/notifications.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ModalAssignPageModelConfig } from '../../../../@shared/components/modal-assign-page/modal-assign-page.model';
import { Observable, Subject } from 'rxjs';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from '../../../../@forms/form-fields/form-text/form-text.component';
import { ModalMessage } from '../../../../@core/models/modal-message';
import { PickModel } from '../../../../@shared/components/modal-assign-page/pick.model';
import { AncillaryModel } from '../../../../@shared/models/ancillaries.model';
import { SideBarPageService } from '../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { map } from 'rxjs/operators';
import { IPagedList } from '../../../../@shared/models/paged-list.response';
import { AbstractControl } from '@angular/forms';
import { LazyLoadEvent, FilterObject } from '../../../../@ideo/components/table/events/lazy-load.event';
import { MatchMode } from '../../../../@ideo/components/table/models/table-filter';
import { ErrorMessages } from '../../../../@shared/models/error-messages.model';

@Injectable({
  providedIn: 'root',
})
export class AncillariesAssignResolverService implements Resolve<ModalAssignPageModelConfig> {
  private _partnerId: number;
  public formControls: DynamicFormControl[];
  public get partnerId() {
    if (!this._partnerId) {
      this._partnerId = this.sidebarService.entity.id;
    }
    return this._partnerId;
  }
  constructor(
    private entityService: AncillariesService,
    private pickService: AncillariesGroupService,
    private sidebarService: SideBarPageService,
    private notificationsService: NotificationsService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): ModalAssignPageModelConfig | Observable<ModalAssignPageModelConfig> | Promise<ModalAssignPageModelConfig> {
    let evt$ = new Subject<LazyLoadEvent>();
    let closeEvent$: Subject<boolean> = new Subject<boolean>();
    setTimeout(() =>
      evt$.next({
        page: 1,
        pageSize: 10,
        filters: {} as FilterObject,
      } as LazyLoadEvent)
    );

    let formControls: DynamicFormControl[] = [
      {
        type: FormTextComponent,
        config: {
          name: 'name',
          type: 'text',
          label: 'Name',
          onChange: (currentValue: any, ctrl: AbstractControl) => {
            evt$.next({
              page: 1,
              pageSize: 10,
              filters: {
                Name: { matchMode: MatchMode.Contains, value: currentValue },
              } as FilterObject,
            } as LazyLoadEvent);
          },
          placeholder: 'Enter Name',
          styleClass: 'col-6',
        },
      },
    ];
    let type$: Subject<ModalMessage> = new Subject<ModalMessage>();
    const handelPageNotFound = (): void => {
      setTimeout(() => {
        type$.next({
          mode: 'Not Found',
          title: 'Not Found',
          subTitle: 'Sorry, page not found',
          message: 'Please make sure you have typed the correct URL',
          closeUrl: '../../',
        });
      });
    };
    return {
      type: type$,
      submit: (selected: PickModel, model: AncillaryModel) => {
        let newModel = model;
        newModel.ancillaryGroupId = selected.id;
        let errorMessages: ErrorMessages = {
          200: 'Ancillary Assigned Successfully',
        };
        let entityName = 'Ancillary';
        this.entityService
          .update(this.partnerId, model.id, model, errorMessages, entityName)
          .toPromise()
          .then((res) => {
            if (!!res) {
              closeEvent$.next(true);
            }
          });
      },
      getAll: (evt) =>
        this.pickService.getAll(this.partnerId, evt).pipe(
          map((res) => {
            let pagedRes = {
              data: res?.data?.map((i) => {
                return {
                  id: i.id,
                  title: i.name,
                } as PickModel;
              }),
              total: res?.total,
            } as IPagedList<PickModel>;
            return pagedRes;
          })
        ),
      getEntityById: (routePrams) => {
        if ('id' in routePrams && !isNaN(+routePrams?.['id'])) {
          let req = this.entityService.get(this.partnerId, routePrams.id);
          req
            .toPromise()
            .then((res) => {
              if (!!res) {
                type$.next({
                  mode: 'Assign',
                  title: 'Assign',
                  closeUrl: '../../',
                });
                return;
              }
              type$.next({
                mode: 'Not Found',
                title: 'Not Found',
                subTitle: 'Sorry, Ancillary not found',
                message: 'Please make sure you have typed the correct URL',
                closeUrl: '../../',
              });
              return;
            })
            .catch(() => {
              handelPageNotFound();
            });
          return req;
        } else {
          handelPageNotFound();
        }
      },
      filterControls: formControls,
      evt: evt$,
      closeEvent: closeEvent$,
      closeUrl: '../../',
    } as ModalAssignPageModelConfig;
  }
}
