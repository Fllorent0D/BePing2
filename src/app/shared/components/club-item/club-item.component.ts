import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ClubEntry} from '../../../core/api/models/club-entry';

@Component({
    selector: 'beping-club-item',
    templateUrl: './club-item.component.html',
    styleUrls: ['./club-item.component.scss']
})
export class ClubItemComponent implements OnInit {

    @Input() club: ClubEntry;
    @Input() detail: boolean;
    @Output() clubClicked: EventEmitter<ClubEntry> = new EventEmitter<ClubEntry>();

    constructor() {
    }

    ngOnInit() {
    }

}
