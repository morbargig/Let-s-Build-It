import { Injectable, Type } from '@angular/core';
import { SelectItem } from '../models/select-item';
import { MatchMode, TableFilterInput } from '../models/table-filter';
import { SelectItemStore } from '../models/types';
import { CalendarFilterComponent } from '../table-filters/calendar-filter/calendar-filter.component';
import { MultiselectFilterComponent } from '../table-filters/multiselect-filter/multiselect-filter.component';
import { NumericFilterComponent } from '../table-filters/numeric-filter/numeric-filter.component';
import { RelatedFilterComponent } from '../table-filters/related-filter/related-filter.component';
import { SelectFilterComponent } from '../table-filters/select-filter/select-filter.component';
import { TextFilterComponent } from '../table-filters/text-filter/text-filter.component';
import { TableModule } from '../table.module';

@Injectable({
  providedIn: 'root',
})
export class TableFiltersService {
  private comparisonOptions: SelectItemStore<Type<TableFilterInput>>[] = [
    { label: 'Contains', value: MatchMode.Contains, useOn: [TextFilterComponent] },
    {
      label: 'Equals',
      value: MatchMode.Equals,
      useOn: [
        MultiselectFilterComponent,
        TextFilterComponent,
        NumericFilterComponent,
        CalendarFilterComponent,
        SelectFilterComponent,
      ],
    },
    {
      label: 'Not Equals',
      value: MatchMode.NotEquals,
      useOn: [TextFilterComponent, NumericFilterComponent, SelectFilterComponent],
    },
    { label: 'Less Than', value: MatchMode.LessThan, useOn: [NumericFilterComponent] },
    { label: 'Less Than or Equals', value: MatchMode.LessThanOrEquals, useOn: [NumericFilterComponent] },
    { label: 'Greater Than', value: MatchMode.GreaterThan, useOn: [NumericFilterComponent] },
    { label: 'Greater Than or Equals ', value: MatchMode.GreaterThanOrEquals, useOn: [NumericFilterComponent] },
    { label: 'Before', value: MatchMode.Before, useOn: [CalendarFilterComponent] },
    { label: 'Before or Equals', value: MatchMode.BeforeOrEquals, useOn: [CalendarFilterComponent] },
    { label: 'After', value: MatchMode.After, useOn: [CalendarFilterComponent] },
    { label: 'Equals or After ', value: MatchMode.EqualsOrAfter, useOn: [CalendarFilterComponent] },
    { label: 'Starts with', value: MatchMode.StartsWith, useOn: [TextFilterComponent] },
    { label: 'Ends With', value: MatchMode.EndsWith, useOn: [TextFilterComponent] },
    { label: 'Any', value: MatchMode.Any, useOn: [RelatedFilterComponent] },
  ];

  constructor() {}

  public getComparisonOptions(type: Type<TableFilterInput>): SelectItem[] {
    return this.comparisonOptions.filter((o) => o.useOn.includes(type));
  }
}
