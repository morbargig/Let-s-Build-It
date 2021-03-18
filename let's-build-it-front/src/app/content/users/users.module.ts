import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { ProgressModule } from '@app/blocks/progress/progress.module';
import { SharedModule } from '@app/@shared';
import { AvatarsModule } from '@app/blocks/avatars/avatars.module';
import { NavigationsModule } from '@app/blocks/navigations/navigations.module';
import { UtilsModule } from '@app/blocks/utils';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { IdeoModule } from '../../@ideo/ideo.module';
import { TableModule } from '../../@ideo/components/table/table.module';
import { SummaryComponent } from './components/users/summary/summary.component';
import { NotificationsComponent } from './components/users/notifications/notifications.component';
import { LogActivitiesComponent } from './components/users/log-activities/log-activities.component';
import { ProfileComponent } from './components/users/profile/profile.component';
import { MessagesComponent } from './components/users/messages/messages.component';
import { IdeoFormsModule } from '../../@forms/ideo-forms.module';

@NgModule({
  declarations: [SummaryComponent, NotificationsComponent, LogActivitiesComponent, ProfileComponent, MessagesComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NgxDatatableModule,
    SharedModule,
    UtilsModule,
    AvatarsModule,
    NavigationsModule,
    ProgressModule,
    TableModule,
    IdeoFormsModule,
  ],
})
export class UsersModule { }
