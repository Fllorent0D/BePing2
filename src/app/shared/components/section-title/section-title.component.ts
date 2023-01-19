import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'beping-section-title',
    templateUrl: './section-title.component.html',
    styleUrls: ['./section-title.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SectionTitleComponent {

    @Input() title = '';
    @Input() note: string;
    @Output() noteClicked = new EventEmitter<void>();
}
