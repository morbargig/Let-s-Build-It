import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AclRoutingModule } from './acl-routing.module';
import { AclComponent } from './components/acl/acl.component';
import { SharedModule } from '@app/@shared';
import { AvatarsModule } from '@app/blocks/avatars/avatars.module';
import { NavigationsModule } from '@app/blocks/navigations/navigations.module';
import { ProgressModule } from '@app/blocks/progress/progress.module';
import { UtilsModule } from '@app/blocks/utils';
import { LoaderModule } from '@app/@ideo/components/loader/loader.module';

@NgModule({
  declarations: [AclComponent],
  imports: [
    CommonModule,
    AclRoutingModule,
    NgxDatatableModule,
    SharedModule,
    UtilsModule,
    AvatarsModule,
    NavigationsModule,
    ProgressModule,
    LoaderModule,
  ],
})
export class AclModule {}
