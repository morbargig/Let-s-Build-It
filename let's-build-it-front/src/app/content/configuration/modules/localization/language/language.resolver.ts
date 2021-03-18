import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BasePageConfig } from '../../../../../@shared/models/base-page.config';
import { TextFilterComponent } from '../../../../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { TableColumnType, TableColumn } from '../../../../../@ideo/components/table/models/table-column';
import { CalendarFilterComponent } from '../../../../../@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { LanguageModel } from '../../../../../@shared/models/language-model';
import { MultiselectFilterComponent } from '../../../../../@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { LanguagesService } from './languages.service';
import { map } from 'rxjs/operators';
import { SelectItem } from '../../../../../@forms/@core/interfaces';
import { NumericFilterComponent } from '../../../../../@ideo/components/table/table-filters/numeric-filter/numeric-filter.component';
import { ImportConfig } from '../../../../../@shared/models/import.config';
import { LanguageFormService } from './language-form.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageComponentResolverService implements Resolve<BasePageConfig<any>> {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private languagesService: LanguagesService,
    private languageFormService: LanguageFormService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BasePageConfig<LanguageModel> {
    const columns: TableColumn[] = [
      {
        field: 'name',
        header: 'Name',
        sortable: true,
        filter: [{ name: 'Name', type: TextFilterComponent, placeholder: 'Name' }],
      },
      {
        field: 'languageCulture',
        header: 'Language Culture',
        sortable: true,
        filter: [
          {
            name: 'LanguageCulture',
            type: MultiselectFilterComponent,
            placeholder: 'Language Culture',
            asyncOptions: this.languagesService.getCultures().pipe(
              map((r) =>
                r.map((a) => {
                  return {
                    value: a,
                    label: a,
                  } as SelectItem;
                })
              )
            ),
          },
        ],
      },
      { field: 'rtl', header: 'Rtl', sortable: true, type: TableColumnType.Boolean },
      { field: 'active', header: 'Active', sortable: true, type: TableColumnType.Boolean },
      {
        field: 'displayOrder',
        header: 'Display Order',
        sortable: true,
        filter: [{ name: 'DisplayOrder', type: NumericFilterComponent, placeholder: 'DisplayOrder' }],
      },
      {
        field: 'updated',
        header: 'Updated',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'Updated', type: CalendarFilterComponent, placeholder: 'Updated' }],
      },
      {
        field: 'created',
        header: 'Created',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'Created', type: CalendarFilterComponent, placeholder: 'Created' }],
      },
      {
        field: 'id',
        hidden: true,
        filter: [],
      },
    ];

    const formControls = this.languageFormService.generate(true);

    return new BasePageConfig({
      columns: columns,
      deleteEntity: (evt) => this.languagesService.delete(evt.id),
      getDataProvider: (evt) => this.languagesService.getAll(evt),
      createLabel: 'Create Language',
      formRoute: 'users',
      title: 'Languages',
      preTitle: 'Localization',
      editAction: (item: LanguageModel) => {
        this.router.navigate(['/configuration/localization/languages', item.id]);
      },
      createAction: () => this.router.navigate(['/configuration/localization/languages', 'create']),
      importConfig: new ImportConfig({
        downloadTemplate: 'api/localization/languages/template',
        parseDataUrl: () => null,
        import: (model: LanguageModel[]) => this.languagesService.bulk(model),
        columns: columns,
        controls: formControls,
      }),
      itemActions: [],
      permissions: {
        create: ['CreateLocalization'],
        edit: ['EditLocalization'],
        delete: ['DeleteLocalization'],
      },
      stateKey: 'langauge-table',
    });
  }
}
