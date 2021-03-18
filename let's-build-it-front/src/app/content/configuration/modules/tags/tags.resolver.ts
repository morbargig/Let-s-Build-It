import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TableColumn, TableColumnType } from '../../../../@ideo/components/table/models/table-column';
import { CalendarFilterComponent } from '../../../../@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { MultiselectFilterComponent } from '../../../../@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { TextFilterComponent } from '../../../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { TagType } from '../../../../@shared/interfaces/tag-type.enum';
import { BasePageConfig } from '../../../../@shared/models/base-page.config';
import { TagModel } from '../../../../@shared/models/tag.model';
import { TagsService } from '../tags/tags.service';
import { TagFormService } from './tag-form.service';
import { UtilsService } from '@app/@core/services/utils.service';
import { BehaviorSubject } from 'rxjs';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { UsersService } from '../../../users/services/users.service';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { map } from 'rxjs/operators';
import { ImportConfig } from '@app/@shared/models/import.config';

@Injectable({
  providedIn: 'root',
})
export class TagsResolverService implements Resolve<BasePageConfig<any>> {
  constructor(
    private tagsServices: TagsService,
    private router: Router,
    private tagFormService: TagFormService,
    private utilsService: UtilsService,
    private usersService: UsersService
  ) {}
  private users$: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BasePageConfig<TagModel> {
    this.usersService
      .getAll({
        page: 1,
        pageSize: 200,
      } as LazyLoadEvent)
      .pipe(
        map((r) =>
          r?.data?.map((a) => {
            return {
              value: a.id,
              label: a.userName,
            } as SelectItem;
          })
        )
      )
      .subscribe((res) => this.users$.next(res));
    const columns: TableColumn[] = [
      {
        field: 'key',
        header: 'Key',
        sortable: true,
        filter: [{ name: 'Key', type: TextFilterComponent, placeholder: 'Key' }],
      },
      {
        field: 'value',
        header: 'Value',
        sortable: true,
        filter: [{ name: 'Value', type: TextFilterComponent, placeholder: 'Value' }],
      },
      {
        field: 'type',
        header: 'Type',
        sortable: true,
        parsedData: (val) => {
          return !!val ? TagType[val] : '';
        },
        filter: [
          {
            name: 'Type',
            type: MultiselectFilterComponent,
            options: this.utilsService.toSelectItem(TagType),
          },
        ],
      },
      {
        field: 'creationUser',
        header: 'Creation User',
        sortable: true,
        filter: [
          {
            name: 'CreationUser',
            type: MultiselectFilterComponent,
            placeholder: 'Creation User',
            asyncOptions: this.users$,
          },
        ],
      },
      {
        field: 'externalId',
        header: 'External Id',
        sortable: true,
        filter: [{ name: 'ExternalId', type: TextFilterComponent, placeholder: 'External Id' }],
      },
      {
        field: 'createDate',
        header: 'Create Date',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'CreateDate', type: CalendarFilterComponent, placeholder: 'Create Date' }],
      },
      {
        field: 'updateDate',
        header: 'Update Date',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'UpdateDate', type: CalendarFilterComponent, placeholder: 'Update Date' }],
      },
      {
        field: 'id',
        hidden: true,
        filter: [],
      },
    ];
    const formControls = this.tagFormService.generate(true);
    return new BasePageConfig({
      columns: columns,
      deleteEntity: (evt) => this.tagsServices.delete(evt.id),
      getDataProvider: (evt) => this.tagsServices.getAll(evt),
      createLabel: 'Create Tag',
      formRoute: 'users',
      title: 'Tags',
      preTitle: 'Tags',
      editAction: (item: TagModel) => {
        this.router.navigate(['/configuration/tags', item.id]);
      },
      createAction: () => {
        this.router.navigate(['/configuration/tags', 'create']);
      },
      importConfig: new ImportConfig({
        downloadTemplate: 'api/tags/template',
        parseDataUrl: () => null,
        import: (model: TagModel[]) => this.tagsServices.bulk(model),
        columns: columns,
        controls: formControls,
      }),
      itemActions: [],
      permissions: {
        create: ['CreateTags'],
        edit: ['EditTags'],
        delete: ['DeleteTags'],
      },
      stateKey: 'tags-table',
    });
  }
}
