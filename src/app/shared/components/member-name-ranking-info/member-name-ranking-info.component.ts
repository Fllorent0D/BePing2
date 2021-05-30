import {Component, Input, OnInit} from '@angular/core';
import {MemberEntry} from '../../../core/api/models/member-entry';
import {Platform} from '@ionic/angular';
import {RankingService} from '../../../core/services/tabt/ranking.service';

@Component({
    selector: 'beping-member-name-ranking-info',
    templateUrl: './member-name-ranking-info.component.html',
    styleUrls: ['./member-name-ranking-info.component.scss']
})
export class MemberNameRankingInfoComponent implements OnInit {

    @Input() member: MemberEntry;

    constructor(
        public platform: Platform,
        private readonly rankingService: RankingService
    ) {
    }

    ngOnInit() {
    }


    get elo() {
        return this.rankingService.getELOPoints(this.member.RankingPointsEntries);
    }

    get nextRanking() {
        return this.rankingService.getNextRanking(this.member.RankingPointsEntries);
    }

}
