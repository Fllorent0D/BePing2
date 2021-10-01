import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {TeamMatchesEntry} from '../../../core/api/models/team-matches-entry';
import {TabsNavigationService} from '../../../core/services/navigation/tabs-navigation.service';
import {ActionSheetController, Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {ClubsState} from '../../../core/store/clubs';
import {map, switchMap, take} from 'rxjs/operators';
import {ClubEntry} from '../../../core/api/models/club-entry';
import {TeamEntry} from '../../../core/api/models/team-entry';
import {Store} from '@ngxs/store';
import {ClubsService} from '../../../core/api/services/clubs.service';
import {StartNavigationService} from '../../../core/services/start-navigation.service';

@Component({
    selector: 'beping-team-match-result',
    templateUrl: './team-match-result.component.html',
    styleUrls: ['./team-match-result.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TeamMatchResultComponent implements OnInit {

    @Input() match: TeamMatchesEntry;
    @Output() matchClicked: EventEmitter<TeamMatchesEntry> = new EventEmitter<TeamMatchesEntry>();
    isTablet: boolean;

    constructor(
        private readonly tabNavigation: TabsNavigationService,
        private readonly actionSheetController: ActionSheetController,
        private readonly translate: TranslateService,
        private readonly store: Store,
        private readonly clubService: ClubsService,
        private readonly startNavigation: StartNavigationService,
        private readonly platform: Platform
    ) {
        this.isTablet = this.platform.is('tablet') || this.platform.is('desktop');
    }

    ngOnInit() {
    }

    get isHomeFF(): boolean {
        return this.match.IsHomeForfeited && !this.isAwayFG;
    }

    get isAwayFF(): boolean {
        return this.match.IsAwayForfeited && !this.isHomeFG;
    }

    get isHomeFG(): boolean {
        return this.match.IsHomeWithdrawn;
    }

    get isAwayFG(): boolean {
        return this.match.IsAwayWithdrawn;
    }

    get matchTime(): string {
        const splitted = this.match?.Time?.split(':');
        if (splitted?.length === 3) {
            return `${splitted[0]}:${splitted[1]}`;
        }
    }

    async navigateToDetails() {
        if (this.match.MatchUniqueId) {
            this.tabNavigation.navigateTo(['team-match-details', this.match.MatchUniqueId.toString()]);
        } else {
            const actionSheet = await this.actionSheetController.create({
                header: this.translate.instant('CALENDAR_CLUB.NO_INFO_AVAILABLE'),
                cssClass: 'my-custom-class',
                buttons: [
                    {
                        text: this.translate.instant('NAVIGATION.NAVIGATE_TO_MATCH'),
                        handler: () => {
                            this.startNavigation.navigateToVenue(this.match.VenueEntry);
                        }
                    },
                    {
                        text: this.translate.instant('MATCH_ENTRY_SHEET.STATS_ON_TEAM', {team: this.match.HomeTeam}),
                        handler: () => {
                            this.navigateToTeamPage(this.match.HomeClub, this.match.HomeTeam);
                        }
                    },
                    {
                        text: this.translate.instant('MATCH_ENTRY_SHEET.STATS_ON_TEAM', {team: this.match.AwayTeam}),
                        handler: () => {
                            this.navigateToTeamPage(this.match.AwayClub, this.match.AwayTeam);
                        }
                    },
                    {
                        text: this.translate.instant('COMMON.CANCEL'),
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }]
            });
            await actionSheet.present();

            const {role} = await actionSheet.onDidDismiss();
            console.log('onDidDismiss resolved with role', role);
        }
    }

    navigateToTeamPage(clubIndex: string, clubTeam: string) {
        this.store.select(ClubsState.getClubByUniqueIndex(clubIndex)).pipe(
            map((club: ClubEntry) => clubTeam.replace(club.Name, '').trim()),
            switchMap((teamName) =>
                this.clubService.findClubTeams({clubIndex}).pipe(
                    map((teams: TeamEntry[]) => teams.find((team) => team.Team === teamName))
                )
            ),
            take(1)
        ).subscribe((team) => {
            this.tabNavigation.navigateTo(['clubs', clubIndex, 'team', team.TeamId]);
        });
    }

}
