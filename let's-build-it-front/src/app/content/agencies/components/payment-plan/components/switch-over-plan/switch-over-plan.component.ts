import { Component, OnInit } from '@angular/core';
import { SelectItem } from '../../../../../../@ideo/components/table/models/select-item';

@Component({
  selector: 'prx-switch-over-plan',
  templateUrl: './switch-over-plan.component.html',
  styleUrls: ['./switch-over-plan.component.scss'],
})
export class SwitchOverPlanComponent implements OnInit {
  public trialItems: SelectItem[] = [{ label: 'Trial start date', value: '28 Jan 2020' }];

  public switchOverPeriodItem: SelectItem[] = [{ label: 'Billing Period', value: 'Month' }];

  public switchOverItem: SelectItem[] = [{ label: 'Switchover date', value: '23 Aug 2020' }];

  public switchOverNextItem: SelectItem[] = [{ label: 'Next payment', value: '23 Sep 2020' }];

  public switchOverDateItems: SelectItem[] = [
    { label: 'Last payment date', value: '28 Jan 2020' },
    { label: 'Last payment', value: '$5,532' },
  ];

  public switchOverAmountItem: SelectItem[] = [{ label: 'Payment amount', value: '$5,532' }];

  public switchOverFirstItem: SelectItem[] = [{ label: 'First payment', value: 'Today, 23 Aug 2020' }];

  public get partialSwitchOverItems(): SelectItem[] {
    return [...this.switchOverPeriodItem, ...this.switchOverItem, ...this.switchOverNextItem];
  }
  public get allSwitchOverItems(): SelectItem[] {
    return [
      ...this.switchOverPeriodItem,
      ...this.switchOverDateItems,
      ...this.switchOverNextItem,
      ...this.switchOverItem,
    ];
  }

  public get firstSwitchOverItems(): SelectItem[] {
    return [
      ...this.switchOverPeriodItem,
      ...this.switchOverAmountItem,
      ...this.switchOverItem,
      ...this.switchOverFirstItem,
    ];
  }

  constructor() {}

  ngOnInit(): void {}
}
