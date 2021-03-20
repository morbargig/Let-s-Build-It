import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabledPageComponent } from '../../../../@shared/components/tabled-page/tabled-page.component';
import { PaymentPlansResolverService } from './payment-plans-resolver';
import { ModalAssignPageComponent } from '@app/@shared/components/modal-assign-page/modal-assign-page.component';
import { PaymentPlansAssignResolverService } from './payment-plans-assign.resolver';
import { FormPagedComponent } from '../../../../@shared/components/form-paged/form-paged.component';
import { PaymentPlansFormResolverService } from './payment-plans-form.resolver';

const routes: Routes = [
  {
    path: '',
    component: TabledPageComponent,
    resolve: { config: PaymentPlansResolverService }, // all Payment Plans
    children: [
      {
        path: 'assign/:id',
        component: ModalAssignPageComponent,
        resolve: { config: PaymentPlansAssignResolverService }, // assign Payment Plan
      },
    ],
  },
  {
    path: ':id',
    component: FormPagedComponent,
    resolve: { config: PaymentPlansFormResolverService },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentPlansRoutingModule {}
