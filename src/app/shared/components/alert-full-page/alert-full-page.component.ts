import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'beping-alert-full-page',
    templateUrl: './alert-full-page.component.html',
    styleUrls: ['./alert-full-page.component.css']
})
export class AlertFullPageComponent implements OnInit {

    @Input() title: string;
    @Input() message: string;
    @Input() icon = 'alert-outline';

    constructor() {
    }

    ngOnInit(): void {
    }

}
