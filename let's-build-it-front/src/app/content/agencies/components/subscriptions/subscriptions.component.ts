import { Component, OnInit } from '@angular/core';
import { SideBarPageService } from '@app/@shared/components/side-bar-page/isidibar-service.interface';

@Component({
  selector: 'prx-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  constructor(private sidebarService: SideBarPageService,) {
    this.sidebarService.breadcrumbs = [
      { label: 'Agencies', url: '../../' },
      { label: this.sidebarService.entity.name, url: './' },
      { label: 'Subscriptions' },
    ];
  }

  ngOnInit(): void {}
}
