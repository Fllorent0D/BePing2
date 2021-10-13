import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'beping-card',
    templateUrl: './beping-card.component.html',
    styleUrls: ['./beping-card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BepingCardComponent implements OnInit {
    @Input() padding = true;
    @Input() marging = true;
    @Input() margingVertical = true;
    @Input() highlighted = false;

    constructor() {
    }

    ngOnInit() {
    }

}
