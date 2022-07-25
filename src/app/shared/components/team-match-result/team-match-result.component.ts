import {Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {TeamMatchesEntry} from '../../../core/api/models/team-matches-entry';
import {TabsNavigationService} from '../../../core/services/navigation/tabs-navigation.service';
import {ActionSheetController, IonRouterOutlet, Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {ClubsState} from '../../../core/store/clubs';
import {map, switchMap, take} from 'rxjs/operators';
import {ClubEntry} from '../../../core/api/models/club-entry';
import {TeamEntry} from '../../../core/api/models/team-entry';
import {Store} from '@ngxs/store';
import {ClubsService} from '../../../core/api/services/clubs.service';
import {StartNavigationService} from '../../../core/services/start-navigation.service';
import {CalendarService} from '../../../core/services/calendar/calendar.service';
import {RemoteSettingsState} from '../../../core/store/remote-settings';

@Component({
    selector: 'beping-team-match-result',
    templateUrl: './team-match-result.component.html',
    styleUrls: ['./team-match-result.component.scss'],
})
export class TeamMatchResultComponent implements OnInit {

    @Input() match: TeamMatchesEntry;
    @Input() displayScoreRedIfHomeTeamDefeat: boolean;
    @Output() matchClicked: EventEmitter<TeamMatchesEntry> = new EventEmitter<TeamMatchesEntry>();
    isTablet: boolean;
    @HostBinding('class') class = 'full-width';
    constructor(
        private readonly tabNavigation: TabsNavigationService,
        private readonly actionSheetController: ActionSheetController,
        private readonly translate: TranslateService,
        private readonly store: Store,
        private readonly calendarService: CalendarService,
        private readonly clubService: ClubsService,
        private readonly startNavigation: StartNavigationService,
        private readonly platform: Platform,
        private readonly ionRouter: IonRouterOutlet
    ) {
        this.isTablet = this.platform.is('tablet') || this.platform.is('desktop');
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

    ngOnInit() {
    }

    async navigateToDetails() {
        const bepingProEnabled = this.store.selectSnapshot(RemoteSettingsState.bepingProEnabled);
        if (this.match.MatchUniqueId) {
            this.tabNavigation.navigateTo(['team-match-details', this.match?.MatchUniqueId?.toString()]);
        } else {
            const buttons = [
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
                }
            ];
            if (bepingProEnabled) {
                buttons.splice(buttons.length, 0, {
                    text: this.translate.instant('CALENDAR.ADD_TO_CALENDAR'),
                    handler: () => {
                        this.calendarService.checkPremiumAndAddTeamMatchEntries([this.match], null, this.ionRouter.nativeEl);
                    }
                });
            }
            if (this.match.Date) {
                const button = {
                    text: this.translate.instant('MATCH_ENTRY_SHEET.HELP_MATCH_SHEET'),
                    handler: () => {
                        this.tabNavigation.navigateTo(['team-match-details', 'match-sheet-helper'], {state: {match: this.match}});
                    }
                };
                buttons.splice(buttons.length, 0, button);
            }
            const actionSheet = await this.actionSheetController.create({
                header: this.translate.instant('CALENDAR_CLUB.NO_INFO_AVAILABLE'),
                cssClass: 'my-custom-class',
                buttons
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

    chipColor(): string {
        if (this.displayScoreRedIfHomeTeamDefeat) {
            const [home, away] = this.match.Score.split('-');
            if (home > away) {
                return 'primary';
            } else if (home < away) {
                return 'danger';
            }
            return 'warning';
        }
        return 'primary';
    }
}
