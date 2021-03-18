import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { BaseLayout } from '../../base/base-layout';

@Component({
  selector: 'prx-vertical-layout-default',
  templateUrl: './vertical-layout-default.component.html',
  styleUrls: ['./vertical-layout-default.component.scss'],
})
export class VerticalLayoutDefaultComponent extends BaseLayout implements OnInit {
  @HostBinding('class.fixed-sidenav')
  @Input()
  fixedSidenav: boolean;

  // This var controls the collapsed state of the quick side navigation, it starts collapsed
  @Input()
  sidenavCollapsed: boolean;

  @Input()
  mobileCollapsed: boolean;

  constructor() {
    super();
  }

  ngOnInit() {}

  /*
   * Handles the main side navigation toggled stated
   */
  onSidenavToggled(collapsed: boolean) {
    this.sidenavCollapsed = collapsed;
  }
}
