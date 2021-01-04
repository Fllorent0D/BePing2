import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {createAnimation, Animation, IonIcon} from '@ionic/angular';

@Component({
    selector: 'beping-loading-btn',
    templateUrl: './loading-btn.component.html',
    styleUrls: ['./loading-btn.component.scss']
})
export class LoadingBtnComponent {
    @Input() loading = false;
}

