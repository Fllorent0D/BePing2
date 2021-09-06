import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MemberResults} from '../../../../core/api/models/member-results';

@Component({
    selector: 'beping-team-players-stats',
    templateUrl: './team-players-stats.component.html',
    styleUrls: ['./team-players-stats.component.scss']
})
export class TeamPlayersStatsComponent {

    @Input() stats: MemberResults[] = [];
    @Output() playerClicked: EventEmitter<number> = new EventEmitter<number>();

}
