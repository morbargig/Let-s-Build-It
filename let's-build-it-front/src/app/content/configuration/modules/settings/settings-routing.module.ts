import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { fromPairs } from 'lodash';
import { FormPagedComponent } from '../../../../@shared/components/form-paged/form-paged.component';
import { TabledPageComponent } from '../../../../@shared/components/tabled-page/tabled-page.component';
import { SettingResolverService } from '../settings/setting.resolver';
import { SettingFormResolverService } from '../settings/setting-form.resolver';

const routes: Routes = [
  {
    path: '',
    component: TabledPageComponent,
    resolve: { config: SettingResolverService },
  },
  {
    path: ':id',
    component: FormPagedComponent,
    resolve: { config: SettingFormResolverService },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
