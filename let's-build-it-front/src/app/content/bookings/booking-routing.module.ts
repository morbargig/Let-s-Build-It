import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabledPageComponent } from '@app/@shared/components/tabled-page/tabled-page.component';
import { WizardPageComponent } from '../../@shared/components/wizard-page/wizard-page.component';
import { BookingResolverService } from './booking.resolver';
import { BookingFormResolverService } from './booking-form-resolver.service';

const routes: Routes = [
  // {
  //   path: '',
  //   component: TabledPageComponent,
  //   resolve: { config: BookingResolverService },
  // },
  {
    path: ':id',
    component: WizardPageComponent,
    resolve: { config: BookingFormResolverService },
    children: [
      // { path: 'create-user', component: NewUserComponent, outlet: 'create-user' },
      // TODO for use in the right component
      // <router-outlet name="route1"></router-outlet>
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingRoutingModule {}
