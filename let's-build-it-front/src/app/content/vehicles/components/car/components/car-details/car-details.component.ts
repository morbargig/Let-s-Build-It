import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FuelType } from '@app/@shared/interfaces/fuel-type.enum';
import { TransmissionType } from '@app/@shared/interfaces/transmission-type.enum';
import { CarModel } from '@app/@shared/models/car.model';
import { from } from 'rxjs';

@Component({
  selector: 'prx-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarDetailsComponent implements OnInit {
  constructor() {}

  @Input() public styleCss: string = 'col-9';
  ngOnInit(): void {}

  @Input() public car: CarModel;

  public getFuelTypeName(type: number) {
    return FuelType[type];
  }

  public getTransmissionTypeName(type: number) {
    return TransmissionType[type];
  }
}
