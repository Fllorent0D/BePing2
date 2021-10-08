import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'beping-modal-base',
    templateUrl: './modal-base.component.html',
    styleUrls: ['./modal-base.component.scss']
})
export class ModalBaseComponent implements OnInit {
    rootPage: any;

    constructor() {
    }

    ngOnInit() {
        console.log('init');
    }
}
