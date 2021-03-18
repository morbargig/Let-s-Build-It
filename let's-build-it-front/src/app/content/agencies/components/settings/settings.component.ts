import { Component, OnInit } from '@angular/core';
import { PartnerProfileService } from '../../partner-profile.service';

@Component({
  selector: 'prx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(private partnerProfile: PartnerProfileService) {
    this.partnerProfile.breadcrumbs = [
      { label: 'Agencies', url: '../../' },
      { label: this.partnerProfile.partner.name, url: './' },
      { label: 'Settings' },
    ];
  }

  ngOnInit(): void {}
}
