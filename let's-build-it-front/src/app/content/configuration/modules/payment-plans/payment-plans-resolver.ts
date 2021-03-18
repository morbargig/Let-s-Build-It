import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TableColumn, TableColumnType } from '../../../../@ideo/components/table/models/table-column';
import { CalendarFilterComponent } from '../../../../@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { BasePageConfig } from '../../../../@shared/models/base-page.config';
import { PaymentPlansService } from './payment-plans.service';
import { PaymentFormService } from './payment-form.service';
import { PaymentPlanModel, PaymentPlanType } from '../../../../@shared/models/payment-plan.model';
import { SelectFilterComponent } from '../../../../@ideo/components/table/table-filters/select-filter/select-filter.component';
import { asSelectItem } from '../../../../prototypes';
import { ImportConfig } from '../../../../@shared/models/import.config';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { TextFilterComponent } from '../../../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { NumericFilterComponent } from '../../../../@ideo/components/table/table-filters/numeric-filter/numeric-filter.component';

@Injectable({
    providedIn: 'root',
})
export class PaymentPlansResolverService implements Resolve<BasePageConfig<any>> {
    constructor(
        private paymentPlansService: PaymentPlansService,
        private router: Router,
        private paymentFormService: PaymentFormService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BasePageConfig<PaymentPlanModel> {
        const columns: TableColumn[] = [
            {
                field: 'selectedPlan',
                header: 'Selected Plan',
                parsedFullData: (item: PaymentPlanModel) => PaymentPlanType[item.selectedPlan],
                sortable: true,
                filter: [{ name: 'SelectedPlan', options: asSelectItem(PaymentPlanType), type: SelectFilterComponent, placeholder: 'Selected Plan' }],
            },
            {
                field: 'trialPeriodEnd',
                header: 'Trial End',
                sortable: true,
                type: TableColumnType.Date,
                filter: [{ name: 'TrialPeriodEnd', type: CalendarFilterComponent, placeholder: 'Trial End' }],
            },
            {
                field: 'fixedPaymentAmount',
                header: 'Fixed Payment Amount',
                sortable: true,
                filter: [{ name: 'FixedPaymentAmount', type: NumericFilterComponent, placeholder: 'Trial End' }],
            },
            {
                field: 'created',
                header: 'Create Date',
                sortable: true,
                type: TableColumnType.DateTime,
                filter: [{ name: 'Created', type: CalendarFilterComponent, placeholder: 'Create Date' }],
            },
            {
                field: 'updated',
                header: 'Update Date',
                sortable: true,
                type: TableColumnType.DateTime,
                filter: [{ name: 'Updated', type: CalendarFilterComponent, placeholder: 'Update Date' }],
            },
            {
                field: 'id',
                hidden: true,
                filter: [],
            },
        ];
        const formControls = this.paymentFormService.generate();
        return new BasePageConfig({
            columns: columns,
            deleteEntity: (evt) => this.paymentPlansService.delete(evt.id),
            getDataProvider: (evt) => this.paymentPlansService.getAll(evt),
            createLabel: 'Create Payment Plans',
            formRoute: 'users',
            title: 'Payment Plans',
            preTitle: 'Configuration',
            editAction: (item: PaymentPlanModel) => {
                this.router.navigate(['/configuration/payment-plans', item.id]);
            },
            createAction: () => {
                this.router.navigate(['/configuration/payment-plans', 'create']);
            },
            importConfig: new ImportConfig({
                downloadTemplate: 'api/payment-plans/template',
                parseDataUrl: () => null,
                import: (model: PaymentPlanModel[]) => this.paymentPlansService.bulk(model),
                columns: columns,
                controls: formControls,
            }),
            itemActions: [{
                label: "Assign",
                icon: faLink,
                href: (item: PaymentPlanModel) => ['./assign', item.id]
            }],
            permissions: {
                create: ['CreatePaymentPlans'],
                edit: ['EditPaymentPlans'],
                delete: ['DeletePaymentPlans'],
            },
            stateKey: 'payment-plans-table',
        });
    }
}
