import {Component, Input} from '@angular/core';
import {MemberEntry} from '../../../core/api/models/member-entry';
import {Platform} from '@ionic/angular';
import {RankingMethodName, RankingService} from '../../../core/services/tabt/ranking.service';
import {PLAYER_CATEGORY} from '../../../core/models/user';
import { UserMemberEntry } from 'src/app/core/store/user/user.state';
import { WeeklyNumericRanking } from 'src/app/core/api/models';

@Component({
    selector: 'beping-member-name-ranking-info',
    templateUrl: './member-name-ranking-info.component.html',
    styleUrls: ['./member-name-ranking-info.component.scss']
})
export class MemberNameRankingInfoComponent {

    @Input() member: UserMemberEntry;
    @Input() displayName = true;
    @Input() displayELO = false;
    @Input() displayNumericRanking = false;
    @Input() category: PLAYER_CATEGORY;
    @Input() numericRanking: WeeklyNumericRanking[];

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
        return this.rankingService.getEquivalentRanking(pts, position, this.category);
    }

    get bel(): number | null {
        return Math.round(this.numericRanking?.[this.numericRanking.length - 1]?.bel) ?? null;
    }

    get belRanking(): number {
        return this.rankingService.getPoints(this.member.RankingPointsEntries, RankingMethodName.BEL_RANKING);
    }
}
