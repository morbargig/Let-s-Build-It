import { Component, OnInit, Input } from '@angular/core';
import { SizeProp, BaseComponent, ColorScheme, ThemeColor } from '@core';

@Component({
  selector: 'prx-progress-solid',
  templateUrl: './progress-solid.component.html',
  styleUrls: ['./progress-solid.component.scss'],
})
export class ProgressSolidComponent extends BaseComponent implements OnInit {
  @Input()
  value: number | any[];

  @Input()
  size: SizeProp = SizeProp.sm;

  @Input()
  label: string;

  @Input()
  labelClass: string;

  @Input()
  color: ColorScheme;

  @Input()
  suffix: string;

  @Input()
  max: number = 100;

  constructor() {
    super();
  }

  ngOnInit() {}
}
