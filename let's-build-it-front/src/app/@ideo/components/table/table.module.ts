import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableDirective } from './directives/sortable.directive';
import { TableCellDirective } from './directives/table-cell.directive';
import { AsyncCellComponent } from './table-cells/async-cell/async-cell.component';
import { BooleanCellComponent } from './table-cells/boolean-cell/boolean-cell.component';
import { DateCellComponent } from './table-cells/date-cell/date-cell.component';
import { DateTimeCellComponent } from './table-cells/date-time-cell/date-time-cell.component';
import { DefaultCellComponent } from './table-cells/default-cell/default-cell.component';
import { ImageCellComponent } from './table-cells/image-cell/image-cell.component';
import { LinkCellComponent } from './table-cells/link-cell/link-cell.component';
import { StatusCellComponent } from './table-cells/status-cell/status-cell.component';
import { SubStrCellComponent } from './table-cells/sub-str-cell/sub-str-cell.component';
import { AutocompleteFilterComponent } from './table-filters/autocomplete-filter/autocomplete-filter.component';
import { BooleanFilterComponent } from './table-filters/boolean-filter/boolean-filter.component';
import { CalendarFilterComponent } from './table-filters/calendar-filter/calendar-filter.component';
import { CheckboxFilterComponent } from './table-filters/checkbox-filter/checkbox-filter.component';
import { MultiselectFilterComponent } from './table-filters/multiselect-filter/multiselect-filter.component';
import { NumericFilterComponent } from './table-filters/numeric-filter/numeric-filter.component';
import { RelatedFilterComponent } from './table-filters/related-filter/related-filter.component';
import { SelectFilterComponent } from './table-filters/select-filter/select-filter.component';
import { TextFilterComponent } from './table-filters/text-filter/text-filter.component';
import { TableComponent } from './table.component';
import { TableService } from './services/table.service';
import { SelectModule } from '../select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiselectModule } from '../multiselect/multiselect.module';
import { TableFilterDirective } from './directives/table-filter.directive';
import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { IdeoPipesModule } from '../../infrastructure/pipes/pipes.module';
import { ButtonModule } from '../button/button.module';
import { TableFiltersComponent } from './components/table-filters/table-filters.component';
import { LoaderModule } from '../loader/loader.module';
import { IdeoFormsModule } from '@app/@forms/ideo-forms.module';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';

const featherIcons = allIcons;


const EXPORTED = [TableComponent];
const DIRECTIVES = [SortableDirective, TableCellDirective, TableFilterDirective];
const COMPONENTS = [
  ...EXPORTED,
  AsyncCellComponent,
  BooleanCellComponent,
  DateCellComponent,
  DateTimeCellComponent,
  DefaultCellComponent,
  ImageCellComponent,
  LinkCellComponent,
  StatusCellComponent,
  SubStrCellComponent,
  AutocompleteFilterComponent,
  BooleanFilterComponent,
  CalendarFilterComponent,
  CheckboxFilterComponent,
  MultiselectFilterComponent,
  NumericFilterComponent,
  RelatedFilterComponent,
  SelectFilterComponent,
  TextFilterComponent,
  TableFiltersComponent,
];

@NgModule({
  declarations: [...DIRECTIVES, ...COMPONENTS],
  imports: [
    CommonModule,
    SelectModule,
    MultiselectModule,
    ButtonModule,
    IdeoPipesModule,
    LoaderModule,
    IdeoFormsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    BsDropdownModule,
    RouterModule,
    FeatherModule.pick(featherIcons)
  ],
  exports: [...EXPORTED],
  providers: [TableService],
})
export class TableModule {}
