import { Component, OnInit } from '@angular/core';
import { CarModel } from '@app/@shared/models/car.model';
import { CarProfileService } from '../../car-profile.service';
import { InventoryType } from '@app/@shared/interfaces/inventory-type.enum';
import { CarMediaType, CarMedia } from '../../../../../../@shared/models/car.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FullScreenModalComponent } from '../../../../../../@shared/components/full-screen-modal/full-screen-modal.component';
import { CarsService } from '@app/content/vehicles/services/cars.service';
import { DeleteModalComponent } from '@app/@shared/components/delete-modal/delete-modal.component';
import { take } from 'rxjs/operators';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { TransmissionType } from '../../../../../../@shared/interfaces/transmission-type.enum';
import { FuelType } from '@app/@shared/interfaces/fuel-type.enum';
import { SideBarPageService } from '@app/@shared/components/side-bar-page/isidibar-service.interface';
import { SelectItem } from '../../../../../../@ideo/components/table/models/select-item';
import { faExpand, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'prx-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  constructor(
    private carsService: CarsService,
    private sidebarPageService: SideBarPageService,
    private modalService: BsModalService,
    protected notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.sidebarPageService.breadcrumbs = [
      {
        label: `Vehicles`,
        url: '../../',
      },
      {
        label: `${this.car.manufacturer} ${this.car.model} ${this.car.modelYear} | ${this.car.plateNo}`,
        url: './',
      },
      { label: 'General' },
    ];
  }

  public vehicleIdsItems: SelectItem[] = [
    { label: 'VIN', value: this.car.vin },
    { label: 'Plate number', value: this.car.plateNo },
    { label: 'Code number', value: `${this.car.manufacturerCode}-${this.car.modelCode}` },
  ];

  public hardwareItems: SelectItem[] = [
    ...this.car.inventories.map((i) => {
      return {
        label: this.getInventoryName(i.inventoryType),
        value: i.externalId,
      } as SelectItem;
    }),
    { label: 'Last comm', value: null },
    { label: 'Last Gps', value: null },
    { label: 'Last fuel level', value: null },
    { label: 'Last odometer', value: null },
  ];

  public statusItems: SelectItem[] = [
    { label: 'Status', value: null },
    { label: 'Mileage', value: null },
    { label: 'Fuel', value: this.getFuelTypeName(this.car.fuelType) },
    { label: 'Battery', value: null },
  ];

  public carOwnerItems: SelectItem[] = [
    { label: 'Name', value: null },
    { label: 'Email', value: null },
    { label: 'Last login', value: null },
    { label: 'Phone', value: null },
    { label: 'Added', value: null },
    { label: 'Vehicles', value: null },
  ];

  public docActions: SelectItem[] = [
    {
      label: 'Fullscreen',
      icon: faExpand,
      click: (val: any) => this.openInFullscreen({ mediaId: val, carMediaType: CarMediaType.Front }),
      value: null,
    },
    { label: 'Remove', icon: faTrash, click: (val: any) => null, value: null },
  ];

  private mediaItems: SelectItem[];
  public get docs(): SelectItem[] {
    if (!this.mediaItems?.length) {
      this.mediaItems = this.car.mediaItems?.map((media) => {
        return {
          label: this.getMediaTypeName(media.carMediaType),
          value: media.mediaId,
        } as SelectItem;
      });
    }
    return this.mediaItems;
  }

  public get car(): CarModel {
    return this.sidebarPageService.entity;
  }

  public getFuelTypeName(type: number) {
    return FuelType[type];
  }

  public getTransmissionTypeName(type: number) {
    return TransmissionType[type];
  }

  public getCsmType() {
    return this.car.csmType;
  }

  public getInventoryName(type: number) {
    return InventoryType[type];
  }

  public getMediaTypeName(type: number) {
    return CarMediaType[type];
  }

  public openInFullscreen(mediaItem: CarMedia) {
    let name: string = this.mediaItems.find((x) => x.value == mediaItem.mediaId)?.label;
    const carMediaFullScreen = this.modalService.show(FullScreenModalComponent, {
      initialState: { mediaItem: mediaItem, title: name },
      class: 'modal-xl modal-dialog-centered',
    });
  }

  // public removeCarMedia(carId: number, mediaId: number) {
  //   return this.carsService.deleteCarMedia(carId, mediaId).toPromise().then(res => {
  //     let mediaItem = this.carProfile.car.mediaItems.find(i => i.mediaId == mediaId);
  //     this.carProfile.car.mediaItems.splice(this.carProfile.car.mediaItems.indexOf(mediaItem), 1);
  //   });
  // }

  public removeCarMedia(carId: number, mediaItem: CarMedia, mediaId: number): void {
    const deleteCarMediaMessage = this.modalService.show(DeleteModalComponent, {
      initialState: { id: mediaId, name: mediaItem.carMediaType[mediaItem.carMediaType] },
      class: 'modal-md modal-dialog-centered',
    });
    (<DeleteModalComponent>deleteCarMediaMessage.content).onClose.pipe(take(1)).subscribe((deleteIt) => {
      if (!!deleteIt) {
        this.carsService.deleteCarMedia(carId, mediaId).subscribe((res) => {
          this.notificationsService.success(
            `${
              !!mediaItem.carMediaType[mediaItem.carMediaType] ? mediaItem.carMediaType[mediaItem.carMediaType] : 'Item'
            } deleted successfully.`
          );
          let media = this.sidebarPageService.entity.mediaItems.find((i: any) => i.mediaId == mediaId);
          this.sidebarPageService.entity.mediaItems.splice(this.sidebarPageService.entity.mediaItems.indexOf(media), 1);
        });
      }
    });
  }
}
