import { MapsAPILoader } from '@agm/core';
import { Component, OnInit, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { PartnerZone, ZonePoint, ZoneType } from '../../../../../@shared/models/partner-zone.model';
import { FormGroup, Validators, FormArray } from '@angular/forms';
import { DynamicFormControl } from '../../../../../@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from '../../../../../@forms/form-fields/form-text/form-text.component';
import { ZoneTypeFormComponent } from './zone-type-form/zone-type-form.component';
import { asSelectItem } from '../../../../../prototypes';
import { ZoneTypeField } from './zone-type-form/zone-type.field';
import { FormTableComponent } from '../../../../../@forms/form-fields/form-table/form-table.component';
import { SideBarPageService } from '../../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { FormSubTextComponent } from '../../../../../@forms/form-fields/form-sub-text/form-sub-text.component';
import { Subject } from 'rxjs';
import { PartnerZonesService } from '../partner-zones.service';
import { NotificationsService } from '../../../../../@ideo/components/notifications/notifications.service';
import { FormArrayComponent } from '../../../../../@forms/form-fields/form-array/form-array.component';
import { FormArrayData } from '../../../../../@forms/form-fields/form-array/form-array';
import { FieldEvent } from '../../../../../@forms/@core/interfaces/events';
import { MapService } from '../../../../../@shared/services/map.service';

@Component({
  selector: 'prx-zone-details',
  templateUrl: './zone-details.component.html',
  styleUrls: ['./zone-details.component.scss'],
  providers: [MapService],
})
export class ZoneDetailsComponent implements OnInit, OnDestroy {
  private pointsSetter: Subject<FieldEvent> = new Subject<FieldEvent>();
  private endded: EventEmitter<boolean> = new EventEmitter<boolean>();
  private selectedVehiclesCount: Subject<string> = new Subject<string>();

  public form: FormGroup = {} as FormGroup;
  public zone: PartnerZone = null;
  public editMode: boolean = false;

  public formControls: DynamicFormControl[] = null;

  constructor(
    private sidebarService: SideBarPageService,
    private route: ActivatedRoute,
    private router: Router,
    private mapService: MapService,
    private notificationsService: NotificationsService,
    private partnerZonesService: PartnerZonesService
  ) {}
  ngOnDestroy(): void {
    this.endded.next(true);
  }

  ngOnInit(): void {
    this.sidebarService.setDetailsVisibility(false);
    this.mapService.overlayCompleted.pipe(takeUntil(this.endded)).subscribe((points) => {
      this.pointsSetter.next({ type: 'onPatchValue', value: points });
    });
  }

  onMapReady(map: any) {
    this.mapService.map = map;

    this.mapService.zoneEdited.pipe(takeUntil(this.endded)).subscribe((zone) => {
      this.zone = zone;
      this.pointsSetter.next({ type: 'onPatchValue', value: [...this.zone.points] });
    });
    this.route.params.pipe(take(1)).subscribe((params) => {
      this.sidebarService.breadcrumbs = [
        { label: 'Agencies', url: '../../' },
        { label: this.sidebarService.entity.name, url: './' },
        { label: 'Zones', url: './zones' },
      ];

      const inputDisabler: Subject<boolean> = new Subject<boolean>();
      const radiusSetter: Subject<FieldEvent> = new Subject<FieldEvent>();
      if (this.zone?.zoneType == ZoneType.Polygon) {
        setTimeout(() => {
          inputDisabler.next(true);
        });
      }
      let formControls: DynamicFormControl[] = [
        {
          type: FormTextComponent,
          config: {
            name: 'name',
            type: 'text',
            label: 'Name',
            styleClass: 'col-12',
            value: this.zone?.name,
            validation: [Validators.required],
            errorMessages: {
              required: 'Name is required.',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'station',
            label: 'Station',
            styleClass: 'col-12',
            value: null,
            // validation: [Validators.required],
            errorMessages: {
              required: 'Station is required.',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            type: 'hidden',
            value: this.sidebarService.entity.id,
            name: 'partnerId',
          },
        },
        {
          type: ZoneTypeFormComponent,
          config: {
            name: 'zoneType',
            label: 'Zone Drawing',
            styleClass: 'col-12',
            value: this.zone?.zoneType,
            optionsArr: asSelectItem(ZoneType),
            onChange: (
              evt: { action: 'setDrawingMode' | 'setAddress' | 'undoPoint' | 'clearPoints'; data: any },
              ctrl
            ) => {
              switch (evt.action) {
                case 'setDrawingMode':
                  this.mapService.setDrawingMode(evt.data);
                  break;
                case 'clearPoints':
                  this.mapService.clearAllOverlays();
                  break;
                case 'setAddress':
                  // this.setDrawingMode(evt.data);
                  break;
              }

              if (this.zone?.zoneType != ctrl.value) {
                this.mapService.clearAllOverlays();
                this.pointsSetter.next({ type: 'onPatchValue', value: [] });
              }

              if (ctrl.value == ZoneType.Circular) {
                radiusSetter.next({ type: 'setVisibility', value: true });
              } else {
                radiusSetter.next({ type: 'setVisibility', value: false });
              }
            },
            validation: [Validators.required],
            errorMessages: {
              required: 'Zone Drawing is required.',
            },
          },
        },
        {
          type: FormArrayComponent,
          config: {
            name: 'points',
            label: 'Points',
            // type: 'hidden',
            value: this.zone?.points,
            styleClass: 'col-12',
            setter: this.pointsSetter,
            validation: [
              Validators.required,
              (ctrl: FormArray) => {
                return !ctrl.value?.length
                  ? {
                      points: 'you must select points.',
                    }
                  : null;
              },
            ],
            data: {
              data: this.zone?.points,
              formConfig: [
                {
                  type: FormTextComponent,
                  config: {
                    name: 'longitude',
                    label: 'Longitude',
                    inputStyleClass: 'form-control-sm',
                    type: 'number',
                    disabled: this.zone?.zoneType == ZoneType.Polygon,
                    disabled$: inputDisabler,
                    validation: [Validators.required],
                  },
                },
                {
                  type: FormTextComponent,
                  config: {
                    name: 'latitude',
                    label: 'Latitude',
                    inputStyleClass: 'form-control-sm',
                    type: 'number',
                    disabled: this.zone?.zoneType == ZoneType.Polygon,
                    disabled$: inputDisabler,
                    validation: [Validators.required],
                  },
                },
                {
                  type: FormTextComponent,
                  config: {
                    name: 'radius',
                    label: 'Radius',
                    type: 'number',
                    inputStyleClass: 'form-control-sm',
                    setter: radiusSetter,
                  },
                },
              ],
            } as FormArrayData,
            errorMessages: {
              required: 'Station is required.',
            },
          },
        },
        {
          type: FormSubTextComponent,
          config: {
            name: 'selectedCars',
            label: 'Selected Cars',
            data: {
              text: '0 Zone Vehicles',
              text$: this.selectedVehiclesCount,
            },
          },
        },
      ];

      if ('id' in params) {
        let id = params.id;
        this.partnerZonesService
          .get(this.sidebarService.entity.id, id)
          .pipe(take(1))
          .subscribe((res) => {
            if (!!res) {
              this.editMode = true;
              this.zone = res;
              formControls.patchValue(this.zone);
              this.formControls = formControls;
              this.sidebarService.breadcrumbs.push({ label: this.zone.name });
              switch (this.zone?.zoneType) {
                case ZoneType.Circular:
                  this.mapService.drawCircleByPoint(this.zone);
                  break;
                case ZoneType.Polygon:
                  this.mapService.drawPolygonByPoints(this.zone);
                  break;
              }
            }
          });
      } else {
        this.sidebarService.breadcrumbs.push({ label: 'Create' });
        this.formControls = formControls;
      }
    });
  }

  public patch(formVal: PartnerZone) {
    if (!this.editMode) {
      this.partnerZonesService
        .create(this.sidebarService.entity.id, formVal)
        .toPromise()
        .then((res) => {
          if (!!res) {
            this.notificationsService.success('Zone created successfully.');
            this.router.navigate(['../'], { relativeTo: this.route });
          } else {
            this.notificationsService.error('Zone creation faield.');
          }
        });
    } else {
      this.partnerZonesService
        .update(this.sidebarService.entity.id, this.zone.id, formVal)
        .toPromise()
        .then((res) => {
          if (!!res) {
            this.notificationsService.success('Zone updated successfully.');
            this.router.navigate(['../../'], { relativeTo: this.route });
          } else {
            this.notificationsService.error('Zone update faield.');
          }
        });
    }
  }
}
