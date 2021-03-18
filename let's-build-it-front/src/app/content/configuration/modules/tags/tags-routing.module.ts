import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { fromPairs } from 'lodash';
import { FormPagedComponent } from '../../../../@shared/components/form-paged/form-paged.component';
import { TabledPageComponent } from '../../../../@shared/components/tabled-page/tabled-page.component';
import { TagsResolverService } from '../tags/tags.resolver';
import { TagFormResolverService } from '../tags/tag-form.resolver';

const routes: Routes = [
  {
    path: '',
    component: TabledPageComponent,
    resolve: { config: TagsResolverService },
  },
  {
    path: ':id',
    component: FormPagedComponent,
    resolve: { config: TagFormResolverService },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagsRoutingModule {}
