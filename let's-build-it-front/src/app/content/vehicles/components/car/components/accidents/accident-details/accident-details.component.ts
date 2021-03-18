import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarModel } from '@app/@shared/models/car.model';
import { CarProfileService } from '../../../car-profile.service';
import { AccidentsService } from '../accidents.service';
import { CarAccidentModel, AccidentType } from '../../../../../../../@shared/models/car-accident.model';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { DatePipe } from '@angular/common';
import { AccidentMediaType } from '@app/@shared/models/car-accident-media.model';
import { CarAccidentMediaModel } from '../../../../../../../@shared/models/car-accident-media.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { FullScreenModalComponent } from '@app/@shared/components/full-screen-modal/full-screen-modal.component';
import { DeleteModalComponent } from '@app/@shared/components/delete-modal/delete-modal.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'prx-accident-details',
  templateUrl: './accident-details.component.html',
  styleUrls: ['./accident-details.component.scss'],
})
export class AccidentDetailsComponent implements OnInit {
  public dropdownActions: SelectItem[] = [
    { label: 'Report Damage', value: 'Damage-Report' },
    { label: 'Report accident', value: 'Accident-Report' },
  ];

  public get car(): CarModel {
    return this.carProfile.car;
  }

  public accident: CarAccidentModel;

  public getAccidentTypeName(type: number) {
    return AccidentType[type];
  }

  public getMediaTypeName(type: number) {
    return AccidentMediaType[type];
  }

  constructor(
    private carProfile: CarProfileService,
    private route: ActivatedRoute,
    private accidentsService: AccidentsService,
    private modalService: BsModalService,
    protected notificationsService: NotificationsService
  ) {
    let accident = this.route.snapshot.params['accidentId'];
    this.accidentsService
      .get(this.car.id, accident)
      .toPromise()
      .then((carAccident) => {
        this.accident = carAccident;
      });
  }

  ngOnInit(): void {}

  public changesDateFormat(type: Date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(type, 'short');
  }

  public openInFullscreen(mediaItem: CarAccidentMediaModel) {
    const AccidentMediaFullScreen = this.modalService.show(FullScreenModalComponent, {
      initialState: { mediaItem: mediaItem },
      class: 'modal-xl modal-dialog-centered',
    });
  }

  public removeCarAccidentMedia(carId: number, accidentId: number, mediaId: number): void {
    const deleteCarAccidentMediaMessage = this.modalService.show(DeleteModalComponent, {
      initialState: { id: mediaId },
      class: 'modal-md modal-dialog-centered',
    });
    (<DeleteModalComponent>deleteCarAccidentMediaMessage.content).onClose.pipe(take(1)).subscribe((deleteIt) => {
      if (!!deleteIt) {
        this.accidentsService.deleteAccidentMedia(carId, accidentId, mediaId).subscribe((res) => {
          this.notificationsService.success(`${!!mediaId ? mediaId : 'Item'} deleted successfully.`);
          let media = this.accident.accidentMediaItems.find((i) => i.mediaId == mediaId);
          this.accident.accidentMediaItems.splice(this.accident.accidentMediaItems.indexOf(media), 1);
        });
      }
    });
  }
}
