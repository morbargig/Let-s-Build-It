import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SelectItem } from '../../../../@ideo/components/table/models/select-item';

@Component({
  selector: 'prx-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityDetailsComponent implements OnInit {
  constructor() {}

  @Input() public details: EntityDetailsModel;

  ngOnInit(): void {}
}

export interface EntityDetailsModel {
  mediaId?: number;
  title?: string;
  titleSpan?: string;
  subTitle?: string | string[];
  bottomValues: SelectItem[];
  rightValues: SelectItem[];
}
