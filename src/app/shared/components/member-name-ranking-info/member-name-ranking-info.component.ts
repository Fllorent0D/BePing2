import {Component, Input, OnInit} from '@angular/core';
import {Platform} from '@ionic/angular';
import {RankingMethodName, RankingService} from '../../../core/services/tabt/ranking.service';
import {PLAYER_CATEGORY} from '../../../core/models/user';
import {UserMemberEntry} from 'src/app/core/store/user/user.state';
import {WeeklyNumericPointsV3} from 'src/app/core/api/models';

@Component({
    selector: 'beping-member-name-ranking-info',
    templateUrl: './member-name-ranking-info.component.html',
    styleUrls: ['./member-name-ranking-info.component.scss']
})
export class MemberNameRankingInfoComponent{

    @Input() member: UserMemberEntry;
    @Input() displayName = true;
    @Input() displayELO = false;
    @Input() displayNumericRanking = false;
    @Input() category: PLAYER_CATEGORY;
    @Input() numericRanking: number;

    constructor(
        public platform: Platform,
        private readonly rankingService: RankingService
    ) {
    }

    get elo(): number {
        return this.rankingService.getPoints(this.member.RankingPointsEntries, RankingMethodName.ELO);
    }

    get nextRanking(): string {
        const pts = this.bel;
        const position = this.belRanking;
        if(pts){
            return this.rankingService.getEquivalentRanking(pts as number, position, this.category);
        }
        return '';
    }

    get bel(): number | string {
        return this.numericRanking ?? '?';
    }

    get belRanking(): number {
        return this.rankingService.getPoints(this.member.RankingPointsEntries, RankingMethodName.BEL_RANKING);
    }
}
