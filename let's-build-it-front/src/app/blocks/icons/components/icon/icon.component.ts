import { Component, OnInit, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { BaseComponent } from '@core';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { IconModel } from '../../../../@shared/models/icon.model';
import { IdeoIconModel } from '../../../../@shared/models/ideo-icon.model';

@Component({
  selector: 'prx-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent extends BaseComponent implements OnInit {
  @Input()
  icon: IconDefinition | string;

  @Input()
  size: SizeProp | 'md';

  get useFontAwesome(): boolean {
    return this.isFontAwesome(this.icon);
  }

  get iconStr(): string {
    return this.icon as string;
  }

  get ideoIcon(): string {
    return IconComponent.ideoIconModel[this.iconStr];
  }

  static ideoIconModel = new IdeoIconModel();

  get useIdeo(): boolean {
    return Object.keys(IconComponent.ideoIconModel)?.some((x) => x === this.icon);
  }

  constructor() {
    super();
  }

  ngOnInit() {}

  isFontAwesome(icon: IconDefinition | string): icon is IconDefinition {
    return !!icon && !!(icon as IconDefinition)?.prefix;
  }
}
