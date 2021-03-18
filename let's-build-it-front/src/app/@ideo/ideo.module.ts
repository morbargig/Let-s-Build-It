import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from './components/select/select.module';
import { TableModule } from './components/table/table.module';
import { MultiselectModule } from './components/multiselect/multiselect.module';
import { IdeoPipesModule } from './infrastructure/pipes/pipes.module';
import { ButtonModule } from './components/button/button.module';
import { LoaderModule } from './components/loader/loader.module';
import { CheckboxModule } from './components/checkbox/checkbox.module';
import { CalendarModule } from './components/calendar/calendar.module';
import { AutocompleteModule } from './components/autocomplete/autocomplete.module';
import { NotificationsComponent } from './components/notifications/notifications.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, IdeoPipesModule],
  exports: [
    IdeoPipesModule,
    SelectModule,
    MultiselectModule,
    // TableModule,
    ButtonModule,
    LoaderModule,
    CheckboxModule,
    CalendarModule,
    AutocompleteModule,
  ],
  providers: [],
})
export class IdeoModule {}
