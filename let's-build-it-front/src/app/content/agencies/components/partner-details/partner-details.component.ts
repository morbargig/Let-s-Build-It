import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PartnerModel } from '../../../../@shared/models/partner.model';

@Component({
  selector: 'prx-partner-details',
  templateUrl: './partner-details.component.html',
  styleUrls: ['./partner-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerDetailsComponent implements OnInit {
  @Input() public partner: PartnerModel;

  constructor() {}

  ngOnInit(): void {}

  public changeDateFormat(type: Date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(type, 'mediumDate');
  }
}
