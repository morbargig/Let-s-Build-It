import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { TableColumn } from '../../../../@ideo/components/table/models/table-column';
import { TextFilterComponent } from '../../../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { BasePageConfig } from '../../../../@shared/models/base-page.config';
import { TemplateModel, TemplateType } from '../../../../@shared/models/template.model';
import { TemplatesService } from './templates.service';
import { SelectFilterComponent } from '../../../../@ideo/components/table/table-filters/select-filter/select-filter.component';
import { UtilsService } from '../../../../@core/services/utils.service';
import { ImportConfig } from '../../../../@shared/models/import.config';

@Injectable({
  providedIn: 'root',
})
export class TemplatesResolverService implements Resolve<BasePageConfig<any>> {
  constructor(private templatesService: TemplatesService, private router: Router, public utilsService: UtilsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): BasePageConfig<any> | Observable<BasePageConfig<any>> | Promise<BasePageConfig<any>> {
    const columns: TableColumn[] = [
      {
        field: 'templateType',
        header: 'Template Type',
        sortable: true,
        parsedData: (val: TemplateType) => {
          return TemplateType[val];
        },
        filter: [
          {
            name: 'TemplateType',
            type: SelectFilterComponent,
            placeholder: 'Select Template Type',
            options: this.utilsService.toSelectItem(TemplateType),
          },
        ],
      },
      {
        field: 'type',
        header: 'Type',
        sortable: true,
        filter: [{ name: 'Type', type: TextFilterComponent, placeholder: 'Type' }],
      },
      {
        field: 'name',
        header: 'Name',
        sortable: true,
        filter: [{ name: 'Name', type: TextFilterComponent, placeholder: 'Name' }],
      },
    ];

    return new BasePageConfig({
      columns: columns,
      deleteEntity: (evt) => EMPTY,
      getDataProvider: (evt) => this.templatesService.getAll(evt),
      formRoute: 'users',
      title: 'Templates',
      preTitle: 'Configuration',
      editAction: (item: TemplateModel) => {
        this.router.navigate(['/configuration/settings', item.id]);
      },
      createAction: null,
      itemActions: [
        {
          styleClass: 'btn-outline-success ml-2',
          tooltip: 'Values',
          icon: 'fas fa-keyboard',
          click: (item, btn) => {
            this.router.navigate(['/configuration/templates', item.id]);
          },
        },
      ],
      stateKey: 'template-table',
      importConfig: new ImportConfig({
        downloadTemplate: 'api/configuration/templates/template',
        parseDataUrl: () => null,
        import: () => EMPTY,
        columns: columns,
        controls: null,
      }),
    });
  }
}
