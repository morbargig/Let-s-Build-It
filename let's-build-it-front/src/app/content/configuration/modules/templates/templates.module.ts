import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplateValueEditorComponent } from './components/template-value-editor/template-value-editor.component';
import { NavigationsModule } from '../../../../blocks/navigations/navigations.module';
import { CardsModule } from '../../../../blocks/cards/cards.module';
import { IdeoFormsModule } from '../../../../@forms/ideo-forms.module';
import { SelectModule } from '../../../../@ideo/components/select/select.module';

@NgModule({
  declarations: [TemplateValueEditorComponent],
  imports: [CommonModule, TemplatesRoutingModule, NavigationsModule, CardsModule, IdeoFormsModule, SelectModule],
})
export class TemplatesModule {}
