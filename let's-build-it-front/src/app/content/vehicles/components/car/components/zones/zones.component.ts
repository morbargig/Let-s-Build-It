import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { TableColumn, TableColumnType } from '@app/@ideo/components/table/models/table-column';
import { TableFilter } from '@app/@ideo/components/table/models/table-filter';
import { TextFilterComponent } from '@app/@ideo/components/table/table-filters/text-filter/text-filter.component';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { TablePageDirective } from '@app/@shared/directives/table-page.directive';
import { CarModel } from '@app/@shared/models/car.model';
import { ImportConfig } from '@app/@shared/models/import.config';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { CarZoneModel } from '../../../../../../@shared/models/car-zone.model';
import { CarProfileService } from '../../car-profile.service';

@Component({
  selector: 'prx-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss'],
})
export class ZonesComponent extends TablePageDirective<CarZoneModel> implements OnInit {
  public importConfig?: ImportConfig;
  public columns: TableColumn<CarZoneModel>[];
  public pageActions: ButtonItem<any>[];
  public filters: TableFilter[];
  public itemActions: ButtonItem<CarZoneModel>[];

  public dropdownActions: SelectItem[] = [{ label: 'Damage Report', value: 'Damage-Report' }];

  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<CarZoneModel>> {
    return of({ data: [], total: 0 });
  }
  public deleteEntity(item: CarZoneModel): Observable<any> {
    throw new Error('Method not implemented.');
  }

  public get car(): CarModel {
    return this.carProfile.car;
  }

  constructor(
    modalService: BsModalService,
    notificationsService: NotificationsService,
    router: Router,
    private carProfile: CarProfileService
  ) {
    super(modalService, true, notificationsService, router);
  }

  ngOnInit(): void {
    this.columns = [
      {
        field: 'name',
        header: 'Name',
        sortable: true,
        filter: [{ name: 'Name', type: TextFilterComponent, placeholder: 'zone name' }],
      },
      {
        field: 'location',
        header: 'Location',
        sortable: true,
      },
      {
        field: 'tags',
        header: 'Tags',
        sortable: true,
        filter: [{ name: 'Tags', type: TextFilterComponent, placeholder: 'tag name' }],
      },

      { field: 'enables', header: 'Enabled', sortable: true, type: TableColumnType.Boolean },
    ];
  }
}
