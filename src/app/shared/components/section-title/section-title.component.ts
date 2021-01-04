import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'beping-section-title',
    templateUrl: './section-title.component.html',
    styleUrls: ['./section-title.component.scss']
})
export class SectionTitleComponent implements OnInit {

    @Input() title = '';

    constructor() {
    }

    ngOnInit() {
    }

}
