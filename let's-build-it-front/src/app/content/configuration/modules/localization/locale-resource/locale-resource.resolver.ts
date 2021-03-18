import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BasePageConfig } from '../../../../../@shared/models/base-page.config';
import { TextFilterComponent } from '../../../../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { TableColumn } from '../../../../../@ideo/components/table/models/table-column';
import { MultiselectFilterComponent } from '../../../../../@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { map, tap } from 'rxjs/operators';
import { SelectItem } from '../../../../../@forms/@core/interfaces';
import { LanguagesService } from '../language/languages.service';
import { LocaleResourcesService } from './locale-resources.service';
import { LocaleResourceModel } from '../../../../../@shared/models/locale-resource-model';
import { LazyLoadEvent } from '../../../../../@ideo/components/table/events/lazy-load.event';
import { ImportConfig } from '@app/@shared/models/import.config';
import { LocaleResourceFormService } from '../locale-resource/locale-resource-form.service';

@Injectable({
  providedIn: 'root',
})
export class LocaleResourceComponentResolverService implements Resolve<BasePageConfig<any>> {
  constructor(
    private router: Router,
    private localeResourcesService: LocaleResourcesService,
    private languagesService: LanguagesService,
    private localeResourceFormService: LocaleResourceFormService
  ) {}

  private languages: SelectItem[] = [];
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BasePageConfig<LocaleResourceModel> {
    const columns: TableColumn[] = [
      {
        field: 'name',
        header: 'Name',
        sortable: true,
        filter: [{ name: 'Name', type: TextFilterComponent, placeholder: 'Name' }],
      },
      {
        field: 'languageId',
        header: 'Language',
        sortable: true,
        parsedData: (val) => {
          return this.languages.find((z) => z.value == val)?.label;
        },
        filter: [
          {
            name: 'LanguageId',
            type: MultiselectFilterComponent,
            placeholder: 'Language',
            asyncOptions: this.languagesService
              .getAll({
                page: 1,
                pageSize: 200,
              } as LazyLoadEvent)
              .pipe(
                map((r) =>
                  r?.data?.map((a) => {
                    return {
                      value: a.id,
                      label: a.name,
                    } as SelectItem;
                  })
                ),
                tap((x) => (this.languages = x))
              ),
          },
        ],
      },
      {
        field: 'value',
        header: 'Value',
        sortable: true,
        filter: [{ name: 'Value', type: TextFilterComponent, placeholder: 'Value' }],
      },
      {
        field: 'id',
        hidden: true,
        filter: [],
      },
    ];
    const formControls = this.localeResourceFormService.generate(true);
    return new BasePageConfig({
      columns: columns,
      deleteEntity: (evt) => this.localeResourcesService.delete(evt.id),
      getDataProvider: (evt) => this.localeResourcesService.getAll(evt),
      createLabel: 'Create Locale Resource',
      formRoute: 'users',
      title: 'Locale Resources',
      preTitle: 'Localization',
      editAction: (item: LocaleResourceModel) => {
        this.router.navigate(['/configuration/localization/locale-resources', item.id]);
      },
      createAction: () => this.router.navigate(['/configuration/localization/locale-resources', 'create']),
      importConfig: new ImportConfig({
        downloadTemplate: 'api/localization/LocaleResources/template',
        parseDataUrl: () => null,
        import: (model: LocaleResourceModel[]) => this.localeResourcesService.bulk(model),
        columns: columns,
        controls: formControls,
      }),
      itemActions: [],
      permissions: {
        create: ['CreateLocalization'],
        edit: ['EditLocalization'],
        delete: ['DeleteLocalization'],
      },
      stateKey: 'locale-resource-table',
    });
  }
}
