import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabledPageComponent } from '../../../../@shared/components/tabled-page/tabled-page.component';
import { TemplatesResolverService } from './templates.resolver';
import { TemplateValueEditorComponent } from './components/template-value-editor/template-value-editor.component';

const routes: Routes = [
  {
    path: '',
    component: TabledPageComponent,
    resolve: { config: TemplatesResolverService },
  },
  {
    path: ':id',
    component: TemplateValueEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplatesRoutingModule {}
