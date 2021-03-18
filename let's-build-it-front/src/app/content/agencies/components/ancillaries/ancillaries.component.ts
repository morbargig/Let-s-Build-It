import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from '../../../../@ideo/components/table/models/select-item';
import { Router, ActivatedRoute } from '@angular/router';
import { TableColumn, TableColumnType } from '../../../../@ideo/components/table/models/table-column';
import { AncillaryModel, AncillaryGroupModel } from '../../../../@shared/models/ancillaries.model';
import { TextFilterComponent } from '../../../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { ButtonItem } from '../../../../@ideo/core/models/button-item';
import { faEdit, faFileCsv, faFileExcel, faLink, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { TablePageDirective } from '../../../../@shared/directives/table-page.directive';
import { FilterObject, LazyLoadEvent } from '../../../../@ideo/components/table/events/lazy-load.event';
import { Observable } from 'rxjs';
import { IPagedList } from '../../../../@shared/models/paged-list.response';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationsService } from '../../../../@ideo/components/notifications/notifications.service';
import { ImportConfig } from '../../../../@shared/models/import.config';
import { MatchMode, TableFilter } from '../../../../@ideo/components/table/models/table-filter';
import { SideBarPageService } from '../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { AncillariesService } from './ancillaries.service';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { AncillariesFormService } from './ancillaries-form.service';
import { TableComponent } from '../../../../@ideo/components/table/table.component';
import { ImportComponent } from '../../../../@shared/components/import/import.component';
import { map, take } from 'rxjs/operators';
import { NumericFilterComponent } from '../../../../@ideo/components/table/table-filters/numeric-filter/numeric-filter.component';
import { TableRowGroup } from '../../../../@ideo/components/table/models/row-group';
import { AncillariesGroupService } from './ancillaries-group.service';
import { MediaItemModel } from '../../../../@shared/models/media-item.model';
import { FleetsService } from '../../../fleets/services/fleets.service';
import { MultiselectFilterComponent } from '@app/@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';

@Component({
  selector: 'prx-ancillaries',
  templateUrl: './ancillaries.component.html',
  styleUrls: ['./ancillaries.component.scss'],
})
export class AncillariesComponent extends TablePageDirective<AncillaryModel> implements OnInit {

  @ViewChild('tc', { static: false }) public tc: TableComponent;

  private _partnerId: number;
  public formControls: DynamicFormControl[];
  public get partnerId() {
    if (!this._partnerId) {
      this._partnerId = this.sidebarService.entity.id
    }
    return this._partnerId
  }



  public importConfig: ImportConfig;
  public pageActions: ButtonItem<any>[];
  public filters: TableFilter[];

  public itemActions: ButtonItem<AncillaryModel>[] = [{
    tooltip: 'Edit',
    icon: faEdit,
    styleClass: 'btn-outline-primary ml-2',
    href: (item) => ['ancillary', item.id],

  },
  {
    label: 'Assign Group',
    icon: faLink,
    styleClass: 'btn-outline-primary ml-2',
    href: (item) => ['assign', item.id],
  },
  {
    tooltip: 'Remove',
    styleClass: 'btn-outline-primary ml-2',
    icon: faTrash,
    click: (item) => {
      this.deleteItem(item)
    },
  },];
  public selectActions: SelectItem[] = [
    { label: 'Add Group', icon: faPlus, value: { url: ['group', 'create'] } },
    { label: 'Add Ancillary', icon: faPlus, value: { url: ['ancillary', 'create'] } },
    {
      label: 'Import CSV', icon: faFileExcel, value: 'import-ancillaries', click: (evt) =>
        (this.modalService.show(ImportComponent, {
          initialState: {
            config: new ImportConfig({
              downloadTemplate: 'api/ancillaries/template',
              parseDataUrl: () => null,
              import: (model: AncillaryModel[]) => this.ancillariesService.bulk(this.partnerId, model),
              columns: this.columns,
              controls: this.formControls,
            })
          },
          class: 'modal fullscreen modal-dialog-centered',
        }).content as ImportComponent).onClose
          .pipe(take(1))
          .subscribe((res) => {
            if (res) {
              this.getData();
            }
          })
    }, // TODO to make sure it ageists
    {
      label: 'Export CSV', icon: faFileCsv, value: 'export-csv', click: () => { this.tc.export(false, 'Csv') }
    },
    {
      label: 'Export Excel', icon: faFileExcel, value: 'export-all', click: () => {
        this.tc.export(false)
      }, // TODO right value for export to Excel
    }
  ];
  public columns: TableColumn<AncillaryModel>[];
  public tableRowGroup: TableRowGroup = {
    field: 'ancillaryGroupName',
    actions: [
      {
        label: 'Rename',
        value: { icon: faEdit, url: ['group', 'create'] },
        href: (item: AncillaryModel) => {
          return ['group', item.ancillaryGroupId];
        },
        // click: (evt) => {
        //   this.selectedClick(evt);
        // }
      }, {
        label: 'Remove',
        value: { icon: faTrash },
        click: (evt: any) => {
          let item = evt as AncillaryModel
          this.deleteItem({ type: 'Group', data: item }, `Are you sure you want to delete '${item.ancillaryGroupName}' Ancillary Group? it will delete all is child Ancillaries`)
        }
      }

    ]
  }

  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<AncillaryModel>> {
    if (
      evt?.sorts?.[0] !== 'AncillaryGroup.Name'
    ) {
      evt.sorts = ['AncillaryGroup.Name', ...evt?.sorts, evt.sortColumn].filter(i => !!i)
    }
    return this.ancillariesService.getAll(this.partnerId, evt);
  }
  public deleteEntity(item: AncillaryModel | { type: string, data: AncillaryModel }): Observable<any> {
    // TODO remove this Ancillary or Ancillary Group Model
    if ('type' in item && item['type'] === 'Group') {
      let entityName = (item.data as AncillaryModel).ancillaryGroupName
      let errorMessages = {
        200: `${entityName} deleted successfully`,
      }
      this.ancillariesGroupService.delete(this.partnerId, item.data.ancillaryGroupId, errorMessages, entityName).toPromise().then(res => {
        this.tc.getData();
      })
      return null
    }
    else {
      let entityName = (item as AncillaryModel).title
      let errorMessages = {
        200: `${entityName} deleted successfully`,
      }
      this.ancillariesService.delete(this.partnerId, (item as AncillaryModel).id, errorMessages, entityName).toPromise().then(res => {
        this.tc.getData();
      })
      return null
    }
  }

  constructor(
    private ancillariesFormService: AncillariesFormService,
    modalService: BsModalService,
    notificationsService: NotificationsService,
    router: Router,
    private ancillariesGroupService: AncillariesGroupService,
    private sidebarService: SideBarPageService,
    private ancillariesService: AncillariesService,
    private partnerFleetsService: FleetsService,
    private route: ActivatedRoute,
  ) {
    super(modalService, true, notificationsService, router)
  }

  public selectedClick: (pram: string | any) => void = (pram) => {
    pram.url ? this.router.navigate(pram?.url, { relativeTo: this.route }) : null
  }

  ngOnInit(): void {
    this.formControls = this.ancillariesFormService.generate();
    this.columns = [
      {
        field: 'fleetId',
        header: 'Fleet',
        sortable: true,
        permission: { roles: ['Admin', 'PartnerAdmin'] },
        filter: [{
          type: MultiselectFilterComponent, permission: { roles: ['Admin', 'PartnerAdmin'] },
          matchMode: MatchMode.Any,
          queryFilters: (query) => {
            return {
              "Name": {
                value: query,
                matchMode: MatchMode.Contains
              }
            } as FilterObject
          },
          lazyOptions: (evt) => {
            evt.sorts = ['Name'];
            evt.sortDirection = 'asc';
            debugger
            return this.partnerFleetsService.getAll(this.sidebarService.entity.id, evt).pipe(map(r => {
              let val = {
                data: r?.data?.map((a) => {
                  return {
                    value: a.id,
                    label: a.name,
                    // icon: a.logoImgId,
                  } as SelectItem;
                }),
                total: r.total
              };
              return val;
            }));
          }
        }],
      },
      {
        field: 'ancillaryGroupName',
        hidden: true
      }, {
        field: 'ancillaryGroupId',
        hidden: true
      },
      {
        field: 'id',
        header: 'Product ID',
        sortable: true,
        filter: [{ name: 'id', type: TextFilterComponent, placeholder: 'Product ID' }],
      },
      {
        field: 'title',
        header: 'Title',
        sortable: true,
        filter: [{ name: 'title', type: TextFilterComponent, placeholder: 'Title' }],
      },
      {
        field: 'price',
        header: 'Price',
        sortable: true,
        filter: [{ name: 'price', type: NumericFilterComponent, placeholder: 'Price' }],
      },
      {
        field: 'documents',
        header: 'Options',
        type: TableColumnType.Image,
        filter: null,
        parsedFullData: (item) => {
          return (item?.documents as MediaItemModel[])?.map((i: any) => i.id)?.[0]
        },
      },
      {
        field: 'description',
        header: 'Description',
        filter: [{ name: 'description', type: TextFilterComponent, placeholder: 'Description' }],
      },
    ]
  }
}
