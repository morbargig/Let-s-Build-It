import { Component, Input, OnInit } from '@angular/core';
import { ButtonItem } from '../../core/models/button-item';

@Component({
  selector: 'ideo-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() button: ButtonItem;
  @Input() item: any;
  @Input() disabled?: boolean;
  public sizeClass: string = '';
  public defaultClass: string = `btn-primary`;
  public get iconClass(): string | false {
    if (!this.button?.icon) {
      return '';
    } else if (typeof this.button?.icon !== 'string') {
      return this.button.icon.prefix + ' fa-' + this.button.icon.iconName;
    }
    return this.button?.icon;
  }

  @Input() public set size(val: 'large' | 'default' | 'small') {
    switch (val) {
      case 'large':
        this.sizeClass = ' btn-lg';
        break;
      case 'small':
        this.sizeClass = ' btn-sm';
        break;
      default:
        break;
    }
  }

  constructor() {}

  ngOnInit(): void {}
}
