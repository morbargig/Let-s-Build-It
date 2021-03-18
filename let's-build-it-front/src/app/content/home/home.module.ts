import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { UtilsModule } from '@app/blocks/utils';

import { HomeRoutingModule } from './home-routing.module';
import { WizardsModule } from '@app/blocks/wizards/wizards.module';
import { HomeComponent } from './components/home/home.component';


@NgModule({
  imports: [SharedModule, UtilsModule, WizardsModule, HomeRoutingModule],
  declarations: [HomeComponent],
})
export class HomeModule {}
