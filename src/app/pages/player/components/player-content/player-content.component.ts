import {Component, Input, OnInit} from '@angular/core';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {UserMemberEntries} from '../../../../core/store/user/user.state';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {WeeklyNumericRanking} from '../../../../core/api/models/weekly-numeric-ranking';
import {TABT_DATABASES} from '../../../../core/interceptors/tabt-database-interceptor.service';
import {WeeklyNumericRankingV3} from '../../../../core/api/models/weekly-numeric-ranking-v-3';

@Component({
    selector: 'beping-player-content',
    templateUrl: './player-content.component.html',
    styleUrls: ['./player-content.component.scss']
})
export class PlayerContentComponent implements OnInit {

    @Input() categoriesAvailable: PLAYER_CATEGORY[];
    @Input() currentCategory: PLAYER_CATEGORY;
    @Input() currentMemberEntry: MemberEntry;
    @Input() userMemberEntries: UserMemberEntries;
    @Input() latestMatches: TeamMatchesEntry[];
    @Input() numericRankings: WeeklyNumericRankingV3;
    @Input() displayELO: boolean;
    @Input() displayNumericRanking: boolean;
    @Input() database: TABT_DATABASES;


    constructor() {
    }

    ngOnInit() {
    }


    async categoryClicked(category: PLAYER_CATEGORY) {
        /*
        this.currentCategory$.next(category);
        const toast = await this.toastrCtrl.create({
            message: `Profil ${category} chargé`,
            duration: 3000
        });
        toast.present();
        */

    }

    getIcon(category: PLAYER_CATEGORY) {
        switch (category) {
            case PLAYER_CATEGORY.MEN:
            case PLAYER_CATEGORY.VETERANS:
            case PLAYER_CATEGORY.YOUTH:
                return 'male-outline';
            case PLAYER_CATEGORY.WOMEN:
            case PLAYER_CATEGORY.VETERANS_WOMEN:
                return 'female-outline';
        }
    }

}
