import {Component, OnInit, ViewChild} from '@angular/core';
import {IonRouterOutlet} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';

@Component({
  selector: 'beping-deep-link-base-component',
  templateUrl: './deep-link-base.component.html',
  styleUrls: ['./deep-link-base.component.css']
})
export class DeepLinkBaseComponent implements OnInit {

  @ViewChild('routerOutletElement') routerElement: IonRouterOutlet;

  constructor() { }

  ngOnInit(): void {

  }

}
