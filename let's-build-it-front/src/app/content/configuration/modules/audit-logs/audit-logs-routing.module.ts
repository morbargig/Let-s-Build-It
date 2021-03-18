import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabledPageComponent } from '../../../../@shared/components/tabled-page/tabled-page.component';
import { AuditLogsResolverService } from './audit-logs.resolver';

const routes: Routes = [
  {
    path: '',
    component: TabledPageComponent,
    resolve: { config: AuditLogsResolverService },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditLogsRoutingModule {}
