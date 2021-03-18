import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [AuthRoutingModule.declarations],
  imports: [SharedModule, AuthRoutingModule],
})
export class AuthModule {}
