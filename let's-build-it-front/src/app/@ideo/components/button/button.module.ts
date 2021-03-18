import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { IdeoPipesModule } from '../../infrastructure/pipes/pipes.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ButtonComponent],
  imports: [CommonModule, NgbTooltipModule, RouterModule, IdeoPipesModule],
  exports: [ButtonComponent],
})
export class ButtonModule {}
