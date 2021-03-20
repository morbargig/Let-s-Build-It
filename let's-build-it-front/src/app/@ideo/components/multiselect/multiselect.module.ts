import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiselectComponent } from './multiselect.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IdeoPipesModule } from '../../infrastructure/pipes/pipes.module';

@NgModule({
  declarations: [MultiselectComponent],
  imports: [CommonModule, NgbDropdownModule, ScrollingModule, IdeoPipesModule],
  exports: [MultiselectComponent],
})
export class MultiselectModule {}
