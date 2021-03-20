import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormPagedComponent } from '../../@shared/components/form-paged/form-paged.component';
import { TabledPageComponent } from '../../@shared/components/tabled-page/tabled-page.component';
import { InventoriesResolverService } from '../inventories/inventories.resolver';
import { InventoryFormResolverService } from '../inventories/inventory-form.resolver';

const routes: Routes = [
  {
    path: '',
    component: TabledPageComponent,
    resolve: { config: InventoriesResolverService },
  },
  {
    path: ':id',
    component: FormPagedComponent,
    resolve: { config: InventoryFormResolverService },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoriesRoutingModule {}
