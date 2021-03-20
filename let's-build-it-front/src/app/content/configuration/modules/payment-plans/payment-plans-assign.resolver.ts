import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, Subject, forkJoin } from 'rxjs';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { ModalMessage } from '../../../../@core/models/modal-message';
import { FormTextComponent } from '../../../../@forms/form-fields/form-text/form-text.component';
import { ModalAssignPageModelConfig } from '../../../../@shared/components/modal-assign-page/modal-assign-page.model';
import { map, take } from 'rxjs/operators';
import { PickModel } from '../../../../@shared/components/modal-assign-page/pick.model';
import { IPagedList } from '../../../../@shared/models/paged-list.response';
import { Location } from '@angular/common';
import { PartnersService } from '../../../agencies/partners.service';
import { PaymentPlansService } from './payment-plans.service';
import { PaymentPlanModel, PaymentPlanType } from '../../../../@shared/models/payment-plan.model';
import { ErrorMessages } from '../../../../@shared/models/error-messages.model';
import { faCar, faPhone } from '@fortawesome/free-solid-svg-icons';
import { AbstractControl } from '@angular/forms';
import { FilterObject, LazyLoadEvent } from '../../../../@ideo/components/table/events/lazy-load.event';
import { MatchMode } from '../../../../@ideo/components/table/models/table-filter';

@Injectable({
  providedIn: 'root',
})
export class PaymentPlansAssignResolverService implements Resolve<ModalAssignPageModelConfig> {
  constructor(
    private partnersService: PartnersService,
    private paymentPlansService: PaymentPlansService,
    private location: Location
  ) {}
  resolve(): ModalAssignPageModelConfig | Observable<ModalAssignPageModelConfig> | Promise<ModalAssignPageModelConfig> {
    let evt$ = new Subject<LazyLoadEvent>();
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
          label: 'Partner Name',
          placeholder: 'Partner Number',
          styleClass: 'col-4',
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
      submit: (selectedArr: PickModel[], model: PaymentPlanModel) => {
        let errorMessages = {
          404: `Payment Plan Not Found`,
        } as ErrorMessages;
        forkJoin(
          selectedArr.map((i) => {
            errorMessages[200] = `Assign ${PaymentPlanType[model.selectedPlan]} Plan to ${i.title} Successfully`;
            return this.partnersService.updatePaymentPlan(i.id, model.id, errorMessages, i.title);
          })
        )
          .pipe(take(1))
          .subscribe((res) => {
            if (res?.filter((i) => !!i)?.length === res.length) {
              this.location.back();
            }
          });
      },
      getAll: (evt) =>
        this.partnersService.getAll(evt).pipe(
          map((res) => {
            let pagedRes = {
              data: res?.data?.map((i) => {
                return {
                  id: i.id,
                  img: i.logoImgId,
                  title: i.name,
                  detailsArr: [
                    { text: i?.status ? 'Active' : 'Inactive' },
                    { text: i.phone, icon: faPhone },
                    { text: i.vehiclesCount | 0, icon: faCar },
                  ],
                } as PickModel;
              }),
              total: res?.total,
            } as IPagedList<PickModel>;
            return pagedRes;
          })
        ),
      getEntityById: (routePrams) => {
        if ('id' in routePrams) {
          if (!isNaN(+routePrams?.['id'])) {
            let req = this.paymentPlansService.get(routePrams.id);
            req
              .toPromise()
              .then((res) => {
                if (!!res) {
                  type$.next({
                    mode: 'Assign',
                    title: `Assign to ${PaymentPlanType[res.selectedPlan]} PayMent Plan`,
                    closeUrl: '../../',
                  });
                  return;
                }
                type$.next({
                  mode: 'Not Found',
                  title: 'Not Found',
                  subTitle: 'Sorry, Payment Plan not found',
                  message: 'Please make sure you have typed the correct URL',
                  closeUrl: '../../',
                });
                return;
              })
              .catch(() => {
                handelPageNotFound();
              });
            return req;
          }
        }
        handelPageNotFound();
      },
      filterControls: formControls,
      multiSelected: true,
      evt: evt$,
    } as ModalAssignPageModelConfig;
  }
}
