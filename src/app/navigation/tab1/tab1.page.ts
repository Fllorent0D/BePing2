import {Component, OnInit} from '@angular/core';
import {Plugins} from '@capacitor/core';

const {FirebaseAnalytics} = Plugins;

@Component({
  selector: 'beping-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  fav = true;
  constructor() {}
  ngOnInit() {
    FirebaseAnalytics.setScreenName({
      screenName: 'tab1',
    });
  }
}
