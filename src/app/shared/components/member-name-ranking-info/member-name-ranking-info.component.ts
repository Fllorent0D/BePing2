import {Component, Input} from '@angular/core';
import {MemberEntry} from '../../../core/api/models/member-entry';
import {Platform} from '@ionic/angular';
import {RankingMethodName, RankingService} from '../../../core/services/tabt/ranking.service';

@Component({
    selector: 'beping-member-name-ranking-info',
    templateUrl: './member-name-ranking-info.component.html',
    styleUrls: ['./member-name-ranking-info.component.scss']
})
export class MemberNameRankingInfoComponent {

    @Input() member: MemberEntry;
    @Input() displayName = true;
    @Input() displayELO = false;
    @Input() displayNumericRanking = false;

    constructor(
        public platform: Platform,
        private readonly rankingService: RankingService
    ) {
    }

    get elo(): number {
        return this.rankingService.getPoints(this.member.RankingPointsEntries, RankingMethodName.ELO);
    }

    get nextRanking(): string {
        const pts = this.rankingService.getPoints(this.member.RankingPointsEntries, RankingMethodName.BEL_POINTS);
        const position = this.rankingService.getPoints(this.member.RankingPointsEntries, RankingMethodName.BEL_RANKING);
        return this.rankingService.getEquivalentRanking(pts, position);
    }

    get bel(): number {
        return this.rankingService.getPoints(this.member.RankingPointsEntries, RankingMethodName.BEL_POINTS);
    }

    get belRanking(): number {
        return this.rankingService.getPoints(this.member.RankingPointsEntries, RankingMethodName.BEL_RANKING);
    }
}
