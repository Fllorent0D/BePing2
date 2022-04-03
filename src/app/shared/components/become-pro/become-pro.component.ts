import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'beping-become-pro',
    templateUrl: './become-pro.component.html',
    styleUrls: ['./become-pro.component.css']
})
export class BecomeProComponent implements OnInit {

    @Output() dismiss = new EventEmitter();
    @Output() openPro = new EventEmitter();

    constructor() {
    }

    ngOnInit(): void {
    }

    dismissClicked(event: Event) {
        event.stopImmediatePropagation();
        this.dismiss.emit();
    }


}
