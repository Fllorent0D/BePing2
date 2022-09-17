import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'beping-alert-full-page',
    templateUrl: './alert-full-page.component.html',
    styleUrls: ['./alert-full-page.component.css']
})
export class AlertFullPageComponent implements OnInit {

    @Input() title: string;
    @Input() message: string;
    @Input() icon = 'alert-outline';
    @Input() actionLabel: string;
    @Input() actionLabelIcon = 'chevron-forward-outline';
    @Input() actionLabelIconSlot = 'end';
    @Output() actionClicked: EventEmitter<void> = new EventEmitter<void>();

    constructor() {
    }

    ngOnInit(): void {
    }

}
