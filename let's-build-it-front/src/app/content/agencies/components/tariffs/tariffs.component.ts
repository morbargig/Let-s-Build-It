import { Component, OnInit, ViewChild } from '@angular/core';
import { TablePageDirective } from '../../../../@shared/directives/table-page.directive';
import { TableComponent } from '../../../../@ideo/components/table/table.component';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { ImportConfig } from '../../../../@shared/models/import.config';
import { ButtonItem } from '../../../../@ideo/core/models/button-item';
import { TableFilter } from '../../../../@ideo/components/table/models/table-filter';
import { faEdit, faTrash, faHandshake, faPlus, faFileExcel, faFileCsv, faCopy } from '@fortawesome/free-solid-svg-icons';
import { SelectItem } from '../../../../@ideo/components/table/models/select-item';
import { ImportComponent } from '../../../../@shared/components/import/import.component';
import { take, filter } from 'rxjs/operators';
import { SideBarPageService } from '../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { TableColumn, TableColumnType } from '../../../../@ideo/components/table/models/table-column';
import { LazyLoadEvent } from '../../../../@ideo/components/table/events/lazy-load.event';
import { Observable } from 'rxjs';
import { IPagedList } from '../../../../@shared/models/paged-list.response';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationsService } from '../../../../@ideo/components/notifications/notifications.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TextFilterComponent } from '../../../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { NumericFilterComponent } from '../../../../@ideo/components/table/table-filters/numeric-filter/numeric-filter.component';
import { TariffsFormService } from './tariffs-form.service';
import { PricesService } from './prices.service';
import { PartnerPriceModel, Period } from '../../../../@shared/models/partner-price.model';
import { CalendarFilterComponent } from '../../../../@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { SymbolModel } from '@app/@shared/models/symbol.model';
import { DatePipe } from '@angular/common';
import { range } from 'lodash';
import { RelatedFilterComponent } from '../../../../@ideo/components/table/table-filters/related-filter/related-filter.component';
import { BooleanFilterComponent } from '../../../../@ideo/components/table/table-filters/boolean-filter/boolean-filter.component';

@Component({
  selector: 'prx-tariffs',
  templateUrl: './tariffs.component.html',
  styleUrls: ['./tariffs.component.scss']
})
export class TariffsComponent extends TablePageDirective<PartnerPriceModel> implements OnInit {

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

  public itemActions: ButtonItem<PartnerPriceModel>[] = [
    {
      label: 'Details',
      icon: faHandshake,
      styleClass: 'btn-outline-primary ml-2',
      href: (item) => ['./', item.id],
    },
    {
      label: 'Duplicate',
      icon: faCopy,
      styleClass: 'btn-outline-primary ml-2',
      href: (item) => {
        return ['create', item.id]
      }
    },
    {
      tooltip: 'Edit',
      icon: faEdit,
      styleClass: 'btn-outline-primary ml-2',
      href: (item) => {
        return ['edit', item.id]
      }
    },
    {
      tooltip: 'Delete',
      styleClass: 'btn-outline-primary ml-2',
      
      icon: faTrash,
      click: (item) => {
        this.deleteItem(item)
      },
    },];
  public selectActions: SelectItem[] = [
    { label: 'Add Tariff', icon: faPlus, value: { url: ['create', 'new'] } },
    {
      label: 'Import Tariff CSV', icon: faFileExcel, value: 'import-ancillaries', click: (evt) =>
        (this.modalService.show(ImportComponent, {
          initialState: {
            config: new ImportConfig({
              downloadTemplate: 'api/tariffs/template',
              parseDataUrl: () => null,
              import: (model: PartnerPriceModel[]) => this.entityService.bulk(this.partnerId, model),
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
  public columns: TableColumn<PartnerPriceModel>[];


  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<PartnerPriceModel>> {

    return this.entityService.getAll(this.partnerId, evt);
  }
  public deleteEntity(item: PartnerPriceModel): Observable<any> {
    let entityName = item.name
    let errorMessages = {
      200: `${entityName} deleted successfully`,
    }
    this.entityService.delete(this.partnerId, item.id, errorMessages, entityName).toPromise().then(res => {
      this.tc.getData();
    })
    return null
  }

  constructor(
    private entityFormService: TariffsFormService,
    modalService: BsModalService,
    private datePipe: DatePipe,
    notificationsService: NotificationsService,
    router: Router,
    private sidebarService: SideBarPageService,
    private entityService: PricesService,
    private route: ActivatedRoute,
  ) {
    super(modalService, true, notificationsService, router)
  }

  public selectedClick: (pram: string | any) => void = (pram) => {
    pram.url ? this.router.navigate(pram?.url, { relativeTo: this.route }) : null
  }

  ngOnInit(): void {
    this.formControls = this.entityFormService.generate();
    this.columns = [
      ...[{
        field: 'id',
        hidden: true,
        filter: null
      },
      {
        field: 'name',
        header: 'Name',
        sortable: true,
        filter: [{ name: 'name', type: TextFilterComponent, placeholder: 'Name' }],
      },
      {
        field: 'isActive',
        header: 'State',
        sortable: true,
        type: TableColumnType.Boolean,
        filter: [{ name: 'isActive', type: BooleanFilterComponent, placeholder: 'State' }],
      },
      {
        field: 'test',
        header: 'Tariff Start & Tariff End',
        parsedFullData: (item: PartnerPriceModel) => {
          return item
        },
        parsedHtmlData: (item: PartnerPriceModel) => {
          let date = (date: Date) => date ? this.datePipe.transform(date, 'yyyy-mm-dd') : ''
          return `<div>${date(item.start)}</div><div>${date(item.end)}</div>`
        },
        sortable: true,
        filter: [{ name: 'Start', type: CalendarFilterComponent, placeholder: 'Tariff Start' }, { name: 'End', type: CalendarFilterComponent, placeholder: 'Tariff End' }],
      },
      {
        field: 'minChargeTime',
        header: 'Min Charge (minutes)',
        filter: [{ name: 'minChargeTime', type: NumericFilterComponent, placeholder: 'Min Charge (minutes)' }],
        // parsedFullData: (item) => {
        //   return (item?.documents as MediaItemModel[])?.map((i: any) => i.id)?.[0]
        // },
      },] as TableColumn<PartnerPriceModel>[],
      ... (range(1, 6).map(i => {
        return {
          field: 'priceValues',
          header: `${Period[i]} Price & Mileage`,
          filter: null,
          parsedFullData: (item: PartnerPriceModel) => {
            return item?.priceValues?.[i - 1]?.price
          },
        } as TableColumn<PartnerPriceModel>
      })), ...
      [{
        field: 'extraMileageCharge',
        header: `Extra Mileage (${SymbolModel.NIS}/km)`,
        filter: [{ name: 'extraMileageCharge', type: TextFilterComponent, placeholder: `Extra Mileage (${SymbolModel.NIS}/km)` }],
      },
      {
        field: 'carsCount',
        header: 'Vehicles Assign',
        filter: [{ name: 'carsCount', type: NumericFilterComponent, placeholder: 'Vehicles Assign' }],
      },
      ],

    ] as TableColumn<PartnerPriceModel>[]
  }
}

