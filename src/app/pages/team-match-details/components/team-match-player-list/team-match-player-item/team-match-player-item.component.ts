import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Player} from '../../../../../core/api/models/player';

@Component({
    selector: 'beping-team-match-player-item',
    templateUrl: './team-match-player-item.component.html',
    styleUrls: ['./team-match-player-item.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TeamMatchPlayerItemComponent implements OnInit {

    @Input() player: Player;
    @Output() playerClicked: EventEmitter<void> = new EventEmitter<void>();

    constructor() {
    }

    ngOnInit() {
    }

}
