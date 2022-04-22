import { Component, OnInit } from '@angular/core';
import {InAppBrowserService} from '../../../../core/services/browser/in-app-browser.service';

@Component({
  selector: 'beping-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.css']
})
export class ContributorsComponent implements OnInit {

  constructor(
      private readonly inAppBrowser: InAppBrowserService
  ) { }

  ngOnInit(): void {
  }

    openGithub(url: string) {
        this.inAppBrowser.openInAppBrowser(url);
    }
}
