import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../../@forms/@core/interfaces/field-config';
import { FormGroup, FormArray, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { BaseFieldDirective } from '../../../@forms/@core/directives/base-field.directive';
import { DynamicFormControl } from '../../../@forms/@core/interfaces/dynamic-form-control';
import { FormSelectComponent } from '../../../@forms/form-fields/form-select/form-select.component';
import { PartnerZonesService } from '../../agencies/components/zones/partner-zones.service';
import { LazyLoadEvent } from '../../../@ideo/components/table/events/lazy-load.event';
import { takeUntil, takeWhile, take, map } from 'rxjs/operators';
import { SelectItem } from '../../../@ideo/components/table/models/select-item';
import { BookingModel } from '../../../@shared/models/booking.model';
import { MAX_INT } from '../../../@ideo/components/table/table.component';
import { MapService } from '../../../@shared/services/map.service';
import { MapsAPILoader } from '@agm/core';
import { PartnerZone, ZonePoint, ZoneType } from '../../../@shared/models/partner-zone.model';
import { IconPipe } from '../../../@ideo/infrastructure/pipes/icon.pipe';

@Component({
  selector: 'prx-booking-location-form',
  templateUrl: './booking-location-form.component.html',
  styleUrls: ['./booking-location-form.component.scss'],
})
export class BookingLocationFormComponent extends BaseFieldDirective<FormArray> implements OnInit {
  public test: BookingModel = null;
  public config: FieldConfig;
  public evt: LazyLoadEvent = { page: 1, pageSize: 10 } as LazyLoadEvent;
  public controls: DynamicFormControl[];
  public group: FormGroup;
  public id: string;
  public zones: PartnerZone[];
  public pickUpPoint: PartnerZone;
  public dropOffPoint: PartnerZone;
  private get partnerId() {
    return this.config.data.partnerId;
  }

  public get selectedPoint(): PartnerZone[] {
    return [this.pickUpPoint, this.dropOffPoint].filter((i) => !!i);
  }
  constructor(
    private partnerZonesService: PartnerZonesService,
    private fb: FormBuilder,
    private mapService: MapService,
    private mapsAPILoader: MapsAPILoader,
    private iconPipe: IconPipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.partnerZonesService
      .getAll(this.partnerId, { page: 1, pageSize: MAX_INT } as LazyLoadEvent)
      .pipe(take(1))
      .subscribe((res) => {
        this.zones = res.data;
        this.setControls();
        this.group.controls[this.config.name] = this.fb.group(this.controls);
      });
  }

  setControls() {
    this.controls = [
      {
        type: FormSelectComponent,
        config: {
          name: 'pickUpZoneId',
          label: 'Pick-Up Zone',
          placeholder: 'Choose Pick-Up Zone',
          styleClass: 'col-12',
          // setter: this.pickUpPointSetter,
          onChange: (currentValue: number, control: AbstractControl) => {
            let config = null;
            this.mapService.clearAllOverlays();
            if (!!currentValue) {
              let zone = this.zones.filter((i) => i.id === currentValue)[0] as PartnerZone;
              zone.zoneType = ZoneType.Marker;
              this.pickUpPoint = zone;
              config = {
                iconUrl: this.iconPipe.transform('map-marker'),
                title: 'Pick-Up Zone',
                subTitle: zone.name,
              };
            } else {
              this.pickUpPoint = null;
            }
            this.mapService.draw(this.selectedPoint, null, config);
          },
          validation: [Validators.required],
          optionsArr: this.zones.map((i) => {
            return { label: i.name, value: i.id } as SelectItem;
          }),
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'dropOffZoneId',
          label: 'Drop Off Zone',
          placeholder: 'Choose Drop Off Zone',
          styleClass: 'col-12',
          // setter: this.dropOffPointSetter,
          onChange: (currentValue: number, control: AbstractControl) => {
            let config = null;
            this.mapService.clearAllOverlays();
            if (!!currentValue) {
              let zone = this.zones.filter((i) => i.id === currentValue)[0] as PartnerZone;
              zone.zoneType = ZoneType.Marker;
              this.dropOffPoint = zone;
              config = {
                iconUrl: this.iconPipe.transform('map-marker'),
                title: 'Drop Off Zone',
                subTitle: zone.name,
              };
            } else {
              this.dropOffPoint = null;
            }
            this.mapService.draw(this.selectedPoint, null, config);
          },
          validation: [Validators.required],
          optionsArr: this.zones.map((i) => {
            return { label: i.name, value: i.id } as SelectItem;
          }),
        },
      },
    ];
  }

  onMapReady(map: any) {
    this.mapService.map = map;
  }

  center(partnerZone: PartnerZone): ZonePoint {
    let zonePoints = partnerZone.points;
    let temp = {
      longitude: 0,
      latitude: 0,
    };
    zonePoints?.forEach((i) => {
      temp.latitude += i.latitude;
      temp.longitude += i.longitude;
    });
    temp.latitude /= zonePoints.length;
    temp.longitude /= zonePoints.length;
    return temp;
  }
}
