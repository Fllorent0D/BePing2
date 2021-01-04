import { Component, OnInit } from '@angular/core';
import { AdOptions, AdSize, AdPosition } from '@capacitor-community/admob';
import {Plugins} from '@capacitor/core';
const { AdMob } = Plugins;

@Component({
  selector: 'beping-team-result-ad-banner',
  templateUrl: './team-result-ad-banner.component.html',
  styleUrls: ['./team-result-ad-banner.component.scss'],
})
export class TeamResultAdBannerComponent {

  constructor() {
    // Show Banner Ad

  }
}
