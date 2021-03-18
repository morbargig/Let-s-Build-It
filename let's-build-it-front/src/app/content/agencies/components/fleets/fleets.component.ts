import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { TableColumn, TableColumnType } from '@app/@ideo/components/table/models/table-column';
import { TableFilter } from '@app/@ideo/components/table/models/table-filter';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { ImportConfig } from '@app/@shared/models/import.config';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { TablePageDirective } from '../../../../@shared/directives/table-page.directive';
import { PartnerFleetModel } from '../../../../@shared/models/partner-fleet.model';
import { SideBarPageService } from '../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { CalendarFilterComponent } from '@app/@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { MultiselectFilterComponent } from '@app/@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { TextFilterComponent } from '@app/@ideo/components/table/table-filters/text-filter/text-filter.component';
import { InventoryType } from '@app/@shared/interfaces/inventory-type.enum';
import { asSelectItem } from '@app/prototypes';
import { NumericFilterComponent } from '../../../../@ideo/components/table/table-filters/numeric-filter/numeric-filter.component';
import { faEdit, faHandshake, faLink } from '@fortawesome/free-solid-svg-icons';
import { FleetsService } from '../../../fleets/services/fleets.service';

@Component({
  selector: 'prx-fleets',
  templateUrl: './fleets.component.html',
  styleUrls: ['./fleets.component.scss']
})
export class FleetsComponent extends TablePageDirective<PartnerFleetModel> implements OnInit {
  public importConfig?: ImportConfig;
  public columns: TableColumn<PartnerFleetModel>[];
  public pageActions: ButtonItem<any>[];
  public filters: TableFilter[];
  public itemActions: ButtonItem<PartnerFleetModel>[] = [{
    tooltip: 'Edit',
    icon: faEdit,
    styleClass: 'btn-outline-primary ml-2',
    click: (item) => {
      this.router.navigate(['edit', item.id], { relativeTo: this.route })
    },
  },
  {
    label: 'Details',
    icon: faHandshake,
    styleClass: 'btn-outline-primary ml-2',
    click: (item) => {
      this.router.navigate(['agencies', this.sidebarService.entity.id, 'fleets', item.id, 'profile'], { relativeTo: this.route.root })
    },
  }];

  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<PartnerFleetModel>> {
    return this.fleetsService.getAll(this.sidebarService.entity.id, evt);
  }

  public deleteEntity(item: PartnerFleetModel): Observable<any> {
    return this.fleetsService.delete(this.sidebarService.entity.id, item.id);
  }

  constructor(
    private sidebarService: SideBarPageService,
    modalService: BsModalService,
    router: Router,
    private route: ActivatedRoute,
    private fleetsService: FleetsService,
    notificationsService: NotificationsService,

  ) {
    super(modalService, true, notificationsService, router)
  }

  ngOnInit(): void {
    // this.fleetsService.get()

    this.columns = [

      {
        field: 'partnerId',
        hidden: true,
        filter: null,
      },
      {
        field: 'name',
        header: 'Name',
        sortable: true,
        filter: [{ name: 'Name', type: TextFilterComponent, placeholder: 'Name' }],
      },
      {
        field: 'vatId',
        header: 'Vat Id',
        sortable: true,
        filter: [{ name: 'VatId', type: TextFilterComponent, placeholder: 'Vat Id' }],
      },
      {
        field: 'phone',
        header: 'Phone',
        sortable: true,
        filter: [{ name: 'Phone', type: TextFilterComponent, placeholder: 'Phone' }],
      },
      {
        field: 'email',
        header: 'Email',
        sortable: true,
        filter: [{ name: 'Email', type: TextFilterComponent, placeholder: 'Email' }],
      },
      {
        field: 'address',
        header: 'Address',
        sortable: true,
        filter: [{ name: 'Address', type: TextFilterComponent, placeholder: 'Address' }],
      },
      { field: 'status', header: 'Status', sortable: true, type: TableColumnType.Boolean },
      {
        field: 'logoImgId',
        header: 'Logo',
        type: TableColumnType.Image,
      },
      {
        field: 'created',
        header: 'Create Date',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'CreateDate', type: CalendarFilterComponent, placeholder: 'Create Date' }],
      },
      {
        field: 'updated',
        header: 'Update Date',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'Updated', type: CalendarFilterComponent, placeholder: 'Update Date' }],
      },
      {
        field: 'id',
        hidden: true,
        filter: null,
      },
    ];
  }

}
