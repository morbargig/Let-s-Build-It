import { Input, Directive } from '@angular/core';
import { AvatarListItem, AvatarSize } from '../models/avatar';

@Directive()
export class AvatarList {
  @Input()
  avatars: AvatarListItem[];

  @Input()
  size: AvatarSize;

  @Input()
  display: number;

  @Input()
  showTooltip: boolean = true;

  get displayItems(): number {
    return this.display ? this.display : this.avatars.length;
  }

  get remainingItems(): number {
    return this.display ? this.avatars.length - this.display : 0;
  }
}
