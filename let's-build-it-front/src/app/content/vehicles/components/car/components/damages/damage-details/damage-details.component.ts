import { Component, OnInit } from '@angular/core';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { CarModel } from '@app/@shared/models/car.model';
import { CarDamagesService } from '../car-damages.service';
import {
  CarDamageModel,
  DamagePositionType,
  DamageSideType,
  DamageType,
} from '../../../../../../../@shared/models/car-damage.model';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { CarDamageMediaModel } from '@app/@shared/models/car-damage-media.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { FullScreenModalComponent } from '@app/@shared/components/full-screen-modal/full-screen-modal.component';
import { DeleteModalComponent } from '@app/@shared/components/delete-modal/delete-modal.component';
import { SideBarPageService } from '../../../../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { DynamicFormControl } from '../../../../../../../@forms/@core/interfaces/dynamic-form-control';
import { DamageDetailsFormService } from './damage-details-form.service';
import { faExpand, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormGroup } from '@angular/forms';
import { CardComponent } from '../../../../../../../blocks/cards/card/card.component';
import { WsiCardComponent } from '../../../../../../../@shared/components/wsi-card/wsi-card.component';
import { ErrorMessages } from '../../../../../../../@shared/models/error-messages.model';

@Component({
  selector: 'prx-damage-details',
  templateUrl: './damage-details.component.html',
  styleUrls: ['./damage-details.component.scss'],
  providers: [DatePipe]
})
export class DamageDetailsComponent implements OnInit {

  public get car(): CarModel {
    return this.sideBarSevice.entity;
  }

  private mediaItems: SelectItem[];
  public get photos(): SelectItem[] {
    if (!this.mediaItems?.length) {
      this.mediaItems = this.carDamage?.damageMediaItems?.map((media, i) => {
        return {
          label: `Photo ${i + 1}`,
          value: media.mediaId,
        } as SelectItem;
      });
    }
    return this.mediaItems;
  }

  public mediaActions: SelectItem[] = [
    {
      label: 'Fullscreen',
      icon: faExpand,
      click: (val: any) => {
        this.openInFullscreen(val);
      },
      value: null,
    },
    { label: 'Remove', icon: faTrash, click: (val: any) => this.removeCarDamageMedia(this.car?.id, this.carDamage?.id, val), value: null },
  ];

  public carDamage: CarDamageModel;

  public generalInfoItems: SelectItem[] = null;
  public descriptionItem: SelectItem[] = null;
  public contractItems: SelectItem[] = null;
  public customerItems: SelectItem[] = null;

  public generalInfoControls: DynamicFormControl[];
  public generalInfoForm: FormGroup;

  constructor(
    private damageDetailsFormService: DamageDetailsFormService,
    private sideBarSevice: SideBarPageService,
    private route: ActivatedRoute,
    private date: DatePipe,
    private carDamagesService: CarDamagesService,
    private modalService: BsModalService,
    protected notificationsService: NotificationsService
  ) {
    // this.carDamagesService.get(this.car.id, parseInt(routeSnap.paramMap.get('damageId'))).toPromise()
    // .then(carDamage => this.carDamage = carDamage);

    this.route.params.pipe(take(1)).subscribe(params => {
      let dId = params['damageId'];
      this.carDamagesService
        .get(this.car.id, dId)
        .toPromise()
        .then((carDamage) => {
          this.carDamage = carDamage;
          this.sideBarSevice.breadcrumbs = [
            { label: 'Cars', url: '../../' },
            {
              label: `${this.sideBarSevice.entity.manufacturer} ${this.sideBarSevice.entity.model}
             ${this.sideBarSevice.entity.modelYear} | ${this.sideBarSevice.entity.plateNo} `, url: './'
            },
            {label: 'Damages', url: './damages'},
            { label: `Damage ${this.carDamage?.id}` },
          ];
          this.generalInfoItems = [
            { label: 'Id', value: this.carDamage?.id },
            { label: 'Date', value: this.date.transform(this.carDamage?.createDate, 'dd MMM hh:mm a') },
            { label: 'Type', value: DamageType[this.carDamage?.type] },
          ];
          this.descriptionItem = [
            { label: 'Description', value: this.carDamage?.additionalInfo },
          ];
          this.generalInfoControls = this.damageDetailsFormService.generate(carDamage);

          this.contractItems = [
            { label: 'Contract ID', value: '123214' },
            { label: 'Start Date', value: '12 Dec 11:12am' },
            { label: 'Contract State', value: 'Active' },
            { label: 'End Date', value: '-- --- --:--' },
          ];

          this.customerItems = [
            { label: 'Smith Alex', value: '', styleClass: 'bold' },
            { label: 'Age', value: '16 years old' },
            { label: 'alex@gmail.com', value: '' },
            { label: 'Status', value: 'Active' },
            { label: 'Last login', value: '25 Aug 3:32 pm' },
            { label: 'Subscription', value: 'Free' },
            { label: 'Phone', value: '+123456789' },
            { label: 'NFC Key', value: 'card 12345678' },


          ]
        });
    })


  }

  ngOnInit(): void { }

  public onSubmit(generalCard: WsiCardComponent): void {
    let generalInfoValues = this.generalInfoForm.getRawValue();
    let errorMessages: ErrorMessages = {
      200: `General Information of car damage number ${this.carDamage?.id} updated successfully`,
    }
    let entityName = "Car Damage"
    this.carDamagesService.updateGeneralInfo(this.car?.id, this.carDamage?.id, generalInfoValues,errorMessages,entityName).toPromise().then(
      res => {
        if (!!res) {
          this.carDamage.type = res.type;
          this.carDamage.additionalInfo = res.additionalInfo;
          generalCard.editMode = false;
          this.generalInfoItems = [
            { label: 'Id', value: this.carDamage?.id },
            { label: 'Date', value: this.date.transform(this.carDamage?.createDate, 'dd MMM hh:mm a') },
            { label: 'Type', value: DamageType[this.carDamage?.type] },
          ];
          this.descriptionItem = [
            { label: 'Description', value: this.carDamage?.additionalInfo },
          ];
        }
      }
    )
   }



  public getDamageTypeName(type: number) {
    return DamageType[type];
  }

  public getDamagePositionName(type: number) {
    return DamagePositionType[type];
  }

  public getDamageSideName(type: number) {
    return DamageSideType[type];
  }

  public changesDateFormat(type: Date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(type, 'short');
  }

  public openInFullscreen(mediaId: number) {
    ;
    const carDamageMediaFullScreen = this.modalService.show(FullScreenModalComponent, {
      initialState: { mediaItem: { mediaId: mediaId } },
      class: 'modal-xl modal-dialog-centered',
    });
  }

  public removeCarDamageMedia(carId: number, damageId: number, mediaId: number): void {
    const deleteCarDamageMediaMessage = this.modalService.show(DeleteModalComponent, {
      initialState: { id: mediaId },
      class: 'modal-md modal-dialog-centered',
    });
    (<DeleteModalComponent>deleteCarDamageMediaMessage.content).onClose.pipe(take(1)).subscribe((deleteIt) => {
      if (!!deleteIt) {
        this.carDamagesService.deleteDamageMedia(carId, damageId, mediaId).subscribe((res) => {
          this.notificationsService.success(`${!!mediaId ? mediaId : 'Item'} deleted successfully.`);
          let media = this.carDamage.damageMediaItems.find((i) => i.mediaId == mediaId);
          //TODO: fix reloading media 
          this.carDamage.damageMediaItems.splice(this.carDamage.damageMediaItems.indexOf(media), 1);
        });
      }
    });
  }
}
