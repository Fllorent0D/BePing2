import {Component, OnInit} from '@angular/core';
import {Plugins} from '@capacitor/core';

const {FirebaseAnalytics} = Plugins;

@Component({
  selector: 'beping-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  constructor() {}
  ngOnInit() {
    FirebaseAnalytics.setScreenName({
      screenName: 'tab3'
    });
  }
}
