import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { FilterObject, LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { TableColumn, TableColumnType } from '@app/@ideo/components/table/models/table-column';
import { MatchMode, TableFilter } from '@app/@ideo/components/table/models/table-filter';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { TablePageDirective } from '@app/@shared/directives/table-page.directive';
import { ImportConfig } from '@app/@shared/models/import.config';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { BsModalService } from 'ngx-bootstrap/modal';
import { from, Observable } from 'rxjs';
import { PartnerZone, ZoneType } from '../../../../@shared/models/partner-zone.model';
import { PartnerZonesService } from './partner-zones.service';
import { SideBarPageService } from '../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { SelectFilterComponent } from '../../../../@ideo/components/table/table-filters/select-filter/select-filter.component';
import { TextFilterComponent } from '../../../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { CalendarFilterComponent } from '../../../../@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { asSelectItem } from '@app/prototypes';
import { MapsAPILoader } from '@agm/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MapService } from '../../../../@shared/services/map.service';
import { map, tap } from 'rxjs/operators';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { MultiselectFilterComponent } from '@app/@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { FleetsService } from '../../../fleets/services/fleets.service';


@Component({
  selector: 'prx-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss']
})
export class ZonesComponent extends TablePageDirective<PartnerZone> implements OnInit {
  public importConfig?: ImportConfig;
  public columns: TableColumn<PartnerZone>[];
  public pageActions: ButtonItem<any>[];
  public filters: TableFilter[];
  public itemActions: ButtonItem<PartnerZone>[];

  public managerOptions: any = null;




  constructor(modalService: BsModalService,
    notificationsService: NotificationsService,
    private sidebarService: SideBarPageService,
    router: Router,
    private route: ActivatedRoute,
    private mapService: MapService,
    private mapsAPILoader: MapsAPILoader,
    private partnerFleetsService: FleetsService,
    private partnerZonesService: PartnerZonesService
    ) {
    super(modalService, true, notificationsService, router);

    this.sidebarService.breadcrumbs = [
      { label: 'Agencies', url: '../../' },
      { label: this.sidebarService.entity.name, url: './' },
      { label: 'Zones' },
    ];

  }

  ngOnInit(): void {
    this.itemActions = [
      {
        tooltip: 'Details',
        permission: { values: ['AccessAgencyFleetParkings'] },
        icon: 'fas fa-handshake',
        click: (item, btn) => {
          this.router.navigate(['./edit', item.id], { relativeTo: this.route });
        },
      },
      {
        tooltip: 'Delete',
        icon: 'fas fa-trash',
        permission: { values: ['DeleteAgencyFleetParkings'] },
        hidden: () => false,
        click: (item) => this.deleteItem(item),
        styleClass: 'btn-outline-danger ml-2',
      }
    ]

    this.columns = [
      {
        field: 'fleetId',
        header: 'Fleet',
        sortable: true,
        permission: { roles: ['Admin', 'PartnerAdmin'] },
        filter: [{
          type: MultiselectFilterComponent, permission: { roles: ['Admin', 'PartnerAdmin'] },
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
        field: 'zoneType',
        header: 'Type',
        sortable: true,
        type: TableColumnType.StaticImage,
        parsedFullData: (item) => {
          return 'assets/icons/' + (item.zoneType == ZoneType.Circular ? 'radius.svg' : 'polygon.svg')
        },
        filter: [{ name: 'ZoneType', type: SelectFilterComponent, styleClass: 'col-12 col-md-4', placeholder: 'Zone Type', options: asSelectItem(ZoneType) }],
      },
      {
        field: 'name',
        header: 'Name',
        sortable: true,
        filter: [{ name: 'Name', type: TextFilterComponent, styleClass: 'col-12 col-md-4', placeholder: 'Enter name' }],
      },
      {
        field: 'pointsCount',
        header: 'Point',
        sortable: false,
        filter: null,
      },
      {
        field: 'created',
        header: 'Created',
        type: TableColumnType.DateTime,
        sortable: true,
        filter: [{ name: 'Created', type: CalendarFilterComponent, styleClass: 'col-12 col-md-4', placeholder: 'Create Date' }],
      },
    ];
    this.mapsAPILoader.load().then(() => {
      this.managerOptions = {
        drawingControl: true,

        drawingControlOptions: {
          drawingModes: [google.maps.drawing.OverlayType.POLYGON, google.maps.drawing.OverlayType.POLYLINE, google.maps.drawing.OverlayType.CIRCLE, google.maps.drawing.OverlayType.RECTANGLE]
        },
        polygonOptions: {
          draggable: true,
          editable: true,
          geodesic: true,
          clickable: true
        },
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
      } as google.maps.drawing.DrawingManagerOptions;
    });
  }

  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<PartnerZone>> {
    return this.partnerZonesService.getAll(this.sidebarService.entity.id, evt).pipe(
      tap(res => {
        if (!!res?.data) {
          this.mapService.clearAllOverlays();
          this.mapService.draw(res.data, false);
          return res;
        }
      }))
  }
  public deleteEntity(item: PartnerZone): Observable<any> {
    return this.partnerZonesService.delete(this.sidebarService.entity.id, item.id);
  }

  public onRowHover(evt: { index: number, item: any, hoverMode: 'enter' | 'leave' }) {
    switch (evt?.hoverMode) {
      case 'enter':
        this.mapService.zoomTo(evt?.item as PartnerZone);
        break;
      case 'leave':
        this.mapService.resetZoom();
        break;
    }
  }

  onMapReady(map: any) {
    this.mapService.map = map;
  }

}
