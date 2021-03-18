import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { MultiselectFilterComponent } from '@app/@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { PartnersService } from '@app/content/agencies/partners.service';
import { map, tap } from 'rxjs/operators';
import { TableColumnType, TableColumn } from '../../../../@ideo/components/table/models/table-column';
import { CalendarFilterComponent } from '../../../../@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { TextFilterComponent } from '../../../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { BasePageConfig } from '../../../../@shared/models/base-page.config';
import { SettingModel } from '../../../../@shared/models/setting.model';
import { SettingsService } from './settings.service';
import { ImportConfig } from '../../../../@shared/models/import.config';
import { SettingsFormService } from './settings-form.service';

@Injectable({
  providedIn: 'root',
})
export class SettingResolverService implements Resolve<BasePageConfig<any>> {
  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private partnersService: PartnersService,
    private settingsFormService: SettingsFormService
  ) {}
  private partners: SelectItem[] = [];
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BasePageConfig<SettingModel> {
    const columns: TableColumn[] = [
      {
        field: 'name',
        header: 'Name',
        sortable: true,
        filter: [{ name: 'Name', type: TextFilterComponent, placeholder: 'Name' }],
      },
      {
        field: 'value',
        header: 'Value',
        sortable: true,
        filter: [{ name: 'Value', type: TextFilterComponent, placeholder: 'Value' }],
      },
      {
        field: 'partnerId',
        header: 'Partner',
        sortable: true,
        parsedData: (val) => {
          return this.partners.find((z) => z.value == val)?.label;
        },
        filter: [
          {
            name: 'PartnerId',
            type: MultiselectFilterComponent,
            placeholder: 'Partner',
            asyncOptions: this.partnersService
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
                tap((x) => (this.partners = x))
              ),
          },
        ],
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

    const formControls = this.settingsFormService.generate(true);

    return new BasePageConfig({
      columns: columns,
      deleteEntity: (evt) => this.settingsService.delete(evt.id),
      getDataProvider: (evt) => this.settingsService.getAll(evt),
      createLabel: 'Create Setting',
      formRoute: 'users',
      title: 'Settings',
      preTitle: 'Configuration',
      editAction: (item: SettingModel) => {
        this.router.navigate(['/configuration/settings', item.id]);
      },
      createAction: () => {
        this.router.navigate(['/configuration/settings', 'create']);
      },
      itemActions: [],
      permissions: {
        create: ['CreateSettings'],
        edit: ['EditSettings'],
        delete: ['DeleteSettings'],
      },
      stateKey: 'settings-table',
      importConfig: new ImportConfig({
        downloadTemplate: 'api/configuration/settings/template',
        parseDataUrl: () => null,
        import: (model: SettingModel[]) => this.settingsService.bulk(model),
        columns: columns,
        controls: formControls,
      }),
    });
  }
}
