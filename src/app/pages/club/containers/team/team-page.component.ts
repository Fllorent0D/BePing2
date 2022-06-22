import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {RankingEntry} from '../../../../core/api/models/ranking-entry';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {DivisionsService} from '../../../../core/api/services/divisions.service';
import {ClubsService} from '../../../../core/api/services/clubs.service';
import {TeamEntry} from '../../../../core/api/models/team-entry';
import {map, shareReplay, switchMap, take} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ClubsState} from '../../../../core/store/clubs';
import {ClubEntry} from '../../../../core/api/models/club-entry';
import {MatchesService} from '../../../../core/api/services/matches.service';
import {Select, Store} from '@ngxs/store';
import {TeamPlayersStatsService} from '../../services/team-players-stats.service';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';
import {MemberResults} from '../../../../core/api/models/member-results';
import {FavoriteItem, FavoritesState, ToggleTeamsFromFavorites} from '../../../../core/store/favorites';
import {CalendarService} from '../../../../core/services/calendar/calendar.service';
import {DialogService} from '../../../../core/services/dialog-service.service';
import {TranslateService} from '@ngx-translate/core';
import {RemoteSettingsState} from '../../../../core/store/remote-settings';
import {IonRouterOutlet} from '@ionic/angular';
import Swiper, {SwiperOptions} from 'swiper';
import {SwiperComponent} from 'swiper/angular';


@Component({
    selector: 'beping-teams',
    templateUrl: './team-page.component.html',
    styleUrls: ['./team-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamPage implements OnInit {
    swiperConfig: SwiperOptions = {
        speed: 150,
        effect: 'cube',
    };
    activeSwiperIndex = 0;

    @ViewChild('swiper', {static: false}) swiper?: SwiperComponent;

    ranking$: Observable<RankingEntry[]>;
    players$: Observable<MemberEntry[]>;
    calendar$: Observable<TeamMatchesEntry[]>;
    memberRanking$: Observable<MemberResults[]>;

    teamId$: Observable<string>;
    team$: Observable<TeamEntry>;
    clubIndex$: Observable<string>;
    club$: Observable<ClubEntry>;

    isFavorite$: Observable<boolean>;
    @Select(RemoteSettingsState.bepingProEnabled) bepingProEnabled$: Observable<boolean>;

    constructor(
        private readonly divisionsService: DivisionsService,
        private readonly clubsService: ClubsService,
        private readonly matchsService: MatchesService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly store: Store,
        protected readonly changeDetectionRef: ChangeDetectorRef,
        private readonly tabsNavigation: TabsNavigationService,
        private readonly teamPlayerStatsService: TeamPlayersStatsService,
        private readonly calendarService: CalendarService,
        private readonly dialogService: DialogService,
        private readonly translate: TranslateService,
        private readonly ionRouterOutlet: IonRouterOutlet,
        protected readonly ngZone: NgZone
    ) {
    }

    slideChange([swiper]: [Swiper]) {
        this.ngZone.run(() => this.activeSwiperIndex = swiper.activeIndex);
    }

    selectTab(index) {
        this.swiper.swiperRef.slideTo(index);
    }

    ngOnInit() {
        this.clubIndex$ = this.activatedRoute.paramMap.pipe(
            map((params: ParamMap) => params.get('uniqueIndex') as string)
        );

        this.teamId$ = this.activatedRoute.paramMap.pipe(
            map((params: ParamMap) => params.get('teamId') as string)
        );

        this.club$ = this.clubIndex$.pipe(
            switchMap((clubIndex: string) => this.store.select(ClubsState.getClubByUniqueIndex(clubIndex))),
            shareReplay(1)
        );

        this.team$ = combineLatest([
            this.clubIndex$,
            this.teamId$
        ]).pipe(
            switchMap(([clubIndex, teamId]) =>
                this.clubsService.findClubTeams({clubIndex}).pipe(
                    map((teams: TeamEntry[]) => teams.find((team) => team.TeamId === teamId))
                )
            ),
            shareReplay(1)
        );

        this.isFavorite$ = this.team$.pipe(
            switchMap((team: TeamEntry) => this.store.select(FavoritesState.isTeamInFavorite(team.TeamId)))
        );

        this.calendar$ = combineLatest([
            this.clubIndex$,
            this.team$
        ]).pipe(
            switchMap(([clubIndex, team]) => this.matchsService.findAllMatches({
                club: clubIndex,
                team: team.Team,
                divisionId: team.DivisionId,
                showDivisionName: 'short',
                withDetails: true
            })),
            shareReplay(1)
        );

        this.memberRanking$ = combineLatest([
            this.team$,
            this.club$
        ]).pipe(
            switchMap(([team, club]: [TeamEntry, ClubEntry]) =>
                this.clubsService.findClubTeamsMemberRanking({clubIndex: club.UniqueIndex, teamId: team.TeamId})
            )
        );

        this.ranking$ = this.team$.pipe(
            switchMap((team: TeamEntry) => this.divisionsService.findDivisionRanking({divisionId: team.DivisionId})),
            shareReplay(1)
        );
    }

    navigateToPlayer(uniqueIndex: number) {
        this.team$.pipe(
            take(1)
        ).subscribe((team: TeamEntry) => {
            this.tabsNavigation.navigateTo(['player', uniqueIndex.toString(10)], {
                state: {preferredPlayerCategory: team.DivisionCategory}
            });
        });
    }

    isSameTeam(rankingEntry: RankingEntry, team: TeamEntry, club: ClubEntry, divisionId: number): boolean {
        return rankingEntry.TeamClub === club.UniqueIndex &&
            divisionId === team.DivisionId &&
            rankingEntry.Team === (club.LongName + ' ' + team.Team).trim();
    }

    teamSelected(rankingEntry: RankingEntry) {
        combineLatest([
            this.store.select(ClubsState.getClubByUniqueIndex(rankingEntry.TeamClub)),
            this.clubsService.findClubTeams({clubIndex: rankingEntry.TeamClub}),
            this.team$.pipe(map((team) => team.DivisionId))
        ]).pipe(
            take(1),
            map(([clubEntry, teams, divisionId]: [ClubEntry, TeamEntry[], number]) => ({
                    team: teams.find((team) => this.isSameTeam(rankingEntry, team, clubEntry, divisionId)),
                    club: clubEntry
                })
            )
        ).subscribe(({team, club}) => {
            this.tabsNavigation.navigateTo(['clubs', club.UniqueIndex, 'team', team.TeamId]);
        });

    }

    toggleFavorite() {
        combineLatest([this.club$, this.team$]).pipe(
            map(([club, team]) => (new ToggleTeamsFromFavorites({
                uniqueIndex: team.TeamId,
                uri: ['clubs', club.UniqueIndex, 'team', team.TeamId],
                note: team.DivisionCategory,
                label: club.Name + ' ' + team.Team
            } as FavoriteItem<string>))),
            switchMap((favItem) => this.store.dispatch(favItem))
        ).subscribe();
    }

    addToCalendar() {
        this.calendar$
            .pipe(take(1))
            .subscribe((matches) => this.calendarService.checkPremiumAndAddTeamMatchEntries(matches, {
                dialogHeaderTranslationKey: 'CALENDAR.ADD_TO_CALENDAR',
                dialogMessageTranslationKey: 'CALENDAR.ADD_ALL_TEAM_MATCHES'
            }, this.ionRouterOutlet.nativeEl));
    }
}
