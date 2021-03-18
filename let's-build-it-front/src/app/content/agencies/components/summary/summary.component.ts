import { Component, OnInit } from '@angular/core';
import { BreadcrumType } from '@app/blocks/navigations/breadcrum/breadcrum.component';
import { PartnerProfileService } from '../../partner-profile.service';
import { SideBarPageService } from '../../../../@shared/components/side-bar-page/isidibar-service.interface';

@Component({
  selector: 'prx-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {

  constructor(private sidebarService: SideBarPageService) {
    this.sidebarService.breadcrumbs = [
      { label: 'Agencies', url: '../../' },
      { label: this.sidebarService.entity.name, url: './' },
      { label: 'Summary', },
    ]
   }

  ngOnInit(): void {}

}
