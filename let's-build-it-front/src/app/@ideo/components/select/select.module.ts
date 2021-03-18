import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [SelectComponent],
  imports: [CommonModule, NgbDropdownModule, ScrollingModule],
  exports: [SelectComponent],
})
export class SelectModule {}
