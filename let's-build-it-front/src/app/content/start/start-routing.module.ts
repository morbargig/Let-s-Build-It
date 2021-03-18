import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/i18n';

import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [{ path: '', component: WelcomeComponent, data: { title: extract('Starter Page') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartRoutingModule { }
