import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormPagedComponent } from '@app/@shared/components/form-paged/form-paged.component';
import { TabledPageComponent } from '@app/@shared/components/tabled-page/tabled-page.component';
import { UsersComponentResolverService } from './components/users/users.component.resolver';
import { UserFormComponentResolverService } from './components/users/users-form.component.resolver';
import { WizardPageComponent } from '../../@shared/components/wizard-page/wizard-page.component';
import { SideBarPageComponent } from '../../@shared/components/side-bar-page/side-bar-page.component';
import { UserResolverService } from './components/users/user-resolver.service';
import { SummaryComponent } from './components/users/summary/summary.component';
import { NotificationsComponent } from './components/users/notifications/notifications.component';
import { LogActivitiesComponent } from './components/users/log-activities/log-activities.component';
import { ProfileComponent } from './components/users/profile/profile.component';
import { MessagesComponent } from './components/users/messages/messages.component';

const routes: Routes = [
  {
    path: '',
    component: TabledPageComponent,
    resolve: { config: UsersComponentResolverService },
  },
  {
    path: ':id',
    component: WizardPageComponent,
    resolve: { config: UserFormComponentResolverService },
  },
  {
    path: ':id',
    component: SideBarPageComponent,
    resolve: { config: UserResolverService },
    children: [
      { path: 'summary', component: SummaryComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'log-activities', component: LogActivitiesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
