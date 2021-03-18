import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabledPageComponent } from '@app/@shared/components/tabled-page/tabled-page.component';
import { AlertsResolverService } from '../alerts/alerts.resolver';

const routes: Routes = [
  {
    path: '',
    component: TabledPageComponent,
    resolve: { config: AlertsResolverService },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertsRoutingModule {}
