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
    @Input() displayName = true;

    nextRanking: string;
    elo: string;

    constructor(
        public platform: Platform,
        private readonly rankingService: RankingService
    ) {
    }

    ngOnInit() {
        this.nextRanking = this.rankingService.getNextRanking(this.member.RankingPointsEntries);
        this.elo = this.rankingService.getELOPoints(this.member.RankingPointsEntries);
    }
}
