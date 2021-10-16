import {Component, Input, OnInit} from '@angular/core';
import {IndividualMatchResult} from '../../../../../core/api/models/individual-match-result';
import {Player} from '../../../../../core/api/models/player';
import {RankingService} from '../../../../../core/services/tabt/ranking.service';

@Component({
    selector: 'beping-team-match-individual-match',
    templateUrl: './individual-match.component.html',
    styleUrls: ['./individual-match.component.scss']
})
export class TeamMatchIndividualMatchComponent implements OnInit {
    @Input() individualMatch: IndividualMatchResult;
    @Input() homePlayer: Player[];
    @Input() awayPlayer: Player[];

    constructor() {
    }

    ngOnInit() {
        console.log(this.homePlayer);
    }

    isHomePerf(): boolean {
        if (this.individualMatch.HomeSetCount < this.individualMatch.AwaySetCount) {
            return false;
        }
        const pos = this.individualMatch.Position;
        const awayPlayer = this.awayPlayer.find((player) => player.UniqueIndex === this.individualMatch.AwayPlayerUniqueIndex[0]);
        const homePlayer = this.homePlayer.find((player) => player.UniqueIndex === this.individualMatch.HomePlayerUniqueIndex[0]);
        return RankingService.isRankingHigher(awayPlayer.Ranking, homePlayer.Ranking);
    }

    isAwayPerf(): boolean {
        if (this.individualMatch.HomeSetCount > this.individualMatch.AwaySetCount) {
            return false;
        }
        const pos = this.individualMatch.Position;

        const awayPlayer = this.awayPlayer.find((player) => player.UniqueIndex === this.individualMatch.AwayPlayerUniqueIndex[0]);
        const homePlayer = this.homePlayer.find((player) => player.UniqueIndex === this.individualMatch.HomePlayerUniqueIndex[0]);
        return RankingService.isRankingHigher(homePlayer.Ranking, awayPlayer.Ranking, );
    }

}
