import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PageFormConfig } from '../../../../@shared/models/edit-form.config';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaymentPlanModel, PaymentPlanType } from '../../../../@shared/models/payment-plan.model';
import { PaymentPlansService } from './payment-plans.service';
import { PaymentFormService } from './payment-form.service';
@Injectable({
    providedIn: 'root',
})
export class PaymentPlansFormResolverService implements Resolve<PageFormConfig> {
    constructor(private paymentPlansService: PaymentPlansService, private paymentFormService: PaymentFormService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PageFormConfig {
        let isEdit = route.paramMap.get('id') != 'create';
        let test =  route.paramMap.get('id')
        let isBedUrl = true
        if (isEdit && (typeof parseInt(route.paramMap.get('id')) === "number")) {
            isBedUrl = false
            // TODO need to break it
        }
        const titleEmitter$: Subject<string> = new Subject<string>();
        if (!isEdit) {
            setTimeout(() => {
                titleEmitter$.next(`Create Payment Plan`);
            })
        }
        const pageConfig = {
            title$: titleEmitter$,
            breadcrumbs: [{ label: 'Payment Plans', url: '../' }, { label: 'Payment Plans' }],
            groupConfig: {
                controls: this.paymentFormService.generate(),
            },
            submit: (model: any) => {
                if (isEdit) {
                    return this.paymentPlansService.update(model.id, model);
                } else {
                    return this.paymentPlansService.create(model);
                }
            },
            getEntityById: (id) =>
                this.paymentPlansService.get(id).pipe(
                    tap((x) => {
                        if (!!x) {
                            titleEmitter$.next(`Edit Payment Plan ${PaymentPlanType[x?.selectedPlan]}`);
                        } else {
                            titleEmitter$.next(`Payment Plan Not Found`);
                        }
                        return x as PaymentPlanModel;
                    })
                ),
        } as PageFormConfig;
        return pageConfig;
    }
}
