import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabledPageComponent } from '@app/@shared/components/tabled-page/tabled-page.component';
import { RolesResolverService } from './resolvers/roles.resolver';
import { FormPagedComponent } from '../../../../../@shared/components/form-paged/form-paged.component';
import { RolesFormComponentResolverService } from './resolvers/roles-form.resolver';

const routes: Routes = [
  {
    path: '',
    component: TabledPageComponent,
    resolve: { config: RolesResolverService },
  },
  {
    path: ':id',
    component: FormPagedComponent,
    resolve: { config: RolesFormComponentResolverService },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
