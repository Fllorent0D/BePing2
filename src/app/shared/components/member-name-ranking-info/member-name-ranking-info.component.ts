import {Component, Input, OnInit} from '@angular/core';
import {MemberEntry} from '../../../core/api/models/member-entry';

@Component({
    selector: 'beping-member-name-ranking-info',
    templateUrl: './member-name-ranking-info.component.html',
    styleUrls: ['./member-name-ranking-info.component.scss']
})
export class MemberNameRankingInfoComponent implements OnInit {

    @Input() member: MemberEntry;

    constructor() {
    }

    ngOnInit() {
    }

}
